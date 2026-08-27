const reviewScheduleRenderTime = new Date().getTime();

import type { AdaptiveTopicMastery } from "@/types/adaptiveLearning";

export default function ReviewSchedule({
  topics,
}: {
  topics: AdaptiveTopicMastery[];
}) {
  const upcoming = [...topics]
    .sort(
      (first, second) =>
        first.nextReviewAt.getTime() - second.nextReviewAt.getTime(),
    )
    .slice(0, 6);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <p className="text-sm font-bold uppercase tracking-wide text-teal-600">
        Spaced retrieval
      </p>
      <h2 className="mt-2 text-2xl font-black text-slate-950">
        Review schedule
      </h2>

      <div className="mt-5 space-y-3">
        {upcoming.map((topic) => {
          const due = topic.nextReviewAt.getTime() <= reviewScheduleRenderTime;

          return (
            <div
              key={topic.id}
              className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4"
            >
              <div>
                <p className="font-black text-slate-900">{topic.topic}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Every {topic.reviewIntervalDays} day
                  {topic.reviewIntervalDays === 1 ? "" : "s"}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  due ? "bg-red-100 text-red-700" : "bg-teal-100 text-teal-700"
                }`}
              >
                {due
                  ? "Due now"
                  : topic.nextReviewAt.toLocaleDateString("en-GB")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
