"use client";

import Card from "@/components/ui/Card";
import type { AssignmentWizardClass } from "@/types/assignmentWizard";

type AssignmentClassStepProps = {
  classes: AssignmentWizardClass[];
  selectedClassIds: string[];
  loading: boolean;
  onToggleClass: (classId: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function AssignmentClassStep({
  classes,
  selectedClassIds,
  loading,
  onToggleClass,
  onBack,
  onNext,
}: AssignmentClassStepProps) {
  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
        Step 2 of 4
      </p>

      <h2 className="mt-2 text-2xl font-bold text-slate-900">
        Choose Classes
      </h2>

      <p className="mt-2 text-slate-600">
        Select one or more classes that should receive this assignment.
      </p>

      {loading ? (
        <div className="mt-6 space-y-4">
          <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      ) : classes.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-amber-50 p-6 text-center">
          <div className="text-4xl">🏫</div>

          <h3 className="mt-4 text-xl font-bold text-slate-900">
            No classes available
          </h3>

          <p className="mt-2 text-slate-600">
            Create a class before using the assignment wizard.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {classes.map((classItem) => {
            const selected = selectedClassIds.includes(classItem.id);

            return (
              <button
                key={classItem.id}
                type="button"
                onClick={() => onToggleClass(classItem.id)}
                className={`rounded-2xl border p-5 text-left transition ${
                  selected
                    ? "border-teal-500 bg-teal-50 ring-2 ring-teal-100"
                    : "border-slate-200 bg-slate-50 hover:border-teal-300 hover:bg-teal-50/50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
                      {classItem.yearGroup}
                    </p>

                    <h3 className="mt-2 text-lg font-bold text-slate-900">
                      {classItem.name}
                    </h3>
                  </div>

                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold ${
                      selected
                        ? "border-teal-600 bg-teal-600 text-white"
                        : "border-slate-300 bg-white text-slate-400"
                    }`}
                  >
                    {selected ? "✓" : ""}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

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
          disabled={selectedClassIds.length === 0}
          className="rounded-xl bg-teal-600 px-6 py-3 font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue →
        </button>
      </div>
    </Card>
  );
}