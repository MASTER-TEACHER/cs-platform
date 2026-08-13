"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  Brain,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Code2,
  Eye,
  FileText,
  Loader2,
  Search,
  Users,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import {
  getTeacherAssignments,
  type ResourceAssignment,
} from "@/services/resourceAssignmentService";
import {
  getTeacherQuizAssignments,
  type TeacherQuizAssignmentSummary,
} from "@/services/teacherQuizAssignmentService";
import { getTeacherExamAssignments } from "@/services/examAssignmentService";
import { getAssignmentSubmissions } from "@/services/examSubmissionService";
import type {
  ExamAssignment,
  ExamSubmission,
} from "@/types/examAssignment";


type TeacherExamAssignmentSummary = {
  assignment: ExamAssignment;
  submittedCount: number;
  awaitingMarkingCount: number;
  markedCount: number;
  averagePercentage: number | null;
  submissionPercentage: number;
  markingPercentage: number;
};

function summariseExamAssignment(
  assignment: ExamAssignment,
  submissions: ExamSubmission[],
): TeacherExamAssignmentSummary {
  const submittedCount = submissions.filter((submission) =>
    ["submitted", "marking", "marked"].includes(submission.status),
  ).length;

  const awaitingMarkingCount = submissions.filter((submission) =>
    ["submitted", "marking"].includes(submission.status),
  ).length;

  const markedSubmissions = submissions.filter(
    (submission) => submission.status === "marked",
  );

  const markedCount = markedSubmissions.length;

  const averagePercentage =
    markedCount > 0
      ? Math.round(
          markedSubmissions.reduce(
            (total, submission) => total + submission.percentage,
            0,
          ) / markedCount,
        )
      : null;

  const studentCount = assignment.studentIds.length;

  return {
    assignment,
    submittedCount,
    awaitingMarkingCount,
    markedCount,
    averagePercentage,
    submissionPercentage:
      studentCount > 0
        ? Math.round((submittedCount / studentCount) * 100)
        : 0,
    markingPercentage:
      studentCount > 0
        ? Math.round((markedCount / studentCount) * 100)
        : 0,
  };
}

function formatDate(value: Date | null): string {
  if (!value) return "No due date";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(value);
}

