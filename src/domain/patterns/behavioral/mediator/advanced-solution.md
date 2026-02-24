# 発展課題 模範解答

## 他の類似パターンとの違い

### Observer パターン
- **共通点**: オブジェクト間の通信を管理
- **違い**:
  - Mediator は「中央集権的な調整」
  - Observer は「発行-購読モデル」
- **使い分け**:
  - 多対多の通信を一箇所で管理 → Mediator
  - 一対多の通知配信 → Observer

### Facade パターン
- **共通点**: サブシステムへの統一インターフェース
- **違い**:
  - Mediator は「双方向の通信」を調整
  - Facade は「一方向のアクセス」を提供
- **使い分け**:
  - オブジェクト間の相互作用を管理 → Mediator
  - 複雑なサブシステムを簡単に使う → Facade

### Chain of Responsibility パターン
- **共通点**: オブジェクト間の通信
- **違い**:
  - Mediator は「中央で一元管理」
  - Chain of Responsibility は「線形チェーン」
- **使い分け**:
  - 複雑な相互作用の整理 → Mediator
  - 順序立てた処理の委譲 → Chain of Responsibility

### Command パターン
- **共通点**: オブジェクト間のやり取りをカプセル化
- **違い**:
  - Mediator は「通信の調整」
  - Command は「操作のカプセル化」
- **使い分け**:
  - コンポーネント間の結合を減らす → Mediator
  - 操作の履歴・Undo → Command

## 実務での応用例

### 使用シーン
- **GUI ダイアログ**: ボタン、テキストフィールド、リストの連携
- **チャットアプリ**: ユーザー間のメッセージ中継
- **交通管制**: 航空機、列車の制御システム
- **フォームバリデーション**: 複数フィールドの相関チェック
- **ゲーム**: プレイヤー、敵、アイテムの相互作用

### 実装時の注意点

1. **Mediator インターフェースの設計**:
```typescript
interface Mediator {
  notify(sender: Component, event: string): void;
}

abstract class Component {
  protected mediator: Mediator;
  
  setMediator(mediator: Mediator): void {
    this.mediator = mediator;
  }
}
```

2. **具体的な実装例（フォーム）**:
```typescript
class FormMediator implements Mediator {
  constructor(
    private usernameField: TextField,
    private emailField: TextField,
    private submitButton: Button
  ) {
    // 各コンポーネントに Mediator を設定
    usernameField.setMediator(this);
    emailField.setMediator(this);
    submitButton.setMediator(this);
  }
  
  notify(sender: Component, event: string): void {
    if (sender === this.usernameField && event === 'input') {
      this.validateForm();
    } else if (sender === this.emailField && event === 'input') {
      this.validateForm();
    } else if (sender === this.submitButton && event === 'click') {
      this.submitForm();
    }
  }
  
  private validateForm(): void {
    const valid = 
      this.usernameField.getValue().length > 0 &&
      this.emailField.getValue().includes('@');
    
    this.submitButton.setEnabled(valid);
  }
  
  private submitForm(): void {
    console.log('フォーム送信！');
  }
}
```

3. **CQRS パターンとの組み合わせ**:
```typescript
class MessageBus implements Mediator {
  private handlers: Map<string, Handler[]> = new Map();
  
  register(eventType: string, handler: Handler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }
  
  notify(sender: any, event: string): void {
    const handlers = this.handlers.get(event);
    handlers?.forEach(h => h.handle(sender));
  }
}
```

### 実務例：チャットサーバー

```typescript
interface ChatMediator {
  sendMessage(message: string, user: User): void;
  addUser(user: User): void;
}

class ChatRoom implements ChatMediator {
  private users: User[] = [];
  
  addUser(user: User): void {
    this.users.push(user);
  }
  
  sendMessage(message: string, sender: User): void {
    // 送信者以外にメッセージを配信
    this.users.forEach(user => {
      if (user !== sender) {
        user.receive(message);
      }
    });
  }
}

class User {
  constructor(
    private name: string,
    private mediator: ChatMediator
  ) {}
  
  send(message: string): void {
    console.log(`${this.name}: ${message}`);
    this.mediator.sendMessage(message, this);
  }
  
  receive(message: string): void {
    console.log(`${this.name} received: ${message}`);
  }
}
```

### アンチパターンとしての側面

- **神オブジェクト**: Mediator が肥大化しすぎないよう注意
- **過剰な使用**: 単純な相互作用に Mediator は不要
- **デバッグ困難**: フローが Mediator に集約され追いにくい

現代のフロントエンドでは、Redux や Vuex などの状態管理ライブラリが Mediator の役割を果たしています。また、イベントバスパターンも Mediator の一種です。