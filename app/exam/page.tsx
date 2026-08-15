"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileCheck2,
  FileText,
  ShieldCheck,
} from "lucide-react";

import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import {
  getUnifiedStudentAssignments,
  type UnifiedAssignment,
} from "@/services/unifiedAssignmentService";

type ExamFilter =
  | "all"
  | "not_started"
  | "in_progress"
  | "submitted"
  | "marked";

function formatDate(value: Date | null): string {
  if (!value) return "No due date";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}

function getExamStatus(
  assignment: UnifiedAssignment,
): "not_started" | "in_progress" | "submitted" | "marked" {
  if (assignment.status === "marked") {
    return "marked";
  }

  if (
    assignment.status === "submitted" ||
    assignment.status === "marking"
  ) {
    return "submitted";
  }

  if (assignment.status === "in_progress") {
    return "in_progress";
  }

  return "not_started";
}

function statusLabel(
  assignment: UnifiedAssignment,
): string {
  switch (getExamStatus(assignment)) {
    case "marked":
      return "Marked";
    case "submitted":
      return assignment.status === "marking"
        ? "Marking"
        : "Submitted";
    case "in_progress":
      return "In progress";
    default:
      return "Not started";
  }
}

function actionLabel(
  assignment: UnifiedAssignment,
): string {
  switch (getExamStatus(assignment)) {
    case "marked":
      return "Review result";
    case "submitted":
      return "Review submission";
    case "in_progress":
      return "Resume Exam Mode";
    default:
      return "Enter Exam Mode";
  }
}

function StatusBadge({
  assignment,
}: {
  assignment: UnifiedAssignment;
}) {
  const status = getExamStatus(assignment);

  if (status === "marked") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Marked
      </span>
    );
  }

  if (status === "submitted") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700">
        <FileCheck2 className="h-3.5 w-3.5" />
        {assignment.status === "marking"
          ? "Marking"
          : "Submitted"}
      </span>
    );
  }

  if (status === "in_progress") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700">
        <Clock3 className="h-3.5 w-3.5" />
        In progress
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
      <FileText className="h-3.5 w-3.5" />
      Not started
    </span>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}

