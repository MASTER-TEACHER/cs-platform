"use client";

import { useMemo, useState } from "react";
import CPURegisterCard from "@/components/Simulators/CPURegisterCard";
import CPUMemoryTable from "@/components/Simulators/CPUMemoryTable";
import SimulatorControls from "@/components/Simulators/common/SimulatorControls";
import SimulatorDifficulty from "@/components/Simulators/common/SimulatorDifficulty";
import SimulatorFeedback from "@/components/Simulators/common/SimulatorFeedback";
import SimulatorStats from "@/components/Simulators/common/SimulatorStats";
import {
  useSimulator,
  type SimulatorDifficulty as DifficultyLevel,
} from "@/components/Simulators/common/useSimulator";
import Card from "@/components/ui/Card";
import { useProgress } from "@/contexts/ProgressContext";
import {
  cpuCycleSteps,
  cpuMemory,
  executeInstruction,
  getMemoryInstruction,
  initialCPURegisters,
} from "@/services/cpuSimulatorService";
import type { CPUCycleStage, CPURegisters } from "@/types/cpuSimulator";

type CPUQuestion = {
  prompt: string;
  options: string[];
  answer: string;
  hint: string;
  working: string;
  examinerTip: string;
};

const questionBank: Record<DifficultyLevel, CPUQuestion[]> = {
  foundation: [
    {
      prompt:
        "Which register stores the address of the next instruction to be fetched?",
      options: ["PC", "MDR", "CIR", "ACC"],
      answer: "PC",
      hint: "Think about which register points to the next instruction.",
      working:
        "The Program Counter (PC) stores the address of the next instruction to fetch.",
      examinerTip:
        "Use the full register name if a question asks you to describe its role.",
    },
    {
      prompt:
        "During fetch, which register receives the address copied from the PC?",
      options: ["MAR", "MDR", "ACC", "CIR"],
      answer: "MAR",
      hint: "This register holds the memory address currently being accessed.",
      working:
        "The address in the PC is copied to the Memory Address Register (MAR).",
      examinerTip: "Distinguish addresses (MAR) from data/instructions (MDR).",
    },
  ],
  intermediate: [
    {
      prompt:
        "Which register temporarily stores the instruction read from memory before it moves to the CIR?",
      options: ["MDR", "MAR", "PC", "ACC"],
      answer: "MDR",
      hint: "The value has just travelled from memory into the processor.",
      working:
        "Memory sends the instruction to the Memory Data Register (MDR), then it is copied to the CIR.",
      examinerTip:
        "MDR stores data or instructions being transferred to or from memory.",
    },
    {
      prompt: "Why is the Program Counter incremented during the fetch cycle?",
      options: [
        "To point to the next instruction",
        "To decode the current instruction",
        "To store an arithmetic result",
        "To hold the memory data",
      ],
      answer: "To point to the next instruction",
      hint: "Consider what must happen after the current instruction has been fetched.",
      working:
        "Incrementing the PC prepares it with the address of the next instruction in sequence.",
      examinerTip:
        "Avoid saying only 'it goes up by one'; explain the purpose.",
    },
  ],
  higher: [
    {
      prompt:
        "A fetched instruction is currently in the MDR. What transfer must occur before decoding?",
      options: ["MDR → CIR", "CIR → MAR", "ACC → MDR", "PC → ACC"],
      answer: "MDR → CIR",
      hint: "Decoding acts on the current instruction, not on its memory address.",
      working:
        "The fetched instruction is copied from the MDR into the Current Instruction Register (CIR), where the control unit can decode it.",
      examinerTip:
        "For sequence questions, state both the source and destination register.",
    },
    {
      prompt:
        "Which register is most likely to change when an arithmetic instruction is executed?",
      options: ["ACC", "MAR", "PC only", "MDR only"],
      answer: "ACC",
      hint: "Think about where intermediate arithmetic and logic results are held.",
      working:
        "The accumulator stores intermediate arithmetic and logic results, so execution can update the ACC.",
      examinerTip:
        "Link the register to its purpose rather than memorising its abbreviation alone.",
    },
  ],
};

