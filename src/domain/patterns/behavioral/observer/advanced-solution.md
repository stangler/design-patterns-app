# 発展課題 模範解答

## 他の類似パターンとの違い

### Mediator パターン
- **共通点**: オブジェクト間の通信を管理
- **違い**:
  - Observer は「発行-購読モデル」（一対多）
  - Mediator は「中央集権的な調整」（多対多）
- **使い分け**:
  - 一対多の通知配信 → Observer
  - 多対多の通信を一箇所で管理 → Mediator

### Chain of Responsibility パターン
- **共通点**: イベントの伝播
- **違い**:
  - Observer は「全員が通知を受け取る」
  - Chain of Responsibility は「誰か一人が処理」
- **使い分け**:
  - 全購読者への通知 → Observer
  - 段階的な処理委譲 → Chain of Responsibility

### Publish-Subscribe パターン
- **共通点**: イベントの通知
- **違い**:
  - Observer は「Subject と Observer が直接接続」
  - Pub-Sub は「メッセージブローカーを経由」
- **使い分け**:
  - 疎結合、分散システム → Pub-Sub
  - 同一プロセス内の通知 → Observer

### Singleton パターン
- **共通点**: グローバルなアクセス
- **違い**:
  - Observer は「状態変化の通知」
  - Singleton は「単一インスタンス」
- **使い分け**:
  - イベント通知システム → Observer
  - 共有リソース管理 → Singleton

## 実務での応用例

### 使用シーン
- **イベントシステム**: UI イベント、クリック、入力
- **データバインディング**: モデルとビューの同期
- **リアルタイム通知**: チャット、在庫更新
- **設定変更**: 設定更新時の通知
- **監視システム**: ログ、メトリクス

### 実装時の注意点

1. **基本構造**:
```typescript
interface Observer {
  update(data: any): void;
}

interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(data: any): void;
}

class ConcreteSubject implements Subject {
  private observers: Observer[] = [];
  private state: any;
  
  attach(observer: Observer): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }
  
  detach(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }
  
  notify(data: any): void {
    this.observers.forEach(observer => observer.update(data));
  }
  
  setState(state: any): void {
    this.state = state;
    this.notify(state);
  }
}
```

2. **TypeScript での汎用実装**:
```typescript
type EventHandler<T> = (data: T) => void;

class EventEmitter<T extends Record<string, any>> {
  private handlers: Map<keyof T, EventHandler<any>[]> = new Map();
  
  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler);
  }
  
  off<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }
  
  emit<K extends keyof T>(event: K, data: T[K]): void {
    const handlers = this.handlers.get(event);
    handlers?.forEach(h => h(data));
  }
}

// 使用例
interface Events {
  userCreated: { id: string; name: string };
  userDeleted: { id: string };
}

const emitter = new EventEmitter<Events>();
emitter.on('userCreated', (data) => console.log(`User: ${data.name}`));
emitter.emit('userCreated', { id: '1', name: 'John' });
```

3. **購読解除の自動化**:
```typescript
class DisposableObserver implements Observer {
  constructor(
    private subject: Subject,
    private callback: (data: any) => void
  ) {
    subject.attach(this);
  }
  
  update(data: any): void {
    this.callback(data);
  }
  
  dispose(): void {
    this.subject.detach(this);
  }
}
```

### 実務例：ストア（Redux ライク）

```typescript
interface StoreSubscriber {
  (state: any): void;
}

class Store {
  private state: any;
  private subscribers: Set<StoreSubscriber> = new Set();
  
  constructor(initialState: any) {
    this.state = initialState;
  }
  
  getState(): any {
    return this.state;
  }
  
  setState(newState: any): void {
    this.state = newState;
    this.subscribers.forEach(sub => sub(this.state));
  }
  
  subscribe(subscriber: StoreSubscriber): () => void {
    this.subscribers.add(subscriber);
    return () => this.subscribers.delete(subscriber);
  }
}

// 使用例
const store = new Store({ count: 0 });
const unsubscribe = store.subscribe(state => {
  console.log('State updated:', state);
});

store.setState({ count: 1 }); // ログ出力
unsubscribe(); // 購読解除
```

### アンチパターンとしての側面

- **通知の連鎖**: Observer が別の Observer をトリガーし無限ループ
- **メモリリーク**: 購読解除忘れによるメモリリーク
- **パフォーマンス**: 多すぎる Observer による通知コスト

現代のフロントエンドでは、RxJS、React 状態管理（Redux、MobX）、Vue のリアクティブシステムなどが Observer パターンを基盤としています。