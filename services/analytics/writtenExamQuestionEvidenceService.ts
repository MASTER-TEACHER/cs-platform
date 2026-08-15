import { ANALYTICS_EVIDENCE_WEIGHTS } from "@/data/analytics/analyticsConfig";
import { getStudentExamAssignments } from "@/services/examAssignmentService";
import { getExamSubmission } from "@/services/examSubmissionService";
import type { AnalyticsEvidence } from "@/types/analytics";

function safeTopic(question: unknown, fallback: string): string {
  if (!question || typeof question !== "object") return fallback;

  const data = question as Record<string, unknown>;
  const candidates = [
    data.topic,
    data.topicFocus,
    data.subtopic,
    data.curriculumTopic,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return fallback;
}

function safeMarks(value: unknown): number {
  return typeof value === "number" &&
    Number.isFinite(value) &&
    value > 0
    ? value
    : 0;
}

export async function getWrittenExamQuestionEvidence(
  studentId: string,
): Promise<AnalyticsEvidence[]> {
  const id = studentId.trim();
  if (!id) return [];

  const assignments = await getStudentExamAssignments(id);

  const submissions = await Promise.all(
    assignments.map((assignment) =>
      getExamSubmission(assignment.id, id).catch(() => null),
    ),
  );

  const evidence: AnalyticsEvidence[] = [];

  assignments.forEach((assignment, assignmentIndex) => {
    const submission = submissions[assignmentIndex];

    if (!submission || submission.status !== "marked") return;

    const fallbackTopic =
      assignment.questionSetSnapshot.topic ||
      assignment.questionSetTitle ||
      assignment.title ||
      "General Computer Science";

    const paperMarks =
      assignment.totalMarks > 0
        ? assignment.totalMarks
        : submission.totalAvailableMarks;

    assignment.questionSetSnapshot.questions.forEach((question) => {
      const answer = submission.answers.find(
        (item) => item.questionId === question.id,
      );

      if (!answer || answer.awardedMarks === null) return;

      const availableMarks = safeMarks(question.marks);
      if (availableMarks <= 0) return;

      const awardedMarks = Math.max(
        0,
        Math.min(availableMarks, answer.awardedMarks),
      );

      const weightShare =
        paperMarks > 0
          ? availableMarks / paperMarks
          : 1 / Math.max(1, assignment.questionCount);

      evidence.push({
        id: `written-exam-question-${assignment.id}-${question.id}`,
        type: "written_exam",
        title: `${assignment.title} · Q${question.questionNumber}`,
        topic: safeTopic(question, fallbackTopic),
        percentage: Math.round(
          (awardedMarks / availableMarks) * 100,
        ),
        rawScore: awardedMarks,
        totalMarks: availableMarks,
        completedAt:
          submission.markedAt || submission.submittedAt || null,
        dueDate: assignment.dueDate,
        weight:
          ANALYTICS_EVIDENCE_WEIGHTS.written_exam * weightShare,
        graded: true,
        sourceAssignmentId: assignment.id,
        sourceAssessmentId: assignment.questionSetId,
        sourceQuestionId: question.id,
        sourceQuestionNumber: question.questionNumber,
        sourceLabel: "Teacher-marked written exam question",
      });
    });
  });

  return evidence;
}
