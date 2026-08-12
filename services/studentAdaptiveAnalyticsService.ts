import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { getExamSubmission } from "@/services/examSubmissionService";
import { getStudentExamAssignments } from "@/services/examAssignmentService";

export type AdaptiveTopicInsight = {
  id: string;
  topic: string;
  averageScore: number;
  attempts: number;
  classification: "secure" | "developing" | "priority";
};

export type AdaptiveRecommendation = {
  id: string;
  title: string;
  description: string;
  topic: string;
  type: "lesson" | "quiz" | "exam";
  href: string;
  priority: "high" | "medium" | "positive";
};

export type StudentAdaptiveAnalytics = {
  quizAverage: number;
  examAverage: number;
  combinedAverage: number;
  currentGrade: string;
  predictedGrade: string;
  improvementTrend: number;
  completedAssessments: number;
  awaitingMarking: number;
  strongestTopics: AdaptiveTopicInsight[];
  priorityTopics: AdaptiveTopicInsight[];
  recommendations: AdaptiveRecommendation[];
};

export const emptyStudentAdaptiveAnalytics: StudentAdaptiveAnalytics = {
  quizAverage: 0,
  examAverage: 0,
  combinedAverage: 0,
  currentGrade: "1",
  predictedGrade: "1",
  improvementTrend: 0,
  completedAssessments: 0,
  awaitingMarking: 0,
  strongestTopics: [],
  priorityTopics: [],
  recommendations: [],
};

function safeNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function safeString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function average(values: number[]): number {
  if (!values.length) {
    return 0;
  }

  return Math.round(
    values.reduce((total, value) => total + value, 0) / values.length,
  );
}

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

