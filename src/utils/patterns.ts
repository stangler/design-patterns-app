import { DesignPattern, PatternCategory, DifficultyLevel } from '@/types/designPatterns';

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
    popularity: 8
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
    popularity: 7
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
    popularity: 9
  }
];

export function getDesignPatterns(): DesignPattern[] {
  return designPatterns;
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