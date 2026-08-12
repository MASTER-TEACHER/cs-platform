import { getStudentAdaptiveAnalytics } from "@/services/studentAdaptiveAnalyticsService";
import { getUserProfile } from "@/services/userService";
import type { TutorStudentContext } from "@/types/studentTutor";

export async function getStudentTutorContext(
  studentId: string,
): Promise<TutorStudentContext> {
  const id = studentId.trim();
  if (!id) throw new Error("A valid student account is required.");
  const [profile, analytics] = await Promise.all([
    getUserProfile(id),
    getStudentAdaptiveAnalytics(id),
  ]);
  if (!profile) throw new Error("The student profile could not be loaded.");
  return {
    studentId: id,
    name: profile.name || "Student",
    qualification: profile.qualification || "GCSE",
    examBoard: profile.examBoard || "General",
    currentCourse: profile.currentCourse || "Computer Science",
    combinedAverage: analytics.combinedAverage,
    quizAverage: analytics.quizAverage,
    examAverage: analytics.examAverage,
    currentGrade: analytics.currentGrade,
    predictedGrade: analytics.predictedGrade,
    improvementTrend: analytics.improvementTrend,
    completedLessons: profile.completedLessons.length,
    completedAssessments: analytics.completedAssessments,
    awaitingMarking: analytics.awaitingMarking,
    strongestTopics: analytics.strongestTopics.map((t) => ({
      topic: t.topic,
      averageScore: t.averageScore,
      attempts: t.attempts,
    })),
    priorityTopics: analytics.priorityTopics.map((t) => ({
      topic: t.topic,
      averageScore: t.averageScore,
      attempts: t.attempts,
    })),
    recommendedActions: analytics.recommendations.map((r) => ({
      title: r.title,
      description: r.description,
      topic: r.topic,
      type: r.type,
      href: r.href,
    })),
  };
}
