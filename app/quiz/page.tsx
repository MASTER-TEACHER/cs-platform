"use client";

import { useState } from "react";
import QuizPlayer from "@/components/quiz/QuizPlayer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { quizLibrary } from "@/data/quizzes/index";

export default function QuizPage() {
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

  const quizzes = Object.values(quizLibrary);
  const selectedQuiz = selectedQuizId ? quizLibrary[selectedQuizId] : null;

  if (selectedQuiz) {
    return (
      <div className="space-y-8">
        <Button variant="secondary" onClick={() => setSelectedQuizId(null)}>
          ← Back to quizzes
        </Button>

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

            <p className="mt-3 text-slate-600">{quiz.description}</p>

            <p className="mt-4 text-sm font-semibold text-slate-500">
              ⏱ {quiz.estimatedTime} · {quiz.questions.length} questions
            </p>

            <div className="mt-6">
              <Button onClick={() => setSelectedQuizId(quiz.topicId)}>
                Start Quiz →
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}