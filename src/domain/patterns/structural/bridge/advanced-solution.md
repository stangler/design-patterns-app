# 発展課題 模範解答

---

## 📊 他の類似パターンとの違い

### パターン比較表

| パターン | 共通点 | 違い | 適用場面 |
|---------|--------|------|----------|
| **Adapter** | 抽象と実装を分離 | Bridge: 事前の設計で分離<br>Adapter: 事後的な統合で使用 | 最初から拡張性考慮 → Bridge<br>既存コード統合 → Adapter |
| **Strategy** | 実装を切り替え可能 | Bridge: 構造の分離（継承の代わりに合成）<br>Strategy: 振る舞いの切り替え | プラットフォーム等の実装違い → Bridge<br>アルゴリズム切り替え → Strategy |
| **State** | 実装を動的に切り替え | Bridge: 実装の種類を切り替え<br>State: 状態に応じた振る舞い切り替え | デバイス・レンダラ等 → Bridge<br>状態遷移 → State |
| **Template Method** | 抽象化と具象実装を分ける | Bridge: 合成で切り替え<br>Template Method: 継承で強制 | 実行時切り替え → Bridge<br>コンパイル時固定 → Template Method |

---

## 💼 実務での応用例

| シーン | 説明 | 抽象側 | 実装側 |
|--------|------|--------|--------|
| 🖥️ **クロスプラットフォームUI** | デバイスに応じたレンダリング | Shape, Widget | DrawAPI, Renderer |
| 🗄️ **データアクセス** | 異なるデータベース接続 | DAO, Repository | DBConnection |
| 🎮 **ゲームエンジン** | 異なる描画API | GameObject | OpenGL, DirectX |
| 📱 **モバイルアプリ** | プラットフォーム依存機能 | Notification | iOSNotifier, AndroidNotifier |

---

## ⚠️ 実装時の注意点

### 実装インターフェースの設計

```typescript
// ✅ 実装層のインターフェース
interface DrawAPI {
  drawCircle(x: number, y: number, radius: number): void;
}

// ✅ 抽象層
abstract class Shape {
  protected drawAPI: DrawAPI;
  
  constructor(drawAPI: DrawAPI) {
    this.drawAPI = drawAPI;
  }
  
  abstract draw(): void;
}

// ✅ 具体的な実装
class OpenGLDrawAPI implements DrawAPI {
  drawCircle(x, y, radius) {
    console.log(`OpenGL: Circle at (${x}, ${y})`);
  }
}

class DirectXDrawAPI implements DrawAPI {
  drawCircle(x, y, radius) {
    console.log(`DirectX: Circle at (${x}, ${y})`);
  }
}
```

---

## 🚫 アンチパターンとしての側面

| 問題 | 説明 | 対策 |
|------|------|------|
| **過剰な抽象化** | 1種類の実装しかない | 必要な場合のみ使う |
| **複雑すぎる階層** | 抽象と実装の階層が複雑 | シンプルに保つ |
| **YAGNI** | 将来の拡張が見込めない | 必要性を検討 |

---

## 💡 現代的なアプローチ

React の render props や hooks も Bridge パターンの変種と見なせます。

```typescript
// Render Props パターン
<DataFetcher render={(data) => <Display data={data} />} />