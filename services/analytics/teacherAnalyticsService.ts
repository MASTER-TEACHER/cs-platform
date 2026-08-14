import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

import { ANALYTICS_EVIDENCE_WEIGHTS } from "@/data/analytics/analyticsConfig";
import {
  getDefaultBoundarySet,
  getGradeOrder,
} from "@/data/analytics/gradeBoundaries";
import { db } from "@/lib/firebase";
import {
  getTeacherClasses,
  type TeacherClass,
} from "@/services/classService";
import { calculateEvidenceConfidence } from "@/services/analytics/confidenceAnalyticsService";
import { calculateGradeProgress } from "@/services/analytics/gradeAnalyticsService";
import { buildAnalyticsInterpretation } from "@/services/analytics/interpretationService";
import { buildTopicMastery } from "@/services/analytics/masteryAnalyticsService";
import { getStudentTargetGrade } from "@/services/analytics/targetGradeService";
import { buildTrend } from "@/services/analytics/trendAnalyticsService";

import type {
  AnalyticsEvidence,
  AnalyticsQualification,
  GradeLabel,
  RichStudentAnalytics,
} from "@/types/analytics";

import type {
  ClassTopicAnalytics,
  GradeDistributionItem,
  TeacherAnalyticsPortfolio,
  TeacherClassAnalytics,
  TeacherStudentAnalyticsRow,
} from "@/types/teacherAnalytics";

type StudentIdentity = {
  id: string;
  name: string;
  email: string;
};

type FirestoreDate =
  | Timestamp
  | Date
  | string
  | null
  | undefined;

function toDate(value: FirestoreDate): Date | null {
  if (!value) return null;

  if (value instanceof Date) {
    return value;
  }

  if (value instanceof Timestamp) {
    return value.toDate();
  }

  if (typeof value === "string") {
    const parsed = new Date(value);

    return Number.isNaN(parsed.getTime())
      ? null
      : parsed;
  }

  return null;
}

function safeString(
  value: unknown,
  fallback = "",
): string {
  return typeof value === "string" &&
    value.trim()
    ? value.trim()
    : fallback;
}

function safeNumber(
  value: unknown,
): number | null {
  return typeof value === "number" &&
    Number.isFinite(value)
    ? value
    : null;
}

function safeStringArray(
  value: unknown,
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is string =>
      typeof item === "string",
  );
}

function qualificationFromClass(
  classItem: TeacherClass,
): AnalyticsQualification {
  const year =
    Number(
      (classItem.yearGroup || "")
        .match(/\d+/)?.[0] || 0,
    );

  return year >= 12
    ? "A_LEVEL"
    : "GCSE";
}

function normaliseLegacyTargetGrade(
  value: unknown,
  qualification: AnalyticsQualification,
): GradeLabel | null {
  const grade =
    safeString(value).toUpperCase();

  if (!grade) {
    return null;
  }

  const options =
    qualification === "A_LEVEL"
      ? ["A*", "A", "B", "C", "D", "E"]
      : [
          "9",
          "8",
          "7",
          "6",
          "5",
          "4",
          "3",
          "2",
          "1",
        ];

  return options.includes(grade)
    ? (grade as GradeLabel)
    : null;
}

function isPlaceholderStudentName(value: string): boolean {
  const normalised = value.trim().toLowerCase();

  return (
    !normalised ||
    normalised === "student" ||
    normalised === "unnamed student" ||
    normalised === "unknown student"
  );
}

async function getStudentIdentity(
  studentId: string,
  classItem: TeacherClass,
): Promise<StudentIdentity> {
  const embedded =
    classItem.students?.find(
      (student) =>
        student.studentId === studentId,
    );

  /*
   * Prefer the canonical user profile. Older class records can contain
   * placeholder names such as "Unnamed Student", so the embedded class
   * snapshot is only used as a fallback.
   */
  try {
    const snapshot =
      await getDoc(
        doc(db, "users", studentId),
      );

    if (snapshot.exists()) {
      const data = snapshot.data();

      const profileName =
        safeString(data.name);

      const profileEmail =
        safeString(data.email);

      if (
        !isPlaceholderStudentName(
          profileName,
        )
      ) {
        return {
          id: studentId,
          name: profileName,
          email:
            profileEmail ||
            embedded?.email ||
            "",
        };
      }
    }
  } catch (error) {
    console.warn(
      `Unable to read profile identity for student ${studentId}; using class snapshot.`,
      error,
    );
  }

  const embeddedName =
    embedded?.displayName || "";

  return {
    id: studentId,
    name:
      !isPlaceholderStudentName(
        embeddedName,
      )
        ? embeddedName
        : "Student",
    email:
      embedded?.email || "",
  };
}

