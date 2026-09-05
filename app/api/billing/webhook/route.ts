import type Stripe from "stripe";
import { NextResponse } from "next/server";

import { adminDb } from "@/lib/firebaseAdmin";
import { getStripe } from "@/lib/billing/stripe";
import {
  persistIndividualStripeSubscription,
  persistStripeSubscription,
  setBillingAccessForCustomer,
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
    (subscription.metadata.userId ? "individual" : "school");

  if (scope === "individual") {
    await persistIndividualStripeSubscription(
      subscription,
      fallback.userId || "",
    );
    return;
  }

  await persistStripeSubscription(
    subscription,
    fallback.schoolId || "",
  );
}

function customerIdFromObject(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null,
): string {
  if (typeof customer === "string") {
    return customer;
  }

  return customer?.id || "";
}

async function customerIdFromCharge(
  charge: string | Stripe.Charge,
): Promise<string> {
  const stripe = getStripe();
  const resolved =
    typeof charge === "string"
      ? await stripe.charges.retrieve(charge)
      : charge;

  return customerIdFromObject(resolved.customer);
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 503 },
    );
  }

  try {
    const payload = await request.text();
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );

    const eventRef = adminDb
      .collection("stripeWebhookEvents")
      .doc(event.id);

    const existing = await eventRef.get();

    if (existing.exists) {
      return NextResponse.json({
        received: true,
        duplicate: true,
      });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (typeof session.subscription === "string") {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription,
          );

          await persistSubscription(subscription, {
            schoolId: session.metadata?.schoolId || "",
            userId: session.metadata?.userId || "",
          });

          const customerId = customerIdFromObject(session.customer);
          if (customerId) {
            await setBillingAccessForCustomer(customerId, false, null);
          }
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await persistSubscription(
          event.data.object as Stripe.Subscription,
        );
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = customerIdFromObject(invoice.customer);

        if (customerId) {
          await setBillingAccessForCustomer(customerId, false, null);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = customerIdFromObject(invoice.customer);

        if (customerId) {
          await setBillingAccessForCustomer(
            customerId,
            true,
            "payment_failed",
          );
        }
        break;
      }

      case "invoice.finalization_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = customerIdFromObject(invoice.customer);

        if (customerId) {
          await setBillingAccessForCustomer(
            customerId,
            true,
            "invoice_finalization_failed",
          );
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;

        // Partial refunds do not automatically remove the paid period.
        // A full refund does, until a later successful invoice restores it.
        if (charge.refunded) {
          const customerId = customerIdFromObject(charge.customer);

          if (customerId) {
            await setBillingAccessForCustomer(
              customerId,
              true,
              "full_refund",
            );
          }
        }
        break;
      }

      case "charge.dispute.created": {
        const dispute = event.data.object as Stripe.Dispute;
        const customerId = await customerIdFromCharge(dispute.charge);

        if (customerId) {
          await setBillingAccessForCustomer(
            customerId,
            true,
            "dispute",
          );
        }
        break;
      }

      case "charge.dispute.closed": {
        const dispute = event.data.object as Stripe.Dispute;
        const customerId = await customerIdFromCharge(dispute.charge);

        if (customerId) {
          await setBillingAccessForCustomer(
            customerId,
            dispute.status !== "won",
            dispute.status === "won" ? null : "dispute",
          );
        }
        break;
      }

      default:
        break;
    }

    await eventRef.set({
      type: event.type,
      processedAt: new Date(),
      livemode: event.livemode,
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);

    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 400 },
    );
  }
}
