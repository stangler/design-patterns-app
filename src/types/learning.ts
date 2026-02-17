// ================================
// 学習進捗ステータス
// ================================

export type LearningStatus = 'not_started' | 'in_progress' | 'completed';

// ================================
// 学習進捗
// ================================

export interface LearningProgress {
  id: string;
  user_id: string;
  pattern_id: string;
  status: LearningStatus;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

// ================================
// クイズ回答履歴
// ================================

export type QuestionType = 'implementation' | 'advanced';

export interface QuizAnswer {
  id: string;
  user_id: string;
  pattern_id: string;
  question_type: QuestionType;
  answer: string;
  is_correct: boolean;
  created_at: string;
}

// ================================
// 学習履歴
// ================================

export type LearningAction = 'view' | 'start' | 'complete';

export interface LearningHistory {
  id: string;
  user_id: string;
  pattern_id: string;
  action: LearningAction;
  created_at: string;
}

// ================================
// 統計情報
// ================================

export interface LearningStats {
  totalPatterns: number;
  completedCount: number;
  inProgressCount: number;
  notStartedCount: number;
  completionRate: number;
  categoryStats: CategoryStats;
  recentActivity: LearningHistory[];
  quizStats: QuizStats;
}

export interface CategoryStats {
  creational: CategoryProgress;
  structural: CategoryProgress;
  behavioral: CategoryProgress;
}

export interface CategoryProgress {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
}

export interface QuizStats {
  totalAnswers: number;
  correctAnswers: number;
  correctRate: number;
  byPattern: PatternQuizStats[];
}

export interface PatternQuizStats {
  pattern_id: string;
  total: number;
  correct: number;
  correctRate: number;
}

// ================================
// API レスポンス型
// ================================

export interface LearningProgressResponse {
  data: LearningProgress | null;
  error: string | null;
}

export interface LearningProgressListResponse {
  data: LearningProgress[] | null;
  error: string | null;
}

export interface QuizAnswerResponse {
  data: QuizAnswer | null;
  error: string | null;
}

export interface LearningStatsResponse {
  data: LearningStats | null;
  error: string | null;
}