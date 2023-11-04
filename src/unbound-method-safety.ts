interface MethodStyleIface {
  // Shorthand method signature is forbidden.
  method(): void
}

interface PropertyStyleIface {
  method: () => void
}

class MethodStyleMethodClass implements MethodStyleIface {
  method (): void {
    console.log(this.method)
  }
}

const methodStyleMethodInstance: MethodStyleIface = new MethodStyleMethodClass()
const methodStyleMethod = methodStyleMethodInstance.method
methodStyleMethod()

class MethodStylePropertyClass implements MethodStyleIface {
  method = (): void => {
    console.log(this.method)
  }
}

class PropertyStyleMethodClass implements PropertyStyleIface {
  method (): void {
    console.log(this.method)
  }
}

class PropertyStylePropertyClass implements PropertyStyleIface {
  method = (): void => {
    console.log(this.method)
  }
}
