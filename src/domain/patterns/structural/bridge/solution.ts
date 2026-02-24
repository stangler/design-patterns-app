// Bridge パターン: 抽象と実装を分離

/**
 * Implementation: 実装のインターフェース
 */
export interface Device {
  isEnabled(): boolean;
  enable(): void;
  disable(): void;
  getVolume(): number;
  setVolume(percent: number): void;
  getName(): string;
}

/**
 * Concrete Implementations: 具体的なデバイス
 */
export class TV implements Device {
  private on: boolean = false;
  private volume: number = 30;

  public isEnabled(): boolean {
    return this.on;
  }

  public enable(): void {
    this.on = true;
  }

  public disable(): void {
    this.on = false;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(percent: number): void {
    this.volume = Math.max(0, Math.min(100, percent));
  }

  public getName(): string {
    return 'テレビ';
  }
}

export class Radio implements Device {
  private on: boolean = false;
  private volume: number = 50;

  public isEnabled(): boolean {
    return this.on;
  }

  public enable(): void {
    this.on = true;
  }

  public disable(): void {
    this.on = false;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(percent: number): void {
    this.volume = Math.max(0, Math.min(100, percent));
  }

  public getName(): string {
    return 'ラジオ';
  }
}

/**
 * Abstraction: 抽象クラス
 */
export class RemoteControl {
  protected device: Device;

  constructor(device: Device) {
    this.device = device;
  }

  public togglePower(): string {
    if (this.device.isEnabled()) {
      this.device.disable();
      return `${this.device.getName()}の電源を切りました`;
    } else {
      this.device.enable();
      return `${this.device.getName()}の電源を入れました`;
    }
  }

  public volumeUp(): string {
    const newVolume = this.device.getVolume() + 10;
    this.device.setVolume(newVolume);
    return `${this.device.getName()}の音量: ${this.device.getVolume()}%`;
  }

  public volumeDown(): string {
    const newVolume = this.device.getVolume() - 10;
    this.device.setVolume(newVolume);
    return `${this.device.getName()}の音量: ${this.device.getVolume()}%`;
  }
}

/**
 * Refined Abstraction: 機能を拡張
 */
export class AdvancedRemoteControl extends RemoteControl {
  public mute(): string {
    this.device.setVolume(0);
    return `${this.device.getName()}をミュートしました`;
  }

  public setVolume(percent: number): string {
    this.device.setVolume(percent);
    return `${this.device.getName()}の音量を ${percent}% に設定しました`;
  }
}

// 使用例
const tv = new TV();
const radio = new Radio();

// 基本リモコンでテレビを操作
const tvRemote = new RemoteControl(tv);
console.log(tvRemote.togglePower()); // テレビの電源を入れました
console.log(tvRemote.volumeUp());    // テレビの音量: 40%

// 高機能リモコンでラジオを操作
const radioRemote = new AdvancedRemoteControl(radio);
console.log(radioRemote.togglePower()); // ラジオの電源を入れました
console.log(radioRemote.mute());        // ラジオをミュートしました

// 抽象（リモコン）と実装（デバイス）が独立して拡張可能