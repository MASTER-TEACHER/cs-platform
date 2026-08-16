import type {
  ClassProgressReport,
  StudentProgressReport,
} from "@/types/reporting";

function esc(value: unknown): string {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function rowsToCsv(rows: unknown[][]): string {
  return rows
    .map((row) => row.map(esc).join(","))
    .join("\n");
}

export function studentReportToCsv(
  report: StudentProgressReport,
): string {
  const rows: unknown[][] = [
    ["CS Master Student Progress Report"],
    ["Generated", report.generatedAt.toLocaleString()],
    ["Student", report.studentName],
    ["Email", report.studentEmail],
    ["Class", report.className],
    [],
    ["ATTAINMENT"],
    ["Working grade", report.workingGrade || "—"],
    ["Target grade", report.targetGrade || "—"],
    ["Working percentage", report.workingPercentage ?? "—"],
    ["Grade gap", report.gradeGap ?? "—"],
    ["Next grade", report.nextGrade || "—"],
    ["Marks to next grade", report.marksToNextGrade ?? "—"],
    ["Trend", report.trend],
    ["Completion rate", `${report.completionRate}%`],
    ["Evidence confidence", report.confidence],
    [],
    ["EVIDENCE SOURCES"],
    ["Written exams", report.evidenceSourceCounts.written_exam],
    ["Quizzes", report.evidenceSourceCounts.quiz],
    ["AI quizzes", report.evidenceSourceCounts.ai_quiz],
    ["Programming", report.evidenceSourceCounts.programming],
    ["Lessons", report.evidenceSourceCounts.lesson],
    [],
    ["EVIDENCE WARNINGS"],
    ...report.evidenceWarnings.map((item) => [item]),
    [],
    ["STRENGTHS"],
    ...report.strengths.map((item) => [
      item.topic,
      `${item.mastery}%`,
    ]),
    [],
    ["PRIORITY AREAS"],
    ...report.priorities.map((item) => [
      item.topic,
      `${item.mastery}%`,
    ]),
    [],
    ["RECENT GRADED EVIDENCE"],
    ["Assessment", "Percentage", "Completed"],
    ...report.recentEvidence.map((item) => [
      item.title,
      item.percentage === null ? "—" : `${item.percentage}%`,
      item.completedAt?.toLocaleString() || "—",
    ]),
    [],
    ["INTERVENTIONS"],
    ["Active", report.interventionSummary.active],
    ["Completed", report.interventionSummary.completed],
    ["Cancelled", report.interventionSummary.cancelled],
    [],
    ["TEACHER COMMENTARY"],
    ...report.teacherCommentary.map((item) => [item]),
    [],
    ["STUDENT NEXT STEPS"],
    ...report.studentNextSteps.map((item) => [item]),
  ];

  return rowsToCsv(rows);
}

export function classReportToCsv(
  report: ClassProgressReport,
): string {
  const rows: unknown[][] = [
    ["CS Master Class Progress Report"],
    ["Generated", report.generatedAt.toLocaleString()],
    ["Class", report.className],
    ["Students", report.studentCount],
    ["Students with evidence", report.studentsWithEvidence],
    [],
    ["ATTAINMENT"],
    ["Average working grade", report.averageWorkingGrade || "—"],
    ["Average target grade", report.averageTargetGrade || "—"],
    ["Average weighted percentage", report.averageWeightedPercentage ?? "—"],
    ["Average completion rate", `${report.averageCompletionRate}%`],
    ["On / above target", `${report.onOrAboveTargetPercentage}%`],
    ["High priority students", report.highPriorityCount],
    ["Declining students", report.decliningCount],
    ["Low evidence students", report.lowEvidenceCount],
    ["Targets not set", report.targetNotSetCount],
    [],
    ["GRADE DISTRIBUTION"],
    ["Grade", "Count"],
    ...report.gradeDistribution.map((item) => [
      item.grade,
      item.count,
    ]),
    [],
    ["EVIDENCE SOURCES"],
    ["Written exams", report.evidenceSourceCounts.written_exam],
    ["Quizzes", report.evidenceSourceCounts.quiz],
    ["AI quizzes", report.evidenceSourceCounts.ai_quiz],
    ["Programming", report.evidenceSourceCounts.programming],
    ["Lessons", report.evidenceSourceCounts.lesson],
    [],
    ["EVIDENCE WARNINGS"],
    ...report.evidenceWarnings.map((item) => [item]),
    [],
    ["STRONGEST TOPICS"],
    ...report.strongestTopics.map((item) => [
      item.topic,
      `${item.mastery}%`,
    ]),
    [],
    ["PRIORITY TOPICS"],
    ...report.priorityTopics.map((item) => [
      item.topic,
      `${item.mastery}%`,
    ]),
    [],
    ["PRIORITY STUDENTS"],
    [
      "Student",
      "Priority",
      "Working grade",
      "Target grade",
      "Grade gap",
      "Completion",
      "Evidence confidence",
      "Weakest topic",
      "Weakest topic %",
    ],
    ...report.priorityStudents.map((student) => [
      student.studentName,
      student.priority,
      student.workingGrade || "—",
      student.targetGrade || "—",
      student.gradeGap ?? "—",
      `${student.completionRate}%`,
      student.confidence,
      student.weakestTopic,
      student.weakestTopicPercentage === null
        ? "—"
        : `${student.weakestTopicPercentage}%`,
    ]),
    [],
    ["WRITTEN EXAM / QLA SUMMARY"],
    [
      "Assessment",
      "Marked",
      "Students",
      "Class average",
      "Average grade",
      "Marks to next grade",
      "Analysis confidence",
      "Weakest topic",
      "Weakest topic %",
      "Hardest question",
      "Hardest question %",
      "Weakest AO",
      "Weakest AO %",
      "Marks lost",
      "Near boundary",
    ],
    ...report.examSummaries.map((exam) => [
      exam.title,
      exam.markedCount,
      exam.studentCount,
      exam.classAverage === null ? "—" : `${exam.classAverage}%`,
      exam.classAverageGrade || "—",
      exam.classMarksToNextGrade ?? "—",
      exam.analysisConfidence,
      exam.weakestTopic || "—",
      exam.weakestTopicSuccess === null
        ? "—"
        : `${exam.weakestTopicSuccess}%`,
      exam.hardestQuestionNumber === null
        ? "—"
        : `Q${exam.hardestQuestionNumber}`,
      exam.hardestQuestionSuccess === null
        ? "—"
        : `${exam.hardestQuestionSuccess}%`,
      exam.weakestAssessmentObjective || "—",
      exam.weakestAssessmentObjectiveSuccess === null
        ? "—"
        : `${exam.weakestAssessmentObjectiveSuccess}%`,
      exam.marksLost,
      exam.nearBoundaryCount,
    ]),
    [],
    ["TEACHER INTERPRETATION"],
    ...report.teacherInterpretation.map((item) => [item]),
    [],
    ["RECOMMENDED ACTIONS"],
    ...report.recommendedActions.map((item) => [item]),
  ];

  return rowsToCsv(rows);
}
