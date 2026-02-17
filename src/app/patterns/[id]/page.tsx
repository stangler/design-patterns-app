import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';
import { designPatterns } from '@/utils/patterns';
import {
  getMarkdownFile,
  getSolutionCode,
} from '@/lib/markdown';
import { highlightCode } from '@/lib/highlight';
import SolutionToggle from '@/components/SolutionToggle';
import ExerciseSection from '@/components/ExerciseSection';
import PatternProgressSection from '@/components/learning/PatternProgressSection';
import { getCurrentUserServer } from '@/lib/auth-server';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

// 静的生成のためのパラメータを生成
export async function generateStaticParams() {
  return designPatterns.map((pattern) => ({
    id: pattern.id,
  }));
}

export default async function PatternDetailPage({ params }: Props) {
  // サーバーサイドで認証チェック
  const { user } = await getCurrentUserServer();
  
  if (!user) {
    redirect('/auth/sign-in');
  }
  const { id } = await params;

  const pattern = designPatterns.find(
    (p) => p.id === id
  );

  if (!pattern) return notFound();

  // 並列でデータを取得
  const solutionCode = getSolutionCode(
    pattern.category,
    pattern.id
  );

  const [explanation, question, highlighted] = await Promise.all([
    getMarkdownFile(pattern.category, pattern.id, 'explanation.md'),
    getMarkdownFile(pattern.category, pattern.id, 'question.md'),
    solutionCode ? highlightCode(solutionCode) : Promise.resolve(null),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">
      <h1 className="text-3xl font-bold pb-4 border-b border-gray-200 dark:border-gray-700">
        {pattern.name}
      </h1>

      {/* 学習進捗 */}
      <PatternProgressSection
        patternId={pattern.id}
        patternName={pattern.name}
      />

      {/* 解説 */}
      {explanation && (
        <section className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
            解説
          </h2>
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: explanation.contentHtml,
            }}
          />
        </section>
      )}

      {/* 問題 */}
      {question && (
        <section className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
            問題
          </h2>
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: question.contentHtml,
            }}
          />
        </section>
      )}

      {/* 実装課題 & 発展課題 */}
      {question && (
        <ExerciseSection
          patternName={pattern.name}
          questionText={question.contentHtml}
        />
      )}

      {/* 模範解答 */}
      {highlighted && (
        <section className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
            模範解答
          </h2>
          <SolutionToggle html={highlighted} />
        </section>
      )}
    </div>
  );
}
