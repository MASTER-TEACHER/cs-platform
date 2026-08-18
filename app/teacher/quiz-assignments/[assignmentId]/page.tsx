"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  Download,
  Search,
  ShieldAlert,
  Users,
  XCircle,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import {
  getTeacherQuizAssignmentDetail,
  type TeacherQuizAssignmentDetail,
  type TeacherQuizIntegrityIncident,
  type TeacherQuizStudentResult,
} from "@/services/teacherQuizAssignmentService";

type ResultFilter = "all" | "completed" | "not_started" | "integrity";

function formatDate(value: Date | null, includeTime = false): string {
  if (!value) return "—";

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
          month: "short",
          year: "numeric",
        },
  ).format(value);
}

function formatDuration(seconds: number): string {
  if (seconds <= 0) return "—";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) return `${remainingSeconds}s`;
  return `${minutes}m ${remainingSeconds}s`;
}

function formatIncidentType(type: TeacherQuizIntegrityIncident["type"]): string {
  switch (type) {
    case "fullscreen_exit":
      return "Fullscreen exited";
    case "fullscreen_restored":
      return "Fullscreen restored";
    case "page_hidden":
      return "Page hidden";
    case "page_visible":
      return "Page visible";
    case "auto_submit":
      return "Auto-submit";
    default:
      return "Integrity event";
  }
}

function escapeCsvValue(value: string | number): string {
  const stringValue = String(value ?? "");
  return `"${stringValue.replace(/"/g, '""')}"`;
}

