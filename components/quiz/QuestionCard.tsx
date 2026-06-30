"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

type QuestionCardProps = {
  question: {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
  };
};

export default function QuestionCard({ question }: QuestionCardProps) {
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selected === question.answer;

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-900">
        {question.question}
      </h2>

      <div className="mt-5 space-y-3">
        {question.options.map((option) => (
          <button
            key={option}
            onClick={() => setSelected(option)}
            className={`w-full rounded-xl border p-3 text-left transition ${
              selected === option
                ? "border-blue-600 bg-blue-50"
                : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <Button onClick={() => setSubmitted(true)}>Check Answer</Button>
      </div>

      {submitted && (
        <div
          className={`mt-5 rounded-xl p-4 ${
            isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          <p className="font-semibold">
            {isCorrect ? "✅ Correct" : "❌ Not quite"}
          </p>
          <p className="mt-2 text-sm">{question.explanation}</p>
        </div>
      )}
    </Card>
  );
}