// Facade パターン: 複雑なサブシステムへの簡易インターフェース

/**
 * Subsystem Classes: 複雑なサブシステム
 */

// 在庫管理システム
export class InventorySystem {
  public checkStock(productId: string): boolean {
    console.log(`在庫確認中: ${productId}`);
    return true;
  }

  public reserveStock(productId: string, quantity: number): void {
    console.log(`在庫確保: ${productId} x ${quantity}`);
  }
}

// 決済システム
export class PaymentSystem {
  public processPayment(userId: string, amount: number): boolean {
    console.log(`決済処理: ${userId} -> ¥${amount}`);
    return true;
  }

  public refund(transactionId: string): void {
    console.log(`返金処理: ${transactionId}`);
  }
}

// 配送システム
export class ShippingSystem {
  public createShippingLabel(userId: string, address: string): string {
    console.log(`配送ラベル作成: ${userId} -> ${address}`);
    return `LABEL-${Date.now()}`;
  }

  public trackShipment(labelId: string): string {
    return `配送状況: 輸送中 (${labelId})`;
  }
}

// 通知システム
export class NotificationSystem {
  public sendEmail(email: string, message: string): void {
    console.log(`メール送信: ${email} -> ${message}`);
  }

  public sendSMS(phone: string, message: string): void {
    console.log(`SMS送信: ${phone} -> ${message}`);
  }
}

/**
 * Facade: 複雑な操作を簡素化
 */
export class OrderFacade {
  private inventory: InventorySystem;
  private payment: PaymentSystem;
  private shipping: ShippingSystem;
  private notification: NotificationSystem;

  constructor() {
    this.inventory = new InventorySystem();
    this.payment = new PaymentSystem();
    this.shipping = new ShippingSystem();
    this.notification = new NotificationSystem();
  }

  // 注文プロセスを一元管理
  public placeOrder(
    userId: string,
    productId: string,
    quantity: number,
    amount: number,
    email: string,
    address: string
  ): { success: boolean; labelId?: string } {
    console.log('=== 注文処理開始 ===');

    // 1. 在庫確認
    if (!this.inventory.checkStock(productId)) {
      console.log('在庫不足です');
      return { success: false };
    }

    // 2. 在庫確保
    this.inventory.reserveStock(productId, quantity);

    // 3. 決済処理
    if (!this.payment.processPayment(userId, amount)) {
      console.log('決済失敗');
      return { success: false };
    }

    // 4. 配送手配
    const labelId = this.shipping.createShippingLabel(userId, address);

    // 5. 通知
    this.notification.sendEmail(email, '注文が完了しました！');

    console.log('=== 注文処理完了 ===');
    return { success: true, labelId };
  }

  // 返品プロセス
  public returnOrder(transactionId: string, email: string): void {
    console.log('=== 返品処理開始 ===');
    this.payment.refund(transactionId);
    this.notification.sendEmail(email, '返品が完了しました');
    console.log('=== 返品処理完了 ===');
  }
}

// 使用例
const orderFacade = new OrderFacade();

// クライアントは複雑なサブシステムを知る必要がない
const result = orderFacade.placeOrder(
  'user-123',
  'product-456',
  2,
  5000,
  'customer@example.com',
  '東京都渋谷区...'
);

console.log(`注文結果: ${result.success}`);

// 返品
if (result.success) {
  orderFacade.returnOrder('txn-789', 'customer@example.com');
}