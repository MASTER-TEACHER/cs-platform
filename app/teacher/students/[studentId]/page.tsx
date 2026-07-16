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
  type Timestamp,
} from "firebase/firestore";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { db } from "@/lib/firebase";

type StudentProfile = {
  id: string;
  name: string;
  email: string;
  xp: number;
  streak: number;
  badges: string[];
  completedLessons: string[];
  qualification?: string;
  examBoard?: string;
  currentCourse?: string;
};

type AssignmentRecord = {
  id: string;
  title: string;
  type: "lesson" | "quiz";
  dueDate: string;
};

type AssignmentResult = {
  id: string;
  assignmentId: string;
  studentId: string;
  percentage: number;
  score: number;
  totalQuestions: number;
  earnedXP: number;
  status: string;
  completedAt?: Timestamp;
};

type ProgressRow = {
  assignment: AssignmentRecord | null;
  result: AssignmentResult;
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

function formatDate(timestamp?: Timestamp) {
  if (!timestamp) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(timestamp.toDate());
}

export default function TeacherStudentProfilePage() {
  const params = useParams<{ studentId: string }>();
  const studentId = params.studentId;

  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [progressRows, setProgressRows] = useState<ProgressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadStudentProgress() {
      try {
        const studentSnapshot = await getDoc(
          doc(db, "users", studentId)
        );

        if (!studentSnapshot.exists()) {
          setNotFound(true);
          return;
        }

        const studentData = studentSnapshot.data();

        if (studentData.role !== "student") {
          setNotFound(true);
          return;
        }

        const loadedStudent: StudentProfile = {
          id: studentSnapshot.id,
          name: studentData.name || "Student",
          email: studentData.email || "No email available",
          xp: studentData.xp || 0,
          streak: studentData.streak || 0,
          badges: Array.isArray(studentData.badges)
            ? studentData.badges
            : [],
          completedLessons: Array.isArray(studentData.completedLessons)
            ? studentData.completedLessons
            : [],
          qualification: studentData.qualification,
          examBoard: studentData.examBoard,
          currentCourse: studentData.currentCourse,
        };

        const resultsSnapshot = await getDocs(
          query(
            collection(db, "assignmentResults"),
            where("studentId", "==", studentId)
          )
        );

        const results: AssignmentResult[] = resultsSnapshot.docs.map(
          (resultDocument) => {
            const data = resultDocument.data();

            return {
              id: resultDocument.id,
              assignmentId: data.assignmentId || "",
              studentId: data.studentId || "",
              percentage: data.percentage || 0,
              score: data.score || 0,
              totalQuestions: data.totalQuestions || 0,
              earnedXP: data.earnedXP || 0,
              status: data.status || "completed",
              completedAt: data.completedAt,
            };
          }
        );

        const assignmentIds = Array.from(
          new Set(
            results
              .map((result) => result.assignmentId)
              .filter(Boolean)
          )
        );

        const assignmentSnapshots = await Promise.all(
          assignmentIds.map((assignmentId) =>
            getDoc(doc(db, "assignments", assignmentId))
          )
        );

        const assignments = new Map<string, AssignmentRecord>();

        assignmentSnapshots.forEach((snapshot) => {
          if (!snapshot.exists()) {
            return;
          }

          const data = snapshot.data();

          assignments.set(snapshot.id, {
            id: snapshot.id,
            title: data.title || "Untitled Assignment",
            type: data.type === "quiz" ? "quiz" : "lesson",
            dueDate: data.dueDate || "",
          });
        });

        const rows: ProgressRow[] = results
          .map((result) => ({
            result,
            assignment: assignments.get(result.assignmentId) || null,
          }))
          .sort((a, b) => {
            const aTime = a.result.completedAt?.toMillis() || 0;
            const bTime = b.result.completedAt?.toMillis() || 0;

            return bTime - aTime;
          });

        setStudent(loadedStudent);
        setProgressRows(rows);
      } catch (error) {
        console.error("Failed to load student progress:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    if (studentId) {
      void loadStudentProgress();
    }
  }, [studentId]);

  const completedAssignments = progressRows.length;

  const averageScore = useMemo(() => {
    if (progressRows.length === 0) {
      return 0;
    }

    const total = progressRows.reduce(
      (sum, row) => sum + row.result.percentage,
      0
    );

    return Math.round(total / progressRows.length);
  }, [progressRows]);

  const highestScore = useMemo(() => {
    if (progressRows.length === 0) {
      return 0;
    }

    return Math.max(
      ...progressRows.map((row) => row.result.percentage)
    );
  }, [progressRows]);

  const lowestScore = useMemo(() => {
    if (progressRows.length === 0) {
      return 0;
    }

    return Math.min(
      ...progressRows.map((row) => row.result.percentage)
    );
  }, [progressRows]);

  const strengths = progressRows
    .filter((row) => row.result.percentage >= 70)
    .slice(0, 3);

  const needsSupport = progressRows
    .filter((row) => row.result.percentage < 50)
    .slice(0, 3);

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

  if (notFound || !student) {
    return (
      <Card>
        <h1 className="text-2xl font-bold text-slate-900">
          Student not found
        </h1>

        <p className="mt-3 text-slate-600">
          This student profile does not exist or is not a student account.
        </p>

        <Link
          href="/teacher/students"
          className="mt-6 inline-flex rounded-xl bg-teal-600 px-5 py-3 font-bold text-white transition hover:bg-teal-700"
        >
          ← Back to students
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
              Student Progress
            </p>

            <h1 className="mt-3 text-4xl font-extrabold">
              {student.name}
            </h1>

            <p className="mt-2 text-emerald-100">
              {student.email}
            </p>
          </div>

          <Link
            href="/teacher/students"
            className="rounded-xl bg-white px-5 py-3 text-center font-bold text-teal-700 transition hover:bg-emerald-50"
          >
            ← All Students
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Average Score"
          value={`${averageScore}%`}
          icon="📊"
        />

        <SummaryCard
          label="Current Grade"
          value={getGrade(averageScore)}
          icon="🎓"
        />

        <SummaryCard
          label="Assignments Completed"
          value={completedAssignments.toString()}
          icon="✅"
        />

        <SummaryCard
          label="Current XP"
          value={student.xp.toString()}
          icon="⭐"
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

        <SummaryCard
          label="Current Streak"
          value={student.streak.toString()}
          icon="🔥"
        />

        <SummaryCard
          label="Badges"
          value={student.badges.length.toString()}
          icon="🏅"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <p className="text-sm font-semibold uppercase tracking-wide text-green-600">
            Strengths
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Secure Areas
          </h2>

          {strengths.length === 0 ? (
            <p className="mt-6 text-slate-600">
              No secure assignment areas have been identified yet.
            </p>
          ) : (
            <div className="mt-6 space-y-3">
              {strengths.map(({ assignment, result }) => (
                <div
                  key={result.id}
                  className="rounded-xl border border-green-200 bg-green-50 p-4"
                >
                  <p className="font-bold text-slate-900">
                    {assignment?.title || "Assignment"}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-green-700">
                    {result.percentage}%
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
            Intervention
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Needs Support
          </h2>

          {needsSupport.length === 0 ? (
            <p className="mt-6 text-slate-600">
              No low-scoring assignment areas are currently identified.
            </p>
          ) : (
            <div className="mt-6 space-y-3">
              {needsSupport.map(({ assignment, result }) => (
                <div
                  key={result.id}
                  className="rounded-xl border border-red-200 bg-red-50 p-4"
                >
                  <p className="font-bold text-slate-900">
                    {assignment?.title || "Assignment"}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-red-700">
                    {result.percentage}% — targeted revision recommended
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Progress Timeline
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Assignment History
        </h2>

        {progressRows.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-slate-50 p-10 text-center">
            <div className="text-5xl">📈</div>

            <h3 className="mt-4 text-2xl font-bold text-slate-900">
              No completed assignments yet
            </h3>

            <p className="mt-2 text-slate-600">
              Results will appear here once the student completes assigned work.
            </p>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-sm uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-2">Assignment</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Score</th>
                  <th className="px-4 py-2">Percentage</th>
                  <th className="px-4 py-2">Grade</th>
                  <th className="px-4 py-2">XP</th>
                  <th className="px-4 py-2">Completed</th>
                </tr>
              </thead>

              <tbody>
                {progressRows.map(({ assignment, result }) => (
                  <tr
                    key={result.id}
                    className="bg-slate-50 text-slate-700"
                  >
                    <td className="rounded-l-2xl px-4 py-4">
                      <p className="font-bold text-slate-900">
                        {assignment?.title || "Unknown Assignment"}
                      </p>
                    </td>

                    <td className="px-4 py-4 font-semibold capitalize">
                      {assignment?.type || "quiz"}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      {result.score} / {result.totalQuestions}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      {result.percentage}%
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      {getGrade(result.percentage)}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      ⭐ {result.earnedXP}
                    </td>

                    <td className="rounded-r-2xl px-4 py-4 text-sm font-semibold">
                      {formatDate(result.completedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
            Course Details
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Learning Programme
          </h2>

          <div className="mt-6 space-y-4">
            <DetailRow
              label="Qualification"
              value={student.qualification?.toUpperCase() || "Not selected"}
            />

            <DetailRow
              label="Exam Board"
              value={student.examBoard?.toUpperCase() || "Not selected"}
            />

            <DetailRow
              label="Current Course"
              value={student.currentCourse?.toUpperCase() || "Not selected"}
            />

            <DetailRow
              label="Lessons Completed"
              value={student.completedLessons.length.toString()}
            />
          </div>
        </Card>

        <Card>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Achievements
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Badges Earned
          </h2>

          {student.badges.length === 0 ? (
            <p className="mt-6 text-slate-600">
              This student has not earned any badges yet.
            </p>
          ) : (
            <div className="mt-6 flex flex-wrap gap-3">
              {student.badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700"
                >
                  🏆 {badge}
                </span>
              ))}
            </div>
          )}
        </Card>
      </div>
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

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-4">
      <span className="font-semibold text-slate-600">
        {label}
      </span>

      <span className="text-right font-bold text-slate-900">
        {value}
      </span>
    </div>
  );
}