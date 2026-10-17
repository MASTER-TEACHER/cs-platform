import "server-only";
import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import { authenticatedUserError, requireAuthenticatedUser } from "@/lib/auth/requireUser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const safeId = (value: string | null): string =>
  value && /^[A-Za-z0-9_-]{1,200}$/.test(value) ? value : "";

/**
 * Issue a stable, random, pseudonymous student identifier only to the
 * owning teacher of an exam assigned to the student. This code is NOT a
 * login credential or an official JCQ candidate number.
 *
 * Stored separately from user profiles and submissions. Never put the
 * mapping in a client-readable collection or include it in public exports.
 */
export async function GET(request: Request) {
  try {
    const actor = await requireAuthenticatedUser(request);
    if (actor.role.toLowerCase() !== "teacher" || !actor.schoolId) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    const url = new URL(request.url);
    const assignmentId = safeId(url.searchParams.get("assignmentId"));
    const studentId = safeId(url.searchParams.get("studentId"));
    if (!assignmentId || !studentId) {
      return NextResponse.json({ error: "Invalid assignment or student." }, { status: 400 });
    }

    const assignmentSnap = await adminDb.collection("examAssignments").doc(assignmentId).get();
    const assignment = assignmentSnap.data() ?? {};
    if (!assignmentSnap.exists || assignment.teacherId !== actor.uid ||
        !Array.isArray(assignment.studentIds) || !assignment.studentIds.includes(studentId) ||
        typeof assignment.classId !== "string" || !safeId(assignment.classId)) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    const [classSnap, studentSnap] = await Promise.all([
      adminDb.collection("classes").doc(assignment.classId).get(),
      adminDb.collection("users").doc(studentId).get(),
    ]);
    const classData = classSnap.data() ?? {};
    if (!classSnap.exists || !studentSnap.exists ||
        classData.teacherId !== actor.uid || classData.schoolId !== actor.schoolId ||
        !Array.isArray(classData.studentIds) || !classData.studentIds.includes(studentId) ||
        studentSnap.data()?.schoolId !== actor.schoolId ||
        ["deleting", "deleted"].includes(String(classData.status))) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    const ref = adminDb.collection("privateStudentIdentifiers").doc(studentId);
    const code = await adminDb.runTransaction(async (tx) => {
      const existing = await tx.get(ref);
      if (existing.exists) {
        if (existing.data()?.schoolId !== actor.schoolId ||
            typeof existing.data()?.code !== "string") {
          throw new Error("IDENTIFIER_CONFLICT");
        }
        return existing.data()!.code as string;
      }
      // 128-bit cryptographically random identifier; collision probability negligible.
      const generated = `CSM-${randomBytes(16).toString("hex").toUpperCase()}`;
      tx.create(ref, {
        code: generated,
        studentId,
        schoolId: actor.schoolId,
        createdAt: FieldValue.serverTimestamp(),
        createdBy: actor.uid,
      });
      return generated;
    });
    return NextResponse.json({ studentCode: code }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "IDENTIFIER_CONFLICT") {
      return NextResponse.json({ error: "Identifier requires administrator review." }, { status: 409 });
    }
    const result = authenticatedUserError(error);
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
}
