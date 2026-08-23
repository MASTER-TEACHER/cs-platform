"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";

import {
  createSchool,
  getSchoolById,
} from "@/services/schoolService";

import {
  createSchoolInvite,
  type SchoolInviteRole,
} from "@/services/schoolInvitationService";

import {
  getSchoolMembers,
  type SchoolMemberRecord,
} from "@/services/schoolMemberService";

import type { School } from "@/types/school";

type SchoolTab =
  | "students"
  | "staff"
  | "invitations";

function formatQualification(
  value: string,
): string {
  if (value === "A_LEVEL") {
    return "A Level";
  }

  return value || "Not selected";
}

function formatDate(
  value: Date | null,
): string {
  if (!value) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(value);
}

export default function TeacherSchoolPage() {
  const {
    user,
    profile,
    loading:
      authLoading,
    profileReady,
    refreshProfile,
  } = useAuth();

  const [school, setSchool] =
    useState<School | null>(
      null,
    );

  const [members, setMembers] =
    useState<
      SchoolMemberRecord[]
    >([]);

  const [loading, setLoading] =
    useState(true);

  const [
    schoolName,
    setSchoolName,
  ] = useState("");

  const [creating, setCreating] =
    useState(false);

  const [
    generatingRole,
    setGeneratingRole,
  ] =
    useState<
      SchoolInviteRole | null
    >(null);

  const [
    latestCode,
    setLatestCode,
  ] = useState<{
    role: SchoolInviteRole;
    code: string;
  } | null>(null);

  const [tab, setTab] =
    useState<SchoolTab>(
      "students",
    );

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    qualificationFilter,
    setQualificationFilter,
  ] = useState("all");

  const [
    examBoardFilter,
    setExamBoardFilter,
  ] = useState("all");

  const schoolId =
    profile?.schoolId?.trim() ||
    "";

  async function loadSchoolData(
    targetSchoolId: string,
  ) {
    const [
      loadedSchool,
      loadedMembers,
    ] = await Promise.all([
      getSchoolById(
        targetSchoolId,
      ),
      getSchoolMembers(
        targetSchoolId,
      ),
    ]);

    setSchool(
      loadedSchool,
    );

    setMembers(
      loadedMembers,
    );
  }

  useEffect(() => {
    if (
      authLoading ||
      !profileReady
    ) {
      return;
    }

    let cancelled = false;

    async function load() {
      if (!schoolId) {
        if (!cancelled) {
          setSchool(null);
          setMembers([]);
          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);

        await loadSchoolData(
          schoolId,
        );
      } catch (error) {
        console.error(
          "Unable to load school:",
          error,
        );

        if (!cancelled) {
          toast.error(
            "Your school information could not be loaded.",
          );
        }
      } finally {
        if (!cancelled) {
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
    schoolId,
  ]);

  const activeMembers =
    useMemo(
      () =>
        members.filter(
          (member) =>
            member.status ===
            "active",
        ),
      [members],
    );

  const students =
    useMemo(
      () =>
        activeMembers.filter(
          (member) =>
            member.membershipRole ===
            "student",
        ),
      [activeMembers],
    );

  const staff =
    useMemo(
      () =>
        activeMembers.filter(
          (member) =>
            member.membershipRole ===
              "teacher" ||
            member.membershipRole ===
              "school_admin",
        ),
      [activeMembers],
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
            student.name
              .toLowerCase()
              .includes(
                search,
              ) ||
            student.email
              .toLowerCase()
              .includes(
                search,
              );

          const matchesQualification =
            qualificationFilter ===
              "all" ||
            student.qualification ===
              qualificationFilter;

          const matchesExamBoard =
            examBoardFilter ===
              "all" ||
            student.examBoard ===
              examBoardFilter;

          return (
            matchesSearch &&
            matchesQualification &&
            matchesExamBoard
          );
        },
      );
    }, [
      students,
      searchTerm,
      qualificationFilter,
      examBoardFilter,
    ]);

  const filteredStaff =
    useMemo(() => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();

      if (!search) {
        return staff;
      }

      return staff.filter(
        (member) =>
          member.name
            .toLowerCase()
            .includes(search) ||
          member.email
            .toLowerCase()
            .includes(search),
      );
    }, [
      staff,
      searchTerm,
    ]);

  async function handleCreateSchool() {
    if (!user?.uid) {
      toast.error(
        "A teacher account is required.",
      );
      return;
    }

    try {
      setCreating(true);

      const createdSchoolId =
        await createSchool({
          name:
            schoolName,
          ownerUserId:
            user.uid,
        });

      await refreshProfile();

      await loadSchoolData(
        createdSchoolId,
      );

      setSchoolName("");

      toast.success(
        "School created successfully.",
      );
    } catch (error) {
      console.error(
        "Unable to create school:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "The school could not be created.",
      );
    } finally {
      setCreating(false);
    }
  }

  async function generateJoinCode(
    role: SchoolInviteRole,
  ) {
    if (
      !user?.uid ||
      !schoolId
    ) {
      return;
    }

    try {
      setGeneratingRole(
        role,
      );

      const code =
        await createSchoolInvite({
          schoolId,
          createdBy:
            user.uid,
          role,
        });

      setLatestCode({
        role,
        code,
      });

      toast.success(
        `${
          role === "student"
            ? "Student"
            : "Teacher"
        } join code created.`,
      );
    } catch (error) {
      console.error(
        "Unable to create join code:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "A join code could not be created.",
      );
    } finally {
      setGeneratingRole(
        null,
      );
    }
  }

  async function copyCode(
    code:
      string = latestCode?.code ||
      "",
  ) {
    if (!code) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        code,
      );

      toast.success(
        "Join code copied.",
      );
    } catch {
      toast.error(
        "Copy the code manually.",
      );
    }
  }

  if (
    authLoading ||
    !profileReady ||
    loading
  ) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-52 rounded-3xl" />

        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
        </div>

        <Skeleton className="h-96 rounded-3xl" />
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
      <Card className="rounded-3xl border border-red-200 bg-red-50 p-7">
        <h1 className="text-2xl font-black text-red-950">
          Teacher access required
        </h1>

        <p className="mt-3 text-red-700">
          School administration is available to teacher and administrator accounts.
        </p>
      </Card>
    );
  }

  if (
    !schoolId ||
    !school
  ) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Card className="rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-8">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-teal-700">
            School setup
          </p>

          <h1 className="mt-3 text-3xl font-black text-slate-950">
            Create your school organisation
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Creating a school separates your teachers and students from every
            other organisation in CS Master. Student directories and class
            enrolment will be scoped to this school.
          </p>
        </Card>

        <Card className="rounded-3xl border border-slate-200 p-7">
          <label className="block">
            <span className="text-sm font-bold text-slate-700">
              School name
            </span>

            <input
              type="text"
              value={
                schoolName
              }
              onChange={(
                event,
              ) =>
                setSchoolName(
                  event
                    .target
                    .value,
                )
              }
              placeholder="e.g. The Norwood School"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </label>

          <button
            type="button"
            onClick={() =>
              void handleCreateSchool()
            }
            disabled={
              creating ||
              !schoolName.trim()
            }
            className="mt-5 rounded-xl bg-teal-600 px-6 py-3 font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating
              ? "Creating school..."
              : "Create school"}
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-8">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-teal-700">
          School organisation
        </p>

        <h1 className="mt-3 text-3xl font-black text-slate-950">
          {school.name}
        </h1>

        <p className="mt-2 text-slate-600">
          School ID:{" "}
          <span className="font-mono font-bold text-slate-800">
            {school.id}
          </span>
        </p>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Metric
          label="Students"
          value={
            students.length
          }
          description="Active school students"
        />

        <Metric
          label="Staff"
          value={
            staff.length
          }
          description="Teachers and school admins"
        />

        <Metric
          label="Members"
          value={
            activeMembers.length
          }
          description="All active school members"
        />
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2">
        <TabButton
          active={
            tab === "students"
          }
          onClick={() =>
            setTab(
              "students",
            )
          }
        >
          Students ({students.length})
        </TabButton>

        <TabButton
          active={
            tab === "staff"
          }
          onClick={() =>
            setTab(
              "staff",
            )
          }
        >
          Staff ({staff.length})
        </TabButton>

        <TabButton
          active={
            tab ===
            "invitations"
          }
          onClick={() =>
            setTab(
              "invitations",
            )
          }
        >
          Invitations
        </TabButton>
      </div>

      {tab !==
        "invitations" && (
        <Card className="rounded-3xl border border-slate-200 p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="md:col-span-2">
              <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                Search
              </span>

              <input
                type="search"
                value={
                  searchTerm
                }
                onChange={(
                  event,
                ) =>
                  setSearchTerm(
                    event
                      .target
                      .value,
                  )
                }
                placeholder={
                  tab ===
                  "students"
                    ? "Search students by name or email..."
                    : "Search staff by name or email..."
                }
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </label>

            {tab ===
              "students" && (
              <div className="grid grid-cols-2 gap-3">
                <label>
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                    Level
                  </span>

                  <select
                    value={
                      qualificationFilter
                    }
                    onChange={(
                      event,
                    ) =>
                      setQualificationFilter(
                        event
                          .target
                          .value,
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3"
                  >
                    <option value="all">
                      All
                    </option>
                    <option value="GCSE">
                      GCSE
                    </option>
                    <option value="A_LEVEL">
                      A Level
                    </option>
                  </select>
                </label>

                <label>
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                    Board
                  </span>

                  <select
                    value={
                      examBoardFilter
                    }
                    onChange={(
                      event,
                    ) =>
                      setExamBoardFilter(
                        event
                          .target
                          .value,
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3"
                  >
                    <option value="all">
                      All
                    </option>
                    <option value="AQA">
                      AQA
                    </option>
                    <option value="OCR">
                      OCR
                    </option>
                    <option value="EDEXCEL">
                      Edexcel
                    </option>
                  </select>
                </label>
              </div>
            )}
          </div>
        </Card>
      )}

      {tab ===
        "students" && (
        <StudentDirectory
          students={
            filteredStudents
          }
        />
      )}

      {tab ===
        "staff" && (
        <StaffDirectory
          staff={
            filteredStaff
          }
        />
      )}

      {tab ===
        "invitations" && (
        <InvitationsPanel
          latestCode={
            latestCode
          }
          generatingRole={
            generatingRole
          }
          onGenerate={
            generateJoinCode
          }
          onCopy={
            copyCode
          }
        />
      )}
    </div>
  );
}

function StudentDirectory({
  students,
}: {
  students:
    SchoolMemberRecord[];
}) {
  return (
    <Card className="rounded-3xl border border-slate-200 p-7">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.14em] text-blue-600">
            Student directory
          </p>

          <h2 className="mt-2 text-2xl font-black text-slate-950">
            Students
          </h2>
        </div>

        <p className="text-sm font-bold text-slate-500">
          {students.length} shown
        </p>
      </div>

      {students.length ===
      0 ? (
        <p className="mt-6 rounded-2xl bg-slate-50 p-6 text-slate-600">
          No students match the current filters.
        </p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <div className="hidden grid-cols-[1.3fr_1.4fr_.8fr_.8fr_.7fr] gap-4 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 lg:grid">
            <span>Name</span>
            <span>Email</span>
            <span>Qualification</span>
            <span>Exam board</span>
            <span>Classes</span>
          </div>

          <div className="divide-y divide-slate-200">
            {students.map(
              (student) => (
                <div
                  key={
                    student.uid
                  }
                  className="grid gap-2 px-5 py-4 lg:grid-cols-[1.3fr_1.4fr_.8fr_.8fr_.7fr] lg:items-center"
                >
                  <p className="font-bold text-slate-900">
                    {student.name}
                  </p>

                  <p className="truncate text-sm text-slate-600">
                    {student.email ||
                      "No email"}
                  </p>

                  <p className="text-sm font-semibold text-slate-700">
                    {formatQualification(
                      student.qualification,
                    )}
                  </p>

                  <p className="text-sm font-semibold text-slate-700">
                    {student.examBoard ||
                      "Not selected"}
                  </p>

                  <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    {
                      student
                        .classIds
                        .length
                    }{" "}
                    class
                    {student
                      .classIds
                      .length ===
                    1
                      ? ""
                      : "es"}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

function StaffDirectory({
  staff,
}: {
  staff:
    SchoolMemberRecord[];
}) {
  return (
    <Card className="rounded-3xl border border-slate-200 p-7">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.14em] text-violet-600">
            Staff directory
          </p>

          <h2 className="mt-2 text-2xl font-black text-slate-950">
            Teachers & administrators
          </h2>
        </div>

        <p className="text-sm font-bold text-slate-500">
          {staff.length} shown
        </p>
      </div>

      {staff.length ===
      0 ? (
        <p className="mt-6 rounded-2xl bg-slate-50 p-6 text-slate-600">
          No staff match the current search.
        </p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <div className="hidden grid-cols-[1.3fr_1.5fr_.8fr_.8fr] gap-4 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 lg:grid">
            <span>Name</span>
            <span>Email</span>
            <span>School role</span>
            <span>Joined</span>
          </div>

          <div className="divide-y divide-slate-200">
            {staff.map(
              (member) => (
                <div
                  key={
                    member.uid
                  }
                  className="grid gap-2 px-5 py-4 lg:grid-cols-[1.3fr_1.5fr_.8fr_.8fr] lg:items-center"
                >
                  <p className="font-bold text-slate-900">
                    {member.name}
                  </p>

                  <p className="truncate text-sm text-slate-600">
                    {member.email ||
                      "No email"}
                  </p>

                  <span className="w-fit rounded-full bg-violet-50 px-3 py-1 text-xs font-bold capitalize text-violet-700">
                    {member.membershipRole.replace(
                      "_",
                      " ",
                    )}
                  </span>

                  <p className="text-sm text-slate-600">
                    {formatDate(
                      member.joinedAt,
                    )}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

function InvitationsPanel({
  latestCode,
  generatingRole,
  onGenerate,
  onCopy,
}: {
  latestCode: {
    role: SchoolInviteRole;
    code: string;
  } | null;
  generatingRole:
    SchoolInviteRole | null;
  onGenerate: (
    role:
      SchoolInviteRole,
  ) => Promise<void>;
  onCopy: (
    code?: string,
  ) => Promise<void>;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-3xl border border-blue-200 bg-blue-50 p-7">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-blue-700">
            Student enrolment
          </p>

          <h2 className="mt-2 text-2xl font-black text-blue-950">
            Invite students
          </h2>

          <p className="mt-3 leading-6 text-blue-800">
            Generate a single-use code for an existing CS Master student account.
          </p>

          <button
            type="button"
            onClick={() =>
              void onGenerate(
                "student",
              )
            }
            disabled={
              Boolean(
                generatingRole,
              )
            }
            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {generatingRole ===
            "student"
              ? "Generating..."
              : "Generate student code"}
          </button>
        </Card>

        <Card className="rounded-3xl border border-violet-200 bg-violet-50 p-7">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-violet-700">
            Staff membership
          </p>

          <h2 className="mt-2 text-2xl font-black text-violet-950">
            Invite teachers
          </h2>

          <p className="mt-3 leading-6 text-violet-800">
            Generate a code for an existing approved teacher account.
          </p>

          <button
            type="button"
            onClick={() =>
              void onGenerate(
                "teacher",
              )
            }
            disabled={
              Boolean(
                generatingRole,
              )
            }
            className="mt-5 rounded-xl bg-violet-600 px-5 py-3 font-bold text-white hover:bg-violet-700 disabled:opacity-60"
          >
            {generatingRole ===
            "teacher"
              ? "Generating..."
              : "Generate teacher code"}
          </button>
        </Card>
      </div>

      {latestCode && (
        <Card className="rounded-3xl border-2 border-emerald-300 bg-emerald-50 p-7">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-emerald-700">
            Latest{" "}
            {latestCode.role ===
            "student"
              ? "student"
              : "teacher"}{" "}
            join code
          </p>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-4xl font-black tracking-[0.18em] text-emerald-950">
              {latestCode.code}
            </p>

            <button
              type="button"
              onClick={() =>
                void onCopy(
                  latestCode.code,
                )
              }
              className="rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white hover:bg-emerald-800"
            >
              Copy code
            </button>
          </div>
        </Card>
      )}

      <Card className="rounded-3xl border border-slate-200 p-6">
        <p className="text-sm leading-6 text-slate-600">
          Join codes are single-use and expire after 14 days. Generate a new code
          whenever you need to invite another student or approved teacher.
        </p>
      </Card>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children:
    ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-5 py-3 text-sm font-black transition ${
        active
          ? "bg-teal-600 text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
      }`}
    >
      {children}
    </button>
  );
}

function Metric({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <Card className="rounded-3xl border border-slate-200 p-6">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-slate-950">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>
    </Card>
  );
}
