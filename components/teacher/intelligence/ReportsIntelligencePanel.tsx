"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  TrendingDown,
} from "lucide-react";

import Card from "@/components/ui/Card";
import { useTeacherIntelligence } from "@/hooks/useTeacherIntelligence";
import { buildReportSummary } from "@/services/analytics/teacherIntelligenceIntegrationService";

export default function ReportsIntelligencePanel() {
  const { portfolio, loading, error } = useTeacherIntelligence();

  if (loading) {
    return (
      <Card className="h-72 animate-pulse rounded-3xl bg-slate-100">
        <div className="h-full" />
      </Card>
    );
  }

  if (error || !portfolio) {
    return null;
  }

  const summary = buildReportSummary(portfolio);

  return (
    <Card className="rounded-3xl border border-slate-200 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-violet-700">
            <FileText className="h-5 w-5" />
            <p className="text-xs font-black uppercase tracking-[0.16em]">
              Report intelligence
            </p>
          </div>

          <h2 className="mt-2 text-2xl font-black text-slate-950">
            Evidence-backed reporting summary
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Use the same attainment evidence for reports rather than
            maintaining a separate reporting calculation.
          </p>
        </div>

        <Link
          href="/teacher/analytics"
          className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-black text-white"
        >
          Inspect analytics
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Students with targets"
          value={String(summary.studentsWithTargets)}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <Metric
          label="Below target"
          value={String(summary.belowTarget)}
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <Metric
          label="High priority"
          value={String(summary.highPriority)}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <Metric
          label="Declining"
          value={String(summary.declining)}
          icon={<TrendingDown className="h-5 w-5" />}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <TopicList
          title="Priority curriculum areas"
          topics={summary.priorityTopics}
        />
        <TopicList
          title="Strongest curriculum areas"
          topics={summary.strongestTopics}
        />
      </div>
    </Card>
  );
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-black text-slate-950">
            {value}
          </p>
        </div>
        <div className="rounded-xl bg-violet-100 p-3 text-violet-700">
          {icon}
        </div>
      </div>
    </div>
  );
}

function TopicList({
  title,
  topics,
}: {
  title: string;
  topics: {
    topic: string;
    weightedPercentage: number;
    studentCount: number;
  }[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <h3 className="font-black text-slate-950">{title}</h3>

      <div className="mt-4 space-y-3">
        {topics.length === 0 ? (
          <p className="text-sm text-slate-500">
            More graded evidence is required.
          </p>
        ) : (
          topics.map((topic) => (
            <div
              key={topic.topic}
              className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3"
            >
              <div>
                <p className="text-sm font-black text-slate-800">
                  {topic.topic}
                </p>
                <p className="text-xs text-slate-500">
                  {topic.studentCount} student evidence links
                </p>
              </div>

              <span className="font-black text-slate-950">
                {topic.weightedPercentage}%
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
