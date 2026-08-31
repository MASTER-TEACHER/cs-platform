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

const safeString = (
  value: unknown,
  fallback = "",
): string =>
  typeof value === "string" &&
  value.trim()
    ? value.trim()
    : fallback;

const safeNumber = (
  value: unknown,
): number =>
  typeof value === "number" &&
  Number.isFinite(value)
    ? value
    : 0;

const average = (
  values: number[],
): number =>
  values.length
    ? Math.round(
        values.reduce(
          (sum, value) =>
            sum + value,
          0,
        ) / values.length,
      )
    : 0;

function groupEvidence(
  evidence: AdaptiveEvidence[],
) {
  const groups =
    new Map<
      string,
      AdaptiveEvidence[]
    >();

  evidence.forEach((item) => {
    const normalised =
      normaliseTopic(item.topic);

    const existing =
      groups.get(
        normalised.topicTitle,
      ) || [];

    groups.set(
      normalised.topicTitle,
      [
        ...existing,
        {
          ...item,
          topic:
            normalised.topicTitle,
        },
      ],
    );
  });

  return Array.from(
    groups.entries(),
  ).map(
    ([topic, items]) => ({
      topic,
      evidence: items,
    }),
  );
}

function resolveRawTopic(
  data: Record<string, unknown>,
  fallback = "",
): string {
  return (
    safeString(
      data.topicTitle,
    ) ||
    safeString(
      data.topic,
    ) ||
    safeString(
      data.curriculumTopic,
    ) ||
    safeString(
      data.quizTitle,
    ) ||
    safeString(
      data.title,
      fallback,
    )
  );
}

/*
 * Generic labels describe an assessment type rather than
 * an actual Computer Science curriculum topic.
 *
 * These must never become mastery topics.
 */
function isGenericAssessmentTopic(
  value: string,
): boolean {
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
  ].includes(normalised);
}

/*
 * Assignment titles frequently contain presentational suffixes,
 * for example:
 *
 * "character encoding Demo Quiz"
 * "memory and storage Demo Quiz"
 * "merge sort Demo Quiz"
 *
 * Removing those suffixes gives topicNormalisationService a much
 * cleaner curriculum phrase to resolve.
 */
