"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

import {
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";

import {
  markSecureQuiz,
} from "@/services/secureQuizClientService";

import type {
  SecureQuiz,
  SecureQuizIntegrityIncident,
  SecureQuizMarkResult,
} from "@/types/secureQuiz";

const DEFAULT_QUIZ_DURATION_SECONDS =
  8 * 60;

const FULLSCREEN_EXIT_COUNTDOWN_SECONDS =
  5;

function parseQuizDurationSeconds(
  value: string,
): number {
  const normalised =
    value
      .trim()
      .toLowerCase();

  const hours =
    normalised.match(
      /(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|hr|h)\b/,
    );

  const minutes =
    normalised.match(
      /(\d+(?:\.\d+)?)\s*(?:minutes?|mins?|min|m)\b/,
    );

  const seconds =
    normalised.match(
      /(\d+(?:\.\d+)?)\s*(?:seconds?|secs?|sec|s)\b/,
    );

  const total =
    Math.round(
      (hours
        ? Number(hours[1]) * 3600
        : 0) +
        (minutes
          ? Number(minutes[1]) * 60
          : 0) +
        (seconds
          ? Number(seconds[1])
          : 0),
    );

  return total > 0
    ? total
    : DEFAULT_QUIZ_DURATION_SECONDS;
}

function formatTime(
  seconds: number,
): string {
  const minutes =
    Math.floor(
      seconds / 60,
    );

  const remainder =
    seconds % 60;

  return `${minutes}:${remainder
    .toString()
    .padStart(
      2,
      "0",
    )}`;
}

export default function SecureQuizPlayer({
  quiz,
}: {
  quiz: SecureQuiz;
}) {
  const searchParams =
    useSearchParams();

  const assignmentId =
    searchParams.get(
      "assignment",
    );

  const assessmentMode =
    quiz.deliveryMode ===
    "assessment";

  const quizDurationSeconds =
    useMemo(
      () =>
        parseQuizDurationSeconds(
          quiz.estimatedTime,
        ),
      [
        quiz.estimatedTime,
      ],
    );

  const assessmentRootRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const integrityIncidentsRef =
    useRef<
      SecureQuizIntegrityIncident[]
    >(
      [],
    );

  const finishingRef =
    useRef(false);

  const [
    currentIndex,
    setCurrentIndex,
  ] =
    useState(0);

  const [
    answers,
    setAnswers,
  ] =
    useState<
      Record<string, string>
    >(
      {},
    );

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    result,
    setResult,
  ] =
    useState<SecureQuizMarkResult | null>(
      null,
    );

  const [
    assessmentStarted,
    setAssessmentStarted,
  ] =
    useState(
      !assessmentMode,
    );

  const [
    timeLeft,
    setTimeLeft,
  ] =
    useState(
      quizDurationSeconds,
    );

  const [
    fullscreenCountdown,
    setFullscreenCountdown,
  ] =
    useState<number | null>(
      null,
    );

  const [
    integrityTerminated,
    setIntegrityTerminated,
  ] =
    useState(false);

  const [
    integrityTerminationReason,
    setIntegrityTerminationReason,
  ] =
    useState("");

  const currentQuestion =
    quiz.questions[
      currentIndex
    ];

  const progress =
    useMemo(
      () =>
        Math.round(
          ((currentIndex +
            1) /
            Math.max(
              1,
              quiz.questions
                .length,
            )) *
            100,
        ),
      [
        currentIndex,
        quiz.questions
          .length,
      ],
    );

  const appendIncident =
    useCallback(
      (
        type:
          SecureQuizIntegrityIncident["type"],
        detail: string,
      ) => {
        integrityIncidentsRef.current =
          [
            ...integrityIncidentsRef.current,

            {
              type,

              occurredAt:
                new Date().toISOString(),

              questionNumber:
                currentIndex +
                1,

              detail,
            },
          ];
      },
      [
        currentIndex,
      ],
    );

  const submitQuiz =
    useCallback(
      async ({
        terminated = false,
        reason = "",
      }: {
        terminated?: boolean;
        reason?: string;
      } = {}) => {
        if (
          submitting ||
          result ||
          finishingRef.current
        ) {
          return;
        }

        finishingRef.current =
          true;

        if (terminated) {
          setIntegrityTerminated(
            true,
          );

          setIntegrityTerminationReason(
            reason,
          );

          appendIncident(
            "auto_submit",
            reason ||
              "Assessment automatically submitted.",
          );
        }

        if (
          document.fullscreenElement
        ) {
          await document
            .exitFullscreen()
            .catch(
              () =>
                undefined,
            );
        }

        setSubmitting(
          true,
        );

        try {
          const marked =
            await markSecureQuiz({
              topic:
                quiz.topicId ||
                quiz.id,

              attemptId:
                quiz.attemptId,

              assignmentId,

              answers,

              integrityIncidents:
                integrityIncidentsRef.current,

              integrityTerminated:
                terminated ||
                integrityTerminated,

              integrityTerminationReason:
                reason ||
                integrityTerminationReason,
            });

          setResult(
            marked,
          );

          toast.success(
            marked.xpAwardedThisAttempt
              ? `Quiz marked and saved. +${marked.earnedXP} XP`
              : "Quiz marked and saved.",
          );
        } catch (
          error
        ) {
          console.error(
            "Secure quiz submission error:",
            error,
          );

          toast.error(
            error instanceof Error
              ? error.message
              : "The quiz could not be submitted.",
          );

          finishingRef.current =
            false;
        } finally {
          setSubmitting(
            false,
          );
        }
      },
      [
        answers,
        appendIncident,
        assignmentId,
        integrityTerminated,
        integrityTerminationReason,
        quiz.attemptId,
        quiz.id,
        quiz.topicId,
        result,
        submitting,
      ],
    );

  const startAssessment =
    useCallback(
      async () => {
        if (
          !assessmentRootRef.current
        ) {
          return;
        }

        try {
          await assessmentRootRef.current.requestFullscreen();

          setAssessmentStarted(
            true,
          );

          setTimeLeft(
            quizDurationSeconds,
          );
        } catch {
          toast.error(
            "Fullscreen assessment mode could not be started.",
          );
        }
      },
      [
        quizDurationSeconds,
      ],
    );

  const returnToFullscreen =
    useCallback(
      async () => {
        if (
          !assessmentRootRef.current
        ) {
          return;
        }

        try {
          await assessmentRootRef.current.requestFullscreen();
        } catch {
          toast.error(
            "Fullscreen could not be restored. Return before the countdown reaches zero.",
          );
        }
      },
      [],
    );

  useEffect(() => {
    if (
      !assessmentMode ||
      !assessmentStarted ||
      result
    ) {
      return;
    }

    function handleVisibilityChange() {
      if (
        document.visibilityState ===
        "hidden"
      ) {
        appendIncident(
          "visibility_hidden",
          "The assessment page became hidden.",
        );
      }
    }

    function handleFullscreenChange() {
      if (
        document.fullscreenElement
      ) {
        if (
          fullscreenCountdown !==
          null
        ) {
          appendIncident(
            "fullscreen_restore",
            "Fullscreen mode was restored.",
          );

          setFullscreenCountdown(
            null,
          );
        }

        return;
      }

      appendIncident(
        "fullscreen_exit",
        "Fullscreen mode was exited.",
      );

      setFullscreenCountdown(
        FULLSCREEN_EXIT_COUNTDOWN_SECONDS,
      );
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange,
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );

      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange,
      );
    };
  }, [
    appendIncident,
    assessmentMode,
    assessmentStarted,
    fullscreenCountdown,
    result,
  ]);

  /*
   * Fullscreen countdown.
   *
   * Important:
   * The submission call happens inside the timeout callback rather
   * than synchronously in the effect body. This keeps the effect as
   * an external timer synchronisation and satisfies
   * react-hooks/set-state-in-effect.
   */
  useEffect(() => {
    if (
      fullscreenCountdown ===
        null ||
      result
    ) {
      return;
    }

    const timer =
      window.setTimeout(
        () => {
          if (
            fullscreenCountdown <=
            1
          ) {
            setFullscreenCountdown(
              null,
            );

            void submitQuiz({
              terminated:
                true,

              reason:
                "The learner left fullscreen mode and did not return within 5 seconds.",
            });

            return;
          }

          setFullscreenCountdown(
            fullscreenCountdown -
              1,
          );
        },
        1000,
      );

    return () =>
      window.clearTimeout(
        timer,
      );
  }, [
    fullscreenCountdown,
    result,
    submitQuiz,
  ]);

  /*
   * Main quiz timer.
   *
   * The state update and possible submission happen only in the
   * interval callback, never synchronously in the effect body.
   */
  useEffect(() => {
    if (
      result ||
      submitting ||
      !assessmentStarted
    ) {
      return;
    }

    const timer =
      window.setInterval(
        () => {
          setTimeLeft(
            (
              previous,
            ) => {
              if (
                previous <=
                1
              ) {
                window.clearInterval(
                  timer,
                );

                void submitQuiz({
                  terminated:
                    assessmentMode,

                  reason:
                    assessmentMode
                      ? "The assessment timer expired and the quiz was automatically submitted."
                      : "",
                });

                return 0;
              }

              return previous -
                1;
            },
          );
        },
        1000,
      );

    return () =>
      window.clearInterval(
        timer,
      );
  }, [
    assessmentMode,
    assessmentStarted,
    result,
    submitting,
    submitQuiz,
  ]);

  if (
    assessmentMode &&
    !assessmentStarted &&
    !result
  ) {
    return (
      <div
        ref={
          assessmentRootRef
        }
        className="min-h-[70vh]"
      >
        <Card className="border border-indigo-200 bg-indigo-50">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-indigo-600 p-3 text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-indigo-700">
                Monitored assessment
              </p>

              <h1 className="mt-2 text-3xl font-black text-slate-950">
                {quiz.title}
              </h1>

              <p className="mt-3 leading-7 text-slate-700">
                This assigned quiz uses integrity monitoring. Starting the assessment enters fullscreen mode. Leaving fullscreen starts a 5-second return countdown.
              </p>

              <div className="mt-6">
                <Button
                  onClick={() =>
                    void startAssessment()
                  }
                >
                  Start Assessment
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (result) {
    return (
      <div
        ref={
          assessmentRootRef
        }
        className="space-y-6"
      >
        <Card className="border-0 bg-gradient-to-r from-blue-700 to-indigo-700 text-center text-white">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-100">
            Secure server marking
          </p>

          <h1 className="mt-3 text-4xl font-black">
            Quiz Complete
          </h1>

          <p className="mt-6 text-6xl font-black">
            {
              result.scorePercent
            }
            %
          </p>

          <p className="mt-3 text-lg font-bold text-blue-100">
            {
              result.correctCount
            }{" "}
            /{" "}
            {
              result.totalQuestions
            }{" "}
            correct ·{" "}
            {
              result.earnedXP
            }{" "}
            XP
          </p>

          <p className="mt-3 text-sm text-blue-100">
            {result.persisted
              ? "Result saved securely."
              : "Result was not persisted."}

            {assignmentId &&
            result.assignmentResultPersisted
              ? " Teacher markbook updated."
              : ""}
          </p>
        </Card>

        <Card>
          <h2 className="text-2xl font-black text-slate-950">
            Review Answers
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Correct answers are released only after the server has accepted and saved the submission.
          </p>

          <div className="mt-6 space-y-4">
            {result.review.map(
              (
                item,
                index,
              ) => (
                <div
                  key={
                    item.questionId
                  }
                  className={`rounded-2xl border p-5 ${
                    item.correct
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <p className="font-black text-slate-950">
                    Q
                    {
                      index +
                      1
                    }
                    .{" "}
                    {
                      item.question
                    }
                  </p>

                  <p className="mt-3 text-sm text-slate-700">
                    Your answer:{" "}
                    {
                      item.userAnswer ||
                      "No answer"
                    }
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    Correct answer:{" "}
                    {
                      item.correctAnswer
                    }
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {
                      item.explanation
                    }
                  </p>
                </div>
              ),
            )}
          </div>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <Card>
        <h1 className="text-2xl font-black text-slate-950">
          Quiz unavailable
        </h1>

        <p className="mt-3 text-slate-600">
          This quiz does not currently contain any questions.
        </p>
      </Card>
    );
  }

  return (
    <div
      ref={
        assessmentRootRef
      }
      className="space-y-6"
    >
      {fullscreenCountdown !==
        null && (
        <Card className="border border-red-300 bg-red-50">
          <div className="flex items-center gap-4">
            <AlertTriangle className="h-7 w-7 text-red-700" />

            <div>
              <p className="font-black text-red-950">
                Return to fullscreen within{" "}
                {
                  fullscreenCountdown
                }{" "}
                seconds
              </p>

              <p className="mt-1 text-sm text-red-800">
                If you do not return, the assessment will be automatically submitted.
              </p>

              <div className="mt-3">
                <Button
                  onClick={() =>
                    void returnToFullscreen()
                  }
                >
                  Return to Fullscreen
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="border-0 bg-gradient-to-r from-slate-950 to-blue-800 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-200">
              {assessmentMode
                ? "Monitored assessment"
                : "Protected quiz"}
            </p>

            <h1 className="mt-2 text-3xl font-black">
              {
                quiz.title
              }
            </h1>

            <p className="mt-2 text-blue-100">
              {
                quiz.description
              }
            </p>
          </div>

          <div className="rounded-xl bg-white/10 px-4 py-3 text-center">
            <p className="text-xs font-black uppercase tracking-wide text-blue-200">
              Time
            </p>

            <p className="mt-1 text-xl font-black">
              {
                formatTime(
                  timeLeft,
                )
              }
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-sm font-bold text-blue-100">
            <span>
              Question{" "}
              {
                currentIndex +
                1
              }{" "}
              of{" "}
              {
                quiz.questions
                  .length
              }
            </span>

            <span>
              {
                progress
              }
              %
            </span>
          </div>

          <ProgressBar
            value={
              progress
            }
          />
        </div>
      </Card>

      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-blue-600">
          Question{" "}
          {
            currentIndex +
            1
          }
        </p>

        <h2 className="mt-4 text-2xl font-black text-slate-950">
          {
            currentQuestion.question
          }
        </h2>

        <div className="mt-8 space-y-3">
          {currentQuestion.type ===
          "shortAnswer" ? (
            <input
              value={
                answers[
                  currentQuestion.id
                ] ||
                ""
              }
              onChange={(
                event,
              ) =>
                setAnswers(
                  (
                    current,
                  ) => ({
                    ...current,

                    [currentQuestion.id]:
                      event.target.value,
                  }),
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="Type your answer..."
            />
          ) : (
            currentQuestion.options?.map(
              (
                option,
              ) => {
                const selected =
                  answers[
                    currentQuestion.id
                  ] ===
                  option;

                return (
                  <button
                    key={
                      option
                    }
                    type="button"
                    onClick={() =>
                      setAnswers(
                        (
                          current,
                        ) => ({
                          ...current,

                          [currentQuestion.id]:
                            option,
                        }),
                      )
                    }
                    className={`w-full rounded-xl border p-4 text-left font-semibold transition ${
                      selected
                        ? "border-blue-600 bg-blue-50 text-blue-800"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {
                      option
                    }
                  </button>
                );
              },
            )
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            variant="secondary"
            disabled={
              currentIndex ===
                0 ||
              submitting
            }
            onClick={() =>
              setCurrentIndex(
                (
                  index,
                ) =>
                  Math.max(
                    0,
                    index -
                      1,
                  ),
              )
            }
          >
            Previous
          </Button>

          {currentIndex <
          quiz.questions.length -
            1 ? (
            <Button
              disabled={
                submitting
              }
              onClick={() =>
                setCurrentIndex(
                  (
                    index,
                  ) =>
                    Math.min(
                      quiz.questions
                          .length -
                        1,
                      index +
                        1,
                    ),
                )
              }
            >
              Next Question
            </Button>
          ) : (
            <Button
              disabled={
                submitting
              }
              onClick={() =>
                void submitQuiz()
              }
            >
              {submitting
                ? "Submitting..."
                : "Finish Quiz"}
            </Button>
          )}
        </div>
      </Card>

      <Card className="border border-emerald-200 bg-emerald-50">
        <p className="font-black text-emerald-950">
          Answer protection enabled
        </p>

        <p className="mt-1 text-sm leading-6 text-emerald-800">
          Correct answers and explanations are not included in the pre-submission browser payload. Scoring, persistence and XP awarding are performed by the server.
        </p>
      </Card>
    </div>
  );
}
