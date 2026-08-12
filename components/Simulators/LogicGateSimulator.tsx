"use client";

import { DragEvent, useCallback, useMemo, useState } from "react";

import Card from "@/components/ui/Card";
import { useProgress } from "@/contexts/ProgressContext";

import SimulatorControls from "@/components/Simulators/common/SimulatorControls";
import SimulatorDifficulty from "@/components/Simulators/common/SimulatorDifficulty";
import SimulatorFeedback from "@/components/Simulators/common/SimulatorFeedback";
import SimulatorStats from "@/components/Simulators/common/SimulatorStats";

import {
  type SimulatorDifficulty as SimulatorDifficultyLevel,
  useSimulator,
} from "@/components/Simulators/common/useSimulator";

/* =========================================================
   TYPES
========================================================= */

type Bit = 0 | 1;

type Gate = "AND" | "OR" | "NOT" | "NAND" | "NOR" | "XOR";

type LogicQuestion = {
  id: string;
  gate: Gate;
  a: Bit;
  b: Bit;
  answer: Bit;
  hint: string;
  working: string;
  examinerTip: string;
};

type CircuitTask = {
  id: string;
  title: string;
  description: string;

  difficulty: SimulatorDifficultyLevel;

  slot1: Gate;
  slot2: Gate | null;

  expression: string;

  hint: string;
  working: string;
};

/* =========================================================
   CONSTANTS
========================================================= */

const gates: Gate[] = ["AND", "OR", "NOT", "NAND", "NOR", "XOR"];

const truthRows: Array<[Bit, Bit]> = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
];

/* =========================================================
   LOGIC HELPERS
========================================================= */

function calculateGate(gate: Gate, a: Bit, b: Bit): Bit {
  if (gate === "NOT") {
    return a === 1 ? 0 : 1;
  }

  if (gate === "AND") {
    return a === 1 && b === 1 ? 1 : 0;
  }

  if (gate === "OR") {
    return a === 1 || b === 1 ? 1 : 0;
  }

  if (gate === "NAND") {
    return a === 1 && b === 1 ? 0 : 1;
  }

  if (gate === "NOR") {
    return a === 1 || b === 1 ? 0 : 1;
  }

  return a !== b ? 1 : 0;
}

function gateRule(gate: Gate): string {
  switch (gate) {
    case "AND":
      return "AND outputs 1 only when both inputs are 1.";

    case "OR":
      return "OR outputs 1 when at least one input is 1.";

    case "NOT":
      return "NOT reverses its single input.";

    case "NAND":
      return "NAND is the opposite of AND.";

    case "NOR":
      return "NOR is the opposite of OR.";

    case "XOR":
      return "XOR outputs 1 when the two inputs are different.";

    default:
      return "";
  }
}

function randomBit(): Bit {
  return Math.random() < 0.5 ? 0 : 1;
}

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function gatePool(difficulty: SimulatorDifficultyLevel): Gate[] {
  if (difficulty === "foundation") {
    return ["AND", "OR", "NOT"];
  }

  if (difficulty === "intermediate") {
    return ["AND", "OR", "NOT", "NAND", "NOR"];
  }

  return ["AND", "OR", "NOT", "NAND", "NOR", "XOR"];
}

/* =========================================================
   QUESTION GENERATOR
========================================================= */

function generateLogicQuestion(
  difficulty: SimulatorDifficultyLevel,
): LogicQuestion {
  const gate = randomItem(gatePool(difficulty));

  const a = randomBit();
  const b = gate === "NOT" ? 0 : randomBit();

  const answer = calculateGate(gate, a, b);

  const id = `${gate}-${a}-${b}-${Date.now()}-${Math.random()}`;

  return {
    id,
    gate,
    a,
    b,
    answer,

    hint:
      gate === "NOT"
        ? `A NOT gate reverses the input. Think about the opposite of ${a}.`
        : `${gateRule(gate)} Apply that rule to A = ${a} and B = ${b}.`,

    working:
      gate === "NOT"
        ? `Gate: NOT\nInput A = ${a}\nNOT ${a} = ${answer}\n\nFinal output = ${answer}`
        : `Gate: ${gate}\nInput A = ${a}\nInput B = ${b}\n\n${gateRule(
            gate,
          )}\n\nFinal output = ${answer}`,

    examinerTip:
      difficulty === "higher"
        ? "For multi-stage logic questions, calculate each intermediate gate output before moving to the next gate."
        : "Use the truth-table rule for the gate before selecting the output.",
  };
}

/* =========================================================
   CIRCUIT TASKS
========================================================= */

