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
  deliveryMode,
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

            deliveryMode:
              deliveryMode || "practice",
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