import { buildExamClassIntelligence } from "@/services/analytics/examIntelligenceService";
import { getTeacherAnalyticsPortfolio } from "@/services/analytics/teacherAnalyticsService";
import { getTeacherExamAssignments } from "@/services/examAssignmentService";
import { getAssignmentSubmissions } from "@/services/examSubmissionService";
import type {
  AnalyticsEvidenceSourceCounts,
} from "@/types/analytics";
import type {
  ClassProgressReport,
  ReportExamSummary,
  ReportPriorityStudent,
} from "@/types/reporting";

function emptyEvidenceCounts(): AnalyticsEvidenceSourceCounts {
  return {
    written_exam: 0,
    quiz: 0,
    ai_quiz: 0,
    programming: 0,
    lesson: 0,
  };
}

function combineEvidenceCounts(
  rows: AnalyticsEvidenceSourceCounts[],
): AnalyticsEvidenceSourceCounts {
  return rows.reduce(
    (totals, row) => ({
      written_exam: totals.written_exam + row.written_exam,
      quiz: totals.quiz + row.quiz,
      ai_quiz: totals.ai_quiz + row.ai_quiz,
      programming: totals.programming + row.programming,
      lesson: totals.lesson + row.lesson,
    }),
    emptyEvidenceCounts(),
  );
}

function buildEvidenceWarnings({
  studentsWithEvidence,
  studentCount,
  lowEvidenceCount,
  sourceCounts,
}: {
  studentsWithEvidence: number;
  studentCount: number;
  lowEvidenceCount: number;
  sourceCounts: AnalyticsEvidenceSourceCounts;
}): string[] {
  const warnings: string[] = [];

  if (studentCount === 0) {
    warnings.push("This class has no enrolled students.");
    return warnings;
  }

  if (studentsWithEvidence === 0) {
    warnings.push(
      "No graded attainment evidence is available yet. Do not draw class-performance conclusions until assessed work has been completed.",
    );
  } else if (studentsWithEvidence < studentCount) {
    warnings.push(
      `${studentCount - studentsWithEvidence} learner${
        studentCount - studentsWithEvidence === 1 ? "" : "s"
      } currently have no graded attainment evidence.`,
    );
  }

  if (lowEvidenceCount > 0) {
    warnings.push(
      `${lowEvidenceCount} learner${
        lowEvidenceCount === 1 ? " has" : "s have"
      } low or insufficient evidence confidence.`,
    );
  }

  const assessedSources =
    sourceCounts.written_exam +
    sourceCounts.quiz +
    sourceCounts.ai_quiz;

  if (assessedSources === 0) {
    warnings.push(
      "The class has no written-exam or quiz evidence in the current analytics portfolio.",
    );
  }

  return warnings;
}

function priorityStudents(
  students: Array<{
    studentId: string;
    studentName: string;
    workingGrade: ReportPriorityStudent["workingGrade"];
    targetGrade: ReportPriorityStudent["targetGrade"];
    gradeGap: number | null;
    completionRate: number;
    confidence: unknown;
    interventionPriority: ReportPriorityStudent["priority"];
    analytics: {
      topics: Array<{
        topic: string;
        weightedPercentage: number;
      }>;
    };
  }>,
): ReportPriorityStudent[] {
  const rank = {
    high: 0,
    medium: 1,
    monitor: 2,
    none: 3,
  };

  return students
    .map((student) => {
      const weakest = [...student.analytics.topics].sort(
        (first, second) =>
          first.weightedPercentage - second.weightedPercentage,
      )[0];

      return {
        studentId: student.studentId,
        studentName: student.studentName,
        workingGrade: student.workingGrade,
        targetGrade: student.targetGrade,
        gradeGap: student.gradeGap,
        completionRate: student.completionRate,
        confidence: String(student.confidence),
        priority: student.interventionPriority,
        weakestTopic: weakest?.topic || "No topic evidence",
        weakestTopicPercentage: weakest?.weightedPercentage ?? null,
      };
    })
    .filter((student) => student.priority !== "none")
    .sort((first, second) => {
      const difference = rank[first.priority] - rank[second.priority];
      if (difference !== 0) return difference;

      return (
        (first.weakestTopicPercentage ?? 101) -
        (second.weakestTopicPercentage ?? 101)
      );
    })
    .slice(0, 8);
}

function examSummary(
  assignmentId: string,
  title: string,
  intelligence: ReturnType<typeof buildExamClassIntelligence>,
): ReportExamSummary {
  return {
    assignmentId,
    title,
    markedCount: intelligence.markedCount,
    studentCount: intelligence.studentCount,
    classAverage: intelligence.classAverage,
    classAverageGrade:
      intelligence.gradeIntelligence.classAverageGrade,
    classMarksToNextGrade:
      intelligence.gradeIntelligence.classMarksToNextGrade,
    analysisConfidence: intelligence.analysisConfidence,
    weakestTopic:
      intelligence.weakestTopic?.topic ?? null,
    weakestTopicSuccess:
      intelligence.weakestTopic?.averageSuccessPercentage ?? null,
    strongestTopic:
      intelligence.strongestTopic?.topic ?? null,
    strongestTopicSuccess:
      intelligence.strongestTopic?.averageSuccessPercentage ?? null,
    hardestQuestionNumber:
      intelligence.hardestQuestion?.questionNumber ?? null,
    hardestQuestionSuccess:
      intelligence.hardestQuestion?.successPercentage ?? null,
    weakestAssessmentObjective:
      intelligence.weakestAssessmentObjective?.assessmentObjective ?? null,
    weakestAssessmentObjectiveSuccess:
      intelligence.weakestAssessmentObjective?.averageSuccessPercentage ?? null,
    marksLost:
      intelligence.questionIntelligence.reduce(
        (sum, question) => sum + question.marksLost,
        0,
      ),
    nearBoundaryCount:
      intelligence.gradeIntelligence.nearBoundaryStudents.length,
    gradeDistribution:
      intelligence.gradeIntelligence.gradeDistribution,
    warnings: intelligence.analysisWarnings,
  };
}

