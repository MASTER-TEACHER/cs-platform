"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ClassStudentsManager from "@/components/teacher/classes/ClassStudentsManager";
import ClassSettingsPanel from "@/components/teacher/classes/ClassSettingsPanel";
import { useAuth } from "@/contexts/AuthContext";
import {
  ClassStudent,
  getTeacherClassById,
  TeacherClass,
} from "@/services/classService";
import {
  getUnifiedTeacherAssignments,
  type UnifiedTeacherAssignment,
} from "@/services/unifiedTeacherAssignmentService";

type ClassTab = "overview" | "students" | "assignments" | "analytics" | "settings";

function formatDate(date: Date | null): string {
  if (!date) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}


function qualificationLabel(value: string): string {
  if (value === "A_LEVEL") {
    return "A Level";
  }

  return value || "Not set";
}

function getDueDateStatus(dueDate: Date | null): {
  label: string;
  className: string;
} {
  if (!dueDate) {
    return {
      label: "No due date",
      className: "bg-slate-100 text-slate-700",
    };
  }

  const today = new Date();
  const due = new Date(dueDate);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const differenceInMilliseconds = due.getTime() - today.getTime();

  const differenceInDays = Math.ceil(
    differenceInMilliseconds / (1000 * 60 * 60 * 24),
  );

  if (differenceInDays < 0) {
    return {
      label: "Overdue",
      className: "bg-red-100 text-red-700",
    };
  }

  if (differenceInDays === 0) {
    return {
      label: "Due today",
      className: "bg-amber-100 text-amber-700",
    };
  }

  if (differenceInDays === 1) {
    return {
      label: "Due tomorrow",
      className: "bg-amber-100 text-amber-700",
    };
  }

  return {
    label: `Due in ${differenceInDays} days`,
    className: "bg-blue-100 text-blue-700",
  };
}

function calculateCompletionPercentage(
  assignment: UnifiedTeacherAssignment,
): number {
  return assignment.completionPercentage;
}