const circuitTasks: CircuitTask[] = [
  {
    id: "foundation-and",
    title: "Build an AND circuit",
    description: "Use the correct gate so the circuit calculates A AND B.",
    difficulty: "foundation",
    slot1: "AND",
    slot2: null,
    expression: "A AND B",
    hint: "The required gate should output 1 only when A and B are both 1.",
    working:
      "A AND B requires one AND gate. Connect A and B to the AND gate, then connect its result to OUTPUT.",
  },

  {
    id: "foundation-or",
    title: "Build an OR circuit",
    description: "Use the correct gate so the circuit calculates A OR B.",
    difficulty: "foundation",
    slot1: "OR",
    slot2: null,
    expression: "A OR B",
    hint: "The required gate outputs 1 when at least one input is 1.",
    working:
      "A OR B requires one OR gate. A and B enter the OR gate and its result becomes the final output.",
  },

  {
    id: "foundation-not",
    title: "Build a NOT circuit",
    description: "Use the correct gate to reverse input A.",
    difficulty: "foundation",
    slot1: "NOT",
    slot2: null,
    expression: "NOT A",
    hint: "You need the gate that reverses a single binary input.",
    working:
      "NOT uses only input A. If A = 1 the output becomes 0; if A = 0 the output becomes 1.",
  },

  {
    id: "intermediate-and-or",
    title: "Build a two-stage circuit",
    description: "Create (A AND B) OR C.",
    difficulty: "intermediate",
    slot1: "AND",
    slot2: "OR",
    expression: "(A AND B) OR C",
    hint: "Calculate A AND B first. Then combine that result with C.",
    working:
      "Stage 1: A AND B.\nStage 2: Take the result of Stage 1 and OR it with C.\n\nRequired gates: AND → OR.",
  },

  {
    id: "intermediate-or-and",
    title: "Build a two-stage circuit",
    description: "Create (A OR B) AND C.",
    difficulty: "intermediate",
    slot1: "OR",
    slot2: "AND",
    expression: "(A OR B) AND C",
    hint: "The first gate combines A and B using OR.",
    working:
      "Stage 1: A OR B.\nStage 2: AND the Stage 1 result with C.\n\nRequired gates: OR → AND.",
  },

  {
    id: "intermediate-nand",
    title: "Build a NAND circuit",
    description: "Create the logical expression A NAND B.",
    difficulty: "intermediate",
    slot1: "NAND",
    slot2: null,
    expression: "A NAND B",
    hint: "NAND produces the opposite result from AND.",
    working: "Use one NAND gate. It behaves like AND followed by NOT.",
  },

  {
    id: "higher-xor-and",
    title: "Build a higher circuit",
    description: "Create (A XOR B) AND C.",
    difficulty: "higher",
    slot1: "XOR",
    slot2: "AND",
    expression: "(A XOR B) AND C",
    hint: "The first stage should identify whether A and B are different.",
    working:
      "Stage 1: XOR compares A and B.\nStage 2: AND the XOR result with C.\n\nRequired gates: XOR → AND.",
  },

  {
    id: "higher-nand-or",
    title: "Build a higher circuit",
    description: "Create (A NAND B) OR C.",
    difficulty: "higher",
    slot1: "NAND",
    slot2: "OR",
    expression: "(A NAND B) OR C",
    hint: "The first stage is the inverse of A AND B.",
    working:
      "Stage 1: A NAND B.\nStage 2: OR the Stage 1 result with C.\n\nRequired gates: NAND → OR.",
  },

  {
    id: "higher-nor-xor",
    title: "Build a higher circuit",
    description: "Create (A NOR B) XOR C.",
    difficulty: "higher",
    slot1: "NOR",
    slot2: "XOR",
    expression: "(A NOR B) XOR C",
    hint: "NOR is the opposite of OR. Its result then enters XOR with C.",
    working:
      "Stage 1: A NOR B.\nStage 2: XOR the Stage 1 result with C.\n\nRequired gates: NOR → XOR.",
  },
];

function getCircuitTask(
  difficulty: SimulatorDifficultyLevel,
  excludeId?: string,
): CircuitTask {
  let matching = circuitTasks.filter(
    (task) => task.difficulty === difficulty && task.id !== excludeId,
  );

  if (matching.length === 0) {
    matching = circuitTasks.filter((task) => task.difficulty === difficulty);
  }

  return randomItem(matching);
}

/* =========================================================
   SMALL DISPLAY COMPONENTS
========================================================= */

