param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectRoot
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path.TrimEnd("\")
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$parent = Split-Path -Parent $ProjectRoot
$name = Split-Path -Leaf $ProjectRoot
$backup = Join-Path $parent "$name-payments-individual-final-backup-$stamp"
$summary = Join-Path $ProjectRoot "PAYMENTS-INDIVIDUAL-FINAL-SUMMARY.txt"

New-Item -ItemType Directory -Path $backup -Force | Out-Null

function Backup-File {
  param([Parameter(Mandatory = $true)][string]$Path)

  if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
    return
  }

  $relative = $Path.Substring($ProjectRoot.Length).TrimStart("\")
  $destination = Join-Path $backup $relative
  $directory = Split-Path -Parent $destination

  if ($directory) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
  }

  Copy-Item -LiteralPath $Path -Destination $destination -Force
}

function Write-Source {
  param(
    [Parameter(Mandatory = $true)][string]$RelativePath,
    [Parameter(Mandatory = $true)][string]$Content
  )

  $path = Join-Path $ProjectRoot $RelativePath
  $directory = Split-Path -Parent $path

  if ($directory) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
  }

  if (Test-Path -LiteralPath $path -PathType Leaf) {
    Backup-File -Path $path
  }

  [System.IO.File]::WriteAllText(
    $path,
    $Content,
    [System.Text.UTF8Encoding]::new($false)
  )
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " CS MASTER - PAYMENTS + INDIVIDUAL PREMIUM FINAL PASS" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host "Backup:  $backup"
Write-Host ""

# ------------------------------------------------------------
# 1. Billing types - extend for individual premium.
# ------------------------------------------------------------

Write-Source "types\billing.ts" @'
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
'@

# ------------------------------------------------------------
# 2. Plan catalogue - school + individual.
# ------------------------------------------------------------

Write-Source "data\billingPlans.ts" @'
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
    displayPrice: "£499/year",
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
    displayPrice: "£999/year",
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
    displayPrice: "£1,499/year",
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
    displayPrice: "£6.99/month",
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
    displayPrice: "£59.99/year",
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
'@

# ------------------------------------------------------------
# 3. Stripe plan mapping.
# ------------------------------------------------------------

Write-Source "lib\billing\plans.ts" @'
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
'@

# ------------------------------------------------------------
# 4. Replace subscription service - fixes undefined data TS error
#    and adds individual subscription persistence.
# ------------------------------------------------------------

Write-Source "lib\billing\subscription.ts" @'
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
'@

# ------------------------------------------------------------
# 5. Individual billing status API.
# ------------------------------------------------------------

Write-Source "app\api\billing\individual\status\route.ts" @'
import {
  NextResponse,
} from "next/server";

import {
  billingAuthError,
  requireBillingActor,
} from "@/lib/billing/auth";

import {
  getIndividualSubscriptionSummary,
} from "@/lib/billing/subscription";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
) {
  try {
    const actor =
      await requireBillingActor(
        request,
      );

    if (actor.role !== "student") {
      return NextResponse.json(
        {
          error:
            "Individual Premium is available to student accounts.",
        },
        {
          status: 403,
        },
      );
    }

    return NextResponse.json(
      await getIndividualSubscriptionSummary(
        actor.uid,
      ),
    );
  } catch (error) {
    const failure =
      billingAuthError(error);

    return NextResponse.json(
      {
        error:
          failure.message,
      },
      {
        status:
          failure.status,
      },
    );
  }
}
'@

# ------------------------------------------------------------
# 6. Individual checkout API.
# ------------------------------------------------------------

Write-Source "app\api\billing\individual\checkout\route.ts" @'
import {
  NextResponse,
} from "next/server";

import {
  adminAuth,
  adminDb,
} from "@/lib/firebaseAdmin";

import {
  billingAuthError,
  requireBillingActor,
} from "@/lib/billing/auth";

import {
  getIndividualStripePriceId,
} from "@/lib/billing/plans";

import {
  getApplicationUrl,
  getStripe,
} from "@/lib/billing/stripe";

import {
  getIndividualSubscriptionSummary,
} from "@/lib/billing/subscription";

import type {
  IndividualPlanKey,
} from "@/types/billing";

export const runtime = "nodejs";

