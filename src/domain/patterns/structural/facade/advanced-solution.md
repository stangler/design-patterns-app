# 発展課題 模範解答

---

## 📊 他の類似パターンとの違い

### パターン比較表

| パターン | 共通点 | 違い | 適用場面 |
|---------|--------|------|----------|
| **Adapter** | 複雑なサブシステムへのシンプルなインターフェース | Facade: 新しいインターフェース提供<br>Adapter: 既存インターフェースに合わせる | 複雑なシステムを簡単に → Facade<br>インターフェース不一致 → Adapter |
| **Mediator** | サブシステム間の通信を単純化 | Facade: 一方向のアクセス提供<br>Mediator: 双方向の調整 | 統一アクセス → Facade<br>オブジェクト間通信管理 → Mediator |
| **Abstract Factory** | クライアントから複雑さを隠す | Facade: 操作の簡素化<br>Abstract Factory: 生成の抽象化 | 一連の操作をまとめる → Facade<br>関連オブジェクト群生成 → Abstract Factory |
| **Decorator** | 機能を追加・変更する | Facade: 複雑さを減らす<br>Decorator: 機能を増やす | サブシステムへの窓口 → Facade<br>動的機能追加 → Decorator |

---

## 💼 実務での応用例

| シーン | Facadeが提供する機能 |
|--------|-------------------|
| 📦 **ライブラリカプセル化** | 複雑なAPIをシンプルに |
| 🗄️ **データベースアクセス** | 接続・クエリ・トランザクションをまとめる |
| 💳 **決済システム** | 複数の決済プロバイダーを統一 |
| 🔌 **APIクライアント** | 複数のエンドポイントをまとめる |

---

## ⚠️ 実装時の注意点

```typescript
// ✅ Facade はサブシステムを隠す必要はない
const facade = new VideoEditorFacade();
facade.createMP4WithSubtitles('video.avi', 'subs.srt');

// 必要に応じて直接アクセスも可能
const converter = new VideoConverter();
converter.convert('video.avi', 'webm');
```

---

## 🚫 アンチパターンとしての側面

| 問題 | 説明 | 対策 |
|------|------|------|
| **神オブジェクト** | Facadeに多くの責任を持たせる | 責任を適切に分割 |
| **密結合** | 特定の実装に依存しすぎる | インターフェースを使用 |
| **不要な Facade** | 単純なシステムに使用 | 必要性を検討 |

---

## 💡 現代的なアプローチ

Service Layer や Next.js の Server Actions も Facade の役割を果たします。