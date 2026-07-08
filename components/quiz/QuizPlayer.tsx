"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Quiz } from "@/types/quiz";

type Props = {
  quiz: Quiz;
};

export default function QuizPlayer({ quiz }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quiz.questions[currentIndex];

  const selectedAnswer = answers[currentQuestion.id] || "";

  const correctCount = quiz.questions.filter(
    (question) =>
      answers[question.id]?.trim().toLowerCase() ===
      question.correctAnswer.trim().toLowerCase()
  ).length;

  const scorePercent = Math.round(
    (correctCount / quiz.questions.length) * 100
  );

  function saveAnswer(answer: string) {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  }

  function goNext() {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  }

  function goPrevious() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  if (showResults) {
    return (
      <div className="space-y-6">
        <Card className="text-center">
          <div className="text-6xl">🎉</div>

          <h1 className="mt-4 text-4xl font-bold text-slate-900">
            Quiz Complete
          </h1>

          <p className="mt-3 text-slate-600">
            You scored {correctCount} out of {quiz.questions.length}.
          </p>

          <p className="mt-6 text-5xl font-extrabold text-blue-600">
            {scorePercent}%
          </p>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold text-slate-900">
            Review Answers
          </h2>

          <div className="mt-6 space-y-4">
            {quiz.questions.map((question, index) => {
              const userAnswer = answers[question.id] || "No answer";
              const isCorrect =
                userAnswer.trim().toLowerCase() ===
                question.correctAnswer.trim().toLowerCase();

              return (
                <div
                  key={question.id}
                  className={`rounded-2xl border p-4 ${
                    isCorrect
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <p className="font-semibold text-slate-900">
                    Q{index + 1}. {question.question}
                  </p>

                  <p className="mt-2 text-sm text-slate-700">
                    Your answer: {userAnswer}
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    Correct answer: {question.correctAnswer}
                  </p>

                  <p className="mt-2 text-sm text-slate-600">
                    {question.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
        Question {currentIndex + 1} of {quiz.questions.length}
      </p>

      <h1 className="mt-4 text-2xl font-bold text-slate-900">
        {currentQuestion.question}
      </h1>

      <div className="mt-8 space-y-3">
        {currentQuestion.type === "multipleChoice" ||
        currentQuestion.type === "trueFalse" ? (
          currentQuestion.options?.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => saveAnswer(option)}
              className={`w-full rounded-xl border p-4 text-left font-semibold transition ${
                selectedAnswer === option
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {option}
            </button>
          ))
        ) : (
          <input
            value={selectedAnswer}
            onChange={(e) => saveAnswer(e.target.value)}
            placeholder="Type your answer..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          variant="secondary"
          onClick={goPrevious}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>

        <Button onClick={goNext}>
          {currentIndex === quiz.questions.length - 1
            ? "Finish Quiz"
            : "Next Question"}
        </Button>
      </div>
    </Card>
  );
}