"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import AssignExamModal from "@/components/teacher/exam-assignments/AssignExamModal";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import {
  getExamQuestionSetById,
  type SavedExamQuestionSet,
} from "@/services/examQuestionService";

export default function QuestionSetPage() {
  const params = useParams<{
    questionSetId: string;
  }>();

  const router = useRouter();

  const [questionSet, setQuestionSet] = useState<SavedExamQuestionSet | null>(
    null,
  );

  const [loading, setLoading] = useState(true);

  const [showAssign, setShowAssign] = useState(false);

  useEffect(() => {
    async function load() {
      const result = await getExamQuestionSetById(params.questionSetId);

      setQuestionSet(result);
      setLoading(false);
    }

    void load();
  }, [params.questionSetId]);

  if (loading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!questionSet) {
    return (
      <Card>
        <h1 className="text-2xl font-black">Question set not found</h1>

        <Link
          href="/teacher/question-bank"
          className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white"
        >
          Back to Question Bank
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-r from-slate-950 to-indigo-950 text-white">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-indigo-200">
              {questionSet.examBoard}-style practice
            </p>

            <h1 className="mt-2 text-4xl font-black">{questionSet.title}</h1>

            <p className="mt-3 text-indigo-100">
              {questionSet.questionCount} questions · {questionSet.totalMarks}{" "}
              marks
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowAssign(true)}
              className="rounded-xl bg-white px-5 py-3 font-bold text-indigo-900"
            >
              Assign to Class
            </button>

            <Link
              href="/teacher/question-bank"
              className="rounded-xl border border-white/20 px-5 py-3 font-bold"
            >
              Question Bank
            </Link>
          </div>
        </div>
      </Card>

      <Card className="border border-amber-200 bg-amber-50">
        <p className="text-sm leading-6 text-amber-900">
          {questionSet.content.copyrightNotice}
        </p>
      </Card>

      {questionSet.content.questions.map((question) => (
        <Card key={question.id}>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-black">
              Question {question.questionNumber}
            </h2>

            <span className="rounded-full bg-indigo-100 px-3 py-1 font-bold text-indigo-800">
              {question.marks} marks
            </span>
          </div>

          <p className="mt-3 text-sm font-bold uppercase tracking-wide text-slate-500">
            {question.assessmentObjective} · {question.questionType} ·{" "}
            {question.commandWord}
          </p>

          {question.context && (
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              {question.context}
            </div>
          )}

          <p className="mt-5 whitespace-pre-wrap text-slate-900">
            {question.question}
          </p>

          <div className="mt-6 rounded-2xl bg-emerald-50 p-5">
            <h3 className="font-black text-emerald-950">Mark scheme</h3>

            <ul className="mt-3 space-y-2">
              {question.markScheme.map((point) => (
                <li key={point.id} className="text-sm text-emerald-900">
                  • {point.description} ({point.marks})
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 rounded-2xl bg-blue-50 p-5">
            <h3 className="font-black text-blue-950">Model answer</h3>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-blue-900">
              {question.modelAnswer}
            </p>
          </div>
        </Card>
      ))}

      {showAssign && (
        <AssignExamModal
          questionSet={questionSet}
          onClose={() => setShowAssign(false)}
          onAssigned={(assignmentId) => {
            setShowAssign(false);
            router.push(`/teacher/exam-assignments/${assignmentId}`);
          }}
        />
      )}
    </div>
  );
}