function formatResourceType(value: string): string {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

function getCompletionPercentage(
  assignment: ResourceAssignment,
): number {
  if (assignment.studentCount === 0) return 0;

  return Math.round(
    (assignment.completedCount / assignment.studentCount) * 100,
  );
}

function getDueStatus(dueDate: Date | null): {
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
    (due.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24),
  );

  if (differenceInDays < 0) {
    const overdueDays = Math.abs(differenceInDays);

    return {
      label: `${overdueDays} ${
        overdueDays === 1 ? "day" : "days"
      } overdue`,
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

export default function TeacherAssignmentsPage() {
  const { user } = useAuth();

  const [assignments, setAssignments] =
    useState<ResourceAssignment[]>([]);

  const [quizAssignments, setQuizAssignments] =
    useState<TeacherQuizAssignmentSummary[]>([]);

  const [examAssignments, setExamAssignments] =
    useState<TeacherExamAssignmentSummary[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadAssignments = useCallback(async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      setError("");

      const [loadedResources, loadedQuizzes, loadedExams] =
        await Promise.all([
          getTeacherAssignments(user.uid),
          getTeacherQuizAssignments(user.uid),
          getTeacherExamAssignments(user.uid),
        ]);

      const loadedExamSummaries = await Promise.all(
        loadedExams.map(async (assignment) => {
          const submissions = await getAssignmentSubmissions(
            assignment.id,
            user.uid,
          );

          return summariseExamAssignment(assignment, submissions);
        }),
      );

      setAssignments(loadedResources);
      setQuizAssignments(loadedQuizzes);
      setExamAssignments(loadedExamSummaries);
    } catch (caughtError) {
      console.error(
        "Failed to load teacher assignments:",
        caughtError,
      );

      setAssignments([]);
      setQuizAssignments([]);
      setExamAssignments([]);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Your assignments could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    void loadAssignments();
  }, [loadAssignments]);

  const filteredAssignments = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return assignments;

    return assignments.filter(
      (assignment) =>
        assignment.resourceTitle
          .toLowerCase()
          .includes(search) ||
        assignment.resourceTopic
          .toLowerCase()
          .includes(search) ||
        assignment.className
          .toLowerCase()
          .includes(search),
    );
  }, [assignments, searchTerm]);

  const totalStudents = assignments.reduce(
    (total, assignment) =>
      total + assignment.studentCount,
    0,
  );

  const totalCompleted = assignments.reduce(
    (total, assignment) =>
      total + assignment.completedCount,
    0,
  );

  const activeAssignments = assignments.filter(
    (assignment) => assignment.status === "active",
  ).length;

  const quizStudentCount = quizAssignments.reduce(
    (total, assignment) => total + assignment.studentCount,
    0,
  );

  const quizCompletedCount = quizAssignments.reduce(
    (total, assignment) => total + assignment.completedCount,
    0,
  );

  const activeQuizAssignments = quizAssignments.filter(
    (assignment) => assignment.status === "active",
  ).length;


  const examStudentCount = examAssignments.reduce(
    (total, item) => total + item.assignment.studentIds.length,
    0,
  );

  const examMarkedCount = examAssignments.reduce(
    (total, item) => total + item.markedCount,
    0,
  );

  const activeExamAssignments = examAssignments.filter(
    (item) => item.assignment.status === "active",
  ).length;

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-56 w-full rounded-3xl" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-28 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-700 p-7 text-white shadow-xl sm:p-9">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-100">
              Teacher assignments
            </p>

            <h1 className="mt-3 text-3xl font-black sm:text-4xl">
              Assignment tracking
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-100">
              Review lessons, quizzes, programming challenges and written
              exams, monitor completion and identify students who may need
              support.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/teacher/exam-assignments"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-950/30 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/25"
            >
              <FileText className="h-4 w-4" />
              Exam markbooks
            </Link>

            <Link
              href="/teacher/quiz-assignments"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet-950/30 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/25"
            >
              <Brain className="h-4 w-4" />
              Quiz results
            </Link>

            <Link
              href="/teacher/programming-assignments"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-950/30 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/25"
            >
              <Code2 className="h-4 w-4" />
              Programming results
            </Link>

            <Link
              href="/teacher/assignment-wizard"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-teal-700 transition hover:bg-emerald-50"
            >
              <BookOpen className="h-4 w-4" />
              Assignment Wizard
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          label="Assignments"
          value={
            assignments.length +
            quizAssignments.length +
            examAssignments.length
          }
          description="Lessons, quizzes, programming and exams"
          icon={<FileText className="h-6 w-6" />}
          iconClassName="bg-blue-50 text-blue-600"
        />

        <SummaryCard
          label="Active"
          value={
            activeAssignments +
            activeQuizAssignments +
            activeExamAssignments
          }
          description="Currently available"
          icon={<Clock3 className="h-6 w-6" />}
          iconClassName="bg-amber-50 text-amber-600"
        />

        <SummaryCard
          label="Completed"
          value={`${
            totalCompleted +
            quizCompletedCount +
            examMarkedCount
          }/${
            totalStudents +
            quizStudentCount +
            examStudentCount
          }`}
          description="Student completions"
          icon={<CheckCircle2 className="h-6 w-6" />}
          iconClassName="bg-emerald-50 text-emerald-600"
        />
      </div>

      <Card className="rounded-3xl border border-slate-200 p-6 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-600">
              Class assignments
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Your assignments
            </h2>
          </div>

          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search assignments..."
              className="min-h-11 w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100 sm:w-72"
            />
          </label>
        </div>

        {error ? (
          <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <div>
                <p className="font-bold text-red-950">
                  Assignments unavailable
                </p>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => void loadAssignments()}
                  className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white"
                >
                  <Loader2 className="h-4 w-4" />
                  Try again
                </button>
              </div>
            </div>
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-slate-50 p-10 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-slate-400" />

            <h3 className="mt-4 text-xl font-black text-slate-950">
              No assignments found
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
              Create an assignment to begin tracking
              student completion.
            </p>
          </div>
        ) : (
          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            {filteredAssignments.map((assignment) => {
              const completionPercentage =
                getCompletionPercentage(assignment);

              const dueStatus =
                getDueStatus(assignment.dueDate);

              const programming =
                assignment.resourceType ===
                "programming-challenge";

              return (
                <article
                  key={assignment.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            programming
                              ? "bg-cyan-100 text-cyan-800"
                              : "bg-teal-50 text-teal-700"
                          }`}
                        >
                          {programming
                            ? "Programming"
                            : formatResourceType(
                                assignment.resourceType,
                              )}
                        </span>

                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                          {assignment.className}
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-black text-slate-950">
                        {assignment.resourceTitle}
                      </h3>

                      <p className="mt-2 text-sm font-semibold text-teal-700">
                        {assignment.resourceTopic}
                      </p>
                    </div>

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                        programming
                          ? "bg-cyan-50 text-cyan-700"
                          : "bg-teal-50 text-teal-600"
                      }`}
                    >
                      {programming ? (
                        <Code2 className="h-5 w-5" />
                      ) : (
                        <BookOpen className="h-5 w-5" />
                      )}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Students
                      </p>
                      <p className="mt-2 flex items-center gap-2 font-bold text-slate-800">
                        <Users className="h-4 w-4 text-blue-600" />
                        {assignment.studentCount}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Due date
                      </p>
                      <p className="mt-2 flex items-center gap-2 font-bold text-slate-800">
                        <CalendarDays className="h-4 w-4 text-teal-600" />
                        {formatDate(assignment.dueDate)}
                      </p>
                      <p
                        className={`mt-1 text-xs font-semibold ${
                          dueStatus.overdue
                            ? "text-red-600"
                            : "text-slate-500"
                        }`}
                      >
                        {dueStatus.label}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-slate-700">
                        Completion
                      </span>
                      <span className="font-black text-teal-700">
                        {completionPercentage}%
                      </span>
                    </div>

                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all"
                        style={{
                          width: `${completionPercentage}%`,
                        }}
                      />
                    </div>
                  </div>

                  <Link
                    href={
                      programming
                        ? `/teacher/programming-assignments/${assignment.id}`
                        : `/teacher/assignments/${assignment.id}`
                    }
                    className={`mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition ${
                      programming
                        ? "bg-cyan-700 hover:bg-cyan-800"
                        : "bg-teal-600 hover:bg-teal-700"
                    }`}
                  >
                    <Eye className="h-4 w-4" />
                    {programming
                      ? "View programming results"
                      : "View progress"}
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </Card>

      <Card className="rounded-3xl border border-violet-200 p-6 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-violet-600">
              Quiz assignments
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Quiz results and completion
            </h2>
          </div>

          <Link
            href="/teacher/quiz-assignments"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-700"
          >
            <Brain className="h-4 w-4" />
            Open quiz markbook
          </Link>
        </div>

        {quizAssignments.length === 0 ? (
          <div className="mt-7 rounded-2xl bg-slate-50 p-8 text-center">
            <Brain className="mx-auto h-9 w-9 text-slate-400" />
            <p className="mt-3 font-bold text-slate-800">
              No quiz assignments yet
            </p>
          </div>
        ) : (
          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            {quizAssignments.map((assignment) => {
              const dueStatus = getDueStatus(assignment.dueDate);

              return (
                <article
                  key={assignment.id}
                  className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-800">
                          Quiz
                        </span>
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                          {assignment.className}
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-black text-slate-950">
                        {assignment.title}
                      </h3>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                      <Brain className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Students</p>
                      <p className="mt-2 font-black text-slate-900">{assignment.studentCount}</p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Completed</p>
                      <p className="mt-2 font-black text-slate-900">{assignment.completedCount}</p>
                    </div>

                    <div className="rounded-2xl bg-violet-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-violet-500">Average</p>
                      <p className="mt-2 font-black text-violet-900">
                        {assignment.completedCount > 0
                          ? `${assignment.averagePercentage}%`
                          : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-slate-700">Completion</span>
                      <span className="font-black text-violet-700">
                        {assignment.completionPercentage}%
                      </span>
                    </div>
                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600"
                        style={{ width: `${assignment.completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 text-xs font-semibold">
                    <span className={dueStatus.overdue ? "text-red-600" : "text-slate-500"}>
                      {formatDate(assignment.dueDate)} · {dueStatus.label}
                    </span>
                  </div>

                  <Link
                    href={`/teacher/quiz-assignments/${assignment.id}`}
                    className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-700"
                  >
                    <Eye className="h-4 w-4" />
                    View quiz results
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </Card>

      <Card className="rounded-3xl border border-indigo-200 p-6 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">
              Written exam assignments
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Submissions and marking
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Track submitted papers, assessments awaiting marking and
              finalised results.
            </p>
          </div>

          <Link
            href="/teacher/exam-assignments"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            <FileText className="h-4 w-4" />
            Open exam markbooks
          </Link>
        </div>

        {examAssignments.length === 0 ? (
          <div className="mt-7 rounded-2xl bg-slate-50 p-8 text-center">
            <FileText className="mx-auto h-9 w-9 text-slate-400" />
            <p className="mt-3 font-bold text-slate-800">
              No written exam assignments yet
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Assign a saved exam paper from the Assignment Wizard and it will
              appear here.
            </p>
          </div>
        ) : (
          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            {examAssignments.map((item) => {
              const assignment = item.assignment;
              const dueStatus = getDueStatus(assignment.dueDate);
              const studentCount = assignment.studentIds.length;

              return (
                <article
                  key={assignment.id}
                  className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                          Written Exam
                        </span>
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                          {assignment.className}
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-black text-slate-950">
                        {assignment.title}
                      </h3>

                      <p className="mt-2 text-sm font-semibold text-indigo-700">
                        {assignment.questionSetSnapshot.topic ||
                          assignment.questionSetTitle}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                      <FileText className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <ExamMetric label="Students" value={studentCount} />
                    <ExamMetric label="Submitted" value={item.submittedCount} />
                    <ExamMetric
                      label="Awaiting marking"
                      value={item.awaitingMarkingCount}
                      tone="amber"
                    />
                    <ExamMetric
                      label="Marked"
                      value={item.markedCount}
                      tone="green"
                    />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <ExamMetric
                      label="Questions"
                      value={assignment.questionCount}
                    />
                    <ExamMetric
                      label="Total marks"
                      value={assignment.totalMarks}
                    />
                    <ExamMetric
                      label="Class average"
                      value={
                        item.averagePercentage !== null
                          ? `${item.averagePercentage}%`
                          : "Awaiting marks"
                      }
                      tone="indigo"
                    />
                  </div>

                  <ExamProgress
                    label="Submitted"
                    value={item.submissionPercentage}
                    barClassName="bg-gradient-to-r from-cyan-500 to-blue-600"
                    valueClassName="text-cyan-700"
                  />

                  <ExamProgress
                    label="Marked / completed"
                    value={item.markingPercentage}
                    barClassName="bg-gradient-to-r from-emerald-500 to-teal-600"
                    valueClassName="text-emerald-700"
                  />

                  <div className="mt-4 flex flex-col gap-2 text-xs font-semibold sm:flex-row sm:items-center sm:justify-between">
                    <span
                      className={
                        dueStatus.overdue ? "text-red-600" : "text-slate-500"
                      }
                    >
                      {formatDate(assignment.dueDate)} · {dueStatus.label}
                    </span>

                    {item.awaitingMarkingCount > 0 && (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">
                        {item.awaitingMarkingCount} awaiting marking
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/teacher/exam-assignments/${assignment.id}`}
                    className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
                  >
                    <Eye className="h-4 w-4" />
                    {item.awaitingMarkingCount > 0
                      ? "View submissions / Mark exam"
                      : "Open exam markbook"}
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

function ExamMetric({
  label,
  value,
  tone = "slate",
}: {
  label: string;
  value: number | string;
  tone?: "slate" | "amber" | "green" | "indigo";
}) {
  const toneClasses = {
    slate: "bg-slate-50 text-slate-900",
    amber: "bg-amber-50 text-amber-900",
    green: "bg-emerald-50 text-emerald-900",
    indigo: "bg-indigo-50 text-indigo-900",
  };

  return (
    <div className={`rounded-2xl p-4 ${toneClasses[tone]}`}>
      <p className="text-xs font-bold uppercase tracking-wide opacity-60">
        {label}
      </p>
      <p className="mt-2 font-black">{value}</p>
    </div>
  );
}

function ExamProgress({
  label,
  value,
  barClassName,
  valueClassName,
}: {
  label: string;
  value: number;
  barClassName: string;
  valueClassName: string;
}) {
  return (
    <div className="mt-5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold text-slate-700">{label}</span>
        <span className={`font-black ${valueClassName}`}>{value}%</span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${barClassName}`}
          style={{ width: `${value}%` }}
        />
      </div>
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
  value: number | string;
  description: string;
  icon: React.ReactNode;
  iconClassName: string;
}) {
  return (
    <Card className="rounded-3xl border border-slate-200 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-black text-slate-950">
            {value}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
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