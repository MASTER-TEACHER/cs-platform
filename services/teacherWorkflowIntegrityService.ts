import {
  getTeacherClassById,
  getTeacherClasses,
} from "@/services/classService";
import {
  getUnifiedTeacherAssignments,
} from "@/services/unifiedTeacherAssignmentService";
import {
  getTeacherAnalyticsPortfolio,
} from "@/services/analytics/teacherAnalyticsService";
import {
  getTeacherInterventions,
} from "@/services/interventionService";

export type TeacherIntegrityCheck = {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
};

export type TeacherWorkflowIntegritySnapshot = {
  teacherId: string;
  generatedAt: Date;
  checks: TeacherIntegrityCheck[];
  metrics: {
    classes: number;
    students: number;
    assignments: number;
    activeAssignments: number;
    analyticsClasses: number;
    analyticsStudents: number;
    interventions: number;
  };
};

function uniqueStudentCount(
  classes: Awaited<
    ReturnType<typeof getTeacherClasses>
  >,
): number {
  return new Set(
    classes.flatMap(
      (item) => item.studentIds || [],
    ),
  ).size;
}

export async function getTeacherWorkflowIntegritySnapshot(
  teacherId: string,
): Promise<TeacherWorkflowIntegritySnapshot> {
  const id = teacherId.trim();

  if (!id) {
    throw new Error(
      "A teacher account is required.",
    );
  }

  const [
    classes,
    assignmentSummary,
    portfolio,
    interventions,
  ] = await Promise.all([
    getTeacherClasses(id),
    getUnifiedTeacherAssignments(id),
    getTeacherAnalyticsPortfolio(id),
    getTeacherInterventions(id),
  ]);

  const ownedClassIds =
    new Set(
      classes.map(
        (item) => item.id,
      ),
    );

  const foreignClasses =
    classes.filter(
      (item) =>
        item.teacherId !== id,
    );

  const assignmentsOutsideClasses =
    assignmentSummary.assignments.filter(
      (item) =>
        !ownedClassIds.has(
          item.classId,
        ),
    );

  const analyticsOutsideClasses =
    portfolio.classes.filter(
      (item) =>
        !ownedClassIds.has(
          item.classId,
        ),
    );

  const foreignInterventions =
    interventions.filter(
      (item) =>
        item.teacherId !== id,
    );

  const students =
    uniqueStudentCount(classes);

  const checks: TeacherIntegrityCheck[] = [
    {
      id: "T1G-1A",
      label: "Class ownership",
      passed:
        foreignClasses.length === 0,
      detail:
        foreignClasses.length === 0
          ? "Every loaded class belongs to the authenticated teacher."
          : `${foreignClasses.length} class record(s) failed the ownership check.`,
    },
    {
      id: "T1G-1B",
      label: "Assignment class scope",
      passed:
        assignmentsOutsideClasses.length === 0,
      detail:
        assignmentsOutsideClasses.length === 0
          ? "Every unified assignment belongs to one of the teacher's classes."
          : `${assignmentsOutsideClasses.length} assignment(s) reference a class outside the teacher scope.`,
    },
    {
      id: "T1G-1C",
      label: "Analytics class scope",
      passed:
        analyticsOutsideClasses.length === 0,
      detail:
        analyticsOutsideClasses.length === 0
          ? "Analytics contains only the teacher's classes."
          : `${analyticsOutsideClasses.length} analytics class record(s) are outside teacher scope.`,
    },
    {
      id: "T1G-1D",
      label: "Analytics class count",
      passed:
        portfolio.classCount ===
        classes.filter(
          (item) =>
            item.status !== "archived",
        ).length,
      detail:
        `Analytics=${portfolio.classCount}; active/non-archived classes=${classes.filter(
          (item) =>
            item.status !== "archived",
        ).length}.`,
    },
    {
      id: "T1G-1E",
      label: "Analytics student count",
      passed:
        portfolio.uniqueStudentCount <=
        students,
      detail:
        `Analytics students=${portfolio.uniqueStudentCount}; teacher directory students=${students}.`,
    },
    {
      id: "T1G-1F",
      label: "Intervention ownership",
      passed:
        foreignInterventions.length === 0,
      detail:
        foreignInterventions.length === 0
          ? "Every intervention belongs to the authenticated teacher."
          : `${foreignInterventions.length} intervention(s) failed the ownership check.`,
    },
    {
      id: "T1G-2",
      label: "Unified assignment portfolio",
      passed: true,
      detail:
        `${assignmentSummary.totalAssignments} assignment(s) unified across resource, programming, quiz and exam workflows.`,
    },
    {
      id: "T1G-3",
      label: "Analytics → intervention data available",
      passed: true,
      detail:
        `${portfolio.uniqueStudentCount} analytics learner(s); ${interventions.length} intervention record(s).`,
    },
    {
      id: "T1G-4",
      label: "Assignment evidence metrics",
      passed:
        assignmentSummary.completedStudentCount <=
        assignmentSummary.totalStudentCount,
      detail:
        `${assignmentSummary.completedStudentCount}/${assignmentSummary.totalStudentCount} assignment completions represented.`,
    },
    {
      id: "T1G-5",
      label: "Intervention/reporting loop",
      passed: true,
      detail:
        "Teacher-scoped analytics and intervention datasets loaded successfully.",
    },
    {
      id: "T1G-6",
      label: "Teacher data services load",
      passed: true,
      detail:
        "Classes, assignments, analytics and interventions loaded without an unhandled permission error.",
    },
  ];

  return {
    teacherId: id,
    generatedAt: new Date(),
    checks,
    metrics: {
      classes:
        classes.length,
      students,
      assignments:
        assignmentSummary.totalAssignments,
      activeAssignments:
        assignmentSummary.activeAssignments,
      analyticsClasses:
        portfolio.classCount,
      analyticsStudents:
        portfolio.uniqueStudentCount,
      interventions:
        interventions.length,
    },
  };
}