function isPlanKey(
  value: unknown,
): value is IndividualPlanKey {
  return (
    value === "premium_monthly" ||
    value === "premium_annual"
  );
}

export async function POST(
  request: Request,
) {
  try {
    const actor =
      await requireBillingActor(
        request,
      );

    if (actor.role !== "student") {
      return NextResponse.json(
        {
          error:
            "Individual Premium is available to student accounts.",
        },
        {
          status: 403,
        },
      );
    }

    const body: unknown =
      await request.json();

    const planKey =
      body &&
      typeof body === "object"
        ? (
            body as {
              planKey?: unknown;
            }
          ).planKey
        : null;

    if (!isPlanKey(planKey)) {
      return NextResponse.json(
        {
          error:
            "Choose a valid individual Premium plan.",
        },
        {
          status: 400,
        },
      );
    }

    const existing =
      await getIndividualSubscriptionSummary(
        actor.uid,
      );

    if (
      existing.active &&
      existing.stripeCustomerId
    ) {
      return NextResponse.json(
        {
          error:
            "You already have an active Premium subscription. Use Manage Billing instead.",
        },
        {
          status: 409,
        },
      );
    }

    const stripe =
      getStripe();

    const subscriptionRef =
      adminDb
        .collection(
          "individualSubscriptions",
        )
        .doc(actor.uid);

    const subscriptionSnapshot =
      await subscriptionRef.get();

    const subscriptionData =
      subscriptionSnapshot.exists
        ? subscriptionSnapshot.data() || {}
        : {};

    let customerId =
      typeof subscriptionData
        .stripeCustomerId ===
        "string"
        ? subscriptionData
            .stripeCustomerId
        : "";

    if (!customerId) {
      const userRecord =
        await adminAuth.getUser(
          actor.uid,
        );

      const customer =
        await stripe.customers.create(
          {
            email:
              userRecord.email ||
              undefined,
            metadata: {
              userId:
                actor.uid,
              accountType:
                "individual",
            },
          },
        );

      customerId =
        customer.id;

      await subscriptionRef.set(
        {
          userId:
            actor.uid,
          stripeCustomerId:
            customerId,
          status:
            "none",
          updatedAt:
            new Date(),
        },
        {
          merge: true,
        },
      );
    }

    const appUrl =
      getApplicationUrl();

    const session =
      await stripe.checkout.sessions.create(
        {
          mode:
            "subscription",
          customer:
            customerId,
          line_items: [
            {
              price:
                getIndividualStripePriceId(
                  planKey,
                ),
              quantity: 1,
            },
          ],
          success_url:
            `${appUrl}/upgrade?checkout=success`,
          cancel_url:
            `${appUrl}/upgrade?checkout=cancelled`,
          metadata: {
            userId:
              actor.uid,
            scope:
              "individual",
            planKey,
          },
          subscription_data: {
            metadata: {
              userId:
                actor.uid,
              scope:
                "individual",
              planKey,
            },
          },
          allow_promotion_codes:
            true,
        },
      );

    if (!session.url) {
      throw new Error(
        "Stripe did not return a Checkout URL.",
      );
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    const failure =
      billingAuthError(error);

    return NextResponse.json(
      {
        error:
          failure.message,
      },
      {
        status:
          failure.status,
      },
    );
  }
}
'@

# ------------------------------------------------------------
# 7. Individual portal API.
# ------------------------------------------------------------

Write-Source "app\api\billing\individual\portal\route.ts" @'
import {
  NextResponse,
} from "next/server";

import {
  billingAuthError,
  requireBillingActor,
} from "@/lib/billing/auth";

import {
  getIndividualSubscriptionSummary,
} from "@/lib/billing/subscription";

import {
  getApplicationUrl,
  getStripe,
} from "@/lib/billing/stripe";

export const runtime = "nodejs";

export async function POST(
  request: Request,
) {
  try {
    const actor =
      await requireBillingActor(
        request,
      );

    if (actor.role !== "student") {
      return NextResponse.json(
        {
          error:
            "Individual billing is available to student accounts.",
        },
        {
          status: 403,
        },
      );
    }

    const subscription =
      await getIndividualSubscriptionSummary(
        actor.uid,
      );

    if (
      !subscription.stripeCustomerId
    ) {
      return NextResponse.json(
        {
          error:
            "No Stripe customer exists for this account yet.",
        },
        {
          status: 409,
        },
      );
    }

    const session =
      await getStripe()
        .billingPortal
        .sessions
        .create({
          customer:
            subscription.stripeCustomerId,
          return_url:
            `${getApplicationUrl()}/upgrade`,
        });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    const failure =
      billingAuthError(error);

    return NextResponse.json(
      {
        error:
          failure.message,
      },
      {
        status:
          failure.status,
      },
    );
  }
}
'@

# ------------------------------------------------------------
# 8. Replace webhook with school + individual support.
# ------------------------------------------------------------

Write-Source "app\api\billing\webhook\route.ts" @'
import type Stripe from "stripe";
import {
  NextResponse,
} from "next/server";

import {
  adminDb,
} from "@/lib/firebaseAdmin";

import {
  getStripe,
} from "@/lib/billing/stripe";

import {
  persistIndividualStripeSubscription,
  persistStripeSubscription,
} from "@/lib/billing/subscription";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function persistSubscription(
  subscription: Stripe.Subscription,
  fallback: {
    schoolId?: string;
    userId?: string;
  } = {},
): Promise<void> {
  const scope =
    subscription.metadata.scope ||
    (
      subscription.metadata.userId
        ? "individual"
        : "school"
    );

  if (scope === "individual") {
    await persistIndividualStripeSubscription(
      subscription,
      fallback.userId ||
        "",
    );
    return;
  }

  await persistStripeSubscription(
    subscription,
    fallback.schoolId ||
      "",
  );
}

export async function POST(
  request: Request,
) {
  const signature =
    request.headers.get(
      "stripe-signature",
    );

  const webhookSecret =
    process.env
      .STRIPE_WEBHOOK_SECRET
      ?.trim();

  if (
    !signature ||
    !webhookSecret
  ) {
    return NextResponse.json(
      {
        error:
          "Stripe webhook is not configured.",
      },
      {
        status: 503,
      },
    );
  }

  try {
    const payload =
      await request.text();

    const stripe =
      getStripe();

    const event =
      stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );

    const eventRef =
      adminDb
        .collection(
          "stripeWebhookEvents",
        )
        .doc(event.id);

    const existing =
      await eventRef.get();

    if (existing.exists) {
      return NextResponse.json({
        received: true,
        duplicate: true,
      });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session =
          event.data
            .object as Stripe.Checkout.Session;

        if (
          typeof session.subscription ===
          "string"
        ) {
          const subscription =
            await stripe.subscriptions.retrieve(
              session.subscription,
            );

          await persistSubscription(
            subscription,
            {
              schoolId:
                session.metadata
                  ?.schoolId ||
                "",
              userId:
                session.metadata
                  ?.userId ||
                "",
            },
          );
        }

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await persistSubscription(
          event.data
            .object as Stripe.Subscription,
        );
        break;
      }

      default:
        break;
    }

    await eventRef.set({
      type:
        event.type,
      processedAt:
        new Date(),
      livemode:
        event.livemode,
    });

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(
      "Stripe webhook error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Webhook processing failed.",
      },
      {
        status: 400,
      },
    );
  }
}
'@

