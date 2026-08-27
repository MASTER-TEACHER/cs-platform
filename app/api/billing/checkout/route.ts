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