class Animal {
  size: number
  sound(): void {
    throw new Error()
  }
  doSound()
}

class Dog extends Animal {
  sound(): void {
    console.log('bark' + (this.size < 2 ? ' loud' : ''))
  }
  
}
