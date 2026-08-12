"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import AdaptiveLearningSummary from "@/components/adaptive/AdaptiveLearningSummary";
import NextLearningAction from "@/components/adaptive/NextLearningAction";
import ReviewSchedule from "@/components/adaptive/ReviewSchedule";
import TopicMasteryCard from "@/components/adaptive/TopicMasteryCard";
import { useAdaptiveLearning } from "@/hooks/useAdaptiveLearning";

export default function AdaptiveLearningPage() {
  const { plan, loading, error, refresh } = useAdaptiveLearning();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!plan) {
    return (
      <Card>
        <h1 className="text-2xl font-black">Adaptive learning unavailable</h1>
        <p className="mt-3 text-slate-600">
          {error ||
            "Complete a quiz or written assessment to generate your learning plan."}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-indigo-950 to-blue-800 text-white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-200">
              Intelligent learning pathway
            </p>
            <h1 className="mt-2 text-4xl font-black">Adaptive Learning</h1>
            <p className="mt-3 max-w-3xl text-blue-100">
              Your next activity, difficulty and review schedule are calculated
              from quiz, exam, lesson and intervention evidence.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void refresh()}
              className="rounded-xl border border-white/20 px-5 py-3 font-bold"
            >
              Refresh plan
            </button>
            <Link
              href="/dashboard"
              className="rounded-xl border border-white/20 px-5 py-3 font-bold"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </Card>

      <AdaptiveLearningSummary plan={plan} />

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <NextLearningAction action={plan.nextAction} />
        <ReviewSchedule topics={plan.topics} />
      </section>

      <section>
        <p className="text-sm font-bold uppercase tracking-wide text-teal-600">
          Knowledge state
        </p>
        <h2 className="mt-2 text-2xl font-black text-slate-950">
          Topic mastery
        </h2>

        {plan.topics.length === 0 ? (
          <Card className="mt-5">
            Complete an assessment to generate topic mastery.
          </Card>
        ) : (
          <div className="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {plan.topics.map((topic) => (
              <TopicMasteryCard key={topic.id} topic={topic} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
