"use client";

import { useCallback, useMemo, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";

type PrivacyStatus =
  | "open"
  | "identity_check"
  | "in_progress"
  | "completed"
  | "refused";

type PrivacyRequest = {
  id: string;
  requestType: string;
  details: string;
  status: PrivacyStatus;
  reporterName?: string | null;
  reporterEmail?: string | null;
  reporterRole?: string | null;
  schoolId?: string | null;
  adminNote?: string | null;
  createdAt?: string | null;
};

const statusLabels: Record<PrivacyStatus, string> = {
  open: "Open",
  identity_check: "Identity check",
  in_progress: "In progress",
  completed: "Completed",
  refused: "Refused / not applicable",
};

const filterOptions: readonly ("all" | PrivacyStatus)[] = [
  "all",
  "open",
  "identity_check",
  "in_progress",
  "completed",
  "refused",
];

export default function AdminPrivacyRequestsPage() {
  const { user } = useAuth();

  const [requests, setRequests] = useState<PrivacyRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | PrivacyStatus>("all");

  const loadRequests = useCallback(async () => {
    if (!user) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = await user.getIdToken(true);

      const response = await fetch("/api/admin/privacy-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result = (await response.json()) as {
        requests?: PrivacyRequest[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.error || "Privacy requests could not be loaded.",
        );
      }

      setRequests(Array.isArray(result.requests) ? result.requests : []);
      setLoaded(true);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Privacy requests could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  async function updateRequest(
    requestId: string,
    status: PrivacyStatus,
    adminNote: string,
  ) {
    if (!user) {
      return;
    }

    setSavingId(requestId);
    setError("");

    try {
      const token = await user.getIdToken(true);

      const response = await fetch("/api/admin/privacy-requests", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: requestId,
          status,
          adminNote,
        }),
      });

      const result = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Privacy request could not be updated.",
        );
      }

      setRequests((current) =>
        current.map((item) =>
          item.id === requestId
            ? {
                ...item,
                status,
                adminNote,
              }
            : item,
        ),
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Privacy request could not be updated.",
      );
    } finally {
      setSavingId("");
    }
  }

  const visible = useMemo(() => {
    if (filter === "all") {
      return requests;
    }

    return requests.filter((item) => item.status === filter);
  }, [filter, requests]);

  return (
    <main className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-slate-950 to-indigo-950 p-8 text-white">
        <p className="text-sm font-black uppercase tracking-widest text-indigo-200">
          Platform administration
        </p>

        <h1 className="mt-3 text-4xl font-black">Privacy requests</h1>

        <p className="mt-3 max-w-3xl text-indigo-100">
          Track account-data requests, identity checks and outcomes. This queue
          supports the operational process; it does not determine whether a
          particular legal right applies.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  filter === value
                    ? "bg-indigo-700 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {value === "all" ? "All" : statusLabels[value]}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => void loadRequests()}
            disabled={loading || !user}
            className="rounded-xl bg-slate-950 px-5 py-3 font-black text-white disabled:opacity-50"
          >
            {loading
              ? "Loading..."
              : loaded
                ? "Refresh"
                : "Load requests"}
          </button>
        </div>

        {error ? (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
            {error}
          </div>
        ) : null}

        {loaded && !loading && visible.length === 0 ? (
          <p className="mt-6 text-slate-600">
            No matching privacy requests.
          </p>
        ) : null}

        <div className="mt-6 space-y-5">
          {visible.map((item) => (
            <PrivacyRequestCard
              key={item.id}
              item={item}
              saving={savingId === item.id}
              onSave={updateRequest}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function PrivacyRequestCard({
  item,
  saving,
  onSave,
}: {
  item: PrivacyRequest;
  saving: boolean;
  onSave: (
    requestId: string,
    status: PrivacyStatus,
    adminNote: string,
  ) => Promise<void>;
}) {
  const [status, setStatus] = useState<PrivacyStatus>(item.status);
  const [adminNote, setAdminNote] = useState(item.adminNote || "");

  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="flex flex-wrap gap-2 text-xs font-bold uppercase">
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-800">
              {item.requestType.replace(/_/g, " ")}
            </span>

            <span className="rounded-full bg-white px-3 py-1 text-slate-700">
              {statusLabels[item.status]}
            </span>
          </div>

          <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-800">
            {item.details}
          </p>

          <div className="mt-4 space-y-1 text-sm text-slate-600">
            <p>
              Reporter:{" "}
              {item.reporterName ||
                item.reporterEmail ||
                "Authenticated user"}
            </p>

            {item.reporterEmail ? (
              <p>Email: {item.reporterEmail}</p>
            ) : null}

            {item.reporterRole ? (
              <p>Role: {item.reporterRole}</p>
            ) : null}

            {item.schoolId ? (
              <p>School ID: {item.schoolId}</p>
            ) : null}

            {item.createdAt ? (
              <p>
                Submitted:{" "}
                {new Date(item.createdAt).toLocaleString("en-GB")}
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-3">
          <label className="grid gap-1 text-sm font-bold text-slate-700">
            Status

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as PrivacyStatus)
              }
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 font-normal"
            >
              {(
                Object.entries(statusLabels) as [
                  PrivacyStatus,
                  string,
                ][]
              ).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm font-bold text-slate-700">
            Internal note

            <textarea
              value={adminNote}
              onChange={(event) => setAdminNote(event.target.value)}
              rows={5}
              maxLength={2000}
              className="resize-y rounded-xl border border-slate-300 bg-white px-3 py-2 font-normal"
            />
          </label>

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              void onSave(item.id, status, adminNote)
            }
            className="w-full rounded-xl bg-indigo-700 px-4 py-3 font-black text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save privacy update"}
          </button>
        </div>
      </div>
    </article>
  );
}