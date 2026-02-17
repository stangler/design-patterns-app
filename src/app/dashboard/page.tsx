'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import LearningStats from '@/components/learning/LearningStats';
import CategoryProgress from '@/components/learning/CategoryProgress';
import ActivityCalendar from '@/components/learning/ActivityCalendar';
import QuizHistory from '@/components/learning/QuizHistory';
import { designPatterns } from '@/utils/patterns';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const {
    stats,
    activityData,
    loading: dataLoading,
    error,
  } = useLearningProgress();

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            アクセス制限
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            ダッシュボードを利用するにはサインインが必要です。
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/auth/sign-in"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              サインイン
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">データの読み込みに失敗しました</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            学習ダッシュボード
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            デザインパターンの学習進捗を確認しましょう
          </p>
        </div>

        {/* メインコンテンツ */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* 左カラム: 全体統計 */}
          <div className="lg:col-span-2 space-y-6">
            <LearningStats stats={stats} />
            
            {/* カテゴリー別進捗 */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                カテゴリー別進捗
              </h3>
              <CategoryProgress categoryStats={stats.categoryStats} />
            </div>

            {/* アクティビティカレンダー */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-6">
              <ActivityCalendar activityData={activityData} months={6} />
            </div>
          </div>

          {/* 右カラム: クイズ履歴 & クイックリンク */}
          <div className="space-y-6">
            {/* クイズ履歴 */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                クイズ成績
              </h3>
              <QuizHistory quizStats={stats.quizStats} />
            </div>

            {/* クイックリンク */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                クイックリンク
              </h3>
              <div className="space-y-2">
                <Link
                  href="/patterns"
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  パターン一覧へ
                </Link>
                {stats.notStartedCount > 0 && (
                  <Link
                    href={`/patterns/${designPatterns.find((p) => {
                      const progress = stats.recentActivity.find(
                        (a) => a.pattern_id === p.id
                      );
                      return !progress;
                    })?.id || designPatterns[0].id}`}
                    className="block w-full text-center px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                  >
                    次のパターンを学ぶ
                  </Link>
                )}
              </div>
            </div>

            {/* 最近のアクティビティ */}
            {stats.recentActivity.length > 0 && (
              <div className="bg-white dark:bg-zinc-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  最近のアクティビティ
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {stats.recentActivity.slice(0, 10).map((activity) => {
                    const pattern = designPatterns.find(
                      (p) => p.id === activity.pattern_id
                    );
                    const actionLabel = {
                      view: '閲覧',
                      start: '学習開始',
                      complete: '完了',
                    }[activity.action];
                    const actionColor = {
                      view: 'text-gray-500',
                      start: 'text-blue-500',
                      complete: 'text-green-500',
                    }[activity.action];

                    return (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <Link
                          href={`/patterns/${activity.pattern_id}`}
                          className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate"
                        >
                          {pattern?.name || activity.pattern_id}
                        </Link>
                        <span className={`${actionColor} ml-2`}>
                          {actionLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}