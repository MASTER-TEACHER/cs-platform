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

type Unit = "KB" | "MB" | "GB" | "TB";
const unitToMB: Record<Unit, number> = {
  KB: 0.001,
  MB: 1,
  GB: 1000,
  TB: 1_000_000,
};
function formatNumber(value: number) {
  return new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 }).format(
    value,
  );
}

type CapacityQuestion = {
  fileSizeMB: number;
  fileCount: number;
  capacityGB: number;
  prompt: string;
  answer: string;
  hint: string;
  working: string;
  examinerTip: string;
};
function createQuestion(d: DifficultyLevel): CapacityQuestion {
  const config =
    d === "foundation"
      ? { size: 5, count: 200, cap: 2 }
      : d === "intermediate"
        ? { size: 25, count: 120, cap: 4 }
        : { size: 350, count: 18, cap: 6 };
  const total = config.size * config.count;
  const capacity = config.cap * 1000;
  const answer = total <= capacity ? "Yes" : "No";
  return {
    fileSizeMB: config.size,
    fileCount: config.count,
    capacityGB: config.cap,
    prompt: `Will ${config.count} files of ${config.size} MB each fit on a ${config.cap} GB device?`,
    answer,
    hint: "Convert the device capacity to MB before comparing totals.",
    working: `${config.cap} GB = ${capacity} MB. Files require ${config.count} × ${config.size} MB = ${total} MB. Therefore the answer is ${answer}.`,
    examinerTip:
      "Show the unit conversion and multiplication before giving the final comparison.",
  };
}

export default function StorageCapacitySimulator() {
  const { addXP } = useProgress();
  const simulator = useSimulator<CapacityQuestion>({
    initialQuestion: createQuestion("foundation"),
    generateQuestion: createQuestion,
    onAwardXP: addXP,
    simulatorId: "storage-capacity",
  });
  const [answer, setAnswer] = useState("");
  const [fileSize, setFileSize] = useState(5);
  const [fileUnit, setFileUnit] = useState<Unit>("MB");
  const [fileCount, setFileCount] = useState(200);
  const [deviceCapacity, setDeviceCapacity] = useState(32);
  const [deviceUnit, setDeviceUnit] = useState<Unit>("GB");
  const result = useMemo(() => {
    const oneFileMB = Math.max(0, fileSize) * unitToMB[fileUnit];
    const totalRequiredMB = oneFileMB * Math.max(0, fileCount);
    const capacityMB = Math.max(0, deviceCapacity) * unitToMB[deviceUnit];
    return {
      totalRequiredMB,
      capacityMB,
      maximumFiles: oneFileMB > 0 ? Math.floor(capacityMB / oneFileMB) : 0,
      fits: totalRequiredMB <= capacityMB,
      remainingMB: Math.max(0, capacityMB - totalRequiredMB),
      usagePercentage:
        capacityMB > 0
          ? Math.min(100, Math.round((totalRequiredMB / capacityMB) * 100))
          : 0,
    };
  }, [deviceCapacity, deviceUnit, fileCount, fileSize, fileUnit]);
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
        Storage laboratory
      </p>
      <h2 className="mt-2 text-3xl font-black text-slate-950">
        Storage Capacity Challenge
      </h2>
      <p className="mt-3 max-w-3xl leading-7 text-slate-600">
        Practise GCSE decimal storage calculations, then experiment with your
        own file and device values.
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
        <div className="mt-4 flex gap-3">
          {["Yes", "No"].map((option) => (
            <button
              key={option}
              type="button"
              disabled={simulator.checked}
              onClick={() => setAnswer(option)}
              className={`min-w-28 rounded-xl border-2 px-5 py-4 text-xl font-black ${answer === option ? "border-blue-600 bg-white text-blue-700" : "border-slate-200 bg-white"}`}
            >
              {option}
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
            newExampleLabel="New question"
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
          successMessage="Correct. Your storage calculation is accurate."
          errorMessage={`Not quite. The correct answer is ${simulator.question.answer}.`}
          examinerTip={simulator.question.examinerTip}
        />
      </div>

      <div className="my-8 border-t border-slate-200" />
      <p className="text-xs font-black uppercase tracking-widest text-violet-600">
        Hands-on calculator
      </p>
      <h3 className="mt-2 text-2xl font-black">
        Build your own storage calculation
      </h3>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-6">
          <h4 className="text-xl font-black">Files</h4>
          <div className="mt-5 grid grid-cols-[1fr_120px] gap-3">
            <input
              type="number"
              min={0}
              step="0.1"
              value={fileSize}
              onChange={(e) => setFileSize(Number(e.target.value))}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3"
            />
            <select
              value={fileUnit}
              onChange={(e) => setFileUnit(e.target.value as Unit)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3"
            >
              {(["KB", "MB", "GB", "TB"] as Unit[]).map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </div>
          <label className="mt-5 block text-sm font-bold">
            Number of files
            <input
              type="number"
              min={0}
              value={fileCount}
              onChange={(e) =>
                setFileCount(
                  Math.max(0, Math.floor(Number(e.target.value) || 0)),
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            />
          </label>
        </div>
        <div className="rounded-3xl bg-slate-50 p-6">
          <h4 className="text-xl font-black">Storage device</h4>
          <div className="mt-5 grid grid-cols-[1fr_120px] gap-3">
            <input
              type="number"
              min={0}
              step="0.1"
              value={deviceCapacity}
              onChange={(e) => setDeviceCapacity(Number(e.target.value))}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3"
            />
            <select
              value={deviceUnit}
              onChange={(e) => setDeviceUnit(e.target.value as Unit)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3"
            >
              {(["KB", "MB", "GB", "TB"] as Unit[]).map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </div>
          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-bold text-blue-950">
            GCSE decimal conversions: 1 GB = 1000 MB; 1 TB = 1000 GB.
          </div>
        </div>
      </div>
      <div className="mt-7 rounded-3xl border border-slate-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-slate-500">
              Storage required
            </p>
            <p className="mt-1 text-3xl font-black">
              {formatNumber(result.totalRequiredMB)} MB
            </p>
          </div>
          <span
            className={`rounded-full px-5 py-2 text-sm font-black ${result.fits ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}
          >
            {result.fits ? "Files will fit" : "Not enough space"}
          </span>
        </div>
        <div className="mt-6 h-5 overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full ${result.fits ? "bg-blue-600" : "bg-red-500"}`}
            style={{ width: `${result.usagePercentage}%` }}
          />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-bold uppercase text-slate-500">
              Capacity
            </p>
            <p className="mt-1 text-xl font-black">
              {formatNumber(result.capacityMB)} MB
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-bold uppercase text-slate-500">
              Maximum files
            </p>
            <p className="mt-1 text-xl font-black">
              {formatNumber(result.maximumFiles)}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-bold uppercase text-slate-500">
              Remaining
            </p>
            <p className="mt-1 text-xl font-black">
              {formatNumber(result.remainingMB)} MB
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
