# 発展課題 模範解答

---

## 📊 他の類似パターンとの違い

### パターン比較表

| パターン | 共通点 | 違い | 適用場面 |
|---------|--------|------|----------|
| **Factory Method** | オブジェクト生成を抽象化 | Abstract Factory: 製品群を一貫して生成<br>Factory Method: 単一製品をサブクラスで決定 | GUI部品セット等の統一 → Abstract Factory<br>個別オブジェクト生成 → Factory Method |
| **Builder** | 複雑なオブジェクト生成を扱う | Abstract Factory: 製品の種類に注目<br>Builder: 構築プロセスに注目 | 異なるファミリーの製品 → Abstract Factory<br>段階的な構築 → Builder |
| **Prototype** | クライアントから具体的クラスを隠す | Abstract Factory: 新しいインスタンスを生成<br>Prototype: クローンで複製 | 製品ファミリーが固定 → Abstract Factory<br>動的に製品追加 → Prototype |
| **Facade** | サブシステムへの統一インターフェース | Abstract Factory: 生成に特化<br>Facade: 機能の単純化 | 生成の管理 → Abstract Factory<br>操作の簡素化 → Facade |

---

## 💼 実務での応用例

### 代表的な使用シーン

| シーン | 説明 | 製品群の例 |
|--------|------|------------|
| 🖥️ **クロスプラットフォームUI** | OS毎に異なるウィジェットセット | Button, TextBox, Window |
| 🗄️ **データベース独立性** | DB種類に応じた接続部品 | Connection, Command, Transaction |
| 🎨 **テーマシステム** | テーマ毎に異なるUI部品 | Color, Icon, Typography |
| 🎮 **マルチメディア** | OS毎に異なるレンダラ | AudioRenderer, VideoPlayer |

---

## ⚠️ 実装時の注意点

### 1. 製品の一貫性保証

```typescript
// ✅ 同じファクトリから作られた製品は相性が良い
const factory = new MacOSFactory();
const button = factory.createButton();    // Mac風ボタン
const checkbox = factory.createCheckbox(); // Mac風チェックボックス

// ❌ 異なるファクトリの製品を混ぜると不整合が起きる可能性
```

### 2. 静的ファクトリパターン

```typescript
// ✅ 設定ファイルベースでファクトリを選択
class GUIFactory {
  static getFactory(theme: string): AbstractGUIFactory {
    switch(theme) {
      case 'mac': return new MacOSFactory();
      case 'windows': return new WindowsFactory();
      default: throw new Error('Unknown theme');
    }
  }
}
```

### 3. 新しい製品の追加コスト

> **注意**: 新しい製品を追加すると、**すべてのファクトリ実装を修正**する必要がある

---

## 🔗 他パターンとの組み合わせ

| 組み合わせパターン | 用途 |
|-------------------|------|
| **Singleton** | ファクトリ自体を Singleton にする |
| **Factory Method** | 各製品の生成に Factory Method を使う |
| **Prototype** | ファクトリ内でプロトタイプを複製して生成 |

---

## 🚫 アンチパターンとしての側面

| 問題 | 説明 | 対策 |
|------|------|------|
| **過剰な抽象化** | 製品が1種類しかないのに使う | 必要性を検討する |
| **頻繁な製品追加** | 新製品追加で全ファクトリ修正 | インターフェース設計を見直す |
| **複雑すぎる階層** | 不必要に多くの抽象層 | シンプルに保つ |

---

## 💡 現代的なアプローチ

現代のフロントエンド開発では、**テーマプロバイダー**（React の ThemeProvider など）がこのパターンの役割を果たすことが多いです。

### 実装例（React）
```typescript
//ThemeProvider が Abstract Factory の役割
<ThemeContext.Provider value={darkTheme}>
  <App />
</ThemeContext.Provider>