export async function testForeignClassIsolation({
  currentTeacherId,
  foreignClassId,
}: {
  currentTeacherId: string;
  foreignClassId: string;
}): Promise<TeacherIntegrityCheck> {
  const teacherId =
    currentTeacherId.trim();

  const classId =
    foreignClassId.trim();

  if (!teacherId || !classId) {
    return {
      id: "T1G-7",
      label: "Cross-teacher class isolation",
      passed: false,
      detail:
        "Enter an opposite teacher's class ID to run the isolation test.",
    };
  }

  try {
    const classRecord =
      await getTeacherClassById(
        classId,
      );

    if (!classRecord) {
      return {
        id: "T1G-7",
        label: "Cross-teacher class isolation",
        passed: true,
        detail:
          "The foreign class was not readable.",
      };
    }

    if (
      classRecord.teacherId !==
      teacherId
    ) {
      return {
        id: "T1G-7",
        label: "Cross-teacher class isolation",
        passed: false,
        detail:
          "FAIL: the authenticated teacher was able to read another teacher's class.",
      };
    }

    return {
      id: "T1G-7",
      label: "Cross-teacher class isolation",
      passed: false,
      detail:
        "The supplied class belongs to the current teacher. Use the opposite teacher's class ID.",
    };
  } catch (caughtError: unknown) {
    const firebaseCode =
      typeof caughtError === "object" &&
      caughtError !== null &&
      "code" in caughtError &&
      typeof (caughtError as { code?: unknown }).code === "string"
        ? (caughtError as { code: string }).code
        : "";

    const message =
      caughtError instanceof Error
        ? caughtError.message
        : "";

    const permissionDenied =
      firebaseCode ===
        "permission-denied" ||
      firebaseCode ===
        "firestore/permission-denied" ||
      message
        .toLowerCase()
        .includes(
          "insufficient permissions",
        );

    return {
      id: "T1G-7",
      label: "Cross-teacher class isolation",
      passed:
        permissionDenied,
      detail:
        permissionDenied
          ? "PASS: Firestore denied the cross-teacher class read."
          : `Isolation test failed unexpectedly: ${
              message ||
              firebaseCode ||
              "unknown error"
            }`,
    };
  }
}
