"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Code2, Loader2, Plus, Search } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { getTeacherProgrammingAssignments } from "@/services/programmingAssignmentService";
import type { ProgrammingAssignment } from "@/types/programmingAssignment";

function formatDate(value: Date | null): string {
  if (!value) return "No due date";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

export default function TeacherProgrammingAssignmentsPage() {
  const { user } = useAuth();

  const [assignments, setAssignments] =
    useState<ProgrammingAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadAssignments = useCallback(async () => {
    if (!user?.uid) {
      setAssignments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      setAssignments(
        await getTeacherProgrammingAssignments(user.uid),
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Programming assignments could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    void loadAssignments();
  }, [loadAssignments]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return assignments;

    return assignments.filter(
      (assignment) =>
        assignment.title.toLowerCase().includes(term) ||
        assignment.className.toLowerCase().includes(term) ||
        assignment.topic.toLowerCase().includes(term),
    );
  }, [assignments, search]);

  const completed = assignments.reduce(
    (total, assignment) => total + assignment.completedCount,
    0,
  );

  const students = assignments.reduce(
    (total, assignment) => total + assignment.studentCount,
    0,
  );

  if (loading) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-cyan-700" />
      </main>
    );
  }

  return (
    <div className="space-y-7">
      <section className="rounded-3xl bg-gradient-to-br from-cyan-800 via-blue-800 to-indigo-800 p-8 text-white shadow-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-100">
              Teacher programming
            </p>
            <h1 className="mt-2 text-4xl font-black">
              Programming assignments
            </h1>
            <p className="mt-3 max-w-2xl text-cyan-50">
              Assign exact coding tasks and review class completion,
              attempts and test performance.
            </p>
          </div>

          <Link
            href="/teacher/assignment-wizard"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-black text-blue-800"
          >
            <Plus className="h-4 w-4" />
            New assignment
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Metric label="Assignments" value={assignments.length} />
        <Metric label="Students assigned" value={students} />
        <Metric label="Completions" value={completed} />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search programming assignments..."
            className="min-h-12 w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none focus:border-cyan-600"
          />
        </div>
      </section>

      {error ? (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
          {error}
        </section>
      ) : filtered.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Code2 className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="mt-4 text-xl font-black text-slate-900">
            No programming assignments yet
          </h2>
          <p className="mt-2 text-slate-500">
            Use the Assignment Wizard and choose Programming Challenge.
          </p>
        </section>
      ) : (
        <section className="grid gap-5 xl:grid-cols-2">
          {filtered.map((assignment) => {
            const completion =
              assignment.studentCount > 0
                ? Math.round(
                    (assignment.completedCount /
                      assignment.studentCount) *
                      100,
                  )
                : 0;

            return (
              <article
                key={assignment.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-cyan-700">
                      {assignment.challengeSnapshot.mode} ·{" "}
                      {assignment.challengeSnapshot.difficulty}
                    </p>
                    <h2 className="mt-2 text-xl font-black text-slate-950">
                      {assignment.title}
                    </h2>
                    <p className="mt-2 font-bold text-blue-700">
                      {assignment.className}
                    </p>
                  </div>
                  <Code2 className="h-7 w-7 text-cyan-700" />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <Info label="Due" value={formatDate(assignment.dueDate)} />
                  <Info
                    label="Completed"
                    value={`${assignment.completedCount}/${assignment.studentCount}`}
                  />
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-sm font-bold text-slate-700">
                    <span>Completion</span>
                    <span>{completion}%</span>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-cyan-600"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </div>

                <Link
                  href={`/teacher/programming-assignments/${assignment.id}`}
                  className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-cyan-700 px-5 py-3 font-black text-white hover:bg-cyan-800"
                >
                  View programming results
                </Link>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-2 font-bold text-slate-800">{value}</p>
    </div>
  );
}
