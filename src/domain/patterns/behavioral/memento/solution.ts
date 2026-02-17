// Memento solution example

export interface IMemento {
  execute(): string;
}

export class ConcreteMemento implements IMemento {
  execute(): string {
    return 'Memento executed';
  }
}