function createQuestion(difficulty: DifficultyLevel): CPUQuestion {
  const bank = questionBank[difficulty];
  return bank[Math.floor(Math.random() * bank.length)];
}

export default function CPUSimulator() {
  const { addXP } = useProgress();
  const simulator = useSimulator<CPUQuestion>({
    initialQuestion: createQuestion("foundation"),
    generateQuestion: createQuestion,
    onAwardXP: addXP,
    simulatorId: "cpu",
  });

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [registers, setRegisters] = useState<CPURegisters>(initialCPURegisters);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const currentStep = cpuCycleSteps[stepIndex];
  const activeMemoryAddress = useMemo(() => {
    if (
      currentStep.stage === "memory-to-mdr" ||
      currentStep.stage === "pc-to-mar"
    ) {
      return registers.MAR;
    }
    return null;
  }, [currentStep.stage, registers.MAR]);

  function applyStage(stage: CPUCycleStage) {
    setRegisters((current) => {
      if (stage === "pc-to-mar") return { ...current, MAR: current.PC };
      if (stage === "memory-to-mdr")
        return { ...current, MDR: getMemoryInstruction(current.MAR) };
      if (stage === "mdr-to-cir") return { ...current, CIR: current.MDR };
      if (stage === "increment-pc") return { ...current, PC: current.PC + 1 };
      if (stage === "execute")
        return {
          ...current,
          ACC: executeInstruction(current.CIR, current.ACC),
        };
      return current;
    });
  }

  function nextStep() {
    if (stepIndex >= cpuCycleSteps.length - 1) return;
    const nextIndex = stepIndex + 1;
    const nextStage = cpuCycleSteps[nextIndex].stage;
    applyStage(nextStage);
    setStepIndex(nextIndex);
    if (nextStage === "complete") setCyclesCompleted((current) => current + 1);
  }

  function previousStep() {
    setStepIndex((current) => Math.max(0, current - 1));
  }

  function startNextInstruction() {
    if (registers.PC >= cpuMemory.length) {
      setRegisters(initialCPURegisters);
      setCyclesCompleted(0);
    }
    setStepIndex(0);
  }

  function resetExplorer() {
    setRegisters(initialCPURegisters);
    setStepIndex(0);
    setCyclesCompleted(0);
  }

  function checkAnswer() {
    if (!selectedAnswer) return;
    simulator.markAnswer(selectedAnswer === simulator.question.answer);
  }

  function tryAgain() {
    setSelectedAnswer("");
    simulator.resetQuestion();
  }

  function newQuestion() {
    setSelectedAnswer("");
    simulator.newQuestion();
  }

  function changeDifficulty(level: DifficultyLevel) {
    setSelectedAnswer("");
    simulator.changeDifficulty(level);
  }

  return (
    <Card>
      <p className="text-xs font-black uppercase tracking-widest text-blue-600">
        CPU laboratory
      </p>
      <h2 className="mt-2 text-3xl font-black text-slate-950">
        Fetch–Decode–Execute Challenge
      </h2>
      <p className="mt-3 max-w-3xl leading-7 text-slate-600">
        Test your register knowledge, then step through a live
        fetch–decode–execute cycle and watch data move through the processor.
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
        <h3 className="mt-2 text-xl font-black text-slate-950">
          {simulator.question.prompt}
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {simulator.question.options.map((option) => (
            <button
              key={option}
              type="button"
              disabled={simulator.checked}
              onClick={() => setSelectedAnswer(option)}
              className={`rounded-xl border-2 p-4 text-left font-black transition ${selectedAnswer === option ? "border-blue-600 bg-white text-blue-700" : "border-slate-200 bg-white text-slate-800"}`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <SimulatorControls
            canCheck={Boolean(selectedAnswer)}
            checked={simulator.checked}
            hintVisible={simulator.hintVisible}
            workingVisible={simulator.workingVisible}
            onCheck={checkAnswer}
            onHint={simulator.toggleHint}
            onToggleWorking={simulator.toggleWorking}
            onReset={tryAgain}
            onNewExample={newQuestion}
            newExampleLabel="New question"
          />
        </div>
      </section>

      <div className="mt-4">
        <SimulatorFeedback
          checked={simulator.checked}
          correct={simulator.correct}
          successMessage="Correct. You identified the register or transfer accurately."
          errorMessage={`Not quite. The correct answer is ${simulator.question.answer}. Try the same question again or study the live cycle below.`}
          hintVisible={simulator.hintVisible}
          hint={simulator.question.hint}
          workingVisible={simulator.workingVisible}
          working={simulator.question.working}
          examinerTip={simulator.question.examinerTip}
        />
      </div>

      <div className="my-8 border-t border-slate-200" />
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-violet-600">
            Hands-on processor explorer
          </p>
          <h3 className="mt-2 text-2xl font-black text-slate-950">
            Live CPU Cycle
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Advance one micro-operation at a time. Active registers and memory
            addresses are highlighted.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-blue-50 px-5 py-4 text-center">
            <p className="text-xs font-black uppercase text-blue-600">Stage</p>
            <p className="mt-1 text-xl font-black text-blue-950">
              {stepIndex + 1}/{cpuCycleSteps.length}
            </p>
          </div>
          <div className="rounded-2xl bg-emerald-50 px-5 py-4 text-center">
            <p className="text-xs font-black uppercase text-emerald-600">
              Cycles
            </p>
            <p className="mt-1 text-xl font-black text-emerald-950">
              {cyclesCompleted}
            </p>
          </div>
        </div>
      </div>

      <section className="mt-6 rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <p className="text-xs font-black uppercase tracking-widest text-blue-600">
          Current stage
        </p>
        <h3 className="mt-2 text-2xl font-black text-slate-950">
          {currentStep.title}
        </h3>
        <p className="mt-3 leading-7 text-slate-700">
          {currentStep.explanation}
        </p>
      </section>

      <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <CPURegisterCard
          register="PC"
          label="Program Counter"
          value={registers.PC}
          active={currentStep.activeRegisters.includes("PC")}
          description="Stores the address of the next instruction."
        />
        <CPURegisterCard
          register="MAR"
          label="Memory Address Register"
          value={registers.MAR}
          active={currentStep.activeRegisters.includes("MAR")}
          description="Stores the address currently being accessed in memory."
        />
        <CPURegisterCard
          register="MDR"
          label="Memory Data Register"
          value={registers.MDR}
          active={currentStep.activeRegisters.includes("MDR")}
          description="Stores data or an instruction transferred to or from memory."
        />
        <CPURegisterCard
          register="CIR"
          label="Current Instruction Register"
          value={registers.CIR}
          active={currentStep.activeRegisters.includes("CIR")}
          description="Stores the instruction currently being decoded and executed."
        />
        <CPURegisterCard
          register="ACC"
          label="Accumulator"
          value={registers.ACC}
          active={currentStep.activeRegisters.includes("ACC")}
          description="Stores intermediate arithmetic and logic results."
        />
      </div>

      <div className="mt-7">
        <CPUMemoryTable
          memory={cpuMemory}
          activeAddress={activeMemoryAddress}
        />
      </div>
      <div className="mt-7 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={previousStep}
          disabled={stepIndex === 0}
          className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-black text-slate-700 disabled:opacity-40"
        >
          ← Previous stage
        </button>
        {currentStep.stage === "complete" ? (
          <button
            type="button"
            onClick={startNextInstruction}
            className="rounded-xl bg-blue-600 px-6 py-3 font-black text-white"
          >
            Fetch next instruction →
          </button>
        ) : (
          <button
            type="button"
            onClick={nextStep}
            className="rounded-xl bg-blue-600 px-6 py-3 font-black text-white"
          >
            Next stage →
          </button>
        )}
        <button
          type="button"
          onClick={resetExplorer}
          className="rounded-xl border border-red-200 bg-red-50 px-6 py-3 font-black text-red-700"
        >
          Reset explorer
        </button>
      </div>
    </Card>
  );
}
