import "server-only";

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

import {
  adminAuth,
  adminDb,
} from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ResetAttemptBody = {
  assignmentId?: unknown;
  studentId?: unknown;
};

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function bearerToken(request: Request): string {
  const authorization =
    request.headers.get("authorization") || "";

  if (!authorization.startsWith("Bearer ")) {
    return "";
  }

  return authorization.slice(7).trim();
}

export async function POST(request: Request) {
  try {
    const token = bearerToken(request);

    if (!token) {
      return NextResponse.json(
        { error: "Sign in is required." },
        { status: 401 },
      );
    }

    const decoded = await adminAuth.verifyIdToken(token);

    const profileSnapshot = await adminDb
      .collection("users")
      .doc(decoded.uid)
      .get();

    if (!profileSnapshot.exists) {
      return NextResponse.json(
        { error: "Your CS Master profile could not be found." },
        { status: 403 },
      );
    }

    const profile = profileSnapshot.data() || {};
    const role = cleanString(profile.role);

    if (role !== "teacher" && role !== "admin") {
      return NextResponse.json(
        { error: "Only a teacher or administrator can reset an exam attempt." },
        { status: 403 },
      );
    }

    const body = (await request.json()) as ResetAttemptBody;
    const assignmentId = cleanString(body.assignmentId);
    const studentId = cleanString(body.studentId);

    if (!assignmentId || !studentId) {
      return NextResponse.json(
        { error: "Assignment and student details are required." },
        { status: 400 },
      );
    }

    const assignmentReference = adminDb
      .collection("examAssignments")
      .doc(assignmentId);

    const submissionId = `${assignmentId}_${studentId}`;

    const submissionReference = adminDb
      .collection("examSubmissions")
      .doc(submissionId);

    const archiveReference = adminDb
      .collection("examSubmissionAttemptHistory")
      .doc();

    await adminDb.runTransaction(async (transaction) => {
      const assignmentSnapshot = await transaction.get(
        assignmentReference,
      );

      const submissionSnapshot = await transaction.get(
        submissionReference,
      );

      if (!assignmentSnapshot.exists) {
        throw new Error("ASSIGNMENT_NOT_FOUND");
      }

      if (!submissionSnapshot.exists) {
        throw new Error("SUBMISSION_NOT_FOUND");
      }

      const assignment = assignmentSnapshot.data() || {};
      const submission = submissionSnapshot.data() || {};

      const assignmentTeacherId = cleanString(
        assignment.teacherId,
      );

      if (
        role !== "admin" &&
        assignmentTeacherId !== decoded.uid
      ) {
        throw new Error("FORBIDDEN");
      }

      const studentIds = Array.isArray(assignment.studentIds)
        ? assignment.studentIds.filter(
            (value: unknown): value is string =>
              typeof value === "string",
          )
        : [];

      if (!studentIds.includes(studentId)) {
        throw new Error("STUDENT_NOT_ASSIGNED");
      }

      if (
        cleanString(submission.assignmentId) !== assignmentId ||
        cleanString(submission.studentId) !== studentId
      ) {
        throw new Error("SUBMISSION_MISMATCH");
      }

      const previousStatus = cleanString(submission.status);

      const countedAsSubmitted = [
        "submitted",
        "marking",
        "marked",
      ].includes(previousStatus);

      const countedAsMarked = previousStatus === "marked";

      const currentSubmittedCount =
        typeof assignment.submittedCount === "number"
          ? assignment.submittedCount
          : 0;

      const currentMarkedCount =
        typeof assignment.markedCount === "number"
          ? assignment.markedCount
          : 0;

      transaction.set(archiveReference, {
        ...submission,
        originalSubmissionId: submissionId,
        originalStatus: previousStatus,
        archivedAssignmentId: assignmentId,
        archivedStudentId: studentId,
        archivedAt: FieldValue.serverTimestamp(),
        archivedBy: decoded.uid,
        archiveReason: "teacher_reset",
      });

      /*
       * Delete the live submission after archiving it.
       *
       * The normal student start flow will create a brand-new
       * `in_progress` submission. This keeps the reset compatible
       * with the existing Firestore rule that permits student exam
       * submission updates only in `in_progress` / `submitted` states.
       */
      transaction.delete(submissionReference);

      const assignmentUpdates: Record<string, unknown> = {
        updatedAt: FieldValue.serverTimestamp(),
      };

      if (countedAsSubmitted) {
        assignmentUpdates.submittedCount = Math.max(
          0,
          currentSubmittedCount - 1,
        );
      }

      if (countedAsMarked) {
        assignmentUpdates.markedCount = Math.max(
          0,
          currentMarkedCount - 1,
        );
      }

      transaction.update(
        assignmentReference,
        assignmentUpdates,
      );
    });

    return NextResponse.json(
      {
        success: true,
        archivedAttemptId: archiveReference.id,
      },
      {
        headers: {
          "Cache-Control": "private, no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    const code = error instanceof Error ? error.message : "";

    if (code === "ASSIGNMENT_NOT_FOUND") {
      return NextResponse.json(
        { error: "The exam assignment could not be found." },
        { status: 404 },
      );
    }

    if (code === "SUBMISSION_NOT_FOUND") {
      return NextResponse.json(
        { error: "This student does not have an exam attempt to reset yet." },
        { status: 404 },
      );
    }

    if (
      code === "FORBIDDEN" ||
      code === "STUDENT_NOT_ASSIGNED" ||
      code === "SUBMISSION_MISMATCH"
    ) {
      return NextResponse.json(
        { error: "You do not have permission to reset this exam attempt." },
        { status: 403 },
      );
    }

    console.error("Unable to reset written-exam attempt:", error);

    return NextResponse.json(
      { error: "The exam attempt could not be reset." },
      { status: 500 },
    );
  }
}
