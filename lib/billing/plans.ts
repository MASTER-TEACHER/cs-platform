import {
  getBillingPlan,
} from "@/data/billingPlans";

import type {
  IndividualPlanKey,
  SchoolPlanKey,
} from "@/types/billing";

const SCHOOL_PRICE_ENV: Record<
  SchoolPlanKey,
  string
> = {
  starter:
    "STRIPE_PRICE_SCHOOL_STARTER",
  standard:
    "STRIPE_PRICE_SCHOOL_STANDARD",
  pro:
    "STRIPE_PRICE_SCHOOL_PRO",
};

const INDIVIDUAL_PRICE_ENV: Record<
  IndividualPlanKey,
  string
> = {
  premium_monthly:
    "STRIPE_PRICE_INDIVIDUAL_PREMIUM_MONTHLY",
  premium_annual:
    "STRIPE_PRICE_INDIVIDUAL_PREMIUM_ANNUAL",
};

export function getStripePriceId(
  planKey: SchoolPlanKey,
): string {
  const envName =
    SCHOOL_PRICE_ENV[planKey];

  const priceId =
    process.env[envName]?.trim();

  if (!priceId) {
    throw new Error(
      `Stripe price is not configured for ${planKey}. Set ${envName}.`,
    );
  }

  return priceId;
}

export function getIndividualStripePriceId(
  planKey: IndividualPlanKey,
): string {
  const envName =
    INDIVIDUAL_PRICE_ENV[planKey];

  const priceId =
    process.env[envName]?.trim();

  if (!priceId) {
    throw new Error(
      `Stripe price is not configured for ${planKey}. Set ${envName}.`,
    );
  }

  return priceId;
}

export function getPlanFromPriceId(
  priceId: string,
): SchoolPlanKey | null {
  const cleaned = priceId.trim();

  for (
    const planKey of [
      "starter",
      "standard",
      "pro",
    ] as SchoolPlanKey[]
  ) {
    const configured =
      process.env[
        SCHOOL_PRICE_ENV[planKey]
      ]?.trim();

    if (
      configured &&
      configured === cleaned
    ) {
      return planKey;
    }
  }

  return null;
}

export function getIndividualPlanFromPriceId(
  priceId: string,
): IndividualPlanKey | null {
  const cleaned = priceId.trim();

  for (
    const planKey of [
      "premium_monthly",
      "premium_annual",
    ] as IndividualPlanKey[]
  ) {
    const configured =
      process.env[
        INDIVIDUAL_PRICE_ENV[planKey]
      ]?.trim();

    if (
      configured &&
      configured === cleaned
    ) {
      return planKey;
    }
  }

  return null;
}

export function getSeatLimit(
  planKey: SchoolPlanKey,
): number {
  return getBillingPlan(
    planKey,
  ).seatLimit;
}