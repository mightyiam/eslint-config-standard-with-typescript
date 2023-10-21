interface StoreInterface {
  write: (data: string) => void
}

class DbStore implements StoreInterface {
  write (_data: string): void {
    // write to db
  }
}

class FsStore implements StoreInterface {
  write (_data: string): void {
    // write to fs
  }
}

export function extendStoreClass (BaseStore: new () => StoreInterface, debug: boolean): (new () => StoreInterface) {
  if (debug) {
    return class StoreLoggerMixin extends BaseStore {
      write(data: string): void {
        console.log('storing: ', data)
        super.write('')
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

// /// ---------------------------

// NodeStream = ProtoInstance

// interface ProtoInstance {
//   log: (s: string) => Promise<void>
// }

// abstract class AClass implements ProtoInstance {
//   async log (s: string): Promise<void> {
//     throw new Error('should be implemented in inherided class')
//   }
// }

// abstract class AbstractProto implements ProtoInstance {
//   async log (s: string): Promise<void> {
//     throw new Error('should be implemented in inherided class')
//   }

//   async otherPrivateMethod () { }
// }

// export class Proto extends AbstractProto implements ProtoInstance {
//   async log (s: string): Promise<void> {
//     console.log('proto log', s)
//   }
// }

// export function getConstructor (Base: typeof AbstractProto): typeof AClass {
//   return class A extends Base {
//     async log (s: string): Promise<void> {
//       console.log('a log', s)
//       this.otherPrivateMethod()
//       await super.log(s)
//     }
//   }
// }

// /** otherPrivateMethod is not callable here */
// getConstructor()
