import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type {
  ExamTrainerAttempt,
  ExamTrainerHistoryItem,
  ExamTrainerReport,
} from "@/types/examTrainer";

type FirestoreAttempt = Omit<
  ExamTrainerAttempt,
  "startedAt" | "updatedAt" | "submittedAt"
> & {
  startedAt?: Timestamp;
  updatedAt?: Timestamp;
  submittedAt?: Timestamp | null;
};

function toDate(value?: Timestamp | null): Date | null {
  return value?.toDate ? value.toDate() : null;
}

function attemptReference(attemptId: string) {
  return doc(db, "examTrainerAttempts", attemptId);
}

export function createExamTrainerAttemptId(
  studentId: string,
  startedAt = new Date(),
): string {
  return `${studentId}_${startedAt.getTime()}`;
}

export async function createExamTrainerAttempt(
  attempt: ExamTrainerAttempt,
): Promise<void> {
  await setDoc(attemptReference(attempt.id), {
    ...attempt,
    startedAt: Timestamp.fromDate(attempt.startedAt),
    updatedAt: serverTimestamp(),
    submittedAt: null,
  });
}

export async function saveExamTrainerDraft(
  attempt: ExamTrainerAttempt,
): Promise<void> {
  if (attempt.status !== "in_progress") return;

  await setDoc(
    attemptReference(attempt.id),
    {
      answers: attempt.answers,
      currentQuestionIndex: attempt.currentQuestionIndex,
      secondsRemaining: attempt.secondsRemaining,
      status: "in_progress",
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function submitExamTrainerAttempt({
  attempt,
  report,
}: {
  attempt: ExamTrainerAttempt;
  report: ExamTrainerReport;
}): Promise<void> {
  await setDoc(
    attemptReference(attempt.id),
    {
      answers: attempt.answers,
      currentQuestionIndex: attempt.currentQuestionIndex,
      secondsRemaining: attempt.secondsRemaining,
      status: "submitted",
      report,
      submittedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  await setDoc(
    doc(db, "users", attempt.studentId, "examTrainerResults", attempt.id),
    {
      attemptId: attempt.id,
      topic:
        attempt.selectedTopic === "all"
          ? "Mixed Topics"
          : attempt.selectedTopic,
      source: "exam-trainer",
      scorePercent: report.percentage,
      percentage: report.percentage,
      grade: report.grade,
      totalAwardedMarks: report.totalAwardedMarks,
      totalAvailableMarks: report.totalAvailableMarks,
      topicScores: report.topicScores,
      priorityTopics: report.priorityTopics,
      strongestTopics: report.strongestTopics,
      completedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function abandonExamTrainerAttempt(
  attemptId: string,
): Promise<void> {
  await setDoc(
    attemptReference(attemptId),
    {
      status: "abandoned",
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function getExamTrainerAttempt(
  attemptId: string,
): Promise<ExamTrainerAttempt | null> {
  const snapshot = await getDoc(attemptReference(attemptId));
  if (!snapshot.exists()) return null;

  const data = snapshot.data() as FirestoreAttempt;

  return {
    ...data,
    id: snapshot.id,
    startedAt: toDate(data.startedAt) ?? new Date(),
    updatedAt: toDate(data.updatedAt) ?? new Date(),
    submittedAt: toDate(data.submittedAt),
  };
}

export async function getLatestInProgressExamTrainerAttempt(
  studentId: string,
): Promise<ExamTrainerAttempt | null> {
  const snapshot = await getDocs(
    query(
      collection(db, "examTrainerAttempts"),
      where("studentId", "==", studentId),
      where("status", "==", "in_progress"),
      orderBy("updatedAt", "desc"),
    ),
  );

  const first = snapshot.docs[0];
  if (!first) return null;

  const data = first.data() as FirestoreAttempt;

  return {
    ...data,
    id: first.id,
    startedAt: toDate(data.startedAt) ?? new Date(),
    updatedAt: toDate(data.updatedAt) ?? new Date(),
    submittedAt: toDate(data.submittedAt),
  };
}

export async function getExamTrainerHistory(
  studentId: string,
): Promise<ExamTrainerHistoryItem[]> {
  const snapshot = await getDocs(
    query(
      collection(db, "examTrainerAttempts"),
      where("studentId", "==", studentId),
      where("status", "==", "submitted"),
      orderBy("submittedAt", "desc"),
    ),
  );

  return snapshot.docs.map((document) => {
    const data = document.data() as FirestoreAttempt;
    const report = data.report;

    return {
      id: document.id,
      selectedTopic: data.selectedTopic,
      selectedDifficulty: data.selectedDifficulty,
      questionCount: data.questions?.length ?? 0,
      percentage: report?.percentage ?? 0,
      grade: report?.grade ?? "1",
      totalAwardedMarks: report?.totalAwardedMarks ?? 0,
      totalAvailableMarks: report?.totalAvailableMarks ?? 0,
      startedAt: toDate(data.startedAt) ?? new Date(),
      submittedAt: toDate(data.submittedAt),
      priorityTopics: report?.priorityTopics ?? [],
    };
  });
}
