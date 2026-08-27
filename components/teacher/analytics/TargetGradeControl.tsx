"use client";

import {
  Check,
  Pencil,
  Target,
  X,
} from "lucide-react";
import {
  useState,
} from "react";
import toast from "react-hot-toast";

import {
  getTargetGradeOptions,
  saveStudentTargetGrade,
} from "@/services/analytics/targetGradeService";

import type {
  AnalyticsQualification,
  GradeLabel,
} from "@/types/analytics";

export default function TargetGradeControl({
  studentId,
  classId,
  teacherId,
  qualification,
  value,
  onSaved,
}: {
  studentId: string;
  classId: string;
  teacherId: string;
  qualification: AnalyticsQualification;
  value: GradeLabel | null;
  onSaved?: (
    grade: GradeLabel | null,
  ) => void;
}) {
  const [
    editing,
    setEditing,
  ] = useState(false);

  const [
    selected,
    setSelected,
  ] = useState(
    value || "",
  );

  const [
    saving,
    setSaving,
  ] = useState(false);

  function beginEditing() {
    setSelected(
      value || "",
    );

    setEditing(true);
  }

  function cancel() {
    setSelected(
      value || "",
    );

    setEditing(false);
  }

  async function save() {
    try {
      setSaving(true);

      const nextGrade =
        selected
          ? (selected as GradeLabel)
          : null;

      await saveStudentTargetGrade({
        studentId,
        classId,
        teacherId,
        qualification,
        targetGrade:
          nextGrade,
      });

      toast.success(
        nextGrade
          ? `Target grade set to ${nextGrade}.`
          : "Target grade cleared.",
      );

      setEditing(false);

      onSaved?.(
        nextGrade,
      );
    } catch (error) {
      console.error(
        "Unable to save target grade:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Target grade could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <div className="flex min-w-[190px] items-center gap-2">
        <div className="flex min-h-10 min-w-[58px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3">
          <span className="text-lg font-black text-slate-950">
            {value || "—"}
          </span>
        </div>

        <button
          type="button"
          onClick={beginEditing}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-teal-600 px-3 text-xs font-black text-white transition hover:bg-teal-700"
        >
          {value ? (
            <>
              <Pencil className="h-3.5 w-3.5" />
              Edit target
            </>
          ) : (
            <>
              <Target className="h-3.5 w-3.5" />
              Set target
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-w-[260px] items-center gap-2">
      <select
        value={selected}
        onChange={(
          event,
        ) =>
          setSelected(
            event.target.value,
          )
        }
        className="min-h-10 flex-1 rounded-xl border border-teal-300 bg-white px-3 text-sm font-black text-slate-800 outline-none focus:ring-2 focus:ring-teal-100"
        autoFocus
      >
        <option value="">
          Not set
        </option>

        {getTargetGradeOptions(
          qualification,
        ).map(
          (grade) => (
            <option
              key={grade}
              value={grade}
            >
              {grade}
            </option>
          ),
        )}
      </select>

      <button
        type="button"
        onClick={() =>
          void save()
        }
        disabled={
          saving ||
          selected ===
            (value || "")
        }
        title="Save target grade"
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Check className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={cancel}
        disabled={saving}
        title="Cancel"
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
