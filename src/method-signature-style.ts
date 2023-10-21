interface StoreInterface { // Sealed
  write: (s: string) => void
}

class Store implements StoreInterface { // Sealed
  write (s: string): void {
    // write to store
  }
}

export class RequestLoggerMixin extends Store implements StoreInterface {
  write (s: string): void {
    console.log('REQUEST: ', s)
  }
}

export class ResponseLoggerMixin extends Store implements StoreInterface {
  write (s: string): void {
    console.error('RESPONSE: ', s)
  }
}

export function extendLoggerClass (BaseLogger: new () => StoreInterface): (new () => StoreInterface) {
  return class extendedLogger extends BaseLogger {
    // will say "TS2425: Class 'LoggerInterface' defines instance member property 'print',
    // but extended class 'extendedLogger' defines it as instance member function."
    write (s: string): void {
      console.log('LOG: ', s)

      super.write(s)
    }
  }
}

export const RequestLoggerClass: ((new () => StoreInterface)) = extendLoggerClass(RequestLoggerMixin)
export const ResponseLoggerClass: ((new () => StoreInterface)) = extendLoggerClass(ResponseLoggerMixin)

export const logger1: StoreInterface = new RequestLoggerClass()
export const logger2: StoreInterface = new ResponseLoggerClass()

// interface Logger {
//   log: (s: string) => void
// }

// type LoggerConstructor = new () => Logger

// interface RequestLoggerInstance extends Logger { // Sealed
//   log: (s: string) => Promise<void>
// }

// export class RequestLoggerClass implements RequestLoggerInstance {
//   async log (s: string): Promise<void> {
//     console.log('REQUEST:', s)
//   }
// }

// export class ResponseLogger implements RequestLoggerInstance {
//   async log (s: string): Promise<void> {
//     console.log('proto log', s)
//   }
// }

// export function getConstructor (Base: ProtoConstructor): AConstructor {
//   return class A extends Base {
//     // will say "TS2425: Class 'ProtoInstance' defines instance member property 'log',
//     // but extended class 'A' defines it as instance member function."
//     async log (s: string): Promise<void> {
//       console.log('a log', s)

//       return await super.log(s)
//     }
//   }
// }

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
