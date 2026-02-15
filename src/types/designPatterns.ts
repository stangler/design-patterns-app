// デザインパターンの基本情報型
export interface DesignPattern {
  id: string;
  name: string;
  category: PatternCategory;
  description: string;
  intent: string;
  motivation: string;
  structure: string;
  participants: string;
  collaboration: string;
  consequences: string;
  implementation: string;
  sampleCode: string;
  realWorldExample: string;
  relatedPatterns: string[];
  difficulty: DifficultyLevel;
  popularity: number;
}

// カテゴリー型
export enum PatternCategory {
  Creational = 'Creational',
  Structural = 'Structural',
  Behavioral = 'Behavioral'
}

// 難易度型
export enum DifficultyLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced'
}

// 学習進捗型
export interface LearningProgress {
  patternId: string;
  completed: boolean;
  completedAt?: Date;
  score?: number;
  notes?: string;
}

// ユーザープロフィール型
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  learningProgress: LearningProgress[];
  favoritePatterns: string[];
  createdDate: Date;
  lastLogin: Date;
}