/*
 * IMPORTANT:
 *
 * Teacher analytics must NOT call the student-facing
 * getUnifiedStudentAssignments()/getRichStudentAnalytics()
 * pipeline.
 *
 * That pipeline performs direct student-context reads
 * (including "not yet created" result/progress documents).
 * Those are valid for the student, but some are correctly
 * rejected when another account performs the same get.
 *
 * Instead this function reads only teacher-owned collections
 * with queries constrained by teacherId, then filters the
 * current class/student in memory.
 */
async function getTeacherOwnedStudentAnalytics({
  teacherId,
  studentId,
  classItem,
}: {
  teacherId: string;
  studentId: string;
  classItem: TeacherClass;
}): Promise<RichStudentAnalytics> {
  const [
    profileSnapshot,
    quizAssignmentsSnapshot,
    quizResultsSnapshot,
    examAssignmentsSnapshot,
    examSubmissionsSnapshot,
    resourceAssignmentsSnapshot,
  ] = await Promise.all([
    getDoc(
      doc(db, "users", studentId),
    ),

    getDocs(
      query(
        collection(db, "assignments"),
        where(
          "teacherId",
          "==",
          teacherId,
        ),
      ),
    ),

    getDocs(
      query(
        collection(
          db,
          "assignmentResults",
        ),
        where(
          "teacherId",
          "==",
          teacherId,
        ),
      ),
    ),

    getDocs(
      query(
        collection(
          db,
          "examAssignments",
        ),
        where(
          "teacherId",
          "==",
          teacherId,
        ),
      ),
    ),

    getDocs(
      query(
        collection(
          db,
          "examSubmissions",
        ),
        where(
          "teacherId",
          "==",
          teacherId,
        ),
      ),
    ),

    getDocs(
      query(
        collection(
          db,
          "classAssignments",
        ),
        where(
          "teacherId",
          "==",
          teacherId,
        ),
      ),
    ),
  ]);

  const profile =
    profileSnapshot.exists()
      ? profileSnapshot.data()
      : {};

  const qualification =
    qualificationFromClass(
      classItem,
    );

  const storedTarget =
    await getStudentTargetGrade(
      studentId,
    ).catch(() => null);

  const targetGrade =
    storedTarget?.qualification ===
    qualification
      ? storedTarget.targetGrade
      : normaliseLegacyTargetGrade(
          profile.targetGrade,
          qualification,
        );

  const boundarySet =
    getDefaultBoundarySet(
      qualification,
    );

  const quizResultByAssignment =
    new Map<
      string,
      Record<string, unknown>
    >();

  for (
    const resultDocument of
    quizResultsSnapshot.docs
  ) {
    const data =
      resultDocument.data();

    if (
      safeString(data.studentId) !==
      studentId
    ) {
      continue;
    }

    const assignmentId =
      safeString(
        data.assignmentId,
      );

    if (assignmentId) {
      quizResultByAssignment.set(
        assignmentId,
        data,
      );
    }
  }

  const evidence: AnalyticsEvidence[] =
    [];

  let totalActivityCount = 0;
  let completedActivityCount = 0;

  /*
   * QUIZ / AI QUIZ EVIDENCE
   */
  for (
    const assignmentDocument of
    quizAssignmentsSnapshot.docs
  ) {
    const assignment =
      assignmentDocument.data();

    if (
      assignment.type !== "quiz" ||
      safeString(
        assignment.classId,
      ) !== classItem.id ||
      assignment.status ===
        "cancelled"
    ) {
      continue;
    }

    totalActivityCount += 1;

    const result =
      quizResultByAssignment.get(
        assignmentDocument.id,
      );

    const completed =
      result?.status ===
      "completed";

    if (completed) {
      completedActivityCount += 1;
    }

    const percentage =
      completed
        ? safeNumber(
            result?.percentage,
          )
        : null;

    const score =
      completed
        ? safeNumber(
            result?.score,
          )
        : null;

    const totalQuestions =
      completed
        ? safeNumber(
            result?.totalQuestions,
          )
        : null;

    const resourceType =
      safeString(
        assignment.resourceType,
      );

    const evidenceType:
      AnalyticsEvidence["type"] =
        resourceType === "AI Quiz" ||
        resourceType === "ai-quiz"
          ? "ai_quiz"
          : "quiz";

    evidence.push({
      id:
        `quiz-${assignmentDocument.id}`,
      type: evidenceType,
      title:
        safeString(
          assignment.title,
          "Assigned quiz",
        ),
      topic:
        safeString(
          assignment.topic,
        ) ||
        safeString(
          assignment.title,
          "Assigned quiz",
        ),
      percentage,
      rawScore: score,
      totalMarks:
        totalQuestions,
      completedAt:
        toDate(
          result?.completedAt as
            FirestoreDate,
        ),
      dueDate:
        toDate(
          assignment.dueDate as
            FirestoreDate,
        ),
      weight:
        ANALYTICS_EVIDENCE_WEIGHTS[
          evidenceType
        ],
      graded:
        completed &&
        percentage !== null,
    });
  }

  /*
   * WRITTEN EXAM EVIDENCE
   */
  const submissionByAssignment =
    new Map<
      string,
      Record<string, unknown>
    >();

  for (
    const submissionDocument of
    examSubmissionsSnapshot.docs
  ) {
    const data =
      submissionDocument.data();

    if (
      safeString(data.studentId) !==
      studentId
    ) {
      continue;
    }

    const assignmentId =
      safeString(
        data.assignmentId,
      );

    if (assignmentId) {
      submissionByAssignment.set(
        assignmentId,
        data,
      );
    }
  }

  for (
    const assignmentDocument of
    examAssignmentsSnapshot.docs
  ) {
    const assignment =
      assignmentDocument.data();

    const studentIds =
      safeStringArray(
        assignment.studentIds,
      );

    if (
      safeString(
        assignment.classId,
      ) !== classItem.id ||
      !studentIds.includes(
        studentId,
      ) ||
      assignment.status ===
        "cancelled"
    ) {
      continue;
    }

    totalActivityCount += 1;

    const submission =
      submissionByAssignment.get(
        assignmentDocument.id,
      );

    const marked =
      submission?.status ===
      "marked";

    if (
      submission?.status ===
        "submitted" ||
      submission?.status ===
        "marking" ||
      marked
    ) {
      completedActivityCount += 1;
    }

    const percentage =
      marked
        ? safeNumber(
            submission?.percentage,
          )
        : null;

    const rawScore =
      marked
        ? safeNumber(
            submission
              ?.totalAwardedMarks,
          )
        : null;

    const totalMarks =
      safeNumber(
        assignment.totalMarks,
      ) ??
      safeNumber(
        submission
          ?.totalAvailableMarks,
      );

    evidence.push({
      id:
        `exam-${assignmentDocument.id}`,
      type: "written_exam",
      title:
        safeString(
          assignment.title,
          "Written assessment",
        ),
      topic:
        safeString(
          assignment.topic,
        ) ||
        safeString(
          assignment
            .questionSetSnapshot &&
            typeof assignment
              .questionSetSnapshot ===
              "object"
            ? (
                assignment
                  .questionSetSnapshot as
                  Record<
                    string,
                    unknown
                  >
              ).topic
            : "",
        ) ||
        safeString(
          assignment.title,
          "Written assessment",
        ),
      percentage,
      rawScore,
      totalMarks,
      completedAt:
        toDate(
          (
            submission
              ?.markedAt ??
            submission
              ?.submittedAt
          ) as FirestoreDate,
        ),
      dueDate:
        toDate(
          assignment.dueDate as
            FirestoreDate,
        ),
      weight:
        ANALYTICS_EVIDENCE_WEIGHTS
          .written_exam,
      graded:
        marked &&
        percentage !== null,
    });
  }

  /*
   * RESOURCE / PROGRAMMING ASSIGNMENTS
   *
   * We count teacher-owned assigned resources in completion
   * coverage but do not perform student-context direct reads.
   * Their ungraded status therefore cannot distort the
   * working-grade calculation.
   */
  for (
    const assignmentDocument of
    resourceAssignmentsSnapshot.docs
  ) {
    const assignment =
      assignmentDocument.data();

    const studentIds =
      safeStringArray(
        assignment.studentIds,
      );

    if (
      safeString(
        assignment.classId,
      ) !== classItem.id ||
      !studentIds.includes(
        studentId,
      ) ||
      assignment.status ===
        "cancelled"
    ) {
      continue;
    }

    totalActivityCount += 1;
  }

  const completionRate =
    totalActivityCount > 0
      ? Math.round(
          (
            completedActivityCount /
            totalActivityCount
          ) * 100,
        )
      : 0;

  const grade =
    calculateGradeProgress({
      evidence,
      targetGrade,
      boundarySet,
    });

  const topics =
    buildTopicMastery(
      evidence,
    );

  const strongestTopics =
    topics.slice(0, 3);

  const weakestTopics =
    [...topics]
      .sort(
        (first, second) =>
          first
            .weightedPercentage -
          second
            .weightedPercentage,
      )
      .slice(0, 3);

  const trendResult =
    buildTrend(evidence);

  const confidence =
    calculateEvidenceConfidence({
      evidence,
      totalActivityCount,
      completedActivityCount,
    });

  const interpretation =
    buildAnalyticsInterpretation({
      grade,
      trend: trendResult.trend,
      strongestTopics,
      weakestTopics,
    });

  return {
    studentId,
    qualification,
    examBoard:
      safeString(
        profile.examBoard,
      ) || null,
    targetGrade,
    grade,
    confidence,
    trend: trendResult.trend,
    trendChange:
      trendResult.change,
    trendPoints:
      trendResult.points,
    topics,
    strongestTopics,
    weakestTopics,
    evidence,
    completedActivityCount,
    totalActivityCount,
    completionRate,
    interpretation,
  };
}

