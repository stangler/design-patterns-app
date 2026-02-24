// Chain of Responsibility パターン: 処理の連鎖

/**
 * Handler: ハンドラーの抽象クラス
 */
export abstract class SupportHandler {
  protected nextHandler: SupportHandler | null = null;
  protected level: number;

  constructor(level: number) {
    this.level = level;
  }

  public setNext(handler: SupportHandler): SupportHandler {
    this.nextHandler = handler;
    return handler;
  }

  public handle(request: SupportRequest): string {
    if (this.canHandle(request)) {
      return this.processRequest(request);
    }
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }
    return `❌ リクエスト「${request.title}」は処理できませんでした`;
  }

  protected canHandle(request: SupportRequest): boolean {
    return request.priority <= this.level;
  }

  protected abstract processRequest(request: SupportRequest): string;
}

/**
 * Request: サポートリクエスト
 */
export interface SupportRequest {
  title: string;
  description: string;
  priority: number; // 1: 低, 2: 中, 3: 高, 4: 緊急
}

/**
 * Concrete Handlers: 具体的なハンドラー
 */
export class Level1Support extends SupportHandler {
  constructor() {
    super(1);
  }

  protected processRequest(request: SupportRequest): string {
    return `📞 レベル1サポート: 「${request.title}」を処理しました（FAQ参照）`;
  }
}

export class Level2Support extends SupportHandler {
  constructor() {
    super(2);
  }

  protected processRequest(request: SupportRequest): string {
    return `📧 レベル2サポート: 「${request.title}」を処理しました（メール対応）`;
  }
}

export class Level3Support extends SupportHandler {
  constructor() {
    super(3);
  }

  protected processRequest(request: SupportRequest): string {
    return `👨‍💻 レベル3サポート: 「${request.title}」を処理しました（技術者対応）`;
  }
}

export class EmergencySupport extends SupportHandler {
  constructor() {
    super(4);
  }

  protected canHandle(request: SupportRequest): boolean {
    return request.priority === 4;
  }

  protected processRequest(request: SupportRequest): string {
    return `🚨 緊急サポート: 「${request.title}」を最優先で処理しています！`;
  }
}

/**
 * 別の例: 認証チェーン
 */
export abstract class AuthHandler {
  protected next: AuthHandler | null = null;

  public setNext(handler: AuthHandler): AuthHandler {
    this.next = handler;
    return handler;
  }

  public abstract handle(user: User): string | null;
}

export interface User {
  username: string;
  password?: string;
  otp?: string;
  ip?: string;
}

export class BasicAuthHandler extends AuthHandler {
  public handle(user: User): string | null {
    if (!user.password || user.password !== 'correct-password') {
      return '❌ パスワードが間違っています';
    }
    if (this.next) {
      return this.next.handle(user);
    }
    return '✅ 基本認証成功';
  }
}

export class OTPHandler extends AuthHandler {
  public handle(user: User): string | null {
    if (!user.otp || user.otp !== '123456') {
      return '❌ OTPコードが間違っています';
    }
    if (this.next) {
      return this.next.handle(user);
    }
    return '✅ OTP認証成功';
  }
}

export class IPWhitelistHandler extends AuthHandler {
  private allowedIPs = ['192.168.1.1', '10.0.0.1'];

  public handle(user: User): string | null {
    if (!user.ip || !this.allowedIPs.includes(user.ip)) {
      return '❌ 許可されていないIPアドレスです';
    }
    if (this.next) {
      return this.next.handle(user);
    }
    return '✅ IP認証成功';
  }
}

// 使用例
console.log('=== サポートシステム ===');
const level1 = new Level1Support();
const level2 = new Level2Support();
const level3 = new Level3Support();
const emergency = new EmergencySupport();

// チェーンを構築
level1.setNext(level2).setNext(level3).setNext(emergency);

const requests: SupportRequest[] = [
  { title: 'パスワード忘れ', description: 'パスワードを忘れました', priority: 1 },
  { title: '請求書の件', description: '請求書について質問', priority: 2 },
  { title: 'サーバーダウン', description: '本番環境がダウン', priority: 3 },
  { title: '全サービス停止', description: '緊急事態', priority: 4 },
];

requests.forEach(req => {
  console.log(level1.handle(req));
});

console.log('\n=== 認証チェーン ===');
const basicAuth = new BasicAuthHandler();
const otpAuth = new OTPHandler();
const ipCheck = new IPWhitelistHandler();

basicAuth.setNext(otpAuth).setNext(ipCheck);

const validUser: User = {
  username: 'user1',
  password: 'correct-password',
  otp: '123456',
  ip: '192.168.1.1'
};

const invalidOTPUser: User = {
  username: 'user2',
  password: 'correct-password',
  otp: 'wrong',
  ip: '192.168.1.1'
};

console.log(basicAuth.handle(validUser));
console.log(basicAuth.handle(invalidOTPUser));