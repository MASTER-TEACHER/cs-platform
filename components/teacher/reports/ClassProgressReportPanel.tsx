"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Download,
  FileCheck2,
  Target,
  Users,
} from "lucide-react";

import Card from "@/components/ui/Card";
import { buildClassProgressReport } from "@/services/reporting/classProgressReportService";
import { classReportToCsv } from "@/services/reporting/reportCsvService";
import type { ClassProgressReport } from "@/types/reporting";

export default function ClassProgressReportPanel({
  teacherId,
  classId,
}: {
  teacherId: string;
  classId: string;
}) {
  const [report, setReport] =
    useState<ClassProgressReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const next = await buildClassProgressReport({
          teacherId,
          classId,
        });

        if (!cancelled) setReport(next);
      } catch (caughtError) {
        if (!cancelled) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "The class report could not be generated.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [teacherId, classId]);

  if (loading) {
    return (
      <Card>
        <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border border-amber-200 bg-amber-50 text-amber-900">
        {error}
      </Card>
    );
  }

  if (!report) return null;

  function exportCsv() {
    const blob = new Blob(
      [classReportToCsv(report!)],
      { type: "text/csv;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download =
      `${report!.className
        .replace(/[^a-z0-9]+/gi, "-")
        .toLowerCase()}-intelligence-report.csv`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <Card className="overflow-hidden rounded-3xl border border-slate-200 p-0">
      <div className="flex flex-col gap-4 bg-gradient-to-r from-teal-950 via-cyan-950 to-sky-900 p-6 text-white lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-teal-200">
            Class reporting intelligence
          </p>

          <h2 className="mt-2 text-2xl font-black">
            {report.className}
          </h2>

          <p className="mt-2 text-sm text-white/70">
            Attainment, curriculum mastery, evidence quality, QLA and
            intervention priorities in one report.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-black text-teal-950"
        >
          <Download className="h-4 w-4" />
          Export intelligence CSV
        </button>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-6">
        <Metric
          label="Working grade"
          value={report.averageWorkingGrade || "—"}
        />
        <Metric
          label="Target grade"
          value={report.averageTargetGrade || "—"}
        />
        <Metric
          label="Weighted attainment"
          value={
            report.averageWeightedPercentage === null
              ? "—"
              : `${report.averageWeightedPercentage}%`
          }
        />
        <Metric
          label="On / above target"
          value={`${report.onOrAboveTargetPercentage}%`}
        />
        <Metric
          label="Completion"
          value={`${report.averageCompletionRate}%`}
        />
        <Metric
          label="High priority"
          value={String(report.highPriorityCount)}
        />
      </div>

      {report.evidenceWarnings.length > 0 && (
        <div className="mx-6 mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="flex items-center gap-2 font-black text-amber-950">
            <AlertTriangle className="h-4 w-4" />
            Evidence quality
          </p>

          <div className="mt-3 space-y-2">
            {report.evidenceWarnings.map((warning) => (
              <p
                key={warning}
                className="text-sm leading-6 text-amber-900"
              >
                {warning}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-5 border-t border-slate-100 p-6 lg:grid-cols-2">
        <TopicList
          title="Strongest curriculum areas"
          items={report.strongestTopics}
        />
        <TopicList
          title="Priority curriculum areas"
          items={report.priorityTopics}
        />
      </div>

      <div className="grid gap-5 border-t border-slate-100 p-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-5">
          <p className="flex items-center gap-2 font-black text-slate-900">
            <BarChart3 className="h-4 w-4" />
            Grade distribution
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {report.gradeDistribution.map((item) => (
              <div
                key={item.grade}
                className="min-w-16 rounded-xl bg-white px-3 py-3 text-center"
              >
                <p className="text-xs font-black text-slate-400">
                  {item.grade}
                </p>
                <p className="mt-1 text-xl font-black text-slate-950">
                  {item.count}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-5">
          <p className="flex items-center gap-2 font-black text-slate-900">
            <FileCheck2 className="h-4 w-4" />
            Evidence sources
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
            <SmallMetric
              label="Exams"
              value={report.evidenceSourceCounts.written_exam}
            />
            <SmallMetric
              label="Quizzes"
              value={report.evidenceSourceCounts.quiz}
            />
            <SmallMetric
              label="AI quiz"
              value={report.evidenceSourceCounts.ai_quiz}
            />
            <SmallMetric
              label="Programming"
              value={report.evidenceSourceCounts.programming}
            />
            <SmallMetric
              label="Lessons"
              value={report.evidenceSourceCounts.lesson}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-indigo-600">
              Written assessment intelligence
            </p>
            <h3 className="mt-1 text-xl font-black text-slate-950">
              QLA report summary
            </h3>
          </div>

          <Link
            href="/teacher/exam-assignments"
            className="inline-flex items-center gap-2 text-sm font-black text-indigo-700"
          >
            Open exam markbook
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {report.examSummaries.length === 0 ? (
          <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
            No written exam assignments are available for this class yet.
          </p>
        ) : (
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {report.examSummaries.map((exam) => (
              <div
                key={exam.assignmentId}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-slate-950">
                      {exam.title}
                    </p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                      {exam.analysisConfidence} confidence · {exam.markedCount}/
                      {exam.studentCount} marked
                    </p>
                  </div>

                  <Link
                    href={`/teacher/exam-assignments/${exam.assignmentId}`}
                    className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white"
                  >
                    Open QLA
                  </Link>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <SmallMetric
                    label="Average"
                    value={
                      exam.classAverage === null
                        ? "—"
                        : `${exam.classAverage}%`
                    }
                  />
                  <SmallMetric
                    label="Grade"
                    value={exam.classAverageGrade || "—"}
                  />
                  <SmallMetric
                    label="Next grade"
                    value={
                      exam.classMarksToNextGrade === null
                        ? "—"
                        : `${exam.classMarksToNextGrade} marks`
                    }
                  />
                  <SmallMetric
                    label="Near boundary"
                    value={exam.nearBoundaryCount}
                  />
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>
                    <strong>Weakest topic:</strong>{" "}
                    {exam.weakestTopic || "Insufficient evidence"}
                    {exam.weakestTopicSuccess !== null
                      ? ` (${exam.weakestTopicSuccess}%)`
                      : ""}
                  </p>
                  <p>
                    <strong>Hardest question:</strong>{" "}
                    {exam.hardestQuestionNumber === null
                      ? "Insufficient evidence"
                      : `Q${exam.hardestQuestionNumber}`}
                    {exam.hardestQuestionSuccess !== null
                      ? ` (${exam.hardestQuestionSuccess}%)`
                      : ""}
                  </p>
                  <p>
                    <strong>Weakest AO:</strong>{" "}
                    {exam.weakestAssessmentObjective ||
                      "Insufficient AO evidence"}
                    {exam.weakestAssessmentObjectiveSuccess !== null
                      ? ` (${exam.weakestAssessmentObjectiveSuccess}%)`
                      : ""}
                  </p>
                  <p>
                    <strong>Marks lost:</strong> {exam.marksLost}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 p-6">
        <p className="flex items-center gap-2 font-black text-slate-950">
          <Users className="h-4 w-4" />
          Priority learners
        </p>

        {report.priorityStudents.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            No learners currently meet the report priority threshold.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {report.priorityStudents.map((student) => (
              <Link
                key={student.studentId}
                href={`/teacher/analytics/${student.studentId}`}
                className="rounded-2xl border border-slate-200 p-4 transition hover:border-teal-300 hover:bg-teal-50"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-slate-950">
                    {student.studentName}
                  </p>
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black uppercase text-red-700">
                    {student.priority}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-600">
                  {student.workingGrade || "—"} →{" "}
                  {student.targetGrade || "No target"} · completion{" "}
                  {student.completionRate}%
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Weakest: {student.weakestTopic}
                  {student.weakestTopicPercentage !== null
                    ? ` · ${student.weakestTopicPercentage}%`
                    : ""}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-5 border-t border-slate-100 p-6 lg:grid-cols-2">
        <ReportList
          title="Teacher interpretation"
          icon={<Target className="h-4 w-4" />}
          items={report.teacherInterpretation}
        />
        <ReportList
          title="Recommended actions"
          icon={<ArrowRight className="h-4 w-4" />}
          items={report.recommendedActions}
        />
      </div>
    </Card>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}

function SmallMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl bg-white p-3 text-center">
      <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}

function TopicList({
  title,
  items,
}: {
  title: string;
  items: Array<{ topic: string; mastery: number }>;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <p className="font-black text-slate-900">{title}</p>
      <div className="mt-4 space-y-2">
        {items.length ? (
          items.map((item) => (
            <div
              key={item.topic}
              className="flex items-center justify-between rounded-xl bg-white px-4 py-3"
            >
              <span className="text-sm font-bold text-slate-700">
                {item.topic}
              </span>
              <span className="text-sm font-black text-slate-950">
                {item.mastery}%
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">
            No topic evidence available yet.
          </p>
        )}
      </div>
    </div>
  );
}

function ReportList({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <div className="flex items-center gap-2">
        {icon}
        <p className="font-black text-slate-900">{title}</p>
      </div>

      <div className="mt-4 space-y-2">
        {items.length ? (
          items.map((item) => (
            <p
              key={item}
              className="rounded-xl bg-white px-4 py-3 text-sm leading-6 text-slate-700"
            >
              {item}
            </p>
          ))
        ) : (
          <p className="text-sm text-slate-500">
            No report items available yet.
          </p>
        )}
      </div>
    </div>
  );
}
