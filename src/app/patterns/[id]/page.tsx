'use client';

import { getPatternWithDetails } from '@/utils/patterns';
import { DesignPattern, PatternCategory } from '@/types/designPatterns';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';

export default function PatternDetailPage() {
const router = useRouter();
const { user, loading: authLoading } = useAuth();
const { id } = useParams() as { id: string };
  const [pattern, setPattern] = useState<DesignPattern | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('パターンIDが指定されていません');
      setLoading(false);
      return;
    }

    const fetchPattern = async () => {
      try {
        const patternData = await getPatternWithDetails(id);
        console.log('Pattern data:', patternData); // Add debugging
        if (patternData) {
          console.log('Sample code:', patternData.sampleCode); // Add debugging for sample code
          setPattern(patternData);
        } else {
          setError('指定されたパターンが見つかりません');
        }
      } catch (err) {
        console.error('Error fetching pattern:', err);
        setError('パターンの取得中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchPattern();
  }, [id]);

  if (authLoading || loading) {
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            エラー
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            {error}
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  if (!pattern) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            パターンが見つかりません
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            指定されたデザインパターンは存在しません。
          </p>
          <button
            onClick={() => router.push('/patterns')}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            パターン一覧へ戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* パターン基本情報 */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {pattern.name}
            </h1>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                pattern.category === PatternCategory.Creational ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
                pattern.category === PatternCategory.Structural ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                pattern.category === PatternCategory.Behavioral ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100' :
                pattern.category === PatternCategory.Architectural ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100' :
                'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
              }`}>
                {pattern.category}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {pattern.difficulty}
                </span>
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(pattern.popularity / 10) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {pattern.description}
          </p>
        </div>

        {/* 詳細情報セクション */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* 左カラム:基本情報 */}
          <div className="lg:col-span-2 space-y-8">
            {/* Intent */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Intent(意図)
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {pattern.intent}
              </p>
            </section>

            {/* Motivation */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Motivation(動機)
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {pattern.motivation}
              </p>
            </section>

            {/* Structure */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Structure(構造)
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {pattern.structure}
              </p>
            </section>

            {/* Participants */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Participants(参加者)
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {pattern.participants}
              </p>
            </section>

            {/* Collaboration */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Collaboration(協調)
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {pattern.collaboration}
              </p>
            </section>

            {/* Consequences */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Consequences(結果)
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {pattern.consequences}
              </p>
            </section>

            {/* Implementation */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Implementation(実装)
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {pattern.implementation}
              </p>
            </section>

            {/* Sample Code - 修正版 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Sample Code(サンプルコード)
              </h2>
              <div className="bg-gray-900 dark:bg-gray-950 rounded-lg overflow-hidden border border-gray-700">
                <pre className="p-4 overflow-x-auto">
                  <code className="text-sm text-gray-100 dark:text-gray-200 font-mono whitespace-pre block">
                    {pattern.sampleCode}
                  </code>
                </pre>
              </div>
            </section>
          </div>

          {/* 右カラム:補足情報 */}
          <div className="space-y-6">
            {/* Real World Example */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Real World Example(実世界の例)
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {pattern.realWorldExample}
              </p>
            </section>

            {/* Related Patterns */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Related Patterns(関連パターン)
              </h3>
              <div className="flex flex-wrap gap-2">
                {pattern.relatedPatterns.map((related, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 dark:text-blue-100 text-blue-800 rounded text-sm"
                  >
                    {related}
                  </span>
                ))}
              </div>
            </section>

            {/* Tags */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Tags(タグ)
              </h3>
              <div className="flex flex-wrap gap-2">
                {pattern.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-100 dark:bg-purple-900 dark:text-purple-100 text-purple-800 rounded text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Prerequisites */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Prerequisites(前提条件)
              </h3>
              <div className="flex flex-wrap gap-2">
                {pattern.prerequisites?.map((prereq, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 dark:bg-green-900 dark:text-green-100 text-green-800 rounded text-sm"
                  >
                    {prereq}
                  </span>
                ))}
              </div>
            </section>

            {/* Alternatives */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Alternatives(代替案)
              </h3>
              <div className="flex flex-wrap gap-2">
                {pattern.alternatives?.map((alt, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-red-100 dark:bg-red-900 dark:text-red-100 text-red-800 rounded text-sm"
                  >
                    {alt}
                  </span>
                ))}
              </div>
            </section>

            {/* Metadata */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Metadata(メタデータ)
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">作成日</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {new Date(pattern.createdAt).toLocaleDateString('ja-JP')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">更新日</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {new Date(pattern.updatedAt).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            戻る
          </button>
          <button
            onClick={() => router.push('/patterns')}
            className="px-6 py-3 bg-blue-600 dark:bg-blue-900 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
          >
            パターン一覧へ
          </button>
        </div>
      </div>
    </div>
  );
}