"use client";

import Card from "@/components/ui/Card";

type AssignmentDetailsStepProps = {
  dueDate: string;
  instructions: string;
  onDueDateChange: (value: string) => void;
  onInstructionsChange: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function AssignmentDetailsStep({
  dueDate,
  instructions,
  onDueDateChange,
  onInstructionsChange,
  onBack,
  onNext,
}: AssignmentDetailsStepProps) {
  const canContinue =
    dueDate.trim().length > 0 && instructions.trim().length > 0;

  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
        Step 3 of 4
      </p>

      <h2 className="mt-2 text-2xl font-bold text-slate-900">
        Assignment Details
      </h2>

      <p className="mt-2 text-slate-600">
        Add a deadline and clear instructions for students.
      </p>

      <div className="mt-6 space-y-5">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">
            Due date
          </span>

          <input
            type="date"
            value={dueDate}
            onChange={(event) => onDueDateChange(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">
            Instructions
          </span>

          <textarea
            value={instructions}
            onChange={(event) =>
              onInstructionsChange(event.target.value)
            }
            placeholder="Explain what students need to complete."
            rows={5}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            required
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className="rounded-xl bg-teal-600 px-6 py-3 font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Review Assignment →
        </button>
      </div>
    </Card>
  );
}