"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  ClipboardList,
  Gauge,
  Search,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";

import {
  getTeacherAnalyticsActionCentre,
  type TeacherActionClass,
  type TeacherActionPriority,
  type TeacherActionStudent,
  type TeacherAnalyticsActionCentre,
} from "@/services/analytics/teacherActionCentreService";

const emptyActionCentre: TeacherAnalyticsActionCentre = {
  teacherId: "",
  classCount: 0,
  studentCount: 0,
  studentsWithEvidence: 0,
  studentsWithoutEvidence: 0,
  highPriorityCount: 0,
  decliningCount: 0,
  lowEvidenceCount: 0,
  studentsWithTargets: 0,
  studentsBelowTarget: 0,
  studentsOnOrAboveTarget: 0,
  studentsWithoutTargets: 0,
  averageCompletionRate: 0,
  activeInterventions: 0,
  completedInterventions: 0,
  priorityStudents: [],
  classes: [],
  priorityTopics: [],
  strongestTopics: [],
};

function priorityTone(priority: TeacherActionPriority): string {
  if (priority === "high") {
    return "bg-red-100 text-red-800";
  }

  if (priority === "medium") {
    return "bg-amber-100 text-amber-800";
  }

  if (priority === "monitor") {
    return "bg-blue-100 text-blue-800";
  }

  return "bg-slate-100 text-slate-700";
}

function priorityLabel(priority: TeacherActionPriority): string {
  if (priority === "high") return "High";
  if (priority === "medium") return "Medium";
  if (priority === "monitor") return "Monitor";
  return "No flag";
}

function gradeGapLabel(value: number | null): string {
  if (value === null) {
    return "Target not set";
  }

  if (value > 0) {
    return `+${value} above target`;
  }

  if (value === 0) {
    return "On target";
  }

  return `${Math.abs(value)} below target`;
}

function confidenceLabel(value: string): string {
  if (value === "insufficient") return "Insufficient";
  if (value === "low") return "Low";
  if (value === "medium") return "Medium";
  if (value === "high") return "High";
  return value || "Unknown";
}

