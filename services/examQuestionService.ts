import {
  addDoc,
  collection,
  deleteDoc,
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
import type { GeneratedExamQuestionSet } from "@/types/examQuestion";

export type SavedExamQuestionSet = {
  id: string;
  teacherId: string;
  title: string;
  topic: string;
  qualification: string;
  examBoard: string;
  difficulty: string;
  questionCount: number;
  totalMarks: number;
  content: GeneratedExamQuestionSet;
  status: "draft" | "published";
  createdAt: Date | null;
  updatedAt: Date | null;
};

type FirestoreExamQuestionSet = Omit<
  SavedExamQuestionSet,
  "id" | "createdAt" | "updatedAt"
> & {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

const COLLECTION_NAME = "examQuestionSets";

function timestampToDate(value: unknown): Date | null {
  return value instanceof Timestamp ? value.toDate() : null;
}

export async function saveExamQuestionSet(
  teacherId: string,
  questionSet: GeneratedExamQuestionSet,
): Promise<string> {
  if (!teacherId.trim()) {
    throw new Error("A signed-in teacher is required.");
  }

  const documentReference = await addDoc(collection(db, COLLECTION_NAME), {
    teacherId,
    title: questionSet.title,
    topic: questionSet.topic,
    qualification: questionSet.qualification,
    examBoard: questionSet.examBoard,
    difficulty: questionSet.difficulty,
    questionCount: questionSet.questionCount,
    totalMarks: questionSet.totalMarks,
    content: questionSet,
    status: "draft",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return documentReference.id;
}

export async function getTeacherExamQuestionSets(
  teacherId: string,
): Promise<SavedExamQuestionSet[]> {
  if (!teacherId.trim()) {
    return [];
  }

  const snapshot = await getDocs(
    query(
      collection(db, COLLECTION_NAME),
      where("teacherId", "==", teacherId),
      orderBy("createdAt", "desc"),
    ),
  );

  return snapshot.docs.map((questionSetDocument) => {
    const data = questionSetDocument.data() as FirestoreExamQuestionSet;

    return {
      id: questionSetDocument.id,
      teacherId: data.teacherId,
      title: data.title,
      topic: data.topic,
      qualification: data.qualification,
      examBoard: data.examBoard,
      difficulty: data.difficulty,
      questionCount: data.questionCount,
      totalMarks: data.totalMarks,
      content: data.content,
      status: data.status,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    };
  });
}

export async function getExamQuestionSetById(
  questionSetId: string,
): Promise<SavedExamQuestionSet | null> {
  if (!questionSetId.trim()) {
    return null;
  }

  const snapshot = await getDoc(doc(db, COLLECTION_NAME, questionSetId));

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as FirestoreExamQuestionSet;

  return {
    id: snapshot.id,
    teacherId: data.teacherId,
    title: data.title,
    topic: data.topic,
    qualification: data.qualification,
    examBoard: data.examBoard,
    difficulty: data.difficulty,
    questionCount: data.questionCount,
    totalMarks: data.totalMarks,
    content: data.content,
    status: data.status,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  };
}

export async function updateExamQuestionSetStatus(
  questionSetId: string,
  status: "draft" | "published",
): Promise<void> {
  await updateDoc(doc(db, COLLECTION_NAME, questionSetId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteExamQuestionSet(
  questionSetId: string,
): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, questionSetId));
}