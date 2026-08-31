"use client";

import Link from "next/link";

import AdaptiveLearningSummary from "@/components/adaptive/AdaptiveLearningSummary";
import TopicMasteryCard from "@/components/adaptive/TopicMasteryCard";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useAdaptiveLearning } from "@/hooks/useAdaptiveLearning";

export default function StudentKnowledgeMapPage() {
  const {
    plan,
    loading,
    error,
    refresh,
  } = useAdaptiveLearning();

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
      <div className="space-y-6">
        <Card className="border-0 bg-gradient-to-r from-indigo-950 via-blue-900 to-cyan-800 text-white">
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-200">
            Student intelligence
          </p>

          <h1 className="mt-2 text-4xl font-black">
            My Knowledge Map
          </h1>

          <p className="mt-3 max-w-3xl text-blue-100">
            Track your personal Computer Science knowledge using evidence from
            assessments, lessons and adaptive learning.
          </p>
        </Card>

        <Card>
          <h2 className="text-2xl font-black text-slate-950">
            Knowledge map unavailable
          </h2>

          <p className="mt-3 text-slate-600">
            {error ||
              "Complete an assessment or learning activity to generate your knowledge map."}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/assignments"
              className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white"
            >
              View assignments
            </Link>

            <Link
              href="/learn"
              className="rounded-xl border px-5 py-3 font-bold"
            >
              Continue learning
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-indigo-950 via-blue-900 to-cyan-800 text-white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-200">
              Student intelligence
            </p>

            <h1 className="mt-2 text-4xl font-black">
              My Knowledge Map
            </h1>

            <p className="mt-3 max-w-3xl text-blue-100">
              See which Computer Science topics are secure, developing or need
              more practice using your own learning evidence.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void refresh()}
              className="rounded-xl border border-white/20 px-5 py-3 font-bold"
            >
              ↻ Refresh map
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

      <Card className="border border-cyan-200 bg-cyan-50">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700">
          Personal knowledge state
        </p>

        <h2 className="mt-2 text-xl font-black text-cyan-950">
          Your evidence, not your class
        </h2>

        <p className="mt-2 text-sm leading-6 text-cyan-900">
          This map uses the same student evidence as Adaptive Learning. It does
          not use teacher class averages or other students&apos; results.
        </p>
      </Card>

      <section>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-teal-600">
              Knowledge state
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-950">
              Topic mastery
            </h2>

            <p className="mt-2 text-slate-600">
              {plan.topics.length === 1
                ? "1 topic currently has learning evidence."
                : `${plan.topics.length} topics currently have learning evidence.`}
            </p>
          </div>

          <Link
            href="/adaptive-learning"
            className="rounded-xl bg-teal-600 px-5 py-3 font-bold text-white"
          >
            Open Adaptive Learning →
          </Link>
        </div>

        {plan.topics.length === 0 ? (
          <Card className="mt-6">
            <h3 className="font-black text-slate-950">
              No topic evidence yet
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Complete an assessment or learning activity to begin building
              your knowledge map.
            </p>
          </Card>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {plan.topics.map((topic) => (
              <TopicMasteryCard
                key={topic.id}
                topic={topic}
              />
            ))}
          </div>
        )}
      </section>

      <Card className="border-0 bg-slate-950 text-white">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-blue-300">
              Next step
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Turn your knowledge map into action
            </h2>

            <p className="mt-2 max-w-3xl text-sm text-slate-300">
              Adaptive Learning uses this same evidence to choose your priority
              topic and review schedule.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/adaptive-learning"
              className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white"
            >
              Continue Adaptive Learning
            </Link>

            <Link
              href="/analytics"
              className="rounded-xl border border-white/20 px-5 py-3 font-bold"
            >
              View Analytics
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
