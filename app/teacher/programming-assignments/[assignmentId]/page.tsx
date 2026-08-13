"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import ProgrammingAssignmentResults from "@/components/teacher/programming/ProgrammingAssignmentResults";
import { useAuth } from "@/contexts/AuthContext";
import { getProgrammingAssignmentResults } from "@/services/programmingAssignmentService";
import type { ProgrammingAssignmentResultsSummary } from "@/types/programmingAssignment";

function formatDate(value: Date | null): string {
  if (!value) return "No due date";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(value);
}

export default function ProgrammingAssignmentResultsPage() {
  const params = useParams<{ assignmentId: string }>();
  const { user } = useAuth();

  const [summary, setSummary] =
    useState<ProgrammingAssignmentResultsSummary | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.uid || !params.assignmentId) {
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const loaded =
          await getProgrammingAssignmentResults(
            params.assignmentId,
          );

        if (cancelled) return;

        if (!loaded) {
          setError(
            "This programming assignment could not be found.",
          );
          return;
        }

        if (loaded.assignment.teacherId !== user?.uid) {
          setError(
            "You cannot view another teacher's programming assignment.",
          );
          return;
        }

        setSummary(loaded);
      } catch (caughtError) {
        if (!cancelled) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Programming results could not be loaded.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [params.assignmentId, user?.uid]);

  if (loading) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-cyan-700" />
      </main>
    );
  }

  if (error || !summary) {
    return (
      <section className="rounded-3xl border border-red-200 bg-red-50 p-8">
        <h1 className="text-2xl font-black text-red-950">
          Results unavailable
        </h1>
        <p className="mt-3 text-red-800">
          {error || "The results could not be loaded."}
        </p>
      </section>
    );
  }

  const { assignment } = summary;

  return (
    <div className="space-y-7">
      <section className="rounded-3xl bg-gradient-to-br from-cyan-800 via-blue-800 to-indigo-800 p-8 text-white shadow-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-100">
              Programming results
            </p>
            <h1 className="mt-2 text-3xl font-black">
              {assignment.title}
            </h1>
            <p className="mt-3 text-cyan-50">
              {assignment.className} · Due{" "}
              {formatDate(assignment.dueDate)}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs font-black">
              {assignment.challengeSnapshot.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-white/15 px-3 py-1"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <Link
            href="/teacher/programming-assignments"
            className="rounded-xl bg-white px-5 py-3 text-center font-black text-blue-800"
          >
            ← Programming assignments
          </Link>
        </div>
      </section>

      <ProgrammingAssignmentResults summary={summary} />
    </div>
  );
}
