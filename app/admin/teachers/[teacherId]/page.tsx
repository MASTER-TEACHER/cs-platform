"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { db } from "@/lib/firebase";
import { useUserProfile } from "@/hooks/useUserProfile";

type TeacherRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  schoolName: string;
  status: "active" | "suspended";
  createdAt?: Timestamp;
  teacherApprovedAt?: Timestamp;
};

type ClassRecord = {
  id: string;
  name: string;
  yearGroup: string;
  subject: string;
  studentIds: string[];
};

type AssignmentRecord = {
  id: string;
  title: string;
  classId: string;
  type: "lesson" | "quiz";
  status: string;
};

function formatDate(timestamp?: Timestamp) {
  if (!timestamp) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(timestamp.toDate());
}

export default function AdminTeacherDetailsPage() {
  const params = useParams<{ teacherId: string }>();
  const teacherId = params.teacherId;

  const { user } = useAuth();

const { profile, loading: profileLoading } =
  useUserProfile();

  const [teacher, setTeacher] = useState<TeacherRecord | null>(null);
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [assignments, setAssignments] = useState<AssignmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
const [notFound, setNotFound] = useState(false);

const [processing, setProcessing] = useState(false);

  const isAdmin = profile?.role === "admin";

  useEffect(() => {
    if (profileLoading) {
      return;
    }

    if (!isAdmin) {
      setLoading(false);
      return;
    }

    async function loadTeacher() {
      try {
        setLoading(true);
        setNotFound(false);

        const teacherSnapshot = await getDoc(
          doc(db, "users", teacherId)
        );

        if (!teacherSnapshot.exists()) {
          setNotFound(true);
          return;
        }

        const teacherData = teacherSnapshot.data();

        if (
          teacherData.role !== "teacher" &&
          teacherData.role !== "admin"
        ) {
          setNotFound(true);
          return;
        }

        const [classesSnapshot, assignmentsSnapshot] =
          await Promise.all([
            getDocs(
              query(
                collection(db, "classes"),
                where("teacherId", "==", teacherId)
              )
            ),
            getDocs(
              query(
                collection(db, "assignments"),
                where("teacherId", "==", teacherId)
              )
            ),
          ]);

        const loadedTeacher: TeacherRecord = {
          id: teacherSnapshot.id,
          name: teacherData.name || "Unnamed Teacher",
          email: teacherData.email || "No email available",
          role: teacherData.role || "teacher",
          schoolName:
            teacherData.schoolName ||
            teacherData.school ||
            "School not assigned",
          status:
            teacherData.status === "suspended"
              ? "suspended"
              : "active",
          createdAt: teacherData.createdAt,
          teacherApprovedAt: teacherData.teacherApprovedAt,
        };

        const loadedClasses: ClassRecord[] =
          classesSnapshot.docs
            .map((classDocument) => {
              const data = classDocument.data();

              return {
                id: classDocument.id,
                name: data.name || "Untitled Class",
                yearGroup: data.yearGroup || "Not specified",
                subject: data.subject || "Computer Science",
                studentIds: Array.isArray(data.studentIds)
                  ? data.studentIds
                  : [],
              };
            })
            .sort((a, b) => a.name.localeCompare(b.name));

        const loadedAssignments: AssignmentRecord[] =
          assignmentsSnapshot.docs
            .map<AssignmentRecord>((assignmentDocument) => {
              const data = assignmentDocument.data();

              return {
                id: assignmentDocument.id,
                title: data.title || "Untitled Assignment",
                classId: data.classId || "",
                type:
                  data.type === "quiz"
                    ? "quiz"
                    : "lesson",
                status: data.status || "active",
              };
            })
            .sort((a, b) => a.title.localeCompare(b.title));

        setTeacher(loadedTeacher);
        setClasses(loadedClasses);
        setAssignments(loadedAssignments);
      } catch (error) {
        console.error("Failed to load teacher:", error);
        toast.error("Could not load the teacher account.");
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    void loadTeacher();
  }, [teacherId, profileLoading, isAdmin]);

  const totalStudents = useMemo(
    () =>
      new Set(
        classes.flatMap((classItem) => classItem.studentIds)
      ).size,
    [classes]
  );

  if (profileLoading || loading) {
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

  if (!isAdmin) {
    return (
      <Card>
        <div className="text-5xl">🔒</div>

        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Admin access required
        </h1>

        <p className="mt-3 text-slate-600">
          This page is restricted to CS Master administrators.
        </p>

        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
        >
          Return to dashboard
        </Link>
      </Card>
    );
  }

  if (notFound || !teacher) {
    return (
      <Card>
        <h1 className="text-2xl font-bold text-slate-900">
          Teacher not found
        </h1>

        <p className="mt-3 text-slate-600">
          This teacher account does not exist or could not be loaded.
        </p>

        <Link
          href="/admin/teachers"
          className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-700"
        >
          ← Back to teachers
        </Link>
      </Card>
    );
  }

  async function updateTeacherStatus(
  action: "suspend" | "restore"
) {
  if (!user || !teacher) {
    toast.error("Unable to update this teacher account.");
    return;
  }

  setProcessing(true);

  try {
    const adminIdToken = await user.getIdToken(true);

    const response = await fetch(
      `/api/admin/teachers/${teacher.id}/status`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          adminIdToken,
        }),
      }
    );

    const contentType =
      response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const responseText = await response.text();

      console.error(
        "Teacher status API returned non-JSON:",
        response.status,
        responseText
      );

      throw new Error(
        `The server returned an unexpected response (${response.status}). Check the API route and terminal.`
      );
    }

    const data = (await response.json()) as {
      success?: boolean;
      status?: "active" | "suspended";
      error?: string;
    };

    if (!response.ok) {
      throw new Error(
        data.error || "Unable to update the teacher account."
      );
    }

    setTeacher((current) =>
      current
        ? {
            ...current,
            status:
              data.status ??
              (action === "suspend"
                ? "suspended"
                : "active"),
          }
        : current
    );

    toast.success(
      action === "suspend"
        ? "Teacher suspended successfully."
        : "Teacher restored successfully."
    );
  } catch (error) {
    console.error("Teacher status update error:", error);

    toast.error(
      error instanceof Error
        ? error.message
        : "Something went wrong updating the teacher."
    );
  } finally {
    setProcessing(false);
  }
}

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900 text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-200">
              Teacher Account
            </p>

            <h1 className="mt-3 text-4xl font-extrabold">
              {teacher.name}
            </h1>

            <p className="mt-3 text-indigo-100">
              {teacher.email}
            </p>
          </div>

          <Link
            href="/admin/teachers"
            className="rounded-xl bg-white px-5 py-3 text-center font-bold text-indigo-700 transition hover:bg-indigo-50"
          >
            ← Teacher Directory
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Classes"
          value={classes.length.toString()}
          icon="🏫"
        />

        <SummaryCard
          label="Students"
          value={totalStudents.toString()}
          icon="👨‍🎓"
        />

        <SummaryCard
          label="Assignments"
          value={assignments.length.toString()}
          icon="📋"
        />

        <SummaryCard
          label="Status"
          value={teacher.status}
          icon={
            teacher.status === "active"
              ? "✅"
              : "⛔"
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Account Details
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Teacher Profile
          </h2>

          <div className="mt-6 space-y-4">
            <DetailRow label="Name" value={teacher.name} />
            <DetailRow label="Email" value={teacher.email} />
            <DetailRow label="Role" value={teacher.role} />
            <DetailRow
              label="School"
              value={teacher.schoolName}
            />
            <DetailRow
              label="Approved"
              value={formatDate(
                teacher.teacherApprovedAt ||
                  teacher.createdAt
              )}
            />
          </div>
        </Card>

        <Card>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
            Teaching Activity
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Classes
          </h2>

          {classes.length === 0 ? (
            <p className="mt-6 text-slate-600">
              This teacher has not created any classes yet.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {classes.map((classItem) => (
                <div
                  key={classItem.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="font-bold text-slate-900">
                    {classItem.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {classItem.yearGroup} · {classItem.subject}
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {classItem.studentIds.length} students
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Assignment Activity
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Recent Assignments
        </h2>

        {assignments.length === 0 ? (
          <p className="mt-6 text-slate-600">
            This teacher has not created any assignments yet.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                  {assignment.type}
                </p>

                <h3 className="mt-2 font-bold text-slate-900">
                  {assignment.title}
                </h3>

                <p className="mt-2 text-sm capitalize text-slate-600">
                  Status: {assignment.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
  <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
    Account Controls
  </p>

  <h2 className="mt-2 text-2xl font-bold text-slate-900">
    Manage Access
  </h2>

  <p className="mt-3 text-slate-600">
    Suspend a teacher to immediately disable login.
    Restore access at any time.
  </p>

  {teacher.status === "active" ? (
    <button
      type="button"
      disabled={processing}
      onClick={() =>
        updateTeacherStatus("suspend")
      }
      className="mt-6 rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
    >
      {processing
        ? "Suspending..."
        : "Suspend Teacher"}
    </button>
  ) : (
    <button
      type="button"
      disabled={processing}
      onClick={() =>
        updateTeacherStatus("restore")
      }
      className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-700 disabled:opacity-50"
    >
      {processing
        ? "Restoring..."
        : "Restore Teacher"}
    </button>
  )}
</Card>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-semibold text-slate-500">
        {label}
      </span>

      <span className="font-bold capitalize text-slate-900">
        {value}
      </span>
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

          <p className="mt-2 break-words text-2xl font-bold capitalize text-slate-900">
            {value}
          </p>
        </div>

        <div className="text-3xl">{icon}</div>
      </div>
    </Card>
  );
}