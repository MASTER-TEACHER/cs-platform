import type {
  IndividualPlanKey,
  SchoolPlanKey,
} from "@/types/billing";

export type BillingPlan = {
  key: SchoolPlanKey;
  name: string;
  displayPrice: string;
  seatLimit: number;
  description: string;
  highlights: string[];
};

export type IndividualBillingPlan = {
  key: IndividualPlanKey;
  name: string;
  displayPrice: string;
  description: string;
  highlights: string[];
};

export const BILLING_PLANS: BillingPlan[] = [
  {
    key: "starter",
    name: "School Starter",
    displayPrice: "Â£499/year",
    seatLimit: 100,
    description:
      "For smaller departments starting with CS Master.",
    highlights: [
      "Up to 100 student seats",
      "Teacher workspace",
      "Assignments and analytics",
      "Curriculum and programming tools",
    ],
  },
  {
    key: "standard",
    name: "School Standard",
    displayPrice: "Â£999/year",
    seatLimit: 300,
    description:
      "For most secondary-school Computer Science departments.",
    highlights: [
      "Up to 300 student seats",
      "Full teacher intelligence",
      "Exam Mode and integrity monitoring",
      "AI Tutor and adaptive learning",
    ],
  },
  {
    key: "pro",
    name: "School Pro",
    displayPrice: "Â£1,499/year",
    seatLimit: 1000,
    description:
      "For large schools and high-usage departments.",
    highlights: [
      "Up to 1,000 student seats",
      "Full CS Master platform",
      "Advanced analytics and interventions",
      "Priority commercial capacity",
    ],
  },
];

export const INDIVIDUAL_BILLING_PLANS: IndividualBillingPlan[] = [
  {
    key: "premium_monthly",
    name: "Premium Monthly",
    displayPrice: "Â£6.99/month",
    description:
      "Flexible monthly access to the complete individual student platform.",
    highlights: [
      "Full GCSE and A-level learning",
      "Programming practice",
      "Adaptive learning",
      "Exam Mode",
      "AI Tutor",
      "Detailed analytics",
    ],
  },
  {
    key: "premium_annual",
    name: "Premium Annual",
    displayPrice: "Â£59.99/year",
    description:
      "The same Premium access with a lower effective monthly cost.",
    highlights: [
      "Everything in Premium Monthly",
      "One annual payment",
      "Best individual value",
      "Cancel through Stripe Billing Portal",
    ],
  },
];

export function getBillingPlan(
  key: SchoolPlanKey,
): BillingPlan {
  const plan = BILLING_PLANS.find(
    (item) => item.key === key,
  );

  if (!plan) {
    throw new Error("Unknown billing plan.");
  }

  return plan;
}