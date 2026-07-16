"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserCourseSelection } from "@/services/userService";
import toast from "react-hot-toast";

export default function CourseSelector() {
  const { user } = useAuth();

  const [qualification, setQualification] = useState("");
  const [examBoard, setExamBoard] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleContinue() {
    if (!user) {
      toast.error("You must be logged in.");
      return;
    }

    if (!qualification || !examBoard) {
      toast.error("Please select a qualification and exam board.");
      return;
    }

    setSaving(true);

    try {
      await updateUserCourseSelection(
        user.uid,
        qualification,
        examBoard
      );

      toast.success("Course saved successfully.");

      /*
       * A full navigation ensures useUserProfile reloads the newly
       * updated Firestore document before RequireCourse checks it.
       */
      window.location.assign("/dashboard");
    } catch (error) {
      console.error("Course selection error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong saving your course."
      );

      setSaving(false);
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
        <h2 className="font-semibold text-slate-900">
          Qualification
        </h2>

        <div className="mt-4 space-y-3">
          {["gcse", "alevel"].map((item) => (
            <button
              key={item}
              type="button"
              disabled={saving}
              onClick={() => setQualification(item)}
              className={`w-full rounded-xl border p-4 text-left font-semibold capitalize transition disabled:cursor-not-allowed disabled:opacity-60 ${
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
        <h2 className="font-semibold text-slate-900">
          Exam Board
        </h2>

        <div className="mt-4 space-y-3">
          {["ocr", "aqa", "edexcel"].map((board) => (
            <button
              key={board}
              type="button"
              disabled={saving}
              onClick={() => setExamBoard(board)}
              className={`w-full rounded-xl border p-4 text-left font-semibold capitalize transition disabled:cursor-not-allowed disabled:opacity-60 ${
                examBoard === board
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {board === "ocr"
                ? "OCR"
                : board === "aqa"
                  ? "AQA"
                  : "Edexcel"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <Button
          onClick={handleContinue}
          disabled={saving}
        >
          {saving ? "Saving Course..." : "Continue →"}
        </Button>
      </div>
    </Card>
  );
}