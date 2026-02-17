// ================================
// Pattern Category
// ================================

export type PatternCategory =
  | 'creational'
  | 'structural'
  | 'behavioral';

// ================================
// Design Pattern Base
// ================================

export interface DesignPattern {
  id: string;
  name: string;
  category: PatternCategory;
  description: string;
  difficulty: 1 | 2 | 3;
}

// ================================
// Extended (詳細ページ用)
// ================================

export interface DesignPatternWithDetails extends DesignPattern {
  overview?: string;
  problem?: string;
  solution?: string;
  codeExample?: string;
}
