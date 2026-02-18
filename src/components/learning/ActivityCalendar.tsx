'use client';

import type { ActivityData } from '@/lib/learning';
import { useMemo } from 'react';

interface ActivityCalendarProps {
  activityData: ActivityData[];
  months?: number;
}

// 活動レベルに応じた色を返す
function getActivityLevel(count: number): string {
  if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
  if (count <= 2) return 'bg-green-200 dark:bg-green-900';
  if (count <= 4) return 'bg-green-400 dark:bg-green-700';
  if (count <= 6) return 'bg-green-500 dark:bg-green-600';
  return 'bg-green-600 dark:bg-green-500';
}

// 日付から曜日を取得（0=日曜日）
function getDayOfWeek(date: Date): number {
  return date.getDay();
}

// 日付グリッドのキャッシュ（モジュールレベル）
const gridCache = new Map<string, Date[][]>();

// 指定した月数分の日付配列を生成（キャッシュ付き）
function generateDateGrid(months: number): Date[][] {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const cacheKey = `${todayStr}-${months}`;
  
  if (gridCache.has(cacheKey)) {
    return gridCache.get(cacheKey)!;
  }
  
  const startDate = new Date(now);
  startDate.setMonth(startDate.getMonth() - months + 1);
  startDate.setDate(1);

  const grid: Date[][] = [];
  let currentWeek: Date[] = [];

  // 週の始まり（日曜日）まで空白を埋める
  const firstDayOfWeek = getDayOfWeek(startDate);
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(null as unknown as Date);
  }

  // 日付を埋めていく
  const current = new Date(startDate);
  while (current <= now) {
    currentWeek.push(new Date(current));
    
    if (getDayOfWeek(current) === 6) {
      // 土曜日で週を区切る
      grid.push(currentWeek);
      currentWeek = [];
    }
    
    current.setDate(current.getDate() + 1);
  }

  // 最後の週を追加
  if (currentWeek.length > 0) {
    grid.push(currentWeek);
  }

  gridCache.set(cacheKey, grid);
  return grid;
}

export default function ActivityCalendar({
  activityData,
  months = 6,
}: ActivityCalendarProps) {
  // 日付ごとの活動数をマップ化（メモ化）
  const activityMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of activityData) {
      map.set(item.date, item.count);
    }
    return map;
  }, [activityData]);

  // 日付グリッドを生成（メモ化）
  const grid = useMemo(() => generateDateGrid(months), [months]);

  // 月のラベルを生成
  const monthLabels: { month: string; index: number }[] = [];
  let lastMonth = -1;
  grid.forEach((week, weekIndex) => {
    const firstDay = week.find((d) => d !== null);
    if (firstDay) {
      const month = firstDay.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({
          month: `${firstDay.getMonth() + 1}月`,
          index: weekIndex,
        });
        lastMonth = month;
      }
    }
  });

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        学習アクティビティ
      </h3>
      
      <div className="overflow-x-auto">
        <div className="inline-block">
          {/* 月ラベル */}
          <div className="flex mb-1 text-xs text-gray-500 dark:text-gray-400">
            {monthLabels.map((label, i) => (
              <span
                key={i}
                className="w-[14px] text-center"
                style={{
                  marginLeft: i === 0 ? `${label.index * 15}px` : `${(label.index - monthLabels[i - 1].index - 1) * 15}px`,
                }}
              >
                {label.month}
              </span>
            ))}
          </div>

          {/* カレンダーグリッド */}
          <div className="flex gap-0.5">
            {grid.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-0.5">
                {week.map((day, dayIndex) => {
                  if (!day) {
                    return (
                      <div
                        key={dayIndex}
                        className="w-3 h-3"
                      />
                    );
                  }

                  const dateStr = day.toISOString().split('T')[0];
                  const count = activityMap.get(dateStr) || 0;

                  return (
                    <div
                      key={dayIndex}
                      className={`w-3 h-3 rounded-sm ${getActivityLevel(count)} cursor-pointer hover:ring-1 hover:ring-gray-400`}
                      title={`${dateStr}: ${count}回`}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* 凡例 */}
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>少</span>
            <div className="flex gap-0.5">
              <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
              <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900" />
              <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700" />
              <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-600" />
              <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500" />
            </div>
            <span>多</span>
          </div>
        </div>
      </div>
    </div>
  );
}