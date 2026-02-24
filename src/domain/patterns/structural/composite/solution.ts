// Composite パターン: ツリー構造を統一インターフェースで扱う

/**
 * Component: 全ての要素の共通インターフェース
 */
export interface FileSystemComponent {
  getName(): string;
  getSize(): number;
  display(indent?: string): string;
}

/**
 * Leaf: 子要素を持たない末端のオブジェクト
 */
export class File implements FileSystemComponent {
  constructor(
    private name: string,
    private size: number
  ) {}

  public getName(): string {
    return this.name;
  }

  public getSize(): number {
    return this.size;
  }

  public display(indent: string = ''): string {
    return `${indent}📄 ${this.name} (${this.size}KB)`;
  }
}

/**
 * Composite: 子要素を持つコンテナ
 */
export class Folder implements FileSystemComponent {
  private children: FileSystemComponent[] = [];

  constructor(private name: string) {}

  public getName(): string {
    return this.name;
  }

  public add(component: FileSystemComponent): void {
    this.children.push(component);
  }

  public remove(component: FileSystemComponent): void {
    const index = this.children.indexOf(component);
    if (index > -1) {
      this.children.splice(index, 1);
    }
  }

  public getSize(): number {
    // 子要素のサイズを再帰的に合計
    return this.children.reduce((sum, child) => sum + child.getSize(), 0);
  }

  public display(indent: string = ''): string {
    const results: string[] = [`${indent}📁 ${this.name}/`];
    for (const child of this.children) {
      results.push(child.display(indent + '  '));
    }
    return results.join('\n');
  }
}

// 使用例
// ファイルシステムの構築
const root = new Folder('プロジェクト');

const src = new Folder('src');
src.add(new File('index.ts', 5));
src.add(new File('app.ts', 12));

const components = new Folder('components');
components.add(new File('Button.tsx', 8));
components.add(new File('Input.tsx', 6));

src.add(components);

const docs = new Folder('docs');
docs.add(new File('README.md', 3));
docs.add(new File('API.md', 7));

root.add(src);
root.add(docs);
root.add(new File('package.json', 2));

// ツリー構造の表示
console.log(root.display());
// 📁 プロジェクト/
//   📁 src/
//     📄 index.ts (5KB)
//     📄 app.ts (12KB)
//     📁 components/
//       📄 Button.tsx (8KB)
//       📄 Input.tsx (6KB)
//   📁 docs/
//     📄 README.md (3KB)
//     📄 API.md (7KB)
//   📄 package.json (2KB)

// 統一インターフェースでサイズ計算
console.log(`\n合計サイズ: ${root.getSize()}KB`); // 43KB
console.log(`srcフォルダサイズ: ${src.getSize()}KB`); // 31KB