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
  getIndividualSubscription,
} from "@/services/billingClientService";

import type {
  IndividualSubscriptionSummary,
} from "@/types/billing";

const PREMIUM_PATHS = [
  "/adaptive-learning",
  "/tutor",
  "/exam",
  "/exam-trainer",
  "/programming",
  "/knowledge-map",
  "/revision-plan",
  "/analytics",
];

export default function IndividualPremiumGate({
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
    useState<IndividualSubscriptionSummary | null>(
      null,
    );

  const [
    checked,
    setChecked,
  ] =
    useState(false);

  useEffect(() => {
    let cancelled = false;

    if (
      !user ||
      profile?.role !== "student" ||
      profile.schoolId
    ) {
      return;
    }

    void getIndividualSubscription()
      .then((value) => {
        if (!cancelled) {
          setSubscription(
            value,
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSubscription(null);
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
    profile?.role,
    profile?.schoolId,
  ]);

  if (
    profile?.role !== "student" ||
    profile.schoolId
  ) {
    return <>{children}</>;
  }

  const premiumRoute =
    PREMIUM_PATHS.some(
      (path) =>
        pathname === path ||
        pathname.startsWith(
          `${path}/`,
        ),
    );

  if (!premiumRoute) {
    return <>{children}</>;
  }

  if (!checked) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <p className="font-bold text-slate-600">
          Checking Premium access...
        </p>
      </div>
    );
  }

  /*
   * Keep development/demo flows available until strict
   * enforcement is enabled for Stripe sandbox QA.
   */
  if (
    !subscription ||
    !subscription.enforcementEnabled ||
    subscription.active
  ) {
    return <>{children}</>;
  }

  return (
    <section className="mx-auto max-w-3xl rounded-3xl border border-indigo-200 bg-indigo-50 p-8">
      <p className="text-sm font-black uppercase tracking-widest text-indigo-700">
        CS Master Premium
      </p>

      <h1 className="mt-2 text-3xl font-black text-indigo-950">
        Upgrade to unlock this feature
      </h1>

      <p className="mt-4 leading-7 text-indigo-900">
        Free individual accounts keep access to core learning and practice. Premium unlocks advanced student tools including AI Tutor, Adaptive Learning, Exam Mode, programming practice and detailed analytics.
      </p>

      <Link
        href="/upgrade"
        className="mt-6 inline-flex rounded-xl bg-indigo-700 px-5 py-3 font-black text-white"
      >
        View Premium plans
      </Link>
    </section>
  );
}