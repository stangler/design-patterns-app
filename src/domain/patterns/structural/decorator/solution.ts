// Decorator solution example

export interface IDecorator {
  execute(): string;
}

export class ConcreteDecorator implements IDecorator {
  execute(): string {
    return 'Decorator executed';
  }
}
