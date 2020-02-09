import Vue from 'vue';
import { StorageDriver } from '@/typings/clay.d';

export default class DefaultStorageDriver implements StorageDriver {
    private _store: any;

    get store(): any {
      return this._store;
    }


    constructor(data: {[key:string] : any}) {
      this._store = Vue.observable(data);
    }

    get(key: string, options?: any): any {
      const path = key.split('#');
      const keys = path[1].split('.');
      if (this._store[path[0]] === undefined) {
        throw new Error(`ScopedSlot ${path[0]} does not exist`);
      }

      if (this._store[path[0]][keys[0]] === undefined) {
        throw new Error(`Key ${keys[0]} does not exist in Clay Storage`);
      }

      keys[0] = this._store[path[0]][keys[0]];

      return keys.reduce((store:any, currentKey:string) => {
        if (!store[currentKey]) {
          throw new Error(`Key ${currentKey} does not exist in Clay Storage`);
        }
        return store[currentKey];
      });
    }

    set(key: string, value: any, options?: any) {
      Vue.set(this._store, key, value);
    }
}
