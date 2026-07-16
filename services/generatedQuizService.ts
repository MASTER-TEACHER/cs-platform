import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type GeneratedQuizQuestion = {
  id: string;
  type: "multipleChoice";
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  xpReward: number;
};

export type SaveGeneratedQuizInput = {
  teacherId: string;
  title: string;
  description: string;
  topicId: string;
  qualification: string;
  examBoard: string;
  difficulty: "foundation" | "standard" | "higher";
  estimatedTime: string;
  questions: GeneratedQuizQuestion[];
};

export async function saveGeneratedQuiz({
  teacherId,
  title,
  description,
  topicId,
  qualification,
  examBoard,
  difficulty,
  estimatedTime,
  questions,
}: SaveGeneratedQuizInput) {
  const quizReference = await addDoc(collection(db, "generatedQuizzes"), {
    teacherId,
    title,
    description,
    topicId,
    qualification,
    examBoard,
    difficulty,
    estimatedTime,
    questions,
    questionCount: questions.length,
    status: "draft",
    source: "ai",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return quizReference.id;
}