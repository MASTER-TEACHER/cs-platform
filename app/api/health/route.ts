import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function present(name: string): boolean {
  return Boolean(process.env[name]?.trim());
}

export async function GET() {
  const firebaseClient =
    present("NEXT_PUBLIC_FIREBASE_API_KEY") &&
    present("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN") &&
    present("NEXT_PUBLIC_FIREBASE_PROJECT_ID") &&
    present("NEXT_PUBLIC_FIREBASE_APP_ID");

  const firebaseAdmin =
    present("GOOGLE_APPLICATION_CREDENTIALS") ||
    (
      present("FIREBASE_ADMIN_PROJECT_ID") &&
      present("FIREBASE_ADMIN_CLIENT_EMAIL") &&
      present("FIREBASE_ADMIN_PRIVATE_KEY_BASE64")
    );

  const checks = {
    app: true,
    firebaseClient,
    firebaseAdmin,
    openAI: present("OPENAI_API_KEY"),
    stripeBilling:
      present("STRIPE_SECRET_KEY") &&
      present("STRIPE_WEBHOOK_SECRET") &&
      present("STRIPE_PRICE_INDIVIDUAL_PREMIUM_MONTHLY") &&
      present("STRIPE_PRICE_INDIVIDUAL_PREMIUM_ANNUAL") &&
      present("STRIPE_PRICE_SCHOOL_STARTER") &&
      present("STRIPE_PRICE_SCHOOL_STANDARD") &&
      present("STRIPE_PRICE_SCHOOL_PRO"),
  };

  const ready = Object.values(checks).every(Boolean);

  return NextResponse.json(
    {
      service: "cs-master",
      status: ready ? "ready" : "degraded",
      checks,
      timestamp: new Date().toISOString(),
    },
    {
      status: ready ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
