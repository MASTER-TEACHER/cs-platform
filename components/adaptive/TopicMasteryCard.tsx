import MasteryProgress from "@/components/adaptive/MasteryProgress";
import type { AdaptiveTopicMastery } from "@/types/adaptiveLearning";

function badgeClass(state: AdaptiveTopicMastery["state"]) {
  if (state === "priority") return "bg-red-100 text-red-700";
  if (state === "forgetting-risk") return "bg-amber-100 text-amber-700";

  if (state === "secure" || state === "mastered") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (state === "new") return "bg-slate-100 text-slate-700";

  return "bg-blue-100 text-blue-700";
}

export default function TopicMasteryCard({
  topic,
}: {
  topic: AdaptiveTopicMastery;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-slate-950">
            {topic.topic}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {topic.independentEvidenceCount} independent evidence item
            {topic.independentEvidenceCount === 1 ? "" : "s"}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${badgeClass(
            topic.state,
          )}`}
        >
          {topic.state.replace("-", " ")}
        </span>
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Independent mastery
          </p>

          <p className="mt-1 text-3xl font-black text-slate-950">
            {topic.masteryScore}%
          </p>
        </div>

        <div className="text-right text-sm">
          <p className="font-bold text-slate-700">
            Confidence {topic.confidenceScore}%
          </p>

          <p className="mt-1 text-slate-500">
            Priority {topic.priorityScore}/100
          </p>
        </div>
      </div>

      <div className="mt-4">
        <MasteryProgress value={topic.masteryScore} />
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        {topic.reason}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase text-slate-500">
            Difficulty
          </p>
          <p className="mt-1 font-bold capitalize text-slate-900">
            {topic.recommendedDifficulty}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase text-slate-500">
            Next review
          </p>
          <p className="mt-1 font-bold text-slate-900">
            {topic.nextReviewAt.toLocaleDateString("en-GB")}
          </p>
        </div>

        <div className="rounded-xl bg-emerald-50 p-3">
          <p className="text-xs font-bold uppercase text-emerald-700">
            Independent
          </p>
          <p className="mt-1 font-bold text-emerald-950">
            {topic.independentEvidenceCount} item
            {topic.independentEvidenceCount === 1 ? "" : "s"}
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 p-3">
          <p className="text-xs font-bold uppercase text-blue-700">
            Supported
          </p>
          <p className="mt-1 font-bold text-blue-950">
            {topic.supportedEvidenceCount} item
            {topic.supportedEvidenceCount === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {topic.supportedEvidenceCount > 0 && (
        <p className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs leading-5 text-blue-800">
          Supported lesson or intervention evidence helps CS Master
          choose what to teach next, but it does not directly raise
          independent mastery.
        </p>
      )}
    </article>
  );
}
