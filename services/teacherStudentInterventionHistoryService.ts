import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { TeacherInterventionHistoryItem } from "@/types/teacherActionWorkflow";

function toDate(value: unknown): Date | null {
  if (!value) return null;

  if (value instanceof Date) {
    return value;
  }

  if (value instanceof Timestamp) {
    return value.toDate();
  }

  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

function safeString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : fallback;
}

export async function getTeacherStudentInterventionHistory({
  teacherId,
  studentId,
}: {
  teacherId: string;
  studentId: string;
}): Promise<TeacherInterventionHistoryItem[]> {
  const cleanedTeacherId = teacherId.trim();
  const cleanedStudentId = studentId.trim();

  if (!cleanedTeacherId || !cleanedStudentId) {
    return [];
  }

  /*
   * Query by teacherId only.
   *
   * This matches the existing Firestore rule proving that every returned
   * intervention belongs to the signed-in teacher. We then filter the
   * selected student in memory, avoiding another composite-index dependency.
   */
  const snapshot = await getDocs(
    query(
      collection(db, "interventions"),
      where("teacherId", "==", cleanedTeacherId),
    ),
  );

  return snapshot.docs
    .map((document) => {
      const data = document.data();

      const steps = Array.isArray(data.steps) ? data.steps : [];

      const completedStepCount = steps.filter(
        (step) =>
          step &&
          typeof step === "object" &&
          "status" in step &&
          (step as { status?: unknown }).status === "completed",
      ).length;

      return {
        id: document.id,
        studentId: safeString(data.studentId),
        teacherId: safeString(data.teacherId),
        topic:
          safeString(data.topic) ||
          safeString(data.priorityTopic) ||
          "General support",
        title:
          safeString(data.title) ||
          safeString(data.recommendation) ||
          "Student intervention",
        status: safeString(data.status, "active"),
        priority: safeString(data.priority, "monitor"),
        pathway: safeString(data.pathway, "complete"),
        stepCount: steps.length,
        completedStepCount,
        createdAt: toDate(data.createdAt),
        completedAt: toDate(data.completedAt),
      } satisfies TeacherInterventionHistoryItem;
    })
    .filter(
      (item) =>
        item.teacherId === cleanedTeacherId &&
        item.studentId === cleanedStudentId,
    )
    .sort(
      (first, second) =>
        (second.createdAt?.getTime() ?? 0) -
        (first.createdAt?.getTime() ?? 0),
    );
}
