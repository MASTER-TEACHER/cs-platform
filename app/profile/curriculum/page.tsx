"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { getCurriculumDefinition } from "@/data/curriculum/curriculumMap";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserCourseSelection } from "@/services/userService";
import type { ExamBoard, Qualification } from "@/types/user";

const qualificationOptions: Array<{
  value: Qualification;
  title: string;
  description: string;
}> = [
  {
    value: "GCSE",
    title: "GCSE",
    description:
      "Study GCSE Computer Science lessons, quizzes and exam-style questions.",
  },
  {
    value: "A_LEVEL",
    title: "A-level",
    description: "Study advanced programming, algorithms, systems and theory.",
  },
];

const examBoardOptions: Array<{
  value: ExamBoard;
  title: string;
  description: string;
}> = [
  {
    value: "AQA",
    title: "AQA",
    description: "AQA Computer Science curriculum",
  },
  {
    value: "OCR",
    title: "OCR",
    description: "OCR Computer Science curriculum",
  },
  {
    value: "EDEXCEL",
    title: "Pearson Edexcel",
    description: "Pearson Edexcel Computer Science curriculum",
  },
];

export default function CurriculumSettingsPage() {
  const router = useRouter();

  const { user, profile, loading, profileReady, profileError, refreshProfile } =
    useAuth();

  const [qualification, setQualification] = useState<Qualification>("GCSE");

  const [examBoard, setExamBoard] = useState<ExamBoard>("AQA");

  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
      return;
    }

    if (!loading && profileReady && profile && profile.role !== "student") {
      router.replace(profile.role === "admin" ? "/admin" : "/teacher");
      return;
    }

    if (
      profile?.qualification === "GCSE" ||
      profile?.qualification === "A_LEVEL"
    ) {
      setQualification(profile.qualification);
    }

    if (
      profile?.examBoard === "AQA" ||
      profile?.examBoard === "OCR" ||
      profile?.examBoard === "EDEXCEL"
    ) {
      setExamBoard(profile.examBoard);
    }
  }, [loading, user, profileReady, profile, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      setError("You must be signed in to change your curriculum.");
      return;
    }

    if (
      !getCurriculumDefinition(
        qualification,
        examBoard,
      )
    ) {
      setError(
        "This qualification and exam-board combination is not currently published.",
      );
      return;
    }

    setSubmitting(true);
    setSaved(false);
    setError("");

    try {
      await updateUserCourseSelection(user.uid, {
        qualification,
        examBoard,
      });

      const refreshedProfile = await refreshProfile();

      if (
        !refreshedProfile ||
        refreshedProfile.qualification !== qualification ||
        refreshedProfile.examBoard !== examBoard ||
        refreshedProfile.onboardingComplete !== true
      ) {
        throw new Error(
          "The curriculum was saved, but the updated profile could not be confirmed.",
        );
      }

      setSaved(true);

      router.replace("/learn");
    } catch (caughtError) {
      console.error("Unable to update curriculum:", caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Your curriculum could not be updated.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || (user && !profileReady && !profileError)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <p className="mt-4 font-bold text-slate-700">
            Loading curriculum settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-blue-600">
              Curriculum settings
            </p>

            <h1 className="mt-2 text-4xl font-black text-slate-950">
              Change your Computer Science course
            </h1>

            <p className="mt-4 max-w-3xl leading-7 text-slate-600">
              Your selection controls the units, topics, lessons, quizzes and
              exam-board content shown throughout CS Master.
            </p>
          </div>

          <Link
            href="/learn"
            className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-black text-slate-700 transition hover:bg-slate-50"
          >
            Back to Learn
          </Link>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-800"
          >
            {error}
          </div>
        )}

        {saved && (
          <div
            role="status"
            className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 font-semibold text-emerald-800"
          >
            Your curriculum has been updated.
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-10 space-y-10">
          <fieldset>
            <legend className="text-xl font-black text-slate-950">
              1. Qualification
            </legend>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {qualificationOptions.map((option) => {
                const selected = qualification === option.value;

                return (
                  <label
                    key={option.value}
                    className={`cursor-pointer rounded-2xl border-2 p-6 transition ${
                      selected
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-blue-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="qualification"
                      value={option.value}
                      checked={selected}
                      onChange={() => setQualification(option.value)}
                      className="sr-only"
                    />

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xl font-black text-slate-950">
                          {option.title}
                        </p>

                        <p className="mt-2 leading-7 text-slate-600">
                          {option.description}
                        </p>
                      </div>

                      <span
                        className={`mt-1 h-6 w-6 shrink-0 rounded-full border-2 ${
                          selected
                            ? "border-blue-600 bg-blue-600 ring-4 ring-blue-100"
                            : "border-slate-300"
                        }`}
                      />
                    </div>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xl font-black text-slate-950">
              2. Exam board
            </legend>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {examBoardOptions.map((option) => {
                const selected = examBoard === option.value;

                return (
                  <label
                    key={option.value}
                    className={`cursor-pointer rounded-2xl border-2 p-6 transition ${
                      selected
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-slate-200 bg-white hover:border-indigo-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="examBoard"
                      value={option.value}
                      checked={selected}
                      onChange={() => setExamBoard(option.value)}
                      className="sr-only"
                    />

                    <p className="text-xl font-black text-slate-950">
                      {option.title}
                    </p>

                    <p className="mt-2 leading-7 text-slate-600">
                      {option.description}
                    </p>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {!getCurriculumDefinition(
            qualification,
            examBoard,
          ) && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 font-semibold text-amber-900">
              This qualification and exam-board combination is not currently
              published in CS Master. Choose an available curriculum.
            </div>
          )}

          <button
            type="submit"
            disabled={
              submitting ||
              !getCurriculumDefinition(
                qualification,
                examBoard,
              )
            }
            className="w-full rounded-2xl bg-blue-600 px-6 py-4 text-lg font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {submitting ? "Updating curriculum..." : "Save curriculum"}
          </button>
        </form>
      </section>
    </div>
  );
}
