"use client";

import { useCallback } from "react";

import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";

import {
  createTeacherClass,
  getTeacherClasses,
  type TeacherClass,
} from "@/services/classService";

import type {
  ExamBoard,
  Qualification,
} from "@/types/user";

import {
  getUnifiedTeacherAssignments,
  type UnifiedTeacherAssignment,
} from "@/services/unifiedTeacherAssignmentService";

type StatusFilter =
  | "active"
  | "archived"
  | "all";

function defaultAcademicYear(): string {
  const now = new Date();

  const year =
    now.getFullYear();

  /*
   * Treat August onward as preparation for the new UK academic year.
   */
  const startYear =
    now.getMonth() >= 7
      ? year
      : year - 1;

  return `${startYear}/${startYear + 1}`;
}

function qualificationLabel(
  qualification:
    Qualification | "",
): string {
  if (
    qualification ===
    "A_LEVEL"
  ) {
    return "A Level";
  }

  return qualification || "Not set";
}

export default function TeacherClassesPage() {
  const {
    user,
    profile,
    loading: authLoading,
    profileReady,
  } = useAuth();

  const [classes, setClasses] =
    useState<
      TeacherClass[]
    >([]);

  const [
    unifiedAssignments,
    setUnifiedAssignments,
  ] = useState<
    UnifiedTeacherAssignment[]
  >([]);

  const [
    loadingClasses,
    setLoadingClasses,
  ] = useState(true);

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [
    className,
    setClassName,
  ] = useState("");

  const [
    yearGroup,
    setYearGroup,
  ] = useState("");

  const [subject, setSubject] =
    useState(
      "Computer Science",
    );

  const [
    academicYear,
    setAcademicYear,
  ] = useState(
    defaultAcademicYear(),
  );

  const [
    qualification,
    setQualification,
  ] =
    useState<
      Qualification | ""
    >("GCSE");

  const [
    examBoard,
    setExamBoard,
  ] =
    useState<
      ExamBoard | ""
    >("OCR");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<StatusFilter>(
      "active",
    );

  const loadClasses = useCallback(() => {
    if (!user?.uid) {
      return Promise.resolve().then(() => {
        setClasses([]);
        setUnifiedAssignments([]);
        setLoadingClasses(false);
      });
    }

    const teacherId = user.uid;

    return Promise.resolve()
      .then(() => {
        setLoadingClasses(true);

        return Promise.all([
          getTeacherClasses(
            teacherId,
          ),
          getUnifiedTeacherAssignments(
            teacherId,
          ),
        ]);
      })
      .then(([
        loaded,
        assignmentSummary,
      ]) => {
        setClasses(
          loaded,
        );

        setUnifiedAssignments(
          assignmentSummary.assignments,
        );
      })
      .catch((error) => {
        console.error(
          "Failed to load classes:",
          error,
        );

        toast.error(
          "Could not load your classes.",
        );
      })
      .finally(() => {
        setLoadingClasses(
          false,
        );
      });
  }, [user]);

  useEffect(() => {
    if (
      authLoading ||
      !profileReady
    ) {
      return;
    }

    void loadClasses();
  }, [
    authLoading,
    profileReady,
    loadClasses,
  ]);

  const visibleClasses =
    useMemo(() => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();

      return classes.filter(
        (item) => {
          const matchesStatus =
            statusFilter ===
              "all" ||
            item.status ===
              statusFilter;

          if (
            !matchesStatus
          ) {
            return false;
          }

          if (!search) {
            return true;
          }

          return [
            item.name,
            item.subject,
            item.yearGroup,
            item.academicYear,
            item.qualification,
            item.examBoard,
          ].some(
            (value) =>
              value
                .toLowerCase()
                .includes(
                  search,
                ),
          );
        },
      );
    }, [
      classes,
      searchTerm,
      statusFilter,
    ]);

  const activeClasses =
    classes.filter(
      (item) =>
        item.status ===
        "active",
    );

  const totalStudents =
    activeClasses.reduce(
      (
        total,
        item,
      ) =>
        total +
        item.studentIds.length,
      0,
    );

  const activeClassIds =
    new Set(
      activeClasses.map(
        (item) => item.id,
      ),
    );

  const totalAssignments =
    unifiedAssignments.filter(
      (assignment) =>
        activeClassIds.has(
          assignment.classId,
        ),
    ).length;

  const assignmentCountByClass =
    useMemo(() => {
      const counts =
        new Map<string, number>();

      unifiedAssignments.forEach(
        (assignment) => {
          counts.set(
            assignment.classId,
            (counts.get(
              assignment.classId,
            ) || 0) + 1,
          );
        },
      );

      return counts;
    }, [
      unifiedAssignments,
    ]);

  async function handleCreateClass(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!user?.uid) {
      toast.error(
        "You must be logged in as a teacher.",
      );
      return;
    }

    if (
      !profile?.schoolId
    ) {
      toast.error(
        "Create or join your school organisation before creating classes.",
      );
      return;
    }

    if (
      !className.trim() ||
      !yearGroup.trim() ||
      !academicYear.trim() ||
      !qualification ||
      !examBoard
    ) {
      toast.error(
        "Complete every required class field.",
      );
      return;
    }

    try {
      setSubmitting(true);

      await createTeacherClass({
        name:
          className,

        subject,

        yearGroup,

        academicYear,

        qualification,

        examBoard,

        teacherId:
          user.uid,

        teacherName:
          profile?.name ||
          user.displayName ||
          user.email ||
          "Teacher",

        schoolId:
          profile.schoolId,
      });

      toast.success(
        "Class created successfully.",
      );

      setClassName("");
      setYearGroup("");
      setSubject(
        "Computer Science",
      );
      setAcademicYear(
        defaultAcademicYear(),
      );
      setQualification(
        "GCSE",
      );
      setExamBoard(
        "OCR",
      );
      setShowForm(false);

      await loadClasses();
    } catch (error) {
      console.error(
        "Create class error:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not create the class.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (
    authLoading ||
    !profileReady ||
    loadingClasses
  ) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-52 w-full" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>

        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-100">
              Teacher Portal
            </p>

            <h1 className="mt-3 text-4xl font-extrabold">
              Manage Classes
            </h1>

            <p className="mt-3 max-w-2xl text-emerald-100">
              Create school-scoped teaching groups, manage curriculum settings,
              organise students and monitor assignments.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/teacher/school"
              className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20"
            >
              School
            </Link>

            <button
              type="button"
              onClick={() =>
                setShowForm(
                  (current) =>
                    !current,
                )
              }
              className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-teal-800 shadow-sm transition hover:bg-emerald-50"
            >
              {showForm
                ? "Close form"
                : "+ Create class"}
            </button>
          </div>
        </div>
      </Card>

      {!profile?.schoolId && (
        <Card className="border border-amber-200 bg-amber-50">
          <h2 className="font-black text-amber-950">
            School setup required
          </h2>

          <p className="mt-2 text-sm leading-6 text-amber-800">
            New classes must belong to a school organisation so students remain
            isolated from other schools.
          </p>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Metric
          label="Active classes"
          value={
            activeClasses.length
          }
        />

        <Metric
          label="Students"
          value={
            totalStudents
          }
        />

        <Metric
          label="Assignments"
          value={
            totalAssignments
          }
        />
      </div>

      {showForm && (
        <Card className="border border-teal-200">
          <p className="text-sm font-black uppercase tracking-wide text-teal-600">
            New teaching group
          </p>

          <h2 className="mt-2 text-2xl font-black text-slate-950">
            Create a class
          </h2>

          <form
            onSubmit={
              handleCreateClass
            }
            className="mt-6 grid gap-5 md:grid-cols-2"
          >
            <Field
              label="Class name"
              value={
                className
              }
              onChange={
                setClassName
              }
              placeholder="e.g. Year 11 CS Group"
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
              label="Subject"
              value={
                subject
              }
              onChange={
                setSubject
              }
              placeholder="Computer Science"
            />

            <Field
              label="Academic year"
              value={
                academicYear
              }
              onChange={
                setAcademicYear
              }
              placeholder="2026/2027"
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
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              >
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
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              >
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

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={
                  submitting ||
                  !profile?.schoolId
                }
                className="rounded-xl bg-teal-600 px-6 py-3 font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Creating..."
                  : "Create class"}
              </button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-slate-500">
              Class directory
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Your classes
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={
                searchTerm
              }
              onChange={(
                event,
              ) =>
                setSearchTerm(
                  event.target
                    .value,
                )
              }
              placeholder="Search classes..."
              className="min-w-[240px] rounded-xl border border-slate-300 px-4 py-3"
            />

            <select
              value={
                statusFilter
              }
              onChange={(
                event,
              ) =>
                setStatusFilter(
                  event.target
                    .value as
                    StatusFilter,
                )
              }
              className="rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="active">
                Active
              </option>

              <option value="archived">
                Archived
              </option>

              <option value="all">
                All classes
              </option>
            </select>
          </div>
        </div>

        {visibleClasses.length ===
        0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <h3 className="font-black text-slate-900">
              No classes found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Create a class or adjust the current search/filter.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            {visibleClasses.map(
              (
                classItem,
              ) => (
                <article
                  key={
                    classItem.id
                  }
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black uppercase text-teal-700">
                          {classItem.yearGroup ||
                            "Year group"}
                        </span>

                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                          {classItem.examBoard ||
                            "Board"}{" "}
                          {qualificationLabel(
                            classItem.qualification,
                          )}
                        </span>

                        {classItem.status ===
                          "archived" && (
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
                            Archived
                          </span>
                        )}
                      </div>

                      <h3 className="mt-3 text-xl font-black text-slate-950">
                        {classItem.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {classItem.subject ||
                          "Computer Science"}{" "}
                        ·{" "}
                        {classItem.academicYear ||
                          "Academic year not set"}
                      </p>
                    </div>

                    <Link
                      href={`/teacher/classes/${classItem.id}`}
                      className="shrink-0 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                      Open class
                    </Link>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <MiniMetric
                      label="Students"
                      value={
                        classItem
                          .studentIds
                          .length
                      }
                    />

                    <MiniMetric
                      label="Assignments"
                      value={
                        assignmentCountByClass.get(
                          classItem.id,
                        ) || 0
                      }
                    />
                  </div>
                </article>
              ),
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <Card>
      <p className="text-sm font-semibold text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-slate-950">
        {value}
      </p>
    </Card>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-black text-slate-900">
        {value}
      </p>
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
        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
      />
    </label>
  );
}
