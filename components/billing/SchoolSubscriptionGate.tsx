"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import toast from "react-hot-toast";

import { useAuth } from "@/contexts/AuthContext";
import LogoutButton from "@/components/layout/LogoutButton";
import { getSchoolSubscription } from "@/services/billingClientService";
import type { SchoolSubscriptionSummary } from "@/types/billing";

const TEACHER_EXEMPT_PATHS = [
  "/teacher/school",
  "/teacher/billing",
];

type TrialStatusResponse = {
  entitlement?: {
    teacherSchoolAccess?: boolean;
  };
  trial?: {
    active?: boolean;
    status?: string;
  };
};

type AccessState = {
  key: string;
  subscription: SchoolSubscriptionSummary | null;
  trialAccessActive: boolean;
  error: string;
};

export default function SchoolSubscriptionGate({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { user, profile } = useAuth();

  const accessKey = useMemo(() => {
    if (!user || !profile?.schoolId || profile.role === "admin") {
      return null;
    }

    return `${user.uid}:${profile.schoolId}:${profile.role}`;
  }, [user, profile?.schoolId, profile?.role]);

  const [accessState, setAccessState] = useState<AccessState | null>(null);

  const [startingTrial, setStartingTrial] = useState(false);

async function startTrial() {
  if (!user || startingTrial) {
    return;
  }

  try {
    setStartingTrial(true);

    const token = await user.getIdToken();

    const response = await fetch("/api/billing/trial/start", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let message = "The School Trial could not be started.";

      try {
        const body = (await response.json()) as {
          error?: string;
        };

        if (body.error) {
          message = body.error;
        }
      } catch {
        // Keep fallback message.
      }

      throw new Error(message);
    }

    toast.success("Your 14-day CS Master School Trial is active.");

    window.location.reload();
  } catch (error) {
    console.error("Start School Trial error:", error);

    toast.error(
      error instanceof Error
        ? error.message
        : "The School Trial could not be started.",
    );
  } finally {
    setStartingTrial(false);
  }
}

  useEffect(() => {
    if (!accessKey || !user || !profile?.schoolId || profile.role === "admin") {
      return;
    }

    let cancelled = false;

    const loadAccess = async () => {
      try {
        const subscriptionStatus = await getSchoolSubscription();
        let teacherTrialActive = false;

        /*
         * The School Trial endpoint is restricted to teacher/admin accounts.
         * Students must never call it. Student access is based only on the
         * active school subscription, while teachers may additionally use an
         * active 14-day School Trial entitlement.
         */
        if (profile.role === "teacher") {
          const token = await user.getIdToken();
          const response = await fetch("/api/billing/trial/status", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          });

          if (!response.ok) {
            throw new Error("School Trial status could not be checked.");
          }

          const trialStatus = (await response.json()) as TrialStatusResponse;

          teacherTrialActive =
            trialStatus.entitlement?.teacherSchoolAccess === true ||
            (trialStatus.trial?.active === true &&
              trialStatus.trial?.status === "active");
        }

        if (!cancelled) {
          setAccessState({
            key: accessKey,
            subscription: subscriptionStatus,
            trialAccessActive: teacherTrialActive,
            error: "",
          });
        }
      } catch (caught) {
        if (!cancelled) {
          setAccessState({
            key: accessKey,
            subscription: null,
            trialAccessActive: false,
            error:
              caught instanceof Error
                ? caught.message
                : "School access status could not be checked.",
          });
        }
      }
    };

    void loadAccess();

    return () => {
      cancelled = true;
    };
  }, [accessKey, user, profile?.schoolId, profile?.role]);

  if (!profile?.schoolId || profile.role === "admin") {
    return <>{children}</>;
  }

  if (
    profile.role === "teacher" &&
    TEACHER_EXEMPT_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    )
  ) {
    return <>{children}</>;
  }

  if (!accessKey || accessState?.key !== accessKey) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <p className="font-bold text-slate-600">Checking school subscription...</p>
      </div>
    );
  }

  if (accessState.error) {
    return (
      <section className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-red-50 p-8">
        <h1 className="text-2xl font-black text-red-950">
          Subscription check unavailable
        </h1>
        <p className="mt-3 text-red-800">{accessState.error}</p>
        <div className="max-w-xs">
          <LogoutButton />
        </div>
      </section>
    );
  }

  const { subscription, trialAccessActive } = accessState;

  if (!subscription || !subscription.enforcementEnabled) {
    return <>{children}</>;
  }

  if (subscription.active || trialAccessActive) {
    return <>{children}</>;
  }

  if (profile.role === "teacher") {
  return (
    <section className="mx-auto max-w-3xl rounded-3xl border border-amber-200 bg-amber-50 p-8">
      <p className="text-sm font-black uppercase tracking-widest text-amber-700">
        School access required
      </p>

      <h1 className="mt-2 text-3xl font-black text-amber-950">
        Activate CS Master for your school
      </h1>

      <p className="mt-4 leading-7 text-amber-900">
        Your school workspace is ready. Start your free 14-day School
        Trial to unlock the full teacher platform, or choose a school
        subscription.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void startTrial()}
          disabled={startingTrial}
          className="rounded-xl bg-indigo-600 px-5 py-3 font-black text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {startingTrial
            ? "Starting trial..."
            : "Start 14-Day Free Trial"}
        </button>

        <Link
          href="/teacher/billing"
          className="rounded-xl bg-amber-700 px-5 py-3 font-black text-white"
        >
          View plans
        </Link>

        <Link
          href="/teacher/school"
          className="rounded-xl border border-amber-300 bg-white px-5 py-3 font-black text-amber-900"
        >
          School settings
        </Link>
      </div>

      <p className="mt-4 text-sm font-semibold text-amber-800">
        No payment card required for the 14-day trial.
      </p>
    </section>
  );
}

  return (
    <section className="mx-auto max-w-3xl rounded-3xl border border-amber-200 bg-amber-50 p-8">
      <p className="text-sm font-black uppercase tracking-widest text-amber-700">
        School licence inactive
      </p>
      <h1 className="mt-2 text-3xl font-black text-amber-950">
        Contact your school administrator
      </h1>
      <p className="mt-4 leading-7 text-amber-900">
        Your account remains intact, but the school subscription for CS Master is not currently active.
      </p>
      <div className="max-w-xs">
        <LogoutButton />
      </div>
    </section>
  );
}
