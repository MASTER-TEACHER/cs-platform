import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";

import { ANALYTICS_EVIDENCE_WEIGHTS } from "@/data/analytics/analyticsConfig";
import { getDefaultBoundarySet } from "@/data/analytics/gradeBoundaries";
import { db } from "@/lib/firebase";

import { calculateEvidenceConfidence } from "@/services/analytics/confidenceAnalyticsService";
import { calculateGradeProgress } from "@/services/analytics/gradeAnalyticsService";
import { buildAnalyticsInterpretation } from "@/services/analytics/interpretationService";
import { buildTopicMastery } from "@/services/analytics/masteryAnalyticsService";
import { getStudentTargetGrade } from "@/services/analytics/targetGradeService";
import { buildTrend } from "@/services/analytics/trendAnalyticsService";
import { getWrittenExamQuestionEvidence } from "@/services/analytics/writtenExamQuestionEvidenceService";

import { normaliseTopic } from "@/services/topicNormalisationService";

import {
  getUnifiedStudentAssignments,
  isUnifiedAssignmentComplete,
  type UnifiedAssignment,
} from "@/services/unifiedAssignmentService";

import type {
  AnalyticsEvidence,
  AnalyticsEvidenceSourceCounts,
  AnalyticsEvidenceType,
  AnalyticsQualification,
  GradeLabel,
  RichStudentAnalytics,
} from "@/types/analytics";

function safeString(
  value: unknown,
): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function safeNumber(
  value: unknown,
): number | null {
  return typeof value === "number" &&
    Number.isFinite(value)
    ? value
    : null;
}

function extractYearNumber(
  value: unknown,
): number | null {
  const text = safeString(value);

  if (!text) {
    return null;
  }

  const match = text.match(
    /\b(?:year\s*)?(7|8|9|10|11|12|13)\b/i,
  );

  if (!match) {
    return null;
  }

  const year = Number(match[1]);

  return Number.isFinite(year)
    ? year
    : null;
}

function qualificationFromYear(
  year: number | null,
): AnalyticsQualification | null {
  if (year === null) {
    return null;
  }

  if (year <= 11) {
    return "GCSE";
  }

  if (year >= 12) {
    return "A_LEVEL";
  }

  return null;
}

function inferQualificationFromAssignments(
  assignments: UnifiedAssignment[],
): AnalyticsQualification | null {
  const years = assignments
    .map((assignment) =>
      extractYearNumber(
        assignment.className,
      ),
    )
    .filter(
      (year): year is number =>
        year !== null,
    );

  if (
    years.some(
      (year) => year <= 11,
    )
  ) {
    return "GCSE";
  }

  if (
    years.some(
      (year) => year >= 12,
    )
  ) {
    return "A_LEVEL";
  }

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
    const result =
      qualificationFromYear(
        extractYearNumber(value),
      );

    if (result) {
      return result;
    }
  }

  const fromAssignments =
    inferQualificationFromAssignments(
      assignments,
    );

  if (fromAssignments) {
    return fromAssignments;
  }

  const raw =
    safeString(
      profile.qualification,
    ) ||
    safeString(
      profile.course,
    ) ||
    safeString(
      profile.level,
    ) ||
    safeString(
      profile.keyStage,
    );

  const normalised =
    raw.toLowerCase();

  if (
    normalised.includes("gcse") ||
    normalised.includes("ks4") ||
    normalised.includes(
      "key stage 4",
    )
  ) {
    return "GCSE";
  }

  if (
    normalised.includes(
      "a level",
    ) ||
    normalised.includes(
      "a-level",
    ) ||
    normalised === "alevel" ||
    normalised === "a_level" ||
    normalised.includes("ks5") ||
    normalised.includes(
      "key stage 5",
    )
  ) {
    return "A_LEVEL";
  }

  return "GCSE";
}

function normaliseLegacyTargetGrade(
  value: unknown,
  qualification:
    AnalyticsQualification,
): GradeLabel | null {
  const grade =
    safeString(value).toUpperCase();

  if (!grade) {
    return null;
  }

  const allowed =
    qualification === "A_LEVEL"
      ? [
          "A*",
          "A",
          "B",
          "C",
          "D",
          "E",
        ]
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

  return allowed.includes(grade)
    ? (grade as GradeLabel)
    : null;
}

