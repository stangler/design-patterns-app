// Singleton パターン: クラスのインスタンスが1つしか存在しないことを保証

/**
 * Singleton クラス
 * ログ管理システムを例に、アプリケーション全体で単一のロガーインスタンスを共有
 */
export class Logger {
  private static instance: Logger | null = null;
  private logs: string[] = [];

  // プライベートコンストラクタ: 外部からの new を禁止
  private constructor() {}

  // 静的メソッドで唯一のインスタンスを取得
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // ログを追加
  public log(message: string): void {
    const timestamp = new Date().toISOString();
    this.logs.push(`[${timestamp}] ${message}`);
  }

  // 全てのログを取得
  public getLogs(): string[] {
    return [...this.logs];
  }

  // ログをクリア
  public clear(): void {
    this.logs = [];
  }
}

// 使用例
const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();

logger1.log('アプリケーション起動');
logger2.log('ユーザーがログイン');

// 両方とも同じインスタンスを参照しているため、ログは統合される
console.log(logger1 === logger2); // true
console.log(logger1.getLogs()); // 両方のログが含まれる