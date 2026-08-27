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