function evidenceType(
  assignment:
    UnifiedAssignment,
): AnalyticsEvidence["type"] {
  if (
    assignment.kind === "exam"
  ) {
    return "written_exam";
  }

  if (
    assignment.kind === "quiz"
  ) {
    return assignment.resourceType ===
      "AI Quiz"
      ? "ai_quiz"
      : "quiz";
  }

  if (
    assignment.kind ===
    "programming"
  ) {
    return "programming";
  }

  return "lesson";
}

/*
 * These are assessment/source labels,
 * not curriculum topics.
 */
function isGenericTopicLabel(
  value: string,
): boolean {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      " ",
    )
    .trim();

  return [
    "",
    "quiz",
    "assigned quiz",
    "ai quiz",
    "assessment",
    "assigned assessment",
    "practice quiz",
    "written exam",
    "exam",
  ].includes(cleaned);
}

function cleanAssessmentTitle(
  value: string,
): string {
  return value
    .trim()
    .replace(
      /\s+(demo\s+)?quiz$/i,
      "",
    )
    .replace(
      /\s+practice\s+quiz$/i,
      "",
    )
    .replace(
      /\s+assessment$/i,
      "",
    )
    .trim();
}

/*
 * Use the same canonical topic-normalisation
 * service that Adaptive Learning already uses.
 */
function resolveAnalyticsTopic(
  ...candidates: Array<
    string | null | undefined
  >
): string | null {
  for (
    const candidate of candidates
  ) {
    const raw =
      cleanAssessmentTitle(
        safeString(candidate),
      );

    if (
      !raw ||
      isGenericTopicLabel(raw)
    ) {
      continue;
    }

    const normalised =
      normaliseTopic(raw);

    const topicTitle =
      safeString(
        normalised.topicTitle,
      );

    if (
      topicTitle &&
      !isGenericTopicLabel(
        topicTitle,
      )
    ) {
      return topicTitle;
    }
  }

  return null;
}

function assignmentToEvidence(
  assignment:
    UnifiedAssignment,
): AnalyticsEvidence | null {
  const type =
    evidenceType(assignment);

  const graded =
    (
      type ===
        "written_exam" ||
      type === "quiz" ||
      type === "ai_quiz"
    ) &&
    typeof assignment.percentage ===
      "number";

  const topic =
    resolveAnalyticsTopic(
      assignment.topic,
      assignment.title,
    );

  /*
   * Graded assessment evidence that cannot
   * be attributed to a real curriculum topic
   * should not create a fake mastery topic.
   */
  if (
    (
      type === "quiz" ||
      type === "ai_quiz" ||
      type ===
        "written_exam"
    ) &&
    !topic
  ) {
    console.warn(
      `Analytics assignment ${assignment.id} has no resolvable curriculum topic and was excluded from topic analytics.`,
    );

    return null;
  }

  return {
    id:
      `${assignment.kind}-${assignment.id}`,

    type,

    title:
      assignment.title,

    topic:
      topic ||
      assignment.title,

    percentage:
      typeof assignment.percentage ===
      "number"
        ? assignment.percentage
        : null,

    rawScore:
      typeof assignment.score ===
      "number"
        ? assignment.score
        : null,

    totalMarks:
      typeof assignment.totalMarks ===
      "number"
        ? assignment.totalMarks
        : type === "quiz" ||
            type === "ai_quiz"
          ? assignment.totalQuestions
          : null,

    completedAt:
      assignment.completedAt,

    dueDate:
      assignment.dueDate,

    weight:
      ANALYTICS_EVIDENCE_WEIGHTS[
        type
      ],

    graded,

    sourceAssignmentId:
      assignment.id,

    sourceAssessmentId:
      assignment.resourceId ||
      null,

    sourceQuestionId: null,

    sourceQuestionNumber: null,

    sourceLabel:
      type === "written_exam"
        ? "Teacher-assigned written exam"
        : assignment.resourceType ||
          type,
  };
}

