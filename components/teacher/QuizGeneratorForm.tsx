"use client";

import type {
  QuizDifficulty,
  QuizGeneratorSettings,
} from "@/types/generatedQuiz";

type QuizGeneratorFormProps = {
  settings: QuizGeneratorSettings;
  generating: boolean;
  onChange: (settings: QuizGeneratorSettings) => void;
  onSubmit: () => void;
};

export default function QuizGeneratorForm({
  settings,
  generating,
  onChange,
  onSubmit,
}: QuizGeneratorFormProps) {
  function updateSetting<K extends keyof QuizGeneratorSettings>(
    key: K,
    value: QuizGeneratorSettings[K]
  ) {
    onChange({
      ...settings,
      [key]: value,
    });
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2"
    >
      <label className="block md:col-span-2">
        <span className="text-sm font-semibold text-slate-700">
          Topic
        </span>

        <input
          type="text"
          value={settings.topic}
          onChange={(event) =>
            updateSetting("topic", event.target.value)
          }
          placeholder="Example: Binary addition"
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-slate-700">
          Qualification
        </span>

        <select
          value={settings.qualification}
          onChange={(event) =>
            updateSetting("qualification", event.target.value)
          }
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="GCSE">GCSE</option>
          <option value="A Level">A Level</option>
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-slate-700">
          Exam board
        </span>

        <select
          value={settings.examBoard}
          onChange={(event) =>
            updateSetting("examBoard", event.target.value)
          }
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="AQA">AQA</option>
          <option value="OCR">OCR</option>
          <option value="Pearson Edexcel">Pearson Edexcel</option>
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-slate-700">
          Difficulty
        </span>

        <select
          value={settings.difficulty}
          onChange={(event) =>
            updateSetting(
              "difficulty",
              event.target.value as QuizDifficulty
            )
          }
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="foundation">Foundation</option>
          <option value="standard">Standard</option>
          <option value="higher">Higher</option>
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-slate-700">
          Number of questions
        </span>

        <select
          value={settings.questionCount}
          onChange={(event) =>
            updateSetting(
              "questionCount",
              Number(event.target.value)
            )
          }
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          <option value={3}>3 questions</option>
          <option value={5}>5 questions</option>
          <option value={10}>10 questions</option>
          <option value={15}>15 questions</option>
          <option value={20}>20 questions</option>
        </select>
      </label>

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={generating}
          className="w-full rounded-xl bg-indigo-600 px-6 py-4 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {generating ? "Generating Quiz..." : "✨ Generate Quiz"}
        </button>
      </div>
    </form>
  );
}