// Interpreter solution example

export interface IInterpreter {
  execute(): string;
}

export class ConcreteInterpreter implements IInterpreter {
  execute(): string {
    return 'Interpreter executed';
  }
}
