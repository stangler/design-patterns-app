// Visitor パターン: 要素に新しい操作を追加

/**
 * Visitor: 訪問者のインターフェース
 */
export interface Visitor {
  visitFile(file: FileElement): string;
  visitFolder(folder: FolderElement): string;
  visitSymlink(symlink: SymlinkElement): string;
}

/**
 * Element: 要素のインターフェース
 */
export interface Element {
  accept(visitor: Visitor): string;
}

/**
 * Concrete Elements: 具体的な要素
 */
export class FileElement implements Element {
  constructor(
    public name: string,
    public size: number,
    public createdAt: Date
  ) {}

  public accept(visitor: Visitor): string {
    return visitor.visitFile(this);
  }
}

export class FolderElement implements Element {
  private children: Element[] = [];

  constructor(public name: string) {}

  public add(element: Element): void {
    this.children.push(element);
  }

  public getChildren(): Element[] {
    return this.children;
  }

  public accept(visitor: Visitor): string {
    return visitor.visitFolder(this);
  }
}

export class SymlinkElement implements Element {
  constructor(
    public name: string,
    public target: Element
  ) {}

  public accept(visitor: Visitor): string {
    return visitor.visitSymlink(this);
  }
}

/**
 * Concrete Visitors: 具体的な操作
 */

// ファイルサイズ計算ビジター
export class SizeCalculatorVisitor implements Visitor {
  public totalSize: number = 0;

  public visitFile(file: FileElement): string {
    this.totalSize += file.size;
    return `File: ${file.name} (${file.size}KB)`;
  }

  public visitFolder(folder: FolderElement): string {
    let result = `Folder: ${folder.name}/\n`;
    for (const child of folder.getChildren()) {
      result += '  ' + child.accept(this).split('\n').join('\n  ') + '\n';
    }
    return result;
  }

  public visitSymlink(symlink: SymlinkElement): string {
    return `Symlink: ${symlink.name} -> ${symlink.target.accept(this)}`;
  }
}

// ファイル検索ビジター
export class SearchVisitor implements Visitor {
  private results: string[] = [];

  constructor(private keyword: string) {}

  public visitFile(file: FileElement): string {
    if (file.name.includes(this.keyword)) {
      this.results.push(file.name);
    }
    return '';
  }

  public visitFolder(folder: FolderElement): string {
    for (const child of folder.getChildren()) {
      child.accept(this);
    }
    return '';
  }

  public visitSymlink(symlink: SymlinkElement): string {
    if (symlink.name.includes(this.keyword)) {
      this.results.push(symlink.name + ' (symlink)');
    }
    return '';
  }

  public getResults(): string[] {
    return this.results;
  }
}

// エクスポートビジター
export class ExportVisitor implements Visitor {
  private indent: number = 0;

  private getIndent(): string {
    return '  '.repeat(this.indent);
  }

  public visitFile(file: FileElement): string {
    return `${this.getIndent()}📄 ${file.name} (${file.size}KB)`;
  }

  public visitFolder(folder: FolderElement): string {
    let result = `${this.getIndent()}📁 ${folder.name}/`;
    this.indent++;
    for (const child of folder.getChildren()) {
      result += '\n' + child.accept(this);
    }
    this.indent--;
    return result;
  }

  public visitSymlink(symlink: SymlinkElement): string {
    return `${this.getIndent()}🔗 ${symlink.name} -> symlink`;
  }
}

/**
 * 別の例: 商品カート
 */
export interface CartItem {
  accept(visitor: CartVisitor): number;
}

export class Product implements CartItem {
  constructor(
    public name: string,
    public price: number,
    public quantity: number
  ) {}

  public accept(visitor: CartVisitor): number {
    return visitor.visitProduct(this);
  }
}

export class DiscountedProduct implements CartItem {
  constructor(
    public name: string,
    public originalPrice: number,
    public discountRate: number,
    public quantity: number
  ) {}

  public getPrice(): number {
    return this.originalPrice * (1 - this.discountRate);
  }

  public accept(visitor: CartVisitor): number {
    return visitor.visitDiscountedProduct(this);
  }
}

export class Subscription implements CartItem {
  constructor(
    public name: string,
    public monthlyPrice: number,
    public months: number
  ) {}

  public accept(visitor: CartVisitor): number {
    return visitor.visitSubscription(this);
  }
}

export interface CartVisitor {
  visitProduct(product: Product): number;
  visitDiscountedProduct(product: DiscountedProduct): number;
  visitSubscription(subscription: Subscription): number;
}

export class PriceCalculatorVisitor implements CartVisitor {
  public visitProduct(product: Product): number {
    return product.price * product.quantity;
  }

  public visitDiscountedProduct(product: DiscountedProduct): number {
    return product.getPrice() * product.quantity;
  }

  public visitSubscription(subscription: Subscription): number {
    return subscription.monthlyPrice * subscription.months;
  }
}

// 使用例
console.log('=== ファイルシステムビジター ===');
const root = new FolderElement('project');
const src = new FolderElement('src');
src.add(new FileElement('index.ts', 5, new Date()));
src.add(new FileElement('app.ts', 12, new Date()));
root.add(src);
root.add(new FileElement('package.json', 2, new Date()));
root.add(new SymlinkElement('readme-link', new FileElement('README.md', 3, new Date())));

const exportVisitor = new ExportVisitor();
console.log(root.accept(exportVisitor));

const sizeVisitor = new SizeCalculatorVisitor();
root.accept(sizeVisitor);
console.log(`\n合計サイズ: ${sizeVisitor.totalSize}KB`);

const searchVisitor = new SearchVisitor('.ts');
root.accept(searchVisitor);
console.log(`検索結果: ${searchVisitor.getResults().join(', ')}`);

console.log('\n=== カートビジター ===');
const cart: CartItem[] = [
  new Product('ノートPC', 100000, 1),
  new DiscountedProduct('マウス', 3000, 0.2, 2),
  new Subscription('クラウドストレージ', 500, 12)
];

const calculator = new PriceCalculatorVisitor();
let total = 0;
for (const item of cart) {
  const price = item.accept(calculator);
  console.log(`商品価格: ¥${price}`);
  total += price;
}
console.log(`合計: ¥${total}`);