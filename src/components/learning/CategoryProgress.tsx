'use client';

import type { CategoryStats } from '@/types/learning';

interface CategoryProgressProps {
  categoryStats: CategoryStats;
}

const categoryLabels = {
  creational: '生成パターン',
  structural: '構造パターン',
  behavioral: '振る舞いパターン',
};

const categoryColors = {
  creational: {
    bg: 'bg-purple-500',
    light: 'bg-purple-100 dark:bg-purple-900',
    text: 'text-purple-700 dark:text-purple-300',
  },
  structural: {
    bg: 'bg-orange-500',
    light: 'bg-orange-100 dark:bg-orange-900',
    text: 'text-orange-700 dark:text-orange-300',
  },
  behavioral: {
    bg: 'bg-teal-500',
    light: 'bg-teal-100 dark:bg-teal-900',
    text: 'text-teal-700 dark:text-teal-300',
  },
};

export default function CategoryProgress({ categoryStats }: CategoryProgressProps) {
  const categories = Object.keys(categoryStats) as (keyof CategoryStats)[];

  return (
    <div className="space-y-4">
      {categories.map((category) => {
        const stats = categoryStats[category];
        const colors = categoryColors[category];
        const completedRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
        const inProgressRate = stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0;

        return (
          <div key={category} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`font-medium ${colors.text}`}>
                {categoryLabels[category]}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {stats.completed} / {stats.total} 完了
              </span>
            </div>
            
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
              {/* 完了 */}
              <div
                className={`${colors.bg} transition-all duration-300`}
                style={{ width: `${completedRate}%` }}
                title={`完了: ${stats.completed}`}
              />
              {/* 学習中 */}
              <div
                className="bg-blue-400 transition-all duration-300"
                style={{ width: `${inProgressRate}%` }}
                title={`学習中: ${stats.inProgress}`}
              />
            </div>
            
            <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${colors.bg}`} />
                完了 {stats.completed}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                学習中 {stats.inProgress}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />
                未学習 {stats.notStarted}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}