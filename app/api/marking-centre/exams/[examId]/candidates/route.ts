import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { requireAuthenticatedUser } from "@/lib/auth/requireUser";
import { centreCollection, centreError, requireCentreTeacher } from "@/lib/marking/centre";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store" };
type Context = { params: Promise<{ examId: string }> };

async function ownedExam(request: Request, context: Context) {
  const actor = await requireAuthenticatedUser(request);
  requireCentreTeacher(actor);
  const { examId } = await context.params;
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(examId)) throw new Error("CENTRE_NOT_FOUND");
  const ref = centreCollection.doc(examId);
  const snap = await ref.get();
  if (!snap.exists || snap.data()?.ownerId !== actor.uid) throw new Error("CENTRE_NOT_FOUND");
  return { ref, examId };
}

export async function GET(request: Request, context: Context) {
  try {
    const { ref } = await ownedExam(request, context);
    const snapshot = await ref.collection("candidates").limit(1000).get();
    const candidates = snapshot.docs.map(doc => ({ code: doc.id, ...doc.data(), createdAt: undefined }));
    candidates.sort((a, b) => String(a.code).localeCompare(String(b.code)));
    return NextResponse.json({ candidates }, { headers });
  } catch (error) { const result = centreError(error); return NextResponse.json({ error: result.error }, { status: result.status, headers }); }
}

export async function POST(request: Request, context: Context) {
  try {
    const { ref } = await ownedExam(request, context);
    const body: unknown = await request.json();
    const count = body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>).count : null;
    if (typeof count !== "number" || !Number.isInteger(count) || count < 1 || count > 100) throw new Error("CENTRE_LIMIT");
    const codes: string[] = [];
    // Cryptographically random, non-identifying codes; each code belongs to exactly one exam.
    for (let i = 0; i < count; i++) codes.push(`EX-${randomBytes(8).toString("hex").toUpperCase()}`);
    const unique = new Set(codes);
    if (unique.size !== codes.length) throw new Error("CENTRE_INVALID");
    await ref.firestore.runTransaction(async transaction => {
      const exam = await transaction.get(ref);
      if (!exam.exists || (exam.data()?.candidateCount ?? 0) + count > 1000) throw new Error("CENTRE_LIMIT");
      for (const code of codes) transaction.create(ref.collection("candidates").doc(code), { code, status: "awaiting_script", createdAt: FieldValue.serverTimestamp() });
      transaction.update(ref, { candidateCount: FieldValue.increment(count), updatedAt: FieldValue.serverTimestamp() });
    });
    return NextResponse.json({ codes }, { status: 201, headers });
  } catch (error) { const result = centreError(error); return NextResponse.json({ error: result.error }, { status: result.status, headers }); }
}
