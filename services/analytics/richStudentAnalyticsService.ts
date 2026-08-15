import { doc, getDoc } from "firebase/firestore";

import { ANALYTICS_EVIDENCE_WEIGHTS } from "@/data/analytics/analyticsConfig";
import { getDefaultBoundarySet } from "@/data/analytics/gradeBoundaries";
import { db } from "@/lib/firebase";
import {
  getUnifiedStudentAssignments,
  isUnifiedAssignmentComplete,
  type UnifiedAssignment,
} from "@/services/unifiedAssignmentService";
import { calculateEvidenceConfidence } from "@/services/analytics/confidenceAnalyticsService";
import { calculateGradeProgress } from "@/services/analytics/gradeAnalyticsService";
import { buildAnalyticsInterpretation } from "@/services/analytics/interpretationService";
import { buildTopicMastery } from "@/services/analytics/masteryAnalyticsService";
import { getStudentTargetGrade } from "@/services/analytics/targetGradeService";
import { buildTrend } from "@/services/analytics/trendAnalyticsService";
import { getWrittenExamQuestionEvidence } from "@/services/analytics/writtenExamQuestionEvidenceService";
import type {
  AnalyticsEvidence,
  AnalyticsEvidenceSourceCounts,
  AnalyticsEvidenceType,
  AnalyticsQualification,
  GradeLabel,
  RichStudentAnalytics,
} from "@/types/analytics";

function safeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function extractYearNumber(value: unknown): number | null {
  const text = safeString(value);
  if (!text) return null;

  const match = text.match(/\b(?:year\s*)?(7|8|9|10|11|12|13)\b/i);
  if (!match) return null;

  const year = Number(match[1]);
  return Number.isFinite(year) ? year : null;
}

function qualificationFromYear(
  year: number | null,
): AnalyticsQualification | null {
  if (year === null) return null;
  if (year <= 11) return "GCSE";
  if (year >= 12) return "A_LEVEL";
  return null;
}

function inferQualificationFromAssignments(
  assignments: UnifiedAssignment[],
): AnalyticsQualification | null {
  const years = assignments
    .map((assignment) => extractYearNumber(assignment.className))
    .filter((year): year is number => year !== null);

  if (years.some((year) => year <= 11)) return "GCSE";
  if (years.some((year) => year >= 12)) return "A_LEVEL";

  return null;
}

function normaliseQualification(
  profile: Record<string, unknown>,
  assignments: UnifiedAssignment[],
): AnalyticsQualification {
  for (const value of [
    profile.yearGroup,
    profile.year,
    profile.schoolYear,
    profile.classYear,
  ]) {
    const result = qualificationFromYear(extractYearNumber(value));
    if (result) return result;
  }

  const fromAssignments = inferQualificationFromAssignments(assignments);
  if (fromAssignments) return fromAssignments;

  const raw =
    safeString(profile.qualification) ||
    safeString(profile.course) ||
    safeString(profile.level) ||
    safeString(profile.keyStage);

  const normalised = raw.toLowerCase();

  if (
    normalised.includes("gcse") ||
    normalised.includes("ks4") ||
    normalised.includes("key stage 4")
  ) {
    return "GCSE";
  }

  if (
    normalised.includes("a level") ||
    normalised.includes("a-level") ||
    normalised === "alevel" ||
    normalised === "a_level" ||
    normalised.includes("ks5") ||
    normalised.includes("key stage 5")
  ) {
    return "A_LEVEL";
  }

  return "GCSE";
}

function normaliseLegacyTargetGrade(
  value: unknown,
  qualification: AnalyticsQualification,
): GradeLabel | null {
  const grade = safeString(value).toUpperCase();
  if (!grade) return null;

  const allowed =
    qualification === "A_LEVEL"
      ? ["A*", "A", "B", "C", "D", "E"]
      : ["9", "8", "7", "6", "5", "4", "3", "2", "1"];

  return allowed.includes(grade) ? (grade as GradeLabel) : null;
}

function evidenceType(
  assignment: UnifiedAssignment,
): AnalyticsEvidence["type"] {
  if (assignment.kind === "exam") return "written_exam";

  if (assignment.kind === "quiz") {
    return assignment.resourceType === "AI Quiz" ? "ai_quiz" : "quiz";
  }

  if (assignment.kind === "programming") return "programming";

  return "lesson";
}

