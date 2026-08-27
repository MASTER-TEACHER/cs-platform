"use client";

import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { saveQuizResult } from "@/services/quizService";
import {
  saveAssignmentResult,
  type QuizIntegrityIncident,
} from "@/services/assignmentResultService";
import type { Quiz } from "@/types/quiz";

type Props = {
  quiz: Quiz;
};

type QuizDeliveryMode = "practice" | "assessment";

type LinkedAssignment = {
  id: string;
  classId: string;
  teacherId: string;
  resourceId: string;
  deliveryMode: QuizDeliveryMode;
};

const DEFAULT_QUIZ_DURATION_SECONDS = 8 * 60;
const FULLSCREEN_EXIT_COUNTDOWN_SECONDS = 5;

function parseQuizDurationSeconds(value: string): number {
  const normalised = value.trim().toLowerCase();

  if (!normalised) {
    return DEFAULT_QUIZ_DURATION_SECONDS;
  }

  const hoursMatch = normalised.match(
    /(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|hr|h)\b/,
  );

  const minutesMatch = normalised.match(
    /(\d+(?:\.\d+)?)\s*(?:minutes?|mins?|min|m)\b/,
  );

  const secondsMatch = normalised.match(
    /(\d+(?:\.\d+)?)\s*(?:seconds?|secs?|sec|s)\b/,
  );

  const hours = hoursMatch ? Number(hoursMatch[1]) : 0;
  const minutes = minutesMatch ? Number(minutesMatch[1]) : 0;
  const seconds = secondsMatch ? Number(secondsMatch[1]) : 0;

  const totalSeconds = Math.round(
    hours * 60 * 60 +
      minutes * 60 +
      seconds,
  );

  return totalSeconds > 0
    ? totalSeconds
    : DEFAULT_QUIZ_DURATION_SECONDS;
}

function getGrade(scorePercent: number) {
  if (scorePercent >= 90) return "Grade 9";
  if (scorePercent >= 80) return "Grade 8";
  if (scorePercent >= 70) return "Grade 7";
  if (scorePercent >= 60) return "Grade 6";
  if (scorePercent >= 50) return "Grade 5";
  if (scorePercent >= 40) return "Grade 4";
  if (scorePercent >= 30) return "Grade 3";
  if (scorePercent >= 20) return "Grade 2";
  return "Grade 1";
}

function getMessage(scorePercent: number) {
  if (scorePercent >= 90) return "Outstanding performance!";
  if (scorePercent >= 75) return "Excellent work!";
  if (scorePercent >= 60) return "Good progress!";
  if (scorePercent >= 40) return "You are getting there.";
  return "Keep practising. You can improve this.";
}

function createIncident(
  type: QuizIntegrityIncident["type"],
  questionNumber: number | null,
  detail: string,
): QuizIntegrityIncident {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    type,
    occurredAt: new Date().toISOString(),
    questionNumber,
    detail,
  };
}

