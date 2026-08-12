"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useProgress } from "@/contexts/ProgressContext";
import type {
  ProgrammingChallenge,
  ProgrammingProgressSnapshot,
  ProgrammingSkill,
  ProgrammingSkillProgress,
} from "@/types/programming";

const STORAGE_KEY = "cs-master-programming-progress-v2";

const emptyProgress: ProgrammingProgressSnapshot = {
  attempts: 0,
  correct: 0,
  xp: 0,
  streak: 0,
  bestStreak: 0,
  completedChallengeIds: [],
  history: [],
  skillProgress: {},
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
      skillProgress:
        parsed.skillProgress && typeof parsed.skillProgress === "object"
          ? parsed.skillProgress
          : {},
    };
  } catch {
    return emptyProgress;
  }
}

function updateSkillProgress(
  current: Partial<Record<ProgrammingSkill, ProgrammingSkillProgress>>,
  skills: ProgrammingSkill[],
  passed: boolean,
): Partial<Record<ProgrammingSkill, ProgrammingSkillProgress>> {
  const next = { ...current };

  for (const skill of skills) {
    const existing = next[skill] ?? {
      attempts: 0,
      correct: 0,
      accuracy: 0,
    };

    const attempts = existing.attempts + 1;
    const correct = existing.correct + (passed ? 1 : 0);

    next[skill] = {
      attempts,
      correct,
      accuracy: Math.round((correct / attempts) * 100),
    };
  }

  return next;
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

    return Math.round(
      (progress.correct / progress.attempts) * 100,
    );
  }, [progress.attempts, progress.correct]);

  const weakSkills = useMemo(() => {
    return Object.entries(progress.skillProgress)
      .filter(([, value]) => value && value.attempts >= 2)
      .sort(
        (a, b) =>
          (a[1]?.accuracy ?? 100) - (b[1]?.accuracy ?? 100),
      )
      .slice(0, 4)
      .map(([skill]) => skill as ProgrammingSkill);
  }, [progress.skillProgress]);

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
          skillProgress: updateSkillProgress(
            current.skillProgress,
            challenge.skills,
            passed,
          ),
          history: [
            {
              id: `${challenge.id}-${Date.now()}`,
              challengeId: challenge.id,
              challengeTitle: challenge.title,
              mode: challenge.mode,
              difficulty: challenge.difficulty,
              skills: challenge.skills,
              passed,
              xpAwarded: awarded,
              createdAt: new Date().toISOString(),
            },
            ...current.history,
          ].slice(0, 50),
        };
      });

      if (awarded > 0) {
        addXP(awarded);
      }

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
    weakSkills,
    recordAttempt,
    resetProgrammingProgress,
  };
}
