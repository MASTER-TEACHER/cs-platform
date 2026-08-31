"use client";

import Link from "next/link";

import TeacherHero from "@/components/teacher/TeacherHero";
import RecentStudentActivity from "@/components/teacher/RecentStudentActivity";
import TopStudents from "@/components/teacher/TopStudents";
import TeacherQuickActions from "@/components/teacher/TeacherQuickActions";

import Card from "@/components/ui/Card";

import AnalyticsCard from "@/components/teacher/dashboard/AnalyticsCard";
import TeacherDashboardCommandCentre from "@/components/teacher/dashboard/TeacherDashboardCommandCentre";
import TeacherDashboardSkeleton from "@/components/teacher/dashboard/TeacherDashboardSkeleton";
import TopicAnalytics from "@/components/teacher/dashboard/TopicAnalytics";
import TeacherInsights from "@/components/teacher/dashboard/TeacherInsights";
import ClassSummary from "@/components/teacher/dashboard/ClassSummary";

import TeacherTrialBanner from "@/components/billing/TeacherTrialBanner";

import {
  useUserProfile,
} from "@/hooks/useUserProfile";

import {
  useTeacherDashboard,
} from "@/hooks/useTeacherDashboard";

import {
  getCompletionMessage,
  getPerformanceMessage,
} from "@/lib/teacherDashboard";

const assessmentTools = [
  {
    title:
      "Exam-Style Paper Builder",

    description:
      "Create original exam-board-aligned papers using a teacher-controlled assessment blueprint.",

    href:
      "/teacher/exam-question-generator",

    icon:
      "🧠",

    label:
      "Build a paper",

    accent:
      "border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50",

    iconStyle:
      "bg-indigo-600 text-white",

    buttonStyle:
      "bg-indigo-600 text-white hover:bg-indigo-700",
  },

  {
    title:
      "Question Bank",

    description:
      "Review saved question sets, inspect mark schemes and assign papers to classes.",

    href:
      "/teacher/question-bank",

    icon:
      "🗂️",

    label:
      "Open question bank",

    accent:
      "border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50",

    iconStyle:
      "bg-emerald-600 text-white",

    buttonStyle:
      "bg-emerald-600 text-white hover:bg-emerald-700",
  },

  {
    title:
      "Exam Assignments",

    description:
      "Track written submissions, open the markbook and provide question-level feedback.",

    href:
      "/teacher/exam-assignments",

    icon:
      "✍️",

    label:
      "Open exam assignments",

    accent:
      "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50",

    iconStyle:
      "bg-amber-600 text-white",

    buttonStyle:
      "bg-amber-600 text-white hover:bg-amber-700",
  },
];

