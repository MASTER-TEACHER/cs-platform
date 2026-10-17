import "server-only";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireAuthenticatedUser, authenticatedUserError } from "@/lib/auth/requireUser";
import { validateExamMarking } from "@/lib/marking/validateExamMarking";
import type { StudentExamAnswer } from "@/types/examAssignment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const safeId = (v: unknown): v is string => typeof v === "string" && /^[A-Za-z0-9_-]{1,200}$/.test(v);

export async function POST(request: Request) {
  try {
    const actor = await requireAuthenticatedUser(request);
    if (!(["teacher", "admin"].includes(actor.role.toLowerCase())) || !actor.schoolId) {
      return NextResponse.json({error:"Teacher access required."},{status:403});
    }
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") return NextResponse.json({error:"Invalid request."},{status:400});
    const input = body as Record<string,unknown>;
    const {assignmentId,studentId,action} = input;
    if (!safeId(assignmentId) || !safeId(studentId) || !["draft","finalise","release"].includes(String(action))) {
      return NextResponse.json({error:"Invalid marking request."},{status:400});
    }
    const answers = input.answers as StudentExamAnswer[];
    const feedback = typeof input.overallFeedback === "string" ? input.overallFeedback.trim() : "";
    const reason = typeof input.reason === "string" ? input.reason.trim() : "";
    if (feedback.length > 10000 || reason.length > 1000) return NextResponse.json({error:"Feedback too long."},{status:400});
    const assignmentRef=adminDb.collection("examAssignments").doc(assignmentId);
    const submissionRef=adminDb.collection("examSubmissions").doc(`${assignmentId}_${studentId}`);
    const auditRef=submissionRef.collection("markingAudit").doc();
    await adminDb.runTransaction(async tx => {
      const [assignmentSnap,submissionSnap] = await Promise.all([tx.get(assignmentRef),tx.get(submissionRef)]);
      if (!assignmentSnap.exists || !submissionSnap.exists) throw new Error("NOT_FOUND");
      const assignment=assignmentSnap.data()!;
      const submission=submissionSnap.data()!;
      if (assignment.teacherId !== actor.uid || submission.teacherId !== actor.uid ||
          !assignment.studentIds?.includes(studentId) || assignment.classId !== submission.classId ||
          submission.studentId !== studentId || submission.assignmentId !== assignmentId) throw new Error("FORBIDDEN");
      const classSnap=await tx.get(adminDb.collection("classes").doc(assignment.classId));
      const studentSnap=await tx.get(adminDb.collection("users").doc(studentId));
      if (!classSnap.exists || !studentSnap.exists || classSnap.data()?.teacherId !== actor.uid ||
          classSnap.data()?.schoolId !== actor.schoolId || studentSnap.data()?.schoolId !== actor.schoolId ||
          !classSnap.data()?.studentIds?.includes(studentId) ||
          ["deleting","deleted"].includes(classSnap.data()?.status)) throw new Error("FORBIDDEN");
      if (!["submitted","marking","marked"].includes(submission.status)) throw new Error("NOT_READY");
      if (action === "release") {
        if (submission.status !== "marked") throw new Error("NOT_READY");
        if (submission.resultsReleased === true) return;
        tx.update(submissionRef,{resultsReleased:true,releasedAt:FieldValue.serverTimestamp(),releasedBy:actor.uid,updatedAt:FieldValue.serverTimestamp()});
        tx.create(auditRef,{action:"release",actorId:actor.uid,at:FieldValue.serverTimestamp(),assignmentId,studentId});
        return;
      }
      validateExamMarking(assignment.questionSetSnapshot?.questions,answers,action === "finalise");
      const questions=assignment.questionSetSnapshot.questions as {marks:number}[];
      const total=questions.reduce((n,q)=>n+q.marks,0);
      const awarded=answers.reduce((n,a)=>n+(a.awardedMarks ?? 0),0);
      if (submission.resultsReleased === true && !reason) throw new Error("REASON_REQUIRED");
      if (action === "draft" && submission.status === "marked") throw new Error("NOT_READY");
      const previousAnswers = Array.isArray(submission.answers) ? submission.answers : [];
      const preserved = answers.map((a)=>({...a,response:previousAnswers.find((old:StudentExamAnswer)=>old.questionId===a.questionId)?.response ?? ""}));
      const changed=JSON.stringify(previousAnswers.map((a:StudentExamAnswer)=>[a.questionId,a.awardedMarks,a.teacherFeedback])) !== JSON.stringify(preserved.map(a=>[a.questionId,a.awardedMarks,a.teacherFeedback]));
      const update: Record<string,unknown> = {answers:preserved,overallFeedback:feedback,totalAwardedMarks:awarded,totalAvailableMarks:total,percentage:Math.round(awarded/total*100),status:action === "finalise" ? "marked":"marking",updatedAt:FieldValue.serverTimestamp()};
      if (action === "finalise") update.markedAt=FieldValue.serverTimestamp();
      if (action === "finalise" && submission.resultsReleased !== true) update.resultsReleased=false;
      tx.update(submissionRef,update);
      if (action === "finalise" && submission.status !== "marked") {
        tx.update(assignmentRef,{markedCount:FieldValue.increment(1),updatedAt:FieldValue.serverTimestamp()});
      }
      tx.create(auditRef,{action,actorId:actor.uid,at:FieldValue.serverTimestamp(),assignmentId,studentId,reason,changed,previousStatus:submission.status,newStatus:action === "finalise" ? "marked" : "marking",previousMarks:previousAnswers.map((a:StudentExamAnswer)=>({questionId:a.questionId,marks:a.awardedMarks??null})),newMarks:preserved.map(a=>({questionId:a.questionId,marks:a.awardedMarks??null})),previousTotal:submission.totalAwardedMarks??0,newTotal:awarded});
    });
    return NextResponse.json({ok:true},{headers:{"Cache-Control":"no-store"}});
  } catch(error) {
    const code=error instanceof Error ? error.message : "";
    const errors:Record<string,[number,string]>={NOT_FOUND:[404,"Exam or submission not found."],FORBIDDEN:[403,"Not authorised for this exam."],NOT_READY:[409,"Submission is not ready."],REASON_REQUIRED:[409,"Provide a reason before changing released marks."]};
    if (errors[code]) return NextResponse.json({error:errors[code][1]},{status:errors[code][0]});
    if (code.startsWith("The marking") || code.startsWith("Duplicate") || code.startsWith("Awarded")) return NextResponse.json({error:code},{status:400});
    const auth=authenticatedUserError(error);
    return NextResponse.json({error:auth.message},{status:auth.status});
  }
}
