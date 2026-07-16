"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";

export type StudentAssignmentResult = {
  id: string;
  assignmentId: string;
  studentId: string;
  percentage: number;
  score: number;
  totalQuestions: number;
  earnedXP: number;
  status: string;
};

type UseStudentAssignmentResultsReturn = {
  results: StudentAssignmentResult[];
  loading: boolean;
};

export function useStudentAssignmentResults(): UseStudentAssignmentResultsReturn {
  const { user, loading: authLoading } = useAuth();

  const [results, setResults] = useState<StudentAssignmentResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setResults([]);
      setLoading(false);
      return;
    }

    const studentId = user.uid;

    const resultsQuery = query(
      collection(db, "assignmentResults"),
      where("studentId", "==", studentId)
    );

    const unsubscribe = onSnapshot(
      resultsQuery,
      (snapshot) => {
        const loadedResults: StudentAssignmentResult[] =
          snapshot.docs.map((resultDocument) => {
            const data = resultDocument.data();

            return {
              id: resultDocument.id,
              assignmentId: data.assignmentId || "",
              studentId: data.studentId || "",
              percentage:
                typeof data.percentage === "number"
                  ? data.percentage
                  : 0,
              score:
                typeof data.score === "number"
                  ? data.score
                  : 0,
              totalQuestions:
                typeof data.totalQuestions === "number"
                  ? data.totalQuestions
                  : 0,
              earnedXP:
                typeof data.earnedXP === "number"
                  ? data.earnedXP
                  : 0,
              status: data.status || "completed",
            };
          });

        setResults(loadedResults);
        setLoading(false);
      },
      (error) => {
        console.error(
          "Failed to load assignment results:",
          error
        );

        setResults([]);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [authLoading, user]);

  return {
    results,
    loading: authLoading || loading,
  };
}