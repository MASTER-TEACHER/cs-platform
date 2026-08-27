"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import RevisionPlanCard from "@/components/revision-plan/RevisionPlanCard";
import { useAuth } from "@/contexts/AuthContext";
import { getStudentInterventions } from "@/services/interventionService";
import type { Intervention } from "@/types/intervention";
export default function RevisionPlanPage() {
  const { user } = useAuth();
  const userId = user?.uid;
  const [items, setItems] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!userId) {
      return Promise.resolve();
    }

    return Promise.resolve()
      .then(() => {
        setLoading(true);
        return getStudentInterventions(userId);
      })
      .then((loadedItems) => {
        setItems(loadedItems);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);
  if (loading)
    return (
      <div className="space-y-6">
        <Skeleton className="h-48" />
        <Skeleton className="h-96" />
      </div>
    );
  const active = items.filter((i) => i.status === "active");
  const completed = items.filter((i) => i.status === "completed");
  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-blue-900 to-teal-800 text-white">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-teal-100">
              Personalised learning
            </p>
            <h1 className="mt-2 text-4xl font-black">Revision Plan</h1>
            <p className="mt-3 text-teal-100">
              Complete your targeted lesson, quiz and exam-practice steps.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/assignments"
              className="rounded-xl border border-white/20 px-5 py-3 font-bold"
            >
              Assignments
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-white/20 px-5 py-3 font-bold"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </Card>
      {active.length ? (
        <div className="space-y-6">
          {active.map((i) => (
            <RevisionPlanCard
              key={i.id}
              intervention={i}
              studentId={user?.uid || ""}
              onUpdated={() => void load()}
            />
          ))}
        </div>
      ) : (
        <Card>
          <h2 className="text-2xl font-black">No active revision plan</h2>
          <p className="mt-3 text-slate-600">
            Teacher-created interventions will appear here.
          </p>
        </Card>
      )}
      {completed.length > 0 && (
        <Card>
          <h2 className="text-2xl font-black">Completed plans</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {completed.map((i) => (
              <div key={i.id} className="rounded-2xl bg-emerald-50 p-5">
                <p className="font-black text-emerald-950">{i.title}</p>
                <p className="text-sm text-emerald-800">
                  Impact {i.impact >= 0 ? "+" : ""}
                  {i.impact}%
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
