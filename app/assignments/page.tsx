"use client";

import {
  AlertCircle,
  BookOpen,
  Brain,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  FilePenLine,
  Loader2,
  School,
  Search,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import {
  getUnifiedStudentAssignments,
  isUnifiedAssignmentComplete,
  isUnifiedAssignmentOverdue,
  type UnifiedAssignment,
} from "@/services/unifiedAssignmentService";

type AssignmentFilter =
  | "all"
  | "not_started"
  | "in_progress"
  | "submitted"
  | "completed"
  | "overdue"
  | "resources"
  | "quizzes"
  | "exams";

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
        return "Being marked";
      case "marked":
        return "Marked";
      default:
        return "Not started";
    }
  }

  switch (assignment.status) {
    case "in_progress":
      return "In progress";
    case "completed":
      return "Completed";
    default:
      return "Not started";
  }
}

function StatusBadge({
  assignment,
  overdue,
}: {
  assignment: UnifiedAssignment;
  overdue: boolean;
}) {
  if (overdue) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
        <AlertCircle className="h-3.5 w-3.5" />
        Overdue
      </span>
    );
  }

  if (assignment.status === "marked" || assignment.status === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
        <CheckCircle2 className="h-3.5 w-3.5" />
        {assignment.kind === "exam" ? "Marked" : "Completed"}
      </span>
    );
  }

  if (assignment.status === "submitted" || assignment.status === "marking") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-700">
        <Clock3 className="h-3.5 w-3.5" />
        {assignment.status === "marking" ? "Being marked" : "Submitted"}
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
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
      <Circle className="h-3.5 w-3.5" />
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
  if (filter === "resources") return assignment.kind === "resource";
  if (filter === "quizzes") return assignment.kind === "quiz";
  if (filter === "exams") return assignment.kind === "exam";
  if (filter === "completed") return isUnifiedAssignmentComplete(assignment);
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
  if (assignment.status === "completed") {
    return "Review challenge";
  }

  if (assignment.status === "in_progress") {
    return "Continue challenge";
  }

  return "Start challenge";
}

  if (assignment.status === "completed") return "Review assignment";
  if (assignment.status === "in_progress") return "Continue assignment";
  return "Open assignment";
}

function getTone(kind: UnifiedAssignment["kind"]) {
  if (kind === "quiz") {
    return {
      badge: "bg-violet-100 text-violet-700",
      topic: "text-violet-700",
      button: "bg-violet-600 hover:bg-violet-700 focus:ring-violet-500",
    };
  }

  if (kind === "exam") {
    return {
      badge: "bg-amber-100 text-amber-800",
      topic: "text-amber-700",
      button: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
    };
  }

  return {
    badge: "bg-blue-50 text-blue-700",
    topic: "text-blue-700",
    button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
  };
}

function KindIcon({ kind }: { kind: UnifiedAssignment["kind"] }) {
  if (kind === "quiz") return <Brain className="h-3.5 w-3.5" />;
  if (kind === "exam") return <FilePenLine className="h-3.5 w-3.5" />;
  return <BookOpen className="h-3.5 w-3.5" />;
}

