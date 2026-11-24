import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import { requireAuthenticatedUser } from "@/lib/auth/requireUser";
import { centreCollection, centreError, requireCentreTeacher } from "@/lib/marking/centre";
import { findAnswerPage } from "@/lib/marking/findPage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
type Context = { params: Promise<{ examId: string }> };

// VIEW A SCRIPT
// Returns a 10-minute, read-only link to one candidate's PDF (shown inline in the
// review side panel) and the page the given question's answer appears on.

function bucket() {
  const name = process.env.FIREBASE_ADMIN_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (!name) throw new Error("CENTRE_STORAGE_UNAVAILABLE");
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  const encodedKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64?.trim();
  if (projectId && clientEmail && encodedKey) {
    return new Storage({ projectId, credentials: { client_email: clientEmail, private_key: Buffer.from(encodedKey, "base64").toString("utf8") } }).bucket(name);
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return new Storage({ projectId: projectId || process.env.GOOGLE_CLOUD_PROJECT }).bucket(name);
  throw new Error("CENTRE_STORAGE_UNAVAILABLE");
}

export async function GET(request: Request, context: Context) {
  try {
    const actor = await requireAuthenticatedUser(request);
    requireCentreTeacher(actor);
    const { examId } = await context.params;
    const url = new URL(request.url);
    const paperId = url.searchParams.get("paperId") ?? "";
    const candidateCode = url.searchParams.get("candidateCode") ?? "";
    const questionId = url.searchParams.get("questionId") ?? "";
    if (!/^[\w-]{1,128}$/.test(examId) || !/^paper-\d{1,2}$/.test(paperId) || !/^[A-Z0-9][A-Z0-9_-]{0,127}$/.test(candidateCode) || (questionId && !/^[\w().\- ]{1,40}$/.test(questionId))) throw new Error("CENTRE_NOT_FOUND");
    const ref = centreCollection.doc(examId);
    const exam = await ref.get();
    if (!exam.exists || exam.data()?.ownerId !== actor.uid) throw new Error("CENTRE_NOT_FOUND");

    const key = `${paperId}_${candidateCode}`;
    const [script, transcript, review] = await Promise.all([
      ref.collection("candidateScripts").doc(key).get(),
      ref.collection("transcripts").doc(key).get(),
      ref.collection("markingReviews").doc(key).get(),
    ]);
    const path = `marking-centre/${actor.uid}/${examId}/scripts/${paperId}/${candidateCode}.pdf`;
    if (!script.exists || script.data()?.path !== path) throw new Error("CENTRE_NOT_FOUND");

    const [signed] = await bucket().file(path).getSignedUrl({
      version: "v4", action: "read", expires: Date.now() + 10 * 60 * 1000,
      responseDisposition: "inline", responseType: "application/pdf",
    });

    let page = 1;
    const text = transcript.data()?.text;
    if (questionId && typeof text === "string") {
      const marks = Array.isArray(review.data()?.marks) ? review.data()!.marks as { questionId: string; answerText: string }[] : [];
      page = findAnswerPage(text, questionId, marks.find(m => m.questionId === questionId)?.answerText ?? "");
    }
    const pages = Number(transcript.data()?.pages) || null;
    return NextResponse.json({ url: signed, page, pages }, { headers });
  } catch (error) {
    const result = centreError(error);
    return NextResponse.json({ error: result.error }, { status: result.status, headers });
  }
}
