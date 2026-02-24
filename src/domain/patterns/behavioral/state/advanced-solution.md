# 発展課題 模範解答

## 他の類似パターンとの違い

### Strategy パターン
- **共通点**: 振る舞いを切り替える
- **違い**:
  - State は「状態」によって振る舞いが変わる
  - Strategy は「アルゴリズム」を外部から切り替える
- **使い分け**:
  - 状態遷移に伴う振る舞いの変化 → State
  - アルゴリズムの差し替え → Strategy

### Bridge パターン
- **共通点**: 実装を切り替える
- **違い**:
  - State は「内部状態」に基づいて切り替え
  - Bridge は「外部から」実装を注入
- **使い分け**:
  - オブジェクトの状態遷移 → State
  - プラットフォームやデバイスの違い → Bridge

### Memento パターン
- **共通点**: 状態を扱う
- **違い**:
  - State は「現在の状態の振る舞い」
  - Memento は「状態の保存・復元」
- **使い分け**:
  - 状態による振る舞いの切り替え → State
  - スナップショット → Memento

### Observer パターン
- **共通点**: 状態変化の通知
- **違い**:
  - State は「オブジェクト内部の状態」
  - Observer は「外部への通知」
- **使い分け**:
  - 状態遷移ロジック → State
  - 状態変化の通知 → Observer

## 実務での応用例

### 使用シーン
- **注文処理**: 注文状態（新規→処理中→出荷済み→完了）
- **ゲームキャラクター**: 状態（立ち、走り、ジャンプ、攻撃）
- **TCP接続**: 接続状態（Closed→Listen→Established）
- **ドキュメント**: 下書き→レビュー中→承認済み
- **交通信号**: 赤→青→黄

### 実装時の注意点

1. **基本構造**:
```typescript
interface State {
  handle(context: Context): void;
}

class Context {
  private state: State;
  
  constructor(state: State) {
    this.transitionTo(state);
  }
  
  transitionTo(state: State): void {
    console.log(`状態遷移: ${state.constructor.name}`);
    this.state = state;
    this.state.setContext(this);
  }
  
  request(): void {
    this.state.handle();
  }
}

class ConcreteStateA implements State {
  private context: Context;
  
  setContext(context: Context): void {
    this.context = context;
  }
  
  handle(): void {
    console.log('State A の処理');
    this.context.transitionTo(new ConcreteStateB());
  }
}
```

2. **注文状態の実装例**:
```typescript
interface OrderState {
  submit(): void;
  pay(): void;
  ship(): void;
  cancel(): void;
  getStatus(): string;
}

class OrderContext {
  private state: OrderState;
  
  constructor() {
    this.state = new NewOrderState(this);
  }
  
  setState(state: OrderState): void {
    this.state = state;
  }
  
  submit(): void { this.state.submit(); }
  pay(): void { this.state.pay(); }
  ship(): void { this.state.ship(); }
  cancel(): void { this.state.cancel(); }
  getStatus(): string { return this.state.getStatus(); }
}

class NewOrderState implements OrderState {
  constructor(private context: OrderContext) {}
  
  submit(): void {
    console.log('注文を確定しました');
    this.context.setState(new ProcessingState(this.context));
  }
  
  pay(): void { throw new Error('先に注文を確定してください'); }
  ship(): void { throw new Error('先に注文を確定してください'); }
  cancel(): void {
    console.log('注文をキャンセルしました');
    this.context.setState(new CancelledState(this.context));
  }
  getStatus(): string { return '新規注文'; }
}

class ProcessingState implements OrderState {
  constructor(private context: OrderContext) {}
  
  submit(): void { throw new Error('既に処理中です'); }
  pay(): void {
    console.log('支払い完了');
    this.context.setState(new ShippedState(this.context));
  }
  ship(): void { throw new Error('先に支払ってください'); }
  cancel(): void {
    console.log('注文をキャンセルしました');
    this.context.setState(new CancelledState(this.context));
  }
  getStatus(): string { return '処理中'; }
}
```

3. **有限状態機械（FSM）**:
```typescript
interface Transition {
  from: string;
  to: string;
  event: string;
}

class StateMachine {
  private currentState: string;
  private transitions: Transition[] = [];
  
  constructor(initialState: string) {
    this.currentState = initialState;
  }
  
  addTransition(from: string, to: string, event: string): void {
    this.transitions.push({ from, to, event });
  }
  
  handle(event: string): boolean {
    const transition = this.transitions.find(
      t => t.from === this.currentState && t.event === event
    );
    
    if (transition) {
      console.log(`${transition.from} --${event}--> ${transition.to}`);
      this.currentState = transition.to;
      return true;
    }
    return false;
  }
  
  getState(): string {
    return this.currentState;
  }
}
```

### 実務例：ゲームキャラクター

```typescript
interface CharacterState {
  enter(): void;
  handleInput(input: string): CharacterState;
  update(): void;
}

class StandingState implements CharacterState {
  enter(): void { console.log('立ち状態'); }
  
  handleInput(input: string): CharacterState {
    if (input === 'run') return new RunningState();
    if (input === 'jump') return new JumpingState();
    return this;
  }
  
  update(): void { /* アニメーション更新 */ }
}

class RunningState implements CharacterState {
  enter(): void { console.log('走り状態'); }
  
  handleInput(input: string): CharacterState {
    if (input === 'stop') return new StandingState();
    if (input === 'jump') return new JumpingState();
    return this;
  }
  
  update(): void { /* 移動処理 */ }
}
```

### アンチパターンとしての側面

- **状態爆発**: 多すぎる状態は複雑化
- **if-else 地獄**: State パターンを使わず条件分岐で処理
- **遷移の複雑化**: 遷移ルールが複雑すぎると管理困難

現代のフロントエンドでは、XState のような状態管理ライブラリが複雑な状態遷移を扱います。