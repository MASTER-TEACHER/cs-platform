import "server-only";
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { authenticatedUserError, requireAuthenticatedUser } from "@/lib/auth/requireUser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const valid = (s: string | null) => !!s && /^[A-Za-z0-9_-]{1,200}$/.test(s);

export async function GET(request: Request) {
  try {
    const actor = await requireAuthenticatedUser(request);
    const assignmentId = new URL(request.url).searchParams.get("assignmentId");
    if (!valid(assignmentId)) return NextResponse.json({ error: "Invalid examination." }, { status: 400 });
    const ref = adminDb.collection("examSubmissions").doc(`${assignmentId}_${actor.uid}`);
    const snap = await ref.get();
    if (!snap.exists || snap.data()?.studentId !== actor.uid || snap.data()?.assignmentId !== assignmentId) {
      return NextResponse.json({ error: "Submission not found." }, { status: 404 });
    }
    const data = snap.data()!;
    const [assignmentSnap, studentSnap] = await Promise.all([
      adminDb.collection("examAssignments").doc(assignmentId!).get(),
      adminDb.collection("users").doc(actor.uid).get(),
    ]);
    if (!assignmentSnap.exists || !studentSnap.exists ||
        !assignmentSnap.data()?.studentIds?.includes(actor.uid) ||
        studentSnap.data()?.schoolId !== actor.schoolId || !actor.schoolId) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }
    if (data.resultsReleased !== true) {
      return NextResponse.json({ released: false, status: data.status }, { headers: { "Cache-Control": "no-store" } });
    }
    return NextResponse.json({ released: true, status: data.status,
      totalAwardedMarks: data.totalAwardedMarks ?? 0,
      totalAvailableMarks: data.totalAvailableMarks ?? 0,
      percentage: data.percentage ?? 0,
      overallFeedback: data.overallFeedback ?? "",
      answers: Array.isArray(data.answers) ? data.answers.map((a: Record<string,unknown>) => ({
        questionId: a.questionId, awardedMarks: a.awardedMarks, teacherFeedback: a.teacherFeedback,
      })) : [],
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const auth = authenticatedUserError(error);
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }
}
