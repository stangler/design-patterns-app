// Proxy solution example

export interface IProxy {
  execute(): string;
}

export class ConcreteProxy implements IProxy {
  execute(): string {
    return 'Proxy executed';
  }
}
