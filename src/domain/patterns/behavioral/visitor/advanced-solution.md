# 発展課題 模範解答

## 他の類似パターンとの違い

### Strategy パターン
- **共通点**: 振る舞いを分離する
- **違い**:
  - Visitor は「データ構造への操作」を分離
  - Strategy は「アルゴリズムの切り替え」が目的
- **使い分け**:
  - 複雑なデータ構造への新しい操作追加 → Visitor
  - アルゴリズムの差し替え → Strategy

### Command パターン
- **共通点**: 操作をカプセル化
- **違い**:
  - Visitor は「データ構造を走査」
  - Command は「操作をオブジェクト化」
- **使い分け**:
  - 階層構造への操作 → Visitor
  - 操作の履歴・Undo → Command

### Iterator パターン
- **共通点**: 構造を走査する
- **違い**:
  - Visitor は「各要素への操作」を実行
  - Iterator は「順次アクセス」を提供
- **使い分け**:
  - 要素ごとに異なる処理 → Visitor
  - 順序よくアクセス → Iterator

### Interpreter パターン
- **共通点**: 構造に対する操作
- **違い**:
  - Visitor は「既存構造への操作追加」
  - Interpreter は「文法の解釈」
- **使い分け**:
  - 新しい操作の追加 → Visitor
  - DSLの解析 → Interpreter

## 実務での応用例

### 使用シーン
- **コンパイラ**: AST（抽象構文木）の走査
- **ドキュメント処理**: HTML/XML の変換
- **コード解析**: リンター、フォーマッター
- **レポート生成**: 異なる形式での出力
- **シリアライゼーション**: JSON/XML/YAML 変換

### 実装時の注意点

1. **基本構造**:
```typescript
interface Visitor {
  visitConcreteElementA(element: ConcreteElementA): void;
  visitConcreteElementB(element: ConcreteElementB): void;
}

interface Element {
  accept(visitor: Visitor): void;
}

class ConcreteElementA implements Element {
  accept(visitor: Visitor): void {
    visitor.visitConcreteElementA(this);
  }
  
  operationA(): string {
    return 'Element A';
  }
}

class ConcreteElementB implements Element {
  accept(visitor: Visitor): void {
    visitor.visitConcreteElementB(this);
  }
  
  operationB(): string {
    return 'Element B';
  }
}
```

2. **複雑な構造の走査**:
```typescript
interface DocumentVisitor {
  visitParagraph(paragraph: Paragraph): void;
  visitHeading(heading: Heading): void;
  visitList(list: List): void;
}

abstract class DocumentElement {
  abstract accept(visitor: DocumentVisitor): void;
}

class Paragraph extends DocumentElement {
  constructor(public text: string) { super(); }
  
  accept(visitor: DocumentVisitor): void {
    visitor.visitParagraph(this);
  }
}

class Heading extends DocumentElement {
  constructor(public text: string, public level: number) { super(); }
  
  accept(visitor: DocumentVisitor): void {
    visitor.visitHeading(this);
  }
}

class Document {
  constructor(private elements: DocumentElement[]) {}
  
  accept(visitor: DocumentVisitor): void {
    this.elements.forEach(el => el.accept(visitor));
  }
}
```

3. **複数のビジター実装**:
```typescript
// HTML 出力ビジター
class HTMLVisitor implements DocumentVisitor {
  private html: string = '';
  
  visitParagraph(paragraph: Paragraph): void {
    this.html += `<p>${paragraph.text}</p>\n`;
  }
  
  visitHeading(heading: Heading): void {
    this.html += `<h${heading.level}>${heading.text}</h${heading.level}>\n`;
  }
  
  visitList(list: List): void {
    this.html += `<ul>${list.items.map(i => `<li>${i}</li>`).join('')}</ul>\n`;
  }
  
  getHTML(): string {
    return this.html;
  }
}

// Markdown 出力ビジター
class MarkdownVisitor implements DocumentVisitor {
  private markdown: string = '';
  
  visitParagraph(paragraph: Paragraph): void {
    this.markdown += `${paragraph.text}\n\n`;
  }
  
  visitHeading(heading: Heading): void {
    const prefix = '#'.repeat(heading.level);
    this.markdown += `${prefix} ${heading.text}\n\n`;
  }
  
  getMarkdown(): string {
    return this.markdown;
  }
}
```

### 実務例：コード解析

```typescript
interface ASTNode {
  accept(visitor: ASTVisitor): void;
}

class BinaryExpression implements ASTNode {
  constructor(
    public left: ASTNode,
    public operator: string,
    public right: ASTNode
  ) {}
  
  accept(visitor: ASTVisitor): void {
    visitor.visitBinaryExpression(this);
  }
}

class NumberLiteral implements ASTNode {
  constructor(public value: number) {}
  
  accept(visitor: ASTVisitor): void {
    visitor.visitNumberLiteral(this);
  }
}

interface ASTVisitor {
  visitBinaryExpression(expr: BinaryExpression): void;
  visitNumberLiteral(literal: NumberLiteral): void;
}

// 評価ビジター
class EvaluatorVisitor implements ASTVisitor {
  private result: number = 0;
  private stack: number[] = [];
  
  visitBinaryExpression(expr: BinaryExpression): void {
    expr.left.accept(this);
    expr.right.accept(this);
    const right = this.stack.pop()!;
    const left = this.stack.pop()!;
    
    switch (expr.operator) {
      case '+': this.stack.push(left + right); break;
      case '-': this.stack.push(left - right); break;
      case '*': this.stack.push(left * right); break;
    }
  }
  
  visitNumberLiteral(literal: NumberLiteral): void {
    this.stack.push(literal.value);
  }
  
  getResult(): number {
    return this.stack[0];
  }
}
```

### アンチパターンとしての側面

- **要素追加の困難さ**: 新しい Element を追加すると全 Visitor を修正
- **カプセル化違反**: Visitor が Element の内部詳細にアクセス
- **複雑すぎる構造**: 単純な構造に Visitor は過剰

現代の開発では、パターンマッチング（TypeScript の判別付きユニオン）や関数型アプローチが好まれる傾向があります。