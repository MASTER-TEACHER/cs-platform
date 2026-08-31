"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  useAuth,
} from "@/contexts/AuthContext";

type TrialStatus =
  | "none"
  | "active"
  | "expired"
  | "converted";

type TrialSummary = {
  schoolId: string | null;

  userId: string;

  status: TrialStatus;

  active: boolean;

  startedAt: string | null;

  endsAt: string | null;

  daysRemaining: number | null;

  convertedAt: string | null;
};

type EntitlementSummary = {
  tier:
    | "free"
    | "student_premium"
    | "school";

  source:
    | "free"
    | "individual_subscription"
    | "school_subscription"
    | "school_trial";

  subscriptionStatus: string;

  active: boolean;

  premiumStudentAccess: boolean;

  teacherSchoolAccess: boolean;

  trialStatus: TrialStatus;

  trialStartedAt: string | null;

  trialEndsAt: string | null;

  trialDaysRemaining: number | null;

  cancelAtPeriodEnd: boolean;

  currentPeriodEnd: string | null;

  stripeCustomerId: string | null;

  stripeSubscriptionId: string | null;
};

type TrialStatusResponse = {
  trial: TrialSummary;

  entitlement: EntitlementSummary;

  demo: {
    status: string;

    ready: boolean;

    classId: string | null;
  };
};

type StartTrialResponse =
  TrialSummary & {
    created?: boolean;

    existing?: boolean;

    durationDays?: number;

    cardRequired?: boolean;

    demoClassId?: string | null;

    error?: string;
  };

async function getErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const body =
      (await response.json()) as {
        error?: string;
      };

    return (
      body.error ||
      fallback
    );
  } catch {
    return fallback;
  }
}

function formatTrialEnd(
  value: string | null,
): string {
  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  ).format(date);
}

