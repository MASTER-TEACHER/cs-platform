"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import {
  archiveTeacherClass,
  deleteTeacherClass,
  ensureClassJoinCode,
  regenerateClassJoinCode,
  restoreTeacherClass,
  setClassJoinCodeEnabled,
  updateTeacherClass,
  type TeacherClass,
} from "@/services/classService";

import type {
  ExamBoard,
  Qualification,
} from "@/types/user";

type Props = {
  teacherClass: TeacherClass;

  onUpdated: (
    updatedClass:
      TeacherClass,
  ) => void;

  onDeleted: () => void;
};

export default function ClassSettingsPanel({
  teacherClass,
  onUpdated,
  onDeleted,
}: Props) {
  const [name, setName] =
    useState(
      teacherClass.name,
    );

  const [subject, setSubject] =
    useState(
      teacherClass.subject,
    );

  const [
    yearGroup,
    setYearGroup,
  ] = useState(
    teacherClass.yearGroup,
  );

  const [
    academicYear,
    setAcademicYear,
  ] = useState(
    teacherClass.academicYear,
  );

  const [
    qualification,
    setQualification,
  ] =
    useState<
      Qualification | ""
    >(
      teacherClass.qualification,
    );

  const [
    examBoard,
    setExamBoard,
  ] =
    useState<
      ExamBoard | ""
    >(
      teacherClass.examBoard,
    );

  const [saving, setSaving] =
    useState(false);

  const [
    changingStatus,
    setChangingStatus,
  ] = useState(false);

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const [
    joinCode,
    setJoinCode,
  ] = useState(
    teacherClass.joinCode,
  );

  const [
    joinCodeEnabled,
    setJoinCodeEnabledState,
  ] = useState(
    teacherClass.joinCodeEnabled,
  );

  const [
    updatingJoinCode,
    setUpdatingJoinCode,
  ] = useState(false);

  async function createJoinCode() {
    try {
      setUpdatingJoinCode(
        true,
      );

      const code =
        await ensureClassJoinCode(
          teacherClass.id,
        );

      setJoinCode(code);
      setJoinCodeEnabledState(
        true,
      );

      onUpdated({
        ...teacherClass,
        joinCode:
          code,
        joinCodeEnabled:
          true,
      });

      toast.success(
        "Permanent class code is ready.",
      );
    } catch (error) {
      console.error(
        "Unable to create class join code:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "The class code could not be created.",
      );
    } finally {
      setUpdatingJoinCode(
        false,
      );
    }
  }

  async function regenerateJoinCode() {
    const confirmed =
      window.confirm(
        "Generate a new permanent class code? The old code will stop working immediately.",
      );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingJoinCode(
        true,
      );

      const code =
        await regenerateClassJoinCode(
          teacherClass.id,
        );

      setJoinCode(code);
      setJoinCodeEnabledState(
        true,
      );

      onUpdated({
        ...teacherClass,
        joinCode:
          code,
        joinCodeEnabled:
          true,
      });

      toast.success(
        "Class join code regenerated.",
      );
    } catch (error) {
      console.error(
        "Unable to regenerate class join code:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "The class code could not be regenerated.",
      );
    } finally {
      setUpdatingJoinCode(
        false,
      );
    }
  }

  async function toggleJoinCode() {
    try {
      setUpdatingJoinCode(
        true,
      );

      const next =
        !joinCodeEnabled;

      await setClassJoinCodeEnabled(
        teacherClass.id,
        next,
      );

      setJoinCodeEnabledState(
        next,
      );

      onUpdated({
        ...teacherClass,
        joinCode,
        joinCodeEnabled:
          next,
      });

      toast.success(
        next
          ? "Class code enabled."
          : "Class code disabled.",
      );
    } catch (error) {
      console.error(
        "Unable to change class code status:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "The class code status could not be changed.",
      );
    } finally {
      setUpdatingJoinCode(
        false,
      );
    }
  }

  async function copyJoinCode() {
    if (!joinCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        joinCode,
      );

      toast.success(
        "Class code copied.",
      );
    } catch {
      toast.error(
        "Copy the class code manually.",
      );
    }
  }

  async function save() {
    if (
      !name.trim() ||
      !yearGroup.trim() ||
      !academicYear.trim() ||
      !qualification ||
      !examBoard
    ) {
      toast.error(
        "Complete the class name, year group, academic year, qualification and exam board.",
      );

      return;
    }

    try {
      setSaving(true);

      await updateTeacherClass(
        teacherClass.id,
        {
          name,
          subject,
          yearGroup,
          academicYear,
          qualification,
          examBoard,
        },
      );

      onUpdated({
        ...teacherClass,

        name:
          name
            .trim()
            .replace(
              /\s+/g,
              " ",
            ),

        subject:
          subject.trim() ||
          "Computer Science",

        yearGroup:
          yearGroup.trim(),

        academicYear:
          academicYear.trim(),

        qualification,

        examBoard,
      });

      toast.success(
        "Class details updated.",
      );
    } catch (error) {
      console.error(
        "Unable to update class:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "The class could not be updated.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleArchive() {
    try {
      setChangingStatus(
        true,
      );

      if (
        teacherClass.status ===
        "active"
      ) {
        await archiveTeacherClass(
          teacherClass.id,
        );

        onUpdated({
          ...teacherClass,
          status:
            "archived",
        });

        toast.success(
          "Class archived.",
        );
      } else {
        await restoreTeacherClass(
          teacherClass.id,
        );

        onUpdated({
          ...teacherClass,
          status:
            "active",
        });

        toast.success(
          "Class restored.",
        );
      }
    } catch (error) {
      console.error(
        "Unable to change class status:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "The class status could not be changed.",
      );
    } finally {
      setChangingStatus(
        false,
      );
    }
  }

  async function removePermanently() {
    const confirmed =
      window.confirm(
        "Permanently delete this empty class? This cannot be undone. Classes with students or assignment history cannot be deleted.",
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await deleteTeacherClass(
        teacherClass.id,
      );

      toast.success(
        "Class deleted.",
      );

      onDeleted();
    } catch (error) {
      console.error(
        "Unable to delete class:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "The class could not be deleted.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.14em] text-teal-600">
            Class settings
          </p>

          <h2 className="mt-2 text-2xl font-black text-slate-950">
            Teaching group details
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Keep the class identity, curriculum and academic-year information accurate.
            Existing student progress and assignments are not changed when these details
            are edited.
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field
            label="Class name"
            value={name}
            onChange={
              setName
            }
            placeholder="e.g. Year 11 Computer Science"
          />

          <Field
            label="Subject"
            value={subject}
            onChange={
              setSubject
            }
            placeholder="Computer Science"
          />

          <Field
            label="Year group"
            value={
              yearGroup
            }
            onChange={
              setYearGroup
            }
            placeholder="e.g. Year 11"
          />

          <Field
            label="Academic year"
            value={
              academicYear
            }
            onChange={
              setAcademicYear
            }
            placeholder="e.g. 2026/2027"
          />

          <label>
            <span className="text-sm font-bold text-slate-700">
              Qualification
            </span>

            <select
              value={
                qualification
              }
              onChange={(
                event,
              ) =>
                setQualification(
                  event.target
                    .value as
                    | Qualification
                    | "",
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              <option value="">
                Select qualification
              </option>

              <option value="GCSE">
                GCSE
              </option>

              <option value="A_LEVEL">
                A Level
              </option>
            </select>
          </label>

          <label>
            <span className="text-sm font-bold text-slate-700">
              Exam board
            </span>

            <select
              value={
                examBoard
              }
              onChange={(
                event,
              ) =>
                setExamBoard(
                  event.target
                    .value as
                    | ExamBoard
                    | "",
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              <option value="">
                Select exam board
              </option>

              <option value="AQA">
                AQA
              </option>

              <option value="OCR">
                OCR
              </option>

              <option value="EDEXCEL">
                Pearson Edexcel
              </option>
            </select>
          </label>
        </div>

        <button
          type="button"
          onClick={() =>
            void save()
          }
          disabled={
            saving
          }
          className="mt-6 rounded-xl bg-teal-600 px-6 py-3 font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? "Saving..."
            : "Save class details"}
        </button>
      </section>

      <section className="rounded-3xl border border-blue-200 bg-blue-50 p-6">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-blue-700">
          Permanent class code
        </p>

        <h2 className="mt-2 text-xl font-black text-blue-950">
          Student self-enrolment
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-blue-800">
          Share this code with the whole class. It is reusable and is not consumed
          when a student joins. It remains the class code until you regenerate it.
          You can temporarily disable it without changing the code.
        </p>

        {joinCode ? (
          <>
            <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-blue-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                  Class join code
                </p>

                <p className="mt-2 font-mono text-3xl font-black tracking-[0.18em] text-slate-950">
                  {joinCode}
                </p>

                <p className={`mt-2 text-sm font-bold ${
                  joinCodeEnabled
                    ? "text-emerald-700"
                    : "text-red-700"
                }`}>
                  {joinCodeEnabled
                    ? "Active - students can join"
                    : "Disabled - students cannot join"}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  void copyJoinCode()
                }
                className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800"
              >
                Copy code
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  void toggleJoinCode()
                }
                disabled={
                  updatingJoinCode
                }
                className="rounded-xl border border-blue-300 bg-white px-5 py-3 font-bold text-blue-800 hover:bg-blue-100 disabled:opacity-60"
              >
                {updatingJoinCode
                  ? "Updating..."
                  : joinCodeEnabled
                    ? "Disable joining"
                    : "Enable joining"}
              </button>

              <button
                type="button"
                onClick={() =>
                  void regenerateJoinCode()
                }
                disabled={
                  updatingJoinCode
                }
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Generate new code
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() =>
              void createJoinCode()
            }
            disabled={
              updatingJoinCode
            }
            className="mt-5 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {updatingJoinCode
              ? "Creating..."
              : "Create permanent class code"}
          </button>
        )}
      </section>

      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-amber-700">
          Class lifecycle
        </p>

        <h2 className="mt-2 text-xl font-black text-amber-950">
          {teacherClass.status ===
          "active"
            ? "Archive this class"
            : "Restore this class"}
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-amber-800">
          Archiving keeps student membership, assignment history and analytics intact
          while removing the class from the normal active-class workflow.
        </p>

        <button
          type="button"
          onClick={() =>
            void toggleArchive()
          }
          disabled={
            changingStatus
          }
          className="mt-5 rounded-xl border border-amber-300 bg-white px-5 py-3 font-bold text-amber-800 transition hover:bg-amber-100 disabled:opacity-60"
        >
          {changingStatus
            ? "Updating..."
            : teacherClass.status ===
                "active"
              ? "Archive class"
              : "Restore class"}
        </button>
      </section>

      <section className="rounded-3xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-red-700">
          Danger zone
        </p>

        <h2 className="mt-2 text-xl font-black text-red-950">
          Permanently delete an empty class
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-red-800">
          Permanent deletion is intentionally restricted. A class containing students
          or assignment history must be archived instead.
        </p>

        <button
          type="button"
          onClick={() =>
            void removePermanently()
          }
          disabled={
            deleting
          }
          className="mt-5 rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
        >
          {deleting
            ? "Deleting..."
            : "Delete empty class"}
        </button>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  placeholder: string;
}) {
  return (
    <label>
      <span className="text-sm font-bold text-slate-700">
        {label}
      </span>

      <input
        type="text"
        value={value}
        onChange={(
          event,
        ) =>
          onChange(
            event.target.value,
          )
        }
        placeholder={
          placeholder
        }
        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
      />
    </label>
  );
}
