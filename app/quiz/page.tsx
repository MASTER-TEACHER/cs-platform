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
} from "@/services/secureQuizClientService";

import type {
  SecureQuiz,
  SecureQuizListItem,
} from "@/types/secureQuiz";

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

  const [quizzes, setQuizzes] = useState<SecureQuizListItem[]>([]);
  const [quiz, setQuiz] = useState<SecureQuiz | null>(null);
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
        if (topic) {
          const loadedQuiz = await getSecureQuiz({
            topic,
            assignmentId,
          });

          if (!cancelled) {
            setQuiz(loadedQuiz);
            setQuizzes([]);
          }
        } else {
          const loadedQuizzes = await getSecureQuizLibrary();

          if (!cancelled) {
            setQuizzes(loadedQuizzes);
            setQuiz(null);
          }
        }
      } catch (loadError) {
        console.error("Secure quiz load error:", loadError);

        if (!cancelled) {
          setQuiz(null);
          setQuizzes([]);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "The Quiz Centre could not be loaded.",
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
    profileReady,
    user,
    topic,
    assignmentId,
  ]);

  if (
    authLoading ||
    !profileReady ||
    loading
  ) {
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

        <p className="mt-3 text-slate-600">
          {error}
        </p>

        <div className="mt-6">
  <Button
    variant="secondary"
    onClick={() => router.push("/quiz")}
  >
    Back to quizzes
  </Button>
</div>
      </Card>
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
          Questions are delivered without answer keys. Correct answers and
          explanations remain server-side until the attempt is submitted.
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
        `/quiz?topic=${encodeURIComponent(item.topicId)}`,
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
