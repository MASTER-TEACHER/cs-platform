"use client";

import {
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";

import {
  BILLING_PLANS,
} from "@/data/billingPlans";

import {
  getSchoolSubscription,
  openBillingPortal,
  startSchoolCheckout,
} from "@/services/billingClientService";

import type {
  SchoolPlanKey,
  SchoolSubscriptionSummary,
} from "@/types/billing";

function statusLabel(
  status: string,
): string {
  return status
    .replace(/_/g, " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

export default function TeacherBillingPage() {
  const [
    subscription,
    setSubscription,
  ] =
    useState<SchoolSubscriptionSummary | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    processing,
    setProcessing,
  ] =
    useState<SchoolPlanKey | "portal" | null>(
      null,
    );

  useEffect(() => {
    let cancelled = false;

    void getSchoolSubscription()
      .then((value) => {
        if (!cancelled) {
          setSubscription(
            value,
          );
        }
      })
      .catch((error) => {
        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Billing status could not be loaded.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function checkout(
    planKey: SchoolPlanKey,
  ) {
    try {
      setProcessing(planKey);
      await startSchoolCheckout(
        planKey,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Checkout could not be started.",
      );
      setProcessing(null);
    }
  }

  async function portal() {
    try {
      setProcessing("portal");
      await openBillingPortal();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Billing portal could not be opened.",
      );
      setProcessing(null);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-900 text-white">
        <p className="text-sm font-black uppercase tracking-widest text-blue-200">
          CS Master Billing
        </p>
        <h1 className="mt-3 text-4xl font-black">
          School subscription
        </h1>
        <p className="mt-3 max-w-3xl text-blue-100">
          Activate school-wide CS Master access. Card details are handled by Stripe and are never stored by CS Master.
        </p>
      </Card>

      {!loading && subscription && (
        <Card>
          <div className="grid gap-5 md:grid-cols-4">
            <div>
              <p className="text-xs font-black uppercase text-slate-500">
                School
              </p>
              <p className="mt-2 font-black text-slate-950">
                {subscription.schoolName || "Not linked"}
              </p>
            </div>
            <div>
              <p className="text-xs font-black uppercase text-slate-500">
                Status
              </p>
              <p className="mt-2 font-black text-slate-950">
                {statusLabel(subscription.status)}
              </p>
            </div>
            <div>
              <p className="text-xs font-black uppercase text-slate-500">
                Student seats
              </p>
              <p className="mt-2 font-black text-slate-950">
                {subscription.seatsUsed}
                {subscription.seatLimit > 0
                  ? ` / ${subscription.seatLimit}`
                  : ""}
              </p>
            </div>
            <div>
              <p className="text-xs font-black uppercase text-slate-500">
                Enforcement
              </p>
              <p className="mt-2 font-black text-slate-950">
                {subscription.enforcementEnabled
                  ? "Production strict"
                  : "Development bypass"}
              </p>
            </div>
          </div>

          {subscription.stripeCustomerId && (
            <button
              type="button"
              disabled={processing !== null}
              onClick={() => void portal()}
              className="mt-6 rounded-xl bg-slate-900 px-5 py-3 font-black text-white disabled:opacity-50"
            >
              {processing === "portal"
                ? "Opening..."
                : "Manage billing"}
            </button>
          )}
        </Card>
      )}

      <section className="grid gap-6 lg:grid-cols-3">
        {BILLING_PLANS.map(
          (plan) => (
            <Card
              key={plan.key}
              className="flex flex-col"
            >
              <p className="text-sm font-black uppercase tracking-wide text-indigo-600">
                {plan.name}
              </p>

              <p className="mt-3 text-3xl font-black text-slate-950">
                {plan.displayPrice}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {plan.description}
              </p>

              <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-700">
                {plan.highlights.map(
                  (item) => (
                    <li
                      key={item}
                      className="flex gap-2"
                    >
                      <span>âœ“</span>
                      <span>{item}</span>
                    </li>
                  ),
                )}
              </ul>

              <button
                type="button"
                disabled={
                  processing !== null ||
                  subscription?.active
                }
                onClick={() =>
                  void checkout(
                    plan.key,
                  )
                }
                className="mt-7 rounded-xl bg-indigo-600 px-5 py-3 font-black text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {subscription?.active
                  ? "Subscription active"
                  : processing === plan.key
                    ? "Opening Checkout..."
                    : "Choose plan"}
              </button>
            </Card>
          ),
        )}
      </section>

      <Card className="border-amber-200 bg-amber-50">
        <p className="font-black text-amber-950">
          School procurement
        </p>
        <p className="mt-2 text-sm leading-6 text-amber-900">
          Card checkout is the automated route. Schools requiring purchase orders, quotes or invoice-based procurement can be handled separately without storing card data in CS Master.
        </p>
      </Card>
    </div>
  );
}