import { getSupabaseClient } from './supabase-client';
import type {
  LearningProgress,
  LearningStatus,
  QuizAnswer,
  QuestionType,
  LearningHistory,
  LearningAction,
  LearningStats,
  CategoryStats,
  CategoryProgress,
  QuizStats,
  PatternQuizStats,
} from '@/types/learning';
import { designPatterns } from '@/utils/patterns';

// ================================
// 学習進捗操作
// ================================

/**
 * ユーザーの全学習進捗を取得
 */
export async function getAllLearningProgress(
  userId: string
): Promise<LearningProgress[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('learning_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Failed to fetch learning progress:', error);
    return [];
  }

  return data || [];
}

/**
 * 特定パターンの学習進捗を取得
 */
export async function getLearningProgress(
  userId: string,
  patternId: string
): Promise<LearningProgress | null> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('pattern_id', patternId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // データが存在しない
      return null;
    }
    console.error('Failed to fetch learning progress:', error);
    return null;
  }

  return data;
}

/**
 * 学習進捗を更新または作成
 */
export async function upsertLearningProgress(
  userId: string,
  patternId: string,
  status: LearningStatus
): Promise<LearningProgress | null> {
  const supabase = getSupabaseClient();
  
  const now = new Date().toISOString();
  const updateData: Record<string, unknown> = {
    user_id: userId,
    pattern_id: patternId,
    status,
    updated_at: now,
  };

  // ステータスに応じて日時を設定
  if (status === 'in_progress') {
    updateData.started_at = now;
  } else if (status === 'completed') {
    updateData.completed_at = now;
  }

  const { data, error } = await supabase
    .from('learning_progress')
    .upsert(updateData, {
      onConflict: 'user_id,pattern_id',
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to upsert learning progress:', error);
    return null;
  }

  // 履歴にも記録
  await recordLearningHistory(userId, patternId, status === 'in_progress' ? 'start' : status === 'completed' ? 'complete' : 'view');

  return data;
}

// ================================
// クイズ回答操作
// ================================

/**
 * クイズ回答を記録
 */
export async function recordQuizAnswer(
  userId: string,
  patternId: string,
  questionType: QuestionType,
  answer: string,
  isCorrect: boolean
): Promise<QuizAnswer | null> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('quiz_answers')
    .insert({
      user_id: userId,
      pattern_id: patternId,
      question_type: questionType,
      answer,
      is_correct: isCorrect,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to record quiz answer:', error);
    return null;
  }

  return data;
}

/**
 * ユーザーのクイズ回答履歴を取得
 */
export async function getQuizAnswers(
  userId: string,
  patternId?: string
): Promise<QuizAnswer[]> {
  const supabase = getSupabaseClient();
  
  let query = supabase
    .from('quiz_answers')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (patternId) {
    query = query.eq('pattern_id', patternId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Failed to fetch quiz answers:', error);
    return [];
  }

  return data || [];
}

/**
 * パターン別のクイズ統計を取得
 */
export async function getQuizStatsByPattern(
  userId: string,
  patternId: string
): Promise<{ total: number; correct: number } | null> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('quiz_answers')
    .select('is_correct')
    .eq('user_id', userId)
    .eq('pattern_id', patternId);

  if (error) {
    console.error('Failed to fetch quiz stats:', error);
    return null;
  }

  if (!data || data.length === 0) {
    return { total: 0, correct: 0 };
  }

  return {
    total: data.length,
    correct: data.filter((d) => d.is_correct).length,
  };
}

// ================================
// 学習履歴操作
// ================================

/**
 * 学習履歴を記録
 */
export async function recordLearningHistory(
  userId: string,
  patternId: string,
  action: LearningAction
): Promise<LearningHistory | null> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('learning_history')
    .insert({
      user_id: userId,
      pattern_id: patternId,
      action,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to record learning history:', error);
    return null;
  }

  return data;
}

/**
 * ユーザーの学習履歴を取得
 */
export async function getLearningHistory(
  userId: string,
  limit: number = 50
): Promise<LearningHistory[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('learning_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch learning history:', error);
    return [];
  }

  return data || [];
}

