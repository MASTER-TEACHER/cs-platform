"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { Quiz } from "@/types/quiz";
import { useAuth } from "@/contexts/AuthContext";
import { saveQuizResult } from "@/services/quizService";

type Props = {
  quiz: Quiz;
};

function getGrade(scorePercent: number) {
  if (scorePercent >= 90) return "Grade 9";
  if (scorePercent >= 80) return "Grade 8";
  if (scorePercent >= 70) return "Grade 7";
  if (scorePercent >= 60) return "Grade 6";
  if (scorePercent >= 50) return "Grade 5";
  if (scorePercent >= 40) return "Grade 4";
  if (scorePercent >= 30) return "Grade 3";
  if (scorePercent >= 20) return "Grade 2";
  return "Grade 1";
}

function getMessage(scorePercent: number) {
  if (scorePercent >= 90) return "Outstanding performance!";
  if (scorePercent >= 75) return "Excellent work!";
  if (scorePercent >= 60) return "Good progress!";
  if (scorePercent >= 40) return "You are getting there.";
  return "Keep practising. You can improve this.";
}

export default function QuizPlayer({ quiz }: Props) {
  const { user } = useAuth();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(8 * 60);
  const [resultSaved, setResultSaved] = useState(false);

  const currentQuestion = quiz.questions[currentIndex];
  const selectedAnswer = answers[currentQuestion.id] || "";

  const progress = Math.round(
    ((currentIndex + 1) / quiz.questions.length) * 100
  );

  const totalXP = useMemo(() => {
    return quiz.questions.reduce(
      (total, question) => total + question.xpReward,
      0
    );
  }, [quiz.questions]);

  const correctCount = quiz.questions.filter(
    (question) =>
      answers[question.id]?.trim().toLowerCase() ===
      question.correctAnswer.trim().toLowerCase()
  ).length;

  const scorePercent = Math.round(
    (correctCount / quiz.questions.length) * 100
  );

  const earnedXP = quiz.questions.reduce((total, question) => {
    const isCorrect =
      answers[question.id]?.trim().toLowerCase() ===
      question.correctAnswer.trim().toLowerCase();

    return isCorrect ? total + question.xpReward : total;
  }, 0);

  const strengths = quiz.questions
    .filter(
      (question) =>
        answers[question.id]?.trim().toLowerCase() ===
        question.correctAnswer.trim().toLowerCase()
    )
    .slice(0, 3);

  const needsPractice = quiz.questions
    .filter(
      (question) =>
        answers[question.id]?.trim().toLowerCase() !==
        question.correctAnswer.trim().toLowerCase()
    )
    .slice(0, 3);

  useEffect(() => {
    if (showResults) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowResults(true);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResults]);

  useEffect(() => {
    async function saveResult() {
      if (!showResults || resultSaved || !user) return;

      try {
        await saveQuizResult({
          uid: user.uid,
          quizId: quiz.id,
          topicId: quiz.topicId,
          title: quiz.title,
          scorePercent,
          correctCount,
          totalQuestions: quiz.questions.length,
          earnedXP,
        });

        setResultSaved(true);
        toast.success(`Quiz result saved! +${earnedXP} XP`);
      } catch (error) {
        console.error("Quiz save error:", error);
        toast.error("Could not save quiz result.");
      }
    }

    saveResult();
  }, [
    showResults,
    resultSaved,
    user,
    quiz.id,
    quiz.topicId,
    quiz.title,
    quiz.questions.length,
    scorePercent,
    correctCount,
    earnedXP,
  ]);

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

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
        <Card className="border-0 bg-gradient-to-r from-blue-700 to-indigo-700 text-center text-white">
          <div className="text-6xl">🎉</div>

          <h1 className="mt-4 text-4xl font-bold">Quiz Complete</h1>

          <p className="mt-3 text-blue-100">{getMessage(scorePercent)}</p>

          <p className="mt-6 text-6xl font-extrabold">{scorePercent}%</p>

          <p className="mt-3 text-2xl font-bold">{getGrade(scorePercent)}</p>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-blue-100">Correct Answers</p>
              <p className="mt-1 text-2xl font-bold">
                {correctCount} / {quiz.questions.length}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-blue-100">XP Earned</p>
              <p className="mt-1 text-2xl font-bold">⭐ {earnedXP}</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-blue-100">Saved</p>
              <p className="mt-1 text-2xl font-bold">
                {resultSaved ? "✅ Yes" : user ? "Saving..." : "Login needed"}
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <h2 className="text-2xl font-bold text-slate-900">✅ Strengths</h2>

            {strengths.length > 0 ? (
              <div className="mt-4 space-y-3">
                {strengths.map((question) => (
                  <div
                    key={question.id}
                    className="rounded-xl bg-green-50 p-4 text-green-800"
                  >
                    {question.question}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-slate-600">
                No strengths identified yet. Try the quiz again after revising.
              </p>
            )}
          </Card>

          <Card>
            <h2 className="text-2xl font-bold text-slate-900">
              ⚠ Needs More Practice
            </h2>

            {needsPractice.length > 0 ? (
              <div className="mt-4 space-y-3">
                {needsPractice.map((question) => (
                  <div
                    key={question.id}
                    className="rounded-xl bg-red-50 p-4 text-red-800"
                  >
                    {question.question}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-slate-600">
                Excellent — no weak areas found in this quiz.
              </p>
            )}
          </Card>
        </div>

        <Card>
          <h2 className="text-2xl font-bold text-slate-900">Review Answers</h2>

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
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-r from-slate-900 to-blue-700 text-white">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">
          Quiz
        </p>

        <h1 className="mt-2 text-3xl font-bold">{quiz.title}</h1>

        <p className="mt-2 text-blue-100">{quiz.description}</p>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-sm font-semibold text-blue-100">
            <span>
              Question {currentIndex + 1} of {quiz.questions.length}
            </span>
            <span>{progress}% complete</span>
          </div>

          <ProgressBar value={progress} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-sm text-blue-100">⏱ Time Left</p>
            <p className="mt-1 text-2xl font-bold">{formatTime(timeLeft)}</p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-sm text-blue-100">⭐ XP Available</p>
            <p className="mt-1 text-2xl font-bold">{totalXP}</p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-sm text-blue-100">📚 Estimated Time</p>
            <p className="mt-1 text-2xl font-bold">{quiz.estimatedTime}</p>
          </div>
        </div>
      </Card>

      <Card>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Question {currentIndex + 1}
        </p>

        <h2 className="mt-4 text-2xl font-bold text-slate-900">
          {currentQuestion.question}
        </h2>

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
    </div>
  );
}