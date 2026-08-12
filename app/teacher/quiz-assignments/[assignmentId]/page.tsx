"use client";

import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Brain,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Search,
  Trophy,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import {
  getTeacherQuizAssignmentDetail,
  type TeacherQuizAssignmentDetail,
  type TeacherQuizStudentResult,
} from "@/services/teacherQuizAssignmentService";

type ResultFilter = "all" | "completed" | "not_started";

function formatDate(value: Date | null, includeTime = false): string {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    includeTime
      ? {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      : {
          day: "2-digit",
          month: "long",
          year: "numeric",
        },
  ).format(value);
}

function formatDuration(seconds: number): string {
  if (seconds <= 0) {
    return "—";
  }

  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

function getGrade(percentage: number): string {
  if (percentage >= 90) return "9";
  if (percentage >= 80) return "8";
  if (percentage >= 70) return "7";
  if (percentage >= 60) return "6";
  if (percentage >= 50) return "5";
  if (percentage >= 40) return "4";
  if (percentage >= 30) return "3";
  if (percentage >= 20) return "2";

  return "1";
}

function escapeCsvValue(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export default function TeacherQuizMarkbookPage() {
  const params = useParams<{
    assignmentId: string;
  }>();

  const assignmentId = params.assignmentId;

  const { user } = useAuth();

  const [detail, setDetail] = useState<TeacherQuizAssignmentDetail | null>(
    null,
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [filter, setFilter] = useState<ResultFilter>("all");

  const loadMarkbook = useCallback(async () => {
    if (!assignmentId || !user?.uid) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const loadedDetail = await getTeacherQuizAssignmentDetail(
        assignmentId,
        user.uid,
      );

      if (!loadedDetail) {
        setDetail(null);

        setError(
          "This quiz assignment could not be found or you do not have permission to view it.",
        );

        return;
      }

      setDetail(loadedDetail);
    } catch (caughtError) {
      console.error("Failed to load quiz markbook:", caughtError);

      setDetail(null);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The quiz markbook could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [assignmentId, user?.uid]);

  useEffect(() => {
    void loadMarkbook();
  }, [loadMarkbook]);

  const completedStudents = useMemo(
    () =>
      detail?.students.filter((student) => student.status === "completed") ??
      [],
    [detail],
  );

  const notStartedStudents = useMemo(
    () =>
      detail?.students.filter((student) => student.status === "not_started") ??
      [],
    [detail],
  );

  const highestPercentage = useMemo(() => {
    if (completedStudents.length === 0) {
      return 0;
    }

    return Math.max(...completedStudents.map((student) => student.percentage));
  }, [completedStudents]);

  const lowestPercentage = useMemo(() => {
    if (completedStudents.length === 0) {
      return 0;
    }

    return Math.min(...completedStudents.map((student) => student.percentage));
  }, [completedStudents]);

  const filteredStudents = useMemo(() => {
    if (!detail) {
      return [];
    }

    const search = searchTerm.trim().toLowerCase();

    return detail.students.filter((student) => {
      const matchesFilter = filter === "all" || student.status === filter;

      const matchesSearch =
        !search ||
        student.studentName.toLowerCase().includes(search) ||
        student.studentEmail.toLowerCase().includes(search);

      return matchesFilter && matchesSearch;
    });
  }, [detail, filter, searchTerm]);

  function exportCsv() {
    if (!detail) {
      return;
    }

    const headings = [
      "Student Name",
      "Email",
      "Status",
      "Score",
      "Total Questions",
      "Percentage",
      "Grade",
      "XP",
      "Time Taken",
      "Completed At",
    ];

    const records = detail.students.map((student) => [
      student.studentName,
      student.studentEmail,
      student.status === "completed" ? "Completed" : "Not Started",
      student.status === "completed" ? `${student.score}` : "",
      student.status === "completed" ? `${student.totalQuestions}` : "",
      student.status === "completed" ? `${student.percentage}%` : "",
      student.status === "completed" ? getGrade(student.percentage) : "",
      student.status === "completed" ? `${student.earnedXP}` : "",
      student.status === "completed"
        ? formatDuration(student.timeTakenSeconds)
        : "",
      formatDate(student.completedAt, true),
    ]);

    const csvContent = [
      headings.map(escapeCsvValue).join(","),

      ...records.map((record) => record.map(escapeCsvValue).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");

    const safeTitle = detail.assignment.title
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();

    anchor.href = url;
    anchor.download = `${safeTitle || "quiz"}-markbook.csv`;

    document.body.appendChild(anchor);

    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-72 w-full rounded-3xl" />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
        </div>

        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  if (!detail || error) {
    return (
      <Card className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-red-600" />

        <h1 className="mt-5 text-2xl font-black text-red-950">
          Markbook unavailable
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-sm text-red-800">
          {error || "The quiz markbook could not be loaded."}
        </p>

        <Link
          href="/teacher/quiz-assignments"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white"
        >
          Back to quiz markbooks
        </Link>
      </Card>
    );
  }

  const { assignment } = detail;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-violet-700 via-indigo-700 to-blue-700 p-7 text-white shadow-xl sm:p-9">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-4xl">
            <Link
              href="/teacher/quiz-assignments"
              className="inline-flex items-center gap-2 text-sm font-bold text-violet-100 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              All quiz markbooks
            </Link>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold">
                Quiz
              </span>

              <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold">
                {assignment.className}
              </span>

              <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold capitalize">
                {assignment.status}
              </span>
            </div>

            <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-violet-100">
              Quiz markbook
            </p>

            <h1 className="mt-2 text-3xl font-black sm:text-4xl">
              {assignment.title}
            </h1>

            {assignment.description && (
              <p className="mt-4 max-w-3xl text-sm leading-7 text-violet-100">
                {assignment.description}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-violet-100">
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4" />
                {assignment.studentCount} students
              </span>

              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Due {formatDate(assignment.dueDate)}
              </span>

              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {assignment.completedCount} completed
              </span>
            </div>
          </div>

          <div className="w-full rounded-3xl border border-white/20 bg-white/10 p-6 xl:w-80">
            <p className="text-sm font-bold text-violet-100">Class average</p>

            <p className="mt-1 text-4xl font-black">
              {assignment.averagePercentage}%
            </p>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white"
                style={{
                  width: `${assignment.averagePercentage}%`,
                }}
              />
            </div>

            <p className="mt-3 text-sm text-violet-100">
              {assignment.completionPercentage}% submission rate
            </p>

            <button
              type="button"
              onClick={exportCsv}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-indigo-700 transition hover:bg-violet-50"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Completed"
          value={completedStudents.length}
          description={`${assignment.completionPercentage}% submitted`}
          icon={<CheckCircle2 className="h-6 w-6" />}
          iconClassName="bg-emerald-50 text-emerald-600"
        />

        <SummaryCard
          label="Not Started"
          value={notStartedStudents.length}
          description="Awaiting submission"
          icon={<XCircle className="h-6 w-6" />}
          iconClassName="bg-slate-100 text-slate-600"
        />

        <SummaryCard
          label="Highest Score"
          value={`${highestPercentage}%`}
          description={
            completedStudents.length
              ? `Grade ${getGrade(highestPercentage)}`
              : "No submissions"
          }
          icon={<Trophy className="h-6 w-6" />}
          iconClassName="bg-amber-50 text-amber-600"
        />

        <SummaryCard
          label="Lowest Score"
          value={`${lowestPercentage}%`}
          description={
            completedStudents.length
              ? `Grade ${getGrade(lowestPercentage)}`
              : "No submissions"
          }
          icon={<BarChart3 className="h-6 w-6" />}
          iconClassName="bg-blue-50 text-blue-600"
        />
      </section>

      <Card className="overflow-hidden rounded-3xl border border-slate-200 p-0">
        <div className="border-b border-slate-200 p-6 sm:p-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">
                Student results
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Class markbook
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search students..."
                  className="min-h-11 w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:w-72"
                />
              </label>

              <select
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value as ResultFilter)
                }
                className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold"
              >
                <option value="all">All students</option>

                <option value="completed">Completed</option>

                <option value="not_started">Not started</option>
              </select>
            </div>
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto h-10 w-10 text-slate-400" />

            <h3 className="mt-4 text-xl font-black text-slate-950">
              No matching students
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing the search or filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4">Student</th>

                  <th className="px-6 py-4">Status</th>

                  <th className="px-6 py-4">Score</th>

                  <th className="px-6 py-4">Percentage</th>

                  <th className="px-6 py-4">Grade</th>

                  <th className="px-6 py-4">XP</th>

                  <th className="px-6 py-4">Time</th>

                  <th className="px-6 py-4">Completed</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => (
                  <StudentRow key={student.studentId} student={student} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 text-sm font-semibold text-slate-500">
          Showing {filteredStudents.length} of {detail.students.length} students
        </div>
      </Card>
    </div>
  );
}

function StudentRow({ student }: { student: TeacherQuizStudentResult }) {
  const completed = student.status === "completed";

  const initials = student.studentName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <tr className="transition hover:bg-slate-50">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-sm font-black text-violet-700">
            {initials || "ST"}
          </div>

          <div>
            <p className="font-bold text-slate-950">{student.studentName}</p>

            <p className="mt-1 text-sm text-slate-500">
              {student.studentEmail}
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-5">
        {completed ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Completed
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
            <Clock3 className="h-3.5 w-3.5" />
            Not Started
          </span>
        )}
      </td>

      <td className="px-6 py-5 font-semibold text-slate-700">
        {completed ? `${student.score}/${student.totalQuestions}` : "—"}
      </td>

      <td className="px-6 py-5 font-semibold text-slate-700">
        {completed ? `${student.percentage}%` : "—"}
      </td>

      <td className="px-6 py-5">
        {completed ? (
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 font-black text-indigo-700">
            {getGrade(student.percentage)}
          </span>
        ) : (
          "—"
        )}
      </td>

      <td className="px-6 py-5 font-semibold text-slate-700">
        {completed ? `⭐ ${student.earnedXP}` : "—"}
      </td>

      <td className="px-6 py-5 font-semibold text-slate-700">
        {completed ? formatDuration(student.timeTakenSeconds) : "—"}
      </td>

      <td className="px-6 py-5 text-sm font-medium text-slate-600">
        {completed ? formatDate(student.completedAt, true) : "—"}
      </td>
    </tr>
  );
}

function SummaryCard({
  label,
  value,
  description,
  icon,
  iconClassName,
}: {
  label: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  iconClassName: string;
}) {
  return (
    <Card className="rounded-3xl border border-slate-200 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>

          <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>

          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClassName}`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
