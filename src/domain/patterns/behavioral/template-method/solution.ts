// Template Method パターン: アルゴリズムの骨組みを定義

/**
 * Abstract Class: アルゴリズムの骨組み
 */
export abstract class DataMiner {
  // Template Method: アルゴリズムの構造を定義
  public mine(path: string): string {
    const steps: string[] = [];
    
    steps.push(this.openFile(path));
    steps.push(this.extractData());
    steps.push(this.parseData());
    steps.push(this.analyzeData());
    steps.push(this.sendReport());
    steps.push(this.closeFile());
    
    return steps.join('\n');
  }

  // 抽象メソッド: サブクラスで実装
  protected abstract openFile(path: string): string;
  protected abstract extractData(): string;
  protected abstract closeFile(): string;

  // 具象メソッド: 共通の実装
  protected parseData(): string {
    return '📊 データを解析中...';
  }

  protected analyzeData(): string {
    return '🔍 データを分析中...';
  }

  protected sendReport(): string {
    return '📧 レポートを送信中...';
  }
}

/**
 * Concrete Classes: 具体的な実装
 */
export class PDFMiner extends DataMiner {
  protected openFile(path: string): string {
    return `📄 PDFファイルを開く: ${path}`;
  }

  protected extractData(): string {
    return '📝 PDFからテキストを抽出中...';
  }

  protected closeFile(): string {
    return '📄 PDFファイルを閉じる';
  }

  // フック: PDF特有の処理を追加
  protected parseData(): string {
    return '📊 PDFデータを解析中（OCR処理含む）...';
  }
}

export class CSVMiner extends DataMiner {
  protected openFile(path: string): string {
    return `📋 CSVファイルを開く: ${path}`;
  }

  protected extractData(): string {
    return '📝 CSVからデータを読み込み中...';
  }

  protected closeFile(): string {
    return '📋 CSVファイルを閉じる';
  }
}

export class JSONMiner extends DataMiner {
  protected openFile(path: string): string {
    return `📦 JSONファイルを開く: ${path}`;
  }

  protected extractData(): string {
    return '📝 JSONからデータをパース中...';
  }

  protected closeFile(): string {
    return '📦 JSONファイルを閉じる';
  }

  // JSON特有の分析
  protected analyzeData(): string {
    return '🔍 JSON構造を分析中（ネスト深度計算）...';
  }
}

/**
 * 別の例: ゲームキャラクターのアクション
 */
export abstract class GameCharacter {
  public performAttack(): string {
    const steps: string[] = [];
    steps.push(this.prepare());
    steps.push(this.attack());
    steps.push(this.recover());
    return steps.join('\n');
  }

  protected prepare(): string {
    return '⚔️ 構えをとる';
  }

  protected abstract attack(): string;

  protected recover(): string {
    return '🛡️ 元の姿勢に戻る';
  }
}

export class Warrior extends GameCharacter {
  protected attack(): string {
    return '⚔️ 剣で強攻撃！';
  }
}

export class Mage extends GameCharacter {
  protected prepare(): string {
    return '✨ 魔法を詠唱中...';
  }

  protected attack(): string {
    return '🔥 ファイアボール！';
  }

  protected recover(): string {
    return '💨 MPを回復中...';
  }
}

export class Archer extends GameCharacter {
  protected attack(): string {
    return '🏹 矢を放つ！';
  }
}

// 使用例
console.log('=== データマイニング ===');
const pdfMiner = new PDFMiner();
console.log(pdfMiner.mine('document.pdf'));

console.log('\n---');
const csvMiner = new CSVMiner();
console.log(csvMiner.mine('data.csv'));

console.log('\n---');
const jsonMiner = new JSONMiner();
console.log(jsonMiner.mine('config.json'));

console.log('\n=== ゲームキャラクター ===');
const warrior = new Warrior();
const mage = new Mage();
const archer = new Archer();

console.log('【戦士】');
console.log(warrior.performAttack());

console.log('\n【魔道士】');
console.log(mage.performAttack());

console.log('\n【弓使い】');
console.log(archer.performAttack());