export default function TeacherAnalyticsPage() {
  const {
    user,
    profile,
    loading: authLoading,
    profileReady,
  } = useAuth();

  const [centre, setCentre] =
    useState<TeacherAnalyticsActionCentre>(emptyActionCentre);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    if (authLoading || !profileReady) {
      return;
    }

    if (!user?.uid) {
      setCentre(emptyActionCentre);
      setLoading(false);
      return;
    }

    const teacherId: string = user.uid;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const loaded =
          await getTeacherAnalyticsActionCentre(
            teacherId,
          );

        if (!cancelled) {
          setCentre(loaded);
        }
      } catch (caughtError) {
        console.error(
          "Unable to load teacher analytics action centre:",
          caughtError,
        );

        if (!cancelled) {
          setCentre(emptyActionCentre);
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Teacher analytics could not be loaded.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [
    authLoading,
    profileReady,
    user?.uid,
  ]);

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();

    return centre.priorityStudents.filter((student) => {
      const matchesSearch =
        !term ||
        student.studentName.toLowerCase().includes(term) ||
        student.studentEmail.toLowerCase().includes(term) ||
        student.className.toLowerCase().includes(term) ||
        student.weakestTopic.toLowerCase().includes(term);

      const matchesClass =
        classFilter === "all" || student.classId === classFilter;

      const matchesPriority =
        priorityFilter === "all" || student.priority === priorityFilter;

      return matchesSearch && matchesClass && matchesPriority;
    });
  }, [centre.priorityStudents, search, classFilter, priorityFilter]);

  if (authLoading || !profileReady || loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-56 w-full rounded-3xl" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-28 rounded-3xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  if (profile?.role !== "teacher" && profile?.role !== "admin") {
    return (
      <Card className="rounded-3xl border border-red-200 bg-red-50 p-7">
        <h1 className="text-2xl font-black text-red-950">
          Teacher access required
        </h1>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-900 p-7 text-white shadow-xl sm:p-9">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-200">
              T1D · Teacher intelligence
            </p>

            <h1 className="mt-3 text-3xl font-black sm:text-4xl">
              Analytics & Action Centre
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-violet-100">
              Turn class attainment, completion, topic mastery and evidence quality
              into a prioritised teacher action list.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/teacher/interventions"
              className="rounded-xl bg-white px-5 py-3 text-sm font-black text-violet-950 transition hover:bg-violet-50"
            >
              Intervention Centre
            </Link>

            <Link
              href="/teacher/reports"
              className="rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20"
            >
              Reports
            </Link>
          </div>
        </div>
      </section>

      {error && (
        <Card className="rounded-3xl border border-red-200 bg-red-50 p-6">
          <p className="font-bold text-red-900">{error}</p>
        </Card>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Students"
          value={centre.studentCount}
          description={`${centre.classCount} active class${centre.classCount === 1 ? "" : "es"}`}
          icon={<Users className="h-5 w-5" />}
        />

        <SummaryCard
          label="Completion"
          value={`${centre.averageCompletionRate}%`}
          description="Average assignment completion"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />

        <SummaryCard
          label="High priority"
          value={centre.highPriorityCount}
          description={`${centre.decliningCount} declining learner${centre.decliningCount === 1 ? "" : "s"}`}
          icon={<AlertTriangle className="h-5 w-5" />}
        />

        <SummaryCard
          label="Interventions"
          value={centre.activeInterventions}
          description={`${centre.completedInterventions} completed`}
          icon={<ClipboardList className="h-5 w-5" />}
        />
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
        <Card className="rounded-3xl border border-slate-200 p-6 sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-red-600">
                Action queue
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Students needing attention
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Priority combines target gap, trend, completion and evidence confidence.
              </p>
            </div>

            <Link
              href="/teacher/interventions"
              className="inline-flex items-center gap-2 text-sm font-black text-violet-700"
            >
              Plan interventions
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-[1.4fr_.8fr_.8fr]">
            <label className="relative block">
              <span className="sr-only">Search students</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search student, class or topic..."
                className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </label>

            <select
              value={classFilter}
              onChange={(event) => setClassFilter(event.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
            >
              <option value="all">All classes</option>
              {centre.classes.map((classItem) => (
                <option key={classItem.classId} value={classItem.classId}>
                  {classItem.className}
                </option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
            >
              <option value="all">All priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="monitor">Monitor</option>
              <option value="none">No flag</option>
            </select>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <CheckCircle2 className="mx-auto h-9 w-9 text-emerald-500" />
              <p className="mt-3 font-black text-slate-900">
                No students match this action filter
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Adjust the filters or review the wider class evidence below.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {filteredStudents.slice(0, 12).map((student) => (
                <PriorityStudentCard key={student.key} student={student} />
              ))}
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-amber-700">
              Evidence quality
            </p>

            <h2 className="mt-2 text-xl font-black text-amber-950">
              {centre.studentsWithEvidence}/{centre.studentCount} learners with graded evidence
            </h2>

            <div className="mt-5 space-y-3">
              <EvidenceRow
                label="Without graded evidence"
                value={centre.studentsWithoutEvidence}
              />
              <EvidenceRow
                label="Low / insufficient confidence"
                value={centre.lowEvidenceCount}
              />
              <EvidenceRow
                label="Targets not set"
                value={centre.studentsWithoutTargets}
              />
            </div>

            <p className="mt-5 text-sm leading-6 text-amber-800">
              Treat low-confidence attainment cautiously until more assessed evidence is available.
            </p>
          </Card>

          <Card className="rounded-3xl border border-blue-200 bg-blue-50 p-6">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-700">
              Target position
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <MiniMetric
                label="On / above"
                value={centre.studentsOnOrAboveTarget}
              />
              <MiniMetric
                label="Below target"
                value={centre.studentsBelowTarget}
              />
            </div>

            <Link
              href="/teacher/students"
              className="mt-5 inline-flex items-center gap-2 text-sm font-black text-blue-700"
            >
              Open student directory
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <TopicPanel
          title="Priority curriculum areas"
          subtitle="Lowest current weighted mastery across your active classes."
          topics={centre.priorityTopics}
          positive={false}
        />

        <TopicPanel
          title="Strongest curriculum areas"
          subtitle="Topics currently showing the strongest assessed mastery."
          topics={centre.strongestTopics}
          positive
        />
      </section>

      <section>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-teal-600">
              Class intelligence
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Performance by teaching group
            </h2>
          </div>

          <Link
            href="/teacher/knowledge-map"
            className="inline-flex items-center gap-2 text-sm font-black text-teal-700"
          >
            Class Knowledge Map
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {centre.classes.length === 0 ? (
          <Card className="rounded-3xl border border-dashed border-slate-300 p-10 text-center">
            <p className="font-black text-slate-900">No active classes yet.</p>
          </Card>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {centre.classes.map((classItem) => (
              <ClassIntelligenceCard
                key={classItem.classId}
                classItem={classItem}
              />
            ))}
          </div>
        )}
      </section>

      <Card className="rounded-3xl border border-violet-200 bg-violet-50 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-violet-700">
              Next teacher action
            </p>
            <h2 className="mt-2 text-xl font-black text-violet-950">
              Move from diagnosis to targeted support
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-violet-800">
              Use the Intervention Centre to convert flagged students and weak topics into measurable support plans.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/teacher/interventions"
              className="rounded-xl bg-violet-700 px-5 py-3 text-sm font-black text-white"
            >
              Open Intervention Centre
            </Link>

            <Link
              href="/teacher/reports"
              className="rounded-xl border border-violet-300 bg-white px-5 py-3 text-sm font-black text-violet-800"
            >
              Generate reports
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: number | string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <Card className="rounded-3xl border border-slate-200 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <div className="rounded-2xl bg-violet-50 p-3 text-violet-700">
          {icon}
        </div>
      </div>
    </Card>
  );
}

function PriorityStudentCard({
  student,
}: {
  student: TeacherActionStudent;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-black text-slate-950">{student.studentName}</h3>
            <span className={`rounded-full px-3 py-1 text-xs font-black ${priorityTone(student.priority)}`}>
              {priorityLabel(student.priority)} priority
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {student.className}
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500">{student.studentEmail}</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StudentMetric label="Working" value={student.workingGrade} />
            <StudentMetric label="Target" value={student.targetGrade} />
            <StudentMetric label="Completion" value={`${student.completionRate}%`} />
            <StudentMetric label="Confidence" value={confidenceLabel(student.confidence)} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
            <span className={student.gradeGap !== null && student.gradeGap < 0 ? "text-red-700" : "text-emerald-700"}>
              {gradeGapLabel(student.gradeGap)}
            </span>

            {student.trend === "declining" && (
              <span className="inline-flex items-center gap-1 text-red-700">
                <TrendingDown className="h-3.5 w-3.5" />
                Declining trend
              </span>
            )}

            <span className="text-slate-600">
              Weakest: {student.weakestTopic}
              {student.weakestTopicPercentage === null
                ? ""
                : ` (${student.weakestTopicPercentage}%)`}
            </span>
          </div>

          {student.reasons.length > 0 && (
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {student.reasons.slice(0, 2).join(" · ")}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            href={`/teacher/analytics/${student.studentId}`}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-50"
          >
            Analytics
          </Link>

          <Link
            href={`/teacher/interventions?studentId=${encodeURIComponent(
              student.studentId,
            )}&studentName=${encodeURIComponent(
              student.studentName,
            )}&className=${encodeURIComponent(
              student.className,
            )}&topic=${encodeURIComponent(
              student.weakestTopic,
            )}`}
            className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-black text-white"
          >
            Intervention
          </Link>
        </div>
      </div>
    </article>
  );
}

function StudentMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-black text-slate-900">{value}</p>
    </div>
  );
}

function EvidenceRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/70 px-4 py-3">
      <span className="text-sm font-semibold text-amber-900">{label}</span>
      <span className="font-black text-amber-950">{value}</span>
    </div>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-white/80 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-blue-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-blue-950">{value}</p>
    </div>
  );
}

function TopicPanel({
  title,
  subtitle,
  topics,
  positive,
}: {
  title: string;
  subtitle: string;
  topics: TeacherAnalyticsActionCentre["priorityTopics"];
  positive: boolean;
}) {
  return (
    <Card className="rounded-3xl border border-slate-200 p-6">
      <div className="flex items-start gap-3">
        <div className={`rounded-2xl p-3 ${positive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {positive ? <TrendingUp className="h-5 w-5" /> : <Target className="h-5 w-5" />}
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-950">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>

      {topics.length === 0 ? (
        <p className="mt-5 rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">
          More assessed evidence is needed before topic patterns can be shown.
        </p>
      ) : (
        <div className="mt-5 space-y-3">
          {topics.map((topic) => (
            <div key={topic.topic} className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-black text-slate-900">{topic.topic}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {topic.evidenceCount} evidence item{topic.evidenceCount === 1 ? "" : "s"} · {topic.studentCount} learner{topic.studentCount === 1 ? "" : "s"}
                  </p>
                </div>
                <p className={`text-xl font-black ${positive ? "text-emerald-700" : "text-red-700"}`}>
                  {topic.weightedPercentage}%
                </p>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-current"
                  style={{ width: `${Math.max(0, Math.min(100, topic.weightedPercentage))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function ClassIntelligenceCard({
  classItem,
}: {
  classItem: TeacherActionClass;
}) {
  const coverage =
    classItem.studentCount > 0
      ? Math.round((classItem.studentsWithEvidence / classItem.studentCount) * 100)
      : 0;

  return (
    <Card className="rounded-3xl border border-slate-200 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-teal-600">
            {classItem.yearGroup || "Teaching group"}
          </p>
          <h3 className="mt-2 text-xl font-black text-slate-950">{classItem.className}</h3>
        </div>

        <Link
          href={`/teacher/classes/${classItem.classId}`}
          className="inline-flex items-center gap-2 text-sm font-black text-blue-700"
        >
          Open class
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ClassMetric label="Working" value={classItem.averageWorkingGrade} icon={<Gauge className="h-4 w-4" />} />
        <ClassMetric label="Target" value={classItem.averageTargetGrade} icon={<Target className="h-4 w-4" />} />
        <ClassMetric label="Completion" value={`${classItem.averageCompletionRate}%`} icon={<CheckCircle2 className="h-4 w-4" />} />
        <ClassMetric label="On / above target" value={`${classItem.onOrAboveTargetPercentage}%`} icon={<BarChart3 className="h-4 w-4" />} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <RiskMetric label="High priority" value={classItem.highPriorityCount} tone="red" />
        <RiskMetric label="Declining" value={classItem.decliningCount} tone="amber" />
        <RiskMetric label="Low evidence" value={classItem.lowEvidenceCount} tone="blue" />
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-slate-700">Evidence coverage</p>
          <p className="text-sm font-black text-slate-950">{coverage}%</p>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-teal-600" style={{ width: `${coverage}%` }} />
        </div>
      </div>

      {classItem.priorityTopics.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">
            Priority topics
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {classItem.priorityTopics.slice(0, 3).map((topic) => (
              <span key={topic.topic} className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                {topic.topic} · {topic.weightedPercentage}%
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

function ClassMetric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
        {icon}
        {label}
      </p>
      <p className="mt-2 font-black text-slate-950">{value}</p>
    </div>
  );
}

function RiskMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "red" | "amber" | "blue";
}) {
  const style =
    tone === "red"
      ? "bg-red-50 text-red-800"
      : tone === "amber"
        ? "bg-amber-50 text-amber-800"
        : "bg-blue-50 text-blue-800";

  return (
    <div className={`rounded-2xl p-4 ${style}`}>
      <p className="text-xs font-black uppercase tracking-wide">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}
