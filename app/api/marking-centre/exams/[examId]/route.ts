import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { Storage } from "@google-cloud/storage";
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

    // Add another paper to an existing exam (e.g. Paper 2 after Paper 1 was marked).
    // Existing papers, candidate codes, scripts and marks are untouched.
    if (data.addPaper && typeof data.addPaper === "object" && !Array.isArray(data.addPaper)) {
      const paperTitle = cleanText((data.addPaper as Record<string, unknown>).title, 120);
      if (!paperTitle) throw new Error("CENTRE_INVALID");
      const paper = await ref.firestore.runTransaction(async tx => {
        const snap = await tx.get(ref);
        const papers = (Array.isArray(snap.data()?.papers) ? snap.data()!.papers : []) as { id: string }[];
        if (papers.length >= 12) throw new Error("CENTRE_INVALID");
        const next = papers.reduce((n, p) => Math.max(n, Number(/^paper-(\d+)$/.exec(p.id)?.[1] ?? 0)), 0) + 1;
        const added = { id: `paper-${next}`, title: paperTitle, status: "awaiting_documents", questions: [], totalMarks: null, gradeBoundaries: null };
        tx.update(ref, { papers: [...papers, added], updatedAt: FieldValue.serverTimestamp() });
        return added;
      });
      return NextResponse.json({ ok: true, paper }, { headers });
    }

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

// Deletes an examination and EVERYTHING in it: papers, mark schemes, candidate codes, scripts,
// transcriptions, marking reviews and results. Because this is permanent, the request must
// carry the exact examination title (typed by the teacher) as confirmation. A small deletion
// record (no candidate data) is kept for accountability.
function storageClient(): Storage {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim();
  const email = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  const encoded = process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64?.trim();
  if (projectId && email && encoded) return new Storage({ projectId, credentials: { client_email: email, private_key: Buffer.from(encoded, "base64").toString("utf8") } });
  return new Storage({ projectId: projectId || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT });
}

export async function DELETE(request: Request, context: Context) {
  try {
    const { ref, snap, actor } = await owned(request, context);
    const data = snap.data() ?? {};
    const title = typeof data.title === "string" ? data.title : "";
    let confirmTitle = "";
    try {
      const body: unknown = await request.json();
      if (body && typeof body === "object" && typeof (body as { confirmTitle?: unknown }).confirmTitle === "string") {
        confirmTitle = (body as { confirmTitle: string }).confirmTitle.trim();
      }
    } catch { /* no body */ }
    if (!title || confirmTitle !== title.trim()) {
      return NextResponse.json({ error: "To delete, type the examination title exactly as shown." }, { status: 400, headers });
    }

    // 1. Files in Cloud Storage (question papers, mark schemes, candidate scripts).
    const bucketName = process.env.FIREBASE_ADMIN_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (bucketName) {
      try {
        await storageClient().bucket(bucketName).deleteFiles({ prefix: `marking-centre/${actor.uid}/${ref.id}/`, force: true });
      } catch (error) {
        console.error("[Marking Centre] storage cleanup failed for deleted exam", ref.id, error instanceof Error ? error.message : error);
        return NextResponse.json({ error: "Could not delete the examination's files. Nothing was deleted; please retry." }, { status: 502, headers });
      }
    }

    // 2. Accountability record without candidate data.
    await ref.firestore.collection("markingCentreDeletions").add({
      examId: ref.id, title, subject: data.subject ?? null, ownerId: actor.uid,
      candidateCount: data.candidateCount ?? 0, deletedAt: FieldValue.serverTimestamp(),
    });

    // 3. The examination document and all subcollections (candidates, structures, reviews, transcripts...).
    await ref.firestore.recursiveDelete(ref);
    return NextResponse.json({ ok: true }, { headers });
  } catch (error) {
    const result = centreError(error);
    return NextResponse.json({ error: result.error }, { status: result.status, headers });
  }
}