export default function ClassDetailsPage() {
  const params = useParams<{
    classId: string;
  }>();

  const router = useRouter();
  const { user } = useAuth();

  const classId = params.classId;

  const [teacherClass, setTeacherClass] = useState<TeacherClass | null>(null);

  const [assignments, setAssignments] = useState<UnifiedTeacherAssignment[]>([]);

  const [activeTab, setActiveTab] = useState<ClassTab>("overview");

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadClassDetails() {
      if (!user?.uid || !classId) {
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const classRecord = await getTeacherClassById(classId);

        if (!classRecord) {
          setError("This class could not be found.");
          return;
        }

        if (classRecord.teacherId !== user.uid) {
          setError("You do not have permission to view this class.");
          return;
        }

        const assignmentSummary =
          await getUnifiedTeacherAssignments(user.uid);

        const matchingAssignments =
          assignmentSummary.assignments.filter(
            (assignment) => assignment.classId === classId,
          );

        setTeacherClass(classRecord);
        setAssignments(matchingAssignments);
      } catch (loadError: unknown) {
        const firebaseCode =
          typeof loadError === "object" &&
          loadError !== null &&
          "code" in loadError &&
          typeof (loadError as { code?: unknown }).code === "string"
            ? (loadError as { code: string }).code
            : "";

        if (
          firebaseCode === "permission-denied" ||
          firebaseCode === "firestore/permission-denied"
        ) {
          setError("You do not have permission to view this class.");
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load this class.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadClassDetails();
  }, [classId, user?.uid]);

  const students = useMemo<ClassStudent[]>(() => {
    return teacherClass?.students ?? [];
  }, [teacherClass]);

  const activeAssignments = useMemo(() => {
    return assignments.filter((assignment) => assignment.status === "active");
  }, [assignments]);

  const totalCompletions = useMemo(() => {
    return assignments.reduce(
      (total, assignment) => total + assignment.completedCount,
      0,
    );
  }, [assignments]);

  const totalPossibleCompletions = useMemo(() => {
    return assignments.reduce(
      (total, assignment) => total + assignment.studentCount,
      0,
    );
  }, [assignments]);

  const overallCompletionPercentage =
    totalPossibleCompletions > 0
      ? Math.round((totalCompletions / totalPossibleCompletions) * 100)
      : 0;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 lg:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded bg-slate-200" />

            <div className="h-48 rounded-3xl bg-slate-200" />

            <div className="grid gap-4 md:grid-cols-4">
              {Array.from({
                length: 4,
              }).map((_, index) => (
                <div key={index} className="h-32 rounded-2xl bg-slate-200" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !teacherClass) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 lg:p-10">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() => router.push("/teacher/classes")}
            className="mb-6 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to classes
          </button>

          <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">
              Class unavailable
            </h1>

            <p className="mt-3 text-slate-600">
              {error || "This class could not be loaded."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const tabs: {
    id: ClassTab;
    label: string;
  }[] = [
    {
      id: "overview",
      label: "Overview",
    },
    {
      id: "students",
      label: `Students (${students.length})`,
    },
    {
      id: "assignments",
      label: `Assignments (${assignments.length})`,
    },
    {
      id: "analytics",
      label: "Analytics",
    },
    {
      id: "settings",
      label: "Settings",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <button
          type="button"
          onClick={() => router.push("/teacher/classes")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          <span aria-hidden="true">←</span>
          Back to classes
        </button>

        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-7 text-white shadow-lg lg:p-10">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  {teacherClass.status}
                </span>

                {teacherClass.yearGroup && (
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                    {teacherClass.yearGroup}
                  </span>
                )}

                {teacherClass.academicYear && (
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                    {teacherClass.academicYear}
                  </span>
                )}


                {(teacherClass.examBoard || teacherClass.qualification) && (
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                    {teacherClass.examBoard || "Board"}{" "}
                    {qualificationLabel(teacherClass.qualification)}
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold tracking-tight lg:text-5xl">
                {teacherClass.name}
              </h1>

              <p className="mt-3 text-base text-blue-100 lg:text-lg">
                {teacherClass.subject || "Computer Science"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("students")}
                className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Manage students
              </button>

              <button
                type="button"
                onClick={() => router.push("/teacher/resources")}
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-blue-50"
              >
                Assign resource
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Students"
            value={students.length}
            description="Currently enrolled"
          />

          <StatCard
            label="Assignments"
            value={assignments.length}
            description={`${activeAssignments.length} active`}
          />

          <StatCard
            label="Completed"
            value={totalCompletions}
            description="Student completions"
          />

          <StatCard
            label="Completion rate"
            value={`${overallCompletionPercentage}%`}
            description="Across all assignments"
          />
        </section>

        <section className="mt-8">
          <div className="overflow-x-auto border-b border-slate-200">
            <div className="flex min-w-max gap-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-6">
            {activeTab === "overview" && (
              <OverviewTab
                teacherClass={teacherClass}
                assignments={assignments}
                students={students}
                onOpenStudents={() => setActiveTab("students")}
                onOpenAssignments={() => setActiveTab("assignments")}
              />
            )}

            {activeTab === "students" && (
              <ClassStudentsManager
                classId={teacherClass.id}
                students={students}
                onStudentsChanged={(updatedStudents) => {
                  setTeacherClass((currentClass) => {
                    if (!currentClass) {
                      return currentClass;
                    }

                    return {
                      ...currentClass,
                      students: updatedStudents,
                      studentIds: updatedStudents.map(
                        (student) => student.studentId,
                      ),
                    };
                  });
                }}
              />
            )}

            {activeTab === "assignments" && (
              <AssignmentsTab
                assignments={assignments}
                onAssignResource={() => router.push("/teacher/resources")}
              />
            )}

            {activeTab === "analytics" && (
              <AnalyticsTab
                assignments={assignments}
                overallCompletionPercentage={overallCompletionPercentage}
                totalCompletions={totalCompletions}
                totalPossibleCompletions={totalPossibleCompletions}
              />
            )}


            {activeTab === "settings" && (
              <ClassSettingsPanel
                teacherClass={teacherClass}
                onUpdated={(updatedClass) => {
                  setTeacherClass(updatedClass);
                }}
                onDeleted={() => {
                  router.push("/teacher/classes");
                }}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>

      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>

      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function OverviewTab({
  teacherClass,
  assignments,
  students,
  onOpenStudents,
  onOpenAssignments,
}: {
  teacherClass: TeacherClass;
  assignments: UnifiedTeacherAssignment[];
  students: ClassStudent[];
  onOpenStudents: () => void;
  onOpenAssignments: () => void;
}) {
  const recentAssignments = assignments.slice(0, 3);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Recent assignments
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                The latest work assigned to this class.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenAssignments}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all
            </button>
          </div>

          {recentAssignments.length === 0 ? (
            <EmptyState
              title="No assignments yet"
              description="Recent resources, programming work, quizzes and exams assigned to this class will appear here."
            />
          ) : (
            <div className="mt-5 space-y-3">
              {recentAssignments.map((assignment) => (
                <AssignmentSummaryCard
                  key={assignment.id}
                  assignment={assignment}
                />
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Students</h2>

              <p className="mt-1 text-sm text-slate-500">
                Learners currently linked to this class.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenStudents}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Manage
            </button>
          </div>

          {students.length === 0 ? (
            <EmptyState
              title="No students enrolled"
              description="Add students to begin assigning resources and tracking progress."
            />
          ) : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {students.slice(0, 6).map((student) => (
                <StudentCard key={student.studentId} student={student} />
              ))}
            </div>
          )}
        </section>
      </div>

      <aside className="space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Class information
          </h2>

          <dl className="mt-5 space-y-4">
            <InformationRow label="Class name" value={teacherClass.name} />

            <InformationRow
              label="Subject"
              value={teacherClass.subject || "Computer Science"}
            />

            <InformationRow
              label="Year group"
              value={teacherClass.yearGroup || "Not specified"}
            />

            <InformationRow
              label="Academic year"
              value={teacherClass.academicYear || "Not specified"}
            />

            <InformationRow
              label="Qualification"
              value={qualificationLabel(teacherClass.qualification)}
            />

            <InformationRow
              label="Exam board"
              value={teacherClass.examBoard || "Not specified"}
            />

            <InformationRow
              label="Created"
              value={formatDate(teacherClass.createdAt)}
            />

            <InformationRow label="Status" value={teacherClass.status} />
          </dl>
        </section>

        <section className="rounded-3xl border border-blue-200 bg-blue-50 p-6">
          <h2 className="text-lg font-bold text-blue-950">Next step</h2>

          <p className="mt-2 text-sm leading-6 text-blue-800">
            Add students, publish a teaching resource and assign it to this
            class.
          </p>
        </section>
      </aside>
    </div>
  );
}

function StudentsTab({ students }: { students: ClassStudent[] }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Class students</h2>

          <p className="mt-1 text-sm text-slate-500">
            {students.length} student
            {students.length === 1 ? "" : "s"} currently enrolled.
          </p>
        </div>

        <button
          type="button"
          disabled
          title="Student enrolment controls will be added in the next stage."
          className="cursor-not-allowed rounded-xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-500"
        >
          + Add student
        </button>
      </div>

      {students.length === 0 ? (
        <EmptyState
          title="No students enrolled"
          description="The next stage will add student search, enrolment and removal controls."
        />
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <div className="hidden grid-cols-[1fr_1.2fr_auto] gap-4 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid">
            <span>Student</span>
            <span>Email</span>
            <span>Status</span>
          </div>

          <div className="divide-y divide-slate-200">
            {students.map((student) => (
              <div
                key={student.studentId}
                className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_1.2fr_auto] sm:items-center"
              >
                <div className="flex items-center gap-3">
                  <StudentAvatar name={student.displayName} />

                  <p className="font-semibold text-slate-900">
                    {student.displayName || "Student"}
                  </p>
                </div>

                <p className="text-sm text-slate-600">
                  {student.email || "No email"}
                </p>

                <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Enrolled
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function AssignmentsTab({
  assignments,
  onAssignResource,
}: {
  assignments: UnifiedTeacherAssignment[];
  onAssignResource: () => void;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Class assignments
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            All resource, programming, quiz and exam assignments for this class.
          </p>
        </div>

        <button
          type="button"
          onClick={onAssignResource}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Assign resource
        </button>
      </div>

      {assignments.length === 0 ? (
        <EmptyState
          title="No assignments yet"
          description="Open a published resource to assign it to this class."
        />
      ) : (
        <div className="mt-6 space-y-4">
          {assignments.map((assignment) => (
            <AssignmentDetailedCard
              key={assignment.id}
              assignment={assignment}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function AnalyticsTab({
  assignments,
  overallCompletionPercentage,
  totalCompletions,
  totalPossibleCompletions,
}: {
  assignments: UnifiedTeacherAssignment[];
  overallCompletionPercentage: number;
  totalCompletions: number;
  totalPossibleCompletions: number;
}) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Overall completion"
          value={`${overallCompletionPercentage}%`}
          description="Across every assignment"
        />

        <StatCard
          label="Student completions"
          value={totalCompletions}
          description={`Out of ${totalPossibleCompletions} expected`}
        />

        <StatCard
          label="Resources assigned"
          value={assignments.length}
          description="Total class assignments"
        />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Assignment performance
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Completion rates across lessons/resources, programming, quizzes and exams assigned to this class.
        </p>

        {assignments.length === 0 ? (
          <EmptyState
            title="No analytics available"
            description="Analytics will appear after assignments have been created for this class."
          />
        ) : (
          <div className="mt-6 space-y-5">
            {assignments.map((assignment) => {
              const percentage = calculateCompletionPercentage(assignment);

              return (
                <div key={assignment.id}>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {assignment.title}
                      </p>

                      <p className="text-sm text-slate-500">
                        {assignment.completedCount} of {assignment.studentCount}{" "}
                        completed
                      </p>
                    </div>

                    <span className="text-sm font-bold text-slate-800">
                      {percentage}%
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 transition-all"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function AssignmentSummaryCard({
  assignment,
}: {
  assignment: UnifiedTeacherAssignment;
}) {
  const dueDateStatus = getDueDateStatus(assignment.dueDate);

  const completionPercentage = calculateCompletionPercentage(assignment);

  return (
    <article className="rounded-2xl border border-slate-200 p-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <h3 className="font-semibold text-slate-900">
            {assignment.title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {assignment.topic ||
              assignment.kind ||
              "Teaching resource"}
          </p>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${dueDateStatus.className}`}
        >
          {dueDateStatus.label}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-slate-500">
          {assignment.completedCount} of {assignment.studentCount} completed
        </span>

        <span className="font-semibold text-slate-800">
          {completionPercentage}%
        </span>
      </div>
    </article>
  );
}

function AssignmentDetailedCard({
  assignment,
}: {
  assignment: UnifiedTeacherAssignment;
}) {
  const dueDateStatus = getDueDateStatus(assignment.dueDate);

  const completionPercentage = calculateCompletionPercentage(assignment);

  return (
    <article className="rounded-2xl border border-slate-200 p-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">
              {assignment.title}
            </h3>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
              {assignment.status}
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            {assignment.topic ||
              assignment.kind ||
              "Teaching resource"}
          </p>

          {assignment.description && (
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              {assignment.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${dueDateStatus.className}`}
          >
            {dueDateStatus.label}
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {formatDate(assignment.dueDate)}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-slate-500">
            {assignment.completedCount} of {assignment.studentCount} students
            completed
          </span>

          <span className="font-bold text-slate-800">
            {completionPercentage}%
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500"
            style={{
              width: `${completionPercentage}%`,
            }}
          />
        </div>
      </div>
    </article>
  );
}

function StudentCard({ student }: { student: ClassStudent }) {
  return (
    <article className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
      <StudentAvatar name={student.displayName} />

      <div className="min-w-0">
        <p className="truncate font-semibold text-slate-900">
          {student.displayName || "Student"}
        </p>

        <p className="truncate text-sm text-slate-500">
          {student.email || "No email"}
        </p>
      </div>
    </article>
  );
}

function StudentAvatar({ name }: { name: string }) {
  const initials =
    name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "S";

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
      {initials}
    </div>
  );
}

function InformationRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <dt className="text-sm text-slate-500">{label}</dt>

      <dd className="text-right text-sm font-semibold capitalize text-slate-900">
        {value}
      </dd>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
      <h3 className="font-semibold text-slate-900">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}
