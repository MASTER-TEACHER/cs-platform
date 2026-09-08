import "server-only";

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import { authenticatedUserError, requireAuthenticatedUser } from "@/lib/auth/requireUser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const categories = new Set(["bug", "idea", "content", "accessibility", "privacy", "other"]);

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    const actor = await requireAuthenticatedUser(request);
    const body: unknown = await request.json();
    const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};

    const category = clean(record.category, 40).toLowerCase();
    const message = clean(record.message, 4000);
    const pageUrl = clean(record.pageUrl, 500);

    if (!categories.has(category)) {
      return NextResponse.json({ error: "Choose a valid feedback category." }, { status: 400 });
    }
    if (message.length < 10) {
      return NextResponse.json({ error: "Please provide a little more detail (at least 10 characters)." }, { status: 400 });
    }

    const created = await adminDb.collection("feedbackReports").add({
      category,
      message,
      pageUrl,
      status: "open",
      priority: "normal",
      reporterUid: actor.uid,
      reporterName: actor.name,
      reporterEmail: actor.email,
      reporterRole: actor.role,
      schoolId: actor.schoolId || null,
      userAgent: clean(request.headers.get("user-agent"), 500),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, id: created.id });
  } catch (error) {
    const failure = authenticatedUserError(error);
    return NextResponse.json({ error: failure.message }, { status: failure.status });
  }
}
