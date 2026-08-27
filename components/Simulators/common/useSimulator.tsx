"use client";

import { useCallback, useMemo, useRef, useState } from "react";

export type SimulatorDifficulty = "foundation" | "intermediate" | "higher";

export type SimulatorQuestionResult = {
  questionId: string;
  difficulty: SimulatorDifficulty;

  firstAttemptCorrect: boolean;
  eventuallyCorrect: boolean;

  answerChecks: number;

  xpAwarded: number;

  hintUsed: boolean;
  workingViewed: boolean;
};

type Options<TQuestion> = {
  initialQuestion: TQuestion;

  generateQuestion: (difficulty: SimulatorDifficulty) => TQuestion;

  xpByDifficulty?: Partial<Record<SimulatorDifficulty, number>>;

  onAwardXP?: (amount: number) => void | Promise<void>;

  /*
   * Optional future-facing values.
   *
   * Existing simulators DO NOT need to provide these.
   * They are here so the adaptive-practice layer can later
   * identify simulator/question sources cleanly.
   */
  simulatorId?: string;

  getQuestionId?: (
    question: TQuestion,
    difficulty: SimulatorDifficulty,
  ) => string;
};

function createSessionQuestionId(
  simulatorId: string,
  sequence: number,
): string {
  return `${simulatorId}-${sequence}`;
}

