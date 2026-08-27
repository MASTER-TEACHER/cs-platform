import type Stripe from "stripe";

import {
  adminDb,
} from "@/lib/firebaseAdmin";

import {
  billingEnforcementEnabled,
} from "@/lib/billing/stripe";

import {
  getIndividualPlanFromPriceId,
  getPlanFromPriceId,
  getSeatLimit,
} from "@/lib/billing/plans";

import type {
  IndividualPlanKey,
  IndividualSubscriptionSummary,
  SchoolPlanKey,
  SchoolSubscriptionStatus,
  SchoolSubscriptionSummary,
} from "@/types/billing";

function stringValue(
  value: unknown,
): string {
  return typeof value === "string"
    ? value
    : "";
}

function numberValue(
  value: unknown,
): number {
  return typeof value === "number" &&
    Number.isFinite(value)
    ? value
    : 0;
}

function booleanValue(
  value: unknown,
): boolean {
  return value === true;
}

function normaliseStatus(
  value: unknown,
): SchoolSubscriptionStatus {
  const status =
    stringValue(value);

  switch (status) {
    case "trialing":
    case "active":
    case "past_due":
    case "unpaid":
    case "canceled":
    case "incomplete":
    case "incomplete_expired":
    case "paused":
      return status;
    default:
      return "none";
  }
}

export function isSubscriptionActive(
  status: SchoolSubscriptionStatus,
): boolean {
  return (
    status === "active" ||
    status === "trialing"
  );
}

export async function countStudentSeats(
  schoolId: string,
): Promise<number> {
  const snapshot =
    await adminDb
      .collection("users")
      .where(
        "schoolId",
        "==",
        schoolId,
      )
      .where(
        "role",
        "==",
        "student",
      )
      .get();

  return snapshot.size;
}

export function subscriptionPeriodEnd(
  subscription: Stripe.Subscription,
): Date | null {
  const firstItem =
    subscription.items.data[0];

  const seconds =
    firstItem?.current_period_end;

  return typeof seconds === "number"
    ? new Date(seconds * 1000)
    : null;
}

export async function persistStripeSubscription(
  subscription: Stripe.Subscription,
  fallbackSchoolId = "",
): Promise<void> {
  const priceId =
    subscription.items.data[0]
      ?.price.id || "";

  const planKey =
    (
      subscription.metadata
        .planKey ||
      getPlanFromPriceId(
        priceId,
      ) ||
      ""
    ) as SchoolPlanKey | "";

  const schoolId =
    subscription.metadata
      .schoolId ||
    fallbackSchoolId;

  if (!schoolId) {
    throw new Error(
      "Stripe subscription is missing schoolId metadata.",
    );
  }

  const seatLimit =
    planKey
      ? getSeatLimit(planKey)
      : 0;

  await adminDb
    .collection(
      "schoolSubscriptions",
    )
    .doc(schoolId)
    .set(
      {
        schoolId,
        stripeCustomerId:
          typeof subscription.customer ===
          "string"
            ? subscription.customer
            : subscription.customer.id,
        stripeSubscriptionId:
          subscription.id,
        status:
          subscription.status,
        planKey:
          planKey || null,
        priceId:
          priceId || null,
        seatLimit,
        cancelAtPeriodEnd:
          subscription.cancel_at_period_end,
        currentPeriodEnd:
          subscriptionPeriodEnd(
            subscription,
          ),
        updatedAt:
          new Date(),
      },
      {
        merge: true,
      },
    );
}

export async function persistIndividualStripeSubscription(
  subscription: Stripe.Subscription,
  fallbackUserId = "",
): Promise<void> {
  const priceId =
    subscription.items.data[0]
      ?.price.id || "";

  const planKey =
    (
      subscription.metadata
        .planKey ||
      getIndividualPlanFromPriceId(
        priceId,
      ) ||
      ""
    ) as IndividualPlanKey | "";

  const userId =
    subscription.metadata
      .userId ||
    fallbackUserId;

  if (!userId) {
    throw new Error(
      "Stripe individual subscription is missing userId metadata.",
    );
  }

  const active =
    isSubscriptionActive(
      normaliseStatus(
        subscription.status,
      ),
    );

  const customerId =
    typeof subscription.customer ===
    "string"
      ? subscription.customer
      : subscription.customer.id;

  await adminDb
    .collection(
      "individualSubscriptions",
    )
    .doc(userId)
    .set(
      {
        userId,
        stripeCustomerId:
          customerId,
        stripeSubscriptionId:
          subscription.id,
        status:
          subscription.status,
        planKey:
          planKey || null,
        priceId:
          priceId || null,
        cancelAtPeriodEnd:
          subscription.cancel_at_period_end,
        currentPeriodEnd:
          subscriptionPeriodEnd(
            subscription,
          ),
        updatedAt:
          new Date(),
      },
      {
        merge: true,
      },
    );

  const userRef =
    adminDb
      .collection("users")
      .doc(userId);

  const userSnapshot =
    await userRef.get();

  if (userSnapshot.exists) {
    const user =
      userSnapshot.data() || {};

    /*
     * School entitlement remains separate. A user's personal
     * Premium subscription is remembered while they belong to
     * a school and becomes effective again when they leave it.
     */
    await userRef.set(
      {
        individualPlan:
          active
            ? "premium"
            : "free",
        individualPlanKey:
          planKey || null,
        individualSubscriptionStatus:
          subscription.status,
        updatedAt:
          new Date(),
        ...(
          user.accountType !== "school"
            ? {
                plan:
                  active
                    ? "premium"
                    : "free",
                accountType:
                  "individual",
              }
            : {}
        ),
      },
      {
        merge: true,
      },
    );
  }
}

