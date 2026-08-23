"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import {
  getTeacherExamQuestionSets,
  type SavedExamQuestionSet,
} from "@/services/examQuestionService";

export default function QuestionBankPage() {
  const { user } = useAuth();

  const [questionSets, setQuestionSets] = useState<SavedExamQuestionSet[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!user?.uid) {
        return;
      }

      try {
        setQuestionSets(await getTeacherExamQuestionSets(user.uid));
      } catch (caughtError) {
        console.error("Load question bank error:", caughtError);

        setError("The Question Bank could not be loaded.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-52 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-indigo-800 to-violet-800 text-white">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-indigo-100">
              Teacher assessment library
            </p>

            <h1 className="mt-2 text-4xl font-black">Question Bank</h1>

            <p className="mt-3 text-indigo-100">
              Review and manage your original exam-style question sets.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/teacher/content" className="rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-center font-bold text-white">
              Content Hub
            </Link>
            <Link
              href="/teacher/exam-question-generator"
              className="rounded-xl bg-white px-5 py-3 text-center font-bold text-indigo-800"
            >
              Generate Questions
            </Link>
          </div>
        </div>
      </Card>

      {error && (
        <Card className="border border-red-200 bg-red-50">
          <p className="font-bold text-red-800">{error}</p>
        </Card>
      )}

      {questionSets.length === 0 ? (
        <Card>
          <h2 className="text-2xl font-black text-slate-950">
            No question sets yet
          </h2>

          <p className="mt-3 text-slate-600">
            Generate and save your first original exam-style question set.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {questionSets.map((questionSet) => (
            <Card key={questionSet.id}>
              <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">
                {questionSet.examBoard}-style
              </p>

              <h2 className="mt-2 text-xl font-black text-slate-950">
                {questionSet.title}
              </h2>

              <p className="mt-3 text-sm text-slate-600">
                {questionSet.questionCount} questions · {questionSet.totalMarks}{" "}
                marks
              </p>

              <Link
                href={`/teacher/question-bank/${questionSet.id}`}
                className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white"
              >
                Open Question Set
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
