import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { getAdaptiveLearningPlan } from "@/services/adaptiveLearningService";
import { getStudentExamAssignments } from "@/services/examAssignmentService";
import { getExamSubmission } from "@/services/examSubmissionService";
import { getUserProfile } from "@/services/userService";

import type {
  TutorStudentContext,
  TutorTopicContext,
} from "@/types/studentTutor";

type AdaptivePlan = Awaited<
  ReturnType<typeof getAdaptiveLearningPlan>
>;

function topicContext(
  topic: AdaptivePlan["topics"][number],
): TutorTopicContext {
  return {
    topic: topic.topic,
    masteryScore: topic.masteryScore,
    confidenceScore: topic.confidenceScore,
    attempts: topic.attempts,
    independentEvidenceCount: topic.independentEvidenceCount,
    supportedEvidenceCount: topic.supportedEvidenceCount,
    state: topic.state,
    recommendedDifficulty: topic.recommendedDifficulty,
  };
}

const average = (values: number[]) =>
  values.length
    ? Math.round(
        values.reduce((sum, value) => sum + value, 0) /
          values.length,
      )
    : 0;

export async function getStudentTutorContext(
  studentId: string,
): Promise<TutorStudentContext> {
  const id = studentId.trim();

  if (!id) {
    throw new Error("A valid student account is required.");
  }

  const [
    profile,
    plan,
    examAssignments,
    assignmentResultsSnapshot,
  ] = await Promise.all([
    getUserProfile(id),
    getAdaptiveLearningPlan(id),
    getStudentExamAssignments(id),
    getDocs(
      query(
        collection(db, "assignmentResults"),
        where("studentId", "==", id),
      ),
    ),
  ]);

  if (!profile) {
    throw new Error("The student profile could not be loaded.");
  }

  const submissions = await Promise.all(
    examAssignments.map((assignment) =>
      getExamSubmission(assignment.id, id),
    ),
  );

  const awaitingMarking = submissions.filter(
    (submission) =>
      submission?.status === "submitted" ||
      submission?.status === "marking",
  ).length;

  const markedExamScores = submissions.flatMap((submission) =>
    submission?.status === "marked" &&
    typeof submission.percentage === "number"
      ? [submission.percentage]
      : [],
  );

  const quizScores = assignmentResultsSnapshot.docs
    .map((document) => document.data())
    .filter(
      (data) =>
        (!data.assignmentType || data.assignmentType === "quiz") &&
        typeof data.percentage === "number",
    )
    .map((data) => data.percentage as number);

  const strongestTopics = [...plan.topics]
    .filter((topic) => topic.independentEvidenceCount > 0)
    .sort((a, b) => b.masteryScore - a.masteryScore)
    .slice(0, 3)
    .map(topicContext);

  const priorityTopics = [...plan.topics]
    .filter(
      (topic) =>
        topic.state === "priority" ||
        topic.state === "forgetting-risk" ||
        topic.independentEvidenceCount === 0,
    )
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 4)
    .map(topicContext);

  return {
    studentId: id,
    name: profile.name || "Student",
    qualification: plan.qualification,
    examBoard: plan.examBoard,
    currentCourse: plan.currentCourse,

    overallMastery: plan.overallMastery,
    examReadiness: plan.examReadiness,
    confidence: plan.confidence,

    combinedAverage: plan.overallMastery,
    quizAverage: average(quizScores),
    examAverage: average(markedExamScores),

    currentGrade: plan.currentGrade,
    predictedGrade: plan.predictedGrade,

    improvementTrend: plan.topics.length
      ? Math.round(
          plan.topics.reduce((sum, topic) => sum + topic.trend, 0) /
            plan.topics.length,
        )
      : 0,

    completedLessons: profile.completedLessons.length,
    completedAssessments: plan.independentEvidenceCount,
    awaitingMarking,

    independentEvidenceCount: plan.independentEvidenceCount,
    supportedEvidenceCount: plan.supportedEvidenceCount,
    dueForReviewCount: plan.dueForReviewCount,

    strongestTopics,
    priorityTopics,

    recommendedActions: plan.actions.map((action) => ({
      title: action.title,
      description: action.description,
      topic: action.topic,
      type: action.type,
      href: action.href,
    })),
  };
}
