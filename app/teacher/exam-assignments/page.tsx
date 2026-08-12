"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { getTeacherExamAssignments } from "@/services/examAssignmentService";
import type { ExamAssignment } from "@/types/examAssignment";

function formatDate(value: Date | null) {
  return value
    ? value.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No due date";
}

export default function TeacherExamAssignmentsPage() {
  const { user } = useAuth();

  const [assignments, setAssignments] = useState<ExamAssignment[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!user?.uid) {
        return;
      }

      try {
        setAssignments(await getTeacherExamAssignments(user.uid));
      } catch (caughtError) {
        console.error("Load exam assignments error:", caughtError);

        setError("Exam assignments could not be loaded.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48" />
        <Skeleton className="h-56" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-indigo-800 to-violet-800 text-white">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-indigo-100">
              Written assessment
            </p>

            <h1 className="mt-2 text-4xl font-black">Exam Assignments</h1>

            <p className="mt-3 text-indigo-100">
              Monitor submissions and mark written papers.
            </p>
          </div>

          <Link
            href="/teacher/question-bank"
            className="rounded-xl bg-white px-5 py-3 text-center font-bold text-indigo-800"
          >
            Question Bank
          </Link>
        </div>
      </Card>

      {error && (
        <Card className="border border-red-200 bg-red-50">
          <p className="font-bold text-red-800">{error}</p>
        </Card>
      )}

      {assignments.length === 0 ? (
        <Card>
          <h2 className="text-2xl font-black">No exam assignments yet</h2>

          <p className="mt-3 text-slate-600">
            Open a saved question set and assign it to a class.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {assignments.map((assignment) => (
            <Card key={assignment.id}>
              <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">
                {assignment.className}
              </p>

              <h2 className="mt-2 text-xl font-black">{assignment.title}</h2>

              <p className="mt-3 text-sm text-slate-600">
                Due {formatDate(assignment.dueDate)}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-bold text-slate-500">Submitted</p>
                  <p className="mt-1 text-xl font-black">
                    {assignment.submittedCount}/{assignment.studentIds.length}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-bold text-slate-500">Marked</p>
                  <p className="mt-1 text-xl font-black">
                    {assignment.markedCount}/{assignment.studentIds.length}
                  </p>
                </div>
              </div>

              <Link
                href={`/teacher/exam-assignments/${assignment.id}`}
                className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white"
              >
                Open Markbook
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
