# 発展課題 模範解答

---

## 📊 他の類似パターンとの違い

### パターン比較表

| パターン | 共通点 | 違い | 適用場面 |
|---------|--------|------|----------|
| **Monostate** | クラスのインスタンス間で状態を共有 | Singleton: インスタンスが1つだけ保証<br>Monostate: 複数インスタンス可能だが状態は共有 | インスタンスの一意性が重要 → Singleton<br>状態の共有だけが必要 → Monostate |
| **Factory Method** | オブジェクトの生成を管理 | Singleton: インスタンス数の制限<br>Factory Method: 生成の柔軟性 | Logger、Config等のグローバル管理 → Singleton<br>複数の具象クラスから選択 → Factory Method |
| **Dependency Injection** | オブジェクトの管理を一元化 | Singleton: クラス内で自分自身を管理<br>DI: 外部コンテナがライフサイクルを管理 | フレームワークを使わない小規模アプリ → Singleton<br>現代的なアプリケーション → DI 推奨 |

---

## 💼 実務での応用例

### 代表的な使用シーン

| シーン | 説明 | 具体例 |
|--------|------|--------|
| 🔴 **ロガー** | アプリ全体で単一のログファイルに書き込む | `Logger.getInstance().log(message)` |
| ⚙️ **設定管理** | 環境変数や設定ファイルを一度だけ読み込む | `Config.getInstance().get('db.host')` |
| 💾 **キャッシュ** | メモリキャッシュを一元管理する | `CacheManager.getInstance()` |
| 🗄️ **DB接続プール** | 接続リソースを一元管理する | `ConnectionPool.getInstance()` |

---

## ⚠️ 実装時の注意点

### 1. マルチスレッド対応

**二重チェックロッキングや Eager Initialization を検討する**

```typescript
// ✅ スレッドセーフな実装例（Eager Initialization）
class Singleton {
  private static instance: Singleton = new Singleton();
  
  private constructor() {}
  
  public static getInstance(): Singleton {
    return Singleton.instance;
  }
}
```

### 2. テストの困難さ

> **注意**: グローバル状態はテスト間で干渉する可能性があります

**対策:**
- テスト用のリセットメソッドを用意する
- または DI コンテナの使用を検討する

### 3. 密結合のリスク

Singleton への直接アクセスは密結合を生むため、**インターフェースを通じてアクセス**する設計にする

---

## 🚫 アンチパターンとしての側面

| 問題 | 説明 | 対策 |
|------|------|------|
| **神クラス** | Singleton が肥大化して「何でも屋」になりがち | 責任を適切に分割する |
| **隠れた依存** | コンストラクタから見えない依存関係が生まれる | インターフェース経由でアクセス |
| **並行性の問題** | 適切なロックなしでは競合状態が発生 | 適切な同期化を実装 |

---

## 💡 現代的なアプローチ

現代の開発では、Singleton パターンそのものより、**DI フレームワークによるスコープ管理**（`@Singleton` アノテーション等）を使うことが推奨されます。

### 推奨ライブラリ
- **InversifyJS** - TypeScript 用 DI コンテナ
- **tsyringe** - 軽量な DI ライブラリ
- **NestJS** - フレームワーク組み込みの DI