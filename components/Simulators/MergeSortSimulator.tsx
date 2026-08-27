"use client";

import { useMemo, useState } from "react";

import { useProgress } from "@/contexts/ProgressContext";

import SimulatorControls from "@/components/Simulators/common/SimulatorControls";
import SimulatorDifficulty from "@/components/Simulators/common/SimulatorDifficulty";
import SimulatorFeedback from "@/components/Simulators/common/SimulatorFeedback";
import SimulatorStats from "@/components/Simulators/common/SimulatorStats";

import {
  useSimulator,
  type SimulatorDifficulty as DifficultyLevel,
} from "@/components/Simulators/common/useSimulator";

type Question = {
  values: number[];
};

type ProcedureFeedbackType = "success" | "error" | "info" | null;

type MergeGroup = {
  id: string;
  values: number[];
};

type MergeState = {
  left: number[];
  right: number[];
  merged: number[];
};

function createUniqueValues(length: number): number[] {
  const values = new Set<number>();

  while (values.size < length) {
    values.add(Math.floor(Math.random() * 40) + 1);
  }

  return Array.from(values);
}

function createQuestion(difficulty: DifficultyLevel): Question {
  const length =
    difficulty === "foundation" ? 4 : difficulty === "intermediate" ? 6 : 8;

  return {
    values: createUniqueValues(length),
  };
}

function normaliseList(value: string): number[] {
  return value
    .split(/[\s,]+/)
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item));
}

function createWorking(question: Question): string {
  const sorted = [...question.values].sort((a, b) => a - b);

  return `Merge sort works in two phases:

1. Split the list repeatedly until each sublist contains one item.
2. Merge neighbouring sublists back together in sorted order.
3. During each merge, compare the first remaining item from each sublist.
4. Take the smaller value first.
5. Continue until one fully sorted list remains.

Starting list:
${question.values.join(", ")}

Final sorted list:
${sorted.join(", ")}`;
}

