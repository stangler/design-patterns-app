// Observer パターン: 状態変化を通知する一対多の依存関係

/**
 * Observer: 通知を受け取るインターフェース
 */
export interface Observer {
  update(data: unknown): void;
}

/**
 * Subject: Observerを管理し通知するインターフェース
 */
export interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(): void;
}

/**
 * Concrete Subject: 具体的な被験者
 */
export class NewsAgency implements Subject {
  private observers: Observer[] = [];
  private latestNews: string = '';

  public attach(observer: Observer): void {
    const isExist = this.observers.includes(observer);
    if (!isExist) {
      this.observers.push(observer);
      console.log(`Observerを追加しました`);
    }
  }

  public detach(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
      console.log(`Observerを削除しました`);
    }
  }

  public notify(): void {
    console.log(`\n📢 ニュース配信: "${this.latestNews}"`);
    for (const observer of this.observers) {
      observer.update(this.latestNews);
    }
  }

  public publishNews(news: string): void {
    this.latestNews = news;
    this.notify();
  }
}

/**
 * Concrete Observers: 具体的な観察者
 */
export class NewsChannel implements Observer {
  constructor(private name: string) {}

  public update(data: unknown): void {
    console.log(`📺 ${this.name}: ${data} を放送中...`);
  }
}

export class Newspaper implements Observer {
  constructor(private name: string) {}

  public update(data: unknown): void {
    console.log(`📰 ${this.name}: ${data} を記事にします`);
  }
}

export class SmartphoneApp implements Observer {
  constructor(private name: string) {}

  public update(data: unknown): void {
    console.log(`📱 ${this.name}: "${data}" をプッシュ通知で配信`);
  }
}

/**
 * 別の例: 株価通知システム
 */
export class StockTicker implements Subject {
  private observers: Observer[] = [];
  private prices: Map<string, number> = new Map();

  public attach(observer: Observer): void {
    this.observers.push(observer);
  }

  public detach(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  public notify(): void {
    const data = Object.fromEntries(this.prices);
    for (const observer of this.observers) {
      observer.update(data);
    }
  }

  public updatePrice(symbol: string, price: number): void {
    this.prices.set(symbol, price);
    this.notify();
  }
}

export class StockInvestor implements Observer {
  constructor(private name: string) {}

  public update(data: unknown): void {
    const prices = data as Record<string, number>;
    console.log(`💰 ${this.name}: 株価更新 ${JSON.stringify(prices)}`);
  }
}

// 使用例
console.log('=== ニュース配信システム ===');
const agency = new NewsAgency();

const tvChannel = new NewsChannel('NHK');
const newspaper = new Newspaper('朝日新聞');
const app = new SmartphoneApp('SmartNews');

agency.attach(tvChannel);
agency.attach(newspaper);
agency.attach(app);

agency.publishNews('重要: 新しいテクノロジーが発表されました');

agency.detach(newspaper);
agency.publishNews('速報: 天気が変化しました');

console.log('\n=== 株価通知システム ===');
const ticker = new StockTicker();
const investor1 = new StockInvestor('田中さん');
const investor2 = new StockInvestor('鈴木さん');

ticker.attach(investor1);
ticker.attach(investor2);

ticker.updatePrice('AAPL', 150);
ticker.updatePrice('GOOGL', 2800);