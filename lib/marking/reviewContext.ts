import "server-only";
import { createHash } from "node:crypto";
import { Storage } from "@google-cloud/storage";
import { requireAuthenticatedUser } from "@/lib/auth/requireUser";
import { centreCollection, requireCentreTeacher } from "@/lib/marking/centre";
import { extractMarkingPdf } from "@/lib/marking/extractPdf";

export type MarkQuestion = { id: string; maxMarks: number; criteria: string; notes: string };
export type ReviewMark = { questionId: string; answerText: string; awardedMarks: number; feedback: string; improvementGuidance?: string; evidence: string; confidence: "high" | "medium" | "low"; needsReview: boolean; teacherJustification?: string };
export type ReviewContext = Awaited<ReturnType<typeof loadReviewContext>>;
function storageClient() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim();
  const email = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  const encoded = process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64?.trim();
  if (projectId && email && encoded) return new Storage({ projectId, credentials: { client_email: email, private_key: Buffer.from(encoded, "base64").toString("utf8") } });
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return new Storage({ projectId });
  throw new Error("CENTRE_STORAGE_UNAVAILABLE");
}
export async function loadReviewContext(request: Request, examId: string, paperId: string, candidateCode: string) {
  const actor = await requireAuthenticatedUser(request);
  requireCentreTeacher(actor);
  if (!/^[\w-]{1,128}$/.test(examId) || !/^paper-\d{1,2}$/.test(paperId) || !/^EX-[A-F0-9]{16}$/.test(candidateCode)) throw new Error("CENTRE_INVALID");
  const examRef = centreCollection.doc(examId);
  const exam = await examRef.get();
  if (!exam.exists || exam.data()?.ownerId !== actor.uid || !Array.isArray(exam.data()?.papers) || !exam.data()?.papers.some((p: {id:string}) => p.id === paperId)) throw new Error("CENTRE_NOT_FOUND");
  const [structure, candidate, script] = await Promise.all([
    examRef.collection("paperStructures").doc(paperId).get(),
    examRef.collection("candidates").doc(candidateCode).get(),
    examRef.collection("candidateScripts").doc(`${paperId}_${candidateCode}`).get(),
  ]);
  const questions = structure.data()?.questions as MarkQuestion[] | undefined;
  if (structure.data()?.status !== "approved" || !Array.isArray(questions) || questions.length < 1 || questions.length > 150 || questions.some(q => !q.id || !q.criteria || !Number.isInteger(q.maxMarks) || q.maxMarks < 1 || q.maxMarks > 100)) throw new Error("CENTRE_NOT_APPROVED");
  const expectedPath = `marking-centre/${actor.uid}/${examId}/scripts/${paperId}/${candidateCode}.pdf`;
  if (!candidate.exists || !script.exists || script.data()?.path !== expectedPath || script.data()?.candidateCode !== candidateCode || script.data()?.paperId !== paperId) throw new Error("CENTRE_SCRIPT_NOT_FOUND");
  const bucketName = process.env.FIREBASE_ADMIN_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (!bucketName) throw new Error("CENTRE_STORAGE_UNAVAILABLE");
  const [bytes] = await storageClient().bucket(bucketName).file(expectedPath).download();
  const scriptHash = createHash("sha256").update(bytes).digest("hex");
  const structureHash = createHash("sha256").update(JSON.stringify(questions)).digest("hex");
  return { actor, examRef, paperId, candidateCode, questions, bytes, scriptHash, structureHash,
    reviewRef: examRef.collection("markingReviews").doc(`${paperId}_${candidateCode}`) };
}
export async function extractReviewText(ctx: ReviewContext) {
  const extracted = await extractMarkingPdf(ctx.bytes);
  if (!extracted.text.trim()) throw new Error("CENTRE_SCAN");
  if (extracted.truncated) throw new Error("CENTRE_TRUNCATED");
  return extracted.text;
}
export function validateMarks(marks: unknown, questions: MarkQuestion[]): asserts marks is ReviewMark[] {
  if (!Array.isArray(marks) || marks.length !== questions.length) throw new Error("CENTRE_INVALID");
  const map = new Map(questions.map(q => [q.id, q.maxMarks]));
  const seen = new Set<string>();
  for (const mark of marks) {
    if (!mark || typeof mark !== "object" || typeof mark.questionId !== "string" || seen.has(mark.questionId) || !map.has(mark.questionId) ||
      !Number.isInteger(mark.awardedMarks) || mark.awardedMarks < 0 || mark.awardedMarks > map.get(mark.questionId)! ||
      typeof mark.answerText !== "string" || mark.answerText.length > 12000 || typeof mark.feedback !== "string" || mark.feedback.length > 3000 ||
      (mark.improvementGuidance !== undefined && (typeof mark.improvementGuidance !== "string" || mark.improvementGuidance.length > 3000)) || typeof mark.evidence !== "string" || mark.evidence.length > 3000 || (mark.teacherJustification !== undefined && (typeof mark.teacherJustification !== "string" || mark.teacherJustification.length > 1500)) || !["high", "medium", "low"].includes(mark.confidence) || typeof mark.needsReview !== "boolean") throw new Error("CENTRE_INVALID");
    seen.add(mark.questionId);
  }
}
