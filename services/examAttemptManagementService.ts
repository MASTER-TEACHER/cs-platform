"use client";

import { auth } from "@/lib/firebase";

type ResetExamAttemptResponse = {
  success?: boolean;
  archivedAttemptId?: string;
  error?: string;
};

export async function resetExamAttempt({
  assignmentId,
  studentId,
}: {
  assignmentId: string;
  studentId: string;
}): Promise<{
  archivedAttemptId: string;
}> {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("You must be signed in to reset an exam attempt.");
  }

  const cleanedAssignmentId = assignmentId.trim();
  const cleanedStudentId = studentId.trim();

  if (!cleanedAssignmentId || !cleanedStudentId) {
    throw new Error("Assignment and student details are required.");
  }

  const idToken = await currentUser.getIdToken();

  const response = await fetch(
    "/api/exam-assignments/reset-attempt",
    {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assignmentId: cleanedAssignmentId,
        studentId: cleanedStudentId,
      }),
    },
  );

  let result: ResetExamAttemptResponse;

  try {
    result = (await response.json()) as ResetExamAttemptResponse;
  } catch {
    throw new Error("CS Master could not read the reset-attempt response.");
  }

  if (!response.ok || !result.success) {
    throw new Error(
      result.error || "The exam attempt could not be reset.",
    );
  }

  return {
    archivedAttemptId: result.archivedAttemptId || "",
  };
}
