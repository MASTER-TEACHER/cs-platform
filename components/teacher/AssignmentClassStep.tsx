"use client";

import Card from "@/components/ui/Card";
import type {
  AssignmentRecipientMode,
  AssignmentWizardClass,
} from "@/types/assignmentWizard";

type AssignmentClassStepProps = {
  classes: AssignmentWizardClass[];
  recipientMode: AssignmentRecipientMode;
  selectedClassIds: string[];
  selectedStudentIds: string[];
  loading: boolean;
  onRecipientModeChange: (mode: AssignmentRecipientMode) => void;
  onToggleClass: (classId: string) => void;
  onToggleStudent: (studentId: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function AssignmentClassStep({
  classes,
  recipientMode,
  selectedClassIds,
  selectedStudentIds,
  loading,
  onRecipientModeChange,
  onToggleClass,
  onToggleStudent,
  onBack,
  onNext,
}: AssignmentClassStepProps) {
  const recipientCount =
    recipientMode === "classes"
      ? selectedClassIds.length
      : selectedStudentIds.length;

  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
        Step 2 of 4
      </p>

      <h2 className="mt-2 text-2xl font-bold text-slate-900">
        Choose Recipients
      </h2>

      <p className="mt-2 text-slate-600">
        Assign this work to one or more whole classes, or target individual
        students for focused practice, reassessment or follow-up work.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onRecipientModeChange("classes")}
          className={`rounded-2xl border-2 p-5 text-left transition ${
            recipientMode === "classes"
              ? "border-teal-500 bg-teal-50 ring-2 ring-teal-100"
              : "border-slate-200 bg-white hover:border-teal-300"
          }`}
        >
          <p className="font-black text-slate-950">Whole class/classes</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Every enrolled student in each selected class receives the work.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onRecipientModeChange("students")}
          className={`rounded-2xl border-2 p-5 text-left transition ${
            recipientMode === "students"
              ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100"
              : "border-slate-200 bg-white hover:border-indigo-300"
          }`}
        >
          <p className="font-black text-slate-950">Individual student(s)</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Choose exactly which enrolled students should receive the work.
          </p>
        </button>
      </div>

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
            Create a class and enrol students before using the assignment wizard.
          </p>
        </div>
      ) : recipientMode === "classes" ? (
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
                    <p className="mt-2 text-sm text-slate-500">
                      {classItem.studentIds.length} enrolled student
                      {classItem.studentIds.length === 1 ? "" : "s"}
                    </p>
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
      ) : (
        <div className="mt-6 space-y-5">
          {classes.map((classItem) => (
            <div
              key={classItem.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-indigo-600">
                    {classItem.yearGroup}
                  </p>
                  <h3 className="mt-1 text-lg font-black text-slate-950">
                    {classItem.name}
                  </h3>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">
                  {classItem.students.length} student
                  {classItem.students.length === 1 ? "" : "s"}
                </span>
              </div>

              {classItem.students.length === 0 ? (
                <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                  This class has no enrolled students.
                </p>
              ) : (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {classItem.students.map((student) => {
                    const selected = selectedStudentIds.includes(student.id);

                    return (
                      <button
                        key={student.id}
                        type="button"
                        onClick={() => onToggleStudent(student.id)}
                        className={`flex items-center justify-between gap-4 rounded-xl border p-4 text-left transition ${
                          selected
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-slate-200 bg-white hover:border-indigo-300"
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="truncate font-bold text-slate-950">
                            {student.name}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {student.email || "No email available"}
                          </p>
                        </div>
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-black ${
                            selected
                              ? "border-indigo-600 bg-indigo-600 text-white"
                              : "border-slate-300 bg-white text-transparent"
                          }`}
                        >
                          ✓
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        {recipientMode === "classes"
          ? `${selectedClassIds.length} class${selectedClassIds.length === 1 ? "" : "es"} selected. Every enrolled student in those classes will receive the assignment.`
          : `${selectedStudentIds.length} individual student${selectedStudentIds.length === 1 ? "" : "s"} selected. Only those students will receive the assignment.`}
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
          disabled={recipientCount === 0}
          className="rounded-xl bg-teal-600 px-6 py-3 font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue →
        </button>
      </div>
    </Card>
  );
}
