"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChangeEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  ExternalLink,
  Loader2,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import {
  getAssignmentById,
  getStudentAssignmentProgress,
  ResourceAssignment,
  StudentAssignmentProgress,
  StudentAssignmentStatus,
} from "@/services/resourceAssignmentService";

type StudentProfile = {
  id: string;
  name: string;
  email: string;
};

type StudentProgressRow = {
  student: StudentProfile;
  progress: StudentAssignmentProgress;
};

type StatusFilter = "all" | StudentAssignmentStatus;

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

function formatResourceType(value: string): string {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatStatus(status: StudentAssignmentStatus): string {
  if (status === "in_progress") {
    return "In Progress";
  }

  if (status === "completed") {
    return "Completed";
  }

  return "Not Started";
}

function escapeCsvValue(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function getDueDateInformation(dueDate: Date | null): {
  label: string;
  overdue: boolean;
} {
  if (!dueDate) {
    return {
      label: "No due date",
      overdue: false,
    };
  }

  const today = new Date();
  const due = new Date(dueDate);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const differenceInDays = Math.ceil(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (differenceInDays < 0) {
    const overdueDays = Math.abs(differenceInDays);

    return {
      label: `${overdueDays} ${overdueDays === 1 ? "day" : "days"} overdue`,
      overdue: true,
    };
  }

  if (differenceInDays === 0) {
    return {
      label: "Due today",
      overdue: false,
    };
  }

  if (differenceInDays === 1) {
    return {
      label: "Due tomorrow",
      overdue: false,
    };
  }

  return {
    label: `${differenceInDays} days remaining`,
    overdue: false,
  };
}

export default function TeacherResourceAssignmentPage() {
  const params = useParams<{
    assignmentId: string;
  }>();

  const assignmentId = params.assignmentId;
  const { user } = useAuth();

  const [assignment, setAssignment] = useState<ResourceAssignment | null>(null);

  const [rows, setRows] = useState<StudentProgressRow[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [exporting, setExporting] = useState(false);

  const loadAssignment = useCallback(async () => {
    if (!assignmentId || !user?.uid) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const loadedAssignment = await getAssignmentById(assignmentId);

      if (!loadedAssignment) {
        setAssignment(null);
        setRows([]);

        setError("This resource assignment could not be found.");

        return;
      }

      if (loadedAssignment.teacherId !== user.uid) {
        setAssignment(null);
        setRows([]);

        setError("You do not have permission to view this assignment.");

        return;
      }

      const loadedRows = await Promise.all(
        loadedAssignment.studentIds.map(async (studentId) => {
          const [profileSnapshot, progress] = await Promise.all([
            getDoc(doc(db, "users", studentId)),
            getStudentAssignmentProgress(loadedAssignment.id, studentId),
          ]);

          const profileData = profileSnapshot.exists()
            ? profileSnapshot.data()
            : null;

          return {
            student: {
              id: studentId,
              name: profileData?.name || "Student",
              email: profileData?.email || "No email available",
            },
            progress,
          } satisfies StudentProgressRow;
        }),
      );

      loadedRows.sort((first, second) =>
        first.student.name.localeCompare(second.student.name),
      );

      setAssignment(loadedAssignment);
      setRows(loadedRows);
    } catch (caughtError) {
      console.error("Failed to load assignment progress:", caughtError);

      setAssignment(null);
      setRows([]);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The assignment dashboard could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [assignmentId, user?.uid]);

  useEffect(() => {
    void loadAssignment();
  }, [loadAssignment]);

  const completedRows = useMemo(
    () => rows.filter(({ progress }) => progress.status === "completed"),
    [rows],
  );

  const inProgressRows = useMemo(
    () => rows.filter(({ progress }) => progress.status === "in_progress"),
    [rows],
  );

  const notStartedRows = useMemo(
    () => rows.filter(({ progress }) => progress.status === "not_started"),
    [rows],
  );

  const completionPercentage =
    rows.length > 0
      ? Math.round((completedRows.length / rows.length) * 100)
      : 0;

  const filteredRows = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return rows.filter(({ student, progress }) => {
      const matchesStatus =
        statusFilter === "all" || progress.status === statusFilter;

      const matchesSearch =
        !search ||
        student.name.toLowerCase().includes(search) ||
        student.email.toLowerCase().includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [rows, searchTerm, statusFilter]);

  const dueInformation = useMemo(
    () => getDueDateInformation(assignment?.dueDate ?? null),
    [assignment?.dueDate],
  );

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
  }

  function exportCsv() {
    if (!assignment) {
      return;
    }

    try {
      setExporting(true);

      const headings = [
        "Student Name",
        "Email",
        "Status",
        "Started At",
        "Completed At",
        "Assignment",
        "Class",
        "Due Date",
      ];

      const records = rows.map(({ student, progress }) => [
        student.name,
        student.email,
        formatStatus(progress.status),
        formatDate(progress.startedAt, true),
        formatDate(progress.completedAt, true),
        assignment.resourceTitle,
        assignment.className,
        formatDate(assignment.dueDate),
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

      const safeTitle = assignment.resourceTitle
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase();

      anchor.href = url;
      anchor.download = `${safeTitle || "assignment-progress"}-progress.csv`;

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
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

        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  if (!assignment || error) {
    return (
      <Card className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-red-600" />

        <h1 className="mt-5 text-2xl font-black text-red-950">
          Assignment unavailable
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-sm text-red-800">
          {error || "This assignment could not be loaded."}
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              void loadAssignment();
            }}
            className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white"
          >
            Try again
          </button>

          <Link
            href="/teacher/assignments"
            className="rounded-xl border border-red-300 bg-white px-5 py-3 text-sm font-bold text-red-700"
          >
            Back to assignments
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-700 p-7 text-white shadow-xl sm:p-9">
        <div className="flex flex-col gap-8 xl:flex-row xl:justify-between">
          <div className="max-w-4xl">
            <Link
              href="/teacher/assignments"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-100 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              All assignments
            </Link>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold">
                {formatResourceType(assignment.resourceType)}
              </span>

              <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold">
                {assignment.className}
              </span>

              <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold capitalize">
                {assignment.status}
              </span>
            </div>

            <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-emerald-100">
              Resource assignment
            </p>

            <h1 className="mt-2 text-3xl font-black sm:text-4xl">
              {assignment.resourceTitle}
            </h1>

            <p className="mt-3 font-semibold text-emerald-100">
              {assignment.resourceTopic}
            </p>

            {assignment.instructions && (
              <p className="mt-5 max-w-3xl whitespace-pre-line text-sm leading-7 text-emerald-50">
                {assignment.instructions}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-emerald-100">
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4" />
                {rows.length} {rows.length === 1 ? "student" : "students"}
              </span>

              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Due {formatDate(assignment.dueDate)}
              </span>

              <span
                className={`inline-flex items-center gap-2 font-bold ${
                  dueInformation.overdue ? "text-amber-200" : ""
                }`}
              >
                <Clock3 className="h-4 w-4" />
                {dueInformation.label}
              </span>
            </div>
          </div>

          <div className="w-full rounded-3xl border border-white/20 bg-white/10 p-6 xl:w-80">
            <p className="text-sm font-bold text-emerald-100">Completion</p>

            <p className="mt-1 text-4xl font-black">{completionPercentage}%</p>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white"
                style={{
                  width: `${completionPercentage}%`,
                }}
              />
            </div>

            <p className="mt-3 text-sm text-emerald-100">
              {completedRows.length} of {rows.length} students completed
            </p>

            <div className="mt-6 grid gap-3">
              <Link
                href={`/teacher/resources/${assignment.resourceId}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-teal-700"
              >
                <BookOpen className="h-4 w-4" />
                View resource
                <ExternalLink className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={exportCsv}
                disabled={exporting || rows.length === 0}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                {exporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total Students"
          value={rows.length}
          description="Assigned students"
          icon={<Users className="h-6 w-6" />}
          iconClassName="bg-blue-50 text-blue-600"
        />

        <SummaryCard
          label="Completed"
          value={completedRows.length}
          description={`${completionPercentage}% completion`}
          icon={<CheckCircle2 className="h-6 w-6" />}
          iconClassName="bg-emerald-50 text-emerald-600"
        />

        <SummaryCard
          label="In Progress"
          value={inProgressRows.length}
          description="Currently working"
          icon={<Clock3 className="h-6 w-6" />}
          iconClassName="bg-amber-50 text-amber-600"
        />

        <SummaryCard
          label="Not Started"
          value={notStartedRows.length}
          description="May need support"
          icon={<XCircle className="h-6 w-6" />}
          iconClassName="bg-slate-100 text-slate-600"
        />
      </div>

      <Card className="overflow-hidden rounded-3xl border border-slate-200 p-0">
        <div className="border-b border-slate-200 p-6 sm:p-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-600">
                Student progress
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Completion tracker
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search students..."
                  className="min-h-11 w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm sm:w-72"
                />
              </label>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as StatusFilter)
                }
                className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold"
              >
                <option value="all">All statuses</option>
                <option value="completed">Completed</option>
                <option value="in_progress">In progress</option>
                <option value="not_started">Not started</option>
              </select>
            </div>
          </div>
        </div>

        {rows.length === 0 ? (
          <EmptyState
            title="No students assigned"
            description="No students are currently assigned to this resource."
          />
        ) : filteredRows.length === 0 ? (
          <EmptyState
            title="No matching students"
            description="Try changing your search or status filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Started</th>
                  <th className="px-6 py-4">Completed</th>
                  <th className="px-6 py-4">Last activity</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredRows.map(({ student, progress }) => (
                  <tr key={student.id} className="hover:bg-slate-50">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <StudentAvatar name={student.name} />

                        <div>
                          <p className="font-bold text-slate-950">
                            {student.name}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge status={progress.status} />
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {formatDate(progress.startedAt, true)}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {formatDate(progress.completedAt, true)}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {formatDate(progress.updatedAt, true)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {rows.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 text-sm font-semibold text-slate-500">
            Showing {filteredRows.length} of {rows.length} students
          </div>
        )}
      </Card>
    </div>
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
  value: number;
  description: string;
  icon: ReactNode;
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
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconClassName}`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}

function StatusBadge({ status }: { status: StudentAssignmentStatus }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Completed
      </span>
    );
  }

  if (status === "in_progress") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700">
        <Clock3 className="h-3.5 w-3.5" />
        In Progress
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
      <XCircle className="h-3.5 w-3.5" />
      Not Started
    </span>
  );
}

function StudentAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-sm font-black text-teal-700">
      {initials || "ST"}
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-10 text-center">
      <Users className="mx-auto h-10 w-10 text-slate-400" />

      <h3 className="mt-4 text-xl font-black text-slate-950">{title}</h3>

      <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}
