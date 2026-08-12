"use client";

import type { GeneratedExamQuestionSet } from "../../../types/examQuestion";

type Props = {
  questionSet: GeneratedExamQuestionSet;
  saving: boolean;
  savedQuestionSetId: string | null;
  onChange: (questionSet: GeneratedExamQuestionSet) => void;
  onSave: () => void;
  onDiscard: () => void;
};

export default function EditableExamQuestionPreview({
  questionSet,
  saving,
  savedQuestionSetId,
  onChange,
  onSave,
  onDiscard,
}: Props) {
  function updateQuestion(
    questionId: string,
    field: "question" | "modelAnswer" | "examinerGuidance",
    value: string,
  ) {
    onChange({
      ...questionSet,
      questions: questionSet.questions.map((question) => {
        if (question.id !== questionId) {
          return question;
        }

        if (field === "examinerGuidance") {
          return {
            ...question,
            examinerGuidance: value
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean),
          };
        }

        return {
          ...question,
          [field]: value,
        };
      }),
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">
          Generated paper
        </p>

        <h2 className="mt-2 text-3xl font-black text-slate-950">
          {questionSet.title}
        </h2>

        <p className="mt-3 text-slate-600">{questionSet.description}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
            {questionSet.questionCount} questions
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
            {questionSet.totalMarks} marks
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
            {questionSet.estimatedTime}
          </span>
        </div>

        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          {questionSet.copyrightNotice}
        </div>
      </div>

      {questionSet.questions.map((question) => (
        <section
          key={question.id}
          className="rounded-3xl border border-slate-200 bg-white p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-black text-slate-950">
              Question {question.questionNumber}
            </p>

            <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-bold text-indigo-800">
              {question.marks} marks
            </span>
          </div>

          <p className="mt-4 text-sm font-bold uppercase tracking-wide text-slate-500">
            {question.commandWord} · {question.assessmentObjective}
          </p>

          {question.context && (
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              {question.context}
            </div>
          )}

          <label className="mt-5 block">
            <span className="text-sm font-bold text-slate-700">Question</span>
            <textarea
              rows={4}
              value={question.question}
              onChange={(event) =>
                updateQuestion(question.id, "question", event.target.value)
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="font-black text-emerald-950">Mark scheme</p>

            <div className="mt-3 space-y-2">
              {question.markScheme.map((markPoint) => (
                <div
                  key={markPoint.id}
                  className="flex items-start justify-between gap-4 rounded-xl bg-white p-3"
                >
                  <p className="text-sm leading-6 text-slate-700">
                    {markPoint.description}
                  </p>

                  <span className="shrink-0 font-bold text-emerald-800">
                    {markPoint.marks}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <label className="mt-5 block">
            <span className="text-sm font-bold text-slate-700">
              Model answer
            </span>
            <textarea
              rows={5}
              value={question.modelAnswer}
              onChange={(event) =>
                updateQuestion(question.id, "modelAnswer", event.target.value)
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label className="mt-5 block">
            <span className="text-sm font-bold text-slate-700">
              Examiner guidance
            </span>
            <textarea
              rows={4}
              value={question.examinerGuidance.join("\n")}
              onChange={(event) =>
                updateQuestion(
                  question.id,
                  "examinerGuidance",
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>
        </section>
      ))}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onSave}
          disabled={saving || Boolean(savedQuestionSetId)}
          className="rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:bg-slate-300"
        >
          {savedQuestionSetId
            ? "Saved to Question Bank"
            : saving
              ? "Saving..."
              : "Save to Question Bank"}
        </button>

        <button
          type="button"
          onClick={onDiscard}
          className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
        >
          Discard
        </button>
      </div>
    </div>
  );
}
