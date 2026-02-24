// Iterator パターン: コレクションの要素に順次アクセス

/**
 * Iterator: 反復処理のインターフェース
 */
export interface Iterator<T> {
  current(): T;
  next(): T | null;
  hasNext(): boolean;
  reset(): void;
}

/**
 * Aggregate: コレクションのインターフェース
 */
export interface IterableCollection<T> {
  createIterator(): Iterator<T>;
}

/**
 * Concrete Iterator: 配列の反復子
 */
export class ArrayIterator<T> implements Iterator<T> {
  private position: number = 0;

  constructor(private collection: T[]) {}

  public current(): T {
    return this.collection[this.position];
  }

  public next(): T | null {
    if (this.hasNext()) {
      this.position++;
      return this.collection[this.position];
    }
    return null;
  }

  public hasNext(): boolean {
    return this.position < this.collection.length - 1;
  }

  public reset(): void {
    this.position = 0;
  }
}

/**
 * Concrete Iterator: 逆順の反復子
 */
export class ReverseIterator<T> implements Iterator<T> {
  private position: number;

  constructor(private collection: T[]) {
    this.position = collection.length - 1;
  }

  public current(): T {
    return this.collection[this.position];
  }

  public next(): T | null {
    if (this.position > 0) {
      this.position--;
      return this.collection[this.position];
    }
    return null;
  }

  public hasNext(): boolean {
    return this.position > 0;
  }

  public reset(): void {
    this.position = this.collection.length - 1;
  }
}

/**
 * Concrete Aggregate: 本棚コレクション
 */
export class Bookshelf implements IterableCollection<string> {
  private books: string[] = [];

  public addBook(book: string): void {
    this.books.push(book);
  }

  public getBookAt(index: number): string {
    return this.books[index];
  }

  public getCount(): number {
    return this.books.length;
  }

  public createIterator(): Iterator<string> {
    return new ArrayIterator(this.books);
  }

  public createReverseIterator(): Iterator<string> {
    return new ReverseIterator(this.books);
  }
}

/**
 * 別の例: 二分木の走査
 */
export interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
}

export class InOrderIterator implements Iterator<number> {
  private stack: TreeNode[] = [];

  constructor(root: TreeNode) {
    this.pushLeft(root);
  }

  private pushLeft(node: TreeNode | null | undefined): void {
    while (node) {
      this.stack.push(node);
      node = node.left;
    }
  }

  public current(): number {
    const node = this.stack[this.stack.length - 1];
    return node.value;
  }

  public next(): number | null {
    if (!this.hasNext()) return null;
    
    const node = this.stack.pop()!;
    if (node.right) {
      this.pushLeft(node.right);
    }
    
    if (this.stack.length === 0) return null;
    return this.stack[this.stack.length - 1].value;
  }

  public hasNext(): boolean {
    return this.stack.length > 0;
  }

  public reset(): void {
    this.stack = [];
  }
}

export class BinaryTree implements IterableCollection<number> {
  constructor(private root: TreeNode) {}

  public createIterator(): Iterator<number> {
    return new InOrderIterator(this.root);
  }
}

// 使用例
console.log('=== 本棚の走査 ===');
const bookshelf = new Bookshelf();
bookshelf.addBook('吾輩は猫である');
bookshelf.addBook('坊っちゃん');
bookshelf.addBook('こころ');
bookshelf.addBook('三四郎');

console.log('正順:');
const iterator = bookshelf.createIterator();
console.log(iterator.current()); // 吾輩は猫である
while (iterator.hasNext()) {
  console.log(iterator.next());
}

console.log('\n逆順:');
const reverseIterator = bookshelf.createReverseIterator();
console.log(reverseIterator.current()); // 三四郎
while (reverseIterator.hasNext()) {
  console.log(reverseIterator.next());
}

console.log('\n=== 二分木の走査（中順序） ===');
//       5
//      / \
//     3   7
//    / \   \
//   1   4   9

const tree: TreeNode = {
  value: 5,
  left: {
    value: 3,
    left: { value: 1 },
    right: { value: 4 }
  },
  right: {
    value: 7,
    right: { value: 9 }
  }
};

const binaryTree = new BinaryTree(tree);
const treeIterator = binaryTree.createIterator();

console.log('中順序で走査:');
while (treeIterator.hasNext()) {
  console.log(treeIterator.current());
  treeIterator.next();
}