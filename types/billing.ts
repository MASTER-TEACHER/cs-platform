export type SchoolPlanKey =
  | "starter"
  | "standard"
  | "pro";

export type IndividualPlanKey =
  | "premium_monthly"
  | "premium_annual";

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

export type SchoolSubscriptionSummary = {
  schoolId: string;
  schoolName: string;
  planKey: SchoolPlanKey | null;
  status: SchoolSubscriptionStatus;
  active: boolean;
  enforcementEnabled: boolean;
  seatLimit: number;
  seatsUsed: number;
  seatsRemaining: number;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
};

export type IndividualSubscriptionSummary = {
  userId: string;
  planKey: IndividualPlanKey | null;
  status: SchoolSubscriptionStatus;
  active: boolean;
  enforcementEnabled: boolean;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
};