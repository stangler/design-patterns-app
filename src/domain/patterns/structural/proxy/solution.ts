// Proxy パターン: オブジェクトへのアクセスを制御

/**
 * Subject: 共通インターフェース
 */
export interface Image {
  display(): string;
  getWidth(): number;
  getHeight(): number;
}

/**
 * Real Subject: 重いリソースを持つ実オブジェクト
 */
export class RealImage implements Image {
  private width: number;
  private height: number;

  constructor(private filename: string) {
    this.width = 0;
    this.height = 0;
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    console.log(`ディスクから読み込み中: ${this.filename}`);
    // 重い処理をシミュレート
    this.width = 1920;
    this.height = 1080;
  }

  public display(): string {
    return `🖼️ ${this.filename} (${this.width}x${this.height}) を表示`;
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }
}

/**
 * Virtual Proxy: 遅延読み込み
 */
export class ImageProxy implements Image {
  private realImage: RealImage | null = null;

  constructor(private filename: string) {}

  public display(): string {
    if (!this.realImage) {
      console.log('遅延読み込みを開始...');
      this.realImage = new RealImage(this.filename);
    }
    return this.realImage.display();
  }

  public getWidth(): number {
    if (!this.realImage) {
      // メタデータのみ読み込む（軽量）
      console.log('メタデータのみ取得');
      return 1920;
    }
    return this.realImage.getWidth();
  }

  public getHeight(): number {
    if (!this.realImage) {
      console.log('メタデータのみ取得');
      return 1080;
    }
    return this.realImage.getHeight();
  }
}

/**
 * Protection Proxy: アクセス制御
 */
export class ProtectedDocument {
  constructor(
    private content: string,
    private requiredRole: 'admin' | 'user' | 'guest'
  ) {}

  public read(): string {
    return this.content;
  }
}

export class DocumentProxy {
  private document: ProtectedDocument;

  constructor(
    content: string,
    requiredRole: 'admin' | 'user' | 'guest',
    private userRole: 'admin' | 'user' | 'guest'
  ) {
    this.document = new ProtectedDocument(content, requiredRole);
  }

  public read(): string | null {
    const roleHierarchy = { admin: 3, user: 2, guest: 1 };
    if (roleHierarchy[this.userRole] >= roleHierarchy[this.document['requiredRole']]) {
      return this.document.read();
    }
    console.log('アクセス拒否: 権限が不足しています');
    return null;
  }
}

// 使用例
console.log('=== Virtual Proxy (遅延読み込み) ===');
const image = new ImageProxy('landscape.jpg');

// 実際の画像はまだ読み込まれていない
console.log(`サイズ: ${image.getWidth()}x${image.getHeight()}`);

// display() を呼ぶと初めて読み込まれる
console.log(image.display());

console.log('\n=== Protection Proxy (アクセス制御) ===');
const adminDoc = new DocumentProxy('機密情報', 'admin', 'admin');
const userDoc = new DocumentProxy('機密情報', 'admin', 'user');

console.log(adminDoc.read());  // 機密情報
console.log(userDoc.read());   // アクセス拒否: null