export function useSimulator<TQuestion>({
  initialQuestion,
  generateQuestion,

  xpByDifficulty = {
    foundation: 10,
    intermediate: 15,
    higher: 20,
  },

  onAwardXP,

  simulatorId = "simulator",

  getQuestionId,
}: Options<TQuestion>) {
  /*
   * =========================================================
   * QUESTION / DIFFICULTY
   * =========================================================
   */

  const [difficulty, setDifficulty] =
    useState<SimulatorDifficulty>("foundation");

  const [question, setQuestionState] = useState<TQuestion>(initialQuestion);

  /*
   * Every genuinely new generated question receives
   * a new session sequence number.
   *
   * Reset/Try Again does NOT change it.
   */
  const questionSequenceRef = useRef(1);

  const initialQuestionId =
    getQuestionId?.(initialQuestion, "foundation") ??
    createSessionQuestionId(simulatorId, 1);

  const [questionId, setQuestionId] = useState(initialQuestionId);

  /*
   * =========================================================
   * CURRENT RESPONSE STATE
   * =========================================================
   */

  const [checked, setChecked] = useState(false);

  const [correct, setCorrect] = useState(false);

  /*
   * questionScored means:
   *
   * "Has this generated question already contributed
   * to the Questions statistic?"
   *
   * It does NOT mean that a student has lost the right
   * to correct their answer.
   */
  const [questionScored, setQuestionScored] = useState(false);

  /*
   * A question may only contribute to Correct once.
   */
  const [questionCorrectRecorded, setQuestionCorrectRecorded] = useState(false);

  /*
   * XP can only be awarded once per generated question.
   */
  const [questionRewarded, setQuestionRewarded] = useState(false);

  /*
   * Number of times Check Answer has actually been used
   * on this generated question.
   */
  const [questionAnswerChecks, setQuestionAnswerChecks] = useState(0);

  /*
   * Records whether the very first submitted answer
   * was correct.
   *
   * This is useful later for adaptive mastery.
   */
  const [firstAttemptCorrect, setFirstAttemptCorrect] = useState<
    boolean | null
  >(null);

  /*
   * =========================================================
   * SUPPORT STATE
   * =========================================================
   */

  const [hintVisible, setHintVisible] = useState(false);

  const [workingVisible, setWorkingVisible] = useState(false);

  /*
   * Session-level support analytics.
   */
  const [hintsUsed, setHintsUsed] = useState(0);

  const [workingViewed, setWorkingViewed] = useState(0);

  /*
   * Question-level support analytics.
   *
   * Opening and closing a hint repeatedly only counts once
   * for that generated question.
   */
  const [currentQuestionHintUsed, setCurrentQuestionHintUsed] = useState(false);

  const [currentQuestionWorkingViewed, setCurrentQuestionWorkingViewed] =
    useState(false);

  /*
   * =========================================================
   * SESSION SCORE STATE
   * =========================================================
   */

  /*
   * attempts = number of unique generated questions
   * that have received at least one submitted answer.
   *
   * It is intentionally NOT number of button presses.
   */
  const [attempts, setAttempts] = useState(0);

  /*
   * A question becomes correct if the learner eventually
   * solves it correctly.
   *
   * This allows:
   *
   * wrong → Try Again → correct
   *
   * without creating a second Question entry.
   */
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const [xp, setXp] = useState(0);

  const [streak, setStreak] = useState(0);

  const [highestStreak, setHighestStreak] = useState(0);

  /*
   * =========================================================
   * HISTORY FOR FUTURE ADAPTIVE PRACTICE
   * =========================================================
   */

  const [questionResults, setQuestionResults] = useState<
    SimulatorQuestionResult[]
  >([]);

  /*
   * =========================================================
   * DERIVED ANALYTICS
   * =========================================================
   */

  const accuracy = useMemo(() => {
    if (attempts === 0) {
      return 0;
    }

    return Math.round((correctAnswers / attempts) * 100);
  }, [attempts, correctAnswers]);

  const currentXPReward = xpByDifficulty[difficulty] ?? 10;

  /*
   * =========================================================
   * RESPONSE RESET
   * =========================================================
   */

  const clearResponseState = useCallback(() => {
    setChecked(false);
    setCorrect(false);

    setHintVisible(false);
    setWorkingVisible(false);
  }, []);

  /*
   * =========================================================
   * QUESTION HISTORY
   * =========================================================
   */

  const saveCurrentQuestionResult = useCallback(
    (eventuallyCorrect: boolean, awardedXP: number, answerChecks: number) => {
      /*
       * Replace an existing result for the current question
       * rather than creating duplicate history entries.
       */
      setQuestionResults((current) => {
        const result: SimulatorQuestionResult = {
          questionId,
          difficulty,

          firstAttemptCorrect: firstAttemptCorrect ?? false,

          eventuallyCorrect,

          answerChecks,

          xpAwarded: awardedXP,

          hintUsed: currentQuestionHintUsed,

          workingViewed: currentQuestionWorkingViewed,
        };

        const existingIndex = current.findIndex(
          (item) => item.questionId === questionId,
        );

        if (existingIndex === -1) {
          return [...current, result];
        }

        const updated = [...current];

        updated[existingIndex] = {
          ...updated[existingIndex],
          ...result,

          /*
           * Never erase previously awarded XP.
           */
          xpAwarded: Math.max(
            updated[existingIndex].xpAwarded,
            result.xpAwarded,
          ),

          /*
           * Once true, these remain true.
           */
          eventuallyCorrect:
            updated[existingIndex].eventuallyCorrect ||
            result.eventuallyCorrect,

          hintUsed: updated[existingIndex].hintUsed || result.hintUsed,

          workingViewed:
            updated[existingIndex].workingViewed || result.workingViewed,

          answerChecks: Math.max(
            updated[existingIndex].answerChecks,
            result.answerChecks,
          ),
        };

        return updated;
      });
    },
    [
      questionId,
      difficulty,
      firstAttemptCorrect,
      currentQuestionHintUsed,
      currentQuestionWorkingViewed,
    ],
  );

  /*
   * =========================================================
   * START NEW QUESTION
   * =========================================================
   */

  const beginNewQuestion = useCallback(
    (nextQuestion: TQuestion, nextDifficulty: SimulatorDifficulty) => {
      questionSequenceRef.current += 1;

      const nextQuestionId =
        getQuestionId?.(nextQuestion, nextDifficulty) ??
        createSessionQuestionId(simulatorId, questionSequenceRef.current);

      setQuestionState(nextQuestion);

      setQuestionId(nextQuestionId);

      /*
       * Reset all protections because this is a genuinely
       * new generated question.
       */
      setQuestionScored(false);

      setQuestionCorrectRecorded(false);

      setQuestionRewarded(false);

      setQuestionAnswerChecks(0);

      setFirstAttemptCorrect(null);

      setCurrentQuestionHintUsed(false);

      setCurrentQuestionWorkingViewed(false);

      clearResponseState();
    },
    [clearResponseState, getQuestionId, simulatorId],
  );

  /*
   * =========================================================
   * MARK ANSWER
   * =========================================================
   */

  const markAnswer = useCallback(
    (isCorrect: boolean) => {
      /*
       * A visible checked response must be cleared with
       * Try Again before another answer can be checked.
       */
      if (checked) {
        return;
      }

      const nextAnswerChecks = questionAnswerChecks + 1;

      setQuestionAnswerChecks(nextAnswerChecks);

      setChecked(true);

      setCorrect(isCorrect);

      /*
       * Record first-attempt performance once only.
       */
      if (firstAttemptCorrect === null) {
        setFirstAttemptCorrect(isCorrect);
      }

      /*
       * -----------------------------------------------------
       * QUESTIONS
       * -----------------------------------------------------
       *
       * The generated question contributes exactly once to
       * Questions, regardless of retries.
       */
      if (!questionScored) {
        setQuestionScored(true);

        setAttempts((current) => current + 1);

        /*
         * A first-attempt mistake breaks the current streak.
         *
         * A repeated mistake on the same question should not
         * repeatedly reset or otherwise manipulate analytics.
         */
        if (!isCorrect) {
          setStreak(0);
        }
      }

      /*
       * -----------------------------------------------------
       * WRONG ANSWER
       * -----------------------------------------------------
       */

      if (!isCorrect) {
        saveCurrentQuestionResult(false, 0, nextAnswerChecks);

        return;
      }

      /*
       * -----------------------------------------------------
       * EVENTUAL CORRECTNESS
       * -----------------------------------------------------
       *
       * A learner who gets the question wrong first and then
       * succeeds after Try Again should still receive credit
       * for eventually mastering that question.
       *
       * Correct can only increase once for this question.
       */
      if (!questionCorrectRecorded) {
        setQuestionCorrectRecorded(true);

        setCorrectAnswers((current) => current + 1);

        setStreak((current) => {
          const next = current + 1;

          setHighestStreak((highest) => Math.max(highest, next));

          return next;
        });
      }

      /*
       * -----------------------------------------------------
       * XP
       * -----------------------------------------------------
       *
       * XP can only ever be awarded once for a generated
       * question.
       */
      let awardedXP = 0;

      if (!questionRewarded) {
        awardedXP = currentXPReward;

        setQuestionRewarded(true);

        setXp((current) => current + awardedXP);

        /*
         * Update real CS Master XP once only.
         */
        if (onAwardXP) {
          void onAwardXP(awardedXP);
        }
      }

      saveCurrentQuestionResult(true, awardedXP, nextAnswerChecks);
    },
    [
      checked,
      questionAnswerChecks,
      firstAttemptCorrect,
      questionScored,
      questionCorrectRecorded,
      questionRewarded,
      currentXPReward,
      onAwardXP,
      saveCurrentQuestionResult,
    ],
  );

  /*
   * =========================================================
   * TRY AGAIN / RESET QUESTION
   * =========================================================
   *
   * SAME generated question.
   *
   * Important:
   *
   * - Questions does not increase again.
   * - Correct cannot increase more than once.
   * - XP cannot be awarded more than once.
   * - The learner CAN still earn XP after initially getting
   *   the question wrong.
   */
  const resetQuestion = useCallback(() => {
    clearResponseState();
  }, [clearResponseState]);

  /*
   * =========================================================
   * NEW QUESTION
   * =========================================================
   */

  const newQuestion = useCallback(() => {
    const nextQuestion = generateQuestion(difficulty);

    beginNewQuestion(nextQuestion, difficulty);
  }, [difficulty, generateQuestion, beginNewQuestion]);

  /*
   * =========================================================
   * DIFFICULTY CHANGE
   * =========================================================
   */

  const changeDifficulty = useCallback(
    (nextDifficulty: SimulatorDifficulty) => {
      setDifficulty(nextDifficulty);

      const nextQuestion = generateQuestion(nextDifficulty);

      beginNewQuestion(nextQuestion, nextDifficulty);
    },
    [generateQuestion, beginNewQuestion],
  );

  /*
   * =========================================================
   * HINT
   * =========================================================
   */

  const toggleHint = useCallback(() => {
    setHintVisible((current) => {
      const next = !current;

      /*
       * Count actual use only when opening the hint.
       */
      if (next && !currentQuestionHintUsed) {
        setCurrentQuestionHintUsed(true);

        setHintsUsed((value) => value + 1);
      }

      return next;
    });
  }, [currentQuestionHintUsed]);

  /*
   * =========================================================
   * SHOW WORKING
   * =========================================================
   */

  const toggleWorking = useCallback(() => {
    setWorkingVisible((current) => {
      const next = !current;

      if (next && !currentQuestionWorkingViewed) {
        setCurrentQuestionWorkingViewed(true);

        setWorkingViewed((value) => value + 1);
      }

      return next;
    });
  }, [currentQuestionWorkingViewed]);

  /*
   * =========================================================
   * MANUAL QUESTION SETTER
   * =========================================================
   *
   * Keep compatibility with existing simulators that use
   * setQuestion directly.
   *
   * This setter intentionally ONLY changes the question value.
   * Existing simulator behaviour relying on setQuestion should
   * therefore continue to work.
   */
  const setQuestion = useCallback(
    (value: TQuestion | ((current: TQuestion) => TQuestion)) => {
      setQuestionState((current) =>
        typeof value === "function"
          ? (value as (current: TQuestion) => TQuestion)(current)
          : value,
      );
    },
    [],
  );

  /*
   * =========================================================
   * SESSION RESET
   * =========================================================
   *
   * We probably will not expose this in ordinary lessons,
   * but it is useful for tests and future standalone simulator
   * sessions.
   */
  const resetSession = useCallback(() => {
    setAttempts(0);

    setCorrectAnswers(0);

    setXp(0);

    setStreak(0);

    setHighestStreak(0);

    setHintsUsed(0);

    setWorkingViewed(0);

    setQuestionResults([]);

    setQuestionScored(false);

    setQuestionCorrectRecorded(false);

    setQuestionRewarded(false);

    setQuestionAnswerChecks(0);

    setFirstAttemptCorrect(null);

    setCurrentQuestionHintUsed(false);

    setCurrentQuestionWorkingViewed(false);

    clearResponseState();
  }, [clearResponseState]);

  /*
   * =========================================================
   * PUBLIC API
   * =========================================================
   *
   * All existing properties are retained so current simulators
   * should remain compatible.
   *
   * New analytics are added underneath them.
   */
  return {
    /*
     * Existing API
     */
    difficulty,

    question,

    checked,

    correct,

    questionScored,

    hintVisible,

    workingVisible,

    attempts,

    correctAnswers,

    accuracy,

    xp,

    streak,

    highestStreak,

    markAnswer,

    resetQuestion,

    newQuestion,

    changeDifficulty,

    toggleHint,

    toggleWorking,

    setQuestion,

    /*
     * New shared-session API
     */
    questionId,

    questionRewarded,

    questionCorrectRecorded,

    questionAnswerChecks,

    firstAttemptCorrect,

    hintsUsed,

    workingViewed,

    currentQuestionHintUsed,

    currentQuestionWorkingViewed,

    questionResults,

    currentXPReward,

    resetSession,
  };
}