export default function TeacherQuizMarkbookPage() {
  const params = useParams<{ assignmentId: string }>();
  const assignmentId = params.assignmentId;

  const { user, loading: authLoading, profileReady } = useAuth();

  const [detail, setDetail] = useState<TeacherQuizAssignmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<ResultFilter>("all");
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  const loadMarkbook = useCallback(async () => {
    if (authLoading || !profileReady) return;

    if (!assignmentId || !user?.uid) {
      setDetail(null);
      setLoading(false);
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
        setError("This quiz assignment could not be found or you do not have permission to view it.");
        return;
      }

      setDetail(loadedDetail);
    } catch (caughtError) {
      console.error("Quiz markbook load error:", caughtError);
      setDetail(null);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The quiz markbook could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [assignmentId, authLoading, profileReady, user?.uid]);

  useEffect(() => {
    void loadMarkbook();
  }, [loadMarkbook]);

  const completedStudents = useMemo(
    () => detail?.students.filter((student) => student.status === "completed") ?? [],
    [detail],
  );

  const notStartedStudents = useMemo(
    () => detail?.students.filter((student) => student.status === "not_started") ?? [],
    [detail],
  );

  const integrityStudents = useMemo(
    () => detail?.students.filter((student) => student.integrityTerminated) ?? [],
    [detail],
  );

  const highestPercentage = useMemo(() => {
    if (completedStudents.length === 0) return 0;
    return Math.max(...completedStudents.map((student) => student.percentage));
  }, [completedStudents]);

  const lowestPercentage = useMemo(() => {
    if (completedStudents.length === 0) return 0;
    return Math.min(...completedStudents.map((student) => student.percentage));
  }, [completedStudents]);

  const filteredStudents = useMemo(() => {
    if (!detail) return [];

    const normalisedSearch = searchTerm.trim().toLowerCase();

    return detail.students.filter((student) => {
      const matchesSearch =
        !normalisedSearch ||
        student.studentName.toLowerCase().includes(normalisedSearch) ||
        student.studentEmail.toLowerCase().includes(normalisedSearch);

      if (!matchesSearch) return false;

      if (filter === "completed") return student.status === "completed";
      if (filter === "not_started") return student.status === "not_started";
      if (filter === "integrity") return student.integrityTerminated;
      return true;
    });
  }, [detail, filter, searchTerm]);

  function exportCsv() {
    if (!detail) return;

    const headings = [
      "Student",
      "Email",
      "Status",
      "Score",
      "Questions",
      "Percentage",
      "XP",
      "Time Taken",
      "Completed At",
      "Delivery Mode",
      "Integrity Terminated",
      "Integrity Reason",
      "Integrity Incident Count",
    ];

    const rows = detail.students.map((student) => [
      student.studentName,
      student.studentEmail,
      student.status,
      student.score,
      student.totalQuestions,
      student.percentage,
      student.earnedXP,
      formatDuration(student.timeTakenSeconds),
      formatDate(student.completedAt, true),
      student.deliveryMode,
      student.integrityTerminated ? "Yes" : "No",
      student.integrityTerminationReason,
      student.integrityIncidents.length,
    ]);

    const csv = [
      headings.map(escapeCsvValue).join(","),
      ...rows.map((row) => row.map(escapeCsvValue).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const safeTitle = detail.assignment.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

    anchor.href = url;
    anchor.download = `${safeTitle || "quiz"}-markbook.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  if (authLoading || !profileReady || loading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!detail) {
    return (
      <Card>
        <h1 className="text-2xl font-black text-slate-950">Quiz markbook unavailable</h1>
        <p className="mt-3 text-red-700">
          {error || "The requested quiz assignment could not be loaded."}
        </p>
        <Link
          href="/teacher/quiz-assignments"
          className="mt-6 inline-flex rounded-xl bg-violet-600 px-5 py-3 text-sm font-black text-white"
        >
          Back to quiz markbooks
        </Link>
      </Card>
    );
  }

  const { assignment } = detail;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-violet-700 via-purple-700 to-blue-700 p-6 text-white shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <Link
              href="/teacher/quiz-assignments"
              className="text-sm font-bold text-violet-100 hover:text-white"
            >
              ← All quiz markbooks
            </Link>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black uppercase">
                Quiz
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black">
                {assignment.className}
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black capitalize">
                {assignment.deliveryMode === "assessment" ? "Monitored assessment" : "Practice"}
              </span>
            </div>

            <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-violet-100">
              Quiz markbook
            </p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">{assignment.title}</h1>
            {assignment.description && (
              <p className="mt-3 max-w-3xl text-sm leading-6 text-violet-100">
                {assignment.description}
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-violet-100">
              <span>{assignment.studentCount} students</span>
              <span>Due {formatDate(assignment.dueDate)}</span>
              <span>{assignment.completedCount} completed</span>
              {assignment.integrityTerminatedCount > 0 && (
                <span className="font-black text-amber-200">
                  {assignment.integrityTerminatedCount} integrity auto-submit{assignment.integrityTerminatedCount === 1 ? "" : "s"}
                </span>
              )}
            </div>
          </div>

          <div className="w-full rounded-2xl border border-white/20 bg-white/10 p-5 xl:w-72">
            <p className="text-xs font-black uppercase tracking-wide text-violet-100">Class average</p>
            <p className="mt-2 text-4xl font-black">
              {completedStudents.length > 0 ? `${assignment.averagePercentage}%` : "—"}
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white"
                style={{ width: `${completedStudents.length > 0 ? assignment.averagePercentage : 0}%` }}
              />
            </div>
            <button
              type="button"
              onClick={exportCsv}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-violet-700"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <SummaryCard label="Completed" value={completedStudents.length} detail={`${assignment.completionPercentage}% submitted`} icon={<CheckCircle2 className="h-5 w-5" />} />
        <SummaryCard label="Not started" value={notStartedStudents.length} detail="Awaiting submission" icon={<XCircle className="h-5 w-5" />} />
        <SummaryCard label="Highest score" value={completedStudents.length ? `${highestPercentage}%` : "—"} detail="Completed attempts" icon={<Users className="h-5 w-5" />} />
        <SummaryCard label="Lowest score" value={completedStudents.length ? `${lowestPercentage}%` : "—"} detail="Completed attempts" icon={<Clock3 className="h-5 w-5" />} />
        <SummaryCard label="Integrity events" value={integrityStudents.length} detail="Auto-submitted attempts" icon={<ShieldAlert className="h-5 w-5" />} danger={integrityStudents.length > 0} />
      </section>

      <Card className="overflow-hidden rounded-3xl p-0">
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-600">Student results</p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">Class markbook</h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search students..."
                  className="min-h-11 rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm outline-none focus:border-violet-500"
                />
              </label>

              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value as ResultFilter)}
                className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700"
              >
                <option value="all">All students</option>
                <option value="completed">Completed</option>
                <option value="not_started">Not started</option>
                <option value="integrity">Integrity auto-submit</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Score</th>
                <th className="px-5 py-4">Percentage</th>
                <th className="px-5 py-4">XP</th>
                <th className="px-5 py-4">Time</th>
                <th className="px-5 py-4">Completed</th>
                <th className="px-5 py-4">Integrity</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => {
                const expanded = expandedStudentId === student.studentId;

                return (
                  <ResultRows
                    key={student.studentId}
                    student={student}
                    expanded={expanded}
                    onToggle={() =>
                      setExpandedStudentId(expanded ? null : student.studentId)
                    }
                  />
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="p-10 text-center text-sm font-semibold text-slate-500">
            No students match the current search or filter.
          </div>
        )}

        <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 text-xs font-semibold text-slate-500">
          Showing {filteredStudents.length} of {detail.students.length} students
        </div>
      </Card>
    </div>
  );
}

function ResultRows({
  student,
  expanded,
  onToggle,
}: {
  student: TeacherQuizStudentResult;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr className={student.integrityTerminated ? "bg-red-50/50" : "bg-white"}>
        <td className="px-5 py-4">
          <p className="font-black text-slate-950">{student.studentName}</p>
          <p className="mt-1 text-xs text-slate-500">{student.studentEmail}</p>
        </td>

        <td className="px-5 py-4">
          {student.status === "completed" ? (
            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
              Completed
            </span>
          ) : (
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
              Not started
            </span>
          )}
        </td>

        <td className="px-5 py-4 font-bold text-slate-900">
          {student.status === "completed" ? `${student.score}/${student.totalQuestions}` : "—"}
        </td>

        <td className="px-5 py-4 font-black text-slate-950">
          {student.status === "completed" ? `${student.percentage}%` : "—"}
        </td>

        <td className="px-5 py-4 font-bold text-slate-700">
          {student.status === "completed" ? student.earnedXP : "—"}
        </td>

        <td className="px-5 py-4 text-sm font-semibold text-slate-600">
          {student.status === "completed" ? formatDuration(student.timeTakenSeconds) : "—"}
        </td>

        <td className="px-5 py-4 text-sm font-semibold text-slate-600">
          {formatDate(student.completedAt, true)}
        </td>

        <td className="px-5 py-4">
          {student.integrityTerminated ? (
            <button
              type="button"
              onClick={onToggle}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-800"
            >
              <AlertTriangle className="h-4 w-4" />
              Auto-submitted
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          ) : student.integrityIncidents.length > 0 ? (
            <button
              type="button"
              onClick={onToggle}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-black text-amber-800"
            >
              {student.integrityIncidents.length} event{student.integrityIncidents.length === 1 ? "" : "s"}
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          ) : (
            <span className="text-xs font-bold text-slate-400">None</span>
          )}
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={8} className="bg-slate-50 px-5 py-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 text-red-600" />
                <div>
                  <h3 className="font-black text-slate-950">Integrity record</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {student.integrityTerminated
                      ? student.integrityTerminationReason || "This assessment was automatically submitted by the integrity rules."
                      : "Integrity activity was recorded during this assessment."}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    Session started: {formatDate(student.integritySessionStartedAt, true)}
                  </p>
                </div>
              </div>

              {student.integrityIncidents.length > 0 ? (
                <div className="mt-5 space-y-3">
                  {student.integrityIncidents.map((incident, index) => (
                    <div
                      key={`${incident.id}-${index}`}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-black text-slate-900">
                          {formatIncidentType(incident.type)}
                        </p>
                        <p className="text-xs font-semibold text-slate-500">
                          {formatDate(incident.occurredAt, true)}
                        </p>
                      </div>

                      <p className="mt-2 text-xs font-bold text-slate-500">
                        Question {incident.questionNumber ?? "—"}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {incident.detail}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-sm font-semibold text-slate-500">
                  No individual integrity incidents were stored for this attempt.
                </p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  icon,
  danger = false,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: ReactNode;
  danger?: boolean;
}) {
  return (
    <Card className={danger ? "border-red-200 bg-red-50" : ""}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-500">{label}</p>
          <p className={`mt-2 text-3xl font-black ${danger ? "text-red-900" : "text-slate-950"}`}>
            {value}
          </p>
          <p className="mt-2 text-xs font-semibold text-slate-500">{detail}</p>
        </div>
        <div className={`rounded-xl p-3 ${danger ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}