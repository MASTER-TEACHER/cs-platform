"use client";

import {
  RotateCcw,
  Save,
  ShieldCheck,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import {
  clearExamBoundaryConfiguration,
  saveExamBoundaryConfiguration,
} from "@/services/analytics/examBoundaryConfigurationService";
import type {
  ExamAssignment,
} from "@/types/examAssignment";
import type {
  AnalyticsBoundarySource,
  GradeLabel,
} from "@/types/analytics";
import type {
  ExamGradeIntelligence,
} from "@/types/examIntelligence";

export default function ExamGradeBoundaryCard({
  assignment,
  gradeIntelligence,
}: {
  assignment: ExamAssignment;
  gradeIntelligence: ExamGradeIntelligence;
}) {
  const [source, setSource] =
    useState<AnalyticsBoundarySource>(
      gradeIntelligence.boundarySource,
    );

  const [title, setTitle] =
    useState(
      gradeIntelligence.boundarySetTitle,
    );

  const [academicYear, setAcademicYear] =
    useState(
      gradeIntelligence.boundaryAcademicYear ||
        "",
    );

  const [
    assessmentTitle,
    setAssessmentTitle,
  ] = useState(
    gradeIntelligence.boundaryAssessmentTitle ||
      assignment.title,
  );

  const [sourceNote, setSourceNote] =
    useState(
      gradeIntelligence.boundarySourceNote ||
        "",
    );

  const [saving, setSaving] =
    useState(false);

  const initialRows = useMemo(
    () =>
      gradeIntelligence.boundaries
        .filter(
          (boundary) =>
            boundary.grade !== "U",
        )
        .map((boundary) => ({
          grade: boundary.grade,
          minimumMark:
            String(
              boundary.minimumMark,
            ),
        })),
    [gradeIntelligence.boundaries],
  );

  const [rows, setRows] =
    useState(initialRows);

  function updateRow(
    grade: GradeLabel,
    value: string,
  ) {
    setRows((current) =>
      current.map((row) =>
        row.grade === grade
          ? {
              ...row,
              minimumMark: value,
            }
          : row,
      ),
    );
  }

  async function save() {
    try {
      setSaving(true);

      await saveExamBoundaryConfiguration({
        assignmentId:
          assignment.id,
        teacherId:
          assignment.teacherId,
        qualification:
          gradeIntelligence.qualification,
        examBoard:
          assignment.questionSetSnapshot
            .examBoard || "",
        academicYear,
        assessmentTitle,
        title,
        source,
        sourceNote,
        totalMarks:
          gradeIntelligence.totalMarks,
        boundaries:
          rows.map((row) => ({
            grade: row.grade,
            minimumMark:
              Number(row.minimumMark),
          })),
      });

      toast.success(
        "Assessment grade boundaries saved.",
      );

      window.location.reload();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Grade boundaries could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function reset() {
    try {
      setSaving(true);

      await clearExamBoundaryConfiguration({
        assignmentId:
          assignment.id,
        teacherId:
          assignment.teacherId,
      });

      toast.success(
        "Paper returned to the CS Master indicative fallback.",
      );

      window.location.reload();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "The boundary configuration could not be cleared.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="overflow-hidden rounded-3xl border border-indigo-200 p-0">
      <div className="bg-gradient-to-r from-indigo-950 to-violet-800 p-6 text-white">
        <div className="flex items-center gap-2 text-indigo-200">
          <ShieldCheck className="h-5 w-5" />

          <p className="text-xs font-black uppercase tracking-[0.16em]">
            Grade boundary provenance
          </p>
        </div>

        <h3 className="mt-2 text-2xl font-black">
          Configure this assessment&apos;s grade boundaries
        </h3>

        <p className="mt-2 max-w-4xl text-sm leading-6 text-white/75">
          Use verified official boundaries when this is a known exam paper,
          teacher boundaries for internal assessments, or keep the CS Master
          indicative fallback. The source is carried into QLA and CSV exports.
        </p>
      </div>

      <div className="p-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <label>
            <span className="text-sm font-black text-slate-900">
              Boundary source
            </span>

            <select
              value={source}
              onChange={(event) =>
                setSource(
                  event.target.value as AnalyticsBoundarySource,
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
            >
              <option value="indicative">
                Indicative
              </option>
              <option value="teacher">
                Teacher
              </option>
              <option value="official">
                Official
              </option>
            </select>
          </label>

          <label>
            <span className="text-sm font-black text-slate-900">
              Boundary-set title
            </span>

            <input
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
            />
          </label>

          <label>
            <span className="text-sm font-black text-slate-900">
              Academic year / series
            </span>

            <input
              value={academicYear}
              onChange={(event) =>
                setAcademicYear(
                  event.target.value,
                )
              }
              placeholder="e.g. June 2026"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
            />
          </label>

          <label>
            <span className="text-sm font-black text-slate-900">
              Assessment title
            </span>

            <input
              value={assessmentTitle}
              onChange={(event) =>
                setAssessmentTitle(
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
            />
          </label>
        </div>

        {source === "official" && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-900">
            Mark a set as Official only after checking the published exam-board
            boundary document for the correct board, series and paper. CS Master
            does not invent official grade boundaries.
          </div>
        )}

        <div className="mt-6">
          <p className="text-sm font-black text-slate-900">
            Minimum marks
          </p>

          <div className="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {rows.map((row) => (
              <label
                key={row.grade}
                className="rounded-2xl bg-slate-50 p-4"
              >
                <span className="text-xs font-black uppercase text-slate-500">
                  Grade {row.grade}
                </span>

                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={
                      gradeIntelligence.totalMarks
                    }
                    value={row.minimumMark}
                    onChange={(event) =>
                      updateRow(
                        row.grade,
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 font-black"
                  />

                  <span className="text-xs font-bold text-slate-400">
                    /{gradeIntelligence.totalMarks}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <label className="mt-6 block">
          <span className="text-sm font-black text-slate-900">
            Source / verification note
          </span>

          <textarea
            rows={3}
            value={sourceNote}
            onChange={(event) =>
              setSourceNote(
                event.target.value,
              )
            }
            placeholder="For official boundaries, record the published source or verification note. For teacher boundaries, record how they were agreed."
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
          />
        </label>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={() => void reset()}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-black text-slate-700 disabled:opacity-60"
          >
            <RotateCcw className="h-4 w-4" />
            Use indicative fallback
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-black text-white disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving
              ? "Saving..."
              : "Save grade boundaries"}
          </button>
        </div>
      </div>
    </Card>
  );
}
