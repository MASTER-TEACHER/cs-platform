"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Maximize2,
  PauseCircle,
  Save,
  Send,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import {
  useParams,
} from "next/navigation";

import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { getExamAssignmentById } from "@/services/examAssignmentService";
import {
  autosaveStudentExamAnswers,
  getOrCreateStudentExamSubmission,
  recordStudentExamIntegrityIncident,
  startStudentExamIntegritySession,
  submitStudentExam,
  terminateStudentExamForIntegrity,
  updateStudentExamCurrentQuestion,
} from "@/services/studentExamClientService";

import type {
  ExamAssignment,
  ExamIntegrityIncidentType,
  ExamIntegrityPolicy,
  ExamSubmission,
  StudentExamAnswer,
} from "@/types/examAssignment";

type Stage =
  | "ready"
  | "active"
  | "complete";

const FIVE_SECONDS = 5;

function statusLabel(
  submission: ExamSubmission,
): string {
  if (
    submission.status ===
    "marked"
  ) {
    return "Marked";
  }

  if (
    submission.status ===
    "marking"
  ) {
    return "Being marked";
  }

  if (
    submission.status ===
    "submitted"
  ) {
    return submission.integrityTerminated
      ? "Auto-submitted"
      : "Submitted";
  }

  if (
    submission.status ===
    "in_progress"
  ) {
    return "In progress";
  }

  return "Not started";
}

function isLocked(
  submission: ExamSubmission,
): boolean {
  return [
    "submitted",
    "marking",
    "marked",
  ].includes(
    submission.status,
  );
}

function currentPolicy(
  assignment: ExamAssignment,
  submission: ExamSubmission,
): ExamIntegrityPolicy {
  return (
    submission.integrityPolicySnapshot ||
    assignment.integrityPolicy
  );
}

