class Animal {
  size: number
  sound (): void {
    throw new Error()
  }

  some (): void {

  }
}

export class Dog extends Animal {
  sound (): void {
    console.log('bark' + (this.size < 2 ? ' loud' : ''))
  }
}

export const registerListerner = (callback: () => void): void => {

}

const a: Animal = new Dog()

registerListerner(a.sound) // Error: this is undefined
