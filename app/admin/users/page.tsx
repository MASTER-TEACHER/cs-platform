"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  ReactNode,
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

type UserRole =
  | "student"
  | "teacher"
  | "admin"
  | string;

type AccountStatus =
  | "active"
  | "suspended";

type UserRecord = {
  id: string;

  name: string;
  email: string;

  role: UserRole;
  status: AccountStatus;

  schoolId: string;
  schoolName: string;

  qualification: string;
  examBoard: string;

  createdAt?: Timestamp;
};

type RoleFilter =
  | "all"
  | "student"
  | "teacher"
  | "admin";

type StatusFilter =
  | "all"
  | "active"
  | "suspended";

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

function roleBadgeClass(
  role: string,
): string {
  switch (
    role.toLowerCase()
  ) {
    case "admin":
      return "bg-violet-100 text-violet-700";

    case "teacher":
      return "bg-emerald-100 text-emerald-700";

    case "student":
      return "bg-blue-100 text-blue-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function statusBadgeClass(
  status: AccountStatus,
): string {
  return status === "suspended"
    ? "bg-red-100 text-red-700"
    : "bg-green-100 text-green-700";
}

export default function AdminUsersPage() {
  const {
    profile,
    loading:
      profileLoading,
  } =
    useUserProfile();

  const [
    users,
    setUsers,
  ] =
    useState<
      UserRecord[]
    >([]);

  const [
    loadingUsers,
    setLoadingUsers,
  ] =
    useState(true);

  const [
    searchTerm,
    setSearchTerm,
  ] =
    useState("");

  const [
    roleFilter,
    setRoleFilter,
  ] =
    useState<RoleFilter>(
      "all",
    );

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<StatusFilter>(
      "all",
    );

  const isAdmin =
    profile?.role ===
    "admin";

  useEffect(() => {
    if (profileLoading || !isAdmin) {
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
            snapshot.docs
              .map<UserRecord>(
                (
                  userDocument,
                ) => {
                  const data =
                    userDocument.data();

                  const role =
                    typeof data.role ===
                    "string"
                      ? data.role
                      : "student";

                  const status:
                    AccountStatus =
                    data.status ===
                    "suspended"
                      ? "suspended"
                      : "active";

                  const qualification =
                    data.qualification ||
                    data.level ||
                    data.course ||
                    "";

                  const examBoard =
                    data.examBoard ||
                    data.board ||
                    "";

                  return {
                    id:
                      userDocument.id,

                    name:
                      data.name ||
                      data.displayName ||
                      "Unnamed User",

                    email:
                      data.email ||
                      "No email available",

                    role,

                    status,

                    schoolId:
                      data.schoolId ||
                      "",

                    schoolName:
                      data.schoolName ||
                      data.school ||
                      "",

                    qualification:
                      typeof qualification ===
                      "string"
                        ? qualification
                        : "",

                    examBoard:
                      typeof examBoard ===
                      "string"
                        ? examBoard
                        : "",

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

          setUsers(
            loadedUsers,
          );

          setLoadingUsers(
            false,
          );
        },

        (
          error,
        ) => {
          console.error(
            "Failed to load platform users:",
            error,
          );

          toast.error(
            "Could not load platform users.",
          );

          setUsers(
            [],
          );

          setLoadingUsers(
            false,
          );
        },
      );

    return unsubscribe;
  }, [
    profileLoading,
    isAdmin,
  ]);

  const students =
    useMemo(
      () =>
        users.filter(
          (
            user,
          ) =>
            user.role ===
            "student",
        ),
      [
        users,
      ],
    );

  const teachers =
    useMemo(
      () =>
        users.filter(
          (
            user,
          ) =>
            user.role ===
            "teacher",
        ),
      [
        users,
      ],
    );

  const admins =
    useMemo(
      () =>
        users.filter(
          (
            user,
          ) =>
            user.role ===
            "admin",
        ),
      [
        users,
      ],
    );

  const suspendedUsers =
    useMemo(
      () =>
        users.filter(
          (
            user,
          ) =>
            user.status ===
            "suspended",
        ),
      [
        users,
      ],
    );

  const filteredUsers =
    useMemo(() => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();

      return users.filter(
        (
          user,
        ) => {
          if (
            roleFilter !==
              "all" &&
            user.role !==
              roleFilter
          ) {
            return false;
          }

          if (
            statusFilter !==
              "all" &&
            user.status !==
              statusFilter
          ) {
            return false;
          }

          if (
            !search
          ) {
            return true;
          }

          return [
            user.name,
            user.email,
            user.role,
            user.schoolName,
            user.schoolId,
            user.qualification,
            user.examBoard,
          ].some(
            (
              value,
            ) =>
              value
                .toLowerCase()
                .includes(
                  search,
                ),
          );
        },
      );
    }, [
      users,
      searchTerm,
      roleFilter,
      statusFilter,
    ]);

  if (
    profileLoading ||
    (
      isAdmin &&
      loadingUsers
    )
  ) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-52 w-full" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
          <Skeleton className="h-28" />
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
              User Management
            </h1>

            <p className="mt-3 max-w-3xl text-indigo-100">
              Review student, teacher and administrator accounts across CS Master.
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          label="Total Users"
          value={
            users.length.toString()
          }
          icon="👥"
        />

        <SummaryCard
          label="Students"
          value={
            students.length.toString()
          }
          icon="👨‍🎓"
        />

        <SummaryCard
          label="Teachers"
          value={
            teachers.length.toString()
          }
          icon="👩‍🏫"
        />

        <SummaryCard
          label="Administrators"
          value={
            admins.length.toString()
          }
          icon="🛡️"
        />

        <SummaryCard
          label="Suspended"
          value={
            suspendedUsers.length.toString()
          }
          icon="⛔"
        />
      </div>

      <Card>
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Platform Directory
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              All Users
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Search and filter every account currently registered in CS Master.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_220px_auto]">
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
              placeholder="Search name, email, school or curriculum..."
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <select
              value={
                roleFilter
              }
              onChange={(
                event,
              ) =>
                setRoleFilter(
                  event.target
                    .value as RoleFilter,
                )
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="all">
                All roles
              </option>

              <option value="student">
                Students
              </option>

              <option value="teacher">
                Teachers
              </option>

              <option value="admin">
                Administrators
              </option>
            </select>

            <select
              value={
                statusFilter
              }
              onChange={(
                event,
              ) =>
                setStatusFilter(
                  event.target
                    .value as StatusFilter,
                )
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="all">
                All statuses
              </option>

              <option value="active">
                Active
              </option>

              <option value="suspended">
                Suspended
              </option>
            </select>

            <button
              type="button"
              onClick={() => {
                setSearchTerm(
                  "",
                );

                setRoleFilter(
                  "all",
                );

                setStatusFilter(
                  "all",
                );
              }}
              className="rounded-xl border border-slate-300 px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Clear
            </button>
          </div>

          <p className="text-sm font-semibold text-slate-500">
            Showing{" "}
            {
              filteredUsers.length
            }{" "}
            of{" "}
            {
              users.length
            }{" "}
            users
          </p>
        </div>

        {filteredUsers.length ===
        0 ? (
          <div className="mt-8 rounded-2xl bg-slate-50 p-10 text-center">
            <div className="text-5xl">
              👥
            </div>

            <h3 className="mt-4 text-xl font-bold text-slate-900">
              No users found
            </h3>

            <p className="mt-2 text-slate-600">
              No accounts match the current search and filters.
            </p>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <TableHeading>
                    User
                  </TableHeading>

                  <TableHeading>
                    Role
                  </TableHeading>

                  <TableHeading>
                    School
                  </TableHeading>

                  <TableHeading>
                    Curriculum
                  </TableHeading>

                  <TableHeading>
                    Status
                  </TableHeading>

                  <TableHeading>
                    Created
                  </TableHeading>

                  <TableHeading>
                    Action
                  </TableHeading>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredUsers.map(
                  (
                    platformUser,
                  ) => (
                    <tr
                      key={
                        platformUser.id
                      }
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900">
                          {
                            platformUser.name
                          }
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {
                            platformUser.email
                          }
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${roleBadgeClass(
                            platformUser.role,
                          )}`}
                        >
                          {
                            platformUser.role
                          }
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        <p className="font-semibold">
                          {
                            platformUser.schoolName ||
                            "Not assigned"
                          }
                        </p>

                        {platformUser.schoolId && (
                          <p className="mt-1 max-w-[180px] truncate text-xs text-slate-400">
                            {
                              platformUser.schoolId
                            }
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {platformUser.qualification ||
                        platformUser.examBoard ? (
                          <>
                            <p className="font-semibold text-slate-800">
                              {
                                platformUser.qualification ||
                                "Not set"
                              }
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {
                                platformUser.examBoard ||
                                "Board not set"
                              }
                            </p>
                          </>
                        ) : (
                          <span className="text-sm text-slate-400">
                            —
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${statusBadgeClass(
                            platformUser.status,
                          )}`}
                        >
                          {
                            platformUser.status
                          }
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {
                          formatDate(
                            platformUser.createdAt,
                          )
                        }
                      </td>

                      <td className="px-5 py-4">
                        {platformUser.role ===
                        "teacher" ? (
                          <Link
                            href={`/admin/teachers/${platformUser.id}`}
                            className="inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-700"
                          >
                            Manage
                          </Link>
                        ) : (
                          <span className="text-sm text-slate-400">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function TableHeading({
  children,
}: {
  children:
  ReactNode;
}) {
  return (
    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
      {children}
    </th>
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