function BitButton({
  value,
  selected,
  onClick,
}: {
  value: Bit;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-14 min-w-20 items-center justify-center rounded-xl border-2 text-2xl font-black transition ${
        selected
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-slate-200 bg-white text-slate-950 hover:border-blue-300"
      }`}
    >
      {value}
    </button>
  );
}

function GateBadge({ gate }: { gate: Gate }) {
  return (
    <div className="rounded-xl border border-violet-300 bg-violet-50 px-6 py-4 text-center">
      <p className="text-xs font-black uppercase tracking-widest text-violet-600">
        Logic gate
      </p>

      <p className="mt-1 text-xl font-black text-violet-950">{gate}</p>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function LogicGateSimulator() {
  const { addXP } = useProgress();

  const initialQuestion = useMemo(
    () => generateLogicQuestion("foundation"),
    [],
  );

  const {
    difficulty,
    question,

    checked,
    correct,

    hintVisible,
    workingVisible,

    attempts,
    correctAnswers,
    accuracy,
    xp,
    streak,

    markAnswer,
    resetQuestion,
    newQuestion,
    changeDifficulty,

    toggleHint,
    toggleWorking,
  } = useSimulator<LogicQuestion>({
    initialQuestion,
    generateQuestion: generateLogicQuestion,

    xpByDifficulty: {
      foundation: 10,
      intermediate: 15,
      higher: 20,
    },

    onAwardXP: addXP,
  });

  const [selectedAnswer, setSelectedAnswer] = useState<Bit | null>(null);

  /* =======================================================
     EXPLORER STATE
  ======================================================= */

  const [explorerGate, setExplorerGate] = useState<Gate>("AND");

  const [explorerA, setExplorerA] = useState<Bit>(0);

  const [explorerB, setExplorerB] = useState<Bit>(0);

  const explorerOutput = calculateGate(explorerGate, explorerA, explorerB);

  /* =======================================================
     TRUTH TABLE PRACTICE
  ======================================================= */

  const [truthGate, setTruthGate] = useState<Gate>("AND");

  const [truthAnswers, setTruthAnswers] = useState<Array<Bit | null>>([
    null,
    null,
    null,
    null,
  ]);

  const [truthChecked, setTruthChecked] = useState(false);

  const [truthCorrect, setTruthCorrect] = useState(false);

  const [truthHintVisible, setTruthHintVisible] = useState(false);

  const [truthWorkingVisible, setTruthWorkingVisible] = useState(false);

  /* =======================================================
     CIRCUIT BUILDER STATE
  ======================================================= */

  const [circuitTask, setCircuitTask] = useState<CircuitTask>(() =>
    getCircuitTask("foundation"),
  );

  const [slot1, setSlot1] = useState<Gate | null>(null);

  const [slot2, setSlot2] = useState<Gate | null>(null);

  const [builderA, setBuilderA] = useState<Bit>(0);

  const [builderB, setBuilderB] = useState<Bit>(0);

  const [builderC, setBuilderC] = useState<Bit>(0);

  const [builderChecked, setBuilderChecked] = useState(false);

  const [builderCorrect, setBuilderCorrect] = useState(false);

  const [builderMistakes, setBuilderMistakes] = useState(0);

  const [builderCorrectAttempts, setBuilderCorrectAttempts] = useState(0);

  const [builderHintVisible, setBuilderHintVisible] = useState(false);

  const [builderWorkingVisible, setBuilderWorkingVisible] = useState(false);

  /* =======================================================
     QUESTION HANDLERS
  ======================================================= */

  function checkMainAnswer() {
    if (selectedAnswer === null) {
      return;
    }

    markAnswer(selectedAnswer === question.answer);
  }

  function resetMainQuestion() {
    setSelectedAnswer(null);
    resetQuestion();
  }

  function createMainQuestion() {
    setSelectedAnswer(null);
    newQuestion();
  }

  function changeMainDifficulty(nextDifficulty: SimulatorDifficultyLevel) {
    setSelectedAnswer(null);

    changeDifficulty(nextDifficulty);

    resetCircuitForDifficulty(nextDifficulty);
  }

  /* =======================================================
     TRUTH TABLE HANDLERS
  ======================================================= */

  function setTruthAnswer(index: number, value: Bit) {
    if (truthChecked) {
      return;
    }

    setTruthAnswers((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  }

  function checkTruthTable() {
    const requiredRows =
      truthGate === "NOT" ? truthRows.slice(0, 2) : truthRows;

    const answers =
      truthGate === "NOT" ? truthAnswers.slice(0, 2) : truthAnswers;

    if (answers.some((answer) => answer === null)) {
      return;
    }

    const isCorrect = requiredRows.every(
      ([a, b], index) => answers[index] === calculateGate(truthGate, a, b),
    );

    setTruthChecked(true);
    setTruthCorrect(isCorrect);
  }

  function resetTruthTable() {
    setTruthAnswers([null, null, null, null]);

    setTruthChecked(false);
    setTruthCorrect(false);
    setTruthHintVisible(false);
    setTruthWorkingVisible(false);
  }

  function changeTruthGate(gate: Gate) {
    setTruthGate(gate);
    resetTruthTable();
  }

  /* =======================================================
     BUILDER HELPERS
  ======================================================= */

  const builderStage1Output =
    slot1 === null ? null : calculateGate(slot1, builderA, builderB);

  const builderFinalOutput =
    slot1 === null
      ? null
      : circuitTask.slot2 === null
        ? builderStage1Output
        : slot2 === null || builderStage1Output === null
          ? null
          : calculateGate(slot2, builderStage1Output, builderC);

  const builderAttempts = builderCorrectAttempts + builderMistakes;

  const builderAccuracy =
    builderAttempts === 0
      ? 0
      : Math.round((builderCorrectAttempts / builderAttempts) * 100);

  function clearBuilderFeedback() {
    setBuilderChecked(false);
    setBuilderCorrect(false);
    setBuilderHintVisible(false);
    setBuilderWorkingVisible(false);
  }

  function resetCircuitForDifficulty(nextDifficulty: SimulatorDifficultyLevel) {
    setCircuitTask(getCircuitTask(nextDifficulty));

    setSlot1(null);
    setSlot2(null);

    setBuilderA(0);
    setBuilderB(0);
    setBuilderC(0);

    setBuilderChecked(false);
    setBuilderCorrect(false);

    setBuilderMistakes(0);
    setBuilderCorrectAttempts(0);

    setBuilderHintVisible(false);
    setBuilderWorkingVisible(false);
  }

  function newCircuitTask() {
    setCircuitTask(getCircuitTask(difficulty, circuitTask.id));

    setSlot1(null);
    setSlot2(null);

    setBuilderA(0);
    setBuilderB(0);
    setBuilderC(0);

    clearBuilderFeedback();
  }

  function placeGate(slot: 1 | 2, gate: Gate) {
    if (slot === 1) {
      setSlot1(gate);
    } else {
      setSlot2(gate);
    }

    clearBuilderFeedback();
  }

  function handleGateDragStart(
    event: DragEvent<HTMLButtonElement>,
    gate: Gate,
  ) {
    event.dataTransfer.setData("text/plain", gate);

    event.dataTransfer.effectAllowed = "copy";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, slot: 1 | 2) {
    event.preventDefault();

    const gate = event.dataTransfer.getData("text/plain") as Gate;

    if (!gates.includes(gate)) {
      return;
    }

    placeGate(slot, gate);
  }

  function checkCircuit() {
    const correctSlot1 = slot1 === circuitTask.slot1;

    const correctSlot2 =
      circuitTask.slot2 === null ? true : slot2 === circuitTask.slot2;

    const isCorrect = correctSlot1 && correctSlot2;

    setBuilderChecked(true);
    setBuilderCorrect(isCorrect);

    if (isCorrect) {
      setBuilderCorrectAttempts((current) => current + 1);
    } else {
      setBuilderMistakes((current) => current + 1);
    }
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <Card>
      <div className="space-y-8">
        {/* =================================================
            HEADER
        ================================================= */}

        <header>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
            Logic gate laboratory
          </p>

          <h2 className="mt-2 text-3xl font-black text-slate-950">
            Logic Gate Challenge
          </h2>

          <p className="mt-2 max-w-3xl leading-7 text-slate-600">
            Predict logic-gate outputs, investigate how gates behave, complete
            truth tables and build working logic circuits yourself.
          </p>
        </header>

        {/* =================================================
            DIFFICULTY
        ================================================= */}

        <SimulatorDifficulty
          value={difficulty}
          onChange={changeMainDifficulty}
        />

        {/* =================================================
            STATS
        ================================================= */}

        <SimulatorStats
          attempts={attempts}
          correct={correctAnswers}
          accuracy={accuracy}
          xp={xp}
          streak={streak}
        />

        {/* =================================================
            MAIN CHALLENGE
        ================================================= */}

        <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <p className="text-xs font-black uppercase tracking-widest text-blue-600">
            Current challenge
          </p>

          <h3 className="mt-2 text-xl font-black text-slate-950">
            What is the final output?
          </h3>

          <p className="mt-1 text-sm text-slate-600">
            Work through the logic gates using binary values 0 and 1.
          </p>
        </section>

        <section className="rounded-3xl bg-slate-950 p-7 text-white">
          <div
            className={`grid items-center gap-5 ${
              question.gate === "NOT"
                ? "md:grid-cols-[1fr_auto_1fr]"
                : "md:grid-cols-[1fr_auto_1fr_auto_1fr]"
            }`}
          >
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-widest text-blue-300">
                Input A
              </p>

              <p className="mt-2 text-4xl font-black">{question.a}</p>
            </div>

            <span className="text-xl text-slate-400">→</span>

            <GateBadge gate={question.gate} />

            {question.gate !== "NOT" && (
              <>
                <span className="text-xl text-slate-400">←</span>

                <div className="text-center">
                  <p className="text-xs font-black uppercase tracking-widest text-blue-300">
                    Input B
                  </p>

                  <p className="mt-2 text-4xl font-black">{question.b}</p>
                </div>
              </>
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-emerald-400 bg-emerald-950/30 p-5 text-center">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-400">
              Output
            </p>

            <p className="mt-2 text-4xl font-black text-white">
              {checked ? question.answer : "?"}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="font-black text-slate-950">Select the final output</p>

          <div className="mt-4 flex gap-3">
            <BitButton
              value={0}
              selected={selectedAnswer === 0}
              onClick={() => setSelectedAnswer(0)}
            />

            <BitButton
              value={1}
              selected={selectedAnswer === 1}
              onClick={() => setSelectedAnswer(1)}
            />
          </div>

          <div className="mt-5">
            <SimulatorControls
              canCheck={selectedAnswer !== null}
              checked={checked}
              hintVisible={hintVisible}
              workingVisible={workingVisible}
              onCheck={checkMainAnswer}
              onHint={toggleHint}
              onToggleWorking={toggleWorking}
              onReset={resetMainQuestion}
              onNewExample={createMainQuestion}
              newExampleLabel="New question"
            />
          </div>
        </section>

        <SimulatorFeedback
          checked={checked}
          correct={correct}
          successMessage={`Correct. The final output is ${question.answer}.`}
          errorMessage={`Not quite. Review the ${question.gate} gate rule and try again.`}
          hintVisible={hintVisible}
          hint={question.hint}
          workingVisible={workingVisible}
          working={question.working}
          examinerTip={question.examinerTip}
        />

        {/* =================================================
            EXPLORER
        ================================================= */}

        <hr className="border-slate-200" />

        <section>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-600">
            Hands-on exploration
          </p>

          <h3 className="mt-2 text-2xl font-black text-slate-950">
            Logic Gate Explorer
          </h3>

          <p className="mt-2 max-w-3xl leading-7 text-slate-600">
            Select a gate and toggle its inputs. Watch the output change
            instantly and compare your observations with its truth table.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {gates.map((gate) => (
              <button
                key={gate}
                type="button"
                onClick={() => setExplorerGate(gate)}
                className={`rounded-xl px-4 py-3 font-black transition ${
                  explorerGate === gate
                    ? "bg-violet-600 text-white"
                    : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                }`}
              >
                {gate}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <button
              type="button"
              onClick={() => setExplorerA(explorerA === 0 ? 1 : 0)}
              className="rounded-3xl bg-slate-950 p-7 text-white"
            >
              <p className="text-xs font-black uppercase tracking-widest text-blue-300">
                Input A
              </p>

              <p className="mt-2 text-5xl font-black">{explorerA}</p>

              <p className="mt-2 text-xs text-slate-400">Click to toggle</p>
            </button>

            {explorerGate !== "NOT" && (
              <button
                type="button"
                onClick={() => setExplorerB(explorerB === 0 ? 1 : 0)}
                className="rounded-3xl bg-slate-950 p-7 text-white"
              >
                <p className="text-xs font-black uppercase tracking-widest text-blue-300">
                  Input B
                </p>

                <p className="mt-2 text-5xl font-black">{explorerB}</p>

                <p className="mt-2 text-xs text-slate-400">Click to toggle</p>
              </button>
            )}

            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-7 text-center">
              <p className="text-xs font-black uppercase tracking-widest text-emerald-600">
                Output
              </p>

              <p className="mt-2 text-5xl font-black text-emerald-950">
                {explorerOutput}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-violet-200 bg-violet-50 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-violet-600">
              {explorerGate} rule
            </p>

            <p className="mt-2 font-bold text-violet-950">
              {gateRule(explorerGate)}
            </p>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
              <p className="font-black text-slate-950">
                {explorerGate} truth table
              </p>
            </div>

            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-black uppercase tracking-widest text-slate-500">
                  <th className="px-5 py-3">A</th>

                  {explorerGate !== "NOT" && <th className="px-5 py-3">B</th>}

                  <th className="px-5 py-3">Output</th>
                </tr>
              </thead>

              <tbody>
                {(explorerGate === "NOT"
                  ? ([
                      [0, 0],
                      [1, 0],
                    ] as Array<[Bit, Bit]>)
                  : truthRows
                ).map(([a, b]) => (
                  <tr key={`${a}-${b}`} className="border-t border-slate-100">
                    <td className="px-5 py-4 font-black">{a}</td>

                    {explorerGate !== "NOT" && (
                      <td className="px-5 py-4 font-black">{b}</td>
                    )}

                    <td className="px-5 py-4 font-black text-emerald-700">
                      {calculateGate(explorerGate, a, b)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* =================================================
            TRUTH TABLE PRACTICE
        ================================================= */}

        <hr className="border-slate-200" />

        <section>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
            Hands-on table practice
          </p>

          <h3 className="mt-2 text-2xl font-black text-slate-950">
            Complete the Truth Table
          </h3>

          <p className="mt-2 max-w-3xl leading-7 text-slate-600">
            Choose the gate and calculate every output yourself before checking
            the completed table.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {gatePool(difficulty).map((gate) => (
              <button
                key={gate}
                type="button"
                onClick={() => changeTruthGate(gate)}
                className={`rounded-xl px-4 py-3 font-black ${
                  truthGate === gate ? "bg-blue-600 text-white" : "bg-slate-100"
                }`}
              >
                {gate}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-blue-600">
              Current gate
            </p>

            <p className="mt-2 text-xl font-black">{truthGate}</p>

            <p className="mt-1 text-sm text-slate-600">{gateRule(truthGate)}</p>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-black uppercase tracking-widest text-slate-500">
                  <th className="px-5 py-3">A</th>

                  {truthGate !== "NOT" && <th className="px-5 py-3">B</th>}

                  <th className="px-5 py-3">Your output</th>
                </tr>
              </thead>

              <tbody>
                {(truthGate === "NOT"
                  ? ([
                      [0, 0],
                      [1, 0],
                    ] as Array<[Bit, Bit]>)
                  : truthRows
                ).map(([a, b], index) => {
                  const expected = calculateGate(truthGate, a, b);

                  const answer = truthAnswers[index];

                  return (
                    <tr key={`${a}-${b}`} className="border-t border-slate-100">
                      <td className="px-5 py-4 font-black">{a}</td>

                      {truthGate !== "NOT" && (
                        <td className="px-5 py-4 font-black">{b}</td>
                      )}

                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          {([0, 1] as Bit[]).map((value) => (
                            <button
                              key={value}
                              type="button"
                              disabled={truthChecked}
                              onClick={() => setTruthAnswer(index, value)}
                              className={`h-10 w-12 rounded-lg border-2 font-black transition ${
                                answer === value
                                  ? truthChecked
                                    ? value === expected
                                      ? "border-emerald-500 bg-emerald-500 text-white"
                                      : "border-red-500 bg-red-500 text-white"
                                    : "border-blue-600 bg-blue-600 text-white"
                                  : "border-slate-200 bg-white"
                              }`}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-5">
            <SimulatorControls
              canCheck={
                truthGate === "NOT"
                  ? truthAnswers.slice(0, 2).every((value) => value !== null)
                  : truthAnswers.every((value) => value !== null)
              }
              checked={truthChecked}
              hintVisible={truthHintVisible}
              workingVisible={truthWorkingVisible}
              showNewExample={false}
              checkLabel="Check truth table"
              resetLabel="Reset table"
              onCheck={checkTruthTable}
              onHint={() => setTruthHintVisible((current) => !current)}
              onToggleWorking={() =>
                setTruthWorkingVisible((current) => !current)
              }
              onReset={resetTruthTable}
            />
          </div>

          <SimulatorFeedback
            checked={truthChecked}
            correct={truthCorrect}
            successMessage={`Excellent. Every ${truthGate} output is correct.`}
            errorMessage="At least one output is incorrect. Reapply the gate rule to each row."
            hintVisible={truthHintVisible}
            hint={gateRule(truthGate)}
            workingVisible={truthWorkingVisible}
            working={
              truthGate === "NOT"
                ? `A = 0 → ${truthGate} → ${calculateGate(
                    truthGate,
                    0,
                    0,
                  )}\nA = 1 → ${truthGate} → ${calculateGate(truthGate, 1, 0)}`
                : truthRows
                    .map(
                      ([a, b]) =>
                        `A=${a}, B=${b} → ${truthGate} → ${calculateGate(
                          truthGate,
                          a,
                          b,
                        )}`,
                    )
                    .join("\n")
            }
            examinerTip="Truth tables must include every possible input combination exactly once."
          />
        </section>

        {/* =================================================
            CIRCUIT BUILDER
        ================================================= */}

        <hr className="border-slate-200" />

        <section>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-600">
            Hands-on circuit laboratory
          </p>

          <h3 className="mt-2 text-2xl font-black text-slate-950">
            Drag-and-Drop Logic Circuit Builder
          </h3>

          <p className="mt-2 max-w-3xl leading-7 text-slate-600">
            Build the circuit yourself. Drag gates from the palette into the
            circuit slots, toggle the inputs and watch signals travel through
            your circuit.
          </p>

          {/* TASK */}

          <div className="mt-6 rounded-2xl border border-violet-200 bg-violet-50 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-violet-600">
              Build challenge
            </p>

            <h4 className="mt-2 text-xl font-black text-violet-950">
              {circuitTask.title}
            </h4>

            <p className="mt-2 leading-7 text-violet-900">
              {circuitTask.description}
            </p>

            <div className="mt-4 rounded-xl bg-white/70 p-4">
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                Required expression
              </p>

              <p className="mt-2 font-mono text-lg font-black">
                {circuitTask.expression}
              </p>
            </div>
          </div>

          {/* BUILDER STATS */}

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                Correct builds
              </p>

              <p className="mt-2 text-2xl font-black">
                {builderCorrectAttempts}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                Mistakes
              </p>

              <p className="mt-2 text-2xl font-black">{builderMistakes}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                Circuit accuracy
              </p>

              <p className="mt-2 text-2xl font-black">{builderAccuracy}%</p>
            </div>
          </div>

          {/* GATE PALETTE */}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">
              Gate palette
            </p>

            <p className="mt-2 text-sm text-slate-600">
              Drag a gate into a circuit slot. You can also click a gate, then
              click a slot if drag-and-drop is inconvenient.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              {gatePool(difficulty).map((gate) => (
                <button
                  key={gate}
                  type="button"
                  draggable
                  onDragStart={(event) => handleGateDragStart(event, gate)}
                  onClick={() => {
                    if (slot1 === null) {
                      placeGate(1, gate);
                    } else if (circuitTask.slot2 !== null) {
                      placeGate(2, gate);
                    } else {
                      placeGate(1, gate);
                    }
                  }}
                  className="cursor-grab rounded-xl border-2 border-violet-300 bg-white px-5 py-3 font-black text-violet-800 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-500 active:cursor-grabbing"
                >
                  {gate}
                </button>
              ))}
            </div>
          </div>

          {/* CIRCUIT */}

          <div className="mt-6 overflow-x-auto rounded-3xl bg-slate-950 p-7">
            <div className="min-w-[850px]">
              <div className="grid grid-cols-[150px_80px_230px_80px_230px_80px_150px] items-center gap-3">
                {/* INPUTS */}

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => {
                      setBuilderA(builderA === 0 ? 1 : 0);
                      clearBuilderFeedback();
                    }}
                    className="w-full rounded-2xl border border-blue-500 bg-blue-950 p-4 text-white"
                  >
                    <p className="text-xs font-black uppercase tracking-widest text-blue-300">
                      Input A
                    </p>

                    <p className="mt-2 text-3xl font-black">{builderA}</p>
                  </button>

                  {slot1 !== "NOT" && (
                    <button
                      type="button"
                      onClick={() => {
                        setBuilderB(builderB === 0 ? 1 : 0);
                        clearBuilderFeedback();
                      }}
                      className="w-full rounded-2xl border border-blue-500 bg-blue-950 p-4 text-white"
                    >
                      <p className="text-xs font-black uppercase tracking-widest text-blue-300">
                        Input B
                      </p>

                      <p className="mt-2 text-3xl font-black">{builderB}</p>
                    </button>
                  )}
                </div>

                {/* WIRE */}

                <div className="h-1 bg-blue-400" />

                {/* SLOT 1 */}

                <div
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleDrop(event, 1)}
                  onClick={() => {
                    if (slot1) {
                      setSlot1(null);
                      clearBuilderFeedback();
                    }
                  }}
                  className={`flex min-h-32 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center ${
                    slot1
                      ? "border-violet-400 bg-violet-950"
                      : "border-slate-500 bg-slate-900"
                  }`}
                >
                  {slot1 ? (
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-violet-300">
                        Gate 1
                      </p>

                      <p className="mt-2 text-3xl font-black text-white">
                        {slot1}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        Click to remove
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-black text-slate-300">Drop Gate 1</p>

                      <p className="mt-2 text-xs text-slate-500">
                        Drag a gate here
                      </p>
                    </div>
                  )}
                </div>

                {/* WIRE */}

                <div className="text-center">
                  <div className="h-1 bg-violet-400" />

                  <p className="mt-2 text-sm font-black text-violet-300">
                    {builderStage1Output === null ? "?" : builderStage1Output}
                  </p>
                </div>

                {/* SECOND STAGE */}

                {circuitTask.slot2 !== null ? (
                  <div
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => handleDrop(event, 2)}
                    onClick={() => {
                      if (slot2) {
                        setSlot2(null);
                        clearBuilderFeedback();
                      }
                    }}
                    className={`flex min-h-32 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center ${
                      slot2
                        ? "border-fuchsia-400 bg-fuchsia-950"
                        : "border-slate-500 bg-slate-900"
                    }`}
                  >
                    {slot2 ? (
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-fuchsia-300">
                          Gate 2
                        </p>

                        <p className="mt-2 text-3xl font-black text-white">
                          {slot2}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          Click to remove
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-black text-slate-300">Drop Gate 2</p>

                        <p className="mt-2 text-xs text-slate-500">
                          Drag a gate here
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex min-h-32 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 p-5">
                    <p className="text-sm font-bold text-slate-500">
                      No second gate required
                    </p>
                  </div>
                )}

                {/* WIRE */}

                <div className="h-1 bg-emerald-400" />

                {/* OUTPUT */}

                <div className="rounded-2xl border border-emerald-400 bg-emerald-950 p-5 text-center text-white">
                  <p className="text-xs font-black uppercase tracking-widest text-emerald-300">
                    Output
                  </p>

                  <p className="mt-2 text-4xl font-black">
                    {builderFinalOutput === null ? "?" : builderFinalOutput}
                  </p>
                </div>
              </div>

              {circuitTask.slot2 !== null && (
                <div className="mt-5 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setBuilderC(builderC === 0 ? 1 : 0);
                      clearBuilderFeedback();
                    }}
                    className="rounded-2xl border border-cyan-500 bg-cyan-950 px-8 py-4 text-white"
                  >
                    <p className="text-xs font-black uppercase tracking-widest text-cyan-300">
                      Input C into Gate 2
                    </p>

                    <p className="mt-2 text-3xl font-black">{builderC}</p>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* CIRCUIT EQUATION */}

          <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-blue-600">
              Live circuit state
            </p>

            <div className="mt-3 grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-xs text-slate-500">Gate 1</p>

                <p className="font-black">{slot1 ?? "Empty"}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Intermediate output</p>

                <p className="font-black">{builderStage1Output ?? "—"}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Gate 2</p>

                <p className="font-black">
                  {circuitTask.slot2 === null
                    ? "Not required"
                    : (slot2 ?? "Empty")}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Final output</p>

                <p className="font-black text-emerald-700">
                  {builderFinalOutput ?? "—"}
                </p>
              </div>
            </div>
          </div>

          {/* BUILDER CONTROLS */}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={checkCircuit}
              disabled={
                slot1 === null || (circuitTask.slot2 !== null && slot2 === null)
              }
              className="rounded-xl bg-blue-600 px-5 py-3 font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Check circuit
            </button>

            <button
              type="button"
              onClick={() => setBuilderHintVisible((current) => !current)}
              className="rounded-xl border border-amber-300 bg-amber-50 px-5 py-3 font-black text-amber-800"
            >
              {builderHintVisible ? "Hide hint" : "Hint"}
            </button>

            <button
              type="button"
              onClick={() => setBuilderWorkingVisible((current) => !current)}
              className="rounded-xl border border-violet-300 bg-violet-50 px-5 py-3 font-black text-violet-800"
            >
              {builderWorkingVisible ? "Hide working" : "Show working"}
            </button>

            <button
              type="button"
              onClick={() => {
                setSlot1(null);
                setSlot2(null);
                clearBuilderFeedback();
              }}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-black text-slate-700"
            >
              Reset circuit
            </button>

            <button
              type="button"
              onClick={newCircuitTask}
              className="rounded-xl border border-blue-300 bg-blue-50 px-5 py-3 font-black text-blue-700"
            >
              New build challenge
            </button>
          </div>

          <SimulatorFeedback
            checked={builderChecked}
            correct={builderCorrect}
            successMessage={`Excellent. You correctly built ${circuitTask.expression}. Toggle A${
              circuitTask.slot1 !== "NOT" ? ", B" : ""
            }${
              circuitTask.slot2 !== null ? " and C" : ""
            } to test the completed circuit.`}
            errorMessage="The circuit does not yet match the required logical expression. Check the order and type of the gates."
            hintVisible={builderHintVisible}
            hint={circuitTask.hint}
            workingVisible={builderWorkingVisible}
            working={circuitTask.working}
            examinerTip="In circuit questions, work from left to right. Calculate the output of each gate before using it as the input to the next gate."
          />
        </section>
      </div>
    </Card>
  );
}
