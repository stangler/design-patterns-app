'use client';

import { useState } from 'react';

interface Props {
  questionHtml: string;
  solutionHtml?: string;
}

export default function AnswerInputSection({
  questionHtml,
  solutionHtml,
}: Props) {
  const [answer, setAnswer] = useState('');
  const [showSolution, setShowSolution] = useState(false);

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">
        問題
      </h2>

      {/* 問題表示 */}
      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: questionHtml }}
      />

      {/* 自分の解答入力 */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">
          あなたの解答
        </h3>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="ここに自分の解答を書いてください..."
          className="w-full h-40 p-3 border rounded bg-gray-50 dark:bg-gray-800"
        />

        <p className="text-sm text-gray-500">
          文字数: {answer.length}
        </p>
      </div>

      {/* 解答トグル */}
      {solutionHtml && (
        <div className="space-y-4">
          <button
            onClick={() =>
              setShowSolution(!showSolution)
            }
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {showSolution
              ? '解答を閉じる'
              : '模範解答を表示する'}
          </button>

          {showSolution && (
            <div
              className="overflow-x-auto"
              dangerouslySetInnerHTML={{
                __html: solutionHtml,
              }}
            />
          )}
        </div>
      )}
    </section>
  );
}
