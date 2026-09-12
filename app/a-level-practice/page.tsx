"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useAuth } from "@/contexts/AuthContext";
import {
  getALevelQuestionsForBoard,
} from "@/data/a-level/questionBank";
import {
  getALevelTopicsForBoard,
} from "@/data/a-level/topicCatalog";
import type {
  ALevelExamBoard,
  ALevelPracticeQuestion,
} from "@/types/aLevelPractice";

function nextQuestionIndex(
  length: number,
  current: number,
): number {
  if (length <= 1) {
    return 0;
  }

  return (current + 1) % length;
}

export default function ALevelPracticePage() {
  const { profile } = useAuth();

  const qualification =
    (
      profile as {
        qualification?: string;
      } | null
    )?.qualification;

  const profileBoard =
    (
      profile as {
        examBoard?: string;
      } | null
    )?.examBoard;

  const [
    board,
    setBoard,
  ] = useState<ALevelExamBoard>(
    profileBoard === "OCR"
      ? "OCR"
      : "AQA",
  );

  const [
    curriculumAreaId,
    setCurriculumAreaId,
  ] = useState("all");

  const [
    difficulty,
    setDifficulty,
  ] = useState("all");

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const [
    response,
    setResponse,
  ] = useState("");

  const [
    showAnswer,
    setShowAnswer,
  ] = useState(false);

  const [
    topicMenuOpen,
    setTopicMenuOpen,
  ] = useState(false);

  const topicMenuRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const topics =
    useMemo(
      () =>
        getALevelTopicsForBoard(
          board,
        ),
      [
        board,
      ],
    );

  const selectedTopic =
    useMemo(
      () =>
        topics.find(
          (topic) =>
            topic.id ===
            curriculumAreaId,
        ) ?? null,
      [
        topics,
        curriculumAreaId,
      ],
    );

  const filtered =
    useMemo(
      () =>
        getALevelQuestionsForBoard(
          board,
        ).filter(
          (question) =>
            (
              curriculumAreaId ===
                "all" ||
              question.curriculumAreaIds.includes(
                curriculumAreaId,
              )
            ) &&
            (
              difficulty ===
                "all" ||
              question.difficulty ===
                difficulty
            ),
        ),
      [
        board,
        curriculumAreaId,
        difficulty,
      ],
    );

  const safeIndex =
    filtered.length === 0
      ? 0
      : Math.min(
          activeIndex,
          filtered.length - 1,
        );

  const current:
    | ALevelPracticeQuestion
    | undefined =
    filtered[safeIndex];

  useEffect(() => {
    function handlePointerDown(
      event: MouseEvent,
    ) {
      if (
        topicMenuRef.current &&
        !topicMenuRef.current.contains(
          event.target as Node,
        )
      ) {
        setTopicMenuOpen(
          false,
        );
      }
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        setTopicMenuOpen(
          false,
        );
      }
    }

    document.addEventListener(
      "mousedown",
      handlePointerDown,
    );

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown,
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, []);

  function resetQuestion() {
    setActiveIndex(0);
    setResponse("");
    setShowAnswer(false);
  }

  function newQuestion() {
    setActiveIndex(
      nextQuestionIndex(
        filtered.length,
        safeIndex,
      ),
    );

    setResponse("");
    setShowAnswer(false);
  }

  function selectCurriculumArea(
    nextId: string,
  ) {
    setCurriculumAreaId(
      nextId,
    );

    setTopicMenuOpen(
      false,
    );

    resetQuestion();
  }

  if (
    qualification !==
    "A_LEVEL"
  ) {
    return (
      <main className="mx-auto max-w-5xl">
        <section className="rounded-3xl bg-gradient-to-r from-slate-950 to-blue-950 p-8 text-white">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-200">
            A-level practice
          </p>

          <h1 className="mt-3 text-4xl font-black">
            A-level Computer Science Question Bank
          </h1>

          <p className="mt-4 text-blue-100">
            Switch your curriculum profile to A-level to use board-aware practice.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 p-8 text-white">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-200">
          Full specification practice
        </p>

        <h1 className="mt-3 text-4xl font-black">
          A-level Practice & Revision
        </h1>

        <p className="mt-4 max-w-4xl leading-7 text-blue-100">
          Practice against the complete major content structure for your selected AQA or OCR A-level specification.
        </p>
      </section>

      <section className="relative z-20 grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-3">
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Exam board
          <select
            value={board}
            onChange={(event) => {
              setBoard(
                event.target.value as ALevelExamBoard,
              );
              setCurriculumAreaId("all");
              setTopicMenuOpen(false);
              resetQuestion();
            }}
            className="rounded-xl border border-slate-300 bg-white px-3 py-3"
          >
            <option value="AQA">
              AQA
            </option>
            <option value="OCR">
              OCR
            </option>
          </select>
        </label>

        <div
          ref={topicMenuRef}
          className="relative grid gap-2 text-sm font-bold text-slate-700"
        >
          <span>
            Specification topic
          </span>

          <button
            type="button"
            onClick={() =>
              setTopicMenuOpen(
                (value) =>
                  !value,
              )
            }
            className="flex min-h-[46px] w-full items-center justify-between gap-3 rounded-xl border border-slate-300 bg-white px-3 py-3 text-left font-normal text-slate-900 outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            aria-haspopup="listbox"
            aria-expanded={
              topicMenuOpen
            }
          >
            <span className="min-w-0 flex-1 truncate">
              {selectedTopic
                ? `${selectedTopic.specificationCode} - ${selectedTopic.title}`
                : "Mixed specification"}
            </span>

            <span
              aria-hidden="true"
              className={`shrink-0 text-xs text-slate-500 transition-transform ${
                topicMenuOpen
                  ? "rotate-180"
                  : ""
              }`}
            >
              ▼
            </span>
          </button>

          {topicMenuOpen ? (
            <div
              role="listbox"
              className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl"
            >
              <button
                type="button"
                role="option"
                aria-selected={
                  curriculumAreaId ===
                  "all"
                }
                onClick={() =>
                  selectCurriculumArea(
                    "all",
                  )
                }
                className={`w-full rounded-xl px-3 py-3 text-left text-sm transition ${
                  curriculumAreaId ===
                  "all"
                    ? "bg-blue-600 font-black text-white"
                    : "font-semibold text-slate-800 hover:bg-slate-100"
                }`}
              >
                Mixed specification
              </button>

              <div className="my-2 border-t border-slate-100" />

              {topics.map(
                (topic) => {
                  const active =
                    curriculumAreaId ===
                    topic.id;

                  return (
                    <button
                      key={
                        topic.id
                      }
                      type="button"
                      role="option"
                      aria-selected={
                        active
                      }
                      onClick={() =>
                        selectCurriculumArea(
                          topic.id,
                        )
                      }
                      className={`w-full rounded-xl px-3 py-3 text-left text-sm leading-5 transition ${
                        active
                          ? "bg-blue-600 font-black text-white"
                          : "font-semibold text-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      <span className="block">
                        <span className="font-black">
                          {topic.specificationCode}
                        </span>
                        {" - "}
                        {topic.title}
                      </span>
                    </button>
                  );
                },
              )}
            </div>
          ) : null}
        </div>

        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Difficulty
          <select
            value={difficulty}
            onChange={(event) => {
              setDifficulty(
                event.target.value,
              );
              resetQuestion();
            }}
            className="rounded-xl border border-slate-300 bg-white px-3 py-3"
          >
            <option value="all">
              All difficulties
            </option>
            <option value="foundation">
              Foundation
            </option>
            <option value="standard">
              Standard
            </option>
            <option value="advanced">
              Advanced
            </option>
          </select>
        </label>
      </section>

      <section className="relative z-10 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-indigo-700">
              {board} A-level
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-950">
              {filtered.length} questions available
            </h2>
          </div>

          {current ? (
            <button
              type="button"
              onClick={
                newQuestion
              }
              className="rounded-xl bg-slate-950 px-5 py-3 font-black text-white"
            >
              New question
            </button>
          ) : null}
        </div>

        {!current ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
            No questions match these filters.
          </div>
        ) : (
          <>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-black uppercase tracking-wide">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-800">
                {
                  current.topicTitle
                }
              </span>

              <span className="rounded-full bg-violet-50 px-3 py-1 text-violet-800">
                {
                  current.difficulty
                }
              </span>

              <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800">
                {
                  current.marks
                }{" "}
                marks
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                {
                  current.questionType
                }
              </span>
            </div>

            <p className="mt-6 text-xl font-bold leading-8 text-slate-950">
              {
                current.question
              }
            </p>

            <p className="mt-4 text-sm text-slate-500">
              Specification mapping:{" "}
              {
                current.specificationReferences.join(
                  " | ",
                )
              }
            </p>

            <textarea
              rows={8}
              value={response}
              onChange={(event) =>
                setResponse(
                  event.target.value,
                )
              }
              className="mt-6 w-full resize-y rounded-2xl border border-slate-300 px-4 py-3"
              placeholder="Write your answer here before revealing the mark scheme..."
            />

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  setShowAnswer(
                    (value) =>
                      !value,
                  )
                }
                className="rounded-xl bg-indigo-700 px-5 py-3 font-black text-white"
              >
                {showAnswer
                  ? "Hide mark scheme"
                  : "Reveal mark scheme"}
              </button>

              <button
                type="button"
                onClick={
                  newQuestion
                }
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-black text-slate-800"
              >
                New question
              </button>
            </div>

            {showAnswer ? (
              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="font-black text-emerald-950">
                    Mark points
                  </h3>

                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-emerald-900">
                    {current.markPoints.map(
                      (point) => (
                        <li key={point}>
                          {point}
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                  <h3 className="font-black text-blue-950">
                    Model answer
                  </h3>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-blue-950">
                    {
                      current.modelAnswer
                    }
                  </p>
                </div>
              </div>
            ) : null}
          </>
        )}
      </section>
    </main>
  );
}
