interface Logger {
  log: (s: string) => void 
}

type ProtoConstructor = new () => ProtoInstance

interface AInstance extends ProtoInstance { // Sealed 
  load: (s: string) => Promise<void>
}

type AConstructor = new () => AInstance

export class Proto implements ProtoInstance {
  async load (s: string): Promise<void> {
    console.log('proto load', s)
  }
}

export class Proto implements ProtoInstance {
  async load (s: string): Promise<void> {
    console.log('proto load', s)
  }
}


export function getConstructor (Base: ProtoConstructor): AConstructor {
  return class A extends Base {
    // will say "TS2425: Class 'ProtoInstance' defines instance member property 'load',
    // but extended class 'A' defines it as instance member function."
    async load (s: string): Promise<void> {
      console.log('a load', s)

      return await super.load(s)
    }
  }
}

/// ---------------------------


NodeStream = ProtoInstance






interface ProtoInstance {
  load: (s: string) => Promise<void>
}

abstract class AClass implements ProtoInstance {
  async load (s: string): Promise<void>  { 
    throw new Error('should be implemented in inherided class')
  }
}

abstract class AbstractProto implements ProtoInstance {
  async load (s: string): Promise<void>  { 
    throw new Error('should be implemented in inherided class')
  }

  async otherPrivateMethod() {}
}

export class Proto extends AbstractProto implements ProtoInstance {
  async load (s: string): Promise<void> {
    console.log('proto load', s)
  }
}

export function getConstructor (Base: typeof AbstractProto): typeof AClass {
  return class A extends Base {
    async load (s: string): Promise<void> {
      console.log('a load', s)
      this.otherPrivateMethod()
      return await super.load(s)
    }
  }
}

/**otherPrivateMethod is not callable here */
getConstructor()

```



<details><summary><b>Output</b></summary>

```ts
Image;
export class Proto {
    async load(s) {
        console.log('proto load', s);
    }
}
export class Proto {
    async load(s) {
        console.log('proto load', s);
    }
}
export function getConstructor(Base) {
    return class A extends Base {
        // will say "TS2425: Class 'ProtoInstance' defines instance member property 'load',
        // but extended class 'A' defines it as instance member function."
        async load(s) {
            console.log('a load', s);
            return await super.load(s);
        }
    };
}
/// ---------------------------
NodeStream = ProtoInstance;
class AClass {
    async load(s) {
        throw new Error('should be implemented in inherided class');
    }
}
class AbstractProto {
    async load(s) {
        throw new Error('should be implemented in inherided class');
    }
    async otherPrivateMethod() { }
}
export class Proto extends AbstractProto {
    async load(s) {
        console.log('proto load', s);
    }
}
export function getConstructor(Base) {
    return class A extends Base {
        async load(s) {
            console.log('a load', s);
            this.otherPrivateMethod();
            return await super.load(s);
        }
    };
}
/**otherPrivateMethod is not callable here */
getConstructor();

```


</details>


<details><summary><b>Compiler Options</b></summary>

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "strictBindCallApply": true,
    "noImplicitThis": true,
    "noImplicitReturns": true,
    "alwaysStrict": true,
    "esModuleInterop": true,
    "declaration": true,
    "target": "ES2017",
    "jsx": "react",
    "module": "ESNext",
    "moduleResolution": "node"
  }
}