function interventionFor(
  analytics: RichStudentAnalytics,
): {
  priority:
    TeacherStudentAnalyticsRow[
      "interventionPriority"
    ];
  reasons: string[];
} {
  const reasons: string[] = [];
  let score = 0;

  if (
    analytics.grade.gradeGap !==
      null &&
    analytics.grade.gradeGap <= -2
  ) {
    reasons.push(
      "Two or more grade steps below target",
    );
    score += 4;
  } else if (
    analytics.grade.gradeGap !==
      null &&
    analytics.grade.gradeGap < 0
  ) {
    reasons.push(
      "Below target grade",
    );
    score += 2;
  }

  if (
    analytics.trend ===
    "declining"
  ) {
    reasons.push(
      "Recent performance is declining",
    );
    score += 3;
  }

  if (
    analytics.confidence.level ===
      "insufficient" ||
    analytics.confidence.level ===
      "low"
  ) {
    reasons.push(
      "Insufficient assessment evidence",
    );
    score += 2;
  }

  if (
    analytics.completionRate < 70
  ) {
    reasons.push(
      "Assignment completion is below 70%",
    );
    score += 2;
  }

  const priorityTopic =
    analytics.weakestTopics.find(
      (topic) =>
        topic.status ===
        "priority",
    );

  if (priorityTopic) {
    reasons.push(
      `${priorityTopic.topic} mastery is ${priorityTopic.weightedPercentage}%`,
    );
    score += 2;
  }

  if (score >= 6) {
    return {
      priority: "high",
      reasons,
    };
  }

  if (score >= 3) {
    return {
      priority: "medium",
      reasons,
    };
  }

  if (score >= 1) {
    return {
      priority: "monitor",
      reasons,
    };
  }

  return {
    priority: "none",
    reasons: [],
  };
}

