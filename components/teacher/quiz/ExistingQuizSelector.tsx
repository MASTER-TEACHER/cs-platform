"use client";

import { useMemo, useState } from "react";

import { getCurriculumQuizzes } from "@/data/quizzes/quizRegistry";
import type { AssignmentWizardResource } from "@/types/assignmentWizard";
import type {
  ExamBoard,
  Qualification,
} from "@/types/user";

type Props = {
  selectedResource: AssignmentWizardResource | null;
  onSelect: (resource: AssignmentWizardResource) => void;
};

function normalise(value: string): string {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function ExistingQuizSelector({
  selectedResource,
  onSelect,
}: Props) {
  const [search, setSearch] = useState("");

  /*
   * The quiz selector must preserve the curriculum from which the
   * teacher selected the quiz.
   *
   * These values are passed into the assignment so that an assigned
   * quiz can later be resolved using the teacher-selected curriculum,
   * rather than the student's normal browsing curriculum.
   */
  const [qualification, setQualification] =
    useState<Qualification>("GCSE");

  const [examBoard, setExamBoard] =
    useState<ExamBoard>("AQA");

  const curriculumQuizzes = useMemo(
    () =>
      getCurriculumQuizzes(
        qualification,
        examBoard,
      ),
    [qualification, examBoard],
  );

  const filteredQuizzes = useMemo(() => {
    const term = search
      .trim()
      .toLowerCase();

    const quizzes =
      [...curriculumQuizzes].sort(
        (a, b) =>
          a.quiz.title.localeCompare(
            b.quiz.title,
          ),
      );

    if (!term) {
      return quizzes;
    }

    return quizzes.filter(
      ({
        quiz,
        topicId,
        unitTitle,
      }) => {
        const searchableText = [
          quiz.id,
          quiz.topicId,
          topicId,
          quiz.title,
          quiz.description,
          quiz.estimatedTime,
          unitTitle,
          qualification,
          examBoard,
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(
          term,
        );
      },
    );
  }, [
    curriculumQuizzes,
    search,
    qualification,
    examBoard,
  ]);

  function handleQualificationChange(
    value: Qualification,
  ) {
    setQualification(value);

    /*
     * Clear the existing resource selection visually by ensuring
     * the next quiz must be explicitly selected from the newly
     * chosen curriculum.
     *
     * We do not call onSelect here because the parent expects a
     * complete valid resource.
     */
    setSearch("");
  }

  function handleExamBoardChange(
    value: ExamBoard,
  ) {
    setExamBoard(value);
    setSearch("");
  }

  return (
    <section className="mt-8 rounded-3xl border border-violet-200 bg-violet-50/50 p-5 sm:p-6">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">
        Existing quiz library
      </p>

      <h3 className="mt-2 text-xl font-black text-slate-950">
        Choose the exact quiz
      </h3>

      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
        Select the qualification and exam
        board first, then choose the exact CS
        Master quiz. The selected curriculum
        is saved with the assignment so the
        student opens the correct quiz even
        when their normal curriculum
        selection is different.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="text-xs font-black uppercase tracking-wide text-slate-500">
            Qualification
          </span>

          <select
            value={qualification}
            onChange={(event) =>
              handleQualificationChange(
                event.target
                  .value as Qualification,
              )
            }
            className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
          >
            <option value="GCSE">
              GCSE
            </option>

            <option value="A_LEVEL">
              A Level
            </option>
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-black uppercase tracking-wide text-slate-500">
            Exam board
          </span>

          <select
            value={examBoard}
            onChange={(event) =>
              handleExamBoardChange(
                event.target
                  .value as ExamBoard,
              )
            }
            className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
          >
            <option value="AQA">
              AQA
            </option>

            <option value="OCR">
              OCR
            </option>

            <option value="EDEXCEL">
              Edexcel
            </option>
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-black uppercase tracking-wide text-slate-500">
            Search quizzes
          </span>

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Quiz title or topic..."
            className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
          />
        </label>
      </div>

      <div className="mt-5 rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm text-slate-700">
        <span className="font-black text-violet-700">
          Current curriculum:
        </span>{" "}
        {examBoard}{" "}
        {qualification === "A_LEVEL"
          ? "A Level"
          : "GCSE"}
        {" · "}
        {curriculumQuizzes.length}{" "}
        {curriculumQuizzes.length === 1
          ? "quiz"
          : "quizzes"}{" "}
        available
      </div>

      {filteredQuizzes.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-center">
          <p className="font-bold text-slate-900">
            No quizzes available
          </p>

          <p className="mt-2 text-sm text-slate-600">
            No published quizzes match
            this qualification, exam board
            and search.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {filteredQuizzes.map(
            ({
              quiz,
              topicId,
              unitId,
              unitTitle,
              qualification:
                quizQualification,
              examBoard:
                quizExamBoard,
            }) => {
              const selected =
                selectedResource?.resourceType ===
                  "quiz" &&
                selectedResource.resourceId ===
                  topicId &&
                selectedResource.qualification ===
                  quizQualification &&
                selectedResource.examBoard ===
                  quizExamBoard;

              return (
                <button
                  key={`${quizQualification}-${quizExamBoard}-${unitId}-${quiz.id}`}
                  type="button"
                  onClick={() =>
                    onSelect({
                      id: quiz.id,

                      title:
                        quiz.title,

                      description:
                        quiz.description,

                      resourceType:
                        "quiz",

                      /*
                       * Built-in secure quiz routing is topic-based,
                       * so the assignment resourceId remains the
                       * canonical topic ID.
                       */
                      resourceId:
                        topicId,

                      quizTopicId:
                        topicId,

                      topicTitle:
                        normalise(
                          topicId,
                        ),

                      questionCount:
                        quiz.questions
                          .length,

                      estimatedTime:
                        quiz.estimatedTime,

                      /*
                       * Critical assignment identity.
                       *
                       * assignment-wizard/page.tsx now passes these
                       * into createAssignment(), and
                       * assignmentService.ts persists them.
                       */
                      qualification:
                        quizQualification,

                      examBoard:
                        quizExamBoard,
                    })
                  }
                  className={`rounded-2xl border p-5 text-left transition ${
                    selected
                      ? "border-violet-600 bg-white ring-2 ring-violet-100"
                      : "border-violet-100 bg-white hover:border-violet-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-violet-700">
                        {unitTitle}
                      </p>

                      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                        {normalise(
                          topicId,
                        )}
                      </p>

                      <h4 className="mt-2 text-lg font-black text-slate-950">
                        {quiz.title}
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {
                          quiz.description
                        }
                      </p>
                    </div>

                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-black ${
                        selected
                          ? "border-violet-600 bg-violet-600 text-white"
                          : "border-slate-300 text-transparent"
                      }`}
                    >
                      ✓
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                      {
                        quiz.questions
                          .length
                      }{" "}
                      questions
                    </span>

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                      {
                        quiz.estimatedTime
                      }
                    </span>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      {
                        quizExamBoard
                      }{" "}
                      {quizQualification ===
                      "A_LEVEL"
                        ? "A Level"
                        : "GCSE"}
                    </span>
                  </div>
                </button>
              );
            },
          )}
        </div>
      )}
    </section>
  );
}