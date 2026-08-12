"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { getExamAssignmentById } from "@/services/examAssignmentService";
import {
  autosaveExamAnswers,
  getOrCreateExamSubmission,
  submitExamSubmission,
} from "@/services/examSubmissionService";
import type {
  ExamAssignment,
  ExamSubmission,
  StudentExamAnswer,
} from "@/types/examAssignment";

function toStringList(value: unknown): string[] {
  if (typeof value === "string") {
    return value.trim() ? [value.trim()] : [];
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      if (item && typeof item === "object") {
        const candidate = item as Record<string, unknown>;

        const text = candidate.description ?? candidate.text ?? candidate.point;

        return typeof text === "string" ? text.trim() : "";
      }

      return "";
    })
    .filter(Boolean);
}

function getQuestionExtras(question: unknown) {
  const candidate = question as Record<string, unknown>;

  return {
    examinerGuidance: toStringList(candidate.examinerGuidance),
    misconceptions: toStringList(candidate.misconceptions),
  };
}

export default function StudentExamPlayerPage() {
  const params = useParams<{
    assignmentId: string;
  }>();

  const router = useRouter();

  const { user } = useAuth();

  const [assignment, setAssignment] = useState<ExamAssignment | null>(null);

  const [submission, setSubmission] = useState<ExamSubmission | null>(null);

  const [answers, setAnswers] = useState<StudentExamAnswer[]>([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const locked = submission
    ? ["submitted", "marking", "marked"].includes(submission.status)
    : false;

  useEffect(() => {
    async function load() {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const loadedAssignment = await getExamAssignmentById(
          params.assignmentId,
        );

        if (
          !loadedAssignment ||
          !loadedAssignment.studentIds.includes(user.uid)
        ) {
          return;
        }

        const loadedSubmission = await getOrCreateExamSubmission({
          assignment: loadedAssignment,
          studentId: user.uid,
          studentName: user.displayName || "Student",
          studentEmail: user.email || "",
        });

        setAssignment(loadedAssignment);

        setSubmission(loadedSubmission);

        setAnswers(loadedSubmission.answers);
      } catch (error) {
        console.error("Unable to load written assessment:", error);

        toast.error("The written assessment could not be loaded.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [params.assignmentId, user?.uid, user?.displayName, user?.email]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, []);

  const answeredCount = useMemo(
    () => answers.filter((answer) => answer.response.trim().length > 0).length,
    [answers],
  );

  function updateResponse(questionId: string, response: string) {
    if (!assignment || !user?.uid || locked) {
      return;
    }

    const nextAnswers = answers.map((answer) =>
      answer.questionId === questionId
        ? {
            ...answer,
            response,
          }
        : answer,
    );

    setAnswers(nextAnswers);

    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    saveTimer.current = setTimeout(() => {
      void autosaveExamAnswers(assignment.id, user.uid, nextAnswers).catch(
        (error) => {
          console.error(error);

          toast.error("Autosave failed.");
        },
      );
    }, 900);
  }

  async function saveNow() {
    if (!assignment || !user?.uid || locked) {
      return;
    }

    setSaving(true);

    try {
      await autosaveExamAnswers(assignment.id, user.uid, answers);

      toast.success("Answers saved.");
    } catch (error) {
      console.error(error);

      toast.error("Answers could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  async function submit() {
    if (!assignment || !user?.uid || locked) {
      return;
    }

    if (
      !window.confirm(
        "Submit this assessment? You will not be able to edit it afterwards.",
      )
    ) {
      return;
    }

    setSaving(true);

    try {
      await autosaveExamAnswers(assignment.id, user.uid, answers);

      await submitExamSubmission(assignment.id, user.uid);

      setSubmission((current) =>
        current
          ? {
              ...current,
              status: "submitted",
              answers,
            }
          : current,
      );

      toast.success("Assessment submitted.");

      router.push("/assignments");
    } catch (error) {
      console.error(error);

      toast.error("Assessment could not be submitted.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <Skeleton className="h-96" />;
  }

  if (!assignment || !submission) {
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
            href="/assignments"
            className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white"
          >
            Back to Assignments
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

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-slate-950 to-indigo-950 text-white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-indigo-200">
              Written assessment
            </p>

            <h1 className="mt-2 text-4xl font-black">{assignment.title}</h1>

            <p className="mt-3 text-indigo-100">
              {answeredCount}/{assignment.questionCount} answered ·{" "}
              {assignment.totalMarks} marks
            </p>

            {assignment.instructions && (
              <p className="mt-4 max-w-3xl text-sm text-indigo-100">
                {assignment.instructions}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/assignments"
              className="rounded-xl border border-white/20 px-5 py-3 font-bold text-white"
            >
              ← Assignments
            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl border border-white/20 px-5 py-3 font-bold text-white"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </Card>

      {submission.status === "marked" && (
        <Card className="border border-emerald-200 bg-emerald-50">
          <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">
            Marked result
          </p>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-4xl font-black text-emerald-950">
                {submission.totalAwardedMarks}/{submission.totalAvailableMarks}
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

      {assignment.questionSetSnapshot.questions.map((question) => {
        const answer = answers.find((item) => item.questionId === question.id);

        const extras = getQuestionExtras(question);

        return (
          <Card key={question.id}>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-black">
                Question {question.questionNumber}
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
              <span className="text-sm font-bold">Your answer</span>

              <textarea
                rows={8}
                value={answer?.response || ""}
                disabled={locked}
                onChange={(event) =>
                  updateResponse(question.id, event.target.value)
                }
                className="mt-2 w-full rounded-xl border px-4 py-3 disabled:bg-slate-100"
              />
            </label>

            {submission.status === "marked" && (
              <div className="mt-6 space-y-5">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <p className="font-black text-emerald-950">
                    Awarded: {answer?.awardedMarks ?? 0}/{question.marks}
                  </p>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-emerald-900">
                    {answer?.teacherFeedback ||
                      "No question-specific feedback was provided."}
                  </p>
                </div>

                <div className="grid gap-5 xl:grid-cols-2">
                  <div className="rounded-2xl bg-blue-50 p-5">
                    <h3 className="font-black text-blue-950">Model answer</h3>

                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-blue-900">
                      {question.modelAnswer}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-50 p-5">
                    <h3 className="font-black text-emerald-950">Mark scheme</h3>

                    <ul className="mt-3 space-y-2 text-sm text-emerald-900">
                      {question.markScheme.map((point) => (
                        <li key={point.id}>
                          • {point.description} ({point.marks})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {extras.examinerGuidance.length > 0 && (
                  <div className="rounded-2xl bg-amber-50 p-5">
                    <h3 className="font-black text-amber-950">
                      Examiner guidance
                    </h3>

                    <ul className="mt-3 space-y-2 text-sm text-amber-900">
                      {extras.examinerGuidance.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {extras.misconceptions.length > 0 && (
                  <div className="rounded-2xl bg-red-50 p-5">
                    <h3 className="font-black text-red-950">
                      Common misconceptions
                    </h3>

                    <ul className="mt-3 space-y-2 text-sm text-red-900">
                      {extras.misconceptions.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </Card>
        );
      })}

      {!locked ? (
        <Card>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                void saveNow();
              }}
              disabled={saving}
              className="rounded-xl border px-5 py-3 font-bold"
            >
              Save Answers
            </button>

            <button
              type="button"
              onClick={() => {
                void submit();
              }}
              disabled={saving}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white"
            >
              Submit Assessment
            </button>

            <Link
              href="/assignments"
              className="rounded-xl border px-5 py-3 font-bold"
            >
              Back to Assignments
            </Link>
          </div>
        </Card>
      ) : (
        <Card
          className={
            submission.status === "marked"
              ? "border border-emerald-200 bg-emerald-50"
              : "border border-cyan-200 bg-cyan-50"
          }
        >
          <p
            className={
              submission.status === "marked"
                ? "font-bold text-emerald-900"
                : "font-bold text-cyan-900"
            }
          >
            {submission.status === "marked"
              ? "Your marked result and feedback are shown above."
              : "Your assessment has been submitted and is awaiting marking."}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/assignments"
              className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white"
            >
              Back to Assignments
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
  );
}
