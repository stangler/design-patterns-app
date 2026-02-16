import { DesignPattern, PatternCategory, DifficultyLevel, LearningProgress } from '@/types/designPatterns';

// サンプルデザインパターンデータ
export const designPatterns: DesignPattern[] = [
  {
    id: 'singleton',
    name: 'Singleton',
    category: PatternCategory.Creational,
    description: 'クラスのインスタンスが1つだけ作成されることを保証するパターン',
    intent: 'あるクラスについて、インスタンスが1つしか作られないこと、また、それにアクセスするグローバルなアクセスポイントを提供すること。',
    motivation: 'クラスのインスタンスが1つだけであることを保証する必要がある場合に使用される。',
    structure: 'シングルトンクラスは自身の唯一のインスタンスを作成し、それへのグローバルなアクセスを提供する。',
    participants: 'Singleton: 唯一のインスタンスを定義するクラス',
    collaboration: 'Singletonクラスは自身のインスタンスへのアクセスを制御し、必要に応じてインスタンスを作成する。',
    consequences: 'インスタンスの数を制御でき、グローバルなアクセスポイントを提供できる。',
    implementation: 'プライベートなコンストラクタと静的なインスタンス取得メソッドを使用する。',
    sampleCode: 'class Singleton {\n  private static instance: Singleton;\n  \n  private constructor() {}\n  \n  static getInstance(): Singleton {\n    if (!Singleton.instance) {\n      Singleton.instance = new Singleton();\n    }\n    return Singleton.instance;\n  }\n}',
    realWorldExample: '設定管理クラス、データベース接続プール、ロギングクラスなど',
    relatedPatterns: ['Abstract Factory', 'Builder', 'Prototype'],
    difficulty: DifficultyLevel.Beginner,
    popularity: 8,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    tags: ['creational', 'singleton', 'instance'],
    prerequisites: [],
    alternatives: ['Multiton']
  },
  {
    id: 'factory-method',
    name: 'Factory Method',
    category: PatternCategory.Creational,
    description: 'オブジェクト作成のためのインターフェースを定義し、サブクラスにどのクラスをインスタンス化するかを決定させるパターン',
    intent: 'オブジェクトを作成するためのインターフェースを定義するが、どのクラスをインスタンス化するかはサブクラスに決定させる。',
    motivation: 'クラスがどのクラスのインスタンスを作成するかをサブクラスに委譲したい場合に使用される。',
    structure: 'CreatorクラスはFactoryMethodを定義し、ConcreteCreatorクラスはこのメソッドをオーバーライドしてConcreteProductのインスタンスを作成する。',
    participants: 'Product: 作成されるオブジェクトのインターフェース\nCreator: Productオブジェクトを作成する抽象クラス\nConcreteProduct: Productインターフェースを実装するクラス\nConcreteCreator: Creatorクラスを継承し、FactoryMethodを実装するクラス',
    collaboration: 'ConcreteCreatorはFactoryMethodを呼び出してConcreteProductのインスタンスを作成する。',
    consequences: 'サブクラスにオブジェクト作成を委譲することで、Creatorクラスの変更を最小限に抑えられる。',
    implementation: '抽象メソッドまたは仮想メソッドを使用して、サブクラスにオブジェクト作成を委譲する。',
    sampleCode: `abstract class Creator {
  abstract factoryMethod(): Product;
  
  someOperation(): string {
    const product = this.factoryMethod();
    return \`Creator: The same creator's code has just worked with \${product.operation()}\`;
  }
}

class ConcreteCreator1 extends Creator {
  factoryMethod(): Product {
    return new ConcreteProduct1();
  }
}`,
    realWorldExample: 'ドキュメントエディタのフレームワーク、GUIコンポーネントの作成、データベース接続の作成',
    relatedPatterns: ['Abstract Factory', 'Template Method', 'Prototype'],
    difficulty: DifficultyLevel.Intermediate,
    popularity: 7,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-22'),
    tags: ['creational', 'factory', 'method'],
    prerequisites: ['Singleton'],
    alternatives: ['Abstract Factory', 'Builder']
  },
  {
    id: 'observer',
    name: 'Observer',
    category: PatternCategory.Behavioral,
    description: 'オブジェクト間に1対多の依存関係を定義し、1つのオブジェクトの状態が変化すると、それに依存するすべてのオブジェクトに自動的に通知されるパターン',
    intent: 'あるオブジェクトの状態が変化したときに、それに依存するすべてのオブジェクトに自動的に通知されるようにする。',
    motivation: '複数のオブジェクトが1つのオブジェクトの状態変化に反応する必要がある場合に使用される。',
    structure: 'SubjectはObserverを保持し、状態が変化するとObserverに通知する。ObserverはSubjectの状態変化に反応する。',
    participants: 'Subject: 監視されるオブジェクト\nObserver: 状態変化を監視するオブジェクト\nConcreteSubject: Subjectを実装するクラス\nConcreteObserver: Observerを実装するクラス',
    collaboration: 'Subjectは状態が変化するとObserverに通知し、Observerは通知を受け取って状態変化に反応する。',
    consequences: '疎結合な設計を実現でき、オブジェクト間の依存関係を最小限に抑えられる。',
    implementation: 'Observerパターンを実装するには、SubjectとObserverのインターフェースを定義し、ConcreteSubjectとConcreteObserverクラスを作成する。',
    sampleCode: 'interface Subject {\n  attach(observer: Observer): void;\n  detach(observer: Observer): void;\n  notify(): void;\n}\n\ninterface Observer {\n  update(subject: Subject): void;\n}\n\nclass ConcreteSubject implements Subject {\n  private observers: Observer[] = [];\n  private state: number;\n  \n  attach(observer: Observer): void {\n    this.observers.push(observer);\n  }\n  \n  detach(observer: Observer): void {\n    const observerIndex = this.observers.indexOf(observer);\n    this.observers.splice(observerIndex, 1);\n  }\n  \n  notify(): void {\n    for (const observer of this.observers) {\n      observer.update(this);\n    }\n  }\n  \n  someBusinessLogic(): void {\n    this.state = Math.floor(Math.random() * (10 + 1));\n    this.notify();\n  }\n}',
    realWorldExample: 'イベント処理システム、株価情報配信、ニュース購読サービス',
    relatedPatterns: ['Mediator', 'Chain of Responsibility', 'State'],
    difficulty: DifficultyLevel.Intermediate,
    popularity: 9,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-25'),
    tags: ['behavioral', 'observer', 'notification'],
    prerequisites: [],
    alternatives: ['Publish-Subscribe']
  },
  {
    id: 'abstract-factory',
    name: 'Abstract Factory',
    category: PatternCategory.Creational,
    description: '関連する、または依存するオブジェクト群を、その具象クラスを指定せずに生成するためのインターフェースを提供するパターン',
    intent: '関連するオブジェクトのファミリーを、具象クラスを指定せずに生成できるようにする。',
    motivation: '異なる種類のオブジェクトのセット（ファミリー）を一貫して作成する必要がある場合に使用される。',
    structure: 'AbstractFactoryはProductファミリーを作成するためのインターフェースを定義し、ConcreteFactoryはそれを実装して具体的なProductを作成する。',
    participants: 'AbstractFactory: オブジェクトファミリーを作成するインターフェース\nConcreteFactory: 具体的なProductファミリーを作成するクラス\nAbstractProduct: Productの抽象インターフェース\nConcreteProduct: 具体的なProduct',
    collaboration: 'ConcreteFactoryは関連するConcreteProductのインスタンスを作成する。',
    consequences: '具象クラスを分離でき、製品ファミリーの交換が容易になる。',
    implementation: 'Factoryパターンを拡張し、複数の関連するオブジェクトを作成するメソッドを提供する。',
    sampleCode: `interface AbstractFactory {
  createProductA(): AbstractProductA;
  createProductB(): AbstractProductB;
}

class ConcreteFactory1 implements AbstractFactory {
  createProductA(): AbstractProductA {
    return new ConcreteProductA1();
  }
  
  createProductB(): AbstractProductB {
    return new ConcreteProductB1();
  }
}`,
    realWorldExample: 'クロスプラットフォームGUIライブラリ、データベースアクセスレイヤー、テーマシステム',
    relatedPatterns: ['Factory Method', 'Singleton', 'Prototype'],
    difficulty: DifficultyLevel.Advanced,
    popularity: 6,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-23'),
    tags: ['creational', 'factory', 'abstract'],
    prerequisites: ['Factory Method'],
    alternatives: ['Builder']
  },
  {
    id: 'builder',
    name: 'Builder',
    category: PatternCategory.Creational,
    description: '複雑なオブジェクトの構築過程を、その表現と分離し、同じ構築過程で異なる表現を作成できるようにするパターン',
    intent: '複雑なオブジェクトの構築過程を段階的に実行し、様々な表現を作成できるようにする。',
    motivation: '複雑なオブジェクトの生成を段階的に行いたい場合や、同じ構築過程で異なる表現を作成したい場合に使用される。',
    structure: 'Builderインターフェースは構築ステップを定義し、ConcreteBuilderはそれを実装する。Directorは構築手順を制御する。',
    participants: 'Builder: 構築ステップのインターフェース\nConcreteBuilder: 具体的な構築を実装\nDirector: 構築手順を制御\nProduct: 構築される複雑なオブジェクト',
    collaboration: 'DirectorはBuilderを使用してProductを段階的に構築する。',
    consequences: 'オブジェクトの内部表現を変更でき、構築コードを再利用できる。',
    implementation: 'メソッドチェーンを使用して、段階的にオブジェクトを構築する。',
    sampleCode: `class Product {
  parts: string[] = [];
}

interface Builder {
  reset(): void;
  buildPartA(): void;
  buildPartB(): void;
  getResult(): Product;
}

class ConcreteBuilder implements Builder {
  private product: Product;
  
  constructor() {
    this.reset();
  }
  
  reset(): void {
    this.product = new Product();
  }
  
  buildPartA(): void {
    this.product.parts.push('PartA');
  }
  
  buildPartB(): void {
    this.product.parts.push('PartB');
  }
  
  getResult(): Product {
    const result = this.product;
    this.reset();
    return result;
  }
}`,
    realWorldExample: 'HTMLドキュメントビルダー、SQLクエリビルダー、設定オブジェクトの構築',
    relatedPatterns: ['Abstract Factory', 'Composite'],
    difficulty: DifficultyLevel.Intermediate,
    popularity: 7,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-24'),
    tags: ['creational', 'builder', 'construction'],
    prerequisites: [],
    alternatives: ['Factory Method']
  },
  {
    id: 'prototype',
    name: 'Prototype',
    category: PatternCategory.Creational,
    description: '既存のオブジェクトを複製して新しいオブジェクトを生成するパターン',
    intent: 'プロトタイプとなるインスタンスを使って生成するオブジェクトの種類を指定し、それをコピーして新しいオブジェクトを生成する。',
    motivation: '作成するオブジェクトのクラスが実行時に決定される場合や、オブジェクトの作成コストが高い場合に使用される。',
    structure: 'Prototypeインターフェースはcloneメソッドを定義し、ConcretePrototypeはそれを実装する。',
    participants: 'Prototype: cloneメソッドを定義するインターフェース\nConcretePrototype: 自身を複製するメソッドを実装するクラス',
    collaboration: 'クライアントはPrototypeにcloneを要求して新しいオブジェクトを作成する。',
    consequences: '実行時に新しいクラスを追加でき、オブジェクトの作成コストを削減できる。',
    implementation: 'cloneメソッドまたはcopyコンストラクタを実装する。',
    sampleCode: `interface Prototype {
  clone(): Prototype;
}

class ConcretePrototype implements Prototype {
  public primitive: any;
  public component: object;
  public circularReference: ComponentWithBackReference;

  public clone(): this {
    const clone = Object.create(this);
    clone.component = Object.create(this.component);
    clone.circularReference = {
      ...this.circularReference,
      prototype: { ...this },
    };
    return clone;
  }
}`,
    realWorldExample: 'ゲームオブジェクトの複製、ドキュメントテンプレート、GUIコンポーネントのクローン',
    relatedPatterns: ['Abstract Factory', 'Composite', 'Decorator'],
    difficulty: DifficultyLevel.Intermediate,
    popularity: 5,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-25'),
    tags: ['creational', 'prototype', 'clone'],
    prerequisites: [],
    alternatives: ['Factory Method']
  },
  {
    id: 'adapter',
    name: 'Adapter',
    category: PatternCategory.Structural,
    description: 'インターフェースに互換性のないクラス同士を接続するためのパターン',
    intent: 'あるクラスのインターフェースを、クライアントが期待する別のインターフェースに変換する。',
    motivation: '既存のクラスを変更せずに、異なるインターフェースを持つクラスと協調させたい場合に使用される。',
    structure: 'Adapterクラスは、AdapteeのインターフェースをTargetインターフェースに変換する。',
    participants: 'Target: クライアントが使用するインターフェース\nAdapter: TargetインターフェースをAdapteeに適合させる\nAdaptee: 適合が必要な既存のクラス',
    collaboration: 'AdapterはTargetインターフェースの要求をAdapteeへの呼び出しに変換する。',
    consequences: '既存のクラスを再利用でき、クラス間の互換性を確保できる。',
    implementation: 'クラスアダプター（継承）またはオブジェクトアダプター（委譲）を使用する。',
    sampleCode: `class Target {
  public request(): string {
    return 'Target: Default behavior.';
  }
}

class Adaptee {
  public specificRequest(): string {
    return '.eetpadA eht fo roivaheb laicepS';
  }
}

class Adapter extends Target {
  private adaptee: Adaptee;

  constructor(adaptee: Adaptee) {
    super();
    this.adaptee = adaptee;
  }

  public request(): string {
    const result = this.adaptee.specificRequest().split('').reverse().join('');
    return \`Adapter: (TRANSLATED) \${result}\`;
  }
}`,
    realWorldExample: 'レガシーシステムとの統合、サードパーティライブラリのラッパー、データフォーマット変換',
    relatedPatterns: ['Bridge', 'Decorator', 'Proxy'],
    difficulty: DifficultyLevel.Beginner,
    popularity: 8,
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-26'),
    tags: ['structural', 'adapter', 'wrapper'],
    prerequisites: [],
    alternatives: ['Facade']
  },
  {
    id: 'bridge',
    name: 'Bridge',
    category: PatternCategory.Structural,
    description: '抽象と実装を分離し、それぞれを独立に変更できるようにするパターン',
    intent: '抽象部分と実装部分を分離して、それぞれを独立に変更できるようにする。',
    motivation: '抽象と実装の両方を拡張可能にしたい場合や、実装の詳細をクライアントから隠したい場合に使用される。',
    structure: 'Abstractionは実装への参照を保持し、Implementorインターフェースを通じて実装を使用する。',
    participants: 'Abstraction: 抽象インターフェース\nRefinedAbstraction: 拡張された抽象\nImplementor: 実装インターフェース\nConcreteImplementor: 具体的な実装',
    collaboration: 'Abstractionは要求をImplementorに委譲する。',
    consequences: '実装の詳細を隠蔽でき、抽象と実装を独立に拡張できる。',
    implementation: '委譲を使用して抽象と実装を分離する。',
    sampleCode: `class Abstraction {
  protected implementation: Implementation;

  constructor(implementation: Implementation) {
    this.implementation = implementation;
  }

  public operation(): string {
    const result = this.implementation.operationImplementation();
    return \`Abstraction: Base operation with:
\${result}\`;
  }
}

interface Implementation {
  operationImplementation(): string;
}

class ConcreteImplementationA implements Implementation {
  public operationImplementation(): string {
    return 'ConcreteImplementationA';
  }
}`,
    realWorldExample: 'グラフィックスAPI、データベースドライバ、デバイスドライバ',
    relatedPatterns: ['Abstract Factory', 'Adapter'],
    difficulty: DifficultyLevel.Advanced,
    popularity: 5,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-27'),
    tags: ['structural', 'bridge', 'decoupling'],
    prerequisites: ['Adapter'],
    alternatives: ['Adapter']
  },
  {
    id: 'composite',
    name: 'Composite',
    category: PatternCategory.Structural,
    description: 'オブジェクトを木構造に組み立て、部分と全体の階層を表現するパターン',
    intent: 'オブジェクトを木構造に組み立てて、部分-全体階層を表現する。個々のオブジェクトとオブジェクトの集合を同じように扱えるようにする。',
    motivation: '部分-全体階層を表現したい場合や、個々のオブジェクトと複合オブジェクトを統一的に扱いたい場合に使用される。',
    structure: 'Componentインターフェースを定義し、LeafとCompositeがそれを実装する。',
    participants: 'Component: 共通インターフェース\nLeaf: 末端のオブジェクト\nComposite: 子を持つオブジェクト',
    collaboration: 'クライアントはComponentインターフェースを通じてLeafとCompositeを同じように扱う。',
    consequences: '階層構造を定義でき、クライアントコードを単純化できる。',
    implementation: '再帰的な構造を使用して、木構造を表現する。',
    sampleCode: `abstract class Component {
  protected parent: Component | null = null;

  public setParent(parent: Component | null) {
    this.parent = parent;
  }

  public getParent(): Component | null {
    return this.parent;
  }

  public add(component: Component): void {}
  public remove(component: Component): void {}
  public isComposite(): boolean {
    return false;
  }

  public abstract operation(): string;
}

class Leaf extends Component {
  public operation(): string {
    return 'Leaf';
  }
}

class Composite extends Component {
  protected children: Component[] = [];

  public add(component: Component): void {
    this.children.push(component);
    component.setParent(this);
  }

  public operation(): string {
    const results = [];
    for (const child of this.children) {
      results.push(child.operation());
    }
    return \`Branch(\${results.join('+')})\`;
  }

  public isComposite(): boolean {
    return true;
  }
}`,
    realWorldExample: 'ファイルシステム、GUIコンポーネントツリー、組織構造',
    relatedPatterns: ['Decorator', 'Flyweight', 'Iterator', 'Visitor'],
    difficulty: DifficultyLevel.Intermediate,
    popularity: 7,
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-28'),
    tags: ['structural', 'composite', 'tree'],
    prerequisites: [],
    alternatives: []
  },
  {
    id: 'decorator',
    name: 'Decorator',
    category: PatternCategory.Structural,
    description: 'オブジェクトに動的に新しい責任を追加するパターン',
    intent: 'オブジェクトに責任を動的に追加する。機能拡張のための柔軟な代替手段を提供する。',
    motivation: 'サブクラス化を使わずにオブジェクトに新しい機能を追加したい場合に使用される。',
    structure: 'Decoratorは同じインターフェースを実装し、装飾対象のオブジェクトを保持する。',
    participants: 'Component: 共通インターフェース\nConcreteComponent: 装飾される基本オブジェクト\nDecorator: 装飾の基底クラス\nConcreteDecorator: 具体的な装飾',
    collaboration: 'Decoratorは要求をComponentに転送し、前後に追加の処理を実行する。',
    consequences: '継承よりも柔軟に機能を追加でき、責任を動的に追加・削除できる。',
    implementation: '委譲を使用して、元のオブジェクトに機能を追加する。',
    sampleCode: `interface Component {
  operation(): string;
}

class ConcreteComponent implements Component {
  public operation(): string {
    return 'ConcreteComponent';
  }
}

class Decorator implements Component {
  protected component: Component;

  constructor(component: Component) {
    this.component = component;
  }

  public operation(): string {
    return this.component.operation();
  }
}

class ConcreteDecoratorA extends Decorator {
  public operation(): string {
    return \`ConcreteDecoratorA(\${super.operation()})\`;
  }
}`,
    realWorldExample: 'ストリームのラッパー、GUIコンポーネントのスキン、ロギング機能の追加',
    relatedPatterns: ['Adapter', 'Composite', 'Strategy'],
    difficulty: DifficultyLevel.Intermediate,
    popularity: 8,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-29'),
    tags: ['structural', 'decorator', 'wrapper'],
    prerequisites: [],
    alternatives: ['Strategy']
  },
  {
    id: 'facade',
    name: 'Facade',
    category: PatternCategory.Structural,
    description: 'サブシステムの複雑な機能群に対して、統一されたシンプルなインターフェースを提供するパターン',
    intent: 'サブシステムの一連のインターフェースに対して、統一されたインターフェースを提供する。',
    motivation: '複雑なサブシステムを簡単に使えるようにしたい場合や、サブシステムへの依存を減らしたい場合に使用される。',
    structure: 'Facadeクラスは、サブシステムの機能をまとめた簡単なインターフェースを提供する。',
    participants: 'Facade: サブシステムへの統一インターフェース\nSubsystem classes: 実際の機能を実装するクラス群',
    collaboration: 'クライアントはFacadeを通じてサブシステムと通信する。',
    consequences: 'サブシステムの使用を簡素化でき、クライアントとサブシステムの結合度を下げられる。',
    implementation: 'サブシステムの複数のクラスをラップする単一のクラスを作成する。',
    sampleCode: `class Subsystem1 {
  public operation1(): string {
    return 'Subsystem1: Ready!';
  }
}

class Subsystem2 {
  public operation2(): string {
    return 'Subsystem2: Go!';
  }
}

class Facade {
  protected subsystem1: Subsystem1;
  protected subsystem2: Subsystem2;

  constructor(subsystem1?: Subsystem1, subsystem2?: Subsystem2) {
    this.subsystem1 = subsystem1 || new Subsystem1();
    this.subsystem2 = subsystem2 || new Subsystem2();
  }

  public operation(): string {
    let result = 'Facade initializes subsystems:
';
    result += this.subsystem1.operation1();
    result += this.subsystem2.operation2();
    return result;
  }
}`,
    realWorldExample: 'ライブラリのラッパー、複雑なAPIの簡素化、システム間の統合',
    relatedPatterns: ['Abstract Factory', 'Mediator', 'Singleton'],
    difficulty: DifficultyLevel.Beginner,
    popularity: 9,
    createdAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-30'),
    tags: ['structural', 'facade', 'simplification'],
    prerequisites: [],
    alternatives: ['Adapter']
  },
  {
    id: 'flyweight',
    name: 'Flyweight',
    category: PatternCategory.Structural,
    description: '多数の細かいオブジェクトを効率的に共有して使用するパターン',
    intent: '多数の細かいオブジェクトを効率的にサポートするために、共有を使用する。',
    motivation: '大量の類似オブジェクトを使用する際のメモリ使用量を削減したい場合に使用される。',
    structure: 'Flyweightは共有可能な状態（内部状態）を保持し、共有不可能な状態（外部状態）はクライアントから渡される。',
    participants: 'Flyweight: 共有されるオブジェクトのインターフェース\nConcreteFlyweight: 共有される具体的なオブジェクト\nFlyweightFactory: Flyweightオブジェクトを作成・管理',
    collaboration: 'クライアントはFlyweightFactoryからFlyweightを取得し、外部状態を渡して使用する。',
    consequences: 'メモリ使用量を大幅に削減できるが、外部状態の管理が必要になる。',
    implementation: '共有可能な状態と共有不可能な状態を分離し、Factoryパターンでオブジェクトを管理する。',
    sampleCode: `class Flyweight {
  private sharedState: any;

  constructor(sharedState: any) {
    this.sharedState = sharedState;
  }

  public operation(uniqueState: any): void {
    const s = JSON.stringify(this.sharedState);
    const u = JSON.stringify(uniqueState);
    console.log(\`Flyweight: Shared (\${s}) and unique (\${u}) state.\`);
  }
}

class FlyweightFactory {
  private flyweights: {[key: string]: Flyweight} = {};

  constructor(initialFlyweights: string[][]) {
    for (const state of initialFlyweights) {
      this.flyweights[this.getKey(state)] = new Flyweight(state);
    }
  }

  private getKey(state: string[]): string {
    return state.join('_');
  }

  public getFlyweight(sharedState: string[]): Flyweight {
    const key = this.getKey(sharedState);

    if (!(key in this.flyweights)) {
      this.flyweights[key] = new Flyweight(sharedState);
    }

    return this.flyweights[key];
  }
}`,
    realWorldExample: 'テキストエディタの文字オブジェクト、ゲームの粒子システム、文字列プール',
    relatedPatterns: ['Composite', 'State', 'Strategy'],
    difficulty: DifficultyLevel.Advanced,
    popularity: 4,
    createdAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-31'),
    tags: ['structural', 'flyweight', 'optimization'],
    prerequisites: [],
    alternatives: []
  },
  {
    id: 'proxy',
    name: 'Proxy',
    category: PatternCategory.Structural,
    description: '他のオブジェクトへのアクセスを制御するための代理オブジェクトを提供するパターン',
    intent: '他のオブジェクトへのアクセスを制御するための代理や placeholder を提供する。',
    motivation: 'オブジェクトへのアクセスを制御したい場合や、遅延初期化、アクセス制御、ログ記録などを追加したい場合に使用される。',
    structure: 'ProxyはRealSubjectと同じインターフェースを実装し、RealSubjectへの参照を保持する。',
    participants: 'Subject: 共通インターフェース\nRealSubject: 実際のオブジェクト\nProxy: RealSubjectへのアクセスを制御する代理',
    collaboration: 'ProxyはRealSubjectへの要求を転送し、前後に追加の処理を実行する。',
    consequences: 'アクセス制御、遅延初期化、ログ記録などの機能を透過的に追加できる。',
    implementation: '委譲を使用して、実際のオブジェクトへのアクセスを制御する。',
    sampleCode: `interface Subject {
  request(): void;
}

class RealSubject implements Subject {
  public request(): void {
    console.log('RealSubject: Handling request.');
  }
}

class Proxy implements Subject {
  private realSubject: RealSubject;

  constructor(realSubject: RealSubject) {
    this.realSubject = realSubject;
  }

  public request(): void {
    if (this.checkAccess()) {
      this.realSubject.request();
      this.logAccess();
    }
  }

  private checkAccess(): boolean {
    console.log('Proxy: Checking access prior to firing a real request.');
    return true;
  }

  private logAccess(): void {
    console.log('Proxy: Logging the time of request.');
  }
}`,
    realWorldExample: '仮想プロキシ（遅延初期化）、保護プロキシ（アクセス制御）、リモートプロキシ（RPC）',
    relatedPatterns: ['Adapter', 'Decorator'],
    difficulty: DifficultyLevel.Intermediate,
    popularity: 7,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-02-01'),
    tags: ['structural', 'proxy', 'access-control'],
    prerequisites: [],
    alternatives: ['Decorator']
  },
  {
    id: 'chain-of-responsibility',
    name: 'Chain of Responsibility',
    category: PatternCategory.Behavioral,
    description: '要求を複数のオブジェクトに処理させる機会を与え、送信元と受信元の結合を避けるパターン',
    intent: '要求の送信元と受信元を分離し、複数のオブジェクトに要求を処理する機会を与える。',
    motivation: '複数のオブジェクトが要求を処理できる場合や、処理するオブジェクトを動的に決定したい場合に使用される。',
    structure: 'Handlerは次のHandlerへの参照を保持し、要求を処理するか次のHandlerに転送する。',
    participants: 'Handler: 要求を処理するインターフェース\nConcreteHandler: 具体的な処理を実装\nClient: 要求を送信',
    collaboration: 'クライアントは要求をチェーンの最初のHandlerに送信し、各Handlerは要求を処理するか次に転送する。',
    consequences: '送信元と受信元の結合を減らし、責任の割り当てを柔軟にできる。',
    implementation: 'リンクリストのような構造で、各ハンドラが次のハンドラへの参照を保持する。',
    sampleCode: `interface Handler {
  setNext(handler: Handler): Handler;
  handle(request: string): string | null;
}

abstract class AbstractHandler implements Handler {
  private nextHandler: Handler;

  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  public handle(request: string): string | null {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }
    return null;
  }
}

class ConcreteHandler1 extends AbstractHandler {
  public handle(request: string): string | null {
    if (request === 'Handler1') {
      return \`Handler1: Handled \${request}\`;
    }
    return super.handle(request);
  }
}`,
    realWorldExample: 'イベント処理、ロギングフレームワーク、承認ワークフロー',
    relatedPatterns: ['Composite', 'Command'],
    difficulty: DifficultyLevel.Intermediate,
    popularity: 6,
    createdAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-02-02'),
    tags: ['behavioral', 'chain', 'responsibility'],
    prerequisites: [],
    alternatives: []
  },
  {
    id: 'command',
    name: 'Command',
    category: PatternCategory.Behavioral,
    description: '要求をオブジェクトとしてカプセル化し、要求のパラメータ化、キュー化、ログ記録、アンドゥ操作をサポートするパターン',
    intent: '要求をオブジェクトとしてカプセル化し、異なる要求でクライアントをパラメータ化する。',
    motivation: '操作を記録、キュー化、アンドゥしたい場合や、トランザクション的な動作を実現したい場合に使用される。',
    structure: 'Commandインターフェースはexecuteメソッドを定義し、ConcreteCommandはReceiverへの操作をカプセル化する。',
    participants: 'Command: executeメソッドを定義\nConcreteCommand: Receiverとアクションをバインド\nInvoker: Commandを実行\nReceiver: 実際の処理を知っているクラス',
    collaboration: 'InvokerはCommandのexecuteを呼び出し、CommandはReceiverのメソッドを呼び出す。',
    consequences: '要求を送信するオブジェクトと実行するオブジェクトを分離でき、操作のアンドゥ・リドゥが可能になる。',
    implementation: 'Commandオブジェクトに操作とパラメータをカプセル化する。',
    sampleCode: `interface Command {
  execute(): void;
}

class SimpleCommand implements Command {
  private payload: string;

  constructor(payload: string) {
    this.payload = payload;
  }

  public execute(): void {
    console.log(\`SimpleCommand: (\${this.payload})\`);
  }
}

class ComplexCommand implements Command {
  private receiver: Receiver;
  private a: string;
  private b: string;

  constructor(receiver: Receiver, a: string, b: string) {
    this.receiver = receiver;
    this.a = a;
    this.b = b;
  }

  public execute(): void {
    this.receiver.doSomething(this.a);
    this.receiver.doSomethingElse(this.b);
  }
}

class Receiver {
  public doSomething(a: string): void {
    console.log(\`Receiver: Working on (\${a}.)\`);
  }
}`,
    realWorldExample: 'アンドゥ/リドゥ機能、マクロ記録、トランザクション処理',
    relatedPatterns: ['Memento', 'Prototype'],
    difficulty: DifficultyLevel.Intermediate,
    popularity: 7,
    createdAt: new Date('2024-01-27'),
    updatedAt: new Date('2024-02-03'),
    tags: ['behavioral', 'command', 'encapsulation'],
    prerequisites: [],
    alternatives: []
  },
  {
    id: 'interpreter',
    name: 'Interpreter',
    category: PatternCategory.Behavioral,
    description: '言語の文法を定義し、その言語で書かれた文を解釈するパターン',
    intent: '言語に対して、その文法表現と、文を解釈するインタプリタを定義する。',
    motivation: '簡単な言語や表現を解釈したい場合や、ドメイン固有言語（DSL）を実装したい場合に使用される。',
    structure: 'AbstractExpressionを定義し、TerminalExpressionとNonterminalExpressionがそれを実装する。',
    participants: 'AbstractExpression: 解釈操作のインターフェース\nTerminalExpression: 終端記号を表現\nNonterminalExpression: 非終端記号を表現\nContext: 解釈に必要な情報',
    collaboration: 'クライアントは構文木を構築し、Contextを使って解釈を実行する。',
    consequences: '文法を簡単に変更・拡張できるが、複雑な文法では効率が悪くなる。',
    implementation: 'Composite パターンを使用して構文木を表現する。',
    sampleCode: `interface Expression {
  interpret(context: Context): boolean;
}

class TerminalExpression implements Expression {
  private data: string;

  constructor(data: string) {
    this.data = data;
  }

  public interpret(context: Context): boolean {
    return context.lookup(this.data);
  }
}

class OrExpression implements Expression {
  private expr1: Expression;
  private expr2: Expression;

  constructor(expr1: Expression, expr2: Expression) {
    this.expr1 = expr1;
    this.expr2 = expr2;
  }

  public interpret(context: Context): boolean {
    return this.expr1.interpret(context) || this.expr2.interpret(context);
  }
}`,
    realWorldExample: '正規表現エンジン、SQLクエリパーサー、数式評価器',
    relatedPatterns: ['Composite', 'Flyweight', 'Iterator'],
    difficulty: DifficultyLevel.Advanced,
    popularity: 3,
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-02-04'),
    tags: ['behavioral', 'interpreter', 'language'],
    prerequisites: ['Composite'],
    alternatives: []
  },
  {
    id: 'iterator',
    name: 'Iterator',
    category: PatternCategory.Behavioral,
    description: 'コレクションの内部表現を公開せずに、その要素に順次アクセスする方法を提供するパターン',
    intent: '集約オブジェクトの内部表現を公開せずに、その要素に順次アクセスする方法を提供する。',
    motivation: 'コレクションの内部構造を隠蔽しながら要素にアクセスしたい場合や、複数の走査方法をサポートしたい場合に使用される。',
    structure: 'Iteratorインターフェースは走査メソッドを定義し、ConcreteIteratorはそれを実装する。',
    participants: 'Iterator: 要素にアクセスするインターフェース\nConcreteIterator: 具体的な走査の実装\nAggregate: Iteratorを作成するインターフェース\nConcreteAggregate: 具体的なコレクション',
    collaboration: 'ConcreteIteratorはAggregateの要素を追跡し、次の要素へのアクセスを提供する。',
    consequences: '集約オブジェクトのインターフェースを簡素化でき、複数の走査を同時に実行できる。',
    implementation: 'カーソル位置を保持し、next, hasNext などのメソッドを提供する。',
    sampleCode: `interface Iterator<T> {
  current(): T;
  next(): T;
  key(): number;
  valid(): boolean;
  rewind(): void;
}

interface Aggregator {
  getIterator(): Iterator<string>;
}

class AlphabeticalOrderIterator implements Iterator<string> {
  private collection: WordsCollection;
  private position: number = 0;
  private reverse: boolean = false;

  constructor(collection: WordsCollection, reverse: boolean = false) {
    this.collection = collection;
    this.reverse = reverse;

    if (reverse) {
      this.position = collection.getCount() - 1;
    }
  }

  public current(): string {
    return this.collection.getItems()[this.position];
  }

  public next(): string {
    const item = this.collection.getItems()[this.position];
    this.position += this.reverse ? -1 : 1;
    return item;
  }

  public key(): number {
    return this.position;
  }

  public valid(): boolean {
    if (this.reverse) {
      return this.position >= 0;
    }
    return this.position < this.collection.getCount();
  }

  public rewind(): void {
    this.position = this.reverse ? this.collection.getCount() - 1 : 0;
  }
}`,
    realWorldExample: 'コレクションの走査、ファイルシステムの探索、データベースの結果セット',
    relatedPatterns: ['Composite', 'Factory Method', 'Memento'],
    difficulty: DifficultyLevel.Beginner,
    popularity: 9,
    createdAt: new Date('2024-01-29'),
    updatedAt: new Date('2024-02-05'),
    tags: ['behavioral', 'iterator', 'traversal'],
    prerequisites: [],
    alternatives: []
  },
  {
    id: 'mediator',
    name: 'Mediator',
    category: PatternCategory.Behavioral,
    description: 'オブジェクト間の相互作用をカプセル化し、オブジェクト間の疎結合を促進するパターン',
    intent: 'オブジェクト間の相互作用をカプセル化するオブジェクトを定義する。',
    motivation: '多数のオブジェクト間の複雑な相互作用を整理したい場合や、オブジェクト間の結合度を下げたい場合に使用される。',
    structure: 'Mediatorインターフェースは通信メソッドを定義し、ConcreteMediator は Colleague間の調整を行う。',
    participants: 'Mediator: 通信のインターフェース\nConcreteMediator: Colleague間の協調を実装\nColleague: 他のColleagueと通信するオブジェクト',
    collaboration: 'ColleagueはMediatorを通じて他のColleagueと通信する。',
    consequences: 'オブジェクト間の結合度を下げられるが、Mediatorが複雑になる可能性がある。',
    implementation: 'Colleagueオブジェクトは相互に参照せず、Mediatorを通じて通信する。',
    sampleCode: `interface Mediator {
  notify(sender: object, event: string): void;
}

class ConcreteMediator implements Mediator {
  private component1: Component1;
  private component2: Component2;

  constructor(c1: Component1, c2: Component2) {
    this.component1 = c1;
    this.component1.setMediator(this);
    this.component2 = c2;
    this.component2.setMediator(this);
  }

  public notify(sender: object, event: string): void {
    if (event === 'A') {
      this.component2.doC();
    }
    if (event === 'D') {
      this.component1.doB();
    }
  }
}

class BaseComponent {
  protected mediator: Mediator;

  constructor(mediator?: Mediator) {
    this.mediator = mediator!;
  }

  public setMediator(mediator: Mediator): void {
    this.mediator = mediator;
  }
}`,
    realWorldExample: 'チャットルーム、航空管制システム、GUIフォームの制御',
    relatedPatterns: ['Facade', 'Observer'],
    difficulty: DifficultyLevel.Intermediate,
    popularity: 6,
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-02-06'),
    tags: ['behavioral', 'mediator', 'communication'],
    prerequisites: [],
    alternatives: ['Observer']
  },
  {
    id: 'memento',
    name: 'Memento',
    category: PatternCategory.Behavioral,
    description: 'オブジェクトの内部状態を保存し、後でその状態に復元できるようにするパターン',
    intent: 'カプセル化を破壊せずに、オブジェクトの内部状態をキャプチャして外部化し、後でオブジェクトをその状態に戻せるようにする。',
    motivation: 'オブジェクトの状態を保存・復元したい場合や、アンドゥ機能を実装したい場合に使用される。',
    structure: 'Originatorは状態を持ち、Mementoを作成する。Caretakerは Memento を保存する。',
    participants: 'Memento: Originatorの内部状態を保存\nOriginator: Mementoを作成し、それを使って復元\nCaretaker: Mementoを保管',
    collaboration: 'CaretakerはOriginatorにMementoを要求し、後でそれを使ってOriginatorの状態を復元する。',
    consequences: 'カプセル化を保ちながら状態を保存・復元できるが、大量のMementoを保存するとコストがかかる。',
    implementation: 'Originatorの内部状態のスナップショットを保存するオブジェクトを作成する。',
    sampleCode: `class Memento {
  private state: string;
  private date: string;

  constructor(state: string) {
    this.state = state;
    this.date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  }

  public getState(): string {
    return this.state;
  }

  public getDate(): string {
    return this.date;
  }
}

class Originator {
  private state: string;

  constructor(state: string) {
    this.state = state;
  }

  public save(): Memento {
    return new Memento(this.state);
  }

  public restore(memento: Memento): void {
    this.state = memento.getState();
  }
}

class Caretaker {
  private mementos: Memento[] = [];
  private originator: Originator;

  constructor(originator: Originator) {
    this.originator = originator;
  }

  public backup(): void {
    this.mementos.push(this.originator.save());
  }

  public undo(): void {
    if (!this.mementos.length) {
      return;
    }
    const memento = this.mementos.pop();
    this.originator.restore(memento!);
  }
}`,
    realWorldExample: 'アンドゥ/リドゥ機能、トランザクションのロールバック、ゲームのセーブポイント',
    relatedPatterns: ['Command', 'Iterator'],
    difficulty: DifficultyLevel.Intermediate,
    popularity: 5,
    createdAt: new Date('2024-01-31'),
    updatedAt: new Date('2024-02-07'),
    tags: ['behavioral', 'memento', 'state'],
    prerequisites: [],
    alternatives: []
  },
  {
    id: 'state',
    name: 'State',
    category: PatternCategory.Behavioral,
    description: 'オブジェクトの内部状態に応じて振る舞いを変更できるようにするパターン',
    intent: 'オブジェクトの内部状態が変化したときに、オブジェクトの振る舞いを変更する。',
    motivation: 'オブジェクトの振る舞いが状態に依存する場合や、状態遷移のロジックを整理したい場合に使用される。',
    structure: 'Contextは現在のStateを保持し、Stateインターフェースを通じて振る舞いを委譲する。',
    participants: 'Context: 現在の状態を保持\nState: 状態固有の振る舞いのインターフェース\nConcreteState: 特定の状態における振る舞いを実装',
    collaboration: 'Contextは要求をStateに委譲し、Stateは必要に応じてContextの状態を変更する。',
    consequences: '状態固有の振る舞いを局所化でき、状態遷移を明示的にできる。',
    implementation: '各状態をクラスとして表現し、状態遷移を状態クラス内で管理する。',
    sampleCode: `class Context {
  private state: State;

  constructor(state: State) {
    this.transitionTo(state);
  }

  public transitionTo(state: State): void {
    this.state = state;
    this.state.setContext(this);
  }

  public request1(): void {
    this.state.handle1();
  }

  public request2(): void {
    this.state.handle2();
  }
}

abstract class State {
  protected context: Context;

  public setContext(context: Context) {
    this.context = context;
  }

  public abstract handle1(): void;
  public abstract handle2(): void;
}

class ConcreteStateA extends State {
  public handle1(): void {
    console.log('ConcreteStateA handles request1.');
    this.context.transitionTo(new ConcreteStateB());
  }

  public handle2(): void {
    console.log('ConcreteStateA handles request2.');
  }
}`,
    realWorldExample: 'TCPコネクションの状態管理、ゲームキャラクターの状態、注文処理のステータス',
    relatedPatterns: ['Flyweight', 'Singleton'],
    difficulty: DifficultyLevel.Intermediate,
    popularity: 7,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-08'),
    tags: ['behavioral', 'state', 'context'],
    prerequisites: [],
    alternatives: ['Strategy']
  },
  {
    id: 'strategy',
    name: 'Strategy',
    category: PatternCategory.Behavioral,
    description: 'アルゴリズムのファミリーを定義し、それぞれをカプセル化して交換可能にするパターン',
    intent: 'アルゴリズムのファミリーを定義し、それぞれをカプセル化して、相互に交換可能にする。',
    motivation: '関連するアルゴリズムのグループがある場合や、アルゴリズムを実行時に選択したい場合に使用される。',
    structure: 'Contextは Strategyへの参照を保持し、Strategyインターフェースを通じてアルゴリズムを実行する。',
    participants: 'Strategy: アルゴリズムのインターフェース\nConcreteStrategy: 具体的なアルゴリズムの実装\nContext: Strategyを使用するクラス',
    collaboration: 'ContextはStrategyに処理を委譲し、必要なデータを渡す。',
    consequences: 'アルゴリズムを独立に変更でき、条件分岐を減らせる。',
    implementation: 'アルゴリズムをクラスとしてカプセル化し、委譲を使用する。',
    sampleCode: `class Context {
  private strategy: Strategy;

  constructor(strategy: Strategy) {
    this.strategy = strategy;
  }

  public setStrategy(strategy: Strategy) {
    this.strategy = strategy;
  }

  public doSomeBusinessLogic(): void {
    const result = this.strategy.doAlgorithm(['a', 'b', 'c', 'd', 'e']);
    console.log(result.join(','));
  }
}

interface Strategy {
  doAlgorithm(data: string[]): string[];
}

class ConcreteStrategyA implements Strategy {
  public doAlgorithm(data: string[]): string[] {
    return data.sort();
  }
}

class ConcreteStrategyB implements Strategy {
  public doAlgorithm(data: string[]): string[] {
    return data.reverse();
  }
}`,
    realWorldExample: 'ソートアルゴリズムの選択、支払い方法の選択、圧縮アルゴリズムの選択',
    relatedPatterns: ['Flyweight', 'State'],
    difficulty: DifficultyLevel.Beginner,
    popularity: 9,
    createdAt: new Date('2024-02-02'),
    updatedAt: new Date('2024-02-09'),
    tags: ['behavioral', 'strategy', 'algorithm'],
    prerequisites: [],
    alternatives: ['State']
  },
  {
    id: 'template-method',
    name: 'Template Method',
    category: PatternCategory.Behavioral,
    description: 'アルゴリズムの骨格を定義し、いくつかのステップをサブクラスに委譲するパターン',
    intent: 'アルゴリズムの骨格を操作として定義し、いくつかのステップをサブクラスに委譲する。',
    motivation: 'アルゴリズムの構造を保ちながら、特定のステップをサブクラスでカスタマイズしたい場合に使用される。',
    structure: 'AbstractClassはテンプレートメソッドと抽象メソッドを定義し、ConcreteClassは抽象メソッドを実装する。',
    participants: 'AbstractClass: テンプレートメソッドとプリミティブ操作を定義\nConcreteClass: プリミティブ操作を実装',
    collaboration: 'ConcreteClassはAbstractClassのテンプレートメソッドを呼び出し、必要な操作を実装する。',
    consequences: 'コードの再利用を促進し、共通の処理を親クラスに集約できる。',
    implementation: '抽象クラスにテンプレートメソッドを定義し、サブクラスで具体的なステップを実装する。',
    sampleCode: `abstract class AbstractClass {
  public templateMethod(): void {
    this.baseOperation1();
    this.requiredOperations1();
    this.baseOperation2();
    this.hook1();
    this.requiredOperation2();
    this.baseOperation3();
    this.hook2();
  }

  protected baseOperation1(): void {
    console.log('AbstractClass says: I am doing the bulk of the work');
  }

  protected baseOperation2(): void {
    console.log('AbstractClass says: But I let subclasses override some operations');
  }

  protected baseOperation3(): void {
    console.log('AbstractClass says: But I am doing the bulk of the work anyway');
  }

  protected abstract requiredOperations1(): void;
  protected abstract requiredOperation2(): void;

  protected hook1(): void { }
  protected hook2(): void { }
}

class ConcreteClass1 extends AbstractClass {
  protected requiredOperations1(): void {
    console.log('ConcreteClass1 says: Implemented Operation1');
  }

  protected requiredOperation2(): void {
    console.log('ConcreteClass1 says: Implemented Operation2');
  }
}`,
    realWorldExample: 'データ処理パイプライン、フレームワークのライフサイクルメソッド、テストフレームワーク',
    relatedPatterns: ['Factory Method', 'Strategy'],
    difficulty: DifficultyLevel.Beginner,
    popularity: 7,
    createdAt: new Date('2024-02-03'),
    updatedAt: new Date('2024-02-10'),
    tags: ['behavioral', 'template', 'inheritance'],
    prerequisites: [],
    alternatives: ['Strategy']
  },
  {
    id: 'visitor',
    name: 'Visitor',
    category: PatternCategory.Behavioral,
    description: 'オブジェクト構造から操作を分離し、構造を変更せずに新しい操作を追加できるようにするパターン',
    intent: 'オブジェクト構造の要素に対して実行する操作を表現する。構造を変更せずに新しい操作を定義できる。',
    motivation: 'オブジェクト構造に対する操作を追加したいが、クラスを変更したくない場合に使用される。',
    structure: 'Visitorインターフェースは各要素型に対する visit メソッドを定義し、ConcreteVisitorはそれを実装する。',
    participants: 'Visitor: 各要素を訪問するメソッドを定義\nConcreteVisitor: 具体的な操作を実装\nElement: accept メソッドを定義\nConcreteElement: 具体的な要素',
    collaboration: 'ElementはVisitorのvisitメソッドを呼び出し、自身を渡す。',
    consequences: '新しい操作を簡単に追加できるが、新しい要素型を追加するのが難しくなる。',
    implementation: 'ダブルディスパッチを使用して、適切なvisitメソッドを呼び出す。',
    sampleCode: `interface Component {
  accept(visitor: Visitor): void;
}

class ConcreteComponentA implements Component {
  public accept(visitor: Visitor): void {
    visitor.visitConcreteComponentA(this);
  }

  public exclusiveMethodOfConcreteComponentA(): string {
    return 'A';
  }
}

interface Visitor {
  visitConcreteComponentA(element: ConcreteComponentA): void;
  visitConcreteComponentB(element: ConcreteComponentB): void;
}

class ConcreteVisitor1 implements Visitor {
  public visitConcreteComponentA(element: ConcreteComponentA): void {
    console.log(\`\${element.exclusiveMethodOfConcreteComponentA()} + ConcreteVisitor1\`);
  }

  public visitConcreteComponentB(element: ConcreteComponentB): void {
    console.log(\`\${element.specialMethodOfConcreteComponentB()} + ConcreteVisitor1\`);
  }
}`,
    realWorldExample: 'コンパイラのAST処理、ドキュメント構造の操作、ファイルシステムの走査',
    relatedPatterns: ['Composite', 'Interpreter'],
    difficulty: DifficultyLevel.Advanced,
    popularity: 4,
    createdAt: new Date('2024-02-04'),
    updatedAt: new Date('2024-02-11'),
    tags: ['behavioral', 'visitor', 'traversal'],
    prerequisites: ['Composite'],
    alternatives: []
  }
];

