import DefaultStorageDriver from '@/DefaultStorageDriver';

export default class ClayContext {
    private storage: DefaultStorageDriver;

    constructor(storage: DefaultStorageDriver) {
      this.storage = storage;
    }

    public fn() {
      console.log('Fn');
    }

    public exc() {
      console.log('Exc');
    }
}
