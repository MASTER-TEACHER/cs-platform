import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";

type TopicPerformance = {
  id: string;
  topic: string;
  averageScore: number;
};

type ClassPerformanceProps = {
  topics: TopicPerformance[];
};

export default function ClassPerformance({
  topics,
}: ClassPerformanceProps) {
  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
        Class Analytics
      </p>

      <h2 className="mt-2 text-2xl font-bold text-slate-900">
        Topic Performance
      </h2>

      {topics.length === 0 ? (
        <p className="mt-6 text-slate-500">
          No class performance data is available yet.
        </p>
      ) : (
        <div className="mt-6 space-y-5">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className="font-bold text-slate-900">{topic.topic}</p>

                <p className="font-bold text-blue-700">
                  {topic.averageScore}%
                </p>
              </div>

              <ProgressBar value={topic.averageScore} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}