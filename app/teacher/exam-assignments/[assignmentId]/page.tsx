"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import ExamIntegrityPolicyCard from "@/components/teacher/exam-assignments/ExamIntegrityPolicyCard";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { getExamAssignmentById } from "@/services/examAssignmentService";
import { getAssignmentSubmissions } from "@/services/examSubmissionService";
import type { ExamAssignment, ExamSubmission } from "@/types/examAssignment";

type StudentIdentity = {
  uid: string;
  name: string;
  email: string;
};

type StudentProfileDocument = {
  uid?: unknown;
  name?: unknown;
  displayName?: unknown;
  fullName?: unknown;
  email?: unknown;
  role?: unknown;
};

function normaliseString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

async function getStudentIdentity(studentId: string): Promise<StudentIdentity> {
  try {
    const snapshot = await getDoc(doc(db, "users", studentId));

    if (!snapshot.exists()) {
      return {
        uid: studentId,
        name: "Unnamed Student",
        email: "",
      };
    }

    const profile = snapshot.data() as StudentProfileDocument;

    const name =
      normaliseString(profile.name) ||
      normaliseString(profile.displayName) ||
      normaliseString(profile.fullName) ||
      "Unnamed Student";

    const email = normaliseString(profile.email).toLowerCase();

    return {
      uid: studentId,
      name,
      email,
    };
  } catch (error) {
    console.error(`Unable to load student profile ${studentId}:`, error);

    return {
      uid: studentId,
      name: "Unnamed Student",
      email: "",
    };
  }
}

function formatStatus(
  status: ExamSubmission["status"] | "not_started",
): string {
  switch (status) {
    case "in_progress":
      return "In progress";

    case "submitted":
      return "Submitted";

    case "marking":
      return "Being marked";

    case "marked":
      return "Marked";

    default:
      return "Not started";
  }
}

