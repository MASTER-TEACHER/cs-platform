"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { useStudentAssignmentResults } from "@/hooks/useStudentAssignmentResults";

type AssignmentRecord = {
  id: string;
  classId: string;
  title: string;
  description: string;
  type: "lesson" | "quiz";
  resourceId: string;
  dueDate: string;
  status: string;
};

type DisplayStatus = "completed" | "overdue" | "not-started";

function isAssignmentOverdue(dueDate: string) {
  if (!dueDate) {
    return false;
  }

  const deadline = new Date(`${dueDate}T23:59:59`);
  return deadline.getTime() < Date.now();
}

function formatDueDate(dueDate: string) {
  if (!dueDate) {
    return "No due date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${dueDate}T00:00:00`));
}

function getStatusStyles(status: DisplayStatus) {
  if (status === "completed") {
    return {
      label: "Completed",
      badge: "bg-green-100 text-green-700",
      card: "border-green-200 bg-green-50/40",
    };
  }

  if (status === "overdue") {
    return {
      label: "Overdue",
      badge: "bg-red-100 text-red-700",
      card: "border-red-200 bg-red-50/40",
    };
  }

  return {
    label: "Not Started",
    badge: "bg-amber-100 text-amber-700",
    card: "border-slate-200 bg-slate-50",
  };
}

export default function StudentAssignmentsPage() {
  const { user, loading: authLoading } = useAuth();

  const {
    results,
    loading: resultsLoading,
  } = useStudentAssignmentResults();

  const [assignments, setAssignments] = useState<AssignmentRecord[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setAssignments([]);
      setLoadingAssignments(false);
      return;
    }

    const userId = user.uid;
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    async function loadAssignments() {
      try {
        const userSnapshot = await getDoc(doc(db, "users", userId));

        if (cancelled) {
          return;
        }

        if (!userSnapshot.exists()) {
          setAssignments([]);
          setLoadingAssignments(false);
          return;
        }

        const userData = userSnapshot.data();

        const classIds: string[] = Array.isArray(userData.classIds)
          ? userData.classIds
          : [];

        if (classIds.length === 0) {
          setAssignments([]);
          setLoadingAssignments(false);
          return;
        }

        const assignmentsQuery = query(
          collection(db, "assignments"),
          where("classId", "in", classIds.slice(0, 10))
        );

        unsubscribe = onSnapshot(
          assignmentsQuery,
          (snapshot) => {
            const loadedAssignments: AssignmentRecord[] = snapshot.docs.map(
              (assignmentDocument) => {
                const data = assignmentDocument.data();

                return {
                  id: assignmentDocument.id,
                  classId: data.classId || "",
                  title: data.title || "Untitled Assignment",
                  description: data.description || "",
                  type: data.type === "quiz" ? "quiz" : "lesson",
                  resourceId: data.resourceId || "",
                  dueDate: data.dueDate || "",
                  status: data.status || "active",
                };
              }
            );

            loadedAssignments.sort((a, b) => {
              if (!a.dueDate && !b.dueDate) return 0;
              if (!a.dueDate) return 1;
              if (!b.dueDate) return -1;

              return a.dueDate.localeCompare(b.dueDate);
            });

            setAssignments(loadedAssignments);
            setLoadingAssignments(false);
          },
          (error) => {
            console.error("Failed to load assignments:", error);
            setAssignments([]);
            setLoadingAssignments(false);
          }
        );
      } catch (error) {
        console.error("Assignment load error:", error);

        if (!cancelled) {
          setAssignments([]);
          setLoadingAssignments(false);
        }
      }
    }

    void loadAssignments();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [authLoading, user]);

  const resultByAssignmentId = useMemo(() => {
    return new Map(
      results.map((result) => [result.assignmentId, result])
    );
  }, [results]);

  const completedCount = useMemo(() => {
    return assignments.filter((assignment) =>
      resultByAssignmentId.has(assignment.id)
    ).length;
  }, [assignments, resultByAssignmentId]);

  const overdueCount = useMemo(() => {
    return assignments.filter((assignment) => {
      const completed = resultByAssignmentId.has(assignment.id);

      return !completed && isAssignmentOverdue(assignment.dueDate);
    }).length;
  }, [assignments, resultByAssignmentId]);

  const outstandingCount =
    assignments.length - completedCount;

  if (
    authLoading ||
    loadingAssignments ||
    resultsLoading
  ) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-52 w-full" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>

        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">
          Student Portal
        </p>

        <h1 className="mt-3 text-4xl font-extrabold">
          My Assignments
        </h1>

        <p className="mt-3 max-w-2xl text-blue-100">
          View assigned lessons and quizzes, monitor deadlines and review your
          completed scores.
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total Assignments"
          value={assignments.length.toString()}
          icon="📋"
        />

        <SummaryCard
          label="Completed"
          value={completedCount.toString()}
          icon="✅"
        />

        <SummaryCard
          label="Outstanding"
          value={outstandingCount.toString()}
          icon="⏳"
        />

        <SummaryCard
          label="Overdue"
          value={overdueCount.toString()}
          icon="⚠️"
        />
      </div>

      <Card>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Assigned Work
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Your Current Assignments
        </h2>

        {assignments.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-slate-50 p-10 text-center">
            <div className="text-5xl">🎉</div>

            <h3 className="mt-4 text-2xl font-bold text-slate-900">
              No assignments yet
            </h3>

            <p className="mt-2 text-slate-600">
              Your teacher has not assigned any work to your classes.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
            {assignments.map((assignment) => {
              const result = resultByAssignmentId.get(assignment.id);

              const displayStatus: DisplayStatus = result
                ? "completed"
                : isAssignmentOverdue(assignment.dueDate)
                  ? "overdue"
                  : "not-started";

              const statusStyles = getStatusStyles(displayStatus);

              const href =
                assignment.type === "quiz"
                  ? `/quiz?topic=${assignment.resourceId}&assignment=${assignment.id}`
                  : `/learn/${assignment.resourceId}?assignment=${assignment.id}`;

              return (
                <div
                  key={assignment.id}
                  className={`rounded-2xl border p-6 ${statusStyles.card}`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                        {assignment.type}
                      </p>

                      <h3 className="mt-2 text-xl font-bold text-slate-900">
                        {assignment.title}
                      </h3>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ${statusStyles.badge}`}
                    >
                      {statusStyles.label}
                    </span>
                  </div>

                  <p className="mt-4 leading-6 text-slate-600">
                    {assignment.description}
                  </p>

                  <p className="mt-4 text-sm text-slate-600">
                    Due:{" "}
                    <span className="font-bold text-slate-900">
                      {formatDueDate(assignment.dueDate)}
                    </span>
                  </p>

                  {result && (
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-white p-4">
                        <p className="text-sm font-semibold text-slate-500">
                          Score
                        </p>

                        <p className="mt-1 text-xl font-bold text-blue-700">
                          {result.score} / {result.totalQuestions}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white p-4">
                        <p className="text-sm font-semibold text-slate-500">
                          Percentage
                        </p>

                        <p className="mt-1 text-xl font-bold text-green-700">
                          {result.percentage}%
                        </p>
                      </div>
                    </div>
                  )}

                  <Link
                    href={href}
                    className={`mt-6 inline-flex rounded-xl px-5 py-3 font-bold text-white transition ${
                      result
                        ? "bg-slate-700 hover:bg-slate-800"
                        : displayStatus === "overdue"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {result
                      ? "Review Assignment →"
                      : displayStatus === "overdue"
                        ? "Complete Overdue Work →"
                        : "Start Assignment →"}
                  </Link>
                </div>
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
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="text-3xl">{icon}</div>
      </div>
    </Card>
  );
}