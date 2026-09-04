import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type QuizAssignmentSource =
  | "built-in"
  | "ai-generated";

export type QuizDeliveryMode =
  | "practice"
  | "assessment";

export type CreateAssignmentInput = {
  teacherId: string;
  classId: string;
  title: string;
  description: string;
  type: "lesson" | "quiz";
  resourceId: string;
  dueDate: string;

  quizSource?: QuizAssignmentSource;
  deliveryMode?: QuizDeliveryMode;

  /*
   * Quiz curriculum identity.
   *
   * These fields preserve the curriculum selected by the teacher
   * when the assignment is created. They allow the secure quiz
   * route to resolve the exact assigned quiz instead of incorrectly
   * using the student's normal browsing curriculum.
   */
  qualification?: "GCSE" | "A_LEVEL";
  examBoard?: string;

  studentIds?: string[];
};

function uniqueIds(values: string[]): string[] {
  return Array.from(
    new Set(
      values
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

function parseDueDate(value: string): Date {
  const cleaned = value.trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
    throw new Error("Select a valid due date.");
  }

  const parsed = new Date(`${cleaned}T23:59:59`);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Select a valid due date.");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (parsed.getTime() < today.getTime()) {
    throw new Error("The due date cannot be in the past.");
  }

  return parsed;
}

export async function createAssignment({
  teacherId,
  classId,
  title,
  description,
  type,
  resourceId,
  dueDate,
  quizSource,
  deliveryMode,
  qualification,
  examBoard,
  studentIds,
}: CreateAssignmentInput) {
  const cleanedTeacherId = teacherId.trim();
  const cleanedClassId = classId.trim();
  const cleanedTitle = title.trim();
  const cleanedDescription = description.trim();
  const cleanedResourceId = resourceId.trim();
  const cleanedStudentIds = uniqueIds(studentIds ?? []);
  const cleanedExamBoard =
    typeof examBoard === "string"
      ? examBoard.trim()
      : "";

  if (!cleanedTeacherId) {
    throw new Error("A valid teacher account is required.");
  }

  if (!cleanedClassId) {
    throw new Error("Select a class before assigning this work.");
  }

  if (!cleanedTitle) {
    throw new Error("The assignment needs a title.");
  }

  if (!cleanedResourceId) {
    throw new Error("Choose a valid assignment resource.");
  }

  parseDueDate(dueDate);

  const classSnapshot = await getDoc(
    doc(db, "classes", cleanedClassId),
  );

  if (!classSnapshot.exists()) {
    throw new Error("The selected class could not be found.");
  }

  const classData = classSnapshot.data();
  const classTeacherId =
    typeof classData.teacherId === "string"
      ? classData.teacherId.trim()
      : "";

  if (classTeacherId !== cleanedTeacherId) {
    throw new Error("You cannot assign work to another teacher's class.");
  }

  const enrolledStudentIds = uniqueIds(
    Array.isArray(classData.studentIds)
      ? classData.studentIds.filter(
          (value: unknown): value is string =>
            typeof value === "string",
        )
      : [],
  );

  if (enrolledStudentIds.length === 0) {
    throw new Error("The selected class has no enrolled students.");
  }

  const recipients =
    cleanedStudentIds.length > 0
      ? cleanedStudentIds.filter((studentId) =>
          enrolledStudentIds.includes(studentId),
        )
      : enrolledStudentIds;

  if (recipients.length === 0) {
    throw new Error(
      "None of the selected students are enrolled in this class.",
    );
  }

  if (
    cleanedStudentIds.length > 0 &&
    recipients.length !== cleanedStudentIds.length
  ) {
    throw new Error(
      "One or more selected students are no longer enrolled in this class. Refresh the recipients and try again.",
    );
  }

  if (type === "quiz" && quizSource === "ai-generated") {
    const generatedQuizSnapshot = await getDoc(
      doc(db, "generatedQuizzes", cleanedResourceId),
    );

    if (!generatedQuizSnapshot.exists()) {
      throw new Error("The selected AI quiz could not be found.");
    }

    const generatedQuiz = generatedQuizSnapshot.data();
    const ownerId =
      typeof generatedQuiz.teacherId === "string"
        ? generatedQuiz.teacherId.trim()
        : "";

    if (ownerId !== cleanedTeacherId) {
      throw new Error("You cannot assign another teacher's AI quiz.");
    }
  }

  const assignmentRef = await addDoc(
    collection(db, "assignments"),
    {
      teacherId: cleanedTeacherId,
      classId: cleanedClassId,
      title: cleanedTitle,
      description: cleanedDescription,
      type,
      resourceId: cleanedResourceId,
      dueDate: dueDate.trim(),

      studentIds: recipients,
      studentCount: recipients.length,

      ...(type === "quiz"
        ? {
            quizSource:
              quizSource || "built-in",

            deliveryMode:
              deliveryMode || "practice",

            ...(qualification
              ? { qualification }
              : {}),

            ...(cleanedExamBoard
              ? { examBoard: cleanedExamBoard }
              : {}),
          }
        : {}),

      status: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  );

  await updateDoc(
    doc(db, "classes", cleanedClassId),
    {
      assignmentIds: arrayUnion(
        assignmentRef.id,
      ),
      updatedAt: serverTimestamp(),
    },
  );

  return assignmentRef.id;
}
