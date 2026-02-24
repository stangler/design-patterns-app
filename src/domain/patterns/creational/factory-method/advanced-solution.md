# 発展課題 模範解答

---

## 📊 他の類似パターンとの違い

### パターン比較表

| パターン | 共通点 | 違い | 適用場面 |
|---------|--------|------|----------|
| **Abstract Factory** | オブジェクト生成を抽象化 | Factory Method: 1つの製品をサブクラスで決定<br>Abstract Factory: 関連する製品群を一貫して生成 | 単一オブジェクト生成 → Factory Method<br>製品群の統一 → Abstract Factory |
| **Builder** | オブジェクト生成をカプセル化 | Factory Method: どのクラスを作るか<br>Builder: どう組み立てるか | 単純な生成 → Factory Method<br>複雑な構築プロセス → Builder |
| **Prototype** | オブジェクト生成の柔軟性 | Factory Method: 新しいインスタンスを生成<br>Prototype: 既存インスタンスをコピー | クラスベース生成 → Factory Method<br>コストの高い初期化 → Prototype |
| **Simple Factory** | クライアントから生成ロジックを隠す | Factory Method: 継承でサブクラスが決定<br>Simple Factory: 1クラスで条件分岐 | 新製品追加時にファクトリ追加 → Factory Method<br>生成ロジック固定 → Simple Factory |

---

## 💼 実務での応用例

### 代表的な使用シーン

| シーン | 説明 | メリット |
|--------|------|----------|
| 🔌 **プラグインシステム** | プラグイン種類に応じたインスタンス生成 | 拡張性が高い |
| 🖼️ **フレームワーク** | フレームワークがサブクラスに生成を委譲 | カスタマイズ容易 |
| 📝 **ロギング** | ログ出力先の選択 | 環境に応じた切り替え |
| 🗄️ **データアクセス** | DB種類に応じたコネクション生成 | DB独立性 |

---

## ⚠️ 実装時の注意点

### 1. Creator と ConcreteCreator の設計

```typescript
// ✅ Creator はデフォルト実装を提供できる
abstract class Dialog {
  // Factory Method
  protected abstract createButton(): Button;
  
  // テンプレートメソッド
  public render(): void {
    const button = this.createButton();
    button.onClick(() => this.close());
    button.render();
  }
  
  protected close(): void {
    console.log('Dialog closed');
  }
}
```

### 2. パラメータ化されたファクトリメソッド

```typescript
// ✅ 文字列や列挙型で生成する型を指定
class UIFactory {
  static createButton(type: 'primary' | 'secondary' | 'danger'): Button {
    switch (type) {
      case 'primary': return new PrimaryButton();
      case 'secondary': return new SecondaryButton();
      case 'danger': return new DangerButton();
    }
  }
}
```

### 3. 開放閉鎖の原則（OCP）

> **ポイント**: 新しい製品を追加する際、Creator のサブクラスを追加するだけでよく、**既存コードを変更しない**

---

## 🚫 アンチパターンとしての側面

| 問題 | 説明 | 対策 |
|------|------|------|
| **過剰な階層** | 単純な生成のために深い継承階層を作る | 必要な場合のみ使う |
| **不要な抽象化** | 1種類しか作らないのに使う | パターンの適用を見直す |
| **違反のリスク** | クライアントが直接 `new` を呼ぶ | ファクトリ経由を徹底 |

---

## 💡 現代的なアプローチ

現代の開発では、DI コンテナ（InversifyJS、tsyringe など）が Factory Method の役割を担うことも多いですが、**フレームワーク設計やプラグインアーキテクチャ**では依然として重要なパターンです。

### 推奨パターン
- **DI コンテナ** で生成を管理
- **ファクトリ関数** でシンプルに実装
- **抽象ファクトリ** で製品群を管理