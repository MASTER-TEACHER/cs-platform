"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Code2,
  FileText,
  Search,
  Sparkles,
} from "lucide-react";

import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import {
  getUnifiedStudentAssignments,
  isUnifiedAssignmentComplete,
  isUnifiedAssignmentOverdue,
  type UnifiedAssignment,
} from "@/services/unifiedAssignmentService";

type AssignmentFilter =
  | "all"
  | "resources"
  | "quizzes"
  | "exams"
  | "not_started"
  | "in_progress"
  | "submitted"
  | "completed"
  | "overdue";

function formatDate(value: Date | null): string {
  if (!value) return "No due date";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}

function formatResourceType(value: string): string {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getStatusLabel(assignment: UnifiedAssignment): string {
  if (assignment.kind === "exam") {
    switch (assignment.status) {
      case "in_progress":
        return "In progress";
      case "submitted":
        return "Submitted";
      case "marking":
        return "Marking";
      case "marked":
        return "Marked";
      default:
        return "Not started";
    }
  }

  if (assignment.status === "completed") return "Completed";
  if (assignment.status === "in_progress") return "In progress";

  return "Not started";
}

function KindIcon({ kind }: { kind: UnifiedAssignment["kind"] }) {
  if (kind === "quiz") return <Sparkles className="h-3.5 w-3.5" />;
  if (kind === "exam") return <FileText className="h-3.5 w-3.5" />;
  if (kind === "programming") return <Code2 className="h-3.5 w-3.5" />;

  return <BookOpen className="h-3.5 w-3.5" />;
}

function StatusBadge({
  assignment,
  overdue,
}: {
  assignment: UnifiedAssignment;
  overdue: boolean;
}) {
  if (isUnifiedAssignmentComplete(assignment)) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
        <CheckCircle2 className="h-3.5 w-3.5" />
        {assignment.kind === "exam" ? "Marked" : "Completed"}
      </span>
    );
  }

  if (overdue) {
    return (
      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
        Overdue
      </span>
    );
  }

  if (assignment.status === "submitted" || assignment.status === "marking") {
    return (
      <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-700">
        {assignment.status === "marking" ? "Marking" : "Submitted"}
      </span>
    );
  }

  if (assignment.status === "in_progress") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
        <Clock3 className="h-3.5 w-3.5" />
        In progress
      </span>
    );
  }

  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
      Not started
    </span>
  );
}

function matchesFilter(
  assignment: UnifiedAssignment,
  filter: AssignmentFilter,
): boolean {
  if (filter === "all") return true;
  if (filter === "overdue") return isUnifiedAssignmentOverdue(assignment);

  if (filter === "resources") {
    return assignment.kind === "resource" || assignment.kind === "programming";
  }

  if (filter === "quizzes") return assignment.kind === "quiz";
  if (filter === "exams") return assignment.kind === "exam";

  if (filter === "completed") {
    return isUnifiedAssignmentComplete(assignment);
  }

  if (filter === "submitted") {
    return (
      assignment.kind === "exam" &&
      (assignment.status === "submitted" || assignment.status === "marking")
    );
  }

  return assignment.status === filter;
}

function getHref(assignment: UnifiedAssignment): string {
  if (assignment.kind === "quiz") {
    return `/quiz?topic=${encodeURIComponent(
      assignment.resourceId,
    )}&assignment=${encodeURIComponent(assignment.id)}`;
  }

  if (assignment.kind === "exam") {
    return `/assignments/exam/${assignment.id}`;
  }

  if (assignment.kind === "programming") {
    return `/assignments/programming/${assignment.id}`;
  }

  return `/assignments/${assignment.id}`;
}

function getActionLabel(assignment: UnifiedAssignment): string {
  if (assignment.kind === "quiz") {
    return assignment.status === "completed" ? "Review quiz" : "Start quiz";
  }

  if (assignment.kind === "exam") {
    switch (assignment.status) {
      case "marked":
        return "Review feedback";
      case "submitted":
      case "marking":
        return "View submission";
      case "in_progress":
        return "Continue assessment";
      default:
        return "Start assessment";
    }
  }

  if (assignment.kind === "programming") {
    return assignment.status === "completed"
      ? "Review challenge"
      : assignment.status === "in_progress"
        ? "Continue challenge"
        : "Start challenge";
  }

  return assignment.status === "completed"
    ? "Review assignment"
    : assignment.status === "in_progress"
      ? "Continue assignment"
      : "Open assignment";
}

function getTone(kind: UnifiedAssignment["kind"]) {
  if (kind === "quiz") {
    return {
      badge: "bg-violet-100 text-violet-800",
      button: "bg-violet-600 hover:bg-violet-700 focus:ring-violet-500",
    };
  }

  if (kind === "exam") {
    return {
      badge: "bg-amber-100 text-amber-800",
      button: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
    };
  }

  if (kind === "programming") {
    return {
      badge: "bg-blue-100 text-blue-800",
      button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    };
  }

  return {
    badge: "bg-emerald-100 text-emerald-800",
    button: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500",
  };
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-lg font-black text-slate-900">{value}</p>
    </div>
  );
}