function assignmentToEvidence(
  assignment: UnifiedAssignment,
): AnalyticsEvidence {
  const type = evidenceType(assignment);

  const graded =
    (type === "written_exam" || type === "quiz" || type === "ai_quiz") &&
    typeof assignment.percentage === "number";

  return {
    id: `${assignment.kind}-${assignment.id}`,
    type,
    title: assignment.title,
    topic: assignment.topic || assignment.title,
    percentage:
      typeof assignment.percentage === "number"
        ? assignment.percentage
        : null,
    rawScore:
      typeof assignment.score === "number" ? assignment.score : null,
    totalMarks:
      typeof assignment.totalMarks === "number"
        ? assignment.totalMarks
        : type === "quiz" || type === "ai_quiz"
          ? assignment.totalQuestions
          : null,
    completedAt: assignment.completedAt,
    dueDate: assignment.dueDate,
    weight: ANALYTICS_EVIDENCE_WEIGHTS[type],
    graded,
    sourceAssignmentId: assignment.id,
    sourceAssessmentId: assignment.resourceId || null,
    sourceQuestionId: null,
    sourceQuestionNumber: null,
    sourceLabel:
      type === "written_exam"
        ? "Teacher-assigned written exam"
        : assignment.resourceType || type,
  };
}

function buildMasteryEvidence(
  evidence: AnalyticsEvidence[],
  examQuestionEvidence: AnalyticsEvidence[],
): AnalyticsEvidence[] {
  const examsWithQuestionEvidence = new Set(
    examQuestionEvidence
      .map((item) => item.sourceAssignmentId)
      .filter((value): value is string => Boolean(value)),
  );

  return [
    ...evidence.filter((item) => {
      if (item.type !== "written_exam") return true;
      if (!item.sourceAssignmentId) return true;
      return !examsWithQuestionEvidence.has(item.sourceAssignmentId);
    }),
    ...examQuestionEvidence,
  ];
}

function countEvidenceSources(
  evidence: AnalyticsEvidence[],
): AnalyticsEvidenceSourceCounts {
  const counts: AnalyticsEvidenceSourceCounts = {
    written_exam: 0,
    quiz: 0,
    ai_quiz: 0,
    programming: 0,
    lesson: 0,
  };

  const ids = new Map<AnalyticsEvidenceType, Set<string>>();

  for (const item of evidence) {
    const key = item.sourceAssignmentId || item.id;
    const current = ids.get(item.type) || new Set<string>();
    current.add(key);
    ids.set(item.type, current);
  }

  for (const [type, values] of ids.entries()) {
    counts[type] = values.size;
  }

  return counts;
}

export async function getRichStudentAnalytics(
  studentId: string,
): Promise<RichStudentAnalytics> {
  const cleanedStudentId = studentId.trim();

  if (!cleanedStudentId) {
    throw new Error("A valid student account is required.");
  }

  const [profileSnapshot, assignments, storedTarget] = await Promise.all([
    getDoc(doc(db, "users", cleanedStudentId)),
    getUnifiedStudentAssignments(cleanedStudentId),
    getStudentTargetGrade(cleanedStudentId).catch(() => null),
  ]);

  const profile = profileSnapshot.exists()
    ? (profileSnapshot.data() as Record<string, unknown>)
    : {};

  const qualification = normaliseQualification(profile, assignments);
  const examBoard = safeString(profile.examBoard) || null;

  const targetGrade =
    storedTarget?.qualification === qualification
      ? storedTarget.targetGrade
      : normaliseLegacyTargetGrade(profile.targetGrade, qualification);

  const boundarySet = getDefaultBoundarySet(qualification);
  const evidence = assignments.map(assignmentToEvidence);

  const examQuestionEvidence =
    await getWrittenExamQuestionEvidence(cleanedStudentId).catch((error) => {
      console.warn(
        "Written exam question evidence could not be loaded:",
        error,
      );
      return [];
    });

  const masteryEvidence = buildMasteryEvidence(
    evidence,
    examQuestionEvidence,
  );

  const completedActivityCount = assignments.filter(
    isUnifiedAssignmentComplete,
  ).length;

  const totalActivityCount = assignments.length;

  const completionRate =
    totalActivityCount > 0
      ? Math.round((completedActivityCount / totalActivityCount) * 100)
      : 0;

  const grade = calculateGradeProgress({
    evidence,
    targetGrade,
    boundarySet,
  });

  const topics = buildTopicMastery(masteryEvidence);

  const strongestTopics = topics.slice(0, 3);

  const weakestTopics = [...topics]
    .sort((a, b) => a.weightedPercentage - b.weightedPercentage)
    .slice(0, 3);

  const trendResult = buildTrend(evidence);

  const confidence = calculateEvidenceConfidence({
    evidence,
    totalActivityCount,
    completedActivityCount,
  });

  const interpretation = buildAnalyticsInterpretation({
    grade,
    trend: trendResult.trend,
    strongestTopics,
    weakestTopics,
  });

  return {
    studentId: cleanedStudentId,
    qualification,
    examBoard,
    targetGrade,
    grade,
    confidence,
    trend: trendResult.trend,
    trendChange: trendResult.change,
    trendPoints: trendResult.points,
    topics,
    strongestTopics,
    weakestTopics,
    evidence,
    masteryEvidence,
    evidenceSourceCounts: countEvidenceSources(masteryEvidence),
    completedActivityCount,
    totalActivityCount,
    completionRate,
    interpretation,
  };
}
