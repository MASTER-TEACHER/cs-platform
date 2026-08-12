"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { getStudentExamAssignments } from "@/services/examAssignmentService";
import { getExamSubmission } from "@/services/examSubmissionService";
import type { ExamAssignment, ExamSubmission } from "@/types/examAssignment";

type Row = {
  assignment: ExamAssignment;
  submission: ExamSubmission | null;
};

export default function StudentExamAssignmentsPage() {
  const { user } = useAuth();

  const [rows, setRows] = useState<Row[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user?.uid) {
        return;
      }

      const assignments = await getStudentExamAssignments(user.uid);

      const loadedRows = await Promise.all(
        assignments.map(async (assignment) => ({
          assignment,
          submission: await getExamSubmission(assignment.id, user.uid),
        })),
      );

      setRows(loadedRows);
      setLoading(false);
    }

    void load();
  }, [user?.uid]);

  if (loading) {
    return <Skeleton className="h-96" />;
  }

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-indigo-800 to-violet-800 text-white">
        <h1 className="text-4xl font-black">Written Assessments</h1>

        <p className="mt-3 text-indigo-100">
          Complete assigned exam-style papers and review marked feedback.
        </p>
      </Card>

      {rows.length === 0 ? (
        <Card>No written assessments have been assigned.</Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {rows.map(({ assignment, submission }) => (
            <Card key={assignment.id}>
              <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">
                {assignment.className}
              </p>

              <h2 className="mt-2 text-xl font-black">{assignment.title}</h2>

              <p className="mt-3 text-sm text-slate-600">
                {assignment.questionCount} questions · {assignment.totalMarks}{" "}
                marks
              </p>

              <p className="mt-3 font-bold">
                Status: {submission?.status || "not_started"}
              </p>

              {submission?.status === "marked" ? (
                <div className="mt-4 rounded-xl bg-emerald-50 p-4">
                  <p className="text-2xl font-black text-emerald-900">
                    {submission.totalAwardedMarks}/
                    {submission.totalAvailableMarks} ({submission.percentage}
                    %)
                  </p>

                  <p className="mt-2 text-sm text-emerald-800">
                    {submission.overallFeedback}
                  </p>
                </div>
              ) : null}

              <Link
                href={`/assignments/exam/${assignment.id}`}
                className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white"
              >
                {submission?.status === "marked"
                  ? "Review Feedback"
                  : submission?.status === "submitted"
                    ? "View Submission"
                    : "Open Assessment"}
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
