"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "@/contexts/AuthContext";
import { getTeacherClasses, type TeacherClass } from "@/services/classService";
import { createExamAssignment } from "@/services/examAssignmentService";
import type { SavedExamQuestionSet } from "@/services/examQuestionService";

type Props = {
  questionSet: SavedExamQuestionSet;
  onClose: () => void;
  onAssigned?: (assignmentId: string) => void;
};

export default function AssignExamModal({
  questionSet,
  onClose,
  onAssigned,
}: Props) {
  const { user } = useAuth();

  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [classId, setClassId] = useState("");
  const [title, setTitle] = useState(questionSet.title);
  const [instructions, setInstructions] = useState(
    "Answer every question. Show working where required.",
  );
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      if (!user?.uid) {
        return;
      }

      try {
        const loaded = await getTeacherClasses(user.uid);

        setClasses(loaded.filter((item) => item.status === "active"));
      } catch (error) {
        console.error(error);
        toast.error("Classes could not be loaded.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [user?.uid]);

  async function assign() {
    if (!user?.uid) {
      toast.error("You must be logged in.");
      return;
    }

    const selectedClass = classes.find((item) => item.id === classId);

    if (!selectedClass) {
      toast.error("Select a class.");
      return;
    }

    if (!dueDate) {
      toast.error("Select a due date.");
      return;
    }

    setSaving(true);

    try {
      const assignmentId = await createExamAssignment({
        teacherId: user.uid,
        teacherName: user.displayName || "Teacher",
        classId: selectedClass.id,
        className: selectedClass.name,
        studentIds: selectedClass.studentIds,
        questionSetId: questionSet.id,
        questionSetTitle: questionSet.title,
        questionSetSnapshot: questionSet.content,
        title,
        instructions,
        dueDate: new Date(`${dueDate}T23:59:59`),
      });

      toast.success("Exam assignment created.");

      onAssigned?.(assignmentId);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Assignment could not be created.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">
              Assign assessment
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-950">
              {questionSet.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-3 py-2 font-bold"
          >
            Close
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <label className="block">
            <span className="text-sm font-bold">Class</span>

            <select
              value={classId}
              onChange={(event) => setClassId(event.target.value)}
              disabled={loading}
              className="mt-2 w-full rounded-xl border px-4 py-3"
            >
              <option value="">Select a class</option>

              {classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.studentIds.length} students)
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold">Assignment title</span>

            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold">Instructions</span>

            <textarea
              rows={4}
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold">Due date</span>

            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3"
            />
          </label>
        </div>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-5 py-3 font-bold"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              void assign();
            }}
            disabled={saving}
            className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white disabled:bg-slate-300"
          >
            {saving ? "Assigning..." : "Assign to Class"}
          </button>
        </div>
      </div>
    </div>
  );
}
