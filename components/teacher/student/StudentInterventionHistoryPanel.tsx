"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  CheckCircle2,
  Clock3,
  History,
} from "lucide-react";

import InterventionImpactCard from "@/components/teacher/interventions/InterventionImpactCard";
import Card from "@/components/ui/Card";
import { getTeacherStudentInterventionHistory } from "@/services/teacherStudentInterventionHistoryService";
import type { TeacherInterventionHistoryItem } from "@/types/teacherActionWorkflow";

function formatDate(value: Date | null): string {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

export default function StudentInterventionHistoryPanel({
  teacherId,
  studentId,
}: {
  teacherId: string;
  studentId: string;
}) {
  const [items, setItems] =
    useState<TeacherInterventionHistoryItem[]>([]);
  const [selectedImpactId, setSelectedImpactId] =
    useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const history =
          await getTeacherStudentInterventionHistory({
            teacherId,
            studentId,
          });

        if (!cancelled) {
          setItems(history);

          if (
            selectedImpactId &&
            !history.some((item) => item.id === selectedImpactId)
          ) {
            setSelectedImpactId(null);
          }
        }
      } catch (caughtError) {
        console.error(
          "Unable to load intervention history:",
          caughtError,
        );

        if (!cancelled) {
          setItems([]);
          setSelectedImpactId(null);
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Intervention history could not be loaded.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [studentId, teacherId, selectedImpactId]);

  if (loading) {
    return (
      <Card className="rounded-3xl border border-slate-200">
        <div className="h-44 animate-pulse rounded-2xl bg-slate-100" />
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden rounded-3xl border border-slate-200">
        <div className="flex items-center gap-3 border-b border-slate-200 p-6">
          <div className="rounded-xl bg-violet-100 p-3 text-violet-700">
            <History className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-600">
              Intervention history
            </p>
            <h2 className="mt-1 text-xl font-black text-slate-950">
              Support record
            </h2>
          </div>
        </div>

        {error ? (
          <div className="p-6 text-sm text-red-700">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">
            No interventions have been recorded for this learner yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((item) => {
              const complete = item.status === "completed";
              const reviewing = selectedImpactId === item.id;

              return (
                <div
                  key={item.id}
                  className="grid gap-4 p-5 lg:grid-cols-[1.2fr_.8fr_.7fr_.8fr_auto] lg:items-center"
                >
                  <div>
                    <p className="font-black text-slate-900">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.topic}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase text-slate-400">
                      Status
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-black capitalize text-slate-800">
                      {complete ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Clock3 className="h-4 w-4 text-amber-600" />
                      )}
                      {item.status.replace(/_/g, " ")}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase text-slate-400">
                      Steps
                    </p>
                    <p className="mt-1 font-black text-slate-900">
                      {item.completedStepCount}/{item.stepCount}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase text-slate-400">
                      Started
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImpactId((current) =>
                        current === item.id ? null : item.id,
                      )
                    }
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 text-xs font-black text-violet-800 transition hover:bg-violet-100"
                  >
                    <Activity className="h-4 w-4" />
                    {reviewing ? "Hide impact" : "Review impact"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {selectedImpactId && (
        <InterventionImpactCard
          interventionId={selectedImpactId}
          teacherId={teacherId}
        />
      )}
    </div>
  );
}
