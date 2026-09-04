"use client";

import { auth } from "@/lib/firebase";

import type {
  SecureQuiz,
  SecureQuizIntegrityIncident,
  SecureQuizListItem,
  SecureQuizMarkResult,
} from "@/types/secureQuiz";

export type SecureQuizAssignmentReview = {
  assignmentId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  earnedXP: number;
  completedAt: string | null;
  review: SecureQuizMarkResult["review"];
};

async function authorisedFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error(
      "You must be signed in to use quizzes.",
    );
  }

  const idToken = await user.getIdToken();

  return fetch(input, {
    ...init,
    cache: "no-store",
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  });
}

async function readError(
  response: Response,
): Promise<string> {
  try {
    const body =
      (await response.json()) as {
        error?: string;
      };

    return body.error || "The quiz request failed.";
  } catch {
    return "The quiz request failed.";
  }
}

export async function getSecureQuizLibrary(): Promise<
  SecureQuizListItem[]
> {
  const response = await authorisedFetch(
    "/api/quiz/secure",
  );

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  const body =
    (await response.json()) as {
      quizzes?: SecureQuizListItem[];
    };

  return Array.isArray(body.quizzes)
    ? body.quizzes
    : [];
}

export async function getSecureQuiz({
  topic,
  assignmentId,
}: {
  topic: string;
  assignmentId?: string | null;
}): Promise<SecureQuiz> {
  const params = new URLSearchParams({ topic });

  if (assignmentId) {
    params.set("assignment", assignmentId);
  }

  const response = await authorisedFetch(
    `/api/quiz/secure?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  const body =
    (await response.json()) as {
      quiz?: SecureQuiz;
    };

  if (!body.quiz) {
    throw new Error("The quiz could not be loaded.");
  }

  return body.quiz;
}

export async function getSecureQuizReview({
  topic,
  assignmentId,
}: {
  topic: string;
  assignmentId: string;
}): Promise<SecureQuizAssignmentReview> {
  const params = new URLSearchParams({
    topic,
    assignment: assignmentId,
    review: "1",
  });

  const response = await authorisedFetch(
    `/api/quiz/secure?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  const body =
    (await response.json()) as {
      reviewResult?: SecureQuizAssignmentReview;
    };

  if (!body.reviewResult) {
    throw new Error(
      "The completed quiz review could not be loaded.",
    );
  }

  return body.reviewResult;
}

export async function markSecureQuiz({
  topic,
  attemptId,
  assignmentId,
  answers,
  integrityIncidents,
  integrityTerminated = false,
  integrityTerminationReason = "",
}: {
  topic: string;
  attemptId: string;
  assignmentId?: string | null;
  answers: Record<string, string>;
  integrityIncidents?: SecureQuizIntegrityIncident[];
  integrityTerminated?: boolean;
  integrityTerminationReason?: string;
}): Promise<SecureQuizMarkResult> {
  const response = await authorisedFetch(
    "/api/quiz/secure",
    {
      method: "POST",
      body: JSON.stringify({
        topic,
        attemptId,
        assignmentId: assignmentId || null,
        answers,
        integrityIncidents: integrityIncidents || [],
        integrityTerminated,
        integrityTerminationReason,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  const body =
    (await response.json()) as {
      result?: SecureQuizMarkResult;
    };

  if (!body.result) {
    throw new Error("The quiz could not be marked.");
  }

  return body.result;
}
