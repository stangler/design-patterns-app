# 発展課題 模範解答

---

## 📊 他の類似パターンとの違い

### パターン比較表

| パターン | 共通点 | 違い | 適用場面 |
|---------|--------|------|----------|
| **Prototype** | オブジェクトの共有・複製 | Flyweight: 同じオブジェクトを共有<br>Prototype: 複製して新オブジェクト作成 | 大量の同一オブジェクト → Flyweight<br>カスタマイズ複製 → Prototype |
| **Composite** | 多くのオブジェクトを扱う | Flyweight: 共有による最適化<br>Composite: 階層構造の表現 | メモリ最適化 → Flyweight<br>ツリー構造 → Composite |
| **Singleton** | オブジェクトの共有 | Flyweight: 種類ごとに共有<br>Singleton: クラスに対して1つ | 同じ状態の複数インスタンス → Flyweight<br>グローバル唯一インスタンス → Singleton |
| **State** | 状態を共有できる | Flyweight: 不変データの共有<br>State: 振る舞いの切り替え | 大量データ最適化 → Flyweight<br>状態遷移管理 → State |

---

## 💼 実務での応用例

| シーン | 共有状態（Flyweight） | 固有状態 |
|--------|---------------------|----------|
| 🎮 **ゲーム** | キャラクター種別、テクスチャ | 座標、HP |
| 🗺️ **地図アプリ** | アイコン画像、色 | 位置、サイズ |
| 📝 **テキストエディタ** | フォント情報 | 文字、位置 |
| 🌳 **森林シミュレーション** | TreeType（名前、色、テクスチャ） | 座標 |

---

## ⚠️ 実装時の注意点

### 固有状態と共有状態の分離
```typescript
// ✅ 共有状態（不変）
interface TreeType {
  name: string;
  color: string;
  texture: string;
}

// ✅ Flyweight ファクトリ
class TreeFactory {
  private static treeTypes: Map<string, TreeType> = new Map();
  
  static getTreeType(name: string, color: string, texture: string): TreeType {
    const key = `${name}-${color}-${texture}`;
    if (!this.treeTypes.has(key)) {
      this.treeTypes.set(key, { name, color, texture });
    }
    return this.treeTypes.get(key)!;
  }
}
```

---

## 🚫 アンチパターンとしての側面
| 問題 | 説明 | 対策 |
|------|------|------|
| **過剰な最適化** | メモリが問題でない場合は不要 | 必要な場合のみ使用 |
| **複雑さの増加** | 状態分離ロジックが複雑 | デメリットを評価 |

---

## 💡 現代的なアプローチ
React の memo も概念としては Flyweight に近いです。