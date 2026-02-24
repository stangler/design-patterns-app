// Builder パターン: 複雑なオブジェクトを段階的に構築

/**
 * Product: 生成される複雑なオブジェクト
 */
export interface Computer {
  cpu: string;
  ram: string;
  storage: string;
  gpu?: string;
  os?: string;
  monitor?: string;
}

/**
 * Builder: オブジェクト構築のインターフェース
 */
export interface ComputerBuilder {
  setCPU(cpu: string): this;
  setRAM(ram: string): this;
  setStorage(storage: string): this;
  setGPU(gpu: string): this;
  setOS(os: string): this;
  setMonitor(monitor: string): this;
  build(): Computer;
}

/**
 * Concrete Builder: 具体的な構築ロジック
 */
export class GamingPCBuilder implements ComputerBuilder {
  private computer: Computer;

  constructor() {
    this.computer = {} as Computer;
  }

  public setCPU(cpu: string): this {
    this.computer.cpu = cpu;
    return this;
  }

  public setRAM(ram: string): this {
    this.computer.ram = ram;
    return this;
  }

  public setStorage(storage: string): this {
    this.computer.storage = storage;
    return this;
  }

  public setGPU(gpu: string): this {
    this.computer.gpu = gpu;
    return this;
  }

  public setOS(os: string): this {
    this.computer.os = os;
    return this;
  }

  public setMonitor(monitor: string): this {
    this.computer.monitor = monitor;
    return this;
  }

  public build(): Computer {
    return this.computer;
  }
}

/**
 * Director: 構築手順を定義（オプション）
 */
export class ComputerDirector {
  constructor(private builder: ComputerBuilder) {}

  // ゲーミングPC構成
  public buildGamingPC(): Computer {
    return this.builder
      .setCPU('Intel Core i9-13900K')
      .setRAM('DDR5 64GB')
      .setStorage('NVMe SSD 2TB')
      .setGPU('NVIDIA RTX 4090')
      .setOS('Windows 11 Pro')
      .build();
  }

  // オフィスPC構成
  public buildOfficePC(): Computer {
    return this.builder
      .setCPU('Intel Core i5-13400')
      .setRAM('DDR4 16GB')
      .setStorage('SSD 512GB')
      .setOS('Windows 11 Home')
      .build();
  }
}

// 使用例
// 方法1: Builder を直接使用（カスタム構成）
const customPC = new GamingPCBuilder()
  .setCPU('AMD Ryzen 9 7950X')
  .setRAM('DDR5 32GB')
  .setStorage('NVMe SSD 1TB')
  .setGPU('AMD Radeon RX 7900 XTX')
  .build();

console.log('カスタムPC:', customPC);

// 方法2: Director を使用（定義済み構成）
const builder = new GamingPCBuilder();
const director = new ComputerDirector(builder);

const gamingPC = director.buildGamingPC();
const officePC = director.buildOfficePC();

console.log('ゲーミングPC:', gamingPC);
console.log('オフィスPC:', officePC);