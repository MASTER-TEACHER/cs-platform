"use client";

import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

import Card from "@/components/ui/Card";
import { useTeacherIntelligence } from "@/hooks/useTeacherIntelligence";
import { getPriorityStudents } from "@/services/analytics/teacherIntelligenceIntegrationService";

export default function StudentsIntelligencePanel() {
  const { portfolio, loading, error } = useTeacherIntelligence();
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    if (!portfolio) return [];

    const query = search.trim().toLowerCase();

    return getPriorityStudents(portfolio).filter((student) => {
      if (!query) return true;

      return (
        student.studentName.toLowerCase().includes(query) ||
        student.studentEmail.toLowerCase().includes(query) ||
        student.className.toLowerCase().includes(query)
      );
    });
  }, [portfolio, search]);

  if (loading) {
    return (
      <Card className="h-64 animate-pulse rounded-3xl bg-slate-100">
        <div className="h-full" />
      </Card>
    );
  }

  if (error || !portfolio) {
    return null;
  }

  return (
    <Card className="overflow-hidden rounded-3xl border border-slate-200">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-teal-600">
            Student intelligence
          </p>

          <h2 className="mt-2 text-2xl font-black text-slate-950">
            Attainment overview
          </h2>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search students..."
            className="min-h-11 min-w-[280px] rounded-xl border border-slate-200 pl-10 pr-4 text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[950px] w-full text-left">
          <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4">Student</th>
              <th className="px-5 py-4">Class</th>
              <th className="px-5 py-4">Working</th>
              <th className="px-5 py-4">Target</th>
              <th className="px-5 py-4">Gap</th>
              <th className="px-5 py-4">Trend</th>
              <th className="px-5 py-4">Completion</th>
              <th className="px-5 py-4">Priority</th>
              <th className="px-5 py-4">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((student) => (
              <tr key={`${student.classId}-${student.studentId}`}>
                <td className="px-5 py-4">
                  <p className="font-black text-slate-900">
                    {student.studentName}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {student.studentEmail}
                  </p>
                </td>
                <td className="px-5 py-4 text-sm font-bold">
                  {student.className}
                </td>
                <td className="px-5 py-4 text-lg font-black">
                  {student.workingGrade}
                </td>
                <td className="px-5 py-4 text-lg font-black">
                  {student.targetGrade}
                </td>
                <td className="px-5 py-4 font-black">
                  {student.gap === null
                    ? "—"
                    : student.gap >= 0
                      ? `+${student.gap}`
                      : student.gap}
                </td>
                <td className="px-5 py-4 text-sm capitalize">
                  {student.trend.replace(/_/g, " ")}
                </td>
                <td className="px-5 py-4 font-black">
                  {student.completionRate}%
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black capitalize">
                    {student.priority}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/teacher/analytics/${student.studentId}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white"
                  >
                    Intelligence
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
