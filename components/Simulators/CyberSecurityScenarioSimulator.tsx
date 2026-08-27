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

type SecurityChoice = "safe" | "unsafe";

type Question = {
  prompt: string;
  safe: string;
  unsafe: string;
  hint: string;
  working: string;
};

type ChoiceOption = readonly [SecurityChoice, string];

const BANK: Record<Difficulty, Question[]> = {
  foundation: [
    {
      prompt: "An email says your account will close unless you click a link.",
      safe: "Open the official website yourself and report the email.",
      unsafe: "Click the link and sign in immediately.",
      hint: "Urgency is a common social-engineering technique.",
      working:
        "Do not trust the supplied link. Verify through a known official route and report the message.",
    },
    {
      prompt: "You find an unknown USB drive in school.",
      safe: "Give it to authorised IT staff without connecting it.",
      unsafe: "Plug it in to find the owner.",
      hint: "Unknown removable media may contain malware.",
      working:
        "Do not connect unknown media to a computer. Hand it to authorised staff.",
    },
  ],

  intermediate: [
    {
      prompt:
        "A caller claiming to be IT asks for your one-time authentication code.",
      safe: "Refuse and verify the request independently.",
      unsafe: "Share it because the caller knows your name.",
      hint: "Authentication secrets should not be disclosed.",
      working:
        "Names can be researched. End the call and contact IT using a trusted method.",
    },
    {
      prompt: "A website certificate warning appears before a login page.",
      safe: "Stop and verify the site and connection.",
      unsafe: "Ignore the warning and enter credentials.",
      hint: "Certificate warnings can indicate an unsafe connection.",
      working:
        "Do not submit credentials until the site and certificate problem have been verified.",
    },
  ],

  higher: [
    {
      prompt:
        "A finance employee receives a realistic message from a senior manager requesting an urgent bank-detail change.",
      safe: "Verify the request using a separate trusted channel before changing anything.",
      unsafe:
        "Process it because the sender name and writing style look correct.",
      hint: "Consider impersonation and business-email compromise.",
      working:
        "Identity indicators can be spoofed. Sensitive changes need independent verification.",
    },
    {
      prompt: "A user reports repeated MFA prompts they did not initiate.",
      safe: "Reject the prompts, change credentials and report the incident.",
      unsafe: "Approve one prompt to make the notifications stop.",
      hint: "Think about MFA fatigue attacks.",
      working:
        "Unexpected prompts may mean stolen credentials. Never approve them; secure and report the account.",
    },
  ],
};

function pickQuestion(difficulty: Difficulty): Question {
  const questions = BANK[difficulty];

  return questions[Math.floor(Math.random() * questions.length)];
}

export default function CyberSecurityScenarioSimulator() {
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

  const [choice, setChoice] = useState<SecurityChoice | null>(null);

  const options = useMemo<ChoiceOption[]>(() => {
    const safe: ChoiceOption = ["safe", simulator.question.safe];
    const unsafe: ChoiceOption = ["unsafe", simulator.question.unsafe];

    const orderKey = `${simulator.question.safe}|${simulator.question.unsafe}`
      .split("")
      .reduce((total, character) => total + character.charCodeAt(0), 0);

    return orderKey % 2 === 0 ? [safe, unsafe] : [unsafe, safe];
  }, [simulator.question]);

  function checkAnswer() {
    simulator.markAnswer(choice === "safe");
  }

  function resetQuestion() {
    setChoice(null);
    simulator.resetQuestion();
  }

  function newScenario() {
    setChoice(null);
    simulator.newQuestion();
  }

  function changeDifficulty(difficulty: Difficulty) {
    setChoice(null);
    simulator.changeDifficulty(difficulty);
  }

  return (
    <Card>
      <p className="text-sm font-black uppercase tracking-widest text-blue-600">
        Interactive challenge
      </p>

      <h2 className="mt-2 text-3xl font-black text-slate-950">
        Cyber Security Decision Lab
      </h2>

      <p className="mt-3 text-slate-600">
        Identify the safest response and justify defensive behaviour.
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
          Scenario
        </p>

        <p className="mt-3 text-xl font-black leading-8">
          {simulator.question.prompt}
        </p>
      </section>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {options.map(([value, text]) => (
          <button
            key={value}
            type="button"
            onClick={() => setChoice(value)}
            disabled={simulator.checked}
            className={`rounded-2xl border-2 p-5 text-left font-bold transition ${
              choice === value
                ? "border-blue-600 bg-blue-50"
                : "border-slate-200 bg-white hover:border-blue-300"
            } disabled:cursor-not-allowed disabled:opacity-70`}
          >
            {text}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <SimulatorControls
          canCheck={choice !== null}
          checked={simulator.checked}
          hintVisible={simulator.hintVisible}
          workingVisible={simulator.workingVisible}
          onCheck={checkAnswer}
          onHint={simulator.toggleHint}
          onToggleWorking={simulator.toggleWorking}
          onReset={resetQuestion}
          onNewExample={newScenario}
          newExampleLabel="New scenario"
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
          successMessage="Correct defensive decision."
          errorMessage="That response creates unnecessary security risk."
          examinerTip="In exam answers, name the threat and explain how the control reduces its likelihood or impact."
        />
      </div>
    </Card>
  );
}
