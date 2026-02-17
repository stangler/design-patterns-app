// Flyweight solution example

export interface IFlyweight {
  execute(): string;
}

export class ConcreteFlyweight implements IFlyweight {
  execute(): string {
    return 'Flyweight executed';
  }
}
