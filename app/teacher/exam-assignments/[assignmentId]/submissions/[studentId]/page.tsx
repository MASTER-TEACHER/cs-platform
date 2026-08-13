"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { getExamAssignmentById } from "@/services/examAssignmentService";
import {
  finaliseExamMarking,
  getExamSubmission,
  saveDraftMarking,
} from "@/services/examSubmissionService";
import type {
  AIExamMarkingResult,
  AIQuestionMarkingSuggestion,
} from "@/types/aiExamMarking";
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

function confidenceClass(value: "high" | "medium" | "low") {
  if (value === "high") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (value === "medium") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-red-100 text-red-700";
}

export default function MarkExamSubmissionPage() {
  const params = useParams<{
    assignmentId: string;
    studentId: string;
  }>();

  const router = useRouter();

  const {
    user,
    loading: authLoading,
    profileReady,
  } = useAuth();

  const [assignment, setAssignment] = useState<ExamAssignment | null>(null);

  const [submission, setSubmission] = useState<ExamSubmission | null>(null);

  const [answers, setAnswers] = useState<StudentExamAnswer[]>([]);

  const [overallFeedback, setOverallFeedback] = useState("");

  const [aiResult, setAiResult] = useState<AIExamMarkingResult | null>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [aiMarking, setAiMarking] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      /*
       * Firestore rules require an authenticated teacher. On a hard refresh,
       * Firebase Auth restores asynchronously, so do not issue protected reads
       * until AuthContext has finished restoring the session and profile.
       */
      if (authLoading || !profileReady) {
        return;
      }

      if (!user?.uid) {
        if (!cancelled) {
          setAssignment(null);
          setSubmission(null);
          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);

        const loadedAssignment = await getExamAssignmentById(
          params.assignmentId,
        );

        if (cancelled) {
          return;
        }

        if (!loadedAssignment) {
          setAssignment(null);
          setSubmission(null);
          return;
        }

        /*
         * Defensive ownership check before reading a student's submission.
         * This mirrors the Firestore teacherId rule instead of relying on the
         * UI route alone.
         */
        if (loadedAssignment.teacherId !== user.uid) {
          throw new Error(
            "You do not have permission to mark this assessment.",
          );
        }

        const loadedSubmission = await getExamSubmission(
          params.assignmentId,
          params.studentId,
        );

        if (cancelled) {
          return;
        }

        setAssignment(loadedAssignment);
        setSubmission(loadedSubmission);
        setAnswers(loadedSubmission?.answers || []);
        setOverallFeedback(loadedSubmission?.overallFeedback || "");
      } catch (error) {
        console.error("Unable to load the marking workspace:", error);

        if (!cancelled) {
          setAssignment(null);
          setSubmission(null);

          toast.error(
            error instanceof Error
              ? error.message
              : "The submission could not be loaded.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [
    authLoading,
    params.assignmentId,
    params.studentId,
    profileReady,
    user?.uid,
  ]);

  const totalAwarded = useMemo(
    () => answers.reduce((sum, answer) => sum + (answer.awardedMarks ?? 0), 0),
    [answers],
  );

  const suggestionsByQuestion = useMemo(
    () =>
      new Map<string, AIQuestionMarkingSuggestion>(
        (aiResult?.suggestions || []).map((suggestion) => [
          suggestion.questionId,
          suggestion,
        ]),
      ),
    [aiResult],
  );

  function updateAnswer(
    questionId: string,
    updates: Partial<StudentExamAnswer>,
  ) {
    setAnswers((current) =>
      current.map((answer) =>
        answer.questionId === questionId
          ? {
              ...answer,
              ...updates,
            }
          : answer,
      ),
    );
  }

  async function runAiMarking() {
    if (!assignment || !submission) {
      return;
    }

    setAiMarking(true);

    try {
      const response = await fetch("/api/ai/mark-exam-submission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignmentTitle: assignment.title,
          topic:
            assignment.questionSetSnapshot.topic || assignment.questionSetTitle,
          questions: assignment.questionSetSnapshot.questions,
          answers: answers.map((answer) => ({
            questionId: answer.questionId,
            response: answer.response,
          })),
        }),
      });

      const result = (await response.json()) as
        | AIExamMarkingResult
        | {
            error?: string;
          };

      if (!response.ok) {
        throw new Error(
          "error" in result && result.error
            ? result.error
            : "AI marking failed.",
        );
      }

      const aiMarkingResult = result as AIExamMarkingResult;

      setAiResult(aiMarkingResult);

      setAnswers((current) =>
        current.map((answer) => {
          const suggestion = aiMarkingResult.suggestions.find(
            (item) => item.questionId === answer.questionId,
          );

          if (!suggestion) {
            return answer;
          }

          return {
            ...answer,
            awardedMarks: suggestion.suggestedMarks,
            teacherFeedback: suggestion.feedback,
          };
        }),
      );

      if (aiMarkingResult.overallFeedback) {
        setOverallFeedback(aiMarkingResult.overallFeedback);
      }

      toast.success(
        "AI marking has populated every suggested mark and feedback comment. Review and edit them before finalising.",
      );
    } catch (error) {
      console.error("AI marking error:", error);

      toast.error(
        error instanceof Error ? error.message : "AI marking failed.",
      );
    } finally {
      setAiMarking(false);
    }
  }

  function applySuggestion(suggestion: AIQuestionMarkingSuggestion) {
    updateAnswer(suggestion.questionId, {
      awardedMarks: suggestion.suggestedMarks,
      teacherFeedback: suggestion.feedback,
    });
  }

  async function saveDraft() {
    if (!assignment) {
      return;
    }

    setSaving(true);

    try {
      await saveDraftMarking({
        assignmentId: assignment.id,
        studentId: params.studentId,
        answers,
        overallFeedback,
      });

      toast.success("Draft marking saved.");
    } catch (error) {
      console.error(error);

      toast.error("Draft marking could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  async function finalise() {
    if (!assignment) {
      return;
    }

    const incomplete = answers.some((answer) => answer.awardedMarks === null);

    if (incomplete) {
      toast.error("Award marks for every question before finalising.");
      return;
    }

    if (
      !window.confirm(
        "Finalise these marks and release the result to the student?",
      )
    ) {
      return;
    }

    setSaving(true);

    try {
      await finaliseExamMarking({
        assignmentId: assignment.id,
        studentId: params.studentId,
        answers,
        overallFeedback,
        totalAvailableMarks: assignment.totalMarks,
      });

      toast.success("Marking finalised.");

      router.push(`/teacher/exam-assignments/${assignment.id}`);
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Marking could not be finalised.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || !profileReady || loading) {
    return <Skeleton className="h-96" />;
  }

  if (!assignment || !submission) {
    return (
      <Card>
        <h1 className="text-2xl font-black text-slate-950">
          Submission not found
        </h1>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={`/teacher/exam-assignments/${params.assignmentId}`}
            className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white"
          >
            Back to Markbook
          </Link>

          <Link
            href="/teacher"
            className="rounded-xl border px-5 py-3 font-bold"
          >
            Teacher Dashboard
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
              Marking workspace
            </p>

            <h1 className="mt-2 text-4xl font-black">
              {submission.studentName}
            </h1>

            <p className="mt-3 text-indigo-100">{assignment.title}</p>

            <p className="mt-3 text-xl font-black">
              {totalAwarded}/{assignment.totalMarks}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/teacher/exam-assignments/${assignment.id}`}
              className="rounded-xl border border-white/20 px-5 py-3 font-bold text-white"
            >
              ← Markbook
            </Link>

            <Link
              href="/teacher"
              className="rounded-xl border border-white/20 px-5 py-3 font-bold text-white"
            >
              Teacher Dashboard
            </Link>
          </div>
        </div>
      </Card>

      <Card className="border border-violet-200 bg-violet-50">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-violet-700">
              AI Examiner
            </p>

            <h2 className="mt-2 text-2xl font-black text-violet-950">
              Generate marking suggestions
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-violet-800">
              One click populates a provisional mark and question-specific
              feedback for every response, plus overall feedback. Review and
              edit every suggestion before finalising.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                void runAiMarking();
              }}
              disabled={aiMarking || saving}
              className="rounded-xl bg-violet-700 px-5 py-3 font-bold text-white disabled:bg-slate-300"
            >
              {aiMarking ? "AI is marking..." : "✨ AI Mark Submission"}
            </button>
          </div>
        </div>

        {aiResult && (
          <div className="mt-5 rounded-2xl bg-white p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase text-violet-700">
                {aiResult.mode} mode
              </span>

              <p className="text-sm font-semibold text-slate-700">
                {aiResult.overallFeedback}
              </p>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div>
                <p className="font-black text-emerald-800">
                  Suggested strengths
                </p>

                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {aiResult.strengths.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-black text-amber-800">
                  Suggested priorities
                </p>

                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {aiResult.priorities.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </Card>

      {assignment.questionSetSnapshot.questions.map((question) => {
        const answer = answers.find((item) => item.questionId === question.id);

        const suggestion = suggestionsByQuestion.get(question.id);

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

            <p className="mt-4 whitespace-pre-wrap font-semibold">
              {question.question}
            </p>

            <div className="mt-5 rounded-2xl bg-slate-50 p-5">
              <h3 className="font-black">Student response</h3>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-6">
                {answer?.response || "No response submitted."}
              </p>
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-2">
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

              <div className="rounded-2xl bg-blue-50 p-5">
                <h3 className="font-black text-blue-950">Model answer</h3>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-blue-900">
                  {question.modelAnswer}
                </p>
              </div>
            </div>

            {extras.examinerGuidance.length > 0 && (
              <div className="mt-5 rounded-2xl bg-amber-50 p-5">
                <h3 className="font-black text-amber-950">Examiner guidance</h3>

                <ul className="mt-3 space-y-2 text-sm text-amber-900">
                  {extras.examinerGuidance.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {suggestion && (
              <div className="mt-5 rounded-2xl border border-violet-200 bg-violet-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-black text-violet-950">
                    AI suggestion: {suggestion.suggestedMarks}/
                    {suggestion.maximumMarks}
                  </h3>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${confidenceClass(
                      suggestion.confidence,
                    )}`}
                  >
                    {suggestion.confidence} confidence
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-violet-900">
                  {suggestion.feedback}
                </p>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <SuggestionList
                    title="Matched points"
                    items={suggestion.matchedMarkPoints}
                    emptyMessage="No marking points were confidently matched."
                  />

                  <SuggestionList
                    title="Missed points"
                    items={suggestion.missedMarkPoints}
                    emptyMessage="No missed marking points were identified."
                  />
                </div>

                {suggestion.teacherReviewRequired && (
                  <p className="mt-4 rounded-xl bg-white p-3 text-sm font-bold text-red-700">
                    Teacher review is required before this suggestion is
                    accepted.
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => applySuggestion(suggestion)}
                  className="mt-4 rounded-xl bg-violet-700 px-4 py-2 font-bold text-white"
                >
                  Reapply AI suggestion
                </button>
              </div>
            )}

            <div className="mt-5 grid gap-5 md:grid-cols-[180px_1fr]">
              <label>
                <span className="flex items-center gap-2 text-sm font-bold">
                  Awarded marks
                  {suggestion &&
                    answer?.awardedMarks === suggestion.suggestedMarks && (
                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-black uppercase tracking-wide text-violet-700">
                        ✨ AI suggested
                      </span>
                    )}
                </span>

                <input
                  type="number"
                  min={0}
                  max={question.marks}
                  value={answer?.awardedMarks ?? ""}
                  onChange={(event) =>
                    updateAnswer(question.id, {
                      awardedMarks:
                        event.target.value === ""
                          ? null
                          : Math.min(
                              question.marks,
                              Math.max(0, Number(event.target.value)),
                            ),
                    })
                  }
                  className="mt-2 w-full rounded-xl border px-4 py-3"
                />
              </label>

              <label>
                <span className="flex items-center gap-2 text-sm font-bold">
                  Question feedback
                  {suggestion &&
                    answer?.teacherFeedback === suggestion.feedback && (
                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-black uppercase tracking-wide text-violet-700">
                        ✨ AI suggested
                      </span>
                    )}
                </span>

                <textarea
                  rows={5}
                  value={answer?.teacherFeedback || ""}
                  onChange={(event) =>
                    updateAnswer(question.id, {
                      teacherFeedback: event.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border px-4 py-3"
                />
              </label>
            </div>
          </Card>
        );
      })}

      <Card>
        <label>
          <span className="flex items-center gap-2 text-lg font-black">
            Overall feedback
            {aiResult?.overallFeedback &&
              overallFeedback === aiResult.overallFeedback && (
                <span className="rounded-full bg-violet-100 px-2 py-1 text-[11px] font-black uppercase tracking-wide text-violet-700">
                  ✨ AI suggested
                </span>
              )}
          </span>

          <textarea
            rows={6}
            value={overallFeedback}
            onChange={(event) => setOverallFeedback(event.target.value)}
            className="mt-3 w-full rounded-xl border px-4 py-3"
          />
        </label>

        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <strong>Teacher review required:</strong> AI marks and feedback remain
          provisional until you review them and select Finalise Marking.
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              void saveDraft();
            }}
            disabled={saving}
            className="rounded-xl border px-5 py-3 font-bold"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={() => {
              void finalise();
            }}
            disabled={saving}
            className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white"
          >
            Finalise Marking
          </button>

          <Link
            href={`/teacher/exam-assignments/${assignment.id}`}
            className="rounded-xl border px-5 py-3 font-bold"
          >
            Back to Markbook
          </Link>

          <Link
            href="/teacher"
            className="rounded-xl border px-5 py-3 font-bold"
          >
            Teacher Dashboard
          </Link>
        </div>
      </Card>
    </div>
  );
}

function SuggestionList({
  title,
  items,
  emptyMessage,
}: {
  title: string;
  items: string[];
  emptyMessage: string;
}) {
  return (
    <div className="rounded-xl bg-white p-4">
      <p className="font-black text-slate-900">{title}</p>

      {items.length > 0 ? (
        <ul className="mt-2 space-y-1 text-sm text-slate-700">
          {items.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-slate-500">{emptyMessage}</p>
      )}
    </div>
  );
}