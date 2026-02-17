// Builder solution example

export interface IBuilder {
  execute(): string;
}

export class ConcreteBuilder implements IBuilder {
  execute(): string {
    return 'Builder executed';
  }
}
