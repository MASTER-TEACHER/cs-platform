import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type QuizAssignmentStatus = "not_started" | "completed";

export type StudentQuizAssignment = {
  id: string;

  teacherId: string;
  classId: string;

  title: string;
  description: string;

  resourceId: string;
  type: "quiz";

  dueDate: Date | null;
  createdAt: Date | null;

  status: string;

  className: string;
  teacherName: string;

  resultStatus: QuizAssignmentStatus;

  score: number;
  totalQuestions: number;
  percentage: number;
  earnedXP: number;
  timeTakenSeconds: number;

  completedAt: Date | null;
};

type FirestoreDate = Timestamp | Date | string | null | undefined;

function convertDate(value: FirestoreDate): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  if (value instanceof Timestamp) {
    return value.toDate();
  }

  if (typeof value === "string") {
    const parsedDate = new Date(value);

    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  return null;
}

function removeDuplicateIds(values: string[]): string[] {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean)),
  );
}

async function getStudentClassIds(studentId: string): Promise<string[]> {
  const userSnapshot = await getDoc(doc(db, "users", studentId));

  if (!userSnapshot.exists()) {
    return [];
  }

  const data = userSnapshot.data();

  if (!Array.isArray(data.classIds)) {
    return [];
  }

  return removeDuplicateIds(
    data.classIds.filter((value): value is string => typeof value === "string"),
  );
}

function splitIntoChunks(values: string[], chunkSize: number): string[][] {
  const chunks: string[][] = [];

  for (let index = 0; index < values.length; index += chunkSize) {
    chunks.push(values.slice(index, index + chunkSize));
  }

  return chunks;
}

export async function getStudentQuizAssignments(
  studentId: string,
): Promise<StudentQuizAssignment[]> {
  const cleanedStudentId = studentId.trim();

  if (!cleanedStudentId) {
    return [];
  }

  const classIds = await getStudentClassIds(cleanedStudentId);

  if (classIds.length === 0) {
    return [];
  }

  /*
   * Firestore limits the number of values allowed
   * in an "in" query, so class IDs are processed
   * in smaller groups.
   */
  const classIdChunks = splitIntoChunks(classIds, 30);

  const assignmentSnapshots = await Promise.all(
    classIdChunks.map((chunk) =>
      getDocs(
        query(
          collection(db, "assignments"),
          where("classId", "in", chunk),
          where("type", "==", "quiz"),
        ),
      ),
    ),
  );

  const assignmentDocuments = assignmentSnapshots.flatMap(
    (snapshot) => snapshot.docs,
  );

  const uniqueAssignmentDocuments = Array.from(
    new Map(
      assignmentDocuments.map((assignmentDocument) => [
        assignmentDocument.id,
        assignmentDocument,
      ]),
    ).values(),
  );

  const loadedAssignments = await Promise.all(
    uniqueAssignmentDocuments.map(async (assignmentDocument) => {
      const assignment = assignmentDocument.data();

      const assignmentId = assignmentDocument.id;

      const resultId = `${assignmentId}_${cleanedStudentId}`;

      const resultReference = doc(db, "assignmentResults", resultId);

      const classReference =
        typeof assignment.classId === "string" && assignment.classId.trim()
          ? doc(db, "classes", assignment.classId)
          : null;

      const [resultSnapshot, classSnapshot] = await Promise.all([
        getDoc(resultReference),

        classReference ? getDoc(classReference) : Promise.resolve(null),
      ]);

      const result = resultSnapshot.exists() ? resultSnapshot.data() : null;

      const classData = classSnapshot?.exists() ? classSnapshot.data() : null;

      const completed = result?.status === "completed";

      return {
        id: assignmentId,

        teacherId:
          typeof assignment.teacherId === "string" ? assignment.teacherId : "",

        classId:
          typeof assignment.classId === "string" ? assignment.classId : "",

        title:
          typeof assignment.title === "string" && assignment.title.trim()
            ? assignment.title
            : "Untitled Quiz",

        description:
          typeof assignment.description === "string"
            ? assignment.description
            : "",

        resourceId:
          typeof assignment.resourceId === "string"
            ? assignment.resourceId
            : "",

        type: "quiz" as const,

        dueDate: convertDate(assignment.dueDate),

        createdAt: convertDate(assignment.createdAt),

        status:
          typeof assignment.status === "string" ? assignment.status : "active",

        className:
          typeof classData?.name === "string" && classData.name.trim()
            ? classData.name
            : "Assigned class",

        /*
         * Students are not permitted to read another
         * user's profile under the current Firestore
         * rules, so no teacher profile read is made.
         */
        teacherName: "Teacher",

        resultStatus: completed ? "completed" : "not_started",

        score: typeof result?.score === "number" ? result.score : 0,

        totalQuestions:
          typeof result?.totalQuestions === "number"
            ? result.totalQuestions
            : 0,

        percentage:
          typeof result?.percentage === "number" ? result.percentage : 0,

        earnedXP: typeof result?.earnedXP === "number" ? result.earnedXP : 0,

        timeTakenSeconds:
          typeof result?.timeTakenSeconds === "number"
            ? result.timeTakenSeconds
            : 0,

        completedAt: convertDate(result?.completedAt),
      } satisfies StudentQuizAssignment;
    }),
  );

  return loadedAssignments
    .filter(
      (assignment) =>
        assignment.status !== "cancelled" &&
        Boolean(assignment.resourceId.trim()),
    )
    .sort((first, second) => {
      const firstDueDate = first.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER;

      const secondDueDate =
        second.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER;

      if (firstDueDate !== secondDueDate) {
        return firstDueDate - secondDueDate;
      }

      const firstCreatedAt = first.createdAt?.getTime() ?? 0;

      const secondCreatedAt = second.createdAt?.getTime() ?? 0;

      return secondCreatedAt - firstCreatedAt;
    });
}
