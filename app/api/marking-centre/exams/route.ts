import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { requireAuthenticatedUser } from "@/lib/auth/requireUser";
import { centreCollection, centreError, cleanText, requireCentreTeacher } from "@/lib/marking/centre";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  try {
    const actor = await requireAuthenticatedUser(request);
    requireCentreTeacher(actor);
    const snapshot = await centreCollection.where("ownerId", "==", actor.uid).limit(100).get();
    const exams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? null }));
    exams.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    return NextResponse.json({ exams }, { headers });
  } catch (error) { const result = centreError(error); return NextResponse.json({ error: result.error }, { status: result.status, headers }); }
}

export async function POST(request: Request) {
  try {
    const actor = await requireAuthenticatedUser(request);
    requireCentreTeacher(actor);
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("CENTRE_INVALID");
    const input = body as Record<string, unknown>;
    const title = cleanText(input.title, 140);
    const subject = cleanText(input.subject, 80);
    const yearGroup = cleanText(input.yearGroup, 40);
    const qualificationLevel = cleanText(input.qualificationLevel, 40);
    if (!title || !subject || !yearGroup || !qualificationLevel) throw new Error("CENTRE_INVALID");
    const rawPapers = input.papers;
    if (!Array.isArray(rawPapers) || rawPapers.length < 1 || rawPapers.length > 12) throw new Error("CENTRE_INVALID");
    const papers = rawPapers.map((value, index) => {
      if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("CENTRE_INVALID");
      const paper = value as Record<string, unknown>;
      const paperTitle = cleanText(paper.title, 120);
      if (!paperTitle) throw new Error("CENTRE_INVALID");
      return { id: `paper-${index + 1}`, title: paperTitle, status: "awaiting_documents", questions: [], totalMarks: null, gradeBoundaries: null };
    });
    const ref = centreCollection.doc();
    await ref.create({ ownerId: actor.uid, schoolId: actor.schoolId || null, title, subject, yearGroup, qualificationLevel, papers, totalMarks: null, candidateCount: 0, status: "setup", createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(), schemaVersion: 2 });
    return NextResponse.json({ id: ref.id, title, subject, yearGroup, qualificationLevel, papers, candidateCount: 0 }, { status: 201, headers });
  } catch (error) { const result = centreError(error); return NextResponse.json({ error: result.error }, { status: result.status, headers }); }
}
