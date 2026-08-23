"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import ClassHeatMap from "@/components/teacher/knowledge-map/ClassHeatMap";
import ClassKnowledgeIntelligencePanel from "@/components/teacher/intelligence/ClassKnowledgeIntelligencePanel";
import { useAuth } from "@/contexts/AuthContext";
import { getClassKnowledgeMap } from "@/services/classKnowledgeMapService";

import type { ClassKnowledgeMap as ClassKnowledgeMapType } from "@/types/knowledgeMap";

export default function TeacherKnowledgeMapPage() {
  const { user } = useAuth();

  const [map, setMap] =
    useState<ClassKnowledgeMapType | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!user?.uid) {
        if (!cancelled) {
          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);
        setError("");

        const result = await getClassKnowledgeMap(
          user.uid,
        );

        if (!cancelled) {
          setMap(result);
        }
      } catch (caughtError) {
        console.error(
          "Unable to load class knowledge map:",
          caughtError,
        );

        if (!cancelled) {
          setMap(null);

          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Class knowledge map could not be loaded.",
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
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48" />
        <Skeleton className="h-72" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  const weakest = map
    ? [...map.topics]
        .filter(
          (topic) =>
            topic.assessedStudents > 0,
        )
        .sort(
          (a, b) =>
            a.classAverage -
            b.classAverage,
        )[0]
    : null;

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-teal-950 to-cyan-800 text-white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-teal-200">
              Teacher intelligence
            </p>

            <h1 className="mt-2 text-4xl font-black">
              Class Knowledge Map
            </h1>

            <p className="mt-3 max-w-3xl text-teal-100">
              See which curriculum topics are secure,
              developing or in need of reteaching.
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

      <ClassKnowledgeIntelligencePanel />

      {error && (
        <Card className="border border-amber-200 bg-amber-50">
          <p className="font-black text-amber-950">
            Detailed heat map unavailable
          </p>

          <p className="mt-2 text-sm text-amber-800">
            {error}
          </p>

          <p className="mt-2 text-xs text-amber-700">
            The attainment-backed class intelligence
            above remains available.
          </p>
        </Card>
      )}

      {map && (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <Metric
              label="Students"
              value={map.studentCount.toString()}
            />

            <Metric
              label="Curriculum topics"
              value={map.topics.length.toString()}
            />

            <Metric
              label="Weakest topic"
              value={
                weakest?.topicTitle ||
                "No evidence"
              }
            />
          </section>

          <ClassHeatMap map={map} />
        </>
      )}

      {!map && !error && (
        <Card>
          Class knowledge map unavailable.
        </Card>
      )}
    </div>
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
    <Card>
      <p className="text-sm font-bold text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-slate-950">
        {value}
      </p>
    </Card>
  );
}