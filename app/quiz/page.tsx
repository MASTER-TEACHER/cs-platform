"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import SecureQuizPlayer from "@/components/quiz/SecureQuizPlayer";

import { useAuth } from "@/contexts/AuthContext";
import {
  getSecureQuiz,
  getSecureQuizLibrary,
  getSecureQuizReview,
  type SecureQuizAssignmentReview,
} from "@/services/secureQuizClientService";

import type {
  SecureQuiz,
  SecureQuizListItem,
} from "@/types/secureQuiz";

function formatCompletedAt(value: string | null): string {
  if (!value) return "Completed";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Completed";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function CompletedQuizReview({
  result,
  onBack,
}: {
  result: SecureQuizAssignmentReview;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <Button variant="secondary" onClick={onBack}>
          ← Back to assignments
        </Button>
      </div>

      <Card className="border-0 bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-700 text-white">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100">
          Completed quiz review
        </p>

        <h1 className="mt-3 text-3xl font-black">
          {result.quizTitle}
        </h1>

        <p className="mt-2 text-blue-100">
          Read-only review · {formatCompletedAt(result.completedAt)}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-sm text-blue-100">Score</p>
            <p className="mt-1 text-2xl font-black">
              {result.score}/{result.totalQuestions}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-sm text-blue-100">Percentage</p>
            <p className="mt-1 text-2xl font-black">
              {result.percentage}%
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-sm text-blue-100">XP earned</p>
            <p className="mt-1 text-2xl font-black">
              ⭐ {result.earnedXP}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-sm text-blue-100">Mode</p>
            <p className="mt-1 text-lg font-black">Read only</p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-black text-slate-950">
          Review answers
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          This is your saved submission. Answers cannot be changed and no new quiz attempt has been created.
        </p>

        {result.review.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
            The score is saved, but detailed answer review is not available for this older submission. Future submissions will retain the complete review snapshot.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {result.review.map((item, index) => (
              <div
                key={`${item.questionId}-${index}`}
                className={`rounded-2xl border p-5 ${
                  item.correct
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <p className="font-black text-slate-950">
                  Q{index + 1}. {item.question}
                </p>

                <p className="mt-3 text-sm text-slate-700">
                  <span className="font-bold">Your answer:</span>{" "}
                  {item.userAnswer || "No answer"}
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  <span className="font-bold">Correct answer:</span>{" "}
                  {item.correctAnswer}
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    user,
    loading: authLoading,
    profileReady,
  } = useAuth();

  const topic = searchParams.get("topic");
  const assignmentId = searchParams.get("assignment");
  const reviewMode =
    searchParams.get("review") === "1";

  const [quizzes, setQuizzes] =
    useState<SecureQuizListItem[]>([]);
  const [quiz, setQuiz] =
    useState<SecureQuiz | null>(null);
  const [reviewResult, setReviewResult] =
    useState<SecureQuizAssignmentReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (authLoading || !profileReady || !user) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        if (
          reviewMode &&
          topic &&
          assignmentId
        ) {
          const loadedReview =
            await getSecureQuizReview({
              topic,
              assignmentId,
            });

          if (!cancelled) {
            setReviewResult(loadedReview);
            setQuiz(null);
            setQuizzes([]);
          }
        } else if (topic) {
          const loadedQuiz = await getSecureQuiz({
            topic,
            assignmentId,
          });

          if (!cancelled) {
            setQuiz(loadedQuiz);
            setReviewResult(null);
            setQuizzes([]);
          }
        } else {
          const loadedQuizzes =
            await getSecureQuizLibrary();

          if (!cancelled) {
            setQuizzes(loadedQuizzes);
            setQuiz(null);
            setReviewResult(null);
          }
        }
      } catch (loadError) {
        console.error("Secure quiz load error:", loadError);

        if (!cancelled) {
          setQuiz(null);
          setReviewResult(null);
          setQuizzes([]);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "The Quiz Centre could not be loaded.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [
    authLoading,
    profileReady,
    user,
    topic,
    assignmentId,
    reviewMode,
  ]);

  if (authLoading || !profileReady || loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-red-600">
          Quiz unavailable
        </p>

        <h1 className="mt-2 text-2xl font-black text-slate-950">
          The quiz could not be opened
        </h1>

        <p className="mt-3 text-slate-600">{error}</p>

        <div className="mt-6">
          <Button
            variant="secondary"
            onClick={() =>
              router.push(
                assignmentId ? "/assignments" : "/quiz",
              )
            }
          >
            {assignmentId
              ? "Back to assignments"
              : "Back to quizzes"}
          </Button>
        </div>
      </Card>
    );
  }

  if (reviewResult) {
    return (
      <CompletedQuizReview
        result={reviewResult}
        onBack={() => router.push("/assignments")}
      />
    );
  }

  if (quiz) {
    return (
      <div className="space-y-6">
        {!assignmentId && (
          <Button
            variant="secondary"
            onClick={() => router.push("/quiz")}
          >
            Back to quizzes
          </Button>
        )}

        <SecureQuizPlayer quiz={quiz} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-indigo-950 via-blue-900 to-cyan-800 text-white">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-200">
          Quiz Centre
        </p>

        <h1 className="mt-3 text-3xl font-black">
          Choose a protected quiz
        </h1>

        <p className="mt-2 max-w-3xl text-blue-100">
          Questions are delivered without answer keys. Correct answers and explanations remain server-side until the attempt is submitted.
        </p>
      </Card>

      {quizzes.length === 0 ? (
        <Card>
          <h2 className="text-xl font-black text-slate-950">
            No quizzes are currently available
          </h2>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {quizzes.map((item) => (
            <Card
              key={`${item.topicId}-${item.id}`}
              className="flex h-full flex-col"
            >
              <p className="text-xs font-black uppercase tracking-wide text-teal-600">
                {item.unitTitle || "Computer Science"}
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-950">
                {item.title}
              </h2>

              <p className="mt-3 flex-1 text-slate-600">
                {item.description}
              </p>

              <p className="mt-4 text-sm font-bold text-slate-500">
                {item.questionCount} questions · {item.estimatedTime}
              </p>

              <div className="mt-6">
                <Button
                  onClick={() =>
                    router.push(
                      `/quiz?topic=${encodeURIComponent(
                        item.topicId,
                      )}`,
                    )
                  }
                >
                  Start Quiz
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
