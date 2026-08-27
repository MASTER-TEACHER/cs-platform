"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  FileQuestion,
  Target,
} from "lucide-react";

import Card from "@/components/ui/Card";
import { buildTeacherActionRecommendation } from "@/services/analytics/teacherActionWorkflowService";
import type { TeacherStudentAnalyticsRow } from "@/types/teacherAnalytics";

export default function StudentActionWorkflowPanel({
  row,
}: {
  row: TeacherStudentAnalyticsRow;
}) {
  const recommendation =
    buildTeacherActionRecommendation(row);

  const interventionHref =
    `/teacher/interventions?studentId=${encodeURIComponent(row.studentId)}` +
    `&classId=${encodeURIComponent(row.classId)}` +
    `&topic=${encodeURIComponent(recommendation.focusTopic)}` +
    `&reason=${encodeURIComponent(recommendation.reason)}`;

  const assignmentHref =
    `/teacher/assignment-wizard?studentId=${encodeURIComponent(row.studentId)}` +
    `&classId=${encodeURIComponent(row.classId)}` +
    `&topic=${encodeURIComponent(recommendation.focusTopic)}` +
    `&source=intervention`;

  return (
    <Card className="overflow-hidden rounded-3xl border border-slate-200">
      <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-teal-800 p-6 text-white">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-teal-200">
          Teacher action workflow
        </p>

        <h2 className="mt-2 text-2xl font-black">
          Turn intelligence into action
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/75">
          Use the learner&apos;s current working grade, target, trend and mastery
          evidence to choose the next teaching action.
        </p>
      </div>

      <div className="grid gap-5 p-6 lg:grid-cols-[1.35fr_.65fr]">
        <div>
          <div className="rounded-2xl border border-teal-200 bg-teal-50 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-teal-600 p-3 text-white">
                <Target className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wide text-teal-700">
                  Recommended next action
                </p>

                <h3 className="mt-1 text-xl font-black text-slate-950">
                  {recommendation.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-700">
                  {recommendation.reason}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">
              Suggested teacher instruction
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-700">
              {recommendation.suggestedInstruction}
            </p>
          </div>
        </div>

        <div className="space-y-3">
  <ActionLink
    href={interventionHref}
    icon={<ClipboardList className="h-4 w-4" />}
    label="Open Intervention Centre"
    description="Create or review a structured support pathway."
  />

  <ActionLink
    href={assignmentHref}
    icon={<BookOpen className="h-4 w-4" />}
    label="Assign targeted work"
    description="Choose a lesson, quiz, exam or programming task."
  />

  <ActionLink
    href={`/teacher/analytics/${row.studentId}`}
    icon={<FileQuestion className="h-4 w-4" />}
    label="Review full evidence"
    description="Return to the learner intelligence record."
  />
</div>
      </div>
    </Card>
  );
}

function ActionLink({
  href,
  icon,
  label,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-teal-300 hover:bg-teal-50"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-slate-100 p-2.5 text-slate-700">
          {icon}
        </div>

        <div>
          <p className="font-black text-slate-950">
            {label}
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
    </Link>
  );
}
