"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

import ExamTrainerReportView from "@/components/exam-trainer/ExamTrainerReportView";
import Card from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";
import { getExamTrainerAttempt } from "@/services/examTrainerAttemptService";
import type { ExamTrainerAttempt } from "@/types/examTrainer";

type Props = {
  params: Promise<{
    attemptId: string;
  }>;
};

export default function ExamTrainerAttemptReportPage({
  params,
}: Props) {
  const { attemptId } = use(params);
  const { user } = useAuth();

  const [attempt, setAttempt] =
    useState<ExamTrainerAttempt | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    if (!user) {
      void Promise.resolve().then(() => {
        if (!active) return;

        setAttempt(null);
        setError("Please sign in to view this exam report.");
        setLoading(false);
      });

      return () => {
        active = false;
      };
    }

    const userId = user.uid;

    void getExamTrainerAttempt(attemptId)
      .then((savedAttempt) => {
        if (!active) return;

        if (!savedAttempt) {
          setError("This exam report could not be found.");
          return;
        }

        if (savedAttempt.studentId !== userId) {
          setError(
            "You do not have permission to view this exam report.",
          );
          return;
        }

        if (
          savedAttempt.status !== "submitted" ||
          !savedAttempt.report
        ) {
          setError(
            "This exam has not been submitted and marked yet.",
          );
          return;
        }

        setAttempt(savedAttempt);
      })
      .catch((loadError) => {
        console.error(
          "Exam Trainer report load error:",
          loadError,
        );

        if (active) {
          setError(
            "The saved examiner report could not be loaded.",
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [attemptId, user]);

  if (loading) {
    return (
      <Card>
        <p className="py-20 text-center font-bold text-slate-500">
          Loading examiner report...
        </p>
      </Card>
    );
  }

  if (error || !attempt || !attempt.report) {
    return (
      <div className="space-y-5">
        <Card>
          <div className="py-14 text-center">
            <div className="text-5xl">📝</div>

            <h1 className="mt-5 text-2xl font-black">
              Report unavailable
            </h1>

            <p className="mt-3 text-slate-600">
              {error || "This report could not be loaded."}
            </p>
          </div>
        </Card>

        <Link
          href="/exam-trainer/history"
          className="inline-flex rounded-xl bg-blue-600 px-5 py-3 font-black text-white"
        >
          ← Back to exam history
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/exam-trainer/history"
          className="inline-flex rounded-xl border border-slate-300 px-4 py-2 font-black"
        >
          ← Back to exam history
        </Link>
      </div>

      <ExamTrainerReportView
        questions={attempt.questions}
        answers={attempt.answers}
        report={attempt.report}
        showActions={false}
      />

      <div className="flex flex-wrap gap-3">
        <Link
          href="/exam-trainer"
          className="rounded-xl bg-blue-600 px-6 py-4 font-black text-white"
        >
          Start another exam
        </Link>

        <Link
          href="/exam-trainer/history"
          className="rounded-xl border border-slate-300 px-6 py-4 font-black"
        >
          Back to exam history
        </Link>
      </div>
    </div>
  );
}