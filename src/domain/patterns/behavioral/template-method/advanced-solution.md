# 発展課題 模範解答

## 他の類似パターンとの違い

### Strategy パターン
- **共通点**: アルゴリズムの構造を定義
- **違い**:
  - Template Method は「継承」で拡張する
  - Strategy は「合成」で切り替える
- **使い分け**:
  - 骨組みが固定で詳細のみ変えたい → Template Method
  - 実行時にアルゴリズム全体を切り替えたい → Strategy

### Factory Method パターン
- **共通点**: 継承を使い、サブクラスで実装を決定
- **違い**:
  - Template Method は「アルゴリズムの骨組み」を定義
  - Factory Method は「オブジェクト生成」に特化
- **使い分け**:
  - 処理の流れの定義 → Template Method
  - 生成ロジックの委譲 → Factory Method

### State パターン
- **共通点**: 振る舞いの切り替え
- **違い**:
  - Template Method は「コンパイル時に決定」
  - State は「実行時に切り替え」
- **使い分け**:
  - 固定された処理の流れ → Template Method
  - 状態遷移による振る舞いの変化 → State

### Builder パターン
- **共通点**: 段階的な処理
- **違い**:
  - Template Method は「継承ベース」
  - Builder は「合成ベース」
- **使い分け**:
  - 処理の流れが決まっている → Template Method
  - 柔軟な構築手順 → Builder

## 実務での応用例

### 使用シーン
- **データ処理パイプライン**: 読み込み→変換→出力
- **レポート生成**: ヘッダー→本文→フッター
- **フレームワーク**: ライフサイクルメソッド
- **テスト**: セットアップ→実行→検証→クリーンアップ
- **ファイル変換**: 読み込み→パース→処理→書き込み

### 実装時の注意点

1. **基本構造**:
```typescript
abstract class DataProcessor {
  // Template Method（final に相当）
  public process(data: string): string {
    const read = this.read(data);
    const parsed = this.parse(read);
    const processed = this.transform(parsed);
    return this.output(processed);
  }
  
  // 具象メソッド（共通処理）
  protected read(data: string): string {
    console.log('データを読み込み中...');
    return data;
  }
  
  // 抽象メソッド（サブクラスで実装）
  protected abstract parse(data: string): any;
  protected abstract transform(data: any): any;
  
  // フックメソッド（オプション）
  protected output(data: any): string {
    return JSON.stringify(data);
  }
}
```

2. **具体実装例**:
```typescript
class JSONProcessor extends DataProcessor {
  protected parse(data: string): any {
    return JSON.parse(data);
  }
  
  protected transform(data: any): any {
    return { processed: true, data };
  }
}

class XMLProcessor extends DataProcessor {
  protected parse(data: string): any {
    // XML パース処理
    return { xml: data };
  }
  
  protected transform(data: any): any {
    return { processed: true, xmlData: data };
  }
  
  protected output(data: any): string {
    return `<result>${JSON.stringify(data)}</result>`;
  }
}
```

3. **フックメソッドの活用**:
```typescript
abstract class ReportGenerator {
  public generate(): string {
    this.beforeGenerate();
    const report = this.buildReport();
    this.afterGenerate();
    return report;
  }
  
  protected beforeGenerate(): void {
    // デフォルトは空、必要ならオーバーライド
  }
  
  protected abstract buildReport(): string;
  
  protected afterGenerate(): void {
    // デフォルトは空、必要ならオーバーライド
  }
}
```

### 実務例：Webフレームワーク

```typescript
abstract class Controller {
  // Template Method
  public async handleRequest(req: Request, res: Response): Promise<void> {
    try {
      await this.authenticate(req);
      const validated = await this.validate(req);
      const result = await this.execute(validated);
      await this.respond(res, result);
    } catch (error) {
      await this.handleError(res, error);
    }
  }
  
  protected async authenticate(req: Request): Promise<void> {
    // デフォルトの認証処理
  }
  
  protected abstract validate(req: Request): Promise<any>;
  protected abstract execute(data: any): Promise<any>;
  
  protected async respond(res: Response, data: any): Promise<void> {
    res.json(data);
  }
  
  protected async handleError(res: Response, error: any): Promise<void> {
    res.status(500).json({ error: error.message });
  }
}
```

### React でのパターン

```typescript
// React のコンポーネントライフサイクルも Template Method
abstract class DataComponent<P, S> extends React.Component<P, S> {
  componentDidMount(): void {
    this.fetchData();
  }
  
  async fetchData(): Promise<void> {
    this.setState({ loading: true });
    try {
      const data = await this.getData();
      this.setState({ data, loading: false });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  }
  
  protected abstract getData(): Promise<any>;
  
  render(): React.ReactNode {
    return this.renderContent();
  }
  
  protected abstract renderContent(): React.ReactNode;
}
```

### アンチパターンとしての側面

- **継承の制限**: 単一継承のみサポート言語で制約
- **Liskov の置換原則違反**: サブクラスで親の振る舞いを変える
- **フックの乱用**: 多すぎるフックは複雑化

現代の開発では、関数型プログラミングや Composition over Inheritance の原則により、Strategy パターンや高階関数が好まれる傾向があります。