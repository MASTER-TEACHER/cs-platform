import { validateExamMarking } from "@/lib/marking/validateExamMarking";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { ExamAssignment, ExamIntegrityIncident, ExamIntegrityIncidentType, ExamSubmission, StudentExamAnswer } from "@/types/examAssignment";

type FirestoreIntegrityIncident = Omit<
  ExamIntegrityIncident,
  "occurredAt"
> & {
  occurredAt?: Timestamp;
};

type FirestoreExamSubmission = Omit<
  ExamSubmission,
  | "id"
  | "startedAt"
  | "submittedAt"
  | "markedAt"
  | "updatedAt"
  | "integritySessionStartedAt"
  | "integrityIncidents"
> & {
  startedAt?: Timestamp;
  submittedAt?: Timestamp;
  markedAt?: Timestamp;
  updatedAt?: Timestamp;
  integritySessionStartedAt?: Timestamp;
  integrityIncidents?: FirestoreIntegrityIncident[];
};

function toDate(
  value?: Timestamp | null,
): Date | null {
  return value?.toDate
    ? value.toDate()
    : null;
}

function convertIncident(
  value: FirestoreIntegrityIncident,
): ExamIntegrityIncident {
  return {
    id: value.id,
    type: value.type,
    occurredAt: toDate(value.occurredAt),
    questionNumber:
      typeof value.questionNumber ===
      "number"
        ? value.questionNumber
        : null,
    detail: value.detail || "",
  };
}

export function createSubmissionId(
  assignmentId: string,
  studentId: string,
): string {
  return `${assignmentId}_${studentId}`;
}

function createAnswers(
  assignment: ExamAssignment,
): StudentExamAnswer[] {
  return assignment.questionSetSnapshot.questions.map(
    (question) => ({
      questionId: question.id,
      questionNumber:
        question.questionNumber,
      response: "",
      awardedMarks: null,
      teacherFeedback: "",
    }),
  );
}

function convertSubmission(
  id: string,
  data: FirestoreExamSubmission,
): ExamSubmission {
  return {
    id,
    assignmentId: data.assignmentId,
    studentId: data.studentId,
    studentName:
      data.studentName || "Student",
    studentEmail:
      data.studentEmail || "",
    teacherId: data.teacherId,
    classId: data.classId,
    status:
      data.status || "not_started",
    answers: data.answers || [],
    totalAwardedMarks:
      data.totalAwardedMarks || 0,
    totalAvailableMarks:
      data.totalAvailableMarks || 0,
    percentage: data.percentage || 0,
    overallFeedback:
      data.overallFeedback || "",

    integrityPolicySnapshot:
      data.integrityPolicySnapshot || null,

    integrityIncidents:
      Array.isArray(
        data.integrityIncidents,
      )
        ? data.integrityIncidents.map(
            convertIncident,
          )
        : [],

    integrityTerminated:
      data.integrityTerminated === true,

    integrityTerminationReason:
      data.integrityTerminationReason || "",

    integritySessionStartedAt:
      toDate(
        data.integritySessionStartedAt,
      ),

    integrityLastQuestionNumber:
      typeof data.integrityLastQuestionNumber ===
      "number"
        ? data.integrityLastQuestionNumber
        : null,

    startedAt: toDate(data.startedAt),
    submittedAt:
      toDate(data.submittedAt),
    markedAt: toDate(data.markedAt),
    updatedAt: toDate(data.updatedAt),
  };
}

export async function getOrCreateExamSubmission({
  assignment,
  studentId,
  studentName,
  studentEmail,
}: {
  assignment: ExamAssignment;
  studentId: string;
  studentName?: string;
  studentEmail?: string;
}): Promise<ExamSubmission> {
  const submissionId =
    createSubmissionId(
      assignment.id,
      studentId,
    );

  const reference = doc(
    db,
    "examSubmissions",
    submissionId,
  );

  const existing =
    await getDoc(reference);

  if (existing.exists()) {
    return convertSubmission(
      existing.id,
      existing.data() as FirestoreExamSubmission,
    );
  }

  const answers =
    createAnswers(assignment);

  await setDoc(reference, {
    assignmentId: assignment.id,
    studentId,
    studentName:
      studentName?.trim() || "Student",
    studentEmail:
      studentEmail?.trim() || "",
    teacherId: assignment.teacherId,
    classId: assignment.classId,
    status: "in_progress",
    answers,
    totalAwardedMarks: 0,
    totalAvailableMarks:
      assignment.totalMarks,
    percentage: 0,
    overallFeedback: "",

    integrityPolicySnapshot: null,
    integrityIncidents: [],
    integrityTerminated: false,
    integrityTerminationReason: "",
    integritySessionStartedAt: null,
    integrityLastQuestionNumber: null,

    startedAt: serverTimestamp(),
    submittedAt: null,
    markedAt: null,
    updatedAt: serverTimestamp(),
  });

  return {
    id: submissionId,
    assignmentId: assignment.id,
    studentId,
    studentName:
      studentName?.trim() || "Student",
    studentEmail:
      studentEmail?.trim() || "",
    teacherId: assignment.teacherId,
    classId: assignment.classId,
    status: "in_progress",
    answers,
    totalAwardedMarks: 0,
    totalAvailableMarks:
      assignment.totalMarks,
    percentage: 0,
    overallFeedback: "",

    integrityPolicySnapshot: null,
    integrityIncidents: [],
    integrityTerminated: false,
    integrityTerminationReason: "",
    integritySessionStartedAt: null,
    integrityLastQuestionNumber: null,

    startedAt: new Date(),
    submittedAt: null,
    markedAt: null,
    updatedAt: new Date(),
  };
}