export async function buildClassProgressReport({
  teacherId,
  classId,
}: {
  teacherId: string;
  classId: string;
}): Promise<ClassProgressReport | null> {
  const portfolio = await getTeacherAnalyticsPortfolio(teacherId);
  const classAnalytics = portfolio.classes.find(
    (item) => item.classId === classId,
  );

  if (!classAnalytics) return null;

  const sortedTopics = [...classAnalytics.topicAnalytics].sort(
    (first, second) =>
      second.weightedPercentage - first.weightedPercentage,
  );

  const evidenceSourceCounts = combineEvidenceCounts(
    classAnalytics.students.map(
      (student) => student.analytics.evidenceSourceCounts,
    ),
  );

  const teacherExamAssignments = await getTeacherExamAssignments(
    teacherId,
  );

  const classExamAssignments = teacherExamAssignments.filter(
    (assignment) =>
      assignment.classId === classId &&
      assignment.status !== "cancelled",
  );

  const examSummaries = await Promise.all(
    classExamAssignments.map(async (assignment) => {
      const submissions = await getAssignmentSubmissions(
        assignment.id,
        teacherId,
      );

      return examSummary(
        assignment.id,
        assignment.title,
        buildExamClassIntelligence(
          assignment,
          submissions,
        ),
      );
    }),
  );

  const evidenceWarnings = buildEvidenceWarnings({
    studentsWithEvidence: classAnalytics.studentsWithEvidence,
    studentCount: classAnalytics.studentCount,
    lowEvidenceCount: classAnalytics.lowEvidenceCount,
    sourceCounts: evidenceSourceCounts,
  });

  const teacherInterpretation: string[] = [];
  const recommendedActions: string[] = [];

  if (classAnalytics.averageWeightedPercentage !== null) {
    teacherInterpretation.push(
      `Current weighted class attainment is ${classAnalytics.averageWeightedPercentage}%.`,
    );
  }

  if (classAnalytics.onOrAboveTargetPercentage < 60) {
    teacherInterpretation.push(
      `${classAnalytics.onOrAboveTargetPercentage}% of learners with targets are currently working on or above target.`,
    );
    recommendedActions.push(
      "Review below-target learners and separate curriculum gaps from low-evidence or completion issues.",
    );
  }

  if (classAnalytics.decliningCount > 0) {
    teacherInterpretation.push(
      `${classAnalytics.decliningCount} learner${
        classAnalytics.decliningCount === 1 ? " has" : "s have"
      } a declining recent trend.`,
    );
    recommendedActions.push(
      "Review declining learners before the next assessment cycle and identify whether the decline is topic-specific.",
    );
  }

  if (classAnalytics.lowEvidenceCount > 0) {
    recommendedActions.push(
      "Collect additional graded evidence for learners with low evidence confidence before making high-stakes progress judgements.",
    );
  }

  if (sortedTopics.length > 0) {
    const weakest = sortedTopics[sortedTopics.length - 1];

    teacherInterpretation.push(
      `${weakest.topic} is the current lowest class curriculum area at ${weakest.weightedPercentage}% mastery.`,
    );

    if (weakest.weightedPercentage < 50) {
      recommendedActions.push(
        `Prioritise reteaching or targeted reassessment in ${weakest.topic}.`,
      );
    }
  }

  const usableExam = examSummaries
    .filter((exam) => exam.markedCount > 0)
    .sort(
      (first, second) =>
        (first.classAverage ?? 101) -
        (second.classAverage ?? 101),
    )[0];

  if (usableExam?.weakestTopic) {
    teacherInterpretation.push(
      `Written-exam QLA currently identifies ${usableExam.weakestTopic} as a priority area in ${usableExam.title}.`,
    );
  }

  return {
    classId: classAnalytics.classId,
    className: classAnalytics.className,
    generatedAt: new Date(),
    studentCount: classAnalytics.studentCount,
    studentsWithEvidence: classAnalytics.studentsWithEvidence,

    averageWorkingGrade: classAnalytics.averageWorkingGrade,
    averageTargetGrade: classAnalytics.averageTargetGrade,
    averageWeightedPercentage: classAnalytics.averageWeightedPercentage,
    averageCompletionRate: classAnalytics.averageCompletionRate,
    onOrAboveTargetPercentage: classAnalytics.onOrAboveTargetPercentage,

    highPriorityCount: classAnalytics.highPriorityCount,
    decliningCount: classAnalytics.decliningCount,
    lowEvidenceCount: classAnalytics.lowEvidenceCount,
    targetNotSetCount: classAnalytics.targetNotSetCount,

    gradeDistribution: classAnalytics.gradeDistribution,
    strongestTopics: sortedTopics.slice(0, 4).map((topic) => ({
      topic: topic.topic,
      mastery: topic.weightedPercentage,
    })),
    priorityTopics: [...sortedTopics]
      .reverse()
      .slice(0, 4)
      .map((topic) => ({
        topic: topic.topic,
        mastery: topic.weightedPercentage,
      })),
    priorityStudents: priorityStudents(classAnalytics.students),

    evidenceSourceCounts,
    evidenceWarnings,

    writtenExamCount: classExamAssignments.length,
    examSummaries,

    teacherInterpretation,
    recommendedActions,
  };
}
