import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { buildTopicMastery } from "@/services/adaptiveMasteryService";
import { getCurriculumCoverage } from "@/services/curriculumCoverageService";
import { buildAdaptiveActions } from "@/services/adaptiveRecommendationService";
import { getStudentExamAssignments } from "@/services/examAssignmentService";
import { getExamSubmission } from "@/services/examSubmissionService";
import { getStudentInterventions } from "@/services/interventionService";
import { indicativeGradeFromPercentage } from "@/services/qualificationGradeService";
import { normaliseTopic } from "@/services/topicNormalisationService";
import { getUserProfile } from "@/services/userService";

import type {
  AdaptiveEvidence,
  AdaptiveLearningPlan,
} from "@/types/adaptiveLearning";

const safeString = (value: unknown, fallback = ""): string =>
  typeof value === "string" && value.trim() ? value.trim() : fallback;

const safeNumber = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

const average = (values: number[]): number =>
  values.length
    ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
    : 0;

function toDate(value: unknown): Date | null {
  if (value instanceof Date) return value;
  if (value instanceof Timestamp) return value.toDate();

  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate();
  }

  return null;
}

function groupEvidence(evidence: AdaptiveEvidence[]) {
  const groups = new Map<string, AdaptiveEvidence[]>();

  evidence.forEach((item) => {
    const normalised = normaliseTopic(item.topic);
    const existing = groups.get(normalised.topicTitle) || [];

    groups.set(normalised.topicTitle, [
      ...existing,
      { ...item, topic: normalised.topicTitle },
    ]);
  });

  return Array.from(groups.entries()).map(([topic, items]) => ({
    topic,
    evidence: items,
  }));
}

function resolveRawTopic(
  data: Record<string, unknown>,
  fallback = "",
): string {
  return (
    safeString(data.topicId) ||
    safeString(data.topicTitle) ||
    safeString(data.topic) ||
    safeString(data.curriculumTopic) ||
    safeString(data.quizTitle) ||
    safeString(data.resourceTopic) ||
    safeString(data.title, fallback)
  );
}

function isGenericAssessmentTopic(value: string): boolean {
  const normalised = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

  return [
    "",
    "quiz",
    "assigned quiz",
    "ai quiz",
    "assessment",
    "assigned assessment",
    "practice quiz",
    "exam",
    "written exam",
    "programming challenge",
    "lesson",
  ].includes(normalised);
}

function cleanAssignmentTitle(value: string): string {
  return value
    .trim()
    .replace(/\s+(demo\s+)?quiz$/i, "")
    .replace(/\s+practice\s+quiz$/i, "")
    .replace(/\s+assessment$/i, "")
    .replace(/\s+programming\s+challenge$/i, "")
    .trim();
}

type AssignmentTopicMetadata = {
  topic: string;
  title: string;
};

async function loadAssignmentTopicMetadata(
  assignmentIds: string[],
): Promise<Map<string, AssignmentTopicMetadata>> {
  const uniqueIds = Array.from(
    new Set(assignmentIds.map((id) => id.trim()).filter(Boolean)),
  );

  const entries = await Promise.all(
    uniqueIds.map(async (assignmentId) => {
      try {
        const snapshot = await getDoc(
          doc(db, "assignments", assignmentId),
        );

        if (!snapshot.exists()) {
          return [assignmentId, { topic: "", title: "" }] as const;
        }

        const data = snapshot.data();

        return [
          assignmentId,
          {
            topic: resolveRawTopic(data),
            title: safeString(data.title),
          },
        ] as const;
      } catch (error) {
        console.warn(
          `Unable to resolve adaptive topic for assignment ${assignmentId}:`,
          error,
        );

        return [assignmentId, { topic: "", title: "" }] as const;
      }
    }),
  );

  return new Map(entries);
}

type ProgrammingAssignmentMetadata = {
  topic: string;
  title: string;
  resourceType: string;
};

async function loadProgrammingAssignmentMetadata(
  assignmentIds: string[],
): Promise<Map<string, ProgrammingAssignmentMetadata>> {
  const uniqueIds = Array.from(
    new Set(assignmentIds.map((id) => id.trim()).filter(Boolean)),
  );

  const entries = await Promise.all(
    uniqueIds.map(async (assignmentId) => {
      try {
        const snapshot = await getDoc(
          doc(db, "classAssignments", assignmentId),
        );

        if (!snapshot.exists()) {
          return [
            assignmentId,
            { topic: "", title: "", resourceType: "" },
          ] as const;
        }

        const data = snapshot.data();

        return [
          assignmentId,
          {
            topic:
              safeString(data.resourceTopic) ||
              resolveRawTopic(data),
            title:
              safeString(data.resourceTitle) ||
              safeString(data.title),
            resourceType: safeString(data.resourceType),
          },
        ] as const;
      } catch (error) {
        console.warn(
          `Unable to resolve programming assignment ${assignmentId}:`,
          error,
        );

        return [
          assignmentId,
          { topic: "", title: "", resourceType: "" },
        ] as const;
      }
    }),
  );

  return new Map(entries);
}