export async function getExamSubmission(
  assignmentId: string,
  studentId: string,
): Promise<ExamSubmission | null> {
  const snapshot = await getDoc(
    doc(
      db,
      "examSubmissions",
      createSubmissionId(
        assignmentId,
        studentId,
      ),
    ),
  );

  if (!snapshot.exists()) {
    return null;
  }

  return convertSubmission(
    snapshot.id,
    snapshot.data() as FirestoreExamSubmission,
  );
}

export async function startExamIntegritySession({
  assignment,
  studentId,
}: {
  assignment: ExamAssignment;
  studentId: string;
}): Promise<void> {
  const reference = doc(
    db,
    "examSubmissions",
    createSubmissionId(
      assignment.id,
      studentId,
    ),
  );

  const snapshot =
    await getDoc(reference);

  if (!snapshot.exists()) {
    throw new Error(
      "Submission not found.",
    );
  }

  const data = snapshot.data();

  if (
    ["submitted", "marking", "marked"].includes(
      data.status,
    )
  ) {
    return;
  }

  const updates: Record<
    string,
    unknown
  > = {
    integrityPolicySnapshot:
      assignment.integrityPolicy,
    updatedAt: serverTimestamp(),
  };

  if (
    !data.integritySessionStartedAt
  ) {
    updates.integritySessionStartedAt =
      serverTimestamp();
  }

  await updateDoc(
    reference,
    updates,
  );
}

