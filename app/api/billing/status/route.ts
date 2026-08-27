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