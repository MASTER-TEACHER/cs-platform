"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  ClipboardList,
  Download,
  Route,
  Users,
} from "lucide-react";

import Card from "@/components/ui/Card";
import { buildTeacherInterventionPlan } from "@/services/teacherInterventionPlanningService";
import {
  buildInterventionCohortCsv,
  interventionCohortFilename,
} from "@/services/reporting/interventionCohortCsvService";
import type {
  InterventionPlanningStudent,
  InterventionStrategy,
} from "@/types/teacherInterventionPlanning";

function priorityStyle(
  priority: "high" | "medium" | "monitor",
): string {
  if (priority === "high") return "bg-red-100 text-red-700";
  if (priority === "medium") return "bg-amber-100 text-amber-700";
  return "bg-blue-100 text-blue-700";
}

function strategyLabel(
  strategy: InterventionStrategy,
): string {
  if (strategy === "reteach_then_reassess") return "Reteach → reassess";
  if (strategy === "targeted_practice") return "Targeted practice";
  return "Monitor evidence";
}

export default function TeacherInterventionPlanner({
  students,
}: {
  students: InterventionPlanningStudent[];
}) {
  const plan = buildTeacherInterventionPlan(students);

  function downloadCsv() {
    const csv = buildInterventionCohortCsv(plan);
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = interventionCohortFilename();
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <Card className="overflow-hidden rounded-3xl border border-cyan-200 p-0">
      <div className="bg-gradient-to-r from-teal-950 via-cyan-950 to-sky-900 p-6 text-white">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
              Intervention Cohort Intelligence
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Turn support groups into a reviewable action sequence
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/70">
              CS Master groups current learner risks by shared topic, recommends
              an intervention strategy and preserves the learner cohort when
              moving into Knowledge Map, targeted work or Intervention Centre.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="grid grid-cols-4 gap-2">
              <Counter label="Students" value={plan.totalStudentsRequiringSupport} />
              <Counter label="Topics" value={plan.groupedTopics} />
              <Counter label="High" value={plan.highPriorityGroups} />
              <Counter label="Avg" value={`${plan.averageAtRiskScore}%`} />
            </div>

            {plan.groups.length > 0 && (
              <button
                type="button"
                onClick={downloadCsv}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-black text-cyan-950"
              >
                <Download className="h-4 w-4" />
                Export cohorts
              </button>
            )}
          </div>
        </div>
      </div>

      {plan.groups.length === 0 ? (
        <div className="p-6">
          <p className="font-black text-slate-950">
            No intervention groups currently required
          </p>

          <p className="mt-2 text-sm text-slate-600">
            Learners who fall below the dashboard intervention threshold will
            automatically be grouped here by their weakest current topic.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 p-6 xl:grid-cols-2">
          {plan.groups.map((group) => (
            <div
              key={group.id}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black uppercase ${priorityStyle(
                        group.priority,
                      )}`}
                    >
                      {group.priority}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                      {group.studentCount} learner{group.studentCount === 1 ? "" : "s"}
                    </span>

                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700">
                      {strategyLabel(group.strategy)}
                    </span>
                  </div>

                  <h3 className="mt-3 text-xl font-black text-slate-950">
                    {group.topic}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {group.rationale}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                    Group average
                  </p>

                  <p className="mt-1 text-2xl font-black text-slate-950">
                    {group.averageScore}%
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-400">
                    Lowest {group.lowestScore}%
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
                  <Users className="h-4 w-4" />
                  Learners
                </p>

                <div className="mt-3 space-y-2">
                  {group.students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2"
                    >
                      <div>
                        <p className="font-black text-slate-900">
                          {student.name}
                        </p>

                        {student.recommendedAction && (
                          <p className="mt-0.5 text-xs text-slate-500">
                            {student.recommendedAction}
                          </p>
                        )}
                      </div>

                      <span className="shrink-0 text-sm font-black text-slate-700">
                        {student.averageScore}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                  Recommended sequence
                </p>

                <div className="mt-3 grid gap-2">
                  {group.steps.map((step) => (
                    <div
                      key={step.id}
                      className="grid grid-cols-[auto_1fr] gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-100 text-xs font-black text-cyan-800">
                        {step.order}
                      </div>

                      <div>
                        <p className="text-sm font-black text-slate-900">
                          {step.label}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                {group.evidenceCaution}
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                <Link
                  href={group.knowledgeMapHref}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-center text-xs font-black text-white"
                >
                  <BookOpenCheck className="h-4 w-4" />
                  Knowledge Map
                </Link>

                <Link
                  href={group.assignmentHref}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-center text-xs font-black text-white"
                >
                  <ClipboardList className="h-4 w-4" />
                  Targeted work
                </Link>

                <Link
                  href={group.interventionHref}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-teal-600 px-3 py-2 text-center text-xs font-black text-white"
                >
                  <Route className="h-4 w-4" />
                  Intervention
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-cyan-100 bg-cyan-50 px-6 py-4 text-xs font-bold leading-5 text-cyan-950">
        Intervention cohorts are decision-support suggestions based on current
        dashboard evidence. They do not replace teacher judgement, and a formal
        intervention should be reviewed against subsequent graded evidence.
      </div>
    </Card>
  );
}

function Counter({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="min-w-16 rounded-xl bg-white/10 px-3 py-2 text-center backdrop-blur">
      <p className="text-lg font-black">{value}</p>
      <p className="text-[10px] font-black uppercase tracking-wide text-white/60">
        {label}
      </p>
    </div>
  );
}
