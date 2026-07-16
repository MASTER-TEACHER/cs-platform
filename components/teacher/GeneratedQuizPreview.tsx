"use client";

import Card from "@/components/ui/Card";
import type { GeneratedQuiz } from "@/types/generatedQuiz";

type GeneratedQuizPreviewProps = {
  quiz: GeneratedQuiz;
  saving: boolean;
  savedQuizId: string | null;
  onSave: () => void;
  onDiscard: () => void;
};

export default function GeneratedQuizPreview({
  quiz,
  saving,
  savedQuizId,
  onSave,
  onDiscard,
}: GeneratedQuizPreviewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-green-600">
              Generated Quiz
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {quiz.title}
            </h2>

            <p className="mt-3 max-w-3xl text-slate-600">
              {quiz.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
              <span className="rounded-full bg-indigo-50 px-4 py-2 text-indigo-700">
                {quiz.questions.length} questions
              </span>

              <span className="rounded-full bg-blue-50 px-4 py-2 text-blue-700">
                ⏱ {quiz.estimatedTime}
              </span>

              <span className="rounded-full bg-amber-50 px-4 py-2 text-amber-700">
                ⭐ {quiz.questions.length * 10} XP
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onDiscard}
            disabled={saving}
            className="rounded-xl border border-slate-300 px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Generate Another
          </button>
        </div>
      </Card>

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

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            type="button"
            onClick={onSave}
            disabled={saving || Boolean(savedQuizId)}
            className="rounded-xl bg-green-600 px-6 py-4 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving Quiz..."
              : savedQuizId
                ? "✅ Quiz Saved"
                : "💾 Save Quiz"}
          </button>

          <button
            type="button"
            onClick={onDiscard}
            disabled={saving}
            className="rounded-xl border border-slate-300 px-6 py-4 font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Discard Quiz
          </button>
        </div>

        {savedQuizId && (
          <p className="mt-4 text-sm font-semibold text-green-700">
            Quiz saved successfully. Reference: {savedQuizId}
          </p>
        )}
      </Card>
    </div>
  );
}