function incidentId(
  type: ExamIntegrityIncidentType,
): string {
  return `${type}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export async function recordExamIntegrityIncident({
  assignmentId,
  studentId,
  type,
  questionNumber,
  detail,
}: {
  assignmentId: string;
  studentId: string;
  type: ExamIntegrityIncidentType;
  questionNumber: number | null;
  detail: string;
}): Promise<void> {
  const reference = doc(
    db,
    "examSubmissions",
    createSubmissionId(
      assignmentId,
      studentId,
    ),
  );

  const incident = {
    id: incidentId(type),
    type,
    occurredAt: Timestamp.now(),
    questionNumber:
      questionNumber ?? null,
    detail: detail.trim(),
  };

  await updateDoc(reference, {
    integrityIncidents:
      arrayUnion(incident),
    integrityLastQuestionNumber:
      questionNumber ?? null,
    updatedAt: serverTimestamp(),
  });
}

export async function updateExamCurrentQuestion({
  assignmentId,
  studentId,
  questionNumber,
}: {
  assignmentId: string;
  studentId: string;
  questionNumber: number;
}): Promise<void> {
  await updateDoc(
    doc(
      db,
      "examSubmissions",
      createSubmissionId(
        assignmentId,
        studentId,
      ),
    ),
    {
      integrityLastQuestionNumber:
        questionNumber,
      updatedAt: serverTimestamp(),
    },
  );
}

export async function terminateExamForIntegrity({
  assignmentId,
  studentId,
  answers,
  questionNumber,
  reason,
}: {
  assignmentId: string;
  studentId: string;
  answers: StudentExamAnswer[];
  questionNumber: number | null;
  reason: string;
}): Promise<void> {
  const reference = doc(
    db,
    "examSubmissions",
    createSubmissionId(
      assignmentId,
      studentId,
    ),
  );

  const terminationIncident = {
    id: incidentId(
      "integrity_termination",
    ),
    type:
      "integrity_termination" as const,
    occurredAt: Timestamp.now(),
    questionNumber:
      questionNumber ?? null,
    detail: reason.trim(),
  };

  await runTransaction(
    db,
    async (transaction) => {
      const snapshot =
        await transaction.get(reference);

      if (!snapshot.exists()) {
        throw new Error(
          "Submission not found.",
        );
      }

      const status =
        snapshot.data().status;

      if (
        ["submitted", "marking", "marked"].includes(
          status,
        )
      ) {
        return;
      }

      const currentIncidents =
        Array.isArray(
          snapshot.data()
            .integrityIncidents,
        )
          ? snapshot.data()
              .integrityIncidents
          : [];

      transaction.update(
        reference,
        {
          answers,
          status: "submitted",
          submittedAt:
            serverTimestamp(),

          integrityTerminated: true,
          integrityTerminationReason:
            reason.trim(),

          integrityLastQuestionNumber:
            questionNumber ?? null,

          integrityIncidents: [
            ...currentIncidents,
            terminationIncident,
          ],

          updatedAt:
            serverTimestamp(),
        },
      );
    },
  );
}

export async function autosaveExamAnswers(
  assignmentId: string,
  studentId: string,
  answers: StudentExamAnswer[],
): Promise<void> {
  const reference = doc(
    db,
    "examSubmissions",
    createSubmissionId(
      assignmentId,
      studentId,
    ),
  );

  const snapshot =
    await getDoc(reference);

  if (
    snapshot.exists() &&
    ["submitted", "marking", "marked"].includes(
      snapshot.data().status,
    )
  ) {
    throw new Error(
      "This submission is locked.",
    );
  }

  await updateDoc(reference, {
    answers,
    status: "in_progress",
    updatedAt: serverTimestamp(),
  });
}

export async function submitExamSubmission(
  assignmentId: string,
  studentId: string,
): Promise<void> {
  const submissionReference = doc(
    db,
    "examSubmissions",
    createSubmissionId(
      assignmentId,
      studentId,
    ),
  );

  const snapshot =
    await getDoc(
      submissionReference,
    );

  if (!snapshot.exists()) {
    throw new Error(
      "Submission not found.",
    );
  }

  const status =
    snapshot.data().status;

  if (
    status === "submitted" ||
    status === "marking" ||
    status === "marked"
  ) {
    return;
  }

  await updateDoc(
    submissionReference,
    {
      status: "submitted",
      submittedAt:
        serverTimestamp(),
      updatedAt:
        serverTimestamp(),
    },
  );
}

export async function getAssignmentSubmissions(
  assignmentId: string,
  teacherId: string,
): Promise<ExamSubmission[]> {
  const cleanedAssignmentId =
    assignmentId.trim();

  const cleanedTeacherId =
    teacherId.trim();

  if (
    !cleanedAssignmentId ||
    !cleanedTeacherId
  ) {
    return [];
  }

  const assignmentSnapshot = await getDoc(
    doc(
      db,
      "examAssignments",
      cleanedAssignmentId,
    ),
  );

  if (!assignmentSnapshot.exists()) {
    return [];
  }

  const assignmentData = assignmentSnapshot.data();
  const classId =
    typeof assignmentData.classId === "string"
      ? assignmentData.classId.trim()
      : "";

  if (!classId) {
    return [];
  }

  const classSnapshot = await getDoc(
    doc(
      db,
      "classes",
      classId,
    ),
  );

  if (!classSnapshot.exists()) {
    return [];
  }

  const classData = classSnapshot.data();
  const ownerTeacherId =
    typeof classData.teacherId === "string"
      ? classData.teacherId.trim()
      : "";

  const coTeacherIds = Array.isArray(classData.coTeacherIds)
    ? classData.coTeacherIds
        .filter((value: unknown): value is string => typeof value === "string")
        .map((value: string) => value.trim())
        .filter(Boolean)
    : [];

  if (
    ownerTeacherId !== cleanedTeacherId &&
    !coTeacherIds.includes(cleanedTeacherId)
  ) {
    return [];
  }

  const snapshot = await getDocs(
    query(
      collection(
        db,
        "examSubmissions",
      ),
      where(
        "assignmentId",
        "==",
        cleanedAssignmentId,
      ),
      where(
        "classId",
        "==",
        classId,
      ),
    ),
  );

  return snapshot.docs
    .map((document) =>
      convertSubmission(
        document.id,
        document.data() as FirestoreExamSubmission,
      ),
    )
    .sort((first, second) =>
      first.studentName.localeCompare(
        second.studentName,
        "en-GB",
        {
          sensitivity: "base",
        },
      ),
    );
}

async function postTeacherMarking(input: {
  assignmentId: string;
  studentId: string;
  answers?: StudentExamAnswer[];
  overallFeedback?: string;
  action: "draft" | "finalise" | "release";
  reason?: string;
}): Promise<void> {
  const { auth } = await import("@/lib/firebase");
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Please sign in again.");
  const response = await fetch("/api/teacher/exam-marking", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
  const data: { error?: string } = await response.json();
  if (!response.ok) throw new Error(data.error || "Marking request failed.");
}

export async function saveDraftMarking(input: {
  assignmentId: string; studentId: string; answers: StudentExamAnswer[]; overallFeedback: string;
}): Promise<void> {
  await postTeacherMarking({ ...input, action: "draft" });
}

export async function finaliseExamMarking(input: {
  assignmentId: string; studentId: string; answers: StudentExamAnswer[]; overallFeedback: string; totalAvailableMarks: number;
}): Promise<void> {
  await postTeacherMarking({ ...input, action: "finalise" });
}

export async function releaseExamResults(assignmentId: string, studentId: string): Promise<void> {
  await postTeacherMarking({ assignmentId, studentId, action: "release" });
}
