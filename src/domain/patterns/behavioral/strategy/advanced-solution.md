# 発展課題 模範解答

## 他の類似パターンとの違い

### State パターン
- **共通点**: 振る舞いを切り替える
- **違い**:
  - Strategy は「アルゴリズム」を外部から切り替える
  - State は「状態」によって振る舞いが変わる
- **使い分け**:
  - アルゴリズムの差し替え → Strategy
  - 状態遷移に伴う振る舞いの変化 → State

### Command パターン
- **共通点**: 操作をカプセル化
- **違い**:
  - Strategy は「やり方」を選択
  - Command は「何をするか」をカプセル化
- **使い分け**:
  - アルゴリズムの差し替え → Strategy
  - 操作の履歴・Undo → Command

### Template Method パターン
- **共通点**: アルゴリズムの構造を定義
- **違い**:
  - Strategy は「合成」で切り替える
  - Template Method は「継承」で拡張する
- **使い分け**:
  - 実行時に切り替えたい → Strategy
  - 骨組みが固定で詳細のみ変えたい → Template Method

### Bridge パターン
- **共通点**: 実装を切り替える
- **違い**:
  - Strategy は「振る舞い」の切り替え
  - Bridge は「構造」の分離
- **使い分け**:
  - アルゴリズムや戦略 → Strategy
  - プラットフォームやデバイス → Bridge

## 実務での応用例

### 使用シーン
- **ソートアルゴリズム**: 配列の並べ替え
- **支払い方法**: クレジット、PayPal、銀行振込
- **圧縮方式**: ZIP、RAR、GZIP
- **ルート検索**: 最短、風景優先、高速道路優先
- **バリデーション**: 異なる検証ルール

### 実装時の注意点

1. **基本構造**:
```typescript
interface Strategy {
  execute(data: any): any;
}

class Context {
  private strategy: Strategy;
  
  setStrategy(strategy: Strategy): void {
    this.strategy = strategy;
  }
  
  executeStrategy(data: any): any {
    return this.strategy.execute(data);
  }
}

class ConcreteStrategyA implements Strategy {
  execute(data: any): any {
    return `Strategy A: ${data}`;
  }
}
```

2. **実務例：支払い方法**:
```typescript
interface PaymentStrategy {
  pay(amount: number): boolean;
}

class CreditCardStrategy implements PaymentStrategy {
  constructor(
    private cardNumber: string,
    private cvv: string
  ) {}
  
  pay(amount: number): boolean {
    console.log(`${amount}円をクレジットカードで支払い`);
    return true;
  }
}

class PayPalStrategy implements PaymentStrategy {
  constructor(private email: string) {}
  
  pay(amount: number): boolean {
    console.log(`${amount}円をPayPalで支払い`);
    return true;
  }
}

class ShoppingCart {
  private paymentStrategy: PaymentStrategy;
  
  setPaymentStrategy(strategy: PaymentStrategy): void {
    this.paymentStrategy = strategy;
  }
  
  checkout(amount: number): boolean {
    return this.paymentStrategy.pay(amount);
  }
}

// 使用例
const cart = new ShoppingCart();
cart.setPaymentStrategy(new CreditCardStrategy('1234-5678-9012', '123'));
cart.checkout(1000);
```

3. **関数型アプローチ（TypeScript）**:
```typescript
type Strategy<T, R> = (input: T) => R;

class StrategyContext<T, R> {
  constructor(private strategy: Strategy<T, R>) {}
  
  setStrategy(strategy: Strategy<T, R>): void {
    this.strategy = strategy;
  }
  
  execute(input: T): R {
    return this.strategy(input);
  }
}

// 使用例
const sortStrategy: Strategy<number[], number[]> = (arr) => [...arr].sort((a, b) => a - b);
const reverseStrategy: Strategy<number[], number[]> = (arr) => [...arr].reverse();

const context = new StrategyContext(sortStrategy);
console.log(context.execute([3, 1, 2])); // [1, 2, 3]

context.setStrategy(reverseStrategy);
console.log(context.execute([1, 2, 3])); // [3, 2, 1]
```

### 戦略選択のパターン

```typescript
class StrategyFactory {
  private strategies: Map<string, Strategy> = new Map();
  
  register(name: string, strategy: Strategy): void {
    this.strategies.set(name, strategy);
  }
  
  get(name: string): Strategy {
    const strategy = this.strategies.get(name);
    if (!strategy) throw new Error(`Unknown strategy: ${name}`);
    return strategy;
  }
}

// 使用例
const factory = new StrategyFactory();
factory.register('sort', new SortStrategy());
factory.register('filter', new FilterStrategy());

const context = new Context();
context.setStrategy(factory.get('sort'));
```

### TypeScript での型安全性

```typescript
interface Strategy<T extends string> {
  type: T;
  execute(): void;
}

interface SortStrategy extends Strategy<'sort'> {
  data: number[];
  order: 'asc' | 'desc';
}

interface FilterStrategy extends Strategy<'filter'> {
  data: number[];
  predicate: (n: number) => boolean;
}

function execute<T extends string>(strategy: Strategy<T>): void {
  strategy.execute();
}
```

### アンチパターンとしての側面

- **過剰な Strategy**: 単純な処理に Strategy は不要
- **クライアントの負担**: Strategy 選択ロジックがクライアントに移る
- **Context の空虚化**: Context が単なる Strategy ホルダーになりがち

現代のフロントエンドでは、React Hooks や Dependency Injection が Strategy パターンの役割を果たすことが多いです。