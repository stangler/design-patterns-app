'use client';

import { useState } from 'react';

interface Props {
  patternName: string;
  questionText: string;
}

export default function ExerciseSection({
  patternName,
  questionText,
}: Props) {
  const [implementationAnswer, setImplementationAnswer] = useState('');
  const [advancedAnswer, setAdvancedAnswer] = useState('');
  const [copied, setCopied] = useState(false);

  const fullPrompt = `# デザインパターン 総合レビュー依頼

## パターン名
${patternName}

## 問題
${questionText}

---

# 🧩 実装課題の解答

${implementationAnswer || '（未入力）'}

---

# 🚀 発展課題の解答

${advancedAnswer || '（未入力）'}

---

あなたはデザインパターン専門のシニアエンジニアです。
以下の観点で厳しめにレビューしてください。

## 1. 実装の正確性
## 2. 設計の妥当性
## 3. 改善点
## 4. 実務レベルでのアドバイス
## 5. 理解度 (0-100)

可能であれば、
- 設計思想レベルのコメント
- 他パターンとの比較
も含めてください。
`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="space-y-10">
      {/* 実装課題 */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
          実装課題
        </h2>

        <textarea
          value={implementationAnswer}
          onChange={(e) =>
            setImplementationAnswer(e.target.value)
          }
          placeholder="実装コードを書いてください..."
          className="w-full h-48 p-4 border rounded-lg bg-white dark:bg-gray-900 font-mono text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* 発展課題 */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
          発展課題
        </h2>

        <textarea
          value={advancedAnswer}
          onChange={(e) =>
            setAdvancedAnswer(e.target.value)
          }
          placeholder="設計改善案や応用例を書いてください..."
          className="w-full h-48 p-4 border rounded-lg bg-white dark:bg-gray-900 text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* 完成版プロンプト表示 */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
          完成版プロンプト
        </h2>

        <pre className="bg-gray-900 text-gray-100 p-5 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap leading-relaxed">
          {fullPrompt}
        </pre>

        <button
          onClick={handleCopy}
          className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {copied ? 'コピーしました！' : 'プロンプトをコピー'}
        </button>
      </div>
    </section>
  );
}
