interface LoggerInterface {
  print: (s: string) => Promise<void>
}

// interface AnotherLoggerInterface extends LoggerInterface {
//   print: (s: string) => Promise<void>
// }

export class Proto implements LoggerInterface {
  async print (s: string): Promise<void> {
    console.log('proto print', s)
  }
}

export function getConstructor (Base: new () => LoggerInterface): (new () => LoggerInterface) {
  return class A extends Base {
    // will say "TS2425: Class 'LoggerInterface' defines instance member property 'print',
    // but extended class 'A' defines it as instance member function."
    async print (s: string): Promise<void> {
      console.log('a print', s)

      await super.print(s)
    }
  }
}

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
