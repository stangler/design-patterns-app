// Singleton solution example

export interface ISingleton {
  execute(): string;
}

export class ConcreteSingleton implements ISingleton {
  execute(): string {
    return 'Singleton executed';
  }
}
