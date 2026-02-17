// Command solution example

export interface ICommand {
  execute(): string;
}

export class ConcreteCommand implements ICommand {
  execute(): string {
    return 'Command executed';
  }
}
