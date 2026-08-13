"use client";

import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  Play,
  School,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "@/contexts/AuthContext";
import { getLessonAssignmentHref } from "@/services/lessonAssignmentService";
import {
  completeStudentAssignment,
  getAssignmentById,
  getStudentAssignmentProgress,
  startStudentAssignment,
  type ResourceAssignment,
  type StudentAssignmentProgress,
} from "@/services/resourceAssignmentService";

function formatDate(
  value: Date | null,
): string {
  if (!value) return "No due date";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(value);
}

function isOverdue(
  assignment: ResourceAssignment,
  progress: StudentAssignmentProgress,
): boolean {
  if (
    !assignment.dueDate ||
    progress.status === "completed"
  ) {
    return false;
  }

  const dueDate = new Date(
    assignment.dueDate,
  );

  dueDate.setHours(23, 59, 59, 999);

  return dueDate.getTime() < Date.now();
}

export default function StudentAssignmentDetailPage() {
  const params = useParams<{
    assignmentId: string;
  }>();

  const { user } = useAuth();
  const assignmentId =
    params.assignmentId;

  const [assignment, setAssignment] =
    useState<ResourceAssignment | null>(null);
  const [progress, setProgress] =
    useState<StudentAssignmentProgress | null>(
      null,
    );
  const [loading, setLoading] =
    useState(true);
  const [actionLoading, setActionLoading] =
    useState(false);
  const [error, setError] =
    useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  const loadAssignment =
    useCallback(async () => {
      const studentId =
        user?.uid;

      if (!studentId || !assignmentId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const assignmentData =
          await getAssignmentById(
            assignmentId,
          );

        const progressData =
          await getStudentAssignmentProgress(
            assignmentId,
            studentId,
          );

        if (!assignmentData) {
          setError(
            "This assignment could not be found.",
          );
          setAssignment(null);
          return;
        }

        if (
          !assignmentData.studentIds.includes(
            studentId,
          )
        ) {
          setError(
            "You do not have access to this assignment.",
          );
          setAssignment(null);
          return;
        }

        setAssignment(
          assignmentData,
        );
        setProgress(progressData);
      } catch (loadError) {
        console.error(
          "Unable to load assignment:",
          loadError,
        );

        setError(
          loadError instanceof Error
            ? loadError.message
            : "The assignment could not be loaded.",
        );
      } finally {
        setLoading(false);
      }
    }, [
      assignmentId,
      user?.uid,
    ]);

  useEffect(() => {
    void loadAssignment();
  }, [loadAssignment]);

  const overdue = useMemo(() => {
    if (!assignment || !progress) {
      return false;
    }

    return isOverdue(
      assignment,
      progress,
    );
  }, [assignment, progress]);

  const lessonHref = useMemo(
    () =>
      assignment?.resourceType ===
      "lesson"
        ? getLessonAssignmentHref(
            assignment.resourceId,
            assignment.id,
          )
        : null,
    [assignment],
  );

  async function handleStartAssignment() {
    const studentId =
      user?.uid;

    if (
      !studentId ||
      !assignment ||
      !progress
    ) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setSuccessMessage("");

      await startStudentAssignment(
        assignment.id,
        studentId,
      );

      setProgress((current) => {
        if (!current) return current;

        return {
          ...current,
          status: "in_progress",
          startedAt:
            current.startedAt ??
            new Date(),
          updatedAt: new Date(),
        };
      });

      setSuccessMessage(
        "Assignment started successfully.",
      );
    } catch (startError) {
      console.error(
        "Unable to start assignment:",
        startError,
      );

      setError(
        startError instanceof Error
          ? startError.message
          : "The assignment could not be started.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCompleteAssignment() {
    const studentId =
      user?.uid;

    if (
      !studentId ||
      !assignment ||
      !progress
    ) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setSuccessMessage("");

      await completeStudentAssignment(
        assignment.id,
        studentId,
      );

      setProgress((current) => {
        if (!current) return current;

        return {
          ...current,
          status: "completed",
          startedAt:
            current.startedAt ??
            new Date(),
          completedAt:
            new Date(),
          updatedAt: new Date(),
        };
      });

      setSuccessMessage(
        "Assignment marked as completed.",
      );
    } catch (completeError) {
      console.error(
        "Unable to complete assignment:",
        completeError,
      );

      setError(
        completeError instanceof Error
          ? completeError.message
          : "The assignment could not be completed.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-6 py-10">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />

          <p className="mt-4 font-semibold text-slate-600">
            Loading assignment...
          </p>
        </div>
      </main>
    );
  }

  if (error && !assignment) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/assignments"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to assignments
        </Link>

        <section className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />

          <h1 className="mt-4 text-2xl font-black text-red-900">
            Assignment unavailable
          </h1>

          <p className="mt-2 text-red-700">
            {error}
          </p>
        </section>
      </main>
    );
  }

  if (!assignment || !progress) {
    return null;
  }

  const isLesson =
    assignment.resourceType ===
    "lesson";

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/assignments"
        className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition hover:text-blue-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to assignments
      </Link>

      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 p-7 text-white shadow-xl sm:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                {isLesson
                  ? "Interactive lesson"
                  : assignment.resourceType}
              </span>

              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                {assignment.resourceTopic}
              </span>

              {progress.status === "completed" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-bold text-emerald-100">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Completed
                </span>
              )}

              {progress.status === "in_progress" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-100">
                  <Clock3 className="h-3.5 w-3.5" />
                  In progress
                </span>
              )}

              {progress.status === "not_started" && (
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                  Not started
                </span>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-black sm:text-4xl">
              {assignment.resourceTitle}
            </h1>

            <p className="mt-3 max-w-2xl text-blue-100">
              {isLesson
                ? "Complete the exact interactive lesson selected by your teacher."
                : "Complete the assigned resource and mark it finished when you are done."}
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-100">
              Due date
            </p>

            <p
              className={`mt-2 text-xl font-black ${
                overdue
                  ? "text-red-200"
                  : "text-white"
              }`}
            >
              {formatDate(
                assignment.dueDate,
              )}
            </p>

            {overdue && (
              <p className="mt-2 text-sm font-bold text-red-200">
                This assignment is overdue.
              </p>
            )}
          </div>
        </div>
      </section>

      {error && (
        <section className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-semibold">
            {error}
          </p>
        </section>
      )}

      {successMessage && (
        <section className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

          <p className="text-sm font-semibold">
            {successMessage}
          </p>
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-blue-100 p-3">
                <BookOpen className="h-6 w-6 text-blue-700" />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Teacher instructions
                </h2>

                <p className="text-sm text-slate-500">
                  Read this before starting.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-5">
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {assignment.instructions ||
                  "No additional instructions were provided."}
              </p>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-900">
              {isLesson
                ? "Assigned lesson"
                : "Assigned resource"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {isLesson
                ? "Open the exact lesson selected by your teacher. Completion is recorded automatically when you finish the lesson."
                : "Open the teaching resource and complete the required work."}
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              {isLesson ? (
                lessonHref ? (
                  <Link
                    href={lessonHref}
                    onClick={() => {
                      if (
                        progress.status ===
                        "not_started"
                      ) {
                        void handleStartAssignment();
                      }
                    }}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    <BookOpen className="h-4 w-4" />

                    {progress.status === "completed"
                      ? "Review lesson"
                      : progress.status === "in_progress"
                        ? "Continue lesson"
                        : "Start lesson"}
                  </Link>
                ) : (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    This lesson assignment uses an unsupported resource reference.
                  </div>
                )
              ) : (
                <>
                  <Link
                    href={`/resources/${assignment.resourceId}`}
                    onClick={() => {
                      if (
                        progress.status ===
                        "not_started"
                      ) {
                        void handleStartAssignment();
                      }
                    }}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    <BookOpen className="h-4 w-4" />

                    {progress.status === "not_started"
                      ? "Start resource"
                      : "Open resource"}
                  </Link>

                  {progress.status === "not_started" && (
                    <button
                      type="button"
                      onClick={() => {
                        void handleStartAssignment();
                      }}
                      disabled={actionLoading}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-6 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {actionLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                      Mark as started
                    </button>
                  )}
                </>
              )}
            </div>
          </article>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-900">
              Assignment details
            </h2>

            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <p className="flex items-center gap-3">
                <School className="h-5 w-5 text-slate-400" />
                {assignment.className}
              </p>

              <p className="flex items-center gap-3">
                <UserRound className="h-5 w-5 text-slate-400" />
                {assignment.teacherName}
              </p>

              <p className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-slate-400" />
                Assigned{" "}
                {formatDate(
                  assignment.createdAt,
                )}
              </p>

              <p className="flex items-center gap-3">
                <Clock3 className="h-5 w-5 text-slate-400" />
                Due{" "}
                {formatDate(
                  assignment.dueDate,
                )}
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-900">
              Completion
            </h2>

            {isLesson ? (
              progress.status === "completed" ? (
                <div className="mt-5 rounded-2xl bg-emerald-50 p-5 text-center">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />

                  <p className="mt-3 font-black text-emerald-900">
                    Lesson assignment completed
                  </p>

                  <p className="mt-1 text-sm text-emerald-700">
                    {formatDate(
                      progress.completedAt,
                    )}
                  </p>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-5">
                  <p className="font-black text-blue-950">
                    Complete the lesson
                  </p>

                  <p className="mt-2 text-sm leading-6 text-blue-800">
                    There is no manual completion button for lesson assignments.
                    The assignment completes automatically when you finish the
                    exact lesson.
                  </p>
                </div>
              )
            ) : progress.status === "completed" ? (
              <div className="mt-5 rounded-2xl bg-emerald-50 p-5 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />

                <p className="mt-3 font-black text-emerald-900">
                  Assignment completed
                </p>

                <p className="mt-1 text-sm text-emerald-700">
                  {formatDate(
                    progress.completedAt,
                  )}
                </p>
              </div>
            ) : (
              <>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Mark the assignment complete only after you have finished
                  the assigned resource.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    void handleCompleteAssignment();
                  }}
                  disabled={actionLoading}
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Mark as completed
                </button>
              </>
            )}
          </section>
        </aside>
      </section>
    </main>
  );
}