export default function MergeSortSimulator() {
  const { addXP } = useProgress();

  const simulator = useSimulator<Question>({
    initialQuestion: createQuestion("foundation"),
    generateQuestion: createQuestion,

    xpByDifficulty: {
      foundation: 10,
      intermediate: 15,
      higher: 20,
    },

    onAwardXP: addXP,
  });

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
  } = simulator;

  /*
   * =========================================================
   * SCORED CHALLENGE
   * =========================================================
   */

  const [answer, setAnswer] = useState("");

  const sortedValues = useMemo(
    () => [...question.values].sort((a, b) => a - b),
    [question.values],
  );

  const submittedValues = normaliseList(answer);

  const canCheck = submittedValues.length === question.values.length;

  function handleCheck() {
    if (!canCheck) {
      return;
    }

    const matches = sortedValues.every(
      (value, index) => value === submittedValues[index],
    );

    markAnswer(matches);
  }

  function handleTryAgain() {
    setAnswer("");
    resetQuestion();
  }

  const working = useMemo(() => createWorking(question), [question]);

  /*
   * =========================================================
   * PROCEDURAL TRAINER
   * =========================================================
   */

  const initialGroup: MergeGroup = {
    id: "root",
    values: [...question.values],
  };

  const [groups, setGroups] = useState<MergeGroup[]>([initialGroup]);

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const [phase, setPhase] = useState<"split" | "merge" | "complete">("split");

  const [, setMergeQueue] = useState<MergeGroup[][]>([]);

  const [currentMerge, setCurrentMerge] = useState<MergeState | null>(null);

  const [currentMergePairIds, setCurrentMergePairIds] = useState<
    [string, string] | null
  >(null);

  const [mergeRoundGroups, setMergeRoundGroups] = useState<MergeGroup[]>([]);

  const [nextRoundGroups, setNextRoundGroups] = useState<MergeGroup[]>([]);

  const [procedureCorrectSteps, setProcedureCorrectSteps] = useState(0);

  const [procedureMistakes, setProcedureMistakes] = useState(0);

  const [splitsCompleted, setSplitsCompleted] = useState(0);

  const [mergesCompleted, setMergesCompleted] = useState(0);

  const [procedureFeedback, setProcedureFeedback] = useState("");

  const [procedureFeedbackType, setProcedureFeedbackType] =
    useState<ProcedureFeedbackType>(null);

  const procedureAttempts = procedureCorrectSteps + procedureMistakes;

  const procedureAccuracy =
    procedureAttempts === 0
      ? 0
      : Math.round((procedureCorrectSteps / procedureAttempts) * 100);

  const allGroupsSingle =
    groups.length > 0 && groups.every((group) => group.values.length === 1);

  function resetProcedure() {
    setGroups([
      {
        id: "root",
        values: [...question.values],
      },
    ]);

    setSelectedGroupId(null);
    setPhase("split");

    setMergeQueue([]);
    setCurrentMerge(null);
    setCurrentMergePairIds(null);

    setMergeRoundGroups([]);
    setNextRoundGroups([]);

    setProcedureCorrectSteps(0);
    setProcedureMistakes(0);

    setSplitsCompleted(0);
    setMergesCompleted(0);

    setProcedureFeedback("");
    setProcedureFeedbackType(null);
  }

  function handleNewQuestion() {
    setAnswer("");

    setGroups([]);
    setSelectedGroupId(null);
    setPhase("split");

    setMergeQueue([]);
    setCurrentMerge(null);
    setCurrentMergePairIds(null);

    setMergeRoundGroups([]);
    setNextRoundGroups([]);

    setProcedureCorrectSteps(0);
    setProcedureMistakes(0);

    setSplitsCompleted(0);
    setMergesCompleted(0);

    setProcedureFeedback("");
    setProcedureFeedbackType(null);

    newQuestion();
  }

  function handleDifficultyChange(nextDifficulty: DifficultyLevel) {
    setAnswer("");

    setGroups([]);
    setSelectedGroupId(null);
    setPhase("split");

    setMergeQueue([]);
    setCurrentMerge(null);
    setCurrentMergePairIds(null);

    setMergeRoundGroups([]);
    setNextRoundGroups([]);

    setProcedureCorrectSteps(0);
    setProcedureMistakes(0);

    setSplitsCompleted(0);
    setMergesCompleted(0);

    setProcedureFeedback("");
    setProcedureFeedbackType(null);

    changeDifficulty(nextDifficulty);
  }

  function ensureProcedureInitialised() {
    if (groups.length === 0) {
      setGroups([
        {
          id: "root",
          values: [...question.values],
        },
      ]);
    }
  }

  function recordMistake(message: string) {
    setProcedureMistakes((current) => current + 1);
    setProcedureFeedback(message);
    setProcedureFeedbackType("error");
  }

  function recordSuccess(message: string) {
    setProcedureCorrectSteps((current) => current + 1);
    setProcedureFeedback(message);
    setProcedureFeedbackType("success");
  }

  /*
   * =========================================================
   * SPLIT PHASE
   * =========================================================
   */

  function nextSplittableGroup(): MergeGroup | undefined {
    return groups.find((group) => group.values.length > 1);
  }

  function selectGroup(groupId: string) {
    if (phase !== "split" || difficulty === "foundation") {
      return;
    }

    setSelectedGroupId(groupId);
    setProcedureFeedback("");
    setProcedureFeedbackType(null);
  }

  function splitGroup(group: MergeGroup) {
    if (group.values.length <= 1) {
      recordMistake("A single-item list cannot be split any further.");
      return;
    }

    const middle = Math.ceil(group.values.length / 2);

    const leftValues = group.values.slice(0, middle);
    const rightValues = group.values.slice(middle);

    const leftGroup: MergeGroup = {
      id: `${group.id}-L`,
      values: leftValues,
    };

    const rightGroup: MergeGroup = {
      id: `${group.id}-R`,
      values: rightValues,
    };

    setGroups((current) => {
      const index = current.findIndex((item) => item.id === group.id);

      if (index === -1) {
        return current;
      }

      const updated = [...current];

      updated.splice(index, 1, leftGroup, rightGroup);

      return updated;
    });

    setSplitsCompleted((current) => current + 1);

    recordSuccess(
      `Correct. [${group.values.join(", ")}] splits into [${leftValues.join(
        ", ",
      )}] and [${rightValues.join(", ")}].`,
    );

    setSelectedGroupId(null);
  }

  function handleSplit() {
    ensureProcedureInitialised();

    if (phase !== "split") {
      return;
    }

    if (difficulty === "foundation") {
      const group = nextSplittableGroup();

      if (!group) {
        recordMistake("All groups are already single-item lists.");
        return;
      }

      splitGroup(group);
      return;
    }

    if (!selectedGroupId) {
      recordMistake("Select a group that still contains more than one value.");
      return;
    }

    const selectedGroup = groups.find((group) => group.id === selectedGroupId);

    if (!selectedGroup) {
      return;
    }

    if (selectedGroup.values.length <= 1) {
      recordMistake(
        "That group already contains one item and cannot be split further.",
      );
      return;
    }

    splitGroup(selectedGroup);
  }

  /*
   * =========================================================
   * MERGE PHASE SETUP
   * =========================================================
   */

  function beginMergePhase() {
    if (!allGroupsSingle) {
      recordMistake(
        "Merge Sort cannot begin merging until every group contains one item.",
      );
      return;
    }

    const round = groups.map((group) => ({
      id: group.id,
      values: [...group.values],
    }));

    setMergeRoundGroups(round);
    setNextRoundGroups([]);
    setMergeQueue([]);

    setPhase("merge");
    setSelectedGroupId(null);

    recordSuccess(
      "Correct. Every sublist now contains one item, so the merge phase can begin.",
    );

    startNextMergePair(round, []);
  }

  function startNextMergePair(
    roundGroups: MergeGroup[],
    builtNextRound: MergeGroup[],
  ) {
    if (roundGroups.length === 0) {
      finishMergeRound(builtNextRound);
      return;
    }

    if (roundGroups.length === 1) {
      finishMergeRound([...builtNextRound, roundGroups[0]]);
      return;
    }

    const left = roundGroups[0];
    const right = roundGroups[1];

    setMergeRoundGroups(roundGroups.slice(2));
    setNextRoundGroups(builtNextRound);

    setCurrentMerge({
      left: [...left.values],
      right: [...right.values],
      merged: [],
    });

    setCurrentMergePairIds([left.id, right.id]);

    setProcedureFeedback(
      `Merge [${left.values.join(", ")}] with [${right.values.join(
        ", ",
      )}]. Choose the smaller front value.`,
    );

    setProcedureFeedbackType("info");
  }

  function finishMergeRound(completedGroups: MergeGroup[]) {
    if (completedGroups.length === 1) {
      setGroups(completedGroups);
      setCurrentMerge(null);
      setPhase("complete");

      setProcedureFeedback(
        "Excellent. All sublists have been merged into one sorted list.",
      );

      setProcedureFeedbackType("success");
      return;
    }

    setGroups(completedGroups);

    setMergeRoundGroups(completedGroups);
    setNextRoundGroups([]);

    setCurrentMerge(null);

    setProcedureFeedback(
      "Merge round complete. Begin merging the newly formed sorted sublists.",
    );

    setProcedureFeedbackType("success");

    startNextMergePair(completedGroups, []);
  }

  /*
   * =========================================================
   * MERGE INTERACTION
   * =========================================================
   */

  function takeFromSide(side: "left" | "right") {
    if (phase !== "merge" || !currentMerge) {
      return;
    }

    const leftFront = currentMerge.left[0];
    const rightFront = currentMerge.right[0];

    if (leftFront === undefined && rightFront === undefined) {
      return;
    }

    let expectedSide: "left" | "right";

    if (leftFront === undefined) {
      expectedSide = "right";
    } else if (rightFront === undefined) {
      expectedSide = "left";
    } else {
      expectedSide = leftFront <= rightFront ? "left" : "right";
    }

    if (side !== expectedSide) {
      const chosenValue = side === "left" ? leftFront : rightFront;

      const correctValue = expectedSide === "left" ? leftFront : rightFront;

      recordMistake(
        `Not quite. ${correctValue} is the smaller front value, so it must be taken before ${chosenValue}.`,
      );

      return;
    }

    const nextLeft = [...currentMerge.left];
    const nextRight = [...currentMerge.right];

    const value = side === "left" ? nextLeft.shift() : nextRight.shift();

    if (value === undefined) {
      return;
    }

    const nextMerged = [...currentMerge.merged, value];

    recordSuccess(`Correct. ${value} is the next smallest available value.`);

    const mergeFinished = nextLeft.length === 0 && nextRight.length === 0;

    if (!mergeFinished) {
      setCurrentMerge({
        left: nextLeft,
        right: nextRight,
        merged: nextMerged,
      });

      return;
    }

    const mergedGroup: MergeGroup = {
      id: currentMergePairIds
        ? `${currentMergePairIds[0]}+${currentMergePairIds[1]}`
        : `merged-${mergesCompleted + 1}`,
      values: nextMerged,
    };

    const updatedNextRound = [...nextRoundGroups, mergedGroup];

    setMergesCompleted((current) => current + 1);

    setCurrentMerge(null);
    setCurrentMergePairIds(null);

    startNextMergePair(mergeRoundGroups, updatedNextRound);
  }

  /*
   * Higher difficulty allows the learner to select the value itself.
   */

  const [selectedMergeSide, setSelectedMergeSide] = useState<
    "left" | "right" | null
  >(null);

  function selectMergeSide(side: "left" | "right") {
    if (difficulty !== "higher" || phase !== "merge" || !currentMerge) {
      return;
    }

    setSelectedMergeSide(side);
    setProcedureFeedback("");
    setProcedureFeedbackType(null);
  }

  function confirmMergeSelection() {
    if (!selectedMergeSide) {
      recordMistake("Select one of the two front values first.");
      return;
    }

    takeFromSide(selectedMergeSide);
    setSelectedMergeSide(null);
  }

  const procedureGroups =
    groups.length > 0
      ? groups
      : [
          {
            id: "root",
            values: [...question.values],
          },
        ];

  return (
    <section className="space-y-8 rounded-3xl border border-blue-200 bg-white p-6 shadow-sm md:p-8">
      <header>
        <p className="text-sm font-black uppercase tracking-widest text-blue-600">
          Algorithm laboratory
        </p>

        <h2 className="mt-2 text-3xl font-black text-slate-950">
          Merge Sort Challenge
        </h2>

        <p className="mt-3 max-w-3xl leading-7 text-slate-600">
          Predict the final sorted list, then perform Merge Sort yourself by
          splitting the data into smaller lists and merging them back together
          in order.
        </p>
      </header>

      <SimulatorDifficulty
        value={difficulty}
        onChange={handleDifficultyChange}
      />

      <SimulatorStats
        attempts={attempts}
        correct={correctAnswers}
        accuracy={accuracy}
        xp={xp}
        streak={streak}
      />

      {/* ==================================================== */}
      {/* SCORED CHALLENGE                                     */}
      {/* ==================================================== */}

      <section className="rounded-3xl border border-blue-200 bg-blue-50 p-6">
        <p className="text-xs font-black uppercase tracking-widest text-blue-600">
          Final-order challenge
        </p>

        <h3 className="mt-2 text-xl font-black">
          Sort this list into ascending order.
        </h3>

        <div className="mt-5 flex flex-wrap gap-3">
          {question.values.map((value, index) => (
            <div
              key={`${value}-${index}`}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-xl font-black"
            >
              {value}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 p-6">
        <label htmlFor="merge-sort-answer" className="font-black">
          Enter the final sorted list
        </label>

        <p className="mt-1 text-sm text-slate-500">
          Separate values using commas or spaces.
        </p>

        <input
          id="merge-sort-answer"
          value={answer}
          disabled={checked}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Example: 2, 3, 6, 8"
          className="mt-3 w-full rounded-2xl border border-slate-300 px-5 py-4 font-mono text-xl font-black outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
        />

        <div className="mt-5">
          <SimulatorControls
            canCheck={canCheck}
            checked={checked}
            hintVisible={hintVisible}
            workingVisible={workingVisible}
            resetLabel="Try again"
            newExampleLabel="New question"
            onCheck={handleCheck}
            onHint={toggleHint}
            onToggleWorking={toggleWorking}
            onReset={handleTryAgain}
            onNewExample={handleNewQuestion}
          />
        </div>
      </section>

      <SimulatorFeedback
        checked={checked}
        correct={correct}
        successMessage={`Correct. The sorted list is ${sortedValues.join(", ")}.`}
        errorMessage={`Not quite. The correct sorted order is ${sortedValues.join(", ")}.`}
        hintVisible={hintVisible}
        hint="Merge Sort repeatedly splits the list into smaller sublists, then merges those sublists back together in sorted order."
        workingVisible={workingVisible}
        working={working}
        examinerTip="Merge sort is a divide-and-conquer algorithm. It repeatedly divides the list and then merges sorted sublists until one sorted list remains."
      />

      {/* ==================================================== */}
      {/* HANDS-ON PROCEDURAL PRACTICE                         */}
      {/* ==================================================== */}

      <div className="border-t border-slate-200 pt-8">
        <p className="text-sm font-black uppercase tracking-widest text-violet-600">
          Hands-on algorithm practice
        </p>

        <h3 className="mt-2 text-2xl font-black">Perform Merge Sort</h3>

        <p className="mt-2 max-w-4xl leading-7 text-slate-600">
          Complete both phases of Merge Sort. First split the list until every
          sublist contains one item. Then merge the lists back together by
          repeatedly choosing the smallest front value.
        </p>

        {/* PROCEDURAL STATS */}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">
              Correct steps
            </p>

            <p className="mt-2 text-2xl font-black">{procedureCorrectSteps}</p>
          </article>

          <article className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">
              Mistakes
            </p>

            <p className="mt-2 text-2xl font-black">{procedureMistakes}</p>
          </article>

          <article className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">
              Procedure accuracy
            </p>

            <p className="mt-2 text-2xl font-black">{procedureAccuracy}%</p>
          </article>

          <article className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">
              Phase
            </p>

            <p className="mt-2 text-2xl font-black capitalize">{phase}</p>
          </article>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-blue-600">
              Splits completed
            </p>

            <p className="mt-2 text-2xl font-black">{splitsCompleted}</p>
          </article>

          <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-600">
              Merges completed
            </p>

            <p className="mt-2 text-2xl font-black">{mergesCompleted}</p>
          </article>
        </div>

        {/* ================================================== */}
        {/* SPLIT PHASE                                        */}
        {/* ================================================== */}

        {phase === "split" && (
          <>
            <section className="mt-6 rounded-3xl border border-violet-200 bg-violet-50 p-6">
              <p className="text-xs font-black uppercase tracking-widest text-violet-600">
                Split phase
              </p>

              <h4 className="mt-2 text-xl font-black">
                Divide the list into single-item sublists
              </h4>

              <p className="mt-2 text-slate-600">
                {difficulty === "foundation"
                  ? "The next group that needs splitting is identified automatically."
                  : difficulty === "intermediate"
                    ? "Select a group containing more than one item, then split it."
                    : "Choose the correct group to divide. Continue until every sublist contains one item."}
              </p>
            </section>

            <div className="mt-6 rounded-3xl bg-slate-950 p-7">
              <div className="flex flex-wrap justify-center gap-5">
                {procedureGroups.map((group) => {
                  const selected = selectedGroupId === group.id;

                  const autoSelected =
                    difficulty === "foundation" &&
                    nextSplittableGroup()?.id === group.id;

                  const complete = group.values.length === 1;

                  return (
                    <button
                      key={group.id}
                      type="button"
                      disabled={difficulty === "foundation" || complete}
                      onClick={() => selectGroup(group.id)}
                      className={`rounded-2xl border-2 p-4 transition ${
                        complete
                          ? "border-emerald-400 bg-emerald-500/20"
                          : selected || autoSelected
                            ? "border-blue-300 bg-blue-600/30"
                            : "border-slate-600 bg-slate-800 hover:border-blue-400"
                      }`}
                    >
                      <div className="flex gap-2">
                        {group.values.map((value, index) => (
                          <span
                            key={`${value}-${index}`}
                            className={`flex h-14 w-14 items-center justify-center rounded-xl text-lg font-black ${
                              complete
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-700 text-white"
                            }`}
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="mt-8 text-center text-sm text-slate-300">
                {allGroupsSingle
                  ? "All groups contain one item. The merge phase can begin."
                  : difficulty === "foundation"
                    ? "The highlighted group should be split next."
                    : "Select a group containing more than one value."}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {!allGroupsSingle && (
                <button
                  type="button"
                  onClick={handleSplit}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-black text-white"
                >
                  Split selected group
                </button>
              )}

              {allGroupsSingle && (
                <button
                  type="button"
                  onClick={beginMergePhase}
                  className="rounded-xl bg-violet-600 px-6 py-3 font-black text-white"
                >
                  Begin merge phase →
                </button>
              )}

              <button
                type="button"
                onClick={resetProcedure}
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-black"
              >
                Reset procedure
              </button>
            </div>
          </>
        )}

        {/* ================================================== */}
        {/* MERGE PHASE                                        */}
        {/* ================================================== */}

        {phase === "merge" && currentMerge && (
          <>
            <section className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
              <p className="text-xs font-black uppercase tracking-widest text-emerald-600">
                Merge phase
              </p>

              <h4 className="mt-2 text-xl font-black">
                Merge the two sorted sublists
              </h4>

              <p className="mt-2 text-slate-600">
                Compare the front value of each sublist and take the smaller one
                next.
              </p>
            </section>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {/* LEFT */}

              <section className="rounded-3xl border border-blue-200 bg-blue-50 p-6">
                <p className="text-xs font-black uppercase tracking-widest text-blue-600">
                  Left sublist
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {currentMerge.left.length > 0 ? (
                    currentMerge.left.map((value, index) => (
                      <button
                        key={`${value}-${index}`}
                        type="button"
                        disabled={difficulty !== "higher" || index !== 0}
                        onClick={() => selectMergeSide("left")}
                        className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 text-xl font-black ${
                          index === 0
                            ? selectedMergeSide === "left"
                              ? "border-blue-700 bg-blue-600 text-white"
                              : "border-blue-400 bg-white"
                            : "border-slate-200 bg-slate-100 text-slate-500"
                        }`}
                      >
                        {value}
                      </button>
                    ))
                  ) : (
                    <p className="font-bold text-slate-400">Empty</p>
                  )}
                </div>
              </section>

              {/* RESULT */}

              <section className="rounded-3xl border border-violet-200 bg-violet-50 p-6">
                <p className="text-xs font-black uppercase tracking-widest text-violet-600">
                  Merged result
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {currentMerge.merged.length > 0 ? (
                    currentMerge.merged.map((value, index) => (
                      <div
                        key={`${value}-${index}`}
                        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600 text-xl font-black text-white"
                      >
                        {value}
                      </div>
                    ))
                  ) : (
                    <p className="font-bold text-slate-400">
                      Choose the first value
                    </p>
                  )}
                </div>
              </section>

              {/* RIGHT */}

              <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
                <p className="text-xs font-black uppercase tracking-widest text-emerald-600">
                  Right sublist
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {currentMerge.right.length > 0 ? (
                    currentMerge.right.map((value, index) => (
                      <button
                        key={`${value}-${index}`}
                        type="button"
                        disabled={difficulty !== "higher" || index !== 0}
                        onClick={() => selectMergeSide("right")}
                        className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 text-xl font-black ${
                          index === 0
                            ? selectedMergeSide === "right"
                              ? "border-emerald-700 bg-emerald-600 text-white"
                              : "border-emerald-400 bg-white"
                            : "border-slate-200 bg-slate-100 text-slate-500"
                        }`}
                      >
                        {value}
                      </button>
                    ))
                  ) : (
                    <p className="font-bold text-slate-400">Empty</p>
                  )}
                </div>
              </section>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {difficulty !== "higher" ? (
                <>
                  <button
                    type="button"
                    disabled={currentMerge.left.length === 0}
                    onClick={() => takeFromSide("left")}
                    className="rounded-xl border border-blue-300 bg-blue-50 px-6 py-3 font-black text-blue-800 disabled:opacity-40"
                  >
                    Take left value
                  </button>

                  <button
                    type="button"
                    disabled={currentMerge.right.length === 0}
                    onClick={() => takeFromSide("right")}
                    className="rounded-xl border border-emerald-300 bg-emerald-50 px-6 py-3 font-black text-emerald-800 disabled:opacity-40"
                  >
                    Take right value
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={confirmMergeSelection}
                  className="rounded-xl bg-violet-600 px-6 py-3 font-black text-white"
                >
                  Confirm selected value
                </button>
              )}

              <button
                type="button"
                onClick={resetProcedure}
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-black"
              >
                Reset procedure
              </button>
            </div>
          </>
        )}

        {/* ================================================== */}
        {/* PROCEDURE FEEDBACK                                 */}
        {/* ================================================== */}

        {procedureFeedback && (
          <section
            className={`mt-6 rounded-2xl border p-5 ${
              procedureFeedbackType === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                : procedureFeedbackType === "error"
                  ? "border-red-300 bg-red-50 text-red-900"
                  : "border-blue-300 bg-blue-50 text-blue-900"
            }`}
          >
            <p className="font-black">
              {procedureFeedbackType === "success"
                ? "✓ Correct procedure"
                : procedureFeedbackType === "error"
                  ? "✕ Try that step again"
                  : "Procedure update"}
            </p>

            <p className="mt-2 leading-7">{procedureFeedback}</p>
          </section>
        )}

        {/* ================================================== */}
        {/* COMPLETE                                           */}
        {/* ================================================== */}

        {phase === "complete" && (
          <section className="mt-6 rounded-3xl border border-emerald-300 bg-emerald-50 p-6">
            <p className="text-sm font-black uppercase tracking-widest text-emerald-700">
              Procedure complete
            </p>

            <h4 className="mt-2 text-2xl font-black text-emerald-950">
              Merge Sort completed successfully
            </h4>

            <div className="mt-5 rounded-2xl bg-slate-950 p-6">
              <div className="flex flex-wrap justify-center gap-3">
                {procedureGroups[0]?.values.map((value, index) => (
                  <div
                    key={`${value}-${index}`}
                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-xl font-black text-white"
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-4">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-black uppercase text-slate-500">
                  Final list
                </p>

                <p className="mt-2 font-mono font-black">
                  {procedureGroups[0]?.values.join(", ")}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-black uppercase text-slate-500">
                  Procedure accuracy
                </p>

                <p className="mt-2 text-2xl font-black">{procedureAccuracy}%</p>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-black uppercase text-slate-500">
                  Splits
                </p>

                <p className="mt-2 text-2xl font-black">{splitsCompleted}</p>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-black uppercase text-slate-500">
                  Merges
                </p>

                <p className="mt-2 text-2xl font-black">{mergesCompleted}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={resetProcedure}
              className="mt-5 rounded-xl border border-slate-300 bg-white px-6 py-3 font-black"
            >
              Practise this list again
            </button>
          </section>
        )}
      </div>
    </section>
  );
}
