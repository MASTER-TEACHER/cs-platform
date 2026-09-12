"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";

import { useAuth } from "@/contexts/AuthContext";
import { NEA_STAGE_LABELS } from "@/lib/nea/constants";
import type {
  NeaProject,
  NeaProjectStatus,
} from "@/types/nea";

const statusLabels: Record<NeaProjectStatus, string> = {
  active: "Active",
  submitted: "Submitted",
  completed: "Completed",
  archived: "Archived",
};

export default function TeacherNeaPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<NeaProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] =
    useState<"all" | NeaProjectStatus>("all");
  const [todayDate, setTodayDate] = useState("");

  useEffect(() => {
    void Promise.resolve().then(() => {
      setTodayDate(
        new Date().toISOString().slice(0, 10),
      );
    });
  }, []);

  const loadProjects = useCallback(async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const token = await user.getIdToken(true);
      const response = await fetch("/api/nea/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result = (await response.json()) as {
        projects?: NeaProject[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.error || "NEA projects could not be loaded.",
        );
      }

      setProjects(
        Array.isArray(result.projects)
          ? result.projects
          : [],
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "NEA projects could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void Promise.resolve().then(() => loadProjects());
  }, [loadProjects]);

  const visibleProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          statusFilter === "all" ||
          project.status === statusFilter,
      ),
    [projects, statusFilter],
  );

  const submittedCount = projects.filter(
    (project) => project.status === "submitted",
  ).length;

  const overdueCount = projects.reduce(
    (total, project) =>
      total +
      project.milestones.filter(
        (item) =>
          Boolean(item.dueDate) &&
          item.status !== "complete" &&
          Boolean(todayDate) &&
          item.dueDate! < todayDate,
      ).length,
    0,
  );

  return (
    <main className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-teal-950 to-emerald-900 p-8 text-white">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-teal-200">
          Teacher NEA monitoring
        </p>

        <h1 className="mt-3 text-4xl font-black">
          NEA Project Journey
        </h1>

        <p className="mt-4 max-w-4xl leading-7 text-teal-100">
          Review stage progress, milestone deadlines, evidence,
          reflections and feedback while keeping assessed work with
          the student.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Metric label="Projects" value={String(projects.length)} />
          <Metric
            label="Awaiting review"
            value={String(submittedCount)}
          />
          <Metric
            label="Overdue milestones"
            value={String(overdueCount)}
          />
        </div>
      </section>

      <section className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-4">
        {(
          [
            "all",
            "active",
            "submitted",
            "completed",
            "archived",
          ] as const
        ).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`rounded-xl px-4 py-2 text-sm font-black ${
              statusFilter === status
                ? "bg-slate-950 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {status === "all" ? "All" : statusLabels[status]}
          </button>
        ))}
      </section>

      {loading ? (
        <div className="h-52 animate-pulse rounded-3xl bg-slate-200" />
      ) : visibleProjects.length === 0 ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">
            No matching NEA projects
          </h2>
          <p className="mt-2 text-slate-600">
            Projects matching this status will appear here.
          </p>
        </section>
      ) : (
        <section className="grid gap-5 xl:grid-cols-2">
          {visibleProjects.map((project) => {
            const stageMilestones = project.milestones.filter(
              (item) => item.stage === project.currentStage,
            );
            const completed = stageMilestones.filter(
              (item) => item.status === "complete",
            ).length;
            const overdue = project.milestones.filter(
              (item) =>
                Boolean(item.dueDate) &&
                item.status !== "complete" &&
                Boolean(todayDate) &&
                item.dueDate! < todayDate,
            ).length;

            return (
              <article
                key={project.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest text-teal-700">
                      {project.examBoard} A-level
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-slate-950">
                      {project.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {project.studentName}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-teal-50 px-4 py-3 text-right">
                    <p className="text-xs font-bold uppercase text-teal-700">
                      Overall
                    </p>
                    <p className="text-2xl font-black text-teal-950">
                      {project.overallProgress}%
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 text-xs font-black uppercase tracking-wide">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                    {statusLabels[project.status]}
                  </span>

                  {overdue > 0 ? (
                    <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-800">
                      {overdue} overdue
                    </span>
                  ) : null}
                </div>

                <div className="mt-5 grid grid-cols-5 gap-2">
                  {Object.entries(project.stageProgress).map(
                    ([stage, progress]) => (
                      <div
                        key={stage}
                        className="rounded-xl bg-slate-50 p-3"
                      >
                        <p className="truncate text-xs font-bold text-slate-500">
                          {
                            NEA_STAGE_LABELS[
                              stage as keyof typeof NEA_STAGE_LABELS
                            ]
                          }
                        </p>
                        <p className="mt-1 font-black text-slate-950">
                          {progress}%
                        </p>
                      </div>
                    ),
                  )}
                </div>

                <div className="mt-5 rounded-2xl border border-teal-100 bg-teal-50 p-4">
                  <p className="text-xs font-black uppercase text-teal-700">
                    Current stage
                  </p>
                  <p className="mt-1 font-black text-teal-950">
                    {NEA_STAGE_LABELS[project.currentStage]}
                  </p>
                  <p className="mt-2 text-sm text-teal-900">
                    Milestones complete: {completed}/
                    {stageMilestones.length}
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
                  <MiniMetric
                    label="Evidence"
                    value={String(project.evidenceCount)}
                  />
                  <MiniMetric
                    label="Feedback"
                    value={String(project.teacherFeedbackCount)}
                  />
                  <MiniMetric
                    label="Notes"
                    value={String(project.teacherNoteCount)}
                  />
                </div>

                <Link
                  href={`/teacher/nea/${project.id}`}
                  className="mt-5 inline-flex rounded-xl bg-teal-700 px-5 py-3 font-black text-white"
                >
                  Open project review
                </Link>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <p className="text-sm text-teal-100">{label}</p>
      <p className="mt-1 text-3xl font-black">{value}</p>
    </div>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-slate-500">{label}</p>
      <p className="font-black text-slate-950">{value}</p>
    </div>
  );
}