export default function StudentWrittenExamPage() {
  const params =
    useParams<{
      assignmentId: string;
    }>();

  const assignmentId =
    typeof params.assignmentId ===
    "string"
      ? params.assignmentId
      : "";

  const {
    user,
    profile,
    loading:
      authLoading,
  } =
    useAuth();

  const [
    assignment,
    setAssignment,
  ] =
    useState<ExamAssignment | null>(
      null,
    );

  const [
    submission,
    setSubmission,
  ] =
    useState<ExamSubmission | null>(
      null,
    );

  const [
    answers,
    setAnswers,
  ] =
    useState<StudentExamAnswer[]>(
      [],
    );

  const [
    currentIndex,
    setCurrentIndex,
  ] =
    useState(0);

  const [
    stage,
    setStage,
  ] =
    useState<Stage>(
      "ready",
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    paused,
    setPaused,
  ] =
    useState(false);

  const [
    warning,
    setWarning,
  ] =
    useState("");

  const [
    countdown,
    setCountdown,
  ] =
    useState<number | null>(
      null,
    );

  const answersRef =
    useRef<
      StudentExamAnswer[]
    >([]);

  const currentQuestionRef =
    useRef<number | null>(
      null,
    );

  const activeRef =
    useRef(false);

  const terminatingRef =
    useRef(false);

  const submittingRef =
    useRef(false);

  const lastIncidentRef =
    useRef<{
      key: string;
      at: number;
    } | null>(null);

  const fullscreenOutRef =
    useRef(false);

  const pageHiddenRef =
    useRef(false);

  const countdownIntervalRef =
    useRef<number | null>(
      null,
    );

  const countdownTimeoutRef =
    useRef<number | null>(
      null,
    );

  useEffect(() => {
    answersRef.current =
      answers;
  }, [
    answers,
  ]);

  useEffect(() => {
    activeRef.current =
      stage ===
      "active";
  }, [
    stage,
  ]);

  const questions =
    assignment?.questionSetSnapshot
      .questions || [];

  const currentQuestion =
    questions[
      currentIndex
    ] || null;

  useEffect(() => {
    currentQuestionRef.current =
      currentQuestion
        ?.questionNumber ??
      null;
  }, [
    currentQuestion,
  ]);

  useEffect(() => {
    let cancelled =
      false;

    async function load() {
      if (
        authLoading
      ) {
        return;
      }

      if (
        !user?.uid ||
        !assignmentId
      ) {
        if (
          !cancelled
        ) {
          setError(
            "A signed-in student account and valid exam assignment are required.",
          );

          setLoading(
            false,
          );
        }

        return;
      }

      try {
        setLoading(
          true,
        );

        setError(
          "",
        );

        const loadedAssignment =
          await getExamAssignmentById(
            assignmentId,
          );

        if (
          !loadedAssignment
        ) {
          throw new Error(
            "This written exam could not be found.",
          );
        }

        if (
          !loadedAssignment.studentIds.includes(
            user.uid,
          )
        ) {
          throw new Error(
            "This written exam is not assigned to your account.",
          );
        }

        const loadedSubmission =
          await getOrCreateStudentExamSubmission(
            {
              assignment:
                loadedAssignment,
              studentName:
                profile?.name ||
                "Student",
              studentEmail:
                user.email ||
                "",
            },
          );

        if (
          cancelled
        ) {
          return;
        }

        setAssignment(
          loadedAssignment,
        );

        setSubmission(
          loadedSubmission,
        );

        setAnswers(
          loadedSubmission.answers,
        );

        const lastQuestionNumber =
          loadedSubmission.integrityLastQuestionNumber;

        const resumeIndex =
          lastQuestionNumber
            ? Math.max(
                0,
                loadedAssignment.questionSetSnapshot.questions.findIndex(
                  (
                    question,
                  ) =>
                    question.questionNumber ===
                    lastQuestionNumber,
                ),
              )
            : 0;

        setCurrentIndex(
          resumeIndex,
        );

        setStage(
          isLocked(
            loadedSubmission,
          )
            ? "complete"
            : "ready",
        );
      } catch (
        caughtError
      ) {
        console.error(
          "Unable to load written exam:",
          caughtError,
        );

        if (
          !cancelled
        ) {
          setError(
            caughtError instanceof
              Error
              ? caughtError.message
              : "The written exam could not be loaded.",
          );
        }
      } finally {
        if (
          !cancelled
        ) {
          setLoading(
            false,
          );
        }
      }
    }

    void load();

    return () => {
      cancelled =
        true;
    };
  }, [
    assignmentId,
    authLoading,
    profile?.name,
    user?.email,
    user?.uid,
  ]);

  const policy =
    useMemo(
      () =>
        assignment &&
        submission
          ? currentPolicy(
              assignment,
              submission,
            )
          : null,
      [
        assignment,
        submission,
      ],
    );

  const clearFullscreenCountdown =
    useCallback(
      () => {
        if (
          countdownIntervalRef.current !==
          null
        ) {
          window.clearInterval(
            countdownIntervalRef.current,
          );

          countdownIntervalRef.current =
            null;
        }

        if (
          countdownTimeoutRef.current !==
          null
        ) {
          window.clearTimeout(
            countdownTimeoutRef.current,
          );

          countdownTimeoutRef.current =
            null;
        }

        setCountdown(
          null,
        );
      },
      [],
    );

  const recordIncident =
    useCallback(
      async (
        type: ExamIntegrityIncidentType,
        detail: string,
      ) => {
        if (
          !assignmentId ||
          !activeRef.current
        ) {
          return;
        }

        const questionNumber =
          currentQuestionRef.current;

        const key = [
          type,
          questionNumber ?? "none",
          detail,
        ].join("|");

        const now = Date.now();
        const previous =
          lastIncidentRef.current;

        /*
         * Browser fullscreen/visibility APIs can occasionally emit the
         * same event more than once during a single transition. Suppress
         * only exact duplicates inside a very small window so genuine
         * later incidents are still preserved.
         */
        if (
          previous?.key === key &&
          now - previous.at < 750
        ) {
          return;
        }

        lastIncidentRef.current = {
          key,
          at: now,
        };

        try {
          await recordStudentExamIntegrityIncident(
            {
              assignmentId,
              type,
              questionNumber,
              detail,
            },
          );
        } catch (
          caughtError
        ) {
          /*
           * A record request may legitimately lose a race with
           * a final submit/termination. Do not destabilise the
           * candidate UI after the attempt has already locked.
           */
          if (
            !terminatingRef.current &&
            !submittingRef.current
          ) {
            console.error(
              "Unable to record exam integrity incident:",
              caughtError,
            );
          }
        }
      },
      [
        assignmentId,
      ],
    );

  const leaveFullscreen =
    useCallback(
      async () => {
        if (
          document.fullscreenElement
        ) {
          try {
            await document.exitFullscreen();
          } catch {
            // Browser may already be leaving fullscreen.
          }
        }
      },
      [],
    );

  const terminateNow =
    useCallback(
      async (
        reason: string,
        alreadyClaimed = false,
      ) => {
        if (
          !assignmentId ||
          (
            terminatingRef.current &&
            !alreadyClaimed
          ) ||
          submittingRef.current ||
          !activeRef.current
        ) {
          return;
        }

        terminatingRef.current =
          true;

        setSubmitting(
          true,
        );

        setWarning(
          reason,
        );

        clearFullscreenCountdown();

        try {
          await terminateStudentExamForIntegrity(
            {
              assignmentId,
              answers:
                answersRef.current,
              questionNumber:
                currentQuestionRef.current,
              reason,
            },
          );

          /*
           * The termination service writes the authoritative integrity
           * incident list in Firestore. Re-read the locked submission before
           * rendering the completion screen so the learner sees the same
           * incident count as the teacher dashboard.
           */
          const refreshedSubmission =
            assignment
              ? await getOrCreateStudentExamSubmission(
                  {
                    assignment,
                    studentName:
                      profile?.name ||
                      "Student",
                    studentEmail:
                      user?.email ||
                      "",
                  },
                )
              : null;

          activeRef.current =
            false;

          if (refreshedSubmission) {
            setSubmission(
              refreshedSubmission,
            );

            setAnswers(
              refreshedSubmission.answers,
            );

            answersRef.current =
              refreshedSubmission.answers;
          } else {
            setSubmission(
              (
                current,
              ) =>
                current
                  ? {
                      ...current,
                      status:
                        "submitted",
                      answers:
                        answersRef.current,
                      integrityTerminated:
                        true,
                      integrityTerminationReason:
                        reason,
                      submittedAt:
                        new Date(),
                    }
                  : current,
            );
          }

          setStage(
            "complete",
          );

          await leaveFullscreen();
        } catch (
          caughtError
        ) {
          console.error(
            "Automatic exam termination failed:",
            caughtError,
          );

          setError(
            "CS Master could not complete the automatic exam submission. Keep this page open and tell your teacher immediately.",
          );

          terminatingRef.current =
            false;
        } finally {
          setSubmitting(
            false,
          );
        }
      },
      [
  assignment,
  assignmentId,
  clearFullscreenCountdown,
  leaveFullscreen,
  profile,
  user,
],
    );

  const beginFullscreenCountdown =
    useCallback(
      () => {
        clearFullscreenCountdown();

        const duration =
          policy?.fullscreenExitCountdownSeconds ||
          FIVE_SECONDS;

        const startedAt =
          Date.now();

        setCountdown(
          duration,
        );

        countdownIntervalRef.current =
          window.setInterval(
            () => {
              const elapsed =
                Math.floor(
                  (
                    Date.now() -
                    startedAt
                  ) /
                    1000,
                );

              const remaining =
                Math.max(
                  0,
                  duration -
                    elapsed,
                );

              setCountdown(
                remaining,
              );
            },
            200,
          );

        countdownTimeoutRef.current =
          window.setTimeout(
            () => {
              clearFullscreenCountdown();

              void terminateNow(
                "The exam was automatically submitted because fullscreen was not restored within 5 seconds.",
              );
            },
            duration *
              1000,
          );
      },
      [
        clearFullscreenCountdown,
        policy?.fullscreenExitCountdownSeconds,
        terminateNow,
      ],
    );

  useEffect(() => {
    if (
      stage !==
        "active" ||
      !policy?.enabled
    ) {
      return;
    }

    /*
     * Capture the already-validated policy for the event-handler
     * closures below. TypeScript cannot preserve optional-value
     * narrowing across nested callbacks, even though this effect
     * returns early when policy is null/disabled.
     */
    const activePolicy = policy;

    function handleFullscreenChange() {
      if (
        !activeRef.current ||
        terminatingRef.current ||
        submittingRef.current ||
        !activePolicy.fullscreenRequired
      ) {
        return;
      }

      const isFullscreen =
        Boolean(
          document.fullscreenElement,
        );

      if (
        !isFullscreen &&
        !fullscreenOutRef.current
      ) {
        fullscreenOutRef.current =
          true;

        setWarning(
          "Fullscreen was exited. Return now to keep the exam active.",
        );

        void recordIncident(
          "fullscreen_exit",
          "The learner exited fullscreen during the monitored exam.",
        );

        beginFullscreenCountdown();

        return;
      }

      if (
        isFullscreen &&
        fullscreenOutRef.current
      ) {
        fullscreenOutRef.current =
          false;

        clearFullscreenCountdown();

        setWarning(
          "",
        );

        void recordIncident(
          "fullscreen_restored",
          "The learner returned to fullscreen before the termination countdown expired.",
        );
      }
    }

    function handleVisibilityChange() {
      if (
        !activeRef.current ||
        terminatingRef.current ||
        submittingRef.current ||
        !activePolicy.monitorPageVisibility
      ) {
        return;
      }

      if (
        document.visibilityState ===
        "hidden"
      ) {
        if (
          pageHiddenRef.current
        ) {
          return;
        }

        pageHiddenRef.current =
          true;

        const hiddenDetail =
          "The exam page became hidden during the monitored attempt.";

        /*
         * Auto-submit claims finalisation immediately. This prevents a
         * near-simultaneous fullscreenchange event from starting its own
         * countdown/termination path while page visibility termination
         * is already in progress.
         *
         * The terminate request already contains the latest answers, so
         * do not launch a separate autosave request in this branch.
         */
        if (
          activePolicy.visibilityAction ===
          "auto_submit"
        ) {
          const reason =
            "The exam was automatically submitted because the exam page became hidden and the teacher policy was set to auto-submit.";

          terminatingRef.current =
            true;

          clearFullscreenCountdown();

          setWarning(
            reason,
          );

          void (async () => {
            await recordIncident(
              "page_hidden",
              hiddenDetail,
            );

            await terminateNow(
              reason,
              true,
            );
          })();

          return;
        }

        /*
         * Warn/pause policies keep the attempt live, so persist the
         * latest answer state before recording the visibility incident.
         */
        void autosaveStudentExamAnswers(
          {
            assignmentId,
            answers:
              answersRef.current,
          },
        ).catch(
          () => undefined,
        );

        void (async () => {
          await recordIncident(
            "page_hidden",
            hiddenDetail,
          );

          if (
            activePolicy.visibilityAction ===
            "pause"
          ) {
            setPaused(
              true,
            );

            setWarning(
              "The exam was paused because the exam page became hidden. Resume is required.",
            );

            return;
          }

          setWarning(
            "A page-visibility warning was recorded. Stay on the exam page.",
          );
        })();

        return;
      }

      if (
        pageHiddenRef.current
      ) {
        pageHiddenRef.current =
          false;

        void recordIncident(
          "page_visible",
          "The learner returned to the visible exam page.",
        );
      }
    }

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange,
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange,
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [
    assignmentId,
    beginFullscreenCountdown,
    clearFullscreenCountdown,
    policy,
    recordIncident,
    stage,
    terminateNow,
  ]);

  useEffect(() => {
    if (
      stage !==
        "active" ||
      paused ||
      !assignmentId ||
      terminatingRef.current ||
      submittingRef.current
    ) {
      return;
    }

    const timer =
      window.setTimeout(
        () => {
          if (
            !activeRef.current ||
            terminatingRef.current ||
            submittingRef.current
          ) {
            return;
          }

          setSaving(
            true,
          );

          void autosaveStudentExamAnswers(
            {
              assignmentId,
              answers,
            },
          )
            .catch(
              (
                caughtError,
              ) => {
                console.error(
                  "Exam autosave failed:",
                  caughtError,
                );
              },
            )
            .finally(
              () => {
                setSaving(
                  false,
                );
              },
            );
        },
        800,
      );

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [
    answers,
    assignmentId,
    paused,
    stage,
  ]);

  useEffect(() => {
    if (
      stage !==
        "active" ||
      !currentQuestion ||
      !assignmentId
    ) {
      return;
    }

    void updateStudentExamCurrentQuestion(
      {
        assignmentId,
        questionNumber:
          currentQuestion.questionNumber,
      },
    ).catch(
      (
        caughtError,
      ) => {
        console.error(
          "Unable to update current exam question:",
          caughtError,
        );
      },
    );
  }, [
    assignmentId,
    currentQuestion,
    stage,
  ]);

  useEffect(() => {
    return () => {
      clearFullscreenCountdown();
    };
  }, [
    clearFullscreenCountdown,
  ]);

  async function requestExamFullscreen() {
    if (
      document.fullscreenElement
    ) {
      return;
    }

    if (
      !document.documentElement.requestFullscreen
    ) {
      throw new Error(
        "This browser does not support the fullscreen Exam Mode requirement.",
      );
    }

    await document.documentElement.requestFullscreen();
  }

  async function startExam() {
    if (
      !assignment ||
      !submission ||
      !policy ||
      !assignmentId
    ) {
      return;
    }

    setError(
      "",
    );

    setWarning(
      "",
    );

    try {
      /*
       * requestFullscreen must stay inside the student's click
       * gesture. Do it before the network start call.
       */
      if (
        policy.enabled &&
        policy.fullscreenRequired
      ) {
        await requestExamFullscreen();
      }

      await startStudentExamIntegritySession(
        {
          assignmentId,
        },
      );

      fullscreenOutRef.current =
        false;

      pageHiddenRef.current =
        false;

      terminatingRef.current =
        false;

      submittingRef.current =
        false;

      lastIncidentRef.current =
        null;

      setPaused(
        false,
      );

      setSubmission(
        {
          ...submission,
          status:
            "in_progress",
          integrityPolicySnapshot:
            policy,
          integritySessionStartedAt:
            submission.integritySessionStartedAt ||
            new Date(),
          startedAt:
            submission.startedAt ||
            new Date(),
        },
      );

      setStage(
        "active",
      );
    } catch (
      caughtError
    ) {
      await leaveFullscreen();

      setError(
        caughtError instanceof
          Error
          ? caughtError.message
          : "Exam Mode could not be started.",
      );
    }
  }

  function updateAnswer(
    response: string,
  ) {
    if (
      !currentQuestion
    ) {
      return;
    }

    const next =
      answersRef.current.map(
        (
          answer,
        ) =>
          answer.questionId ===
          currentQuestion.id
            ? {
                ...answer,
                response,
              }
            : answer,
      );

    answersRef.current =
      next;

    setAnswers(
      next,
    );
  }

  async function saveNow() {
    if (
      !assignmentId ||
      stage !==
        "active"
    ) {
      return;
    }

    try {
      setSaving(
        true,
      );

      await autosaveStudentExamAnswers(
        {
          assignmentId,
          answers:
            answersRef.current,
        },
      );

      setWarning(
        "Responses saved.",
      );

      window.setTimeout(
        () => {
          setWarning(
            (
              current,
            ) =>
              current ===
              "Responses saved."
                ? ""
                : current,
          );
        },
        1200,
      );
    } catch (
      caughtError
    ) {
      setError(
        caughtError instanceof
          Error
          ? caughtError.message
          : "Responses could not be saved.",
      );
    } finally {
      setSaving(
        false,
      );
    }
  }

  async function submitNormally() {
    if (
      !assignmentId ||
      !assignment ||
      submittingRef.current ||
      terminatingRef.current ||
      stage !== "active"
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Submit this written exam now? You will not be able to change your answers afterwards.",
      );

    if (!confirmed) {
      return;
    }

    submittingRef.current = true;

    setSubmitting(
      true,
    );

    setError(
      "",
    );

    clearFullscreenCountdown();

    try {
      /*
       * Persist the candidate's latest answer state before locking
       * the submission.
       */
      await autosaveStudentExamAnswers(
        {
          assignmentId,
          answers:
            answersRef.current,
        },
      );

      /*
       * The server is authoritative for submission state and
       * integrity evidence.
       */
      await submitStudentExam(
        {
          assignmentId,
        },
      );

      /*
       * Stop monitoring before rendering the completion state.
       * submittingRef already prevents fullscreen/visibility
       * handlers from recording new incidents during finalisation.
       */
      activeRef.current =
        false;

      /*
       * Re-read the locked server submission.
       *
       * Integrity incidents are written independently while the
       * monitored attempt is active. The previous implementation
       * only changed the local status to "submitted", leaving the
       * learner completion screen with an old integrityIncidents
       * array even though the teacher dashboard correctly saw the
       * authoritative Firestore events.
       *
       * This mirrors the already-hardened automatic termination
       * flow so both normal and integrity-triggered submissions
       * display the same server evidence.
       */
      const refreshedSubmission =
        await getOrCreateStudentExamSubmission(
          {
            assignment,
            studentName:
              profile?.name ||
              "Student",
            studentEmail:
              user?.email ||
              "",
          },
        );

      setSubmission(
        refreshedSubmission,
      );

      setAnswers(
        refreshedSubmission.answers,
      );

      answersRef.current =
        refreshedSubmission.answers;

      setStage(
        "complete",
      );

      await leaveFullscreen();
    } catch (
      caughtError
    ) {
      /*
       * If finalisation itself failed, allow another submission
       * attempt. A successfully locked server attempt remains
       * idempotent, so retrying is safe.
       */
      submittingRef.current =
        false;

      setError(
        caughtError instanceof
          Error
          ? caughtError.message
          : "The exam could not be submitted.",
      );
    } finally {
      setSubmitting(
        false,
      );
    }
  }
  async function returnToFullscreen() {
    try {
      await requestExamFullscreen();
    } catch (
      caughtError
    ) {
      setError(
        caughtError instanceof
          Error
          ? caughtError.message
          : "Fullscreen could not be restored.",
      );
    }
  }

  async function resumeAfterPause() {
    if (
      policy?.enabled &&
      policy.fullscreenRequired &&
      !document.fullscreenElement
    ) {
      try {
        await requestExamFullscreen();
      } catch (
        caughtError
      ) {
        setError(
          caughtError instanceof
            Error
            ? caughtError.message
            : "Fullscreen must be restored before the exam can resume.",
        );

        return;
      }
    }

    setPaused(
      false,
    );

    setWarning(
      "",
    );
  }

  if (
    authLoading ||
    loading
  ) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <Skeleton className="h-48 rounded-3xl" />
        <Skeleton className="h-[520px] rounded-3xl" />
      </div>
    );
  }

  if (
    error &&
    (
      !assignment ||
      !submission
    )
  ) {
    return (
      <main className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
          <AlertTriangle className="h-10 w-10 text-red-600" />

          <h1 className="mt-4 text-3xl font-black text-slate-950">
            Written exam unavailable
          </h1>

          <p className="mt-3 text-slate-600">
            {error}
          </p>

          <Link
            href="/exam"
            className="mt-6 inline-flex rounded-xl bg-indigo-700 px-5 py-3 font-black text-white"
          >
            Return to Exam Mode
          </Link>
        </div>
      </main>
    );
  }

  if (
    !assignment ||
    !submission ||
    !policy
  ) {
    return null;
  }

  if (
    stage ===
    "complete"
  ) {
    return (
      <main className="min-h-screen bg-slate-100 p-5 sm:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <section className={`rounded-3xl p-8 text-white shadow-xl ${
            submission.integrityTerminated
              ? "bg-red-950"
              : "bg-emerald-800"
          }`}>
            {submission.integrityTerminated ? (
              <ShieldAlert className="h-10 w-10" />
            ) : (
              <CheckCircle2 className="h-10 w-10" />
            )}

            <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-white/70">
              {statusLabel(
                submission,
              )}
            </p>

            <h1 className="mt-2 text-3xl font-black">
              {assignment.title}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">
              {submission.integrityTerminated
                ? submission.integrityTerminationReason ||
                  "The attempt was submitted automatically under the exam integrity policy."
                : submission.status === "marked"
                  ? "Your teacher has marked this written assessment."
                  : "Your written assessment has been submitted and is locked for marking."}
            </p>
          </section>

          {submission.status ===
            "marked" && (
            <section className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                  Marks
                </p>

                <p className="mt-2 text-3xl font-black text-slate-950">
                  {submission.totalAwardedMarks}/
                  {submission.totalAvailableMarks}
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                  Percentage
                </p>

                <p className="mt-2 text-3xl font-black text-slate-950">
                  {submission.percentage}%
                </p>
              </div>
            </section>
          )}

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="font-black text-slate-950">
              Integrity monitoring
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {submission.integrityIncidents.length} integrity event
              {submission.integrityIncidents.length === 1 ? "" : "s"} recorded.
              These events are contextual evidence for teacher review and do
              not by themselves prove misconduct.
            </p>
          </section>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/exam"
              className="rounded-xl bg-indigo-700 px-5 py-3 font-black text-white"
            >
              Back to Exam Mode
            </Link>

            <Link
              href="/assignments"
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-black text-slate-800"
            >
              All assignments
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (
    stage ===
    "ready"
  ) {
    return (
      <main className="min-h-screen bg-slate-100 p-5 sm:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <Link
            href="/exam"
            className="inline-flex items-center gap-2 text-sm font-black text-indigo-700"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Exam Mode
          </Link>

          <section className="overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl">
            <div className="p-7 sm:p-9">
              <div className="flex items-center gap-2 text-indigo-200">
                <ShieldCheck className="h-5 w-5" />

                <p className="text-xs font-black uppercase tracking-[0.18em]">
                  Monitored written assessment
                </p>
              </div>

              <h1 className="mt-3 text-4xl font-black">
                {assignment.title}
              </h1>

              <p className="mt-3 text-white/70">
                {assignment.className} Â· {assignment.teacherName}
              </p>
            </div>

            <div className="border-t border-white/10 bg-white/5 p-7 sm:p-9">
              <p className="max-w-3xl text-sm leading-6 text-white/75">
                CS Master Exam Mode records configured fullscreen and
                page-visibility events for teacher review. It is integrity
                monitoring, not a guaranteed lockdown browser.
              </p>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Questions
              </p>

              <p className="mt-2 text-3xl font-black">
                {assignment.questionCount}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Total marks
              </p>

              <p className="mt-2 text-3xl font-black">
                {assignment.totalMarks}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Attempt
              </p>

              <p className="mt-2 text-lg font-black">
                {submission.status === "in_progress"
                  ? "Resume"
                  : "New attempt"}
              </p>
            </div>
          </section>

          {assignment.instructions && (
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="font-black text-slate-950">
                Teacher instructions
              </p>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                {assignment.instructions}
              </p>
            </section>
          )}

          {policy.enabled && (
            <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
              <p className="font-black text-amber-950">
                Integrity policy for this attempt
              </p>

              <div className="mt-3 space-y-2 text-sm leading-6 text-amber-900">
                <p>
                  Fullscreen:{" "}
                  <b>
                    {policy.fullscreenRequired
                      ? "Required"
                      : "Not required"}
                  </b>
                </p>

                {policy.fullscreenRequired && (
                  <p>
                    Leaving fullscreen starts a visible 5-second countdown.
                    Failure to return before it expires automatically
                    terminates and submits the exam.
                  </p>
                )}

                <p>
                  Page visibility monitoring:{" "}
                  <b>
                    {policy.monitorPageVisibility
                      ? "Enabled"
                      : "Disabled"}
                  </b>
                </p>

                {policy.monitorPageVisibility && (
                  <p>
                    Hidden-page action:{" "}
                    <b className="capitalize">
                      {policy.visibilityAction.replace("_", " ")}
                    </b>
                  </p>
                )}
              </div>
            </section>
          )}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-700">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              void startExam()
            }
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-indigo-700 px-6 py-3 font-black text-white hover:bg-indigo-800"
          >
            {policy.enabled &&
            policy.fullscreenRequired ? (
              <Maximize2 className="h-5 w-5" />
            ) : (
              <FileText className="h-5 w-5" />
            )}

            {submission.status === "in_progress"
              ? "Resume Exam Mode"
              : "Enter Exam Mode"}
          </button>
        </div>
      </main>
    );
  }

  const response =
    answers.find(
      (
        answer,
      ) =>
        answer.questionId ===
        currentQuestion?.id,
    )?.response ||
    "";

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-slate-950 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-indigo-300">
              CS Master Exam Mode
            </p>

            <h1 className="mt-1 font-black">
              {assignment.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-black">
            <span className="rounded-full bg-white/10 px-3 py-2">
              Question {currentIndex + 1}/{questions.length}
            </span>

            <span className="rounded-full bg-white/10 px-3 py-2">
              {assignment.totalMarks} marks
            </span>

            <span className="rounded-full bg-white/10 px-3 py-2">
              {saving ? "Saving..." : "Autosave on"}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 p-4 sm:p-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="rounded-3xl bg-white p-4 shadow-sm">
          <p className="px-2 text-xs font-black uppercase tracking-wide text-slate-400">
            Questions
          </p>

          <div className="mt-3 grid grid-cols-5 gap-2 lg:grid-cols-3">
            {questions.map(
              (
                question,
                index,
              ) => {
                const answered =
                  Boolean(
                    answers.find(
                      (
                        answer,
                      ) =>
                        answer.questionId ===
                        question.id,
                    )?.response.trim(),
                  );

                return (
                  <button
                    type="button"
                    key={
                      question.id
                    }
                    onClick={() =>
                      setCurrentIndex(
                        index,
                      )
                    }
                    disabled={
                      paused ||
                      submitting
                    }
                    className={`rounded-xl px-3 py-2 text-sm font-black ${
                      index === currentIndex
                        ? "bg-indigo-700 text-white"
                        : answered
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-700"
                    } disabled:opacity-50`}
                  >
                    {question.questionNumber}
                  </button>
                );
              },
            )}
          </div>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
            <ShieldCheck className="mb-2 h-5 w-5 text-indigo-600" />

            Integrity monitoring is active according to the policy shown before
            entry. Events are recorded for teacher review.
          </div>
        </aside>

        <section className="space-y-5">
          {warning && (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 font-bold text-amber-900">
              {warning}
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-700">
              {error}
            </div>
          )}

          {currentQuestion && (
            <article className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-indigo-600">
                    Question {currentQuestion.questionNumber}
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-400">
                    {currentQuestion.assessmentObjective} Â·{" "}
                    {currentQuestion.commandWord}
                  </p>
                </div>

                <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-black text-indigo-700">
                  {currentQuestion.marks} mark
                  {currentQuestion.marks === 1 ? "" : "s"}
                </span>
              </div>

              {currentQuestion.context && (
                <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                  {currentQuestion.context}
                </div>
              )}

              <p className="mt-6 whitespace-pre-wrap text-lg font-bold leading-8 text-slate-950">
                {currentQuestion.question}
              </p>

              <label className="mt-7 block">
                <span className="text-sm font-black text-slate-700">
                  Your answer
                </span>

                <textarea
                  rows={10}
                  value={response}
                  disabled={
                    paused ||
                    submitting
                  }
                  onChange={(
                    event,
                  ) =>
                    updateAnswer(
                      event.target.value,
                    )
                  }
                  maxLength={12000}
                  className="mt-3 w-full resize-y rounded-2xl border border-slate-200 bg-white p-4 leading-7 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-100"
                  placeholder="Write your answer here..."
                />
              </label>
            </article>
          )}

          <div className="flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <button
                type="button"
                disabled={
                  currentIndex === 0 ||
                  paused ||
                  submitting
                }
                onClick={() =>
                  setCurrentIndex(
                    (
                      current,
                    ) =>
                      Math.max(
                        0,
                        current - 1,
                      ),
                  )
                }
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 font-black text-slate-700 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <button
                type="button"
                disabled={
                  currentIndex >=
                    questions.length -
                      1 ||
                  paused ||
                  submitting
                }
                onClick={() =>
                  setCurrentIndex(
                    (
                      current,
                    ) =>
                      Math.min(
                        questions.length -
                          1,
                        current +
                          1,
                      ),
                  )
                }
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 font-black text-slate-700 disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  void saveNow()
                }
                disabled={
                  saving ||
                  paused ||
                  submitting
                }
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 font-black text-slate-700 disabled:opacity-40"
              >
                <Save className="h-4 w-4" />
                Save
              </button>

              <button
                type="button"
                onClick={() =>
                  void submitNormally()
                }
                disabled={
                  paused ||
                  submitting
                }
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-700 px-5 font-black text-white disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {submitting
                  ? "Submitting..."
                  : "Submit exam"}
              </button>
            </div>
          </div>
        </section>
      </div>

      {countdown !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/85 p-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-red-300 bg-white p-8 text-center shadow-2xl">
            <ShieldAlert className="mx-auto h-12 w-12 text-red-600" />

            <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-red-600">
              Fullscreen exited
            </p>

            <h2 className="mt-2 text-4xl font-black text-slate-950">
              {countdown}
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Return to fullscreen before the countdown expires. Otherwise this
              exam will be terminated and submitted automatically.
            </p>

            <button
              type="button"
              onClick={() =>
                void returnToFullscreen()
              }
              className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-red-600 px-6 font-black text-white"
            >
              <Maximize2 className="h-5 w-5" />
              Return to fullscreen
            </button>
          </div>
        </div>
      )}

      {paused && (
        <div className="fixed inset-0 z-[190] flex items-center justify-center bg-slate-950/80 p-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-2xl">
            <PauseCircle className="mx-auto h-12 w-12 text-amber-600" />

            <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-amber-600">
              Exam paused
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Return to the monitored exam
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              The teacher policy requires an explicit resume after the exam
              page becomes hidden.
            </p>

            <button
              type="button"
              onClick={() =>
                void resumeAfterPause()
              }
              className="mt-6 rounded-xl bg-amber-600 px-6 py-3 font-black text-white"
            >
              Resume exam
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
