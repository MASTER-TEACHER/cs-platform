"use client";

import { useMemo, useState } from "react";

import {
  getCurriculumDefinition,
  type CurriculumUnitDefinition,
} from "@/data/curriculum/curriculumMap";
import { topicLibrary } from "@/data/curriculum/topics";
import { createLessonAssignmentResourceId } from "@/services/lessonAssignmentService";
import type { AssignmentWizardResource } from "@/types/assignmentWizard";
import type { Topic } from "@/types/curriculum";

type Qualification = "GCSE" | "A_LEVEL";
type ExamBoard = "AQA" | "OCR" | "EDEXCEL";
type Props = {
  selectedResource: AssignmentWizardResource | null;
  onSelect: (resource: AssignmentWizardResource) => void;
};

const qualificationOptions: Array<{
  value: Qualification;
  label: string;
}> = [
  { value: "GCSE", label: "GCSE" },
  { value: "A_LEVEL", label: "A-Level" },
];

const examBoards: ExamBoard[] = [
  "AQA",
  "OCR",
  "EDEXCEL",
];

function difficultyLabel(
  difficulty: Topic["difficulty"],
): string {
  if (
  difficulty ===
  "\u2B50\u2B50\u2B50"
) {
  return "Advanced";
}

if (
  difficulty ===
  "\u2B50\u2B50\u2606"
) {
  return "Intermediate";
}

return "Foundation";
}

export default function LessonAssignmentSelector({
  selectedResource,
  onSelect,
}: Props) {
  const [qualification, setQualification] =
    useState<Qualification>(
      selectedResource?.qualification ?? "GCSE",
    );

 const [examBoard, setExamBoard] =
  useState<ExamBoard>(
    (selectedResource?.examBoard as ExamBoard) ??
      "AQA",
  );

  const [searchTerm, setSearchTerm] = useState("");

  const curriculum = useMemo(
    () => getCurriculumDefinition(qualification, examBoard),
    [qualification, examBoard],
  );

  const lessonOptions = useMemo(() => {
    if (!curriculum) {
      return [];
    }

    const search = searchTerm.trim().toLowerCase();

    return curriculum.units.flatMap(
      (unit: CurriculumUnitDefinition, unitIndex: number) =>
        unit.topicIds.flatMap((topicId) => {
          const topic = topicLibrary[topicId];

          if (!topic) {
            return [];
          }

          return topic.lessons
            .filter((lesson) => {
              if (!search) return true;

              return [
                unit.title,
                topic.title,
                topic.description,
                lesson.title,
                lesson.description,
              ].some((value) =>
                value.toLowerCase().includes(search),
              );
            })
            .map((lesson) => ({
              unitId: unit.id,
              unitTitle: unit.title,
              unitNumber: unitIndex + 1,
              topic,
              lesson,
            }));
        }),
    );
  }, [curriculum, searchTerm]);

  const selectedLessonId =
    selectedResource?.resourceType === "lesson"
      ? selectedResource.lessonId
      : null;

  return (
    <section className="mt-8 rounded-3xl border border-blue-200 bg-blue-50/50 p-5 sm:p-6">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
        Lesson library
      </p>

      <h3 className="mt-2 text-xl font-black text-slate-950">
        Choose the exact lesson
      </h3>

      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
        Students will open the exact interactive lesson selected here.
        Completing that lesson will automatically complete the assignment.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <label className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wide text-slate-500">
            Qualification
          </span>

          <select
            value={qualification}
            onChange={(event) => {
              setQualification(event.target.value as Qualification);
              setSearchTerm("");
            }}
            className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            {qualificationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wide text-slate-500">
            Exam board
          </span>

          <select
            value={examBoard}
            onChange={(event) => {
  setExamBoard(
    event.target.value as ExamBoard,
  );
  setSearchTerm("");
}}
            className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            {examBoards.map((board) => (
              <option key={board} value={board}>
                {board}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wide text-slate-500">
            Search
          </span>

          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Lesson, topic, unit..."
            className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </label>
      </div>

      {!curriculum ? (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-semibold text-amber-800">
          No curriculum definition is available for this qualification and exam board.
        </div>
      ) : lessonOptions.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
          No lessons match these filters.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {lessonOptions.map(
            ({
              unitId,
              unitTitle,
              unitNumber,
              topic,
              lesson,
            }) => {
              const selected =
                selectedLessonId === lesson.id &&
                selectedResource?.topicId === topic.id;

              return (
                <button
                  key={`${unitId}-${topic.id}-${lesson.id}`}
                  type="button"
                  onClick={() =>
                    onSelect({
                      id: lesson.id,
                      title: lesson.title,
                      description: lesson.description,
                      resourceType: "lesson",
                      resourceId:
                        createLessonAssignmentResourceId(
                          topic.id,
                          lesson.id,
                        ),
                      topicId: topic.id,
                      lessonId: lesson.id,
                      topicTitle: topic.title,
                      qualification,
                      examBoard,
                    })
                  }
                  className={`rounded-2xl border p-5 text-left transition ${
                    selected
                      ? "border-blue-600 bg-white ring-2 ring-blue-100"
                      : "border-blue-100 bg-white hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-blue-600">
                        Unit {unitNumber} · {unitTitle}
                      </p>

                      <p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                        {topic.title}
                      </p>

                      <h4 className="mt-2 text-lg font-black text-slate-950">
                        {lesson.title}
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {lesson.description}
                      </p>
                    </div>

                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-black ${
                        selected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300 text-transparent"
                      }`}
                    >
                      ✓
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                      {lesson.estimatedTime}
                    </span>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      {lesson.xpReward} XP
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      {difficultyLabel(topic.difficulty)}
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
