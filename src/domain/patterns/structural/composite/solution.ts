// Composite solution example

export interface IComposite {
  execute(): string;
}

export class ConcreteComposite implements IComposite {
  execute(): string {
    return 'Composite executed';
  }
}
