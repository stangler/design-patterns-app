// Prototype solution example

export interface IPrototype {
  execute(): string;
}

export class ConcretePrototype implements IPrototype {
  execute(): string {
    return 'Prototype executed';
  }
}
