# 発展課題 模範解答

## 他の類似パターンとの違い

### Decorator パターン
- **共通点**: オブジェクトをラップし、同じインターフェースを提供
- **違い**:
  - Proxy は「アクセス制御・最適化」が目的
  - Decorator は「機能追加」が目的
- **使い分け**:
  - 遅延読み込み、アクセス制御 → Proxy
  - 新しい振る舞いの追加 → Decorator

### Adapter パターン
- **共通点**: オブジェクトをラップする
- **違い**:
  - Proxy は「同じインターフェース」を提供
  - Adapter は「異なるインターフェース」に変換
- **使い分け**:
  - 同じAPIで制御・最適化 → Proxy
  - インターフェース変換 → Adapter

### Facade パターン
- **共通点**: 間接的なアクセスを提供
- **違い**:
  - Proxy は「同じインターフェース」を提供
  - Facade は「簡略化されたインターフェース」を提供
- **使い分け**:
  - 既存オブジェクトへの制御 → Proxy
  - サブシステムへの単純化 → Facade

### Chain of Responsibility パターン
- **共通点**: リクエストの処理を仲介
- **違い**:
  - Proxy は「単一の仲介者」
  - Chain は「複数の処理者の連鎖」
- **使い分け**:
  - アクセス制御・キャッシュ → Proxy
  - 段階的な処理委譲 → Chain of Responsibility

## 実務での応用例

### 使用シーン
- **仮想プロキシ**: 重いリソースの遅延読み込み（画像、動画）
- **保護プロキシ**: アクセス権限のチェック
- **リモートプロキシ**: ネットワーク越しのオブジェクトアクセス
- **キャッシュプロキシ**: 結果のキャッシュ
- **スマート参照**: 参照カウント、メモリ管理

### 実装時の注意点

1. **仮想プロキシ（遅延読み込み）**:
```typescript
interface Image {
  display(): void;
}

class RealImage implements Image {
  private data: string | null = null;
  
  constructor(private filename: string) {
    this.load(); // コンストラクタで読み込み
  }
  
  private load(): void {
    console.log(`${this.filename} を読み込み中...`);
    this.data = 'image data';
  }
  
  display(): void {
    console.log(`${this.filename} を表示`);
  }
}

class ImageProxy implements Image {
  private realImage: RealImage | null = null;
  
  constructor(private filename: string) {}
  
  display(): void {
    if (!this.realImage) {
      this.realImage = new RealImage(this.filename); // 初回のみ読み込み
    }
    this.realImage.display();
  }
}
```

2. **保護プロキシ（アクセス制御）**:
```typescript
interface Document {
  read(): string;
  write(content: string): void;
}

class SensitiveDocument implements Document {
  constructor(private content: string = '機密情報') {}
  
  read(): string { return this.content; }
  write(content: string): void { this.content = content; }
}

class DocumentProxy implements Document {
  constructor(
    private document: Document,
    private userRole: 'admin' | 'user'
  ) {}
  
  read(): string {
    return this.document.read();
  }
  
  write(content: string): void {
    if (this.userRole !== 'admin') {
      throw new Error('書き込み権限がありません');
    }
    this.document.write(content);
  }
}
```

3. **キャッシュプロキシ**:
```typescript
class APIProxy implements APIService {
  private cache: Map<string, any> = new Map();
  
  constructor(private realAPI: APIService) {}
  
  async getData(key: string): Promise<any> {
    if (this.cache.has(key)) {
      console.log('キャッシュから取得');
      return this.cache.get(key);
    }
    
    const data = await this.realAPI.getData(key);
    this.cache.set(key, data);
    return data;
  }
}
```

### TypeScript での活用

```typescript
// Proxy オブジェクトを使用した動的プロキシ
const handler: ProxyHandler<any> = {
  get(target, prop) {
    console.log(`${String(prop)} にアクセス`);
    return target[prop];
  },
  
  set(target, prop, value) {
    console.log(`${String(prop)} に ${value} を設定`);
    target[prop] = value;
    return true;
  }
};

const realObject = { name: 'test', value: 100 };
const proxy = new Proxy(realObject, handler);

proxy.name;   // ログ: name にアクセス
proxy.value = 200; // ログ: value に 200 を設定
```

### Proxy の種類まとめ

| 種類 | 目的 | 使用例 |
|------|------|--------|
| 仮想プロキシ | 遅延読み込み | 重い画像の読み込み |
| 保護プロキシ | アクセス制御 | 権限チェック |
| リモートプロキシ | ネットワーク透過 | RPC、APIコール |
| キャッシュプロキシ | 結果の保存 | APIレスポンス |
| スマート参照 | 参照管理 | メモリ管理 |

### アンチパターンとしての側面

- **過剰なプロキシ**: 単純なアクセスにプロキシは不要
- **パフォーマンス劣化**: プロキシのオーバーヘッド
- **複雑さの増加**: 間接的な層がデバッグを困難に

現代のフロントエンドでは、API クライアントやデータフェッチライブラリ（React Query、SWR）が Proxy パターンを活用しています。