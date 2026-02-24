// Mediator パターン: オブジェクト間通信を仲介

/**
 * Mediator: 仲介者のインターフェース
 */
export interface ChatMediator {
  sendMessage(message: string, user: User): void;
  addUser(user: User): void;
}

/**
 * Colleague: 同僚オブジェクトのインターフェース
 */
export interface User {
  name: string;
  receive(message: string): void;
  send(message: string): void;
}

/**
 * Concrete Mediator: チャットルーム
 */
export class ChatRoom implements ChatMediator {
  private users: User[] = [];

  public addUser(user: User): void {
    this.users.push(user);
    console.log(`👤 ${user.name} がチャットルームに参加しました`);
  }

  public sendMessage(message: string, sender: User): void {
    console.log(`📨 [${sender.name}]: ${message}`);
    for (const user of this.users) {
      // 送信者以外に配信
      if (user !== sender) {
        user.receive(`[${sender.name}]: ${message}`);
      }
    }
  }
}

/**
 * Concrete Colleague: チャットユーザー
 */
export class ChatUser implements User {
  private mediator: ChatMediator;

  constructor(mediator: ChatMediator, public name: string) {
    this.mediator = mediator;
    mediator.addUser(this);
  }

  public send(message: string): void {
    this.mediator.sendMessage(message, this);
  }

  public receive(message: string): void {
    console.log(`   📬 ${this.name} が受信: ${message}`);
  }
}

/**
 * 別の例: UIコンポーネント間の調整
 */
export interface UIMediator {
  notify(sender: UIComponent, event: string): void;
}

export interface UIComponent {
  name: string;
  setEnabled(enabled: boolean): void;
}

export class DialogMediator implements UIMediator {
  private checkbox: Checkbox | null = null;
  private button: Button | null = null;
  private textbox: Textbox | null = null;

  public setCheckbox(checkbox: Checkbox): void {
    this.checkbox = checkbox;
  }

  public setButton(button: Button): void {
    this.button = button;
  }

  public setTextbox(textbox: Textbox): void {
    this.textbox = textbox;
  }

  public notify(sender: UIComponent, event: string): void {
    if (sender.name === 'agreeCheckbox' && event === 'check') {
      // チェックボックスがチェックされたらボタンを有効化
      if (this.button) {
        this.button.setEnabled(true);
      }
    } else if (sender.name === 'agreeCheckbox' && event === 'uncheck') {
      // チェックが外れたらボタンを無効化
      if (this.button) {
        this.button.setEnabled(false);
      }
    } else if (sender.name === 'submitButton' && event === 'click') {
      // ボタンがクリックされたらテキストボックスの内容を取得
      if (this.textbox && this.textbox.isEnabled()) {
        console.log('📝 フォームを送信しました');
      }
    }
  }
}

export class Checkbox implements UIComponent {
  private enabled: boolean = true;
  private checked: boolean = false;

  constructor(
    public name: string,
    private mediator: UIMediator
  ) {}

  public toggle(): void {
    this.checked = !this.checked;
    const event = this.checked ? 'check' : 'uncheck';
    console.log(`☑️ チェックボックス: ${this.checked ? 'ON' : 'OFF'}`);
    this.mediator.notify(this, event);
  }

  public isChecked(): boolean {
    return this.checked;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

export class Button implements UIComponent {
  constructor(
    public name: string,
    private mediator: UIMediator
  ) {
    this.enabled = false; // 初期状態は無効
  }
  
  private enabled: boolean;

  public click(): void {
    if (this.enabled) {
      console.log('🔘 ボタンがクリックされました');
      this.mediator.notify(this, 'click');
    } else {
      console.log('🔘 ボタンは無効です');
    }
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    console.log(`🔘 ボタン: ${enabled ? '有効' : '無効'}`);
  }
}

export class Textbox implements UIComponent {
  constructor(public name: string) {}
  
  private enabled: boolean = true;
  private text: string = '';

  public setText(text: string): void {
    this.text = text;
  }

  public getText(): string {
    return this.text;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }
}

// 使用例
console.log('=== チャットルーム ===');
const chatRoom = new ChatRoom();

const tanaka = new ChatUser(chatRoom, '田中');
const suzuki = new ChatUser(chatRoom, '鈴木');

tanaka.send('こんにちは！');
suzuki.send('田中さん、こんにちは！');

console.log('\n=== UIコンポーネント調整 ===');
const dialog = new DialogMediator();
const checkbox = new Checkbox('agreeCheckbox', dialog);
const submitButton = new Button('submitButton', dialog);
const usernameText = new Textbox('username');

dialog.setCheckbox(checkbox);
dialog.setButton(submitButton);
dialog.setTextbox(usernameText);

// ボタンは最初無効
submitButton.click();
// チェックボックスをオンにするとボタンが有効化
checkbox.toggle();
submitButton.click();