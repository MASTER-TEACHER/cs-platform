import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  AdaptiveEvidence,
} from "@/types/adaptiveLearning";

type ExamTrainerResultDocument = {
  attemptId?: string;
  topic?: string;

  scorePercent?: number;
  percentage?: number;

  topicScores?: {
    topic?: string;
    percentage?: number;
  }[];

  completedAt?: Timestamp | null;
  createdAt?: Timestamp | null;
};

export async function getExamTrainerAdaptiveEvidence(
  studentId: string,
): Promise<AdaptiveEvidence[]> {
  const snapshot =
    await getDocs(
      query(
        collection(
          db,
          "users",
          studentId,
          "examTrainerResults",
        ),
        orderBy(
          "createdAt",
          "desc",
        ),
      ),
    );

  const evidence:
    AdaptiveEvidence[] = [];

  snapshot.docs.forEach(
    (document) => {
      const data =
        document.data() as
          ExamTrainerResultDocument;

      const completedAt =
        data.completedAt instanceof
        Timestamp
          ? data.completedAt.toDate()
          : data.createdAt instanceof
              Timestamp
            ? data.createdAt.toDate()
            : null;

      if (
        Array.isArray(
          data.topicScores,
        ) &&
        data.topicScores.length >
          0
      ) {
        data.topicScores.forEach(
          (
            topicScore,
            index,
          ) => {
            if (
              !topicScore.topic
            ) {
              return;
            }

            evidence.push({
              id:
                `exam-trainer-${document.id}-${index}`,

              topic:
                topicScore.topic,

              source:
                "exam",

              /*
               * Exam Trainer completion is an independent
               * assessment attempt, so it is allowed to
               * contribute directly to mastery.
               */
              mode:
                "independent",

              score:
                typeof topicScore.percentage ===
                "number"
                  ? topicScore.percentage
                  : 0,

              completedAt,

              weight:
                1.25,
            });
          },
        );

        return;
      }

      evidence.push({
        id:
          `exam-trainer-${document.id}`,

        topic:
          data.topic ||
          "Mixed Topics",

        source:
          "exam",

        mode:
          "independent",

        score:
          typeof data.scorePercent ===
          "number"
            ? data.scorePercent
            : typeof data.percentage ===
                "number"
              ? data.percentage
              : 0,

        completedAt,

        weight:
          1.25,
      });
    },
  );

  return evidence;
}