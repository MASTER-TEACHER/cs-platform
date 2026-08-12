import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  CreateInterventionInput,
  Intervention,
  InterventionStep,
  InterventionStepStatus,
  InterventionStatus,
} from "@/types/intervention";

type FirestoreStep = Omit<InterventionStep, "completedAt"> & {
  completedAt?: Timestamp | null;
};
type FirestoreIntervention = Omit<
  Intervention,
  "id" | "dueDate" | "steps" | "createdAt" | "updatedAt" | "completedAt"
> & {
  dueDate?: Timestamp;
  steps?: FirestoreStep[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  completedAt?: Timestamp | null;
};

const toDate = (value?: Timestamp | null) =>
  value?.toDate ? value.toDate() : null;
const clamp = (value: number) => Math.min(100, Math.max(0, value));

function convert(id: string, data: FirestoreIntervention): Intervention {
  return {
    id,
    ...data,
    teacherName: data.teacherName || "Teacher",
    studentName: data.studentName || "Student",
    studentEmail: data.studentEmail || "",
    classId: data.classId || "",
    className: data.className || "",
    reason: data.reason || "",
    priority: data.priority || "medium",
    status: data.status || "active",
    baselineScore: clamp(data.baselineScore || 0),
    currentScore: clamp(data.currentScore || 0),
    impact: typeof data.impact === "number" ? data.impact : 0,
    dueDate: toDate(data.dueDate),
    steps: (data.steps || []).map((step) => ({
      ...step,
      completedAt: toDate(step.completedAt),
    })),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
    completedAt: toDate(data.completedAt),
  };
}

function buildSteps(input: CreateInterventionInput): InterventionStep[] {
  const xp = Math.max(0, input.xpPerStep || 25);
  const steps: InterventionStep[] = [];
  const add = (
    type: InterventionStep["type"],
    title: string,
    description: string,
    href: string,
    sourceId = "",
    sourceCollection: InterventionStep["sourceCollection"] = "",
  ) => {
    steps.push({
      id: `${type}-${Date.now()}-${steps.length}`,
      type,
      title,
      description,
      href,
      sourceId,
      sourceCollection,
      status: "not_started",
      xpReward: xp,
      completedAt: null,
    });
  };
  if (input.pathway === "lesson" || input.pathway === "complete")
    add(
      "lesson",
      `Review ${input.topic}`,
      "Revisit the core knowledge and examples.",
      input.lessonHref?.trim() ||
        `/learn?search=${encodeURIComponent(input.topic)}`,
    );
  if (input.pathway === "quiz" || input.pathway === "complete")
    add(
      "quiz",
      `Retrieval quiz: ${input.topic}`,
      "Complete retrieval practice and correct misconceptions.",
      input.quizAssignmentId?.trim()
        ? `/assignments/quiz/${input.quizAssignmentId.trim()}`
        : `/quiz?topic=${encodeURIComponent(input.topic)}`,
      input.quizAssignmentId?.trim() || "",
      input.quizAssignmentId?.trim() ? "assignments" : "",
    );
  if (input.pathway === "exam" || input.pathway === "complete")
    add(
      "exam",
      `Exam practice: ${input.topic}`,
      "Attempt an exam-style question and review the mark scheme.",
      input.examAssignmentId?.trim()
        ? `/assignments/exam/${input.examAssignmentId.trim()}`
        : "/assignments?filter=exams",
      input.examAssignmentId?.trim() || "",
      input.examAssignmentId?.trim() ? "examAssignments" : "",
    );
  if (input.pathway === "complete")
    add(
      "review",
      "Review progress",
      "Reflect on feedback and agree the next target.",
      "/revision-plan",
    );
  return steps;
}

export async function createIntervention(
  input: CreateInterventionInput,
): Promise<string> {
  if (
    !input.teacherId.trim() ||
    !input.studentId.trim() ||
    !input.title.trim() ||
    !input.topic.trim()
  )
    throw new Error("Teacher, student, title and topic are required.");
  if (!(input.dueDate instanceof Date) || Number.isNaN(input.dueDate.getTime()))
    throw new Error("Select a valid due date.");
  const existing = await getDocs(
    query(
      collection(db, "interventions"),
      where("teacherId", "==", input.teacherId.trim()),
      where("studentId", "==", input.studentId.trim()),
    ),
  );
  if (
    existing.docs.some(
      (d) =>
        d.data().status === "active" &&
        String(d.data().topic || "").toLowerCase() ===
          input.topic.trim().toLowerCase(),
    )
  )
    throw new Error(
      "An active intervention already exists for this student and topic.",
    );
  const baselineScore = clamp(input.baselineScore);
  const ref = await addDoc(collection(db, "interventions"), {
    teacherId: input.teacherId.trim(),
    teacherName: input.teacherName?.trim() || "Teacher",
    studentId: input.studentId.trim(),
    studentName: input.studentName.trim(),
    studentEmail: input.studentEmail?.trim() || "",
    classId: input.classId?.trim() || "",
    className: input.className?.trim() || "",
    title: input.title.trim(),
    topic: input.topic.trim(),
    reason: input.reason.trim(),
    priority: input.priority,
    status: "active",
    baselineScore,
    currentScore: baselineScore,
    impact: 0,
    dueDate: Timestamp.fromDate(input.dueDate),
    steps: buildSteps(input),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    completedAt: null,
  });
  return ref.id;
}

export async function getInterventionById(
  id: string,
): Promise<Intervention | null> {
  const snap = await getDoc(doc(db, "interventions", id));
  return snap.exists()
    ? convert(snap.id, snap.data() as FirestoreIntervention)
    : null;
}

export async function getTeacherInterventions(
  teacherId: string,
): Promise<Intervention[]> {
  if (!teacherId.trim()) return [];
  const snap = await getDocs(
    query(
      collection(db, "interventions"),
      where("teacherId", "==", teacherId.trim()),
      orderBy("createdAt", "desc"),
    ),
  );
  return snap.docs.map((d) => convert(d.id, d.data() as FirestoreIntervention));
}

async function linkedStatus(
  intervention: Intervention,
  step: InterventionStep,
): Promise<InterventionStepStatus> {
  if (!step.sourceId || !step.sourceCollection) return step.status;
  if (step.sourceCollection === "assignments") {
    const snap = await getDoc(
      doc(
        db,
        "assignmentResults",
        `${step.sourceId}_${intervention.studentId}`,
      ),
    );
    return snap.exists() && snap.data().status === "completed"
      ? "completed"
      : step.status;
  }
  if (step.sourceCollection === "examAssignments") {
    const snap = await getDoc(
      doc(db, "examSubmissions", `${step.sourceId}_${intervention.studentId}`),
    );
    if (!snap.exists()) return step.status;
    const status = snap.data().status;
    if (status === "marked") return "completed";
    if (["in_progress", "submitted", "marking"].includes(status))
      return "in_progress";
  }
  return step.status;
}

export async function getStudentInterventions(
  studentId: string,
): Promise<Intervention[]> {
  if (!studentId.trim()) return [];
  const snap = await getDocs(
    query(
      collection(db, "interventions"),
      where("studentId", "==", studentId.trim()),
      orderBy("createdAt", "desc"),
    ),
  );
  const items = snap.docs.map((d) =>
    convert(d.id, d.data() as FirestoreIntervention),
  );
  return Promise.all(
    items.map(async (item) => ({
      ...item,
      steps: await Promise.all(
        item.steps.map(async (step) => ({
          ...step,
          status: await linkedStatus(item, step),
        })),
      ),
    })),
  );
}

export async function updateInterventionStep(
  interventionId: string,
  studentId: string,
  stepId: string,
  status: InterventionStepStatus,
): Promise<void> {
  const item = await getInterventionById(interventionId);
  if (!item || item.studentId !== studentId)
    throw new Error("Intervention not found for this student.");
  const steps = item.steps.map((step) =>
    step.id === stepId
      ? {
          ...step,
          status,
          completedAt: status === "completed" ? new Date() : null,
        }
      : step,
  );
  const allCompleted = steps.every((step) => step.status === "completed");
  await updateDoc(doc(db, "interventions", interventionId), {
    steps: steps.map((step) => ({
      ...step,
      completedAt: step.completedAt
        ? Timestamp.fromDate(step.completedAt)
        : null,
    })),
    status: allCompleted ? "completed" : "active",
    completedAt: allCompleted ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
  });
}

export async function updateInterventionStatus(
  id: string,
  status: InterventionStatus,
): Promise<void> {
  await updateDoc(doc(db, "interventions", id), {
    status,
    completedAt: status === "completed" ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
  });
}

export async function updateInterventionImpact(
  id: string,
  currentScore: number,
): Promise<void> {
  const item = await getInterventionById(id);
  if (!item) throw new Error("Intervention not found.");
  const score = clamp(currentScore);
  await updateDoc(doc(db, "interventions", id), {
    currentScore: score,
    impact: score - item.baselineScore,
    updatedAt: serverTimestamp(),
  });
}
