import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { getTeacherStudentAnalytics } from "@/services/analytics/teacherAnalyticsService";
import type { TeacherStudentAnalyticsRow } from "@/types/teacherAnalytics";
import type {
  InterventionAnalyticsBaseline,
  InterventionImpact,
  InterventionImpactStatus,
} from "@/types/interventionImpact";

function gradeValue(value: string | null): number | null {
  if (!value) return null;

  const cleaned = value.trim().toUpperCase();
  const numeric = Number(cleaned);

  if (Number.isFinite(numeric)) {
    return numeric;
  }

  const aLevelOrder: Record<string, number> = {
    E: 1,
    D: 2,
    C: 3,
    B: 4,
    A: 5,
    "A*": 6,
  };

  return aLevelOrder[cleaned] ?? null;
}

function topicMastery(
  row: TeacherStudentAnalyticsRow,
  topic: string,
): number | null {
  const normalised = topic.trim().toLowerCase();

  const exactMatch = row.analytics.topics.find(
    (item) => item.topic.trim().toLowerCase() === normalised,
  );

  if (exactMatch) {
    return exactMatch.weightedPercentage;
  }

  const partialMatch = row.analytics.topics.find((item) => {
    const candidate = item.topic.trim().toLowerCase();

    return (
      candidate.includes(normalised) ||
      normalised.includes(candidate)
    );
  });

  return partialMatch?.weightedPercentage ?? null;
}

function evidenceCount(row: TeacherStudentAnalyticsRow): number {
  return row.analytics.evidence.filter((item) => item.graded).length;
}

function createBaseline(
  row: TeacherStudentAnalyticsRow,
  topic: string,
): InterventionAnalyticsBaseline {
  return {
    capturedAt: new Date(),
    workingGrade: row.workingGrade,
    targetGrade: row.targetGrade,
    gradeGap: row.gradeGap,
    weightedPercentage: row.workingPercentage ?? 0,
    trend: row.trend,
    completionRate: row.completionRate,
    evidenceCount: evidenceCount(row),
    topic,
    topicMastery: topicMastery(row, topic),
  };
}

function convertStoredBaseline(
  value: unknown,
): InterventionAnalyticsBaseline | null {
  if (!value || typeof value !== "object") return null;

  const data = value as Record<string, unknown>;
  let capturedAt: Date | null = null;
  const raw = data.capturedAt;

  if (
    raw &&
    typeof raw === "object" &&
    "toDate" in raw &&
    typeof (raw as { toDate?: unknown }).toDate === "function"
  ) {
    capturedAt = (raw as { toDate: () => Date }).toDate();
  } else if (raw instanceof Date) {
    capturedAt = raw;
  }

  return {
    capturedAt,
    workingGrade:
      typeof data.workingGrade === "string" ? data.workingGrade : null,
    targetGrade:
      typeof data.targetGrade === "string" ? data.targetGrade : null,
    gradeGap:
      typeof data.gradeGap === "number" ? data.gradeGap : null,
    weightedPercentage:
      typeof data.weightedPercentage === "number"
        ? data.weightedPercentage
        : 0,
    trend:
      typeof data.trend === "string" ? data.trend : "insufficient",
    completionRate:
      typeof data.completionRate === "number" ? data.completionRate : 0,
    evidenceCount:
      typeof data.evidenceCount === "number" ? data.evidenceCount : 0,
    topic:
      typeof data.topic === "string"
        ? data.topic
        : "General Computer Science",
    topicMastery:
      typeof data.topicMastery === "number" ? data.topicMastery : null,
  };
}

function determineImpactStatus(
  baseline: InterventionAnalyticsBaseline | null,
  current: InterventionAnalyticsBaseline,
): InterventionImpactStatus {
  if (!baseline) return "baseline_missing";

  if (current.evidenceCount <= baseline.evidenceCount) {
    return "awaiting_new_evidence";
  }

  const attainment =
    current.weightedPercentage - baseline.weightedPercentage;
  const completion =
    current.completionRate - baseline.completionRate;
  const topic =
    baseline.topicMastery !== null && current.topicMastery !== null
      ? current.topicMastery - baseline.topicMastery
      : null;

  const baselineGrade = gradeValue(baseline.workingGrade);
  const currentGrade = gradeValue(current.workingGrade);
  const grade =
    baselineGrade !== null && currentGrade !== null
      ? currentGrade - baselineGrade
      : null;

  const positive = [
    attainment >= 5,
    completion >= 5,
    topic !== null && topic >= 5,
    grade !== null && grade > 0,
  ].filter(Boolean).length;

  const negative = [
    attainment <= -5,
    completion <= -5,
    topic !== null && topic <= -5,
    grade !== null && grade < 0,
  ].filter(Boolean).length;

  if (positive >= 2 && negative === 0) return "improving";
  if (negative >= 2 && positive === 0) return "declining";
  if (positive > 0 && negative > 0) return "mixed";

  return "no_change";
}

function summary(status: InterventionImpactStatus): string {
  switch (status) {
    case "baseline_missing":
      return "No reliable before-intervention baseline is available for this older intervention.";
    case "awaiting_new_evidence":
      return "The baseline is captured, but no new graded evidence is available yet.";
    case "improving":
      return "Post-intervention evidence shows improvement across multiple indicators.";
    case "declining":
      return "Post-intervention evidence has weakened across multiple indicators.";
    case "mixed":
      return "Some indicators improved while others weakened.";
    default:
      return "New evidence exists, but there is no material overall change yet.";
  }
}

