'use client';

import { useLearningProgress } from '@/hooks/useLearningProgress';
import PatternProgressBadge from './PatternProgressBadge';
import ProgressUpdateButton from './ProgressUpdateButton';
import type { LearningStatus } from '@/types/learning';

interface PatternProgressSectionProps {
  patternId: string;
  patternName: string;
}

export default function PatternProgressSection({
  patternId,
  patternName: _patternName,
}: PatternProgressSectionProps) {
  const { progressMap, updateProgress, loading } = useLearningProgress();

  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      </div>
    );
  }

  const progress = progressMap.get(patternId);
  const status: LearningStatus = progress?.status || 'not_started';

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          学習進捗
        </h3>
        <PatternProgressBadge status={status} size="md" />
      </div>
      
      <ProgressUpdateButton
        currentStatus={status}
        onUpdate={(newStatus) => updateProgress(patternId, newStatus)}
      />

      {progress && (
        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
          {progress.started_at && (
            <p>
              学習開始: {new Date(progress.started_at).toLocaleDateString('ja-JP')}
            </p>
          )}
          {progress.completed_at && (
            <p>
              完了日: {new Date(progress.completed_at).toLocaleDateString('ja-JP')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}