function gradeDistribution(
  rows:
    TeacherStudentAnalyticsRow[],
  qualification:
    AnalyticsQualification,
): GradeDistributionItem[] {
  const order =
    [
      ...getGradeOrder(
        qualification,
      ),
    ].reverse();

  return order.map((grade) => ({
    grade,
    count: rows.filter(
      (row) =>
        row.workingGrade === grade,
    ).length,
  }));
}

function averageGrade(
  grades:
    (GradeLabel | null)[],
  qualification:
    AnalyticsQualification,
): GradeLabel | null {
  const order =
    getGradeOrder(
      qualification,
    );

  const indexes =
    grades
      .filter(
        (
          grade,
        ): grade is GradeLabel =>
          grade !== null,
      )
      .map((grade) =>
        order.indexOf(grade),
      )
      .filter(
        (index) =>
          index >= 0,
      );

  if (indexes.length === 0) {
    return null;
  }

  const averageIndex =
    Math.round(
      indexes.reduce(
        (sum, index) =>
          sum + index,
        0,
      ) / indexes.length,
    );

  return order[
    Math.max(
      0,
      Math.min(
        order.length - 1,
        averageIndex,
      ),
    )
  ];
}

function aggregateTopics(
  rows:
    TeacherStudentAnalyticsRow[],
): ClassTopicAnalytics[] {
  const groups =
    new Map<
      string,
      {
        percentages: number[];
        evidence: number;
        recent: number[];
      }
    >();

  for (const row of rows) {
    for (
      const topic of
      row.analytics.topics
    ) {
      const current =
        groups.get(
          topic.topic,
        ) || {
          percentages: [],
          evidence: 0,
          recent: [],
        };

      current.percentages.push(
        topic.weightedPercentage,
      );

      current.recent.push(
        topic.recentPercentage,
      );

      current.evidence +=
        topic.evidenceCount;

      groups.set(
        topic.topic,
        current,
      );
    }
  }

  return [
    ...groups.entries(),
  ]
    .map(
      ([topic, group]) => {
        const weightedPercentage =
          Math.round(
            group.percentages.reduce(
              (
                sum,
                value,
              ) =>
                sum + value,
              0,
            ) /
              group
                .percentages
                .length,
          );

        const recentPercentage =
          Math.round(
            group.recent.reduce(
              (
                sum,
                value,
              ) =>
                sum + value,
              0,
            ) /
              group.recent.length,
          );

        return {
          topic,
          evidenceCount:
            group.evidence,
          studentCount:
            group
              .percentages
              .length,
          weightedPercentage,
          recentPercentage,
          status:
            weightedPercentage >=
            70
              ? "secure"
              : weightedPercentage >=
                  50
                ? "developing"
                : "priority",
        } satisfies ClassTopicAnalytics;
      },
    )
    .sort(
      (first, second) =>
        first
          .weightedPercentage -
        second
          .weightedPercentage,
    );
}

