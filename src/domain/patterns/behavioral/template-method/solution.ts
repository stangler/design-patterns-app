// TemplateMethod solution example

export interface ITemplateMethod {
  execute(): string;
}

export class ConcreteTemplateMethod implements ITemplateMethod {
  execute(): string {
    return 'TemplateMethod executed';
  }
}
