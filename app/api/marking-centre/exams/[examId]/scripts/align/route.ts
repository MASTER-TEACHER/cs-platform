import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import { requireAuthenticatedUser } from "@/lib/auth/requireUser";
import { centreCollection, centreError, requireCentreTeacher } from "@/lib/marking/centre";
import { extractMarkingPdf } from "@/lib/marking/extractPdf";
import { alignAnswers } from "@/lib/marking/alignAnswers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
type Context = { params: Promise<{ examId: string }> };
function storageClient(): Storage {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  const encodedKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64?.trim();
  if (projectId && clientEmail && encodedKey) return new Storage({ projectId, credentials: { client_email: clientEmail, private_key: Buffer.from(encodedKey, "base64").toString("utf8") } });
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return new Storage({ projectId: projectId || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT });
  throw new Error("CENTRE_STORAGE_UNAVAILABLE");
}
function fail(error: unknown) {
  const messages: Record<string, [number, string]> = {
    CENTRE_NOT_APPROVED: [409, "Approve the paper structure before identifying answers."],
    CENTRE_SCRIPT_NOT_FOUND: [404, "Candidate script not found."],
    CENTRE_STORAGE_UNAVAILABLE: [503, "Storage credentials unavailable."],
    ALIGN_NO_KEY: [503, "AI alignment is not configured."],
    ALIGN_PROVIDER: [502, "AI alignment request failed. Try again."],
    ALIGN_FORMAT: [422, "AI returned an invalid alignment. Retry or review manually."],
    ALIGN_INVALID: [422, "PDF text is unsuitable for automatic alignment."],
    CENTRE_SCAN: [422, "No selectable text found. Vision processing or manual transcription is required."],
    CENTRE_TRUNCATED: [422, "PDF text is truncated. Manual review is required before alignment."],
  };
  const code = error instanceof Error ? error.message : "";
  if (messages[code]) return NextResponse.json({ error: messages[code][1] }, { status: messages[code][0], headers });
  const result = centreError(error);
  return NextResponse.json({ error: result.error }, { status: result.status, headers });
}
export async function POST(request: Request, context: Context) {
  try {
    const actor = await requireAuthenticatedUser(request);
    requireCentreTeacher(actor);
    const { examId } = await context.params;
    if (!/^[\w-]{1,128}$/.test(examId)) throw new Error("CENTRE_INVALID");
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") throw new Error("CENTRE_INVALID");
    const input = body as { paperId?: unknown; candidateCode?: unknown };
    const paperId = input.paperId; const candidateCode = input.candidateCode;
    if (typeof paperId !== "string" || !/^paper-\d{1,2}$/.test(paperId) || typeof candidateCode !== "string" || !/^EX-[A-F0-9]{16}$/.test(candidateCode)) throw new Error("CENTRE_INVALID");
    const examRef = centreCollection.doc(examId);
    const exam = await examRef.get(); const examData = exam.data();
    if (!exam.exists || examData?.ownerId !== actor.uid || !Array.isArray(examData.papers) || !examData.papers.some((p: { id: string }) => p.id === paperId)) throw new Error("CENTRE_NOT_FOUND");
    const [structure, candidate, script] = await Promise.all([
      examRef.collection("paperStructures").doc(paperId).get(),
      examRef.collection("candidates").doc(candidateCode).get(),
      examRef.collection("candidateScripts").doc(`${paperId}_${candidateCode}`).get(),
    ]);
    const structureData = structure.data(); const scriptData = script.data();
    if (structureData?.status !== "approved" || !Array.isArray(structureData.questions) || !structureData.questions.length) throw new Error("CENTRE_NOT_APPROVED");
    if (!candidate.exists || !script.exists || scriptData?.paperId !== paperId || scriptData?.candidateCode !== candidateCode) throw new Error("CENTRE_SCRIPT_NOT_FOUND");
    const path = `marking-centre/${actor.uid}/${examId}/scripts/${paperId}/${candidateCode}.pdf`;
    if (scriptData.path !== path) throw new Error("CENTRE_SCRIPT_NOT_FOUND");
    const bucket = process.env.FIREBASE_ADMIN_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!bucket) throw new Error("CENTRE_STORAGE_UNAVAILABLE");
    const [bytes] = await storageClient().bucket(bucket).file(path).download();
    const extracted = await extractMarkingPdf(bytes);
    if (!extracted.text.trim()) throw new Error("CENTRE_SCAN");
    if (extracted.truncated) throw new Error("CENTRE_TRUNCATED");
    const questions = structureData.questions as { id: string; maxMarks: number }[];
    if (questions.length > 150 || questions.some(q => typeof q.id !== "string" || !Number.isInteger(q.maxMarks))) throw new Error("CENTRE_INVALID");
    const result = await alignAnswers(extracted.text, questions.map(q => ({ id: q.id, maxMarks: q.maxMarks })));
    return NextResponse.json({ paperId, candidateCode, ...result }, { headers });
  } catch (error) { return fail(error); }
}
