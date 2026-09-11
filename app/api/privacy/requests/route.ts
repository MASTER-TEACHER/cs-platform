import "server-only";

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

import { authenticatedUserError, requireAuthenticatedUser } from "@/lib/auth/requireUser";
import { adminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestTypes = new Set([
  "access",
  "correction",
  "erasure",
  "restriction",
  "objection",
  "portability",
  "other",
]);

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    const actor = await requireAuthenticatedUser(request);
    const body: unknown = await request.json();
    const record =
      body && typeof body === "object"
        ? (body as Record<string, unknown>)
        : {};

    const requestType = clean(record.requestType, 40).toLowerCase();
    const details = clean(record.details, 4000);

    if (!requestTypes.has(requestType)) {
      return NextResponse.json(
        { error: "Choose a valid privacy request type." },
        { status: 400 },
      );
    }

    if (details.length < 10) {
      return NextResponse.json(
        { error: "Please provide enough information for us to understand your request." },
        { status: 400 },
      );
    }

    const created = await adminDb.collection("privacyRequests").add({
      requestType,
      details,
      status: "open",
      reporterUid: actor.uid,
      reporterName: actor.name,
      reporterEmail: actor.email,
      reporterRole: actor.role,
      schoolId: actor.schoolId || null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      id: created.id,
      message:
        "Your privacy request has been recorded. CS Master may need to verify identity or coordinate with your school before completing it.",
    });
  } catch (error) {
    const failure = authenticatedUserError(error);

    return NextResponse.json(
      { error: failure.message },
      { status: failure.status },
    );
  }
}
