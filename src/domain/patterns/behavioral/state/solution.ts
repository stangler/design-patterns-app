// State solution example

export interface IState {
  execute(): string;
}

export class ConcreteState implements IState {
  execute(): string {
    return 'State executed';
  }
}
