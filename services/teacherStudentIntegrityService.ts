import {
  getTeacherClasses,
} from "@/services/classService";
import {
  getSchoolMembers,
} from "@/services/schoolMemberService";
import {
  getTeacherAnalyticsPortfolio,
} from "@/services/analytics/teacherAnalyticsService";
import {
  getStudentAnalytics,
} from "@/services/studentAnalyticsService";

export type TeacherStudentBoundaryCheck = {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
};

export type TeacherStudentBoundarySnapshot = {
  teacherId: string;
  schoolId: string;
  generatedAt: Date;
  checks: TeacherStudentBoundaryCheck[];
  metrics: {
    schoolStudents: number;
    teacherClasses: number;
    rosterStudents: number;
    analyticsStudents: number;
    analyticsClasses: number;
  };
};

function errorMessage(
  error: unknown,
): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (
      error as {
        code?: unknown;
      }
    ).code === "string"
  ) {
    const code = (
      error as {
        code: string;
      }
    ).code;

    if (
      code === "permission-denied" ||
      code === "firestore/permission-denied"
    ) {
      return "PERMISSION DENIED";
    }

    return code;
  }

  if (
    error instanceof Error
  ) {
    const message =
      error.message.trim();

    const lower =
      message.toLowerCase();

    if (
      lower.includes(
        "insufficient permissions",
      ) ||
      lower.includes(
        "permission-denied",
      )
    ) {
      return "PERMISSION DENIED";
    }

    return (
      message ||
      "Unknown error"
    );
  }

  return "Unknown error";
}

function failedCheck(
  id: string,
  label: string,
  source: string,
  error: unknown,
): TeacherStudentBoundaryCheck {
  return {
    id,
    label,
    passed: false,
    detail:
      `${source} failed: ${errorMessage(error)}.`,
  };
}

