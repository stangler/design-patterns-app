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
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  prerequisites?: string[];
  alternatives?: string[];
}

// カテゴリー型
export enum PatternCategory {
  Creational = 'Creational',
  Structural = 'Structural',
  Behavioral = 'Behavioral',
  Architectural = 'Architectural'
}

// 難易度型
export enum DifficultyLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  Expert = 'Expert'
}

// 学習進捗型
export interface LearningProgress {
  patternId: string;
  completed: boolean;
  completedAt?: Date;
  score?: number;
  notes?: string;
  timeSpent?: number; // 学習にかかった時間（分）
  quizResults?: QuizResult[];
}

// クイズ結果型
export interface QuizResult {
  quizId: string;
  score: number;
  completedAt: Date;
  correctAnswers: number;
  totalQuestions: number;
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
  role: UserRole;
  preferences: UserPreferences;
}

// ユーザーロール型
export enum UserRole {
  Student = 'Student',
  Instructor = 'Instructor',
  Admin = 'Admin'
}

// ユーザープリファレンス型
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'ja' | 'en';
  difficultyFilter: DifficultyLevel[];
  categoryFilter: PatternCategory[];
  notificationSettings: NotificationSettings;
}

// 通知設定型
export interface NotificationSettings {
  email: boolean;
  inApp: boolean;
  frequency: 'immediately' | 'daily' | 'weekly';
}
