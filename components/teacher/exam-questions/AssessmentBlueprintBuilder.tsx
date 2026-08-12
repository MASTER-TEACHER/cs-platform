"use client";

import {
  ArrowDown,
  ArrowUp,
  Copy,
  Plus,
  RefreshCcw,
  Trash2,
} from "lucide-react";

import type {
  AssessmentBlueprintItem,
  AssessmentObjective,
  AssessmentQuestionType,
  ExamQuestionCommandWord,
  ExamQuestionDifficulty,
} from "@/types/examQuestion";

type Props = {
  topic: string;
  defaultDifficulty: ExamQuestionDifficulty;
  blueprint: AssessmentBlueprintItem[];
  disabled?: boolean;
  onChange: (blueprint: AssessmentBlueprintItem[]) => void;
};

const OBJECTIVE_OPTIONS: {
  value: AssessmentObjective;
  label: string;
}[] = [
  {
    value: "AO1",
    label: "AO1 — Knowledge and understanding",
  },
  {
    value: "AO2",
    label: "AO2 — Application",
  },
  {
    value: "AO3",
    label: "AO3 — Analysis, evaluation and design",
  },
];

const QUESTION_TYPE_OPTIONS: {
  value: AssessmentQuestionType;
  label: string;
}[] = [
  { value: "multiple-choice", label: "Multiple Choice" },
  { value: "state-identify", label: "State / Identify" },
  { value: "short-response", label: "Short Response" },
  { value: "definition", label: "Definition" },
  { value: "conversion", label: "Conversion" },
  { value: "calculation", label: "Calculation" },
  { value: "worked-calculation", label: "Worked Calculation" },
  { value: "complete-table", label: "Complete a Table" },
  { value: "trace-table", label: "Trace Table" },
  { value: "truth-table", label: "Truth Table" },
  { value: "code-completion", label: "Code Completion" },
  { value: "code-tracing", label: "Code Tracing" },
  { value: "debugging", label: "Debugging" },
  { value: "algorithm-design", label: "Algorithm Design" },
  { value: "compare", label: "Compare" },
  { value: "explain", label: "Explain" },
  { value: "scenario-application", label: "Scenario Application" },
  { value: "extended-response", label: "Extended Response" },
  { value: "discuss", label: "Discuss" },
  { value: "evaluate", label: "Evaluate" },
];

const COMMAND_WORD_OPTIONS: {
  value: ExamQuestionCommandWord;
  label: string;
}[] = [
  { value: "state", label: "State" },
  { value: "identify", label: "Identify" },
  { value: "define", label: "Define" },
  { value: "describe", label: "Describe" },
  { value: "explain", label: "Explain" },
  { value: "compare", label: "Compare" },
  { value: "calculate", label: "Calculate" },
  { value: "complete", label: "Complete" },
  { value: "write", label: "Write" },
  { value: "trace", label: "Trace" },
  { value: "debug", label: "Debug" },
  { value: "design", label: "Design" },
  { value: "evaluate", label: "Evaluate" },
  { value: "discuss", label: "Discuss" },
];

const DIFFICULTY_OPTIONS: {
  value: ExamQuestionDifficulty;
  label: string;
}[] = [
  { value: "foundation", label: "Foundation" },
  { value: "standard", label: "Standard" },
  { value: "higher", label: "Higher" },
];

const DEFAULT_BLUEPRINT_PATTERN = [
  {
    assessmentObjective: "AO1" as const,
    questionType: "multiple-choice" as const,
    commandWord: "identify" as const,
    marks: 1,
  },
  {
    assessmentObjective: "AO1" as const,
    questionType: "conversion" as const,
    commandWord: "calculate" as const,
    marks: 2,
  },
  {
    assessmentObjective: "AO2" as const,
    questionType: "worked-calculation" as const,
    commandWord: "complete" as const,
    marks: 4,
  },
  {
    assessmentObjective: "AO3" as const,
    questionType: "evaluate" as const,
    commandWord: "evaluate" as const,
    marks: 6,
  },
];

