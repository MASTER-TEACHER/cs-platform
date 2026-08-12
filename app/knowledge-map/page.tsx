"use client";

import Link from "next/link";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import KnowledgeMap from "@/components/knowledge-map/knowledgeMap";
import { useKnowledgeMap } from "@/hooks/useKnowledgeMap";

export default function KnowledgeMapPage() {
  const { map, loading, error, refresh } = useKnowledgeMap();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!map) {
    return (
      <Card>
        <h1 className="text-2xl font-black">Knowledge map unavailable</h1>
        <p className="mt-3 text-slate-600">
          {error || "Complete some learning activities to generate the map."}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-violet-950 to-indigo-800 text-white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-violet-200">
              Curriculum mastery
            </p>
            <h1 className="mt-2 text-4xl font-black">Knowledge Map</h1>
            <p className="mt-3 max-w-3xl text-violet-100">
              Related lessons, quizzes and written exams are combined into one
              curriculum view.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void refresh()}
              className="rounded-xl border border-white/20 px-5 py-3 font-bold"
            >
              Refresh map
            </button>

            <Link
              href="/adaptive-learning"
              className="rounded-xl border border-white/20 px-5 py-3 font-bold"
            >
              Adaptive Learning
            </Link>
          </div>
        </div>
      </Card>

      <KnowledgeMap map={map} />
    </div>
  );
}
