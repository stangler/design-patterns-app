// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

// AuthProvider をモック
vi.mock('@/components/auth/AuthProvider', () => ({
  useAuth: vi.fn(),
}));

// learning ライブラリをモック
vi.mock('@/lib/learning', () => ({
  getAllLearningProgress: vi.fn(),
  getLearningStats: vi.fn(),
  getQuizAnswers: vi.fn(),
  getLearningHistory: vi.fn(),
  getActivityData: vi.fn(),
  upsertLearningProgress: vi.fn(),
  recordQuizAnswer: vi.fn(),
}));

import { useAuth } from '@/components/auth/AuthProvider';
import {
  getAllLearningProgress,
  getLearningStats,
  getQuizAnswers,
  getLearningHistory,
  getActivityData,
  upsertLearningProgress,
  recordQuizAnswer,
} from '@/lib/learning';
import { useLearningProgress } from '@/hooks/useLearningProgress';

const mockUseAuth = vi.mocked(useAuth);
const mockGetAllLearningProgress = vi.mocked(getAllLearningProgress);
const mockGetLearningStats = vi.mocked(getLearningStats);
const mockGetQuizAnswers = vi.mocked(getQuizAnswers);
const mockGetLearningHistory = vi.mocked(getLearningHistory);
const mockGetActivityData = vi.mocked(getActivityData);
const mockUpsertLearningProgress = vi.mocked(upsertLearningProgress);
const mockRecordQuizAnswer = vi.mocked(recordQuizAnswer);

const mockUser = { id: 'user-1', email: 'test@example.com', created_at: '2024-01-01T00:00:00Z' };

const emptyStats = {
  totalPatterns: 22,
  completedCount: 0,
  inProgressCount: 0,
  notStartedCount: 22,
  completionRate: 0,
  categoryStats: {
    creational: { total: 5, completed: 0, inProgress: 0, notStarted: 5 },
    structural: { total: 7, completed: 0, inProgress: 0, notStarted: 7 },
    behavioral: { total: 10, completed: 0, inProgress: 0, notStarted: 10 },
  },
  recentActivity: [],
  quizStats: { totalAnswers: 0, correctAnswers: 0, correctRate: 0, byPattern: [] },
};