function createBlueprintId(): string {
  return `blueprint-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function renumber(
  blueprint: AssessmentBlueprintItem[],
): AssessmentBlueprintItem[] {
  return blueprint.map((item, index) => ({
    ...item,
    questionNumber: index + 1,
  }));
}

function commandWordForType(
  questionType: AssessmentQuestionType,
): ExamQuestionCommandWord {
  const mapping: Record<AssessmentQuestionType, ExamQuestionCommandWord> = {
    "multiple-choice": "identify",
    "state-identify": "state",
    "short-response": "describe",
    definition: "define",
    conversion: "calculate",
    calculation: "calculate",
    "worked-calculation": "complete",
    "complete-table": "complete",
    "trace-table": "trace",
    "truth-table": "complete",
    "code-completion": "complete",
    "code-tracing": "trace",
    debugging: "debug",
    "algorithm-design": "design",
    compare: "compare",
    explain: "explain",
    "scenario-application": "explain",
    "extended-response": "discuss",
    discuss: "discuss",
    evaluate: "evaluate",
  };

  return mapping[questionType];
}

export function createBalancedBlueprint(
  topic: string,
  defaultDifficulty: ExamQuestionDifficulty,
): AssessmentBlueprintItem[] {
  const topicFocus = topic.trim() || "Computer Science";

  return DEFAULT_BLUEPRINT_PATTERN.map((pattern, index) => ({
    id: createBlueprintId(),
    questionNumber: index + 1,
    assessmentObjective: pattern.assessmentObjective,
    questionType: pattern.questionType,
    commandWord: pattern.commandWord,
    marks: pattern.marks,
    difficulty:
      index === 0
        ? "foundation"
        : index === DEFAULT_BLUEPRINT_PATTERN.length - 1
          ? "higher"
          : defaultDifficulty,
    topicFocus,
  }));
}

export default function AssessmentBlueprintBuilder({
  topic,
  defaultDifficulty,
  blueprint,
  disabled = false,
  onChange,
}: Props) {
  const totalMarks = blueprint.reduce((sum, item) => sum + item.marks, 0);

  const objectiveTotals = blueprint.reduce(
    (totals, item) => {
      totals[item.assessmentObjective] += item.marks;
      return totals;
    },
    {
      AO1: 0,
      AO2: 0,
      AO3: 0,
    },
  );

  function updateItem<Key extends keyof AssessmentBlueprintItem>(
    itemId: string,
    key: Key,
    value: AssessmentBlueprintItem[Key],
  ) {
    onChange(
      blueprint.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        if (key === "questionType") {
          const nextType = value as AssessmentQuestionType;

          return {
            ...item,
            questionType: nextType,
            commandWord: commandWordForType(nextType),
          };
        }

        return {
          ...item,
          [key]: value,
        };
      }),
    );
  }

  function addQuestion() {
    const previous = blueprint[blueprint.length - 1];

    onChange(
      renumber([
        ...blueprint,
        {
          id: createBlueprintId(),
          questionNumber: blueprint.length + 1,
          assessmentObjective: previous?.assessmentObjective || "AO1",
          questionType: "short-response",
          commandWord: "describe",
          marks: 2,
          difficulty: previous?.difficulty || defaultDifficulty,
          topicFocus:
            previous?.topicFocus || topic.trim() || "Computer Science",
        },
      ]),
    );
  }

  function duplicateQuestion(itemId: string) {
    const index = blueprint.findIndex((item) => item.id === itemId);

    if (index === -1) {
      return;
    }

    const copy = {
      ...blueprint[index],
      id: createBlueprintId(),
    };

    onChange(
      renumber([
        ...blueprint.slice(0, index + 1),
        copy,
        ...blueprint.slice(index + 1),
      ]),
    );
  }

  function removeQuestion(itemId: string) {
    if (blueprint.length <= 1) {
      return;
    }

    onChange(renumber(blueprint.filter((item) => item.id !== itemId)));
  }

  function moveQuestion(itemId: string, direction: -1 | 1) {
    const index = blueprint.findIndex((item) => item.id === itemId);

    const target = index + direction;

    if (index < 0 || target < 0 || target >= blueprint.length) {
      return;
    }

    const next = [...blueprint];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);

    onChange(renumber(next));
  }

  function percentage(value: number): number {
    return totalMarks === 0 ? 0 : Math.round((value / totalMarks) * 100);
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-indigo-700">
            Assessment blueprint
          </p>

          <p className="mt-1 text-sm leading-6 text-indigo-900">
            Choose the assessment objective, question type, command word, marks,
            difficulty and topic focus for every question.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            onChange(createBalancedBlueprint(topic, defaultDifficulty))
          }
          disabled={disabled}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-indigo-300 bg-white px-4 py-2.5 text-sm font-bold text-indigo-800 transition hover:bg-indigo-100 disabled:opacity-50"
        >
          <RefreshCcw className="h-4 w-4" />
          Balanced blueprint
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Questions" value={String(blueprint.length)} />
        <SummaryCard label="Total marks" value={String(totalMarks)} />
        <SummaryCard
          label="AO1"
          value={`${percentage(objectiveTotals.AO1)}%`}
        />
        <SummaryCard
          label="AO2 / AO3"
          value={`${percentage(objectiveTotals.AO2)}% / ${percentage(objectiveTotals.AO3)}%`}
        />
      </div>

      <div className="space-y-4">
        {blueprint.map((item, index) => (
          <article
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">
                  Question {item.questionNumber}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Configure this question before generation.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={disabled || index === 0}
                  onClick={() => moveQuestion(item.id, -1)}
                  className="rounded-lg border border-slate-300 p-2 text-slate-600 transition hover:bg-slate-50 disabled:opacity-30"
                  aria-label={`Move question ${item.questionNumber} up`}
                >
                  <ArrowUp className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  disabled={disabled || index === blueprint.length - 1}
                  onClick={() => moveQuestion(item.id, 1)}
                  className="rounded-lg border border-slate-300 p-2 text-slate-600 transition hover:bg-slate-50 disabled:opacity-30"
                  aria-label={`Move question ${item.questionNumber} down`}
                >
                  <ArrowDown className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => duplicateQuestion(item.id)}
                  className="rounded-lg border border-slate-300 p-2 text-slate-600 transition hover:bg-slate-50 disabled:opacity-30"
                  aria-label={`Duplicate question ${item.questionNumber}`}
                >
                  <Copy className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  disabled={disabled || blueprint.length <= 1}
                  onClick={() => removeQuestion(item.id)}
                  className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-30"
                  aria-label={`Delete question ${item.questionNumber}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <label>
                <span className="text-sm font-bold text-slate-700">
                  Assessment objective
                </span>

                <select
                  value={item.assessmentObjective}
                  disabled={disabled}
                  onChange={(event) =>
                    updateItem(
                      item.id,
                      "assessmentObjective",
                      event.target.value as AssessmentObjective,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                  {OBJECTIVE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="text-sm font-bold text-slate-700">
                  Question type
                </span>

                <select
                  value={item.questionType}
                  disabled={disabled}
                  onChange={(event) =>
                    updateItem(
                      item.id,
                      "questionType",
                      event.target.value as AssessmentQuestionType,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                  {QUESTION_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="text-sm font-bold text-slate-700">
                  Command word
                </span>

                <select
                  value={item.commandWord}
                  disabled={disabled}
                  onChange={(event) =>
                    updateItem(
                      item.id,
                      "commandWord",
                      event.target.value as ExamQuestionCommandWord,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                  {COMMAND_WORD_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="text-sm font-bold text-slate-700">Marks</span>

                <select
                  value={item.marks}
                  disabled={disabled}
                  onChange={(event) =>
                    updateItem(item.id, "marks", Number(event.target.value))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                  {Array.from({ length: 12 }, (_, markIndex) => {
                    const mark = markIndex + 1;

                    return (
                      <option key={mark} value={mark}>
                        {mark} {mark === 1 ? "mark" : "marks"}
                      </option>
                    );
                  })}
                </select>
              </label>

              <label>
                <span className="text-sm font-bold text-slate-700">
                  Difficulty
                </span>

                <select
                  value={item.difficulty}
                  disabled={disabled}
                  onChange={(event) =>
                    updateItem(
                      item.id,
                      "difficulty",
                      event.target.value as ExamQuestionDifficulty,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                  {DIFFICULTY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="text-sm font-bold text-slate-700">
                  Topic focus
                </span>

                <input
                  value={item.topicFocus}
                  disabled={disabled}
                  onChange={(event) =>
                    updateItem(item.id, "topicFocus", event.target.value)
                  }
                  placeholder="e.g. Binary subtraction"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </label>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        onClick={addQuestion}
        disabled={disabled || blueprint.length >= 20}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-indigo-300 bg-white px-5 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50 disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
        Add Question
      </button>
    </section>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}