export async function getStudentAdaptiveAnalytics(
  studentId: string,
): Promise<StudentAdaptiveAnalytics> {
  const cleanedStudentId = studentId.trim();

  if (!cleanedStudentId) {
    return emptyStudentAdaptiveAnalytics;
  }

  const [quizSnapshot, assignedQuizResultsSnapshot, examAssignments] =
    await Promise.all([
      getDocs(
        query(
          collection(db, "users", cleanedStudentId, "quizResults"),
          orderBy("createdAt", "desc"),
        ),
      ),

      getDocs(
        query(
          collection(db, "assignmentResults"),
          where("studentId", "==", cleanedStudentId),
        ),
      ),

      getStudentExamAssignments(cleanedStudentId),
    ]);

  const quizResults = quizSnapshot.docs.map((document) => {
    const data = document.data();

    const createdAt =
      data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null;

    return {
      id: document.id,
      topic:
        safeString(data.topic) ||
        safeString(data.topicTitle) ||
        safeString(data.title, "Quiz"),
      percentage: safeNumber(data.scorePercent),
      completedAt: createdAt,
    };
  });

  const assignedQuizResults = assignedQuizResultsSnapshot.docs
    .map((document) => {
      const data = document.data();

      return {
        id: document.id,
        topic:
          safeString(data.topic) ||
          safeString(data.topicTitle) ||
          safeString(data.quizTitle) ||
          safeString(data.title, "Assigned quiz"),
        percentage: safeNumber(data.percentage),
        completedAt:
          data.completedAt instanceof Timestamp
            ? data.completedAt.toDate()
            : null,
      };
    })
    .filter((result) => result.percentage >= 0);

  const submissions = await Promise.all(
    examAssignments.map((assignment) =>
      getExamSubmission(assignment.id, cleanedStudentId),
    ),
  );

  const examResults = examAssignments
    .map((assignment, index) => {
      const submission = submissions[index];

      if (!submission || submission.status !== "marked") {
        return null;
      }

      return {
        id: assignment.id,
        topic:
          assignment.questionSetSnapshot.topic ||
          assignment.questionSetTitle ||
          assignment.title,
        percentage: submission.percentage,
        completedAt: submission.markedAt,
      };
    })
    .filter((result): result is NonNullable<typeof result> => result !== null);

  const awaitingMarking = submissions.filter(
    (submission) =>
      submission?.status === "submitted" || submission?.status === "marking",
  ).length;

  const allQuizResults = [...quizResults, ...assignedQuizResults];

  const quizScores = allQuizResults.map((result) => result.percentage);

  const examScores = examResults.map((result) => result.percentage);

  const combinedResults = [
    ...allQuizResults.map((result) => ({
      ...result,
      source: "quiz" as const,
    })),
    ...examResults.map((result) => ({
      ...result,
      source: "exam" as const,
    })),
  ];

  const topicGroups = new Map<string, number[]>();

  combinedResults.forEach((result) => {
    const scores = topicGroups.get(result.topic) || [];

    scores.push(result.percentage);

    topicGroups.set(result.topic, scores);
  });

  const topics: AdaptiveTopicInsight[] = Array.from(topicGroups.entries())
    .map(([topic, scores], index) => {
      const averageScore = average(scores);

      return {
        id: `adaptive-topic-${index}`,
        topic,
        averageScore,
        attempts: scores.length,
        classification:
          averageScore >= 70
            ? ("secure" as const)
            : averageScore < 50
              ? ("priority" as const)
              : ("developing" as const),
      };
    })
    .sort((first, second) => second.averageScore - first.averageScore);

  const strongestTopics = topics
    .filter((topic) => topic.classification === "secure")
    .slice(0, 3);

  const priorityTopics = [...topics]
    .filter((topic) => topic.classification === "priority")
    .sort((first, second) => first.averageScore - second.averageScore)
    .slice(0, 3);

  const chronological = combinedResults
    .filter((result) => result.completedAt)
    .sort(
      (first, second) =>
        (first.completedAt?.getTime() || 0) -
        (second.completedAt?.getTime() || 0),
    )
    .map((result) => result.percentage);

  let improvementTrend = 0;

  if (chronological.length >= 2) {
    const midpoint = Math.ceil(chronological.length / 2);

    improvementTrend =
      average(chronological.slice(midpoint)) -
      average(chronological.slice(0, midpoint));
  }

  const quizAverage = average(quizScores);

  const examAverage = average(examScores);

  const combinedAverage = average([...quizScores, ...examScores]);

  const recommendations: AdaptiveRecommendation[] = [];

  const priorityTopic = priorityTopics[0];

  if (priorityTopic) {
    const encodedTopic = encodeURIComponent(priorityTopic.topic);

    recommendations.push(
      {
        id: "priority-lesson",
        title: `Review ${priorityTopic.topic}`,
        description: `Current assessed performance is ${priorityTopic.averageScore}%. Revisit the core lesson before practising again.`,
        topic: priorityTopic.topic,
        type: "lesson",
        href: `/learn?search=${encodedTopic}`,
        priority: "high",
      },
      {
        id: "priority-quiz",
        title: "Complete retrieval practice",
        description: `Use a short quiz on ${priorityTopic.topic} to check misconceptions immediately.`,
        topic: priorityTopic.topic,
        type: "quiz",
        href: `/quiz?topic=${encodedTopic}`,
        priority: "high",
      },
      {
        id: "priority-exam",
        title: "Attempt an exam-style question",
        description: `Apply your knowledge of ${priorityTopic.topic} in a written response and compare it with the mark scheme.`,
        topic: priorityTopic.topic,
        type: "exam",
        href: "/assignments?filter=exams",
        priority: "medium",
      },
    );
  } else {
    recommendations.push({
      id: "maintain",
      title: "Maintain your progress",
      description:
        "Complete a mixed retrieval quiz and one written exam question to keep secure topics active.",
      topic: strongestTopics[0]?.topic || "Computer Science",
      type: "quiz",
      href: "/quiz",
      priority: "positive",
    });
  }

  return {
    quizAverage,
    examAverage,
    combinedAverage,
    currentGrade: gradeFromPercentage(combinedAverage),
    predictedGrade: gradeFromPercentage(
      Math.max(
        0,
        Math.min(100, combinedAverage + Math.round(improvementTrend * 0.4)),
      ),
    ),
    improvementTrend,
    completedAssessments: combinedResults.length,
    awaitingMarking,
    strongestTopics,
    priorityTopics,
    recommendations,
  };
}
