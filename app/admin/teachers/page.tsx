"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import Link from "next/link";
import toast from "react-hot-toast";

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
  teacherApprovedAt?: Timestamp;
  createdAt?: Timestamp;
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

export default function AdminTeachersPage() {
  const { profile, loading: profileLoading } = useUserProfile();

  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const isAdmin = profile?.role === "admin";

  useEffect(() => {
    if (profileLoading) {
      return;
    }

    if (!isAdmin) {
      setTeachers([]);
      setLoadingTeachers(false);
      return;
    }

    const teachersQuery = query(
      collection(db, "users"),
      where("role", "==", "teacher")
    );

    const unsubscribe = onSnapshot(
      teachersQuery,
      (snapshot) => {
        const loadedTeachers: TeacherRecord[] = snapshot.docs
          .map((teacherDocument) => {
            const data = teacherDocument.data();

            return {
              id: teacherDocument.id,
              name: data.name || "Unnamed Teacher",
              email: data.email || "No email available",
              role: data.role || "teacher",
              schoolName:
                data.schoolName ||
                data.school ||
                "School not assigned",
              teacherApprovedAt: data.teacherApprovedAt,
              createdAt: data.createdAt,
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name));

        setTeachers(loadedTeachers);
        setLoadingTeachers(false);
      },
      (error) => {
        console.error("Failed to load teachers:", error);
        toast.error("Could not load teacher accounts.");
        setTeachers([]);
        setLoadingTeachers(false);
      }
    );

    return unsubscribe;
  }, [profileLoading, isAdmin]);

  const filteredTeachers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return teachers;
    }

    return teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(search) ||
        teacher.email.toLowerCase().includes(search) ||
        teacher.schoolName.toLowerCase().includes(search)
    );
  }, [teachers, searchTerm]);

  if (profileLoading || loadingTeachers) {
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

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900 text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-200">
              Administration
            </p>

            <h1 className="mt-3 text-4xl font-extrabold">
              Teacher Management
            </h1>

            <p className="mt-3 max-w-2xl text-indigo-100">
              View approved teachers and monitor platform access.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-xl bg-white px-5 py-3 text-center font-bold text-indigo-700 transition hover:bg-indigo-50"
          >
            ← Admin Dashboard
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SummaryCard
          label="Approved Teachers"
          value={teachers.length.toString()}
          icon="👩‍🏫"
        />

        <SummaryCard
          label="Schools Represented"
          value={new Set(
            teachers
              .map((teacher) => teacher.schoolName)
              .filter(
                (schoolName) =>
                  schoolName !== "School not assigned"
              )
          ).size.toString()}
          icon="🏫"
        />

        <SummaryCard
          label="Active Accounts"
          value={teachers.length.toString()}
          icon="✅"
        />
      </div>

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Teacher Directory
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Approved Teachers
            </h2>
          </div>

          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search teachers..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 md:max-w-sm"
          />
        </div>

        {filteredTeachers.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-slate-50 p-10 text-center">
            <div className="text-5xl">👩‍🏫</div>

            <h3 className="mt-4 text-xl font-bold text-slate-900">
              No teachers found
            </h3>

            <p className="mt-2 text-slate-600">
              Approved teacher accounts will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-2">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {teacher.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-600">
                      {teacher.email}
                    </p>

                    <p className="mt-4 font-semibold text-slate-800">
                      {teacher.schoolName}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                    Active
                  </span>
                </div>

                <div className="mt-5 space-y-2 text-sm text-slate-600">
                  <p>
                    Approved:{" "}
                    <span className="font-bold text-slate-900">
                      {formatDate(
                        teacher.teacherApprovedAt ||
                          teacher.createdAt
                      )}
                    </span>
                  </p>

                  <p>
                    Role:{" "}
                    <span className="font-bold capitalize text-slate-900">
                      {teacher.role}
                    </span>
                  </p>
                </div>

                <Link
                  href={`/admin/teachers/${teacher.id}`}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-700"
                >
                  Manage Teacher →
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