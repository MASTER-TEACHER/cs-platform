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