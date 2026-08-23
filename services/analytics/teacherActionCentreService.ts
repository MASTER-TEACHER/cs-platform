import {
  getTeacherAnalyticsPortfolio,
} from "@/services/analytics/teacherAnalyticsService";

import {
  getTeacherInterventions,
} from "@/services/interventionService";

import type {
  ClassTopicAnalytics,
  TeacherAnalyticsPortfolio,
  TeacherClassAnalytics,
  TeacherStudentAnalyticsRow,
} from "@/types/teacherAnalytics";

export type TeacherActionPriority =
  | "high"
  | "medium"
  | "monitor"
  | "none";

export type TeacherActionStudent = {
  key: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  classId: string;
  className: string;
  workingGrade: string;
  targetGrade: string;
  gradeGap: number | null;
  completionRate: number;
  trend: string;
  confidence: string;
  priority: TeacherActionPriority;
  reasons: string[];
  weakestTopic: string;
  weakestTopicPercentage: number | null;
};

export type TeacherActionClass = {
  classId: string;
  className: string;
  yearGroup: string;
  studentCount: number;
  studentsWithEvidence: number;
  averageWorkingGrade: string;
  averageTargetGrade: string;
  averageWeightedPercentage: number | null;
  averageCompletionRate: number;
  onOrAboveTargetPercentage: number;
  highPriorityCount: number;
  decliningCount: number;
  lowEvidenceCount: number;
  priorityTopics: ClassTopicAnalytics[];
  strongestTopics: ClassTopicAnalytics[];
};

export type TeacherAnalyticsActionCentre = {
  teacherId: string;
  classCount: number;
  studentCount: number;
  studentsWithEvidence: number;
  studentsWithoutEvidence: number;
  highPriorityCount: number;
  decliningCount: number;
  lowEvidenceCount: number;
  studentsWithTargets: number;
  studentsBelowTarget: number;
  studentsOnOrAboveTarget: number;
  studentsWithoutTargets: number;
  averageCompletionRate: number;
  activeInterventions: number;
  completedInterventions: number;
  priorityStudents: TeacherActionStudent[];
  classes: TeacherActionClass[];
  priorityTopics: ClassTopicAnalytics[];
  strongestTopics: ClassTopicAnalytics[];
};

function priorityRank(
  priority: TeacherStudentAnalyticsRow["interventionPriority"],
): number {
  if (priority === "high") return 4;
  if (priority === "medium") return 3;
  if (priority === "monitor") return 2;
  return 1;
}

function studentPriority(
  priority: TeacherStudentAnalyticsRow["interventionPriority"],
): TeacherActionPriority {
  if (
    priority === "high" ||
    priority === "medium" ||
    priority === "monitor"
  ) {
    return priority;
  }

  return "none";
}

function weakestTopicForStudent(
  student: TeacherStudentAnalyticsRow,
): {
  topic: string;
  percentage: number | null;
} {
  const topics = [...student.analytics.topics]
    .filter((topic) => topic.evidenceCount > 0)
    .sort(
      (first, second) =>
        first.weightedPercentage - second.weightedPercentage,
    );

  const weakest = topics[0];

  return weakest
    ? {
        topic: weakest.topic,
        percentage: weakest.weightedPercentage,
      }
    : {
        topic: "No assessed topic evidence",
        percentage: null,
      };
}

function normaliseStudent({
  student,
  classItem,
}: {
  student: TeacherStudentAnalyticsRow;
  classItem: TeacherClassAnalytics;
}): TeacherActionStudent {
  const weakest = weakestTopicForStudent(student);

  return {
    key: `${classItem.classId}-${student.studentId}`,
    studentId: student.studentId,
    studentName: student.studentName,
    studentEmail: student.studentEmail,
    classId: classItem.classId,
    className: classItem.className,
    workingGrade: student.workingGrade || "—",
    targetGrade: student.targetGrade || "Not set",
    gradeGap: student.gradeGap,
    completionRate: student.completionRate,
    trend: student.trend,
    confidence: String(student.confidence),
    priority: studentPriority(student.interventionPriority),
    reasons: student.interventionReasons || [],
    weakestTopic: weakest.topic,
    weakestTopicPercentage: weakest.percentage,
  };
}