# ------------------------------------------------------------
# 9. Replace client billing service with individual helpers.
# ------------------------------------------------------------

Write-Source "services\billingClientService.ts" @'
import {
  auth,
} from "@/lib/firebase";

import type {
  IndividualPlanKey,
  IndividualSubscriptionSummary,
  SchoolPlanKey,
  SchoolSubscriptionSummary,
} from "@/types/billing";

async function authHeaders(): Promise<
  Record<string, string>
> {
  const user =
    auth.currentUser;

  if (!user) {
    throw new Error(
      "Sign in to continue.",
    );
  }

  return {
    "Content-Type":
      "application/json",
    Authorization:
      `Bearer ${await user.getIdToken()}`,
  };
}

async function jsonResponse<T>(
  response: Response,
): Promise<T> {
  const data =
    (await response.json()) as
      T & {
        error?: string;
      };

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Billing request failed.",
    );
  }

  return data;
}

export async function getSchoolSubscription(): Promise<SchoolSubscriptionSummary> {
  const response =
    await fetch(
      "/api/billing/status",
      {
        headers:
          await authHeaders(),
        cache:
          "no-store",
      },
    );

  return jsonResponse<SchoolSubscriptionSummary>(
    response,
  );
}

export async function getIndividualSubscription(): Promise<IndividualSubscriptionSummary> {
  const response =
    await fetch(
      "/api/billing/individual/status",
      {
        headers:
          await authHeaders(),
        cache:
          "no-store",
      },
    );

  return jsonResponse<IndividualSubscriptionSummary>(
    response,
  );
}

