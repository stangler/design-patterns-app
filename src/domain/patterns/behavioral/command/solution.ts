// Command パターン: 操作をオブジェクトとしてカプセル化

/**
 * Command: 実行インターフェース
 */
export interface Command {
  execute(): string;
  undo(): string;
}

/**
 * Receiver: 実際の処理を行うオブジェクト
 */
export class Light {
  private isOn: boolean = false;

  public turnOn(): string {
    this.isOn = true;
    return '💡 ライトがつきました';
  }

  public turnOff(): string {
    this.isOn = false;
    return '💡 ライトが消えました';
  }

  public getStatus(): boolean {
    return this.isOn;
  }
}

export class AirConditioner {
  private temperature: number = 24;

  public setTemperature(temp: number): string {
    this.temperature = temp;
    return `❄️ エアコンを ${this.temperature}℃ に設定しました`;
  }

  public getTemperature(): number {
    return this.temperature;
  }
}

/**
 * Concrete Commands: 具体的なコマンド
 */
export class LightOnCommand implements Command {
  private previousState: boolean = false;

  constructor(private light: Light) {}

  public execute(): string {
    this.previousState = this.light.getStatus();
    return this.light.turnOn();
  }

  public undo(): string {
    if (!this.previousState) {
      return this.light.turnOff();
    }
    return this.light.turnOn();
  }
}

export class LightOffCommand implements Command {
  private previousState: boolean = false;

  constructor(private light: Light) {}

  public execute(): string {
    this.previousState = this.light.getStatus();
    return this.light.turnOff();
  }

  public undo(): string {
    if (this.previousState) {
      return this.light.turnOn();
    }
    return this.light.turnOff();
  }
}

export class SetTemperatureCommand implements Command {
  private previousTemperature: number;

  constructor(private ac: AirConditioner, private newTemperature: number) {
    this.previousTemperature = ac.getTemperature();
  }

  public execute(): string {
    this.previousTemperature = this.ac.getTemperature();
    return this.ac.setTemperature(this.newTemperature);
  }

  public undo(): string {
    return this.ac.setTemperature(this.previousTemperature);
  }
}

/**
 * Invoker: コマンドを実行・管理
 */
export class RemoteControl {
  private commands: Command[] = [];
  private undoStack: Command[] = [];

  public execute(command: Command): string {
    const result = command.execute();
    this.undoStack.push(command);
    return result;
  }

  public undo(): string {
    const command = this.undoStack.pop();
    if (command) {
      return command.undo();
    }
    return '取り消す操作がありません';
  }
}

/**
 * Macro Command: 複数のコマンドをまとめる
 */
export class MacroCommand implements Command {
  private commands: Command[];

  constructor(commands: Command[]) {
    this.commands = commands;
  }

  public execute(): string {
    const results = this.commands.map(cmd => cmd.execute());
    return results.join('\n');
  }

  public undo(): string {
    const results = [...this.commands].reverse().map(cmd => cmd.undo());
    return results.join('\n');
  }
}

// 使用例
console.log('=== スマートホームリモコン ===');
const remote = new RemoteControl();

const livingLight = new Light();
const bedroomAC = new AirConditioner();

const lightOn = new LightOnCommand(livingLight);
const lightOff = new LightOffCommand(livingLight);
const tempUp = new SetTemperatureCommand(bedroomAC, 26);
const tempDown = new SetTemperatureCommand(bedroomAC, 22);

console.log(remote.execute(lightOn));       // ライトON
console.log(remote.execute(tempUp));        // 温度26℃
console.log(remote.undo());                 // 温度戻す
console.log(remote.execute(lightOff));      // ライトOFF
console.log(remote.undo());                 // ライトONに戻す

console.log('\n=== マクロコマンド ===');
const goodMorningRoutine = new MacroCommand([
  lightOn,
  tempUp
]);

const goodNightRoutine = new MacroCommand([
  lightOff,
  tempDown
]);

console.log('おはようルーチン:');
console.log(remote.execute(goodMorningRoutine));

console.log('\nおやすみルーチン:');
console.log(remote.execute(goodNightRoutine));