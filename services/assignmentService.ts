import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type QuizAssignmentSource =
  | "built-in"
  | "ai-generated";

export type CreateAssignmentInput = {
  teacherId: string;
  classId: string;
  title: string;
  description: string;
  type: "lesson" | "quiz";
  resourceId: string;
  dueDate: string;
  quizSource?: QuizAssignmentSource;
};

export async function createAssignment({
  teacherId,
  classId,
  title,
  description,
  type,
  resourceId,
  dueDate,
  quizSource,
}: CreateAssignmentInput) {
  const assignmentRef = await addDoc(
    collection(db, "assignments"),
    {
      teacherId,
      classId,
      title,
      description,
      type,
      resourceId,
      dueDate,
      ...(type === "quiz"
        ? {
            quizSource:
              quizSource || "built-in",
          }
        : {}),
      status: "active",
      createdAt: serverTimestamp(),
    },
  );

  await updateDoc(
    doc(db, "classes", classId),
    {
      assignmentIds: arrayUnion(
        assignmentRef.id,
      ),
    },
  );

  return assignmentRef.id;
}