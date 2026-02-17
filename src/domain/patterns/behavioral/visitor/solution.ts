// Visitor solution example

export interface IVisitor {
  execute(): string;
}

export class ConcreteVisitor implements IVisitor {
  execute(): string {
    return 'Visitor executed';
  }
}
