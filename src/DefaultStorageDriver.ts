import { StorageDriver } from '@/typings/clay.d';

export default class DefaultStorageDriver implements StorageDriver {
    protected _namespaceSeparator: string = '::';

    protected _notation: string = '.';

    protected _store: { [key: string]: any } = {};

    public get(key: string, options?: any): any {
      return this.resolveFromStore(key);
    }

    public addData(data: { [key: string]: any }) {
      this._store = { ...this.store, ...data };
      return this;
    }

    public addScopeStore(namespace:string, slotName:string, data: any) {
      this._store = {
        ...this.store,
        ...{ [this.generateSlotNamespace(namespace, slotName)]: data },
      };
      return this;
    }

    protected generateSlotNamespace(namespace:string, slotName:string):string {
      return `${namespace}/slot/${slotName}`;
    }

    protected resolveFromStore(rawPath:string) {
      const [slot, path] = rawPath.split(this._namespaceSeparator);
      const keys = path.split(this._notation);
      return this.resolveWithNamespace(this.store, slot, keys);
    }


    protected resolveWithNamespace(store: {[key:string]: any}, namespace:string, keys: string[]) {
      if (store[namespace] === undefined) {
        throw new Error(`Namespace ${namespace} does not exist`);
      }

      if (store[namespace][keys[0]] === undefined) {
        throw new Error(`Key ${keys[0]} does not exist in Clay Storage`);
      }

      // eslint-disable-next-line no-param-reassign
      keys[0] = store[namespace][keys[0]];

      return this.reduceObjectFromArray(keys);
    }

    protected reduceObjectFromArray(way: string[]):any {
      return way.reduce((store:any, currentKey:string) => {
        if (!store[currentKey]) {
          throw new Error(`Key ${currentKey} does not exist in Clay Storage`);
        }
        return store[currentKey];
      });
    }

    get store() {
      return this._store;
    }
}