export default function StudentAssignmentsPage() {
  const { user } = useAuth();

  const [assignments, setAssignments] = useState<UnifiedAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<AssignmentFilter>("all");

  const loadAssignments = useCallback(async () => {
    if (!user?.uid) {
      setAssignments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setAssignments(await getUnifiedStudentAssignments(user.uid));
    } catch (loadError) {
      console.error("Unable to load student assignments:", loadError);
      setAssignments([]);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Your assignments could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    void loadAssignments();
  }, [loadAssignments]);

  const filteredAssignments = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return assignments.filter((assignment) => {
      const matchesSearch =
        !search ||
        assignment.title.toLowerCase().includes(search) ||
        assignment.topic.toLowerCase().includes(search) ||
        assignment.className.toLowerCase().includes(search) ||
        assignment.teacherName.toLowerCase().includes(search) ||
        assignment.resourceType.toLowerCase().includes(search);

      return matchesFilter(assignment, filter) && matchesSearch;
    });
  }, [assignments, filter, searchTerm]);

  const summary = useMemo(
    () => ({
      total: assignments.length,
      resources: assignments.filter((item) => item.kind === "resource").length,
      quizzes: assignments.filter((item) => item.kind === "quiz").length,
      exams: assignments.filter((item) => item.kind === "exam").length,
      notStarted: assignments.filter((item) => item.status === "not_started")
        .length,
      inProgress: assignments.filter((item) => item.status === "in_progress")
        .length,
      submitted: assignments.filter(
        (item) =>
          item.kind === "exam" &&
          (item.status === "submitted" || item.status === "marking"),
      ).length,
      completed: assignments.filter(isUnifiedAssignmentComplete).length,
      overdue: assignments.filter(isUnifiedAssignmentOverdue).length,
    }),
    [assignments],
  );

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-6 py-10">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />
          <p className="mt-4 font-semibold text-slate-600">
            Loading your assignments...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 p-7 text-white shadow-xl sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-100">
          Student workspace
        </p>
        <h1 className="mt-3 text-3xl font-black sm:text-4xl">My Assignments</h1>
        <p className="mt-3 max-w-2xl text-blue-100">
          Complete resources, quizzes and written assessments, monitor due dates
          and review your results and feedback.
        </p>
      </section>

      {error && (
        <section className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-bold">Assignments could not be loaded</p>
            <p className="mt-1 text-sm">{error}</p>
            <button
              type="button"
              onClick={() => void loadAssignments()}
              className="mt-3 text-sm font-bold underline"
            >
              Try again
            </button>
          </div>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="All assignments" value={summary.total} />
        <SummaryCard label="Resources" value={summary.resources} />
        <SummaryCard label="Quizzes" value={summary.quizzes} />
        <SummaryCard label="Written exams" value={summary.exams} />
        <SummaryCard label="Completed" value={summary.completed} />
        <SummaryCard label="Not started" value={summary.notStarted} />
        <SummaryCard label="In progress" value={summary.inProgress} />
        <SummaryCard label="Submitted" value={summary.submitted} />
        <SummaryCard label="Overdue" value={summary.overdue} />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search assignments..."
              className="min-h-12 w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 text-sm font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
              ] as Array<[AssignmentFilter, string]>
            ).map(([value, label]) => (
              <FilterButton
                key={value}
                label={label}
                active={filter === value}
                onClick={() => setFilter(value)}
              />
            ))}
          </div>
        </div>
      </section>

      {filteredAssignments.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="mt-4 text-xl font-black text-slate-900">
            No assignments found
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            {assignments.length === 0
              ? "Your teachers have not assigned any resources, quizzes or written exams to you yet."
              : "No assignments match your current search or filter."}
          </p>
        </section>
      ) : (
        <section className="grid gap-5 xl:grid-cols-2">
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
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${tone.badge}`}
                      >
                        <KindIcon kind={assignment.kind} />
                        {formatResourceType(assignment.resourceType)}
                      </span>
                      <StatusBadge assignment={assignment} overdue={overdue} />
                    </div>
                    <h2 className="mt-4 text-xl font-black text-slate-900">
                      {assignment.title}
                    </h2>
                    <p className={`mt-2 text-sm font-semibold ${tone.topic}`}>
                      {assignment.topic}
                    </p>
                  </div>

                  <div className="shrink-0 rounded-2xl bg-slate-50 px-4 py-3 text-center">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Due
                    </p>
                    <p
                      className={`mt-1 text-sm font-black ${overdue ? "text-red-600" : "text-slate-800"}`}
                    >
                      {formatDate(assignment.dueDate)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <p className="flex items-center gap-2">
                    <School className="h-4 w-4 text-slate-400" />
                    {assignment.className}
                  </p>
                  <p className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-slate-400" />
                    {assignment.teacherName}
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-slate-400" />
                    Assigned {formatDate(assignment.createdAt)}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-slate-400" />
                    {getStatusLabel(assignment)}
                  </p>
                </div>

                {assignment.kind === "exam" && (
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <Metric
                      label="Questions"
                      value={String(assignment.questionCount || 0)}
                      tone="amber"
                    />
                    <Metric
                      label="Total marks"
                      value={String(assignment.totalMarks || 0)}
                      tone="amber"
                    />
                  </div>
                )}

                {assignment.description && (
                  <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Teacher instructions
                    </p>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                      {assignment.description}
                    </p>
                  </div>
                )}

                {assignment.kind === "quiz" &&
                  assignment.status === "completed" && (
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <Metric
                        label="Score"
                        value={`${assignment.score}/${assignment.totalQuestions}`}
                        tone="violet"
                      />
                      <Metric
                        label="Percentage"
                        value={`${assignment.percentage}%`}
                        tone="violet"
                      />
                      <Metric
                        label="XP"
                        value={`${assignment.earnedXP}`}
                        tone="violet"
                      />
                      <Metric
                        label="Completed"
                        value={formatDate(assignment.completedAt)}
                        tone="violet"
                      />
                    </div>
                  )}

                {assignment.kind === "exam" &&
                  assignment.status === "marked" && (
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      <Metric
                        label="Score"
                        value={`${assignment.score}/${assignment.totalMarks}`}
                        tone="emerald"
                      />
                      <Metric
                        label="Percentage"
                        value={`${assignment.percentage}%`}
                        tone="emerald"
                      />
                      <Metric
                        label="Marked"
                        value={formatDate(assignment.markedAt)}
                        tone="emerald"
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
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
        active
          ? "bg-blue-600 text-white shadow-sm"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {label}
    </button>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "violet" | "amber" | "emerald";
}) {
  const classes = {
    violet: "border-violet-100 bg-violet-50 text-violet-900",
    amber: "border-amber-100 bg-amber-50 text-amber-900",
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-900",
  };

  return (
    <div className={`rounded-2xl border p-3 ${classes[tone]}`}>
      <p className="text-xs font-bold uppercase tracking-wide opacity-70">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-black">{value}</p>
    </div>
  );
}
