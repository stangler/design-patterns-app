// Strategy solution example

export interface IStrategy {
  execute(): string;
}

export class ConcreteStrategy implements IStrategy {
  execute(): string {
    return 'Strategy executed';
  }
}
