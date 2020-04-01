import Vue from 'vue';
import { StorageDriver } from '@/typings/clay.d';

export default class DefaultStorageDriver implements StorageDriver {
    protected _notation: string = '.';

    protected _store: { [key: string]: any } = {};

    public get(key: string, options?: any): any {
      return this.resolveFromStore(key);
    }

    public addData(data: { [key: string]: any }) {
      this._store = { ...this.store, ...data };
      return this;
    }

    public addScopeStore(namespace: string, slotName: string, data: any) {
      if (this.store[namespace] !== undefined) {
        this._store[namespace].$slot = this.generateSlotStore(slotName, data).$slot;
        return this;
      }

      this._store = {
        ...this.store,
        ...{ [namespace]: this.generateSlotStore(slotName, data) },
      };
      return this;
    }

    protected generateSlotStore(slotName: string, data: any): { $slot: { [slotName: string]: any } } {
      return { $slot: { [slotName]: data } };
    }

    protected resolveFromStore(rawPath: string) {
      const keys = rawPath.split(this._notation);
      return this.resolve(this.store, keys);
    }


    protected resolve(store: { [key: string]: any }, keys: string[]) {
      if (store[keys[0]] === undefined) {
        throw new Error(`Namespace ${keys[0]} does not exist`);
      }

      if (store[keys[0]][keys[1]] === undefined) {
        throw new Error(`Key ${keys[1]} does not exist in Clay Storage`);
      }

      // eslint-disable-next-line no-param-reassign
      keys[0] = store[keys[0]];

      return this.reduceObjectFromArray(keys);
    }

    protected reduceObjectFromArray(way: string[]): any {
      return way.reduce((store: any, currentKey: string) => {
        if (store[currentKey] === undefined) {
          throw new Error(`Key ${currentKey} does not exist in Clay Storage`);
        }
        return store[currentKey];
      });
    }

    get store() {
      return this._store;
    }

    set store(store) {
      this._store = store;
    }
}
