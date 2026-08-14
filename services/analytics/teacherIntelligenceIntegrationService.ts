import type {
  ClassTopicAnalytics,
  TeacherAnalyticsPortfolio,
  TeacherClassAnalytics,
  TeacherStudentAnalyticsRow,
} from "@/types/teacherAnalytics";

export type IntelligencePriorityStudent = {
  studentId: string;
  studentName: string;
  studentEmail: string;
  classId: string;
  className: string;
  workingGrade: string;
  targetGrade: string;
  gap: number | null;
  trend: string;
  completionRate: number;
  confidence: string;
  priority: TeacherStudentAnalyticsRow["interventionPriority"];
  reasons: string[];
  weakestTopic: string;
  weakestTopicPercentage: number | null;
};

export type IntelligenceClassSummary = {
  classId: string;
  className: string;
  yearGroup: string;
  studentCount: number;
  workingGrade: string;
  targetGrade: string;
  onOrAboveTargetPercentage: number;
  completionRate: number;
  highPriorityCount: number;
  decliningCount: number;
  lowEvidenceCount: number;
};

export type IntelligenceReportSummary = {
  classCount: number;
  studentCount: number;
  studentsWithTargets: number;
  studentsWithoutTargets: number;
  onOrAboveTarget: number;
  belowTarget: number;
  highPriority: number;
  declining: number;
  lowEvidence: number;
  averageCompletionRate: number;
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

export function getPriorityStudents(
  portfolio: TeacherAnalyticsPortfolio,
): IntelligencePriorityStudent[] {
  return portfolio.classes
    .flatMap((classItem) =>
      classItem.students.map((student) => {
        const weakestTopic = [...student.analytics.topics].sort(
          (first, second) =>
            first.weightedPercentage - second.weightedPercentage,
        )[0];

        return {
          studentId: student.studentId,
          studentName: student.studentName,
          studentEmail: student.studentEmail,
          classId: classItem.classId,
          className: classItem.className,
          workingGrade: student.workingGrade || "—",
          targetGrade: student.targetGrade || "Not set",
          gap: student.gradeGap,
          trend: student.trend,
          completionRate: student.completionRate,
          confidence: String(student.confidence),
          priority: student.interventionPriority,
          reasons: student.interventionReasons,
          weakestTopic: weakestTopic?.topic || "No topic evidence",
          weakestTopicPercentage: weakestTopic?.weightedPercentage ?? null,
        };
      }),
    )
    .sort((first, second) => {
      const priorityDifference =
        priorityRank(second.priority) - priorityRank(first.priority);

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      const firstGap = first.gap ?? 0;
      const secondGap = second.gap ?? 0;

      return firstGap - secondGap;
    });
}

export function getClassSummaries(
  portfolio: TeacherAnalyticsPortfolio,
): IntelligenceClassSummary[] {
  return portfolio.classes.map((classItem) => ({
    classId: classItem.classId,
    className: classItem.className,
    yearGroup: classItem.yearGroup,
    studentCount: classItem.studentCount,
    workingGrade: classItem.averageWorkingGrade || "—",
    targetGrade: classItem.averageTargetGrade || "Not set",
    onOrAboveTargetPercentage: classItem.onOrAboveTargetPercentage,
    completionRate: classItem.averageCompletionRate,
    highPriorityCount: classItem.highPriorityCount,
    decliningCount: classItem.decliningCount,
    lowEvidenceCount: classItem.lowEvidenceCount,
  }));
}

export function getClassById(
  portfolio: TeacherAnalyticsPortfolio,
  classId: string,
): TeacherClassAnalytics | null {
  return (
    portfolio.classes.find(
      (classItem) => classItem.classId === classId,
    ) || null
  );
}

export function buildReportSummary(
  portfolio: TeacherAnalyticsPortfolio,
): IntelligenceReportSummary {
  const students = portfolio.classes.flatMap(
    (classItem) => classItem.students,
  );

  const studentsWithTargets = students.filter(
    (student) => student.targetGrade !== null,
  );

  const studentsWithoutTargets =
    students.length - studentsWithTargets.length;

  const onOrAboveTarget = studentsWithTargets.filter(
    (student) =>
      student.gradeGap !== null &&
      student.gradeGap >= 0,
  ).length;

  const belowTarget = studentsWithTargets.filter(
    (student) =>
      student.gradeGap !== null &&
      student.gradeGap < 0,
  ).length;

  const allTopics = portfolio.classes.flatMap(
    (classItem) => classItem.topicAnalytics,
  );

  const topicGroups = new Map<
    string,
    { values: number[]; evidence: number; students: number }
  >();

  for (const topic of allTopics) {
    const current =
      topicGroups.get(topic.topic) || {
        values: [],
        evidence: 0,
        students: 0,
      };

    current.values.push(topic.weightedPercentage);
    current.evidence += topic.evidenceCount;
    current.students += topic.studentCount;

    topicGroups.set(topic.topic, current);
  }

  const aggregatedTopics: ClassTopicAnalytics[] = [
    ...topicGroups.entries(),
  ].map(([topic, values]) => {
    const percentage =
      values.values.length > 0
        ? Math.round(
            values.values.reduce((sum, value) => sum + value, 0) /
              values.values.length,
          )
        : 0;

    return {
      topic,
      weightedPercentage: percentage,
      recentPercentage: percentage,
      evidenceCount: values.evidence,
      studentCount: values.students,
      status:
        percentage >= 70
          ? "secure"
          : percentage >= 50
            ? "developing"
            : "priority",
    };
  });

  const averageCompletionRate =
    students.length > 0
      ? Math.round(
          students.reduce(
            (sum, student) => sum + student.completionRate,
            0,
          ) / students.length,
        )
      : 0;

  return {
    classCount: portfolio.classCount,
    studentCount: portfolio.uniqueStudentCount,
    studentsWithTargets: studentsWithTargets.length,
    studentsWithoutTargets,
    onOrAboveTarget,
    belowTarget,
    highPriority: students.filter(
      (student) => student.interventionPriority === "high",
    ).length,
    declining: students.filter(
      (student) => student.trend === "declining",
    ).length,
    lowEvidence: students.filter(
      (student) =>
        student.confidence === "low" ||
        student.confidence === "insufficient",
    ).length,
    averageCompletionRate,
    priorityTopics: [...aggregatedTopics]
      .sort(
        (first, second) =>
          first.weightedPercentage - second.weightedPercentage,
      )
      .slice(0, 6),
    strongestTopics: [...aggregatedTopics]
      .sort(
        (first, second) =>
          second.weightedPercentage - first.weightedPercentage,
      )
      .slice(0, 6),
  };
}
