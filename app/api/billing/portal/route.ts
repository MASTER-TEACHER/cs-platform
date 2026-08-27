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