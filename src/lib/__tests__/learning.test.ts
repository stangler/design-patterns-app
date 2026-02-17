import { describe, it, expect, vi, beforeEach } from 'vitest';

// Supabase クライアントをモック
vi.mock('@/lib/supabase-client', () => ({
  getSupabaseClient: vi.fn(() => mockSupabaseClient),
}));

// モック用のSupabaseクライアント
const mockFrom = vi.fn();
const mockSupabaseClient = { from: mockFrom };

// チェーンメソッドのヘルパー
function createQueryChain(resolvedValue: { data: unknown; error: unknown }) {
  const chain: Record<string, unknown> = {};
  const methods = ['select', 'eq', 'order', 'limit', 'gte', 'single', 'insert', 'upsert'];
  methods.forEach((m) => {
    chain[m] = vi.fn(() => chain);
  });
  // 最終的にPromiseを返す（thenを定義してthenable化）
  Object.defineProperty(chain, 'then', {
    value: (resolve: (v: unknown) => unknown, reject?: (e: unknown) => unknown) =>
      Promise.resolve(resolvedValue).then(resolve, reject),
    configurable: true,
  });
  Object.defineProperty(chain, 'catch', {
    value: (reject: (e: unknown) => unknown) => Promise.resolve(resolvedValue).catch(reject),
    configurable: true,
  });
  return chain;
}

import {
  getAllLearningProgress,
  getLearningProgress,
  getQuizAnswers,
  getLearningHistory,
  upsertLearningProgress,
  recordQuizAnswer,
  getQuizStatsByPattern,
  recordLearningHistory,
  getLearningStats,
  getActivityData,
} from '@/lib/learning';

