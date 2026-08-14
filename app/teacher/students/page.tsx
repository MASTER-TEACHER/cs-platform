"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import StudentsIntelligencePanel from "@/components/teacher/intelligence/StudentsIntelligencePanel";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import {
  getAllStudents,
  searchStudents,
  StudentDirectoryRecord,
} from "@/services/studentProfileService";

type CourseFilter = "all" | "gcse" | "a-level" | "other";

type MembershipFilter = "all" | "enrolled" | "unassigned";

function formatQualification(qualification: string): string {
  const cleanedQualification = qualification.trim().toLowerCase();

  if (!cleanedQualification) {
    return "Course not selected";
  }

  if (
    cleanedQualification === "gcse" ||
    cleanedQualification.includes("gcse")
  ) {
    return "GCSE";
  }

  if (
    cleanedQualification === "a-level" ||
    cleanedQualification === "alevel" ||
    cleanedQualification.includes("a level")
  ) {
    return "A Level";
  }

  return qualification
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function formatExamBoard(examBoard: string): string {
  const cleanedExamBoard = examBoard.trim();

  if (!cleanedExamBoard) {
    return "Exam board not selected";
  }

  return cleanedExamBoard.toUpperCase();
}

function getCourseCategory(student: StudentDirectoryRecord): CourseFilter {
  const qualification = student.qualification.trim().toLowerCase();

  if (qualification.includes("gcse")) {
    return "gcse";
  }

  if (
    qualification.includes("a-level") ||
    qualification.includes("a level") ||
    qualification.includes("alevel")
  ) {
    return "a-level";
  }

  return "other";
}

function getInitials(name: string): string {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "S";
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-GB").format(value);
}

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<StudentDirectoryRecord[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [courseFilter, setCourseFilter] = useState<CourseFilter>("all");

  const [membershipFilter, setMembershipFilter] =
    useState<MembershipFilter>("all");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStudents() {
      try {
        setLoading(true);
        setError("");

        const loadedStudents = await getAllStudents();

        setStudents(loadedStudents);
      } catch (loadError) {
        console.error("Failed to load student directory:", loadError);

        const message =
          loadError instanceof Error
            ? loadError.message
            : "Could not load the student directory.";

        setError(message);
        toast.error("Could not load student accounts.");
      } finally {
        setLoading(false);
      }
    }

    void loadStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    let result = searchStudents(students, searchTerm);

    if (courseFilter !== "all") {
      result = result.filter(
        (student) => getCourseCategory(student) === courseFilter,
      );
    }

    if (membershipFilter === "enrolled") {
      result = result.filter((student) => student.classIds.length > 0);
    }

    if (membershipFilter === "unassigned") {
      result = result.filter((student) => student.classIds.length === 0);
    }

    return result;
  }, [courseFilter, membershipFilter, searchTerm, students]);

  const totalStudents = students.length;

  const enrolledStudents = useMemo(
    () => students.filter((student) => student.classIds.length > 0).length,
    [students],
  );

  const unassignedStudents = totalStudents - enrolledStudents;

  const averageXp = useMemo(() => {
    if (students.length === 0) {
      return 0;
    }

    const totalXp = students.reduce((total, student) => total + student.xp, 0);

    return Math.round(totalXp / students.length);
  }, [students]);

  const averageStreak = useMemo(() => {
    if (students.length === 0) {
      return 0;
    }

    const totalStreak = students.reduce(
      (total, student) => total + student.streak,
      0,
    );

    return Math.round(totalStreak / students.length);
  }, [students]);

  function clearFilters() {
    setSearchTerm("");
    setCourseFilter("all");
    setMembershipFilter("all");
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-52 w-full" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>

        <Skeleton className="h-32 w-full" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <Skeleton key={index} className="h-72" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 text-white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">
              Teacher Portal
            </p>

            <h1 className="mt-3 text-4xl font-extrabold">Student Directory</h1>

            <p className="mt-3 max-w-2xl leading-7 text-blue-100">
              Browse registered student accounts, review course information and
              prepare students for class enrolment.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/teacher/classes"
              className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-center font-bold text-white transition hover:bg-white/20"
            >
              View Classes
            </Link>

            <Link
              href="/teacher"
              className="rounded-xl bg-white px-5 py-3 text-center font-bold text-indigo-700 transition hover:bg-blue-50"
            >
              ← Teacher Dashboard
            </Link>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total Students"
          value={formatNumber(totalStudents)}
          description="Registered student accounts"
          icon="👨‍🎓"
        />

        <SummaryCard
          label="Enrolled"
          value={formatNumber(enrolledStudents)}
          description="Students linked to classes"
          icon="🏫"
        />

        <SummaryCard
          label="Unassigned"
          value={formatNumber(unassignedStudents)}
          description="Not currently in a class"
          icon="📌"
        />

        <SummaryCard
          label="Average XP"
          value={formatNumber(averageXp)}
          description={`${averageStreak}-day average streak`}
          icon="⭐"
        />
      </div>
<StudentsIntelligencePanel />
      <Card>
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Search and Filter
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Find Students
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Search by student name or email address.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_220px_220px_auto]">
            <label className="block">
              <span className="sr-only">Search students</span>

              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name or email..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>

            <label className="block">
              <span className="sr-only">Filter by course</span>

              <select
                value={courseFilter}
                onChange={(event) =>
                  setCourseFilter(event.target.value as CourseFilter)
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="all">All courses</option>

                <option value="gcse">GCSE</option>

                <option value="a-level">A Level</option>

                <option value="other">Other / not selected</option>
              </select>
            </label>

            <label className="block">
              <span className="sr-only">Filter by class membership</span>

              <select
                value={membershipFilter}
                onChange={(event) =>
                  setMembershipFilter(event.target.value as MembershipFilter)
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="all">All students</option>

                <option value="enrolled">Enrolled</option>

                <option value="unassigned">Unassigned</option>
              </select>
            </label>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl border border-slate-300 px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Clear
            </button>
          </div>
        </div>
      </Card>

      {error ? (
        <Card className="border-red-200">
          <div className="rounded-2xl bg-red-50 p-6">
            <h2 className="text-xl font-bold text-red-900">
              Student directory unavailable
            </h2>

            <p className="mt-2 text-red-700">{error}</p>

            <p className="mt-3 text-sm text-red-600">
              This may be caused by Firestore permissions. The teacher account
              must be allowed to read registered student profiles.
            </p>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                Registered Accounts
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Students
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                Showing{" "}
                <span className="font-bold text-slate-900">
                  {filteredStudents.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-900">
                  {students.length}
                </span>{" "}
                students.
              </p>
            </div>

            <Link
              href="/teacher/classes"
              className="rounded-xl bg-indigo-600 px-5 py-3 text-center font-bold text-white transition hover:bg-indigo-700"
            >
              Manage Classes
            </Link>
          </div>

          {students.length === 0 ? (
            <EmptyState
              icon="👨‍🎓"
              title="No student accounts found"
              description="Students will appear here after registering with the student role."
            />
          ) : filteredStudents.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No matching students"
              description="Try changing the search text or clearing the selected filters."
              actionLabel="Clear filters"
              onAction={clearFilters}
            />
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredStudents.map((student) => (
                <StudentCard key={student.uid} student={student} />
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

function StudentCard({ student }: { student: StudentDirectoryRecord }) {
  const qualification = formatQualification(student.qualification);

  const examBoard = formatExamBoard(student.examBoard);

  const hasCourse =
    Boolean(student.qualification.trim()) || Boolean(student.examBoard.trim());

  const classCount = student.classIds.length;

  return (
    <article className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-indigo-200 hover:bg-white hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-lg font-extrabold text-indigo-700">
            {getInitials(student.name)}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-slate-900">
              {student.name}
            </h3>

            <p className="mt-1 truncate text-sm text-slate-600">
              {student.email || "No email address"}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
            classCount > 0
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {classCount > 0 ? "Enrolled" : "Unassigned"}
        </span>
      </div>

      <div className="mt-5 rounded-2xl bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Current Course
        </p>

        <p className="mt-2 font-bold text-slate-900">
          {hasCourse
            ? `${qualification} · ${examBoard}`
            : "Course not selected"}
        </p>

        {student.currentCourse && (
          <p className="mt-1 text-xs text-slate-500">{student.currentCourse}</p>
        )}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <StudentMetric label="XP" value={formatNumber(student.xp)} />

        <StudentMetric label="Streak" value={`${student.streak}d`} />

        <StudentMetric label="Classes" value={classCount.toString()} />
      </div>

      <div className="mt-5 border-t border-slate-200 pt-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Progress
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {student.completedLessons.length} lessons completed
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Topics
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {student.completedTopics.length}
            </p>
          </div>
        </div>
      </div>

      <Link
        href={`/teacher/students/${student.uid}`}
        className="mt-5 block w-full rounded-xl bg-teal-600 px-4 py-3 text-center font-bold text-white transition hover:bg-teal-700"
      >
        View Student Profile →
      </Link>
    </article>
  );
}

function StudentMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white px-3 py-4 text-center">
      <p className="text-lg font-extrabold text-slate-900">{value}</p>

      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: string;
  description: string;
  icon: string;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>

          <p className="mt-2 text-3xl font-extrabold text-slate-900">{value}</p>

          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>

        <div className="text-3xl">{icon}</div>
      </div>
    </Card>
  );
}

function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
      <div className="text-5xl">{icon}</div>

      <h3 className="mt-4 text-xl font-bold text-slate-900">{title}</h3>

      <p className="mx-auto mt-2 max-w-lg leading-7 text-slate-600">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-700"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
