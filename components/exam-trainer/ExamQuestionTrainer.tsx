"use client";

import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import Link from "next/link";

import Card from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";
import {
  examTrainerQuestionBank,
  examTrainerTopics,
} from "@/data/examTrainerQuestionBank";
import {
  createExamTrainerAttempt,
  createExamTrainerAttemptId,
  getLatestInProgressExamTrainerAttempt,
  saveExamTrainerDraft,
  submitExamTrainerAttempt,
} from "@/services/examTrainerAttemptService";
import {
  buildExamQuestions,
  markExamTrainerAttempt,
} from "@/services/examTrainerService";
import type { ExamTrainerAttempt, ExamTrainerDifficulty, ExamTrainerReport } from "@/types/examTrainer";

type Stage = "loading" | "setup" | "exam" | "marking" | "report";

function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function ExamQuestionTrainer() {
  const { user, profile } = useAuth();

  const [stage, setStage] = useState<Stage>("loading");
  const [topic, setTopic] = useState("all");
  const [difficulty, setDifficulty] = useState<ExamTrainerDifficulty | "all">(
    "all",
  );
  const [questionCount, setQuestionCount] = useState(6);
  const [attempt, setAttempt] = useState<ExamTrainerAttempt | null>(null);
  const [report, setReport] = useState<ExamTrainerReport | null>(null);
  const [resumeAttempt, setResumeAttempt] = useState<ExamTrainerAttempt | null>(
    null,
  );
  const [error, setError] = useState("");

  const submittingRef = useRef(false);
  const lastSavedSignatureRef = useRef("");

  const questions = attempt?.questions ?? [];
  const answers = attempt?.answers ?? [];
  const currentIndex = attempt?.currentQuestionIndex ?? 0;
  const secondsRemaining = attempt?.secondsRemaining ?? 0;
  const currentQuestion = questions[currentIndex];

  const availableCount = useMemo(
    () =>
      examTrainerQuestionBank.filter((question) => {
        const topicMatches = topic === "all" || question.topic === topic;
        const difficultyMatches =
          difficulty === "all" || question.difficulty === difficulty;

        return topicMatches && difficultyMatches;
      }).length,
    [difficulty, topic],
  );

  useEffect(() => {
    if (!user) {
      void Promise.resolve().then(() => {
        setStage("setup");
      });
      return;
    }

    const userId = user.uid;
    let active = true;

    async function loadResumeAttempt() {
      try {
        const existing = await getLatestInProgressExamTrainerAttempt(userId);

        if (active && existing) {
          setResumeAttempt(existing);
        }
      } catch (loadError) {
        console.error("Resume attempt load error:", loadError);
      } finally {
        if (active) {
          setStage("setup");
        }
      }
    }

    void loadResumeAttempt();

    return () => {
      active = false;
    };
  }, [user]);

  const submitExamFromTimer = useEffectEvent(() => {
    void submitExam();
  });

  useEffect(() => {
    if (stage !== "exam" || !attempt) return;

    if (attempt.secondsRemaining <= 0) {
      submitExamFromTimer();
      return;
    }

    const timer = window.setInterval(() => {
      setAttempt((current) =>
        current
          ? {
              ...current,
              secondsRemaining: Math.max(0, current.secondsRemaining - 1),
              updatedAt: new Date(),
            }
          : current,
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, [attempt, stage]);

  useEffect(() => {
    if (stage !== "exam" || !attempt) return;

    const signature = JSON.stringify({
      id: attempt.id,
      answers: attempt.answers,
      currentQuestionIndex: attempt.currentQuestionIndex,
      secondsRemaining: Math.floor(attempt.secondsRemaining / 5),
    });

    if (signature === lastSavedSignatureRef.current) return;

    const timer = window.setTimeout(() => {
      void saveExamTrainerDraft(attempt)
        .then(() => {
          lastSavedSignatureRef.current = signature;
        })
        .catch((saveError) => {
          console.error("Exam trainer autosave error:", saveError);
        });
    }, 700);

    return () => window.clearTimeout(timer);
  }, [attempt, stage]);

  function updateAttempt(
    updater: (current: ExamTrainerAttempt) => ExamTrainerAttempt,
  ) {
    setAttempt((current) => (current ? updater(current) : current));
  }

  async function startExam() {
    if (!user) {
      setError("Please sign in before starting an exam.");
      return;
    }

    const selectedQuestions = buildExamQuestions({
      topic,
      difficulty,
      count: questionCount,
      questionBank: examTrainerQuestionBank,
    });

    if (selectedQuestions.length === 0) {
      setError("No questions match the selected options.");
      return;
    }

    const startedAt = new Date();
    const durationSeconds = Math.max(10, selectedQuestions.length * 3) * 60;

    const newAttempt: ExamTrainerAttempt = {
      id: createExamTrainerAttemptId(user.uid, startedAt),
      studentId: user.uid,
      selectedTopic: topic,
      selectedDifficulty: difficulty,
      requestedQuestionCount: questionCount,
      questions: selectedQuestions,
      answers: selectedQuestions.map((question) => ({
        questionId: question.id,
        response: "",
      })),
      currentQuestionIndex: 0,
      durationSeconds,
      secondsRemaining: durationSeconds,
      status: "in_progress",
      report: null,
      startedAt,
      updatedAt: startedAt,
      submittedAt: null,
    };

    try {
      await createExamTrainerAttempt(newAttempt);
      setAttempt(newAttempt);
      setResumeAttempt(null);
      setReport(null);
      setError("");
      setStage("exam");
    } catch (createError) {
      console.error("Exam attempt creation error:", createError);
      setError("The exam could not be created or saved.");
    }
  }

  function resumeSavedAttempt() {
    if (!resumeAttempt) return;

    setAttempt(resumeAttempt);
    setTopic(resumeAttempt.selectedTopic);
    setDifficulty(resumeAttempt.selectedDifficulty);
    setQuestionCount(resumeAttempt.requestedQuestionCount);
    setError("");
    setStage("exam");
  }

  function updateAnswer(response: string) {
    if (!currentQuestion) return;

    updateAttempt((current) => ({
      ...current,
      answers: current.answers.map((answer) =>
        answer.questionId === currentQuestion.id
          ? { ...answer, response }
          : answer,
      ),
      updatedAt: new Date(),
    }));
  }

  function moveToQuestion(nextIndex: number) {
    updateAttempt((current) => ({
      ...current,
      currentQuestionIndex: Math.max(
        0,
        Math.min(current.questions.length - 1, nextIndex),
      ),
      updatedAt: new Date(),
    }));
  }

  async function submitExam() {
    if (!attempt || submittingRef.current) return;

    submittingRef.current = true;

    try {
      setStage("marking");
      setError("");

      const result = await markExamTrainerAttempt({
        questions: attempt.questions,
        answers: attempt.answers,
        qualification: profile?.qualification,
      });

      await submitExamTrainerAttempt({
        attempt,
        report: result,
      });

      setAttempt({
        ...attempt,
        status: "submitted",
        report: result,
        submittedAt: new Date(),
        updatedAt: new Date(),
      });
      setReport(result);
      setStage("report");
    } catch (submissionError) {
      console.error("Exam trainer submission error:", submissionError);
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "The exam could not be marked and saved.",
      );
      setStage("exam");
    } finally {
      submittingRef.current = false;
    }
  }

  const currentResponse =
    answers.find((answer) => answer.questionId === currentQuestion?.id)
      ?.response ?? "";

  if (stage === "loading") {
    return (
      <Card>
        <p className="py-20 text-center font-bold text-slate-500">
          Preparing Exam Trainer...
        </p>
      </Card>
    );
  }

  if (stage === "setup") {
    return (
      <div className="space-y-8">
        <Card className="border-0 bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 text-white">
          <p className="text-sm font-black uppercase tracking-widest text-blue-200">
            GCSE Exam Centre
          </p>
          <h1 className="mt-3 text-4xl font-black">Exam Question Trainer</h1>
          <p className="mt-4 max-w-3xl leading-7 text-blue-100">
            Build a timed paper. Answers are autosaved and submitted results
            update your learning evidence.
          </p>

          <Link
            href="/exam-trainer/history"
            className="mt-6 inline-flex rounded-xl border border-white/30 px-5 py-3 font-black text-white"
          >
            View exam history ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢
          </Link>
        </Card>

        {resumeAttempt && (
          <Card className="border-2 border-amber-300 bg-amber-50">
            <p className="text-sm font-black uppercase text-amber-700">
              Unfinished exam found
            </p>
            <h2 className="mt-2 text-2xl font-black text-amber-950">
              Resume your saved attempt
            </h2>
            <p className="mt-2 text-amber-900">
              Question {resumeAttempt.currentQuestionIndex + 1} of{" "}
              {resumeAttempt.questions.length} Ãƒâ€šÃ‚Â·{" "}
              {formatSeconds(resumeAttempt.secondsRemaining)} remaining
            </p>
            <button
              type="button"
              onClick={resumeSavedAttempt}
              className="mt-5 rounded-xl bg-amber-600 px-5 py-3 font-black text-white"
            >
              Resume exam ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢
            </button>
          </Card>
        )}

        <Card>
          <div className="grid gap-6 lg:grid-cols-3">
            <label>
              <span className="font-black">Topic</span>
              <select
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
              >
                <option value="all">All topics</option>
                {examTrainerTopics.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              <span className="font-black">Difficulty</span>
              <select
                value={difficulty}
                onChange={(event) =>
                  setDifficulty(
                    event.target.value as ExamTrainerDifficulty | "all",
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
              >
                <option value="all">Mixed difficulty</option>
                <option value="foundation">Foundation</option>
                <option value="standard">Standard</option>
                <option value="higher">Higher</option>
              </select>
            </label>

            <label>
              <span className="font-black">Number of questions</span>
              <input
                type="number"
                min={1}
                max={Math.max(1, availableCount)}
                value={Math.min(questionCount, Math.max(1, availableCount))}
                onChange={(event) =>
                  setQuestionCount(Math.max(1, Number(event.target.value) || 1))
                }
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </label>
          </div>

          <div className="mt-7 rounded-2xl bg-blue-50 p-5">
            <p className="font-black text-blue-950">
              {availableCount} matching questions available
            </p>
            <p className="mt-2 text-sm text-blue-800">
              Progress is saved automatically while you work.
            </p>
          </div>

          {error && (
            <p className="mt-5 rounded-2xl bg-rose-50 p-4 font-bold text-rose-900">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={() => void startExam()}
            disabled={availableCount === 0}
            className="mt-7 rounded-xl bg-blue-600 px-6 py-4 font-black text-white disabled:bg-slate-300"
          >
            Generate saved exam ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢
          </button>
        </Card>
      </div>
    );
  }

  if (stage === "marking") {
    return (
      <Card>
        <div className="py-20 text-center">
          <div className="text-6xl">ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â</div>
          <h1 className="mt-6 text-3xl font-black">
            Marking and saving your paper
          </h1>
        </div>
      </Card>
    );
  }

  if (stage === "report" && report) {
    return (
      <div className="space-y-8">
        <Card className="border-0 bg-gradient-to-r from-emerald-900 to-blue-900 text-white">
          <p className="text-sm font-black uppercase text-emerald-200">
            Saved examiner report
          </p>
          <div className="mt-5 grid gap-5 md:grid-cols-4">
            <div>
              <p className="text-sm text-emerald-100">Score</p>
              <p className="mt-1 text-4xl font-black">
                {report.totalAwardedMarks}/{report.totalAvailableMarks}
              </p>
            </div>
            <div>
              <p className="text-sm text-emerald-100">Percentage</p>
              <p className="mt-1 text-4xl font-black">{report.percentage}%</p>
            </div>
            <div>
              <p className="text-sm text-emerald-100">Estimated grade</p>
              <p className="mt-1 text-4xl font-black">{report.grade}</p>
            </div>
            <div>
              <p className="text-sm text-emerald-100">Questions</p>
              <p className="mt-1 text-4xl font-black">{questions.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-black">Topic performance</h2>
          <div className="mt-6 space-y-4">
            {report.topicScores.map((item) => (
              <div key={item.topic}>
                <div className="flex justify-between gap-4 font-bold">
                  <span>{item.topic}</span>
                  <span>
                    {item.awardedMarks}/{item.availableMarks} Ãƒâ€šÃ‚Â·{" "}
                    {item.percentage}%
                  </span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setAttempt(null);
              setReport(null);
              setStage("setup");
            }}
            className="rounded-xl bg-blue-600 px-6 py-4 font-black text-white"
          >
            Create another exam
          </button>

          <Link
            href="/exam-trainer/history"
            className="rounded-xl border border-slate-300 px-6 py-4 font-black"
          >
            View saved history
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="sticky top-4 z-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-blue-600">
              Question {currentIndex + 1} of {questions.length}
            </p>
            <p className="mt-1 font-bold text-slate-600">
              {currentQuestion?.topic} Ãƒâ€šÃ‚Â· {currentQuestion?.marks} marks
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black">
              ÃƒÂ¢Ã‚ÂÃ‚Â± {formatSeconds(secondsRemaining)}
            </p>
            <p className="mt-1 text-xs font-bold text-emerald-700">
              Autosave enabled
            </p>
          </div>
        </div>
      </Card>

      {currentQuestion && (
        <Card>
          <p className="text-sm font-black uppercase tracking-wide text-indigo-600">
            {currentQuestion.commandWord} Ãƒâ€šÃ‚Â· {currentQuestion.type}
          </p>
          <h1 className="mt-3 whitespace-pre-wrap text-2xl font-black leading-9">
            {currentQuestion.question}
          </h1>

          {currentQuestion.options ? (
            <div className="mt-6 grid gap-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => updateAnswer(option)}
                  className={`rounded-2xl border p-4 text-left font-bold ${
                    currentResponse === option
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <textarea
              rows={10}
              value={currentResponse}
              onChange={(event) => updateAnswer(event.target.value)}
              placeholder="Write your answer here..."
              className="mt-6 w-full rounded-2xl border border-slate-300 p-4 leading-7"
            />
          )}
        </Card>
      )}

      {error && (
        <p className="rounded-2xl bg-rose-50 p-4 font-bold text-rose-900">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => moveToQuestion(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="rounded-xl border border-slate-300 px-5 py-3 font-black disabled:opacity-40"
        >
          ÃƒÂ¢Ã¢â‚¬Â Ã‚Â Previous
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            type="button"
            onClick={() => moveToQuestion(currentIndex + 1)}
            className="rounded-xl bg-blue-600 px-5 py-3 font-black text-white"
          >
            Next question ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void submitExam()}
            className="rounded-xl bg-emerald-600 px-5 py-3 font-black text-white"
          >
            Submit paper
          </button>
        )}
      </div>
    </div>
  );
}
