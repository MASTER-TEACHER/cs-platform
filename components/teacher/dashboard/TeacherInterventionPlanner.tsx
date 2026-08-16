"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  ClipboardList,
  Route,
  Users,
} from "lucide-react";

import Card from "@/components/ui/Card";
import { buildTeacherInterventionPlan } from "@/services/teacherInterventionPlanningService";
import type { InterventionPlanningStudent } from "@/types/teacherInterventionPlanning";

function priorityStyle(priority: "high" | "medium" | "monitor"): string {
  if (priority === "high") return "bg-red-100 text-red-700";
  if (priority === "medium") return "bg-amber-100 text-amber-700";
  return "bg-blue-100 text-blue-700";
}

export default function TeacherInterventionPlanner({
  students,
}: {
  students: InterventionPlanningStudent[];
}) {
  const plan = buildTeacherInterventionPlan(students);

  return (
    <Card className="overflow-hidden rounded-3xl border border-cyan-200 p-0">
      <div className="bg-gradient-to-r from-teal-950 via-cyan-950 to-sky-900 p-6 text-white">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
              Intervention Planning
            </p>
            <h2 className="mt-2 text-2xl font-black">
              Group learners by shared support need
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/70">
              Turn individual risk flags into practical reteaching groups.
              Review the evidence first, then choose whether to reteach,
              assign targeted work or create an intervention.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Counter label="Students" value={plan.totalStudentsRequiringSupport} />
            <Counter label="Topics" value={plan.groupedTopics} />
            <Counter label="High" value={plan.highPriorityGroups} />
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
                      {group.studentCount} learner
                      {group.studentCount === 1 ? "" : "s"}
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
        Groups are planning suggestions based on current dashboard evidence.
        Teachers should review the underlying evidence before changing teaching
        or intervention arrangements.
      </div>
    </Card>
  );
}

function Counter({
  label,
  value,
}: {
  label: string;
  value: number;
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
