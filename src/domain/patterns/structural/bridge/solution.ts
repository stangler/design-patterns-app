// Bridge solution example

export interface IBridge {
  execute(): string;
}

export class ConcreteBridge implements IBridge {
  execute(): string {
    return 'Bridge executed';
  }
}
