"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  collection,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

import Link from "next/link";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";

import {
  db,
} from "@/lib/firebase";

import {
  useUserProfile,
} from "@/hooks/useUserProfile";

type SchoolRecord = {
  id: string;

  name: string;

  status:
    | "active"
    | "inactive";

  createdAt?: Timestamp;
};

type SchoolUserRecord = {
  id: string;

  role: string;

  schoolId: string;
  schoolName: string;
};

type ClassRecord = {
  id: string;

  schoolId: string;
  schoolName: string;
};

type SchoolSummary = {
  id: string;

  name: string;

  status:
    | "active"
    | "inactive";

  teachers: number;
  students: number;
  admins: number;
  members: number;
  classes: number;

  createdAt?: Timestamp;
};

function formatDate(
  timestamp?: Timestamp,
): string {
  if (!timestamp) {
    return "Not available";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(
    timestamp.toDate(),
  );
}

function normalise(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase();
}

export default function AdminSchoolsPage() {
  const {
    profile,
    loading:
      profileLoading,
  } =
    useUserProfile();

  const [
    schools,
    setSchools,
  ] =
    useState<
      SchoolRecord[]
    >([]);

  const [
    users,
    setUsers,
  ] =
    useState<
      SchoolUserRecord[]
    >([]);

  const [
    classes,
    setClasses,
  ] =
    useState<
      ClassRecord[]
    >([]);

  const [
    schoolsLoaded,
    setSchoolsLoaded,
  ] =
    useState(false);

  const [
    usersLoaded,
    setUsersLoaded,
  ] =
    useState(false);

  const [
    classesLoaded,
    setClassesLoaded,
  ] =
    useState(false);

  const [
    searchTerm,
    setSearchTerm,
  ] =
    useState("");

  const isAdmin =
    profile?.role ===
    "admin";

  useEffect(() => {
    if (
      profileLoading ||
      !isAdmin
    ) {
      return;
    }

    const unsubscribe =
      onSnapshot(
        collection(
          db,
          "schools",
        ),

        (
          snapshot,
        ) => {
          const loadedSchools =
            snapshot.docs
              .map<SchoolRecord>(
                (
                  schoolDocument,
                ) => {
                  const data =
                    schoolDocument.data();

                  return {
                    id:
                      schoolDocument.id,

                    name:
                      data.name ||
                      data.schoolName ||
                      "Unnamed School",

                    status:
                      data.status ===
                      "inactive"
                        ? "inactive"
                        : "active",

                    createdAt:
                      data.createdAt,
                  };
                },
              )
              .sort(
                (
                  a,
                  b,
                ) =>
                  a.name.localeCompare(
                    b.name,
                  ),
              );

          setSchools(
            loadedSchools,
          );

          setSchoolsLoaded(
            true,
          );
        },

        (
          error,
        ) => {
          console.error(
            "Failed to load schools:",
            error,
          );

          toast.error(
            "Could not load schools.",
          );

          setSchools(
            [],
          );

          setSchoolsLoaded(
            true,
          );
        },
      );

    return unsubscribe;
  }, [
    profileLoading,
    isAdmin,
  ]);

  useEffect(() => {
    if (
      profileLoading ||
      !isAdmin
    ) {
      return;
    }

    const unsubscribe =
      onSnapshot(
        collection(
          db,
          "users",
        ),

        (
          snapshot,
        ) => {
          const loadedUsers =
            snapshot.docs.map<SchoolUserRecord>(
              (
                userDocument,
              ) => {
                const data =
                  userDocument.data();

                return {
                  id:
                    userDocument.id,

                  role:
                    typeof data.role ===
                    "string"
                      ? data.role
                      : "student",

                  schoolId:
                    typeof data.schoolId ===
                    "string"
                      ? data.schoolId
                      : "",

                  schoolName:
                    typeof (
                      data.schoolName ||
                      data.school
                    ) ===
                    "string"
                      ? (
                          data.schoolName ||
                          data.school
                        )
                      : "",
                };
              },
            );

          setUsers(
            loadedUsers,
          );

          setUsersLoaded(
            true,
          );
        },

        (
          error,
        ) => {
          console.error(
            "Failed to load school membership:",
            error,
          );

          toast.error(
            "Could not load school memberships.",
          );

          setUsers(
            [],
          );

          setUsersLoaded(
            true,
          );
        },
      );

    return unsubscribe;
  }, [
    profileLoading,
    isAdmin,
  ]);

  useEffect(() => {
    if (
      profileLoading ||
      !isAdmin
    ) {
      return;
    }

    const unsubscribe =
      onSnapshot(
        collection(
          db,
          "classes",
        ),

        (
          snapshot,
        ) => {
          const loadedClasses =
            snapshot.docs.map<ClassRecord>(
              (
                classDocument,
              ) => {
                const data =
                  classDocument.data();

                return {
                  id:
                    classDocument.id,

                  schoolId:
                    typeof data.schoolId ===
                    "string"
                      ? data.schoolId
                      : "",

                  schoolName:
                    typeof data.schoolName ===
                    "string"
                      ? data.schoolName
                      : "",
                };
              },
            );

          setClasses(
            loadedClasses,
          );

          setClassesLoaded(
            true,
          );
        },

        (
          error,
        ) => {
          console.error(
            "Failed to load classes for school directory:",
            error,
          );

          setClasses(
            [],
          );

          setClassesLoaded(
            true,
          );
        },
      );

    return unsubscribe;
  }, [
    profileLoading,
    isAdmin,
  ]);

  const schoolSummaries =
    useMemo<
      SchoolSummary[]
    >(() => {
      const summaries =
        new Map<
          string,
          SchoolSummary
        >();

      function getSummary(
        schoolId: string,
        schoolName: string,
      ): SchoolSummary | null {
        const trimmedId =
          schoolId.trim();

        const trimmedName =
          schoolName.trim();

        if (
          !trimmedId &&
          !trimmedName
        ) {
          return null;
        }

        let existing:
          SchoolSummary |
          undefined;

        if (
          trimmedId
        ) {
          existing =
            summaries.get(
              trimmedId,
            );
        }

        if (
          !existing &&
          trimmedName
        ) {
          existing =
            Array.from(
              summaries.values(),
            ).find(
              (
                item,
              ) =>
                normalise(
                  item.name,
                ) ===
                normalise(
                  trimmedName,
                ),
            );
        }

        if (
          existing
        ) {
          return existing;
        }

        const key =
          trimmedId ||
          `name:${normalise(
            trimmedName,
          )}`;

        const created:
          SchoolSummary =
          {
            id:
              trimmedId ||
              key,

            name:
              trimmedName ||
              "Unnamed School",

            status:
              "active",

            teachers:
              0,

            students:
              0,

            admins:
              0,

            members:
              0,

            classes:
              0,
          };

        summaries.set(
          key,
          created,
        );

        return created;
      }

      schools.forEach(
        (
          school,
        ) => {
          summaries.set(
            school.id,
            {
              id:
                school.id,

              name:
                school.name,

              status:
                school.status,

              teachers:
                0,

              students:
                0,

              admins:
                0,

              members:
                0,

              classes:
                0,

              createdAt:
                school.createdAt,
            },
          );
        },
      );

      users.forEach(
        (
          platformUser,
        ) => {
          const summary =
            getSummary(
              platformUser.schoolId,
              platformUser.schoolName,
            );

          if (
            !summary
          ) {
            return;
          }

          summary.members +=
            1;

          if (
            platformUser.role ===
            "teacher"
          ) {
            summary.teachers +=
              1;
          } else if (
            platformUser.role ===
            "student"
          ) {
            summary.students +=
              1;
          } else if (
            platformUser.role ===
            "admin"
          ) {
            summary.admins +=
              1;
          }
        },
      );

      classes.forEach(
        (
          classItem,
        ) => {
          const summary =
            getSummary(
              classItem.schoolId,
              classItem.schoolName,
            );

          if (
            summary
          ) {
            summary.classes +=
              1;
          }
        },
      );

      return Array.from(
        summaries.values(),
      ).sort(
        (
          a,
          b,
        ) =>
          a.name.localeCompare(
            b.name,
          ),
      );
    }, [
      schools,
      users,
      classes,
    ]);

  const filteredSchools =
    useMemo(() => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();

      if (
        !search
      ) {
        return schoolSummaries;
      }

      return schoolSummaries.filter(
        (
          school,
        ) =>
          school.name
            .toLowerCase()
            .includes(
              search,
            ) ||
          school.id
            .toLowerCase()
            .includes(
              search,
            ),
      );
    }, [
      schoolSummaries,
      searchTerm,
    ]);

  const totalStudents =
    useMemo(
      () =>
        schoolSummaries.reduce(
          (
            total,
            school,
          ) =>
            total +
            school.students,
          0,
        ),
      [
        schoolSummaries,
      ],
    );

  const totalTeachers =
    useMemo(
      () =>
        schoolSummaries.reduce(
          (
            total,
            school,
          ) =>
            total +
            school.teachers,
          0,
        ),
      [
        schoolSummaries,
      ],
    );

  const totalClasses =
    useMemo(
      () =>
        schoolSummaries.reduce(
          (
            total,
            school,
          ) =>
            total +
            school.classes,
          0,
        ),
      [
        schoolSummaries,
      ],
    );

  const loading =
    !schoolsLoaded ||
    !usersLoaded ||
    !classesLoaded;

  if (
    profileLoading ||
    (
      isAdmin &&
      loading
    )
  ) {
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

  if (
    !isAdmin
  ) {
    return (
      <Card>
        <div className="text-5xl">
          🔒
        </div>

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
              School Management
            </h1>

            <p className="mt-3 max-w-3xl text-indigo-100">
              Review CS Master organisations, membership and teaching activity.
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Schools"
          value={
            schoolSummaries.length.toString()
          }
          icon="🏫"
        />

        <SummaryCard
          label="Students"
          value={
            totalStudents.toString()
          }
          icon="👨‍🎓"
        />

        <SummaryCard
          label="Teachers"
          value={
            totalTeachers.toString()
          }
          icon="👩‍🏫"
        />

        <SummaryCard
          label="Classes"
          value={
            totalClasses.toString()
          }
          icon="📚"
        />
      </div>

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Organisation Directory
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Schools
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Membership counts are calculated from current CS Master user and class records.
            </p>
          </div>

          <input
            type="search"
            value={
              searchTerm
            }
            onChange={(
              event,
            ) =>
              setSearchTerm(
                event.target.value,
              )
            }
            placeholder="Search schools..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 md:max-w-sm"
          />
        </div>

        {filteredSchools.length ===
        0 ? (
          <div className="mt-8 rounded-2xl bg-slate-50 p-10 text-center">
            <div className="text-5xl">
              🏫
            </div>

            <h3 className="mt-4 text-xl font-bold text-slate-900">
              No schools found
            </h3>

            <p className="mt-2 text-slate-600">
              School organisations and school-linked membership will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
            {filteredSchools.map(
              (
                school,
              ) => (
                <div
                  key={
                    school.id
                  }
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                        School Organisation
                      </p>

                      <h3 className="mt-2 break-words text-2xl font-black text-slate-900">
                        {
                          school.name
                        }
                      </h3>

                      <p className="mt-2 break-all text-xs text-slate-500">
                        School ID:{" "}
                        {
                          school.id
                        }
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-bold capitalize ${
                        school.status ===
                        "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {
                        school.status
                      }
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <Metric
                      label="Students"
                      value={
                        school.students
                      }
                    />

                    <Metric
                      label="Teachers"
                      value={
                        school.teachers
                      }
                    />

                    <Metric
                      label="Admins"
                      value={
                        school.admins
                      }
                    />

                    <Metric
                      label="Members"
                      value={
                        school.members
                      }
                    />

                    <Metric
                      label="Classes"
                      value={
                        school.classes
                      }
                    />
                  </div>

                  <div className="mt-6 border-t border-slate-200 pt-4">
                    <p className="text-sm text-slate-500">
                      Created{" "}
                      <span className="font-bold text-slate-800">
                        {
                          formatDate(
                            school.createdAt,
                          )
                        }
                      </span>
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </Card>

      <Card className="border-indigo-200 bg-indigo-50">
        <p className="text-sm font-black uppercase tracking-widest text-indigo-700">
          Administration Model
        </p>

        <h2 className="mt-2 text-xl font-black text-indigo-950">
          School-scoped tenancy remains preserved
        </h2>

        <p className="mt-2 max-w-4xl leading-7 text-indigo-800">
          This directory is an administrative overview. Teacher and student workflows should continue to use their existing school-scoped access controls rather than using this page to bypass tenancy boundaries.
        </p>
      </Card>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-slate-900">
        {value}
      </p>
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

        <div className="text-3xl">
          {icon}
        </div>
      </div>
    </Card>
  );
}