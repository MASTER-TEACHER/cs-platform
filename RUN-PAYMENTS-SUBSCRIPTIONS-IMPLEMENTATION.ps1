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
$backup = Join-Path $parent "$name-payments-implementation-backup-$stamp"
$summary = Join-Path $ProjectRoot "PAYMENTS-SUBSCRIPTIONS-IMPLEMENTATION-SUMMARY.txt"

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
Write-Host " CS MASTER - PAYMENTS + SUBSCRIPTIONS IMPLEMENTATION" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host "Backup:  $backup"
Write-Host ""

# ------------------------------------------------------------
# 1. Install Stripe SDK.
# ------------------------------------------------------------

$packageJson = Join-Path $ProjectRoot "package.json"
$packageLock = Join-Path $ProjectRoot "package-lock.json"

Backup-File -Path $packageJson
Backup-File -Path $packageLock

Push-Location $ProjectRoot
try {
  Write-Host "Installing Stripe SDK..." -ForegroundColor Cyan
  & npm.cmd install stripe
  if ($LASTEXITCODE -ne 0) {
    throw "npm install stripe failed."
  }
}
finally {
  Pop-Location
}

# ------------------------------------------------------------
# 2. Billing types.
# ------------------------------------------------------------

Write-Source "types\billing.ts" @'
export type SchoolPlanKey =
  | "starter"
  | "standard"
  | "pro";

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
'@

# ------------------------------------------------------------
# 3. Public plan catalogue.
# ------------------------------------------------------------

Write-Source "data\billingPlans.ts" @'
import type { SchoolPlanKey } from "@/types/billing";

export type BillingPlan = {
  key: SchoolPlanKey;
  name: string;
  displayPrice: string;
  seatLimit: number;
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
# 4. Stripe server client.
# ------------------------------------------------------------

Write-Source "lib\billing\stripe.ts" @'
import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  const secretKey =
    process.env.STRIPE_SECRET_KEY?.trim();

  if (!secretKey) {
    throw new Error(
      "Stripe is not configured. Add STRIPE_SECRET_KEY to the server environment.",
    );
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }

  return stripeClient;
}

export function billingEnforcementEnabled(): boolean {
  return (
    process.env.BILLING_ENFORCEMENT_MODE ===
    "strict"
  );
}

export function getApplicationUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    "http://localhost:3000"
  ).replace(/\/+$/, "");
}
'@

# ------------------------------------------------------------
# 5. Plan-to-Stripe price resolution.
# ------------------------------------------------------------

Write-Source "lib\billing\plans.ts" @'
import {
  getBillingPlan,
} from "@/data/billingPlans";

import type {
  SchoolPlanKey,
} from "@/types/billing";

const PRICE_ENV: Record<
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

