import Vue from 'vue';
import { StorageDriver } from '@/typings/clay.d';

export default class DefaultStorageDriver implements StorageDriver {
    store: any;

    constructor(data: {[key:string] : any}) {
      this.store = { ...data };
    }

    get(key: string, options?: any): any {
      const keys = key.split('.');

      if (this.store[keys[0]] === undefined) {
        throw new Error(`Key ${keys[0]} does not exist in Clay Storage`);
      }

      keys[0] = this.store[keys[0]];

      return keys.reduce((store:any, currentKey:string) => {
        if (!store[currentKey]) {
          throw new Error(`Key ${currentKey} does not exist in Clay Storage`);
        }
        return store[currentKey];
      });
    }

    set(key: string, value: any, options?: any): void {
      Vue.set(this.store, key, value);
    }
}
