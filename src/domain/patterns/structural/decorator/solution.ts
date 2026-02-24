// Decorator パターン: オブジェクトに動的に機能を追加

/**
 * Component: 基本インターフェース
 */
export interface Coffee {
  getDescription(): string;
  getCost(): number;
}

/**
 * Concrete Component: 基本となるオブジェクト
 */
export class SimpleCoffee implements Coffee {
  public getDescription(): string {
    return 'シンプルなコーヒー';
  }

  public getCost(): number {
    return 300;
  }
}

/**
 * Base Decorator: デコレーターの基底クラス
 */
export abstract class CoffeeDecorator implements Coffee {
  constructor(protected coffee: Coffee) {}

  public abstract getDescription(): string;
  public abstract getCost(): number;
}

/**
 * Concrete Decorators: 具体的な機能追加
 */
export class MilkDecorator extends CoffeeDecorator {
  public getDescription(): string {
    return `${this.coffee.getDescription()} + ミルク`;
  }

  public getCost(): number {
    return this.coffee.getCost() + 50;
  }
}

export class SugarDecorator extends CoffeeDecorator {
  public getDescription(): string {
    return `${this.coffee.getDescription()} + 砂糖`;
  }

  public getCost(): number {
    return this.coffee.getCost() + 20;
  }
}

export class WhipDecorator extends CoffeeDecorator {
  public getDescription(): string {
    return `${this.coffee.getDescription()} + ホイップ`;
  }

  public getCost(): number {
    return this.coffee.getCost() + 80;
  }
}

export class CaramelDecorator extends CoffeeDecorator {
  public getDescription(): string {
    return `${this.coffee.getDescription()} + キャラメル`;
  }

  public getCost(): number {
    return this.coffee.getCost() + 100;
  }
}

// 使用例
// シンプルなコーヒー
let myCoffee: Coffee = new SimpleCoffee();
console.log(`${myCoffee.getDescription()}: ¥${myCoffee.getCost()}`);
// シンプルなコーヒー: ¥300

// ミルクを追加
myCoffee = new MilkDecorator(myCoffee);
console.log(`${myCoffee.getDescription()}: ¥${myCoffee.getCost()}`);
// シンプルなコーヒー + ミルク: ¥350

// 砂糖を追加
myCoffee = new SugarDecorator(myCoffee);
console.log(`${myCoffee.getDescription()}: ¥${myCoffee.getCost()}`);
// シンプルなコーヒー + ミルク + 砂糖: ¥370

// ホイップとキャラメルも追加（デコレーターを重ねる）
myCoffee = new WhipDecorator(new CaramelDecorator(myCoffee));
console.log(`${myCoffee.getDescription()}: ¥${myCoffee.getCost()}`);
// シンプルなコーヒー + ミルク + 砂糖 + キャラメル + ホイップ: ¥550