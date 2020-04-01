import {
  Component, CreateElement, VNode, VNodeChildren, VNodeData,
} from 'vue';
import { ClayConfig, ClayEvent, ClayNode } from '@/typings/clay.d';
import DefaultStorageDriver from '@/DefaultStorageDriver';
import { cloneDeep, mapObject, mapObjectWithKey } from '@/support';

export default class ClayNodeBuilder {
    protected storage: DefaultStorageDriver;

    protected h: CreateElement;

    protected components: { [key: string]: Component };

    private config: ClayConfig;

    constructor(h: CreateElement, components: { [key: string]: Component }, storage: DefaultStorageDriver, config: ClayConfig) {
      this.h = h;
      this.storage = storage;
      this.components = components;
      this.config = config;
    }

    public parse(cNode: ClayNode): VNode | undefined {
      return this.parseClayNode(cNode);
    }

    protected validateCNode(cNode: ClayNode): void {
    }

    protected resolveBindableObject(obj: { [key: string]: any }, cNode: ClayNode) {
      return mapObjectWithKey(obj, (value: any, key: string): { [key: string]: any } => {
        if (key[0] !== ':') {
          return { [key]: value };
        }

        return { [key.substr(1)]: this.resolveBinding(value) };
      });
    }


    parseClayNode(cNode: ClayNode): VNode | undefined {
      this.validateCNode(cNode);

      if (cNode.if !== undefined && !this.resolveCondition(cNode.if, cNode)) {
        return undefined;
      }

      if (cNode.data) {
        this.registerData(cNode);
      }

      if (cNode[':if'] && !this.resolveCondition(cNode[':if'], cNode)) {
        return undefined;
      }

      return this.h(
        this.resolveComponent(cNode.component),
        this.clayNodeToVNodeData(cNode),
        this.parseChildClayNodes(cNode),
      );
    }

    parseChildClayNodes(clayNode: ClayNode): string | VNodeChildren | undefined {
      if (clayNode.scopedSlots) {
        return undefined;
      }

      if (clayNode[':text']) {
        return this.CNodeBoundTextToVNode(clayNode);
      }

      if (clayNode.text) {
        return clayNode.text;
      }

      if (!clayNode.children) {
        return undefined;
      }
      const store = { ...this.storage.store };
      if (Array.isArray(clayNode.children)) {
        return (clayNode.children.map((child: ClayNode) => {
          if (child.for !== undefined || child[':for'] !== undefined) {
            return this.loopCNode(child);
          }
          this.storage.store = { ...store };
          return this.makeNewBuilder(this.storage).parse(child);
        }) as VNodeChildren);
      }

      if (clayNode.children.for !== undefined || clayNode.children[':for'] !== undefined) {
        return this.loopCNode(clayNode.children);
      }

      return [this.makeNewBuilder().parse(clayNode.children)] as VNodeChildren;
    }

    makeNewBuilder(storage ?: DefaultStorageDriver): ClayNodeBuilder {
      return new ClayNodeBuilder(this.h, this.components, storage || this.storage, this.config);
    }

    loopCNode(cNode: ClayNode): VNodeChildren {
      if (cNode.for === undefined && cNode[':for'] === undefined) {
        return [];
      }

      let iterable: Object | any[] = [];

      if (cNode.for) {
        iterable = cNode.for;
      }

      if (cNode[':for']) {
        iterable = this.resolveBinding(cNode[':for']);
      }

      if (Array.isArray(iterable)) {
        return cloneDeep(iterable).map((value: any, index: number) => {
          this.storage.addData({
            [cNode.namespace]: {
              $for: {
                index,
                value,
                key: undefined,
              },
            },
          });
          return this.makeNewBuilder().parse(cNode);
        }) as VNodeChildren;
      }

      return Object.keys(iterable).map((key: string, index: number) => {
        this.storage.addData({
          [cNode.namespace]: {
            $for: {
              index,
              // @ts-ignore
              value: iterable[key],
              key,
            },
          },
        });
        return this.makeNewBuilder().parse(cNode);
      }) as VNodeChildren;
    }

    parseScopedSlots(clayNode: ClayNode) {
      if (!clayNode.scopedSlots) {
        return {};
      }

      return mapObject(
        clayNode.scopedSlots,
        (scopedSlot: ClayNode, slotName: string) => (props: any) => {
          this.storage.addScopeStore(clayNode.namespace, slotName, props);

          const builder = new ClayNodeBuilder(this.h, this.components, this.storage, this.config);
          return builder.parse(scopedSlot);
        },
      );
    }