export default function TeacherTrialBanner() {
  const {
    user,
  } = useAuth();

  const [
    status,
    setStatus,
  ] =
    useState<TrialStatusResponse | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    starting,
    setStarting,
  ] =
    useState(false);

  const loadStatus =
    useCallback(
      async () => {
        if (!user) {
          setStatus(null);
          setLoading(false);
          return;
        }

        try {
          setLoading(true);

          const token =
            await user.getIdToken();

          const response =
            await fetch(
              "/api/billing/trial/status",
              {
                method: "GET",

                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },

                cache:
                  "no-store",
              },
            );

          if (!response.ok) {
            throw new Error(
              await getErrorMessage(
                response,
                "Could not load trial information.",
              ),
            );
          }

          const result =
            (await response.json()) as
              TrialStatusResponse;

          setStatus(
            result,
          );
        } catch (error) {
          console.error(
            "Teacher trial status error:",
            error,
          );

          /*
           * Billing status should not prevent the rest of the
           * teacher dashboard from loading.
           */
          setStatus(null);
        } finally {
          setLoading(false);
        }
      },
      [user],
    );

  useEffect(() => {
  void Promise.resolve().then(() => {
    void loadStatus();
  });
}, [loadStatus]);

  async function startTrial() {
    if (
      !user ||
      starting
    ) {
      return;
    }

    try {
      setStarting(true);

      const token =
        await user.getIdToken();

      const response =
        await fetch(
          "/api/billing/trial/start",
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        );

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(
            response,
            "The School Trial could not be started.",
          ),
        );
      }

      const result =
        (await response.json()) as
          StartTrialResponse;

      if (result.created) {
        toast.success(
          "Your 14-day CS Master School Trial is active.",
        );
      } else {
        toast.success(
          "Your School Trial is already active.",
        );
      }

      await loadStatus();
    } catch (error) {
      console.error(
        "Start School Trial error:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "The School Trial could not be started.",
      );
    } finally {
      setStarting(false);
    }
  }

  if (loading) {
    return (
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 w-36 rounded bg-slate-200" />

          <div className="mt-4 h-7 w-72 max-w-full rounded bg-slate-200" />

          <div className="mt-3 h-4 w-full max-w-2xl rounded bg-slate-100" />

          <div className="mt-2 h-4 w-4/5 max-w-xl rounded bg-slate-100" />
        </div>
      </section>
    );
  }

  if (!status) {
    return null;
  }

  const {
    entitlement,
    trial,
    demo,
  } = status;

  /*
   * -------------------------------------------------------
   * PAID SCHOOL
   * -------------------------------------------------------
   */

  if (
    entitlement.source ===
      "school_subscription" &&
    entitlement.active
  ) {
    return (
      <section className="overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
                School access active
              </span>

              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-800 shadow-sm">
                Full teacher platform
              </span>
            </div>

            <h2 className="mt-4 text-2xl font-black text-slate-950">
              Your school has full CS Master access
            </h2>

            <p className="mt-2 max-w-3xl leading-7 text-slate-600">
              Teacher intelligence, classes, assignments,
              interventions, reports, Exam Mode and licensed
              student Premium access are enabled.
            </p>
          </div>

          <Link
            href="/teacher/classes"
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 font-black text-white transition hover:bg-emerald-700"
          >
            Open classes →
          </Link>
        </div>
      </section>
    );
  }

  /*
   * -------------------------------------------------------
   * ACTIVE TRIAL
   * -------------------------------------------------------
   */

  if (
    trial.active &&
    trial.status ===
      "active"
  ) {
    const daysRemaining =
      trial.daysRemaining ??
      0;

    const endDate =
      formatTrialEnd(
        trial.endsAt,
      );

    return (
      <section className="overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-violet-50 shadow-sm">
        <div className="p-6 sm:p-7">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
                  14-day School Trial
                </span>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-indigo-800 shadow-sm">
                  {daysRemaining}{" "}
                  {daysRemaining === 1
                    ? "day"
                    : "days"}{" "}
                  remaining
                </span>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm">
                  No card required
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-black text-slate-950">
                Your full teacher workspace is unlocked
              </h2>

              <p className="mt-2 leading-7 text-slate-600">
                Explore classes, assignments, student
                monitoring, interventions, reports, assessment
                tools and the Premium student experience during
                your trial.
              </p>

              {endDate && (
                <p className="mt-3 text-sm font-bold text-indigo-800">
                  Trial access ends {endDate}.
                </p>
              )}
            </div>

            <div className="flex shrink-0 flex-wrap gap-3">
              {demo.ready &&
                demo.classId && (
                  <Link
                    href={`/teacher/classes/${demo.classId}`}
                    className="inline-flex min-h-12 items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 font-black text-white transition hover:bg-indigo-700"
                  >
                    Open Demo Class →
                  </Link>
                )}

              <Link
                href="/pricing"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-indigo-300 bg-white px-6 py-3 font-black text-indigo-700 transition hover:bg-indigo-50"
              >
                View school plans
              </Link>
            </div>
          </div>

          {demo.ready && (
            <div className="mt-6 rounded-2xl border border-indigo-100 bg-white/80 p-4">
              <p className="font-black text-slate-900">
                🧪 Demo classroom ready
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Your trial includes a synthetic Year 11 GCSE
                class so you can explore teacher analytics and
                intervention workflows without using real pupil
                data.
              </p>
            </div>
          )}
        </div>
      </section>
    );
  }

  /*
   * -------------------------------------------------------
   * EXPIRED TRIAL
   * -------------------------------------------------------
   */

  if (
    trial.status ===
    "expired"
  ) {
    return (
      <section className="overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-orange-50 p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
              Trial ended
            </span>

            <h2 className="mt-4 text-2xl font-black text-slate-950">
              Your 14-day School Trial has ended
            </h2>

            <p className="mt-2 leading-7 text-slate-600">
              Your teacher account and existing data remain
              available. Choose a school licence to restore
              full teacher access.
            </p>
          </div>

          <Link
            href="/pricing"
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-slate-950 px-6 py-3 font-black text-white transition hover:bg-slate-800"
          >
            View school plans →
          </Link>
        </div>
      </section>
    );
  }

  /*
   * -------------------------------------------------------
   * CONVERTED
   * -------------------------------------------------------
   */

  if (
    trial.status ===
    "converted"
  ) {
    return (
      <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-wide text-emerald-700">
          Trial converted
        </p>

        <h2 className="mt-2 text-2xl font-black text-slate-950">
          Thanks for choosing CS Master
        </h2>

        <p className="mt-2 text-slate-600">
          Your trial has been converted to a school
          subscription.
        </p>
      </section>
    );
  }

  /*
   * -------------------------------------------------------
   * NO TRIAL YET
   * -------------------------------------------------------
   */

  return (
    <section className="overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-blue-50 shadow-sm">
      <div className="grid gap-6 p-6 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
              School Trial
            </span>

            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-indigo-800 shadow-sm">
              14 days
            </span>

            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-indigo-800 shadow-sm">
              No card required
            </span>
          </div>

          <h2 className="mt-4 text-2xl font-black text-slate-950">
            Explore the complete CS Master teacher platform
          </h2>

          <p className="mt-2 max-w-3xl leading-7 text-slate-600">
            Try classes, assignments, student monitoring,
            interventions, reports, assessment tools, Exam Mode
            and the Premium student experience before choosing
            a school licence.
          </p>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-slate-700">
            <span>✓ Full teacher dashboard</span>
            <span>✓ Demo Year 11 class</span>
            <span>✓ Synthetic student analytics</span>
            <span>✓ Full Premium features</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() =>
              void startTrial()
            }
            disabled={starting}
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-indigo-600 px-7 py-3 font-black text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {starting
              ? "Starting trial..."
              : "Start 14-Day Free Trial"}
          </button>

          <p className="text-center text-xs font-semibold text-slate-500">
            No payment card required
          </p>
        </div>
      </div>
    </section>
  );
}
