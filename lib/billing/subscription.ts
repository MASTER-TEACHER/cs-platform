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
  EntitlementSource,
  EntitlementSummary,
  EntitlementTier,
  IndividualPlanKey,
  IndividualSubscriptionSummary,
  SchoolPlanKey,
  SchoolSubscriptionStatus,
  SchoolSubscriptionSummary,
  SchoolTrialSummary,
  TrialStatus,
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

function normaliseTrialStatus(
  value: unknown,
): TrialStatus {
  const status =
    stringValue(value);

  switch (status) {
    case "active":
    case "expired":
    case "converted":
      return status;

    default:
      return "none";
  }
}

function firestoreDateToIso(
  value: unknown,
): string | null {
  if (!value) {
    return null;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (
      value as {
        toDate?: unknown;
      }
    ).toDate === "function"
  ) {
    const date =
      (
        value as {
          toDate: () => Date;
        }
      ).toDate();

    return date.toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (
    typeof value === "string"
  ) {
    const parsed =
      new Date(value);

    return Number.isNaN(
      parsed.getTime(),
    )
      ? null
      : parsed.toISOString();
  }

  return null;
}

function calculateTrialDaysRemaining(
  endsAt: string | null,
): number | null {
  if (!endsAt) {
    return null;
  }

  const endDate =
    new Date(endsAt);

  if (
    Number.isNaN(
      endDate.getTime(),
    )
  ) {
    return null;
  }

  const difference =
    endDate.getTime() -
    Date.now();

  if (difference <= 0) {
    return 0;
  }

  return Math.ceil(
    difference /
      (
        1000 *
        60 *
        60 *
        24
      ),
  );
}

export function isSubscriptionActive(
  status: SchoolSubscriptionStatus,
): boolean {
  return (
    status === "active" ||
    status === "trialing"
  );
}

export function isTrialActive(
  trial: SchoolTrialSummary,
): boolean {
  if (
    trial.status !== "active" ||
    !trial.endsAt
  ) {
    return false;
  }

  const endDate =
    new Date(
      trial.endsAt,
    );

  return (
    !Number.isNaN(
      endDate.getTime(),
    ) &&
    endDate.getTime() >
      Date.now()
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

  return typeof seconds ===
    "number"
    ? new Date(
        seconds * 1000,
      )
    : null;
}

/*
 * ---------------------------------------------------------
 * STRIPE SCHOOL SUBSCRIPTION PERSISTENCE
 * ---------------------------------------------------------
 */

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
      ? getSeatLimit(
          planKey,
        )
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

        entitlementTier:
          isSubscriptionActive(
            normaliseStatus(
              subscription.status,
            ),
          )
            ? "school"
            : "free",

        entitlementSource:
          isSubscriptionActive(
            normaliseStatus(
              subscription.status,
            ),
          )
            ? "school_subscription"
            : "free",

        updatedAt:
          new Date(),
      },
      {
        merge: true,
      },
    );
}