async function buildClassAnalytics(
  classItem: TeacherClass,
  teacherId: string,
): Promise<TeacherClassAnalytics> {
  const qualification =
    qualificationFromClass(
      classItem,
    );

  const studentIds =
    Array.from(
      new Set(
        classItem.studentIds ||
          [],
      ),
    );

  /*
   * Every enrolled student gets a row.
   * We no longer discard a student merely because one
   * analytics evidence source is unavailable.
   */
  const students =
    await Promise.all(
      studentIds.map(
        async (studentId) => {
          const identity =
            await getStudentIdentity(
              studentId,
              classItem,
            );

          const analytics =
            await getTeacherOwnedStudentAnalytics({
              teacherId,
              studentId,
              classItem,
            });

          const intervention =
            interventionFor(
              analytics,
            );

          return {
            studentId,
            studentName:
              identity.name,
            studentEmail:
              identity.email,
            classId:
              classItem.id,
            className:
              classItem.name,
            qualification:
              analytics.qualification,
            workingGrade:
              analytics.grade
                .workingGrade,
            targetGrade:
              analytics.grade
                .targetGrade,
            workingPercentage:
              analytics.grade
                .workingPercentage,
            gradeGap:
              analytics.grade
                .gradeGap,
            nextGrade:
              analytics.grade
                .nextGrade,
            marksToNextGrade:
              analytics.grade
                .marksToNextGrade,
            trend:
              analytics.trend,
            trendChange:
              analytics.trendChange,
            confidence:
              analytics.confidence
                .level,
            completionRate:
              analytics
                .completionRate,
            interventionPriority:
              intervention.priority,
            interventionReasons:
              intervention.reasons,
            analytics,
          } satisfies TeacherStudentAnalyticsRow;
        },
      ),
    );

  const percentages =
    students
      .map(
        (student) =>
          student
            .workingPercentage,
      )
      .filter(
        (
          value,
        ): value is number =>
          value !== null,
      );

  const averageWeightedPercentage =
    percentages.length > 0
      ? Math.round(
          percentages.reduce(
            (
              sum,
              value,
            ) =>
              sum + value,
            0,
          ) /
            percentages.length,
        )
      : null;

  const studentsWithEvidence =
    students.filter(
      (student) =>
        student
          .workingGrade !==
        null,
    ).length;

  const targetRows =
    students.filter(
      (student) =>
        student.targetGrade !==
          null &&
        student.gradeGap !==
          null,
    );

  const onOrAboveTargetCount =
    targetRows.filter(
      (student) =>
        (
          student.gradeGap ??
          -99
        ) >= 0,
    ).length;

  const belowTargetCount =
    targetRows.filter(
      (student) =>
        (
          student.gradeGap ??
          0
        ) < 0,
    ).length;

  const targetNotSetCount =
    students.filter(
      (student) =>
        student.targetGrade ===
        null,
    ).length;

  return {
    classId: classItem.id,
    className: classItem.name,
    yearGroup:
      classItem.yearGroup,
    qualification,
    studentCount:
      studentIds.length,
    studentsWithEvidence,
    averageWeightedPercentage,
    averageWorkingGrade:
      averageGrade(
        students.map(
          (student) =>
            student
              .workingGrade,
        ),
        qualification,
      ),
    averageTargetGrade:
      averageGrade(
        students.map(
          (student) =>
            student.targetGrade,
        ),
        qualification,
      ),
    onOrAboveTargetCount,
    belowTargetCount,
    targetNotSetCount,
    onOrAboveTargetPercentage:
      targetRows.length > 0
        ? Math.round(
            (
              onOrAboveTargetCount /
              targetRows.length
            ) * 100,
          )
        : 0,
    averageCompletionRate:
      students.length > 0
        ? Math.round(
            students.reduce(
              (
                sum,
                student,
              ) =>
                sum +
                student
                  .completionRate,
              0,
            ) /
              students.length,
          )
        : 0,
    highPriorityCount:
      students.filter(
        (student) =>
          student
            .interventionPriority ===
          "high",
      ).length,
    decliningCount:
      students.filter(
        (student) =>
          student.trend ===
          "declining",
      ).length,
    lowEvidenceCount:
      students.filter(
        (student) =>
          student.confidence ===
            "insufficient" ||
          student.confidence ===
            "low",
      ).length,
    gradeDistribution:
      gradeDistribution(
        students,
        qualification,
      ),
    topicAnalytics:
      aggregateTopics(
        students,
      ),
    students:
      students.sort(
        (first, second) =>
          first.studentName.localeCompare(
            second.studentName,
            "en-GB",
            {
              sensitivity:
                "base",
            },
          ),
      ),
  };
}

