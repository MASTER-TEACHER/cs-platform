"use client";

import {
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";

import {
  INDIVIDUAL_BILLING_PLANS,
} from "@/data/billingPlans";

import {
  getIndividualSubscription,
  openIndividualBillingPortal,
  startIndividualCheckout,
} from "@/services/billingClientService";

import type {
  IndividualPlanKey,
  IndividualSubscriptionSummary,
} from "@/types/billing";

export default function UpgradePage() {
  const [
    subscription,
    setSubscription,
  ] =
    useState<IndividualSubscriptionSummary | null>(
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
    useState<IndividualPlanKey | "portal" | null>(
      null,
    );

  useEffect(() => {
    let cancelled = false;

    void getIndividualSubscription()
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
              : "Premium status could not be loaded.",
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
    planKey: IndividualPlanKey,
  ) {
    try {
      setProcessing(planKey);
      await startIndividualCheckout(
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
      await openIndividualBillingPortal();
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
      <Card className="border-0 bg-gradient-to-r from-indigo-950 via-blue-900 to-cyan-800 text-white">
        <p className="text-sm font-black uppercase tracking-widest text-cyan-200">
          Individual Premium
        </p>

        <h1 className="mt-3 text-4xl font-black">
          Unlock the complete CS Master student experience
        </h1>

        <p className="mt-3 max-w-3xl text-blue-100">
          Keep core learning free, or upgrade for advanced revision, programming, AI Tutor, adaptive learning and Exam Mode.
        </p>
      </Card>

      {!loading &&
        subscription?.active && (
          <Card className="border-emerald-200 bg-emerald-50">
            <p className="font-black text-emerald-950">
              Premium is active
            </p>
            <p className="mt-2 text-sm text-emerald-900">
              Your individual CS Master Premium entitlement is active.
            </p>

            {subscription.stripeCustomerId && (
              <button
                type="button"
                disabled={processing !== null}
                onClick={() => void portal()}
                className="mt-5 rounded-xl bg-emerald-700 px-5 py-3 font-black text-white disabled:opacity-50"
              >
                {processing === "portal"
                  ? "Opening..."
                  : "Manage billing"}
              </button>
            )}
          </Card>
        )}

      <section className="grid gap-6 lg:grid-cols-2">
        {INDIVIDUAL_BILLING_PLANS.map(
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

              <p className="mt-3 text-slate-600">
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
                className="mt-7 rounded-xl bg-indigo-600 px-5 py-3 font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {subscription?.active
                  ? "Premium active"
                  : processing === plan.key
                    ? "Opening Checkout..."
                    : "Choose Premium"}
              </button>
            </Card>
          ),
        )}
      </section>

      <Card>
        <p className="font-black text-slate-950">
          Free Individual
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Free accounts retain core curriculum learning and basic practice. No Stripe subscription is required for the Free plan.
        </p>
      </Card>
    </div>
  );
}