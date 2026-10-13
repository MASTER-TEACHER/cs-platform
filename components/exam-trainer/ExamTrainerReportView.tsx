"use client";

import Link from "next/link";

import Card from "@/components/ui/Card";
import type {
  ExamTrainerAnswer,
  ExamTrainerMarkedAnswer,
  ExamTrainerQuestion,
  ExamTrainerReport,
} from "@/types/examTrainer";

type Props = {
  questions: ExamTrainerQuestion[];
  answers: ExamTrainerAnswer[];
  report: ExamTrainerReport;
  showActions?: boolean;
  onCreateAnotherExam?: () => void;
};

type ReviewState = "correct" | "partial" | "incorrect" | "unanswered";

function getResponse(
  answers: ExamTrainerAnswer[],
  questionId: string,
): string {
  return (
    answers.find((answer) => answer.questionId === questionId)?.response ?? ""
  );
}

function getMarkedAnswer(
  report: ExamTrainerReport,
  questionId: string,
): ExamTrainerMarkedAnswer | undefined {
  return report.markedAnswers.find(
    (answer) => answer.questionId === questionId,
  );
}

function getReviewState(
  response: string,
  marked: ExamTrainerMarkedAnswer | undefined,
): ReviewState {
  if (!response.trim()) return "unanswered";

  if (!marked || marked.awardedMarks <= 0) {
    return "incorrect";
  }

  if (marked.awardedMarks >= marked.maximumMarks) {
    return "correct";
  }

  return "partial";
}

const stateStyles: Record<
  ReviewState,
  {
    label: string;
    symbol: string;
    badge: string;
    border: string;
    panel: string;
  }
> = {
  correct: {
    label: "Correct",
    symbol: "✓",
    badge: "bg-emerald-100 text-emerald-800",
    border: "border-emerald-200",
    panel: "bg-emerald-50",
  },
  partial: {
    label: "Partially correct",
    symbol: "◐",
    badge: "bg-amber-100 text-amber-800",
    border: "border-amber-200",
    panel: "bg-amber-50",
  },
  incorrect: {
    label: "Incorrect",
    symbol: "✗",
    badge: "bg-rose-100 text-rose-800",
    border: "border-rose-200",
    panel: "bg-rose-50",
  },
  unanswered: {
    label: "Not answered",
    symbol: "○",
    badge: "bg-slate-200 text-slate-700",
    border: "border-slate-200",
    panel: "bg-slate-50",
  },
};

