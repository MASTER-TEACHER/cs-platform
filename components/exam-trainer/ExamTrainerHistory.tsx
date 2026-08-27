"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Card from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";
import { getExamTrainerHistory } from "@/services/examTrainerAttemptService";
import type { ExamTrainerHistoryItem } from "@/types/examTrainer";

function formatDate(value: Date | null): string {
  if (!value) return "Not submitted";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

export default function ExamTrainerHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<ExamTrainerHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    if (!user) {
      void Promise.resolve().then(() => {
        if (!active) return;
        setHistory([]);
        setError("");
        setLoading(false);
      });

      return () => {
        active = false;
      };
    }

    const userId = user.uid;

    void Promise.resolve()
      .then(() => {
        if (!active) return null;

        setLoading(true);
        setError("");

        return getExamTrainerHistory(userId);
      })
      .then((items) => {
        if (active && items) {
          setHistory(items);
        }
      })
      .catch((loadError) => {
        console.error("Exam trainer history error:", loadError);

        if (active) {
          setError("Your saved exam history could not be loaded.");
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
  }, [user]);

  if (loading) {
    return (
      <Card>
        <p className="py-16 text-center font-bold text-slate-500">
          Loading exam history...
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-7">
      <Card className="border-0 bg-gradient-to-r from-slate-950 to-indigo-900 text-white">
        <p className="text-sm font-black uppercase tracking-widest text-blue-200">
          Saved assessment evidence
        </p>
        <h1 className="mt-3 text-4xl font-black">Exam Trainer History</h1>
        <p className="mt-3 text-blue-100">
          Review completed papers, grades and recurring priority topics.
        </p>
      </Card>

      {error && (
        <Card>
          <p className="font-bold text-rose-700">{error}</p>
        </Card>
      )}

      {history.length === 0 ? (
        <Card>
          <div className="py-16 text-center">
            <div className="text-6xl">📝</div>
            <h2 className="mt-5 text-2xl font-black">No completed exams yet</h2>
            <Link
              href="/exam-trainer"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-black text-white"
            >
              Start an exam →
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-5">
          {history.map((attempt) => (
            <Card key={attempt.id}>
              <div className="grid gap-5 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
                <div>
                  <p className="text-sm font-black uppercase text-blue-600">
                    {attempt.selectedTopic === "all"
                      ? "Mixed Topics"
                      : attempt.selectedTopic}
                  </p>
                  <h2 className="mt-2 text-xl font-black">
                    {formatDate(attempt.submittedAt)}
                  </h2>
                  <p className="mt-1 text-sm capitalize text-slate-500">
                    {attempt.selectedDifficulty} · {attempt.questionCount}{" "}
                    questions
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-slate-500">
                    Score
                  </p>
                  <p className="mt-1 text-2xl font-black">
                    {attempt.totalAwardedMarks}/{attempt.totalAvailableMarks}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-slate-500">
                    Percentage
                  </p>
                  <p className="mt-1 text-2xl font-black text-blue-700">
                    {attempt.percentage}%
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-slate-500">
                    Grade
                  </p>
                  <p className="mt-1 text-3xl font-black text-indigo-700">
                    {attempt.grade}
                  </p>
                </div>
              </div>

              {attempt.priorityTopics.length > 0 && (
                <div className="mt-5 rounded-2xl bg-amber-50 p-4">
                  <p className="text-sm font-black text-amber-950">
                    Priority topics: {attempt.priorityTopics.join(", ")}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
