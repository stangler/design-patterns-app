// Flyweight パターン: 共有によりメモリ使用量を削減

/**
 * Flyweight: 共有可能な固有状態（intrinsic state）
 */
export interface CharacterStyle {
  font: string;
  size: number;
  color: string;
  bold: boolean;
  italic: boolean;
  getStyleInfo(): string;
}

/**
 * Concrete Flyweight: 文字スタイル（共有される）
 */
export class CharacterStyleImpl implements CharacterStyle {
  constructor(
    public readonly font: string,
    public readonly size: number,
    public readonly color: string,
    public readonly bold: boolean,
    public readonly italic: boolean
  ) {}

  public getStyleInfo(): string {
    const weight = this.bold ? '太字' : '通常';
    const style = this.italic ? 'イタリック' : '';
    return `${this.font} ${this.size}px ${this.color} (${weight}${style})`;
  }
}

/**
 * Flyweight Factory: 既存のスタイルを再利用
 */
export class StyleFactory {
  private static styles: Map<string, CharacterStyleImpl> = new Map();

  public static getStyle(
    font: string,
    size: number,
    color: string,
    bold: boolean = false,
    italic: boolean = false
  ): CharacterStyleImpl {
    // 一意なキーを生成
    const key = `${font}-${size}-${color}-${bold}-${italic}`;

    // 既存のスタイルがあれば再利用
    let style = this.styles.get(key);
    if (!style) {
      style = new CharacterStyleImpl(font, size, color, bold, italic);
      this.styles.set(key, style);
      console.log(`新しいスタイルを作成: ${key}`);
    }

    return style;
  }

  public static getStyleCount(): number {
    return this.styles.size;
  }
}

/**
 * Context: 外部状態（extrinsic state）を保持
 */
export class Character {
  constructor(
    private readonly char: string,        // 外部状態: 文字そのもの
    private readonly position: number,    // 外部状態: 位置
    private readonly style: CharacterStyle  // 内部状態: 共有されるスタイル
  ) {}

  public render(): string {
    return `'${this.char}' at position ${this.position} [${this.style.getStyleInfo()}]`;
  }
}

/**
 * Client: テキストエディタをシミュレート
 */
export class TextEditor {
  private characters: Character[] = [];

  public addCharacter(char: string, position: number, style: CharacterStyle): void {
    this.characters.push(new Character(char, position, style));
  }

  public render(): string {
    return this.characters.map(c => c.render()).join('\n');
  }
}

// 使用例
const editor = new TextEditor();

// 同じスタイルを共有（新しいスタイルは作成されない）
const normalStyle = StyleFactory.getStyle('メイリオ', 12, 'black');
const boldStyle = StyleFactory.getStyle('メイリオ', 12, 'black', true);
const italicStyle = StyleFactory.getStyle('メイリオ', 12, 'black', false, true);

// 多くの文字を追加
editor.addCharacter('こ', 0, normalStyle);
editor.addCharacter('ん', 1, normalStyle);
editor.addCharacter('に', 2, normalStyle);
editor.addCharacter('ち', 3, normalStyle);
editor.addCharacter('は', 4, normalStyle);
editor.addCharacter('！', 5, boldStyle);

editor.addCharacter('世', 10, italicStyle);
editor.addCharacter('界', 11, italicStyle);

console.log(editor.render());
console.log(`\n作成されたスタイル数: ${StyleFactory.getStyleCount()}`); // 3つのみ
// 7つの文字を追加したが、スタイルは3つしか作成されていない
// 100万文字あっても、スタイルの種類が3つなら3つしか作成されない