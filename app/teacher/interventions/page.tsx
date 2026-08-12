"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import CreateInterventionModal from "@/components/teacher/interventions/CreateInterventionModal";
import InterventionFilters from "@/components/teacher/interventions/InterventionFilters";
import InterventionStudentRow from "@/components/teacher/interventions/InterventionStudentRow";
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
  const [candidates, setCandidates] = useState<InterventionCandidate[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [selected, setSelected] = useState<InterventionCandidate | null>(null);
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("all");
  const [loading, setLoading] = useState(true);
  async function load() {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const [a, b] = await Promise.all([
        getInterventionCandidates(user.uid),
        getTeacherInterventions(user.uid),
      ]);
      setCandidates(a);
      setInterventions(b);
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
      (c) =>
        (!term ||
          c.student.name.toLowerCase().includes(term) ||
          c.priorityTopic.toLowerCase().includes(term) ||
          c.className.toLowerCase().includes(term)) &&
        (priority === "all" || c.priority === priority),
    );
  }, [candidates, priority, search]);
  if (loading)
    return (
      <div className="space-y-6">
        <Skeleton className="h-48" />
        <Skeleton className="h-96" />
      </div>
    );
  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-teal-800 to-cyan-800 text-white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-teal-100">
              Adaptive support
            </p>
            <h1 className="mt-2 text-4xl font-black">Intervention Centre</h1>
            <p className="mt-3 text-teal-100">
              Turn assessment evidence into targeted lesson, quiz and exam
              pathways.
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
          value={interventions.filter((i) => i.status === "active").length}
        />
        <Summary
          label="Completed"
          value={interventions.filter((i) => i.status === "completed").length}
        />
      </div>
      <InterventionFilters
        search={search}
        onSearchChange={setSearch}
        priority={priority}
        onPriorityChange={setPriority}
      />
      <Card>
        <h2 className="text-2xl font-black">Recommended interventions</h2>
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
                  key={candidate.student.uid}
                  candidate={candidate}
                  onCreate={setSelected}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card>
        <h2 className="text-2xl font-black">Existing interventions</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {interventions.length ? (
            interventions.map((i) => (
              <Link
                key={i.id}
                href={`/teacher/interventions/${i.id}`}
                className="rounded-2xl border p-5 hover:border-teal-300"
              >
                <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold uppercase text-teal-700">
                  {i.status}
                </span>
                <h3 className="mt-4 font-black">{i.studentName}</h3>
                <p className="font-bold text-teal-700">{i.topic}</p>
                <p className="mt-3 text-sm text-slate-600">
                  {i.steps.filter((s) => s.status === "completed").length}/
                  {i.steps.length} steps
                </p>
              </Link>
            ))
          ) : (
            <p className="text-slate-500">No interventions yet.</p>
          )}
        </div>
      </Card>
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
function Summary({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </Card>
  );
}
