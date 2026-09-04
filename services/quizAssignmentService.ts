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

export type QuizAssignmentStatus =
  | "not_started"
  | "completed";

export type QuizAssignmentSource =
  | "built-in"
  | "ai-generated";

export type StudentQuizAssignment = {
  id: string;
  teacherId: string;
  classId: string;
  title: string;
  description: string;
  resourceId: string;
  type: "quiz";
  quizSource: QuizAssignmentSource;
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

type FirestoreDate =
  | Timestamp
  | Date
  | string
  | null
  | undefined;

function convertDate(
  value: FirestoreDate,
): Date | null {
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
    const parsedDate =
      new Date(value);

    return Number.isNaN(
      parsedDate.getTime(),
    )
      ? null
      : parsedDate;
  }

  return null;
}

function normaliseQuizSource(
  value: unknown,
): QuizAssignmentSource {
  return value === "ai-generated"
    ? "ai-generated"
    : "built-in";
}

/*
 * ------------------------------------------------------------
 * STUDENT QUIZ ASSIGNMENTS
 * ------------------------------------------------------------
 *
 * The assignment document itself is now the source of truth
 * for student targeting.
 *
 * New CS Master assignments persist:
 *
 *   studentIds: [...]
 *
 * Therefore we query directly by the authenticated student's
 * UID.
 *
 * IMPORTANT:
 * - no dependency on users/{uid}.classIds
 * - no legacy classId "in" query
 * - no class-wide Firestore query
 * - no composite index required for assignment discovery
 *
 * This matches the same targeted-recipient model used by
 * lessons, resources, programming assignments and exams.
 */
export async function getStudentQuizAssignments(
  studentId: string,
): Promise<StudentQuizAssignment[]> {
  const cleanedStudentId =
    studentId.trim();

  if (!cleanedStudentId) {
    return [];
  }

  /*
   * Query only documents whose explicit recipient list
   * contains this student.
   *
   * Do NOT add type == "quiz" here. Filtering type on the
   * client avoids requiring another composite Firestore index
   * and the studentIds condition already constrains access.
   */
  const assignmentSnapshot =
    await getDocs(
      query(
        collection(
          db,
          "assignments",
        ),
        where(
          "studentIds",
          "array-contains",
          cleanedStudentId,
        ),
      ),
    );

  const quizDocuments =
    assignmentSnapshot.docs.filter(
      (assignmentDocument) => {
        const data =
          assignmentDocument.data();

        return (
          data.type === "quiz" &&
          data.status !== "cancelled" &&
          typeof data.resourceId ===
            "string" &&
          Boolean(
            data.resourceId.trim(),
          )
        );
      },
    );

  const assignments =
    await Promise.all(
      quizDocuments.map(
        async (
          assignmentDocument,
        ) => {
          const assignment =
            assignmentDocument.data();

          const assignmentId =
            assignmentDocument.id;

          const resultId =
            `${assignmentId}_${cleanedStudentId}`;

          /*
           * Result and class metadata are useful but are NOT
           * allowed to make the assignment disappear.
           *
           * If either optional read fails, the assignment is
           * still returned as Not Started with safe fallback
           * metadata.
           */
          let result:
            | Record<
                string,
                unknown
              >
            | null = null;

          let classData:
            | Record<
                string,
                unknown
              >
            | null = null;

          try {
            const resultSnapshot =
              await getDoc(
                doc(
                  db,
                  "assignmentResults",
                  resultId,
                ),
              );

            if (
              resultSnapshot.exists()
            ) {
              result =
                resultSnapshot.data();
            }
          } catch (error) {
            console.warn(
              "[Quiz assignments] Result metadata unavailable:",
              assignmentId,
              error,
            );
          }

          const classId =
            typeof assignment.classId ===
              "string"
              ? assignment.classId.trim()
              : "";

          if (classId) {
            try {
              const classSnapshot =
                await getDoc(
                  doc(
                    db,
                    "classes",
                    classId,
                  ),
                );

              if (
                classSnapshot.exists()
              ) {
                classData =
                  classSnapshot.data();
              }
            } catch (error) {
              console.warn(
                "[Quiz assignments] Class metadata unavailable:",
                assignmentId,
                error,
              );
            }
          }

          const completed =
            result?.status ===
            "completed";

          return {
            id:
              assignmentId,

            teacherId:
              typeof assignment.teacherId ===
              "string"
                ? assignment.teacherId
                : "",

            classId,

            title:
              typeof assignment.title ===
                "string" &&
              assignment.title.trim()
                ? assignment.title
                : "Untitled Quiz",

            description:
              typeof assignment.description ===
              "string"
                ? assignment.description
                : "",

            resourceId:
              typeof assignment.resourceId ===
              "string"
                ? assignment.resourceId
                : "",

            type:
              "quiz" as const,

            quizSource:
              normaliseQuizSource(
                assignment.quizSource,
              ),

            dueDate:
              convertDate(
                assignment.dueDate as FirestoreDate,
              ),

            createdAt:
              convertDate(
                assignment.createdAt as FirestoreDate,
              ),

            status:
              typeof assignment.status ===
              "string"
                ? assignment.status
                : "active",

            className:
              typeof classData?.name ===
                "string" &&
              classData.name.trim()
                ? classData.name
                : "Assigned class",

            teacherName:
              typeof assignment.teacherName ===
                "string" &&
              assignment.teacherName.trim()
                ? assignment.teacherName
                : "Teacher",

            resultStatus:
              completed
                ? "completed"
                : "not_started",

            score:
              typeof result?.score ===
              "number"
                ? result.score
                : 0,

            totalQuestions:
              typeof result?.totalQuestions ===
              "number"
                ? result.totalQuestions
                : 0,

            percentage:
              typeof result?.percentage ===
              "number"
                ? result.percentage
                : 0,

            earnedXP:
              typeof result?.earnedXP ===
              "number"
                ? result.earnedXP
                : 0,

            timeTakenSeconds:
              typeof result?.timeTakenSeconds ===
              "number"
                ? result.timeTakenSeconds
                : 0,

            completedAt:
              convertDate(
                result?.completedAt as
                  FirestoreDate,
              ),
          } satisfies StudentQuizAssignment;
        },
      ),
    );

  return assignments.sort(
    (
      first,
      second,
    ) => {
      const firstDueDate =
        first.dueDate?.getTime() ??
        Number.MAX_SAFE_INTEGER;

      const secondDueDate =
        second.dueDate?.getTime() ??
        Number.MAX_SAFE_INTEGER;

      if (
        firstDueDate !==
        secondDueDate
      ) {
        return (
          firstDueDate -
          secondDueDate
        );
      }

      const firstCreatedAt =
        first.createdAt?.getTime() ??
        0;

      const secondCreatedAt =
        second.createdAt?.getTime() ??
        0;

      return (
        secondCreatedAt -
        firstCreatedAt
      );
    },
  );
}