/*
 * ---------------------------------------------------------
 * STRIPE INDIVIDUAL SUBSCRIPTION PERSISTENCE
 * ---------------------------------------------------------
 */

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

  const status =
    normaliseStatus(
      subscription.status,
    );

  const active =
    isSubscriptionActive(
      status,
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
          subscription
            .cancel_at_period_end,

        currentPeriodEnd:
          subscriptionPeriodEnd(
            subscription,
          ),

        entitlementTier:
          active
            ? "student_premium"
            : "free",

        entitlementSource:
          active
            ? "individual_subscription"
            : "free",

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

  if (
    userSnapshot.exists
  ) {
    const user =
      userSnapshot.data() ||
      {};

    /*
     * School entitlement remains separate.
     *
     * A student's personal Premium subscription is remembered
     * while they belong to a school and becomes effective again
     * when they later leave the school.
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
          user.accountType !==
          "school"
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

/*
 * ---------------------------------------------------------
 * SCHOOL SUBSCRIPTION SUMMARY
 * ---------------------------------------------------------
 */

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
      ? schoolSnapshot.data() ||
        {}
      : {};

  const schoolName =
    typeof schoolData.name ===
    "string"
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

      cancelAtPeriodEnd:
        false,

      currentPeriodEnd:
        null,

      stripeCustomerId:
        null,

      stripeSubscriptionId:
        null,

      entitlementTier:
        "free",

      entitlementSource:
        "free",

      trialStatus:
        "none",

      trialStartedAt:
        null,

      trialEndsAt:
        null,

      trialDaysRemaining:
        null,
    };
  }

  const data =
    subscriptionSnapshot.data() ||
    {};

  const status =
    normaliseStatus(
      data.status,
    );

  const active =
    isSubscriptionActive(
      status,
    );

  const planKeyValue =
    stringValue(
      data.planKey,
    );

  const planKey:
    SchoolPlanKey | null =
    (
      planKeyValue ===
        "starter" ||
      planKeyValue ===
        "standard" ||
      planKeyValue ===
        "pro"
    )
      ? planKeyValue
      : null;

  const seatLimit =
    numberValue(
      data.seatLimit,
    );

  const currentPeriodEnd =
    firestoreDateToIso(
      data.currentPeriodEnd,
    );

  return {
    schoolId,

    schoolName,

    planKey,

    status,

    active,

    enforcementEnabled:
      billingEnforcementEnabled(),

    seatLimit,

    seatsUsed,

    seatsRemaining:
      Math.max(
        0,
        seatLimit -
          seatsUsed,
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

    entitlementTier:
      active
        ? "school"
        : "free",

    entitlementSource:
      active
        ? "school_subscription"
        : "free",

    trialStatus:
      "none",

    trialStartedAt:
      null,

    trialEndsAt:
      null,

    trialDaysRemaining:
      null,
  };
}

/*
 * ---------------------------------------------------------
 * INDIVIDUAL SUBSCRIPTION SUMMARY
 * ---------------------------------------------------------
 */

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

      cancelAtPeriodEnd:
        false,

      currentPeriodEnd:
        null,

      stripeCustomerId:
        null,

      stripeSubscriptionId:
        null,

      entitlementTier:
        "free",

      entitlementSource:
        "free",
    };
  }

  const data =
    snapshot.data() ||
    {};

  const status =
    normaliseStatus(
      data.status,
    );

  const active =
    isSubscriptionActive(
      status,
    );

  const planKeyValue =
    stringValue(
      data.planKey,
    );

  const planKey:
    IndividualPlanKey | null =
    (
      planKeyValue ===
        "premium_monthly" ||
      planKeyValue ===
        "premium_annual"
    )
      ? planKeyValue
      : null;

  const currentPeriodEnd =
    firestoreDateToIso(
      data.currentPeriodEnd,
    );

  return {
    userId,

    planKey,

    status,

    active,

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

    entitlementTier:
      active
        ? "student_premium"
        : "free",

    entitlementSource:
      active
        ? "individual_subscription"
        : "free",
  };
}

/*
 * ---------------------------------------------------------
 * SCHOOL / TEACHER TRIAL SUMMARY
 * ---------------------------------------------------------
 *
 * Trial documents use:
 *
 * schoolTrials/{userId}
 *
 * A trial belongs to the teacher account that initiated it.
 * schoolId can remain null until a real school workspace is
 * created or attached.
 */

