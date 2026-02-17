// Iterator solution example

export interface IIterator {
  execute(): string;
}

export class ConcreteIterator implements IIterator {
  execute(): string {
    return 'Iterator executed';
  }
}
