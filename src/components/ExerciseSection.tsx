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
    <section className="space-y-12">
      {/* 実装課題 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">
          実装課題
        </h2>

        <textarea
          value={implementationAnswer}
          onChange={(e) =>
            setImplementationAnswer(e.target.value)
          }
          placeholder="実装コードを書いてください..."
          className="w-full h-48 p-3 border rounded bg-gray-50 dark:bg-gray-800 font-mono"
        />
      </div>

      {/* 発展課題 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">
          発展課題
        </h2>

        <textarea
          value={advancedAnswer}
          onChange={(e) =>
            setAdvancedAnswer(e.target.value)
          }
          placeholder="設計改善案や応用例を書いてください..."
          className="w-full h-48 p-3 border rounded bg-gray-50 dark:bg-gray-800"
        />
      </div>

      {/* 完成版プロンプト表示 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">
          完成版プロンプト
        </h2>

        <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm whitespace-pre-wrap">
          {fullPrompt}
        </pre>

        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {copied ? 'コピーしました！' : 'プロンプトをコピー'}
        </button>
      </div>
    </section>
  );
}
