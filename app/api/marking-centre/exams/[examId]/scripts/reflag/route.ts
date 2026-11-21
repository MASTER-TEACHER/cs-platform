import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { requireAuthenticatedUser } from "@/lib/auth/requireUser";
import { centreCollection, centreError, requireCentreTeacher } from "@/lib/marking/centre";
import { isMaterialUncertainty, qualityFlags } from "@/lib/marking/reviewFlags";
import type { ReviewMark } from "@/lib/marking/reviewContext";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
type Context = { params: Promise<{ examId: string }> };

// FREE RE-CHECK OF FLAGS (no AI calls, no cost)
// Recalculates each question's review flag from the reasons already saved in its evidence line,
// using the current rules. Marks, feedback and evidence are never changed. Approved scripts and
// questions a teacher has overridden are left alone.

function segment(evidence: string, label: string): string | null {
  const match = evidence.match(new RegExp(`(?:^|\\| )${label}: (.*?)(?= \\| [A-Z][a-z]+: |$)`));
  return match ? match[1] : null;
}

function recheck(mark: ReviewMark): ReviewMark {
  if ((mark.teacherJustification ?? "").trim()) return mark;
  const evidence = mark.evidence ?? "";
  if (/^No candidate writing found|^No assessable response/.test(evidence)) return { ...mark, needsReview: false, confidence: "high" };
  if (/AI marking failed twice/.test(evidence)) return { ...mark, needsReview: true, confidence: "low" };
  if (!/(?:^|\| )Credited: /.test(evidence)) return mark; // older format: leave unchanged
  const uncertain = (segment(evidence, "Uncertain") ?? "").split(/;\s*/).map(u => u.trim()).filter(u => isMaterialUncertainty(u));
  const credited = segment(evidence, "Credited") ?? "";
  const needsReview =
    /Moderator changed/.test(evidence) ||
    segment(evidence, "Checks") !== null ||
    /Marked by one examiner only|Moderation unavailable/.test(evidence) ||
    uncertain.length > 0 ||
    /UNCERTAIN/.test(credited);
  return { ...mark, needsReview, confidence: needsReview ? "low" : "high" };
}

export async function POST(request: Request, context: Context) {
  try {
    const actor = await requireAuthenticatedUser(request);
    requireCentreTeacher(actor);
    const { examId } = await context.params;
    if (!/^[\w-]{1,128}$/.test(examId)) throw new Error("CENTRE_NOT_FOUND");
    const ref = centreCollection.doc(examId);
    const exam = await ref.get();
    if (!exam.exists || exam.data()?.ownerId !== actor.uid) throw new Error("CENTRE_NOT_FOUND");

    const [reviews, structures] = await Promise.all([
      ref.collection("markingReviews").limit(1000).get(),
      ref.collection("paperStructures").limit(20).get(),
    ]);
    const questionsByPaper = new Map(structures.docs.map(d => [d.id, Array.isArray(d.data().questions) ? d.data().questions : []]));
    let checked = 0, cleared = 0, stillFlagged = 0;

    for (const doc of reviews.docs) {
      const data = doc.data();
      if (!["proposed", "reviewing"].includes(data.status) || !Array.isArray(data.marks)) continue;
      const before = data.marks as ReviewMark[];
      const after = before.map(recheck);
      const questions = (questionsByPaper.get(data.paperId) || []) as { id: string; maxMarks: number }[];
      const flags = qualityFlags(after, questions, Array.isArray(data.alignmentWarnings) ? data.alignmentWarnings : []);
      checked++;
      if (flags.length) stillFlagged++; else cleared++;
      const changed = after.some((m, i) => m.needsReview !== before[i].needsReview || m.confidence !== before[i].confidence);
      if (!changed) continue;
      await doc.ref.update({ marks: after, qualityFlags: flags, revision: (Number(data.revision) || 0) + 1, updatedAt: FieldValue.serverTimestamp() });
      await doc.ref.collection("audit").add({ action: "reflag", actorId: actor.uid, at: FieldValue.serverTimestamp(), revision: (Number(data.revision) || 0) + 1, note: "Flags recalculated from saved evidence; marks unchanged." });
    }
    return NextResponse.json({ checked, cleared, stillFlagged }, { headers });
  } catch (error) {
    const result = centreError(error);
    return NextResponse.json({ error: result.error }, { status: result.status, headers });
  }
}
