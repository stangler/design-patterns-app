# 発展課題 模範解答

---

## 📊 他の類似パターンとの違い

### パターン比較表

| パターン | 共通点 | 違い | 適用場面 |
|---------|--------|------|----------|
| **Facade** | 既存システムへの統一インターフェース | Adapter: インターフェースの変換<br>Facade: 複雑さの隠蔽 | インターフェース不一致 → Adapter<br>複雑な操作の簡素化 → Facade |
| **Decorator** | オブジェクトをラップする | Adapter: インターフェースを変換<br>Decorator: 機能を追加 | 異なるインターフェース統一 → Adapter<br>機能拡張 → Decorator |
| **Bridge** | 抽象と実装を分離 | Adapter: 事後的な統合<br>Bridge: 事前の設計 | 既存コード統合 → Adapter<br>最初から拡張性考慮 → Bridge |
| **Proxy** | オブジェクトをラップする | Adapter: 異なるインターフェース提供<br>Proxy: 同じインターフェース提供 | クライアント期待に合わせる → Adapter<br>アクセス制御・遅延読み込み → Proxy |

---

## 💼 実務での応用例

### 代表的な使用シーン

| シーン | 説明 | 具体例 |
|--------|------|--------|
| 🏛️ **レガシーコード統合** | 古いAPIと新コードの接続 | 旧システムとの互換性 |
| 📦 **サードパーティライブラリ** | 外部ライブラリの統一 | 支払い、認証サービス |
| 🗄️ **データベース** | 異なるDBドライバーの統一 | MySQL ↔ PostgreSQL |
| 🔌 **APIバージョニング** | 異なるバージョンの共存 | v1 API ↔ v2 API |

---

## ⚠️ 実装時の注意点

### 1. オブジェクトアダプター（推奨）

```typescript
// ✅ 合成を使用（柔軟・推奨）
class Adapter implements Target {
  private adaptee: Adaptee;
  
  constructor(adaptee: Adaptee) {
    this.adaptee = adaptee;
  }
  
  request(): string {
    return this.adaptee.specificRequest();
  }
}
```

### 2. 双方向アダプター

```typescript
// ✅ 両方向の変換をサポート
class BidirectionalAdapter implements Target, AdapteeInterface {
  private adaptee: Adaptee;
  
  // Target として振る舞う
  request(): string {
    return this.adaptee.specificRequest();
  }
  
  // Adaptee としても振る舞う
  specificRequest(): string {
    return 'adapted response';
  }
}
```

### 3. ファクトリでアダプター選択

```typescript
// ✅ 適切なアダプターを選択
class PaymentAdapterFactory {
  static create(provider: string): PaymentAdapter {
    switch (provider) {
      case 'stripe': return new StripeAdapter();
      case 'paypal': return new PayPalAdapter();
      default: throw new Error('Unknown provider');
    }
  }
}
```

---

## 📝 実装例：天気サービス

```typescript
// 既存の外部API
class LegacyWeatherService {
  getWeatherData(city: string): { temp: number; humidity: number } {
    return { temp: 25, humidity: 60 };
  }
}

// 新しいインターフェース
interface WeatherService {
  getTemperature(city: string): Promise<TemperatureInfo>;
}

// アダプター
class WeatherServiceAdapter implements WeatherService {
  constructor(private legacy: LegacyWeatherService) {}
  
  async getTemperature(city: string): Promise<TemperatureInfo> {
    const data = this.legacy.getWeatherData(city);
    return {
      celsius: data.temp,
      fahrenheit: data.temp * 1.8 + 32
    };
  }
}
```

---

## 🚫 アンチパターンとしての側面

| 問題 | 説明 | 対策 |
|------|------|------|
| **過剰なアダプター層** | 単純な変換に複雑な階層 | シンプルに保つ |
| **ファットアダプター** | ビジネスロジックを詰め込みすぎ | 変換のみに専念 |
| **漏れやすい抽象化** | 元の実装詳細が漏れる | インターフェース設計を見直す |

---

## 💡 現代的なアプローチ

TypeScript の型システムでコンパイル時にインターフェースの不一致を検出できます。

```typescript
// 型でインターフェースを強制
function adapt<T extends Target>(adaptee: Adaptee): T {
  return new Adapter(adaptee) as T;
}