// Prototype パターン: 既存のオブジェクトをコピーして新しいオブジェクトを生成

/**
 * Prototype: クローンメソッドのインターフェース
 */
export interface Cloneable<T> {
  clone(): T;
}

/**
 * Concrete Prototype: 図形クラス
 */
export class Shape implements Cloneable<Shape> {
  constructor(
    public type: string,
    public color: string,
    public x: number,
    public y: number
  ) {}

  public clone(): Shape {
    // 浅いコピー（プリミティブ型のみの場合）
    return new Shape(this.type, this.color, this.x, this.y);
  }

  public draw(): string {
    return `${this.color}の${this.type}を座標(${this.x}, ${this.y})に描画`;
  }
}

/**
 * Concrete Prototype: 複雑なオブジェクト（深いコピーの例）
 */
export class Character implements Cloneable<Character> {
  constructor(
    public name: string,
    public level: number,
    public inventory: string[],
    public stats: { hp: number; mp: number; attack: number }
  ) {}

  public clone(): Character {
    // 深いコピー: 参照型のプロパティも複製
    return new Character(
      this.name,
      this.level,
      [...this.inventory], // 配列のコピー
      { ...this.stats }    // オブジェクトのコピー
    );
  }

  public display(): string {
    return `${this.name} (Lv.${this.level}) - HP:${this.stats.hp}, MP:${this.stats.mp}, 所持品:${this.inventory.join(', ')}`;
  }
}

/**
 * Prototype Registry: プロトタイプの管理
 */
export class ShapeRegistry {
  private prototypes: Map<string, Shape> = new Map();

  public register(name: string, shape: Shape): void {
    this.prototypes.set(name, shape);
  }

  public get(name: string): Shape | undefined {
    const prototype = this.prototypes.get(name);
    return prototype ? prototype.clone() : undefined;
  }
}

// 使用例
// 基本の図形を作成してレジストリに登録
const circlePrototype = new Shape('円', '赤', 0, 0);
const rectanglePrototype = new Shape('四角形', '青', 0, 0);

const registry = new ShapeRegistry();
registry.register('circle', circlePrototype);
registry.register('rectangle', rectanglePrototype);

// レジストリからクローンを取得
const circle1 = registry.get('circle');
const circle2 = registry.get('circle');

if (circle1 && circle2) {
  circle1.x = 100;
  circle1.y = 200;
  circle2.x = 300;
  circle2.y = 400;

  console.log(circle1.draw()); // 赤の円を座標(100, 200)に描画
  console.log(circle2.draw()); // 赤の円を座標(300, 400)に描画
}

// キャラクターの深いコピーテスト
const originalCharacter = new Character('勇者', 10, ['剣', '盾'], { hp: 100, mp: 50, attack: 30 });
const clonedCharacter = originalCharacter.clone();

clonedCharacter.name = '勇者の影';
clonedCharacter.inventory.push('ポーション');
clonedCharacter.stats.hp = 80;

console.log(originalCharacter.display()); // 勇者 (Lv.10) - HP:100, MP:50, 所持品:剣, 盾
console.log(clonedCharacter.display());   // 勇者の影 (Lv.10) - HP:80, MP:50, 所持品:剣, 盾, ポーション

// 深いコピーにより、元のオブジェクトに影響がないことを確認