export default function ExamTrainerReportView({
  questions,
  answers,
  report,
  showActions = true,
  onCreateAnotherExam,
}: Props) {
  const reviewItems = questions.map((question) => {
    const response = getResponse(answers, question.id);
    const marked = getMarkedAnswer(report, question.id);
    const state = getReviewState(response, marked);

    return {
      question,
      response,
      marked,
      state,
    };
  });

  const correctCount = reviewItems.filter(
    (item) => item.state === "correct",
  ).length;

  const partialCount = reviewItems.filter(
    (item) => item.state === "partial",
  ).length;

  const incorrectCount = reviewItems.filter(
    (item) => item.state === "incorrect",
  ).length;

  const unansweredCount = reviewItems.filter(
    (item) => item.state === "unanswered",
  ).length;

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-emerald-900 via-teal-900 to-blue-900 text-white">
        <p className="text-sm font-black uppercase tracking-widest text-emerald-200">
          Saved examiner report
        </p>

        <h1 className="mt-3 text-4xl font-black">Exam complete</h1>

        <p className="mt-3 max-w-3xl text-emerald-100">
          Review your score, topic performance and detailed examiner feedback
          for every question.
        </p>

        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white/10 p-5">
            <p className="text-sm text-emerald-100">Score</p>
            <p className="mt-1 text-4xl font-black">
              {report.totalAwardedMarks}/{report.totalAvailableMarks}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-5">
            <p className="text-sm text-emerald-100">Percentage</p>
            <p className="mt-1 text-4xl font-black">{report.percentage}%</p>
          </div>

          <div className="rounded-2xl bg-white/10 p-5">
            <p className="text-sm text-emerald-100">Estimated grade</p>
            <p className="mt-1 text-4xl font-black">{report.grade}</p>
          </div>

          <div className="rounded-2xl bg-white/10 p-5">
            <p className="text-sm text-emerald-100">Questions</p>
            <p className="mt-1 text-4xl font-black">{questions.length}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-emerald-200">
          <p className="text-sm font-black uppercase text-emerald-700">
            ✓ Fully correct
          </p>
          <p className="mt-2 text-4xl font-black text-emerald-800">
            {correctCount}
          </p>
        </Card>

        <Card className="border-2 border-amber-200">
          <p className="text-sm font-black uppercase text-amber-700">
            ◐ Partially correct
          </p>
          <p className="mt-2 text-4xl font-black text-amber-800">
            {partialCount}
          </p>
        </Card>

        <Card className="border-2 border-rose-200">
          <p className="text-sm font-black uppercase text-rose-700">
            ✗ Incorrect
          </p>
          <p className="mt-2 text-4xl font-black text-rose-800">
            {incorrectCount}
          </p>
        </Card>

        <Card className="border-2 border-slate-200">
          <p className="text-sm font-black uppercase text-slate-600">
            ○ Not answered
          </p>
          <p className="mt-2 text-4xl font-black text-slate-700">
            {unansweredCount}
          </p>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="text-2xl font-black">Strengths</h2>

          {report.strongestTopics.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {report.strongestTopics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-800"
                >
                  {topic}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-slate-600">
              Keep practising. No topic has reached the current strength
              threshold yet.
            </p>
          )}
        </Card>

        <Card>
          <h2 className="text-2xl font-black">Priority topics</h2>

          {report.priorityTopics.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {report.priorityTopics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full bg-amber-100 px-4 py-2 text-sm font-black text-amber-900"
                >
                  {topic}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-slate-600">
              No priority topics were identified from this attempt.
            </p>
          )}
        </Card>
      </div>

      <Card>
        <h2 className="text-2xl font-black">Topic performance</h2>

        <div className="mt-6 space-y-5">
          {report.topicScores.map((item) => (
            <div key={item.topic}>
              <div className="flex justify-between gap-4 font-bold">
                <span>{item.topic}</span>
                <span>
                  {item.awardedMarks}/{item.availableMarks} · {item.percentage}%
                </span>
              </div>

              <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(100, item.percentage),
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div>
        <div className="mb-5">
          <p className="text-sm font-black uppercase tracking-widest text-blue-600">
            Examiner review
          </p>
          <h2 className="mt-2 text-3xl font-black">Review your answers</h2>
          <p className="mt-2 text-slate-600">
            Compare your responses with the marking points and use the feedback
            to improve your next attempt.
          </p>
        </div>

        <div className="space-y-6">
          {reviewItems.map(
            ({ question, response, marked, state }, index) => {
              const style = stateStyles[state];

              return (
                <Card
                  key={question.id}
                  className={`border-2 ${style.border}`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-wide text-blue-600">
                        Question {index + 1} · {question.topic}
                      </p>

                      <p className="mt-1 text-sm font-bold capitalize text-slate-500">
                        {question.commandWord} ·{" "}
                        {question.type.replaceAll("-", " ")}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-2 text-xs font-black uppercase ${style.badge}`}
                      >
                        {style.symbol} {style.label}
                      </span>

                      <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">
                        {marked?.awardedMarks ?? 0}/
                        {marked?.maximumMarks ?? question.marks}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                      Question
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-lg font-bold leading-8 text-slate-950">
                      {question.question}
                    </p>
                  </div>

                  <div className={`mt-6 rounded-2xl p-5 ${style.panel}`}>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-600">
                      Your answer
                    </p>
                    <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-900">
                      {response.trim() || "No answer was provided."}
                    </p>
                  </div>

                  {question.type === "multiple-choice" &&
                    question.correctAnswer && (
                      <div className="mt-5 rounded-2xl bg-blue-50 p-5">
                        <p className="text-xs font-black uppercase tracking-widest text-blue-700">
                          Correct answer
                        </p>
                        <p className="mt-2 font-bold text-blue-950">
                          {question.correctAnswer}
                        </p>
                      </div>
                    )}

                  {marked?.matchedPoints &&
                    marked.matchedPoints.length > 0 && (
                      <div className="mt-5">
                        <p className="text-sm font-black uppercase tracking-wide text-emerald-700">
                          Marking points achieved
                        </p>

                        <div className="mt-3 space-y-2">
                          {marked.matchedPoints.map((point, pointIndex) => (
                            <div
                              key={`${question.id}-matched-${pointIndex}`}
                              className="rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-900"
                            >
                              ✓ {point}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {marked?.missingPoints &&
                    marked.missingPoints.length > 0 && (
                      <div className="mt-5">
                        <p className="text-sm font-black uppercase tracking-wide text-rose-700">
                          Marking points to improve
                        </p>

                        <div className="mt-3 space-y-2">
                          {marked.missingPoints.map((point, pointIndex) => (
                            <div
                              key={`${question.id}-missing-${pointIndex}`}
                              className="rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-900"
                            >
                              ✗ {point}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-black uppercase tracking-widest text-indigo-600">
                      Examiner feedback
                    </p>
                    <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-800">
                      {marked?.feedback ?? "No detailed feedback is available."}
                    </p>
                  </div>

                  {(marked?.improvedAnswer || question.modelAnswer) && (
                    <details className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-5">
                      <summary className="cursor-pointer font-black text-blue-900">
                        View improved / model answer
                      </summary>

                      <p className="mt-4 whitespace-pre-wrap leading-7 text-blue-950">
                        {marked?.improvedAnswer || question.modelAnswer}
                      </p>
                    </details>
                  )}

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
                      Marked using:{" "}
                      {marked?.mode === "ai"
                        ? "AI-assisted marking"
                        : marked?.mode === "automatic"
                          ? "automatic marking"
                          : "review guidance"}
                    </span>

                    <Link
                      href={`/learn?topic=${encodeURIComponent(question.topic)}`}
                      className="rounded-xl border border-blue-200 px-4 py-2 text-sm font-black text-blue-700"
                    >
                      Practise {question.topic} →
                    </Link>
                  </div>
                </Card>
              );
            },
          )}
        </div>
      </div>

      {showActions && (
        <div className="flex flex-wrap gap-3">
          {onCreateAnotherExam && (
            <button
              type="button"
              onClick={onCreateAnotherExam}
              className="rounded-xl bg-blue-600 px-6 py-4 font-black text-white"
            >
              Create another exam
            </button>
          )}

          <Link
            href="/exam-trainer/history"
            className="rounded-xl border border-slate-300 px-6 py-4 font-black"
          >
            View saved history
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-300 px-6 py-4 font-black"
          >
            Back to dashboard
          </Link>
        </div>
      )}
    </div>
  );
}