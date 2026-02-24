'use client';

import { useState } from 'react';

interface Props {
  html: string;
}

export default function SolutionToggle({ html }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
      >
        {open ? '模範解答を非表示' : '模範解答を表示'}
      </button>

      {open && (
        <div
          className="prose dark:prose-invert max-w-none overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </section>
  );
}
