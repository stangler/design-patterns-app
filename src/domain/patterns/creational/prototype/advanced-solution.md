# 発展課題 模範解答

---

## 📊 他の類似パターンとの違い

### パターン比較表

| パターン | 共通点 | 違い | 適用場面 |
|---------|--------|------|----------|
| **Factory Method** | オブジェクト生成を抽象化 | Prototype: コピーによる生成<br>Factory: 新規作成による生成 | 既存オブジェクトベース → Prototype<br>クラスから新規作成 → Factory |
| **Builder** | オブジェクト生成の柔軟性 | Prototype: 一度作ったものを複製<br>Builder: 段階的に構築 | 大量の同一オブジェクト → Prototype<br>構築プロセス重要 → Builder |
| **Flyweight** | オブジェクトの共有・複製 | Prototype: 複製して新オブジェクト<br>Flyweight: 同じオブジェクトを共有 | 独立した変更が必要 → Prototype<br>不変部分を共有 → Flyweight |
| **Command** | オブジェクトの複製をカプセル化 | Prototype: 生成に特化<br>Command: 操作のカプセル化 | 生成プロセスの一部 → Prototype<br>複製操作自体をオブジェクト化 → Command |

---

## 💼 実務での応用例

### 代表的な使用シーン

| シーン | 説明 | メリット |
|--------|------|----------|
| 🎨 **グラフィックエディタ** | 図形のコピー＆ペースト | 簡単な複製 |
| 🎮 **ゲーム** | 敵キャラクター、弾丸の大量生成 | パフォーマンス |
| 📄 **ドキュメント編集** | テンプレートからの新規作成 | 一貫性 |
| 💾 **キャッシュ** | データベース結果の複製 | 高速アクセス |
| ⚙️ **設定スナップショット** | 現在の設定を保存・復元 | 状態管理 |

---

## ⚠️ 実装時の注意点

### 1. シャローコピー vs ディープコピー

```typescript
// ⚠️ シャローコピー（参照を共有）
class ShallowPrototype {
  public nested: { value: number };
  
  clone(): ShallowPrototype {
    return Object.assign(new ShallowPrototype(), this);
  }
}

// ✅ ディープコピー（完全に独立）
class DeepPrototype {
  public nested: { value: number };
  
  clone(): DeepPrototype {
    const copy = new DeepPrototype();
    copy.nested = { ...this.nested }; // ネストもコピー
    return copy;
  }
}

// ✅ 構造化クローン（JavaScript 標準）
const deepCopy = structuredClone(original);
```

### 2. プロトタイプレジストリ

```typescript
// ✅ プロトタイプを管理するレジストリ
class PrototypeRegistry {
  private prototypes: Map<string, Cloneable<any>> = new Map();
  
  register(key: string, prototype: Cloneable<any>): void {
    this.prototypes.set(key, prototype);
  }
  
  create(key: string): Cloneable<any> | undefined {
    return this.prototypes.get(key)?.clone();
  }
}

// 使用例
const registry = new PrototypeRegistry();
registry.register('standard-contract', standardContract);
const newContract = registry.create('standard-contract');
```

### 3. TypeScript での実装

```typescript
interface Cloneable<T> {
  clone(): T;
}

class Document implements Cloneable<Document> {
  constructor(
    public title: string,
    public content: string[],
    public metadata: { author: string; date: Date }
  ) {}
  
  clone(): Document {
    return new Document(
      this.title,
      [...this.content],                    // 配列のコピー
      { ...this.metadata, date: new Date(this.metadata.date) }
    );
  }
}
```

---

## 📊 パフォーマンス比較

| 方法 | 特徴 | 適用場面 |
|------|------|----------|
| `Object.assign()` | シャローコピー | ネストなしのオブジェクト |
| スプレッド構文 | シャローコピー | 簡潔な記述 |
| `JSON.parse(JSON.stringify())` | ディープコピー | 関数・Date等は注意 |
| `structuredClone()` | ディープコピー | モダンな推奨方法 |

---

## 🚫 アンチパターンとしての側面

| 問題 | 説明 | 対策 |
|------|------|------|
| **循環参照** | 複製が難しい構造 | 設計を見直す |
| **過剰な複雑化** | 単純な `new` で十分 | 必要性を検討 |
| **隠れた依存** | コピー間で予期せぬ共有 | ディープコピーを使用 |

---

## 💡 現代的なアプローチ

JavaScript/TypeScript では以下の選択肢があります：

```typescript
// 推奨: structuredClone()（モダンブラウザ・Node.js）
const copy = structuredClone(original);

// ライブラリ: Lodash
import { cloneDeep } from 'lodash';
const copy = cloneDeep(original);