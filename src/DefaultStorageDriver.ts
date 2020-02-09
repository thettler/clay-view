import Vue from 'vue';
import { StorageDriver } from '@/typings/clay.d';

export default class rageDriver implements StorageDriver {
    protected _scopedSlotSeparator: string = '#';

    protected _notation: string = '.';

    protected _dataStore: { [key: string]: any } = {};

    protected _scopeStore: { [key: string]: any } = {};

    public get(key: string, options?: any): any {
      if (this.isScopedSlotPath(key)) {
        return this.resolveFromScopedSlotStore(key);
      }

      return this.resolveFromDataStore(key);
    }

    public set(key: string, value: any, options?: any): void {
      Vue.set(this._dataStore, key, value);
    }

    public setDataStore(data: { [key: string]: any }) {
      this._dataStore = data;
      return this;
    }

    public addDataStore(data: { [key: string]: any }) {
      this._dataStore = { ...this.dataStore, ...data };
      return this;
    }

    public setScopeStore(data: any) {
      this._scopeStore = data;
      return this;
    }

    public addScopeStore(data: any) {
      this._scopeStore = { ...this.scopeStore, ...data };
      return this;
    }

    protected resolveFromScopedSlotStore(rawPath:string) {
      const [slot, path] = rawPath.split(this._scopedSlotSeparator);

      const keys = path.split(this._notation);

      if (this.scopeStore[slot] === undefined) {
        throw new Error(`ScopedSlot ${slot} does not exist`);
      }

      if (this.scopeStore[slot][keys[0]] === undefined) {
        throw new Error(`Key ${keys[0]} does not exist in Clay Storage`);
      }

      keys[0] = this.scopeStore[slot][keys[0]];

      return this.reduceObjectFromArray(keys);
    }

    protected resolveFromDataStore(rawPath: string) {
      const keys = rawPath.split(this._notation);

      if (this.dataStore[keys[0]] === undefined) {
        throw new Error(`Key ${keys[0]} does not exist in Clay Storage`);
      }

      keys[0] = this.dataStore[keys[0]];
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

    protected isScopedSlotPath(path: string): boolean {
      return path.includes(this._scopedSlotSeparator);
    }

    get dataStore() {
      return this._dataStore;
    }

    get scopeStore() {
      return this._scopeStore;
    }
}