export function getStripePriceId(
  planKey: SchoolPlanKey,
): string {
  const envName =
    PRICE_ENV[planKey];

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
        PRICE_ENV[planKey]
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
# 6. Server authentication and school billing ownership.
# ------------------------------------------------------------

Write-Source "lib\billing\auth.ts" @'
import type {
  DecodedIdToken,
} from "firebase-admin/auth";

import {
  adminAuth,
  adminDb,
} from "@/lib/firebaseAdmin";

export type BillingActor = {
  token: DecodedIdToken;
  uid: string;
  role: string;
  schoolId: string;
};

export function readBearerToken(
  request: Request,
): string {
  const authorization =
    request.headers.get(
      "authorization",
    ) || "";

  if (
    !authorization.startsWith(
      "Bearer ",
    )
  ) {
    return "";
  }

  return authorization
    .slice("Bearer ".length)
    .trim();
}

export async function requireBillingActor(
  request: Request,
): Promise<BillingActor> {
  const idToken =
    readBearerToken(request);

  if (!idToken) {
    throw new Error(
      "AUTH_REQUIRED",
    );
  }

  const token =
    await adminAuth.verifyIdToken(
      idToken,
    );

  const profileSnapshot =
    await adminDb
      .collection("users")
      .doc(token.uid)
      .get();

  if (!profileSnapshot.exists) {
    throw new Error(
      "PROFILE_NOT_FOUND",
    );
  }

  const profile =
    profileSnapshot.data() || {};

  return {
    token,
    uid: token.uid,
    role:
      typeof profile.role ===
      "string"
        ? profile.role
        : "",
    schoolId:
      typeof profile.schoolId ===
      "string"
        ? profile.schoolId.trim()
        : "",
  };
}

export async function requireSchoolBillingManager(
  request: Request,
): Promise<
  BillingActor & {
    schoolId: string;
    schoolName: string;
  }
> {
  const actor =
    await requireBillingActor(
      request,
    );

  if (
    actor.role !== "teacher" &&
    actor.role !== "admin"
  ) {
    throw new Error(
      "BILLING_MANAGER_REQUIRED",
    );
  }

  if (!actor.schoolId) {
    throw new Error(
      "SCHOOL_REQUIRED",
    );
  }

  const schoolSnapshot =
    await adminDb
      .collection("schools")
      .doc(actor.schoolId)
      .get();

  if (!schoolSnapshot.exists) {
    throw new Error(
      "SCHOOL_NOT_FOUND",
    );
  }

  const school =
    schoolSnapshot.data() || {};

  if (
    actor.role !== "admin" &&
    school.ownerUserId !== actor.uid
  ) {
    const memberSnapshot =
      await adminDb
        .collection("schools")
        .doc(actor.schoolId)
        .collection("members")
        .doc(actor.uid)
        .get();

    const membership =
      memberSnapshot.exists
        ? memberSnapshot.data()
        : null;

    if (
      membership?.role !==
        "school_admin" ||
      membership?.status !==
        "active"
    ) {
      throw new Error(
        "SCHOOL_ADMIN_REQUIRED",
      );
    }
  }

  return {
    ...actor,
    schoolId: actor.schoolId,
    schoolName:
      typeof school.name ===
      "string"
        ? school.name
        : "CS Master School",
  };
}

export function billingAuthError(
  error: unknown,
): {
  status: number;
  message: string;
} {
  const code =
    error instanceof Error
      ? error.message
      : "";

  switch (code) {
    case "AUTH_REQUIRED":
      return {
        status: 401,
        message:
          "Sign in to manage billing.",
      };
    case "PROFILE_NOT_FOUND":
      return {
        status: 403,
        message:
          "Your CS Master profile could not be found.",
      };
    case "BILLING_MANAGER_REQUIRED":
      return {
        status: 403,
        message:
          "Teacher or administrator access is required.",
      };
    case "SCHOOL_REQUIRED":
      return {
        status: 409,
        message:
          "Create or join a school before managing a school subscription.",
      };
    case "SCHOOL_NOT_FOUND":
      return {
        status: 404,
        message:
          "The school could not be found.",
      };
    case "SCHOOL_ADMIN_REQUIRED":
      return {
        status: 403,
        message:
          "Only the school owner or a school administrator can manage billing.",
      };
    default:
      return {
        status: 500,
        message:
          error instanceof Error
            ? error.message
            : "Billing request failed.",
      };
  }
}
'@

# ------------------------------------------------------------
# 7. Subscription persistence / summary.
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
  getPlanFromPriceId,
  getSeatLimit,
} from "@/lib/billing/plans";

