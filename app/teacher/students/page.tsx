"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useStudents } from "@/hooks/useStudents";

export default function TeacherStudentsPage() {
  const { students, loading } = useStudents();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return students;
    }

    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(search) ||
        student.email.toLowerCase().includes(search)
    );
  }, [searchTerm, students]);

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-44 w-full" />

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

  const totalXP = students.reduce(
    (total, student) => total + student.xp,
    0
  );

  const totalLessons = students.reduce(
    (total, student) => total + student.completedLessons,
    0
  );

  const averageXP =
    students.length > 0 ? Math.round(totalXP / students.length) : 0;

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-100">
              Teacher Portal
            </p>

            <h1 className="mt-3 text-4xl font-extrabold">
              Manage Students
            </h1>

            <p className="mt-3 max-w-2xl text-emerald-100">
              Review student progress, XP, streaks, badges and completed
              lessons.
            </p>
          </div>

          <Link
            href="/teacher"
            className="rounded-xl bg-white px-5 py-3 text-center font-bold text-teal-700 transition hover:bg-emerald-50"
          >
            ← Teacher Dashboard
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total Students"
          value={students.length.toString()}
          icon="👨‍🎓"
        />

        <SummaryCard
          label="Average XP"
          value={averageXP.toString()}
          icon="⭐"
        />

        <SummaryCard
          label="Lessons Completed"
          value={totalLessons.toString()}
          icon="📚"
        />

        <SummaryCard
          label="Active Streaks"
          value={students
            .filter((student) => student.streak > 0)
            .length.toString()}
          icon="🔥"
        />
      </div>

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
              Student Directory
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              All Students
            </h2>
          </div>

          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 md:max-w-sm"
          />
        </div>

        {filteredStudents.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-slate-50 p-8 text-center">
            <div className="text-4xl">🔍</div>

            <h3 className="mt-4 text-xl font-bold text-slate-900">
              No students found
            </h3>

            <p className="mt-2 text-slate-600">
              Try another search term or register a student account.
            </p>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-sm uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-2">Student</th>
                  <th className="px-4 py-2">XP</th>
                  <th className="px-4 py-2">Lessons</th>
                  <th className="px-4 py-2">Streak</th>
                  <th className="px-4 py-2">Badges</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => (
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
                      ⭐ {student.xp}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      📚 {student.completedLessons}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      🔥 {student.streak}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      🏆 {student.badges}
                    </td>

                    <td className="rounded-r-2xl px-4 py-4">
                      <Link
                        href={`/teacher/students/${student.id}`}
                        className="inline-flex rounded-lg bg-teal-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-700"
                      >
                        View Profile
                      </Link>
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
      <div className="flex items-center justify-between">
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