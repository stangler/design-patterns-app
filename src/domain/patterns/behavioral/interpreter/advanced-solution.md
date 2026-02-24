# 発展課題 模範解答

## 他の類似パターンとの違い

### Composite パターン
- **共通点**: ツリー構造を扱う
- **違い**:
  - Interpreter は「文法の解釈」が目的
  - Composite は「階層構造の表現」が目的
- **使い分け**:
  - 言語やルールの解析 → Interpreter
  - 階層的なデータ構造 → Composite

### Visitor パターン
- **共通点**: 構造に対する操作
- **違い**:
  - Interpreter は「構造を解釈」する
  - Visitor は「構造を走査」する
- **使い分け**:
  - 構文解析・評価 → Interpreter
  - 構造への操作追加 → Visitor

### Strategy パターン
- **共通点**: 振る舞いをカプセル化
- **違い**:
  - Interpreter は「言語の文法」を表現
  - Strategy は「アルゴリズム」を切り替え
- **使い分け**:
  - DSLやクエリ言語の解析 → Interpreter
  - アルゴリズムの差し替え → Strategy

### Command パターン
- **共通点**: 操作をオブジェクト化
- **違い**:
  - Interpreter は「文を解釈」する
  - Command は「操作を実行」する
- **使い分け**:
  - 文法規則に従った解析 → Interpreter
  - 操作のカプセル化 → Command

## 実務での応用例

### 使用シーン
- **DSL（ドメイン特化言語）**: 業務ルールの記述
- **設定言語**: YAML、JSON のような設定の解析
- **検索条件**: SQL の WHERE 句のような条件式
- **数式計算**: 電卓アプリの式評価
- **正規表現**: パターンマッチング（内部的に使用）

### 実装時の注意点

1. **抽象構文木（AST）の設計**:
```typescript
// 抽象式
interface Expression {
  interpret(context: Context): number;
}

// 終端式（数値）
class NumberExpression implements Expression {
  constructor(private value: number) {}
  
  interpret(context: Context): number {
    return this.value;
  }
}

// 非終端式（加算）
class AddExpression implements Expression {
  constructor(
    private left: Expression,
    private right: Expression
  ) {}
  
  interpret(context: Context): number {
    return this.left.interpret(context) + this.right.interpret(context);
  }
}

// 非終端式（減算）
class SubtractExpression implements Expression {
  constructor(
    private left: Expression,
    private right: Expression
  ) {}
  
  interpret(context: Context): number {
    return this.left.interpret(context) - this.right.interpret(context);
  }
}
```

2. **コンテキストの管理**:
```typescript
class Context {
  private variables: Map<string, number> = new Map();
  
  setVariable(name: string, value: number): void {
    this.variables.set(name, value);
  }
  
  getVariable(name: string): number {
    return this.variables.get(name) ?? 0;
  }
}

// 変数式
class VariableExpression implements Expression {
  constructor(private name: string) {}
  
  interpret(context: Context): number {
    return context.getVariable(this.name);
  }
}
```

3. **パーサーの実装**:
```typescript
class ExpressionParser {
  parse(input: string): Expression {
    const tokens = input.split(' ');
    return this.parseExpression(tokens);
  }
  
  private parseExpression(tokens: string[]): Expression {
    // 再帰下降パーサーの実装
    // 実際の実装はより複雑
  }
}

// 使用例
const context = new Context();
context.setVariable('x', 10);
context.setVariable('y', 5);

const expression = new AddExpression(
  new VariableExpression('x'),
  new VariableExpression('y')
);

console.log(expression.interpret(context)); // 15
```

### 実務例：検索条件パーサー

```typescript
interface Filter {
  match(item: any): boolean;
}

class EqualsFilter implements Filter {
  constructor(private field: string, private value: any) {}
  
  match(item: any): boolean {
    return item[this.field] === this.value;
  }
}

class AndFilter implements Filter {
  constructor(private filters: Filter[]) {}
  
  match(item: any): boolean {
    return this.filters.every(f => f.match(item));
  }
}

class OrFilter implements Filter {
  constructor(private filters: Filter[]) {}
  
  match(item: any): boolean {
    return this.filters.some(f => f.match(item));
  }
}

// 使用例: "status = 'active' AND (role = 'admin' OR role = 'manager')"
const filter = new AndFilter([
  new EqualsFilter('status', 'active'),
  new OrFilter([
    new EqualsFilter('role', 'admin'),
    new EqualsFilter('role', 'manager')
  ])
]);
```

### アンチパターンとしての側面

- **複雑すぎる文法**: Interpreter パターンは複雑な言語には不向き
- **パフォーマンス**: 簡単な処理でも多くのオブジェクトを生成
- **メンテナンス**: 文法規則の追加でクラスが増える

現代の開発では、Parser Generator（ANTLR、PEG.js）や既存の DSL エンジンを使うことが推奨されます。Interpreter パターンは単純な DSL や設定解析に限定して使用します。