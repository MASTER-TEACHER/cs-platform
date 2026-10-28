import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { Storage } from "@google-cloud/storage";
import { requireAuthenticatedUser } from "@/lib/auth/requireUser";
import { centreCollection, centreError, requireCentreTeacher } from "@/lib/marking/centre";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store" };
const MAX_BYTES = 12 * 1024 * 1024;
const MAX_BATCH = 20;
type Context = { params: Promise<{ examId: string }> };
type Entry = { paperId: string; candidateCode: string; file: File; replace: boolean };

function storageClient() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  const encodedKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64?.trim();
  if (projectId && clientEmail && encodedKey) {
    return new Storage({ projectId, credentials: { client_email: clientEmail, private_key: Buffer.from(encodedKey, "base64").toString("utf8") } });
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return new Storage({ projectId: projectId || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT });
  throw new Error("CENTRE_STORAGE_UNAVAILABLE");
}
async function owned(request: Request, context: Context) {
  const actor = await requireAuthenticatedUser(request);
  requireCentreTeacher(actor);
  const { examId } = await context.params;
  if (!/^[\w-]{1,128}$/.test(examId)) throw new Error("CENTRE_NOT_FOUND");
  const ref = centreCollection.doc(examId);
  const snap = await ref.get();
  if (!snap.exists || snap.data()?.ownerId !== actor.uid) throw new Error("CENTRE_NOT_FOUND");
  return { ref, snap, actor, examId };
}
function failure(error: unknown) {
  if (error instanceof Error && error.message === "CENTRE_STORAGE_UNAVAILABLE") return NextResponse.json({ error: "Server Storage credentials are unavailable." }, { status: 503, headers });
  if (error instanceof Error && error.message === "CENTRE_CONFLICT") return NextResponse.json({ error: "One or more scripts already exist. Select Replace existing script to overwrite them." }, { status: 409, headers });
  const result = centreError(error);
  return NextResponse.json({ error: result.error }, { status: result.status, headers });
}
export async function GET(request: Request, context: Context) {
  try {
    const { ref } = await owned(request, context);
    const snapshot = await ref.collection("candidateScripts").limit(1000).get();
    return NextResponse.json({ scripts: snapshot.docs.map(doc => ({ paperId: doc.data().paperId, candidateCode: doc.data().candidateCode, filename: doc.data().originalName, size: doc.data().size, uploadedAt: doc.data().uploadedAt?.toDate?.()?.toISOString() ?? null })) }, { headers });
  } catch (error) { return failure(error); }
}
export async function POST(request: Request, context: Context) {
  try {
    const { ref, snap, actor, examId } = await owned(request, context);
    const form = await request.formData();
    const manifestText = form.get("manifest");
    if (typeof manifestText !== "string" || manifestText.length > 20000) throw new Error("CENTRE_INVALID");
    let manifest: unknown;
    try { manifest = JSON.parse(manifestText); } catch { throw new Error("CENTRE_INVALID"); }
    if (!Array.isArray(manifest) || manifest.length < 1 || manifest.length > MAX_BATCH) throw new Error("CENTRE_INVALID");
    const papers = snap.data()?.papers;
    const validPapers = new Set<string>(Array.isArray(papers) ? papers.map((p: { id: string }) => p.id) : []);
    const raw: Entry[] = [];
    let totalBytes = 0;
    const unique = new Set<string>();
    for (let i = 0; i < manifest.length; i++) {
      const item = manifest[i] as Record<string, unknown>;
      const file = form.get(`file_${i}`);
      const paperId = item?.paperId;
      const candidateCode = item?.candidateCode;
      if (typeof paperId !== "string" || !validPapers.has(paperId) || typeof candidateCode !== "string" || !/^EX-[A-F0-9]{16}$/i.test(candidateCode) || !(file instanceof File) || file.size < 5 || file.size > MAX_BYTES || !file.name.toLowerCase().endsWith(".pdf") || (file.type !== "application/pdf" && file.type !== "")) throw new Error("CENTRE_INVALID");
      const code = candidateCode.toUpperCase();
      const key = `${paperId}_${code}`;
      if (unique.has(key)) throw new Error("CENTRE_INVALID");
      unique.add(key);
      totalBytes += file.size;
      if (totalBytes > 100 * 1024 * 1024) throw new Error("CENTRE_INVALID");
      raw.push({ paperId, candidateCode: code, file, replace: item.replace === true });
    }
    // Validate every candidate before writing anything.
    const candidateRefs = raw.map(item => ref.collection("candidates").doc(item.candidateCode));
    const candidateSnapshots = await ref.firestore.getAll(...candidateRefs);
    if (candidateSnapshots.some(doc => !doc.exists)) throw new Error("CENTRE_INVALID");
    const scriptRefs = raw.map(item => ref.collection("candidateScripts").doc(`${item.paperId}_${item.candidateCode}`));
    const existing = await ref.firestore.getAll(...scriptRefs);
    if (existing.some((doc, i) => doc.exists && !raw[i].replace)) throw new Error("CENTRE_CONFLICT");
    const buffers = await Promise.all(raw.map(async item => Buffer.from(await item.file.arrayBuffer())));
    if (buffers.some(bytes => bytes.subarray(0, 5).toString("ascii") !== "%PDF-")) throw new Error("CENTRE_INVALID");
    const bucketName = process.env.FIREBASE_ADMIN_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!bucketName) throw new Error("CENTRE_STORAGE_UNAVAILABLE");
    const bucket = storageClient().bucket(bucketName);
    const uploaded: { paperId: string; candidateCode: string; filename: string }[] = [];
    // Sequential uploads bound memory and make partial failures explicit.
    for (let i = 0; i < raw.length; i++) {
      const item = raw[i];
      const bytes = buffers[i];
      const path = `marking-centre/${actor.uid}/${examId}/scripts/${item.paperId}/${item.candidateCode}.pdf`;
      const object = bucket.file(path);
      // A Storage generation precondition protects against concurrent uploads.
      try {
        await object.save(bytes, { resumable: false, contentType: "application/pdf", preconditionOpts: item.replace ? undefined : { ifGenerationMatch: 0 }, metadata: { cacheControl: "private, no-store" } });
      } catch (error) {
        const code = (error as { code?: number })?.code;
        if (code === 412) throw new Error("CENTRE_CONFLICT");
        throw error;
      }
      await scriptRefs[i].set({ paperId: item.paperId, candidateCode: item.candidateCode, path, originalName: item.file.name.slice(0, 180), size: item.file.size, status: "uploaded", uploadedAt: FieldValue.serverTimestamp(), uploadedBy: actor.uid });
      uploaded.push({ paperId: item.paperId, candidateCode: item.candidateCode, filename: item.file.name });
    }
    await ref.update({ updatedAt: FieldValue.serverTimestamp() });
    return NextResponse.json({ uploaded, count: uploaded.length }, { status: 201, headers });
  } catch (error) {
    console.error("[Marking Centre] Candidate script upload failed", error instanceof Error ? error.message : error);
    return failure(error);
  }
}
