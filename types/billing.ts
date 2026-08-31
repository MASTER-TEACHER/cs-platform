export type SchoolPlanKey =
  | "starter"
  | "standard"
  | "pro";

export type IndividualPlanKey =
  | "premium_monthly"
  | "premium_annual";

/*
 * ---------------------------------------------------------
 * STRIPE SUBSCRIPTION STATUS
 * ---------------------------------------------------------
 *
 * Keep the existing SchoolSubscriptionStatus name because
 * current billing routes/components may already import it.
 *
 * SubscriptionStatus is provided as the more general alias
 * for new entitlement code.
 */

export type SchoolSubscriptionStatus =
  | "none"
  | "trialing"
  | "active"
  | "past_due"
  | "unpaid"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "paused";

export type SubscriptionStatus =
  SchoolSubscriptionStatus;

/*
 * ---------------------------------------------------------
 * ENTITLEMENTS
 * ---------------------------------------------------------
 *
 * Authentication/role and commercial access are deliberately
 * separate concepts.
 *
 * A student can be role="student" while their entitlement is
 * free, individual premium, or school-provided.
 *
 * A teacher can remain role="teacher" even after a school
 * trial expires.
 */

export type EntitlementTier =
  | "free"
  | "student_premium"
  | "school";

export type EntitlementSource =
  | "free"
  | "individual_subscription"
  | "school_subscription"
  | "school_trial";

export type TrialStatus =
  | "none"
  | "active"
  | "expired"
  | "converted";

/*
 * ---------------------------------------------------------
 * FEATURE ACCESS
 * ---------------------------------------------------------
 *
 * These keys give CS Master one central vocabulary for
 * Premium-gated features.
 *
 * Free users can still SEE these features in navigation and
 * dashboards. The entitlement layer decides whether clicking
 * opens the feature or a Premium preview/upgrade experience.
 */

export type PremiumFeatureKey =
  | "full_curriculum"
  | "all_exam_boards"
  | "adaptive_learning"
  | "knowledge_map"
  | "advanced_analytics"
  | "ai_tutor"
  | "revision_plan"
  | "exam_mode"
  | "exam_trainer"
  | "full_quiz_bank"
  | "programming_lab"
  | "visualisers"
  | "advanced_marking"
  | "teacher_dashboard"
  | "classes"
  | "assignments"
  | "student_monitoring"
  | "interventions"
  | "teacher_reports"
  | "school_analytics"
  | "school_administration";

export type PremiumFeatureAudience =
  | "student"
  | "teacher"
  | "school";

export type PremiumFeatureMetadata = {
  key: PremiumFeatureKey;
  title: string;
  shortDescription: string;
  benefits: string[];
  audience: PremiumFeatureAudience;
  requiredTier:
    | "student_premium"
    | "school";
};

/*
 * ---------------------------------------------------------
 * GENERIC ENTITLEMENT SUMMARY
 * ---------------------------------------------------------
 *
 * This becomes the common access model used by navigation,
 * feature gates and upgrade prompts.
 */

export type EntitlementSummary = {
  tier: EntitlementTier;

  source: EntitlementSource;

  subscriptionStatus:
    SubscriptionStatus;

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

/*
 * ---------------------------------------------------------
 * SCHOOL TRIAL
 * ---------------------------------------------------------
 */

export type SchoolTrialSummary = {
  schoolId: string | null;

  userId: string;

  status: TrialStatus;

  active: boolean;

  startedAt: string | null;

  endsAt: string | null;

  daysRemaining: number | null;

  convertedAt: string | null;
};

/*
 * ---------------------------------------------------------
 * SCHOOL SUBSCRIPTION SUMMARY
 * ---------------------------------------------------------
 *
 * Existing fields are preserved.
 *
 * New entitlement/trial fields are optional so older call
 * sites do not immediately break while we migrate them.
 */

export type SchoolSubscriptionSummary = {
  schoolId: string;

  schoolName: string;

  planKey:
    | SchoolPlanKey
    | null;

  status:
    SchoolSubscriptionStatus;

  active: boolean;

  enforcementEnabled: boolean;

  seatLimit: number;

  seatsUsed: number;

  seatsRemaining: number;

  cancelAtPeriodEnd: boolean;

  currentPeriodEnd: string | null;

  stripeCustomerId: string | null;

  stripeSubscriptionId: string | null;

  entitlementTier?:
    EntitlementTier;

  entitlementSource?:
    EntitlementSource;

  trialStatus?:
    TrialStatus;

  trialStartedAt?:
    string | null;

  trialEndsAt?:
    string | null;

  trialDaysRemaining?:
    number | null;
};

/*
 * ---------------------------------------------------------
 * INDIVIDUAL SUBSCRIPTION SUMMARY
 * ---------------------------------------------------------
 *
 * Existing fields are preserved.
 */

export type IndividualSubscriptionSummary = {
  userId: string;

  planKey:
    | IndividualPlanKey
    | null;

  status:
    SchoolSubscriptionStatus;

  active: boolean;

  enforcementEnabled: boolean;

  cancelAtPeriodEnd: boolean;

  currentPeriodEnd: string | null;

  stripeCustomerId: string | null;

  stripeSubscriptionId: string | null;

  entitlementTier?:
    EntitlementTier;

  entitlementSource?:
    EntitlementSource;
};

/*
 * ---------------------------------------------------------
 * STORED BILLING / ENTITLEMENT RECORD
 * ---------------------------------------------------------
 *
 * Intended for the server-side commercial model.
 *
 * Date values are represented as strings at this type layer
 * so they are easy to pass through API responses. Firestore
 * services can convert them to/from Timestamp as required.
 */

export type UserEntitlementRecord = {
  userId: string;

  tier: EntitlementTier;

  source: EntitlementSource;

  subscriptionStatus:
    SubscriptionStatus;

  individualPlanKey:
    | IndividualPlanKey
    | null;

  schoolPlanKey:
    | SchoolPlanKey
    | null;

  schoolId: string | null;

  stripeCustomerId: string | null;

  stripeSubscriptionId: string | null;

  currentPeriodStart:
    string | null;

  currentPeriodEnd:
    string | null;

  cancelAtPeriodEnd: boolean;

  trialStatus: TrialStatus;

  trialStartedAt: string | null;

  trialEndsAt: string | null;

  trialConvertedAt:
    string | null;

  updatedAt: string | null;
};

/*
 * ---------------------------------------------------------
 * WEBHOOK IDEMPOTENCY
 * ---------------------------------------------------------
 */

export type StripeEventRecord = {
  eventId: string;

  type: string;

  processedAt: string;

  livemode: boolean;

  stripeObjectId:
    | string
    | null;
};

/*
 * ---------------------------------------------------------
 * ACCESS DECISIONS
 * ---------------------------------------------------------
 *
 * Useful for shared gates/components.
 */

export type FeatureAccessDecision = {
  allowed: boolean;

  feature:
    PremiumFeatureKey;

  tier:
    EntitlementTier;

  source:
    EntitlementSource;

  reason:
    | "allowed"
    | "premium_required"
    | "school_required"
    | "trial_expired"
    | "subscription_inactive"
    | "subscription_past_due";

  upgradeRecommended: boolean;
};