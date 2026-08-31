"use client";

import Link from "next/link";

import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Target,
  Users,
} from "lucide-react";

import Card from "@/components/ui/Card";

import {
  buildTeacherActionCentre,
} from "@/services/teacherActionCentreService";

import type {
  TeacherActionCentreInput,
  TeacherActionKind,
  TeacherActionPriority,
} from "@/types/teacherActionCentre";

function priorityStyle(
  priority:
    TeacherActionPriority,
): string {
  if (
    priority ===
    "critical"
  ) {
    return "border-red-300 bg-red-50 text-red-800";
  }

  if (
    priority === "high"
  ) {
    return "border-orange-300 bg-orange-50 text-orange-800";
  }

  if (
    priority ===
    "medium"
  ) {
    return "border-amber-300 bg-amber-50 text-amber-800";
  }

  return "border-blue-200 bg-blue-50 text-blue-700";
}

function priorityLabel(
  priority:
    TeacherActionPriority,
): string {
  if (
    priority ===
    "critical"
  ) {
    return "Urgent";
  }

  if (
    priority === "high"
  ) {
    return "High";
  }

  if (
    priority ===
    "medium"
  ) {
    return "Medium";
  }

  return "Monitor";
}

function ActionIcon({
  kind,
}: {
  kind:
    TeacherActionKind;
}) {
  const className =
    "h-5 w-5";

  if (
    kind ===
    "student_support"
  ) {
    return (
      <GraduationCap className={className} />
    );
  }

  if (
    kind ===
    "topic_reteach"
  ) {
    return (
      <BookOpenCheck className={className} />
    );
  }

  if (
    kind ===
    "completion"
  ) {
    return (
      <ClipboardList className={className} />
    );
  }

  if (
    kind ===
    "class_setup"
  ) {
    return (
      <Users className={className} />
    );
  }

  if (
    kind ===
    "assessment"
  ) {
    return (
      <Target className={className} />
    );
  }

  return (
    <BarChart3 className={className} />
  );
}

export default function TeacherActionCentre(
  props:
    TeacherActionCentreInput,
) {
  const summary =
    buildTeacherActionCentre(
      props,
    );

  return (
    <Card className="overflow-hidden rounded-3xl border border-teal-200 p-0">
      <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-cyan-900 p-6 text-white">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-200">
              Operational action centre
            </p>

            <h2 className="mt-2 text-2xl font-black">
              {summary.headline}
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/70">
              This operational list uses current dashboard
              score, completion, assignment and class-setup
              signals. Use the evidence-weighted Command
              Centre above for formal learner-priority and
              intervention judgements.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <Counter
              label="Urgent"
              value={
                summary.criticalCount
              }
            />

            <Counter
              label="High"
              value={
                summary.highCount
              }
            />

            <Counter
              label="Medium"
              value={
                summary.mediumCount
              }
            />

            <Counter
              label="Monitor"
              value={
                summary.lowCount
              }
            />
          </div>
        </div>
      </div>

      {summary.actions.length ===
      0 ? (
        <div className="flex items-center gap-3 p-6">
          <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
          </div>

          <div>
            <p className="font-black text-slate-950">
              No immediate operational actions detected
            </p>

            <p className="mt-1 text-sm text-slate-600">
              Continue collecting assessment evidence and
              monitoring class performance.
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {summary.actions
            .slice(0, 8)
            .map(
              (action) => (
                <div
                  key={
                    action.id
                  }
                  className="grid gap-4 p-5 lg:grid-cols-[auto_1fr_auto] lg:items-center"
                >
                  <div
                    className={`rounded-xl border p-3 ${priorityStyle(
                      action.priority,
                    )}`}
                  >
                    <ActionIcon
                      kind={
                        action.kind
                      }
                    />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-wide ${priorityStyle(
                          action.priority,
                        )}`}
                      >
                        {priorityLabel(
                          action.priority,
                        )}
                      </span>

                      {action.metric && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">
                          {
                            action.metric
                          }
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2 font-black text-slate-950">
                      {
                        action.title
                      }
                    </h3>

                    <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-600">
                      {
                        action.description
                      }
                    </p>

                    {action.topic && (
                      <p className="mt-2 text-xs font-bold text-slate-400">
                        Focus:{" "}
                        {
                          action.topic
                        }
                      </p>
                    )}
                  </div>

                  <Link
                    href={
                      action.href
                    }
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-black text-white transition hover:bg-teal-800"
                  >
                    {
                      action.actionLabel
                    }

                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ),
            )}
        </div>
      )}

      {summary.totalCount >
        8 && (
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 text-sm font-bold text-slate-500">
          Showing the 8 highest-priority operational actions
          from {summary.totalCount}.
        </div>
      )}

      {summary.criticalCount >
        0 && (
        <div className="flex items-start gap-3 border-t border-red-100 bg-red-50 px-6 py-4 text-sm leading-6 text-red-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

          Urgent operational flags should be checked against
          the evidence-weighted learner intelligence before
          formal intervention decisions are made.
        </div>
      )}
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
      <p className="text-lg font-black">
        {value}
      </p>

      <p className="text-[10px] font-black uppercase tracking-wide text-white/60">
        {label}
      </p>
    </div>
  );
}