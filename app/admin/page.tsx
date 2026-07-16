"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import Link from "next/link";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { db } from "@/lib/firebase";

type TeacherRequest = {
  id: string;
  userId: string;
  name: string;
  email: string;
  schoolName: string;
  jobTitle: string;
  message: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: Timestamp;
};

type ReviewAction = "approve" | "reject";

type ReviewResponse = {
  success?: boolean;
  status?: "approved" | "rejected";
  error?: string;
};

function formatDate(timestamp?: Timestamp) {
  if (!timestamp) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp.toDate());
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();

  const [requests, setRequests] = useState<TeacherRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [processingRequestId, setProcessingRequestId] =
    useState<string | null>(null);

  const isAdmin = profile?.role === "admin";

  useEffect(() => {
    if (profileLoading) {
      return;
    }

    if (!isAdmin) {
      setRequests([]);
      setLoadingRequests(false);
      return;
    }

    const requestsQuery = query(
      collection(db, "teacherRequests"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      requestsQuery,
      (snapshot) => {
        const loadedRequests: TeacherRequest[] = snapshot.docs.map(
          (requestDocument) => {
            const data = requestDocument.data();

            const status =
              data.status === "approved" || data.status === "rejected"
                ? data.status
                : "pending";

            return {
              id: requestDocument.id,
              userId: data.userId || "",
              name: data.name || "Unknown user",
              email: data.email || "No email available",
              schoolName: data.schoolName || "Not provided",
              jobTitle: data.jobTitle || "Not provided",
              message: data.message || "",
              status,
              createdAt: data.createdAt,
            };
          }
        );

        setRequests(loadedRequests);
        setLoadingRequests(false);
      },
      (error) => {
        console.error("Failed to load teacher requests:", error);
        toast.error("Could not load teacher access requests.");
        setRequests([]);
        setLoadingRequests(false);
      }
    );

    return unsubscribe;
  }, [profileLoading, isAdmin]);

  const pendingRequests = useMemo(
    () => requests.filter((request) => request.status === "pending"),
    [requests]
  );

  const approvedRequests = useMemo(
    () => requests.filter((request) => request.status === "approved"),
    [requests]
  );

  const rejectedRequests = useMemo(
    () => requests.filter((request) => request.status === "rejected"),
    [requests]
  );

  async function reviewTeacherRequest(
    requestId: string,
    action: ReviewAction
  ) {
    if (!user) {
      toast.error("You must be logged in as an administrator.");
      return;
    }

    setProcessingRequestId(requestId);

    try {
      const adminIdToken = await user.getIdToken(true);

      const response = await fetch(
        `/api/admin/teacher-request/${requestId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            adminIdToken,
          }),
        }
      );

      const data = (await response.json()) as ReviewResponse;

      if (!response.ok) {
        throw new Error(
          data.error || "The teacher request could not be reviewed."
        );
      }

      if (action === "approve") {
        toast.success("Teacher access approved.");
      } else {
        toast.success("Teacher request rejected.");
      }
    } catch (error) {
      console.error("Teacher request review error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "The teacher request could not be reviewed."
      );
    } finally {
      setProcessingRequestId(null);
    }
  }

  if (profileLoading || loadingRequests) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-52 w-full" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>

        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <Card>
        <div className="text-5xl">🔒</div>

        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Admin access required
        </h1>

        <p className="mt-3 text-slate-600">
          This page is restricted to CS Master administrators.
        </p>

        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
        >
          Return to dashboard
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900 text-white">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-200">
            Administration
          </p>

          <h1 className="mt-3 text-4xl font-extrabold">
            Admin Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-indigo-100">
            Review teacher access requests and manage platform permissions.
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SummaryCard
          label="Pending Requests"
          value={pendingRequests.length.toString()}
          icon="⏳"
        />

        <SummaryCard
          label="Approved"
          value={approvedRequests.length.toString()}
          icon="✅"
        />

        <SummaryCard
          label="Rejected"
          value={rejectedRequests.length.toString()}
          icon="❌"
        />
      </div>

      <Card>
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Teacher Access
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Pending Requests
        </h2>

        {pendingRequests.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-slate-50 p-10 text-center">
            <div className="text-5xl">🎉</div>

            <h3 className="mt-4 text-xl font-bold text-slate-900">
              No pending requests
            </h3>

            <p className="mt-2 text-slate-600">
              New teacher access requests will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {pendingRequests.map((request) => {
              const processing = processingRequestId === request.id;

              return (
                <div
                  key={request.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {request.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-600">
                        {request.email}
                      </p>

                      <p className="mt-4 font-semibold text-slate-800">
                        {request.jobTitle}
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        {request.schoolName}
                      </p>

                      {request.message && (
                        <p className="mt-4 leading-7 text-slate-600">
                          {request.message}
                        </p>
                      )}
                    </div>

                    <div className="text-sm text-slate-500">
                      Submitted {formatDate(request.createdAt)}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() =>
                        reviewTeacherRequest(request.id, "approve")
                      }
                      disabled={processing}
                      className="rounded-xl bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {processing
                        ? "Processing..."
                        : "Approve Teacher"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        reviewTeacherRequest(request.id, "reject")
                      }
                      disabled={processing}
                      className="rounded-xl border border-red-300 px-5 py-3 font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {processing
                        ? "Processing..."
                        : "Reject Request"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RequestHistory
          title="Approved Teachers"
          icon="✅"
          requests={approvedRequests}
          emptyMessage="No teacher requests have been approved yet."
          statusClassName="bg-green-100 text-green-700"
        />

        <RequestHistory
          title="Rejected Requests"
          icon="❌"
          requests={rejectedRequests}
          emptyMessage="No teacher requests have been rejected."
          statusClassName="bg-red-100 text-red-700"
        />
      </div>
    </div>
  );
}

function RequestHistory({
  title,
  icon,
  requests,
  emptyMessage,
  statusClassName,
}: {
  title: string;
  icon: string;
  requests: TeacherRequest[];
  emptyMessage: string;
  statusClassName: string;
}) {
  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Request History
      </p>

      <h2 className="mt-2 text-2xl font-bold text-slate-900">
        {icon} {title}
      </h2>

      {requests.length === 0 ? (
        <p className="mt-6 text-slate-600">
          {emptyMessage}
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-bold text-slate-900">
                    {request.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {request.email}
                  </p>

                  <p className="mt-2 text-sm text-slate-600">
                    {request.schoolName}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1 text-sm font-semibold capitalize ${statusClassName}`}
                >
                  {request.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
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