export async function getTeacherStudentBoundarySnapshot({
  teacherId,
  schoolId,
}: {
  teacherId: string;
  schoolId: string;
}): Promise<TeacherStudentBoundarySnapshot> {
  const cleanedTeacherId =
    teacherId.trim();

  const cleanedSchoolId =
    schoolId.trim();

  if (!cleanedTeacherId) {
    throw new Error(
      "A teacher account is required.",
    );
  }

  if (!cleanedSchoolId) {
    throw new Error(
      "The teacher account must belong to a school before T1H can run.",
    );
  }

  /*
   * As with T1G, every major data source is isolated.
   * One permission failure must not hide the remaining boundary checks.
   */
  const [
    membersResult,
    classesResult,
    analyticsResult,
  ] = await Promise.allSettled([
    getSchoolMembers(
      cleanedSchoolId,
    ),
    getTeacherClasses(
      cleanedTeacherId,
    ),
    getTeacherAnalyticsPortfolio(
      cleanedTeacherId,
    ),
  ]);

  const members =
    membersResult.status ===
    "fulfilled"
      ? membersResult.value
      : [];

  const classes =
    classesResult.status ===
    "fulfilled"
      ? classesResult.value
      : [];

  const analytics =
    analyticsResult.status ===
    "fulfilled"
      ? analyticsResult.value
      : null;

  const activeSchoolStudents =
    members.filter(
      (member) =>
        member.status ===
          "active" &&
        member.membershipRole ===
          "student",
    );

  const schoolStudentIds =
    new Set(
      activeSchoolStudents.map(
        (member) =>
          member.uid,
      ),
    );

  const rosterStudentIds =
    new Set(
      classes.flatMap(
        (classItem) =>
          classItem.studentIds ||
          [],
      ),
    );

  const analyticsRows =
    analytics?.classes.flatMap(
      (classItem) =>
        classItem.students,
    ) ?? [];

  const analyticsStudentIds =
    new Set(
      analyticsRows.map(
        (student) =>
          student.studentId,
      ),
    );

  const checks:
    TeacherStudentBoundaryCheck[] =
    [];

  /*
   * T1H-1
   * Current-school directory access.
   */
  if (
    membersResult.status ===
    "rejected"
  ) {
    checks.push(
      failedCheck(
        "T1H-1",
        "School student directory access",
        "getSchoolMembers",
        membersResult.reason,
      ),
    );
  } else {
    checks.push({
      id: "T1H-1",
      label:
        "School student directory access",
      passed: true,
      detail:
        `${activeSchoolStudents.length} active school student(s) loaded from the authenticated teacher's school membership collection.`,
    });
  }

  /*
   * T1H-2
   * Teacher class ownership remains scoped.
   */
  if (
    classesResult.status ===
    "rejected"
  ) {
    checks.push(
      failedCheck(
        "T1H-2",
        "Teacher class scope",
        "getTeacherClasses",
        classesResult.reason,
      ),
    );
  } else {
    const foreignClasses =
      classes.filter(
        (classItem) =>
          classItem.teacherId !==
          cleanedTeacherId,
      );

    checks.push({
      id: "T1H-2",
      label:
        "Teacher class scope",
      passed:
        foreignClasses.length ===
        0,
      detail:
        foreignClasses.length ===
        0
          ? `${classes.length} class(es) loaded and all belong to the authenticated teacher.`
          : `${foreignClasses.length} class record(s) failed the teacher ownership check.`,
    });
  }

  /*
   * T1H-3
   * Every learner on one of the teacher's class rosters must be a member of
   * the current school directory.
   */
  if (
    membersResult.status ===
      "rejected" ||
    classesResult.status ===
      "rejected"
  ) {
    checks.push({
      id: "T1H-3",
      label:
        "Roster-to-school tenancy",
      passed: false,
      detail:
        "School membership and class roster data must both load before tenancy can be verified.",
    });
  } else {
    const rosterOutsideSchool =
      [...rosterStudentIds].filter(
        (studentId) =>
          !schoolStudentIds.has(
            studentId,
          ),
      );

    checks.push({
      id: "T1H-3",
      label:
        "Roster-to-school tenancy",
      passed:
        rosterOutsideSchool.length ===
        0,
      detail:
        rosterOutsideSchool.length ===
        0
          ? `${rosterStudentIds.size} unique roster learner(s) are members of the current school.`
          : `${rosterOutsideSchool.length} roster learner(s) are not present in the current school's active student membership.`,
    });
  }

  /*
   * T1H-4
   * Analytics classes must be the same classes visible to this teacher.
   */
  if (
    analyticsResult.status ===
      "rejected" ||
    classesResult.status ===
      "rejected" ||
    !analytics
  ) {
    checks.push(
      analyticsResult.status ===
      "rejected"
        ? failedCheck(
            "T1H-4",
            "Analytics class boundary",
            "getTeacherAnalyticsPortfolio",
            analyticsResult.reason,
          )
        : {
            id: "T1H-4",
            label:
              "Analytics class boundary",
            passed: false,
            detail:
              "Teacher classes must load before analytics class scope can be verified.",
          },
    );
  } else {
    const ownedClassIds =
      new Set(
        classes.map(
          (classItem) =>
            classItem.id,
        ),
      );

    const foreignAnalyticsClasses =
      analytics.classes.filter(
        (classItem) =>
          !ownedClassIds.has(
            classItem.classId,
          ),
      );

    checks.push({
      id: "T1H-4",
      label:
        "Analytics class boundary",
      passed:
        foreignAnalyticsClasses.length ===
        0,
      detail:
        foreignAnalyticsClasses.length ===
        0
          ? `${analytics.classCount} analytics class(es) stay within the authenticated teacher's class scope.`
          : `${foreignAnalyticsClasses.length} analytics class record(s) are outside the teacher's owned class set.`,
    });
  }

  /*
   * T1H-5
   * Analytics learners must come only from the authenticated teacher's rosters.
   */
  if (
    analyticsResult.status ===
      "rejected" ||
    classesResult.status ===
      "rejected" ||
    !analytics
  ) {
    checks.push({
      id: "T1H-5",
      label:
        "Learner intelligence roster boundary",
      passed: false,
      detail:
        "Analytics and class roster data must both load before learner scope can be verified.",
    });
  } else {
    const analyticsOutsideRoster =
      [...analyticsStudentIds].filter(
        (studentId) =>
          !rosterStudentIds.has(
            studentId,
          ),
      );

    checks.push({
      id: "T1H-5",
      label:
        "Learner intelligence roster boundary",
      passed:
        analyticsOutsideRoster.length ===
        0,
      detail:
        analyticsOutsideRoster.length ===
        0
          ? `${analyticsStudentIds.size} analytics learner(s) all belong to one of this teacher's class rosters.`
          : `${analyticsOutsideRoster.length} analytics learner(s) are outside this teacher's roster scope.`,
    });
  }

  /*
   * T1H-6
   * Directory and analytics identity sets must be internally unique and the
   * portfolio's advertised unique count must equal its derived unique IDs.
   */
  if (
    analyticsResult.status ===
      "rejected" ||
    !analytics
  ) {
    checks.push({
      id: "T1H-6",
      label:
        "Unique learner identity consistency",
      passed: false,
      detail:
        "Analytics must load before unique learner identity consistency can be checked.",
    });
  } else {
    const directoryUidCount =
      activeSchoolStudents.length;

    const uniqueDirectoryUidCount =
      new Set(
        activeSchoolStudents.map(
          (member) =>
            member.uid,
        ),
      ).size;

    const directoryUnique =
      directoryUidCount ===
      uniqueDirectoryUidCount;

    const analyticsCountMatches =
      analytics.uniqueStudentCount ===
      analyticsStudentIds.size;

    checks.push({
      id: "T1H-6",
      label:
        "Unique learner identity consistency",
      passed:
        directoryUnique &&
        analyticsCountMatches,
      detail:
        directoryUnique &&
        analyticsCountMatches
          ? `Directory UIDs are unique and analytics reports ${analytics.uniqueStudentCount} unique learner(s), matching the derived analytics identity set.`
          : `Identity mismatch: directory rows=${directoryUidCount}, unique directory UIDs=${uniqueDirectoryUidCount}, analytics advertised=${analytics.uniqueStudentCount}, analytics derived=${analyticsStudentIds.size}.`,
    });
  }

  return {
    teacherId:
      cleanedTeacherId,

    schoolId:
      cleanedSchoolId,

    generatedAt:
      new Date(),

    checks,

    metrics: {
      schoolStudents:
        activeSchoolStudents.length,

      teacherClasses:
        classes.length,

      rosterStudents:
        rosterStudentIds.size,

      analyticsStudents:
        analyticsStudentIds.size,

      analyticsClasses:
        analytics?.classCount ??
        0,
    },
  };
}