function cleanAssignmentTitle(
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

type AssignmentTopicMetadata = {
  topic: string;
  title: string;
};

async function loadAssignmentTopicMetadata(
  assignmentIds: string[],
): Promise<
  Map<
    string,
    AssignmentTopicMetadata
  >
> {
  const uniqueIds =
    Array.from(
      new Set(
        assignmentIds
          .map((id) =>
            id.trim(),
          )
          .filter(Boolean),
      ),
    );

  const entries =
    await Promise.all(
      uniqueIds.map(
        async (
          assignmentId,
        ) => {
          try {
            const snapshot =
              await getDoc(
                doc(
                  db,
                  "assignments",
                  assignmentId,
                ),
              );

            if (
              !snapshot.exists()
            ) {
              return [
                assignmentId,
                {
                  topic: "",
                  title: "",
                },
              ] as const;
            }

            const data =
              snapshot.data();

            return [
              assignmentId,
              {
                topic:
                  resolveRawTopic(
                    data,
                  ),
                title:
                  safeString(
                    data.title,
                  ),
              },
            ] as const;
          } catch (
            caughtError
          ) {
            /*
             * A missing/legacy assignment should not prevent the
             * rest of the student's adaptive plan from loading.
             */
            console.warn(
              `Unable to resolve adaptive topic for assignment ${assignmentId}:`,
              caughtError,
            );

            return [
              assignmentId,
              {
                topic: "",
                title: "",
              },
            ] as const;
          }
        },
      ),
    );

  return new Map(entries);
}

function resolveAssignedQuizTopic({
  resultData,
  assignmentMetadata,
}: {
  resultData: Record<
    string,
    unknown
  >;

  assignmentMetadata:
    AssignmentTopicMetadata | null;
}): string | null {
  /*
   * First preference:
   * explicit curriculum/topic metadata stored directly on
   * the result.
   */
  const resultTopic =
    resolveRawTopic(
      resultData,
    );

  if (
    resultTopic &&
    !isGenericAssessmentTopic(
      resultTopic,
    )
  ) {
    return cleanAssignmentTitle(
      resultTopic,
    );
  }

  /*
   * Second preference:
   * topic metadata on the original assignment.
   */
  const assignmentTopic =
    assignmentMetadata?.topic ||
    "";

  if (
    assignmentTopic &&
    !isGenericAssessmentTopic(
      assignmentTopic,
    )
  ) {
    return cleanAssignmentTitle(
      assignmentTopic,
    );
  }

  /*
   * Third preference:
   * derive the curriculum topic from the original assignment
   * title.
   *
   * Example:
   * "character encoding Demo Quiz"
   *          ↓
   * "character encoding"
   *          ↓
   * topicNormalisationService
   */
  const assignmentTitle =
    cleanAssignmentTitle(
      assignmentMetadata?.title ||
        "",
    );

  if (
    assignmentTitle &&
    !isGenericAssessmentTopic(
      assignmentTitle,
    )
  ) {
    return assignmentTitle;
  }

  /*
   * Do NOT create fake mastery evidence such as "Assigned Quiz".
   *
   * The result remains stored normally in Firestore and can still
   * contribute to assignment history/markbooks. It simply cannot
   * be attributed to curriculum mastery until a real topic can be
   * identified.
   */
  return null;
}

export async function getAdaptiveLearningPlan(
  studentId: string,
): Promise<AdaptiveLearningPlan> {
  const id =
    studentId.trim();

  if (!id) {
    throw new Error(
      "A valid student account is required.",
    );
  }

  const [
    profile,
    quizSnapshot,
    assignedQuizSnapshot,
    examAssignments,
    interventions,
  ] = await Promise.all([
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

    getStudentExamAssignments(
      id,
    ),

    getStudentInterventions(
      id,
    ),
  ]);

  if (!profile) {
    throw new Error(
      "The student profile could not be loaded.",
    );
  }

  const curriculumCoverage =
    profile.qualification &&
    profile.examBoard
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
        lessonTopicById.set(
          lesson.id,
          fromTitle.topicTitle,
        );
      });
    });
  });

  function belongsToActiveCurriculum(topicValue: string): boolean {
    if (allowedTopicKeys.size === 0) return false;

    return allowedTopicKeys.has(
      normaliseTopic(topicValue).topicId,
    );
  }

  const evidence:
    AdaptiveEvidence[] = [];

  /*
   * ------------------------------------------------------------
   * NORMAL QUIZ EVIDENCE
   * ------------------------------------------------------------
   */
  quizSnapshot.docs.forEach(
    (document) => {
      const data =
        document.data();

      const topic =
        resolveRawTopic(
          data,
          "Quiz",
        );

      /*
       * Avoid producing a generic "Quiz" mastery topic.
       */
      if (
        isGenericAssessmentTopic(
          topic,
        )
      ) {
        return;
      }

      evidence.push({
        id:
          `quiz-${document.id}`,

        topic:
          cleanAssignmentTitle(
            topic,
          ),

        source: "quiz",

        score:
          safeNumber(
            data.scorePercent,
          ),

        completedAt:
          data.createdAt instanceof
          Timestamp
            ? data.createdAt.toDate()
            : null,

        weight: 1,
      });
    },
  );

  /*
   * ------------------------------------------------------------
   * ASSIGNED QUIZ EVIDENCE
   * ------------------------------------------------------------
   *
   * assignmentResults often contain score/result information but
   * not enough curriculum metadata. Resolve the original assignment
   * so its real topic/title can be used.
   */
  const assignedQuizAssignmentIds =
    assignedQuizSnapshot.docs
      .map((document) =>
        safeString(
          document.data()
            .assignmentId,
        ),
      )
      .filter(Boolean);

  const assignmentMetadata =
    await loadAssignmentTopicMetadata(
      assignedQuizAssignmentIds,
    );

  assignedQuizSnapshot.docs.forEach(
    (document) => {
      const data =
        document.data();

      const assignmentId =
        safeString(
          data.assignmentId,
        );

      const topic =
        resolveAssignedQuizTopic({
          resultData: data,

          assignmentMetadata:
            assignmentMetadata.get(
              assignmentId,
            ) || null,
        });

      if (!topic) {
        console.warn(
          `Assigned quiz result ${document.id} has no resolvable curriculum topic and was excluded from topic mastery.`,
        );

        return;
      }

      evidence.push({
        id:
          `assigned-quiz-${document.id}`,

        topic,

        source: "quiz",

        score:
          safeNumber(
            data.percentage,
          ),

        completedAt:
          data.completedAt instanceof
          Timestamp
            ? data.completedAt.toDate()
            : null,

        weight: 1.1,
      });
    },
  );

  /*
   * ------------------------------------------------------------
   * WRITTEN EXAM EVIDENCE
   * ------------------------------------------------------------
   */
  const submissions =
    await Promise.all(
      examAssignments.map(
        (assignment) =>
          getExamSubmission(
            assignment.id,
            id,
          ),
      ),
    );

  examAssignments.forEach(
    (
      assignment,
      index,
    ) => {
      const submission =
        submissions[index];

      if (
        !submission ||
        submission.status !==
          "marked"
      ) {
        return;
      }

      const examTopic =
        assignment
          .questionSetSnapshot
          .topic ||
        assignment
          .questionSetTitle ||
        assignment.title;

      if (
        isGenericAssessmentTopic(
          examTopic,
        )
      ) {
        return;
      }

      evidence.push({
        id:
          `exam-${assignment.id}`,

        topic:
          cleanAssignmentTitle(
            examTopic,
          ),

        source: "exam",

        score:
          submission.percentage,

        completedAt:
          submission.markedAt,

        weight: 1.4,
      });
    },
  );

  /*
   * ------------------------------------------------------------
   * INTERVENTION EVIDENCE
   * ------------------------------------------------------------
   */
  interventions.forEach(
    (intervention) => {
      const completedSteps =
        intervention.steps.filter(
          (step) =>
            step.status ===
            "completed",
        ).length;

      if (!completedSteps) {
        return;
      }

      if (
        isGenericAssessmentTopic(
          intervention.topic,
        )
      ) {
        return;
      }

      evidence.push({
        id:
          `intervention-${intervention.id}`,

        topic:
          intervention.topic,

        source:
          "intervention",

        score:
          intervention.currentScore ||
          intervention.baselineScore,

        completedAt:
          intervention.updatedAt ||
          intervention.completedAt,

        weight: 0.8,
      });
    },
  );

  /*
   * ------------------------------------------------------------
   * LESSON EVIDENCE
   * ------------------------------------------------------------
   */
  profile.completedLessons.forEach(
    (lessonId, index) => {
      if (!lessonId.trim()) {
        return;
      }

      const currentTopic =
        lessonTopicById.get(lessonId);

      if (!currentTopic) {
        return;
      }

      evidence.push({
        id: `lesson-${index}-${lessonId}`,
        topic: currentTopic,
        source: "lesson",
        score: 60,
        completedAt: null,
        weight: 0.25,
      });
    },
  );

  /*
   * ------------------------------------------------------------
   * MASTERY + RECOMMENDATIONS
   * ------------------------------------------------------------
   */
  const activeCurriculumEvidence =
    evidence.filter(
      (item) =>
        belongsToActiveCurriculum(
          item.topic,
        ),
    );

  const topics =
    buildTopicMastery(
      groupEvidence(
        activeCurriculumEvidence,
      ),
    );

  const actions =
    buildAdaptiveActions(
      topics,
    );

  const assessedTopics =
    topics.filter(
      (topic) =>
        topic.attempts > 0,
    );

  const overallMastery =
    average(
      assessedTopics.map(
        (topic) =>
          topic.masteryScore,
      ),
    );

  const confidence =
    average(
      assessedTopics.map(
        (topic) =>
          topic.confidenceScore,
      ),
    );

  const examReadiness =
    average(
      assessedTopics.map(
        (topic) =>
          Math.round(
            topic.masteryScore *
              0.75 +
              topic.confidenceScore *
                0.25,
          ),
      ),
    );

  const recentTrend =
    average(
      assessedTopics.map(
        (topic) =>
          topic.trend,
      ),
    );

  const predictedScore =
    Math.max(
      0,
      Math.min(
        100,
        examReadiness +
          Math.round(
            recentTrend *
              0.25,
          ),
      ),
    );

  return {
    studentId: id,

    generatedAt:
      new Date(),

    overallMastery,

    examReadiness,

    confidence,

    currentGrade:
      indicativeGradeFromPercentage(
        examReadiness,
        profile?.qualification,
      ),

    predictedGrade:
      indicativeGradeFromPercentage(
        predictedScore,
        profile?.qualification,
      ),

    dueForReviewCount:
      topics.filter(
        (topic) =>
          topic.nextReviewAt.getTime() <=
          Date.now(),
      ).length,

    priorityTopicCount:
      topics.filter(
        (topic) =>
          topic.state ===
            "priority" ||
          topic.state ===
            "forgetting-risk",
      ).length,

    secureTopicCount:
      topics.filter(
        (topic) =>
          topic.state ===
            "secure" ||
          topic.state ===
            "mastered",
      ).length,

    nextAction:
      actions[0] || null,

    actions,

    topics,
  };
}
