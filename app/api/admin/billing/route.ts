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