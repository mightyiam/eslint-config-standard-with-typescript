class Animal {
  sound (): void {
    throw new Error()
  }

  static population (n: number): Animal[] {
    return Array(n).fill(null).map(() => new Animal())
  }
}

export const { population } = Animal

export class Dog extends Animal {
  size: number = 0
  sound (): void {
    console.log('bark' + (this.size < 2 ? ' loud' : ''))
  }
}

export const registerListerner = (callback: () => void): void => {

}

const a: Animal = new Dog()

registerListerner(a.sound) // Error: this is undefined
