"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { db } from "@/lib/firebase";
import type {
  GeneratedQuizQuestion,
  QuizDifficulty,
} from "@/types/generatedQuiz";

type SavedQuiz = {
  id: string;
  teacherId: string;
  title: string;
  description: string;
  topicId: string;
  qualification: string;
  examBoard: string;
  difficulty: QuizDifficulty;
  estimatedTime: string;
  questions: GeneratedQuizQuestion[];
  questionCount: number;
  status: string;
};

export default function SavedQuizPage() {
  const params = useParams<{ quizId: string }>();
  const quizId = params.quizId;

  const [quiz, setQuiz] = useState<SavedQuiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const snapshot = await getDoc(
          doc(db, "generatedQuizzes", quizId)
        );

        if (!snapshot.exists()) {
          setNotFound(true);
          return;
        }

        const data = snapshot.data();

        setQuiz({
          id: snapshot.id,
          teacherId: data.teacherId || "",
          title: data.title || "Untitled Quiz",
          description: data.description || "",
          topicId: data.topicId || "",
          qualification: data.qualification || "GCSE",
          examBoard: data.examBoard || "AQA",
          difficulty:
            data.difficulty === "foundation" ||
            data.difficulty === "higher"
              ? data.difficulty
              : "standard",
          estimatedTime: data.estimatedTime || "10 minutes",
          questions: Array.isArray(data.questions)
            ? data.questions
            : [],
          questionCount:
            typeof data.questionCount === "number"
              ? data.questionCount
              : Array.isArray(data.questions)
                ? data.questions.length
                : 0,
          status: data.status || "draft",
        });
      } catch (error) {
        console.error("Failed to load saved quiz:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    if (quizId) {
      void loadQuiz();
    }
  }, [quizId]);

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-52 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (notFound || !quiz) {
    return (
      <Card>
        <h1 className="text-2xl font-bold text-slate-900">
          Quiz not found
        </h1>

        <p className="mt-3 text-slate-600">
          This saved quiz does not exist or could not be loaded.
        </p>

        <Link
          href="/teacher/quiz-library"
          className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-700"
        >
          ← Back to quiz library
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-700 text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-violet-100">
              Saved AI Quiz
            </p>

            <h1 className="mt-3 text-4xl font-extrabold">
              {quiz.title}
            </h1>

            <p className="mt-3 max-w-3xl text-violet-100">
              {quiz.description}
            </p>
          </div>

          <Link
            href="/teacher/quiz-library"
            className="rounded-xl bg-white px-5 py-3 text-center font-bold text-indigo-700 transition hover:bg-violet-50"
          >
            ← Quiz Library
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Questions"
          value={quiz.questionCount.toString()}
          icon="❓"
        />

        <SummaryCard
          label="Estimated Time"
          value={quiz.estimatedTime}
          icon="⏱"
        />

        <SummaryCard
          label="Difficulty"
          value={quiz.difficulty}
          icon="🎯"
        />

        <SummaryCard
          label="Status"
          value={quiz.status}
          icon="📝"
        />
      </div>

      <Card>
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Quiz Details
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          {quiz.qualification} · {quiz.examBoard}
        </h2>

        <p className="mt-3 text-slate-600">
          Topic ID:{" "}
          <span className="font-bold text-slate-900">
            {quiz.topicId}
          </span>
        </p>
      </Card>

      <div className="space-y-6">
        {quiz.questions.map((question, index) => (
          <Card key={question.id}>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Question {index + 1}
            </p>

            <h3 className="mt-3 text-xl font-bold text-slate-900">
              {question.question}
            </h3>

            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
              {question.options.map((option) => {
                const correct = option === question.correctAnswer;

                return (
                  <div
                    key={option}
                    className={`rounded-xl border p-4 font-semibold ${
                      correct
                        ? "border-green-300 bg-green-50 text-green-800"
                        : "border-slate-200 bg-slate-50 text-slate-700"
                    }`}
                  >
                    {correct ? "✅ " : ""}
                    {option}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-xl bg-blue-50 p-4">
              <p className="font-semibold text-blue-900">
                Explanation
              </p>

              <p className="mt-2 text-sm leading-6 text-blue-800">
                {question.explanation}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href={`/teacher/assignment-wizard?quizId=${quiz.id}`}
            className="rounded-xl bg-indigo-600 px-6 py-4 text-center font-bold text-white transition hover:bg-indigo-700"
          >
            📋 Assign This Quiz
          </Link>

          <Link
            href="/teacher/quiz-generator"
            className="rounded-xl border border-slate-300 px-6 py-4 text-center font-bold text-slate-700 transition hover:bg-slate-50"
          >
            ✨ Generate Another Quiz
          </Link>
        </div>
      </Card>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            {label}
          </p>

          <p className="mt-2 break-words text-2xl font-bold capitalize text-slate-900">
            {value}
          </p>
        </div>

        <div className="text-3xl">{icon}</div>
      </div>
    </Card>
  );
}