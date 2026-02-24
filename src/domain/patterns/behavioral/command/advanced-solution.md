# 発展課題 模範解答

## 他の類似パターンとの違い

### Strategy パターン
- **共通点**: 操作をカプセル化する
- **違い**:
  - Command は「操作自体」をオブジェクト化
  - Strategy は「アルゴリズムの切り替え」が目的
- **使い分け**:
  - 操作の履歴、Undo、キューイング → Command
  - アルゴリズムの差し替え → Strategy

### Chain of Responsibility パターン
- **共通点**: リクエストをオブジェクトとして扱う
- **違い**:
  - Command は「単一の実行者」
  - Chain of Responsibility は「複数の処理者を経由」
- **使い分け**:
  - 操作の保存・再実行 → Command
  - 処理の委譲 → Chain of Responsibility

### Memento パターン
- **共通点**: 状態の保存・復元
- **違い**:
  - Command は「操作」をカプセル化
  - Memento は「状態」をカプセル化
- **使い分け**:
  - Undo/Redo 操作 → Command（Memento と組み合わせることも多い）
  - 状態のスナップショット → Memento

### Observer パターン
- **共通点**: 状態変化の通知
- **違い**:
  - Command は「操作を実行」する
  - Observer は「状態変化を通知」する
- **使い分け**:
  - アクションの実行・記録 → Command
  - イベントの通知 → Observer

## 実務での応用例

### 使用シーン
- **Undo/Redo**: テキストエディタ、グラフィックアプリ
- **マクロ**: 操作の記録・再生
- **タスクキュー**: 非同期処理のキューイング
- **トランザクション**: 複数操作のまとめて実行・ロールバック
- **GUI**: ボタンクリック、メニューアクション

### 実装時の注意点

1. **基本構造**:
```typescript
interface Command {
  execute(): void;
  undo(): void;
}

class ConcreteCommand implements Command {
  private previousState: any;
  
  constructor(private receiver: Receiver) {}
  
  execute(): void {
    this.previousState = this.receiver.getState();
    this.receiver.action();
  }
  
  undo(): void {
    this.receiver.setState(this.previousState);
  }
}
```

2. **Invoker（実行者）の設計**:
```typescript
class Invoker {
  private history: Command[] = [];
  private undone: Command[] = [];
  
  execute(command: Command): void {
    command.execute();
    this.history.push(command);
    this.undone = []; // 新しい操作でRedo履歴をクリア
  }
  
  undo(): void {
    const command = this.history.pop();
    if (command) {
      command.undo();
      this.undone.push(command);
    }
  }
  
  redo(): void {
    const command = this.undone.pop();
    if (command) {
      command.execute();
      this.history.push(command);
    }
  }
}
```

3. **マクロコマンド**:
```typescript
class MacroCommand implements Command {
  private commands: Command[] = [];
  
  add(command: Command): void {
    this.commands.push(command);
  }
  
  execute(): void {
    this.commands.forEach(cmd => cmd.execute());
  }
  
  undo(): void {
    // 逆順で undo
    [...this.commands].reverse().forEach(cmd => cmd.undo());
  }
}
```

### 実務例：タスクスケジューラー

```typescript
interface Task {
  execute(): Promise<void>;
  canExecute(): boolean;
}

class TaskScheduler {
  private queue: Task[] = [];
  
  addTask(task: Task): void {
    this.queue.push(task);
  }
  
  async runAll(): Promise<void> {
    while (this.queue.length > 0) {
      const task = this.queue.shift()!;
      if (task.canExecute()) {
        await task.execute();
      }
    }
  }
}

// 使用例
scheduler.addTask(new SendEmailCommand(user, message));
scheduler.addTask(new UpdateDatabaseCommand(record));
scheduler.addTask(new NotifySlackCommand(channel));
await scheduler.runAll();
```

### TypeScript での型安全性

```typescript
// 型安全なコマンド定義
interface Command<T = void> {
  execute(): T;
  undo(): void;
}

class SetValueCommand implements Command<number> {
  private oldValue: number | undefined;
  
  constructor(
    private target: { value: number },
    private newValue: number
  ) {}
  
  execute(): number {
    this.oldValue = this.target.value;
    this.target.value = this.newValue;
    return this.newValue;
  }
  
  undo(): void {
    if (this.oldValue !== undefined) {
      this.target.value = this.oldValue;
    }
  }
}
```

### アンチパターンとしての側面

- **過剰な粒度**: 細かすぎる操作を Command にするとクラス爆発
- **肥大化した Receiver**: Receiver に多くの責任を持たせすぎない
- **Undo の複雑さ**: 副作用のある操作の Undo は難しい

現代のフロントエンドでは、Redux の Action や Command Bus パターンとして活用されています。