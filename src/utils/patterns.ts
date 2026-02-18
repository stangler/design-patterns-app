import type {
  DesignPattern,
  DesignPatternWithDetails,
} from '@/types/designPatterns';

// ===================================
// 一覧データ（22パターン）
// ===================================

export const designPatterns: DesignPattern[] = [
  // ===== Creational =====
  { id: 'singleton', name: 'Singleton', category: 'creational', description: 'クラスのインスタンスを1つだけ保証する。', difficulty: 1 },
  { id: 'factory-method', name: 'Factory Method', category: 'creational', description: 'オブジェクトの生成をサブクラスに委ねる。', difficulty: 2 },
  { id: 'abstract-factory', name: 'Abstract Factory', category: 'creational', description: '関連するオブジェクトのファミリーを生成する。', difficulty: 3 },
  { id: 'builder', name: 'Builder', category: 'creational', description: '複雑なオブジェクトを段階的に構築する。', difficulty: 2 },
  { id: 'prototype', name: 'Prototype', category: 'creational', description: '既存のオブジェクトをクローンする。', difficulty: 2 },

  // ===== Structural =====
  { id: 'adapter', name: 'Adapter', category: 'structural', description: 'インターフェースを別のインターフェースに変換する。', difficulty: 2 },
  { id: 'bridge', name: 'Bridge', category: 'structural', description: '抽象と実装を分離する。', difficulty: 3 },
  { id: 'composite', name: 'Composite', category: 'structural', description: 'オブジェクトをツリー構造に組み合わせる。', difficulty: 2 },
  { id: 'decorator', name: 'Decorator', category: 'structural', description: 'オブジェクトに責務を動的に追加する。', difficulty: 2 },
  { id: 'facade', name: 'Facade', category: 'structural', description: 'シンプルなインターフェースを提供する。', difficulty: 1 },
  { id: 'flyweight', name: 'Flyweight', category: 'structural', description: '共通部分を効率的に共有する。', difficulty: 3 },
  { id: 'proxy', name: 'Proxy', category: 'structural', description: '別のオブジェクトへのアクセスを制御する。', difficulty: 2 },

  // ===== Behavioral =====
  { id: 'chain-of-responsibility', name: 'Chain of Responsibility', category: 'behavioral', description: 'リクエストをハンドラーチェーンに渡す。', difficulty: 3 },
  { id: 'command', name: 'Command', category: 'behavioral', description: 'リクエストをオブジェクトとしてカプセル化する。', difficulty: 2 },
  { id: 'iterator', name: 'Iterator', category: 'behavioral', description: '要素に順次アクセスする。', difficulty: 1 },
  { id: 'mediator', name: 'Mediator', category: 'behavioral', description: '直接的な依存関係を減らす。', difficulty: 3 },
  { id: 'memento', name: 'Memento', category: 'behavioral', description: 'オブジェクトの状態を保存する。', difficulty: 3 },
  { id: 'observer', name: 'Observer', category: 'behavioral', description: '複数の依存オブジェクトに通知する。', difficulty: 1 },
  { id: 'state', name: 'State', category: 'behavioral', description: '状態の変化に応じて振る舞いを変える。', difficulty: 2 },
  { id: 'strategy', name: 'Strategy', category: 'behavioral', description: '交換可能なアルゴリズムをカプセル化する。', difficulty: 1 },
  { id: 'template-method', name: 'Template Method', category: 'behavioral', description: 'アルゴリズムの骨格を定義する。', difficulty: 2 },
  { id: 'visitor', name: 'Visitor', category: 'behavioral', description: '操作をオブジェクトから分離する。', difficulty: 3 },
];

// ===================================
// 基本取得
// ===================================

export const getDesignPatterns = (): DesignPattern[] => {
  return designPatterns;
};

export const getPatternById = (
  id: string
): DesignPattern | undefined => {
  return designPatterns.find((p) => p.id === id);
};

export const searchPatterns = (query: string): DesignPattern[] => {
  if (!query.trim()) return designPatterns;

  const lower = query.toLowerCase();
  return designPatterns.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower)
  );
};

// ===================================
// 詳細取得（仮データ）
// ===================================

export const getPatternWithDetails = (
  id: string
): DesignPatternWithDetails | undefined => {
  const base = getPatternById(id);
  if (!base) return undefined;

  return {
    ...base,
    overview: `${base.name} pattern overview.`,
    problem: `What problem does ${base.name} solve?`,
    solution: `How does ${base.name} solve the problem?`,
    codeExample: `// ${base.name} example
class Example {
  execute() {
    console.log("${base.name} pattern example");
  }
}`,
  };
};