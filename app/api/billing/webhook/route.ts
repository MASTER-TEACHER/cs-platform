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