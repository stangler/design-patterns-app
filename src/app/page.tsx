'use client';

import { designPatterns } from '@/utils/patterns';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function Home() {
  const { user, loading } = useAuth();

  // 🔥 ランダム6件取得
  const randomPatterns = shuffleArray(designPatterns).slice(0, 6);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-between py-16 px-4 bg-white dark:bg-black sm:items-start sm:text-left sm:px-8">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50">
            デザインパターン学習サイト
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            様々なデザインパターンを学習し、理解を深めるためのインタラクティブな学習サイトです。
          </p>
        </div>

        <div className="flex flex-col gap-8 w-full">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
              今日のおすすめデザインパターン
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {randomPatterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className="bg-zinc-100 dark:bg-zinc-800 p-6 rounded-lg hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-2">
                    {pattern.name}
                  </h3>

                  {pattern.description && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {pattern.description}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded">
                      {pattern.category}
                    </span>

                    {pattern.difficulty && (
                      <span className="text-xs text-zinc-500">
                        {pattern.difficulty}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/patterns/${pattern.id}`}
                    className="mt-4 inline-block text-sm text-blue-600 hover:underline"
                  >
                    詳しく見る →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-4">
            {user ? (
              <Link
                href="/patterns"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                すべてのパターンを見る
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/sign-in"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  サインイン
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-blue-600 bg-white hover:bg-blue-50 border-blue-600"
                >
                  アカウントを作成
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
