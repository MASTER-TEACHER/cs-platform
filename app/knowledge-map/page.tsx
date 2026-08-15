"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import ClassHeatMap from "@/components/teacher/knowledge-map/ClassHeatMap";
import KnowledgeMapExamContext from "@/components/teacher/knowledge-map/KnowledgeMapExamContext";
import { useAuth } from "@/contexts/AuthContext";
import { getClassKnowledgeMap } from "@/services/classKnowledgeMapService";
import type { ClassKnowledgeMap as ClassKnowledgeMapType } from "@/types/knowledgeMap";
import ClassKnowledgeIntelligencePanel from "@/components/teacher/intelligence/ClassKnowledgeIntelligencePanel";

export default function TeacherKnowledgeMapPage() {
  const { user } = useAuth();

  const [map, setMap] =
    useState<ClassKnowledgeMapType | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        setMap(
          await getClassKnowledgeMap(
            user.uid,
          ),
        );
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [user?.uid]);

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
        Class knowledge map unavailable.
      </Card>
    );
  }

  const weakest = [...map.topics]
    .filter(
      (topic) =>
        topic.assessedStudents > 0,
    )
    .sort(
      (a, b) =>
        a.classAverage -
        b.classAverage,
    )[0];

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
              See which curriculum topics are secure, developing or in need of
              reteaching.
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

      <KnowledgeMapExamContext />

      <ClassKnowledgeIntelligencePanel />

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
