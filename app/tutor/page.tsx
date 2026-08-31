"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import TutorChat from "@/components/tutor/TutorChat";
import { useAuth } from "@/contexts/AuthContext";
import { getStudentTutorContext } from "@/services/studentTutorContextService";

import type { TutorStudentContext } from "@/types/studentTutor";

export default function TutorPage() {
  const { user } = useAuth();

  const [context, setContext] =
    useState<TutorStudentContext | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!user?.uid) {
        if (!cancelled) setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const loaded = await getStudentTutorContext(user.uid);

        if (!cancelled) setContext(loaded);
      } catch (caughtError) {
        if (!cancelled) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Tutor context could not load.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48" />
        <Skeleton className="h-[560px]" />
      </div>
    );
  }

  if (!user?.uid || !context) {
    return (
      <Card>
        <h1 className="text-2xl font-black">AI Tutor unavailable</h1>
        <p className="mt-3">{error || "Sign in as a student."}</p>
      </Card>
    );
  }

  const priority = context.priorityTopics[0];

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-blue-950 to-indigo-900 text-white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-blue-200">
              Personalised learning support
            </p>

            <h1 className="mt-2 text-4xl font-black">
              AI Student Tutor
            </h1>

            <p className="mt-3 max-w-3xl text-blue-100">
              Ask questions, review mistakes and receive
              curriculum-aware guidance based on your canonical
              adaptive learning profile.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/adaptive-learning"
              className="rounded-xl border border-white/20 px-5 py-3 font-bold"
            >
              Adaptive Learning
            </Link>

            <Link
              href="/revision-plan"
              className="rounded-xl border border-white/20 px-5 py-3 font-bold"
            >
              Revision Plan
            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl border border-white/20 px-5 py-3 font-bold"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Independent mastery", `${context.overallMastery}%`],
          ["Exam readiness", `${context.examReadiness}%`],
          ["Evidence confidence", `${context.confidence}%`],
          ["Predicted grade", context.predictedGrade],
        ].map(([label, value]) => (
          <Card key={label}>
            <p className="text-sm font-bold text-slate-500">
              {label}
            </p>
            <p className="mt-2 text-3xl font-black text-slate-950">
              {value}
            </p>
          </Card>
        ))}
      </div>

      <Card className="border border-amber-200 bg-amber-50">
        <p className="font-black text-amber-950">
          How AI support affects mastery
        </p>

        <p className="mt-2 text-sm leading-6 text-amber-900">
          Explanations, hints, interventions and supported lesson
          activity can guide your next step, but they do not directly
          raise independent mastery. Fresh independent quiz, written
          exam or programming evidence is required to do that.
        </p>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <TutorChat studentId={user.uid} context={context} />

        <aside className="space-y-5">
          <Card>
            <p className="text-sm font-bold uppercase text-blue-600">
              Tutor context
            </p>

            <h2 className="mt-2 text-xl font-black">
              Personalised to you
            </h2>

            <div className="mt-4 space-y-3 text-sm">
              <p>
                Course: <b>{context.currentCourse}</b>
              </p>
              <p>
                Qualification: <b>{context.qualification}</b>
              </p>
              <p>
                Exam board: <b>{context.examBoard}</b>
              </p>
              <p>
                Independent evidence:{" "}
                <b>{context.independentEvidenceCount}</b>
              </p>
              <p>
                Supported evidence:{" "}
                <b>{context.supportedEvidenceCount}</b>
              </p>
              <p>
                Reviews due: <b>{context.dueForReviewCount}</b>
              </p>
            </div>
          </Card>

          <Card
            className={
              priority
                ? "border border-red-200 bg-red-50"
                : "border border-emerald-200 bg-emerald-50"
            }
          >
            <p
              className={`font-black ${
                priority
                  ? "text-red-900"
                  : "text-emerald-900"
              }`}
            >
              {priority ? "Priority topics" : "No urgent priority"}
            </p>

            {context.priorityTopics.length ? (
              context.priorityTopics.map((topic) => (
                <div
                  key={topic.topic}
                  className="mt-3 rounded-xl bg-white p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <b>{topic.topic}</b>
                    <span className="font-black text-red-700">
                      {topic.masteryScore}%
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    {topic.independentEvidenceCount} independent ·{" "}
                    {topic.confidenceScore}% confidence ·{" "}
                    <span className="capitalize">
                      {topic.recommendedDifficulty}
                    </span>
                  </p>
                </div>
              ))
            ) : (
              <p className="mt-3 text-sm">
                Continue spaced retrieval and collect fresh independent
                evidence.
              </p>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}
