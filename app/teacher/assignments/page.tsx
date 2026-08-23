"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import {
  AlertCircle,
  ArrowUpDown,
  BookOpen,
  Brain,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Code2,
  FilePenLine,
  FileText,
  Filter,
  Loader2,
  RotateCcw,
  Search,
  Users,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";

import {
  getUnifiedTeacherAssignments,
  isUnifiedTeacherAssignmentOverdue,
  updateUnifiedTeacherAssignmentStatus,
  type UnifiedTeacherAssignment,
  type UnifiedTeacherAssignmentKind,
  type UnifiedTeacherAssignmentStatus,
  type UnifiedTeacherAssignmentSummary,
} from "@/services/unifiedTeacherAssignmentService";

type TypeFilter =
  | "all"
  | UnifiedTeacherAssignmentKind;

type StatusFilter =
  | "all"
  | UnifiedTeacherAssignmentStatus
  | "overdue";

type SortOption =
  | "newest"
  | "due-soon"
  | "completion-high"
  | "completion-low";

const emptySummary:
  UnifiedTeacherAssignmentSummary = {
  assignments: [],
  totalAssignments: 0,
  activeAssignments: 0,
  overdueAssignments: 0,
  completedStudentCount: 0,
  totalStudentCount: 0,
  awaitingMarkingCount: 0,
};