describe('learning.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===================================
  // getAllLearningProgress
  // ===================================
  describe('getAllLearningProgress', () => {
    it('学習進捗リストを返す', async () => {
      const mockData = [
        { id: '1', user_id: 'user-1', pattern_id: 'singleton', status: 'completed' },
        { id: '2', user_id: 'user-1', pattern_id: 'factory-method', status: 'in_progress' },
      ];

      const chain = createQueryChain({ data: mockData, error: null });
      mockFrom.mockReturnValue(chain);

      const result = await getAllLearningProgress('user-1');
      expect(result).toEqual(mockData);
    });

    it('エラー時は空配列を返す', async () => {
      const chain = createQueryChain({ data: null, error: { message: 'DB error' } });
      mockFrom.mockReturnValue(chain);

      const result = await getAllLearningProgress('user-1');
      expect(result).toEqual([]);
    });

    it('dataがnullの場合は空配列を返す', async () => {
      const chain = createQueryChain({ data: null, error: null });
      mockFrom.mockReturnValue(chain);

      const result = await getAllLearningProgress('user-1');
      expect(result).toEqual([]);
    });
  });

  // ===================================
  // getLearningProgress
  // ===================================
  describe('getLearningProgress', () => {
    it('特定パターンの進捗を返す', async () => {
      const mockData = { id: '1', user_id: 'user-1', pattern_id: 'singleton', status: 'completed' };
      const chain = createQueryChain({ data: mockData, error: null });
      mockFrom.mockReturnValue(chain);

      const result = await getLearningProgress('user-1', 'singleton');
      expect(result).toEqual(mockData);
    });

    it('データが存在しない場合（PGRST116）はnullを返す', async () => {
      const chain = createQueryChain({ data: null, error: { code: 'PGRST116', message: 'not found' } });
      mockFrom.mockReturnValue(chain);

      const result = await getLearningProgress('user-1', 'singleton');
      expect(result).toBeNull();
    });

    it('その他のエラー時はnullを返す', async () => {
      const chain = createQueryChain({ data: null, error: { code: 'OTHER', message: 'DB error' } });
      mockFrom.mockReturnValue(chain);

      const result = await getLearningProgress('user-1', 'singleton');
      expect(result).toBeNull();
    });
  });

  // ===================================
  // getQuizAnswers
  // ===================================
  describe('getQuizAnswers', () => {
    it('クイズ回答リストを返す', async () => {
      const mockData = [
        { id: '1', user_id: 'user-1', pattern_id: 'singleton', is_correct: true },
        { id: '2', user_id: 'user-1', pattern_id: 'singleton', is_correct: false },
      ];
      const chain = createQueryChain({ data: mockData, error: null });
      mockFrom.mockReturnValue(chain);

      const result = await getQuizAnswers('user-1');
      expect(result).toEqual(mockData);
    });

    it('エラー時は空配列を返す', async () => {
      const chain = createQueryChain({ data: null, error: { message: 'DB error' } });
      mockFrom.mockReturnValue(chain);

      const result = await getQuizAnswers('user-1');
      expect(result).toEqual([]);
    });
  });

  // ===================================
  // getLearningHistory
  // ===================================
  describe('getLearningHistory', () => {
    it('学習履歴リストを返す', async () => {
      const mockData = [
        { id: '1', user_id: 'user-1', pattern_id: 'singleton', action: 'view' },
      ];
      const chain = createQueryChain({ data: mockData, error: null });
      mockFrom.mockReturnValue(chain);

      const result = await getLearningHistory('user-1');
      expect(result).toEqual(mockData);
    });

    it('エラー時は空配列を返す', async () => {
      const chain = createQueryChain({ data: null, error: { message: 'DB error' } });
      mockFrom.mockReturnValue(chain);

      const result = await getLearningHistory('user-1');
      expect(result).toEqual([]);
    });

    it('limitパラメータを指定できる', async () => {
      const chain = createQueryChain({ data: [], error: null });
      mockFrom.mockReturnValue(chain);

      const result = await getLearningHistory('user-1', 10);
      expect(result).toEqual([]);
    });
  });

  // ===================================
  // upsertLearningProgress
  // ===================================
  describe('upsertLearningProgress', () => {
    it('in_progressステータスで進捗を作成・更新できる', async () => {
      const mockData = { id: '1', user_id: 'user-1', pattern_id: 'singleton', status: 'in_progress' };
      // upsert用チェーン（select().single()まで含む）
      const chain = createQueryChain({ data: mockData, error: null });
      // recordLearningHistory用（2回目のfrom呼び出し）
      const historyChain = createQueryChain({ data: { id: 'h1' }, error: null });
      mockFrom
        .mockReturnValueOnce(chain)
        .mockReturnValueOnce(historyChain);

      const result = await upsertLearningProgress('user-1', 'singleton', 'in_progress');
      expect(result).toEqual(mockData);
    });

    it('completedステータスで進捗を更新できる', async () => {
      const mockData = { id: '1', user_id: 'user-1', pattern_id: 'singleton', status: 'completed' };
      const chain = createQueryChain({ data: mockData, error: null });
      const historyChain = createQueryChain({ data: { id: 'h1' }, error: null });
      mockFrom
        .mockReturnValueOnce(chain)
        .mockReturnValueOnce(historyChain);

      const result = await upsertLearningProgress('user-1', 'singleton', 'completed');
      expect(result).toEqual(mockData);
    });

    it('not_startedステータスで進捗を更新できる', async () => {
      const mockData = { id: '1', user_id: 'user-1', pattern_id: 'singleton', status: 'not_started' };
      const chain = createQueryChain({ data: mockData, error: null });
      const historyChain = createQueryChain({ data: { id: 'h1' }, error: null });
      mockFrom
        .mockReturnValueOnce(chain)
        .mockReturnValueOnce(historyChain);

      const result = await upsertLearningProgress('user-1', 'singleton', 'not_started');
      expect(result).toEqual(mockData);
    });

    it('エラー時はnullを返す', async () => {
      const chain = createQueryChain({ data: null, error: { message: 'DB error' } });
      mockFrom.mockReturnValue(chain);

      const result = await upsertLearningProgress('user-1', 'singleton', 'in_progress');
      expect(result).toBeNull();
    });
  });

  // ===================================
  // recordQuizAnswer
  // ===================================
  describe('recordQuizAnswer', () => {
    it('クイズ回答を記録して返す', async () => {
      const mockData = {
        id: '1',
        user_id: 'user-1',
        pattern_id: 'singleton',
        question_type: 'multiple_choice',
        answer: 'A',
        is_correct: true,
      };
      const chain = createQueryChain({ data: mockData, error: null });
      mockFrom.mockReturnValue(chain);

      const result = await recordQuizAnswer('user-1', 'singleton', 'implementation', 'A', true);
      expect(result).toEqual(mockData);
    });

    it('不正解の回答も記録できる', async () => {
      const mockData = {
        id: '2',
        user_id: 'user-1',
        pattern_id: 'singleton',
        question_type: 'implementation',
        answer: 'B',
        is_correct: false,
      };
      const chain = createQueryChain({ data: mockData, error: null });
      mockFrom.mockReturnValue(chain);

      const result = await recordQuizAnswer('user-1', 'singleton', 'implementation', 'B', false);
      expect(result).toEqual(mockData);
    });

    it('エラー時はnullを返す', async () => {
      const chain = createQueryChain({ data: null, error: { message: 'DB error' } });
      mockFrom.mockReturnValue(chain);

      const result = await recordQuizAnswer('user-1', 'singleton', 'implementation', 'A', true);
      expect(result).toBeNull();
    });
  });

  // ===================================
  // getQuizStatsByPattern
  // ===================================
  describe('getQuizStatsByPattern', () => {
    it('正解・不正解を含む統計を返す', async () => {
      const mockData = [
        { is_correct: true },
        { is_correct: true },
        { is_correct: false },
      ];
      const chain = createQueryChain({ data: mockData, error: null });
      mockFrom.mockReturnValue(chain);

      const result = await getQuizStatsByPattern('user-1', 'singleton');
      expect(result).toEqual({ total: 3, correct: 2 });
    });

    it('データが空の場合は total:0, correct:0 を返す', async () => {
      const chain = createQueryChain({ data: [], error: null });
      mockFrom.mockReturnValue(chain);

      const result = await getQuizStatsByPattern('user-1', 'singleton');
      expect(result).toEqual({ total: 0, correct: 0 });
    });

    it('dataがnullの場合は total:0, correct:0 を返す', async () => {
      const chain = createQueryChain({ data: null, error: null });
      mockFrom.mockReturnValue(chain);

      const result = await getQuizStatsByPattern('user-1', 'singleton');
      expect(result).toEqual({ total: 0, correct: 0 });
    });

    it('エラー時はnullを返す', async () => {
      const chain = createQueryChain({ data: null, error: { message: 'DB error' } });
      mockFrom.mockReturnValue(chain);

      const result = await getQuizStatsByPattern('user-1', 'singleton');
      expect(result).toBeNull();
    });
  });

  // ===================================
  // recordLearningHistory
  // ===================================
  describe('recordLearningHistory', () => {
    it('学習履歴を記録して返す', async () => {
      const mockData = { id: '1', user_id: 'user-1', pattern_id: 'singleton', action: 'view' };
      const chain = createQueryChain({ data: mockData, error: null });
      mockFrom.mockReturnValue(chain);

      const result = await recordLearningHistory('user-1', 'singleton', 'view');
      expect(result).toEqual(mockData);
    });

    it('startアクションを記録できる', async () => {
      const mockData = { id: '2', user_id: 'user-1', pattern_id: 'singleton', action: 'start' };
      const chain = createQueryChain({ data: mockData, error: null });
      mockFrom.mockReturnValue(chain);

      const result = await recordLearningHistory('user-1', 'singleton', 'start');
      expect(result).toEqual(mockData);
    });

    it('エラー時はnullを返す', async () => {
      const chain = createQueryChain({ data: null, error: { message: 'DB error' } });
      mockFrom.mockReturnValue(chain);

      const result = await recordLearningHistory('user-1', 'singleton', 'view');
      expect(result).toBeNull();
    });
  });

  // ===================================
  // getLearningStats
  // ===================================
  describe('getLearningStats', () => {
    it('全パターン数・完了数・進行中数・未着手数・完了率を返す', async () => {
      // getAllLearningProgress, getQuizAnswers, getLearningHistory の3回のfrom呼び出し
      const progressData = [
        { id: '1', user_id: 'user-1', pattern_id: 'singleton', status: 'completed' },
        { id: '2', user_id: 'user-1', pattern_id: 'factory-method', status: 'in_progress' },
      ];
      const quizData = [
        { id: '1', user_id: 'user-1', pattern_id: 'singleton', is_correct: true },
        { id: '2', user_id: 'user-1', pattern_id: 'singleton', is_correct: false },
      ];
      const historyData = [
        { id: '1', user_id: 'user-1', pattern_id: 'singleton', action: 'view', created_at: '2024-01-01T00:00:00Z' },
      ];

      mockFrom
        .mockReturnValueOnce(createQueryChain({ data: progressData, error: null }))
        .mockReturnValueOnce(createQueryChain({ data: quizData, error: null }))
        .mockReturnValueOnce(createQueryChain({ data: historyData, error: null }));

      const result = await getLearningStats('user-1');

      expect(result.totalPatterns).toBeGreaterThan(0);
      expect(result.completedCount).toBe(1);
      expect(result.inProgressCount).toBe(1);
      expect(result.notStartedCount).toBe(result.totalPatterns - 2);
      expect(result.completionRate).toBe(Math.round((1 / result.totalPatterns) * 100));
    });

    it('進捗が空の場合は完了率0を返す', async () => {
      mockFrom
        .mockReturnValueOnce(createQueryChain({ data: [], error: null }))
        .mockReturnValueOnce(createQueryChain({ data: [], error: null }))
        .mockReturnValueOnce(createQueryChain({ data: [], error: null }));

      const result = await getLearningStats('user-1');

      expect(result.completedCount).toBe(0);
      expect(result.completionRate).toBe(0);
      expect(result.quizStats.totalAnswers).toBe(0);
      expect(result.quizStats.correctRate).toBe(0);
    });

    it('クイズ統計のbyPatternが正しく集計される', async () => {
      const quizData = [
        { id: '1', user_id: 'user-1', pattern_id: 'singleton', is_correct: true },
        { id: '2', user_id: 'user-1', pattern_id: 'singleton', is_correct: true },
        { id: '3', user_id: 'user-1', pattern_id: 'adapter', is_correct: false },
      ];

      mockFrom
        .mockReturnValueOnce(createQueryChain({ data: [], error: null }))
        .mockReturnValueOnce(createQueryChain({ data: quizData, error: null }))
        .mockReturnValueOnce(createQueryChain({ data: [], error: null }));

      const result = await getLearningStats('user-1');

      expect(result.quizStats.totalAnswers).toBe(3);
      expect(result.quizStats.correctAnswers).toBe(2);
      const singletonStats = result.quizStats.byPattern.find((p) => p.pattern_id === 'singleton');
      expect(singletonStats).toEqual({ pattern_id: 'singleton', total: 2, correct: 2, correctRate: 100 });
    });

    it('カテゴリー別統計が正しく集計される', async () => {
      const progressData = [
        { id: '1', user_id: 'user-1', pattern_id: 'singleton', status: 'completed' },
        { id: '2', user_id: 'user-1', pattern_id: 'adapter', status: 'in_progress' },
      ];

      mockFrom
        .mockReturnValueOnce(createQueryChain({ data: progressData, error: null }))
        .mockReturnValueOnce(createQueryChain({ data: [], error: null }))
        .mockReturnValueOnce(createQueryChain({ data: [], error: null }));

      const result = await getLearningStats('user-1');

      expect(result.categoryStats.creational.completed).toBe(1);
      expect(result.categoryStats.structural.inProgress).toBe(1);
    });
  });

  // ===================================
  // getActivityData
  // ===================================
  describe('getActivityData', () => {
    it('日付ごとのアクティビティ件数を返す', async () => {
      const mockData = [
        { created_at: '2024-01-15T10:00:00Z' },
        { created_at: '2024-01-15T12:00:00Z' },
        { created_at: '2024-01-16T09:00:00Z' },
      ];
      const chain = createQueryChain({ data: mockData, error: null });
      mockFrom.mockReturnValue(chain);

      const result = await getActivityData('user-1');

      expect(result).toHaveLength(2);
      const jan15 = result.find((r) => r.date === '2024-01-15');
      const jan16 = result.find((r) => r.date === '2024-01-16');
      expect(jan15?.count).toBe(2);
      expect(jan16?.count).toBe(1);
    });

    it('データが空の場合は空配列を返す', async () => {
      const chain = createQueryChain({ data: [], error: null });
      mockFrom.mockReturnValue(chain);

      const result = await getActivityData('user-1');
      expect(result).toEqual([]);
    });

    it('エラー時は空配列を返す', async () => {
      const chain = createQueryChain({ data: null, error: { message: 'DB error' } });
      mockFrom.mockReturnValue(chain);

      const result = await getActivityData('user-1');
      expect(result).toEqual([]);
    });

    it('daysパラメータを指定できる', async () => {
      const chain = createQueryChain({ data: [], error: null });
      mockFrom.mockReturnValue(chain);

      const result = await getActivityData('user-1', 30);
      expect(result).toEqual([]);
    });
  });
});
