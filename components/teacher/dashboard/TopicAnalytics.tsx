import Card from "@/components/ui/Card";
import { type TopicPerformance } from "@/hooks/useTeacherDashboard";

type Props = {
  topics: TopicPerformance[];
  strongestTopic: TopicPerformance | null;
  weakestTopic: TopicPerformance | null;
};

export default function TopicAnalytics({
  topics,
  strongestTopic,
  weakestTopic,
}: Props) {
  const visibleTopics = topics.slice(0, 6);

  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Curriculum Performance
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Topic Performance
          </h2>

          <p className="mt-2 text-slate-600">
            Average scores calculated from completed quizzes.
          </p>
        </div>

        {strongestTopic && (
          <span className="w-fit rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
            Strongest: {strongestTopic.topic}
          </span>
        )}
      </div>

      {visibleTopics.length === 0 ? (
        <EmptyAnalyticsState
          icon="📊"
          title="No topic data yet"
          text="Topic analytics will appear after students complete quizzes."
        />
      ) : (
        <div className="mt-8 space-y-6">
          {visibleTopics.map((topic) => (
            <div key={topic.id}>
              <div className="flex items-center justify-between">
                <p className="truncate font-semibold text-slate-800">
                  {topic.topic}
                </p>

                <span className="font-bold text-slate-900">
                  {topic.averageScore}%
                </span>
              </div>

              <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full ${
                    topic.averageScore >= 70
                      ? "bg-emerald-500"
                      : topic.averageScore >= 50
                        ? "bg-amber-500"
                        : "bg-red-500"
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(0, topic.averageScore))}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {strongestTopic && weakestTopic && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Strongest Area
            </p>

            <p className="mt-2 font-bold text-slate-900">
              {strongestTopic.topic}
            </p>

            <p className="mt-1 text-sm text-emerald-800">
              Average Score: {strongestTopic.averageScore}%
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
              Reteaching Priority
            </p>

            <p className="mt-2 font-bold text-slate-900">
              {weakestTopic.topic}
            </p>

            <p className="mt-1 text-sm text-amber-800">
              Average Score: {weakestTopic.averageScore}%
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}

function EmptyAnalyticsState({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="mt-8 rounded-2xl bg-slate-50 p-10 text-center">
      <div className="text-5xl">{icon}</div>

      <h3 className="mt-4 text-xl font-bold text-slate-900">{title}</h3>

      <p className="mt-2 text-slate-600">{text}</p>
    </div>
  );
}
