// Facade solution example

export interface IFacade {
  execute(): string;
}

export class ConcreteFacade implements IFacade {
  execute(): string {
    return 'Facade executed';
  }
}
