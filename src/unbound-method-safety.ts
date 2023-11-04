interface MethodStyleIface {
  // Shorthand method signature is forbidden.
  method (): void
}

interface PropertyStyleIface {
  method: () => void
}

class MethodStyle implements MethodStyleIface {
  method (): void {
    console.log(this.method)
  }

}

const methodStyle = new MethodStyle()
const methodStyleMethod = methodStyle.method
methodStyleMethod()
