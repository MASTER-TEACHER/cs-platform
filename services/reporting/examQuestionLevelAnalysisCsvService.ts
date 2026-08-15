import type { ExamAssignment } from "@/types/examAssignment";
import type { ExamClassIntelligence } from "@/types/examIntelligence";

function csvCell(value: string | number | null): string {
  const text = value === null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function safeFileName(value: string): string {
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
  const headers = [
    "Assignment",
    "Class",
    "Exam Board",
    "Qualification",
    "Question",
    "Question Text",
    "Topic",
    "Available Marks",
    "Average Marks",
    "Success %",
    "Attempted",
    "Marked Students",
    "Zero Marks",
    "Interpretation",
  ];

  const rows = intelligence.questionIntelligence.map((question) => [
    assignment.title,
    assignment.className,
    assignment.questionSetSnapshot.examBoard || "",
    assignment.questionSetSnapshot.qualification || "",
    `Q${question.questionNumber}`,
    question.questionText,
    question.topic,
    question.availableMarks,
    question.averageAwardedMarks,
    question.successPercentage,
    question.attemptedStudents,
    question.markedStudents,
    question.zeroMarkStudents,
    question.difficulty,
  ]);

  return [
    headers.map(csvCell).join(","),
    ...rows.map((row) => row.map(csvCell).join(",")),
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

  const csv = buildExamQuestionLevelAnalysisCsv({
    assignment,
    intelligence,
  });

  /*
   * UTF-8 BOM helps Microsoft Excel open the CSV with the correct
   * character encoding.
   */
  const blob = new Blob(
    ["\uFEFF", csv],
    {
      type: "text/csv;charset=utf-8;",
    },
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download =
    `${safeFileName(assignment.className)}-` +
    `${safeFileName(assignment.title)}-qla.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);
}