/*
 * Independent practice quizzes are stored
 * separately from teacher assignments at:
 *
 * users/{studentId}/quizResults
 *
 * Adaptive Learning already consumes them.
 * Analytics must consume the same evidence.
 */
async function getIndependentQuizEvidence(
  studentId: string,
): Promise<AnalyticsEvidence[]> {
  const snapshot =
    await getDocs(
      query(
        collection(
          db,
          "users",
          studentId,
          "quizResults",
        ),
        orderBy(
          "createdAt",
          "desc",
        ),
      ),
    );

  const evidence:
    AnalyticsEvidence[] = [];

  snapshot.docs.forEach(
    (document) => {
      const data =
        document.data();

      const rawTitle =
        safeString(
          data.quizTitle,
        ) ||
        safeString(
          data.title,
        ) ||
        safeString(
          data.topicTitle,
        ) ||
        safeString(
          data.topic,
        ) ||
        "Quiz";

      const topic =
        resolveAnalyticsTopic(
          safeString(
            data.topicTitle,
          ),
          safeString(
            data.topic,
          ),
          rawTitle,
        );

      if (!topic) {
        console.warn(
          `Independent quiz result ${document.id} has no resolvable curriculum topic and was excluded from Analytics.`,
        );

        return;
      }

      const percentage =
        safeNumber(
          data.scorePercent,
        );

      const rawScore =
        safeNumber(
          data.score,
        );

      const totalQuestions =
        safeNumber(
          data.totalQuestions,
        );

      const completedAt =
        data.createdAt instanceof
        Timestamp
          ? data.createdAt.toDate()
          : null;

      evidence.push({
        id:
          `practice-quiz-${document.id}`,

        type: "quiz",

        title:
          rawTitle,

        topic,

        percentage,

        rawScore,

        totalMarks:
          totalQuestions,

        completedAt,

        dueDate: null,

        weight:
          ANALYTICS_EVIDENCE_WEIGHTS.quiz,

        graded:
          percentage !== null,

        /*
         * This is not a teacher assignment,
         * so there is deliberately no assignment ID.
         */
        sourceAssignmentId:
          null,

        sourceAssessmentId:
          document.id,

        sourceQuestionId:
          null,

        sourceQuestionNumber:
          null,

        sourceLabel:
          "Independent practice quiz",
      });
    },
  );

  return evidence;
}

function buildMasteryEvidence(
  evidence:
    AnalyticsEvidence[],
  examQuestionEvidence:
    AnalyticsEvidence[],
): AnalyticsEvidence[] {
  const examsWithQuestionEvidence =
    new Set(
      examQuestionEvidence
        .map(
          (item) =>
            item.sourceAssignmentId,
        )
        .filter(
          (
            value,
          ): value is string =>
            Boolean(value),
        ),
    );

  return [
    ...evidence.filter(
      (item) => {
        if (
          item.type !==
          "written_exam"
        ) {
          return true;
        }

        if (
          !item.sourceAssignmentId
        ) {
          return true;
        }

        return !examsWithQuestionEvidence.has(
          item.sourceAssignmentId,
        );
      },
    ),

    ...examQuestionEvidence,
  ];
}

function countEvidenceSources(
  evidence:
    AnalyticsEvidence[],
): AnalyticsEvidenceSourceCounts {
  const counts:
    AnalyticsEvidenceSourceCounts =
    {
      written_exam: 0,
      quiz: 0,
      ai_quiz: 0,
      programming: 0,
      lesson: 0,
    };

  const ids =
    new Map<
      AnalyticsEvidenceType,
      Set<string>
    >();

  for (
    const item of evidence
  ) {
    const key =
      item.sourceAssignmentId ||
      item.id;

    const current =
      ids.get(item.type) ||
      new Set<string>();

    current.add(key);

    ids.set(
      item.type,
      current,
    );
  }

  for (
    const [
      type,
      values,
    ] of ids.entries()
  ) {
    counts[type] =
      values.size;
  }

  return counts;
}

