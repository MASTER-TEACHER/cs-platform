"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

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

import {
  useAuth,
} from "@/contexts/AuthContext";

import {
  useUserProfile,
} from "@/hooks/useUserProfile";

import {
  db,
} from "@/lib/firebase";

type TeacherRequest = {
  id: string;

  userId: string;

  name: string;
  email: string;

  schoolName: string;

  jobTitle: string;

  message: string;

  status:
    | "pending"
    | "approved"
    | "rejected";

  createdAt?: Timestamp;
};

type ReviewAction =
  | "approve"
  | "reject";

type ReviewResponse = {
  success?: boolean;

  status?:
    | "approved"
    | "rejected";

  error?: string;
};

type SecurityReview = {
  id: string;
};

type SecurityReviewResponse = {
  success?: boolean;

  reviews?: SecurityReview[];

  error?: string;
};

function formatDate(
  timestamp?: Timestamp,
) {
  if (!timestamp) {
    return "Recently";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(
    timestamp.toDate(),
  );
}

export default function AdminDashboardPage() {
  const {
    user,
  } =
    useAuth();

  const {
    profile,
    loading:
      profileLoading,
  } =
    useUserProfile();

  const [
    requests,
    setRequests,
  ] =
    useState<
      TeacherRequest[]
    >([]);

  const [
    loadingRequests,
    setLoadingRequests,
  ] =
    useState(true);

  const [
    processingRequestId,
    setProcessingRequestId,
  ] =
    useState<
      string | null
    >(null);

  const [
    securityReviewCount,
    setSecurityReviewCount,
  ] =
    useState(0);

  const [
    loadingSecurityReviews,
    setLoadingSecurityReviews,
  ] =
    useState(true);

  const isAdmin =
    profile?.role ===
    "admin";

  /*
   * ---------------------------------------------------------
   * LEGACY / STANDARD TEACHER REQUEST HISTORY
   * ---------------------------------------------------------
   *
   * Keep this existing collection for historical teacher
   * administration.
   */
  useEffect(() => {
    if (
      profileLoading
    ) {
      return;
    }

    if (!isAdmin) {
      return;
    }

    const requestsQuery =
      query(
        collection(
          db,
          "teacherRequests",
        ),
        orderBy(
          "createdAt",
          "desc",
        ),
      );

    const unsubscribe =
      onSnapshot(
        requestsQuery,

        (
          snapshot,
        ) => {
          const loadedRequests:
            TeacherRequest[] =
              snapshot.docs.map(
                (
                  requestDocument,
                ) => {
                  const data =
                    requestDocument.data();

                  const status =
                    data.status ===
                      "approved" ||
                    data.status ===
                      "rejected"
                      ? data.status
                      : "pending";

                  return {
                    id:
                      requestDocument.id,

                    userId:
                      data.userId ||
                      "",

                    name:
                      data.name ||
                      "Unknown user",

                    email:
                      data.email ||
                      "No email available",

                    schoolName:
                      data.schoolName ||
                      "Not provided",

                    jobTitle:
                      data.jobTitle ||
                      "Not provided",

                    message:
                      data.message ||
                      "",

                    status,

                    createdAt:
                      data.createdAt,
                  };
                },
              );

          setRequests(
            loadedRequests,
          );

          setLoadingRequests(
            false,
          );
        },

        (
          error,
        ) => {
          console.error(
            "Failed to load teacher requests:",
            error,
          );

          toast.error(
            "Could not load teacher access requests.",
          );

          setRequests(
            [],
          );

          setLoadingRequests(
            false,
          );
        },
      );

    return unsubscribe;
  }, [
    profileLoading,
    isAdmin,
  ]);

  /*
   * ---------------------------------------------------------
   * SECURITY REVIEW QUEUE
   * ---------------------------------------------------------
   */

  const loadSecurityReviewCount =
    useCallback(
      async () => {
        if (
          !user ||
          !isAdmin
        ) {
          return;
        }

        try {
          setLoadingSecurityReviews(
            true,
          );

          const token =
            await user.getIdToken(
              true,
            );

          const response =
            await fetch(
              "/api/admin/teacher-verification-reviews",
              {
                method:
                  "GET",

                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },

                cache:
                  "no-store",
              },
            );

          const result =
            (await response.json()) as
              SecurityReviewResponse;

          if (
            !response.ok
          ) {
            throw new Error(
              result.error ||
                "Security reviews could not be loaded.",
            );
          }

          setSecurityReviewCount(
            result.reviews
              ?.length ??
              0,
          );
        } catch (
          error
        ) {
          console.error(
            "Unable to load teacher security review count:",
            error,
          );

          setSecurityReviewCount(
            0,
          );
        } finally {
          setLoadingSecurityReviews(
            false,
          );
        }
      },
      [
        user,
        isAdmin,
      ],
    );

  /*
   * Deferred initial call avoids triggering state updates
   * synchronously inside the effect body.
   */
  useEffect(() => {
    if (
      profileLoading ||
      !isAdmin ||
      !user
    ) {
      return;
    }

    const timer =
      window.setTimeout(
        () => {
          void loadSecurityReviewCount();
        },
        0,
      );

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [
    profileLoading,
    isAdmin,
    user,
    loadSecurityReviewCount,
  ]);

  const pendingRequests =
    useMemo(
      () =>
        requests.filter(
          (
            request,
          ) =>
            request.status ===
            "pending",
        ),
      [
        requests,
      ],
    );

  const approvedRequests =
    useMemo(
      () =>
        requests.filter(
          (
            request,
          ) =>
            request.status ===
            "approved",
        ),
      [
        requests,
      ],
    );

  const rejectedRequests =
    useMemo(
      () =>
        requests.filter(
          (
            request,
          ) =>
            request.status ===
            "rejected",
        ),
      [
        requests,
      ],
    );

  async function reviewTeacherRequest(
    requestId: string,
    action:
      ReviewAction,
  ) {
    if (!user) {
      toast.error(
        "You must be logged in as an administrator.",
      );

      return;
    }

    setProcessingRequestId(
      requestId,
    );

    try {
      const adminIdToken =
        await user.getIdToken(
          true,
        );

      const response =
        await fetch(
          `/api/admin/teacher-request/${requestId}`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${adminIdToken}`,
            },

            body:
              JSON.stringify({
                action,
              }),
          },
        );

      const data =
        (await response.json()) as
          ReviewResponse;

      if (
        !response.ok
      ) {
        throw new Error(
          data.error ||
            "The teacher request could not be reviewed.",
        );
      }

      if (
        action ===
        "approve"
      ) {
        toast.success(
          "Teacher access approved.",
        );
      } else {
        toast.success(
          "Teacher request rejected.",
        );
      }
    } catch (
      error
    ) {
      console.error(
        "Teacher request review error:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "The teacher request could not be reviewed.",
      );
    } finally {
      setProcessingRequestId(
        null,
      );
    }
  }

  if (
    profileLoading ||
    (
      isAdmin &&
      loadingRequests
    )
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

  if (!isAdmin) {
    return (
      <Card>
        <div className="text-5xl">
          🔒
        </div>

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
            Review teacher access, security verification and platform permissions.
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Pending Requests"
          value={
            pendingRequests.length.toString()
          }
          icon="⏳"
        />

        <SummaryCard
          label="Security Reviews"
          value={
            loadingSecurityReviews
              ? "..."
              : securityReviewCount.toString()
          }
          icon="🔐"
          attention={
            securityReviewCount >
            0
          }
        />

        <SummaryCard
          label="Approved"
          value={
            approvedRequests.length.toString()
          }
          icon="✅"
        />

        <SummaryCard
          label="Rejected"
          value={
            rejectedRequests.length.toString()
          }
          icon="❌"
        />
      </div>

      {securityReviewCount >
        0 && (
        <Card className="border-amber-300 bg-amber-50">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-amber-700">
                Security attention required
              </p>

              <h2 className="mt-2 text-2xl font-black text-amber-950">
                Teacher verification reviews
              </h2>

              <p className="mt-2 max-w-3xl leading-7 text-amber-800">
                {securityReviewCount}{" "}
                {securityReviewCount ===
                1
                  ? "teacher verification requires"
                  : "teacher verifications require"}{" "}
                manual CS Master review before teacher privileges can be activated.
              </p>
            </div>

            <Link
              href="/admin/teacher-verification-reviews"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-amber-700 px-6 py-4 font-black text-white transition hover:bg-amber-800"
            >
              Review security requests →
            </Link>
          </div>
        </Card>
      )}

      <Card>
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Teacher Access
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Pending Requests
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Standard teacher-access requests appear here. Security-sensitive school-verification cases are handled separately in Teacher Verification Reviews.
        </p>

        {pendingRequests.length ===
        0 ? (
          <div className="mt-8 rounded-2xl bg-slate-50 p-10 text-center">
            <div className="text-5xl">
              🎉
            </div>

            <h3 className="mt-4 text-xl font-bold text-slate-900">
              No pending requests
            </h3>

            <p className="mt-2 text-slate-600">
              New standard teacher access requests will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {pendingRequests.map(
              (
                request,
              ) => {
                const processing =
                  processingRequestId ===
                  request.id;

                return (
                  <div
                    key={
                      request.id
                    }
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">
                          {
                            request.name
                          }
                        </h3>

                        <p className="mt-1 text-sm text-slate-600">
                          {
                            request.email
                          }
                        </p>

                        <p className="mt-4 font-semibold text-slate-800">
                          {
                            request.jobTitle
                          }
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          {
                            request.schoolName
                          }
                        </p>

                        {request.message && (
                          <p className="mt-4 leading-7 text-slate-600">
                            {
                              request.message
                            }
                          </p>
                        )}
                      </div>

                      <div className="text-sm text-slate-500">
                        Submitted{" "}
                        {formatDate(
                          request.createdAt,
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() =>
                          reviewTeacherRequest(
                            request.id,
                            "approve",
                          )
                        }
                        disabled={
                          processing
                        }
                        className="rounded-xl bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {processing
                          ? "Processing..."
                          : "Approve Teacher"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          reviewTeacherRequest(
                            request.id,
                            "reject",
                          )
                        }
                        disabled={
                          processing
                        }
                        className="rounded-xl border border-red-300 px-5 py-3 font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {processing
                          ? "Processing..."
                          : "Reject Request"}
                      </button>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RequestHistory
          title="Approved Teachers"
          icon="✅"
          requests={
            approvedRequests
          }
          emptyMessage="No teacher requests have been approved yet."
          statusClassName="bg-green-100 text-green-700"
        />

        <RequestHistory
          title="Rejected Requests"
          icon="❌"
          requests={
            rejectedRequests
          }
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

  requests:
    TeacherRequest[];

  emptyMessage:
    string;

  statusClassName:
    string;
}) {
  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Request History
      </p>

      <h2 className="mt-2 text-2xl font-bold text-slate-900">
        {icon} {title}
      </h2>

      {requests.length ===
      0 ? (
        <p className="mt-6 text-slate-600">
          {emptyMessage}
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {requests.map(
            (
              request,
            ) => (
              <div
                key={
                  request.id
                }
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-bold text-slate-900">
                      {
                        request.name
                      }
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {
                        request.email
                      }
                    </p>

                    <p className="mt-2 text-sm text-slate-600">
                      {
                        request.schoolName
                      }
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-sm font-semibold capitalize ${statusClassName}`}
                  >
                    {
                      request.status
                    }
                  </span>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </Card>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  attention = false,
}: {
  label: string;
  value: string;
  icon: string;
  attention?: boolean;
}) {
  return (
    <Card
      className={
        attention
          ? "border-amber-300 bg-amber-50"
          : undefined
      }
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p
            className={`text-sm font-semibold ${
              attention
                ? "text-amber-800"
                : "text-slate-500"
            }`}
          >
            {label}
          </p>

          <p
            className={`mt-2 text-3xl font-bold ${
              attention
                ? "text-amber-950"
                : "text-slate-900"
            }`}
          >
            {value}
          </p>
        </div>

        <div className="text-3xl">
          {icon}
        </div>
      </div>
    </Card>
  );
}
