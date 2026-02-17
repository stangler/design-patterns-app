// FactoryMethod solution example

export interface IFactoryMethod {
  execute(): string;
}

export class ConcreteFactoryMethod implements IFactoryMethod {
  execute(): string {
    return 'FactoryMethod executed';
  }
}