    clayNodeToVNodeData(clayNode: ClayNode): VNodeData {
      const vNodeData: VNodeData = {};
      if (clayNode.class) {
        vNodeData.class = this.CNodeUnboundClassesToVNode(clayNode);
      }

      if (clayNode[':class']) {
        vNodeData.class = {
          ...vNodeData.class,
          ...this.CNodeBoundClassesToVNode(clayNode),
        };
      }

      if (clayNode.style) {
        vNodeData.style = this.CNodeStyleToVNode(clayNode);
      }

      if (clayNode.show !== undefined && !this.resolveCondition(clayNode.show, clayNode)) {
        vNodeData.style = { ...vNodeData.style as Object, display: 'none' };
      }

      if (clayNode[':show'] && !this.resolveCondition(clayNode[':show'], clayNode)) {
        vNodeData.style = { ...vNodeData.style as Object, display: 'none' };
      }

      if (clayNode.attrs) {
        vNodeData.attrs = this.CNodeAttrsToVNode(clayNode);
      }

      if (clayNode.props) {
        vNodeData.props = this.CNodePropsToVNode(clayNode);
      }

      if (clayNode.domProps) {
        vNodeData.domProps = this.CNodeDomPropsToVNode(clayNode);
      }

      if (clayNode.ref) {
        vNodeData.ref = clayNode.ref;
      }

      if (clayNode.refInFor) {
        vNodeData.refInFor = clayNode.refInFor;
      }

      if (clayNode.slot) {
        vNodeData.slot = clayNode.slot;
      }

      if (clayNode.key) {
        vNodeData.key = clayNode.key;
      }

      if (clayNode[':key']) {
        vNodeData.key = this.resolveBinding(clayNode[':key']);
      }

      if (clayNode.on) {
        vNodeData.on = this.makeEventListeners(clayNode, clayNode.on);
      }

      if (clayNode.nativeOn) {
        vNodeData.nativeOn = this.makeEventListeners(clayNode, clayNode.nativeOn);
      }

      if (clayNode.scopedSlots) {
        vNodeData.scopedSlots = this.parseScopedSlots(clayNode);
      }

      return vNodeData;
    }

    CNodeStyleToVNode(cNode: ClayNode): object {
      if (!cNode.style) {
        return {};
      }
      return this.resolveBindableObject(cNode.style, cNode);
    }

    CNodePropsToVNode(cNode: ClayNode): object {
      if (!cNode.props) {
        return {};
      }
      return this.resolveBindableObject(cNode.props, cNode);
    }

    CNodeDomPropsToVNode(cNode: ClayNode): object {
      if (!cNode.domProps) {
        return {};
      }
      return this.resolveBindableObject(cNode.domProps, cNode);
    }

    CNodeAttrsToVNode(clayNode: ClayNode): object {
      if (!clayNode.attrs) {
        return {};
      }
      return this.resolveBindableObject(clayNode.attrs, clayNode);
    }

    CNodeBoundTextToVNode(CNode: ClayNode): any {
      if (!CNode[':text']) {
        return '';
      }

      return this.resolveBinding(CNode[':text']);
    }

    CNodeBoundClassesToVNode(CNode: ClayNode): { [key: string]: boolean } {
      if (!CNode[':class']) {
        return {};
      }

      const boundValue: any = this.resolveBinding(CNode[':class']);

      if (Array.isArray(boundValue)) {
        const classes: { [key: string]: boolean } = {};
        // eslint-disable-next-line no-return-assign
        boundValue.forEach((key: string) => classes[key] = true);
        return classes;
      }

      if (typeof boundValue === 'object' && boundValue !== null) {
        return boundValue;
      }

      if (typeof boundValue === 'string') {
        return { [boundValue]: true };
      }

      return {};
    }

    CNodeUnboundClassesToVNode(CNode: ClayNode): { [key: string]: boolean } {
      const { class: class1 } = CNode;

      if (Array.isArray(class1)) {
        const classes: { [key: string]: boolean } = {};
        // eslint-disable-next-line no-return-assign
        class1.forEach((key: string) => classes[key] = true);
        return classes;
      }

      if (typeof class1 === 'object' && class1 !== null) {
        return class1;
      }

      if (typeof class1 === 'string') {
        return { [class1]: true };
      }

      return {};
    }

    makeEventListeners(CNode: ClayNode, listeners: { [key: string]: ClayEvent; }): any {
      return this.resolveBindableObject(listeners, CNode);
    }

    registerData(CNode: ClayNode) {
      this.storage.addData({ [CNode.namespace]: CNode.data });
    }

    resolveBinding(path: string): any {
      const trimmedPath = path.trim();
      if (trimmedPath.startsWith('|>')) {
        return this.executeJs(path);
      }

      return this.storage.get(path);
    }

    executeJs(jsString: string) {
      if (!this.config.enableJsExecution) {
        return jsString;
      }

      const cleanedJsString = jsString.replace('|>', '').trim();
      // eslint-disable-next-line no-new-func
      const $func = new Function('context', `var result; with(context){result = ${cleanedJsString}}; return result; `);
      return $func(this.storage.store);
    }

    resolveComponent(component: string | Component): string | Component {
      if (typeof component === 'string') {
        return this.components[component] || component;
      }
      return component;
    }

    resolveCondition(condition: string | boolean, CNode: ClayNode): boolean {
      if (typeof condition === 'boolean') {
        return condition;
      }

      return this.resolveBinding(condition);
    }
}
