import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  ProgrammingChallenge,
  ProgrammingExamBoard,
  ProgrammingQualification,
} from "@/types/programming";

type SaveProgrammingPracticeEvidenceParams = {
  uid: string;
  challenge: ProgrammingChallenge;
  scorePercent: number;
  qualification: ProgrammingQualification;
  examBoard: ProgrammingExamBoard | null;
};

function safeDocumentId(value: string): string {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "-");
}

function clampPercentage(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(100, Math.round(value)),
  );
}

/*
 * One document per student + challenge.
 *
 * Repeating the same challenge therefore updates one
 * evidence signal instead of creating unlimited mastery
 * evidence.
 */
export async function saveProgrammingPracticeEvidence({
  uid,
  challenge,
  scorePercent,
  qualification,
  examBoard,
}: SaveProgrammingPracticeEvidenceParams): Promise<void> {
  const cleanedUid = uid.trim();
  const cleanedChallengeId =
    challenge.id.trim();

  if (
    !cleanedUid ||
    !cleanedChallengeId
  ) {
    return;
  }

  const reference = doc(
    db,
    "users",
    cleanedUid,
    "programmingPracticeResults",
    safeDocumentId(cleanedChallengeId),
  );

  const existingSnapshot =
    await getDoc(reference);

  const existing =
    existingSnapshot.exists()
      ? existingSnapshot.data()
      : null;

  const existingAttempts =
    typeof existing?.attemptCount ===
      "number"
      ? existing.attemptCount
      : 0;

  const existingBest =
    typeof existing?.bestScorePercent ===
      "number"
      ? existing.bestScorePercent
      : 0;

  const safeScore =
    clampPercentage(scorePercent);

  /*
   * Prefer the explicit curriculum mapping attached to
   * the challenge. The adaptive service will still apply
   * the student's active curriculum filter afterwards.
   */
  const topicId =
    challenge.curriculumTopicIds[0] ||
    challenge.topicId ||
    "";

  await setDoc(
    reference,
    {
      uid: cleanedUid,

      challengeId:
        cleanedChallengeId,

      challengeTitle:
        challenge.title,

      topicId,

      curriculumTopicIds:
        challenge.curriculumTopicIds,

      mode:
        challenge.mode,

      difficulty:
        challenge.difficulty,

      skills:
        challenge.skills,

      qualification,

      examBoard:
        examBoard ?? null,

      latestScorePercent:
        safeScore,

      bestScorePercent:
        Math.max(
          existingBest,
          safeScore,
        ),

      passed:
        safeScore === 100,

      attemptCount:
        existingAttempts + 1,

      createdAt:
        existingSnapshot.exists()
          ? existing?.createdAt ??
            serverTimestamp()
          : serverTimestamp(),

      completedAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp(),
    },
    {
      merge: true,
    },
  );
}