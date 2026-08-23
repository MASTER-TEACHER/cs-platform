"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  BookOpenCheck,
  GraduationCap,
  Pin,
  School,
  Search,
  Sparkles,
  Star,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";

import {
  getSchoolMembers,
  type SchoolMemberRecord,
} from "@/services/schoolMemberService";

import {
  getUserProfile,
} from "@/services/userService";

import {
  getTeacherAnalyticsPortfolio,
} from "@/services/analytics/teacherAnalyticsService";

import type {
  UserProfile,
} from "@/types/database";

import type {
  TeacherAnalyticsPortfolio,
  TeacherStudentAnalyticsRow,
} from "@/types/teacherAnalytics";

type CourseFilter =
  | "all"
  | "gcse"
  | "a-level"
  | "other";

type MembershipFilter =
  | "all"
  | "enrolled"
  | "unassigned";

type DirectoryStudent = {
  uid: string;
  name: string;
  email: string;

  profile:
    UserProfile | null;

  classContexts:
    StudentClassContext[];
};

type StudentClassContext = {
  classId: string;
  className: string;

  workingGrade: string;
  targetGrade: string;

  completionRate: number;

  trend: string;
  confidence: string;

  priority:
    TeacherStudentAnalyticsRow[
      "interventionPriority"
    ];
};

function formatQualification(
  value: string,
): string {
  const cleaned =
    value
      .trim()
      .toUpperCase();

  if (
    cleaned ===
    "A_LEVEL"
  ) {
    return "A Level";
  }

  if (
    cleaned ===
    "GCSE"
  ) {
    return "GCSE";
  }

  return value.trim() ||
    "Course not selected";
}

function formatExamBoard(
  value: string,
): string {
  return value.trim()
    ? value.trim().toUpperCase()
    : "Board not selected";
}

function courseCategory(
  profile:
    UserProfile | null,
): CourseFilter {
  const qualification =
    String(
      profile?.qualification ??
        "",
    )
      .trim()
      .toLowerCase();

  if (
    qualification.includes(
      "gcse",
    )
  ) {
    return "gcse";
  }

  if (
    qualification.includes(
      "a_level",
    ) ||
    qualification.includes(
      "a level",
    ) ||
    qualification.includes(
      "alevel",
    ) ||
    qualification.includes(
      "a-level",
    )
  ) {
    return "a-level";
  }

  return "other";
}

function getInitials(
  name: string,
): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(
        (part) =>
          part.charAt(0)
            .toUpperCase(),
      )
      .join("") || "ST"
  );
}

function priorityRank(
  priority:
    TeacherStudentAnalyticsRow[
      "interventionPriority"
    ],
): number {
  if (
    priority === "high"
  ) {
    return 4;
  }

  if (
    priority === "medium"
  ) {
    return 3;
  }

  if (
    priority === "monitor"
  ) {
    return 2;
  }

  return 1;
}

function priorityLabel(
  priority:
    TeacherStudentAnalyticsRow[
      "interventionPriority"
    ],
): string {
  if (
    priority === "high"
  ) {
    return "High";
  }

  if (
    priority === "medium"
  ) {
    return "Medium";
  }

  if (
    priority === "monitor"
  ) {
    return "Monitor";
  }

  return "No current flag";
}

