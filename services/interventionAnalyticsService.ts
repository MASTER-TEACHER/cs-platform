import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getStudentAnalytics } from "@/services/studentAnalyticsService";
import {
  getAllStudents,
  type StudentDirectoryRecord,
} from "@/services/studentProfileService";

export type InterventionCandidate = {
  student: StudentDirectoryRecord;
  classId: string;
  className: string;
  combinedAverage: number;
  predictedGrade: string;
  improvementTrend: number;
  overdueAssignments: number;
  awaitingMarking: number;
  priorityTopic: string;
  priorityTopicScore: number;
  recommendation: string;
  priority: "high" | "medium" | "low";
};

export async function getInterventionCandidates(
  teacherId: string,
): Promise<InterventionCandidate[]> {
  if (!teacherId.trim()) return [];
  const classSnap = await getDocs(
    query(
      collection(db, "classes"),
      where("teacherId", "==", teacherId.trim()),
    ),
  );
  const classNames = new Map(
    classSnap.docs.map((d) => [
      d.id,
      typeof d.data().name === "string" ? d.data().name : "Class",
    ]),
  );
  const classIds = new Set(classNames.keys());
  const students = (await getAllStudents()).filter((student) =>
    student.classIds.some((id) => classIds.has(id)),
  );
  const candidates = await Promise.all(
    students.map(async (student) => {
      const analytics = await getStudentAnalytics(student.uid, teacherId);
      if (!analytics) return null;
      const weak = analytics.weakestTopics[0];
      const classId = student.classIds.find((id) => classIds.has(id)) || "";
      const avg = analytics.metrics.combinedAssessmentAverage;
      const overdue = analytics.metrics.overdueAssignments;
      const trend = analytics.metrics.improvementTrend;
      return {
        student,
        classId,
        className: classNames.get(classId) || "",
        combinedAverage: avg,
        predictedGrade: analytics.metrics.predictedGrade,
        improvementTrend: trend,
        overdueAssignments: overdue,
        awaitingMarking: analytics.metrics.awaitingMarkingExamAssignments,
        priorityTopic: weak?.topic || "General revision",
        priorityTopicScore: weak?.averageScore || avg,
        recommendation:
          analytics.recommendations[0]?.description ||
          "Continue targeted revision and assessment practice.",
        priority:
          avg < 40 || overdue > 0
            ? "high"
            : avg < 60 || trend < 0
              ? "medium"
              : "low",
      } satisfies InterventionCandidate;
    }),
  );
  const weight = { high: 0, medium: 1, low: 2 };
  return candidates
    .filter((item): item is InterventionCandidate => item !== null)
    .sort(
      (a, b) =>
        weight[a.priority] - weight[b.priority] ||
        a.combinedAverage - b.combinedAverage,
    );
}
