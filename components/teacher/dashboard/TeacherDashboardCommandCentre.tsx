"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  ClipboardCheck,
  FileText,
  Route,
  Target,
} from "lucide-react";

import Card from "@/components/ui/Card";
import { buildTeacherDashboardIntegration } from "@/services/teacherDashboardIntegrationService";

function severityStyle(
  severity: "high" | "medium" | "low" | "positive",
): string {
  if (severity === "high") return "border-red-200 bg-red-50";
  if (severity === "medium") return "border-amber-200 bg-amber-50";
  if (severity === "positive") return "border-emerald-200 bg-emerald-50";
  return "border-slate-200 bg-slate-50";
}

export default function TeacherDashboardCommandCentre({
  studentCount,
  classCount,
  assignmentCount,
  activeAssignmentCount,
  averageScore,
  completionRate,
  atRiskCount,
}: {
  studentCount: number;
  classCount: number;
  assignmentCount: number;
  activeAssignmentCount: number;
  averageScore: number;
  completionRate: number;
  atRiskCount: number;
}) {
  const integration = buildTeacherDashboardIntegration({
    studentCount,
    classCount,
    assignmentCount,
    activeAssignmentCount,
    averageScore,
    completionRate,
    atRiskCount,
  });

  return (
    <Card className="overflow-hidden rounded-3xl border border-teal-200 p-0">
      <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-cyan-900 p-6 text-white">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-200">
          Teacher command centre
        </p>

        <h2 className="mt-2 text-2xl font-black">
          {integration.headline}
        </h2>

        <p className="mt-2 max-w-4xl text-sm leading-6 text-white/70">
          {integration.summary}
        </p>
      </div>

      <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
        {integration.signals.map((item) => (
          <div
            key={item.id}
            className={`flex min-h-48 flex-col rounded-2xl border p-5 ${severityStyle(
              item.severity,
            )}`}
          >
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">
              {item.label}
            </p>

            <p className="mt-2 text-3xl font-black text-slate-950">
              {item.value}
            </p>

            <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
              {item.detail}
            </p>

            <Link
              href={item.href}
              className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-black text-white"
            >
              {item.actionLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 bg-slate-50 p-6">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
          Core teacher workflow
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <WorkflowLink href="/teacher/analytics" icon={<BarChart3 className="h-4 w-4" />} label="Analyse" />
          <WorkflowLink href="/teacher/knowledge-map" icon={<BookOpenCheck className="h-4 w-4" />} label="Diagnose" />
          <WorkflowLink href="#teacher-actions" icon={<Target className="h-4 w-4" />} label="Prioritise" />
          <WorkflowLink href="#intervention-planning" icon={<Route className="h-4 w-4" />} label="Intervene" />
          <WorkflowLink href="#assessment-centre" icon={<ClipboardCheck className="h-4 w-4" />} label="Assess" />
          <WorkflowLink href="/teacher/reports" icon={<FileText className="h-4 w-4" />} label="Report" />
        </div>
      </div>
    </Card>
  );
}

function WorkflowLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800"
    >
      {icon}
      {label}
    </Link>
  );
}
