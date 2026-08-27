"use client";

import Link from "next/link";
import {
  usePathname,
} from "next/navigation";
import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  useAuth,
} from "@/contexts/AuthContext";

import {
  getSchoolSubscription,
} from "@/services/billingClientService";

import type {
  SchoolSubscriptionSummary,
} from "@/types/billing";

const TEACHER_EXEMPT_PATHS = [
  "/teacher/school",
  "/teacher/billing",
];

export default function SchoolSubscriptionGate({
  children,
}: {
  children: ReactNode;
}) {
  const pathname =
    usePathname();

  const {
    user,
    profile,
  } = useAuth();

  const [
    subscription,
    setSubscription,
  ] =
    useState<SchoolSubscriptionSummary | null>(
      null,
    );

  const [
    checked,
    setChecked,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    if (
      !user ||
      !profile?.schoolId ||
      profile.role === "admin"
    ) {
      return;
    }

    void getSchoolSubscription()
      .then((value) => {
        if (!cancelled) {
          setSubscription(
            value,
          );
          setError("");
        }
      })
      .catch((caught) => {
        if (!cancelled) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Subscription status could not be checked.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setChecked(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    user,
    profile?.schoolId,
    profile?.role,
  ]);

  if (
    !profile?.schoolId ||
    profile.role === "admin"
  ) {
    return <>{children}</>;
  }

  if (
    profile.role === "teacher" &&
    TEACHER_EXEMPT_PATHS.some(
      (path) =>
        pathname === path ||
        pathname.startsWith(
          `${path}/`,
        ),
    )
  ) {
    return <>{children}</>;
  }

  if (!checked) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <p className="font-bold text-slate-600">
          Checking school subscription...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-red-50 p-8">
        <h1 className="text-2xl font-black text-red-950">
          Subscription check unavailable
        </h1>
        <p className="mt-3 text-red-800">
          {error}
        </p>
      </section>
    );
  }

  if (
    !subscription ||
    !subscription.enforcementEnabled
  ) {
    return <>{children}</>;
  }

  if (subscription.active) {
    return <>{children}</>;
  }

  if (profile.role === "teacher") {
    return (
      <section className="mx-auto max-w-3xl rounded-3xl border border-amber-200 bg-amber-50 p-8">
        <p className="text-sm font-black uppercase tracking-widest text-amber-700">
          School subscription required
        </p>
        <h1 className="mt-2 text-3xl font-black text-amber-950">
          Activate CS Master for your school
        </h1>
        <p className="mt-4 leading-7 text-amber-900">
          Your school workspace is ready, but paid features require an active school subscription.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
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
    </section>
  );
}