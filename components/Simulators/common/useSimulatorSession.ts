"use client";

import { useCallback, useMemo, useRef, useState } from "react";

export type SimulatorSessionDifficulty =
  "foundation" | "intermediate" | "higher";

export type SimulatorQuestionResult = {
  questionId: string;
  difficulty: SimulatorSessionDifficulty;
  correct: boolean;
  xpAwarded: number;
  hintsUsed: number;
  workingViewed: boolean;
  attemptsOnQuestion: number;
};

export type ProcedureResult = {
  correctSteps: number;
  mistakes: number;
  accuracy: number;
};

type RegisterAnswerOptions = {
  questionId: string;
  correct: boolean;
  xpReward?: number;
};

type UseSimulatorSessionOptions = {
  initialDifficulty?: SimulatorSessionDifficulty;
  foundationXP?: number;
  intermediateXP?: number;
  higherXP?: number;
};

export default function useSimulatorSession({
  initialDifficulty = "foundation",
  foundationXP = 10,
  intermediateXP = 15,
  higherXP = 20,
}: UseSimulatorSessionOptions = {}) {
  const [difficulty, setDifficultyState] =
    useState<SimulatorSessionDifficulty>(initialDifficulty);

  const [questions, setQuestions] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [xp, setXP] = useState(0);
  const [streak, setStreak] = useState(0);

  const [hintsUsed, setHintsUsed] = useState(0);
  const [workingViewed, setWorkingViewed] = useState(0);

  const [procedureCorrectSteps, setProcedureCorrectSteps] = useState(0);
  const [procedureMistakes, setProcedureMistakes] = useState(0);

  const [currentQuestionAttempts, setCurrentQuestionAttempts] = useState(0);
  const [currentQuestionHintUsed, setCurrentQuestionHintUsed] = useState(false);
  const [currentQuestionWorkingViewed, setCurrentQuestionWorkingViewed] =
    useState(false);

  const [results, setResults] = useState<SimulatorQuestionResult[]>([]);

  /*
   * These refs protect a question from being counted or rewarded repeatedly.
   *
   * Example:
   * 1. Student answers correctly.
   * 2. Student clicks Try again.
   * 3. Student enters the same answer again.
   *
   * Questions / Correct / XP / Streak must NOT increase again.
   */
  const countedQuestionIdsRef = useRef<Set<string>>(new Set());
  const rewardedQuestionIdsRef = useRef<Set<string>>(new Set());

  const accuracy = useMemo(() => {
    if (questions === 0) return 0;

    return Math.round((correct / questions) * 100);
  }, [correct, questions]);

  const procedureAccuracy = useMemo(() => {
    const total = procedureCorrectSteps + procedureMistakes;

    if (total === 0) return 0;

    return Math.round((procedureCorrectSteps / total) * 100);
  }, [procedureCorrectSteps, procedureMistakes]);

  const defaultXP = useMemo(() => {
    if (difficulty === "higher") {
      return higherXP;
    }

    if (difficulty === "intermediate") {
      return intermediateXP;
    }

    return foundationXP;
  }, [difficulty, foundationXP, higherXP, intermediateXP]);

  const registerAnswer = useCallback(
    ({ questionId, correct: isCorrect, xpReward }: RegisterAnswerOptions) => {
      const alreadyCounted = countedQuestionIdsRef.current.has(questionId);
      const alreadyRewarded = rewardedQuestionIdsRef.current.has(questionId);

      /*
       * The current-question attempt counter is useful for analytics,
       * but repeated checking must not alter the main Questions statistic.
       */
      setCurrentQuestionAttempts((current) => current + 1);

      if (alreadyCounted) {
        return {
          counted: false,
          rewarded: false,
          correct: isCorrect,
        };
      }

      countedQuestionIdsRef.current.add(questionId);

      setQuestions((current) => current + 1);

      if (isCorrect) {
        setCorrect((current) => current + 1);
        setStreak((current) => current + 1);
      } else {
        setStreak(0);
      }

      let awardedXP = 0;

      if (isCorrect && !alreadyRewarded) {
        awardedXP = xpReward ?? defaultXP;

        rewardedQuestionIdsRef.current.add(questionId);

        setXP((current) => current + awardedXP);
      }

      setResults((current) => [
        ...current,
        {
          questionId,
          difficulty,
          correct: isCorrect,
          xpAwarded: awardedXP,
          hintsUsed: currentQuestionHintUsed ? 1 : 0,
          workingViewed: currentQuestionWorkingViewed,
          attemptsOnQuestion: currentQuestionAttempts + 1,
        },
      ]);

      return {
        counted: true,
        rewarded: awardedXP > 0,
        correct: isCorrect,
        xpAwarded: awardedXP,
      };
    },
    [
      currentQuestionAttempts,
      currentQuestionHintUsed,
      currentQuestionWorkingViewed,
      defaultXP,
      difficulty,
    ],
  );

  /*
   * Try Again:
   *
   * - keeps the same question
   * - clears local answer / feedback in the simulator itself
   * - does NOT clear the "already counted" protection
   * - therefore cannot inflate Questions, Correct or XP
   */
  const tryAgain = useCallback(() => {
    setCurrentQuestionAttempts(0);
    setCurrentQuestionHintUsed(false);
    setCurrentQuestionWorkingViewed(false);
  }, []);

  /*
   * New Question:
   *
   * The simulator should generate a NEW questionId before calling this.
   * Session analytics remain intact.
   */
  const newQuestion = useCallback(() => {
    setCurrentQuestionAttempts(0);
    setCurrentQuestionHintUsed(false);
    setCurrentQuestionWorkingViewed(false);
  }, []);

  const registerHint = useCallback(() => {
    if (currentQuestionHintUsed) {
      return;
    }

    setCurrentQuestionHintUsed(true);
    setHintsUsed((current) => current + 1);
  }, [currentQuestionHintUsed]);

  const registerWorkingViewed = useCallback(() => {
    if (currentQuestionWorkingViewed) {
      return;
    }

    setCurrentQuestionWorkingViewed(true);
    setWorkingViewed((current) => current + 1);
  }, [currentQuestionWorkingViewed]);

  const registerProcedureCorrectStep = useCallback(() => {
    setProcedureCorrectSteps((current) => current + 1);
  }, []);

  const registerProcedureMistake = useCallback(() => {
    setProcedureMistakes((current) => current + 1);
  }, []);

  const resetProcedure = useCallback(() => {
    setProcedureCorrectSteps(0);
    setProcedureMistakes(0);
  }, []);

  const setDifficulty = useCallback(
    (nextDifficulty: SimulatorSessionDifficulty) => {
      setDifficultyState(nextDifficulty);

      /*
       * Changing difficulty should start a fresh challenge state,
       * but it should not wipe the student's overall session analytics.
       */
      setCurrentQuestionAttempts(0);
      setCurrentQuestionHintUsed(false);
      setCurrentQuestionWorkingViewed(false);
    },
    [],
  );

  const resetSession = useCallback(() => {
    setQuestions(0);
    setCorrect(0);
    setXP(0);
    setStreak(0);

    setHintsUsed(0);
    setWorkingViewed(0);

    setProcedureCorrectSteps(0);
    setProcedureMistakes(0);

    setCurrentQuestionAttempts(0);
    setCurrentQuestionHintUsed(false);
    setCurrentQuestionWorkingViewed(false);

    setResults([]);

    countedQuestionIdsRef.current.clear();
    rewardedQuestionIdsRef.current.clear();
  }, []);

  return {
    /*
     * Main simulator analytics
     */
    difficulty,
    questions,
    attempts: questions,
    correct,
    accuracy,
    xp,
    streak,

    /*
     * Support analytics
     */
    hintsUsed,
    workingViewed,

    /*
     * Current question analytics
     */
    currentQuestionAttempts,
    currentQuestionHintUsed,
    currentQuestionWorkingViewed,

    /*
     * Procedure analytics
     */
    procedureCorrectSteps,
    procedureMistakes,
    procedureAccuracy,

    /*
     * Historical result records
     */
    results,

    /*
     * Actions
     */
    setDifficulty,
    registerAnswer,
    registerHint,
    registerWorkingViewed,
    registerProcedureCorrectStep,
    registerProcedureMistake,
    resetProcedure,
    tryAgain,
    newQuestion,
    resetSession,
  };
}
