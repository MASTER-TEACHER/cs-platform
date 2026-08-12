"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Loader2,
  Search,
  Users,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import {
  getTeacherAssignments,
  ResourceAssignment,
} from "@/services/resourceAssignmentService";

function formatDate(value: Date | null): string {
  if (!value) {
    return "No due date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(value);
}

function formatResourceType(value: string): string {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getCompletionPercentage(assignment: ResourceAssignment): number {
  if (assignment.studentCount === 0) {
    return 0;
  }

  return Math.round(
    (assignment.completedCount / assignment.studentCount) * 100,
  );
}

function getDueStatus(dueDate: Date | null): {
  label: string;
  overdue: boolean;
} {
  if (!dueDate) {
    return {
      label: "No due date",
      overdue: false,
    };
  }

  const today = new Date();
  const due = new Date(dueDate);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const differenceInDays = Math.ceil(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (differenceInDays < 0) {
    const overdueDays = Math.abs(differenceInDays);

    return {
      label: `${overdueDays} ${overdueDays === 1 ? "day" : "days"} overdue`,
      overdue: true,
    };
  }

  if (differenceInDays === 0) {
    return {
      label: "Due today",
      overdue: false,
    };
  }

  if (differenceInDays === 1) {
    return {
      label: "Due tomorrow",
      overdue: false,
    };
  }

  return {
    label: `${differenceInDays} days remaining`,
    overdue: false,
  };
}

export default function TeacherAssignmentsPage() {
  const { user } = useAuth();

  const [assignments, setAssignments] = useState<ResourceAssignment[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadAssignments = useCallback(async () => {
    if (!user?.uid) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const loadedAssignments = await getTeacherAssignments(user.uid);

      setAssignments(loadedAssignments);
    } catch (caughtError) {
      console.error("Failed to load teacher assignments:", caughtError);

      setAssignments([]);

      setError(
        caughtError instanceof Error
          ? caughtError.message
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

    if (!search) {
      return assignments;
    }

    return assignments.filter((assignment) => {
      return (
        assignment.resourceTitle.toLowerCase().includes(search) ||
        assignment.resourceTopic.toLowerCase().includes(search) ||
        assignment.className.toLowerCase().includes(search)
      );
    });
  }, [assignments, searchTerm]);

  const totalStudents = useMemo(
    () =>
      assignments.reduce(
        (total, assignment) => total + assignment.studentCount,
        0,
      ),
    [assignments],
  );

  const totalCompleted = useMemo(
    () =>
      assignments.reduce(
        (total, assignment) => total + assignment.completedCount,
        0,
      ),
    [assignments],
  );

  const activeAssignments = useMemo(
    () =>
      assignments.filter((assignment) => assignment.status === "active").length,
    [assignments],
  );

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-56 w-full rounded-3xl" />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-28 rounded-3xl" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-3xl" />
          <Skeleton className="h-72 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-700 p-7 text-white shadow-xl sm:p-9">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-100">
              Teacher assignments
            </p>

            <h1 className="mt-3 text-3xl font-black sm:text-4xl">
              Assignment tracking
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-100">
              Review resource assignments, monitor completion and identify
              students who may need support.
            </p>
          </div>

          <Link
            href="/teacher/resources"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-teal-700 transition hover:bg-emerald-50"
          >
            <BookOpen className="h-4 w-4" />
            Resource library
          </Link>
        </div>
      </section>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          label="Assignments"
          value={assignments.length}
          description="All resource assignments"
          icon={<FileText className="h-6 w-6" />}
          iconClassName="bg-blue-50 text-blue-600"
        />

        <SummaryCard
          label="Active"
          value={activeAssignments}
          description="Currently available"
          icon={<Clock3 className="h-6 w-6" />}
          iconClassName="bg-amber-50 text-amber-600"
        />

        <SummaryCard
          label="Completed"
          value={`${totalCompleted}/${totalStudents}`}
          description="Student completions"
          icon={<CheckCircle2 className="h-6 w-6" />}
          iconClassName="bg-emerald-50 text-emerald-600"
        />
      </div>

      <Card className="rounded-3xl border border-slate-200 p-6 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-600">
              Resource assignments
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Your assignments
            </h2>
          </div>

          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search assignments..."
              className="min-h-11 w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100 sm:w-72"
            />
          </label>
        </div>

        {error ? (
          <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <div>
                <p className="font-bold text-red-950">
                  Assignments unavailable
                </p>

                <p className="mt-1 text-sm text-red-700">{error}</p>

                <button
                  type="button"
                  onClick={() => {
                    void loadAssignments();
                  }}
                  className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white"
                >
                  <Loader2 className="h-4 w-4" />
                  Try again
                </button>
              </div>
            </div>
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-slate-50 p-10 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-slate-400" />

            <h3 className="mt-4 text-xl font-black text-slate-950">
              No assignments found
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
              Create and assign a published teaching resource to begin tracking
              student completion.
            </p>

            <Link
              href="/teacher/resources"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
            >
              Open resource library
            </Link>
          </div>
        ) : (
          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            {filteredAssignments.map((assignment) => {
              const completionPercentage = getCompletionPercentage(assignment);

              const dueStatus = getDueStatus(assignment.dueDate);

              return (
                <article
                  key={assignment.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                          {formatResourceType(assignment.resourceType)}
                        </span>

                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                          {assignment.className}
                        </span>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize text-slate-600">
                          {assignment.status}
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-black text-slate-950">
                        {assignment.resourceTitle}
                      </h3>

                      <p className="mt-2 text-sm font-semibold text-teal-700">
                        {assignment.resourceTopic}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                      <BookOpen className="h-5 w-5" />
                    </div>
                  </div>

                  {assignment.instructions && (
                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
                      {assignment.instructions}
                    </p>
                  )}

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Students
                      </p>

                      <p className="mt-2 flex items-center gap-2 font-bold text-slate-800">
                        <Users className="h-4 w-4 text-blue-600" />
                        {assignment.studentCount}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Due date
                      </p>

                      <p className="mt-2 flex items-center gap-2 font-bold text-slate-800">
                        <CalendarDays className="h-4 w-4 text-teal-600" />
                        {formatDate(assignment.dueDate)}
                      </p>

                      <p
                        className={`mt-1 text-xs font-semibold ${
                          dueStatus.overdue ? "text-red-600" : "text-slate-500"
                        }`}
                      >
                        {dueStatus.label}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-slate-700">
                        Completion
                      </span>

                      <span className="font-black text-teal-700">
                        {completionPercentage}%
                      </span>
                    </div>

                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all"
                        style={{
                          width: `${completionPercentage}%`,
                        }}
                      />
                    </div>

                    <p className="mt-2 text-xs font-semibold text-slate-500">
                      {assignment.completedCount} of {assignment.studentCount}{" "}
                      completed
                    </p>
                  </div>

                  <div className="mt-6">
                    <Link
                      href={`/teacher/assignments/${assignment.id}`}
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
                    >
                      <Eye className="h-4 w-4" />
                      View progress
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  description,
  icon,
  iconClassName,
}: {
  label: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  iconClassName: string;
}) {
  return (
    <Card className="rounded-3xl border border-slate-200 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>

          <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>

          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClassName}`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
