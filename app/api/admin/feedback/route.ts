import "server-only";

import { NextResponse } from "next/server";
import { FieldValue, type QueryDocumentSnapshot } from "firebase-admin/firestore";
import { platformAdminError, requirePlatformAdmin } from "@/lib/admin/requirePlatformAdmin";
import { adminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const statuses = new Set(["open", "in_progress", "resolved", "closed"]);
const priorities = new Set(["low", "normal", "high", "urgent"]);

function clean(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function serialise(doc: QueryDocumentSnapshot) {
  const data = doc.data();
  return {
    id: doc.id,
    category: clean(data.category, 40),
    message: clean(data.message, 4000),
    pageUrl: clean(data.pageUrl, 500),
    status: clean(data.status, 40) || "open",
    priority: clean(data.priority, 40) || "normal",
    reporterName: clean(data.reporterName, 200),
    reporterEmail: clean(data.reporterEmail, 320),
    reporterRole: clean(data.reporterRole, 40),
    schoolId: clean(data.schoolId, 200),
    adminNote: clean(data.adminNote, 2000),
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? null,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? null,
  };
}

export async function GET(request: Request) {
  try {
    await requirePlatformAdmin(request);
    const snapshot = await adminDb.collection("feedbackReports").orderBy("createdAt", "desc").limit(250).get();
    return NextResponse.json({ reports: snapshot.docs.map(serialise) });
  } catch (error) {
    const failure = platformAdminError(error);
    return NextResponse.json({ error: failure.message }, { status: failure.status });
  }
}

export async function PATCH(request: Request) {
  try {
    const actor = await requirePlatformAdmin(request);
    const body: unknown = await request.json();
    const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
    const id = clean(record.id, 200);
    const status = clean(record.status, 40);
    const priority = clean(record.priority, 40);
    const adminNote = clean(record.adminNote, 2000);

    if (!id || !statuses.has(status) || !priorities.has(priority)) {
      return NextResponse.json({ error: "Invalid feedback update." }, { status: 400 });
    }

    const ref = adminDb.collection("feedbackReports").doc(id);
    const snapshot = await ref.get();
    if (!snapshot.exists) return NextResponse.json({ error: "Feedback report not found." }, { status: 404 });

    await ref.update({
      status,
      priority,
      adminNote,
      reviewedBy: actor.uid,
      updatedAt: FieldValue.serverTimestamp(),
      resolvedAt: status === "resolved" || status === "closed" ? FieldValue.serverTimestamp() : null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const failure = platformAdminError(error);
    return NextResponse.json({ error: failure.message }, { status: failure.status });
  }
}
