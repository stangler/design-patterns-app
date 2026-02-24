// Abstract Factory パターン: 関連する製品ファミリーを生成

/**
 * Abstract Products: UIコンポーネントのインターフェース
 */
export interface Button {
  render(): string;
  onClick(): string;
}

export interface Checkbox {
  render(): string;
  toggle(): string;
}

export interface Input {
  render(): string;
  getValue(): string;
}

/**
 * Concrete Products: Windows用コンポーネント
 */
export class WindowsButton implements Button {
  render(): string {
    return '[Windows Button]';
  }
  onClick(): string {
    return 'Windows ボタンがクリックされました';
  }
}

export class WindowsCheckbox implements Checkbox {
  render(): string {
    return '[Windows Checkbox]';
  }
  toggle(): string {
    return 'Windows チェックボックスが切り替えられました';
  }
}

export class WindowsInput implements Input {
  render(): string {
    return '[Windows Input]';
  }
  getValue(): string {
    return 'Windows入力値';
  }
}

/**
 * Concrete Products: macOS用コンポーネント
 */
export class MacOSButton implements Button {
  render(): string {
    return '[macOS Button]';
  }
  onClick(): string {
    return 'macOS ボタンがクリックされました';
  }
}

export class MacOSCheckbox implements Checkbox {
  render(): string {
    return '[macOS Checkbox]';
  }
  toggle(): string {
    return 'macOS チェックボックスが切り替えられました';
  }
}

export class MacOSInput implements Input {
  render(): string {
    return '[macOS Input]';
  }
  getValue(): string {
    return 'macOS入力値';
  }
}

/**
 * Abstract Factory: 製品ファミリー生成のインターフェース
 */
export interface GUIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
  createInput(): Input;
}

/**
 * Concrete Factories: 各OS用のファクトリー
 */
export class WindowsFactory implements GUIFactory {
  public createButton(): Button {
    return new WindowsButton();
  }
  public createCheckbox(): Checkbox {
    return new WindowsCheckbox();
  }
  public createInput(): Input {
    return new WindowsInput();
  }
}

export class MacOSFactory implements GUIFactory {
  public createButton(): Button {
    return new MacOSButton();
  }
  public createCheckbox(): Checkbox {
    return new MacOSCheckbox();
  }
  public createInput(): Input {
    return new MacOSInput();
  }
}

/**
 * Client: ファクトリーを使用してUIを構築
 */
export class Application {
  private button: Button;
  private checkbox: Checkbox;
  private input: Input;

  constructor(factory: GUIFactory) {
    this.button = factory.createButton();
    this.checkbox = factory.createCheckbox();
    this.input = factory.createInput();
  }

  public renderUI(): string[] {
    return [
      this.button.render(),
      this.checkbox.render(),
      this.input.render(),
    ];
  }
}

// 使用例
function createApp(os: 'windows' | 'macos'): Application {
  const factory: GUIFactory = os === 'windows' 
    ? new WindowsFactory() 
    : new MacOSFactory();
  return new Application(factory);
}

const windowsApp = createApp('windows');
console.log(windowsApp.renderUI()); // [Windows Button], [Windows Checkbox], [Windows Input]

const macApp = createApp('macos');
console.log(macApp.renderUI()); // [macOS Button], [macOS Checkbox], [macOS Input]