function resolveAssignedQuizTopic({
  resultData,
  assignmentMetadata,
}: {
  resultData: Record<string, unknown>;
  assignmentMetadata: AssignmentTopicMetadata | null;
}): string | null {
  const resultTopic = resolveRawTopic(resultData);

  if (
    resultTopic &&
    !isGenericAssessmentTopic(resultTopic)
  ) {
    return cleanAssignmentTitle(resultTopic);
  }

  const assignmentTopic = assignmentMetadata?.topic || "";

  if (
    assignmentTopic &&
    !isGenericAssessmentTopic(assignmentTopic)
  ) {
    return cleanAssignmentTitle(assignmentTopic);
  }

  const assignmentTitle = cleanAssignmentTitle(
    assignmentMetadata?.title || "",
  );

  if (
    assignmentTitle &&
    !isGenericAssessmentTopic(assignmentTitle)
  ) {
    return assignmentTitle;
  }

  return null;
}

export async function getAdaptiveLearningPlan(
  studentId: string,
): Promise<AdaptiveLearningPlan> {
  const id = studentId.trim();

  if (!id) {
    throw new Error("A valid student account is required.");
  }

 const [
  profile,
  quizSnapshot,
  assignedQuizSnapshot,
  programmingPracticeSnapshot,
  programmingProgressSnapshot,
  lessonProgressSnapshot,
  examAssignments,
  interventions,
] = await Promise.all([
  /*
   * Student self-directed secure quiz results.
   */
  getUserProfile(id),

  getDocs(
    query(
      collection(
        db,
        "users",
        id,
        "quizResults",
      ),
      orderBy(
        "createdAt",
        "desc",
      ),
    ),
  ),

  /*
   * Teacher-assigned quiz results.
   *
   * IMPORTANT:
   * This must remain the third Promise because the
   * destructured value above is assignedQuizSnapshot.
   */
  getDocs(
    query(
      collection(
        db,
        "assignmentResults",
      ),
      where(
        "studentId",
        "==",
        id,
      ),
    ),
  ),

  /*
   * Student self-directed Programming Practice evidence.
   *
   * One canonical document exists per student/challenge.
   */
  getDocs(
    query(
      collection(
        db,
        "users",
        id,
        "programmingPracticeResults",
      ),
      orderBy(
        "updatedAt",
        "desc",
      ),
    ),
  ),

  /*
   * Teacher-assigned programming challenge progress.
   */
  getDocs(
    query(
      collection(
        db,
        "assignmentProgress",
      ),
      where(
        "studentId",
        "==",
        id,
      ),
    ),
  ),

  /*
   * Interactive lesson evidence.
   */
  getDocs(
    query(
      collection(
        db,
        "lessonProgress",
      ),
      where(
        "studentId",
        "==",
        id,
      ),
    ),
  ),

  getStudentExamAssignments(id),
  getStudentInterventions(id),
]);

  if (!profile) {
    throw new Error("The student profile could not be loaded.");
  }

  const curriculumCoverage =
    profile.qualification && profile.examBoard
      ? getCurriculumCoverage(
          profile.qualification,
          profile.examBoard,
        )
      : null;

  const allowedTopicKeys = new Set<string>();
  const lessonTopicById = new Map<string, string>();

  curriculumCoverage?.units.forEach((unitCoverage) => {
    unitCoverage.topics.forEach((topic) => {
      const fromId = normaliseTopic(topic.id);
      const fromTitle = normaliseTopic(topic.title);

      allowedTopicKeys.add(fromId.topicId);
      allowedTopicKeys.add(fromTitle.topicId);

      topic.lessons.forEach((lesson) => {
        lessonTopicById.set(lesson.id, fromTitle.topicTitle);
      });
    });
  });

  function belongsToActiveCurriculum(topicValue: string): boolean {
    if (allowedTopicKeys.size === 0) return false;

    return allowedTopicKeys.has(
      normaliseTopic(topicValue).topicId,
    );
  }

  const evidence: AdaptiveEvidence[] = [];

  // Independent quiz evidence.
  quizSnapshot.docs.forEach((document) => {
    const data = document.data();
    const topic = resolveRawTopic(data, "Quiz");

    if (isGenericAssessmentTopic(topic)) return;

    evidence.push({
      id: `quiz-${document.id}`,
      topic: cleanAssignmentTitle(topic),
      source: "quiz",
      mode: "independent",
      score: safeNumber(data.scorePercent),
      completedAt:
        toDate(data.completedAt) ||
        toDate(data.createdAt),
      weight: 1,
    });
  });

  // Teacher-assigned quiz evidence.
  const assignedQuizAssignmentIds = assignedQuizSnapshot.docs
    .map((document) => safeString(document.data().assignmentId))
    .filter(Boolean);

  const assignmentMetadata =
    await loadAssignmentTopicMetadata(assignedQuizAssignmentIds);

  assignedQuizSnapshot.docs.forEach((document) => {
    const data = document.data();

    const assignmentType = safeString(data.assignmentType);

    if (
      assignmentType &&
      assignmentType !== "quiz"
    ) {
      return;
    }

    if (typeof data.percentage !== "number") return;

    const assignmentId = safeString(data.assignmentId);

    const topic = resolveAssignedQuizTopic({
      resultData: data,
      assignmentMetadata:
        assignmentMetadata.get(assignmentId) || null,
    });

    if (!topic) {
      console.warn(
        `Assigned quiz result ${document.id} has no resolvable curriculum topic and was excluded from adaptive mastery.`,
      );
      return;
    }

    evidence.push({
      id: `assigned-quiz-${document.id}`,
      topic,
      source: "quiz",
      mode: "independent",
      score: safeNumber(data.percentage),
      completedAt: toDate(data.completedAt),
      weight: 1.1,
    });
  });

// Independent programming evidence from normal Programming Practice.
programmingPracticeSnapshot.docs.forEach(
  (document) => {
    const data =
      document.data();

    const topic =
      resolveRawTopic(data);

    if (
      !topic ||
      isGenericAssessmentTopic(topic)
    ) {
      return;
    }

    const score =
      typeof data.latestScorePercent ===
      "number"
        ? data.latestScorePercent
        : typeof data.bestScorePercent ===
            "number"
          ? data.bestScorePercent
          : 0;

    evidence.push({
      id: `programming-practice-${document.id}`,
      topic:
        cleanAssignmentTitle(
          topic,
        ),
      source:
        "programming",
      mode:
        "independent",
      score:
        safeNumber(score),
      completedAt:
        toDate(
          data.completedAt,
        ) ||
        toDate(
          data.updatedAt,
        ),
      weight:
        1.2,
    });
  },
);

  // Independent programming evidence from teacher-assigned challenges.
  const programmingAssignmentIds = programmingProgressSnapshot.docs
    .filter(
      (document) =>
        typeof document.data().programmingPercentage === "number",
    )
    .map((document) => safeString(document.data().assignmentId))
    .filter(Boolean);

  const programmingMetadata =
    await loadProgrammingAssignmentMetadata(programmingAssignmentIds);

  programmingProgressSnapshot.docs.forEach((document) => {
    const data = document.data();

    if (typeof data.programmingPercentage !== "number") return;

    const assignmentId = safeString(data.assignmentId);
    const metadata = programmingMetadata.get(assignmentId);

    if (
      !metadata ||
      metadata.resourceType !== "programming-challenge"
    ) {
      return;
    }

    const topic = cleanAssignmentTitle(
      metadata.topic || metadata.title,
    );

    if (!topic || isGenericAssessmentTopic(topic)) return;

    evidence.push({
      id: `programming-${document.id}`,
      topic,
      source: "programming",
      mode: "independent",
      score: safeNumber(data.programmingPercentage),
      completedAt:
        toDate(data.completedAt) ||
        toDate(data.updatedAt),
      weight: 1.2,
    });
  });

  // Written exam evidence.
  const submissions = await Promise.all(
    examAssignments.map((assignment) =>
      getExamSubmission(assignment.id, id),
    ),
  );

  examAssignments.forEach((assignment, index) => {
    const submission = submissions[index];

    if (!submission || submission.status !== "marked") return;

    const examTopic =
      assignment.questionSetSnapshot.topic ||
      assignment.questionSetTitle ||
      assignment.title;

    if (isGenericAssessmentTopic(examTopic)) return;

    evidence.push({
      id: `exam-${assignment.id}`,
      topic: cleanAssignmentTitle(examTopic),
      source: "exam",
      mode: "independent",
      score: submission.percentage,
      completedAt: submission.markedAt,
      weight: 1.4,
    });
  });

  // Supported intervention evidence.
  interventions.forEach((intervention) => {
    const completedSteps = intervention.steps.filter(
      (step) => step.status === "completed",
    ).length;

    if (!completedSteps) return;
    if (isGenericAssessmentTopic(intervention.topic)) return;

    const score =
      typeof intervention.currentScore === "number"
        ? intervention.currentScore
        : intervention.baselineScore;

    evidence.push({
      id: `intervention-${intervention.id}`,
      topic: intervention.topic,
      source: "intervention",
      mode: "supported",
      score: typeof score === "number" ? score : null,
      completedAt:
        intervention.updatedAt ||
        intervention.completedAt,
      weight: 0.5,
    });
  });

  // Supported interactive-lesson evidence.
  lessonProgressSnapshot.docs.forEach((document) => {
    const data = document.data();
    const lessonId = safeString(data.lessonId);

    const rawTopic =
      safeString(data.topicId) ||
      lessonTopicById.get(lessonId) ||
      "";

    if (!rawTopic) return;

    const topic =
      lessonTopicById.get(lessonId) ||
      normaliseTopic(rawTopic).topicTitle;

    evidence.push({
      id: `lesson-progress-${document.id}`,
      topic,
      source: "lesson",
      mode: "supported",
      score:
        typeof data.overallAccuracy === "number"
          ? data.overallAccuracy
          : null,
      completedAt:
        toDate(data.completedAt) ||
        toDate(data.updatedAt),
      weight: 0.35,
    });
  });

  // Legacy completedLessons: context only, never mastery.
  const lessonProgressIds = new Set(
    lessonProgressSnapshot.docs
      .map((document) => safeString(document.data().lessonId))
      .filter(Boolean),
  );

  profile.completedLessons.forEach((lessonId, index) => {
    if (!lessonId.trim() || lessonProgressIds.has(lessonId)) return;

    const topic = lessonTopicById.get(lessonId);
    if (!topic) return;

    evidence.push({
      id: `legacy-lesson-${index}-${lessonId}`,
      topic,
      source: "lesson",
      mode: "supported",
      score: null,
      completedAt: null,
      weight: 0,
    });
  });

  const activeCurriculumEvidence = evidence.filter((item) =>
    belongsToActiveCurriculum(item.topic),
  );

  const topics = buildTopicMastery(
    groupEvidence(activeCurriculumEvidence),
  );

  const actions = buildAdaptiveActions(topics);

  const independentlyAssessedTopics = topics.filter(
    (topic) => topic.independentEvidenceCount > 0,
  );

  const overallMastery = average(
    independentlyAssessedTopics.map((topic) => topic.masteryScore),
  );

  const confidence = average(
    independentlyAssessedTopics.map(
      (topic) => topic.confidenceScore,
    ),
  );

  const examReadiness = average(
    independentlyAssessedTopics.map((topic) =>
      Math.round(
        topic.masteryScore * 0.8 +
          topic.confidenceScore * 0.2,
      ),
    ),
  );

  const recentTrend = average(
    independentlyAssessedTopics.map((topic) => topic.trend),
  );

  const predictedScore = Math.max(
    0,
    Math.min(
      100,
      examReadiness + Math.round(recentTrend * 0.2),
    ),
  );

  const independentEvidenceCount = topics.reduce(
    (sum, topic) => sum + topic.independentEvidenceCount,
    0,
  );

  const supportedEvidenceCount = topics.reduce(
    (sum, topic) => sum + topic.supportedEvidenceCount,
    0,
  );

  return {
    studentId: id,
    generatedAt: new Date(),
    qualification: profile.qualification || "GCSE",
    examBoard: profile.examBoard || "General",
    currentCourse: profile.currentCourse || "Computer Science",

    overallMastery,
    examReadiness,
    confidence,
    independentEvidenceCount,
    supportedEvidenceCount,

    currentGrade: independentlyAssessedTopics.length
      ? indicativeGradeFromPercentage(
          examReadiness,
          profile.qualification,
        )
      : "U",

    predictedGrade: independentlyAssessedTopics.length
      ? indicativeGradeFromPercentage(
          predictedScore,
          profile.qualification,
        )
      : "U",

    dueForReviewCount: topics.filter(
      (topic) => topic.nextReviewAt.getTime() <= Date.now(),
    ).length,

    priorityTopicCount: topics.filter(
      (topic) =>
        topic.state === "priority" ||
        topic.state === "forgetting-risk",
    ).length,

    secureTopicCount: topics.filter(
      (topic) =>
        topic.state === "secure" ||
        topic.state === "mastered",
    ).length,

    nextAction: actions[0] || null,
    actions,
    topics,
  };
}
