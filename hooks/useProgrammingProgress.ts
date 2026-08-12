"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useProgress } from "@/contexts/ProgressContext";
import type {
  ProgrammingChallenge,
  ProgrammingProgressSnapshot,
} from "@/types/programming";

const STORAGE_KEY = "cs-master-programming-progress-v1";

const emptyProgress: ProgrammingProgressSnapshot = {
  attempts: 0,
  correct: 0,
  xp: 0,
  streak: 0,
  bestStreak: 0,
  completedChallengeIds: [],
  history: [],
};

function loadProgress(): ProgrammingProgressSnapshot {
  if (typeof window === "undefined") return emptyProgress;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress;

    const parsed = JSON.parse(raw) as Partial<ProgrammingProgressSnapshot>;

    return {
      ...emptyProgress,
      ...parsed,
      completedChallengeIds: Array.isArray(parsed.completedChallengeIds)
        ? parsed.completedChallengeIds
        : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch {
    return emptyProgress;
  }
}

export function useProgrammingProgress() {
  const { addXP } = useProgress();
  const [progress, setProgress] =
    useState<ProgrammingProgressSnapshot>(emptyProgress);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(progress),
    );
  }, [hydrated, progress]);

  const accuracy = useMemo(() => {
    if (progress.attempts === 0) return 0;
    return Math.round((progress.correct / progress.attempts) * 100);
  }, [progress.attempts, progress.correct]);

  const recordAttempt = useCallback(
    (challenge: ProgrammingChallenge, passed: boolean) => {
      let awarded = 0;

      setProgress((current) => {
        const alreadyCompleted =
          current.completedChallengeIds.includes(challenge.id);

        awarded =
          passed && !alreadyCompleted ? challenge.xpReward : 0;

        const nextStreak = passed ? current.streak + 1 : 0;

        return {
          attempts: current.attempts + 1,
          correct: current.correct + (passed ? 1 : 0),
          xp: current.xp + awarded,
          streak: nextStreak,
          bestStreak: Math.max(current.bestStreak, nextStreak),
          completedChallengeIds:
            passed && !alreadyCompleted
              ? [...current.completedChallengeIds, challenge.id]
              : current.completedChallengeIds,
          history: [
            {
              id: `${challenge.id}-${Date.now()}`,
              challengeId: challenge.id,
              challengeTitle: challenge.title,
              mode: challenge.mode,
              difficulty: challenge.difficulty,
              passed,
              xpAwarded: awarded,
              createdAt: new Date().toISOString(),
            },
            ...current.history,
          ].slice(0, 30),
        };
      });

      if (awarded > 0) addXP(awarded);
      return awarded;
    },
    [addXP],
  );

  const resetProgrammingProgress = useCallback(() => {
    setProgress(emptyProgress);
  }, []);

  return {
    ...progress,
    hydrated,
    accuracy,
    recordAttempt,
    resetProgrammingProgress,
  };
}
