"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  addStudentToClass,
  ClassStudent,
  removeStudentFromClass,
} from "@/services/classService";

import {
  getAllStudents,
  searchStudents,
  StudentDirectoryRecord,
} from "@/services/studentProfileService";

type ClassStudentsManagerProps = {
  classId: string;
  students: ClassStudent[];
  onStudentsChanged: (students: ClassStudent[]) => void;
};

function getInitials(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "S"
  );
}

function formatCourse(student: StudentDirectoryRecord): string {
  const qualification = student.qualification.trim().toUpperCase();

  const examBoard = student.examBoard.trim().toUpperCase();

  if (qualification && examBoard) {
    return `${qualification} · ${examBoard}`;
  }

  return qualification || examBoard || "Course not selected";
}

export default function ClassStudentsManager({
  classId,
  students,
  onStudentsChanged,
}: ClassStudentsManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [directoryStudents, setDirectoryStudents] = useState<
    StudentDirectoryRecord[]
  >([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [isLoadingDirectory, setIsLoadingDirectory] = useState(false);

  const [enrollingStudentId, setEnrollingStudentId] = useState<string | null>(
    null,
  );

  const [removingStudentId, setRemovingStudentId] = useState<string | null>(
    null,
  );

  const [studentToRemove, setStudentToRemove] = useState<ClassStudent | null>(
    null,
  );

  const enrolledStudentIds = useMemo(
    () => new Set(students.map((student) => student.studentId)),
    [students],
  );

  const availableStudents = useMemo(() => {
    const searchedStudents = searchStudents(directoryStudents, searchTerm);

    return searchedStudents.filter(
      (student) => !enrolledStudentIds.has(student.uid),
    );
  }, [directoryStudents, enrolledStudentIds, searchTerm]);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    async function loadDirectory() {
      try {
        setIsLoadingDirectory(true);

        const loadedStudents = await getAllStudents();

        setDirectoryStudents(loadedStudents);
      } catch (error) {
        console.error("Unable to load students:", error);

        toast.error("Unable to load the student directory.");
      } finally {
        setIsLoadingDirectory(false);
      }
    }

    void loadDirectory();
  }, [isModalOpen]);

  function openModal() {
    setSearchTerm("");
    setIsModalOpen(true);
  }

  function closeModal() {
    if (enrollingStudentId) {
      return;
    }

    setIsModalOpen(false);
    setSearchTerm("");
  }

  async function handleEnrolStudent(student: StudentDirectoryRecord) {
    const classStudent: ClassStudent = {
      studentId: student.uid,
      displayName: student.name || "Unnamed Student",
      email: student.email || "",
    };

    try {
      setEnrollingStudentId(student.uid);

      await addStudentToClass(classId, classStudent);

      onStudentsChanged([...students, classStudent]);

      toast.success(`${classStudent.displayName} enrolled successfully.`);
    } catch (error) {
      console.error("Unable to enrol student:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to enrol this student.",
      );
    } finally {
      setEnrollingStudentId(null);
    }
  }

  async function confirmRemoveStudent() {
    if (!studentToRemove) {
      return;
    }

    try {
      setRemovingStudentId(studentToRemove.studentId);

      await removeStudentFromClass(classId, studentToRemove);

      onStudentsChanged(
        students.filter(
          (student) => student.studentId !== studentToRemove.studentId,
        ),
      );

      toast.success(
        `${studentToRemove.displayName || "Student"} removed from the class.`,
      );

      setStudentToRemove(null);
    } catch (error) {
      console.error("Unable to remove student:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to remove this student.",
      );
    } finally {
      setRemovingStudentId(null);
    }
  }

  return (
    <>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Class students</h2>

            <p className="mt-1 text-sm text-slate-500">
              {students.length} student
              {students.length === 1 ? "" : "s"} currently enrolled.
            </p>
          </div>

          <button
            type="button"
            onClick={openModal}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            + Add student
          </button>
        </div>

        {students.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <div className="text-4xl">👨‍🎓</div>

            <h3 className="mt-4 font-semibold text-slate-900">
              No students enrolled
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Add registered student accounts to begin assigning resources and
              tracking class progress.
            </p>

            <button
              type="button"
              onClick={openModal}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Add your first student
            </button>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
            <div className="hidden grid-cols-[1fr_1.2fr_auto_auto] gap-4 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid">
              <span>Student</span>
              <span>Email</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-slate-200">
              {students.map((student) => (
                <div
                  key={student.studentId}
                  className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_1.2fr_auto_auto] sm:items-center"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                      {getInitials(student.displayName)}
                    </div>

                    <p className="truncate font-semibold text-slate-900">
                      {student.displayName || "Unnamed Student"}
                    </p>
                  </div>

                  <p className="truncate text-sm text-slate-600">
                    {student.email || "No email address"}
                  </p>

                  <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Enrolled
                  </span>

                  <button
                    type="button"
                    onClick={() => setStudentToRemove(student)}
                    disabled={removingStudentId === student.studentId}
                    className="w-fit rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-student-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                  Student enrolment
                </p>

                <h2
                  id="add-student-title"
                  className="mt-2 text-2xl font-bold text-slate-900"
                >
                  Add student
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Select an existing registered student account.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close enrolment window"
              >
                ×
              </button>
            </div>

            <div className="border-b border-slate-200 p-6">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Search students
                </span>

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by name or email..."
                  autoFocus
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {isLoadingDirectory ? (
                <div className="space-y-3">
                  {Array.from({
                    length: 4,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="h-24 animate-pulse rounded-2xl bg-slate-200"
                    />
                  ))}
                </div>
              ) : availableStudents.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                  <div className="text-4xl">🔍</div>

                  <h3 className="mt-4 font-semibold text-slate-900">
                    No available students
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Every matching student is already enrolled, or no registered
                    account matches your search.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableStudents.map((student) => {
                    const isEnrolling = enrollingStudentId === student.uid;

                    return (
                      <article
                        key={student.uid}
                        className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/40 sm:flex-row sm:items-center"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 font-bold text-blue-700">
                            {getInitials(student.name)}
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate font-bold text-slate-900">
                              {student.name || "Unnamed Student"}
                            </h3>

                            <p className="mt-1 truncate text-sm text-slate-500">
                              {student.email || "No email address"}
                            </p>

                            <p className="mt-1 text-xs font-semibold text-blue-700">
                              {formatCourse(student)}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => void handleEnrolStudent(student)}
                          disabled={Boolean(enrollingStudentId)}
                          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isEnrolling ? "Enrolling..." : "Enrol"}
                        </button>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-slate-200 p-6">
              <button
                type="button"
                onClick={closeModal}
                disabled={Boolean(enrollingStudentId)}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {studentToRemove && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="remove-student-title"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-2xl">
              ⚠️
            </div>

            <h2
              id="remove-student-title"
              className="mt-5 text-2xl font-bold text-slate-900"
            >
              Remove student?
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              <span className="font-semibold text-slate-900">
                {studentToRemove.displayName || "This student"}
              </span>{" "}
              will be removed from this class. Their account and learning
              progress will not be deleted.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setStudentToRemove(null)}
                disabled={Boolean(removingStudentId)}
                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void confirmRemoveStudent()}
                disabled={Boolean(removingStudentId)}
                className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {removingStudentId ? "Removing..." : "Remove student"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
