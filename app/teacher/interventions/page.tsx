"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowRight } from "lucide-react";

import CreateInterventionModal from "@/components/teacher/interventions/CreateInterventionModal";
import InterventionActionContext from "@/components/teacher/interventions/InterventionActionContext";
import InterventionEffectivenessOverview from "@/components/teacher/interventions/InterventionEffectivenessOverview";
import InterventionFilters from "@/components/teacher/interventions/InterventionFilters";
import InterventionImpactCard from "@/components/teacher/interventions/InterventionImpactCard";
import InterventionStudentRow from "@/components/teacher/interventions/InterventionStudentRow";
import InterventionIntelligencePanel from "@/components/teacher/intelligence/InterventionIntelligencePanel";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  getInterventionCandidates,
  type InterventionCandidate,
} from "@/services/interventionAnalyticsService";
import { getTeacherInterventions } from "@/services/interventionService";
import type { Intervention } from "@/types/intervention";

export default function TeacherInterventionsPage() {
  const { user } = useAuth();
  const { profile } = useUserProfile();

  const [candidates, setCandidates] =
    useState<InterventionCandidate[]>([]);
  const [interventions, setInterventions] =
    useState<Intervention[]>([]);
  const [selected, setSelected] =
    useState<InterventionCandidate | null>(null);
  const [selectedImpactId, setSelectedImpactId] =
    useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("all");
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const [nextCandidates, nextInterventions] = await Promise.all([
        getInterventionCandidates(user.uid),
        getTeacherInterventions(user.uid),
      ]);

      setCandidates(nextCandidates);
      setInterventions(nextInterventions);

      setSelectedImpactId((current) => {
        if (!current) return null;

        return nextInterventions.some((item) => item.id === current)
          ? current
          : null;
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [user?.uid]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return candidates.filter(
      (candidate) =>
        (!term ||
          candidate.student.name.toLowerCase().includes(term) ||
          candidate.priorityTopic.toLowerCase().includes(term) ||
          candidate.className.toLowerCase().includes(term)) &&
        (priority === "all" || candidate.priority === priority),
    );
  }, [candidates, priority, search]);

  const effectivenessSources = useMemo(
    () =>
      interventions.map((intervention) => ({
        id: intervention.id,
        studentName: intervention.studentName,
        topic: intervention.topic,
        status: intervention.status,
      })),
    [interventions],
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-teal-800 to-cyan-800 text-white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-teal-100">
              Adaptive support
            </p>
            <h1 className="mt-2 text-4xl font-black">
              Intervention Centre
            </h1>
            <p className="mt-3 text-teal-100">
              Turn assessment evidence into targeted lesson, quiz and exam
              pathways, then measure whether support actually improves learner
              outcomes.
            </p>
          </div>

          <Link
            href="/teacher"
            className="rounded-xl border border-white/20 px-5 py-3 font-bold"
          >
            Teacher Dashboard
          </Link>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Summary label="Students reviewed" value={candidates.length} />
        <Summary
          label="Active interventions"
          value={
            interventions.filter((item) => item.status === "active").length
          }
        />
        <Summary
          label="Completed"
          value={
            interventions.filter((item) => item.status === "completed").length
          }
        />
      </div>

      {user?.uid && (
        <InterventionEffectivenessOverview
          teacherId={user.uid}
          interventions={effectivenessSources}
        />
      )}

      <InterventionFilters
        search={search}
        onSearchChange={setSearch}
        priority={priority}
        onPriorityChange={setPriority}
      />

      <InterventionActionContext />

      <Card>
  <h2 className="text-2xl font-black">
    Recommended interventions
  </h2>

  {filtered.length === 0 ? (
    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <p className="font-bold text-slate-700">
        No matching intervention recommendations
      </p>

      <p className="mt-2 text-sm text-slate-500">
        Try changing the search term or priority filter.
      </p>
    </div>
  ) : (
    <>
      {/*
       * Mobile layout:
       * show each candidate as a readable card instead of
       * forcing the desktop table into a 390px viewport.
       */}
      <div className="mt-6 grid gap-4 md:hidden">
        {filtered.map((candidate) => (
          <article
            key={candidate.student.uid}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="flex flex-col gap-1">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Student
              </p>

              <h3 className="text-lg font-black text-slate-950">
                {candidate.student.name}
              </h3>

              <p className="text-sm text-slate-500">
                {candidate.student.email}
              </p>

              <p className="text-sm font-semibold text-slate-600">
                {candidate.className}
              </p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                  Performance
                </p>

                <p className="mt-1 text-xl font-black text-slate-950">
  {candidate.priorityTopicScore}%
</p>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                  Priority
                </p>

                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-black uppercase ${
                    candidate.priority === "high"
                      ? "bg-red-100 text-red-700"
                      : candidate.priority === "medium"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {candidate.priority}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Priority topic
              </p>

              <p className="mt-1 font-black text-slate-900">
                {candidate.priorityTopic}
              </p>
            </div>

            <div className="mt-5">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Recommendation
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                {candidate.recommendation}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelected(candidate)}
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-teal-600 px-4 text-sm font-black text-white transition hover:bg-teal-700"
            >
              Create intervention
            </button>
          </article>
        ))}
      </div>

      {/*
       * Desktop / tablet layout:
       * preserve the existing table.
       */}
      <div className="mt-6 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="border-b bg-slate-50 text-left">
              <th className="p-4">Student</th>
              <th className="p-4">Performance</th>
              <th className="p-4">Priority topic</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Recommendation</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((candidate) => (
              <InterventionStudentRow
                key={candidate.student.uid}
                candidate={candidate}
                onCreate={setSelected}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )}
</Card>

      <InterventionIntelligencePanel />

      <Card>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-600">
              Review cycle
            </p>
            <h2 className="mt-1 text-2xl font-black">
              Existing interventions
            </h2>
          </div>

          <p className="text-sm text-slate-500">
            Open an intervention or compare its before-and-after evidence.
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {interventions.length ? (
            interventions.map((intervention) => {
              const reviewing = selectedImpactId === intervention.id;

              return (
                <article
                  key={intervention.id}
                  className="rounded-2xl border border-slate-200 p-5 transition hover:border-teal-300"
                >
                  <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold uppercase text-teal-700">
                    {intervention.status}
                  </span>

                  <h3 className="mt-4 font-black">
                    {intervention.studentName}
                  </h3>

                  <p className="font-bold text-teal-700">
                    {intervention.topic}
                  </p>

                  <p className="mt-3 text-sm text-slate-600">
                    {
                      intervention.steps.filter(
                        (step) => step.status === "completed",
                      ).length
                    }
                    /{intervention.steps.length} steps
                  </p>

                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    <Link
                      href={`/teacher/interventions/${intervention.id}`}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-black text-slate-700 transition hover:bg-slate-50"
                    >
                      Open
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedImpactId((current) =>
                          current === intervention.id
                            ? null
                            : intervention.id,
                        )
                      }
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-xs font-black text-white transition hover:bg-violet-700"
                    >
                      <Activity className="h-4 w-4" />
                      {reviewing ? "Hide impact" : "Review impact"}
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <p className="text-slate-500">
              No interventions yet.
            </p>
          )}
        </div>
      </Card>

      {selectedImpactId && user?.uid && (
        <InterventionImpactCard
          interventionId={selectedImpactId}
          teacherId={user.uid}
        />
      )}

      <CreateInterventionModal
        candidate={selected}
        teacherId={user?.uid || ""}
        teacherName={profile?.name || "Teacher"}
        onClose={() => setSelected(null)}
        onCreated={() => {
          setSelected(null);
          void load();
        }}
      />
    </div>
  );
}

function Summary({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <Card>
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </Card>
  );
}
