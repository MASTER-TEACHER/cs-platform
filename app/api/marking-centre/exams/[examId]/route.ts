import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { requireAuthenticatedUser } from "@/lib/auth/requireUser";
import { centreCollection, centreError, cleanText, requireCentreTeacher } from "@/lib/marking/centre";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store" };
type Context = { params: Promise<{ examId: string }> };

async function owned(request: Request, context: Context) {
  const actor = await requireAuthenticatedUser(request);
  requireCentreTeacher(actor);
  const { examId } = await context.params;
  if (!/^[\w-]{1,128}$/.test(examId)) throw new Error("CENTRE_NOT_FOUND");
  const ref = centreCollection.doc(examId);
  const snap = await ref.get();
  if (!snap.exists || snap.data()?.ownerId !== actor.uid) throw new Error("CENTRE_NOT_FOUND");
  return { ref, snap, actor };
}

export async function PATCH(request: Request, context: Context) {
  try {
    const { ref } = await owned(request, context);
    const input: unknown = await request.json();
    if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("CENTRE_INVALID");
    const data = input as Record<string, unknown>;
    const title = cleanText(data.title, 140);
    const subject = cleanText(data.subject, 80);
    const yearGroup = cleanText(data.yearGroup, 40);
    const qualificationLevel = cleanText(data.qualificationLevel, 40);
    if (!title || !subject || !yearGroup || !qualificationLevel) throw new Error("CENTRE_INVALID");
    await ref.update({ title, subject, yearGroup, qualificationLevel, updatedAt: FieldValue.serverTimestamp() });
    return NextResponse.json({ ok: true }, { headers });
  } catch (error) {
    const result = centreError(error);
    return NextResponse.json({ error: result.error }, { status: result.status, headers });
  }
}

export async function DELETE(request: Request, context: Context) {
  try {
    const { ref, actor } = await owned(request, context);
    const result = await ref.firestore.runTransaction(async tx => {
      const exam = await tx.get(ref);
      if (!exam.exists) throw new Error("CENTRE_NOT_FOUND");
      if ((exam.data()?.candidateCount ?? 0) > 0) return false;
      // Never delete an exam with uploaded files, candidates, marking records, or other subcollections.
      // A legacy examination may have candidate records without a correct count.
      return true;
    });
    if (!result) return NextResponse.json({ error: "Cannot delete an examination with candidates. Preserve its assessment records." }, { status: 409, headers });
    const collections = await ref.listCollections();
    for (const collection of collections) {
      const snapshot = await collection.limit(1).get();
      if (!snapshot.empty) return NextResponse.json({ error: "This examination contains saved documents or records and cannot be deleted safely." }, { status: 409, headers });
    }
    // Re-check ownership and count immediately before deleting.
    await ref.firestore.runTransaction(async tx => {
      const latest = await tx.get(ref);
      if (!latest.exists || latest.data()?.ownerId !== actor.uid) throw new Error("CENTRE_NOT_FOUND");
      if ((latest.data()?.candidateCount ?? 0) !== 0) throw new Error("CENTRE_LIMIT");
      tx.delete(ref);
    });
    return NextResponse.json({ ok: true }, { headers });
  } catch (error) {
    const result = centreError(error);
    return NextResponse.json({ error: result.error }, { status: result.status, headers });
  }
}
