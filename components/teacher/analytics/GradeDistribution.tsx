"use client";

import type { GradeDistributionItem } from "@/types/teacherAnalytics";

export default function GradeDistribution({
  items,
}: {
  items: GradeDistributionItem[];
}) {
  const maximum = Math.max(1, ...items.map((item) => item.count));

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.grade}
          className="grid grid-cols-[42px_1fr_42px] items-center gap-3"
        >
          <span className="text-sm font-black text-slate-700">
            {item.grade}
          </span>

          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-blue-600"
              style={{
                width: `${Math.round((item.count / maximum) * 100)}%`,
              }}
            />
          </div>

          <span className="text-right text-sm font-bold text-slate-600">
            {item.count}
          </span>
        </div>
      ))}
    </div>
  );
}
