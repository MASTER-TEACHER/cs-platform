import "server-only";

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type StartIntegrityRequest = {
  assignmentId?: unknown;
};

function getBearerToken(request: Request): string {
  const authorization =
    request.headers.get("authorization") || "";

  if (!authorization.startsWith("Bearer ")) {
    return "";
  }

  return authorization.slice(7).trim();
}

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { ok: false, error: message },
    {
      status,
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
      },
    },
  );
}

export async function POST(request: Request) {
  try {
    const token = getBearerToken(request);

    if (!token) {
      return jsonError("Authentication is required.", 401);
    }

    const decodedToken =
      await adminAuth.verifyIdToken(token);

    const body =
      (await request.json()) as StartIntegrityRequest;

    const assignmentId =
      typeof body.assignmentId === "string"
        ? body.assignmentId.trim()
        : "";

    if (!assignmentId) {
      return jsonError("Assignment ID is required.", 400);
    }

    const assignmentRef = adminDb
      .collection("examAssignments")
      .doc(assignmentId);

    const submissionId =
      `${assignmentId}_${decodedToken.uid}`;

    const submissionRef = adminDb
      .collection("examSubmissions")
      .doc(submissionId);

    await adminDb.runTransaction(async (transaction) => {
      const [assignmentSnapshot, submissionSnapshot] =
        await Promise.all([
          transaction.get(assignmentRef),
          transaction.get(submissionRef),
        ]);

      if (!assignmentSnapshot.exists) {
        throw new Error("ASSIGNMENT_NOT_FOUND");
      }

      const assignment = assignmentSnapshot.data() || {};

      const studentIds = Array.isArray(assignment.studentIds)
        ? assignment.studentIds.filter(
            (value: unknown): value is string =>
              typeof value === "string",
          )
        : [];

      if (!studentIds.includes(decodedToken.uid)) {
        throw new Error("NOT_ASSIGNED");
      }

      if (assignment.status !== "active") {
        throw new Error("ASSIGNMENT_INACTIVE");
      }

      if (!submissionSnapshot.exists) {
        throw new Error("SUBMISSION_NOT_FOUND");
      }

      const submission = submissionSnapshot.data() || {};

      if (
        submission.assignmentId !== assignmentId ||
        submission.studentId !== decodedToken.uid
      ) {
        throw new Error("SUBMISSION_OWNERSHIP_MISMATCH");
      }

      if (
        ["submitted", "marking", "marked"].includes(
          String(submission.status || ""),
        )
      ) {
        throw new Error("SUBMISSION_LOCKED");
      }

      if (
        submission.status !== "not_started" &&
        submission.status !== "in_progress"
      ) {
        throw new Error("SUBMISSION_NOT_STARTABLE");
      }

      const updates: Record<string, unknown> = {
        status: "in_progress",
        integrityPolicySnapshot:
          assignment.integrityPolicy ?? null,
        updatedAt: FieldValue.serverTimestamp(),
      };

      if (!submission.startedAt) {
        updates.startedAt = FieldValue.serverTimestamp();
      }

      if (!submission.integritySessionStartedAt) {
        updates.integritySessionStartedAt =
          FieldValue.serverTimestamp();
      }

      transaction.update(submissionRef, updates);
    });

    return NextResponse.json(
      { ok: true },
      {
        headers: {
          "Cache-Control": "private, no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    const code =
      error instanceof Error ? error.message : "";

    const errors: Record<string, [string, number]> = {
      ASSIGNMENT_NOT_FOUND: [
        "This exam assignment could not be found.",
        404,
      ],
      NOT_ASSIGNED: [
        "This exam is not assigned to your account.",
        403,
      ],
      ASSIGNMENT_INACTIVE: [
        "This exam assignment is no longer active.",
        409,
      ],
      SUBMISSION_NOT_FOUND: [
        "Your exam attempt has not been initialised. Return to Assignments and open the exam again.",
        409,
      ],
      SUBMISSION_LOCKED: [
        "This exam attempt has already been submitted.",
        409,
      ],
      SUBMISSION_NOT_STARTABLE: [
        "This exam attempt is not in a startable state. Ask your teacher to reset the attempt and open it again.",
        409,
      ],
      SUBMISSION_OWNERSHIP_MISMATCH: [
        "The exam submission does not belong to this account.",
        403,
      ],
    };

    const known = errors[code];

    if (known) {
      return jsonError(known[0], known[1]);
    }

    console.error(
      "Unable to start exam integrity session:",
      error,
    );

    return jsonError("Exam Mode could not be started.", 500);
  }
}