export async function startSchoolCheckout(
  planKey: SchoolPlanKey,
): Promise<void> {
  const response =
    await fetch(
      "/api/billing/checkout",
      {
        method: "POST",
        headers:
          await authHeaders(),
        body:
          JSON.stringify({
            planKey,
          }),
      },
    );

  const result =
    await jsonResponse<{
      url: string;
    }>(response);

  window.location.assign(
    result.url,
  );
}

export async function startIndividualCheckout(
  planKey: IndividualPlanKey,
): Promise<void> {
  const response =
    await fetch(
      "/api/billing/individual/checkout",
      {
        method: "POST",
        headers:
          await authHeaders(),
        body:
          JSON.stringify({
            planKey,
          }),
      },
    );

  const result =
    await jsonResponse<{
      url: string;
    }>(response);

  window.location.assign(
    result.url,
  );
}

export async function openBillingPortal(): Promise<void> {
  const response =
    await fetch(
      "/api/billing/portal",
      {
        method: "POST",
        headers:
          await authHeaders(),
      },
    );

  const result =
    await jsonResponse<{
      url: string;
    }>(response);

  window.location.assign(
    result.url,
  );
}

export async function openIndividualBillingPortal(): Promise<void> {
  const response =
    await fetch(
      "/api/billing/individual/portal",
      {
        method: "POST",
        headers:
          await authHeaders(),
      },
    );

  const result =
    await jsonResponse<{
      url: string;
    }>(response);

  window.location.assign(
    result.url,
  );
}

export async function acceptSchoolInviteWithBilling(
  code: string,
): Promise<{
  schoolId: string;
  role: "student" | "teacher";
}> {
  const response =
    await fetch(
      "/api/schools/join",
      {
        method: "POST",
        headers:
          await authHeaders(),
        body:
          JSON.stringify({
            code,
          }),
      },
    );

  return jsonResponse(
    response,
  );
}
'@

# ------------------------------------------------------------
# 10. Replace teacher billing page to remove lint issue.
# ------------------------------------------------------------

Write-Source "app\teacher\billing\page.tsx" @'
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
                      <span>✓</span>
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
'@

# ------------------------------------------------------------
# 11. Replace SchoolSubscriptionGate to remove effect lint and apostrophe issue.
# ------------------------------------------------------------

Write-Source "components\billing\SchoolSubscriptionGate.tsx" @'
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
'@

# ------------------------------------------------------------
# 12. Individual entitlement gate.
# ------------------------------------------------------------

Write-Source "components\billing\IndividualPremiumGate.tsx" @'
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
'@

# ------------------------------------------------------------
# 13. Individual upgrade page.
# ------------------------------------------------------------

Write-Source "app\upgrade\page.tsx" @'
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
                      <span>✓</span>
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
'@

# ------------------------------------------------------------
# 14. Wire IndividualPremiumGate into StudentAccessGate.
# ------------------------------------------------------------

$studentGatePath = Join-Path $ProjectRoot "components\student\StudentAccessGate.tsx"
if (-not (Test-Path -LiteralPath $studentGatePath -PathType Leaf)) {
  throw "StudentAccessGate.tsx was not found."
}

Backup-File -Path $studentGatePath
$studentGate = [System.IO.File]::ReadAllText($studentGatePath)

if (-not $studentGate.Contains("IndividualPremiumGate")) {
  $studentGate = $studentGate.Replace(
    'import SchoolSubscriptionGate from "@/components/billing/SchoolSubscriptionGate";',
    'import SchoolSubscriptionGate from "@/components/billing/SchoolSubscriptionGate";' + "`r`n" +
    'import IndividualPremiumGate from "@/components/billing/IndividualPremiumGate";'
  )
}