export default function QuizPlayer({ quiz }: Props) {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const assignmentId = searchParams.get("assignment");

  const quizDurationSeconds = useMemo(
    () => parseQuizDurationSeconds(quiz.estimatedTime),
    [quiz.estimatedTime],
  );

  const assessmentRootRef = useRef<HTMLDivElement | null>(null);
  const quizSaveInProgress = useRef(false);
  const assignmentSaveInProgress = useRef(false);
  const finishingRef = useRef(false);

  /*
   * Synchronous integrity termination flag.
   *
   * React state updates are asynchronous. This ref makes the zero-XP rule
   * available immediately to save operations when auto-submit occurs.
   */
  const integrityTerminatedRef = useRef(false);

  const fullscreenExitActiveRef = useRef(false);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const integrityIncidentsRef = useRef<QuizIntegrityIncident[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => quizDurationSeconds);
  const [resultSaved, setResultSaved] = useState(false);
  const [assignmentResultSaved, setAssignmentResultSaved] = useState(false);

  const [linkedAssignment, setLinkedAssignment] =
    useState<LinkedAssignment | null>(null);
  const [assignmentLoading, setAssignmentLoading] = useState(Boolean(assignmentId));
  const [assignmentError, setAssignmentError] = useState("");

  const [integrityStarted, setIntegrityStarted] = useState(false);
  const [integritySessionStartedAt, setIntegritySessionStartedAt] =
    useState<string | null>(null);
  const [fullscreenCountdown, setFullscreenCountdown] =
    useState<number | null>(null);
  const [integrityWarning, setIntegrityWarning] = useState("");
  const [integrityTerminated, setIntegrityTerminated] = useState(false);
  const [integrityTerminationReason, setIntegrityTerminationReason] =
    useState("");

  const deliveryMode: QuizDeliveryMode =
    linkedAssignment?.deliveryMode ?? "practice";
  const assessmentMode =
    Boolean(assignmentId) && deliveryMode === "assessment";

  const currentQuestion = quiz.questions[currentIndex];
  const selectedAnswer = currentQuestion
    ? answers[currentQuestion.id] || ""
    : "";

  const currentQuestionNumber = currentIndex + 1;

  const progress = Math.round(
    ((currentIndex + 1) / Math.max(1, quiz.questions.length)) * 100,
  );

  const totalXP = useMemo(() => {
    return quiz.questions.reduce(
      (total, question) => total + question.xpReward,
      0,
    );
  }, [quiz.questions]);

  const correctCount = quiz.questions.filter((question) => {
    const userAnswer = answers[question.id]?.trim().toLowerCase();
    const correctAnswer = question.correctAnswer.trim().toLowerCase();
    return userAnswer === correctAnswer;
  }).length;

  const scorePercent = Math.round(
    (correctCount / Math.max(1, quiz.questions.length)) * 100,
  );

  const earnedXP = quiz.questions.reduce((total, question) => {
    const userAnswer = answers[question.id]?.trim().toLowerCase();
    const correctAnswer = question.correctAnswer.trim().toLowerCase();

    return userAnswer === correctAnswer
      ? total + question.xpReward
      : total;
  }, 0);

  /*
   * Integrity-terminated assessment attempts retain their raw score for
   * teacher evidence, but do not award XP.
   */
  const awardedXP = integrityTerminated ? 0 : earnedXP;

  const strengths = quiz.questions
    .filter((question) => {
      const userAnswer = answers[question.id]?.trim().toLowerCase();
      const correctAnswer = question.correctAnswer.trim().toLowerCase();
      return userAnswer === correctAnswer;
    })
    .slice(0, 3);

  const needsPractice = quiz.questions
    .filter((question) => {
      const userAnswer = answers[question.id]?.trim().toLowerCase();
      const correctAnswer = question.correctAnswer.trim().toLowerCase();
      return userAnswer !== correctAnswer;
    })
    .slice(0, 3);

  useEffect(() => {
    let cancelled = false;

    async function loadLinkedAssignment() {
      if (!assignmentId) {
        setLinkedAssignment(null);
        setAssignmentLoading(false);
        return;
      }

      try {
        setAssignmentLoading(true);
        setAssignmentError("");

        const snapshot = await getDoc(doc(db, "assignments", assignmentId));

        if (!snapshot.exists()) {
          throw new Error("The linked quiz assignment could not be found.");
        }

        const data = snapshot.data();

        if (data.type !== "quiz") {
          throw new Error("This assignment is not a quiz assignment.");
        }

        if (!data.classId || !data.teacherId) {
          throw new Error(
            "The assignment is missing its class or teacher information.",
          );
        }

        if (!cancelled) {
          setLinkedAssignment({
            id: snapshot.id,
            classId: data.classId,
            teacherId: data.teacherId,
            resourceId: data.resourceId || quiz.topicId,
            deliveryMode:
              data.deliveryMode === "assessment" ? "assessment" : "practice",
          });
        }
      } catch (error) {
        console.error("Quiz assignment load error:", error);

        if (!cancelled) {
          setAssignmentError(
            error instanceof Error
              ? error.message
              : "The linked quiz assignment could not be loaded.",
          );
        }
      } finally {
        if (!cancelled) {
          setAssignmentLoading(false);
        }
      }
    }

    void loadLinkedAssignment();

    return () => {
      cancelled = true;
    };
  }, [assignmentId, quiz.topicId]);

  useEffect(() => {
    void Promise.resolve().then(() => {
      setTimeLeft(quizDurationSeconds);
    });
  }, [quiz.id, quizDurationSeconds]);

  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  function appendIntegrityIncident(
    type: QuizIntegrityIncident["type"],
    detail: string,
  ) {
    const incident = createIncident(
      type,
      currentQuestionNumber,
      detail,
    );

    integrityIncidentsRef.current = [
      ...integrityIncidentsRef.current,
      incident,
    ];
  }

  async function leaveFullscreenSafely() {
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => undefined);
    }
  }

  async function finishQuiz({
    terminated = false,
    reason = "",
  }: {
    terminated?: boolean;
    reason?: string;
  } = {}) {
    if (finishingRef.current || showResults) {
      return;
    }

    finishingRef.current = true;

    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    fullscreenExitActiveRef.current = false;
    setFullscreenCountdown(null);

    if (terminated) {
      /*
       * Set the ref first so save effects see termination synchronously,
       * before React finishes applying the state update.
       */
      integrityTerminatedRef.current = true;
      setIntegrityTerminated(true);
      setIntegrityTerminationReason(reason);

      appendIntegrityIncident(
        "auto_submit",
        reason || "The assessment was automatically submitted.",
      );
    }

    await leaveFullscreenSafely();
    setShowResults(true);
  }

  const finishQuizFromTimer = useEffectEvent(
    (options: { terminated?: boolean; reason?: string }) => {
      void finishQuiz(options);
    },
  );

  useEffect(() => {
    if (
      showResults ||
      assignmentLoading ||
      (assessmentMode && !integrityStarted)
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          window.clearInterval(timer);

          finishQuizFromTimer({
            terminated: assessmentMode,
            reason: assessmentMode
              ? "The assessment timer expired and the quiz was automatically submitted."
              : "",
          });

          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [
    showResults,
    assignmentLoading,
    assessmentMode,
    integrityStarted,
  ]);

  function beginFullscreenCountdown() {
    if (
      !assessmentMode ||
      !integrityStarted ||
      showResults ||
      finishingRef.current ||
      fullscreenExitActiveRef.current
    ) {
      return;
    }

    fullscreenExitActiveRef.current = true;

    setFullscreenCountdown(FULLSCREEN_EXIT_COUNTDOWN_SECONDS);

    appendIntegrityIncident(
      "fullscreen_exit",
      `Fullscreen was exited. A ${FULLSCREEN_EXIT_COUNTDOWN_SECONDS}-second return countdown started.`,
    );

    let remaining = FULLSCREEN_EXIT_COUNTDOWN_SECONDS;

    countdownTimerRef.current = setInterval(() => {
      remaining -= 1;
      setFullscreenCountdown(Math.max(remaining, 0));

      if (remaining <= 0) {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }

        void finishQuiz({
          terminated: true,
          reason:
            "The learner exited fullscreen and did not return within 5 seconds.",
        });
      }
    }, 1000);
  }

  function resolveFullscreenExit() {
    if (!fullscreenExitActiveRef.current) {
      return;
    }

    fullscreenExitActiveRef.current = false;

    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    setFullscreenCountdown(null);

    appendIntegrityIncident(
      "fullscreen_restored",
      "Fullscreen was restored before the five-second termination countdown expired.",
    );
  }

  const handleFullscreenChange = useEffectEvent(() => {
    if (finishingRef.current) {
      return;
    }

    if (
      document.fullscreenElement ===
      assessmentRootRef.current
    ) {
      resolveFullscreenExit();
    } else {
      beginFullscreenCountdown();
    }
  });

  const handleVisibilityChange = useEffectEvent(() => {
    if (finishingRef.current) {
      return;
    }

    if (document.visibilityState === "hidden") {
      appendIntegrityIncident(
        "page_hidden",
        "The assessment page became hidden.",
      );

      setIntegrityWarning(
        "The assessment page was hidden. This incident has been recorded.",
      );
    } else {
      appendIntegrityIncident(
        "page_visible",
        "The assessment page became visible again.",
      );
    }
  });

  useEffect(() => {
    if (
      !assessmentMode ||
      !integrityStarted ||
      showResults
    ) {
      return;
    }

    function onFullscreenChange() {
      handleFullscreenChange();
    }

    function onVisibilityChange() {
      handleVisibilityChange();
    }

    document.addEventListener(
      "fullscreenchange",
      onFullscreenChange,
    );
    document.addEventListener(
      "visibilitychange",
      onVisibilityChange,
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        onFullscreenChange,
      );
      document.removeEventListener(
        "visibilitychange",
        onVisibilityChange,
      );
    };
  }, [
    assessmentMode,
    integrityStarted,
    showResults,
  ]);

  async function enterAssessmentMode() {
    if (!assessmentRootRef.current) {
      return;
    }

    if (!document.fullscreenEnabled) {
      toast.error(
        "Fullscreen is not available in this browser. Ask your teacher for support.",
      );
      return;
    }

    try {
      await assessmentRootRef.current.requestFullscreen();

      const startedAt = new Date().toISOString();
      setIntegritySessionStartedAt(startedAt);
      setIntegrityStarted(true);
      setIntegrityWarning("");
      integrityTerminatedRef.current = false;
      setIntegrityTerminated(false);
      setIntegrityTerminationReason("");
      finishingRef.current = false;
      integrityIncidentsRef.current = [];

      toast.success("Monitored assessment started.");
    } catch (error) {
      console.error(
        "Unable to enter monitored assessment mode:",
        error,
      );

      toast.error(
        "Fullscreen assessment mode could not be started.",
      );
    }
  }

  async function returnToFullscreen() {
    if (!assessmentRootRef.current) {
      return;
    }

    try {
      await assessmentRootRef.current.requestFullscreen();
    } catch {
      toast.error(
        "Fullscreen could not be restored. Return before the countdown reaches zero.",
      );
    }
  }

  useEffect(() => {
    async function saveNormalQuizResult() {
      if (
        !showResults ||
        resultSaved ||
        !user ||
        quizSaveInProgress.current
      ) {
        return;
      }

      quizSaveInProgress.current = true;

      try {
        await saveQuizResult({
          uid: user.uid,
          quizId: quiz.id,
          topicId: quiz.topicId,
          title: quiz.title,
          scorePercent,
          correctCount,
          totalQuestions: quiz.questions.length,
          earnedXP:
            integrityTerminatedRef.current
              ? 0
              : awardedXP,
        });

        setResultSaved(true);

        toast.success(
          integrityTerminated
            ? "Assessment result saved. No XP was awarded."
            : `Quiz result saved! +${awardedXP} XP`,
        );
      } catch (error) {
        console.error("Quiz save error:", error);
        toast.error("Could not save quiz result.");
      } finally {
        quizSaveInProgress.current = false;
      }
    }

    void saveNormalQuizResult();
  }, [
    showResults,
    resultSaved,
    user,
    quiz.id,
    quiz.topicId,
    quiz.title,
    quiz.questions.length,
    scorePercent,
    correctCount,
    awardedXP,
    integrityTerminated,
  ]);

  useEffect(() => {
    async function saveLinkedAssignmentResult() {
      if (
        !showResults ||
        !assignmentId ||
        !linkedAssignment ||
        assignmentResultSaved ||
        !user ||
        assignmentSaveInProgress.current
      ) {
        return;
      }

      assignmentSaveInProgress.current = true;

      try {
        await saveAssignmentResult({
          assignmentId,
          studentId: user.uid,
          classId: linkedAssignment.classId,
          teacherId: linkedAssignment.teacherId,
          assignmentType: "quiz",
          resourceId: linkedAssignment.resourceId || quiz.topicId,
          score: correctCount,
          totalQuestions: quiz.questions.length,
          percentage: scorePercent,
          earnedXP:
            integrityTerminatedRef.current
              ? 0
              : awardedXP,
          timeTakenSeconds: Math.max(0, quizDurationSeconds - timeLeft),

          ...(assessmentMode
            ? {
                deliveryMode: "assessment" as const,
                integritySessionStartedAt,
                integrityIncidents: integrityIncidentsRef.current,
                integrityTerminated,
                integrityTerminationReason,
              }
            : {
                deliveryMode: "practice" as const,
              }),
        });

        setAssignmentResultSaved(true);

        toast.success(
          integrityTerminated
            ? "Assessment automatically submitted."
            : "Assignment marked as completed.",
        );
      } catch (error) {
        console.error("Assignment result save error:", error);

        toast.error(
          error instanceof Error
            ? error.message
            : "Could not mark the assignment as completed.",
        );
      } finally {
        assignmentSaveInProgress.current = false;
      }
    }

    void saveLinkedAssignmentResult();
  }, [
    showResults,
    assignmentId,
    linkedAssignment,
    assignmentResultSaved,
    user,
    quiz.topicId,
    quiz.questions.length,
    correctCount,
    scorePercent,
    awardedXP,
    timeLeft,
    quizDurationSeconds,
    assessmentMode,
    integritySessionStartedAt,
    integrityTerminated,
    integrityTerminationReason,
  ]);

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  function saveAnswer(answer: string) {
    if (assessmentMode && !integrityStarted) {
      return;
    }

    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [currentQuestion.id]: answer,
    }));
  }

  function goNext() {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((previousIndex) => previousIndex + 1);
      setIntegrityWarning("");
      return;
    }

    void finishQuiz();
  }

  function goPrevious() {
    if (currentIndex > 0) {
      setCurrentIndex((previousIndex) => previousIndex - 1);
      setIntegrityWarning("");
    }
  }

  if (assignmentLoading) {
    return (
      <Card>
        <p className="font-bold text-slate-700">
          Preparing your assigned quiz...
        </p>
      </Card>
    );
  }

  if (assignmentError) {
    return (
      <Card>
        <h1 className="text-2xl font-black text-slate-950">
          Quiz assignment unavailable
        </h1>

        <p className="mt-3 text-red-700">
          {assignmentError}
        </p>
      </Card>
    );
  }

  if (
    assessmentMode &&
    !showResults &&
    !integrityStarted
  ) {
    return (
      <div
        ref={assessmentRootRef}
        className="min-h-screen bg-slate-100 p-6"
      >
        <div className="mx-auto max-w-4xl">
          <Card className="overflow-hidden rounded-3xl border-0 p-0">
            <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-violet-950 p-8 text-white">
              <div className="flex items-center gap-2 text-indigo-200">
                <ShieldCheck className="h-5 w-5" />

                <p className="text-xs font-black uppercase tracking-[0.16em]">
                  Monitored Quiz Assessment
                </p>
              </div>

              <h1 className="mt-4 text-4xl font-black">
                {quiz.title}
              </h1>

              <p className="mt-3 max-w-2xl text-indigo-100">
                {quiz.questions.length} questions · {quiz.estimatedTime}
              </p>
            </div>

            <div className="space-y-6 p-8">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <p className="font-black text-amber-950">
                  Integrity monitoring
                </p>

                <p className="mt-2 text-sm leading-6 text-amber-900">
                  This is integrity monitoring, not a guaranteed lockdown
                  browser. The assessment records fullscreen exits and page
                  visibility changes to give your teacher contextual evidence.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="font-black text-slate-950">
                    Fullscreen required
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Leaving fullscreen starts a visible five-second countdown.
                    If you do not return before it reaches zero, the quiz is
                    automatically submitted.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="font-black text-slate-950">
                    Page visibility monitored
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Switching away from the assessment is recorded with the
                    current question number and timestamp.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => void enterAssessmentMode()}
                className="w-full rounded-2xl bg-indigo-600 px-6 py-4 text-lg font-black text-white transition hover:bg-indigo-700"
              >
                Enter Monitored Assessment
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (showResults) {
    if (integrityTerminated) {
      return (
        <div className="space-y-6">
          <Card className="overflow-hidden rounded-3xl border-0 p-0">
            <div className="bg-gradient-to-r from-slate-950 via-red-950 to-rose-900 p-8 text-white">
              <div className="flex justify-center">
                <div className="rounded-full bg-red-500/20 p-4">
                  <AlertTriangle className="h-10 w-10 text-red-200" />
                </div>
              </div>

              <p className="mt-5 text-center text-xs font-black uppercase tracking-[0.18em] text-red-200">
                Monitored assessment
              </p>

              <h1 className="mt-3 text-center text-4xl font-black">
                Assessment Ended
              </h1>

              <p className="mt-3 text-center text-lg font-bold text-red-100">
                Automatically submitted due to an integrity event
              </p>
            </div>

            <div className="space-y-6 p-8">
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                <p className="font-black text-red-950">
                  Why the assessment ended
                </p>

                <p className="mt-2 text-sm leading-6 text-red-800">
                  {integrityTerminationReason ||
                    "The assessment was automatically submitted by the integrity-monitoring rules."}
                </p>

                <p className="mt-3 text-sm leading-6 text-red-800">
                  Your answers up to the point of submission have been saved.
                  Your teacher can review the raw score together with the
                  integrity record.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                    Answers correct
                  </p>

                  <p className="mt-2 text-2xl font-black text-slate-950">
                    {correctCount} / {quiz.questions.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                    Raw score
                  </p>

                  <p className="mt-2 text-2xl font-black text-slate-950">
                    {scorePercent}%
                  </p>
                </div>

                <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                  <p className="text-xs font-black uppercase tracking-wide text-red-600">
                    Integrity status
                  </p>

                  <p className="mt-2 text-lg font-black text-red-950">
                    Auto-submitted
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                    XP earned
                  </p>

                  <p className="mt-2 text-2xl font-black text-slate-950">
                    0
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 text-sm leading-6 text-indigo-900">
                The raw score is retained as contextual assessment evidence.
                A normal quiz grade is not shown because this attempt ended
                through integrity auto-submission rather than normal completion.
              </div>

              <div className="text-center text-sm font-semibold text-slate-600">
                {resultSaved
                  ? "Result saved."
                  : user
                    ? "Saving result..."
                    : "Sign in is required to save the result."}

                {assignmentId && (
                  <span>
                    {" "}
                    {assignmentResultSaved
                      ? "Teacher markbook updated."
                      : "Updating teacher markbook..."}
                  </span>
                )}
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-black text-slate-950">
              Answers saved before submission
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              These answers are shown for review only. Your teacher will also
              see the associated integrity evidence.
            </p>

            <div className="mt-6 space-y-4">
              {quiz.questions.map((question, index) => {
                const userAnswer = answers[question.id] || "No answer";

                const isCorrect =
                  userAnswer.trim().toLowerCase() ===
                  question.correctAnswer.trim().toLowerCase();

                return (
                  <div
                    key={question.id}
                    className={`rounded-2xl border p-4 ${
                      isCorrect
                        ? "border-green-200 bg-green-50"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <p className="font-semibold text-slate-900">
                      Q{index + 1}. {question.question}
                    </p>

                    <p className="mt-2 text-sm text-slate-700">
                      Your answer: {userAnswer}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <Card className="border-0 bg-gradient-to-r from-blue-700 to-indigo-700 text-center text-white">
          <div className="text-6xl">🎉</div>

          <h1 className="mt-4 text-4xl font-bold">
            Quiz Complete
          </h1>

          <p className="mt-3 text-blue-100">
            {getMessage(scorePercent)}
          </p>

          <p className="mt-6 text-6xl font-extrabold">
            {scorePercent}%
          </p>

          <p className="mt-3 text-2xl font-bold">
            {getGrade(scorePercent)}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-blue-100">
                Correct Answers
              </p>

              <p className="mt-1 text-2xl font-bold">
                {correctCount} / {quiz.questions.length}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-blue-100">
                XP Earned
              </p>

              <p className="mt-1 text-2xl font-bold">
                ⭐ {awardedXP}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-blue-100">
                Saved
              </p>

              <p className="mt-1 text-2xl font-bold">
                {resultSaved
                  ? "✅ Yes"
                  : user
                    ? "Saving..."
                    : "Login needed"}
              </p>

              {assignmentId && (
                <p className="mt-2 text-sm text-blue-100">
                  Assignment:{" "}
                  {assignmentResultSaved
                    ? "✅ Completed"
                    : "Saving..."}
                </p>
              )}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <h2 className="text-2xl font-bold text-slate-900">
              ✅ Strengths
            </h2>

            {strengths.length > 0 ? (
              <div className="mt-4 space-y-3">
                {strengths.map((question) => (
                  <div
                    key={question.id}
                    className="rounded-xl bg-green-50 p-4 text-green-800"
                  >
                    {question.question}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-slate-600">
                No strengths identified yet. Try the quiz again after revising.
              </p>
            )}
          </Card>

          <Card>
            <h2 className="text-2xl font-bold text-slate-900">
              ⚠ Needs More Practice
            </h2>

            {needsPractice.length > 0 ? (
              <div className="mt-4 space-y-3">
                {needsPractice.map((question) => (
                  <div
                    key={question.id}
                    className="rounded-xl bg-red-50 p-4 text-red-800"
                  >
                    {question.question}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-slate-600">
                Excellent — no weak areas found in this quiz.
              </p>
            )}
          </Card>
        </div>

        <Card>
          <h2 className="text-2xl font-bold text-slate-900">
            Review Answers
          </h2>

          <div className="mt-6 space-y-4">
            {quiz.questions.map((question, index) => {
              const userAnswer =
                answers[question.id] || "No answer";

              const isCorrect =
                userAnswer.trim().toLowerCase() ===
                question.correctAnswer.trim().toLowerCase();

              return (
                <div
                  key={question.id}
                  className={`rounded-2xl border p-4 ${
                    isCorrect
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <p className="font-semibold text-slate-900">
                    Q{index + 1}. {question.question}
                  </p>

                  <p className="mt-2 text-sm text-slate-700">
                    Your answer: {userAnswer}
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    Correct answer: {question.correctAnswer}
                  </p>

                  <p className="mt-2 text-sm text-slate-600">
                    {question.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  }

  const quizContent = (
    <div className="space-y-6">
      {assessmentMode && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-4">
          <div className="flex items-center gap-2 text-indigo-900">
            <ShieldCheck className="h-5 w-5" />
            <p className="font-black">
              Monitored assessment in progress
            </p>
          </div>

          <p className="mt-1 text-sm text-indigo-800">
            Fullscreen and page visibility events are being recorded.
          </p>
        </div>
      )}

      {integrityWarning && assessmentMode && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
          {integrityWarning}
        </div>
      )}

      <Card className="border-0 bg-gradient-to-r from-slate-900 to-blue-700 text-white">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">
          {assessmentMode ? "Monitored Quiz Assessment" : "Quiz"}
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          {quiz.title}
        </h1>

        <p className="mt-2 text-blue-100">
          {quiz.description}
        </p>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-sm font-semibold text-blue-100">
            <span>
              Question {currentIndex + 1} of {quiz.questions.length}
            </span>

            <span>{progress}% complete</span>
          </div>

          <ProgressBar value={progress} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-sm text-blue-100">
              ⏱ Time Left
            </p>

            <p className="mt-1 text-2xl font-bold">
              {formatTime(timeLeft)}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-sm text-blue-100">
              ⭐ XP Available
            </p>

            <p className="mt-1 text-2xl font-bold">
              {totalXP}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-sm text-blue-100">
              📚 Estimated Time
            </p>

            <p className="mt-1 text-2xl font-bold">
              {quiz.estimatedTime}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Question {currentIndex + 1}
        </p>

        <h2 className="mt-4 text-2xl font-bold text-slate-900">
          {currentQuestion.question}
        </h2>

        <div className="mt-8 space-y-3">
          {currentQuestion.type === "multipleChoice" ||
          currentQuestion.type === "trueFalse" ? (
            currentQuestion.options?.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => saveAnswer(option)}
                className={`w-full rounded-xl border p-4 text-left font-semibold transition ${
                  selectedAnswer === option
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {option}
              </button>
            ))
          ) : (
            <input
              value={selectedAnswer}
              onChange={(event) =>
                saveAnswer(event.target.value)
              }
              placeholder="Type your answer..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            variant="secondary"
            onClick={goPrevious}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>

          <Button onClick={goNext}>
            {currentIndex === quiz.questions.length - 1
              ? "Finish Quiz"
              : "Next Question"}
          </Button>
        </div>
      </Card>
    </div>
  );

  if (!assessmentMode) {
    return quizContent;
  }

  return (
    <div
      ref={assessmentRootRef}
      className="min-h-screen overflow-y-auto bg-slate-100 p-6"
    >
      <div className="mx-auto max-w-6xl">
        {quizContent}
      </div>

      {fullscreenCountdown !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-6 text-white">
          <div className="w-full max-w-xl rounded-3xl border border-red-400/40 bg-slate-900 p-8 text-center shadow-2xl">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />

            <p className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-red-300">
              Fullscreen exited
            </p>

            <p className="mt-4 text-7xl font-black">
              {fullscreenCountdown}
            </p>

            <p className="mt-4 text-lg font-bold">
              Return to fullscreen before the countdown reaches zero.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              If you do not return within five seconds, the quiz will be
              automatically submitted and the incident will be recorded.
            </p>

            <button
              type="button"
              onClick={() => void returnToFullscreen()}
              className="mt-7 w-full rounded-2xl bg-indigo-600 px-6 py-4 font-black text-white hover:bg-indigo-500"
            >
              Return to fullscreen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}