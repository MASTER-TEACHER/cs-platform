"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserCourseSelection } from "@/services/userService";

export default function CourseSelector() {
  const router = useRouter();
  const { user } = useAuth();

  const [qualification, setQualification] = useState("");
  const [examBoard, setExamBoard] = useState("");

  async function handleContinue() {
  console.log("Continue clicked");

  if (!user) {
    alert("You must be logged in.");
    return;
  }

  if (!qualification || !examBoard) {
    alert("Please select a qualification and exam board.");
    return;
  }

  try {
    console.log("Saving course selection...", {
      uid: user.uid,
      qualification,
      examBoard,
    });

    await updateUserCourseSelection(user.uid, qualification, examBoard);

    alert("Course saved successfully!");
    router.push("/");
  } catch (error) {
    console.error("Course selection error:", error);
    alert("Something went wrong saving your course. Check the console.");
  }
}

  return (
    <Card>
      <h1 className="text-3xl font-bold text-slate-900">
        Welcome to CS Master
      </h1>

      <p className="mt-2 text-slate-600">
        Let&apos;s personalise your learning.
      </p>

      <div className="mt-8">
        <h2 className="font-semibold text-slate-900">Qualification</h2>

        <div className="mt-4 space-y-3">
          {["gcse", "alevel"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setQualification(item)}
              className={`w-full rounded-xl border p-4 text-left font-semibold capitalize transition ${
                qualification === item
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {item === "gcse" ? "GCSE" : "A Level"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-semibold text-slate-900">Exam Board</h2>

        <div className="mt-4 space-y-3">
          {["ocr", "aqa", "edexcel"].map((board) => (
            <button
              key={board}
              type="button"
              onClick={() => setExamBoard(board)}
              className={`w-full rounded-xl border p-4 text-left font-semibold capitalize transition ${
                examBoard === board
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {board}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <Button onClick={handleContinue}>Continue →</Button>
      </div>
    </Card>
  );
}