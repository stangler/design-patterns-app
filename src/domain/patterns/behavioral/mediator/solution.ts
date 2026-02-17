// Mediator solution example

export interface IMediator {
  execute(): string;
}

export class ConcreteMediator implements IMediator {
  execute(): string {
    return 'Mediator executed';
  }
}
