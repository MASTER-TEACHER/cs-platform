"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  GraduationCap,
  Search,
  Users,
} from "lucide-react";

import ClassProgressReportPanel from "@/components/teacher/reports/ClassProgressReportPanel";
import StudentProgressReportPanel from "@/components/teacher/reports/StudentProgressReportPanel";
import Card from "@/components/ui/Card";
import type { TeacherAnalyticsPortfolio } from "@/types/teacherAnalytics";

type ReportMode = "class" | "student";

export default function ReportingWorkspace({
  teacherId,
  portfolio,
}: {
  teacherId: string;
  portfolio: TeacherAnalyticsPortfolio;
}) {
  const classes = portfolio.classes;

  const [mode, setMode] = useState<ReportMode>("class");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [studentSearch, setStudentSearch] = useState("");

  useEffect(() => {
    if (
      selectedClassId &&
      classes.some((item) => item.classId === selectedClassId)
    ) {
      return;
    }

    setSelectedClassId(classes[0]?.classId || "");
  }, [classes, selectedClassId]);

  const selectedClass = useMemo(
    () =>
      classes.find(
        (item) => item.classId === selectedClassId,
      ) || null,
    [classes, selectedClassId],
  );

  const students = useMemo(() => {
    const source = selectedClass?.students || [];
    const term = studentSearch.trim().toLowerCase();

    if (!term) {
      return [...source].sort((first, second) =>
        first.studentName.localeCompare(second.studentName),
      );
    }

    return source
      .filter((student) =>
        [
          student.studentName,
          student.studentEmail,
          student.workingGrade || "",
          student.targetGrade || "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(term),
      )
      .sort((first, second) =>
        first.studentName.localeCompare(second.studentName),
      );
  }, [selectedClass, studentSearch]);

  useEffect(() => {
    const classStudents = selectedClass?.students || [];

    if (
      selectedStudentId &&
      classStudents.some(
        (student) =>
          student.studentId === selectedStudentId,
      )
    ) {
      return;
    }

    setSelectedStudentId(
      classStudents[0]?.studentId || "",
    );
  }, [selectedClass, selectedStudentId]);

  useEffect(() => {
    setStudentSearch("");
  }, [selectedClassId]);

  if (!classes.length) {
    return (
      <Card className="rounded-3xl border border-slate-200 p-8 text-center">
        <p className="font-black text-slate-950">
          No classes available for reporting
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Create a class and enrol learners before generating
          class or student progress reports.
        </p>
      </Card>
    );
  }

  return (
    <section className="space-y-6">
      <Card className="overflow-hidden rounded-3xl border border-slate-200 p-0">
        <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-cyan-900 p-6 text-white">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
            Reporting workspace
          </p>

          <div className="mt-2 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h2 className="text-2xl font-black">
                Class and learner intelligence
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/70">
                Move between whole-class reporting and individual
                learner reports without leaving the Reports page.
                Both views use the same evidence-backed analytics
                and export pipeline.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white/10 p-1">
              <ModeButton
                active={mode === "class"}
                icon={<Users className="h-4 w-4" />}
                label="Class report"
                onClick={() => setMode("class")}
              />
              <ModeButton
                active={mode === "student"}
                icon={<GraduationCap className="h-4 w-4" />}
                label="Student report"
                onClick={() => setMode("student")}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 lg:grid-cols-2">
          <label>
            <span className="text-xs font-black uppercase tracking-wide text-slate-400">
              Class
            </span>

            <select
              value={selectedClassId}
              onChange={(event) =>
                setSelectedClassId(event.target.value)
              }
              className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-4 font-bold text-slate-900 outline-none focus:border-teal-400"
            >
              {classes.map((classItem) => (
                <option
                  key={classItem.classId}
                  value={classItem.classId}
                >
                  {classItem.className}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <WorkspaceMetric
              label="Students"
              value={selectedClass?.studentCount ?? 0}
            />
            <WorkspaceMetric
              label="With evidence"
              value={selectedClass?.studentsWithEvidence ?? 0}
            />
          </div>
        </div>

        {mode === "student" && (
          <div className="border-t border-slate-100 p-6">
            <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
              <label>
                <span className="text-xs font-black uppercase tracking-wide text-slate-400">
                  Search learners
                </span>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={studentSearch}
                    onChange={(event) =>
                      setStudentSearch(event.target.value)
                    }
                    placeholder="Search name, email, working grade or target"
                    className="min-h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-violet-400"
                  />
                </div>
              </label>

              <label>
                <span className="text-xs font-black uppercase tracking-wide text-slate-400">
                  Learner
                </span>

                <select
                  value={
                    students.some(
                      (student) =>
                        student.studentId === selectedStudentId,
                    )
                      ? selectedStudentId
                      : ""
                  }
                  onChange={(event) =>
                    setSelectedStudentId(event.target.value)
                  }
                  className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-4 font-bold text-slate-900 outline-none focus:border-violet-400"
                >
                  {students.length === 0 ? (
                    <option value="">
                      No matching learners
                    </option>
                  ) : (
                    students.map((student) => (
                      <option
                        key={student.studentId}
                        value={student.studentId}
                      >
                        {student.studentName}
                        {student.workingGrade
                          ? ` · Working ${student.workingGrade}`
                          : ""}
                        {student.targetGrade
                          ? ` · Target ${student.targetGrade}`
                          : ""}
                      </option>
                    ))
                  )}
                </select>
              </label>
            </div>

            <div className="mt-4 rounded-2xl bg-violet-50 p-4 text-sm text-violet-950">
              <span className="font-black">
                Student report mode:
              </span>{" "}
              choose a learner to open their evidence sources,
              working/target grade, curriculum mastery, recent
              assessment evidence, intervention history and next
              steps.
            </div>
          </div>
        )}
      </Card>

      {mode === "class" ? (
        selectedClassId ? (
          <ClassProgressReportPanel
            teacherId={teacherId}
            classId={selectedClassId}
          />
        ) : null
      ) : selectedStudentId ? (
        <StudentProgressReportPanel
          teacherId={teacherId}
          studentId={selectedStudentId}
        />
      ) : (
        <Card className="rounded-3xl border border-slate-200 p-8 text-center">
          <GraduationCap className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 font-black text-slate-950">
            Select a learner
          </p>
          <p className="mt-2 text-sm text-slate-500">
            A learner must be selected before an individual
            progress report can be generated.
          </p>
        </Card>
      )}

      <Card className="rounded-3xl border border-cyan-100 bg-cyan-50">
        <div className="flex items-start gap-3">
          <BarChart3 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-700" />
          <div>
            <p className="font-black text-cyan-950">
              One reporting source of truth
            </p>
            <p className="mt-1 text-sm leading-6 text-cyan-900">
              Class and student reports are generated from the
              Teacher Analytics portfolio. Written-assessment QLA,
              evidence confidence, grade intelligence and
              intervention history remain supporting evidence rather
              than separate competing progress measures.
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}

function ModeButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-xs font-black transition ${
        active
          ? "bg-white text-slate-950 shadow"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function WorkspaceMetric({
  label,
  value,
}: {
  label: string;
  value: number;
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
