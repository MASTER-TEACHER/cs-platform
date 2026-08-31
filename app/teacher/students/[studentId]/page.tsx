"use client";

import { AlertCircle, ArrowLeft, Award, BarChart3, BookOpen, Brain, CalendarDays, CheckCircle2, Clock3, Flame, FileText, GraduationCap, Lightbulb, Sparkles, Star, Target, TrendingDown, TrendingUp, UserRound, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import StudentIntelligenceRecord from "@/components/teacher/student/StudentIntelligenceRecord";
import StudentProgressReportPanel from "@/components/teacher/reports/StudentProgressReportPanel";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import {
  getStudentAnalytics,
  type AnalyticsAssignmentStatus,
  type StudentAnalyticsActivity,
  type StudentAnalyticsData,
  type StudentAnalyticsRecommendation,
  type StudentTopicPerformance,
} from "@/services/studentAnalyticsService";

function formatDate(value: Date | null, includeTime = false): string {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    includeTime
      ? {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      : {
          day: "2-digit",
          month: "short",
          year: "numeric",
        },
  ).format(value);
}

function formatDuration(seconds: number): string {
  if (seconds <= 0) {
    return "No data";
  }

  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

function formatQualification(value: string): string {
  if (!value.trim()) {
    return "Not selected";
  }

  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getInitials(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "ST"
  );
}

export default function TeacherStudentAnalyticsPage() {
  const params = useParams<{
    studentId: string;
  }>();

  const studentId = params.studentId;

  const { user } = useAuth();

  const [analytics, setAnalytics] = useState<StudentAnalyticsData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const loadAnalytics = useCallback(() => {
    if (!studentId || !user?.uid) {
      return Promise.resolve();
    }

    const teacherId = user.uid;

    return Promise.resolve()
      .then(() => {
        setLoading(true);
        setError("");
        return getStudentAnalytics(studentId, teacherId);
      })
      .then((loadedAnalytics) => {
        if (!loadedAnalytics) {
          setAnalytics(null);

          setError(
            "This student could not be found or is not enrolled in one of your classes.",
          );

          return;
        }

        setAnalytics(loadedAnalytics);
      })
      .catch((caughtError) => {
        console.error("Failed to load student analytics:", caughtError);

        setAnalytics(null);

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Student analytics could not be loaded.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [studentId, user]);

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  const sortedOutstanding = useMemo(
    () =>
      analytics
        ? [...analytics.outstandingActivities].sort((first, second) => {
            const firstOverdue = first.status === "overdue";

            const secondOverdue = second.status === "overdue";

            if (firstOverdue !== secondOverdue) {
              return firstOverdue ? -1 : 1;
            }

            return (
              (first.dueDate?.getTime() || Number.MAX_SAFE_INTEGER) -
              (second.dueDate?.getTime() || Number.MAX_SAFE_INTEGER)
            );
          })
        : [],
    [analytics],
  );

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-64 w-full rounded-3xl" />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({
            length: 8,
          }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-3xl" />
          ))}
        </div>

        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  if (!analytics || error) {
    return (
      <Card className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-red-600" />

        <h1 className="mt-5 text-2xl font-black text-red-950">
          Student analytics unavailable
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-sm text-red-800">
          {error || "The student analytics could not be loaded."}
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              void loadAnalytics();
            }}
            className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white"
          >
            Try again
          </button>

          <Link
            href="/teacher/students"
            className="rounded-xl border border-red-300 bg-white px-5 py-3 text-sm font-bold text-red-700"
          >
            Back to students
          </Link>
        </div>
      </Card>
    );
  }

  const { student, classes, metrics } = analytics;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-700 p-7 text-white shadow-xl sm:p-9">
        <Link
          href="/teacher/students"
          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-100 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          All students
        </Link>

        <div className="mt-7 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white/15 text-2xl font-black">
              {getInitials(student.name)}
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-100">
                Student analytics
              </p>

              <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                {student.name}
              </h1>

              <p className="mt-2 text-emerald-100">
                {student.email || "No email available"}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {classes.map((studentClass) => (
                  <span
                    key={studentClass.id}
                    className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold"
                  >
                    {studentClass.name}
                  </span>
                ))}

                {classes.length === 0 && (
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                    No teacher class
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid min-w-72 grid-cols-2 gap-3 rounded-3xl border border-white/20 bg-white/10 p-5">
            <HeroMetric label="Current grade" value={metrics.currentGrade} />

            <HeroMetric
              label="Predicted grade"
              value={metrics.predictedGrade}
            />

            <HeroMetric
              label="Completion"
              value={`${metrics.completionRate}%`}
            />

            <HeroMetric
              label="Assessment average"
              value={`${metrics.combinedAssessmentAverage}%`}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Assignments"
          value={`${metrics.completedAssignments}/${metrics.totalAssignments}`}
          description="Completed activities"
          icon={<CheckCircle2 className="h-6 w-6" />}
          iconClassName="bg-emerald-50 text-emerald-600"
        />

        <SummaryCard
          label="Outstanding"
          value={metrics.outstandingAssignments}
          description={`${metrics.overdueAssignments} overdue`}
          icon={<Clock3 className="h-6 w-6" />}
          iconClassName="bg-amber-50 text-amber-600"
        />

        <SummaryCard
          label="Quiz Average"
          value={`${metrics.quizAverage}%`}
          description={`${metrics.completedQuizAssignments} completed quizzes`}
          icon={<Brain className="h-6 w-6" />}
          iconClassName="bg-violet-50 text-violet-600"
        />

        <SummaryCard
          label="Highest Score"
          value={`${metrics.highestQuizScore}%`}
          description={`Lowest ${metrics.lowestQuizScore}%`}
          icon={<Award className="h-6 w-6" />}
          iconClassName="bg-blue-50 text-blue-600"
        />

        <SummaryCard
          label="Written Exams"
          value={`${metrics.completedExamAssignments}/${metrics.totalExamAssignments}`}
          description={`${metrics.awaitingMarkingExamAssignments} awaiting marking`}
          icon={<FileText className="h-6 w-6" />}
          iconClassName="bg-indigo-50 text-indigo-600"
        />

        <SummaryCard
          label="Exam Average"
          value={`${metrics.examAverage}%`}
          description={
            metrics.completedExamAssignments > 0
              ? `Best ${metrics.highestExamScore}%`
              : "No marked written exams yet"
          }
          icon={<BarChart3 className="h-6 w-6" />}
          iconClassName="bg-cyan-50 text-cyan-600"
        />

        <SummaryCard
          label="XP"
          value={metrics.totalXP}
          description={`${metrics.assignmentXP} earned from assignments`}
          icon={<Star className="h-6 w-6" />}
          iconClassName="bg-yellow-50 text-yellow-600"
        />

        <SummaryCard
          label="Streak"
          value={`${metrics.streak} days`}
          description="Current learning streak"
          icon={<Flame className="h-6 w-6" />}
          iconClassName="bg-orange-50 text-orange-600"
        />

        <SummaryCard
          label="Lessons"
          value={metrics.completedLessons}
          description={`${metrics.completedTopics} topics completed`}
          icon={<BookOpen className="h-6 w-6" />}
          iconClassName="bg-teal-50 text-teal-600"
        />

        <SummaryCard
          label="Trend"
          value={
            metrics.improvementTrend > 0
              ? `+${metrics.improvementTrend}%`
              : `${metrics.improvementTrend}%`
          }
          description={
            metrics.improvementTrend >= 0
              ? "Recent improvement"
              : "Recent decline"
          }
          icon={
            metrics.improvementTrend >= 0 ? (
              <TrendingUp className="h-6 w-6" />
            ) : (
              <TrendingDown className="h-6 w-6" />
            )
          }
          iconClassName={
            metrics.improvementTrend >= 0
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-600"
          }
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-3xl border border-slate-200 p-6">
          <SectionHeading
            eyebrow="Performance"
            title="Topic analysis"
            description="Quiz and written-exam performance grouped by assessed topic."
          />

          {analytics.topicPerformance.length === 0 ? (
            <EmptyMessage message="No topic performance data is available yet." />
          ) : (
            <div className="mt-6 space-y-4">
              {analytics.topicPerformance.map((topic) => (
                <TopicRow key={topic.id} topic={topic} />
              ))}
            </div>
          )}
        </Card>

        <Card className="rounded-3xl border border-slate-200 p-6">
          <SectionHeading
            eyebrow="Intervention"
            title="Teacher recommendations"
            description="Automatically generated from completion and assessment data."
          />

          <div className="mt-6 space-y-4">
            {analytics.recommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
              />
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-3xl border border-slate-200 p-6">
          <SectionHeading
            eyebrow="Strengths"
            title="Secure areas"
            description="Topics currently assessed at 70% or higher."
          />

          {analytics.strongestTopics.length === 0 ? (
            <EmptyMessage message="No secure assessed topics have been identified yet." />
          ) : (
            <div className="mt-6 space-y-3">
              {analytics.strongestTopics.map((topic) => (
                <TopicHighlight key={topic.id} topic={topic} positive />
              ))}
            </div>
          )}
        </Card>

        <Card className="rounded-3xl border border-slate-200 p-6">
          <SectionHeading
            eyebrow="Support"
            title="Priority areas"
            description="Topics currently assessed below 50%."
          />

          {analytics.weakestTopics.length === 0 ? (
            <EmptyMessage message="No priority assessed topics are currently identified." />
          ) : (
            <div className="mt-6 space-y-3">
              {analytics.weakestTopics.map((topic) => (
                <TopicHighlight key={topic.id} topic={topic} positive={false} />
              ))}
            </div>
          )}
        </Card>
      </section>

      <Card className="overflow-hidden rounded-3xl border border-slate-200 p-0">
        <div className="border-b border-slate-200 p-6 sm:p-7">
          <SectionHeading
            eyebrow="Learning history"
            title="Recent activity"
            description="The student’s most recent completed learning activities."
          />
        </div>

        {analytics.recentActivities.length === 0 ? (
          <EmptyMessage message="No completed activity has been recorded yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4">Activity</th>

                  <th className="px-6 py-4">Type</th>

                  <th className="px-6 py-4">Score</th>

                  <th className="px-6 py-4">XP</th>

                  <th className="px-6 py-4">Time</th>

                  <th className="px-6 py-4">Completed</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {analytics.recentActivities.map((activity) => (
                  <ActivityRow key={activity.id} activity={activity} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card className="rounded-3xl border border-slate-200 p-6">
        <SectionHeading
          eyebrow="Outstanding work"
          title="Assignments requiring attention"
          description="Incomplete and overdue activities assigned to this student."
        />

        {sortedOutstanding.length === 0 ? (
          <EmptyMessage message="There is no outstanding assigned work." />
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {sortedOutstanding.map((activity) => (
              <OutstandingCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </Card>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-3xl border border-slate-200 p-6">
          <SectionHeading
            eyebrow="Programme"
            title="Course details"
            description="The student’s selected learning programme."
          />

          <div className="mt-6 space-y-3">
            <DetailRow
              label="Qualification"
              value={formatQualification(student.qualification)}
            />

            <DetailRow
              label="Exam Board"
              value={student.examBoard.trim().toUpperCase() || "Not selected"}
            />

            <DetailRow
              label="Current Course"
              value={formatQualification(student.currentCourse)}
            />

            <DetailRow
              label="Classes"
              value={
                classes.map((studentClass) => studentClass.name).join(", ") ||
                "No classes"
              }
            />

            <DetailRow
              label="Average Quiz Time"
              value={formatDuration(metrics.averageTimeTakenSeconds)}
            />
          </div>
        </Card>
<StudentIntelligenceRecord studentId={studentId} />
        <Card className="rounded-3xl border border-slate-200 p-6">
          <SectionHeading
            eyebrow="Progress"
            title="Learning totals"
            description="Recorded curriculum and assignment progress."
          />

          <div className="mt-6 grid grid-cols-2 gap-4">
            <MiniMetric
              label="Resources"
              value={`${metrics.completedResourceAssignments}/${metrics.totalResourceAssignments}`}
              icon={<BookOpen className="h-5 w-5" />}
            />

            <MiniMetric
              label="Quizzes"
              value={`${metrics.completedQuizAssignments}/${metrics.totalQuizAssignments}`}
              icon={<Brain className="h-5 w-5" />}
            />

            <MiniMetric
              label="Written Exams"
              value={`${metrics.completedExamAssignments}/${metrics.totalExamAssignments}`}
              icon={<FileText className="h-5 w-5" />}
            />

            <MiniMetric
              label="Topics"
              value={`${metrics.completedTopics}`}
              icon={<Target className="h-5 w-5" />}
            />

            <MiniMetric
              label="Units"
              value={`${metrics.completedUnits}`}
              icon={<GraduationCap className="h-5 w-5" />}
            />
          </div>
        </Card>
      </section>

      {user?.uid && (
        <section
          id="progress-report"
          className="scroll-mt-6"
        >
          <StudentProgressReportPanel
            teacherId={user.uid}
            studentId={studentId}
          />
        </section>
      )}
    </div>
  );
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-emerald-100">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  description,
  icon,
  iconClassName,
}: {
  label: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  iconClassName: string;
}) {
  return (
    <Card className="rounded-3xl border border-slate-200 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>

          <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>

          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClassName}`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-600">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-black text-slate-950">{title}</h2>

      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function TopicRow({ topic }: { topic: StudentTopicPerformance }) {
  const barClassName =
    topic.classification === "strength"
      ? "bg-emerald-500"
      : topic.classification === "support"
        ? "bg-red-500"
        : "bg-amber-500";

  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-bold text-slate-900">{topic.topic}</p>

          <p className="mt-1 text-xs font-semibold text-slate-500">
            {topic.attempts} attempt
            {topic.attempts === 1 ? "" : "s"}
          </p>
        </div>

        <p className="font-black text-slate-900">{topic.averageScore}%</p>
      </div>

      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full ${barClassName}`}
          style={{
            width: `${Math.min(100, Math.max(0, topic.averageScore))}%`,
          }}
        />
      </div>
    </div>
  );
}

function TopicHighlight({
  topic,
  positive,
}: {
  topic: StudentTopicPerformance;
  positive: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        positive
          ? "border-emerald-200 bg-emerald-50"
          : "border-red-200 bg-red-50"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="font-bold text-slate-900">{topic.topic}</p>

        <p
          className={`font-black ${
            positive ? "text-emerald-700" : "text-red-700"
          }`}
        >
          {topic.averageScore}%
        </p>
      </div>
    </div>
  );
}

function RecommendationCard({
  recommendation,
}: {
  recommendation: StudentAnalyticsRecommendation;
}) {
  const classes =
    recommendation.priority === "high"
      ? "border-red-200 bg-red-50"
      : recommendation.priority === "medium"
        ? "border-amber-200 bg-amber-50"
        : "border-emerald-200 bg-emerald-50";

  return (
    <div className={`rounded-2xl border p-5 ${classes}`}>
      <div className="flex items-start gap-3">
        {recommendation.priority === "positive" ? (
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        ) : (
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        )}

        <div>
          <p className="font-black text-slate-950">{recommendation.title}</p>

          <p className="mt-2 text-sm leading-6 text-slate-700">
            {recommendation.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function ActivityRow({ activity }: { activity: StudentAnalyticsActivity }) {
  return (
    <tr className="hover:bg-slate-50">
      <td className="px-6 py-5">
        <p className="font-bold text-slate-950">{activity.title}</p>

        <p className="mt-1 text-sm text-slate-500">{activity.className}</p>
      </td>

      <td className="px-6 py-5">
        <span
          className={`rounded-full px-3 py-1.5 text-xs font-bold ${
            activity.type === "quiz"
              ? "bg-violet-100 text-violet-700"
              : activity.type === "exam"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-teal-100 text-teal-700"
          }`}
        >
          {activity.type === "quiz"
            ? "Quiz"
            : activity.type === "exam"
              ? "Written Exam"
              : "Resource"}
        </span>
      </td>

      <td className="px-6 py-5 font-semibold text-slate-700">
        {activity.percentage !== null ? `${activity.percentage}%` : "Completed"}
      </td>

      <td className="px-6 py-5 font-semibold text-slate-700">
        {activity.earnedXP > 0
  ? `+${activity.earnedXP} XP`
  : "No XP"}
      </td>

      <td className="px-6 py-5 font-semibold text-slate-700">
        {formatDuration(activity.timeTakenSeconds)}
      </td>

      <td className="px-6 py-5 text-sm text-slate-600">
        {formatDate(activity.completedAt, true)}
      </td>
    </tr>
  );
}

function OutstandingCard({ activity }: { activity: StudentAnalyticsActivity }) {
  const overdue = activity.status === "overdue";

  return (
    <div
      className={`rounded-2xl border p-5 ${
        overdue ? "border-red-200 bg-red-50" : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-black text-slate-950">{activity.title}</p>

          <p className="mt-1 text-sm text-slate-600">{activity.className}</p>
        </div>

        <StatusBadge status={activity.status} />
      </div>

      <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-600">
        <CalendarDays className="h-4 w-4" />
        Due {formatDate(activity.dueDate)}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: AnalyticsAssignmentStatus }) {
  if (status === "overdue") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
        <AlertCircle className="h-3.5 w-3.5" />
        Overdue
      </span>
    );
  }

  if (status === "in_progress") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
        <Clock3 className="h-3.5 w-3.5" />
        In progress
      </span>
    );
  }

  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Completed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600">
      <XCircle className="h-3.5 w-3.5" />
      Not started
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
      <p className="font-semibold text-slate-600">{label}</p>

      <p className="text-right font-black text-slate-950">{value}</p>
    </div>
  );
}

function MiniMetric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <div className="text-teal-600">{icon}</div>

      <p className="mt-3 text-2xl font-black text-slate-950">{value}</p>

      <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
    </div>
  );
}

function EmptyMessage({ message }: { message: string }) {
  return (
    <div className="mt-6 rounded-2xl bg-slate-50 p-8 text-center">
      <UserRound className="mx-auto h-8 w-8 text-slate-400" />

      <p className="mt-3 text-sm text-slate-500">{message}</p>
    </div>
  );
}
