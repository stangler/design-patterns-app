# 発展課題 模範解答

## 他の類似パターンとの違い

### Composite パターン
- **共通点**: コレクション構造を扱う
- **違い**:
  - Iterator は「要素へのアクセス方法」を提供
  - Composite は「階層構造の表現」が目的
- **使い分け**:
  - 順序よく要素にアクセス → Iterator
  - ツリー構造を表現 → Composite
- **組み合わせ**: Composite 構造を Iterator で走査できる

### Visitor パターン
- **共通点**: 構造に対する操作
- **違い**:
  - Iterator は「アクセスの制御」
  - Visitor は「操作の分離」
- **使い分け**:
  - 順次アクセス → Iterator
  - 各要素への異なる操作 → Visitor

### Factory Method パターン
- **共通点**: オブジェクト生成をカプセル化
- **違い**:
  - Iterator は「アクセスオブジェクト」の生成
  - Factory Method は「製品オブジェクト」の生成
- **使い分け**:
  - コレクションが Iterator の生成を担当する場合、Factory Method を使用

### Memento パターン
- **共通点**: 状態の管理
- **違い**:
  - Iterator は「現在位置」を管理
  - Memento は「状態の保存・復元」
- **使い分け**:
  - 走査位置の追跡 → Iterator
  - スナップショット → Memento

## 実務での応用例

### 使用シーン
- **コレクション走査**: 配列、リスト、ツリーなど
- **データベース**: クエリ結果の逐次アクセス
- **ファイルシステム**: ディレクトリ内容の走査
- **ストリーミング**: 大きなデータの逐次処理
- **ページネーション**: データの分割表示

### 実装時の注意点

1. **基本構造**:
```typescript
interface Iterator<T> {
  current(): T;
  next(): T;
  hasNext(): boolean;
}

interface Aggregate<T> {
  createIterator(): Iterator<T>;
}

class ArrayIterator<T> implements Iterator<T> {
  private index: number = 0;
  
  constructor(private items: T[]) {}
  
  current(): T {
    return this.items[this.index];
  }
  
  next(): T {
    return this.items[this.index++];
  }
  
  hasNext(): boolean {
    return this.index < this.items.length;
  }
}
```

2. **外部イテレータ vs 内部イテレータ**:
```typescript
// 外部イテレータ（クライアントが制御）
const iterator = collection.createIterator();
while (iterator.hasNext()) {
  const item = iterator.next();
  // クライアントが処理
}

// 内部イテレータ（コレクションが制御）
class InternalIterator<T> {
  forEach(callback: (item: T) => void): void {
    for (const item of this.items) {
      callback(item);
    }
  }
}
```

3. **双方向イテレータ**:
```typescript
interface BidirectionalIterator<T> extends Iterator<T> {
  previous(): T;
  hasPrevious(): boolean;
  reset(): void;
}

class ArrayBidirectionalIterator<T> implements BidirectionalIterator<T> {
  private index: number = 0;
  
  constructor(private items: T[]) {}
  
  previous(): T {
    return this.items[this.index--];
  }
  
  hasPrevious(): boolean {
    return this.index > 0;
  }
  
  reset(): void {
    this.index = 0;
  }
}
```

### JavaScript/TypeScript での実装

```typescript
// Symbol.iterator を使用したカスタムイテレータ
class Range implements Iterable<number> {
  constructor(
    private start: number,
    private end: number,
    private step: number = 1
  ) {}
  
  [Symbol.iterator](): Iterator<number> {
    let current = this.start;
    
    return {
      next: (): IteratorResult<number> => {
        if (current < this.end) {
          const value = current;
          current += this.step;
          return { value, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
}

// for...of で使用可能
for (const n of new Range(0, 10, 2)) {
  console.log(n); // 0, 2, 4, 6, 8
}
```

### ジェネレーターを使った実装

```typescript
// ジェネレーター関数でイテレータを簡潔に実装
function* fibonacci(): Generator<number> {
  let a = 0, b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// 使用例
const fib = fibonacci();
for (let i = 0; i < 10; i++) {
  console.log(fib.next().value); // 0, 1, 1, 2, 3, 5, 8, 13, 21, 34
}
```

### アンチパターンとしての側面

- **過剰な抽象化**: 単純な配列に Iterator パターンを使わない
- **並行性の問題**: 複数のイテレータが同時にコレクションを変更
- **パフォーマンス**: インデックスアクセスより遅い可能性

現代の JavaScript/TypeScript では、組み込みの Iterator/Iterable プロトコルと for...of 構文がこのパターンを言語レベルでサポートしています。