export default function StudentExamModePage() {
  const { user, profile, loading: authLoading } = useAuth();

  const [assignments, setAssignments] =
    useState<UnifiedAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] =
    useState<ExamFilter>("all");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (authLoading) return;

      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const allAssignments =
          await getUnifiedStudentAssignments(
            user.uid,
          );

        if (!cancelled) {
          setAssignments(
            allAssignments.filter(
              (assignment) =>
                assignment.kind === "exam",
            ),
          );
        }
      } catch (caughtError) {
        console.error(
          "Unable to load written exams:",
          caughtError,
        );

        if (!cancelled) {
          setAssignments([]);
          setError(
            "Your written exams could not be loaded.",
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
  }, [authLoading, user?.uid]);

  const counts = useMemo(() => {
    const statuses = assignments.map(
      getExamStatus,
    );

    return {
      all: assignments.length,
      not_started: statuses.filter(
        (status) => status === "not_started",
      ).length,
      in_progress: statuses.filter(
        (status) => status === "in_progress",
      ).length,
      submitted: statuses.filter(
        (status) => status === "submitted",
      ).length,
      marked: statuses.filter(
        (status) => status === "marked",
      ).length,
    };
  }, [assignments]);

  const filtered = useMemo(() => {
    if (filter === "all") {
      return assignments;
    }

    return assignments.filter(
      (assignment) =>
        getExamStatus(assignment) === filter,
    );
  }, [assignments, filter]);

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-52 rounded-3xl" />

        <div className="grid gap-4 md:grid-cols-5">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>

        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-violet-900 text-white shadow-xl">
        <div className="p-7 md:p-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-violet-200">
                <ShieldCheck className="h-5 w-5" />

                <p className="text-xs font-black uppercase tracking-[0.18em]">
                  Student written assessments
                </p>
              </div>

              <h1 className="mt-3 text-4xl font-black">
                Exam Mode
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/75">
                All teacher-assigned written exams are managed here. Live papers use the monitored fullscreen Exam Mode workflow.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-xs font-black uppercase tracking-wide text-violet-200">
                Curriculum
              </p>

              <p className="mt-1 font-black">
                {profile?.examBoard || "Exam board"} ·{" "}
                {profile?.qualification === "A_LEVEL"
                  ? "A-level"
                  : "GCSE"}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-white/5 px-7 py-5 md:px-9">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />

            <p className="text-sm leading-6 text-white/75">
              CS Master records fullscreen and page-visibility events for teacher review when integrity monitoring is enabled. This is integrity monitoring, not a guaranteed lockdown browser.
            </p>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric
          label="All written exams"
          value={counts.all}
        />
        <Metric
          label="Not started"
          value={counts.not_started}
        />
        <Metric
          label="In progress"
          value={counts.in_progress}
        />
        <Metric
          label="Submitted"
          value={counts.submitted}
        />
        <Metric
          label="Marked"
          value={counts.marked}
        />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "All"],
              ["not_started", "Not started"],
              ["in_progress", "In progress"],
              ["submitted", "Submitted"],
              ["marked", "Marked"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-full px-4 py-2 text-sm font-black transition ${
                filter === value
                  ? "bg-indigo-700 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {filtered.length === 0 ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <ShieldCheck className="mx-auto h-12 w-12 text-slate-300" />

          <h2 className="mt-4 text-2xl font-black text-slate-950">
            No written exams found
          </h2>

          <p className="mt-2 text-slate-500">
            There are no written exams in this category.
          </p>

          <Link
            href="/assignments"
            className="mt-6 inline-flex rounded-xl bg-indigo-700 px-5 py-3 font-black text-white"
          >
            View all assignments
          </Link>
        </section>
      ) : (
        <section className="grid gap-6 xl:grid-cols-2">
          {filtered.map((assignment) => {
            const status =
              getExamStatus(assignment);

            return (
              <article
                key={assignment.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-violet-700">
                        Written exam
                      </span>

                      <StatusBadge
                        assignment={assignment}
                      />
                    </div>

                    <h2 className="mt-4 text-2xl font-black text-slate-950">
                      {assignment.title}
                    </h2>

                    <p className="mt-2 text-sm font-bold text-slate-500">
                      {assignment.topic}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      Due
                    </p>

                    <p className="mt-1 text-sm font-black text-slate-900">
                      {formatDate(
                        assignment.dueDate,
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      Class
                    </p>

                    <p className="mt-1 font-black text-slate-950">
                      {assignment.className}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {assignment.teacherName}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      Status
                    </p>

                    <p className="mt-1 font-black text-slate-950">
                      {statusLabel(
                        assignment,
                      )}
                    </p>
                  </div>
                </div>

                {assignment.description && (
                  <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      Teacher instructions
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {assignment.description}
                    </p>
                  </div>
                )}

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      Questions
                    </p>

                    <p className="mt-1 text-2xl font-black text-slate-950">
                      {assignment.questionCount ||
                        0}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      Total marks
                    </p>

                    <p className="mt-1 text-2xl font-black text-slate-950">
                      {assignment.totalMarks ||
                        0}
                    </p>
                  </div>
                </div>

                {status === "marked" && (
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-emerald-50 p-4">
                      <p className="text-xs font-black uppercase tracking-wide text-emerald-700">
                        Score
                      </p>

                      <p className="mt-1 text-xl font-black text-emerald-950">
                        {assignment.score || 0}/
                        {assignment.totalMarks ||
                          0}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-emerald-50 p-4">
                      <p className="text-xs font-black uppercase tracking-wide text-emerald-700">
                        Percentage
                      </p>

                      <p className="mt-1 text-xl font-black text-emerald-950">
                        {assignment.percentage ||
                          0}
                        %
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <Link
                    href={`/assignments/exam/${assignment.id}`}
                    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-white transition ${
                      status === "marked"
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : status === "submitted"
                          ? "bg-cyan-600 hover:bg-cyan-700"
                          : "bg-indigo-700 hover:bg-indigo-800"
                    }`}
                  >
                    {actionLabel(
                      assignment,
                    )}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
