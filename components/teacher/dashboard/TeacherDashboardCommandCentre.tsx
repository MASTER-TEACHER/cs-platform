"use client";

import Link from "next/link";

import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  ClipboardCheck,
  RefreshCw,
  Route,
  Target,
  Users,
} from "lucide-react";

import Card from "@/components/ui/Card";

import {
  useTeacherIntelligence,
} from "@/hooks/useTeacherIntelligence";

import {
  buildReportSummary,
  getPriorityStudents,
} from "@/services/analytics/teacherIntelligenceIntegrationService";

function priorityStyle(
  priority: string,
): string {
  if (priority === "high") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (priority === "medium") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-blue-200 bg-blue-50 text-blue-700";
}

export default function TeacherDashboardCommandCentre() {
  const {
    portfolio,
    loading,
    error,
    refresh,
  } =
    useTeacherIntelligence();

  if (loading) {
    return (
      <Card className="overflow-hidden rounded-3xl border border-teal-200 p-0">
        <div className="h-44 animate-pulse bg-slate-100" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="overflow-hidden rounded-3xl border border-amber-200 p-0">
        <div className="bg-amber-50 p-6">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-700">
            Teacher command centre
          </p>

          <h2 className="mt-2 text-xl font-black text-amber-950">
            Intelligence summary unavailable
          </h2>

          <p className="mt-2 text-sm leading-6 text-amber-800">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              void refresh()
            }
            className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-amber-700 px-4 text-sm font-black text-white"
          >
            <RefreshCw className="h-4 w-4" />

            Retry
          </button>
        </div>
      </Card>
    );
  }

  if (!portfolio) {
    return null;
  }

  const summary =
    buildReportSummary(
      portfolio,
    );

  const priorityStudents =
    getPriorityStudents(
      portfolio,
    )
      .filter(
        (student) =>
          student.priority !==
          "none",
      )
      .slice(0, 4);

  const primaryTopic =
    summary.priorityTopics[0] ??
    null;

  const strongestTopic =
    summary.strongestTopics[0] ??
    null;

  /*
   * These are individual intelligence signals rather than
   * unique learners, so do not describe the total as a
   * student count.
   */
  const attentionSignalCount =
    summary.belowTarget +
    summary.highPriority +
    summary.declining +
    summary.lowEvidence;

  return (
    <Card className="overflow-hidden rounded-3xl border border-teal-200 p-0">
      <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-cyan-900 p-6 text-white">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-200">
              Teacher command centre
            </p>

            <h2 className="mt-2 text-2xl font-black">
              {attentionSignalCount >
              0
                ? `${attentionSignalCount} intelligence signal${
                    attentionSignalCount ===
                    1
                      ? ""
                      : "s"
                  } require review`
                : "No immediate intelligence alerts"}
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/70">
              Your evidence-weighted source of truth for formal learner priority,
              attainment, targets, evidence quality, curriculum priorities
              and intervention demand. Recommendations support professional
              judgement and should be checked against the underlying evidence
              before action.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                void refresh()
              }
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 px-4 text-xs font-black text-white transition hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4" />

              Refresh
            </button>

            <Link
              href="/teacher/reports"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-black text-teal-950 transition hover:bg-slate-100"
            >
              Detailed reports

              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-3 border-b border-slate-100 p-6 sm:grid-cols-2 xl:grid-cols-6">
        <Metric
          label="Students"
          value={
            summary.studentCount
          }
          icon={
            <Users className="h-4 w-4" />
          }
        />

        <Metric
          label="Below target"
          value={
            summary.belowTarget
          }
          icon={
            <Target className="h-4 w-4" />
          }
        />

        <Metric
          label="High priority"
          value={
            summary.highPriority
          }
          icon={
            <AlertTriangle className="h-4 w-4" />
          }
        />

        <Metric
          label="Declining"
          value={
            summary.declining
          }
          icon={
            <BarChart3 className="h-4 w-4" />
          }
        />

        <Metric
          label="Low evidence"
          value={
            summary.lowEvidence
          }
          icon={
            <ClipboardCheck className="h-4 w-4" />
          }
        />

        <Metric
          label="Completion"
          value={`${summary.averageCompletionRate}%`}
          icon={
            <ClipboardCheck className="h-4 w-4" />
          }
        />
      </div>

      <div className="grid gap-5 p-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Review next
              </p>

              <h3 className="mt-1 text-xl font-black text-slate-950">
                Priority learners
              </h3>
            </div>

            <Link
              href="/teacher/analytics"
              className="inline-flex items-center gap-2 text-sm font-black text-teal-700"
            >
              Full analytics

              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {priorityStudents.length ===
          0 ? (
            <div className="mt-4 rounded-2xl bg-emerald-50 p-5">
              <p className="font-black text-emerald-900">
                No immediate learner priorities
              </p>

              <p className="mt-1 text-sm text-emerald-700">
                Continue collecting evidence and monitor the
                next assessment cycle.
              </p>
            </div>
          ) : (
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {priorityStudents.map(
                (student) => (
                  <Link
                    key={`${student.classId}-${student.studentId}`}
                    href={`/teacher/analytics/${student.studentId}`}
                    className="rounded-2xl border border-slate-200 p-4 transition hover:border-teal-300 hover:bg-teal-50"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-black text-slate-950">
                        {
                          student.studentName
                        }
                      </p>

                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${priorityStyle(
                          student.priority,
                        )}`}
                      >
                        {
                          student.priority
                        }
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      {
                        student.workingGrade
                      }{" "}
                      →{" "}
                      {
                        student.targetGrade
                      }

                      {student.gap !==
                      null
                        ? ` · gap ${student.gap}`
                        : ""}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {
                        student.weakestTopic
                      }

                      {student.weakestTopicPercentage !==
                      null
                        ? ` · ${student.weakestTopicPercentage}%`
                        : ""}
                    </p>
                  </Link>
                ),
              )}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <FocusCard
            title="Curriculum priority"
            value={
              primaryTopic
                ? `${primaryTopic.topic} · ${primaryTopic.weightedPercentage}%`
                : "Insufficient evidence"
            }
            description="Open the Knowledge Map before planning reteaching or targeted work."
            href="/teacher/knowledge-map"
            icon={
              <BookOpenCheck className="h-5 w-5" />
            }
          />

          <FocusCard
            title="Current strength"
            value={
              strongestTopic
                ? `${strongestTopic.topic} · ${strongestTopic.weightedPercentage}%`
                : "Insufficient evidence"
            }
            description="Use secure areas to inform retrieval, sequencing and extension."
            href="/teacher/knowledge-map"
            icon={
              <BarChart3 className="h-5 w-5" />
            }
          />

          <FocusCard
            title="Intervention workflow"
            value={
              summary.highPriority >
              0
                ? `${summary.highPriority} high-priority learner${
                    summary.highPriority ===
                    1
                      ? ""
                      : "s"
                  }`
                : "No high-priority learners"
            }
            description="Review support needs, create interventions and evaluate impact."
            href="/teacher/interventions"
            icon={
              <Route className="h-5 w-5" />
            }
          />
        </div>
      </div>

      <div className="grid gap-3 border-t border-slate-100 bg-slate-50 p-6 sm:grid-cols-2 xl:grid-cols-4">
        <QuickLink
          href="/teacher/analytics"
          label="Class analytics"
          description="Grades, target gaps, mastery and evidence."
        />

        <QuickLink
          href="/teacher/knowledge-map"
          label="Knowledge Map"
          description="Shared curriculum strengths and priorities."
        />

        <QuickLink
          href="/teacher/interventions"
          label="Interventions"
          description="Plan support and review effectiveness."
        />

        <QuickLink
          href="/teacher/reports"
          label="Reports"
          description="Class, student and written-assessment intelligence."
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

  value:
    | string
    | number;

  icon:
    React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <span className="text-teal-600">
          {icon}
        </span>
      </div>

      <p className="mt-2 text-2xl font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}

function FocusCard({
  title,
  value,
  description,
  href,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-slate-200 p-4 transition hover:border-teal-300 hover:bg-teal-50"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-teal-100 p-2.5 text-teal-700">
          {icon}
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-400">
            {title}
          </p>

          <p className="mt-1 font-black text-slate-950">
            {value}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

function QuickLink({
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-teal-300 hover:bg-teal-50"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-black text-slate-950">
          {label}
        </p>

        <ArrowRight className="h-4 w-4 text-slate-400" />
      </div>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </Link>
  );
}