export function getDesignPatterns(): DesignPattern[] {
  return designPatterns;
}

export function getPatternWithDetails(id: string): DesignPattern | undefined {
  const pattern = getPatternById(id);
  if (!pattern) return undefined;

  return {
    ...pattern,
    prerequisites: pattern.prerequisites || [],
    alternatives: pattern.alternatives || [],
    tags: pattern.tags || [],
    createdAt: pattern.createdAt || new Date(),
    updatedAt: pattern.updatedAt || new Date()
  };
}

export function searchPatternsAdvanced(
  query: string,
  options: {
    category?: PatternCategory[];
    difficulty?: DifficultyLevel[];
    tags?: string[];
    minPopularity?: number;
  } = {}
): DesignPattern[] {
  const lowerQuery = query.toLowerCase();
  return designPatterns.filter(pattern => {
    const matchesQuery = 
      pattern.name.toLowerCase().includes(lowerQuery) ||
      pattern.description.toLowerCase().includes(lowerQuery) ||
      pattern.intent.toLowerCase().includes(lowerQuery);

    const matchesCategory = !options.category || options.category.includes(pattern.category);
    const matchesDifficulty = !options.difficulty || options.difficulty.includes(pattern.difficulty);
    const matchesTags = !options.tags || options.tags.some(tag => pattern.tags?.includes(tag) || false);
    const matchesPopularity = !options.minPopularity || (pattern.popularity >= options.minPopularity);

    return matchesQuery && matchesCategory && matchesDifficulty && matchesTags && matchesPopularity;
  });
}

export function getLearningProgress(userId: string, patternId: string): LearningProgress | undefined {
  // 仮の実装、実際はAPIやデータベースから取得
  return {
    patternId,
    completed: false,
    timeSpent: 0,
    quizResults: []
  };
}

export function updateLearningProgress(
  userId: string,
  patternId: string,
  progress: Partial<LearningProgress>
): LearningProgress {
  // 仮の実装、実際はAPIやデータベースに保存
  const currentProgress = getLearningProgress(userId, patternId) || {
    patternId,
    completed: false,
    timeSpent: 0,
    quizResults: []
  };

  return {
    ...currentProgress,
    ...progress,
    completedAt: progress.completed ? new Date() : currentProgress.completedAt
  };
}

export function getPatternById(id: string): DesignPattern | undefined {
  return designPatterns.find(pattern => pattern.id === id);
}

export function searchPatterns(query: string): DesignPattern[] {
  const lowerQuery = query.toLowerCase();
  return designPatterns.filter(pattern => 
    pattern.name.toLowerCase().includes(lowerQuery) ||
    pattern.description.toLowerCase().includes(lowerQuery) ||
    pattern.intent.toLowerCase().includes(lowerQuery)
  );
}