import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { Storage } from "@google-cloud/storage";
import { extractMarkingPdf } from "@/lib/marking/extractPdf";
import { requireAuthenticatedUser } from "@/lib/auth/requireUser";
import { centreCollection, centreError, requireCentreTeacher } from "@/lib/marking/centre";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Mark schemes are read page by page with vision; allow time for long documents.
export const maxDuration = 300;
const headers = { "Cache-Control": "no-store" };
type Context = { params: Promise<{ examId: string; paperId: string }> };
type Question = { id: string; maxMarks: number; criteria: string; notes: string };
const MAX_QUESTIONS = 150;


async function owned(request: Request, context: Context) {
  const actor = await requireAuthenticatedUser(request);
  requireCentreTeacher(actor);
  const { examId, paperId } = await context.params;
  if (!/^[\w-]{1,128}$/.test(examId) || !/^paper-\d{1,2}$/.test(paperId)) throw new Error("CENTRE_NOT_FOUND");
  const ref = centreCollection.doc(examId);
  const snap = await ref.get();
  if (!snap.exists || snap.data()?.ownerId !== actor.uid || !Array.isArray(snap.data()?.papers) || !snap.data()?.papers.some((p: { id: string }) => p.id === paperId)) throw new Error("CENTRE_NOT_FOUND");
  return { ref, paperId, actor };
}
function storage() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  const encodedKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64?.trim();
  if (projectId && clientEmail && encodedKey) return new Storage({ projectId, credentials: { client_email: clientEmail, private_key: Buffer.from(encodedKey, "base64").toString("utf8") } });
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return new Storage({ projectId: projectId || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT });
  throw new Error("CENTRE_STORAGE_UNAVAILABLE");
}
function fail(error: unknown) {
  if (error instanceof Error && error.message === "CENTRE_QUESTION_PDF_FAILED") return NextResponse.json({ error: "Question paper extraction failed. Check the uploaded PDF." }, { status: 422, headers });
  if (error instanceof Error && error.message === "CENTRE_SCHEME_PDF_FAILED") return NextResponse.json({ error: "Mark scheme extraction failed. Check the uploaded PDF." }, { status: 422, headers });
  if (error instanceof Error && error.message === "CENTRE_DUPLICATE_PDF_TEXT") return NextResponse.json({ error: "Question paper and mark scheme contain identical extracted text. Check the uploaded PDFs." }, { status: 422, headers });
  if (error instanceof Error && error.message === "CENTRE_STORAGE_UNAVAILABLE") return NextResponse.json({ error: "Storage credentials unavailable." }, { status: 503, headers });
  if (error instanceof Error && error.message === "CENTRE_MISSING_DOCUMENTS") return NextResponse.json({ error: "Upload a question paper PDF first." }, { status: 400, headers });
  if (error instanceof Error && error.message === "CENTRE_APPROVED") return NextResponse.json({ error: "Approved structures cannot be edited or re-extracted in Phase 3." }, { status: 409, headers });
  if (error instanceof Error && error.message === "CENTRE_INVALID") return NextResponse.json({ error: "Invalid question structure. Check question IDs, marks and criteria." }, { status: 400, headers });
  const result = centreError(error);
  return NextResponse.json({ error: result.error }, { status: result.status, headers });
}
export async function GET(request: Request, context: Context) {
  try {
    const { ref, paperId } = await owned(request, context);
    const snap = await ref.collection("paperStructures").doc(paperId).get();
    return NextResponse.json({ structure: snap.exists ? snap.data() : null }, { headers });
  } catch (error) { return fail(error); }
}

