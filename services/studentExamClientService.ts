"use client";

import { auth } from "@/lib/firebase";

import type {
  ExamAssignment,
  ExamSubmission,
  StudentExamAnswer,
  ExamIntegrityIncidentType,
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

  return {
    ...payload.submission,
    startedAt: payload.submission.startedAt
      ? new Date(payload.submission.startedAt)
      : null,
    submittedAt: payload.submission.submittedAt
      ? new Date(payload.submission.submittedAt)
      : null,
    markedAt: payload.submission.markedAt
      ? new Date(payload.submission.markedAt)
      : null,
    updatedAt: payload.submission.updatedAt
      ? new Date(payload.submission.updatedAt)
      : null,
    integritySessionStartedAt:
      payload.submission.integritySessionStartedAt
        ? new Date(payload.submission.integritySessionStartedAt)
        : null,
    integrityIncidents: payload.submission.integrityIncidents.map(
      (incident) => ({
        ...incident,
        occurredAt: incident.occurredAt
          ? new Date(incident.occurredAt)
          : null,
      }),
    ),
  };
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
