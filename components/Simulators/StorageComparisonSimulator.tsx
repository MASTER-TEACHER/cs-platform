"use client";

import { useMemo, useState } from "react";
import SimulatorControls from "@/components/Simulators/common/SimulatorControls";
import SimulatorDifficulty from "@/components/Simulators/common/SimulatorDifficulty";
import SimulatorFeedback from "@/components/Simulators/common/SimulatorFeedback";
import SimulatorStats from "@/components/Simulators/common/SimulatorStats";
import {
  useSimulator,
  type SimulatorDifficulty as DifficultyLevel,
} from "@/components/Simulators/common/useSimulator";
import { useProgress } from "@/contexts/ProgressContext";

type DeviceId = "ssd" | "hdd" | "optical";
type ScenarioId = "laptop" | "backup" | "film" | "portable";
type Device = {
  id: DeviceId;
  name: string;
  technology: string;
  speed: number;
  capacity: number;
  durability: number;
  portability: number;
  costEfficiency: number;
  summary: string;
};
type Scenario = {
  id: ScenarioId;
  title: string;
  description: string;
  best: DeviceId;
  reason: string;
  weights: {
    speed: number;
    capacity: number;
    durability: number;
    portability: number;
    costEfficiency: number;
  };
};
const devices: Device[] = [
  {
    id: "ssd",
    name: "Solid-State Drive",
    technology: "Solid state",
    speed: 5,
    capacity: 4,
    durability: 5,
    portability: 5,
    costEfficiency: 3,
    summary:
      "Fast, silent and resistant to shock because it has no moving mechanical parts.",
  },
  {
    id: "hdd",
    name: "Hard Disk Drive",
    technology: "Magnetic",
    speed: 3,
    capacity: 5,
    durability: 2,
    portability: 2,
    costEfficiency: 5,
    summary:
      "High capacities at relatively low cost, but it contains moving mechanical parts.",
  },
  {
    id: "optical",
    name: "Blu-ray Disc",
    technology: "Optical",
    speed: 2,
    capacity: 2,
    durability: 2,
    portability: 4,
    costEfficiency: 4,
    summary:
      "Removable physical media suitable for distribution, with lower capacity and speed.",
  },
];
const scenarios: Scenario[] = [
  {
    id: "laptop",
    title: "School laptop",
    description:
      "A student carries the computer every day and wants fast startup and application loading.",
    best: "ssd",
    reason:
      "An SSD is fast, durable and portable, making it well suited to a mobile laptop.",
    weights: {
      speed: 5,
      capacity: 3,
      durability: 5,
      portability: 5,
      costEfficiency: 2,
    },
  },
  {
    id: "backup",
    title: "Large office backup",
    description:
      "A company needs several terabytes of low-cost backup storage that normally stays in one location.",
    best: "hdd",
    reason:
      "An HDD provides large capacity at a lower cost per GB when portability is not important.",
    weights: {
      speed: 2,
      capacity: 5,
      durability: 3,
      portability: 1,
      costEfficiency: 5,
    },
  },
  {
    id: "film",
    title: "Physical film distribution",
    description:
      "A film company wants inexpensive removable physical media for customers.",
    best: "optical",
    reason:
      "Optical media is removable and can be distributed physically at relatively low cost.",
    weights: {
      speed: 1,
      capacity: 3,
      durability: 2,
      portability: 5,
      costEfficiency: 5,
    },
  },
  {
    id: "portable",
    title: "Photographer in the field",
    description:
      "Large photographs must be copied quickly to storage that travels between locations.",
    best: "ssd",
    reason:
      "An SSD combines high transfer speed with shock resistance and portability.",
    weights: {
      speed: 5,
      capacity: 4,
      durability: 5,
      portability: 5,
      costEfficiency: 2,
    },
  },
];
function score(d: Device, s: Scenario) {
  return (
    d.speed * s.weights.speed +
    d.capacity * s.weights.capacity +
    d.durability * s.weights.durability +
    d.portability * s.weights.portability +
    d.costEfficiency * s.weights.costEfficiency
  );
}
function stars(n: number) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}
type ComparisonQuestion = {
  scenario: Scenario;
  prompt: string;
  options: string[];
  answer: string;
  hint: string;
  working: string;
  examinerTip: string;
};
function createQuestion(d: DifficultyLevel): ComparisonQuestion {
  const index =
    d === "foundation"
      ? 0
      : d === "intermediate"
        ? Math.floor(Math.random() * 2) + 1
        : Math.floor(Math.random() * scenarios.length);
  const s = scenarios[index];
  const best = devices.find((x) => x.id === s.best)!;
  return {
    scenario: s,
    prompt: `Which storage device is the best choice for this scenario? ${s.description}`,
    options: devices.map((x) => x.name),
    answer: best.name,
    hint: "Match the user's most important requirements to the properties of each storage technology.",
    working: `Best choice: ${best.name}. ${s.reason}`,
    examinerTip:
      "In exam answers, name the device and justify it using at least one requirement from the scenario.",
  };
}

