"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Bell,
  CheckCircle2,
  Clock3,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import {
  getUnifiedStudentAssignments,
  isUnifiedAssignmentComplete,
  isUnifiedAssignmentOverdue,
  type UnifiedAssignment,
} from "@/services/unifiedAssignmentService";

function assignmentHref(
  item: UnifiedAssignment,
): string {
  if (item.kind === "quiz") {
    return `/quiz?topic=${encodeURIComponent(
      item.resourceId,
    )}&assignment=${encodeURIComponent(item.id)}`;
  }

  if (item.kind === "exam") {
    return `/assignments/exam/${item.id}`;
  }

  if (item.kind === "programming") {
    return `/assignments/programming/${item.id}`;
  }

  return `/assignments/${item.id}`;
}

export default function NotificationsPage() {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [items, setItems] = useState<UnifiedAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (authLoading) {
        return;
      }

      if (!user) {
        if (!cancelled) {
          setItems([]);
          setError("");
          setLoading(false);
        }
        return;
      }

      try {
        if (!cancelled) {
          setLoading(true);
          setError("");
        }

        const loaded =
          await getUnifiedStudentAssignments(
            user.uid,
          );

        if (!cancelled) {
          setItems(loaded);
        }
      } catch (caughtError) {
        console.error(
          "Unable to load student notifications:",
          caughtError,
        );

        if (!cancelled) {
          setItems([]);
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Your notifications could not be loaded.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [
    authLoading,
    user,
    refreshKey,
  ]);

  const active = useMemo(
    () =>
      items
        .filter(
          (item) =>
            !isUnifiedAssignmentComplete(item),
        )
        .sort(
          (first, second) =>
            (first.dueDate?.getTime() ??
              Number.MAX_SAFE_INTEGER) -
            (second.dueDate?.getTime() ??
              Number.MAX_SAFE_INTEGER),
        ),
    [items],
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-700 p-8 text-white">
        <div className="flex items-center gap-3">
          <Bell
            className="h-7 w-7"
            aria-hidden="true"
          />
          <h1 className="text-3xl font-black">
            Notifications
          </h1>
        </div>

        <p className="mt-3 text-blue-100">
          Your assignment alerts are generated from the live assignment record,
          so due dates and completion status stay current.
        </p>
      </section>

      {loading ? (
        <section
          className="rounded-2xl border border-slate-200 bg-white p-8"
          aria-live="polite"
        >
          <p className="font-bold text-slate-600">
            Loading notifications...
          </p>
        </section>
      ) : error ? (
        <section
          className="rounded-2xl border border-red-200 bg-red-50 p-8"
          role="alert"
        >
          <h2 className="text-xl font-black text-red-950">
            Notifications unavailable
          </h2>

          <p className="mt-2 text-red-800">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              setRefreshKey(
                (current) => current + 1,
              )
            }
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-700 px-5 py-3 font-black text-white"
          >
            <RefreshCw
              className="h-4 w-4"
              aria-hidden="true"
            />
            Retry
          </button>
        </section>
      ) : active.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8">
          <CheckCircle2
            className="h-8 w-8 text-emerald-600"
            aria-hidden="true"
          />

          <h2 className="mt-3 text-xl font-black text-slate-950">
            You are up to date
          </h2>

          <p className="mt-1 text-slate-500">
            There are no outstanding assignments to alert you about.
          </p>

          <Link
            href="/assignments"
            className="mt-5 inline-flex rounded-xl border border-slate-300 px-5 py-3 font-black text-slate-700"
          >
            View assignments
          </Link>
        </section>
      ) : (
        <section className="space-y-3">
          {active.map((item) => {
            const overdue =
              isUnifiedAssignmentOverdue(item);

            return (
              <Link
                key={`${item.kind}-${item.id}`}
                href={assignmentHref(item)}
                className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`rounded-xl p-3 ${
                      overdue
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    <Clock3
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                      {item.kind} assignment
                    </p>

                    <h2 className="mt-1 font-black text-slate-950">
                      {item.title}
                    </h2>

                    <p
                      className={`mt-1 text-sm font-semibold ${
                        overdue
                          ? "text-red-600"
                          : "text-slate-500"
                      }`}
                    >
                      {overdue
                        ? "Overdue"
                        : item.dueDate
                          ? `Due ${item.dueDate.toLocaleDateString(
                              "en-GB",
                            )}`
                          : "No due date"}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </div>
  );
}
