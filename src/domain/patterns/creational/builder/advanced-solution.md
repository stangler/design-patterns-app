# 発展課題 模範解答

---

## 📊 他の類似パターンとの違い

### パターン比較表

| パターン | 共通点 | 違い | 適用場面 |
|---------|--------|------|----------|
| **Factory Method** | オブジェクト生成をカプセル化 | Builder: 段階的な構築に注目<br>Factory: どのクラスを作るか | 多くのパラメータ → Builder<br>単純な生成 → Factory |
| **Prototype** | 複雑なオブジェクト生成 | Builder: ゼロから構築<br>Prototype: 既存をコピー | カスタマイズ構築 → Builder<br>既存ベースの複製 → Prototype |
| **Composite** | 複雑な構造を扱う | Builder: オブジェクトの構築<br>Composite: 構造の表現 | 階層構造の構築 → Builder で Composite を構築 |
| **Fluent Interface** | メソッドチェーンで設定 | Builder: 生成に特化したパターン<br>Fluent Interface: 一般的なAPI設計 | 生成プロセス管理 → Builder<br>読みやすいAPI → Fluent Interface |

---

## 💼 実務での応用例

### 代表的な使用シーン

| シーン | 説明 | 具体例 |
|--------|------|--------|
| ⚙️ **設定オブジェクト** | 多くのオプションを持つ設定 | HTTPClient, DB接続設定 |
| 📄 **ドキュメント生成** | HTML, PDF, レポートの構築 | レポートビルダー |
| 🗃️ **SQLクエリ** | 複雑なクエリの段階的構築 | QueryBuilder |
| 🧪 **テストデータ** | テスト用オブジェクトの柔軟な生成 | TestDataBuilder |
| 🎮 **ゲームキャラクター** | 装備、スキルの構築 | CharacterBuilder |

---

## ⚠️ 実装時の注意点

### 1. Director（監督者）の活用

```typescript
// ✅ Director は構築の手順を定義
class HouseDirector {
  constructor(private builder: HouseBuilder) {}
  
  buildSimpleHouse(): House {
    return this.builder
      .setWalls(4)
      .setRoof('simple')
      .build();
  }
  
  buildLuxuryHouse(): House {
    return this.builder
      .setWalls(8)
      .setRoof('dome')
      .setGarage(true)
      .setPool(true)
      .build();
  }
}
```

### 2. 不変性の確保

```typescript
// ✅ 構築後は変更不可にする
class ImmutableBuilder<T> {
  private parts: Partial<T> = {};
  
  set<K extends keyof T>(key: K, value: T[K]): this {
    this.parts[key] = value;
    return this;
  }
  
  build(): Readonly<T> {
    return Object.freeze({ ...this.parts }) as T;
  }
}
```

### 3. バリデーションの組み込み

```typescript
build(): User {
  if (!this.name) throw new Error('名前は必須です');
  if (this.age && this.age < 0) throw new Error('年齢は0以上で');
  return new User(this);
}
```

---

## 📝 実装例：クエリビルダー

```typescript
// ✅ 型安全な段階的ビルダー
class QueryBuilder {
  private query: string = '';
  
  select(columns: string): this {
    this.query += `SELECT ${columns}`;
    return this;
  }
  
  from(table: string): this {
    this.query += ` FROM ${table}`;
    return this;
  }
  
  where(condition: string): this {
    this.query += ` WHERE ${condition}`;
    return this;
  }
  
  build(): string {
    return this.query + ';';
  }
}

// 使用例
const query = new QueryBuilder()
  .select('*')
  .from('users')
  .where('active = true')
  .build();
```

---

## 🚫 アンチパターンとしての側面

| 問題 | 説明 | 対策 |
|------|------|------|
| **Telescoping Constructor** | 多くのコンストラクタ引数 | Builder で解決 |
| **過剰な Builder** | 単純なオブジェクトに使用 | 必要な場合のみ使う |
| **可変性の問題** | build() 後も Builder が再利用可能 | 適切に管理する |

---

## 💡 現代的なアプローチ

### オプションオブジェクトパターン

```typescript
// ✅ Builder の代わりにオプションオブジェクトも一般的
function createHttpClient(options: {
  baseUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
}) {
  // デフォルト値とマージ
  return { baseUrl: '', timeout: 5000, ...options };
}