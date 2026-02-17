'use client';

import type { LearningStats as LearningStatsType } from '@/types/learning';

interface LearningStatsProps {
  stats: LearningStatsType;
}

export default function LearningStats({ stats }: LearningStatsProps) {
  const {
    totalPatterns,
    completedCount,
    inProgressCount,
    notStartedCount,
    completionRate,
  } = stats;

  return (
    <div className="space-y-4">
      {/* 全体進捗 */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            全体の進捗
          </h3>
          <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {completionRate}%
          </span>
        </div>
        
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {completedCount}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              完了
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {inProgressCount}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              学習中
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">
              {notStartedCount}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              未学習
            </div>
          </div>
        </div>
      </div>

      {/* 進捗サマリー */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          学習サマリー
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">
              全パターン数
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalPatterns}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">
              完了したパターン
            </span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              {completedCount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">
              残りのパターン
            </span>
            <span className="font-semibold text-gray-500 dark:text-gray-400">
              {totalPatterns - completedCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}