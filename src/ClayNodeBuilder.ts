import {
  CreateElement, VNode, VNodeChildren, VNodeData,
} from 'vue';
import {
  ClayEvent, ClayNode, ClayScopedSlot, StorageDriver,
} from '@/typings/clay.d';
import DefaultStorageDriver from '@/DefaultStorageDriver';
import ScopedSlotStorageDriver from '@/ScopedSlotStorageDriver';

export default class ClayNodeBuilder {
    protected storages: { [key: string]: StorageDriver } = {};

    protected slotStorages?: ScopedSlotStorageDriver;

    h: CreateElement;

    constructor(h: CreateElement, slotStorage?: ScopedSlotStorageDriver) {
      this.h = h;
      this.slotStorages = slotStorage;
    }

    public parse(cNode: ClayNode): VNode {
      return this.parseClayNode(cNode);
    }

    protected validateCNode(cNode: ClayNode): void {
    }

    protected mapObject(obj: { [key: string]: any }, callback: (value: any, key: string) => any) {
      const newObj: { [key: string]: any } = {};

      Object.keys(obj).forEach((key: string) => {
        newObj[key] = callback(obj[key], key);
      });

      return newObj;
    }

    protected mapObjectWithKey(obj: { [key: string]: any }, callback: (value: any, key: string) => any) {
      let newObj: { [key: string]: any } = {};

      Object.keys(obj).forEach((key: string) => {
        newObj = { ...newObj, ...callback(obj[key], key) };
      });

      return newObj;
    }

    protected resolveBindableObject(obj: { [key: string]: any }, cNode: ClayNode) {
      return this.mapObjectWithKey(obj, (value: any, key: string): { [key: string]: any } => {
        if (key[0] !== ':') {
          return { [key]: value };
        }

        return { [key.substr(1)]: this.resolveBinding(value, cNode) };
      });
    }


    parseClayNode(cNode: ClayNode): VNode {
      this.validateCNode(cNode);

      return this.h(
        cNode.component,
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
        return (clayNode.children.map((child: ClayNode) => this.parseClayNode(child))) as VNodeChildren;
      }

      return [this.parseClayNode(clayNode.children)]as VNodeChildren;
    }

    parseScopedSlots(clayNode: ClayNode) {
      if (!clayNode.scopedSlots) {
        return {};
      }

      return this.mapObject(
        clayNode.scopedSlots,
        (scopedSlot: ClayScopedSlot) => (props: any) => {
          if (!this.slotStorages) {
            const slotStorage = new ScopedSlotStorageDriver({ [scopedSlot.key]: props });
            const builder = new ClayNodeBuilder(this.h, slotStorage);
            return builder.parse(scopedSlot.content);
          }

          const slotStorage = new ScopedSlotStorageDriver(
            {
              ...(this.slotStorages.store || {}),
              [scopedSlot.key]: {
                ...props,
              },
            },
          );

          const builder = new ClayNodeBuilder(this.h, slotStorage);
          return builder.parse(scopedSlot.content);
        },
      );
    }

    clayNodeToVNodeData(clayNode: ClayNode): VNodeData {
      const vNodeData: VNodeData = {};
      if (clayNode.data) {
        this.registerData(clayNode);
      }

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
      this.setCNodeStorage(CNode.clayKey, CNode.data);
    }

    getCNodeStorage(clayKey: string): StorageDriver {
      return this.storages[clayKey];
    }

    setCNodeStorage(clayKey: string, data: { [key: string]: any } = {}): StorageDriver {
      this.storages[clayKey] = new DefaultStorageDriver(data);
      return this.storages[clayKey];
    }

    resolveBinding(path: string, CNode:ClayNode): any {
      if (!path.includes('#', 1)) {
        return this.getCNodeStorage(CNode.clayKey).get(path);
      }

      if (!this.slotStorages) {
        throw new Error('No Scoped Slot Context');
      }

      return this.slotStorages.get(path);
    }
}
