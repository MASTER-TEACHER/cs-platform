import { doc, increment, serverTimestamp, writeBatch } from "firebase/firestore";

import { db } from "@/lib/firebase";

type SaveQuizResultParams = {
  uid: string;
  quizId: string;
  topicId: string;
  title: string;
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  earnedXP: number;
};

function createQuizResultId(quizId: string, uid: string): string {
  const safeQuizId = quizId.trim().replace(/[^a-zA-Z0-9_-]/g, "-");

  return `${safeQuizId}_${uid}`;
}

export async function saveQuizResult({
  uid,
  quizId,
  topicId,
  title,
  scorePercent,
  correctCount,
  totalQuestions,
  earnedXP,
}: SaveQuizResultParams): Promise<string> {
  const cleanedUid = uid.trim();
  const cleanedQuizId = quizId.trim();

  if (!cleanedUid) {
    throw new Error("A valid student account is required.");
  }

  if (!cleanedQuizId) {
    throw new Error("A valid quiz is required.");
  }

  const safeScorePercent = Math.max(0, Math.min(100, Math.round(scorePercent)));

  const safeCorrectCount = Math.max(
    0,
    Math.min(Math.round(correctCount), Math.round(totalQuestions)),
  );

  const safeTotalQuestions = Math.max(0, Math.round(totalQuestions));

  const safeEarnedXP = Math.max(0, Math.round(earnedXP));

  const resultId = createQuizResultId(cleanedQuizId, cleanedUid);

  const resultReference = doc(db, "users", cleanedUid, "quizResults", resultId);

  const userReference = doc(db, "users", cleanedUid);

  const batch = writeBatch(db);

  /*
   * The uid field is required by the current
   * Firestore security rules.
   *
   * A deterministic result ID prevents repeated
   * page renders from creating duplicate quiz results.
   */
  batch.set(
    resultReference,
    {
      uid: cleanedUid,
      quizId: cleanedQuizId,
      topicId: topicId.trim(),
      title: title.trim() || "Untitled Quiz",
      scorePercent: safeScorePercent,
      correctCount: safeCorrectCount,
      totalQuestions: safeTotalQuestions,
      earnedXP: safeEarnedXP,
      status: "completed",
      completedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    },
  );

  /*
   * Award XP once for this save operation.
   */
  batch.update(userReference, {
    xp: increment(safeEarnedXP),
    updatedAt: serverTimestamp(),
  });

  await batch.commit();

  return resultId;
}