export async function getTeacherAnalyticsPortfolio(
  teacherId: string,
): Promise<TeacherAnalyticsPortfolio> {
  const cleanedTeacherId =
    teacherId.trim();

  if (!cleanedTeacherId) {
    throw new Error(
      "A teacher account is required.",
    );
  }

  const classes =
    (
      await getTeacherClasses(
        cleanedTeacherId,
      )
    ).filter(
      (classItem) =>
        classItem.status !==
        "archived",
    );

  const classAnalytics =
    await Promise.all(
      classes.map(
        (classItem) =>
          buildClassAnalytics(
            classItem,
            cleanedTeacherId,
          ),
      ),
    );

  const uniqueStudentIds =
    new Set(
      classes.flatMap(
        (classItem) =>
          classItem.studentIds ||
          [],
      ),
    );

  return {
    teacherId:
      cleanedTeacherId,
    classCount:
      classAnalytics.length,
    uniqueStudentCount:
      uniqueStudentIds.size,
    classes:
      classAnalytics,
  };
}

export async function getTeacherStudentAnalytics({
  teacherId,
  studentId,
}: {
  teacherId: string;
  studentId: string;
}): Promise<TeacherStudentAnalyticsRow | null> {
  const portfolio =
    await getTeacherAnalyticsPortfolio(
      teacherId,
    );

  for (
    const classItem of
    portfolio.classes
  ) {
    const row =
      classItem.students.find(
        (student) =>
          student.studentId ===
          studentId,
      );

    if (row) {
      return row;
    }
  }

  return null;
}
