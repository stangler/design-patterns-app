'use client';

import type { LearningStatus } from '@/types/learning';

interface PatternProgressBadgeProps {
  status: LearningStatus;
  size?: 'sm' | 'md';
}

const statusConfig = {
  not_started: {
    label: '未学習',
    bgColor: 'bg-gray-100 dark:bg-gray-700',
    textColor: 'text-gray-600 dark:text-gray-300',
    dotColor: 'bg-gray-400',
  },
  in_progress: {
    label: '学習中',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    textColor: 'text-blue-700 dark:text-blue-300',
    dotColor: 'bg-blue-500',
  },
  completed: {
    label: '完了',
    bgColor: 'bg-green-100 dark:bg-green-900',
    textColor: 'text-green-700 dark:text-green-300',
    dotColor: 'bg-green-500',
  },
};

export default function PatternProgressBadge({
  status,
  size = 'sm',
}: PatternProgressBadgeProps) {
  const config = statusConfig[status];
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bgColor} ${config.textColor} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
}