function priorityTone(
  priority:
    TeacherStudentAnalyticsRow[
      "interventionPriority"
    ],
): string {
  if (
    priority === "high"
  ) {
    return "bg-red-100 text-red-700";
  }

  if (
    priority === "medium"
  ) {
    return "bg-amber-100 text-amber-800";
  }

  if (
    priority === "monitor"
  ) {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-emerald-100 text-emerald-700";
}

function highestPriority(
  contexts:
    StudentClassContext[],
): TeacherStudentAnalyticsRow[
  "interventionPriority"
] {
  return (
    [...contexts]
      .sort(
        (
          first,
          second,
        ) =>
          priorityRank(
            second.priority,
          ) -
          priorityRank(
            first.priority,
          ),
      )[0]?.priority ??
    "none"
  );
}

function averageCompletion(
  contexts:
    StudentClassContext[],
): number {
  if (
    contexts.length === 0
  ) {
    return 0;
  }

  return Math.round(
    contexts.reduce(
      (
        total,
        context,
      ) =>
        total +
        context.completionRate,
      0,
    ) /
      contexts.length,
  );
}

function buildClassContextMap(
  portfolio:
    TeacherAnalyticsPortfolio | null,
): Map<
  string,
  StudentClassContext[]
> {
  const map =
    new Map<
      string,
      StudentClassContext[]
    >();

  if (!portfolio) {
    return map;
  }

  portfolio.classes.forEach(
    (classItem) => {
      classItem.students.forEach(
        (student) => {
          const existing =
            map.get(
              student.studentId,
            ) ?? [];

          existing.push({
            classId:
              classItem.classId,

            className:
              classItem.className,

            workingGrade:
              student.workingGrade ??
              "—",

            targetGrade:
              student.targetGrade ??
              "Not set",

            completionRate:
              student.completionRate,

            trend:
              student.trend,

            confidence:
              String(
                student.confidence,
              ),

            priority:
              student.interventionPriority,
          });

          map.set(
            student.studentId,
            existing,
          );
        },
      );
    },
  );

  return map;
}

export default function TeacherStudentsPage() {
  const {
    user,
    profile,
    loading:
      authLoading,
    profileReady,
  } = useAuth();

  const [
    members,
    setMembers,
  ] =
    useState<
      SchoolMemberRecord[]
    >([]);

  const [
    profiles,
    setProfiles,
  ] =
    useState<
      Map<
        string,
        UserProfile | null
      >
    >(new Map());

  const [
    portfolio,
    setPortfolio,
  ] =
    useState<TeacherAnalyticsPortfolio | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    courseFilter,
    setCourseFilter,
  ] =
    useState<CourseFilter>(
      "all",
    );

  const [
    membershipFilter,
    setMembershipFilter,
  ] =
    useState<MembershipFilter>(
      "all",
    );

  const schoolId =
    profile?.schoolId?.trim() ??
    "";

  useEffect(() => {
    if (
      authLoading ||
      !profileReady
    ) {
      return;
    }

    if (
      !user?.uid ||
      !schoolId
    ) {
      setMembers([]);
      setProfiles(
        new Map(),
      );
      setPortfolio(
        null,
      );
      setLoading(false);
      return;
    }

    const teacherId:
      string = user.uid;

    let cancelled =
      false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const [
          schoolMembers,
          teacherPortfolio,
        ] =
          await Promise.all([
            getSchoolMembers(
              schoolId,
            ),

            getTeacherAnalyticsPortfolio(
              teacherId,
            ),
          ]);

        if (cancelled) {
          return;
        }

        const activeStudentMembers =
          schoolMembers.filter(
            (member) =>
              member.status ===
                "active" &&
              member.membershipRole ===
                "student",
          );

        const loadedProfiles =
          await Promise.all(
            activeStudentMembers.map(
              async (
                member,
              ) => {
                try {
                  return [
                    member.uid,
                    await getUserProfile(
                      member.uid,
                    ),
                  ] as const;
                } catch (
                  profileError
                ) {
                  console.warn(
                    `Unable to load profile for ${member.uid}:`,
                    profileError,
                  );

                  return [
                    member.uid,
                    null,
                  ] as const;
                }
              },
            ),
          );

        if (
          !cancelled
        ) {
          setMembers(
            schoolMembers,
          );

          setProfiles(
            new Map(
              loadedProfiles,
            ),
          );

          setPortfolio(
            teacherPortfolio,
          );
        }
      } catch (
        caughtError
      ) {
        console.error(
          "Unable to load teacher student directory:",
          caughtError,
        );

        if (
          !cancelled
        ) {
          setError(
            caughtError instanceof
              Error
              ? caughtError.message
              : "The student directory could not be loaded.",
          );
        }
      } finally {
        if (
          !cancelled
        ) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [
    authLoading,
    profileReady,
    user?.uid,
    schoolId,
  ]);

  const classContextMap =
    useMemo(
      () =>
        buildClassContextMap(
          portfolio,
        ),
      [portfolio],
    );

  /*
   * This is the key T1D polish:
   *
   * School directory identity is unique by user UID.
   * Class-specific analytics are nested under that single learner.
   *
   * One student -> one directory row -> many class contexts.
   */
  const students =
    useMemo<
      DirectoryStudent[]
    >(
      () =>
        members
          .filter(
            (member) =>
              member.status ===
                "active" &&
              member.membershipRole ===
                "student",
          )
          .map(
            (member) => ({
              uid:
                member.uid,

              name:
                member.name ||
                profiles.get(
                  member.uid,
                )?.name ||
                "Student",

              email:
                member.email ||
                profiles.get(
                  member.uid,
                )?.email ||
                "",

              profile:
                profiles.get(
                  member.uid,
                ) ??
                null,

              classContexts:
                classContextMap.get(
                  member.uid,
                ) ?? [],
            }),
          )
          .sort(
            (
              first,
              second,
            ) =>
              first.name.localeCompare(
                second.name,
                "en-GB",
                {
                  sensitivity:
                    "base",
                },
              ),
          ),
      [
        members,
        profiles,
        classContextMap,
      ],
    );

  const filteredStudents =
    useMemo(() => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();

      return students.filter(
        (student) => {
          const matchesSearch =
            !search ||
            [
              student.name,
              student.email,
              ...student.classContexts.map(
                (context) =>
                  context.className,
              ),
              String(
                student.profile
                  ?.qualification ??
                  "",
              ),
              String(
                student.profile
                  ?.examBoard ??
                  "",
              ),
            ].some(
              (value) =>
                value
                  .toLowerCase()
                  .includes(
                    search,
                  ),
            );

          const matchesCourse =
            courseFilter ===
              "all" ||
            courseCategory(
              student.profile,
            ) ===
              courseFilter;

          const isEnrolled =
            student.classContexts
              .length > 0 ||
            (student.profile
              ?.classIds
              ?.length ??
              0) > 0;

          const matchesMembership =
            membershipFilter ===
              "all" ||
            (membershipFilter ===
              "enrolled"
              ? isEnrolled
              : !isEnrolled);

          return (
            matchesSearch &&
            matchesCourse &&
            matchesMembership
          );
        },
      );
    }, [
      students,
      searchTerm,
      courseFilter,
      membershipFilter,
    ]);

  const enrolledCount =
    students.filter(
      (student) =>
        student.classContexts
          .length > 0 ||
        (student.profile
          ?.classIds
          ?.length ??
          0) > 0,
    ).length;

  const unassignedCount =
    Math.max(
      0,
      students.length -
        enrolledCount,
    );

  const averageXp =
    students.length > 0
      ? Math.round(
          students.reduce(
            (
              total,
              student,
            ) =>
              total +
              (student.profile
                ?.xp ??
                0),
            0,
          ) /
            students.length,
        )
      : 0;

  const averageStreak =
    students.length > 0
      ? Math.round(
          students.reduce(
            (
              total,
              student,
            ) =>
              total +
              (student.profile
                ?.streak ??
                0),
            0,
          ) /
            students.length,
        )
      : 0;

  function clearFilters() {
    setSearchTerm("");
    setCourseFilter(
      "all",
    );
    setMembershipFilter(
      "all",
    );
  }

  if (
    authLoading ||
    !profileReady ||
    loading
  ) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-44 rounded-3xl" />

        <div className="grid gap-5 md:grid-cols-4">
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-28 rounded-3xl" />
        </div>

        <Skeleton className="h-72 rounded-3xl" />
        <Skeleton className="h-72 rounded-3xl" />
      </div>
    );
  }

  if (
    profile?.role !==
      "teacher" &&
    profile?.role !==
      "admin"
  ) {
    return (
      <Card className="border border-red-200 bg-red-50">
        <h1 className="text-2xl font-black text-red-950">
          Teacher access required
        </h1>
      </Card>
    );
  }

  if (
    !schoolId
  ) {
    return (
      <Card className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
        <h1 className="text-2xl font-black text-amber-950">
          School membership required
        </h1>

        <p className="mt-3 text-amber-800">
          Set up or join your school organisation before opening the school student directory.
        </p>

        <Link
          href="/teacher/school"
          className="mt-5 inline-flex rounded-xl bg-amber-700 px-5 py-3 font-black text-white"
        >
          Open School
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 p-7 text-white shadow-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100">
              Teacher Portal
            </p>

            <h1 className="mt-2 text-3xl font-black">
              Student Directory
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
              One school learner record with every teaching-group membership kept visible underneath it.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/teacher/classes"
              className="rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-black text-white"
            >
              View Classes
            </Link>

            <Link
              href="/teacher"
              className="rounded-xl bg-white px-4 py-3 text-sm font-black text-indigo-800"
            >
              ← Teacher Dashboard
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total students"
          value={
            students.length
          }
          description="Unique active school learners"
          icon={
            <GraduationCap className="h-5 w-5" />
          }
        />

        <MetricCard
          label="Enrolled"
          value={
            enrolledCount
          }
          description="Learners linked to one or more classes"
          icon={
            <School className="h-5 w-5" />
          }
        />

        <MetricCard
          label="Unassigned"
          value={
            unassignedCount
          }
          description="Not currently in a class"
          icon={
            <Pin className="h-5 w-5" />
          }
        />

        <MetricCard
          label="Average XP"
          value={
            averageXp
          }
          description={`${averageStreak}-day average streak`}
          icon={
            <Star className="h-5 w-5" />
          }
        />
      </div>

      <Card className="overflow-hidden rounded-3xl border border-slate-200 p-0">
        <div className="border-b border-slate-200 px-6 py-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-teal-600">
            Student intelligence
          </p>

          <h2 className="mt-1 text-2xl font-black text-slate-950">
            Attainment overview
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Each learner appears once. Class-specific attainment remains visible inside the learner row.
          </p>
        </div>

        {students.length ===
        0 ? (
          <EmptyState
            title="No school students yet"
            description="Students will appear after joining this school organisation."
          />
        ) : (
          <div className="divide-y divide-slate-200">
            {students.map(
              (student) => {
                const overallPriority =
                  highestPriority(
                    student.classContexts,
                  );

                const completion =
                  averageCompletion(
                    student.classContexts,
                  );

                return (
                  <div
                    key={
                      student.uid
                    }
                    className="px-6 py-5"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-black text-blue-700">
                            {getInitials(
                              student.name,
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-black text-slate-950">
                              {
                                student.name
                              }
                            </p>

                            <p className="truncate text-sm text-slate-500">
                              {student.email ||
                                "No email address"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {student.classContexts.length >
                          0 ? (
                            student.classContexts.map(
                              (
                                context,
                              ) => (
                                <Link
                                  key={
                                    context.classId
                                  }
                                  href={`/teacher/classes/${context.classId}`}
                                  className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700 transition hover:bg-blue-100"
                                >
                                  {
                                    context.className
                                  }
                                </Link>
                              ),
                            )
                          ) : (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                              No class
                            </span>
                          )}

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black ${priorityTone(
                              overallPriority,
                            )}`}
                          >
                            {priorityLabel(
                              overallPriority,
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-3 xl:max-w-3xl">
                        <MiniMetric
                          label="Classes"
                          value={
                            student
                              .classContexts
                              .length
                          }
                        />

                        <MiniMetric
                          label="Avg completion"
                          value={`${completion}%`}
                        />

                        <MiniMetric
                          label="Course"
                          value={`${formatExamBoard(
                            String(
                              student.profile
                                ?.examBoard ??
                                "",
                            ),
                          )} · ${formatQualification(
                            String(
                              student.profile
                                ?.qualification ??
                                "",
                            ),
                          )}`}
                        />
                      </div>

                      <Link
                        href={`/teacher/analytics/${student.uid}`}
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white"
                      >
                        Intelligence
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>

                    {student.classContexts.length >
                      0 && (
                      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="min-w-full text-left text-sm">
                          <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                            <tr>
                              <th className="px-4 py-3">
                                Class
                              </th>

                              <th className="px-4 py-3">
                                Working
                              </th>

                              <th className="px-4 py-3">
                                Target
                              </th>

                              <th className="px-4 py-3">
                                Trend
                              </th>

                              <th className="px-4 py-3">
                                Completion
                              </th>

                              <th className="px-4 py-3">
                                Priority
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-slate-100 bg-white">
                            {student.classContexts.map(
                              (
                                context,
                              ) => (
                                <tr
                                  key={
                                    context.classId
                                  }
                                >
                                  <td className="px-4 py-3 font-bold text-slate-900">
                                    {
                                      context.className
                                    }
                                  </td>

                                  <td className="px-4 py-3">
                                    {
                                      context.workingGrade
                                    }
                                  </td>

                                  <td className="px-4 py-3">
                                    {
                                      context.targetGrade
                                    }
                                  </td>

                                  <td className="px-4 py-3 capitalize">
                                    {
                                      context.trend
                                    }
                                  </td>

                                  <td className="px-4 py-3 font-bold">
                                    {
                                      context.completionRate
                                    }
                                    %
                                  </td>

                                  <td className="px-4 py-3">
                                    <span
                                      className={`rounded-full px-2.5 py-1 text-xs font-black ${priorityTone(
                                        context.priority,
                                      )}`}
                                    >
                                      {priorityLabel(
                                        context.priority,
                                      )}
                                    </span>
                                  </td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>
        )}
      </Card>

      <Card className="rounded-3xl border border-slate-200 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-indigo-600">
              Search and filter
            </p>

            <h2 className="mt-1 text-xl font-black text-slate-950">
              Find Students
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Search the current school directory by learner, email, class or course.
            </p>
          </div>

          <p className="text-sm font-bold text-slate-500">
            Showing{" "}
            <span className="text-slate-950">
              {
                filteredStudents.length
              }
            </span>{" "}
            of{" "}
            <span className="text-slate-950">
              {students.length}
            </span>
          </p>
        </div>

        <div className="mt-5 grid gap-3 xl:grid-cols-[1fr_180px_180px_auto]">
          <label className="relative">
            <span className="sr-only">
              Search students
            </span>

            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={
                searchTerm
              }
              onChange={(
                event,
              ) =>
                setSearchTerm(
                  event.target
                    .value,
                )
              }
              placeholder="Search by name, email or class..."
              className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4"
            />
          </label>

          <select
            value={
              courseFilter
            }
            onChange={(
              event,
            ) =>
              setCourseFilter(
                event.target
                  .value as
                  CourseFilter,
              )
            }
            className="rounded-xl border border-slate-300 px-4 py-3"
          >
            <option value="all">
              All courses
            </option>

            <option value="gcse">
              GCSE
            </option>

            <option value="a-level">
              A Level
            </option>

            <option value="other">
              Course not set
            </option>
          </select>

          <select
            value={
              membershipFilter
            }
            onChange={(
              event,
            ) =>
              setMembershipFilter(
                event.target
                  .value as
                  MembershipFilter,
              )
            }
            className="rounded-xl border border-slate-300 px-4 py-3"
          >
            <option value="all">
              All students
            </option>

            <option value="enrolled">
              Enrolled
            </option>

            <option value="unassigned">
              Unassigned
            </option>
          </select>

          <button
            type="button"
            onClick={
              clearFilters
            }
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-black text-slate-700"
          >
            Clear
          </button>
        </div>
      </Card>

      <Card className="overflow-hidden rounded-3xl border border-slate-200 p-0">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
              Registered accounts
            </p>

            <h2 className="mt-1 text-xl font-black text-slate-950">
              School Students
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              These are unique active student accounts belonging to your school.
            </p>
          </div>

          <Link
            href="/teacher/classes"
            className="rounded-xl bg-violet-600 px-4 py-3 text-sm font-black text-white"
          >
            Manage Classes
          </Link>
        </div>

        {error ? (
          <div className="p-8">
            <p className="font-black text-red-700">
              Student directory unavailable
            </p>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          </div>
        ) : filteredStudents.length ===
          0 ? (
          <EmptyState
            title="No student accounts found"
            description={
              students.length ===
              0
                ? "Students will appear after joining your school."
                : "No school students match the current filters."
            }
          />
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredStudents.map(
              (student) => (
                <div
                  key={
                    student.uid
                  }
                  className="grid gap-4 px-6 py-5 lg:grid-cols-[1.3fr_1.3fr_1fr_auto] lg:items-center"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-black text-indigo-700">
                      {getInitials(
                        student.name,
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-black text-slate-950">
                        {
                          student.name
                        }
                      </p>

                      <p className="truncate text-sm text-slate-500">
                        {student.email ||
                          "No email address"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {student.classContexts.length >
                    0 ? (
                      student.classContexts.map(
                        (
                          context,
                        ) => (
                          <span
                            key={
                              context.classId
                            }
                            className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700"
                          >
                            {
                              context.className
                            }
                          </span>
                        ),
                      )
                    ) : (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                        Unassigned
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-black text-slate-900">
                      {formatQualification(
                        String(
                          student.profile
                            ?.qualification ??
                            "",
                        ),
                      )}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatExamBoard(
                        String(
                          student.profile
                            ?.examBoard ??
                            "",
                        ),
                      )}{" "}
                      ·{" "}
                      {
                        student.classContexts
                          .length
                      }{" "}
                      class
                      {student.classContexts
                        .length ===
                      1
                        ? ""
                        : "es"}
                    </p>
                  </div>

                  <Link
                    href={`/teacher/analytics/${student.uid}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-800"
                  >
                    <Sparkles className="h-4 w-4 text-violet-600" />
                    Intelligence
                  </Link>
                </div>
              ),
            )}
          </div>
        )}
      </Card>

      <Card className="rounded-3xl border border-teal-200 bg-teal-50 p-5">
        <div className="flex items-start gap-3">
          <BookOpenCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />

          <div>
            <p className="font-black text-teal-950">
              Multi-class learner model
            </p>

            <p className="mt-1 text-sm leading-6 text-teal-800">
              A learner appears once in this directory even when enrolled in several classes. Analytics and interventions continue to preserve separate class contexts.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function MetricCard({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value:
    | number
    | string;
  description: string;
  icon:
    ReactNode;
}) {
  return (
    <Card className="rounded-3xl border border-slate-200 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-black text-slate-950">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-3 text-slate-700">
          {icon}
        </div>
      </div>
    </Card>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value:
    | number
    | string;
}) {
  return (
    <div className="min-w-0 rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 truncate font-black text-slate-950">
        {value}
      </p>
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
    <div className="p-10 text-center">
      <GraduationCap className="mx-auto h-10 w-10 text-slate-300" />

      <p className="mt-4 font-black text-slate-950">
        {title}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}
