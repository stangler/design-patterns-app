// Factory Method パターン: オブジェクト生成をサブクラスに委譲

/**
 * Product: 生成されるオブジェクトのインターフェース
 */
export interface Transport {
  deliver(): string;
  getCost(): number;
}

/**
 * Concrete Products: 具体的な配送手段
 */
export class Truck implements Transport {
  deliver(): string {
    return '🚚 トラックで陸送配送中...';
  }

  getCost(): number {
    return 500;
  }
}

export class Ship implements Transport {
  deliver(): string {
    return '🚢 船で海上配送中...';
  }

  getCost(): number {
    return 1200;
  }
}

export class Airplane implements Transport {
  deliver(): string {
    return '✈️ 飛行機で航空配送中...';
  }

  getCost(): number {
    return 3500;
  }
}

/**
 * Creator: Factory Method を宣言
 */
export abstract class Logistics {
  // Factory Method: サブクラスでオーバーライド
  public abstract createTransport(): Transport;

  // ビジネスロジック（Product に依存）
  public planDelivery(): string {
    const transport = this.createTransport();
    return `${transport.deliver()} (費用: ¥${transport.getCost()})`;
  }
}

/**
 * Concrete Creators: 具体的な工場
 */
export class RoadLogistics extends Logistics {
  public createTransport(): Transport {
    return new Truck();
  }
}

export class SeaLogistics extends Logistics {
  public createTransport(): Transport {
    return new Ship();
  }
}

export class AirLogistics extends Logistics {
  public createTransport(): Transport {
    return new Airplane();
  }
}

// 使用例
function clientCode(logistics: Logistics): void {
  console.log(logistics.planDelivery());
}

// 配送方法に応じて適切な物流会社を選択
const roadLogistics = new RoadLogistics();
const seaLogistics = new SeaLogistics();
const airLogistics = new AirLogistics();

clientCode(roadLogistics);  // 🚚 トラックで陸送配送中... (費用: ¥500)
clientCode(seaLogistics);   // 🚢 船で海上配送中... (費用: ¥1200)
clientCode(airLogistics);   // ✈️ 飛行機で航空配送中... (費用: ¥3500)