import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import { requireAuthenticatedUser } from "@/lib/auth/requireUser";
import { centreCollection, centreError, requireCentreTeacher } from "@/lib/marking/centre";
import { extractMarkingPdf } from "@/lib/marking/extractPdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
type Context = { params: Promise<{ examId: string }> };

function storageClient(): Storage {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  const encodedKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64?.trim();
  if (projectId && clientEmail && encodedKey) {
    return new Storage({
      projectId,
      credentials: {
        client_email: clientEmail,
        private_key: Buffer.from(encodedKey, "base64").toString("utf8"),
      },
    });
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return new Storage({ projectId: projectId || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT });
  }
  throw new Error("CENTRE_STORAGE_UNAVAILABLE");
}

function failure(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "CENTRE_NOT_APPROVED") return NextResponse.json({ error: "Approve the paper's marking structure before extracting candidate answers." }, { status: 409, headers });
    if (error.message === "CENTRE_SCRIPT_NOT_FOUND") return NextResponse.json({ error: "Candidate script not found for this paper." }, { status: 404, headers });
    if (error.message === "CENTRE_STORAGE_UNAVAILABLE") return NextResponse.json({ error: "Storage credentials are unavailable." }, { status: 503, headers });
    if (error.message === "CENTRE_INVALID_PDF") return NextResponse.json({ error: "Candidate script is not a supported PDF." }, { status: 422, headers });
  }
  const result = centreError(error);
  return NextResponse.json({ error: result.error }, { status: result.status, headers });
}

// Read-only Phase 4 preparation. Never marks, modifies or approves a script.
export async function GET(request: Request, context: Context) {
  try {
    const actor = await requireAuthenticatedUser(request);
    requireCentreTeacher(actor);
    const { examId } = await context.params;
    const url = new URL(request.url);
    const paperId = url.searchParams.get("paperId") ?? "";
    const candidateCode = (url.searchParams.get("candidateCode") ?? "").toUpperCase();
    if (!/^[\w-]{1,128}$/.test(examId) || !/^paper-\d{1,2}$/.test(paperId) || !/^EX-[A-F0-9]{16}$/.test(candidateCode)) {
      throw new Error("CENTRE_INVALID");
    }
    const examRef = centreCollection.doc(examId);
    const exam = await examRef.get();
    const examData = exam.data();
    if (!exam.exists || examData?.ownerId !== actor.uid || !Array.isArray(examData.papers) || !examData.papers.some((p: { id: string }) => p.id === paperId)) {
      throw new Error("CENTRE_NOT_FOUND");
    }
    const [structure, candidate, script] = await Promise.all([
      examRef.collection("paperStructures").doc(paperId).get(),
      examRef.collection("candidates").doc(candidateCode).get(),
      examRef.collection("candidateScripts").doc(`${paperId}_${candidateCode}`).get(),
    ]);
    const structureData = structure.data();
    if (structureData?.status !== "approved" || !Array.isArray(structureData.questions) || structureData.questions.length === 0) {
      throw new Error("CENTRE_NOT_APPROVED");
    }
    const scriptData = script.data();
    if (!candidate.exists || !script.exists || scriptData?.candidateCode !== candidateCode || scriptData?.paperId !== paperId) {
      throw new Error("CENTRE_SCRIPT_NOT_FOUND");
    }
    const expectedPath = `marking-centre/${actor.uid}/${examId}/scripts/${paperId}/${candidateCode}.pdf`;
    if (scriptData.path !== expectedPath) throw new Error("CENTRE_SCRIPT_NOT_FOUND");
    const bucketName = process.env.FIREBASE_ADMIN_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!bucketName) throw new Error("CENTRE_STORAGE_UNAVAILABLE");
    const [bytes] = await storageClient().bucket(bucketName).file(expectedPath).download();
    const extracted = await extractMarkingPdf(bytes);
    const text = extracted.text.trim();
    const hasSelectableText = text.length > 0;
    return NextResponse.json({
      paperId,
      candidateCode,
      filename: scriptData.originalName ?? null,
      approvedQuestions: structureData.questions.map((q: { id: string; maxMarks: number }) => ({ id: q.id, maxMarks: q.maxMarks })),
      extraction: {
        status: !hasSelectableText ? "requires_vision_or_manual_transcription" : extracted.truncated ? "truncated_review_required" : "text_available_review_required",
        pages: extracted.pages,
        truncated: extracted.truncated,
        text,
      },
      markingEnabled: false,
      teacherReviewRequired: true,
    }, { headers });
  } catch (error) {
    return failure(error);
  }
}