export async function getSchoolTrialSummary(
  userId: string,
): Promise<SchoolTrialSummary> {
  const snapshot =
    await adminDb
      .collection(
        "schoolTrials",
      )
      .doc(userId)
      .get();

  if (!snapshot.exists) {
    return {
      schoolId:
        null,

      userId,

      status:
        "none",

      active:
        false,

      startedAt:
        null,

      endsAt:
        null,

      daysRemaining:
        null,

      convertedAt:
        null,
    };
  }

  const data =
    snapshot.data() ||
    {};

  const storedStatus =
    normaliseTrialStatus(
      data.status,
    );

  const startedAt =
    firestoreDateToIso(
      data.startedAt,
    );

  const endsAt =
    firestoreDateToIso(
      data.endsAt,
    );

  const convertedAt =
    firestoreDateToIso(
      data.convertedAt,
    );

  const daysRemaining =
    calculateTrialDaysRemaining(
      endsAt,
    );

  const active =
    storedStatus ===
      "active" &&
    daysRemaining !== null &&
    daysRemaining > 0;

  /*
   * We do not mutate Firestore simply by reading the trial.
   * The entitlement resolver treats an elapsed active trial
   * as expired immediately even if its stored status has not
   * yet been normalised by a maintenance job.
   */
  const effectiveStatus:
    TrialStatus =
    storedStatus ===
        "active" &&
      !active
      ? "expired"
      : storedStatus;

  return {
    schoolId:
      stringValue(
        data.schoolId,
      ) || null,

    userId,

    status:
      effectiveStatus,

    active,

    startedAt,

    endsAt,

    daysRemaining:
      active
        ? daysRemaining
        : effectiveStatus ===
            "expired"
          ? 0
          : daysRemaining,

    convertedAt,
  };
}

/*
 * ---------------------------------------------------------
 * UNIFIED ENTITLEMENT RESOLVER
 * ---------------------------------------------------------
 *
 * Priority:
 *
 * 1. Active school subscription
 * 2. Active teacher/school trial
 * 3. Active individual Premium subscription
 * 4. Free
 *
 * For students, school access takes priority over their own
 * personal subscription while they are attached to a school.
 *
 * Their personal subscription is still preserved and can
 * become effective again if they later leave the school.
 */

