'use client';

import { useState } from 'react';

interface Props {
  html: string;
}

export default function InteractiveQuestion({ html }: Props) {
  const [done, setDone] = useState(false);

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">
        問題
      </h2>

      <div
        className="prose dark:prose-invert max-w-none mb-6"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <button
        onClick={() => setDone(true)}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        理解できた
      </button>

      {done && (
        <p className="mt-4 text-green-600 font-semibold">
          ✅ 理解済みとして記録されました
        </p>
      )}
    </section>
  );
}