function formatDate(
  value: Date | null,
): string {
  if (!value) {
    return "No due date";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(value);
}

function dueLabel(
  assignment:
    UnifiedTeacherAssignment,
): string {
  if (!assignment.dueDate) {
    return assignment.status ===
      "active"
      ? "No deadline"
      : "No deadline was set";
  }

  if (
    assignment.status ===
    "closed"
  ) {
    return `Closed · due date was ${formatDate(
      assignment.dueDate,
    )}`;
  }

  if (
    assignment.status ===
    "cancelled"
  ) {
    return `Cancelled · due date was ${formatDate(
      assignment.dueDate,
    )}`;
  }

  if (
    isUnifiedTeacherAssignmentOverdue(
      assignment,
    )
  ) {
    return "Overdue";
  }

  const today = new Date();
  const due =
    new Date(
      assignment.dueDate,
    );

  today.setHours(
    0,
    0,
    0,
    0,
  );

  due.setHours(
    0,
    0,
    0,
    0,
  );

  const difference =
    Math.ceil(
      (due.getTime() -
        today.getTime()) /
        (1000 *
          60 *
          60 *
          24),
    );

  if (difference === 0) {
    return "Due today";
  }

  if (difference === 1) {
    return "Due tomorrow";
  }

  return `${difference} days remaining`;
}

function kindLabel(
  kind:
    UnifiedTeacherAssignmentKind,
): string {
  switch (kind) {
    case "programming":
      return "Programming";

    case "quiz":
      return "Quiz";

    case "exam":
      return "Written exam";

    default:
      return "Lesson / resource";
  }
}

function kindTone(
  kind:
    UnifiedTeacherAssignmentKind,
): string {
  switch (kind) {
    case "programming":
      return "bg-cyan-100 text-cyan-800";

    case "quiz":
      return "bg-violet-100 text-violet-800";

    case "exam":
      return "bg-amber-100 text-amber-800";

    default:
      return "bg-teal-100 text-teal-800";
  }
}

function kindIcon(
  kind:
    UnifiedTeacherAssignmentKind,
): ReactNode {
  switch (kind) {
    case "programming":
      return (
        <Code2 className="h-4 w-4" />
      );

    case "quiz":
      return (
        <Brain className="h-4 w-4" />
      );

    case "exam":
      return (
        <FilePenLine className="h-4 w-4" />
      );

    default:
      return (
        <BookOpen className="h-4 w-4" />
      );
  }
}

function statusLabel(
  status:
    UnifiedTeacherAssignmentStatus,
): string {
  if (status === "closed") {
    return "Closed";
  }

  if (
    status === "cancelled"
  ) {
    return "Cancelled";
  }

  return "Active";
}

function statusTone(
  status:
    UnifiedTeacherAssignmentStatus,
): string {
  if (status === "closed") {
    return "bg-slate-100 text-slate-700";
  }

  if (
    status === "cancelled"
  ) {
    return "bg-red-50 text-red-700";
  }

  return "bg-emerald-50 text-emerald-700";
}

function sortAssignments(
  assignments:
    UnifiedTeacherAssignment[],
  sort:
    SortOption,
): UnifiedTeacherAssignment[] {
  const copied =
    [...assignments];

  if (
    sort ===
    "completion-high"
  ) {
    return copied.sort(
      (
        first,
        second,
      ) =>
        second.completionPercentage -
        first.completionPercentage,
    );
  }

  if (
    sort ===
    "completion-low"
  ) {
    return copied.sort(
      (
        first,
        second,
      ) =>
        first.completionPercentage -
        second.completionPercentage,
    );
  }

  if (
    sort ===
    "due-soon"
  ) {
    return copied.sort(
      (
        first,
        second,
      ) => {
        if (
          !first.dueDate &&
          !second.dueDate
        ) {
          return 0;
        }

        if (!first.dueDate) {
          return 1;
        }

        if (!second.dueDate) {
          return -1;
        }

        return (
          first.dueDate.getTime() -
          second.dueDate.getTime()
        );
      },
    );
  }

  return copied.sort(
    (
      first,
      second,
    ) =>
      (second.createdAt?.getTime() ??
        0) -
      (first.createdAt?.getTime() ??
        0),
  );
}

export default function TeacherAssignmentsPage() {
  const {
    user,
    profile,
    loading:
      authLoading,
    profileReady,
  } = useAuth();

  const [
    summary,
    setSummary,
  ] =
    useState<UnifiedTeacherAssignmentSummary>(
      emptySummary,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    typeFilter,
    setTypeFilter,
  ] =
    useState<TypeFilter>(
      "all",
    );

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<StatusFilter>(
      "all",
    );

  const [
    classFilter,
    setClassFilter,
  ] = useState("all");

  const [
    sortOption,
    setSortOption,
  ] =
    useState<SortOption>(
      "newest",
    );

  const [
    updatingKey,
    setUpdatingKey,
  ] = useState("");

  const loadAssignments =
    useCallback(
      async () => {
        if (!user?.uid) {
          setSummary(
            emptySummary,
          );
          setLoading(false);
          return;
        }

        try {
          setLoading(true);
          setError("");

          setSummary(
            await getUnifiedTeacherAssignments(
              user.uid,
            ),
          );
        } catch (
          caughtError
        ) {
          console.error(
            "Unable to load unified teacher assignments:",
            caughtError,
          );

          setSummary(
            emptySummary,
          );

          setError(
            caughtError instanceof
              Error
              ? caughtError.message
              : "Your assignments could not be loaded.",
          );
        } finally {
          setLoading(false);
        }
      },
      [user?.uid],
    );

  useEffect(() => {
    if (
      authLoading ||
      !profileReady
    ) {
      return;
    }

    void loadAssignments();
  }, [
    authLoading,
    profileReady,
    loadAssignments,
  ]);

  const classes =
    useMemo(() => {
      const classMap =
        new Map<
          string,
          string
        >();

      summary.assignments.forEach(
        (
          assignment,
        ) => {
          if (
            assignment.classId
          ) {
            classMap.set(
              assignment.classId,
              assignment.className ||
                "Untitled class",
            );
          }
        },
      );

      return Array.from(
        classMap.entries(),
      )
        .map(
          ([
            id,
            name,
          ]) => ({
            id,
            name,
          }),
        )
        .sort(
          (
            first,
            second,
          ) =>
            first.name.localeCompare(
              second.name,
              "en-GB",
            ),
        );
    }, [
      summary.assignments,
    ]);

  const filteredAssignments =
    useMemo(() => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();

      const filtered =
        summary.assignments.filter(
          (
            assignment,
          ) => {
            const matchesType =
              typeFilter ===
                "all" ||
              assignment.kind ===
                typeFilter;

            const matchesStatus =
              statusFilter ===
                "all" ||
              (statusFilter ===
              "overdue"
                ? isUnifiedTeacherAssignmentOverdue(
                    assignment,
                  )
                : assignment.status ===
                  statusFilter);

            const matchesClass =
              classFilter ===
                "all" ||
              assignment.classId ===
                classFilter;

            const matchesSearch =
              !search ||
              [
                assignment.title,
                assignment.topic,
                assignment.className,
                assignment.description,
                kindLabel(
                  assignment.kind,
                ),
              ].some(
                (value) =>
                  value
                    .toLowerCase()
                    .includes(
                      search,
                    ),
              );

            return (
              matchesType &&
              matchesStatus &&
              matchesClass &&
              matchesSearch
            );
          },
        );

      return sortAssignments(
        filtered,
        sortOption,
      );
    }, [
      summary.assignments,
      searchTerm,
      typeFilter,
      statusFilter,
      classFilter,
      sortOption,
    ]);

  const completionPercentage =
    summary.totalStudentCount >
    0
      ? Math.round(
          (summary.completedStudentCount /
            summary.totalStudentCount) *
            100,
        )
      : 0;

  const filtersActive =
    Boolean(
      searchTerm.trim(),
    ) ||
    typeFilter !== "all" ||
    statusFilter !== "all" ||
    classFilter !== "all" ||
    sortOption !== "newest";

  function clearFilters() {
    setSearchTerm("");
    setTypeFilter("all");
    setStatusFilter("all");
    setClassFilter("all");
    setSortOption(
      "newest",
    );
  }

  async function changeStatus(
    assignment:
      UnifiedTeacherAssignment,
    status:
      UnifiedTeacherAssignmentStatus,
  ) {
    try {
      setUpdatingKey(
        assignment.key,
      );

      await updateUnifiedTeacherAssignmentStatus(
        assignment,
        status,
      );

      toast.success(
        status === "active"
          ? "Assignment reopened."
          : status ===
              "closed"
            ? "Assignment closed."
            : "Assignment cancelled.",
      );

      await loadAssignments();
    } catch (
      caughtError
    ) {
      console.error(
        "Unable to update assignment status:",
        caughtError,
      );

      toast.error(
        caughtError instanceof
          Error
          ? caughtError.message
          : "The assignment status could not be changed.",
      );
    } finally {
      setUpdatingKey("");
    }
  }

  if (
    authLoading ||
    !profileReady ||
    loading
  ) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-56 w-full rounded-3xl" />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-28 rounded-3xl" />
        </div>

        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  if (
    profile?.role !==
      "teacher" &&
    profile?.role !==
      "admin"
  ) {
    return (
      <Card className="rounded-3xl border border-red-200 bg-red-50 p-7">
        <h1 className="text-2xl font-black text-red-950">
          Teacher access required
        </h1>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-700 p-7 text-white shadow-xl sm:p-9">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-100">
              T1C · Assignment management
            </p>

            <h1 className="mt-3 text-3xl font-black sm:text-4xl">
              Assignment Centre
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-100">
              Manage lessons, programming challenges, quizzes and written exams
              from one teacher workspace.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/teacher/classes"
              className="rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20"
            >
              Classes
            </Link>

            <Link
              href="/teacher/assignment-wizard"
              className="rounded-xl bg-white px-5 py-3 text-sm font-black text-teal-800 transition hover:bg-emerald-50"
            >
              + Create assignment
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Assignments"
          value={
            summary.totalAssignments
          }
          description="Across all assignment types"
          icon={
            <FileText className="h-5 w-5" />
          }
        />

        <SummaryCard
          label="Active"
          value={
            summary.activeAssignments
          }
          description={`${summary.overdueAssignments} overdue`}
          icon={
            <Clock3 className="h-5 w-5" />
          }
        />

        <SummaryCard
          label="Completion"
          value={`${completionPercentage}%`}
          description={`${summary.completedStudentCount}/${summary.totalStudentCount} student completions`}
          icon={
            <CheckCircle2 className="h-5 w-5" />
          }
        />

        <SummaryCard
          label="Awaiting marking"
          value={
            summary.awaitingMarkingCount
          }
          description="Written exam submissions"
          icon={
            <FilePenLine className="h-5 w-5" />
          }
        />
      </div>

      <Card className="rounded-3xl border border-slate-200 p-6 sm:p-7">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-teal-600">
            <Filter className="h-4 w-4" />
            Assignment filters
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-semibold text-slate-500">
              Showing{" "}
              <span className="font-black text-slate-900">
                {filteredAssignments.length}
              </span>{" "}
              of{" "}
              <span className="font-black text-slate-900">
                {summary.totalAssignments}
              </span>
            </p>

            {filtersActive && (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
              >
                <RotateCcw className="h-4 w-4" />
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[1.6fr_.75fr_.75fr_.9fr_.9fr]">
          <label className="relative block">
            <span className="sr-only">
              Search assignments
            </span>

            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={
                searchTerm
              }
              onChange={(
                event,
              ) =>
                setSearchTerm(
                  event.target
                    .value,
                )
              }
              placeholder="Search title, topic or class..."
              className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </label>

          <select
            aria-label="Assignment type"
            value={
              typeFilter
            }
            onChange={(
              event,
            ) =>
              setTypeFilter(
                event.target
                  .value as
                  TypeFilter,
              )
            }
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
          >
            <option value="all">
              All types
            </option>

            <option value="resource">
              Lessons / resources
            </option>

            <option value="programming">
              Programming
            </option>

            <option value="quiz">
              Quizzes
            </option>

            <option value="exam">
              Written exams
            </option>
          </select>

          <select
            aria-label="Assignment status"
            value={
              statusFilter
            }
            onChange={(
              event,
            ) =>
              setStatusFilter(
                event.target
                  .value as
                  StatusFilter,
              )
            }
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
          >
            <option value="all">
              All statuses
            </option>

            <option value="active">
              Active
            </option>

            <option value="overdue">
              Overdue
            </option>

            <option value="closed">
              Closed
            </option>

            <option value="cancelled">
              Cancelled
            </option>
          </select>

          <select
            aria-label="Class"
            value={
              classFilter
            }
            onChange={(
              event,
            ) =>
              setClassFilter(
                event.target
                  .value,
              )
            }
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
          >
            <option value="all">
              All classes
            </option>

            {classes.map(
              (item) => (
                <option
                  key={
                    item.id
                  }
                  value={
                    item.id
                  }
                >
                  {item.name}
                </option>
              ),
            )}
          </select>

          <label className="relative">
            <span className="sr-only">
              Sort assignments
            </span>

            <ArrowUpDown className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <select
              value={
                sortOption
              }
              onChange={(
                event,
              ) =>
                setSortOption(
                  event.target
                    .value as
                    SortOption,
                )
              }
              className="w-full appearance-none rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm"
            >
              <option value="newest">
                Newest first
              </option>

              <option value="due-soon">
                Due date
              </option>

              <option value="completion-high">
                Highest completion
              </option>

              <option value="completion-low">
                Lowest completion
              </option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <QuickFilter
            active={
              statusFilter ===
              "all"
            }
            onClick={() =>
              setStatusFilter(
                "all",
              )
            }
          >
            All
          </QuickFilter>

          <QuickFilter
            active={
              statusFilter ===
              "active"
            }
            onClick={() =>
              setStatusFilter(
                "active",
              )
            }
          >
            Active
          </QuickFilter>

          <QuickFilter
            active={
              statusFilter ===
              "overdue"
            }
            onClick={() =>
              setStatusFilter(
                "overdue",
              )
            }
          >
            Overdue (
            {
              summary.overdueAssignments
            }
            )
          </QuickFilter>

          <QuickFilter
            active={
              statusFilter ===
              "closed"
            }
            onClick={() =>
              setStatusFilter(
                "closed",
              )
            }
          >
            Closed
          </QuickFilter>

          <QuickFilter
            active={
              statusFilter ===
              "cancelled"
            }
            onClick={() =>
              setStatusFilter(
                "cancelled",
              )
            }
          >
            Cancelled
          </QuickFilter>
        </div>
      </Card>

      {error ? (
        <Card className="rounded-3xl border border-red-200 bg-red-50 p-7">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

            <div>
              <p className="font-black text-red-950">
                Assignments unavailable
              </p>

              <p className="mt-2 text-sm text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  void loadAssignments()
                }
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white"
              >
                <Loader2 className="h-4 w-4" />
                Try again
              </button>
            </div>
          </div>
        </Card>
      ) : filteredAssignments.length ===
        0 ? (
        <Card className="rounded-3xl border border-dashed border-slate-300 p-12 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-slate-300" />

          <h2 className="mt-4 text-xl font-black text-slate-950">
            No assignments match
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Create an assignment or adjust your filters.
          </p>

          {filtersActive && (
            <button
              type="button"
              onClick={
                clearFilters
              }
              className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white"
            >
              Clear filters
            </button>
          )}
        </Card>
      ) : (
        <section className="grid gap-6 xl:grid-cols-2">
          {filteredAssignments.map(
            (
              assignment,
            ) => {
              const overdue =
                isUnifiedTeacherAssignmentOverdue(
                  assignment,
                );

              const updating =
                updatingKey ===
                assignment.key;

              return (
                <article
                  key={
                    assignment.key
                  }
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${kindTone(
                          assignment.kind,
                        )}`}
                      >
                        {kindIcon(
                          assignment.kind,
                        )}
                        {kindLabel(
                          assignment.kind,
                        )}
                      </span>

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                        {
                          assignment.className
                        }
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${statusTone(
                          assignment.status,
                        )}`}
                      >
                        {statusLabel(
                          assignment.status,
                        )}
                      </span>

                      {overdue && (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
                          Overdue
                        </span>
                      )}
                    </div>

                    <h2 className="mt-4 text-xl font-black text-slate-950">
                      {
                        assignment.title
                      }
                    </h2>

                    <p className="mt-2 text-sm font-bold text-teal-700">
                      {
                        assignment.topic
                      }
                    </p>

                    {assignment.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {
                          assignment.description
                        }
                      </p>
                    )}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <Metric
                      label="Students"
                      value={
                        assignment.studentCount
                      }
                      icon={
                        <Users className="h-4 w-4" />
                      }
                    />

                    <Metric
                      label="Completed"
                      value={
                        assignment.completedCount
                      }
                      icon={
                        <CheckCircle2 className="h-4 w-4" />
                      }
                    />

                    <Metric
                      label="Completion"
                      value={`${assignment.completionPercentage}%`}
                      icon={
                        <Clock3 className="h-4 w-4" />
                      }
                    />

                    <Metric
                      label="Average"
                      value={
                        assignment.averagePercentage ===
                        null
                          ? "—"
                          : `${assignment.averagePercentage}%`
                      }
                      icon={
                        <Brain className="h-4 w-4" />
                      }
                    />
                  </div>

                  {assignment.awaitingMarkingCount >
                    0 && (
                    <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
                      {
                        assignment.awaitingMarkingCount
                      }{" "}
                      submission
                      {assignment.awaitingMarkingCount ===
                      1
                        ? ""
                        : "s"}{" "}
                      awaiting marking.
                    </p>
                  )}

                  <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <CalendarDays className="h-4 w-4 text-teal-600" />
                        {formatDate(
                          assignment.dueDate,
                        )}
                      </p>

                      <p
                        className={`mt-1 text-xs font-semibold ${
                          overdue
                            ? "text-red-600"
                            : assignment.status ===
                                "cancelled"
                              ? "text-red-500"
                              : assignment.status ===
                                  "closed"
                                ? "text-slate-600"
                                : "text-slate-500"
                        }`}
                      >
                        {dueLabel(
                          assignment,
                        )}
                      </p>
                    </div>

                    <p className="text-xs font-semibold text-slate-500">
                      Created{" "}
                      {formatDate(
                        assignment.createdAt,
                      )}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={
                        assignment.detailHref
                      }
                      className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                      Open / review
                    </Link>

                    {assignment.status ===
                    "active" ? (
                      <>
                        <button
                          type="button"
                          disabled={
                            updating
                          }
                          onClick={() =>
                            void changeStatus(
                              assignment,
                              "closed",
                            )
                          }
                          className="inline-flex min-w-[88px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : null}

                          Close
                        </button>

                        <button
                          type="button"
                          disabled={
                            updating
                          }
                          onClick={() => {
                            if (
                              window.confirm(
                                `Cancel "${assignment.title}"? Students will no longer be expected to complete it.`,
                              )
                            ) {
                              void changeStatus(
                                assignment,
                                "cancelled",
                              );
                            }
                          }}
                          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        disabled={
                          updating
                        }
                        onClick={() =>
                          void changeStatus(
                            assignment,
                            "active",
                          )
                        }
                        className="inline-flex min-w-[96px] items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {updating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : null}

                        Reopen
                      </button>
                    )}
                  </div>
                </article>
              );
            },
          )}
        </section>
      )}

      <Card className="rounded-3xl border border-indigo-200 bg-indigo-50 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-indigo-700">
              Specialist markbooks
            </p>

            <p className="mt-2 text-sm leading-6 text-indigo-800">
              Open the detailed quiz, programming or written-exam markbooks when
              you need student-level evidence.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/teacher/quiz-assignments"
              className="rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white"
            >
              Quiz results
            </Link>

            <Link
              href="/teacher/programming-assignments"
              className="rounded-xl bg-cyan-700 px-4 py-3 text-sm font-bold text-white"
            >
              Programming results
            </Link>

            <Link
              href="/teacher/exam-assignments"
              className="rounded-xl bg-indigo-700 px-4 py-3 text-sm font-bold text-white"
            >
              Exam markbooks
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value:
    | number
    | string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <Card className="rounded-3xl border border-slate-200 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-black text-slate-950">
            {value}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        </div>

        <div className="rounded-2xl bg-teal-50 p-3 text-teal-700">
          {icon}
        </div>
      </div>
    </Card>
  );
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value:
    | number
    | string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
        {icon}
        {label}
      </p>

      <p className="mt-2 font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}

function QuickFilter({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-black transition ${
        active
          ? "bg-teal-600 text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-950"
      }`}
    >
      {children}
    </button>
  );
}
