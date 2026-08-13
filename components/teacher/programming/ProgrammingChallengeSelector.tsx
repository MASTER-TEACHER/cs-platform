"use client";

import { useMemo, useState } from "react";

import { allProgrammingChallenges } from "@/data/programming/challenges";
import type {
  ProgrammingChallenge,
  ProgrammingDifficulty,
  ProgrammingExamBoard,
  ProgrammingQualification,
} from "@/types/programming";

type Props = {
  selectedChallengeId: string | null;
  onSelect: (challenge: ProgrammingChallenge) => void;
};

type ModeFilter = "all" | "practice" | "debug";

export default function ProgrammingChallengeSelector({
  selectedChallengeId,
  onSelect,
}: Props) {
  const [qualification, setQualification] =
    useState<ProgrammingQualification>("GCSE");
  const [examBoard, setExamBoard] =
    useState<ProgrammingExamBoard>("AQA");
  const [difficulty, setDifficulty] =
    useState<ProgrammingDifficulty>("foundation");
  const [mode, setMode] = useState<ModeFilter>("all");
  const [search, setSearch] = useState("");

  const challenges = useMemo(() => {
    const term = search.trim().toLowerCase();

    return allProgrammingChallenges
      .filter((challenge) =>
        challenge.qualifications.includes(qualification),
      )
      .filter(
        (challenge) =>
          !challenge.examBoards ||
          challenge.examBoards.length === 0 ||
          challenge.examBoards.includes(examBoard),
      )
      .filter(
        (challenge) =>
          challenge.difficulty === difficulty,
      )
      .filter(
        (challenge) =>
          mode === "all" || challenge.mode === mode,
      )
      .filter(
        (challenge) =>
          !term ||
          challenge.title.toLowerCase().includes(term) ||
          challenge.description
            .toLowerCase()
            .includes(term) ||
          challenge.topicId
            .toLowerCase()
            .includes(term) ||
          challenge.skills.some((skill) =>
            skill.toLowerCase().includes(term),
          ),
      )
      .sort((a, b) =>
        a.title.localeCompare(b.title),
      );
  }, [
    difficulty,
    examBoard,
    mode,
    qualification,
    search,
  ]);

  return (
    <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50/40 p-6">
      <p className="text-sm font-black uppercase tracking-wide text-blue-700">
        Programming challenge library
      </p>

      <h3 className="mt-2 text-xl font-black text-slate-950">
        Choose the exact challenge
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        The selected challenge is locked into the assignment. Students
        will open this exact task rather than receiving an adaptive
        challenge.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Select
          label="Qualification"
          value={qualification}
          onChange={(value) =>
            setQualification(
              value as ProgrammingQualification,
            )
          }
          options={[
            ["GCSE", "GCSE"],
            ["A_LEVEL", "A-Level"],
          ]}
        />

        <Select
          label="Exam board"
          value={examBoard}
          onChange={(value) =>
            setExamBoard(
              value as ProgrammingExamBoard,
            )
          }
          options={[
            ["AQA", "AQA"],
            ["OCR", "OCR"],
            ["EDEXCEL", "Edexcel"],
          ]}
        />

        <Select
          label="Difficulty"
          value={difficulty}
          onChange={(value) =>
            setDifficulty(
              value as ProgrammingDifficulty,
            )
          }
          options={[
            ["foundation", "Foundation"],
            ["intermediate", "Intermediate"],
            ["higher", "Higher"],
          ]}
        />

        <Select
          label="Mode"
          value={mode}
          onChange={(value) =>
            setMode(value as ModeFilter)
          }
          options={[
            ["all", "All"],
            ["practice", "Practice"],
            ["debug", "Debug"],
          ]}
        />

        <label className="block">
          <span className="text-xs font-black uppercase tracking-wide text-slate-500">
            Search
          </span>

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Title, topic, skill..."
            className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500"
          />
        </label>
      </div>

      {challenges.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white p-6 text-center text-slate-600">
          No programming challenges match these filters.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {challenges.map((challenge) => {
            const selected =
              selectedChallengeId === challenge.id;

            return (
              <button
                key={challenge.id}
                type="button"
                onClick={() => onSelect(challenge)}
                className={`rounded-2xl border p-5 text-left transition ${
                  selected
                    ? "border-blue-600 bg-white ring-2 ring-blue-100"
                    : "border-blue-100 bg-white hover:border-blue-300"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-blue-600">
                      {challenge.mode} ·{" "}
                      {challenge.difficulty}
                    </p>

                    <h4 className="mt-2 font-black text-slate-950">
                      {challenge.title}
                    </h4>
                  </div>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-black ${
                      selected
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-300 text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {challenge.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                    {challenge.topicId}
                  </span>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                    {challenge.xpReward} XP
                  </span>

                  <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                    ~{challenge.estimatedMinutes} min
                  </span>

                  {challenge.skills
                    .slice(0, 4)
                    .map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-blue-50 px-3 py-1 text-blue-700"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<[string, string]>;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold outline-none focus:border-blue-500"
      >
        {options.map(
          ([optionValue, optionLabel]) => (
            <option
              key={optionValue}
              value={optionValue}
            >
              {optionLabel}
            </option>
          ),
        )}
      </select>
    </label>
  );
}