$studentGate = $studentGate.Replace(
  '  return <SchoolSubscriptionGate>{children}</SchoolSubscriptionGate>;',
  '  return (' + "`r`n" +
  '    <IndividualPremiumGate>' + "`r`n" +
  '      <SchoolSubscriptionGate>' + "`r`n" +
  '        {children}' + "`r`n" +
  '      </SchoolSubscriptionGate>' + "`r`n" +
  '    </IndividualPremiumGate>' + "`r`n" +
  '  );'
)

[System.IO.File]::WriteAllText(
  $studentGatePath,
  $studentGate,
  [System.Text.UTF8Encoding]::new($false)
)

# ------------------------------------------------------------
# 15. Update env template with five Stripe prices.
# ------------------------------------------------------------

Write-Source ".env.billing.example" @'
# CS Master Stripe billing - TEST MODE
# Copy these values into .env.local.
# Never commit real Stripe secret keys.

NEXT_PUBLIC_APP_URL=http://localhost:3000

STRIPE_SECRET_KEY=sk_test_REPLACE_ME
STRIPE_WEBHOOK_SECRET=whsec_REPLACE_ME

# Individual Premium
STRIPE_PRICE_INDIVIDUAL_PREMIUM_MONTHLY=price_REPLACE_ME
STRIPE_PRICE_INDIVIDUAL_PREMIUM_ANNUAL=price_REPLACE_ME

# School subscriptions
STRIPE_PRICE_SCHOOL_STARTER=price_REPLACE_ME
STRIPE_PRICE_SCHOOL_STANDARD=price_REPLACE_ME
STRIPE_PRICE_SCHOOL_PRO=price_REPLACE_ME

# Keep off during ordinary development.
# Use strict only during subscription entitlement QA.
BILLING_ENFORCEMENT_MODE=off
'@

# ------------------------------------------------------------
# 16. Update health endpoint if possible.
# ------------------------------------------------------------

$healthPath = Join-Path $ProjectRoot "app\api\health\route.ts"
if (Test-Path -LiteralPath $healthPath -PathType Leaf) {
  Backup-File -Path $healthPath
  $health = [System.IO.File]::ReadAllText($healthPath)

  if (
    $health.Contains("stripeBilling") -and
    -not $health.Contains("STRIPE_PRICE_INDIVIDUAL_PREMIUM_MONTHLY")
  ) {
    $health = $health.Replace(
      '      present("STRIPE_WEBHOOK_SECRET") &&',
      '      present("STRIPE_WEBHOOK_SECRET") &&' + "`r`n" +
      '      present("STRIPE_PRICE_INDIVIDUAL_PREMIUM_MONTHLY") &&' + "`r`n" +
      '      present("STRIPE_PRICE_INDIVIDUAL_PREMIUM_ANNUAL") &&'
    )

    [System.IO.File]::WriteAllText(
      $healthPath,
      $health,
      [System.Text.UTF8Encoding]::new($false)
    )
  }
}

# ------------------------------------------------------------
# 17. Verification.
# ------------------------------------------------------------

$required = @(
  "app\api\billing\individual\status\route.ts",
  "app\api\billing\individual\checkout\route.ts",
  "app\api\billing\individual\portal\route.ts",
  "app\upgrade\page.tsx",
  "components\billing\IndividualPremiumGate.tsx",
  "components\billing\SchoolSubscriptionGate.tsx",
  "app\teacher\billing\page.tsx",
  "lib\billing\subscription.ts",
  "services\billingClientService.ts",
  ".env.billing.example"
)

$checks = New-Object System.Collections.Generic.List[string]
$failed = New-Object System.Collections.Generic.List[string]

foreach ($relative in $required) {
  if (Test-Path -LiteralPath (Join-Path $ProjectRoot $relative) -PathType Leaf) {
    $checks.Add("[OK] $relative")
  }
  else {
    $failed.Add("Missing file: $relative")
  }
}

$envExample = [System.IO.File]::ReadAllText(
  (Join-Path $ProjectRoot ".env.billing.example")
)

