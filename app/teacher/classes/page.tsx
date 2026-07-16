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
import { createClass } from "@/services/classService";

type ClassRecord = {
  id: string;
  teacherId: string;
  name: string;
  yearGroup: string;
  subject: string;
  studentIds: string[];
  assignmentIds: string[];
  createdAt?: Timestamp;
};

export default function TeacherClassesPage() {
  const { user, loading: authLoading } = useAuth();

  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [className, setClassName] = useState("");
  const [yearGroup, setYearGroup] = useState("");
  const [subject, setSubject] = useState("Computer Science");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setClasses([]);
      setLoadingClasses(false);
      return;
    }

    const classesQuery = query(
      collection(db, "classes"),
      where("teacherId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      classesQuery,
      (snapshot) => {
        const loadedClasses: ClassRecord[] = snapshot.docs.map(
          (classDocument) => {
            const data = classDocument.data();

            return {
              id: classDocument.id,
              teacherId: data.teacherId || "",
              name: data.name || "Untitled Class",
              yearGroup: data.yearGroup || "Not specified",
              subject: data.subject || "Computer Science",
              studentIds: Array.isArray(data.studentIds)
                ? data.studentIds
                : [],
              assignmentIds: Array.isArray(data.assignmentIds)
                ? data.assignmentIds
                : [],
              createdAt: data.createdAt,
            };
          }
        );

        loadedClasses.sort((a, b) => {
          const aTime = a.createdAt?.toMillis() || 0;
          const bTime = b.createdAt?.toMillis() || 0;

          return bTime - aTime;
        });

        setClasses(loadedClasses);
        setLoadingClasses(false);
      },
      (error) => {
        console.error("Failed to load classes:", error);
        toast.error("Could not load your classes.");
        setLoadingClasses(false);
      }
    );

    return unsubscribe;
  }, [authLoading, user]);

  const totalStudents = useMemo(
    () =>
      classes.reduce(
        (total, classItem) => total + classItem.studentIds.length,
        0
      ),
    [classes]
  );

  const totalAssignments = useMemo(
    () =>
      classes.reduce(
        (total, classItem) => total + classItem.assignmentIds.length,
        0
      ),
    [classes]
  );

  async function handleCreateClass(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      toast.error("You must be logged in as a teacher.");
      return;
    }

    if (!className.trim() || !yearGroup.trim() || !subject.trim()) {
      toast.error("Please complete every class field.");
      return;
    }

    setSubmitting(true);

    try {
      await createClass({
        teacherId: user.uid,
        name: className.trim(),
        yearGroup: yearGroup.trim(),
        subject: subject.trim(),
      });

      toast.success("Class created successfully.");

      setClassName("");
      setYearGroup("");
      setSubject("Computer Science");
      setShowForm(false);
    } catch (error) {
      console.error("Create class error:", error);
      toast.error("Could not create the class.");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || loadingClasses) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-52 w-full" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>

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
              Manage Classes
            </h1>

            <p className="mt-3 max-w-2xl text-emerald-100">
              Create teaching groups, organise students and prepare class
              assignments.
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
          label="Total Classes"
          value={classes.length.toString()}
          icon="🏫"
        />

        <SummaryCard
          label="Total Students"
          value={totalStudents.toString()}
          icon="👨‍🎓"
        />

        <SummaryCard
          label="Active Assignments"
          value={totalAssignments.toString()}
          icon="📋"
        />
      </div>

      {showForm && (
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
                New Teaching Group
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Create a Class
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg px-3 py-2 font-bold text-slate-500 transition hover:bg-slate-100"
            >
              ✕
            </button>
          </div>

          <form
            onSubmit={handleCreateClass}
            className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Class name
              </span>

              <input
                type="text"
                value={className}
                onChange={(event) => setClassName(event.target.value)}
                placeholder="Example: Year 10 Set 1"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Year group
              </span>

              <select
                value={yearGroup}
                onChange={(event) => setYearGroup(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                required
              >
                <option value="">Select year group</option>
                <option value="Year 7">Year 7</option>
                <option value="Year 8">Year 8</option>
                <option value="Year 9">Year 9</option>
                <option value="Year 10">Year 10</option>
                <option value="Year 11">Year 11</option>
                <option value="Year 12">Year 12</option>
                <option value="Year 13">Year 13</option>
              </select>
            </label>

            <label className="block md:col-span-2">
              <span className="text-sm font-semibold text-slate-700">
                Subject
              </span>

              <input
                type="text"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                required
              />
            </label>

            <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-teal-600 px-6 py-3 font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Creating Class..." : "Create Class"}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
              Class Directory
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Your Classes
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setShowForm((current) => !current)}
            className="rounded-xl bg-teal-600 px-5 py-3 font-bold text-white transition hover:bg-teal-700"
          >
            {showForm ? "Close Form" : "+ Create Class"}
          </button>
        </div>

        {classes.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-slate-50 p-10 text-center">
            <div className="text-5xl">🏫</div>

            <h3 className="mt-4 text-2xl font-bold text-slate-900">
              No classes created yet
            </h3>

            <p className="mt-2 text-slate-600">
              Create your first class to begin organising students and
              assignments.
            </p>

            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-6 rounded-xl bg-teal-600 px-6 py-3 font-bold text-white transition hover:bg-teal-700"
            >
              Create First Class
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {classes.map((classItem) => (
              <div
                key={classItem.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
                  {classItem.yearGroup}
                </p>

                <h3 className="mt-2 text-xl font-bold text-slate-900">
                  {classItem.name}
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  {classItem.subject}
                </p>

                <div className="mt-5 space-y-3 text-sm text-slate-600">
                  <p>
                    👨‍🎓 Students:{" "}
                    <span className="font-bold text-slate-900">
                      {classItem.studentIds.length}
                    </span>
                  </p>

                  <p>
                    📋 Assignments:{" "}
                    <span className="font-bold text-slate-900">
                      {classItem.assignmentIds.length}
                    </span>
                  </p>
                </div>

                <Link
                  href={`/teacher/classes/${classItem.id}`}
                  className="mt-6 block w-full rounded-xl bg-white px-4 py-3 text-center font-bold text-teal-700 shadow-sm transition hover:bg-teal-50"
                >
                  View Class
                </Link>
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
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>

        <div className="text-3xl">{icon}</div>
      </div>
    </Card>
  );
}