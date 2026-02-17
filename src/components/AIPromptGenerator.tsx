'use client';

import { useState } from 'react';

interface Props {
  patternName: string;
  questionText: string;
}

export default function AIPromptGenerator({
  patternName,
  questionText,
}: Props) {
  const [answer, setAnswer] = useState('');
  const [copied, setCopied] = useState(false);

  const prompt = `# デザインパターンレビュー依頼

## パターン名
${patternName}

## 問題
${questionText}

## 私の解答
${answer}

---

あなたはデザインパターン専門のレビュアーです。

以下の形式でレビューしてください：

### 1. 良い点
### 2. 不足している点
### 3. 誤っている可能性がある点
### 4. 改善アドバイス
### 5. 理解度 (0-100)

厳しめにレビューしてください。
`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">
        AIレビュー用プロンプト生成
      </h2>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="ここにあなたの解答を書いてください..."
        className="w-full h-40 p-3 border rounded bg-gray-50 dark:bg-gray-800"
      />

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">
          生成されたプロンプト
        </h3>

        <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm whitespace-pre-wrap">
          {prompt}
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
