import type { ExamAssignment } from "@/types/examAssignment";
import type {
  ExamClassIntelligence,
} from "@/types/examIntelligence";

function csvCell(
  value:
    | string
    | number
    | boolean
    | null,
): string {
  const text =
    value === null
      ? ""
      : String(value);

  return `"${text.replace(/"/g, '""')}"`;
}

function safeFileName(
  value: string,
): string {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return cleaned || "exam";
}

export function buildExamQuestionLevelAnalysisCsv({
  assignment,
  intelligence,
}: {
  assignment: ExamAssignment;
  intelligence: ExamClassIntelligence;
}): string {
  const rows: (
    | string
    | number
    | boolean
    | null
  )[][] = [];

  const grade =
    intelligence.gradeIntelligence;

  const headers = [
    "Section",
    "Assignment",
    "Class",
    "Exam Board",
    "Qualification",
    "Metric / Student / Question",
    "Topic / AO",
    "Value 1",
    "Value 2",
    "Value 3",
    "Value 4",
    "Interpretation / Detail",
  ];

  const common = [
    assignment.title,
    assignment.className,
    assignment.questionSetSnapshot.examBoard || "",
    assignment.questionSetSnapshot.qualification || "",
  ];

  rows.push([
    "DATA QUALITY",
    ...common,
    "Analysis confidence",
    "",
    intelligence.analysisConfidence,
    intelligence.markedCount,
    "",
    "",
    intelligence.analysisWarnings.join(" | "),
  ]);

  rows.push([
    "BOUNDARY PROVENANCE",
    ...common,
    grade.boundarySetTitle,
    "",
    grade.boundarySource,
    grade.boundaryAcademicYear,
    grade.boundaryAssessmentTitle,
    grade.boundaryVerifiedAt,
    grade.boundarySourceNote || "",
  ]);

  rows.push([
    "SUMMARY",
    ...common,
    "Marked students",
    "",
    intelligence.markedCount,
    "",
    "",
    "",
    "",
  ]);

  rows.push([
    "SUMMARY",
    ...common,
    "Class average",
    "",
    grade.classAverageMark,
    grade.totalMarks,
    grade.classAveragePercentage,
    grade.classAverageGrade,
    `Grade source: ${grade.boundarySetTitle}`,
  ]);

  rows.push([
    "SUMMARY",
    ...common,
    "Median percentage",
    "",
    intelligence.medianPercentage,
    "",
    "",
    "",
    "",
  ]);

  rows.push([
    "SUMMARY",
    ...common,
    "Highest / Lowest",
    "",
    intelligence.highestPercentage,
    intelligence.lowestPercentage,
    "",
    "",
    "",
  ]);

  rows.push([
    "GRADE",
    ...common,
    "Class next grade",
    "",
    grade.classNextGrade,
    grade.classMarksToNextGrade,
    grade.classNextGradeMinimumMark,
    grade.classPercentagePointsToNextGrade,
    `Boundary source: ${grade.boundarySource}`,
  ]);

  grade.boundaries.forEach(
    (boundary) => {
      rows.push([
        "GRADE BOUNDARY",
        ...common,
        boundary.grade,
        "",
        boundary.minimumMark,
        grade.totalMarks,
        boundary.minimumPercentage,
        "",
        grade.boundarySetTitle,
      ]);
    },
  );

  grade.gradeDistribution.forEach(
    (item) => {
      rows.push([
        "GRADE DISTRIBUTION",
        ...common,
        item.grade,
        "",
        item.count,
        item.percentage,
        "",
        "",
        "",
      ]);
    },
  );

  grade.studentOutcomes.forEach(
    (student) => {
      rows.push([
        "STUDENT OUTCOME",
        ...common,
        student.studentName,
        student.studentEmail,
        student.awardedMarks,
        student.availableMarks,
        student.percentage,
        student.grade,
        `Next grade: ${student.nextGrade || "—"}; marks to next: ${student.marksToNextGrade ?? "—"}; near boundary: ${student.nearNextGradeBoundary ? "yes" : "no"}; vs class: ${student.differenceFromClassAverage ?? "—"}pp`,
      ]);
    },
  );

  intelligence.assessmentObjectiveIntelligence.forEach(
    (ao) => {
      rows.push([
        "ASSESSMENT OBJECTIVE",
        ...common,
        ao.assessmentObjective,
        ao.assessmentObjective,
        ao.averageSuccessPercentage,
        ao.availableMarks,
        ao.marksLost,
        ao.marksLostPercentage,
        `Priority: ${ao.priority}`,
      ]);
    },
  );

  intelligence.topicIntelligence.forEach(
    (topic) => {
      rows.push([
        "TOPIC",
        ...common,
        topic.topic,
        topic.topic,
        topic.averageSuccessPercentage,
        topic.availableMarks,
        topic.marksLost,
        topic.marksLostPercentage,
        `Priority: ${topic.priority}; questions: ${topic.questionCount}`,
      ]);
    },
  );

  intelligence.questionIntelligence.forEach(
    (question) => {
      rows.push([
        "QUESTION",
        ...common,
        `Q${question.questionNumber}`,
        `${question.topic}${question.assessmentObjective ? ` · ${question.assessmentObjective}` : ""}`,
        question.averageAwardedMarks,
        question.availableMarks,
        question.successPercentage,
        question.marksLostPercentage,
        [
          question.commandWord
            ? `Command: ${question.commandWord}`
            : "",
          `Attempted ${question.attemptedStudents}/${question.markedStudents}`,
          `Omitted ${question.omittedStudents} (${question.omissionPercentage ?? "—"}%)`,
          `Zero marks ${question.zeroMarkStudents}`,
          `Full marks ${question.fullMarkStudents}`,
          `Marks lost ${question.marksLost}`,
          `Discrimination ${question.discriminationIndex ?? "insufficient"} (${question.discriminationLabel})`,
          `Interpretation ${question.difficulty}`,
          `Question: ${question.questionText}`,
        ]
          .filter(Boolean)
          .join("; "),
      ]);
    },
  );

  return [
    headers.map(csvCell).join(","),
    ...rows.map((row) =>
      row.map(csvCell).join(","),
    ),
  ].join("\r\n");
}

export function downloadExamQuestionLevelAnalysisCsv({
  assignment,
  intelligence,
}: {
  assignment: ExamAssignment;
  intelligence: ExamClassIntelligence;
}): void {
  if (typeof window === "undefined") {
    return;
  }

  const csv =
    buildExamQuestionLevelAnalysisCsv({
      assignment,
      intelligence,
    });

  const blob = new Blob(
    ["\uFEFF", csv],
    {
      type: "text/csv;charset=utf-8;",
    },
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download =
    `${safeFileName(assignment.className)}-` +
    `${safeFileName(assignment.title)}-final-qla.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);
}