function getStatusClass(
  status: ExamSubmission["status"] | "not_started",
): string {
  switch (status) {
    case "marked":
      return "bg-emerald-100 text-emerald-700";

    case "submitted":
      return "bg-cyan-100 text-cyan-700";

    case "marking":
      return "bg-amber-100 text-amber-700";

    case "in_progress":
      return "bg-blue-100 text-blue-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

export default function ExamAssignmentMarkbookPage() {
  const params = useParams<{
    assignmentId: string;
  }>();

  const {
    user,
    loading: authLoading,
    profileReady,
  } = useAuth();

  const [assignment, setAssignment] = useState<ExamAssignment | null>(null);

  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);

  const [students, setStudents] = useState<StudentIdentity[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadMarkbook() {
      /*
       * Do not query protected Firestore data until Firebase Auth has finished
       * restoring the signed-in teacher. This also prevents hard-refresh
       * permission errors.
       */
      if (authLoading || !profileReady) {
        return;
      }

      if (!user?.uid) {
        if (!cancelled) {
          setAssignment(null);
          setSubmissions([]);
          setStudents([]);
          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);
        setError("");

        const loadedAssignment = await getExamAssignmentById(
          params.assignmentId,
        );

        if (cancelled) {
          return;
        }

        if (!loadedAssignment) {
          setAssignment(null);
          return;
        }

        /*
         * Only the teacher who owns the exam should open its markbook or edit
         * its integrity policy.
         */
        if (loadedAssignment.teacherId !== user.uid) {
          throw new Error(
            "You do not have permission to view this exam markbook.",
          );
        }

        const [loadedSubmissions, loadedStudents] = await Promise.all([
          getAssignmentSubmissions(
            loadedAssignment.id,
            user.uid,
          ),

          Promise.all(
            loadedAssignment.studentIds.map((studentId: string) =>
              getStudentIdentity(studentId),
            ),
          ),
        ]);

        if (cancelled) {
          return;
        }

        setAssignment(loadedAssignment);
        setSubmissions(loadedSubmissions);

        setStudents(
          loadedStudents.sort(
            (firstStudent: StudentIdentity, secondStudent: StudentIdentity) =>
              firstStudent.name.localeCompare(secondStudent.name, "en-GB", {
                sensitivity: "base",
              }),
          ),
        );
      } catch (caughtError) {
        console.error("Unable to load exam markbook:", caughtError);

        if (!cancelled) {
          setAssignment(null);
          setSubmissions([]);
          setStudents([]);

          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "The markbook could not be loaded.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadMarkbook();

    return () => {
      cancelled = true;
    };
  }, [
    authLoading,
    params.assignmentId,
    profileReady,
    user?.uid,
  ]);

  const submissionsByStudent = useMemo(
    () =>
      new Map<string, ExamSubmission>(
        submissions.map((submission: ExamSubmission) => [
          submission.studentId,
          submission,
        ]),
      ),
    [submissions],
  );

  const summary = useMemo(() => {
    const submitted = submissions.filter((submission: ExamSubmission) =>
      ["submitted", "marking", "marked"].includes(submission.status),
    ).length;

    const markedSubmissions = submissions.filter(
      (submission: ExamSubmission) => submission.status === "marked",
    );

    const average =
      markedSubmissions.length > 0
        ? Math.round(
            markedSubmissions.reduce(
              (total: number, submission: ExamSubmission) =>
                total + submission.percentage,
              0,
            ) / markedSubmissions.length,
          )
        : 0;

    return {
      total: assignment?.studentIds.length ?? 0,

      submitted,

      marked: markedSubmissions.length,

      average,
    };
  }, [assignment?.studentIds.length, submissions]);

  if (authLoading || !profileReady || loading) {
    return <Skeleton className="h-96" />;
  }

  if (!assignment) {
    return (
      <Card>
        <h1 className="text-2xl font-black text-slate-950">
          Assignment not found
        </h1>

        {error && <p className="mt-3 text-red-700">{error}</p>}

        <Link
          href="/teacher/exam-assignments"
          className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white"
        >
          Back to Exam Assignments
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-slate-950 to-indigo-950 text-white">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-indigo-200">
              {assignment.className}
            </p>

            <h1 className="mt-2 text-4xl font-black">{assignment.title}</h1>

            <p className="mt-3 text-indigo-100">
              {assignment.questionCount} questions · {assignment.totalMarks}{" "}
              marks
            </p>
          </div>

          <Link
            href="/teacher/exam-assignments"
            className="rounded-xl border border-white/20 px-5 py-3 text-center font-bold text-white"
          >
            All Exam Assignments
          </Link>
        </div>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Students" value={summary.total} />

        <SummaryCard label="Submitted" value={summary.submitted} />

        <SummaryCard label="Marked" value={summary.marked} />

        <SummaryCard label="Class average" value={`${summary.average}%`} />
      </section>

      {user?.uid && (
        <ExamIntegrityPolicyCard
          assignment={assignment}
          teacherId={user.uid}
          onSaved={(policy) =>
            setAssignment((current) =>
              current
                ? {
                    ...current,
                    integrityPolicy: policy,
                  }
                : current,
            )
          }
        />
      )}

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">
              Student results
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Class Markbook
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Track progress, open submitted papers and review marked results.
            </p>
          </div>

          <p className="text-sm font-semibold text-slate-500">
            {summary.submitted}/{summary.total} submitted
          </p>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left">
                <th className="p-4">Student</th>

                <th className="p-4">Status</th>

                <th className="p-4">Score</th>

                <th className="p-4">Percentage</th>

                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student: StudentIdentity) => {
                const submission = submissionsByStudent.get(student.uid);

                const status = submission?.status ?? "not_started";

                return (
                  <tr
                    key={student.uid}
                    className="border-b border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-black text-indigo-700">
                          {student.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="font-bold text-slate-900">
                            {student.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {student.email || "No email available"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                          status,
                        )}`}
                      >
                        {formatStatus(status)}
                      </span>

                      {submission?.integrityTerminated && (
                        <p className="mt-2 text-xs font-black text-red-700">
                          Integrity auto-submit
                        </p>
                      )}

                      {submission &&
                        submission.integrityIncidents.length > 0 && (
                          <p className="mt-1 text-xs text-slate-500">
                            {submission.integrityIncidents.length} integrity event
                            {submission.integrityIncidents.length === 1 ? "" : "s"}
                          </p>
                        )}
                    </td>

                    <td className="p-4 font-semibold text-slate-700">
                      {submission?.status === "marked"
                        ? `${submission.totalAwardedMarks}/${assignment.totalMarks}`
                        : "—"}
                    </td>

                    <td className="p-4 font-semibold text-slate-700">
                      {submission?.status === "marked"
                        ? `${submission.percentage}%`
                        : "—"}
                    </td>

                    <td className="p-4">
                      {submission &&
                      ["submitted", "marking", "marked"].includes(
                        submission.status,
                      ) ? (
                        <Link
                          href={`/teacher/exam-assignments/${assignment.id}/submissions/${student.uid}`}
                          className="inline-flex rounded-lg bg-indigo-600 px-4 py-2 font-bold text-white transition hover:bg-indigo-700"
                        >
                          {submission.status === "marked"
                            ? "Review"
                            : "Mark submission"}
                        </Link>
                      ) : (
                        <span className="text-sm text-slate-400">
                          {submission?.status === "in_progress"
                            ? "Assessment in progress"
                            : "Awaiting submission"}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <Card>
      <p className="text-sm font-semibold text-slate-500">{label}</p>

      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    </Card>
  );
}