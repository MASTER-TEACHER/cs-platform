"use client";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useEffect, useState } from "react";


const questions = [
  {
    question: "What does CPU stand for?",
    options: [
      "Central Process Unit",
      "Central Processing Unit",
      "Computer Personal Unit",
      "Central Processor Utility",
    ],
    answer: "Central Processing Unit",
    explanation: "CPU stands for Central Processing Unit — the brain of the computer.",
  },
  {
    question: "What is 1 byte equal to?",
    options: ["4 bits", "8 bits", "16 bits", "32 bits"],
    answer: "8 bits",
    explanation: "1 byte = 8 bits. This is a fundamental unit of data in computing.",
  },
];

export default function Quiz() {
  const [timeLeft, setTimeLeft] = useState(60);
  const [examMode, setExamMode] = useState(true);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (option: string) => {
    setSelected(option);
    if (!examMode) setShowFeedback(true);

    if (option === questions[current].answer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setSelected(null);
    setShowFeedback(false);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
  const saveResult = async () => {
    await addDoc(collection(db, "results"), {
      score,
      total: questions.length,
      date: new Date(),
    });
  };
useEffect(() => {
  if (timeLeft > 0 && !finished) {
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  } else {
    setFinished(true);
  }
}, [timeLeft]);
  saveResult();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Quiz Complete 🎉</h1>
      <p>Your score: {score} / {questions.length}</p>
    </div>
  );
}

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Question {current + 1}
      </h1>

      <p className="mb-4">{questions[current].question}</p>
      <p className="mb-2">Time left: {timeLeft}s</p>

      <div className="space-y-2">
        {questions[current].options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            disabled={showFeedback}
            className={`block w-full text-left p-2 border rounded
              ${
                showFeedback
                  ? option === questions[current].answer
                    ? "bg-green-200"
                    : option === selected
                    ? "bg-red-200"
                    : ""
                  : "hover:bg-gray-100"
              }`}
          >
            {option}
          </button>
        ))}
      </div>

      {showFeedback && (
        <div className="mt-4">
          <p className="font-semibold">
            {selected === questions[current].answer
              ? "✅ Correct!"
              : "❌ Incorrect"}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {questions[current].explanation}
          </p>

          <button
            onClick={nextQuestion}
            className="mt-4 px-4 py-2 bg-black text-white rounded"
          >
            Next Question →
          </button>
        </div>
      )}
    </div>
  );
}
