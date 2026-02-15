'use client';

import { designPatterns } from '@/utils/patterns';
import { useAuth } from '@/components/auth/AuthProvider';

export default function PatternsPage() {
  const patterns = designPatterns;
  const { user, loading } = useAuth();

  if (loading) {
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
            デザインパターンを閲覧するにはサインインが必要です。
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/auth/sign-in"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              サインイン
            </a>
            <a
              href="/auth/sign-up"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-blue-600 bg-white hover:bg-blue-50 border-blue-600"
            >
              アカウントを作成
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            デザインパターン一覧
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            すべてのデザインパターンを探索しましょう
          </p>
        </div>
        
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {patterns.map((pattern) => (
            <div
              key={pattern.id}
              className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {pattern.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {pattern.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded">
                  {pattern.category}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {pattern.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
