import Link from "next/link";

import Card from "@/components/ui/Card";
import type { StudentAdaptiveAnalytics } from "@/services/studentAdaptiveAnalyticsService";

type Props = {
  analytics: StudentAdaptiveAnalytics;
  loading: boolean;
  error: string;
};

export default function AssessmentInsights({
  analytics,
  loading,
  error,
}: Props) {
  if (loading) {
    return (
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="h-64 animate-pulse rounded-3xl bg-slate-200 xl:col-span-2" />
        <div className="h-64 animate-pulse rounded-3xl bg-slate-200" />
      </div>
    );
  }

  return (
    <section className="grid gap-6 xl:grid-cols-3">
      <Card className="rounded-3xl border border-slate-200 p-6 xl:col-span-2">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">
          Assessment intelligence
        </p>

        <h2 className="mt-2 text-2xl font-black text-slate-950">
          Your current performance
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Quiz and written-exam evidence combined into one view.
        </p>

        {error && (
          <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-800">
            {error}
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Combined" value={`${analytics.combinedAverage}%`} />

          <Metric label="Quiz average" value={`${analytics.quizAverage}%`} />

          <Metric label="Exam average" value={`${analytics.examAverage}%`} />

          <Metric label="Predicted grade" value={analytics.predictedGrade} />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <TopicPanel
            title="Secure topics"
            empty="Secure topics will appear after more assessments."
            topics={analytics.strongestTopics}
            positive
          />

          <TopicPanel
            title="Priority topics"
            empty="No priority topics are currently identified."
            topics={analytics.priorityTopics}
            positive={false}
          />
        </div>
      </Card>

      <Card className="rounded-3xl border border-violet-200 bg-violet-50 p-6">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-violet-700">
          Adaptive revision
        </p>

        <h2 className="mt-2 text-2xl font-black text-violet-950">
          Recommended next steps
        </h2>

        <p className="mt-2 text-sm leading-6 text-violet-800">
          Recommendations update as new quizzes and written assessments are
          marked.
        </p>

        <div className="mt-5 space-y-4">
          {analytics.recommendations.map((recommendation) => (
            <Link
              key={recommendation.id}
              href={recommendation.href}
              className="block rounded-2xl border border-violet-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-violet-600">
                {recommendation.type}
              </p>

              <p className="mt-1 font-black text-slate-950">
                {recommendation.title}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {recommendation.description}
              </p>
            </Link>
          ))}
        </div>

        {analytics.awaitingMarking > 0 && (
          <p className="mt-5 rounded-xl bg-cyan-50 p-3 text-sm font-bold text-cyan-800">
            {analytics.awaitingMarking} written assessment
            {analytics.awaitingMarking === 1 ? "" : "s"} awaiting teacher
            feedback.
          </p>
        )}
      </Card>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function TopicPanel({
  title,
  empty,
  topics,
  positive,
}: {
  title: string;
  empty: string;
  topics: StudentAdaptiveAnalytics["strongestTopics"];
  positive: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 ${positive ? "bg-emerald-50" : "bg-red-50"}`}
    >
      <p
        className={`font-black ${
          positive ? "text-emerald-900" : "text-red-900"
        }`}
      >
        {title}
      </p>

      {topics.length === 0 ? (
        <p className="mt-3 text-sm text-slate-600">{empty}</p>
      ) : (
        <div className="mt-3 space-y-3">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-white p-3"
            >
              <p className="text-sm font-bold text-slate-800">{topic.topic}</p>

              <p
                className={`font-black ${
                  positive ? "text-emerald-700" : "text-red-700"
                }`}
              >
                {topic.averageScore}%
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
