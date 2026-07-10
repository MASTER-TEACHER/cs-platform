import {
  addDoc,
  collection,
  doc,
  increment,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type SaveQuizResultParams = {
  uid: string;
  quizId: string;
  topicId: string;
  title: string;
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  earnedXP: number;
};

export async function saveQuizResult({
  uid,
  quizId,
  topicId,
  title,
  scorePercent,
  correctCount,
  totalQuestions,
  earnedXP,
}: SaveQuizResultParams) {
  const userRef = doc(db, "users", uid);

  await addDoc(collection(db, "users", uid, "quizResults"), {
    quizId,
    topicId,
    title,
    scorePercent,
    correctCount,
    totalQuestions,
    earnedXP,
    createdAt: serverTimestamp(),
  });

  await updateDoc(userRef, {
    xp: increment(earnedXP),
  });
}