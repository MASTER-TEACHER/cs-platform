"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import TutorChat from "@/components/tutor/TutorChat";
import { useAuth } from "@/contexts/AuthContext";
import { getStudentTutorContext } from "@/services/studentTutorContextService";
import type { TutorStudentContext } from "@/types/studentTutor";

export default function TutorPage() {
  const { user } = useAuth();
  const [context, setContext] = useState<TutorStudentContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    async function load() {
      if (!user?.uid) {
        setLoading(false);
        return;
      }
      try {
        setContext(await getStudentTutorContext(user.uid));
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Tutor context could not load.",
        );
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [user?.uid]);
  if (loading) return <Skeleton className="h-96" />;
  if (!user?.uid || !context)
    return (
      <Card>
        <h1 className="text-2xl font-black">AI Tutor unavailable</h1>
        <p className="mt-3">{error || "Sign in as a student."}</p>
      </Card>
    );
  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-blue-950 to-indigo-900 text-white">
        <p className="text-sm font-bold uppercase text-blue-200">
          Personalised learning support
        </p>
        <h1 className="mt-2 text-4xl font-black">AI Student Tutor</h1>
        <p className="mt-3 text-blue-100">
          Ask questions, review mistakes and receive guidance based on your
          progress.
        </p>
        <div className="mt-5 flex gap-3">
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
      </Card>
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <TutorChat studentId={user.uid} context={context} />
        <aside className="space-y-5">
          <Card>
            <p className="text-sm font-bold uppercase text-blue-600">
              Tutor context
            </p>
            <h2 className="mt-2 text-xl font-black">Personalised to you</h2>
            <div className="mt-4 space-y-2 text-sm">
              <p>
                Course: <b>{context.currentCourse}</b>
              </p>
              <p>
                Exam board: <b>{context.examBoard}</b>
              </p>
              <p>
                Combined: <b>{context.combinedAverage}%</b>
              </p>
              <p>
                Predicted grade: <b>{context.predictedGrade}</b>
              </p>
            </div>
          </Card>
          <Card className="border border-red-200 bg-red-50">
            <p className="font-black text-red-900">Priority topics</p>
            {context.priorityTopics.length ? (
              context.priorityTopics.map((t) => (
                <div key={t.topic} className="mt-3 rounded-xl bg-white p-3">
                  <b>{t.topic}</b>
                  <span className="float-right font-black text-red-700">
                    {t.averageScore}%
                  </span>
                </div>
              ))
            ) : (
              <p className="mt-3 text-sm">No priority topic identified.</p>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}
