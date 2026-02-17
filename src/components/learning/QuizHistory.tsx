'use client';

import type { QuizStats } from '@/types/learning';
import { designPatterns } from '@/utils/patterns';

interface QuizHistoryProps {
  quizStats: QuizStats;
}

export default function QuizHistory({ quizStats }: QuizHistoryProps) {
  const { totalAnswers, correctAnswers, correctRate, byPattern } = quizStats;

  // 正解率でソート
  const sortedByPattern = [...byPattern].sort((a, b) => b.correctRate - a.correctRate);

  // パターン名を取得
  const getPatternName = (patternId: string): string => {
    const pattern = designPatterns.find((p) => p.id === patternId);
    return pattern?.name || patternId;
  };

  return (
    <div className="space-y-4">
      {/* 全体統計 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalAnswers}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            回答数
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {correctAnswers}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            正解数
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {correctRate}%
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            正解率
          </div>
        </div>
      </div>

      {/* パターン別統計 */}
      {sortedByPattern.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            パターン別正解率
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {sortedByPattern.map((stat) => (
              <div
                key={stat.pattern_id}
                className="flex items-center gap-3 bg-white dark:bg-zinc-800 rounded-lg p-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {getPatternName(stat.pattern_id)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.correct} / {stat.total} 正解
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        stat.correctRate >= 80
                          ? 'bg-green-500'
                          : stat.correctRate >= 50
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${stat.correctRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12 text-right">
                    {stat.correctRate}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalAnswers === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          まだクイズの回答がありません
        </div>
      )}
    </div>
  );
}