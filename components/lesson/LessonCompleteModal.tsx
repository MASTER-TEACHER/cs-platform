"use client";

import Link from "next/link";

import Button from "@/components/ui/Button";
import type { LessonCompletionSummary } from "@/types/interactiveLesson";

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

type Props = {
  topicId: string;
  nextLessonId?: string;
  summary: LessonCompletionSummary;
  achievements: Achievement[];
  onClose: () => void;
};

function formatReviewDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

export default function LessonCompleteModal({
  topicId,
  nextLessonId,
  summary,
  achievements,
  onClose,
}: Props) {
  const continueHref = nextLessonId
    ? `/learn/${topicId}?lesson=${nextLessonId}`
    : "/learn";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lesson-complete-title"
    >
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">
        <div className="text-center">
          <div className="animate-bounce text-7xl">
            {summary.alreadyCompleted ? "✅" : "🎉"}
          </div>

          <h1
            id="lesson-complete-title"
            className="mt-5 text-4xl font-black text-slate-950"
          >
            {summary.alreadyCompleted
              ? "Lesson Already Completed"
              : "Lesson Complete!"}
          </h1>

          <p className="mt-3 text-slate-600">
            {summary.alreadyCompleted
              ? "Your completion record is safe. Review the summary or continue learning."
              : "Your progress, accuracy and next review have been saved."}
          </p>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-blue-50 p-4 text-center">
            <p className="text-xs font-black uppercase text-blue-600">
              XP earned
            </p>

            <p className="mt-1 text-3xl font-black text-blue-800">
              +{summary.xpAwarded}
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-4 text-center">
            <p className="text-xs font-black uppercase text-emerald-600">
              Accuracy
            </p>

            <p className="mt-1 text-3xl font-black text-emerald-800">
              {summary.overallAccuracy}%
            </p>
          </div>

          <div className="rounded-2xl bg-violet-50 p-4 text-center">
            <p className="text-xs font-black uppercase text-violet-600">
              Mastery impact
            </p>

            <p className="mt-1 text-3xl font-black text-violet-800">
              +{summary.masteryImpact}
            </p>
          </div>

          <div className="rounded-2xl bg-amber-50 p-4 text-center">
            <p className="text-xs font-black uppercase text-amber-600">
              Review
            </p>

            <p className="mt-2 font-black text-amber-900">
              {formatReviewDate(summary.reviewAt)}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-5">
            <p className="text-sm font-black text-slate-950">Guided practice</p>

            <p className="mt-2 text-3xl font-black text-blue-700">
              {summary.practiceAccuracy}%
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <p className="text-sm font-black text-slate-950">Checkpoint</p>

            <p className="mt-2 text-3xl font-black text-teal-700">
              {summary.checkpointAccuracy}%
            </p>
          </div>
        </div>

        {achievements.length > 0 && (
          <div className="mt-6 space-y-3">
            <p className="font-black text-slate-950">Achievements unlocked</p>

            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{achievement.icon}</div>

                  <div>
                    <p className="font-black text-slate-950">
                      {achievement.title}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <Button onClick={onClose}>Close summary</Button>

          <Link
            href={continueHref}
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700"
          >
            {nextLessonId ? "Start next lesson →" : "Return to learning →"}
          </Link>
        </div>
      </div>
    </div>
  );
}
