# 発展課題 模範解答

---

## 📊 他の類似パターンとの違い

### パターン比較表

| パターン | 共通点 | 違い | 適用場面 |
|---------|--------|------|----------|
| **Adapter** | オブジェクトをラップする | Decorator: 同じインターフェース維持で機能追加<br>Adapter: 異なるインターフェースに変換 | 機能拡張 → Decorator<br>インターフェース統一 → Adapter |
| **Composite** | 同じインターフェース、再帰的構造 | Decorator: 単一オブジェクトをラップ<br>Composite: 複数オブジェクトを管理 | 機能追加 → Decorator<br>階層構造 → Composite |
| **Proxy** | オブジェクトをラップし同じインターフェース提供 | Decorator: 機能追加が目的<br>Proxy: アクセス制御・最適化 | 新しい振る舞い追加 → Decorator<br>遅延読み込み・アクセス制御 → Proxy |
| **Chain of Responsibility** | オブジェクトのチェーン構造 | Decorator: 全員が処理担当<br>Chain: 誰か一人が処理 | 段階的機能追加 → Decorator<br>処理委譲 → Chain |

---

## 💼 実務での応用例

| シーン | ベースコンポーネント | デコレーター |
|--------|-------------------|-------------|
| ☕ **コーヒーショップ** | SimpleCoffee | MilkDecorator, SugarDecorator |
| 📦 **I/Oストリーム** | InputStream | BufferedReader, DataInputStream |
| 🌐 **Webミドルウェア** | RequestHandler | Logger, Auth, Compression |
| 🔔 **通知システム** | Notifier | EmailNotifier, SMSNotifier |

---

## ⚠️ 実装時の注意点

### 基本構造

```typescript
// ✅ コンポーネントインターフェース
interface Coffee {
  getCost(): number;
  getDescription(): string;
}

// ✅ ベースデコレーター
abstract class CoffeeDecorator implements Coffee {
  constructor(protected coffee: Coffee) {}
}

// ✅ 具体デコレーター
class MilkDecorator extends CoffeeDecorator {
  getCost(): number { return this.coffee.getCost() + 30; }
  getDescription(): string { return `${this.coffee.getDescription()} + ミルク`; }
}

// 使用例
let coffee: Coffee = new SimpleCoffee();
coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);
```

---

## 🚫 アンチパターンとしての側面

| 問題 | 説明 | 対策 |
|------|------|------|
| **デコレーターの爆発** | 組み合わせが多すぎて複雑化 | 必要な組み合わせのみ作成 |
| **順序依存** | 適用順序で結果が変わる | 順序をドキュメント化 |
| **デバッグ困難** | 多層ラッパーで問題特定困難 | ログ出力を追加 |

---

## 💡 現代的なアプローチ

Higher-Order Components (HOC) や React Hooks が Decorator パターンの変種です。

```typescript
// React HOC
const withLogging = (Component) => (props) => {
  console.log('Render');
  return <Component {...props} />;
};