// Extraction provides source text only. It never invents marks, answers or question boundaries.
export async function POST(request: Request, context: Context) {
  try {
    const { ref, paperId } = await owned(request, context);
    const structureRef = ref.collection("paperStructures").doc(paperId);
    const previous = await structureRef.get();
    if (previous.data()?.status === "approved") throw new Error("CENTRE_APPROVED");
    const docs = await Promise.all(["questionPaper", "markScheme"].map(kind => ref.collection("paperDocuments").doc(`${paperId}_${kind}`).get()));
    if (!docs[0].exists || typeof docs[0].data()?.path !== "string") throw new Error("CENTRE_MISSING_DOCUMENTS");
    const bucketName = process.env.FIREBASE_ADMIN_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!bucketName) throw new Error("CENTRE_STORAGE_UNAVAILABLE");
    const bucket = storage().bucket(bucketName);
    const results: { text: string; pages: number; truncated: boolean }[] = [];
    const kinds = ["question paper", "mark scheme"];

    for (let i = 0; i < docs.length; i++) {
      if (!docs[i].exists) {
        results.push({ text: "", pages: 0, truncated: false });
        continue;
      }
      const path = docs[i].data()?.path as string;
      const [bytes] = await bucket.file(path).download();

      try {
        // Mark schemes (and scanned question papers) are read as page images so tables,
        // tick grids and the Guidance column survive. Falls back to text if vision fails.
        // Set MARKING_SCHEME_VISION=off to use text extraction only.
        const visionAllowed = process.env.MARKING_SCHEME_VISION?.trim().toLowerCase() !== "off";
        let extracted: { text: string; pages: number; truncated: boolean } | null = null;
        const textVersion = await extractMarkingPdf(bytes).catch(() => null);
        if (visionAllowed && (i === 1 || !textVersion?.text.trim())) {
          try {
            const { transcribeReferencePdf } = await import("@/lib/marking/visionPdf");
            extracted = await transcribeReferencePdf(bytes, i === 1 ? "markScheme" : "questionPaper");
          } catch (visionError) {
            console.error("[Marking Centre] vision reading failed; using PDF text:", kinds[i], visionError instanceof Error ? visionError.message : visionError);
          }
        }
        extracted = extracted ?? textVersion;

        if (!extracted || !extracted.text.trim()) {
          throw new Error("NO_SELECTABLE_TEXT");
        }

        results.push(extracted);
      } catch (error) {
        console.error("[Marking Centre] PDF extraction failed:", kinds[i], error instanceof Error ? error.message : error);
        throw new Error(i === 0 ? "CENTRE_QUESTION_PDF_FAILED" : "CENTRE_SCHEME_PDF_FAILED");
      }
    }

    if (results[1].text.trim() && results[0].text.trim() === results[1].text.trim()) {
      throw new Error("CENTRE_DUPLICATE_PDF_TEXT");
    }
    // Preserve teacher-entered draft questions on re-extraction, never silently overwrite edits.
    await structureRef.set({ paperId, status: "draft", questionText: results[0].text, markSchemeText: results[1].text, schemeSource: results[1].text.trim() ? "uploaded" : "no_uploaded_scheme", questionPages: results[0].pages, markSchemePages: results[1].pages, questionTextTruncated: results[0].truncated, markSchemeTextTruncated: results[1].truncated, questions: previous.data()?.questions ?? [], extractedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    return NextResponse.json({ message: "PDF text extracted. Verify the text and enter question-level marking criteria before approval.", textLengths: results.map(result => result.text.length) }, { headers });
  } catch (error) { console.error("[Marking Centre] Extraction:", error instanceof Error ? error.message : error); return fail(error); }
}
export async function PUT(request: Request, context: Context) {
  try {
    const { ref, paperId, actor } = await owned(request, context);
    const structureRef = ref.collection("paperStructures").doc(paperId);
    const existing = await structureRef.get();
    if (existing.data()?.status === "approved") throw new Error("CENTRE_APPROVED");
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") throw new Error("CENTRE_INVALID");
    const input = body as { questions?: unknown; approve?: unknown; criteriaOrigin?: unknown };
    if (!Array.isArray(input.questions) || input.questions.length < 1 || input.questions.length > MAX_QUESTIONS || typeof input.approve !== "boolean") throw new Error("CENTRE_INVALID");
    const questions: Question[] = [];
    const seen = new Set<string>();
    for (const raw of input.questions) {
      if (!raw || typeof raw !== "object") throw new Error("CENTRE_INVALID");
      const q = raw as Record<string, unknown>;
      const id = typeof q.id === "string" ? q.id.trim() : "";
      const criteria = typeof q.criteria === "string" ? q.criteria.trim() : "";
      const notes = typeof q.notes === "string" ? q.notes.trim() : "";
      if (!/^[a-zA-Z0-9][a-zA-Z0-9()._-]{0,39}$/.test(id) || seen.has(id.toLowerCase()) || !Number.isInteger(q.maxMarks) || (q.maxMarks as number) < 1 || (q.maxMarks as number) > 100 || criteria.length > 6000 || notes.length > 4000 || (input.approve && !criteria)) throw new Error("CENTRE_INVALID");
      seen.add(id.toLowerCase());
      questions.push({ id, maxMarks: q.maxMarks as number, criteria, notes });
    }
    const totalMarks = questions.reduce((sum, q) => sum + q.maxMarks, 0);
    if (totalMarks > 1000) throw new Error("CENTRE_INVALID");
    const approved = input.approve === true;
    const uploadedScheme = Boolean(
      typeof existing.data()?.markSchemeText === "string" &&
      existing.data()?.markSchemeText.trim()
    );
    const requestedOrigin = input.criteriaOrigin;
    if (
      requestedOrigin !== undefined &&
      !["manual", "ai-assisted"].includes(String(requestedOrigin))
    ) throw new Error("CENTRE_INVALID");

    const criteriaProvenance = uploadedScheme
      ? requestedOrigin === "ai-assisted"
        ? "teacher_verified_ai_assisted_uploaded_scheme"
        : "teacher_verified_uploaded_scheme"
      : requestedOrigin === "ai-assisted"
        ? "teacher_verified_ai_generated_draft"
        : "teacher_authored_without_uploaded_scheme";
    await structureRef.set({ paperId, questions, totalMarks, schemeSource: existing.data()?.schemeSource ?? "teacher_entered", criteriaProvenance, status: approved ? "approved" : "draft", updatedAt: FieldValue.serverTimestamp(), ...(approved ? { approvedAt: FieldValue.serverTimestamp(), approvedBy: actor.uid } : {}) }, { merge: true });
    return NextResponse.json({ status: approved ? "approved" : "draft", totalMarks }, { headers });
  } catch (error) { return fail(error); }
}


// Phase 3.1: AI generates a proposal only; it never changes an approved or draft structure.
export async function PATCH(request: Request, context: Context) {
  try {
    const { ref, paperId } = await owned(request, context);
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || (body as { action?: unknown }).action !== "suggest") throw new Error("CENTRE_INVALID");
    const snap = await ref.collection("paperStructures").doc(paperId).get();
    const data = snap.data();
    if (data?.status === "approved") throw new Error("CENTRE_APPROVED");
    const questionText = typeof data?.questionText === "string" ? data.questionText : "";
    const markSchemeText = typeof data?.markSchemeText === "string" ? data.markSchemeText : "";
    if (!questionText.trim()) return NextResponse.json({ error: "Extract the question paper first. Scanned PDFs without selectable text require manual transcription." }, { status: 400, headers });
    if (data?.questionTextTruncated || data?.markSchemeTextTruncated) return NextResponse.json({ error: "The extracted PDF text is truncated. Review the complete document manually before AI generation." }, { status: 422, headers });
    const { suggestPaperStructure } = await import("@/lib/marking/autoStructure");
    const suggestion = await suggestPaperStructure({ questionText, markSchemeText, truncated: Boolean(data?.questionTextTruncated || data?.markSchemeTextTruncated) });
    return NextResponse.json({ suggestion }, { headers });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("AUTO_")) {
      const mapping: Record<string, [number, string]> = {
        AUTO_NO_KEY: [503, "AI processing is not configured. Set OPENAI_API_KEY on the local server."],
        AUTO_PROVIDER: [502, "AI provider request failed. Check the server logs and retry."],
        AUTO_FORMAT: [422, "AI could not produce a valid question structure. Review the source PDFs and retry."],
        AUTO_INCOMPLETE: [422, "AI could not confidently identify any complete questions. Review the PDFs manually."],
      };
      const [status, message] = mapping[error.message] ?? [500, "AI generation failed."];
      return NextResponse.json({ error: message }, { status, headers });
    }
    return fail(error);
  }
}
