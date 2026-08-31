"use client";

import Link from "next/link";
import {
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import {
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { getExamAssignmentById } from "@/services/examAssignmentService";
import {
  autosaveExamAnswers,
  getOrCreateExamSubmission,
  recordExamIntegrityIncident,
  startExamIntegritySession,
  submitExamSubmission,
  terminateExamForIntegrity,
  updateExamCurrentQuestion,
} from "@/services/examSubmissionService";
import type {
  ExamAssignment,
  ExamSubmission,
  StudentExamAnswer,
} from "@/types/examAssignment";

function toStringList(
  value: unknown,
): string[] {
  if (typeof value === "string") {
    return value.trim()
      ? [value.trim()]
      : [];
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (
        typeof item === "string"
      ) {
        return item.trim();
      }

      if (
        item &&
        typeof item === "object"
      ) {
        const candidate =
          item as Record<
            string,
            unknown
          >;

        const text =
          candidate.description ??
          candidate.text ??
          candidate.point;

        return typeof text ===
          "string"
          ? text.trim()
          : "";
      }

      return "";
    })
    .filter(Boolean);
}

function getQuestionExtras(
  question: unknown,
) {
  const candidate =
    question as Record<
      string,
      unknown
    >;

  return {
    examinerGuidance:
      toStringList(
        candidate.examinerGuidance,
      ),

    misconceptions:
      toStringList(
        candidate.misconceptions,
      ),
  };
}

export default function StudentExamPlayerPage() {
  const params = useParams<{
    assignmentId: string;
  }>();

  const router = useRouter();

  const { user } = useAuth();

  const examRootRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const saveTimer =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  const countdownTimer =
    useRef<ReturnType<
      typeof setInterval
    > | null>(null);

  const finishingRef =
    useRef(false);

  const fullscreenExitActiveRef =
    useRef(false);

  const [assignment, setAssignment] =
    useState<ExamAssignment | null>(
      null,
    );

  const [submission, setSubmission] =
    useState<ExamSubmission | null>(
      null,
    );

  const [answers, setAnswers] =
    useState<StudentExamAnswer[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [
    integrityStarted,
    setIntegrityStarted,
  ] = useState(false);

  const [
    activeQuestionNumber,
    setActiveQuestionNumber,
  ] = useState<number | null>(
    null,
  );

  const [
    fullscreenCountdown,
    setFullscreenCountdown,
  ] = useState<number | null>(
    null,
  );

  const [
    integrityPaused,
    setIntegrityPaused,
  ] = useState(false);

  const [
    integrityWarning,
    setIntegrityWarning,
  ] = useState("");

  const locked = submission
    ? [
        "submitted",
        "marking",
        "marked",
      ].includes(
        submission.status,
      )
    : false;

  useEffect(() => {
    async function load() {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const loadedAssignment =
          await getExamAssignmentById(
            params.assignmentId,
          );

        if (
          !loadedAssignment ||
          !loadedAssignment.studentIds.includes(
            user.uid,
          )
        ) {
          return;
        }

        const loadedSubmission =
          await getOrCreateExamSubmission(
            {
              assignment:
                loadedAssignment,

              studentId:
                user.uid,

              studentName:
                user.displayName ||
                "Student",

              studentEmail:
                user.email || "",
            },
          );

        setAssignment(
          loadedAssignment,
        );

        setSubmission(
          loadedSubmission,
        );

        setAnswers(
          loadedSubmission.answers,
        );

        setActiveQuestionNumber(
          loadedSubmission.integrityLastQuestionNumber,
        );
      } catch (error) {
        console.error(
          "Unable to load written assessment:",
          error,
        );

        toast.error(
          "The written assessment could not be loaded.",
        );
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [
    params.assignmentId,
    user?.uid,
    user?.displayName,
    user?.email,
  ]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        clearTimeout(
          saveTimer.current,
        );
      }

      if (
        countdownTimer.current
      ) {
        clearInterval(
          countdownTimer.current,
        );
      }
    };
  }, []);

  const answeredCount =
    useMemo(
      () =>
        answers.filter(
          (answer) =>
            answer.response.trim()
              .length > 0,
        ).length,
      [answers],
    );

  async function logIncident(
    type:
      | "fullscreen_exit"
      | "fullscreen_restored"
      | "page_hidden"
      | "page_visible",
    detail: string,
  ) {
    if (
      !assignment ||
      !user?.uid
    ) {
      return;
    }

    try {
      await recordExamIntegrityIncident(
        {
          assignmentId:
            assignment.id,

          studentId: user.uid,

          type,

          questionNumber:
            activeQuestionNumber,

          detail,
        },
      );
    } catch (error) {
      /*
       * The exam should remain usable even if an incident log write fails.
       * Autosave/submission errors are handled separately.
       */
      console.error(
        "Unable to record integrity incident:",
        error,
      );
    }
  }

  async function terminateForIntegrity(
    reason: string,
  ) {
    if (
      !assignment ||
      !user?.uid ||
      finishingRef.current ||
      locked
    ) {
      return;
    }

    finishingRef.current = true;

    if (
      countdownTimer.current
    ) {
      clearInterval(
        countdownTimer.current,
      );
      countdownTimer.current =
        null;
    }

    setFullscreenCountdown(
      null,
    );

    setSaving(true);

    try {
      await terminateExamForIntegrity(
        {
          assignmentId:
            assignment.id,

          studentId:
            user.uid,

          answers,

          questionNumber:
            activeQuestionNumber,

          reason,
        },
      );

      setSubmission(
        (current) =>
          current
            ? {
                ...current,
                status:
                  "submitted",

                answers,

                integrityTerminated:
                  true,

                integrityTerminationReason:
                  reason,
              }
            : current,
      );

      if (
        document.fullscreenElement
      ) {
        await document
          .exitFullscreen()
          .catch(() => undefined);
      }

      toast.error(
        "Exam terminated and submitted because the integrity rule was triggered.",
      );
    } catch (error) {
      console.error(
        "Integrity termination failed:",
        error,
      );

      finishingRef.current =
        false;

      toast.error(
        "The exam could not be submitted automatically. Please contact your teacher.",
      );
    } finally {
      setSaving(false);
    }
  }

  function beginFullscreenCountdown() {
    if (
      fullscreenExitActiveRef.current ||
      !assignment ||
      locked ||
      finishingRef.current
    ) {
      return;
    }

    fullscreenExitActiveRef.current =
      true;

    const seconds =
      assignment.integrityPolicy
        .fullscreenExitCountdownSeconds;

    setFullscreenCountdown(
      seconds,
    );

    void logIncident(
      "fullscreen_exit",
      `Fullscreen was exited. A ${seconds}-second return countdown started.`,
    );

    let remaining = seconds;

    countdownTimer.current =
      setInterval(() => {
        remaining -= 1;

        setFullscreenCountdown(
          Math.max(
            remaining,
            0,
          ),
        );

        if (remaining <= 0) {
          if (
            countdownTimer.current
          ) {
            clearInterval(
              countdownTimer.current,
            );
            countdownTimer.current =
              null;
          }

          void terminateForIntegrity(
            "The learner exited fullscreen and did not return within 5 seconds.",
          );
        }
      }, 1000);
  }

  function resolveFullscreenExit() {
    if (
      !fullscreenExitActiveRef.current
    ) {
      return;
    }

    fullscreenExitActiveRef.current =
      false;

    if (
      countdownTimer.current
    ) {
      clearInterval(
        countdownTimer.current,
      );

      countdownTimer.current =
        null;
    }

    setFullscreenCountdown(
      null,
    );

    void logIncident(
      "fullscreen_restored",
      "Fullscreen was restored before the five-second termination countdown expired.",
    );
  }

  const handleExamFullscreenChange = useEffectEvent(() => {
    if (
      finishingRef.current
    ) {
      return;
    }

    if (
      document.fullscreenElement ===
      examRootRef.current
    ) {
      resolveFullscreenExit();
    } else {
      beginFullscreenCountdown();
    }
  });

  const handleExamVisibilityChange = useEffectEvent(() => {
    if (
      finishingRef.current ||
      !assignment
        ?.integrityPolicy
        .monitorPageVisibility
    ) {
      return;
    }

    if (
      document.visibilityState ===
      "hidden"
    ) {
      void logIncident(
        "page_hidden",
        "The exam page became hidden.",
      );

      const action =
        assignment
          .integrityPolicy
          .visibilityAction;

      if (
        action ===
        "auto_submit"
      ) {
        void terminateForIntegrity(
          "The exam page became hidden and the teacher configured immediate automatic submission.",
        );

        return;
      }

      if (action === "pause") {
        setIntegrityPaused(
          true,
        );
      } else {
        setIntegrityWarning(
          "The exam page was hidden. This incident has been recorded.",
        );
      }
    } else {
      void logIncident(
        "page_visible",
        "The exam page became visible again.",
      );
    }
  });

  useEffect(() => {
    if (
      !assignment ||
      !user?.uid ||
      locked ||
      !integrityStarted ||
      !assignment.integrityPolicy
        .enabled
    ) {
      return;
    }

    function onFullscreenChange() {
      handleExamFullscreenChange();
    }

    function onVisibilityChange() {
      handleExamVisibilityChange();
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
    assignment,
    integrityStarted,
    locked,
    user?.uid,
  ]);

  async function enterExamMode() {
    if (
      !assignment ||
      !user?.uid ||
      !examRootRef.current
    ) {
      return;
    }

    if (
      !assignment.integrityPolicy
        .enabled
    ) {
      setIntegrityStarted(
        true,
      );
      return;
    }

    if (
      !document.fullscreenEnabled
    ) {
      toast.error(
        "Fullscreen is not available in this browser. Ask your teacher for support.",
      );
      return;
    }

    try {
      await examRootRef.current.requestFullscreen();

      await startExamIntegritySession(
        {
          assignment,
          studentId:
            user.uid,
        },
      );

      setIntegrityStarted(
        true,
      );

      setIntegrityPaused(
        false,
      );

      setIntegrityWarning(
        "",
      );

      finishingRef.current =
        false;

      toast.success(
        "Exam Mode started.",
      );
    } catch (error) {
      console.error(
        "Unable to enter Exam Mode:",
        error,
      );

      toast.error(
        "Fullscreen Exam Mode could not be started.",
      );
    }
  }

  async function resumePausedExam() {
    if (
      !examRootRef.current
    ) {
      return;
    }

    try {
      if (
        document.fullscreenElement !==
        examRootRef.current
      ) {
        await examRootRef.current.requestFullscreen();
      }

      setIntegrityPaused(
        false,
      );

      setIntegrityWarning(
        "",
      );
    } catch {
      toast.error(
        "Return to fullscreen to resume the exam.",
      );
    }
  }

  function updateResponse(
    questionId: string,
    response: string,
  ) {
    if (
      !assignment ||
      !user?.uid ||
      locked ||
      integrityPaused
    ) {
      return;
    }

    const nextAnswers =
      answers.map((answer) =>
        answer.questionId ===
        questionId
          ? {
              ...answer,
              response,
            }
          : answer,
      );

    setAnswers(
      nextAnswers,
    );

    if (saveTimer.current) {
      clearTimeout(
        saveTimer.current,
      );
    }

    saveTimer.current =
      setTimeout(() => {
        void autosaveExamAnswers(
          assignment.id,
          user.uid,
          nextAnswers,
        ).catch((error) => {
          console.error(error);

          toast.error(
            "Autosave failed.",
          );
        });
      }, 900);
  }

  function focusQuestion(
    questionNumber: number,
  ) {
    setActiveQuestionNumber(
      questionNumber,
    );

    if (
      assignment &&
      user?.uid
    ) {
      void updateExamCurrentQuestion(
        {
          assignmentId:
            assignment.id,

          studentId: user.uid,

          questionNumber,
        },
      ).catch(
        (error) =>
          console.error(
            "Unable to store current question:",
            error,
          ),
      );
    }
  }

  async function saveNow() {
    if (
      !assignment ||
      !user?.uid ||
      locked
    ) {
      return;
    }

    setSaving(true);

    try {
      await autosaveExamAnswers(
        assignment.id,
        user.uid,
        answers,
      );

      toast.success(
        "Answers saved.",
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Answers could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function submit() {
    if (
      !assignment ||
      !user?.uid ||
      locked
    ) {
      return;
    }

    if (
      !window.confirm(
        "Submit this assessment? You will not be able to edit it afterwards.",
      )
    ) {
      return;
    }

    finishingRef.current =
      true;

    setSaving(true);

    try {
      await autosaveExamAnswers(
        assignment.id,
        user.uid,
        answers,
      );

      await submitExamSubmission(
        assignment.id,
        user.uid,
      );

      setSubmission(
        (current) =>
          current
            ? {
                ...current,
                status:
                  "submitted",
                answers,
              }
            : current,
      );

      if (
        document.fullscreenElement
      ) {
        await document
          .exitFullscreen()
          .catch(
            () => undefined,
          );
      }

      toast.success(
        "Assessment submitted.",
      );

      router.push(
        "/exam",
      );
    } catch (error) {
      console.error(error);

      finishingRef.current =
        false;

      toast.error(
        "Assessment could not be submitted.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Skeleton className="h-96" />
    );
  }

  if (
    !assignment ||
    !submission
  ) {
    return (
      <Card>
        <h1 className="text-2xl font-black text-slate-950">
          Assessment unavailable
        </h1>

        <p className="mt-3 text-slate-600">
          This assessment does not exist or is not assigned to your account.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/exam"
            className="rounded-xl bg-indigo-700 px-5 py-3 font-bold text-white"
          >
            Back to Exam Mode
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl border px-5 py-3 font-bold"
          >
            Dashboard
          </Link>
        </div>
      </Card>
    );
  }

  if (
    !locked &&
    !integrityStarted
  ) {
    return (
      <div
        ref={examRootRef}
        className="min-h-screen bg-slate-100 p-6"
      >
        <div className="mx-auto max-w-4xl space-y-6">
          <Card className="overflow-hidden rounded-3xl border-0">
            <div className="bg-gradient-to-r from-slate-950 to-indigo-950 p-8 text-white">
              <div className="flex items-center gap-2 text-indigo-200">
                <ShieldCheck className="h-5 w-5" />

                <p className="text-xs font-black uppercase tracking-[0.16em]">
                  Exam Mode
                </p>
              </div>

              <h1 className="mt-3 text-4xl font-black">
                {assignment.title}
              </h1>

              <p className="mt-3 text-indigo-100">
                {assignment.questionCount} questions ·{" "}
                {assignment.totalMarks} marks
              </p>
            </div>

            <div className="space-y-5 p-7">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <p className="font-black text-amber-950">
                  Integrity monitoring
                </p>

                <p className="mt-2 text-sm leading-6 text-amber-900">
                  This exam uses fullscreen and page-visibility monitoring.
                  Events are recorded for teacher review. This is not a
                  guaranteed lockdown browser.
                </p>
              </div>

              {assignment.integrityPolicy.enabled ? (
                <div className="space-y-3 text-sm leading-6 text-slate-700">
                  <p>
                    • The exam will enter fullscreen and normal CS Master
                    navigation will be hidden.
                  </p>

                  <p>
                    • Leaving fullscreen starts a visible 5-second countdown.
                  </p>

                  <p>
                    • If fullscreen is not restored before the countdown ends,
                    the exam is automatically terminated and submitted.
                  </p>

                  {assignment.integrityPolicy.monitorPageVisibility && (
                    <p>
                      • Switching away from the exam page is recorded and the
                      teacher&apos;s configured visibility rule is applied.
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-600">
                  Integrity monitoring has been disabled by the teacher for this
                  assignment.
                </p>
              )}

              <button
                type="button"
                onClick={() =>
                  void enterExamMode()
                }
                className="w-full rounded-2xl bg-indigo-700 px-6 py-4 text-lg font-black text-white"
              >
                Enter Exam Mode
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={examRootRef}
      className="h-screen min-h-screen overflow-y-auto overscroll-contain bg-slate-100 p-5 md:p-8"
    >
      {fullscreenCountdown !==
        null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-6">
          <div className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-2xl">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-600" />

            <p className="mt-4 text-sm font-black uppercase tracking-[0.16em] text-red-600">
              Fullscreen exited
            </p>

            <h2 className="mt-3 text-3xl font-black text-slate-950">
              Return to fullscreen
            </h2>

            <p className="mt-3 text-slate-600">
              This exam will be terminated and submitted automatically if you
              do not return before the countdown ends.
            </p>

            <p className="mt-6 text-7xl font-black text-red-600">
              {fullscreenCountdown}
            </p>

            <button
              type="button"
              onClick={() =>
                void resumePausedExam()
              }
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-indigo-700 px-7 py-3 font-black text-white transition hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-200"
            >
              Return to fullscreen
            </button>
          </div>
        </div>
      )}

      {integrityPaused && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/80 p-6">
          <div className="max-w-xl rounded-3xl bg-white p-8 text-center">
            <p className="text-sm font-black uppercase tracking-wide text-amber-700">
              Exam paused
            </p>

            <h2 className="mt-3 text-2xl font-black text-slate-950">
              Page visibility incident recorded
            </h2>

            <p className="mt-3 text-slate-600">
              Your teacher configured page-hidden events to pause the exam.
              Return to fullscreen to continue.
            </p>

            <button
              type="button"
              onClick={() =>
                void resumePausedExam()
              }
              className="mt-6 rounded-xl bg-indigo-700 px-6 py-3 font-black text-white"
            >
              Resume in fullscreen
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl space-y-6">
        <Card className="sticky top-0 z-20 border-0 bg-gradient-to-r from-slate-950 to-indigo-950 text-white shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-indigo-200">
                Monitored Exam Mode
              </p>

              <h1 className="mt-2 text-2xl font-black">
                {assignment.title}
              </h1>

              <p className="mt-2 text-sm text-indigo-100">
                {answeredCount}/{assignment.questionCount} answered ·{" "}
                {assignment.totalMarks} marks
              </p>
            </div>

            {!locked && (
              <div className="rounded-xl bg-white/10 px-4 py-3 text-sm font-bold text-white/80">
                Question{" "}
                {activeQuestionNumber ?? "—"}
              </div>
            )}
          </div>
        </Card>

        {integrityWarning && !locked && (
          <Card className="border border-amber-200 bg-amber-50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-700" />

              <div className="flex-1">
                <p className="font-black text-amber-950">
                  Integrity warning
                </p>

                <p className="mt-1 text-sm text-amber-900">
                  {integrityWarning}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIntegrityWarning("")
                }
                className="text-sm font-black text-amber-900"
              >
                Dismiss
              </button>
            </div>
          </Card>
        )}

        {submission.integrityTerminated && (
          <Card className="border border-red-300 bg-red-50">
            <p className="text-sm font-black uppercase tracking-wide text-red-700">
              Exam automatically terminated
            </p>

            <h2 className="mt-2 text-2xl font-black text-red-950">
              Your answers were submitted
            </h2>

            <p className="mt-3 text-red-900">
              {submission.integrityTerminationReason}
            </p>
          </Card>
        )}

        {submission.status ===
          "marked" && (
          <Card className="border border-emerald-200 bg-emerald-50">
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">
              Marked result
            </p>

            <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-4xl font-black text-emerald-950">
                  {submission.totalAwardedMarks}/
                  {submission.totalAvailableMarks}
                </p>

                <p className="mt-1 text-lg font-bold text-emerald-800">
                  {submission.percentage}%
                </p>
              </div>

              <p className="max-w-3xl text-sm leading-6 text-emerald-900">
                {submission.overallFeedback ||
                  "Your teacher has released the marked result."}
              </p>
            </div>
          </Card>
        )}

        {assignment.questionSetSnapshot.questions.map(
          (question) => {
            const answer =
              answers.find(
                (item) =>
                  item.questionId ===
                  question.id,
              );

            const extras =
              getQuestionExtras(
                question,
              );

            return (
              <Card
                key={question.id}
              >
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-xl font-black">
                    Question{" "}
                    {question.questionNumber}
                  </h2>

                  <span className="rounded-full bg-indigo-100 px-3 py-1 font-bold text-indigo-800">
                    {question.marks} marks
                  </span>
                </div>

                {question.context && (
                  <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    {question.context}
                  </div>
                )}

                <p className="mt-5 whitespace-pre-wrap font-semibold">
                  {question.question}
                </p>

                <label className="mt-5 block">
                  <span className="text-sm font-bold">
                    Your answer
                  </span>

                  <textarea
                    rows={8}
                    value={
                      answer?.response ||
                      ""
                    }
                    disabled={
                      locked ||
                      integrityPaused
                    }
                    onFocus={() =>
                      focusQuestion(
                        question.questionNumber,
                      )
                    }
                    onChange={(
                      event,
                    ) =>
                      updateResponse(
                        question.id,
                        event.target.value,
                      )
                    }
                    className="mt-2 w-full rounded-xl border px-4 py-3 disabled:bg-slate-100"
                  />
                </label>

                {submission.status ===
                  "marked" && (
                  <div className="mt-6 space-y-5">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                      <p className="font-black text-emerald-950">
                        Awarded:{" "}
                        {answer?.awardedMarks ??
                          0}
                        /{question.marks}
                      </p>

                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-emerald-900">
                        {answer?.teacherFeedback ||
                          "No question-specific feedback was provided."}
                      </p>
                    </div>

                    <div className="grid gap-5 xl:grid-cols-2">
                      <div className="rounded-2xl bg-blue-50 p-5">
                        <h3 className="font-black text-blue-950">
                          Model answer
                        </h3>

                        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-blue-900">
                          {
                            question.modelAnswer
                          }
                        </p>
                      </div>

                      <div className="rounded-2xl bg-emerald-50 p-5">
                        <h3 className="font-black text-emerald-950">
                          Mark scheme
                        </h3>

                        <ul className="mt-3 space-y-2 text-sm text-emerald-900">
                          {question.markScheme.map(
                            (point) => (
                              <li
                                key={
                                  point.id
                                }
                              >
                                •{" "}
                                {
                                  point.description
                                }{" "}
                                (
                                {
                                  point.marks
                                }
                                )
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    </div>

                    {extras.examinerGuidance
                      .length > 0 && (
                      <div className="rounded-2xl bg-amber-50 p-5">
                        <h3 className="font-black text-amber-950">
                          Examiner guidance
                        </h3>

                        <ul className="mt-3 space-y-2 text-sm text-amber-900">
                          {extras.examinerGuidance.map(
                            (item) => (
                              <li
                                key={
                                  item
                                }
                              >
                                •{" "}
                                {
                                  item
                                }
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}

                    {extras.misconceptions
                      .length > 0 && (
                      <div className="rounded-2xl bg-red-50 p-5">
                        <h3 className="font-black text-red-950">
                          Common misconceptions
                        </h3>

                        <ul className="mt-3 space-y-2 text-sm text-red-900">
                          {extras.misconceptions.map(
                            (item) => (
                              <li
                                key={
                                  item
                                }
                              >
                                •{" "}
                                {
                                  item
                                }
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          },
        )}

        {!locked ? (
          <Card>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  void saveNow()
                }
                disabled={saving}
                className="rounded-xl border px-5 py-3 font-bold"
              >
                Save Answers
              </button>

              <button
                type="button"
                onClick={() =>
                  void submit()
                }
                disabled={saving}
                className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white"
              >
                Submit Assessment
              </button>
            </div>
          </Card>
        ) : (
          <Card
            className={
              submission.status ===
              "marked"
                ? "border border-emerald-200 bg-emerald-50"
                : submission.integrityTerminated
                  ? "border border-red-200 bg-red-50"
                  : "border border-cyan-200 bg-cyan-50"
            }
          >
            <p className="font-bold text-slate-900">
              {submission.status ===
              "marked"
                ? "Your marked result and feedback are shown above."
                : submission.integrityTerminated
                  ? "This exam was automatically submitted after an integrity rule was triggered."
                  : "Your assessment has been submitted and is awaiting marking."}
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/exam"
                className="rounded-xl bg-indigo-700 px-5 py-3 font-bold text-white"
              >
                Back to Exam Mode
              </Link>

              <Link
                href="/dashboard"
                className="rounded-xl border px-5 py-3 font-bold"
              >
                Dashboard
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