function classTopics(
  classItem: TeacherClassAnalytics,
): {
  priority: ClassTopicAnalytics[];
  strongest: ClassTopicAnalytics[];
} {
  const withEvidence = classItem.topicAnalytics.filter(
    (topic) => topic.evidenceCount > 0,
  );

  return {
    /*
     * "Priority" must mean that evidence actually needs attention.
     * Secure topics must never be pulled into this list merely to fill
     * four display slots.
     *
     * <50  = priority
     * 50-69 = developing / watch
     * 70+  = secure
     *
     * The action centre includes priority + developing topics (<70).
     */
    priority: [...withEvidence]
      .filter(
        (topic) =>
          topic.weightedPercentage <
          70,
      )
      .sort(
        (first, second) =>
          first.weightedPercentage -
          second.weightedPercentage,
      )
      .slice(0, 4),

    strongest: [...withEvidence]
      .filter(
        (topic) =>
          topic.weightedPercentage >=
          70,
      )
      .sort(
        (first, second) =>
          second.weightedPercentage -
          first.weightedPercentage,
      )
      .slice(0, 4),
  };
}

function normaliseClass(
  classItem: TeacherClassAnalytics,
): TeacherActionClass {
  const topics = classTopics(classItem);

  return {
    classId: classItem.classId,
    className: classItem.className,
    yearGroup: classItem.yearGroup,
    studentCount: classItem.studentCount,
    studentsWithEvidence: classItem.studentsWithEvidence,
    averageWorkingGrade: classItem.averageWorkingGrade || "—",
    averageTargetGrade: classItem.averageTargetGrade || "Not set",
    averageWeightedPercentage: classItem.averageWeightedPercentage,
    averageCompletionRate: classItem.averageCompletionRate,
    onOrAboveTargetPercentage: classItem.onOrAboveTargetPercentage,
    highPriorityCount: classItem.highPriorityCount,
    decliningCount: classItem.decliningCount,
    lowEvidenceCount: classItem.lowEvidenceCount,
    priorityTopics: topics.priority,
    strongestTopics: topics.strongest,
  };
}

function aggregateTopics(
  portfolio: TeacherAnalyticsPortfolio,
): ClassTopicAnalytics[] {
  const groups = new Map<
    string,
    {
      values: number[];
      evidenceCount: number;
      studentCount: number;
    }
  >();

  portfolio.classes
    .flatMap((classItem) => classItem.topicAnalytics)
    .forEach((topic) => {
      if (topic.evidenceCount <= 0) return;

      const current = groups.get(topic.topic) || {
        values: [],
        evidenceCount: 0,
        studentCount: 0,
      };

      current.values.push(topic.weightedPercentage);
      current.evidenceCount += topic.evidenceCount;
      current.studentCount += topic.studentCount;

      groups.set(topic.topic, current);
    });

  return Array.from(groups.entries()).map(([topic, group]) => {
    const percentage =
      group.values.length > 0
        ? Math.round(
            group.values.reduce((total, value) => total + value, 0) /
              group.values.length,
          )
        : 0;

    return {
      topic,
      weightedPercentage: percentage,
      recentPercentage: percentage,
      evidenceCount: group.evidenceCount,
      studentCount: group.studentCount,
      status:
        percentage >= 70
          ? "secure"
          : percentage >= 50
            ? "developing"
            : "priority",
    };
  });
}

