'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  getAllLearningProgress,
  upsertLearningProgress,
  getLearningStats,
  recordQuizAnswer,
  getQuizAnswers,
  getLearningHistory,
  getActivityData,
} from '@/lib/learning';
import type {
  LearningProgress,
  LearningStatus,
  LearningStats,
  QuizAnswer,
  QuestionType,
  LearningHistory,
} from '@/types/learning';
import type { ActivityData } from '@/lib/learning';

interface UseLearningProgressReturn {
  // 状態
  progressMap: Map<string, LearningProgress>;
  stats: LearningStats | null;
  quizAnswers: QuizAnswer[];
  history: LearningHistory[];
  activityData: ActivityData[];
  loading: boolean;
  error: string | null;

  // 操作
  updateProgress: (patternId: string, status: LearningStatus) => Promise<boolean>;
  submitQuizAnswer: (
    patternId: string,
    questionType: QuestionType,
    answer: string,
    isCorrect: boolean
  ) => Promise<boolean>;
  refresh: () => Promise<void>;
  getPatternProgress: (patternId: string) => LearningProgress | undefined;
}

export function useLearningProgress(): UseLearningProgressReturn {
  const { user } = useAuth();
  
  const [progressMap, setProgressMap] = useState<Map<string, LearningProgress>>(new Map());
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [history, setHistory] = useState<LearningHistory[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // データをロード
  const loadData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [progressList, learningStats, answers, learningHistory, activity] = await Promise.all([
        getAllLearningProgress(user.id),
        getLearningStats(user.id),
        getQuizAnswers(user.id),
        getLearningHistory(user.id, 50),
        getActivityData(user.id, 365),
      ]);

      // 進捗マップを作成
      const map = new Map<string, LearningProgress>();
      for (const progress of progressList) {
        map.set(progress.pattern_id, progress);
      }

      setProgressMap(map);
      setStats(learningStats);
      setQuizAnswers(answers);
      setHistory(learningHistory);
      setActivityData(activity);
    } catch (err) {
      console.error('Failed to load learning data:', err);
      setError('学習データの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 初期ロード
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 進捗を更新
  const updateProgress = useCallback(
    async (patternId: string, status: LearningStatus): Promise<boolean> => {
      if (!user) return false;

      try {
        const result = await upsertLearningProgress(user.id, patternId, status);
        if (result) {
          // ローカル状態を更新
          setProgressMap((prev) => {
            const newMap = new Map(prev);
            newMap.set(patternId, result);
            return newMap;
          });

          // 統計も再取得
          const newStats = await getLearningStats(user.id);
          setStats(newStats);

          return true;
        }
        return false;
      } catch (err) {
        console.error('Failed to update progress:', err);
        setError('進捗の更新に失敗しました');
        return false;
      }
    },
    [user]
  );

  // クイズ回答を送信
  const submitQuizAnswer = useCallback(
    async (
      patternId: string,
      questionType: QuestionType,
      answer: string,
      isCorrect: boolean
    ): Promise<boolean> => {
      if (!user) return false;

      try {
        const result = await recordQuizAnswer(user.id, patternId, questionType, answer, isCorrect);
        if (result) {
          // ローカル状態を更新
          setQuizAnswers((prev) => [result, ...prev]);
          return true;
        }
        return false;
      } catch (err) {
        console.error('Failed to submit quiz answer:', err);
        setError('クイズ回答の送信に失敗しました');
        return false;
      }
    },
    [user]
  );

  // データを再取得
  const refresh = useCallback(async () => {
    await loadData();
  }, [loadData]);

  // 特定パターンの進捗を取得
  const getPatternProgress = useCallback(
    (patternId: string): LearningProgress | undefined => {
      return progressMap.get(patternId);
    },
    [progressMap]
  );

  return {
    progressMap,
    stats,
    quizAnswers,
    history,
    activityData,
    loading,
    error,
    updateProgress,
    submitQuizAnswer,
    refresh,
    getPatternProgress,
  };
}