// ChainOfResponsibility solution example

export interface IChainOfResponsibility {
  execute(): string;
}

export class ConcreteChainOfResponsibility implements IChainOfResponsibility {
  execute(): string {
    return 'ChainOfResponsibility executed';
  }
}
