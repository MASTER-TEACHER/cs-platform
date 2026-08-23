"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const searchParams = useSearchParams();

  const requestedStudentId =
    searchParams.get("studentId")?.trim() || "";

  const requestedStudentName =
    searchParams.get("studentName")?.trim() || "";

  const requestedClassName =
    searchParams.get("className")?.trim() || "";

  const requestedTopic =
    searchParams.get("topic")?.trim() || "";

  const deepLinkApplied =
    useRef(false);

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
  const [error, setError] = useState("");

  async function load() {
    const teacherId =
      user?.uid;

    if (!teacherId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [
        nextCandidates,
        nextInterventions,
      ] = await Promise.all([
        getInterventionCandidates(
          teacherId,
        ),
        getTeacherInterventions(
          teacherId,
        ),
      ]);

      setCandidates(
        nextCandidates,
      );

      setInterventions(
        nextInterventions,
      );

      setSelectedImpactId(
        (current) => {
          if (!current) {
            return null;
          }

          return nextInterventions.some(
            (item) =>
              item.id === current,
          )
            ? current
            : null;
        },
      );
    } catch (caughtError: unknown) {
      const firebaseCode =
        typeof caughtError === "object" &&
        caughtError !== null &&
        "code" in caughtError &&
        typeof (caughtError as { code?: unknown }).code === "string"
          ? (caughtError as { code: string }).code
          : "";

      setCandidates([]);
      setInterventions([]);

      setError(
        firebaseCode === "permission-denied" ||
          firebaseCode === "firestore/permission-denied"
          ? "Intervention data is unavailable for this teacher account."
          : caughtError instanceof Error
            ? caughtError.message
            : "Intervention data could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [user?.uid]);

  /*
   * Analytics -> Intervention hand-off.
   *
   * The same learner may belong to multiple classes, so the hand-off carries
   * both learner identity and class name. We pre-filter the intervention list
   * and automatically open the matching candidate once per navigation.
   */
  useEffect(() => {
    if (
      loading ||
      deepLinkApplied.current ||
      !requestedStudentId
    ) {
      return;
    }

    const requested =
      candidates.find(
        (candidate) =>
          candidate.student.uid ===
            requestedStudentId &&
          (!requestedClassName ||
            candidate.className ===
              requestedClassName),
      );

    if (!requested) {
      if (requestedStudentName) {
        setSearch(
          requestedStudentName,
        );
      }

      return;
    }

    deepLinkApplied.current = true;

    setSearch(
      requestedStudentName ||
        requested.student.name,
    );

    setSelected(
      requested,
    );
  }, [
    loading,
    candidates,
    requestedStudentId,
    requestedStudentName,
    requestedClassName,
  ]);

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

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border border-red-200 bg-red-50">
          <p className="text-sm font-black uppercase tracking-wide text-red-700">
            Intervention Centre
          </p>
          <h1 className="mt-2 text-2xl font-black text-red-950">
            Intervention data unavailable
          </h1>
          <p className="mt-3 text-sm leading-6 text-red-800">
            {error}
          </p>
          <button
            type="button"
            onClick={() => void load()}
            className="mt-5 rounded-xl bg-red-700 px-5 py-3 text-sm font-black text-white transition hover:bg-red-800"
          >
            Try again
          </button>
        </Card>
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

      {requestedStudentId && (
        <Card className="border border-violet-200 bg-violet-50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-700">
                Analytics hand-off
              </p>

              <h2 className="mt-1 text-xl font-black text-violet-950">
                {requestedStudentName || "Selected learner"}
                {requestedClassName
                  ? ` · ${requestedClassName}`
                  : ""}
              </h2>

              <p className="mt-2 text-sm leading-6 text-violet-800">
                This intervention context came directly from Teacher Analytics.
                {requestedTopic
                  ? ` Current evidence highlights ${requestedTopic}.`
                  : ""}
              </p>
            </div>

            <Link
              href="/teacher/analytics"
              className="shrink-0 rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-black text-violet-700"
            >
              Back to analytics
            </Link>
          </div>
        </Card>
      )}

      <Card>
        <h2 className="text-2xl font-black">
          Recommended interventions
        </h2>

        <div className="mt-6 overflow-x-auto">
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
                  key={`${candidate.student.uid}-${candidate.className}`}
                  candidate={candidate}
                  onCreate={setSelected}
                />
              ))}
            </tbody>
          </table>
        </div>
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
