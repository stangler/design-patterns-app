// Strategy パターン: アルゴリズムを実行時に切り替え可能に

/**
 * Strategy: アルゴリズムのインターフェース
 */
export interface PaymentStrategy {
  pay(amount: number): string;
}

/**
 * Concrete Strategies: 具体的な支払い方法
 */
export class CreditCardStrategy implements PaymentStrategy {
  constructor(
    private name: string,
    private cardNumber: string,
    private cvv: string,
    private expiryDate: string
  ) {}

  public pay(amount: number): string {
    return `💳 クレジットカードで ¥${amount} 支払い完了\n   カード: ****-****-****-${this.cardNumber.slice(-4)} (${this.name})`;
  }
}

export class PayPalStrategy implements PaymentStrategy {
  constructor(private email: string) {}

  public pay(amount: number): string {
    return `🅿️ PayPal で ¥${amount} 支払い完了\n   アカウント: ${this.email}`;
  }
}

export class BitcoinStrategy implements PaymentStrategy {
  constructor(private walletAddress: string) {}

  public pay(amount: number): string {
    // 簡易的な為替レート計算
    const btcAmount = (amount / 5000000).toFixed(8);
    return `₿ Bitcoin で ¥${amount} 支払い完了\n   送金額: ${btcAmount} BTC\n   ウォレット: ${this.walletAddress.slice(0, 8)}...`;
  }
}

export class CashOnDeliveryStrategy implements PaymentStrategy {
  public pay(amount: number): string {
    const fee = 300;
    return `💵 代金引換で ¥${amount + fee} 支払い（手数料 ¥${fee} 含む）\n   商品受け取り時にお支払いください`;
  }
}

/**
 * Context: ストラジーを使用するクラス
 */
export class ShoppingCart {
  private items: { name: string; price: number }[] = [];

  public addItem(name: string, price: number): void {
    this.items.push({ name, price });
  }

  public calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  public checkout(paymentStrategy: PaymentStrategy): string {
    const total = this.calculateTotal();
    const itemsList = this.items.map(i => `  - ${i.name}: ¥${i.price}`).join('\n');
    
    return `=== 注文内容 ===\n${itemsList}\n\n合計: ¥${total}\n\n${paymentStrategy.pay(total)}`;
  }
}

/**
 * 別の例: ソートアルゴリズム
 */
export type SortStrategy = (arr: number[]) => number[];

export const bubbleSort: SortStrategy = (arr) => {
  const result = [...arr];
  for (let i = 0; i < result.length - 1; i++) {
    for (let j = 0; j < result.length - 1 - i; j++) {
      if (result[j] > result[j + 1]) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
      }
    }
  }
  return result;
};

export const quickSort: SortStrategy = (arr) => {
  if (arr.length <= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  return [...quickSort(left), ...middle, ...quickSort(right)];
};

export class Sorter {
  constructor(private strategy: SortStrategy) {}

  public setStrategy(strategy: SortStrategy): void {
    this.strategy = strategy;
  }

  public sort(arr: number[]): number[] {
    return this.strategy(arr);
  }
}

// 使用例
console.log('=== ショッピングカート支払い ===');
const cart = new ShoppingCart();
cart.addItem('ノートPC', 150000);
cart.addItem('マウス', 3000);
cart.addItem('キーボード', 15000);

// 支払い方法を選択可能
console.log(cart.checkout(new CreditCardStrategy('山田 太郎', '1234567890123456', '123', '12/25')));
console.log('\n---\n');
console.log(cart.checkout(new PayPalStrategy('yamada@example.com')));
console.log('\n---\n');
console.log(cart.checkout(new BitcoinStrategy('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')));

console.log('\n=== ソートアルゴリズム切り替え ===');
const sorter = new Sorter(bubbleSort);
const data = [64, 34, 25, 12, 22, 11, 90];

console.log('バブルソート:', sorter.sort(data));

sorter.setStrategy(quickSort);
console.log('クイックソート:', sorter.sort(data));