"use client";

import { useMemo, useState } from "react";
import { Brain, Target } from "lucide-react";

import Card from "@/components/ui/Card";
import { useTeacherIntelligence } from "@/hooks/useTeacherIntelligence";
import { getClassById } from "@/services/analytics/teacherIntelligenceIntegrationService";

export default function ClassKnowledgeIntelligencePanel() {
  const { portfolio, loading, error } = useTeacherIntelligence();

  const [selectedClassId, setSelectedClassId] = useState("");

  const classItem = useMemo(() => {
    if (!portfolio) return null;

    const classId =
      selectedClassId ||
      portfolio.classes[0]?.classId ||
      "";

    return getClassById(portfolio, classId);
  }, [portfolio, selectedClassId]);

  if (loading) {
    return (
      <Card className="h-72 animate-pulse rounded-3xl bg-slate-100">
        <div className="h-full" />
      </Card>
    );
  }

  if (error || !portfolio || portfolio.classes.length === 0) {
    return null;
  }

  return (
    <Card className="rounded-3xl border border-slate-200 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-teal-700">
            <Brain className="h-5 w-5" />
            <p className="text-xs font-black uppercase tracking-[0.16em]">
              Attainment-backed mastery
            </p>
          </div>

          <h2 className="mt-2 text-2xl font-black text-slate-950">
            Class knowledge priorities
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            The same evidence used for working grades now identifies
            class-wide secure, developing and priority curriculum areas.
          </p>
        </div>

        <select
          value={classItem?.classId || ""}
          onChange={(event) => setSelectedClassId(event.target.value)}
          className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-800"
        >
          {portfolio.classes.map((item) => (
            <option key={item.classId} value={item.classId}>
              {item.className} · {item.yearGroup}
            </option>
          ))}
        </select>
      </div>

      {classItem && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric
              label="Working grade"
              value={classItem.averageWorkingGrade || "—"}
            />
            <Metric
              label="Average target"
              value={classItem.averageTargetGrade || "Not set"}
            />
            <Metric
              label="On / above target"
              value={`${classItem.onOrAboveTargetPercentage}%`}
            />
            <Metric
              label="Completion"
              value={`${classItem.averageCompletionRate}%`}
            />
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            {[...classItem.topicAnalytics]
              .sort(
                (first, second) =>
                  first.weightedPercentage -
                  second.weightedPercentage,
              )
              .slice(0, 10)
              .map((topic) => (
                <div
                  key={topic.topic}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-black text-slate-900">
                        {topic.topic}
                      </p>
                      <p className="mt-1 text-xs capitalize text-slate-500">
                        {topic.status} · {topic.studentCount} students
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        topic.status === "priority"
                          ? "bg-red-100 text-red-700"
                          : topic.status === "developing"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {topic.weightedPercentage}%
                    </span>
                  </div>

                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-500 to-blue-600"
                      style={{ width: `${topic.weightedPercentage}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>

          {classItem.topicAnalytics.some(
            (topic) => topic.status === "priority",
          ) && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <Target className="mt-0.5 h-5 w-5 text-amber-700" />
              <p className="text-sm leading-6 text-amber-900">
                Prioritise reteaching and assignment practice for the
                lowest-mastery topics before moving onto less urgent gaps.
              </p>
            </div>
          )}
        </>
      )}
    </Card>
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
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}
