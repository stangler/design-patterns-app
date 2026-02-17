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
import { getCurrentUserServer } from '@/lib/auth-server';

interface Props {
  params: Promise<{
    id: string;
  }>;
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

  const explanation = await getMarkdownFile(
    pattern.category,
    pattern.id,
    'explanation.md'
  );

  const question = await getMarkdownFile(
    pattern.category,
    pattern.id,
    'question.md'
  );

  const solutionCode = getSolutionCode(
    pattern.category,
    pattern.id
  );

  const highlighted =
    solutionCode &&
    (await highlightCode(solutionCode));

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      <h1 className="text-3xl font-bold">
        {pattern.name}
      </h1>

      {/* 解説 */}
      {explanation && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">
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
        <section>
          <h2 className="text-2xl font-semibold mb-4">
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
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            模範解答
          </h2>
          <SolutionToggle html={highlighted} />
        </section>
      )}
    </div>
  );
}
