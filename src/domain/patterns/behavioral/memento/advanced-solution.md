# 発展課題 模範解答

## 他の類似パターンとの違い

### Command パターン
- **共通点**: 状態の保存・復元
- **違い**:
  - Memento は「状態」をカプセル化
  - Command は「操作」をカプセル化
- **使い分け**:
  - スナップショットの保存 → Memento
  - 操作の記録・Undo → Command（Memento と組み合わせることが多い）

### Prototype パターン
- **共通点**: オブジェクトの複製
- **違い**:
  - Memento は「状態の保存と復元」が目的
  - Prototype は「新しいインスタンスの生成」が目的
- **使い分け**:
  - 時系列での状態管理 → Memento
  - ベースからの複製 → Prototype

### State パターン
- **共通点**: 状態を扱う
- **違い**:
  - Memento は「状態の保存」
  - State は「状態による振る舞いの切り替え」
- **使い分け**:
  - 状態の履歴管理 → Memento
  - 状態遷移の管理 → State

### Iterator パターン
- **共通点**: 現在位置の管理
- **違い**:
  - Memento は「オブジェクト全体の状態」
  - Iterator は「走査位置」
- **使い分け**:
  - スナップショット → Memento
  - 順次アクセス → Iterator

## 実務での応用例

### 使用シーン
- **Undo/Redo**: テキストエディタ、グラフィックアプリ
- **ゲームセーブ**: ゲーム状態の保存・読み込み
- **トランザクション**: 変更前の状態へのロールバック
- **履歴管理**: 変更履歴の保持
- **ドラフト保存**: 作業中の状態の一時保存

### 実装時の注意点

1. **基本構造**:
```typescript
// Memento: 状態を保持
class Memento {
  private state: string;
  private date: Date;
  
  constructor(state: string) {
    this.state = state;
    this.date = new Date();
  }
  
  getState(): string {
    return this.state;
  }
  
  getDate(): Date {
    return this.date;
  }
}

// Originator: 状態を持つオブジェクト
class Originator {
  private state: string;
  
  setState(state: string): void {
    this.state = state;
  }
  
  save(): Memento {
    return new Memento(this.state);
  }
  
  restore(memento: Memento): void {
    this.state = memento.getState();
  }
}

// Caretaker: Memento を管理
class Caretaker {
  private history: Memento[] = [];
  
  addMemento(memento: Memento): void {
    this.history.push(memento);
  }
  
  getMemento(index: number): Memento | undefined {
    return this.history[index];
  }
}
```

2. **不変性の確保**:
```typescript
// Memento は不変であるべき
class ImmutableMemento {
  private readonly state: string;
  private readonly date: Date;
  
  constructor(state: string) {
    this.state = state;
    this.date = new Date();
  }
  
  getState(): string {
    return this.state; // 読み取り専用
  }
}
```

3. **履歴の管理**:
```typescript
class HistoryManager<T> {
  private history: T[] = [];
  private currentIndex: number = -1;
  
  save(state: T): void {
    // 現在位置以降を削除（Redo 履歴をクリア）
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push(state);
    this.currentIndex++;
  }
  
  undo(): T | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.history[this.currentIndex];
    }
    return null;
  }
  
  redo(): T | null {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return this.history[this.currentIndex];
    }
    return null;
  }
}
```

### 実務例：テキストエディタ

```typescript
class TextEditor {
  private content: string = '';
  private cursor: number = 0;
  
  type(text: string): void {
    this.content = 
      this.content.slice(0, this.cursor) + 
      text + 
      this.content.slice(this.cursor);
    this.cursor += text.length;
  }
  
  save(): EditorMemento {
    return new EditorMemento(this.content, this.cursor);
  }
  
  restore(memento: EditorMemento): void {
    this.content = memento.getContent();
    this.cursor = memento.getCursor();
  }
  
  getContent(): string {
    return this.content;
  }
}

class EditorMemento {
  constructor(
    private readonly content: string,
    private readonly cursor: number
  ) {}
  
  getContent(): string { return this.content; }
  getCursor(): number { return this.cursor; }
}
```

### メモリ効率の考慮

```typescript
// 差分のみを保存
class DeltaMemento {
  constructor(
    private changes: Map<string, { old: any; new: any }>
  ) {}
  
  apply(target: any): void {
    for (const [key, value] of this.changes) {
      target[key] = value.new;
    }
  }
  
  undo(target: any): void {
    for (const [key, value] of this.changes) {
      target[key] = value.old;
    }
  }
}
```

### アンチパターンとしての側面

- **メモリ消費**: 頻繁なスナップショットはメモリを大量消費
- **カプセル化違反**: Memento が内部状態を暴露する可能性
- **過剰な履歴**: すべての状態を保存する必要はない

現代のフロントエンドでは、Immer や Redux DevTools のようなライブラリが状態のスナップショット管理を提供しています。