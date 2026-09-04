"use client";

import { auth } from "@/lib/firebase";

import type {
  ExamAssignment,
  ExamIntegrityIncidentType,
  ExamSubmission,
  StudentExamAnswer,
} from "@/types/examAssignment";

type ApiResponse = {
  ok?: boolean;
  error?: string;
  submission?: ExamSubmission;
};

async function authorisedRequest(
  body: Record<string, unknown>,
): Promise<ApiResponse> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const idToken = await user.getIdToken();

  const response = await fetch(
    "/api/exam-assignments/student-submission",
    {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | ApiResponse
    | null;

  if (!response.ok || !payload?.ok) {
    throw new Error(
      payload?.error ||
        "The written assessment request could not be completed.",
    );
  }

  return payload;
}

function convertSubmission(
  submission: ExamSubmission,
): ExamSubmission {
  return {
    ...submission,
    startedAt: submission.startedAt
      ? new Date(submission.startedAt)
      : null,
    submittedAt: submission.submittedAt
      ? new Date(submission.submittedAt)
      : null,
    markedAt: submission.markedAt
      ? new Date(submission.markedAt)
      : null,
    updatedAt: submission.updatedAt
      ? new Date(submission.updatedAt)
      : null,
    integritySessionStartedAt:
      submission.integritySessionStartedAt
        ? new Date(submission.integritySessionStartedAt)
        : null,
    integrityIncidents: (submission.integrityIncidents || []).map(
      (incident) => ({
        ...incident,
        occurredAt: incident.occurredAt
          ? new Date(incident.occurredAt)
          : null,
      }),
    ),
  };
}

export async function getOrCreateStudentExamSubmission({
  assignment,
  studentName,
  studentEmail,
}: {
  assignment: ExamAssignment;
  studentName?: string;
  studentEmail?: string;
}): Promise<ExamSubmission> {
  const payload = await authorisedRequest({
    action: "get_or_create",
    assignmentId: assignment.id,
    studentName: studentName?.trim() || "Student",
    studentEmail: studentEmail?.trim() || "",
  });

  if (!payload.submission) {
    throw new Error("The exam attempt could not be loaded.");
  }

  return convertSubmission(payload.submission);
}

export async function startStudentExamIntegritySession({
  assignmentId,
}: {
  assignmentId: string;
}): Promise<void> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const idToken = await user.getIdToken();

  const response = await fetch(
    "/api/exam-assignments/start-integrity",
    {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assignmentId,
      }),
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | {
        ok?: boolean;
        error?: string;
      }
    | null;

  if (!response.ok || !payload?.ok) {
    throw new Error(
      payload?.error || "Exam Mode could not be started.",
    );
  }
}

export async function autosaveStudentExamAnswers({
  assignmentId,
  answers,
}: {
  assignmentId: string;
  answers: StudentExamAnswer[];
}): Promise<void> {
  await authorisedRequest({
    action: "autosave",
    assignmentId,
    answers,
  });
}

export async function submitStudentExam({
  assignmentId,
}: {
  assignmentId: string;
}): Promise<void> {
  await authorisedRequest({
    action: "submit",
    assignmentId,
  });
}

export async function recordStudentExamIntegrityIncident({
  assignmentId,
  type,
  questionNumber,
  detail,
}: {
  assignmentId: string;
  type: ExamIntegrityIncidentType;
  questionNumber: number | null;
  detail: string;
}): Promise<void> {
  await authorisedRequest({
    action: "record_incident",
    assignmentId,
    type,
    questionNumber,
    detail,
  });
}

export async function updateStudentExamCurrentQuestion({
  assignmentId,
  questionNumber,
}: {
  assignmentId: string;
  questionNumber: number;
}): Promise<void> {
  await authorisedRequest({
    action: "update_question",
    assignmentId,
    questionNumber,
  });
}

export async function terminateStudentExamForIntegrity({
  assignmentId,
  answers,
  questionNumber,
  reason,
}: {
  assignmentId: string;
  answers: StudentExamAnswer[];
  questionNumber: number | null;
  reason: string;
}): Promise<void> {
  await authorisedRequest({
    action: "terminate",
    assignmentId,
    answers,
    questionNumber,
    reason,
  });
}
