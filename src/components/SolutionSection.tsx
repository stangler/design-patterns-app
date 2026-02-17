'use client';

import { useState } from 'react';

interface Props {
  html: string;
}

export default function SolutionSection({ html }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">
        解答
      </h2>

      <button
        onClick={() => setOpen(!open)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {open ? '閉じる' : '解答コードを表示する'}
      </button>

      {open && (
        <div
          className="overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </section>
  );
}