export async function getTeacherAnalyticsActionCentre(
  teacherId: string,
): Promise<TeacherAnalyticsActionCentre> {
  const cleanedTeacherId = teacherId.trim();

  if (!cleanedTeacherId) {
    throw new Error("A teacher account is required.");
  }

  const [portfolio, interventions] = await Promise.all([
    getTeacherAnalyticsPortfolio(cleanedTeacherId),
    getTeacherInterventions(cleanedTeacherId),
  ]);

  const allStudentRows = portfolio.classes.flatMap((classItem) =>
    classItem.students.map((student) => ({
      student,
      classItem,
    })),
  );

  /*
   * A learner can be in more than one class in the same school.
   * Use the highest-priority class row when calculating unique-student
   * headline metrics, while keeping class-specific rows for action lists.
   */
  const uniqueStudents = new Map<string, TeacherStudentAnalyticsRow>();

  allStudentRows.forEach(({ student }) => {
    const current = uniqueStudents.get(student.studentId);

    if (
      !current ||
      priorityRank(student.interventionPriority) >
        priorityRank(current.interventionPriority)
    ) {
      uniqueStudents.set(student.studentId, student);
    }
  });

  const uniqueRows = Array.from(uniqueStudents.values());

  const studentsWithEvidence = uniqueRows.filter(
    (student) => student.workingGrade !== null,
  ).length;

  const studentsWithTargets = uniqueRows.filter(
    (student) => student.targetGrade !== null,
  );

  const studentsBelowTarget = studentsWithTargets.filter(
    (student) =>
      student.gradeGap !== null && student.gradeGap < 0,
  ).length;

  const studentsOnOrAboveTarget = studentsWithTargets.filter(
    (student) =>
      student.gradeGap !== null && student.gradeGap >= 0,
  ).length;

  const priorityStudents = allStudentRows
    .map(({ student, classItem }) =>
      normaliseStudent({
        student,
        classItem,
      }),
    )
    .filter(
      (student) =>
        student.priority !== "none" ||
        student.gradeGap === null ||
        student.gradeGap < 0 ||
        student.trend === "declining" ||
        student.completionRate < 80 ||
        student.confidence === "low" ||
        student.confidence === "insufficient",
    )
    .sort((first, second) => {
      const priorityDifference =
        priorityRank(second.priority) - priorityRank(first.priority);

      if (priorityDifference !== 0) return priorityDifference;

      const firstGap = first.gradeGap ?? 0;
      const secondGap = second.gradeGap ?? 0;

      if (firstGap !== secondGap) return firstGap - secondGap;

      return first.completionRate - second.completionRate;
    });

  const classRows = portfolio.classes.map(normaliseClass);
  const allTopics = aggregateTopics(portfolio);

  return {
    teacherId: cleanedTeacherId,
    classCount: portfolio.classCount,
    studentCount: portfolio.uniqueStudentCount,
    studentsWithEvidence,
    studentsWithoutEvidence: Math.max(
      0,
      portfolio.uniqueStudentCount - studentsWithEvidence,
    ),
    highPriorityCount: uniqueRows.filter(
      (student) => student.interventionPriority === "high",
    ).length,
    decliningCount: uniqueRows.filter(
      (student) => student.trend === "declining",
    ).length,
    lowEvidenceCount: uniqueRows.filter(
      (student) =>
        student.confidence === "low" ||
        student.confidence === "insufficient",
    ).length,
    studentsWithTargets: studentsWithTargets.length,
    studentsBelowTarget,
    studentsOnOrAboveTarget,
    studentsWithoutTargets: Math.max(
      0,
      portfolio.uniqueStudentCount - studentsWithTargets.length,
    ),
    averageCompletionRate:
      uniqueRows.length > 0
        ? Math.round(
            uniqueRows.reduce(
              (total, student) => total + student.completionRate,
              0,
            ) / uniqueRows.length,
          )
        : 0,
    activeInterventions: interventions.filter(
      (intervention) => intervention.status === "active",
    ).length,
    completedInterventions: interventions.filter(
      (intervention) => intervention.status === "completed",
    ).length,
    priorityStudents,
    classes: classRows,
    priorityTopics: [...allTopics]
      .filter(
        (topic) =>
          topic.weightedPercentage <
          70,
      )
      .sort(
        (first, second) =>
          first.weightedPercentage -
          second.weightedPercentage,
      )
      .slice(0, 6),

    strongestTopics: [...allTopics]
      .filter(
        (topic) =>
          topic.weightedPercentage >=
          70,
      )
      .sort(
        (first, second) =>
          second.weightedPercentage -
          first.weightedPercentage,
      )
      .slice(0, 6),
  };
}
