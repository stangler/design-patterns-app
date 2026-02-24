# 発展課題 模範解答

---

## 📊 他の類似パターンとの違い

### パターン比較表

| パターン | 共通点 | 違い | 適用場面 |
|---------|--------|------|----------|
| **Decorator** | 同じインターフェース、再帰的構造 | Composite: 全体-部分の階層構造<br>Decorator: 機能の追加 | ツリー構造 → Composite<br>機能追加 → Decorator |
| **Iterator** | 複合オブジェクトを扱う | Composite: 構造の表現<br>Iterator: 走査方法 | 階層構造表現 → Composite<br>順次アクセス → Iterator |
| **Chain of Responsibility** | 再帰的な処理構造 | Composite: 構造の管理<br>Chain: 処理の委譲 | 階層的要素管理 → Composite<br>リクエスト委譲 → Chain |
| **Visitor** | 複雑なオブジェクト構造 | Composite: データ構造定義<br>Visitor: 操作の分離 | 階層的データ → Composite<br>操作追加 → Visitor |

---

## 💼 実務での応用例

| シーン | Leaf（葉） | Composite（複合） |
|--------|-----------|------------------|
| 📁 **ファイルシステム** | File | Folder |
| 🖼️ **GUIコンポーネント** | Button, TextField | Panel, Window |
| 🏢 **組織図** | Employee | Department |
| 📋 **メニュー** | MenuItem | Menu |
| 🎨 **グラフィックス** | Shape | Group |

---

## ⚠️ 実装時の注意点

### 透明性の確保

```typescript
// ✅ クライアントは Leaf と Composite を区別せず扱える
interface FileSystemItem {
  getName(): string;
  getSize(): number;
}

// Leaf（葉）
class File implements FileSystemItem {
  constructor(private name: string, private size: number) {}
  getName(): string { return this.name; }
  getSize(): number { return this.size; }
}

// Composite（複合）
class Folder implements FileSystemItem {
  private children: FileSystemItem[] = [];
  
  constructor(private name: string) {}
  
  add(item: FileSystemItem): void { this.children.push(item); }
  getName(): string { return this.name; }
  getSize(): number {
    return this.children.reduce((sum, c) => sum + c.getSize(), 0);
  }
}
```

---

## 🚫 アンチパターンとしての側面

| 問題 | 説明 | 対策 |
|------|------|------|
| **過剰な汎化** | すべてを Composite にする | 必要な場合のみ使う |
| **パフォーマンス** | 深い階層で再帰コスト | キャッシュを検討 |
| **型の問題** | Leaf に不要な操作を持たせる | 型ガードで安全に操作 |

---

## 💡 現代的なアプローチ

React コンポーネントツリーが Composite パターンの好例です。

```typescript
// React のコンポーネント構造
<Panel>           {/* Composite */}
  <Button />      {/* Leaf */}
  <TextInput />   {/* Leaf */}
  <Panel>         {/* Composite */}
    <Button />    {/* Leaf */}
  </Panel>
</Panel>