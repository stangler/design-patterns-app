// Adapter solution example

export interface IAdapter {
  execute(): string;
}

export class ConcreteAdapter implements IAdapter {
  execute(): string {
    return 'Adapter executed';
  }
}
