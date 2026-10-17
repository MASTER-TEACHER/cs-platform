import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireBillingActor, billingAuthError } from "@/lib/billing/auth";
import { serializeSchoolMembershipChange } from "@/lib/billing/transactionalSeats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const clean = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

/** Self-service student exit only. Administrative removals require a separate audited flow. */
export async function POST(request: Request) {
  try {
    const actor = await requireBillingActor(request);
    if (actor.role !== "student") {
      return NextResponse.json({ error: "Only students can use self-service school leaving." }, { status: 403 });
    }
    const schoolId = clean(actor.schoolId);
    if (!schoolId) {
      return NextResponse.json({ error: "You are not currently linked to a school." }, { status: 409 });
    }

    // Scan all classes in the school, including legacy students-only rosters.
    // Fail closed for unusually large schools until a paginated audited workflow exists.
    const classes = await adminDb.collection("classes")
      .where("schoolId", "==", schoolId).limit(101).get();
    if (classes.size > 100) {
      return NextResponse.json({ error: "This school has more than 100 classes. Please contact an administrator to complete the exit safely." }, { status: 409 });
    }

    const userRef = adminDb.collection("users").doc(actor.uid);
    const memberRef = adminDb.collection("schools").doc(schoolId).collection("members").doc(actor.uid);
    const result = await adminDb.runTransaction(async (tx) => {
      // Firestore transactions require all reads before writes.
      const schoolRef = adminDb.collection("schools").doc(schoolId);
      const [user, membership, school, ...freshClasses] = await Promise.all([
        tx.get(userRef), tx.get(memberRef), tx.get(schoolRef),
        ...classes.docs.map((entry) => tx.get(entry.ref)),
      ]);
      if (!school.exists) throw new Error("SCHOOL_MEMBERSHIP_CHANGED");
      if (!user.exists) throw new Error("PROFILE_NOT_FOUND");
      const profile = user.data() ?? {};
      if (clean(profile.schoolId) !== schoolId || profile.role !== "student") {
        throw new Error("SCHOOL_MEMBERSHIP_CHANGED");
      }
      if (membership.exists && membership.data()?.status === "former") {
        throw new Error("SCHOOL_MEMBERSHIP_CHANGED");
      }
      let removedFromClasses = 0;
      for (let i = 0; i < freshClasses.length; i++) {
        const snapshot = freshClasses[i];
        if (!snapshot.exists) continue;
        const data = snapshot.data() ?? {};
        if (clean(data.schoolId) !== schoolId) throw new Error("CLASS_CHANGED");
        const studentIds = Array.isArray(data.studentIds) ? data.studentIds : [];
        const students = Array.isArray(data.students) ? data.students : [];
        const listed = studentIds.includes(actor.uid) || students.some((entry: unknown) =>
          entry && typeof entry === "object" && (entry as { studentId?: unknown }).studentId === actor.uid);
        if (!listed) continue;
        removedFromClasses++;
        tx.update(snapshot.ref, {
          studentIds: studentIds.filter((id: unknown) => id !== actor.uid),
          students: students.filter((student: unknown) =>
            !student || typeof student !== "object" ||
            (student as { studentId?: unknown }).studentId !== actor.uid),
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
      serializeSchoolMembershipChange(tx, schoolRef);
      tx.set(memberRef, {
        schoolId, userId: actor.uid, role: "student", status: "former",
        leftAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
      tx.update(userRef, {
        schoolId: null, accountType: "individual",
        plan: profile.personalPlan === "premium" ? "premium" : "free",
        classIds: [], updatedAt: FieldValue.serverTimestamp(),
      });
      return { removedFromClasses };
    });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    if (error instanceof Error && ["SCHOOL_MEMBERSHIP_CHANGED", "CLASS_CHANGED"].includes(error.message)) {
      return NextResponse.json({ error: "Your membership changed during this request. Please refresh and retry." }, { status: 409 });
    }
    const failure = billingAuthError(error);
    return NextResponse.json({ error: failure.message }, { status: failure.status });
  }
}
