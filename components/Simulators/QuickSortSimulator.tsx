"use client";

import { useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import { useProgress } from "@/contexts/ProgressContext";

type Difficulty = "foundation" | "intermediate" | "higher";

type PartitionTask = {
  id: number;
  values: number[];
  depth: number;
};

type CompletedPartition = {
  id: number;
  original: number[];
  left: number[];
  pivot: number;
  right: number[];
  depth: number;
};

type Feedback =
  | {
      type: "success";
      title: string;
      message: string;
    }
  | {
      type: "error";
      title: string;
      message: string;
    }
  | null;

const difficultyConfig: Record<
  Difficulty,
  {
    label: string;
    description: string;
    size: number;
    min: number;
    max: number;
    xp: number;
  }
> = {
  foundation: {
    label: "Foundation",
    description: "Build confidence with smaller examples.",
    size: 5,
    min: 1,
    max: 25,
    xp: 10,
  },
  intermediate: {
    label: "Intermediate",
    description: "Standard GCSE-level practice.",
    size: 7,
    min: 1,
    max: 50,
    xp: 15,
  },
  higher: {
    label: "Higher",
    description: "More demanding examples and recursive partitions.",
    size: 9,
    min: 1,
    max: 99,
    xp: 20,
  },
};

function generateUniqueValues(
  size: number,
  min: number,
  max: number,
): number[] {
  const values = new Set<number>();

  while (values.size < size) {
    values.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }

  return Array.from(values);
}

function normaliseAnswer(value: string): number[] {
  return value
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(Number)
    .filter((item) => Number.isFinite(item));
}

function arraysEqual(first: number[], second: number[]) {
  return (
    first.length === second.length &&
    first.every((value, index) => value === second[index])
  );
}

export default function QuickSortSimulator() {
  const { addXP } = useProgress();

  const [difficulty, setDifficulty] = useState<Difficulty>("foundation");

  const initialConfig = difficultyConfig.foundation;

  const [originalValues, setOriginalValues] = useState<number[]>(() =>
    generateUniqueValues(
      initialConfig.size,
      initialConfig.min,
      initialConfig.max,
    ),
  );

  /*
   * Final-order challenge analytics
   */
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [workingVisible, setWorkingVisible] = useState(false);

  const [questions, setQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);

  /*
   * Hands-on procedure state
   */
  const [tasks, setTasks] = useState<PartitionTask[]>([
    {
      id: 1,
      values: originalValues,
      depth: 0,
    },
  ]);

  const [nextTaskId, setNextTaskId] = useState(2);

  const [completedPartitions, setCompletedPartitions] = useState<
    CompletedPartition[]
  >([]);

  const [leftBucket, setLeftBucket] = useState<number[]>([]);
  const [rightBucket, setRightBucket] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [correctSteps, setCorrectSteps] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [partitionsCompleted, setPartitionsCompleted] = useState(0);

  const [feedback, setFeedback] = useState<Feedback>(null);

  const config = difficultyConfig[difficulty];

  const sortedValues = useMemo(
    () => [...originalValues].sort((a, b) => a - b),
    [originalValues],
  );

  const activeTask = tasks[0] ?? null;

  const pivot =
    activeTask && activeTask.values.length > 1
      ? activeTask.values[activeTask.values.length - 1]
      : null;

  const candidates =
    activeTask && activeTask.values.length > 1
      ? activeTask.values.slice(0, -1)
      : [];

  const currentValue =
    currentIndex < candidates.length ? candidates[currentIndex] : null;

  const classificationComplete =
    activeTask !== null && currentIndex >= candidates.length;

  const procedureComplete = tasks.length === 0;

  const totalAttempts = correctSteps + mistakes;

  const procedureAccuracy =
    totalAttempts === 0 ? 0 : Math.round((correctSteps / totalAttempts) * 100);

  const finalAccuracy =
    questions === 0 ? 0 : Math.round((correctAnswers / questions) * 100);

  function resetProcedure(values = originalValues) {
    setTasks([
      {
        id: 1,
        values,
        depth: 0,
      },
    ]);

    setNextTaskId(2);
    setCompletedPartitions([]);
    setLeftBucket([]);
    setRightBucket([]);
    setCurrentIndex(0);

    setCorrectSteps(0);
    setMistakes(0);
    setPartitionsCompleted(0);

    setFeedback(null);
  }

  function createNewQuestion(nextDifficulty: Difficulty = difficulty) {
    const nextConfig = difficultyConfig[nextDifficulty];

    const newValues = generateUniqueValues(
      nextConfig.size,
      nextConfig.min,
      nextConfig.max,
    );

    setOriginalValues(newValues);
    setAnswer("");
    setSubmitted(false);
    setHintVisible(false);
    setWorkingVisible(false);

    setTasks([
      {
        id: 1,
        values: newValues,
        depth: 0,
      },
    ]);

    setNextTaskId(2);
    setCompletedPartitions([]);
    setLeftBucket([]);
    setRightBucket([]);
    setCurrentIndex(0);

    setCorrectSteps(0);
    setMistakes(0);
    setPartitionsCompleted(0);

    setFeedback(null);
  }

  function changeDifficulty(nextDifficulty: Difficulty) {
    setDifficulty(nextDifficulty);
    createNewQuestion(nextDifficulty);
  }

  function tryAgain() {
    setAnswer("");
    setSubmitted(false);
    setHintVisible(false);
    setWorkingVisible(false);
  }

  function checkFinalAnswer() {
    if (submitted || answer.trim() === "") return;

    const parsed = normaliseAnswer(answer);
    const isCorrect = arraysEqual(parsed, sortedValues);

    setSubmitted(true);
    setQuestions((current) => current + 1);

    if (isCorrect) {
      setCorrectAnswers((current) => current + 1);
      setXp((current) => current + config.xp);
      void addXP(config.xp);
      setStreak((current) => current + 1);
    } else {
      setStreak(0);
    }
  }

  function classify(direction: "left" | "right") {
    if (!activeTask || pivot === null || currentValue === null) {
      return;
    }

    const shouldGoLeft = currentValue < pivot;
    const correctDirection = shouldGoLeft ? "left" : "right";

    if (direction !== correctDirection) {
      setMistakes((current) => current + 1);

      setFeedback({
        type: "error",
        title: "Try that step again",
        message:
          currentValue < pivot
            ? `${currentValue} is smaller than pivot ${pivot}, so it belongs in the left partition.`
            : `${currentValue} is greater than pivot ${pivot}, so it belongs in the right partition.`,
      });

      return;
    }

    if (direction === "left") {
      setLeftBucket((current) => [...current, currentValue]);
    } else {
      setRightBucket((current) => [...current, currentValue]);
    }

    setCurrentIndex((current) => current + 1);
    setCorrectSteps((current) => current + 1);

    setFeedback({
      type: "success",
      title: "Correct procedure",
      message:
        direction === "left"
          ? `Correct. ${currentValue} < ${pivot}, so ${currentValue} moves to the left partition.`
          : `Correct. ${currentValue} > ${pivot}, so ${currentValue} moves to the right partition.`,
    });
  }

  function commitPartition() {
    if (!activeTask || pivot === null || !classificationComplete) {
      return;
    }

    const completed: CompletedPartition = {
      id: activeTask.id,
      original: activeTask.values,
      left: leftBucket,
      pivot,
      right: rightBucket,
      depth: activeTask.depth,
    };

    const remainingTasks = tasks.slice(1);

    const newTasks: PartitionTask[] = [];

    let idCounter = nextTaskId;

    if (leftBucket.length > 1) {
      newTasks.push({
        id: idCounter,
        values: leftBucket,
        depth: activeTask.depth + 1,
      });

      idCounter += 1;
    }

    if (rightBucket.length > 1) {
      newTasks.push({
        id: idCounter,
        values: rightBucket,
        depth: activeTask.depth + 1,
      });

      idCounter += 1;
    }

    setCompletedPartitions((current) => [...current, completed]);

    setTasks([...newTasks, ...remainingTasks]);
    setNextTaskId(idCounter);

    setLeftBucket([]);
    setRightBucket([]);
    setCurrentIndex(0);

    setCorrectSteps((current) => current + 1);
    setPartitionsCompleted((current) => current + 1);

    setFeedback({
      type: "success",
      title: "Partition complete",
      message:
        newTasks.length > 0
          ? `Pivot ${pivot} is now in its correct region. Continue Quick Sort on the remaining partition${
              newTasks.length > 1 ? "s" : ""
            }.`
          : `Pivot ${pivot} has been placed and this partition requires no further sorting.`,
    });
  }

  const canShowFoundationGuidance = difficulty === "foundation";

  const canShowIntermediateGuidance =
    difficulty === "foundation" || difficulty === "intermediate";

  return (
    <Card>
      <p className="text-xs font-black uppercase tracking-widest text-violet-600">
        Algorithm laboratory
      </p>

      <h2 className="mt-2 text-2xl font-black text-slate-950">
        Quick Sort Challenge
      </h2>

      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
        Predict the final order and then perform Quick Sort yourself by
        partitioning values around a pivot and recursively sorting the remaining
        partitions.
      </p>

      {/* Difficulty */}
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {(Object.keys(difficultyConfig) as Difficulty[]).map((level) => {
          const item = difficultyConfig[level];

          return (
            <button
              key={level}
              type="button"
              onClick={() => changeDifficulty(level)}
              className={`rounded-2xl border p-4 text-left transition ${
                difficulty === level
                  ? "border-violet-600 bg-violet-50"
                  : "border-slate-200 bg-white hover:border-violet-300"
              }`}
            >
              <p className="font-black text-slate-950">{item.label}</p>

              <p className="mt-1 text-xs text-slate-500">{item.description}</p>
            </button>
          );
        })}
      </div>

      {/* Overall stats */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Questions" value={questions} />
        <Stat label="Correct" value={correctAnswers} />
        <Stat label="Accuracy" value={`${finalAccuracy}%`} />
        <Stat label="XP" value={xp} />
        <Stat label="Streak" value={`🔥 ${streak}`} />
      </div>

      {/* Final-order challenge */}
      <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <p className="text-xs font-black uppercase tracking-widest text-blue-600">
          Final-order challenge
        </p>

        <h3 className="mt-2 font-black text-slate-950">
          Sort this list into ascending order.
        </h3>

        <div className="mt-4 flex flex-wrap gap-2">
          {originalValues.map((value, index) => (
            <div
              key={`${value}-${index}`}
              className="flex h-11 min-w-11 items-center justify-center rounded-xl bg-white px-3 font-black shadow-sm"
            >
              {value}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 p-5">
        <label className="font-black text-slate-950">
          Enter the final sorted list
        </label>

        <p className="mt-1 text-xs text-slate-500">
          Separate values using commas or spaces.
        </p>

        <input
          value={answer}
          disabled={submitted}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Example: 2, 3, 6, 8"
          className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-3 font-bold outline-none focus:border-violet-500"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={checkFinalAnswer}
            disabled={submitted || answer.trim() === ""}
            className="rounded-xl bg-blue-600 px-4 py-3 font-black text-white disabled:bg-slate-300"
          >
            {submitted ? "Answer checked" : "Check answer"}
          </button>

          <button
            type="button"
            onClick={() => setHintVisible((current) => !current)}
            className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 font-black text-amber-800"
          >
            {hintVisible ? "Hide hint" : "Hint"}
          </button>

          <button
            type="button"
            onClick={() => setWorkingVisible((current) => !current)}
            className="rounded-xl border border-violet-300 bg-violet-50 px-4 py-3 font-black text-violet-800"
          >
            {workingVisible ? "Hide working" : "Show working"}
          </button>

          <button
            type="button"
            onClick={tryAgain}
            className="rounded-xl border border-slate-300 px-4 py-3 font-black"
          >
            Try again
          </button>

          <button
            type="button"
            onClick={() => createNewQuestion()}
            className="rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 font-black text-blue-700"
          >
            New question
          </button>
        </div>
      </div>

      {hintVisible && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-xs font-black uppercase tracking-widest text-amber-700">
            Hint
          </p>
          <p className="mt-2 text-sm leading-6 text-amber-950">
            The final list must be in ascending order. In Quick Sort, partition
            values around a pivot, then recursively sort the left and right
            partitions.
          </p>
        </div>
      )}

      {workingVisible && (
        <div className="mt-4 rounded-2xl border border-violet-200 bg-violet-50 p-5">
          <p className="text-xs font-black uppercase tracking-widest text-violet-700">
            Worked solution
          </p>
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-violet-950">
            {`Starting list: ${originalValues.join(", ")}

A valid Quick Sort process repeatedly:
1. Chooses a pivot.
2. Places smaller values to the left of the pivot.
3. Places larger values to the right.
4. Repeats the process on each remaining partition.

Final sorted list: ${sortedValues.join(", ")}`}
          </p>
        </div>
      )}

      {submitted &&
        (arraysEqual(normaliseAnswer(answer), sortedValues) ? (
          <div className="mt-4 rounded-2xl border border-emerald-300 bg-emerald-50 p-5 text-emerald-950">
            <p className="font-black">✓ Correct</p>

            <p className="mt-2 text-sm">
              Correct. The sorted list is {sortedValues.join(", ")}.
            </p>

            <div className="mt-4 rounded-xl bg-white/70 p-4">
              <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
                Examiner tip
              </p>

              <p className="mt-2 text-sm">
                Quick Sort partitions values around a pivot. Values smaller than
                the pivot move to one side and larger values to the other before
                the process is repeated recursively.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-red-300 bg-red-50 p-5 text-red-950">
            <p className="font-black">✕ Not quite</p>

            <p className="mt-2 text-sm">
              Review the ordering and try the challenge again.
            </p>
          </div>
        ))}

      <div className="my-7 border-t border-slate-200" />

      {/* Hands-on simulator */}
      <p className="text-xs font-black uppercase tracking-widest text-violet-600">
        Hands-on algorithm practice
      </p>

      <h3 className="mt-2 text-xl font-black text-slate-950">
        Perform Quick Sort
      </h3>

      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
        Partition the list around a pivot. Decide whether each value belongs on
        the left or right, place the pivot, and repeat the procedure on each
        remaining partition.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <Stat label="Correct steps" value={correctSteps} />
        <Stat label="Mistakes" value={mistakes} />
        <Stat label="Procedure accuracy" value={`${procedureAccuracy}%`} />
        <Stat label="Partitions completed" value={partitionsCompleted} />
      </div>

      {!procedureComplete && activeTask && pivot !== null && (
        <>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <InfoBox
              label="Current partition"
              value={activeTask.values.join(", ")}
            />

            <InfoBox label="Pivot" value={String(pivot)} accent="violet" />

            <InfoBox
              label="Values classified"
              value={`${currentIndex} / ${candidates.length}`}
              accent="blue"
            />

            <InfoBox
              label="Recursion depth"
              value={String(activeTask.depth)}
              accent="emerald"
            />
          </div>

          <div className="mt-4 rounded-2xl border border-violet-200 bg-violet-50 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-violet-600">
              Partition phase
            </p>

            <h4 className="mt-2 text-lg font-black">
              Partition around pivot {pivot}
            </h4>

            <p className="mt-2 text-sm text-slate-600">
              {classificationComplete
                ? "All non-pivot values have been classified. Commit the partition."
                : canShowFoundationGuidance
                  ? `Compare ${currentValue} with pivot ${pivot}. Decide whether it belongs to the left or right partition.`
                  : canShowIntermediateGuidance
                    ? "Compare the highlighted value with the pivot and choose the correct partition."
                    : "Classify the highlighted value according to the Quick Sort partition rule."}
            </p>
          </div>

          <div className="mt-4 rounded-3xl bg-slate-950 p-7">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left */}
              <div className="rounded-2xl border border-blue-500/40 bg-blue-500/10 p-5">
                <p className="text-xs font-black uppercase tracking-widest text-blue-300">
                  Left partition
                </p>

                <div className="mt-4 flex min-h-16 flex-wrap gap-2">
                  {leftBucket.length === 0 ? (
                    <p className="text-sm text-slate-500">Waiting for values</p>
                  ) : (
                    leftBucket.map((value, index) => (
                      <NumberTile
                        key={`${value}-${index}`}
                        value={value}
                        variant="blue"
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Current */}
              <div className="rounded-2xl border border-violet-500/40 bg-violet-500/10 p-5 text-center">
                <p className="text-xs font-black uppercase tracking-widest text-violet-300">
                  Current value
                </p>

                <div className="mt-4 flex min-h-16 items-center justify-center gap-3">
                  {currentValue !== null ? (
                    <>
                      <NumberTile value={currentValue} variant="amber" />

                      <span className="text-xl font-black text-white">vs</span>

                      <NumberTile value={pivot} variant="violet" />
                    </>
                  ) : (
                    <p className="font-black text-emerald-300">
                      Classification complete
                    </p>
                  )}
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  Purple value = pivot
                </p>
              </div>

              {/* Right */}
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5">
                <p className="text-xs font-black uppercase tracking-widest text-emerald-300">
                  Right partition
                </p>

                <div className="mt-4 flex min-h-16 flex-wrap gap-2">
                  {rightBucket.length === 0 ? (
                    <p className="text-sm text-slate-500">Waiting for values</p>
                  ) : (
                    rightBucket.map((value, index) => (
                      <NumberTile
                        key={`${value}-${index}`}
                        value={value}
                        variant="emerald"
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {!classificationComplete ? (
              <>
                <button
                  type="button"
                  onClick={() => classify("left")}
                  className="rounded-xl border border-blue-300 bg-blue-50 px-5 py-3 font-black text-blue-700"
                >
                  ← Move left
                </button>

                <button
                  type="button"
                  onClick={() => classify("right")}
                  className="rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-3 font-black text-emerald-700"
                >
                  Move right →
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={commitPartition}
                className="rounded-xl bg-violet-600 px-5 py-3 font-black text-white"
              >
                Place pivot and continue →
              </button>
            )}

            <button
              type="button"
              onClick={() => resetProcedure()}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-black"
            >
              Reset procedure
            </button>
          </div>
        </>
      )}

      {feedback && (
        <div
          className={`mt-4 rounded-2xl border p-5 ${
            feedback.type === "success"
              ? "border-emerald-300 bg-emerald-50 text-emerald-950"
              : "border-red-300 bg-red-50 text-red-950"
          }`}
        >
          <p className="font-black">
            {feedback.type === "success" ? "✓ " : "✕ "}
            {feedback.title}
          </p>

          <p className="mt-2 text-sm">{feedback.message}</p>
        </div>
      )}

      {procedureComplete && (
        <div className="mt-5 rounded-2xl border border-emerald-300 bg-emerald-50 p-5">
          <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
            Procedure complete
          </p>

          <h3 className="mt-2 text-xl font-black text-emerald-950">
            Quick Sort completed successfully
          </h3>

          <div className="mt-5 flex flex-wrap justify-center gap-2 rounded-2xl bg-slate-950 p-6">
            {sortedValues.map((value, index) => (
              <NumberTile
                key={`${value}-${index}`}
                value={value}
                variant="emerald"
              />
            ))}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <InfoBox label="Final list" value={sortedValues.join(", ")} />

            <InfoBox
              label="Procedure accuracy"
              value={`${procedureAccuracy}%`}
            />

            <InfoBox label="Correct steps" value={String(correctSteps)} />

            <InfoBox label="Mistakes" value={String(mistakes)} />
          </div>

          <button
            type="button"
            onClick={() => resetProcedure()}
            className="mt-4 rounded-xl border border-emerald-400 bg-white px-5 py-3 font-black text-emerald-800"
          >
            Practise this list again
          </button>
        </div>
      )}

      {/* Partition history */}
      {completedPartitions.length > 0 && (
        <div className="mt-6 rounded-2xl border border-slate-200 p-5">
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">
            Partition history
          </p>

          <div className="mt-4 grid gap-3">
            {completedPartitions.map((partition, index) => (
              <div key={partition.id} className="rounded-xl bg-slate-50 p-4">
                <p className="font-black text-slate-950">
                  Partition {index + 1}
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  [{partition.original.join(", ")}] → [
                  {partition.left.join(", ")}]{"  "}
                  <strong className="text-violet-700">
                    Pivot {partition.pivot}
                  </strong>
                  {"  "}[{partition.right.join(", ")}]
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-widest text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function InfoBox({
  label,
  value,
  accent = "slate",
}: {
  label: string;
  value: string;
  accent?: "slate" | "blue" | "violet" | "emerald";
}) {
  const styles = {
    slate: "border-slate-200 bg-slate-50",
    blue: "border-blue-200 bg-blue-50",
    violet: "border-violet-200 bg-violet-50",
    emerald: "border-emerald-200 bg-emerald-50",
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[accent]}`}>
      <p className="text-xs font-black uppercase tracking-widest text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-black text-slate-950">{value}</p>
    </div>
  );
}

function NumberTile({
  value,
  variant,
}: {
  value: number;
  variant: "blue" | "violet" | "amber" | "emerald";
}) {
  const styles = {
    blue: "border-blue-400 bg-blue-600 text-white",
    violet: "border-violet-400 bg-violet-600 text-white",
    amber: "border-amber-400 bg-amber-500 text-slate-950",
    emerald: "border-emerald-400 bg-emerald-500 text-white",
  };

  return (
    <div
      className={`flex h-12 min-w-12 items-center justify-center rounded-xl border px-3 text-lg font-black ${styles[variant]}`}
    >
      {value}
    </div>
  );
}
