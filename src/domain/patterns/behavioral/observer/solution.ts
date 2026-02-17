// Observer solution example

export interface IObserver {
  execute(): string;
}

export class ConcreteObserver implements IObserver {
  execute(): string {
    return 'Observer executed';
  }
}