export async function getUserEntitlementSummary(
  userId: string,
): Promise<EntitlementSummary> {
  const userSnapshot =
    await adminDb
      .collection("users")
      .doc(userId)
      .get();

  if (!userSnapshot.exists) {
    throw new Error(
      "User profile not found.",
    );
  }

  const user =
    userSnapshot.data() ||
    {};

  const role =
    stringValue(
      user.role,
    );

  const schoolId =
    stringValue(
      user.schoolId,
    );

  const [
    individualSubscription,
    schoolTrial,
  ] =
    await Promise.all([
      getIndividualSubscriptionSummary(
        userId,
      ),

      role === "teacher" ||
      role === "admin"
        ? getSchoolTrialSummary(
            userId,
          )
        : Promise.resolve<SchoolTrialSummary>({
            schoolId:
              null,

            userId,

            status:
              "none",

            active:
              false,

            startedAt:
              null,

            endsAt:
              null,

            daysRemaining:
              null,

            convertedAt:
              null,
          }),
    ]);

  let schoolSubscription:
    SchoolSubscriptionSummary |
    null =
    null;

  if (schoolId) {
    schoolSubscription =
      await getSchoolSubscriptionSummary(
        schoolId,
      );
  }

  /*
   * -------------------------------------------------------
   * ACTIVE SCHOOL SUBSCRIPTION
   * -------------------------------------------------------
   */

  if (
    schoolSubscription?.active
  ) {
    return {
      tier:
        "school",

      source:
        "school_subscription",

      subscriptionStatus:
        schoolSubscription.status,

      active:
        true,

      premiumStudentAccess:
        true,

      teacherSchoolAccess:
        role === "teacher" ||
        role === "admin",

      trialStatus:
        "none",

      trialStartedAt:
        null,

      trialEndsAt:
        null,

      trialDaysRemaining:
        null,

      cancelAtPeriodEnd:
        schoolSubscription
          .cancelAtPeriodEnd,

      currentPeriodEnd:
        schoolSubscription
          .currentPeriodEnd,

      stripeCustomerId:
        schoolSubscription
          .stripeCustomerId,

      stripeSubscriptionId:
        schoolSubscription
          .stripeSubscriptionId,
    };
  }

  /*
   * -------------------------------------------------------
   * ACTIVE TEACHER / SCHOOL TRIAL
   * -------------------------------------------------------
   */

  if (
    (
      role === "teacher" ||
      role === "admin"
    ) &&
    schoolTrial.active
  ) {
    return {
      tier:
        "school",

      source:
        "school_trial",

      subscriptionStatus:
        "none",

      active:
        true,

      premiumStudentAccess:
        true,

      teacherSchoolAccess:
        true,

      trialStatus:
        "active",

      trialStartedAt:
        schoolTrial.startedAt,

      trialEndsAt:
        schoolTrial.endsAt,

      trialDaysRemaining:
        schoolTrial.daysRemaining,

      cancelAtPeriodEnd:
        false,

      currentPeriodEnd:
        null,

      stripeCustomerId:
        null,

      stripeSubscriptionId:
        null,
    };
  }

  /*
   * -------------------------------------------------------
   * ACTIVE INDIVIDUAL PREMIUM
   * -------------------------------------------------------
   */

  if (
    individualSubscription.active
  ) {
    return {
      tier:
        "student_premium",

      source:
        "individual_subscription",

      subscriptionStatus:
        individualSubscription.status,

      active:
        true,

      premiumStudentAccess:
        true,

      teacherSchoolAccess:
        false,

      trialStatus:
        schoolTrial.status,

      trialStartedAt:
        schoolTrial.startedAt,

      trialEndsAt:
        schoolTrial.endsAt,

      trialDaysRemaining:
        schoolTrial.daysRemaining,

      cancelAtPeriodEnd:
        individualSubscription
          .cancelAtPeriodEnd,

      currentPeriodEnd:
        individualSubscription
          .currentPeriodEnd,

      stripeCustomerId:
        individualSubscription
          .stripeCustomerId,

      stripeSubscriptionId:
        individualSubscription
          .stripeSubscriptionId,
    };
  }

  /*
   * -------------------------------------------------------
   * FREE
   * -------------------------------------------------------
   */

  return {
    tier:
      "free",

    source:
      "free",

    subscriptionStatus:
      individualSubscription.status,

    active:
      false,

    premiumStudentAccess:
      false,

    teacherSchoolAccess:
      false,

    trialStatus:
      schoolTrial.status,

    trialStartedAt:
      schoolTrial.startedAt,

    trialEndsAt:
      schoolTrial.endsAt,

    trialDaysRemaining:
      schoolTrial.daysRemaining,

    cancelAtPeriodEnd:
      individualSubscription
        .cancelAtPeriodEnd,

    currentPeriodEnd:
      individualSubscription
        .currentPeriodEnd,

    stripeCustomerId:
      individualSubscription
        .stripeCustomerId,

    stripeSubscriptionId:
      individualSubscription
        .stripeSubscriptionId,
  };
}

/*
 * ---------------------------------------------------------
 * CONVENIENCE ACCESS HELPERS
 * ---------------------------------------------------------
 */

export async function hasPremiumStudentAccess(
  userId: string,
): Promise<boolean> {
  const entitlement =
    await getUserEntitlementSummary(
      userId,
    );

  return (
    entitlement
      .premiumStudentAccess
  );
}

export async function hasTeacherSchoolAccess(
  userId: string,
): Promise<boolean> {
  const entitlement =
    await getUserEntitlementSummary(
      userId,
    );

  return (
    entitlement
      .teacherSchoolAccess
  );
}

export function entitlementIsPremium(
  tier: EntitlementTier,
): boolean {
  return (
    tier ===
      "student_premium" ||
    tier ===
      "school"
  );
}

export function entitlementSourceIsPaid(
  source: EntitlementSource,
): boolean {
  return (
    source ===
      "individual_subscription" ||
    source ===
      "school_subscription"
  );
}