export default function TeacherPage() {
  const {
    profile,
    loading:
      profileLoading,
  } =
    useUserProfile();

  const {
    studentCount,
    classCount,
    assignmentCount,
    activeAssignmentCount,
    averageScore,
    completionRate,
    lessonsCompleted,
    completedToday,
    recentActivities,
    atRiskStudents,
    topStudents,
    classPerformance,
    loading:
      dashboardLoading,
  } =
    useTeacherDashboard();

  const loading =
    profileLoading ||
    dashboardLoading;

  /*
   * teacherDashboardService already sorts classPerformance
   * from highest to lowest average score.
   */
  const strongestTopic =
    classPerformance[0] ??
    null;

  const weakestTopic =
    classPerformance.length >
    0
      ? classPerformance[
          classPerformance.length -
            1
        ]
      : null;

  const topStudent =
    topStudents[0] ??
    null;

  const performanceMessage =
    getPerformanceMessage(
      averageScore,
    );

  const completionMessage =
    getCompletionMessage(
      completionRate,
    );

  if (loading) {
    return (
      <TeacherDashboardSkeleton />
    );
  }

  return (
    <div className="space-y-8">
      <TeacherHero
        name={
          profile?.name ||
          "Teacher"
        }
      />

      <TeacherTrialBanner />

      {/*
       * Primary intelligence layer.
       *
       * This is now driven by Teacher Analytics rather than
       * the legacy <50% score threshold.
       */}
      <TeacherDashboardCommandCentre />

      <section id="live-overview">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
              Teaching Overview
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Live classroom activity
            </h2>

            <p className="mt-2 max-w-3xl text-slate-600">
              Monitor current participation, scores,
              completion and activity. These operational
              metrics support the evidence-weighted
              intelligence shown in the Command Centre.
            </p>
          </div>

          <Link
            href="/teacher/reports"
            className="inline-flex w-fit rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800"
          >
            View detailed reports →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <AnalyticsCard
            label="Students"
            value={
              studentCount.toString()
            }
            description={`${classCount} ${
              classCount ===
              1
                ? "class"
                : "classes"
            } currently managed`}
            icon="👨‍🎓"
            tone="blue"
          />

          <AnalyticsCard
            label="Average Quiz Score"
            value={`${averageScore}%`}
            description={
              performanceMessage
            }
            icon="🎯"
            tone={
              averageScore >=
              70
                ? "green"
                : averageScore >=
                    50
                  ? "amber"
                  : "red"
            }
          />

          <AnalyticsCard
            label="Assignment Completion"
            value={`${completionRate}%`}
            description={
              completionMessage
            }
            icon="📈"
            tone={
              completionRate >=
              80
                ? "green"
                : completionRate >=
                    50
                  ? "amber"
                  : "red"
            }
          />

          <AnalyticsCard
            label="Active Assignments"
            value={
              activeAssignmentCount.toString()
            }
            description={`${assignmentCount} total assignment${
              assignmentCount ===
              1
                ? ""
                : "s"
            }`}
            icon="📋"
            tone="indigo"
          />

          <AnalyticsCard
            label="Lessons Completed"
            value={
              lessonsCompleted.toString()
            }
            description="Across all student accounts"
            icon="📚"
            tone="violet"
          />

          <AnalyticsCard
            label="Completed Today"
            value={
              completedToday.toString()
            }
            description="Assignment and assessment activity today"
            icon="🕒"
            tone="cyan"
          />

          {/*
           * IMPORTANT:
           * This is deliberately not called "Students at Risk".
           *
           * The Teacher Intelligence system owns formal
           * intervention priority. This legacy operational
           * metric simply identifies learners averaging below
           * the dashboard score threshold.
           */}
          <AnalyticsCard
            label="Below 50% Snapshot"
            value={
              atRiskStudents.length.toString()
            }
            description={
              atRiskStudents.length ===
              0
                ? "No learners currently below the score threshold"
                : "Score-based snapshot — review Teacher Intelligence before intervention"
            }
            icon="⚠️"
            tone={
              atRiskStudents.length >
              0
                ? "red"
                : "green"
            }
          />

          <AnalyticsCard
            label="Top Performer"
            value={
              topStudent?.name ||
              "No data"
            }
            description={
              topStudent
                ? `${topStudent.xp.toLocaleString()} XP · ${topStudent.streak} day streak`
                : "Student results will appear here"
            }
            icon="🏆"
            tone="amber"
            compactValue
          />
        </div>
      </section>

      <section
        id="intelligence-workflow"
        className="rounded-3xl border border-teal-200 bg-teal-50/60 p-6"
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
          Evidence-led workflow
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Diagnose → prioritise → intervene → assess → report
        </h2>

        <p className="mt-2 max-w-4xl text-slate-600">
          Teacher Intelligence is the source of truth for formal learner
          priority and intervention decisions. Use the links below to move
          through the complete evidence cycle without relying on the legacy
          score threshold alone.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/teacher/analytics"
            className="rounded-2xl border border-teal-200 bg-white p-4 font-bold text-teal-800 transition hover:bg-teal-100"
          >
            1. Diagnose & prioritise →
          </Link>

          <Link
            href="/teacher/interventions"
            className="rounded-2xl border border-teal-200 bg-white p-4 font-bold text-teal-800 transition hover:bg-teal-100"
          >
            2. Plan interventions →
          </Link>

          <Link
            href="#assessment-centre"
            className="rounded-2xl border border-teal-200 bg-white p-4 font-bold text-teal-800 transition hover:bg-teal-100"
          >
            3. Reassess evidence →
          </Link>

          <Link
            href="/teacher/reports"
            className="rounded-2xl border border-teal-200 bg-white p-4 font-bold text-teal-800 transition hover:bg-teal-100"
          >
            4. Report & review →
          </Link>
        </div>
      </section>

      <section id="assessment-centre">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Assessment Centre
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Build, assign and mark
            </h2>

            <p className="mt-2 max-w-3xl text-slate-600">
              Create original exam-style papers, manage saved
              question sets and mark written student
              submissions.
            </p>
          </div>

          <Link
            href="/teacher/exam-assignments"
            className="inline-flex w-fit rounded-xl border border-indigo-300 bg-white px-5 py-3 font-bold text-indigo-700 transition hover:bg-indigo-50"
          >
            View assessment markbook →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {assessmentTools.map(
            (tool) => (
              <Card
                key={
                  tool.href
                }
                className={`border ${tool.accent}`}
              >
                <div className="flex h-full flex-col">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${tool.iconStyle}`}
                  >
                    {
                      tool.icon
                    }
                  </div>

                  <h3 className="mt-5 text-xl font-black text-slate-950">
                    {
                      tool.title
                    }
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                    {
                      tool.description
                    }
                  </p>

                  <Link
                    href={
                      tool.href
                    }
                    className={`mt-6 inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-3 text-center font-bold transition ${tool.buttonStyle}`}
                  >
                    {
                      tool.label
                    }
                  </Link>
                </div>
              </Card>
            ),
          )}
        </div>
      </section>

      <section id="quick-actions">
        <TeacherQuickActions />
      </section>

      <section id="supporting-analytics">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Supporting analytics
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Detailed classroom evidence
          </h2>

          <p className="mt-2 max-w-3xl text-slate-600">
            Use these operational views when you need additional context behind
            Teacher Intelligence, the Knowledge Map, interventions or reports.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <TopicAnalytics
              topics={
                classPerformance
              }
              strongestTopic={
                strongestTopic
              }
              weakestTopic={
                weakestTopic
              }
            />
          </div>

          <TeacherInsights
            averageScore={
              averageScore
            }
            completionRate={
              completionRate
            }
            activeAssignments={
              activeAssignmentCount
            }
            atRiskCount={
              atRiskStudents.length
            }
            strongestTopic={
              strongestTopic
            }
            weakestTopic={
              weakestTopic
            }
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <RecentStudentActivity
            activities={
              recentActivities
            }
          />

          <TopStudents
            students={
              topStudents
            }
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <ClassSummary
            studentCount={
              studentCount
            }
            classCount={
              classCount
            }
            assignmentCount={
              assignmentCount
            }
            activeAssignmentCount={
              activeAssignmentCount
            }
            completionRate={
              completionRate
            }
          />
        </div>
      </section>
    </div>
  );
}
