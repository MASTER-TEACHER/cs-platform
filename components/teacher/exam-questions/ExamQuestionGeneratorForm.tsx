"use client";

import AssessmentBlueprintBuilder from "@/components/teacher/exam-questions/AssessmentBlueprintBuilder";
import type {
  AssessmentGenerationMode,
  ExamQuestionGeneratorSettings,
} from "@/types/examQuestion";

type Props = {
  settings: ExamQuestionGeneratorSettings;
  generating: boolean;
  onChange: (settings: ExamQuestionGeneratorSettings) => void;
  onSubmit: () => void;
};

export default function ExamQuestionGeneratorForm({
  settings,
  generating,
  onChange,
  onSubmit,
}: Props) {
  function updateField<Key extends keyof ExamQuestionGeneratorSettings>(
    key: Key,
    value: ExamQuestionGeneratorSettings[Key],
  ) {
    onChange({
      ...settings,
      [key]: value,
    });
  }

  const totalMarks = settings.blueprint.reduce(
    (sum, item) => sum + item.marks,
    0,
  );

  return (
    <div className="mt-8 space-y-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label>
          <span className="text-sm font-bold text-slate-700">Main topic</span>

          <input
            value={settings.topic}
            onChange={(event) => {
              const previousTopic = settings.topic.trim();

              const nextTopic = event.target.value;

              onChange({
                ...settings,
                topic: nextTopic,
                blueprint: settings.blueprint.map((item) => {
                  const currentFocus = item.topicFocus.trim();

                  const shouldSync =
                    !currentFocus ||
                    currentFocus === "Computer Science" ||
                    currentFocus === previousTopic;

                  return shouldSync
                    ? {
                        ...item,
                        topicFocus: nextTopic,
                      }
                    : item;
                }),
              });
            }}
            placeholder="e.g. Binary arithmetic"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </label>

        <label>
          <span className="text-sm font-bold text-slate-700">
            Qualification
          </span>

          <select
            value={settings.qualification}
            onChange={(event) =>
              updateField("qualification", event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          >
            <option value="GCSE">GCSE</option>

            <option value="A Level">A Level</option>
          </select>
        </label>

        <label>
          <span className="text-sm font-bold text-slate-700">
            Exam board alignment
          </span>

          <select
            value={settings.examBoard}
            onChange={(event) => updateField("examBoard", event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          >
            <option value="AQA">AQA-style</option>

            <option value="OCR">OCR-style</option>

            <option value="Pearson Edexcel">Pearson Edexcel-style</option>

            <option value="WJEC">WJEC-style</option>

            <option value="Eduqas">Eduqas-style</option>

            <option value="Cambridge International">
              Cambridge International-style
            </option>
          </select>
        </label>

        <label>
          <span className="text-sm font-bold text-slate-700">
            Default difficulty
          </span>

          <select
            value={settings.difficulty}
            onChange={(event) =>
              updateField(
                "difficulty",
                event.target
                  .value as ExamQuestionGeneratorSettings["difficulty"],
              )
            }
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          >
            <option value="foundation">Foundation</option>

            <option value="standard">Standard</option>

            <option value="higher">Higher</option>
          </select>
        </label>
      </div>

      <fieldset className="rounded-2xl border border-slate-200 p-5">
        <legend className="px-2 text-sm font-bold text-slate-700">
          Blueprint mode
        </legend>

        <div className="grid gap-3 md:grid-cols-2">
          {(
            [
              {
                value: "automatic",
                title: "Automatic blueprint",
                description:
                  "Start with a balanced AO1, AO2 and AO3 structure, then edit any question.",
              },
              {
                value: "manual",
                title: "Manual blueprint",
                description:
                  "Choose every question type, mark value, command word and assessment objective.",
              },
            ] as Array<{
              value: AssessmentGenerationMode;
              title: string;
              description: string;
            }>
          ).map((option) => (
            <label
              key={option.value}
              className={`cursor-pointer rounded-2xl border p-4 transition ${
                settings.generationMode === option.value
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-slate-200 bg-white hover:border-indigo-300"
              }`}
            >
              <input
                type="radio"
                name="generationMode"
                value={option.value}
                checked={settings.generationMode === option.value}
                disabled={generating}
                onChange={() => updateField("generationMode", option.value)}
              />

              <span className="ml-3 font-black text-slate-950">
                {option.title}
              </span>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {option.description}
              </p>
            </label>
          ))}
        </div>
      </fieldset>

      <AssessmentBlueprintBuilder
        topic={settings.topic}
        defaultDifficulty={settings.difficulty}
        blueprint={settings.blueprint}
        disabled={generating}
        onChange={(blueprint) => updateField("blueprint", blueprint)}
      />

      <div className="flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-black text-emerald-950">Ready to generate</p>

          <p className="mt-1 text-sm text-emerald-800">
            {settings.blueprint.length} questions · {totalMarks} marks ·
            approximately {Math.max(10, Math.ceil(totalMarks * 1.2))} minutes
          </p>
        </div>

        <button
          type="button"
          disabled={
            generating ||
            !settings.topic.trim() ||
            settings.blueprint.length === 0
          }
          onClick={onSubmit}
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {generating ? "Generating..." : "Generate Exam-Style Paper"}
        </button>
      </div>
    </div>
  );
}
