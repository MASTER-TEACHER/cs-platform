"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  type Timestamp,
} from "firebase/firestore";
import toast from "react-hot-toast";

import { db } from "@/lib/firebase";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { addStudentToClass } from "@/services/classStudentService";

type ClassRecord = {
  id: string;
  teacherId: string;
  name: string;
  yearGroup: string;
  subject: string;
  studentIds: string[];
  assignmentIds: string[];
};

type StudentOption = {
  id: string;
  name: string;
  email: string;
  xp: number;
};

type AssignmentRecord = {
  id: string;
  title: string;
  description: string;
  type: "lesson" | "quiz";
  dueDate: string;
  status: string;
};

type AssignmentResult = {
  id: string;
  assignmentId: string;
  studentId: string;
  percentage: number;
  score: number;
  totalQuestions: number;
  earnedXP: number;
  status: string;
  completedAt?: Timestamp;
};

type StudentMarkbookRow = {
  student: StudentOption;
  results: Map<string, AssignmentResult>;
  completedCount: number;
  completionRate: number;
  averageScore: number;
};

function formatDueDate(dueDate: string) {
  if (!dueDate) {
    return "No due date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${dueDate}T00:00:00`));
}

function getScoreBadge(percentage: number) {
  if (percentage >= 70) {
    return "bg-green-100 text-green-700";
  }

  if (percentage >= 50) {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-red-100 text-red-700";
}

export default function TeacherClassPage() {
  const params = useParams<{ classId: string }>();
  const classId = params.classId;

  const [classRecord, setClassRecord] = useState<ClassRecord | null>(null);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [assignments, setAssignments] = useState<AssignmentRecord[]>([]);
  const [assignmentResults, setAssignmentResults] = useState<
    AssignmentResult[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [showStudentPicker, setShowStudentPicker] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [addingStudent, setAddingStudent] = useState(false);

  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true);
        setNotFound(false);

        const classRef = doc(db, "classes", classId);

        const [
          classSnapshot,
          usersSnapshot,
          assignmentsSnapshot,
          resultsSnapshot,
        ] = await Promise.all([
          getDoc(classRef),
          getDocs(collection(db, "users")),
          getDocs(
            query(
              collection(db, "assignments"),
              where("classId", "==", classId)
            )
          ),
          getDocs(
            query(
              collection(db, "assignmentResults"),
              where("classId", "==", classId)
            )
          ),
        ]);

        if (!classSnapshot.exists()) {
          setNotFound(true);
          return;
        }

        const classData = classSnapshot.data();

        const loadedClass: ClassRecord = {
          id: classSnapshot.id,
          teacherId: classData.teacherId || "",
          name: classData.name || "Untitled Class",
          yearGroup: classData.yearGroup || "Not specified",
          subject: classData.subject || "Computer Science",
          studentIds: Array.isArray(classData.studentIds)
            ? classData.studentIds
            : [],
          assignmentIds: Array.isArray(classData.assignmentIds)
            ? classData.assignmentIds
            : [],
        };

        const loadedStudents: StudentOption[] = usersSnapshot.docs
  .map((userDocument) => {
    const data = userDocument.data();

    return {
      id: userDocument.id,
      name: data.name || "Student",
      email: data.email || "No email available",
      xp: typeof data.xp === "number" ? data.xp : 0,
      role: data.role,
    };
  })
  .filter((user) => user.role === "student")
  .map(({ role: _role, ...student }) => student)
  .sort((a, b) => a.name.localeCompare(b.name));

const loadedAssignments: AssignmentRecord[] =
  assignmentsSnapshot.docs
    .map<AssignmentRecord>((assignmentDocument) => {
      const data = assignmentDocument.data();

      return {
        id: assignmentDocument.id,
        title: data.title || "Untitled Assignment",
        description: data.description || "",
        type: data.type === "quiz" ? "quiz" : "lesson",
        dueDate: data.dueDate || "",
        status: data.status || "active",
      };
    })
    .sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      return a.dueDate.localeCompare(b.dueDate);
    });

const loadedResults: AssignmentResult[] =
  resultsSnapshot.docs.map((resultDocument) => {
    const data = resultDocument.data();

    return {
      id: resultDocument.id,
      assignmentId: data.assignmentId || "",
      studentId: data.studentId || "",
      percentage:
        typeof data.percentage === "number"
          ? data.percentage
          : 0,
      score:
        typeof data.score === "number"
          ? data.score
          : 0,
      totalQuestions:
        typeof data.totalQuestions === "number"
          ? data.totalQuestions
          : 0,
      earnedXP:
        typeof data.earnedXP === "number"
          ? data.earnedXP
          : 0,
      status: data.status || "completed",
      completedAt: data.completedAt,
    };
  });

        setClassRecord({
          ...loadedClass,
          assignmentIds: loadedAssignments.map(
            (assignment) => assignment.id
          ),
        });

        setStudents(loadedStudents);
        setAssignments(loadedAssignments);
        setAssignmentResults(loadedResults);
      } catch (error) {
        console.error("Failed to load class:", error);
        toast.error("Could not load the class markbook.");
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    if (classId) {
      void loadPage();
    }
  }, [classId]);

  const availableStudents = useMemo(() => {
    if (!classRecord) {
      return [];
    }

    return students.filter(
      (student) => !classRecord.studentIds.includes(student.id)
    );
  }, [classRecord, students]);

  const classStudents = useMemo(() => {
    if (!classRecord) {
      return [];
    }

    return students.filter((student) =>
      classRecord.studentIds.includes(student.id)
    );
  }, [classRecord, students]);

  const resultLookup = useMemo(() => {
    const lookup = new Map<string, AssignmentResult>();

    assignmentResults.forEach((result) => {
      lookup.set(
        `${result.studentId}_${result.assignmentId}`,
        result
      );
    });

    return lookup;
  }, [assignmentResults]);

  const markbookRows = useMemo<StudentMarkbookRow[]>(() => {
    return classStudents.map((student) => {
      const results = new Map<string, AssignmentResult>();

      assignments.forEach((assignment) => {
        const result = resultLookup.get(
          `${student.id}_${assignment.id}`
        );

        if (result) {
          results.set(assignment.id, result);
        }
      });

      const completedResults = Array.from(results.values());
      const completedCount = completedResults.length;

      const completionRate =
        assignments.length > 0
          ? Math.round(
              (completedCount / assignments.length) * 100
            )
          : 0;

      const averageScore =
        completedResults.length > 0
          ? Math.round(
              completedResults.reduce(
                (total, result) =>
                  total + result.percentage,
                0
              ) / completedResults.length
            )
          : 0;

      return {
        student,
        results,
        completedCount,
        completionRate,
        averageScore,
      };
    });
  }, [classStudents, assignments, resultLookup]);

  const classAverage = useMemo(() => {
    const completedResults = assignmentResults.filter(
      (result) =>
        classRecord?.studentIds.includes(result.studentId) &&
        assignments.some(
          (assignment) =>
            assignment.id === result.assignmentId
        )
    );

    if (completedResults.length === 0) {
      return 0;
    }

    return Math.round(
      completedResults.reduce(
        (total, result) => total + result.percentage,
        0
      ) / completedResults.length
    );
  }, [assignmentResults, assignments, classRecord]);

  const overallCompletionRate = useMemo(() => {
    const expectedSubmissions =
      classStudents.length * assignments.length;

    if (expectedSubmissions === 0) {
      return 0;
    }

    const completedSubmissions = markbookRows.reduce(
      (total, row) => total + row.completedCount,
      0
    );

    return Math.round(
      (completedSubmissions / expectedSubmissions) * 100
    );
  }, [classStudents, assignments, markbookRows]);

  const missingWorkCount = useMemo(() => {
    return markbookRows.reduce(
      (total, row) =>
        total + (assignments.length - row.completedCount),
      0
    );
  }, [markbookRows, assignments]);

  async function handleAddStudent() {
    if (!classRecord) {
      return;
    }

    if (!selectedStudentId) {
      toast.error("Please select a student.");
      return;
    }

    setAddingStudent(true);

    try {
      await addStudentToClass(
        classRecord.id,
        selectedStudentId
      );

      setClassRecord((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          studentIds: [
            ...current.studentIds,
            selectedStudentId,
          ],
        };
      });

      setSelectedStudentId("");
      setShowStudentPicker(false);
      toast.success("Student added to class.");
    } catch (error) {
      console.error("Add student error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not add the student."
      );
    } finally {
      setAddingStudent(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-52 w-full" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>

        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (notFound || !classRecord) {
    return (
      <Card>
        <h1 className="text-2xl font-bold text-slate-900">
          Class not found
        </h1>

        <p className="mt-3 text-slate-600">
          This class does not exist or could not be loaded.
        </p>

        <Link
          href="/teacher/classes"
          className="mt-6 inline-flex rounded-xl bg-teal-600 px-5 py-3 font-bold text-white transition hover:bg-teal-700"
        >
          ← Back to classes
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-100">
              {classRecord.yearGroup}
            </p>

            <h1 className="mt-3 text-4xl font-extrabold">
              {classRecord.name}
            </h1>

            <p className="mt-3 text-emerald-100">
              {classRecord.subject}
            </p>
          </div>

          <Link
            href="/teacher/classes"
            className="rounded-xl bg-white px-5 py-3 text-center font-bold text-teal-700 transition hover:bg-emerald-50"
          >
            ← All Classes
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Students"
          value={classStudents.length.toString()}
          icon="👨‍🎓"
        />

        <SummaryCard
          label="Assignments"
          value={assignments.length.toString()}
          icon="📋"
        />

        <SummaryCard
          label="Class Average"
          value={`${classAverage}%`}
          icon="📊"
        />

        <SummaryCard
          label="Completion Rate"
          value={`${overallCompletionRate}%`}
          icon="✅"
        />
      </div>

      {showStudentPicker && (
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
                Class Members
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Add a Student
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowStudentPicker(false)}
              className="rounded-lg px-3 py-2 font-bold text-slate-500 transition hover:bg-slate-100"
            >
              ✕
            </button>
          </div>

          {availableStudents.length === 0 ? (
            <p className="mt-6 text-slate-600">
              Every available student is already in this class.
            </p>
          ) : (
            <div className="mt-6">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Select student
                </span>

                <select
                  value={selectedStudentId}
                  onChange={(event) =>
                    setSelectedStudentId(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                >
                  <option value="">Choose a student</option>

                  {availableStudents.map((student) => (
                    <option
                      key={student.id}
                      value={student.id}
                    >
                      {student.name} — {student.email}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleAddStudent}
                  disabled={addingStudent}
                  className="rounded-xl bg-teal-600 px-6 py-3 font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {addingStudent
                    ? "Adding Student..."
                    : "Add Student"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowStudentPicker(false)
                  }
                  className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
                Class Members
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Students
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowStudentPicker(true)}
              className="rounded-xl bg-teal-600 px-5 py-3 font-bold text-white transition hover:bg-teal-700"
            >
              + Add Student
            </button>
          </div>

          {classStudents.length === 0 ? (
            <EmptyState
              icon="👨‍🎓"
              title="No students added"
              text="Add students to begin tracking class progress."
            />
          ) : (
            <div className="mt-6 space-y-3">
              {markbookRows.map((row) => (
                <Link
                  key={row.student.id}
                  href={`/teacher/students/${row.student.id}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-teal-300 hover:bg-teal-50"
                >
                  <div>
                    <p className="font-bold text-slate-900">
                      {row.student.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {row.student.email}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-slate-900">
                      {row.averageScore}%
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {row.completedCount}/{assignments.length} completed
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Assigned Work
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Assignments
          </h2>

          {assignments.length === 0 ? (
            <EmptyState
              icon="📋"
              title="No assignments yet"
              text="Create an assignment for this class."
            />
          ) : (
            <div className="mt-6 space-y-4">
              {assignments.map((assignment) => {
                const completedCount = markbookRows.filter(
                  (row) =>
                    row.results.has(assignment.id)
                ).length;

                return (
                  <div
                    key={assignment.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                          {assignment.type}
                        </p>

                        <h3 className="mt-2 font-bold text-slate-900">
                          {assignment.title}
                        </h3>

                        <p className="mt-2 text-sm text-slate-600">
                          Due: {formatDueDate(assignment.dueDate)}
                        </p>
                      </div>

                      <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                        {completedCount}/{classStudents.length} complete
                      </span>
                    </div>

                    <Link
                      href={`/teacher/assignments/${assignment.id}`}
                      className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                      View Results →
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Class Markbook
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Assignment Performance
            </h2>

            <p className="mt-2 text-slate-600">
              {missingWorkCount} outstanding submission
              {missingWorkCount === 1 ? "" : "s"} across this class.
            </p>
          </div>

          <Link
            href="/teacher/assignment-wizard"
            className="rounded-xl bg-indigo-600 px-5 py-3 text-center font-bold text-white transition hover:bg-indigo-700"
          >
            + New Assignment
          </Link>
        </div>

        {classStudents.length === 0 ||
        assignments.length === 0 ? (
          <EmptyState
            icon="📊"
            title="Markbook data unavailable"
            text="Add students and assignments to populate the class markbook."
          />
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="sticky left-0 z-10 bg-white px-4 py-3">
                    Student
                  </th>

                  {assignments.map((assignment) => (
                    <th
                      key={assignment.id}
                      className="min-w-40 px-4 py-3"
                    >
                      <Link
                        href={`/teacher/assignments/${assignment.id}`}
                        className="hover:text-indigo-600"
                      >
                        {assignment.title}
                      </Link>
                    </th>
                  ))}

                  <th className="px-4 py-3">Average</th>
                  <th className="px-4 py-3">Completion</th>
                </tr>
              </thead>

              <tbody>
                {markbookRows.map((row) => (
                  <tr
                    key={row.student.id}
                    className="bg-slate-50"
                  >
                    <td className="sticky left-0 z-10 rounded-l-2xl bg-slate-50 px-4 py-4">
                      <Link
                        href={`/teacher/students/${row.student.id}`}
                        className="font-bold text-slate-900 hover:text-teal-700"
                      >
                        {row.student.name}
                      </Link>

                      <p className="mt-1 text-xs text-slate-500">
                        {row.student.email}
                      </p>
                    </td>

                    {assignments.map((assignment) => {
                      const result = row.results.get(
                        assignment.id
                      );

                      return (
                        <td
                          key={`${row.student.id}-${assignment.id}`}
                          className="px-4 py-4"
                        >
                          {result ? (
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${getScoreBadge(
                                result.percentage
                              )}`}
                            >
                              {result.percentage}%
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                              Missing
                            </span>
                          )}
                        </td>
                      );
                    })}

                    <td className="px-4 py-4 font-bold text-slate-900">
                      {row.averageScore}%
                    </td>

                    <td className="rounded-r-2xl px-4 py-4">
                      <div className="min-w-28">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                          <span>
                            {row.completedCount}/{assignments.length}
                          </span>

                          <span>{row.completionRate}%</span>
                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-teal-600"
                            style={{
                              width: `${row.completionRate}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card>
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Teacher Actions
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Manage This Class
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <button
            type="button"
            onClick={() => setShowStudentPicker(true)}
            className="rounded-xl bg-teal-600 px-5 py-4 font-bold text-white transition hover:bg-teal-700"
          >
            Add Students
          </button>

          <Link
            href="/teacher/assignment-wizard"
            className="rounded-xl bg-blue-600 px-5 py-4 text-center font-bold text-white transition hover:bg-blue-700"
          >
            Create Assignment
          </Link>

          <Link
            href="/teacher/reports"
            className="rounded-xl border border-slate-300 px-5 py-4 text-center font-bold text-slate-700 transition hover:bg-slate-50"
          >
            View Reports
          </Link>
        </div>
      </Card>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            {label}
          </p>

          <p className="mt-2 break-words text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="text-3xl">{icon}</div>
      </div>
    </Card>
  );
}

function EmptyState({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="mt-6 rounded-2xl bg-slate-50 p-8 text-center">
      <div className="text-4xl">{icon}</div>

      <h3 className="mt-4 text-xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-slate-600">
        {text}
      </p>
    </div>
  );
}