"use client";

import { useCallback, useMemo, useState } from "react";

import SimulatorControls from "@/components/Simulators/common/SimulatorControls";
import SimulatorDifficulty from "@/components/Simulators/common/SimulatorDifficulty";
import SimulatorFeedback from "@/components/Simulators/common/SimulatorFeedback";
import SimulatorStats from "@/components/Simulators/common/SimulatorStats";
import {
  useSimulator,
  type SimulatorDifficulty as Difficulty,
} from "@/components/Simulators/common/useSimulator";
import Card from "@/components/ui/Card";
import { useProgress } from "@/contexts/ProgressContext";

type PasswordRating = "weak" | "medium" | "strong";

type Question = {
  password: string;
  answer: PasswordRating;
  hint: string;
  working: string;
};

const QUESTION_SETS: Record<Difficulty, Question[]> = {
  foundation: [
    {
      password: "password123",
      answer: "weak",
      hint: "Look for common words and predictable numbers.",
      working:
        "Common words plus predictable digits are easy to guess and vulnerable to dictionary attacks.",
    },
    {
      password: "Football1",
      answer: "weak",
      hint: "Personal interests and common patterns reduce strength.",
      working: "A common word with one digit remains predictable.",
    },
  ],

  intermediate: [
    {
      password: "River!Glass7",
      answer: "strong",
      hint: "Length and unpredictability matter more than simple substitutions.",
      working:
        "This is longer and mixes unrelated terms, punctuation and a digit.",
    },
    {
      password: "Summer2026!",
      answer: "medium",
      hint: "It has variety, but is the phrase predictable?",
      working:
        "It has length and character variety but uses a common seasonal pattern and year.",
    },
  ],

  higher: [
    {
      password: "orbit-lantern-47-cobalt",
      answer: "strong",
      hint: "Long passphrases can be strong when words are not personally predictable.",
      working: "Length and unrelated words create a large search space.",
    },
    {
      password: "P@ssw0rd!",
      answer: "weak",
      hint: "Attackers know common substitutions.",
      working:
        "Predictable substitutions in a common password do not make it strong.",
    },
  ],
};

const RATINGS: PasswordRating[] = ["weak", "medium", "strong"];

function pickQuestion(difficulty: Difficulty): Question {
  const questions = QUESTION_SETS[difficulty];

  return questions[Math.floor(Math.random() * questions.length)];
}

export default function PasswordSecuritySimulator() {
  const { addXP } = useProgress();

  const generateQuestion = useCallback(
    (difficulty: Difficulty) => pickQuestion(difficulty),
    [],
  );

  const simulator = useSimulator<Question>({
    initialQuestion: pickQuestion("foundation"),
    generateQuestion,
    onAwardXP: addXP,
  });

  const [answer, setAnswer] = useState<PasswordRating | null>(null);

  const [labPassword, setLabPassword] = useState("");

  const labScore = useMemo(() => {
    let score = 0;

    if (labPassword.length >= 12) {
      score += 1;
    }

    if (/[A-Z]/.test(labPassword) && /[a-z]/.test(labPassword)) {
      score += 1;
    }

    if (/\d/.test(labPassword)) {
      score += 1;
    }

    if (/[^A-Za-z0-9]/.test(labPassword)) {
      score += 1;
    }

    return score;
  }, [labPassword]);

  const labLabels = [
    "Very weak",
    "Weak",
    "Developing",
    "Strong",
    "Very strong",
  ];

  function resetQuestion() {
    setAnswer(null);
    simulator.resetQuestion();
  }

  function newQuestion() {
    setAnswer(null);
    simulator.newQuestion();
  }

  function changeDifficulty(difficulty: Difficulty) {
    setAnswer(null);
    simulator.changeDifficulty(difficulty);
  }

  function checkAnswer() {
    simulator.markAnswer(answer === simulator.question.answer);
  }

  return (
    <Card>
      <p className="text-sm font-black uppercase tracking-widest text-blue-600">
        Interactive challenge + explorer
      </p>

      <h2 className="mt-2 text-3xl font-black text-slate-950">
        Password Security Lab
      </h2>

      <p className="mt-3 text-slate-600">
        Classify password strength, explain weaknesses and explore how length
        and unpredictability affect security.
      </p>

      <div className="mt-6">
        <SimulatorDifficulty
          value={simulator.difficulty}
          onChange={changeDifficulty}
        />
      </div>

      <div className="mt-6">
        <SimulatorStats
          attempts={simulator.attempts}
          correct={simulator.correctAnswers}
          accuracy={simulator.accuracy}
          xp={simulator.xp}
          streak={simulator.streak}
        />
      </div>

      <section className="mt-6 rounded-3xl bg-slate-950 p-6 text-white">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">
          Classify this password
        </p>

        <p className="mt-3 break-all font-mono text-3xl font-black">
          {simulator.question.password}
        </p>
      </section>

      <div className="mt-4 flex flex-wrap gap-3">
        {RATINGS.map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => setAnswer(rating)}
            disabled={simulator.checked}
            className={`rounded-xl px-5 py-3 font-black capitalize transition ${
              answer === rating
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-800 hover:bg-slate-200"
            } disabled:cursor-not-allowed disabled:opacity-70`}
          >
            {rating}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <SimulatorControls
          canCheck={answer !== null}
          checked={simulator.checked}
          hintVisible={simulator.hintVisible}
          workingVisible={simulator.workingVisible}
          onCheck={checkAnswer}
          onHint={simulator.toggleHint}
          onToggleWorking={simulator.toggleWorking}
          onReset={resetQuestion}
          onNewExample={newQuestion}
        />
      </div>

      <div className="mt-5">
        <SimulatorFeedback
          checked={simulator.checked}
          correct={simulator.correct}
          hintVisible={simulator.hintVisible}
          hint={simulator.question.hint}
          workingVisible={simulator.workingVisible}
          working={simulator.question.working}
          successMessage={`Correct. "${simulator.question.password}" is best classified as ${simulator.question.answer}.`}
          errorMessage={`Not quite. This example is best classified as ${simulator.question.answer}. Review the characteristics that affect password strength.`}
          examinerTip="Password strength depends strongly on length and unpredictability. Multi-factor authentication adds another layer of protection."
        />
      </div>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-black uppercase tracking-widest text-violet-600">
          Explore mode
        </p>

        <h3 className="mt-2 text-xl font-black text-slate-950">
          Password Strength Explorer
        </h3>

        <p className="mt-2 text-slate-600">
          Try a made-up example. Do not enter a real password. This is a simple
          educational model rather than a security audit tool.
        </p>

        <input
          value={labPassword}
          onChange={(event) => setLabPassword(event.target.value)}
          placeholder="Type a made-up password"
          className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3"
        />

        <div className="mt-5 rounded-2xl bg-slate-50 p-5">
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">
            Teaching-model strength
          </p>

          <p className="mt-2 text-2xl font-black text-slate-950">
            {labLabels[labScore]}
          </p>

          <div className="mt-4 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
            <p>{labPassword.length >= 12 ? "✓" : "○"} At least 12 characters</p>

            <p>
              {/[A-Z]/.test(labPassword) && /[a-z]/.test(labPassword)
                ? "✓"
                : "○"}{" "}
              Uppercase and lowercase
            </p>

            <p>{/\d/.test(labPassword) ? "✓" : "○"} Contains a number</p>

            <p>
              {/[^A-Za-z0-9]/.test(labPassword) ? "✓" : "○"} Contains a symbol
            </p>
          </div>
        </div>
      </section>
    </Card>
  );
}
