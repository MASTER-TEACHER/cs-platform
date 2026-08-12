import Link from "next/link";

import { curriculumTopicById } from "@/data/curriculum/curriculumRegistry";
import type { KnowledgeMapTopic } from "@/types/knowledgeMap";

function stateClass(state?: string) {
  if (state === "priority") return "border-red-300 bg-red-50";
  if (state === "forgetting-risk" || state === "developing") {
    return "border-amber-300 bg-amber-50";
  }
  if (state === "secure") return "border-emerald-300 bg-emerald-50";
  if (state === "mastered") return "border-violet-300 bg-violet-50";
  return "border-slate-200 bg-white";
}

function lessonHref(topicId: string, lessonId: string) {
  const routeTopicId = topicId === "binary-numbers" ? "binary" : topicId;

  return `/learn/${routeTopicId}?lesson=${lessonId}`;
}

export default function KnowledgeMapNode({
  topic,
}: {
  topic: KnowledgeMapTopic;
}) {
  const { definition, mastery, nextAction } = topic;

  return (
    <article
      className={`rounded-3xl border p-5 shadow-sm ${stateClass(mastery?.state)}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-950">
            {definition.title}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {definition.lessonIds.length} lesson
            {definition.lessonIds.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="text-right">
          <p className="text-3xl font-black text-slate-950">
            {mastery ? `${mastery.masteryScore}%` : "—"}
          </p>
          <p className="text-xs font-bold uppercase text-slate-500">
            {mastery ? mastery.state.replace("-", " ") : "Not assessed"}
          </p>
        </div>
      </div>

      {mastery && (
        <>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-500"
              style={{ width: `${mastery.masteryScore}%` }}
            />
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            {mastery.reason}
          </p>
        </>
      )}

      {definition.prerequisites.length > 0 && (
        <div className="mt-4 rounded-xl bg-white/70 p-3">
          <p className="text-xs font-bold uppercase text-slate-500">
            Prerequisite
          </p>
          <p className="mt-1 text-sm font-bold text-slate-800">
            {definition.prerequisites
              .map(
                (topicId) => curriculumTopicById.get(topicId)?.title || topicId,
              )
              .join(" → ")}
          </p>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {definition.lessonIds[0] && (
          <Link
            href={lessonHref(definition.id, definition.lessonIds[0])}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700"
          >
            Open lesson
          </Link>
        )}

        {nextAction && (
          <Link
            href={nextAction.href}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white"
          >
            Next action
          </Link>
        )}
      </div>
    </article>
  );
}
