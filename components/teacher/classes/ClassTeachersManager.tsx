

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  addCoTeacherToClass,
  removeCoTeacherFromClass,
  type TeacherClass,
} from "@/services/classService";

import {
  getEligibleCoTeachers,
  getSchoolMembers,
  type SchoolMemberRecord,
} from "@/services/schoolMemberService";

type Props = {
  teacherClass: TeacherClass;
  isClassOwner: boolean;

  onUpdated: (
    updatedClass: TeacherClass,
  ) => void;
};

function getErrorMessage(
  error: unknown,
): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

function TeacherAvatar({
  name,
}: {
  name: string;
}) {
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0).toUpperCase(),
      )
      .join("") || "T";

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
      {initials}
    </div>
  );
}

export default function ClassTeachersManager({
  teacherClass,
  isClassOwner,
  onUpdated,
}: Props) {
  const [
    schoolMembers,
    setSchoolMembers,
  ] = useState<
    SchoolMemberRecord[]
  >([]);

  const [
    eligibleTeachers,
    setEligibleTeachers,
  ] = useState<
    SchoolMemberRecord[]
  >([]);

  const [
    selectedTeacherId,
    setSelectedTeacherId,
  ] = useState("");

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    removingTeacherId,
    setRemovingTeacherId,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const loadTeachers =
    useCallback(
      async () => {
        if (!teacherClass.schoolId) {
          setSchoolMembers([]);
          setEligibleTeachers([]);
          setError(
            "This class is not linked to a school.",
          );
          setIsLoading(false);
          return;
        }

        try {
          setIsLoading(true);
          setError("");

          const members =
            await getSchoolMembers(
              teacherClass.schoolId,
            );

          setSchoolMembers(
            members,
          );

          if (isClassOwner) {
            const eligible =
              await getEligibleCoTeachers(
                teacherClass.schoolId,
                teacherClass.teacherId,
                teacherClass.coTeacherIds,
              );

            setEligibleTeachers(
              eligible,
            );
          } else {
            setEligibleTeachers(
              [],
            );
          }
        } catch (
          loadError: unknown
        ) {
          setError(
            getErrorMessage(
              loadError,
            ),
          );
        } finally {
          setIsLoading(false);
        }
      },
      [
        teacherClass.schoolId,
        teacherClass.teacherId,
        teacherClass.coTeacherIds,
        isClassOwner,
      ],
    );

  useEffect(() => {
    let cancelled = false;

    void Promise.resolve().then(() => {
      if (!cancelled) {
        return loadTeachers();
      }

      return undefined;
    });

    return () => {
      cancelled = true;
    };
  }, [loadTeachers]);

  const memberById =
    useMemo(() => {
      return new Map(
        schoolMembers.map(
          (member) => [
            member.uid,
            member,
          ],
        ),
      );
    }, [schoolMembers]);

  const owner =
    memberById.get(
      teacherClass.teacherId,
    );

  const ownerName =
    owner?.name ||
    teacherClass.teacherName ||
    "Class owner";

  const ownerEmail =
    owner?.email || "";

  const coTeachers =
    useMemo(() => {
      return teacherClass.coTeacherIds.map(
        (teacherId) => {
          const member =
            memberById.get(
              teacherId,
            );

          return {
            uid: teacherId,

            name:
              member?.name ||
              "Co-teacher",

            email:
              member?.email ||
              "",
          };
        },
      );
    }, [
      teacherClass.coTeacherIds,
      memberById,
    ]);

  async function handleAddTeacher() {
    if (
      !isClassOwner ||
      !selectedTeacherId
    ) {
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setSuccessMessage("");

      await addCoTeacherToClass(
        teacherClass.id,
        teacherClass.teacherId,
        selectedTeacherId,
      );

      const selectedTeacher =
        eligibleTeachers.find(
          (teacher) =>
            teacher.uid ===
            selectedTeacherId,
        );

      const updatedClass: TeacherClass =
        {
          ...teacherClass,

          coTeacherIds:
            Array.from(
              new Set([
                ...teacherClass.coTeacherIds,
                selectedTeacherId,
              ]),
            ),
        };

      onUpdated(
        updatedClass,
      );

      setSelectedTeacherId(
        "",
      );

      setSuccessMessage(
        selectedTeacher
          ? `${selectedTeacher.name} can now manage this class.`
          : "The co-teacher was added successfully.",
      );
    } catch (
      addError: unknown
    ) {
      setError(
        getErrorMessage(
          addError,
        ),
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRemoveTeacher(
    coTeacherId: string,
  ) {
    if (!isClassOwner) {
      return;
    }

    const teacher =
      memberById.get(
        coTeacherId,
      );

    const teacherName =
      teacher?.name ||
      "this co-teacher";

    const confirmed =
      window.confirm(
        `Remove ${teacherName} from this class?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setRemovingTeacherId(
        coTeacherId,
      );

      setError("");
      setSuccessMessage("");

      await removeCoTeacherFromClass(
        teacherClass.id,
        teacherClass.teacherId,
        coTeacherId,
      );

      const updatedClass: TeacherClass =
        {
          ...teacherClass,

          coTeacherIds:
            teacherClass.coTeacherIds.filter(
              (teacherId) =>
                teacherId !==
                coTeacherId,
            ),
        };

      onUpdated(
        updatedClass,
      );

      setSuccessMessage(
        `${teacherName} was removed from this class.`,
      );
    } catch (
      removeError: unknown
    ) {
      setError(
        getErrorMessage(
          removeError,
        ),
      );
    } finally {
      setRemovingTeacherId(
        "",
      );
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Manage teachers
          </h2>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Teachers listed here can
            work with this class.
            The original class owner
            remains the permanent owner.
          </p>
        </div>

        <span className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          {1 +
            teacherClass
              .coTeacherIds
              .length}{" "}
          {1 +
            teacherClass
              .coTeacherIds
              .length ===
          1
            ? "teacher"
            : "teachers"}
        </span>
      </div>

      {error && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

      {isLoading ? (
        <div className="mt-6 space-y-3">
          <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />

          <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      ) : (
        <>
          <div className="mt-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
              Class owner
            </p>

            <div className="flex items-center gap-4 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4">
              <TeacherAvatar
                name={ownerName}
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-semibold text-slate-900">
                    {ownerName}
                  </p>

                  <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                    Owner
                  </span>
                </div>

                {ownerEmail && (
                  <p className="mt-1 truncate text-sm text-slate-500">
                    {ownerEmail}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
              Co-teachers
            </p>

            {coTeachers.length ===
            0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-7 text-center">
                <p className="font-semibold text-slate-800">
                  No co-teachers yet
                </p>

                <p className="mx-auto mt-1 max-w-lg text-sm leading-6 text-slate-500">
                  {isClassOwner
                    ? "Add another teacher from your school to help manage this class."
                    : "The class owner has not added any additional teachers."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {coTeachers.map(
                  (teacher) => (
                    <div
                      key={
                        teacher.uid
                      }
                      className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <TeacherAvatar
                          name={
                            teacher.name
                          }
                        />

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate font-semibold text-slate-900">
                              {
                                teacher.name
                              }
                            </p>

                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                              Co-teacher
                            </span>
                          </div>

                          {teacher.email && (
                            <p className="mt-1 truncate text-sm text-slate-500">
                              {
                                teacher.email
                              }
                            </p>
                          )}
                        </div>
                      </div>

                      {isClassOwner && (
                        <button
                          type="button"
                          disabled={
                            removingTeacherId ===
                            teacher.uid
                          }
                          onClick={() =>
                            void handleRemoveTeacher(
                              teacher.uid,
                            )
                          }
                          className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {removingTeacherId ===
                          teacher.uid
                            ? "Removing..."
                            : "Remove"}
                        </button>
                      )}
                    </div>
                  ),
                )}
              </div>
            )}
          </div>

          {isClassOwner && (
            <div className="mt-7 border-t border-slate-200 pt-6">
              <h3 className="font-bold text-slate-900">
                Add a co-teacher
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Only active teaching
                staff from this school
                can be added.
              </p>

              {eligibleTeachers.length ===
              0 ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                  There are no other
                  eligible teachers
                  available to add.
                </div>
              ) : (
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <select
                    value={
                      selectedTeacherId
                    }
                    onChange={(event) =>
                      setSelectedTeacherId(
                        event.target
                          .value,
                      )
                    }
                    disabled={
                      isSaving
                    }
                    className="min-h-11 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                  >
                    <option value="">
                      Select a teacher
                    </option>

                    {eligibleTeachers.map(
                      (
                        teacher,
                      ) => (
                        <option
                          key={
                            teacher.uid
                          }
                          value={
                            teacher.uid
                          }
                        >
                          {
                            teacher.name
                          }
                          {teacher.email
                            ? ` — ${teacher.email}`
                            : ""}
                        </option>
                      ),
                    )}
                  </select>

                  <button
                    type="button"
                    disabled={
                      isSaving ||
                      !selectedTeacherId
                    }
                    onClick={() =>
                      void handleAddTeacher()
                    }
                    className="min-h-11 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {isSaving
                      ? "Adding..."
                      : "Add teacher"}
                  </button>
                </div>
              )}
            </div>
          )}

          {!isClassOwner && (
            <div className="mt-7 rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm leading-6 text-blue-800">
                You are a co-teacher
                for this class. Only
                the permanent class
                owner can add or remove
                other teachers.
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}