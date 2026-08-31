"use client";

import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { getCurriculumCoverage } from "@/services/curriculumCoverageService";
import { normaliseTopic } from "@/services/topicNormalisationService";

export interface RecentQuiz {
  id: string;
  title: string;
  topicId?: string;
  scorePercent: number;
  earnedXP: number;
  correctCount: number;
  totalQuestions: number;
}

function safeNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : 0;
}

function safeString(value: unknown): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

export function useRecentQuiz() {
  const { user, profile } = useAuth();

  const [quiz, setQuiz] = useState<RecentQuiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadQuiz() {
      if (
        !user ||
        !profile ||
        profile.role !== "student" ||
        !profile.qualification ||
        !profile.examBoard
      ) {
        if (!cancelled) {
          setQuiz(null);
          setLoading(false);
        }

        return;
      }

      setLoading(true);

      try {
        const coverage = getCurriculumCoverage(
          profile.qualification,
          profile.examBoard,
        );

        const allowedTopicKeys = new Set<string>();

        coverage?.units.forEach((unitCoverage) => {
          unitCoverage.topics.forEach((topic) => {
            allowedTopicKeys.add(
              normaliseTopic(topic.id).topicId,
            );

            allowedTopicKeys.add(
              normaliseTopic(topic.title).topicId,
            );
          });
        });

        const snapshot = await getDocs(
          query(
            collection(
              db,
              "users",
              user.uid,
              "quizResults",
            ),
            orderBy("createdAt", "desc"),
            limit(30),
          ),
        );

        const match = snapshot.docs.find((document) => {
          const data = document.data();

          const topicValue =
            safeString(data.topicId) ||
            safeString(data.topic) ||
            safeString(data.topicTitle) ||
            safeString(data.title);

          if (!topicValue) {
            return false;
          }

          return allowedTopicKeys.has(
            normaliseTopic(topicValue).topicId,
          );
        });

        if (cancelled) {
          return;
        }

        if (!match) {
          setQuiz(null);
          return;
        }

        const data = match.data();

        setQuiz({
          id: match.id,
          title:
            safeString(data.title) ||
            "Completed quiz",
          topicId:
            safeString(data.topicId) ||
            undefined,
          scorePercent:
            safeNumber(data.scorePercent),
          earnedXP:
            safeNumber(data.earnedXP),
          correctCount:
            safeNumber(data.correctCount),
          totalQuestions:
            safeNumber(data.totalQuestions),
        });
      } catch (error) {
        console.error(
          "Failed to load current-curriculum recent quiz:",
          error,
        );

        if (!cancelled) {
          setQuiz(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadQuiz();

    return () => {
      cancelled = true;
    };
  }, [user, profile]);

  return {
    quiz,
    loading,
  };
}