export async function getRichStudentAnalytics(
  studentId: string,
): Promise<RichStudentAnalytics> {
  const cleanedStudentId =
    studentId.trim();

  if (!cleanedStudentId) {
    throw new Error(
      "A valid student account is required.",
    );
  }

  const [
    profileSnapshot,
    assignments,
    storedTarget,
    independentQuizEvidence,
  ] = await Promise.all([
    getDoc(
      doc(
        db,
        "users",
        cleanedStudentId,
      ),
    ),

    getUnifiedStudentAssignments(
      cleanedStudentId,
    ),

    getStudentTargetGrade(
      cleanedStudentId,
    ).catch(
      () => null,
    ),

    getIndependentQuizEvidence(
      cleanedStudentId,
    ).catch(
      (error) => {
        console.warn(
          "Independent quiz evidence could not be loaded:",
          error,
        );

        return [];
      },
    ),
  ]);

  const profile =
    profileSnapshot.exists()
      ? (
          profileSnapshot.data() as
            Record<
              string,
              unknown
            >
        )
      : {};

  const qualification =
    normaliseQualification(
      profile,
      assignments,
    );

  const examBoard =
    safeString(
      profile.examBoard,
    ) || null;

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

  /*
   * Teacher-assigned evidence.
   */
  const assignmentEvidence =
    assignments
      .map(
        assignmentToEvidence,
      )
      .filter(
        (
          item,
        ): item is AnalyticsEvidence =>
          item !== null,
      );

  /*
   * Combine teacher-assigned and independent
   * student-practice evidence.
   */
  const evidence = [
    ...assignmentEvidence,
    ...independentQuizEvidence,
  ];

  const examQuestionEvidence =
    await getWrittenExamQuestionEvidence(
      cleanedStudentId,
    ).catch(
      (error) => {
        console.warn(
          "Written exam question evidence could not be loaded:",
          error,
        );

        return [];
      },
    );

  /*
   * Canonicalise any question-level exam topics
   * before they enter mastery calculations.
   */
  const normalisedExamQuestionEvidence =
    examQuestionEvidence
      .map(
        (
          item,
        ): AnalyticsEvidence | null => {
          const topic =
            resolveAnalyticsTopic(
              item.topic,
              item.title,
            );

          if (!topic) {
            return null;
          }

          return {
            ...item,
            topic,
          };
        },
      )
      .filter(
        (
          item,
        ): item is AnalyticsEvidence =>
          item !== null,
      );

  const masteryEvidence =
    buildMasteryEvidence(
      evidence,
      normalisedExamQuestionEvidence,
    );

  /*
   * Independent quizzes are genuine completed
   * learning activities even though they are not
   * teacher assignments.
   */
  const completedAssignmentCount =
    assignments.filter(
      isUnifiedAssignmentComplete,
    ).length;

  const completedActivityCount =
    completedAssignmentCount +
    independentQuizEvidence.length;

  const totalActivityCount =
    assignments.length +
    independentQuizEvidence.length;

  const completionRate =
    totalActivityCount > 0
      ? Math.round(
          (
            completedActivityCount /
            totalActivityCount
          ) *
            100,
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
      masteryEvidence,
    );

  const strongestTopics =
    topics.slice(0, 3);

  const weakestTopics = [
    ...topics,
  ]
    .sort(
      (a, b) =>
        a.weightedPercentage -
        b.weightedPercentage,
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
      trend:
        trendResult.trend,
      strongestTopics,
      weakestTopics,
    });

  return {
    studentId:
      cleanedStudentId,

    qualification,

    examBoard,

    targetGrade,

    grade,

    confidence,

    trend:
      trendResult.trend,

    trendChange:
      trendResult.change,

    trendPoints:
      trendResult.points,

    topics,

    strongestTopics,

    weakestTopics,

    evidence,

    masteryEvidence,

    evidenceSourceCounts:
      countEvidenceSources(
        masteryEvidence,
      ),

    completedActivityCount,

    totalActivityCount,

    completionRate,

    interpretation,
  };
}