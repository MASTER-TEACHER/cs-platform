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
        "teacherId",
        "==",
        cleanedTeacherId,
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

export async function saveDraftMarking({
  assignmentId,
  studentId,
  answers,
  overallFeedback,
}: {
  assignmentId: string;
  studentId: string;
  answers: StudentExamAnswer[];
  overallFeedback: string;
}): Promise<void> {
  const totalAwardedMarks =
    answers.reduce(
      (sum, answer) =>
        sum +
        (answer.awardedMarks || 0),
      0,
    );

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
      answers,
      overallFeedback:
        overallFeedback.trim(),
      totalAwardedMarks,
      status: "marking",
      updatedAt:
        serverTimestamp(),
    },
  );
}

export async function finaliseExamMarking({
  assignmentId,
  studentId,
  answers,
  overallFeedback,
  totalAvailableMarks,
}: {
  assignmentId: string;
  studentId: string;
  answers: StudentExamAnswer[];
  overallFeedback: string;
  totalAvailableMarks: number;
}): Promise<void> {
  const assignmentReference = doc(
    db,
    "examAssignments",
    assignmentId,
  );

  const submissionReference = doc(
    db,
    "examSubmissions",
    createSubmissionId(
      assignmentId,
      studentId,
    ),
  );

  const totalAwardedMarks =
    answers.reduce(
      (sum, answer) =>
        sum +
        (answer.awardedMarks ?? 0),
      0,
    );

  const safeAwardedMarks =
    Math.min(
      totalAvailableMarks,
      Math.max(
        0,
        totalAwardedMarks,
      ),
    );

  const percentage =
    totalAvailableMarks > 0
      ? Math.round(
          (safeAwardedMarks /
            totalAvailableMarks) *
            100,
        )
      : 0;

  await runTransaction(
    db,
    async (transaction) => {
      const [
        submissionSnapshot,
        assignmentSnapshot,
      ] = await Promise.all([
        transaction.get(
          submissionReference,
        ),
        transaction.get(
          assignmentReference,
        ),
      ]);

      if (
        !submissionSnapshot.exists()
      ) {
        throw new Error(
          "Submission not found.",
        );
      }

      if (
        !assignmentSnapshot.exists()
      ) {
        throw new Error(
          "Assignment not found.",
        );
      }

      const submissionData =
        submissionSnapshot.data();

      const assignmentData =
        assignmentSnapshot.data();

      const alreadyMarked =
        submissionData.status ===
        "marked";

      transaction.update(
        submissionReference,
        {
          answers,
          overallFeedback:
            overallFeedback.trim(),
          totalAwardedMarks:
            safeAwardedMarks,
          totalAvailableMarks,
          percentage,
          status: "marked",
          markedAt:
            serverTimestamp(),
          updatedAt:
            serverTimestamp(),
        },
      );

      if (!alreadyMarked) {
        const currentMarkedCount =
          typeof assignmentData.markedCount ===
          "number"
            ? assignmentData.markedCount
            : 0;

        const studentCount =
          Array.isArray(
            assignmentData.studentIds,
          )
            ? assignmentData
                .studentIds.length
            : 0;

        transaction.update(
          assignmentReference,
          {
            markedCount:
              Math.min(
                currentMarkedCount +
                  1,
                studentCount,
              ),
            updatedAt:
              serverTimestamp(),
          },
        );
      }
    },
  );
}
