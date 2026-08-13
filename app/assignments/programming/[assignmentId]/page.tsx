"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Loader2,
} from "lucide-react";

import ProgrammingWorkspace from "@/components/programming/ProgrammingWorkspace";
import { useAuth } from "@/contexts/AuthContext";
import {
  getProgrammingAssignmentById,
  getProgrammingSubmission,
} from "@/services/programmingAssignmentService";
import { startStudentAssignment } from "@/services/resourceAssignmentService";
import type {
  ProgrammingAssignment,
  ProgrammingSubmission,
} from "@/types/programmingAssignment";

function formatDate(value: Date | null): string {
  if (!value) return "No due date";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(value);
}

export default function ProgrammingAssignmentPage() {
  const params = useParams<{ assignmentId: string }>();
  const { user } = useAuth();

  const assignmentId = params.assignmentId;

  const [assignment, setAssignment] =
    useState<ProgrammingAssignment | null>(null);

  const [submission, setSubmission] =
    useState<ProgrammingSubmission | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const studentId = user?.uid;
    const currentAssignmentId = assignmentId;

    if (!studentId || !currentAssignmentId) {
      return;
    }

    let cancelled = false;

    async function loadAssignment(
      safeStudentId: string,
      safeAssignmentId: string,
    ) {
      try {
        setLoading(true);
        setError("");

        const loaded =
          await getProgrammingAssignmentById(
            safeAssignmentId,
          );

        if (cancelled) return;

        if (!loaded) {
          setError(
            "This programming assignment could not be found.",
          );
          return;
        }

        if (
          !loaded.studentIds.includes(
            safeStudentId,
          )
        ) {
          setError(
            "You are not enrolled in this programming assignment.",
          );
          return;
        }

        setAssignment(loaded);

        await startStudentAssignment(
          loaded.id,
          safeStudentId,
        );

        const loadedSubmission =
          await getProgrammingSubmission(
            loaded.id,
            safeStudentId,
          );

        if (!cancelled) {
          setSubmission(
            loadedSubmission,
          );
        }
      } catch (caughtError) {
        if (!cancelled) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "The programming assignment could not be loaded.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadAssignment(
      studentId,
      currentAssignmentId,
    );

    return () => {
      cancelled = true;
    };
  }, [assignmentId, user?.uid]);

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-cyan-700" />

          <p className="mt-4 font-bold text-slate-600">
            Loading programming assignment...
          </p>
        </div>
      </main>
    );
  }

  if (error || !assignment) {
    return (
      <main className="mx-auto max-w-3xl py-10">
        <section className="rounded-3xl border border-red-200 bg-red-50 p-8">
          <h1 className="text-2xl font-black text-red-950">
            Programming assignment unavailable
          </h1>

          <p className="mt-3 text-red-800">
            {error ||
              "The assignment could not be loaded."}
          </p>

          <Link
            href="/assignments"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-700 px-5 py-3 font-bold text-white transition hover:bg-red-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to assignments
          </Link>
        </section>
      </main>
    );
  }

  const completed =
    submission?.status === "completed";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/assignments"
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to assignments
        </Link>

        <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
          {completed ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Assignment completed
            </>
          ) : (
            <>
              <Clock3 className="h-4 w-4 text-amber-600" />
              Passing all tests completes this assignment automatically
            </>
          )}
        </div>
      </div>

      <section className="rounded-3xl bg-gradient-to-br from-cyan-800 via-blue-800 to-indigo-800 p-7 text-white shadow-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-100">
              Programming assignment
            </p>

            <h1 className="mt-2 text-3xl font-black">
              {assignment.title}
            </h1>

            <p className="mt-3 max-w-3xl text-cyan-50">
              {assignment.instructions}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 px-5 py-4">
            <p className="text-xs font-black uppercase tracking-wide text-cyan-100">
              Due
            </p>

            <p className="mt-1 font-black">
              {formatDate(
                assignment.dueDate,
              )}
            </p>

            {completed && (
              <p className="mt-2 inline-flex items-center gap-2 text-sm font-black text-emerald-200">
                <CheckCircle2 className="h-4 w-4" />
                Completed
              </p>
            )}
          </div>
        </div>
      </section>

      {completed && (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                <CheckCircle2 className="h-6 w-6" />
              </div>

              <div>
                <p className="text-sm font-black uppercase tracking-wide text-emerald-700">
                  Assignment completed
                </p>

                <h2 className="mt-1 text-xl font-black text-emerald-950">
                  All programming tests passed
                </h2>

                <p className="mt-2 text-sm leading-6 text-emerald-800">
                  Your result has been saved and your teacher can now view your programming performance.
                </p>
              </div>
            </div>

            <Link
              href="/assignments"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-700 px-5 py-3 font-black text-white transition hover:bg-emerald-800"
            >
              Return to assignments
            </Link>
          </div>
        </section>
      )}

      {!completed && (
        <section className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4">
          <p className="font-black text-blue-950">
            Complete this challenge by passing all visible and hidden tests.
          </p>

          <p className="mt-1 text-sm leading-6 text-blue-800">
            You do not need to mark the assignment complete manually. CS Master will complete it automatically when all tests pass.
          </p>
        </section>
      )}

      <ProgrammingWorkspace
        assignedChallengeId={
          assignment.challengeId
        }
        assignmentId={assignment.id}
        assignmentTitle={
          assignment.title
        }
      />
    </div>
  );
}