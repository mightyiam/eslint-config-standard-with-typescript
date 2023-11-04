interface MethodStyleIface {
  // Shorthand method signature is forbidden.
  method(): void
}

class MethodStyleMethodClass implements MethodStyleIface {
  method (): void {
    console.log(this.method)
  }
}

const methodStyleMethodInstance: MethodStyleIface = new MethodStyleMethodClass()
const methodStyleMethod = methodStyleMethodInstance.method
// Unchecked 'this'--runtime error.
methodStyleMethod()

interface PropertyStyleIface {
  method: () => void
}

class PropertyStyleMethodClass implements PropertyStyleIface {
  method (): void {
    console.log(this.method)
  }
}

const propertyStyleMethodInstance: PropertyStyleIface = new PropertyStyleMethodClass()
const propertyStyleMethod = propertyStyleMethodInstance.method
// Unchecked 'this' --runtime error.
propertyStyleMethod()