import type {
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

export async function getSchoolSubscriptionSummary(
  schoolId: string,
): Promise<SchoolSubscriptionSummary> {
  const schoolSnapshot =
    await adminDb
      .collection("schools")
      .doc(schoolId)
      .get();

  const schoolName =
    schoolSnapshot.exists &&
    typeof schoolSnapshot.data()
      ?.name === "string"
      ? schoolSnapshot.data()
          ?.name
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
    subscriptionSnapshot.data();

  const status =
    stringValue(
      data.status,
    ) as SchoolSubscriptionStatus;

  const planKeyValue =
    stringValue(
      data.planKey,
    );

  const planKey =
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
    status:
      status || "none",
    active:
      isSubscriptionActive(
        status || "none",
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
'@

# ------------------------------------------------------------
# 8. Billing status API.
# ------------------------------------------------------------

Write-Source "app\api\billing\status\route.ts" @'
import {
  NextResponse,
} from "next/server";

import {
  billingAuthError,
  requireBillingActor,
} from "@/lib/billing/auth";

import {
  getSchoolSubscriptionSummary,
} from "@/lib/billing/subscription";

import {
  billingEnforcementEnabled,
} from "@/lib/billing/stripe";

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

    if (!actor.schoolId) {
      return NextResponse.json({
        schoolId: "",
        schoolName: "",
        planKey: null,
        status: "none",
        active: false,
        enforcementEnabled:
          billingEnforcementEnabled(),
        seatLimit: 0,
        seatsUsed: 0,
        seatsRemaining: 0,
        cancelAtPeriodEnd: false,
        currentPeriodEnd: null,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
      });
    }

    return NextResponse.json(
      await getSchoolSubscriptionSummary(
        actor.schoolId,
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
# 9. Checkout API.
# ------------------------------------------------------------

Write-Source "app\api\billing\checkout\route.ts" @'
import {
  NextResponse,
} from "next/server";

import {
  adminDb,
} from "@/lib/firebaseAdmin";

import {
  billingAuthError,
  requireSchoolBillingManager,
} from "@/lib/billing/auth";

import {
  getStripePriceId,
} from "@/lib/billing/plans";

import {
  getApplicationUrl,
  getStripe,
} from "@/lib/billing/stripe";

import {
  getSchoolSubscriptionSummary,
} from "@/lib/billing/subscription";

import type {
  SchoolPlanKey,
} from "@/types/billing";

export const runtime = "nodejs";

function isPlanKey(
  value: unknown,
): value is SchoolPlanKey {
  return (
    value === "starter" ||
    value === "standard" ||
    value === "pro"
  );
}

export async function POST(
  request: Request,
) {
  try {
    const manager =
      await requireSchoolBillingManager(
        request,
      );

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
            "Choose a valid school plan.",
        },
        {
          status: 400,
        },
      );
    }

    const existing =
      await getSchoolSubscriptionSummary(
        manager.schoolId,
      );

    if (
      existing.active &&
      existing.stripeCustomerId
    ) {
      return NextResponse.json(
        {
          error:
            "This school already has an active subscription. Use Manage Billing instead.",
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
          "schoolSubscriptions",
        )
        .doc(manager.schoolId);

    const subscriptionSnapshot =
      await subscriptionRef.get();

    let customerId =
      subscriptionSnapshot.exists &&
      typeof subscriptionSnapshot
        .data()
        ?.stripeCustomerId ===
        "string"
        ? subscriptionSnapshot
            .data()
            ?.stripeCustomerId
        : "";

    if (!customerId) {
      const userRecord =
        await adminAuthUser(
          manager.uid,
        );

      const customer =
        await stripe.customers.create(
          {
            email:
              userRecord.email ||
              undefined,
            name:
              manager.schoolName,
            metadata: {
              schoolId:
                manager.schoolId,
              ownerUid:
                manager.uid,
            },
          },
        );

      customerId =
        customer.id;

      await subscriptionRef.set(
        {
          schoolId:
            manager.schoolId,
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
                getStripePriceId(
                  planKey,
                ),
              quantity: 1,
            },
          ],
          success_url:
            `${appUrl}/teacher/billing?checkout=success`,
          cancel_url:
            `${appUrl}/teacher/billing?checkout=cancelled`,
          metadata: {
            schoolId:
              manager.schoolId,
            ownerUid:
              manager.uid,
            planKey,
          },
          subscription_data: {
            metadata: {
              schoolId:
                manager.schoolId,
              ownerUid:
                manager.uid,
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

async function adminAuthUser(
  uid: string,
) {
  const {
    adminAuth,
  } = await import(
    "@/lib/firebaseAdmin"
  );

  return adminAuth.getUser(uid);
}
'@

# ------------------------------------------------------------
# 10. Billing portal API.
# ------------------------------------------------------------

Write-Source "app\api\billing\portal\route.ts" @'
import {
  NextResponse,
} from "next/server";

import {
  billingAuthError,
  requireSchoolBillingManager,
} from "@/lib/billing/auth";

import {
  getSchoolSubscriptionSummary,
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
    const manager =
      await requireSchoolBillingManager(
        request,
      );

    const subscription =
      await getSchoolSubscriptionSummary(
        manager.schoolId,
      );

    if (
      !subscription.stripeCustomerId
    ) {
      return NextResponse.json(
        {
          error:
            "No Stripe customer exists for this school yet.",
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
            `${getApplicationUrl()}/teacher/billing`,
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
# 11. Stripe webhook.
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
  persistStripeSubscription,
} from "@/lib/billing/subscription";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function processSubscription(
  subscription:
    Stripe.Subscription,
) {
  await persistStripeSubscription(
    subscription,
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

          await persistStripeSubscription(
            subscription,
            session.metadata
              ?.schoolId ||
              "",
          );
        }

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await processSubscription(
          event.data
            .object as Stripe.Subscription,
        );
        break;
      }

      case "invoice.payment_failed":
      case "invoice.paid": {
        /*
         * Subscription state is authoritative.
         * Retrieve it from the invoice parent when available
         * through the subscription webhook that Stripe also emits.
         */
        break;
      }

      default:
        break;
    }

    await eventRef.set({
      type: event.type,
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
# 12. Seat-enforced school join API.
# ------------------------------------------------------------

Write-Source "app\api\schools\join\route.ts" @'
import {
  NextResponse,
} from "next/server";

import {
  adminDb,
} from "@/lib/firebaseAdmin";

import {
  billingAuthError,
  requireBillingActor,
} from "@/lib/billing/auth";

import {
  billingEnforcementEnabled,
} from "@/lib/billing/stripe";

import {
  countStudentSeats,
  getSchoolSubscriptionSummary,
} from "@/lib/billing/subscription";

export const runtime = "nodejs";

function normaliseCode(
  value: unknown,
): string {
  return typeof value === "string"
    ? value
        .trim()
        .toUpperCase()
        .replace(
          /[^A-Z0-9]/g,
          "",
        )
    : "";
}

export async function POST(
  request: Request,
) {
  try {
    const actor =
      await requireBillingActor(
        request,
      );

    const body: unknown =
      await request.json();

    const code =
      normaliseCode(
        body &&
        typeof body === "object"
          ? (
              body as {
                code?: unknown;
              }
            ).code
          : "",
      );

    if (!code) {
      return NextResponse.json(
        {
          error:
            "Enter a valid school join code.",
        },
        {
          status: 400,
        },
      );
    }

    const inviteRef =
      adminDb
        .collection(
          "schoolInvites",
        )
        .doc(code);

    const inviteSnapshot =
      await inviteRef.get();

    if (!inviteSnapshot.exists) {
      return NextResponse.json(
        {
          error:
            "That school join code could not be found.",
        },
        {
          status: 404,
        },
      );
    }

    const invite =
      inviteSnapshot.data() || {};

    if (
      invite.status !== "active"
    ) {
      return NextResponse.json(
        {
          error:
            "This school join code is no longer active.",
        },
        {
          status: 409,
        },
      );
    }

    const expiresAt =
      invite.expiresAt &&
      typeof invite.expiresAt.toDate ===
        "function"
        ? invite.expiresAt.toDate()
        : null;

    if (
      expiresAt &&
      expiresAt.getTime() <
        Date.now()
    ) {
      return NextResponse.json(
        {
          error:
            "This school join code has expired.",
        },
        {
          status: 409,
        },
      );
    }

    const schoolId =
      typeof invite.schoolId ===
      "string"
        ? invite.schoolId.trim()
        : "";

    const role =
      invite.role === "teacher"
        ? "teacher"
        : "student";

    if (!schoolId) {
      return NextResponse.json(
        {
          error:
            "This school invitation is invalid.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      actor.schoolId &&
      actor.schoolId !==
        schoolId
    ) {
      return NextResponse.json(
        {
          error:
            "Your account already belongs to another school.",
        },
        {
          status: 409,
        },
      );
    }

    if (
      role === "teacher" &&
      actor.role !== "teacher" &&
      actor.role !== "admin"
    ) {
      return NextResponse.json(
        {
          error:
            "This join code is for an approved teacher account.",
        },
        {
          status: 403,
        },
      );
    }

    if (
      role === "student" &&
      billingEnforcementEnabled()
    ) {
      const subscription =
        await getSchoolSubscriptionSummary(
          schoolId,
        );

      if (!subscription.active) {
        return NextResponse.json(
          {
            error:
              "This school's CS Master subscription is not active.",
          },
          {
            status: 402,
          },
        );
      }

      const existingSeatCount =
        await countStudentSeats(
          schoolId,
        );

      if (
        existingSeatCount >=
        subscription.seatLimit
      ) {
        return NextResponse.json(
          {
            error:
              "This school has reached its CS Master student-seat limit.",
          },
          {
            status: 409,
          },
        );
      }
    }

    const memberRef =
      adminDb
        .collection("schools")
        .doc(schoolId)
        .collection("members")
        .doc(actor.uid);

    const userRef =
      adminDb
        .collection("users")
        .doc(actor.uid);

    await adminDb.runTransaction(
      async (transaction) => {
        const freshInvite =
          await transaction.get(
            inviteRef,
          );

        if (
          !freshInvite.exists ||
          freshInvite.data()
            ?.status !==
            "active"
        ) {
          throw new Error(
            "INVITE_ALREADY_USED",
          );
        }

        transaction.set(
          memberRef,
          {
            schoolId,
            userId:
              actor.uid,
            role,
            status:
              "active",
            joinedAt:
              new Date(),
            leftAt:
              null,
            updatedAt:
              new Date(),
          },
          {
            merge: true,
          },
        );

        transaction.update(
          userRef,
          {
            schoolId,
            accountType:
              "school",
            plan:
              "school",
            updatedAt:
              new Date(),
          },
        );

        transaction.update(
          inviteRef,
          {
            status:
              "used",
            usedBy:
              actor.uid,
            usedAt:
              new Date(),
            updatedAt:
              new Date(),
          },
        );
      },
    );

    return NextResponse.json({
      schoolId,
      role,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "INVITE_ALREADY_USED"
    ) {
      return NextResponse.json(
        {
          error:
            "This school join code has already been used.",
        },
        {
          status: 409,
        },
      );
    }

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
# 13. Client billing service.
# ------------------------------------------------------------

Write-Source "services\billingClientService.ts" @'
import {
  auth,
} from "@/lib/firebase";

import type {
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
# 14. Entitlement gate.
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
    loading,
    setLoading,
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

    setLoading(true);

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
          setLoading(false);
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

  if (loading) {
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

  /*
   * Development/test environments remain usable until
   * BILLING_ENFORCEMENT_MODE=strict is configured.
   */
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
        Your account remains intact, but your school's CS Master subscription is not currently active.
      </p>
    </section>
  );
}
'@

# ------------------------------------------------------------
# 15. Teacher billing page.
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

  async function refresh() {
    try {
      setLoading(true);
      setSubscription(
        await getSchoolSubscription(),
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Billing status could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
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
# 16. Admin billing API + page.
# ------------------------------------------------------------

Write-Source "app\api\admin\billing\route.ts" @'
import {
  NextResponse,
} from "next/server";

import {
  adminDb,
} from "@/lib/firebaseAdmin";

import {
  billingAuthError,
  requireBillingActor,
} from "@/lib/billing/auth";

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

    if (actor.role !== "admin") {
      return NextResponse.json(
        {
          error:
            "Admin access required.",
        },
        {
          status: 403,
        },
      );
    }

    const snapshot =
      await adminDb
        .collection(
          "schoolSubscriptions",
        )
        .get();

    const subscriptions =
      await Promise.all(
        snapshot.docs.map(
          async (document) => {
            const data =
              document.data();

            const school =
              await adminDb
                .collection(
                  "schools",
                )
                .doc(document.id)
                .get();

            return {
              schoolId:
                document.id,
              schoolName:
                school.exists &&
                typeof school.data()
                  ?.name === "string"
                  ? school.data()
                      ?.name
                  : "Unknown school",
              status:
                data.status ||
                "none",
              planKey:
                data.planKey ||
                null,
              seatLimit:
                data.seatLimit ||
                0,
              stripeCustomerId:
                data.stripeCustomerId ||
                null,
              stripeSubscriptionId:
                data.stripeSubscriptionId ||
                null,
            };
          },
        ),
      );

    return NextResponse.json({
      subscriptions,
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

Write-Source "app\admin\billing\page.tsx" @'
"use client";

import {
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import {
  auth,
} from "@/lib/firebase";

type BillingRow = {
  schoolId: string;
  schoolName: string;
  status: string;
  planKey: string | null;
  seatLimit: number;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
};

export default function AdminBillingPage() {
  const [
    rows,
    setRows,
  ] =
    useState<BillingRow[]>(
      [],
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const user =
          auth.currentUser;

        if (!user) {
          throw new Error(
            "Admin sign-in required.",
          );
        }

        const response =
          await fetch(
            "/api/admin/billing",
            {
              headers: {
                Authorization:
                  `Bearer ${await user.getIdToken()}`,
              },
              cache:
                "no-store",
            },
          );

        const data =
          (await response.json()) as {
            subscriptions?: BillingRow[];
            error?: string;
          };

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Billing data could not be loaded.",
          );
        }

        if (!cancelled) {
          setRows(
            data.subscriptions ||
              [],
          );
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Billing data could not be loaded.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-slate-950 to-indigo-950 text-white">
        <p className="text-sm font-black uppercase tracking-widest text-indigo-200">
          Platform administration
        </p>
        <h1 className="mt-3 text-4xl font-black">
          School subscriptions
        </h1>
        <p className="mt-3 text-indigo-100">
          Read-only commercial visibility across Stripe-linked CS Master schools.
        </p>
      </Card>

      <Card>
        {loading ? (
          <p className="font-bold text-slate-600">
            Loading subscriptions...
          </p>
        ) : rows.length === 0 ? (
          <p className="text-slate-600">
            No Stripe school subscriptions have been created yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="p-3">School</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Seat limit</th>
                  <th className="p-3">Stripe subscription</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(
                  (row) => (
                    <tr
                      key={row.schoolId}
                      className="border-b last:border-0"
                    >
                      <td className="p-3 font-bold text-slate-950">
                        {row.schoolName}
                      </td>
                      <td className="p-3 capitalize">
                        {row.planKey || "None"}
                      </td>
                      <td className="p-3 capitalize">
                        {row.status.replace(/_/g, " ")}
                      </td>
                      <td className="p-3">
                        {row.seatLimit}
                      </td>
                      <td className="p-3 font-mono text-xs">
                        {row.stripeSubscriptionId || "Not created"}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
'@

# ------------------------------------------------------------
# 17. Environment template.
# ------------------------------------------------------------

Write-Source ".env.billing.example" @'
# CS Master Stripe billing
# Copy values into .env.local for local TEST MODE.
# Never commit real Stripe secret keys.

NEXT_PUBLIC_APP_URL=http://localhost:3000

STRIPE_SECRET_KEY=sk_test_REPLACE_ME
STRIPE_WEBHOOK_SECRET=whsec_REPLACE_ME

STRIPE_PRICE_SCHOOL_STARTER=price_REPLACE_ME
STRIPE_PRICE_SCHOOL_STANDARD=price_REPLACE_ME
STRIPE_PRICE_SCHOOL_PRO=price_REPLACE_ME

# Use "off" during normal local development.
# Change to "strict" only when testing real subscription enforcement.
BILLING_ENFORCEMENT_MODE=off
'@

# ------------------------------------------------------------
# 18. Add Stripe readiness to health endpoint.
# ------------------------------------------------------------

$healthPath = Join-Path $ProjectRoot "app\api\health\route.ts"
if (Test-Path -LiteralPath $healthPath -PathType Leaf) {
  Backup-File -Path $healthPath
  $health = [System.IO.File]::ReadAllText($healthPath)

  if (-not $health.Contains("stripeBilling")) {
    $health = $health.Replace(
      '    openAI: present("OPENAI_API_KEY"),',
      '    openAI: present("OPENAI_API_KEY"),' + "`r`n" +
      '    stripeBilling:' + "`r`n" +
      '      present("STRIPE_SECRET_KEY") &&' + "`r`n" +
      '      present("STRIPE_WEBHOOK_SECRET") &&' + "`r`n" +
      '      present("STRIPE_PRICE_SCHOOL_STARTER") &&' + "`r`n" +
      '      present("STRIPE_PRICE_SCHOOL_STANDARD") &&' + "`r`n" +
      '      present("STRIPE_PRICE_SCHOOL_PRO"),'
    )

    [System.IO.File]::WriteAllText(
      $healthPath,
      $health,
      [System.Text.UTF8Encoding]::new($false)
    )
  }
}

# ------------------------------------------------------------
# 19. Wrap teacher workspace with subscription gate.
# ------------------------------------------------------------

$teacherLayout = Join-Path $ProjectRoot "app\teacher\layout.tsx"
if (Test-Path -LiteralPath $teacherLayout -PathType Leaf) {
  Backup-File -Path $teacherLayout

  Write-Source "app\teacher\layout.tsx" @'
import type {
  ReactNode,
} from "react";

import SchoolSubscriptionGate from "@/components/billing/SchoolSubscriptionGate";
import TeacherAccessGate from "@/components/teacher/TeacherAccessGate";

export default function TeacherLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <TeacherAccessGate>
      <SchoolSubscriptionGate>
        {children}
      </SchoolSubscriptionGate>
    </TeacherAccessGate>
  );
}
'@
}

# ------------------------------------------------------------
# 20. Wrap student school users with subscription gate.
# ------------------------------------------------------------

$studentGatePath = Join-Path $ProjectRoot "components\student\StudentAccessGate.tsx"
if (Test-Path -LiteralPath $studentGatePath -PathType Leaf) {
  Backup-File -Path $studentGatePath
  $studentGate = [System.IO.File]::ReadAllText($studentGatePath)

  if (-not $studentGate.Contains("SchoolSubscriptionGate")) {
    $studentGate = $studentGate.Replace(
      'import { useAuth } from "@/contexts/AuthContext";',
      'import { useAuth } from "@/contexts/AuthContext";' + "`r`n" +
      'import SchoolSubscriptionGate from "@/components/billing/SchoolSubscriptionGate";'
    )

    $studentGate = $studentGate.Replace(
      '  return <>{children}</>;',
      '  return <SchoolSubscriptionGate>{children}</SchoolSubscriptionGate>;'
    )

    [System.IO.File]::WriteAllText(
      $studentGatePath,
      $studentGate,
      [System.Text.UTF8Encoding]::new($false)
    )
  }
}

# ------------------------------------------------------------
# 21. Route school joining through server seat enforcement.
# ------------------------------------------------------------

$joinPath = Join-Path $ProjectRoot "app\join-school\page.tsx"
if (Test-Path -LiteralPath $joinPath -PathType Leaf) {
  Backup-File -Path $joinPath
  $joinText = [System.IO.File]::ReadAllText($joinPath)

  $joinText = [System.Text.RegularExpressions.Regex]::Replace(
    $joinText,
    'import\s*\{\s*acceptSchoolInvite,\s*\}\s*from\s*"@/services/schoolInvitationService";',
    'import { acceptSchoolInviteWithBilling } from "@/services/billingClientService";'
  )

  $joinText = $joinText.Replace(
    'await acceptSchoolInvite({',
    'await acceptSchoolInviteWithBilling('
  )

  $joinText = $joinText.Replace(
    '          code,' + "`r`n" +
    '          userId: user.uid,' + "`r`n" +
    '        });',
    '          code,' + "`r`n" +
    '        );'
  )

  $joinText = $joinText.Replace(
    '          code,' + "`n" +
    '          userId: user.uid,' + "`n" +
    '        });',
    '          code,' + "`n" +
    '        );'
  )

  [System.IO.File]::WriteAllText(
    $joinPath,
    $joinText,
    [System.Text.UTF8Encoding]::new($false)
  )
}

# ------------------------------------------------------------
# 22. Verification.
# ------------------------------------------------------------

$requiredFiles = @(
  "types\billing.ts",
  "data\billingPlans.ts",
  "lib\billing\stripe.ts",
  "lib\billing\auth.ts",
  "lib\billing\plans.ts",
  "lib\billing\subscription.ts",
  "app\api\billing\status\route.ts",
  "app\api\billing\checkout\route.ts",
  "app\api\billing\portal\route.ts",
  "app\api\billing\webhook\route.ts",
  "app\api\schools\join\route.ts",
  "services\billingClientService.ts",
  "components\billing\SchoolSubscriptionGate.tsx",
  "app\teacher\billing\page.tsx",
  "app\admin\billing\page.tsx",
  ".env.billing.example"
)

$checks = New-Object System.Collections.Generic.List[string]
$failed = New-Object System.Collections.Generic.List[string]

foreach ($relative in $requiredFiles) {
  if (Test-Path -LiteralPath (Join-Path $ProjectRoot $relative) -PathType Leaf) {
    $checks.Add("[OK] $relative")
  }
  else {
    $failed.Add("Missing file: $relative")
  }
}

$packageText = [System.IO.File]::ReadAllText($packageJson)
if ($packageText -match '"stripe"\s*:') {
  $checks.Add("[OK] Stripe SDK installed")
}
else {
  $failed.Add("Stripe SDK was not added to package.json")
}

# ------------------------------------------------------------
# 23. ESLint + production build.
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
  $status = "IMPLEMENTATION PASS - STRIPE TEST CONFIGURATION REQUIRED"
}
else {
  $status = "NOT YET PASSED"
}

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add("CS MASTER - PAYMENTS + SUBSCRIPTIONS IMPLEMENTATION")
$lines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$lines.Add("Project: $ProjectRoot")
$lines.Add("Backup: $backup")
$lines.Add("")
$lines.Add("IMPLEMENTED")
$lines.Add("-----------")
$lines.Add("Stripe SDK integration")
$lines.Add("School Starter / Standard / Pro plan catalogue")
$lines.Add("Stripe Checkout subscription route")
$lines.Add("Stripe Customer Billing Portal route")
$lines.Add("Verified Stripe webhook route with replay protection")
$lines.Add("Server-side school subscription persistence")
$lines.Add("School entitlement/access gate")
$lines.Add("Student seat-limit enforcement at school join")
$lines.Add("Teacher billing page")
$lines.Add("Admin subscription visibility page")
$lines.Add("Billing environment template")
$lines.Add("Stripe readiness signal in health endpoint")
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
$lines.Add("NEXT CONFIGURATION")
$lines.Add("------------------")
$lines.Add("Create Stripe TEST MODE recurring yearly prices.")
$lines.Add("Copy the resulting price IDs into .env.local using .env.billing.example.")
$lines.Add("Configure STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET locally.")
$lines.Add("Keep BILLING_ENFORCEMENT_MODE=off until test checkout/webhooks pass.")
$lines.Add("Switch to BILLING_ENFORCEMENT_MODE=strict only for entitlement QA.")

[System.IO.File]::WriteAllLines(
  $summary,
  $lines,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " PAYMENTS + SUBSCRIPTIONS IMPLEMENTATION COMPLETE" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Status: $status"