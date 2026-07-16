"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

import QuizPlayer from "@/components/quiz/QuizPlayer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { quizLibrary } from "@/data/quizzes/index";
import { db } from "@/lib/firebase";
import type { Quiz } from "@/types/quiz";

type SavedQuizQuestion = {
  id?: string;
  type?: string;
  question?: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  xpReward?: number;
};

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const topicParam = searchParams.get("topic");
  const assignmentId = searchParams.get("assignment");

  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [generatedQuiz, setGeneratedQuiz] = useState<Quiz | null>(null);
  const [loadingGeneratedQuiz, setLoadingGeneratedQuiz] = useState(false);
  const [loadError, setLoadError] = useState("");

  const quizzes = useMemo(() => Object.values(quizLibrary), []);

  const builtInQuiz = selectedQuizId
    ? quizLibrary[selectedQuizId]
    : null;

  const selectedQuiz = generatedQuiz || builtInQuiz;

  useEffect(() => {
    if (!topicParam) {
      setGeneratedQuiz(null);
      setSelectedQuizId(null);
      setLoadError("");
      return;
    }

    const existingQuiz = quizLibrary[topicParam];

    if (existingQuiz) {
      setSelectedQuizId(topicParam);
      setGeneratedQuiz(null);
      setLoadError("");
      return;
    }

    let cancelled = false;

    async function loadGeneratedQuiz() {
      setLoadingGeneratedQuiz(true);
      setLoadError("");
      setSelectedQuizId(null);

      try {
        const quizSnapshot = await getDoc(
          doc(db, "generatedQuizzes", topicParam as string)
        );

        if (cancelled) {
          return;
        }

        if (!quizSnapshot.exists()) {
          setGeneratedQuiz(null);
          setLoadError("The assigned quiz could not be found.");
          return;
        }

        const data = quizSnapshot.data();

        const rawQuestions: SavedQuizQuestion[] = Array.isArray(data.questions)
          ? data.questions
          : [];

        const questions = rawQuestions
          .filter(
            (question) =>
              typeof question.question === "string" &&
              Array.isArray(question.options) &&
              typeof question.correctAnswer === "string"
          )
          .map((question, index) => ({
            id: question.id || `${quizSnapshot.id}-question-${index + 1}`,
            type: "multipleChoice" as const,
            question: question.question || `Question ${index + 1}`,
            options: question.options || [],
            correctAnswer: question.correctAnswer || "",
            explanation:
              question.explanation || "Review this topic with your teacher.",
            xpReward:
              typeof question.xpReward === "number"
                ? question.xpReward
                : 10,
          }));

        if (questions.length === 0) {
          setGeneratedQuiz(null);
          setLoadError("This quiz does not contain any valid questions.");
          return;
        }

        const loadedQuiz: Quiz = {
          id: quizSnapshot.id,
          topicId: quizSnapshot.id,
          title: data.title || "AI Generated Quiz",
          description:
            data.description || "Complete this quiz assigned by your teacher.",
          estimatedTime: data.estimatedTime || "10 minutes",
          questions,
        };

        setGeneratedQuiz(loadedQuiz);
      } catch (error) {
        console.error("Failed to load generated quiz:", error);

        if (!cancelled) {
          setGeneratedQuiz(null);
          setLoadError("The assigned quiz could not be loaded.");
        }
      } finally {
        if (!cancelled) {
          setLoadingGeneratedQuiz(false);
        }
      }
    }

    void loadGeneratedQuiz();

    return () => {
      cancelled = true;
    };
  }, [topicParam]);

  function selectBuiltInQuiz(topicId: string) {
    setSelectedQuizId(topicId);
    setGeneratedQuiz(null);
    setLoadError("");

    router.push(`/quiz?topic=${encodeURIComponent(topicId)}`);
  }

  function returnToQuizLibrary() {
    setSelectedQuizId(null);
    setGeneratedQuiz(null);
    setLoadError("");

    router.push("/quiz");
  }

  if (loadingGeneratedQuiz) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-24 w-48" />
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (loadError) {
    return (
      <Card>
        <div className="text-5xl">⚠️</div>

        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Quiz unavailable
        </h1>

        <p className="mt-3 text-slate-600">{loadError}</p>

        <div className="mt-6">
  <Button
    variant="secondary"
    onClick={returnToQuizLibrary}
  >
    ← Back to quizzes
  </Button>
</div>
      </Card>
    );
  }

  if (selectedQuiz) {
    return (
      <div className="space-y-8">
        {!assignmentId && (
          <Button
            variant="secondary"
            onClick={returnToQuizLibrary}
          >
            ← Back to quizzes
          </Button>
        )}

        {assignmentId && (
          <Card className="border border-blue-200 bg-blue-50">
            <p className="font-semibold text-blue-800">
              📋 You are completing an assigned quiz.
            </p>

            <p className="mt-1 text-sm text-blue-700">
              Your result will be recorded in your teacher&apos;s markbook.
            </p>
          </Card>
        )}

        <QuizPlayer quiz={selectedQuiz} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Quiz Centre
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Choose a quiz
        </h1>

        <p className="mt-2 text-slate-600">
          Test your knowledge, review your answers and build exam confidence.
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {quizzes.map((quiz) => (
          <Card key={quiz.id}>
            <h2 className="text-2xl font-bold text-slate-900">
              {quiz.title}
            </h2>

            <p className="mt-3 text-slate-600">
              {quiz.description}
            </p>

            <p className="mt-4 text-sm font-semibold text-slate-500">
              ⏱ {quiz.estimatedTime} · {quiz.questions.length} questions
            </p>

            <div className="mt-6">
              <Button onClick={() => selectBuiltInQuiz(quiz.topicId)}>
                Start Quiz →
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}