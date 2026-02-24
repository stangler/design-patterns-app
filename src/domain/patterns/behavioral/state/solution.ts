// State パターン: 状態に応じて振る舞いを変化

/**
 * State: 状態のインターフェース
 */
export interface VendingMachineState {
  insertMoney(amount: number): string;
  selectItem(item: string): string;
  dispenseItem(): string;
  ejectMoney(): string;
}

/**
 * Context: 状態を持つオブジェクト
 */
export class VendingMachine {
  private noMoneyState: VendingMachineState;
  private hasMoneyState: VendingMachineState;
  private soldState: VendingMachineState;
  private soldOutState: VendingMachineState;

  private currentState: VendingMachineState;
  private balance: number = 0;
  private selectedItem: string | null = null;
  private inventory: Map<string, { price: number; count: number }> = new Map([
    ['コーラ', { price: 120, count: 5 }],
    ['お茶', { price: 100, count: 3 }],
    ['水', { price: 80, count: 10 }],
  ]);

  constructor() {
    this.noMoneyState = new NoMoneyState(this);
    this.hasMoneyState = new HasMoneyState(this);
    this.soldState = new SoldState(this);
    this.soldOutState = new SoldOutState(this);
    this.currentState = this.noMoneyState;
  }

  public setState(state: VendingMachineState): void {
    this.currentState = state;
  }

  public getNoMoneyState(): VendingMachineState { return this.noMoneyState; }
  public getHasMoneyState(): VendingMachineState { return this.hasMoneyState; }
  public getSoldState(): VendingMachineState { return this.soldState; }
  public getSoldOutState(): VendingMachineState { return this.soldOutState; }

  public getBalance(): number { return this.balance; }
  public addMoney(amount: number): void { this.balance += amount; }
  public resetBalance(): void { this.balance = 0; }

  public getInventory() { return this.inventory; }
  public decreaseInventory(item: string): void {
    const product = this.inventory.get(item);
    if (product) {
      product.count--;
    }
  }

  public setSelectedItem(item: string | null): void {
    this.selectedItem = item;
  }

  public getSelectedItem(): string | null {
    return this.selectedItem;
  }

  public insertMoney(amount: number): string {
    return this.currentState.insertMoney(amount);
  }

  public selectItem(item: string): string {
    return this.currentState.selectItem(item);
  }

  public dispenseItem(): string {
    return this.currentState.dispenseItem();
  }

  public ejectMoney(): string {
    return this.currentState.ejectMoney();
  }
}

/**
 * Concrete States: 具体的な状態
 */
class NoMoneyState implements VendingMachineState {
  constructor(private machine: VendingMachine) {}

  public insertMoney(amount: number): string {
    this.machine.addMoney(amount);
    this.machine.setState(this.machine.getHasMoneyState());
    return `💰 ${amount}円を投入しました (残高: ${this.machine.getBalance()}円)`;
  }

  public selectItem(_item: string): string {
    return '⚠️ お金を投入してください';
  }

  public dispenseItem(): string {
    return '⚠️ 商品を選択してください';
  }

  public ejectMoney(): string {
    return '⚠️ 返金するお金がありません';
  }
}

class HasMoneyState implements VendingMachineState {
  constructor(private machine: VendingMachine) {}

  public insertMoney(amount: number): string {
    this.machine.addMoney(amount);
    return `💰 ${amount}円を追加投入しました (残高: ${this.machine.getBalance()}円)`;
  }

  public selectItem(item: string): string {
    const inventory = this.machine.getInventory();
    const product = inventory.get(item);

    if (!product) {
      return `⚠️ "${item}"は売っていません`;
    }

    if (product.count === 0) {
      return `⚠️ "${item}"は売り切れです`;
    }

    if (this.machine.getBalance() < product.price) {
      return `⚠️ 残高が足りません (必要: ${product.price}円, 残高: ${this.machine.getBalance()}円)`;
    }

    this.machine.setSelectedItem(item);
    this.machine.setState(this.machine.getSoldState());
    return `✅ "${item}"を選択しました`;
  }

  public dispenseItem(): string {
    return '⚠️ まず商品を選択してください';
  }

  public ejectMoney(): string {
    const amount = this.machine.getBalance();
    this.machine.resetBalance();
    this.machine.setState(this.machine.getNoMoneyState());
    return `💸 ${amount}円を返金しました`;
  }
}

class SoldState implements VendingMachineState {
  constructor(private machine: VendingMachine) {}

  public insertMoney(_amount: number): string {
    return '⚠️ 商品を取り出してからお金を投入してください';
  }

  public selectItem(_item: string): string {
    return '⚠️ まず商品を選択してください';
  }

  public dispenseItem(): string {
    const item = this.machine.getSelectedItem();
    if (!item) return '⚠️ エラーが発生しました';

    const inventory = this.machine.getInventory();
    const product = inventory.get(item);
    if (!product) return '⚠️ エラーが発生しました';

    this.machine.decreaseInventory(item);
    const change = this.machine.getBalance() - product.price;
    this.machine.resetBalance();
    this.machine.setSelectedItem(null);

    // 在庫がなくなったら売り切れ状態へ
    if (product.count - 1 === 0) {
      this.machine.setState(this.machine.getSoldOutState());
    } else {
      this.machine.setState(this.machine.getNoMoneyState());
    }

    let result = `🎁 ${item}を取り出しました！`;
    if (change > 0) {
      result += `\n💸 おつり: ${change}円`;
    }
    return result;
  }

  public ejectMoney(): string {
    return '⚠️ 商品を購入中です';
  }
}

class SoldOutState implements VendingMachineState {
  constructor(private machine: VendingMachine) {}

  public insertMoney(amount: number): string {
    this.machine.addMoney(amount);
    return `💰 ${amount}円を投入しましたが、在庫切れです`;
  }

  public selectItem(_item: string): string {
    return '⚠️ 在庫切れです';
  }

  public dispenseItem(): string {
    return '⚠️ 在庫切れです';
  }

  public ejectMoney(): string {
    const amount = this.machine.getBalance();
    this.machine.resetBalance();
    return `💸 ${amount}円を返金しました`;
  }
}

// 使用例
console.log('=== 自動販売機シミュレーション ===');
const vendingMachine = new VendingMachine();

console.log(vendingMachine.insertMoney(100)); // 100円投入
console.log(vendingMachine.selectItem('コーラ')); // 残高不足
console.log(vendingMachine.insertMoney(50));  // 50円追加
console.log(vendingMachine.selectItem('コーラ')); // 選択
console.log(vendingMachine.dispenseItem());   // 取り出し

console.log('\n--- 返金テスト ---');
console.log(vendingMachine.insertMoney(200));
console.log(vendingMachine.ejectMoney());

console.log('\n--- 売り切れテスト ---');
for (let i = 0; i < 5; i++) {
  console.log(vendingMachine.insertMoney(120));
  console.log(vendingMachine.selectItem('お茶'));
  console.log(vendingMachine.dispenseItem());
}