export async function getSchoolSubscriptionSummary(
  schoolId: string,
): Promise<SchoolSubscriptionSummary> {
  const schoolSnapshot =
    await adminDb
      .collection("schools")
      .doc(schoolId)
      .get();

  const schoolData =
    schoolSnapshot.exists
      ? schoolSnapshot.data() || {}
      : {};

  const schoolName =
    typeof schoolData.name === "string"
      ? schoolData.name
      : "CS Master School";

  const subscriptionSnapshot =
    await adminDb
      .collection(
        "schoolSubscriptions",
      )
      .doc(schoolId)
      .get();

  const seatsUsed =
    await countStudentSeats(
      schoolId,
    );

  if (
    !subscriptionSnapshot.exists
  ) {
    return {
      schoolId,
      schoolName,
      planKey: null,
      status: "none",
      active: false,
      enforcementEnabled:
        billingEnforcementEnabled(),
      seatLimit: 0,
      seatsUsed,
      seatsRemaining: 0,
      cancelAtPeriodEnd: false,
      currentPeriodEnd: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
    };
  }

  const data =
    subscriptionSnapshot.data() || {};

  const status =
    normaliseStatus(
      data.status,
    );

  const planKeyValue =
    stringValue(
      data.planKey,
    );

  const planKey:
    SchoolPlanKey | null =
    (
      planKeyValue === "starter" ||
      planKeyValue === "standard" ||
      planKeyValue === "pro"
    )
      ? planKeyValue
      : null;

  const seatLimit =
    numberValue(
      data.seatLimit,
    );

  const periodEnd =
    data.currentPeriodEnd;

  const currentPeriodEnd =
    periodEnd &&
    typeof periodEnd.toDate ===
      "function"
      ? periodEnd
          .toDate()
          .toISOString()
      : periodEnd instanceof Date
        ? periodEnd.toISOString()
        : null;

  return {
    schoolId,
    schoolName,
    planKey,
    status,
    active:
      isSubscriptionActive(
        status,
      ),
    enforcementEnabled:
      billingEnforcementEnabled(),
    seatLimit,
    seatsUsed,
    seatsRemaining:
      Math.max(
        0,
        seatLimit - seatsUsed,
      ),
    cancelAtPeriodEnd:
      booleanValue(
        data.cancelAtPeriodEnd,
      ),
    currentPeriodEnd,
    stripeCustomerId:
      stringValue(
        data.stripeCustomerId,
      ) || null,
    stripeSubscriptionId:
      stringValue(
        data.stripeSubscriptionId,
      ) || null,
  };
}

export async function getIndividualSubscriptionSummary(
  userId: string,
): Promise<IndividualSubscriptionSummary> {
  const snapshot =
    await adminDb
      .collection(
        "individualSubscriptions",
      )
      .doc(userId)
      .get();

  if (!snapshot.exists) {
    return {
      userId,
      planKey: null,
      status: "none",
      active: false,
      enforcementEnabled:
        billingEnforcementEnabled(),
      cancelAtPeriodEnd: false,
      currentPeriodEnd: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
    };
  }

  const data =
    snapshot.data() || {};

  const status =
    normaliseStatus(
      data.status,
    );

  const planKeyValue =
    stringValue(
      data.planKey,
    );

  const planKey:
    IndividualPlanKey | null =
    (
      planKeyValue === "premium_monthly" ||
      planKeyValue === "premium_annual"
    )
      ? planKeyValue
      : null;

  const periodEnd =
    data.currentPeriodEnd;

  const currentPeriodEnd =
    periodEnd &&
    typeof periodEnd.toDate ===
      "function"
      ? periodEnd
          .toDate()
          .toISOString()
      : periodEnd instanceof Date
        ? periodEnd.toISOString()
        : null;

  return {
    userId,
    planKey,
    status,
    active:
      isSubscriptionActive(
        status,
      ),
    enforcementEnabled:
      billingEnforcementEnabled(),
    cancelAtPeriodEnd:
      booleanValue(
        data.cancelAtPeriodEnd,
      ),
    currentPeriodEnd,
    stripeCustomerId:
      stringValue(
        data.stripeCustomerId,
      ) || null,
    stripeSubscriptionId:
      stringValue(
        data.stripeSubscriptionId,
      ) || null,
  };
}