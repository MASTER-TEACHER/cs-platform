import {
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
import type {
  ExamAssignment,
  ExamSubmission,
  StudentExamAnswer,
} from "@/types/examAssignment";

type FirestoreExamSubmission = Omit<
  ExamSubmission,
  "id" | "startedAt" | "submittedAt" | "markedAt" | "updatedAt"
> & {
  startedAt?: Timestamp;
  submittedAt?: Timestamp;
  markedAt?: Timestamp;
  updatedAt?: Timestamp;
};

function toDate(value?: Timestamp | null): Date | null {
  return value?.toDate ? value.toDate() : null;
}

export function createSubmissionId(
  assignmentId: string,
  studentId: string,
): string {
  return `${assignmentId}_${studentId}`;
}

function createAnswers(assignment: ExamAssignment): StudentExamAnswer[] {
  return assignment.questionSetSnapshot.questions.map((question) => ({
    questionId: question.id,
    questionNumber: question.questionNumber,
    response: "",
    awardedMarks: null,
    teacherFeedback: "",
  }));
}

function convertSubmission(
  id: string,
  data: FirestoreExamSubmission,
): ExamSubmission {
  return {
    id,
    assignmentId: data.assignmentId,
    studentId: data.studentId,
    studentName: data.studentName || "Student",
    studentEmail: data.studentEmail || "",
    teacherId: data.teacherId,
    classId: data.classId,
    status: data.status || "not_started",
    answers: data.answers || [],
    totalAwardedMarks: data.totalAwardedMarks || 0,
    totalAvailableMarks: data.totalAvailableMarks || 0,
    percentage: data.percentage || 0,
    overallFeedback: data.overallFeedback || "",
    startedAt: toDate(data.startedAt),
    submittedAt: toDate(data.submittedAt),
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
  const submissionId = createSubmissionId(assignment.id, studentId);
  const reference = doc(db, "examSubmissions", submissionId);
  const existing = await getDoc(reference);

  if (existing.exists()) {
    return convertSubmission(
      existing.id,
      existing.data() as FirestoreExamSubmission,
    );
  }

  const answers = createAnswers(assignment);

  await setDoc(reference, {
    assignmentId: assignment.id,
    studentId,
    studentName: studentName?.trim() || "Student",
    studentEmail: studentEmail?.trim() || "",
    teacherId: assignment.teacherId,
    classId: assignment.classId,
    status: "in_progress",
    answers,
    totalAwardedMarks: 0,
    totalAvailableMarks: assignment.totalMarks,
    percentage: 0,
    overallFeedback: "",
    startedAt: serverTimestamp(),
    submittedAt: null,
    markedAt: null,
    updatedAt: serverTimestamp(),
  });

  return {
    id: submissionId,
    assignmentId: assignment.id,
    studentId,
    studentName: studentName?.trim() || "Student",
    studentEmail: studentEmail?.trim() || "",
    teacherId: assignment.teacherId,
    classId: assignment.classId,
    status: "in_progress",
    answers,
    totalAwardedMarks: 0,
    totalAvailableMarks: assignment.totalMarks,
    percentage: 0,
    overallFeedback: "",
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
    doc(db, "examSubmissions", createSubmissionId(assignmentId, studentId)),
  );

  if (!snapshot.exists()) return null;

  return convertSubmission(
    snapshot.id,
    snapshot.data() as FirestoreExamSubmission,
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
    createSubmissionId(assignmentId, studentId),
  );

  const snapshot = await getDoc(reference);

  if (
    snapshot.exists() &&
    ["submitted", "marking", "marked"].includes(snapshot.data().status)
  ) {
    throw new Error("This submission is locked.");
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
    createSubmissionId(assignmentId, studentId),
  );

  const snapshot = await getDoc(submissionReference);

  if (!snapshot.exists()) {
    throw new Error("Submission not found.");
  }

  const status = snapshot.data().status;

  if (status === "submitted" || status === "marking" || status === "marked") {
    return;
  }

  await updateDoc(submissionReference, {
    status: "submitted",
    submittedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getAssignmentSubmissions(
  assignmentId: string,
  teacherId: string,
): Promise<ExamSubmission[]> {
  const cleanedAssignmentId = assignmentId.trim();
  const cleanedTeacherId = teacherId.trim();

  if (!cleanedAssignmentId || !cleanedTeacherId) {
    return [];
  }

  const snapshot = await getDocs(
    query(
      collection(db, "examSubmissions"),
      where("assignmentId", "==", cleanedAssignmentId),
      where("teacherId", "==", cleanedTeacherId),
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
      first.studentName.localeCompare(second.studentName, "en-GB", {
        sensitivity: "base",
      }),
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
  const totalAwardedMarks = answers.reduce(
    (sum, answer) => sum + (answer.awardedMarks || 0),
    0,
  );

  await updateDoc(
    doc(db, "examSubmissions", createSubmissionId(assignmentId, studentId)),
    {
      answers,
      overallFeedback: overallFeedback.trim(),
      totalAwardedMarks,
      status: "marking",
      updatedAt: serverTimestamp(),
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
  const assignmentReference = doc(db, "examAssignments", assignmentId);

  const submissionReference = doc(
    db,
    "examSubmissions",
    createSubmissionId(assignmentId, studentId),
  );

  const totalAwardedMarks = answers.reduce(
    (sum, answer) => sum + (answer.awardedMarks ?? 0),
    0,
  );

  const safeAwardedMarks = Math.min(
    totalAvailableMarks,
    Math.max(0, totalAwardedMarks),
  );

  const percentage =
    totalAvailableMarks > 0
      ? Math.round((safeAwardedMarks / totalAvailableMarks) * 100)
      : 0;

  await runTransaction(db, async (transaction) => {
    /*
     * All reads must happen before any writes.
     */
    const [submissionSnapshot, assignmentSnapshot] = await Promise.all([
      transaction.get(submissionReference),
      transaction.get(assignmentReference),
    ]);

    if (!submissionSnapshot.exists()) {
      throw new Error("Submission not found.");
    }

    if (!assignmentSnapshot.exists()) {
      throw new Error("Assignment not found.");
    }

    const submissionData = submissionSnapshot.data();

    const assignmentData = assignmentSnapshot.data();

    const alreadyMarked = submissionData.status === "marked";

    /*
     * Writes begin only after every read has completed.
     */
    transaction.update(submissionReference, {
      answers,
      overallFeedback: overallFeedback.trim(),
      totalAwardedMarks: safeAwardedMarks,
      totalAvailableMarks,
      percentage,
      status: "marked",
      markedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    if (!alreadyMarked) {
      const currentMarkedCount =
        typeof assignmentData.markedCount === "number"
          ? assignmentData.markedCount
          : 0;

      const studentCount = Array.isArray(assignmentData.studentIds)
        ? assignmentData.studentIds.length
        : 0;

      transaction.update(assignmentReference, {
        markedCount: Math.min(currentMarkedCount + 1, studentCount),
        updatedAt: serverTimestamp(),
      });
    }
  });
}