foreach ($signal in @(
  "STRIPE_PRICE_INDIVIDUAL_PREMIUM_MONTHLY",
  "STRIPE_PRICE_INDIVIDUAL_PREMIUM_ANNUAL",
  "STRIPE_PRICE_SCHOOL_STARTER",
  "STRIPE_PRICE_SCHOOL_STANDARD",
  "STRIPE_PRICE_SCHOOL_PRO"
)) {
  if ($envExample.Contains($signal)) {
    $checks.Add("[OK] Environment key: $signal")
  }
  else {
    $failed.Add("Missing environment key: $signal")
  }
}

# ------------------------------------------------------------
# 18. ESLint + production build.
# ------------------------------------------------------------

$lintStatus = "NOT RUN"
$lintExit = $null
$buildStatus = "NOT RUN"
$buildExit = $null

Push-Location $ProjectRoot
try {
  Write-Host ""
  Write-Host "Running ESLint..." -ForegroundColor Cyan
  & npx.cmd eslint .
  $lintExit = $LASTEXITCODE
  $lintStatus = if ($lintExit -eq 0) { "PASS" } else { "FAIL" }

  Write-Host ""
  Write-Host "Running production build..." -ForegroundColor Cyan
  & npm.cmd run build
  $buildExit = $LASTEXITCODE
  $buildStatus = if ($buildExit -eq 0) { "PASS" } else { "FAIL" }
}
finally {
  Pop-Location
}

if (
  $failed.Count -eq 0 -and
  $lintStatus -eq "PASS" -and
  $buildStatus -eq "PASS"
) {
  $status = "CODE PASS - STRIPE SANDBOX CONFIGURATION REQUIRED"
}
else {
  $status = "NOT YET PASSED"
}

$lines = New-Object System.Collections.Generic.List[string]

$lines.Add("CS MASTER - PAYMENTS + INDIVIDUAL PREMIUM FINAL PASS")
$lines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$lines.Add("Project: $ProjectRoot")
$lines.Add("Backup: $backup")
$lines.Add("")
$lines.Add("IMPLEMENTED / FIXED")
$lines.Add("-------------------")
$lines.Add("Fixed billing React effect lint findings.")
$lines.Add("Fixed subscription Firestore undefined-data TypeScript finding.")
$lines.Add("Added Individual Premium Monthly at GBP 6.99/month.")
$lines.Add("Added Individual Premium Annual at GBP 59.99/year.")
$lines.Add("Added individual Stripe Checkout, Billing Portal and status routes.")
$lines.Add("Extended verified webhook processing to individual subscriptions.")
$lines.Add("Individual subscription state updates existing free/premium user plan.")
$lines.Add("Added /upgrade Premium page.")
$lines.Add("Added individual Premium entitlement gate for advanced student routes.")
$lines.Add("Preserved school billing, seat limits and development enforcement bypass.")
$lines.Add("")
$lines.Add("VERIFICATION")
$lines.Add("------------")

foreach ($item in $checks) {
  $lines.Add($item)
}

foreach ($item in $failed) {
  $lines.Add("[FAIL] $item")
}

$lines.Add("")
$lines.Add("ESLINT")
$lines.Add("------")
$lines.Add("Status: $lintStatus")
$lines.Add("Exit code: $lintExit")
$lines.Add("")
$lines.Add("PRODUCTION BUILD")
$lines.Add("----------------")
$lines.Add("Status: $buildStatus")
$lines.Add("Exit code: $buildExit")
$lines.Add("")
$lines.Add("PAYMENTS + SUBSCRIPTIONS PHASE STATUS")
$lines.Add("-------------------------------------")
$lines.Add($status)
$lines.Add("")
$lines.Add("NEXT")
$lines.Add("----")
$lines.Add("Create five Stripe sandbox recurring prices.")
$lines.Add("Add test Stripe keys and five price IDs to .env.local.")
$lines.Add("Configure the Stripe webhook endpoint.")
$lines.Add("Test individual monthly/annual checkout and cancellation.")
$lines.Add("Test school checkout, seat limits and cancellation.")
$lines.Add("Keep BILLING_ENFORCEMENT_MODE=off until checkout/webhooks are confirmed.")

[System.IO.File]::WriteAllLines(
  $summary,
  $lines,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " PAYMENTS + INDIVIDUAL PREMIUM FINAL PASS COMPLETE" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Status: $status"