describe('useLearningProgress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // デフォルトのモック設定
    mockUseAuth.mockReturnValue({ user: mockUser } as ReturnType<typeof useAuth>);
    mockGetAllLearningProgress.mockResolvedValue([]);
    mockGetLearningStats.mockResolvedValue(emptyStats);
    mockGetQuizAnswers.mockResolvedValue([]);
    mockGetLearningHistory.mockResolvedValue([]);
    mockGetActivityData.mockResolvedValue([]);
  });

  // ===================================
  // 初期ロード
  // ===================================
  describe('初期ロード', () => {
    it('ユーザーがいる場合はデータをロードする', async () => {
      const progressData = [
        { id: '1', user_id: 'user-1', pattern_id: 'singleton', status: 'completed' as const, started_at: null, completed_at: null, created_at: '', updated_at: '' },
      ];
      mockGetAllLearningProgress.mockResolvedValue(progressData);

      const { result } = renderHook(() => useLearningProgress());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.progressMap.get('singleton')).toEqual(progressData[0]);
      expect(mockGetAllLearningProgress).toHaveBeenCalledWith('user-1');
    });

    it('ユーザーがいない場合はロードせず loading:false になる', async () => {
      mockUseAuth.mockReturnValue({ user: null } as ReturnType<typeof useAuth>);

      const { result } = renderHook(() => useLearningProgress());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(mockGetAllLearningProgress).not.toHaveBeenCalled();
      expect(result.current.progressMap.size).toBe(0);
    });

    it('ロード失敗時は error をセットする', async () => {
      mockGetAllLearningProgress.mockRejectedValue(new Error('DB error'));

      const { result } = renderHook(() => useLearningProgress());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.error).toBe('学習データの読み込みに失敗しました');
    });
  });

  // ===================================
  // getPatternProgress
  // ===================================
  describe('getPatternProgress', () => {
    it('存在するパターンIDで進捗を返す', async () => {
      const progressData = [
        { id: '1', user_id: 'user-1', pattern_id: 'singleton', status: 'completed' as const, started_at: null, completed_at: null, created_at: '', updated_at: '' },
      ];
      mockGetAllLearningProgress.mockResolvedValue(progressData);

      const { result } = renderHook(() => useLearningProgress());

      await waitFor(() => expect(result.current.loading).toBe(false));

      const progress = result.current.getPatternProgress('singleton');
      expect(progress).toEqual(progressData[0]);
    });

    it('存在しないパターンIDでundefinedを返す', async () => {
      const { result } = renderHook(() => useLearningProgress());

      await waitFor(() => expect(result.current.loading).toBe(false));

      const progress = result.current.getPatternProgress('non-existent');
      expect(progress).toBeUndefined();
    });
  });

  // ===================================
  // updateProgress
  // ===================================
  describe('updateProgress', () => {
    it('進捗を更新してtrueを返す', async () => {
      const updatedProgress = {
        id: '1', user_id: 'user-1', pattern_id: 'singleton', status: 'completed' as const,
        started_at: null, completed_at: null, created_at: '', updated_at: '',
      };
      mockUpsertLearningProgress.mockResolvedValue(updatedProgress);
      mockGetLearningStats.mockResolvedValue(emptyStats);

      const { result } = renderHook(() => useLearningProgress());

      await waitFor(() => expect(result.current.loading).toBe(false));

      let success: boolean;
      await act(async () => {
        success = await result.current.updateProgress('singleton', 'completed');
      });

      expect(success!).toBe(true);
      expect(result.current.progressMap.get('singleton')).toEqual(updatedProgress);
    });

    it('ユーザーがいない場合はfalseを返す', async () => {
      mockUseAuth.mockReturnValue({ user: null } as ReturnType<typeof useAuth>);

      const { result } = renderHook(() => useLearningProgress());

      await waitFor(() => expect(result.current.loading).toBe(false));

      let success: boolean;
      await act(async () => {
        success = await result.current.updateProgress('singleton', 'completed');
      });

      expect(success!).toBe(false);
    });

    it('upsert が null を返した場合はfalseを返す', async () => {
      mockUpsertLearningProgress.mockResolvedValue(null);

      const { result } = renderHook(() => useLearningProgress());

      await waitFor(() => expect(result.current.loading).toBe(false));

      let success: boolean;
      await act(async () => {
        success = await result.current.updateProgress('singleton', 'in_progress');
      });

      expect(success!).toBe(false);
    });

    it('例外がスローされた場合はerrorをセットしてfalseを返す', async () => {
      mockUpsertLearningProgress.mockRejectedValue(new Error('DB error'));

      const { result } = renderHook(() => useLearningProgress());

      await waitFor(() => expect(result.current.loading).toBe(false));

      let success: boolean;
      await act(async () => {
        success = await result.current.updateProgress('singleton', 'in_progress');
      });

      expect(success!).toBe(false);
      expect(result.current.error).toBe('進捗の更新に失敗しました');
    });
  });

  // ===================================
  // submitQuizAnswer
  // ===================================
  describe('submitQuizAnswer', () => {
    it('クイズ回答を送信してtrueを返す', async () => {
      const mockAnswer = {
        id: '1', user_id: 'user-1', pattern_id: 'singleton',
        question_type: 'implementation' as const, answer: 'A', is_correct: true, created_at: '',
      };
      mockRecordQuizAnswer.mockResolvedValue(mockAnswer);

      const { result } = renderHook(() => useLearningProgress());

      await waitFor(() => expect(result.current.loading).toBe(false));

      let success: boolean;
      await act(async () => {
        success = await result.current.submitQuizAnswer('singleton', 'implementation', 'A', true);
      });

      expect(success!).toBe(true);
      expect(result.current.quizAnswers[0]).toEqual(mockAnswer);
    });

    it('ユーザーがいない場合はfalseを返す', async () => {
      mockUseAuth.mockReturnValue({ user: null } as ReturnType<typeof useAuth>);

      const { result } = renderHook(() => useLearningProgress());

      await waitFor(() => expect(result.current.loading).toBe(false));

      let success: boolean;
      await act(async () => {
        success = await result.current.submitQuizAnswer('singleton', 'implementation', 'A', true);
      });

      expect(success!).toBe(false);
    });

    it('recordQuizAnswer が null を返した場合はfalseを返す', async () => {
      mockRecordQuizAnswer.mockResolvedValue(null);

      const { result } = renderHook(() => useLearningProgress());

      await waitFor(() => expect(result.current.loading).toBe(false));

      let success: boolean;
      await act(async () => {
        success = await result.current.submitQuizAnswer('singleton', 'implementation', 'A', true);
      });

      expect(success!).toBe(false);
    });

    it('例外がスローされた場合はerrorをセットしてfalseを返す', async () => {
      mockRecordQuizAnswer.mockRejectedValue(new Error('DB error'));

      const { result } = renderHook(() => useLearningProgress());

      await waitFor(() => expect(result.current.loading).toBe(false));

      let success: boolean;
      await act(async () => {
        success = await result.current.submitQuizAnswer('singleton', 'implementation', 'A', true);
      });

      expect(success!).toBe(false);
      expect(result.current.error).toBe('クイズ回答の送信に失敗しました');
    });
  });

  // ===================================
  // refresh
  // ===================================
  describe('refresh', () => {
    it('refresh を呼ぶとデータを再取得する', async () => {
      const { result } = renderHook(() => useLearningProgress());

      await waitFor(() => expect(result.current.loading).toBe(false));

      // 初回ロードでの呼び出し回数をリセット
      vi.clearAllMocks();
      mockUseAuth.mockReturnValue({ user: mockUser } as ReturnType<typeof useAuth>);
      mockGetAllLearningProgress.mockResolvedValue([]);
      mockGetLearningStats.mockResolvedValue(emptyStats);
      mockGetQuizAnswers.mockResolvedValue([]);
      mockGetLearningHistory.mockResolvedValue([]);
      mockGetActivityData.mockResolvedValue([]);

      await act(async () => {
        await result.current.refresh();
      });

      expect(mockGetAllLearningProgress).toHaveBeenCalledWith('user-1');
    });
  });
});
