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