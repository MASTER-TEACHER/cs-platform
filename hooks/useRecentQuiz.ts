"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

export interface RecentQuiz {
  id: string;
  title: string;
  scorePercent: number;
  earnedXP: number;
  correctCount: number;
  totalQuestions: number;
}

export function useRecentQuiz() {
  const { user } = useAuth();

  const [quiz, setQuiz] = useState<RecentQuiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuiz() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const quizQuery = query(
          collection(db, "users", user.uid, "quizResults"),
          orderBy("createdAt", "desc"),
          limit(1)
        );

        const snapshot = await getDocs(quizQuery);

        if (!snapshot.empty) {
          const doc = snapshot.docs[0];

          setQuiz({
            id: doc.id,
            ...(doc.data() as Omit<RecentQuiz, "id">),
          });
        }
      } catch (error) {
        console.error("Failed to load recent quiz:", error);
      } finally {
        setLoading(false);
      }
    }

    loadQuiz();
  }, [user]);

  return { quiz, loading };
}