// ================================
// 統計情報
// ================================

/**
 * 学習統計を取得
 */
export async function getLearningStats(userId: string): Promise<LearningStats> {
  const [progressList, quizAnswers, history] = await Promise.all([
    getAllLearningProgress(userId),
    getQuizAnswers(userId),
    getLearningHistory(userId, 20),
  ]);

  // 基本統計
  const totalPatterns = designPatterns.length;
  const completedCount = progressList.filter((p) => p.status === 'completed').length;
  const inProgressCount = progressList.filter((p) => p.status === 'in_progress').length;
  const notStartedCount = totalPatterns - completedCount - inProgressCount;
  const completionRate = totalPatterns > 0 ? Math.round((completedCount / totalPatterns) * 100) : 0;

  // カテゴリー別統計
  const categoryStats = calculateCategoryStats(progressList);

  // クイズ統計
  const quizStats = calculateQuizStats(quizAnswers);

  return {
    totalPatterns,
    completedCount,
    inProgressCount,
    notStartedCount,
    completionRate,
    categoryStats,
    recentActivity: history,
    quizStats,
  };
}

/**
 * カテゴリー別統計を計算
 */
function calculateCategoryStats(progressList: LearningProgress[]): CategoryStats {
  const categories = ['creational', 'structural', 'behavioral'] as const;
  const stats: CategoryStats = {
    creational: { total: 0, completed: 0, inProgress: 0, notStarted: 0 },
    structural: { total: 0, completed: 0, inProgress: 0, notStarted: 0 },
    behavioral: { total: 0, completed: 0, inProgress: 0, notStarted: 0 },
  };

  // 各カテゴリーのパターン数をカウント
  for (const pattern of designPatterns) {
    stats[pattern.category].total++;
    
    const progress = progressList.find((p) => p.pattern_id === pattern.id);
    if (progress) {
      if (progress.status === 'completed') {
        stats[pattern.category].completed++;
      } else if (progress.status === 'in_progress') {
        stats[pattern.category].inProgress++;
      } else {
        stats[pattern.category].notStarted++;
      }
    } else {
      stats[pattern.category].notStarted++;
    }
  }

  return stats;
}

/**
 * クイズ統計を計算
 */
function calculateQuizStats(quizAnswers: QuizAnswer[]): QuizStats {
  const totalAnswers = quizAnswers.length;
  const correctAnswers = quizAnswers.filter((a) => a.is_correct).length;
  const correctRate = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  // パターン別統計
  const patternMap = new Map<string, { total: number; correct: number }>();
  
  for (const answer of quizAnswers) {
    const existing = patternMap.get(answer.pattern_id) || { total: 0, correct: 0 };
    existing.total++;
    if (answer.is_correct) {
      existing.correct++;
    }
    patternMap.set(answer.pattern_id, existing);
  }

  const byPattern: PatternQuizStats[] = Array.from(patternMap.entries()).map(
    ([pattern_id, stats]) => ({
      pattern_id,
      total: stats.total,
      correct: stats.correct,
      correctRate: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    })
  );

  return {
    totalAnswers,
    correctAnswers,
    correctRate,
    byPattern,
  };
}

// ================================
// アクティビティカレンダー用データ
// ================================

export interface ActivityData {
  date: string;
  count: number;
}

/**
 * 指定期間のアクティビティデータを取得
 */
export async function getActivityData(
  userId: string,
  days: number = 365
): Promise<ActivityData[]> {
  const supabase = getSupabaseClient();
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('learning_history')
    .select('created_at')
    .eq('user_id', userId)
    .gte('created_at', startDate.toISOString());

  if (error) {
    console.error('Failed to fetch activity data:', error);
    return [];
  }

  // 日付ごとにカウント
  const activityMap = new Map<string, number>();
  
  for (const item of data || []) {
    const date = new Date(item.created_at).toISOString().split('T')[0];
    const count = activityMap.get(date) || 0;
    activityMap.set(date, count + 1);
  }

  return Array.from(activityMap.entries()).map(([date, count]) => ({
    date,
    count,
  }));
}