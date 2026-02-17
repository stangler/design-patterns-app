// AbstractFactory solution example

export interface IAbstractFactory {
  execute(): string;
}

export class ConcreteAbstractFactory implements IAbstractFactory {
  execute(): string {
    return 'AbstractFactory executed';
  }
}