export default function StorageComparisonSimulator() {
  const { addXP } = useProgress();
  const simulator = useSimulator<ComparisonQuestion>({
    initialQuestion: createQuestion("foundation"),
    generateQuestion: createQuestion,
    onAwardXP: addXP,
    simulatorId: "storage-comparison",
  });
  const [answer, setAnswer] = useState("");
  const [scenarioId, setScenarioId] = useState<ScenarioId>("laptop");
  const scenario = scenarios.find((x) => x.id === scenarioId) ?? scenarios[0];
  const ranked = useMemo(
    () =>
      devices
        .map((d) => ({ ...d, score: score(d, scenario) }))
        .sort((a, b) => b.score - a.score),
    [scenario],
  );
  const changeDifficulty = (d: DifficultyLevel) => {
    setAnswer("");
    simulator.changeDifficulty(d);
  };
  const retry = () => {
    setAnswer("");
    simulator.resetQuestion();
  };
  const next = () => {
    setAnswer("");
    simulator.newQuestion();
  };
  return (
    <section className="rounded-3xl border border-blue-200 bg-white p-6 shadow-sm md:p-8">
      <p className="text-xs font-black uppercase tracking-widest text-blue-600">
        Storage decision laboratory
      </p>
      <h2 className="mt-2 text-3xl font-black">Storage Device Challenge</h2>
      <p className="mt-3 max-w-3xl leading-7 text-slate-600">
        Choose suitable storage for real scenarios, then explore how changing
        requirements affects the recommendation.
      </p>
      <div className="mt-6">
        <SimulatorDifficulty
          value={simulator.difficulty}
          onChange={changeDifficulty}
        />
      </div>
      <div className="mt-5">
        <SimulatorStats
          attempts={simulator.attempts}
          correct={simulator.correctAnswers}
          accuracy={simulator.accuracy}
          xp={simulator.xp}
          streak={simulator.streak}
        />
      </div>
      <section className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <p className="text-xs font-black uppercase tracking-widest text-blue-600">
          Current challenge
        </p>
        <h3 className="mt-2 text-xl font-black">{simulator.question.prompt}</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {simulator.question.options.map((o) => (
            <button
              key={o}
              type="button"
              disabled={simulator.checked}
              onClick={() => setAnswer(o)}
              className={`rounded-xl border-2 p-4 font-black ${answer === o ? "border-blue-600 bg-white text-blue-700" : "border-slate-200 bg-white"}`}
            >
              {o}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <SimulatorControls
            canCheck={Boolean(answer)}
            checked={simulator.checked}
            hintVisible={simulator.hintVisible}
            workingVisible={simulator.workingVisible}
            onCheck={() =>
              simulator.markAnswer(answer === simulator.question.answer)
            }
            onHint={simulator.toggleHint}
            onToggleWorking={simulator.toggleWorking}
            onReset={retry}
            onNewExample={next}
            newExampleLabel="New scenario"
          />
        </div>
      </section>
      <div className="mt-4">
        <SimulatorFeedback
          checked={simulator.checked}
          correct={simulator.correct}
          hintVisible={simulator.hintVisible}
          hint={simulator.question.hint}
          workingVisible={simulator.workingVisible}
          working={simulator.question.working}
          successMessage="Correct. You matched the storage technology to the scenario."
          errorMessage={`Not quite. The best choice is ${simulator.question.answer}.`}
          examinerTip={simulator.question.examinerTip}
        />
      </div>
      <div className="my-8 border-t border-slate-200" />
      <p className="text-xs font-black uppercase tracking-widest text-violet-600">
        Hands-on comparison explorer
      </p>
      <h3 className="mt-2 text-2xl font-black">Change the scenario</h3>
      <label className="mt-5 block rounded-3xl bg-blue-50 p-6">
        <select
          value={scenarioId}
          onChange={(e) => setScenarioId(e.target.value as ScenarioId)}
          className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 font-bold"
        >
          {scenarios.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
        <p className="mt-4 leading-7 text-blue-950">{scenario.description}</p>
      </label>
      <div className="mt-7 grid gap-6 xl:grid-cols-3">
        {ranked.map((d, i) => (
          <article
            key={d.id}
            className={`rounded-3xl border p-6 ${i === 0 ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"}`}
          >
            <div className="flex justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-blue-600">
                  {d.technology}
                </p>
                <h4 className="mt-2 text-xl font-black">{d.name}</h4>
              </div>
              {i === 0 && (
                <span className="h-fit rounded-full bg-emerald-600 px-3 py-1 text-xs font-black text-white">
                  Recommended
                </span>
              )}
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{d.summary}</p>
            <div className="mt-5 space-y-2 text-sm">
              <p>
                Speed <b>{stars(d.speed)}</b>
              </p>
              <p>
                Capacity <b>{stars(d.capacity)}</b>
              </p>
              <p>
                Durability <b>{stars(d.durability)}</b>
              </p>
              <p>
                Portability <b>{stars(d.portability)}</b>
              </p>
              <p>
                Cost efficiency <b>{stars(d.costEfficiency)}</b>
              </p>
            </div>
            <div className="mt-5 rounded-xl bg-white/80 p-4">
              <p className="text-xs font-black uppercase text-slate-500">
                Scenario score
              </p>
              <p className="mt-1 text-2xl font-black">{d.score}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
