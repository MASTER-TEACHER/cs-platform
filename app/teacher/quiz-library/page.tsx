"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  collection,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
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
  source: string;
  createdAt?: Timestamp;
};

export default function TeacherQuizLibraryPage() {
  const { user, loading: authLoading } = useAuth();

  const [quizzes, setQuizzes] = useState<SavedQuiz[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setQuizzes([]);
      setLoadingQuizzes(false);
      return;
    }

    const teacherId = user.uid;

    const quizzesQuery = query(
      collection(db, "generatedQuizzes"),
      where("teacherId", "==", teacherId)
    );

    const unsubscribe = onSnapshot(
      quizzesQuery,
      (snapshot) => {
        const loadedQuizzes: SavedQuiz[] = snapshot.docs.map(
          (quizDocument) => {
            const data = quizDocument.data();

            return {
              id: quizDocument.id,
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
              source: data.source || "ai",
              createdAt: data.createdAt,
            };
          }
        );

        loadedQuizzes.sort((a, b) => {
          const aTime = a.createdAt?.toMillis() || 0;
          const bTime = b.createdAt?.toMillis() || 0;

          return bTime - aTime;
        });

        setQuizzes(loadedQuizzes);
        setLoadingQuizzes(false);
      },
      (error) => {
        console.error("Failed to load quiz library:", error);
        toast.error("Could not load your quiz library.");
        setQuizzes([]);
        setLoadingQuizzes(false);
      }
    );

    return unsubscribe;
  }, [authLoading, user]);

  const filteredQuizzes = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return quizzes;
    }

    return quizzes.filter(
      (quiz) =>
        quiz.title.toLowerCase().includes(search) ||
        quiz.topicId.toLowerCase().includes(search) ||
        quiz.examBoard.toLowerCase().includes(search)
    );
  }, [quizzes, searchTerm]);

  const totalQuestions = useMemo(
    () =>
      quizzes.reduce(
        (total, quiz) => total + quiz.questionCount,
        0
      ),
    [quizzes]
  );

  if (authLoading || loadingQuizzes) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-52 w-full" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>

        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-700 text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-violet-100">
              AI Teacher Tools
            </p>

            <h1 className="mt-3 text-4xl font-extrabold">
              Quiz Library
            </h1>

            <p className="mt-3 max-w-2xl text-violet-100">
              Review saved AI quizzes and prepare them for your classes.
            </p>
          </div>

          <Link
            href="/teacher/quiz-generator"
            className="rounded-xl bg-white px-5 py-3 text-center font-bold text-indigo-700 transition hover:bg-violet-50"
          >
            ✨ Generate Quiz
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SummaryCard
          label="Saved Quizzes"
          value={quizzes.length.toString()}
          icon="🧠"
        />

        <SummaryCard
          label="Total Questions"
          value={totalQuestions.toString()}
          icon="❓"
        />

        <SummaryCard
          label="Draft Quizzes"
          value={quizzes
            .filter((quiz) => quiz.status === "draft")
            .length.toString()}
          icon="📝"
        />
      </div>

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Saved Content
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              My AI Quizzes
            </h2>
          </div>

          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search quizzes..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 md:max-w-sm"
          />
        </div>

        {filteredQuizzes.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-slate-50 p-10 text-center">
            <div className="text-5xl">🧠</div>

            <h3 className="mt-4 text-2xl font-bold text-slate-900">
              No saved quizzes found
            </h3>

            <p className="mt-2 text-slate-600">
              Generate and save a quiz to add it to your library.
            </p>

            <Link
              href="/teacher/quiz-generator"
              className="mt-6 inline-flex rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700"
            >
              Generate Your First Quiz
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                      {quiz.qualification} · {quiz.examBoard}
                    </p>

                    <h3 className="mt-2 text-xl font-bold text-slate-900">
                      {quiz.title}
                    </h3>
                  </div>

                  <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold capitalize text-amber-700">
                    {quiz.status}
                  </span>
                </div>

                <p className="mt-4 leading-6 text-slate-600">
                  {quiz.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
                  <span className="rounded-full bg-white px-3 py-2 text-slate-700">
                    ❓ {quiz.questionCount} questions
                  </span>

                  <span className="rounded-full bg-white px-3 py-2 text-slate-700">
                    ⏱ {quiz.estimatedTime}
                  </span>

                  <span className="rounded-full bg-white px-3 py-2 capitalize text-slate-700">
                    🎯 {quiz.difficulty}
                  </span>
                </div>

                <Link
                  href={`/teacher/quiz-library/${quiz.id}`}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-700"
                >
                  View Quiz →
                </Link>
              </div>
            ))}
          </div>
        )}
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

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="text-3xl">{icon}</div>
      </div>
    </Card>
  );
}