'use client';

import { useState } from 'react';
import type { LearningStatus } from '@/types/learning';

interface ProgressUpdateButtonProps {
  currentStatus: LearningStatus;
  onUpdate: (status: LearningStatus) => Promise<boolean>;
}

const statusTransitions: Record<LearningStatus, { next: LearningStatus; label: string }[]> = {
  not_started: [
    { next: 'in_progress', label: '学習を始める' },
  ],
  in_progress: [
    { next: 'completed', label: '完了にする' },
    { next: 'not_started', label: 'リセット' },
  ],
  completed: [
    { next: 'in_progress', label: '再学習' },
  ],
};

export default function ProgressUpdateButton({
  currentStatus,
  onUpdate,
}: ProgressUpdateButtonProps) {
  const [loading, setLoading] = useState(false);
  const transitions = statusTransitions[currentStatus];

  const handleClick = async (nextStatus: LearningStatus) => {
    setLoading(true);
    await onUpdate(nextStatus);
    setLoading(false);
  };

  return (
    <div className="flex gap-2">
      {transitions.map((transition) => (
        <button
          key={transition.next}
          onClick={() => handleClick(transition.next)}
          disabled={loading}
          className={`
            px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed
            ${transition.next === 'completed'
              ? 'bg-green-600 text-white hover:bg-green-700'
              : transition.next === 'in_progress'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }
          `}
        >
          {loading ? '更新中...' : transition.label}
        </button>
      ))}
    </div>
  );
}