"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { db } from "@/lib/firebase";

type AssignmentRecord = {
  id: string;
  classId: string;
  teacherId: string;
  title: string;
  description: string;
  type: "lesson" | "quiz";
  resourceId: string;
  dueDate: string;
  status: string;
};

type StudentRecord = {
  id: string;
  name: string;
  email: string;
};

type AssignmentResult = {
  id: string;
  studentId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  earnedXP: number;
  status: string;
};

type MarkbookRow = {
  student: StudentRecord;
  result: AssignmentResult | null;
};

function getGrade(percentage: number) {
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

export default function AssignmentMarkbookPage() {
  const params = useParams<{ assignmentId: string }>();
  const assignmentId = params.assignmentId;

  const [assignment, setAssignment] = useState<AssignmentRecord | null>(null);
  const [rows, setRows] = useState<MarkbookRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadMarkbook() {
      try {
        const assignmentSnapshot = await getDoc(
          doc(db, "assignments", assignmentId)
        );

        if (!assignmentSnapshot.exists()) {
          setNotFound(true);
          return;
        }

        const assignmentData = assignmentSnapshot.data();

        const loadedAssignment: AssignmentRecord = {
          id: assignmentSnapshot.id,
          classId: assignmentData.classId || "",
          teacherId: assignmentData.teacherId || "",
          title: assignmentData.title || "Untitled Assignment",
          description: assignmentData.description || "",
          type: assignmentData.type === "quiz" ? "quiz" : "lesson",
          resourceId: assignmentData.resourceId || "",
          dueDate: assignmentData.dueDate || "",
          status: assignmentData.status || "active",
        };

        const classSnapshot = await getDoc(
          doc(db, "classes", loadedAssignment.classId)
        );

        if (!classSnapshot.exists()) {
          setAssignment(loadedAssignment);
          setRows([]);
          return;
        }

        const classData = classSnapshot.data();

        const studentIds: string[] = Array.isArray(classData.studentIds)
          ? classData.studentIds
          : [];

        const studentSnapshots = await Promise.all(
          studentIds.map((studentId) =>
            getDoc(doc(db, "users", studentId))
          )
        );

        const students: StudentRecord[] = studentSnapshots
          .filter((snapshot) => snapshot.exists())
          .map((snapshot) => {
            const data = snapshot.data();

            return {
              id: snapshot.id,
              name: data.name || "Student",
              email: data.email || "No email available",
            };
          });

        const resultsQuery = query(
          collection(db, "assignmentResults"),
          where("assignmentId", "==", assignmentId)
        );

        const resultsSnapshot = await getDocs(resultsQuery);

        const results: AssignmentResult[] = resultsSnapshot.docs.map(
          (resultDocument) => {
            const data = resultDocument.data();

            return {
              id: resultDocument.id,
              studentId: data.studentId || "",
              score: data.score || 0,
              totalQuestions: data.totalQuestions || 0,
              percentage: data.percentage || 0,
              earnedXP: data.earnedXP || 0,
              status: data.status || "completed",
            };
          }
        );

        const markbookRows: MarkbookRow[] = students.map((student) => ({
          student,
          result:
            results.find((result) => result.studentId === student.id) || null,
        }));

        markbookRows.sort((a, b) =>
          a.student.name.localeCompare(b.student.name)
        );

        setAssignment(loadedAssignment);
        setRows(markbookRows);
      } catch (error) {
        console.error("Failed to load assignment markbook:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    if (assignmentId) {
      void loadMarkbook();
    }
  }, [assignmentId]);

  const completedRows = useMemo(
    () => rows.filter((row) => row.result),
    [rows]
  );

  const completionRate =
    rows.length > 0
      ? Math.round((completedRows.length / rows.length) * 100)
      : 0;

  const averageScore =
    completedRows.length > 0
      ? Math.round(
          completedRows.reduce(
            (total, row) => total + (row.result?.percentage || 0),
            0
          ) / completedRows.length
        )
      : 0;

  const highestScore =
    completedRows.length > 0
      ? Math.max(
          ...completedRows.map((row) => row.result?.percentage || 0)
        )
      : 0;

  const lowestScore =
    completedRows.length > 0
      ? Math.min(
          ...completedRows.map((row) => row.result?.percentage || 0)
        )
      : 0;

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-52 w-full" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>

        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (notFound || !assignment) {
    return (
      <Card>
        <h1 className="text-2xl font-bold text-slate-900">
          Assignment not found
        </h1>

        <p className="mt-3 text-slate-600">
          This assignment does not exist or could not be loaded.
        </p>

        <Link
          href="/teacher/assignments"
          className="mt-6 inline-flex rounded-xl bg-teal-600 px-5 py-3 font-bold text-white transition hover:bg-teal-700"
        >
          ← Back to assignments
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-100">
              Assignment Markbook
            </p>

            <h1 className="mt-3 text-4xl font-extrabold">
              {assignment.title}
            </h1>

            <p className="mt-3 max-w-2xl text-emerald-100">
              {assignment.description}
            </p>

            <p className="mt-3 text-sm text-emerald-100">
              Due: {assignment.dueDate || "No due date"}
            </p>
          </div>

          <Link
            href="/teacher/assignments"
            className="rounded-xl bg-white px-5 py-3 text-center font-bold text-teal-700 transition hover:bg-emerald-50"
          >
            ← All Assignments
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Completion Rate"
          value={`${completionRate}%`}
          icon="✅"
        />

        <SummaryCard
          label="Average Score"
          value={`${averageScore}%`}
          icon="📊"
        />

        <SummaryCard
          label="Highest Score"
          value={`${highestScore}%`}
          icon="🏆"
        />

        <SummaryCard
          label="Lowest Score"
          value={`${lowestScore}%`}
          icon="⚠️"
        />
      </div>

      <Card>
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
          Student Results
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Markbook
        </h2>

        {rows.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-slate-50 p-10 text-center">
            <div className="text-5xl">👨‍🎓</div>

            <h3 className="mt-4 text-2xl font-bold text-slate-900">
              No students in this class
            </h3>

            <p className="mt-2 text-slate-600">
              Add students to the class before reviewing assignment results.
            </p>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-sm uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-2">Student</th>
                  <th className="px-4 py-2">Score</th>
                  <th className="px-4 py-2">Percentage</th>
                  <th className="px-4 py-2">Grade</th>
                  <th className="px-4 py-2">XP</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>

              <tbody>
                {rows.map(({ student, result }) => (
                  <tr
                    key={student.id}
                    className="bg-slate-50 text-slate-700"
                  >
                    <td className="rounded-l-2xl px-4 py-4">
                      <p className="font-bold text-slate-900">
                        {student.name}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {student.email}
                      </p>
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      {result
                        ? `${result.score} / ${result.totalQuestions}`
                        : "—"}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      {result ? `${result.percentage}%` : "—"}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      {result ? getGrade(result.percentage) : "—"}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      {result ? `⭐ ${result.earnedXP}` : "—"}
                    </td>

                    <td className="rounded-r-2xl px-4 py-4">
                      {result ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                          Completed
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                          Not Started
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="text-3xl">{icon}</div>
      </div>
    </Card>
  );
}