function nextAction(status: InterventionImpactStatus): string {
  switch (status) {
    case "baseline_missing":
      return "Capture a baseline now for future comparison.";
    case "awaiting_new_evidence":
      return "Collect another graded task before reviewing impact.";
    case "improving":
      return "Continue the strategy and reassess after the next meaningful task.";
    case "declining":
      return "Redesign or escalate the support and use a more focused reassessment.";
    case "mixed":
      return "Keep the effective elements and retarget the areas that have not improved.";
    default:
      return "Maintain support and review after the next assessment.";
  }
}

export async function captureInterventionBaseline({
  interventionId,
  teacherId,
  studentId,
  topic,
}: {
  interventionId: string;
  teacherId: string;
  studentId: string;
  topic: string;
}): Promise<void> {
  const cleanedInterventionId = interventionId.trim();
  const cleanedTeacherId = teacherId.trim();
  const cleanedStudentId = studentId.trim();
  const cleanedTopic = topic.trim() || "General Computer Science";

  if (!cleanedInterventionId) {
    throw new Error("A valid intervention is required.");
  }

  if (!cleanedTeacherId) {
    throw new Error("A valid teacher account is required.");
  }

  if (!cleanedStudentId) {
    throw new Error("A valid student account is required.");
  }

  const interventionReference = doc(
    db,
    "interventions",
    cleanedInterventionId,
  );

  const interventionSnapshot = await getDoc(interventionReference);

  if (!interventionSnapshot.exists()) {
    throw new Error("The intervention could not be found.");
  }

  const interventionData = interventionSnapshot.data();

  if (
    typeof interventionData.teacherId !== "string" ||
    interventionData.teacherId !== cleanedTeacherId
  ) {
    throw new Error(
      "This intervention does not belong to the signed-in teacher.",
    );
  }

  if (
    typeof interventionData.studentId !== "string" ||
    interventionData.studentId !== cleanedStudentId
  ) {
    throw new Error(
      "The intervention does not belong to the selected student.",
    );
  }

  const row = await getTeacherStudentAnalytics({
    teacherId: cleanedTeacherId,
    studentId: cleanedStudentId,
  });

  if (!row) {
    throw new Error("Student analytics could not be loaded.");
  }

  const baseline = createBaseline(row, cleanedTopic);

  await updateDoc(interventionReference, {
    analyticsBaseline: {
      ...baseline,
      capturedAt: serverTimestamp(),
    },
    analyticsBaselineVersion: 1,
    updatedAt: serverTimestamp(),
  });
}

export async function getInterventionImpact({
  interventionId,
  teacherId,
}: {
  interventionId: string;
  teacherId: string;
}): Promise<InterventionImpact | null> {
  const cleanedInterventionId = interventionId.trim();
  const cleanedTeacherId = teacherId.trim();

  if (!cleanedInterventionId || !cleanedTeacherId) {
    return null;
  }

  const snapshot = await getDoc(
    doc(db, "interventions", cleanedInterventionId),
  );

  if (!snapshot.exists()) return null;

  const data = snapshot.data();

  if (
    typeof data.teacherId !== "string" ||
    data.teacherId !== cleanedTeacherId
  ) {
    throw new Error(
      "This intervention does not belong to the signed-in teacher.",
    );
  }

  const studentId =
    typeof data.studentId === "string" ? data.studentId.trim() : "";

  if (!studentId) return null;

  const topic =
    (typeof data.topic === "string" && data.topic.trim()) ||
    (typeof data.priorityTopic === "string" && data.priorityTopic.trim()) ||
    "General Computer Science";

  const row = await getTeacherStudentAnalytics({
    teacherId: cleanedTeacherId,
    studentId,
  });

  if (!row) return null;

  const baseline = convertStoredBaseline(data.analyticsBaseline);
  const current = createBaseline(row, topic);
  const impactStatus = determineImpactStatus(baseline, current);

  const baselineGrade = gradeValue(baseline?.workingGrade ?? null);
  const currentGrade = gradeValue(current.workingGrade);

  const createdAt =
    data.createdAt &&
    typeof data.createdAt === "object" &&
    "toDate" in data.createdAt &&
    typeof (data.createdAt as { toDate?: unknown }).toDate === "function"
      ? (data.createdAt as { toDate: () => Date }).toDate()
      : null;

  return {
    interventionId: snapshot.id,
    studentId,
    title:
      (typeof data.title === "string" && data.title.trim()) ||
      (typeof data.recommendation === "string" && data.recommendation.trim()) ||
      "Student intervention",
    topic,
    status:
      typeof data.status === "string" ? data.status : "active",
    createdAt,
    baseline,
    current,
    impactStatus,
    workingGradeChange:
      baselineGrade !== null && currentGrade !== null
        ? currentGrade - baselineGrade
        : null,
    gradeGapChange:
      baseline?.gradeGap !== null &&
      baseline?.gradeGap !== undefined &&
      current.gradeGap !== null
        ? current.gradeGap - baseline.gradeGap
        : null,
    attainmentChange:
      baseline
        ? current.weightedPercentage - baseline.weightedPercentage
        : 0,
    completionChange:
      baseline
        ? current.completionRate - baseline.completionRate
        : 0,
    topicMasteryChange:
      baseline?.topicMastery !== null &&
      baseline?.topicMastery !== undefined &&
      current.topicMastery !== null
        ? current.topicMastery - baseline.topicMastery
        : null,
    evidenceChange:
      baseline
        ? current.evidenceCount - baseline.evidenceCount
        : 0,
    summary: summary(impactStatus),
    nextAction: nextAction(impactStatus),
  };
}
