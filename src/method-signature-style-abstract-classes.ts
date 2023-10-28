interface StoreInterface {
  write: (data: string) => void
}

abstract class AbstractStore implements StoreInterface {
  write (_data: string): void {
    throw new Error('not implemented')
  }
}

class DbStore extends AbstractStore {
  write (_data: string): void {
    // write to db
  }
}

class FsStore implements AbstractStore {
  write (_data: string): void {
    // write to fs
  }
}

function extendStoreClass (BaseStore: new () => StoreInterface, debug: boolean): (new () => StoreInterface) {
  if (debug) {
    return class StoreLoggerMixin extends BaseStore {
      write (data: string): void {
        console.log('storing: ', data)
        super.write(data)
      }
    }
  }

  return BaseStore
}

let StoreClass: new () => DbStore
let store: StoreInterface

StoreClass = extendStoreClass(DbStore, false)
store = new StoreClass()
store.write('some data')

StoreClass = extendStoreClass(DbStore, true)
store = new StoreClass()
store.write('some data')

StoreClass = extendStoreClass(FsStore, false)
store = new StoreClass()
store.write('some data')

StoreClass = extendStoreClass(FsStore, true)
store = new StoreClass()
store.write('some data')
