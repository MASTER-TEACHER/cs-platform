"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

type Props = {
  question: string;
  answer: string;
};

export default function PracticeQuestionCard({
  question,
  answer,
}: Props) {
  const [userAnswer, setUserAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const isCorrect =
    userAnswer.trim().toLowerCase() ===
    answer.trim().toLowerCase();

  function handleCheckAnswer() {
    setChecked(true);
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-slate-900">
        {question}
      </h3>

      <input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Type your answer..."
        className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
      />

      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={handleCheckAnswer}>
          Check Answer
        </Button>

        <Button onClick={() => setShowAnswer((prev) => !prev)}>
  {showAnswer ? "Hide Answer" : "Show Answer"}
</Button>
      </div>

      {checked && (
        <div className="mt-4">
          {isCorrect ? (
            <div className="rounded-xl bg-green-50 p-4">
              <p className="font-semibold text-green-700">
                ✅ Correct!
              </p>

              <p className="mt-2 text-sm text-green-600">
                Excellent work!
              </p>
            </div>
          ) : (
            <div className="rounded-xl bg-red-50 p-4">
              <p className="font-semibold text-red-700">
                ❌ Not quite.
              </p>

              <p className="mt-2 text-sm text-red-600">
                Check the explanation above and try again.
              </p>
            </div>
          )}
        </div>
      )}

      {showAnswer && (
        <div className="mt-4 rounded-xl bg-blue-50 p-4">
          <h4 className="font-semibold text-blue-700">
            Correct Answer
          </h4>

          <p className="mt-2 text-slate-700">
            {answer}
          </p>
        </div>
      )}
    </Card>
  );
}