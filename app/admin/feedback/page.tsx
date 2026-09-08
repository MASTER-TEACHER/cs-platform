"use client";

import { useCallback, useMemo, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";

type FeedbackStatus = "open" | "in_progress" | "resolved" | "closed";
type FeedbackPriority = "low" | "normal" | "high" | "urgent";

type FeedbackReport = {
  id: string;
  category: string;
  subject: string;
  message: string;
  pageUrl?: string | null;
  reporterName?: string | null;
  reporterEmail?: string | null;
  reporterRole?: string | null;
  status: FeedbackStatus;
  priority: FeedbackPriority;
  adminNotes?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type FeedbackListResponse = {
  reports?: FeedbackReport[];
  error?: string;
};

const statusLabels: Record<FeedbackStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

const priorityLabels: Record<FeedbackPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};

export default function AdminFeedbackPage() {
  const { user } = useAuth();

  const [reports, setReports] = useState<FeedbackReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | FeedbackStatus>("all");
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    if (!user) {
      setReports([]);
      setHasLoaded(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = await user.getIdToken();

      const response = await fetch("/api/admin/feedback", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data = (await response.json()) as FeedbackListResponse;

      if (!response.ok) {
        throw new Error(data.error || "Could not load feedback reports.");
      }

      setReports(Array.isArray(data.reports) ? data.reports : []);
      setHasLoaded(true);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load feedback reports.",
      );
      setHasLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const visibleReports = useMemo(() => {
    if (filter === "all") {
      return reports;
    }

    return reports.filter((report) => report.status === filter);
  }, [reports, filter]);

  async function updateReport(
    reportId: string,
    changes: Partial<
      Pick<FeedbackReport, "status" | "priority" | "adminNotes">
    >,
  ) {
    if (!user) {
      return;
    }

    setSavingId(reportId);
    setError(null);

    try {
      const token = await user.getIdToken();

      const response = await fetch(`/api/admin/feedback/${reportId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changes),
      });

      const data = (await response.json()) as {
        report?: FeedbackReport;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Could not update feedback report.");
      }

      setReports((current) =>
        current.map((report) =>
          report.id === reportId
            ? {
                ...report,
                ...changes,
                ...(data.report ?? {}),
              }
            : report,
        ),
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Could not update feedback report.",
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">
            Admin
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Feedback & Issues
          </h1>

          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Review reports submitted by teachers and students, assign priority,
            record internal notes and track each issue through to resolution.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadReports()}
          disabled={loading || !user}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Loading..."
            : hasLoaded
              ? "Refresh reports"
              : "Load reports"}
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {(
          [
            ["all", "All"],
            ["open", "Open"],
            ["in_progress", "In Progress"],
            ["resolved", "Resolved"],
            ["closed", "Closed"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === value
                ? "bg-sky-600 text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {!hasLoaded && !loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Feedback reports are ready to load
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Use the button above to retrieve the latest reports.
          </p>
        </div>
      ) : null}

      {hasLoaded && !loading && visibleReports.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            No feedback reports found
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            There are currently no reports matching this filter.
          </p>
        </div>
      ) : null}

      <div className="space-y-5">
        {visibleReports.map((report) => (
          <article
            key={report.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {report.category}
                  </span>

                  <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                    {statusLabels[report.status]}
                  </span>

                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    {priorityLabels[report.priority]}
                  </span>
                </div>

                <h2 className="mt-3 text-lg font-bold text-slate-900">
                  {report.subject}
                </h2>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {report.message}
                </p>

                <div className="mt-4 grid gap-1 text-xs text-slate-500">
                  <p>
                    Reporter:{" "}
                    {report.reporterName ||
                      report.reporterEmail ||
                      "Authenticated user"}
                  </p>

                  {report.reporterEmail ? (
                    <p>Email: {report.reporterEmail}</p>
                  ) : null}

                  {report.reporterRole ? (
                    <p>Role: {report.reporterRole}</p>
                  ) : null}

                  {report.pageUrl ? <p>Page: {report.pageUrl}</p> : null}

                  {report.createdAt ? (
                    <p>
                      Submitted:{" "}
                      {new Date(report.createdAt).toLocaleString("en-GB")}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="grid min-w-full gap-3 sm:grid-cols-2 lg:min-w-[340px] lg:grid-cols-1">
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  Status
                  <select
                    value={report.status}
                    disabled={savingId === report.id}
                    onChange={(event) =>
                      void updateReport(report.id, {
                        status: event.target.value as FeedbackStatus,
                      })
                    }
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  Priority
                  <select
                    value={report.priority}
                    disabled={savingId === report.id}
                    onChange={(event) =>
                      void updateReport(report.id, {
                        priority: event.target.value as FeedbackPriority,
                      })
                    }
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                  >
                    {Object.entries(priorityLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1 text-sm font-medium text-slate-700 sm:col-span-2 lg:col-span-1">
                  Internal notes
                  <textarea
                    defaultValue={report.adminNotes ?? ""}
                    disabled={savingId === report.id}
                    onBlur={(event) => {
                      const nextValue = event.target.value;

                      if (nextValue !== (report.adminNotes ?? "")) {
                        void updateReport(report.id, {
                          adminNotes: nextValue,
                        });
                      }
                    }}
                    rows={4}
                    placeholder="Add internal notes..."
                    className="resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                  />
                </label>

                {savingId === report.id ? (
                  <p className="text-xs font-medium text-sky-600">
                    Saving changes...
                  </p>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}