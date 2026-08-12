import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { getStudentExamAssignments } from "@/services/examAssignmentService";
import { getExamSubmission } from "@/services/examSubmissionService";
import { getStudentInterventions } from "@/services/interventionService";
import { buildTopicMastery } from "@/services/adaptiveMasteryService";
import { buildAdaptiveActions } from "@/services/adaptiveRecommendationService";
import { normaliseTopic } from "@/services/topicNormalisationService";
import { getUserProfile } from "@/services/userService";
import type {
  AdaptiveEvidence,
  AdaptiveLearningPlan,
} from "@/types/adaptiveLearning";

const safeString = (value: unknown, fallback = "") =>
  typeof value === "string" && value.trim() ? value.trim() : fallback;

const safeNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

const average = (values: number[]) =>
  values.length
    ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
    : 0;

function gradeFromPercentage(percentage: number): string {
  if (percentage >= 90) return "9";
  if (percentage >= 80) return "8";
  if (percentage >= 70) return "7";
  if (percentage >= 60) return "6";
  if (percentage >= 50) return "5";
  if (percentage >= 40) return "4";
  if (percentage >= 30) return "3";
  if (percentage >= 20) return "2";
  return "1";
}

function groupEvidence(evidence: AdaptiveEvidence[]) {
  const groups = new Map<string, AdaptiveEvidence[]>();

  evidence.forEach((item) => {
    const normalised = normaliseTopic(item.topic);
    const existing = groups.get(normalised.topicTitle) || [];

    groups.set(normalised.topicTitle, [
      ...existing,
      {
        ...item,
        topic: normalised.topicTitle,
      },
    ]);
  });

  return Array.from(groups.entries()).map(([topic, items]) => ({
    topic,
    evidence: items,
  }));
}

function resolveRawTopic(
  data: Record<string, unknown>,
  fallback: string,
): string {
  return (
    safeString(data.topicTitle) ||
    safeString(data.topic) ||
    safeString(data.quizTitle) ||
    safeString(data.title, fallback)
  );
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
    examAssignments,
    interventions,
  ] = await Promise.all([
    getUserProfile(id),
    getDocs(
      query(
        collection(db, "users", id, "quizResults"),
        orderBy("createdAt", "desc"),
      ),
    ),
    getDocs(
      query(collection(db, "assignmentResults"), where("studentId", "==", id)),
    ),
    getStudentExamAssignments(id),
    getStudentInterventions(id),
  ]);

  if (!profile) {
    throw new Error("The student profile could not be loaded.");
  }

  const evidence: AdaptiveEvidence[] = [];

  quizSnapshot.docs.forEach((document) => {
    const data = document.data();

    evidence.push({
      id: `quiz-${document.id}`,
      topic: resolveRawTopic(data, "Quiz"),
      source: "quiz",
      score: safeNumber(data.scorePercent),
      completedAt:
        data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null,
      weight: 1,
    });
  });

  assignedQuizSnapshot.docs.forEach((document) => {
    const data = document.data();

    evidence.push({
      id: `assigned-quiz-${document.id}`,
      topic: resolveRawTopic(data, "Assigned quiz"),
      source: "quiz",
      score: safeNumber(data.percentage),
      completedAt:
        data.completedAt instanceof Timestamp
          ? data.completedAt.toDate()
          : null,
      weight: 1.1,
    });
  });

  const submissions = await Promise.all(
    examAssignments.map((assignment) => getExamSubmission(assignment.id, id)),
  );

  examAssignments.forEach((assignment, index) => {
    const submission = submissions[index];

    if (!submission || submission.status !== "marked") {
      return;
    }

    evidence.push({
      id: `exam-${assignment.id}`,
      topic:
        assignment.questionSetSnapshot.topic ||
        assignment.questionSetTitle ||
        assignment.title,
      source: "exam",
      score: submission.percentage,
      completedAt: submission.markedAt,
      weight: 1.4,
    });
  });

  interventions.forEach((intervention) => {
    const completedSteps = intervention.steps.filter(
      (step) => step.status === "completed",
    ).length;

    if (!completedSteps) {
      return;
    }

    evidence.push({
      id: `intervention-${intervention.id}`,
      topic: intervention.topic,
      source: "intervention",
      score: intervention.currentScore || intervention.baselineScore,
      completedAt: intervention.updatedAt || intervention.completedAt,
      weight: 0.8,
    });
  });

  profile.completedLessons.forEach((lessonId, index) => {
    evidence.push({
      id: `lesson-${index}-${lessonId}`,
      topic: lessonId,
      source: "lesson",
      score: 60,
      completedAt: null,
      weight: 0.25,
    });
  });

  const topics = buildTopicMastery(groupEvidence(evidence));
  const actions = buildAdaptiveActions(topics);
  const assessedTopics = topics.filter((topic) => topic.attempts > 0);

  const overallMastery = average(
    assessedTopics.map((topic) => topic.masteryScore),
  );

  const confidence = average(
    assessedTopics.map((topic) => topic.confidenceScore),
  );

  const examReadiness = average(
    assessedTopics.map((topic) =>
      Math.round(topic.masteryScore * 0.75 + topic.confidenceScore * 0.25),
    ),
  );

  const recentTrend = average(assessedTopics.map((topic) => topic.trend));

  const predictedScore = Math.max(
    0,
    Math.min(100, examReadiness + Math.round(recentTrend * 0.25)),
  );

  return {
    studentId: id,
    generatedAt: new Date(),
    overallMastery,
    examReadiness,
    confidence,
    currentGrade: gradeFromPercentage(examReadiness),
    predictedGrade: gradeFromPercentage(predictedScore),
    dueForReviewCount: topics.filter(
      (topic) => topic.nextReviewAt.getTime() <= Date.now(),
    ).length,
    priorityTopicCount: topics.filter(
      (topic) =>
        topic.state === "priority" || topic.state === "forgetting-risk",
    ).length,
    secureTopicCount: topics.filter(
      (topic) => topic.state === "secure" || topic.state === "mastered",
    ).length,
    nextAction: actions[0] || null,
    actions,
    topics,
  };
}
