"use client";

import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  School,
  Send,
  Users,
  X,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import toast from "react-hot-toast";

import { getTeacherClasses, TeacherClass } from "@/services/classService";

import { createResourceAssignment } from "@/services/resourceAssignmentService";

type AssignableResource = {
  id: string;
  title: string;
  topic: string;
  resourceType: string;
  status: string;
};

type AssignResourceModalProps = {
  isOpen: boolean;
  onClose: () => void;

  resource: AssignableResource;

  teacherId: string;
  teacherName?: string;

  onAssignmentCreated?: (assignmentId: string) => void;
};

function getMinimumDueDate(): string {
  const tomorrow = new Date();

  tomorrow.setDate(tomorrow.getDate() + 1);

  return tomorrow.toISOString().split("T")[0];
}

function formatClassDescription(teacherClass: TeacherClass): string {
  return [
    teacherClass.subject,
    teacherClass.yearGroup,
    teacherClass.academicYear,
  ]
    .filter(Boolean)
    .join(" · ");
}

export default function AssignResourceModal({
  isOpen,
  onClose,
  resource,
  teacherId,
  teacherName,
  onAssignmentCreated,
}: AssignResourceModalProps) {
  const [classes, setClasses] = useState<TeacherClass[]>([]);

  const [selectedClassId, setSelectedClassId] = useState("");

  const [dueDate, setDueDate] = useState("");

  const [instructions, setInstructions] = useState("");

  const [isLoadingClasses, setIsLoadingClasses] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loadError, setLoadError] = useState("");

  const activeClasses = useMemo(
    () => classes.filter((teacherClass) => teacherClass.status === "active"),
    [classes],
  );

  const selectedClass = useMemo(
    () =>
      activeClasses.find(
        (teacherClass) => teacherClass.id === selectedClassId,
      ) ?? null,
    [activeClasses, selectedClassId],
  );

  useEffect(() => {
    if (!isOpen || !teacherId) {
      return;
    }

    async function loadClasses() {
      try {
        setIsLoadingClasses(true);
        setLoadError("");

        const teacherClasses = await getTeacherClasses(teacherId);

        setClasses(teacherClasses);
      } catch (error) {
        console.error("Unable to load classes:", error);

        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load your classes.",
        );
      } finally {
        setIsLoadingClasses(false);
      }
    }

    void loadClasses();
  }, [isOpen, teacherId]);

  function resetForm() {
    setSelectedClassId("");
    setDueDate("");
    setInstructions("");
    setLoadError("");
  }

  function handleClose() {
    if (isSubmitting) {
      return;
    }

    resetForm();
    onClose();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (resource.status !== "published") {
      toast.error("Publish this resource before assigning it.");

      return;
    }

    if (!selectedClass) {
      toast.error("Select a class.");

      return;
    }

    if (selectedClass.studentIds.length === 0) {
      toast.error(
        "Add at least one student to this class before assigning work.",
      );

      return;
    }

    if (!dueDate) {
      toast.error("Select a due date.");

      return;
    }

    try {
      setIsSubmitting(true);

      const selectedDueDate = new Date(`${dueDate}T23:59:59`);

      const assignmentId = await createResourceAssignment({
        resourceId: resource.id,
        resourceTitle: resource.title,
        resourceTopic: resource.topic,
        resourceType: resource.resourceType,

        teacherId,
        teacherName: teacherName || "Teacher",

        classId: selectedClass.id,
        className: selectedClass.name,

        instructions,
        dueDate: selectedDueDate,

        studentIds: selectedClass.studentIds,
      });

      toast.success(`${resource.title} assigned to ${selectedClass.name}.`);

      onAssignmentCreated?.(assignmentId);

      resetForm();
      onClose();
    } catch (error) {
      console.error("Unable to create assignment:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to assign this resource.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assign-resource-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 p-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">
              Class assignment
            </p>

            <h2
              id="assign-resource-title"
              className="mt-2 text-2xl font-extrabold text-slate-950"
            >
              Assign resource
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Send this published resource to every student currently enrolled
              in a class.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
            aria-label="Close assignment window"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            <section className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                Resource
              </p>

              <h3 className="mt-2 font-bold text-indigo-950">
                {resource.title}
              </h3>

              <p className="mt-1 text-sm text-indigo-700">
                {resource.topic || "Teaching resource"}
              </p>
            </section>

            {resource.status !== "published" && (
              <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="font-bold text-amber-950">
                  Publish before assigning
                </p>

                <p className="mt-1 text-sm leading-6 text-amber-800">
                  Draft resources cannot be assigned to students.
                </p>
              </section>
            )}

            <section>
              <label
                htmlFor="assignment-class"
                className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800"
              >
                <School className="h-4 w-4 text-indigo-600" />
                Select class
              </label>

              {isLoadingClasses ? (
                <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-4 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading classes...
                </div>
              ) : loadError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {loadError}
                </div>
              ) : activeClasses.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                  <p className="font-bold text-slate-900">No active classes</p>

                  <p className="mt-2 text-sm text-slate-500">
                    Create an active class before assigning this resource.
                  </p>
                </div>
              ) : (
                <select
                  id="assignment-class"
                  value={selectedClassId}
                  onChange={(event) => setSelectedClassId(event.target.value)}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
                >
                  <option value="">Choose a class</option>

                  {activeClasses.map((teacherClass) => (
                    <option key={teacherClass.id} value={teacherClass.id}>
                      {teacherClass.name} — {teacherClass.studentIds.length}{" "}
                      student
                      {teacherClass.studentIds.length === 1 ? "" : "s"}
                    </option>
                  ))}
                </select>
              )}
            </section>

            {selectedClass && (
              <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <Users className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-950">
                      {selectedClass.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {formatClassDescription(selectedClass) ||
                        "Class information not specified"}
                    </p>

                    <p
                      className={`mt-2 text-sm font-bold ${
                        selectedClass.studentIds.length > 0
                          ? "text-emerald-700"
                          : "text-amber-700"
                      }`}
                    >
                      {selectedClass.studentIds.length} student
                      {selectedClass.studentIds.length === 1 ? "" : "s"} will
                      receive this assignment.
                    </p>
                  </div>
                </div>
              </section>
            )}

            <section>
              <label
                htmlFor="assignment-due-date"
                className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800"
              >
                <CalendarDays className="h-4 w-4 text-indigo-600" />
                Due date
              </label>

              <input
                id="assignment-due-date"
                type="date"
                value={dueDate}
                min={getMinimumDueDate()}
                onChange={(event) => setDueDate(event.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
              />
            </section>

            <section>
              <label
                htmlFor="assignment-instructions"
                className="mb-2 block text-sm font-bold text-slate-800"
              >
                Student instructions
              </label>

              <textarea
                id="assignment-instructions"
                value={instructions}
                onChange={(event) => setInstructions(event.target.value)}
                disabled={isSubmitting}
                rows={5}
                maxLength={1000}
                placeholder="Explain what students should complete, submit or prepare..."
                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
              />

              <div className="mt-2 flex justify-between gap-4 text-xs text-slate-500">
                <span>Optional</span>

                <span>
                  {instructions.length}
                  /1000
                </span>
              </div>
            </section>

            <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                <div>
                  <p className="font-bold text-emerald-950">
                    Assignment snapshot
                  </p>

                  <p className="mt-1 text-sm leading-6 text-emerald-800">
                    Students enrolled at the moment you assign the resource will
                    be included in this assignment.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 p-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-300 px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                isLoadingClasses ||
                resource.status !== "published" ||
                !selectedClass ||
                selectedClass.studentIds.length === 0 ||
                !dueDate
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Assign to class
                </>
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
