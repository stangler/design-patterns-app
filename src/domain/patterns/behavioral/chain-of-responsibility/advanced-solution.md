# 発展課題 模範解答

## 他の類似パターンとの違い

### Command パターン
- **共通点**: リクエストをオブジェクトとして扱う
- **違い**:
  - Chain of Responsibility は「複数の処理者を経由」
  - Command は「単一の実行者」で操作をカプセル化
- **使い分け**:
  - 誰が処理するか決まっていない → Chain of Responsibility
  - 操作の履歴・Undo → Command

### Decorator パターン
- **共通点**: オブジェクトのチェーン構造
- **違い**:
  - Chain of Responsibility は「誰か一人が処理」
  - Decorator は「全員が処理を追加」
- **使い分け**:
  - 段階的な処理の委譲 → Chain of Responsibility
  - 機能の段階的な追加 → Decorator

### Mediator パターン
- **共通点**: オブジェクト間の通信を調整
- **違い**:
  - Chain of Responsibility は「線形のチェーン」
  - Mediator は「中央集権的な調整」
- **使い分け**:
  - 順序立てた処理の流れ → Chain of Responsibility
  - 多対多の通信を整理 → Mediator

### Observer パターン
- **共通点**: イベントの通知
- **違い**:
  - Chain of Responsibility は「1人が処理」
  - Observer は「全員が通知を受け取る」
- **使い分け**:
  - 誰か一人に処理してほしい → Chain of Responsibility
  - 全員に通知したい → Observer

## 実務での応用例

### 使用シーン
- **認証・認可**: 認証 → 権限チェック → ログ出力
- **ロギング**: DEBUG → INFO → ERROR → FATAL
- **バリデーション**: 入力チェック → 形式チェック → ビジネスルール
- **ヘルプシステム**: FAQ → サポート → エンジニア
- **Webミドルウェア**: Express/Koa のミドルウェアチェーン

### 実装時の注意点

1. **チェーンの終了条件**:
```typescript
abstract class Handler {
  private next: Handler | null = null;
  
  setNext(handler: Handler): Handler {
    this.next = handler;
    return handler; // メソッドチェーン用
  }
  
  handle(request: Request): Response | null {
    const result = this.process(request);
    if (result) return result; // 処理完了
    
    if (this.next) {
      return this.next.handle(request); // 次へ委譲
    }
    return null; // チェーンの終わり
  }
  
  protected abstract process(request: Request): Response | null;
}
```

2. **デフォルトハンドラー**:
```typescript
class DefaultHandler extends Handler {
  protected process(request: Request): Response | null {
    return { status: 404, message: '処理できませんでした' };
  }
}

// チェーンの最後に配置
handler1.setNext(handler2).setNext(new DefaultHandler());
```

3. **非同期チェーン**:
```typescript
abstract class AsyncHandler {
  private next: AsyncHandler | null = null;
  
  setNext(handler: AsyncHandler): AsyncHandler {
    this.next = handler;
    return handler;
  }
  
  async handle(request: Request): Promise<Response | null> {
    const result = await this.process(request);
    if (result) return result;
    
    if (this.next) {
      return this.next.handle(request);
    }
    return null;
  }
  
  protected abstract process(request: Request): Promise<Response | null>;
}
```

### 実務例：Express ミドルウェア

```typescript
// Express は Chain of Responsibility パターン
app.use((req, res, next) => {
  console.log('1. ログ出力');
  next(); // 次のハンドラーへ
});

app.use((req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).send('Unauthorized');
    return; // チェーン終了
  }
  next();
});

app.use((req, res, next) => {
  console.log('3. ビジネスロジック');
  res.send('Success');
});
```

### チェーンの構築パターン

```typescript
// ビルダーでチェーンを構築
class ChainBuilder {
  private first: Handler | null = null;
  private current: Handler | null = null;
  
  add(handler: Handler): ChainBuilder {
    if (!this.first) {
      this.first = handler;
      this.current = handler;
    } else {
      this.current!.setNext(handler);
      this.current = handler;
    }
    return this;
  }
  
  build(): Handler | null {
    return this.first;
  }
}

const chain = new ChainBuilder()
  .add(new AuthHandler())
  .add(new ValidationHandler())
  .add(new BusinessHandler())
  .build();
```

### アンチパターンとしての側面

- **長すぎるチェーン**: パフォーマンス低下、デバッグ困難
- **循環チェーン**: 無限ループに注意
- **全員が処理しない**: 何も起きない可能性

現代の Web 開発では、ミドルウェアパターンとして広く使われています。