export default function StudentAssignmentsPage() {
  const { user, loading: authLoading } = useAuth();

  const [assignments, setAssignments] = useState<UnifiedAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<AssignmentFilter>("all");

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

        const loadedAssignments = await getUnifiedStudentAssignments(user.uid);

        if (!cancelled) {
          setAssignments(loadedAssignments);
        }
      } catch (caughtError) {
        console.error("Failed to load student assignments:", caughtError);

        if (!cancelled) {
          setAssignments([]);
          setError("Your assignments could not be loaded.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user?.uid]);

  const counts = useMemo(
    () => ({
      all: assignments.length,
      resources: assignments.filter(
        (assignment) =>
          assignment.kind === "resource" || assignment.kind === "programming",
      ).length,
      quizzes: assignments.filter((assignment) => assignment.kind === "quiz")
        .length,
      exams: assignments.filter((assignment) => assignment.kind === "exam")
        .length,
      completed: assignments.filter(isUnifiedAssignmentComplete).length,
      not_started: assignments.filter(
        (assignment) => assignment.status === "not_started",
      ).length,
      in_progress: assignments.filter(
        (assignment) => assignment.status === "in_progress",
      ).length,
      submitted: assignments.filter(
        (assignment) =>
          assignment.kind === "exam" &&
          (assignment.status === "submitted" || assignment.status === "marking"),
      ).length,
      overdue: assignments.filter(isUnifiedAssignmentOverdue).length,
    }),
    [assignments],
  );

  const filteredAssignments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return assignments.filter((assignment) => {
      if (!matchesFilter(assignment, filter)) return false;
      if (!term) return true;

      return [
        assignment.title,
        assignment.topic,
        assignment.resourceType,
        assignment.className,
      ].some((value) => value.toLowerCase().includes(term));
    });
  }, [assignments, filter, searchTerm]);

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 rounded-3xl" />
        <div className="grid gap-4 md:grid-cols-4">
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
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-7 text-white shadow-lg">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-white/80">
          Student workspace
        </p>

        <h1 className="mt-2 text-3xl font-black">My Assignments</h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/85">
          Complete resources, quizzes and written assessments, monitor due dates
          and review your results and feedback.
        </p>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="All assignments" value={String(counts.all)} />
        <Metric label="Resources" value={String(counts.resources)} />
        <Metric label="Quizzes" value={String(counts.quizzes)} />
        <Metric label="Written exams" value={String(counts.exams)} />
        <Metric label="Completed" value={String(counts.completed)} />
        <Metric label="Not started" value={String(counts.not_started)} />
        <Metric label="In progress" value={String(counts.in_progress)} />
        <Metric label="Submitted" value={String(counts.submitted)} />
        <Metric label="Overdue" value={String(counts.overdue)} />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search assignments..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                ["all", "All"],
                ["resources", "Resources"],
                ["quizzes", "Quizzes"],
                ["exams", "Exams"],
                ["not_started", "Not started"],
                ["in_progress", "In progress"],
                ["submitted", "Submitted"],
                ["completed", "Completed"],
                ["overdue", "Overdue"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  filter === value
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {filteredAssignments.length === 0 ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
          <h2 className="mt-4 text-xl font-black text-slate-900">
            No assignments found
          </h2>
          <p className="mt-2 text-slate-500">
            There are no assignments matching the current filters.
          </p>
        </section>
      ) : (
        <section className="grid gap-6 xl:grid-cols-2">
          {filteredAssignments.map((assignment) => {
            const overdue = isUnifiedAssignmentOverdue(assignment);
            const tone = getTone(assignment.kind);

            return (
              <article
                key={`${assignment.kind}-${assignment.id}`}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${tone.badge}`}
                      >
                        <KindIcon kind={assignment.kind} />
                        {formatResourceType(assignment.resourceType)}
                      </span>

                      <StatusBadge assignment={assignment} overdue={overdue} />
                    </div>

                    <h2 className="mt-4 text-xl font-black text-slate-950">
                      {assignment.title}
                    </h2>

                    <p className="mt-2 text-sm font-semibold text-slate-500">
                      {assignment.topic}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Due
                    </p>
                    <p className="mt-1 text-sm font-black text-slate-900">
                      {formatDate(assignment.dueDate)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    <p className="font-bold text-slate-900">
                      {assignment.className}
                    </p>
                    <p className="mt-1">{assignment.teacherName}</p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    <p className="font-bold text-slate-900">Status</p>
                    <p className="mt-1">{getStatusLabel(assignment)}</p>
                  </div>
                </div>

                {assignment.description && (
                  <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Teacher instructions
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {assignment.description}
                    </p>
                  </div>
                )}

                {assignment.kind === "exam" && (
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <Metric
                      label="Questions"
                      value={String(assignment.questionCount || 0)}
                    />
                    <Metric
                      label="Total marks"
                      value={String(assignment.totalMarks || 0)}
                    />
                  </div>
                )}

                {assignment.kind === "quiz" &&
                  assignment.status === "completed" && (
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <Metric
                        label="Score"
                        value={`${assignment.score || 0}/${assignment.totalQuestions || 0}`}
                      />
                      <Metric
                        label="Percentage"
                        value={`${assignment.percentage || 0}%`}
                      />
                      <Metric
                        label="XP"
                        value={String(assignment.earnedXP || 0)}
                      />
                      <Metric
                        label="Completed"
                        value={formatDate(assignment.completedAt)}
                      />
                    </div>
                  )}

                {assignment.kind === "exam" &&
                  assignment.status === "marked" && (
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      <Metric
                        label="Score"
                        value={`${assignment.score || 0}/${assignment.totalMarks || 0}`}
                      />
                      <Metric
                        label="Percentage"
                        value={`${assignment.percentage || 0}%`}
                      />
                      <Metric
                        label="Marked"
                        value={formatDate(assignment.markedAt)}
                      />
                    </div>
                  )}

                <div className="mt-6 flex justify-end">
                  <Link
                    href={getHref(assignment)}
                    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition focus:ring-2 focus:ring-offset-2 ${tone.button}`}
                  >
                    {getActionLabel(assignment)}
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