export async function testForeignStudentIsolation({
  currentTeacherId,
  foreignStudentId,
}: {
  currentTeacherId: string;
  foreignStudentId: string;
}): Promise<TeacherStudentBoundaryCheck> {
  const teacherId =
    currentTeacherId.trim();

  const studentId =
    foreignStudentId.trim();

  if (
    !teacherId ||
    !studentId
  ) {
    return {
      id: "T1H-7",
      label:
        "Cross-teacher learner intelligence isolation",
      passed: false,
      detail:
        "Enter a learner ID from the opposite teacher's class.",
    };
  }

  try {
    const analytics =
      await getStudentAnalytics(
        studentId,
        teacherId,
      );

    if (!analytics) {
      return {
        id: "T1H-7",
        label:
          "Cross-teacher learner intelligence isolation",
        passed: true,
        detail:
          "PASS: the foreign learner returned no teacher-scoped analytics.",
      };
    }

    return {
      id: "T1H-7",
      label:
        "Cross-teacher learner intelligence isolation",
      passed: false,
      detail:
        "FAIL: the authenticated teacher was able to load learner intelligence for the supplied foreign student.",
    };
  } catch (
    caughtError
  ) {
    const message =
      errorMessage(
        caughtError,
      );

    const denied =
      message ===
      "PERMISSION DENIED";

    return {
      id: "T1H-7",
      label:
        "Cross-teacher learner intelligence isolation",
      passed: denied,
      detail:
        denied
          ? "PASS: Firestore denied the cross-teacher learner intelligence read."
          : `Isolation test failed unexpectedly: ${message}.`,
    };
  }
}
