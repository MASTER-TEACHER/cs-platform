"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  collection,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { createAssignment } from "@/services/assignmentService";

type ClassOption = {
  id: string;
  name: string;
  yearGroup: string;
};

type AssignmentRecord = {
  id: string;
  teacherId: string;
  classId: string;
  title: string;
  description: string;
  type: "lesson" | "quiz";
  resourceId: string;
  dueDate: string;
  status: string;
  createdAt?: Timestamp;
};

export default function TeacherAssignmentsPage() {
  const { user, loading: authLoading } = useAuth();

  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [assignments, setAssignments] = useState<AssignmentRecord[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classId, setClassId] = useState("");
  const [type, setType] = useState<"lesson" | "quiz">("lesson");
  const [resourceId, setResourceId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setClasses([]);
      setAssignments([]);
      setLoadingData(false);
      return;
    }

    const teacherId = user.uid;

    const classesQuery = query(
      collection(db, "classes"),
      where("teacherId", "==", teacherId)
    );

    const assignmentsQuery = query(
      collection(db, "assignments"),
      where("teacherId", "==", teacherId)
    );

    let classesLoaded = false;
    let assignmentsLoaded = false;

    function finishLoading() {
      if (classesLoaded && assignmentsLoaded) {
        setLoadingData(false);
      }
    }

    const unsubscribeClasses = onSnapshot(
      classesQuery,
      (snapshot) => {
        const loadedClasses: ClassOption[] = snapshot.docs.map(
          (classDocument) => {
            const data = classDocument.data();

            return {
              id: classDocument.id,
              name: data.name || "Untitled Class",
              yearGroup: data.yearGroup || "Not specified",
            };
          }
        );

        loadedClasses.sort((a, b) => a.name.localeCompare(b.name));

        setClasses(loadedClasses);

        classesLoaded = true;
        finishLoading();
      },
      (error) => {
        console.error("Failed to load classes:", error);
        toast.error("Could not load classes.");

        classesLoaded = true;
        finishLoading();
      }
    );

    const unsubscribeAssignments = onSnapshot(
      assignmentsQuery,
      (snapshot) => {
        const loadedAssignments: AssignmentRecord[] = snapshot.docs.map(
          (assignmentDocument) => {
            const data = assignmentDocument.data();

            return {
              id: assignmentDocument.id,
              teacherId: data.teacherId || "",
              classId: data.classId || "",
              title: data.title || "Untitled Assignment",
              description: data.description || "",
              type: data.type === "quiz" ? "quiz" : "lesson",
              resourceId: data.resourceId || "",
              dueDate: data.dueDate || "",
              status: data.status || "active",
              createdAt: data.createdAt,
            };
          }
        );

        loadedAssignments.sort((a, b) => {
          const aTime = a.createdAt?.toMillis() || 0;
          const bTime = b.createdAt?.toMillis() || 0;

          return bTime - aTime;
        });

        setAssignments(loadedAssignments);

        assignmentsLoaded = true;
        finishLoading();
      },
      (error) => {
        console.error("Failed to load assignments:", error);
        toast.error("Could not load assignments.");

        assignmentsLoaded = true;
        finishLoading();
      }
    );

    return () => {
      unsubscribeClasses();
      unsubscribeAssignments();
    };
  }, [authLoading, user]);

  const activeAssignments = useMemo(
    () =>
      assignments.filter(
        (assignment) => assignment.status === "active"
      ),
    [assignments]
  );

  function getClassName(selectedClassId: string) {
    const selectedClass = classes.find(
      (classItem) => classItem.id === selectedClassId
    );

    return selectedClass
      ? `${selectedClass.name} (${selectedClass.yearGroup})`
      : "Unknown class";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      toast.error("You must be logged in as a teacher.");
      return;
    }

    if (
      !title.trim() ||
      !description.trim() ||
      !classId ||
      !resourceId.trim() ||
      !dueDate
    ) {
      toast.error("Please complete every assignment field.");
      return;
    }

    setSubmitting(true);

    try {
      await createAssignment({
        teacherId: user.uid,
        classId,
        title: title.trim(),
        description: description.trim(),
        type,
        resourceId: resourceId.trim(),
        dueDate,
      });

      toast.success("Assignment created successfully.");

      setTitle("");
      setDescription("");
      setClassId("");
      setType("lesson");
      setResourceId("");
      setDueDate("");
    } catch (error) {
      console.error("Create assignment error:", error);
      toast.error("Could not create the assignment.");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || loadingData) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-52 w-full" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-100">
              Teacher Portal
            </p>

            <h1 className="mt-3 text-4xl font-extrabold">
              Manage Assignments
            </h1>

            <p className="mt-3 max-w-2xl text-emerald-100">
              Assign lessons and quizzes to classes and track active work.
            </p>
          </div>

          <Link
            href="/teacher"
            className="rounded-xl bg-white px-5 py-3 text-center font-bold text-teal-700 transition hover:bg-emerald-50"
          >
            ← Teacher Dashboard
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SummaryCard
          label="Total Assignments"
          value={assignments.length.toString()}
          icon="📋"
        />

        <SummaryCard
          label="Active Assignments"
          value={activeAssignments.length.toString()}
          icon="✅"
        />

        <SummaryCard
          label="Classes"
          value={classes.length.toString()}
          icon="🏫"
        />
      </div>

      <Card>
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
          New Assignment
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Create Assignment
        </h2>

        {classes.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-amber-50 p-6">
            <p className="font-semibold text-amber-800">
              Create a class before assigning work.
            </p>

            <Link
              href="/teacher/classes"
              className="mt-4 inline-flex rounded-xl bg-amber-600 px-5 py-3 font-bold text-white transition hover:bg-amber-700"
            >
              Go to Classes
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Assignment title
              </span>

              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Example: Binary Conversion Practice"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Class
              </span>

              <select
                value={classId}
                onChange={(event) => setClassId(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                required
              >
                <option value="">Select a class</option>

                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name} — {classItem.yearGroup}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Assignment type
              </span>

              <select
                value={type}
                onChange={(event) =>
                  setType(event.target.value as "lesson" | "quiz")
                }
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              >
                <option value="lesson">Lesson</option>
                <option value="quiz">Quiz</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Resource ID
              </span>

              <input
                type="text"
                value={resourceId}
                onChange={(event) => setResourceId(event.target.value)}
                placeholder={
                  type === "lesson"
                    ? "Example: binary-conversion"
                    : "Example: binary"
                }
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Due date
              </span>

              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                required
              />
            </label>

            <label className="block md:col-span-2">
              <span className="text-sm font-semibold text-slate-700">
                Instructions
              </span>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Explain what students need to complete."
                rows={4}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                required
              />
            </label>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-teal-600 px-6 py-3 font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Creating Assignment..."
                  : "Create Assignment"}
              </button>
            </div>
          </form>
        )}
      </Card>

      <Card>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Assignment Directory
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Your Assignments
        </h2>

        {assignments.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-slate-50 p-10 text-center">
            <div className="text-5xl">📋</div>

            <h3 className="mt-4 text-2xl font-bold text-slate-900">
              No assignments created yet
            </h3>

            <p className="mt-2 text-slate-600">
              Use the form above to assign a lesson or quiz to a class.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                      {assignment.type}
                    </p>

                    <h3 className="mt-2 text-xl font-bold text-slate-900">
                      {assignment.title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-600">
                      {getClassName(assignment.classId)}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-sm font-semibold capitalize text-green-700">
                    {assignment.status}
                  </span>
                </div>

                <p className="mt-4 leading-6 text-slate-600">
                  {assignment.description}
                </p>

                <div className="mt-5 space-y-2 text-sm text-slate-600">
                  <p>
                    Resource:{" "}
                    <span className="font-bold text-slate-900">
                      {assignment.resourceId}
                    </span>
                  </p>

                  <p>
                    Due:{" "}
                    <span className="font-bold text-slate-900">
                      {assignment.dueDate || "No due date"}
                    </span>
                  </p>
                </div>

                <div className="mt-6">
                  <Link
                    href={`/teacher/assignments/${assignment.id}`}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-teal-600 px-5 py-3 font-bold text-white transition hover:bg-teal-700"
                  >
                    📊 View Results
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
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

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="text-3xl">{icon}</div>
      </div>
    </Card>
  );
}