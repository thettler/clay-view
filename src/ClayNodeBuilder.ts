import {
  Component, CreateElement, VNode, VNodeChildren, VNodeData,
} from 'vue';
import {
  ClayEvent, ClayNode, StorageDriver,
} from '@/typings/clay.d';
import DefaultStorageDriver from '@/DefaultStorageDriver';
import { mapObject, mapObjectWithKey } from '@/support';

export default class ClayNodeBuilder {
    protected storage: DefaultStorageDriver;

    protected h: CreateElement;

    protected components: { [key: string]: Component };

    constructor(h: CreateElement, components: { [key: string]: Component }, storage: DefaultStorageDriver) {
      this.h = h;
      this.storage = storage;
      this.components = components;
    }

    public parse(cNode: ClayNode): VNode|undefined {
      return this.parseClayNode(cNode);
    }

    protected validateCNode(cNode: ClayNode): void {
    }

    protected resolveBindableObject(obj: { [key: string]: any }, cNode: ClayNode) {
      return mapObjectWithKey(obj, (value: any, key: string): { [key: string]: any } => {
        if (key[0] !== ':') {
          return { [key]: value };
        }

        return { [key.substr(1)]: this.resolveBinding(value, cNode) };
      });
    }


    parseClayNode(cNode: ClayNode): VNode|undefined {
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

      if (Array.isArray(clayNode.children)) {
        return (clayNode.children.map((child: ClayNode) => {
          const builder = new ClayNodeBuilder(this.h, this.components, this.storage);
          return builder.parse(child);
        }) as VNodeChildren);
      }

      const builder = new ClayNodeBuilder(this.h, this.components, this.storage);
      return [builder.parse(clayNode.children)] as VNodeChildren;
    }

    parseScopedSlots(clayNode: ClayNode) {
      if (!clayNode.scopedSlots) {
        return {};
      }

      return mapObject(
        clayNode.scopedSlots,
        (scopedSlot: ClayNode, slotName: string) => (props: any) => {
          this.storage.addScopeStore(clayNode.namespace, slotName, props);

          const builder = new ClayNodeBuilder(this.h, this.components, this.storage);
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

      return this.resolveBinding(CNode[':text'], CNode);
    }

    CNodeBoundClassesToVNode(CNode: ClayNode): { [key: string]: boolean } {
      if (!CNode[':class']) {
        return {};
      }

      const boundValue: any = this.resolveBinding(CNode[':class'], CNode);

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

    resolveBinding(path: string, c:any): any {
      return this.storage.get(path);
    }

    resolveComponent(component: string|Component):string|Component {
      if (typeof component === 'string') {
        return this.components[component] || component;
      }
      return component;
    }

    resolveCondition(condition: string|boolean, CNode: ClayNode):boolean {
      if (typeof condition === 'boolean') {
        return condition;
      }

      return this.resolveBinding(condition, CNode);
    }
}
