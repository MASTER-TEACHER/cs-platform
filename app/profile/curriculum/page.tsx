"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";

import {
  getCurriculumDefinition,
} from "@/data/curriculum/curriculumMap";
import {
  getSupportedExamBoards,
  getSupportedQualifications,
  getSupportedSubjects,
} from "@/data/curriculum/supportedCurriculumOptions";
import { useAuth } from "@/contexts/AuthContext";
import {
  updateUserCourseSelection,
} from "@/services/userService";

import type {
  ExamBoard,
  Qualification,
  Subject,
} from "@/types/user";

const subjectOptions: Array<{
  value: Subject;
  title: string;
  description: string;
}> = [
  {
    value: "COMPUTER_SCIENCE",
    title: "Computer Science",
    description:
      "Programming, algorithms, systems, data, networks and exam preparation.",
  },
  {
    value: "CREATIVE_IMEDIA",
    title: "Creative iMedia",
    description:
      "OCR Cambridge National in Creative iMedia (J834), including media products, planning and coursework guidance.",
  },
];

const qualificationOptions: Array<{
  value: Qualification;
  title: string;
  description: string;
}> = [
  {
    value: "GCSE",
    title: "GCSE / Level 1/2",
    description:
      "Study GCSE Computer Science or Level 1/2 Creative iMedia content.",
  },
  {
    value: "A_LEVEL",
    title: "A-level",
    description:
      "Study advanced Computer Science theory, algorithms and programming.",
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
    description:
      "AQA Computer Science curriculum",
  },
  {
    value: "OCR",
    title: "OCR",
    description:
      "OCR curriculum",
  },
  {
    value: "EDEXCEL",
    title: "Pearson Edexcel",
    description:
      "Pearson Edexcel Computer Science curriculum",
  },
];

export default function CurriculumSettingsPage() {
  const router = useRouter();

  const {
    user,
    profile,
    loading,
    profileReady,
    profileError,
    refreshProfile,
  } = useAuth();

  const supportedSubjects =
    getSupportedSubjects();

  const [subject, setSubject] =
    useState<Subject>(
      "COMPUTER_SCIENCE",
    );

  const [qualification, setQualification] =
    useState<Qualification>(
      "GCSE",
    );

  const [examBoard, setExamBoard] =
    useState<ExamBoard>(
      "AQA",
    );

  const [submitting, setSubmitting] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState("");

  const supportedQualifications =
    getSupportedQualifications(
      subject,
    );

  const supportedBoards =
    getSupportedExamBoards(
      subject,
      qualification,
    );

  const curriculum =
    getCurriculumDefinition(
      subject,
      qualification,
      examBoard,
    );

  function selectSubject(
    nextSubject: Subject,
  ) {
    const nextQualifications =
      getSupportedQualifications(
        nextSubject,
      );

    const nextQualification =
      nextQualifications.includes(
        qualification,
      )
        ? qualification
        : nextQualifications[0] ||
          "GCSE";

    const nextBoards =
      getSupportedExamBoards(
        nextSubject,
        nextQualification,
      );

    const nextExamBoard =
      nextBoards.includes(examBoard)
        ? examBoard
        : nextBoards[0] ||
          "OCR";

    setSubject(
      nextSubject,
    );

    setQualification(
      nextQualification,
    );

    setExamBoard(
      nextExamBoard,
    );

    setSaved(false);
    setError("");
  }

  function selectQualification(
    nextQualification: Qualification,
  ) {
    const nextBoards =
      getSupportedExamBoards(
        subject,
        nextQualification,
      );

    setQualification(
      nextQualification,
    );

    if (
      !nextBoards.includes(
        examBoard,
      )
    ) {
      setExamBoard(
        nextBoards[0] ||
          "OCR",
      );
    }

    setSaved(false);
    setError("");
  }

  function selectExamBoard(
    nextExamBoard: ExamBoard,
  ) {
    setExamBoard(
      nextExamBoard,
    );

    setSaved(false);
    setError("");
  }

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
      return;
    }

    if (
      !loading &&
      profileReady &&
      profile &&
      profile.role !== "student"
    ) {
      router.replace(
        profile.role === "admin"
          ? "/admin"
          : "/teacher",
      );

      return;
    }

    if (
      !profileReady ||
      !profile
    ) {
      return;
    }

    /*
     * Existing Computer Science users may not yet have
     * the new subject field. Treat those legacy profiles
     * as Computer Science until the repair layer persists
     * the canonical subject.
     */
    const savedSubject: Subject =
      profile.subject ===
      "CREATIVE_IMEDIA"
        ? "CREATIVE_IMEDIA"
        : "COMPUTER_SCIENCE";

    const availableQualifications =
      getSupportedQualifications(
        savedSubject,
      );

    let savedQualification:
      Qualification =
        profile.qualification ===
        "A_LEVEL"
          ? "A_LEVEL"
          : "GCSE";

    if (
      !availableQualifications.includes(
        savedQualification,
      )
    ) {
      savedQualification =
        availableQualifications[0] ||
        "GCSE";
    }

    const availableBoards =
      getSupportedExamBoards(
        savedSubject,
        savedQualification,
      );

    let savedExamBoard:
      ExamBoard =
        profile.examBoard ===
        "OCR"
          ? "OCR"
          : profile.examBoard ===
              "EDEXCEL"
            ? "EDEXCEL"
            : "AQA";

    if (
      !availableBoards.includes(
        savedExamBoard,
      )
    ) {
      savedExamBoard =
        availableBoards[0] ||
        "OCR";
    }

        queueMicrotask(() => {
      setSubject(
        savedSubject,
      );

      setQualification(
        savedQualification,
      );

      setExamBoard(
        savedExamBoard,
      );
    });
  }, [
    loading,
    user,
    profileReady,
    profile,
    router,
  ]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!user) {
      setError(
        "You must be signed in to change your curriculum.",
      );

      return;
    }

    if (!curriculum) {
      setError(
        "This subject, qualification and exam-board combination is not currently published.",
      );

      return;
    }

    setSubmitting(true);
    setSaved(false);
    setError("");

    try {
      await updateUserCourseSelection(
        user.uid,
        {
          subject,
          qualification,
          examBoard,
        },
      );

      const refreshedProfile =
        await refreshProfile();

      if (
        !refreshedProfile ||
        refreshedProfile.subject !==
          subject ||
        refreshedProfile
          .qualification !==
          qualification ||
        refreshedProfile.examBoard !==
          examBoard ||
        refreshedProfile
          .onboardingComplete !== true
      ) {
        throw new Error(
          "The curriculum was saved, but the updated profile could not be confirmed.",
        );
      }

      setSaved(true);

      router.replace(
        "/learn",
      );
    } catch (caughtError) {
      console.error(
        "Unable to update curriculum:",
        caughtError,
      );

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Your curriculum could not be updated.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (
    loading ||
    (
      user &&
      !profileReady &&
      !profileError
    )
  ) {
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
              Change your CS Master course
            </h1>

            <p className="mt-4 max-w-3xl leading-7 text-slate-600">
              Choose your subject,
              qualification and exam board.
              Your selection controls the
              curriculum shown throughout
              CS Master.
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

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-10"
        >
          <fieldset>
            <legend className="text-xl font-black text-slate-950">
              1. Subject
            </legend>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {subjectOptions
                .filter((option) =>
                  supportedSubjects.includes(
                    option.value,
                  ),
                )
                .map((option) => {
                  const selected =
                    subject ===
                    option.value;

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
                        name="subject"
                        value={
                          option.value
                        }
                        checked={
                          selected
                        }
                        onChange={() =>
                          selectSubject(
                            option.value,
                          )
                        }
                        className="sr-only"
                      />

                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xl font-black text-slate-950">
                            {
                              option.title
                            }
                          </p>

                          <p className="mt-2 leading-7 text-slate-600">
                            {
                              option.description
                            }
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
              2. Qualification
            </legend>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {qualificationOptions
                .filter((option) =>
                  supportedQualifications.includes(
                    option.value,
                  ),
                )
                .map((option) => {
                  const selected =
                    qualification ===
                    option.value;

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
                        value={
                          option.value
                        }
                        checked={
                          selected
                        }
                        onChange={() =>
                          selectQualification(
                            option.value,
                          )
                        }
                        className="sr-only"
                      />

                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xl font-black text-slate-950">
                            {
                              option.title
                            }
                          </p>

                          <p className="mt-2 leading-7 text-slate-600">
                            {
                              option.description
                            }
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
              3. Exam board
            </legend>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {examBoardOptions
                .filter((option) =>
                  supportedBoards.includes(
                    option.value,
                  ),
                )
                .map((option) => {
                  const selected =
                    examBoard ===
                    option.value;

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
                        value={
                          option.value
                        }
                        checked={
                          selected
                        }
                        onChange={() =>
                          selectExamBoard(
                            option.value,
                          )
                        }
                        className="sr-only"
                      />

                      <p className="text-xl font-black text-slate-950">
                        {
                          option.title
                        }
                      </p>

                      <p className="mt-2 leading-7 text-slate-600">
                        {subject ===
                        "CREATIVE_IMEDIA"
                          ? "OCR Cambridge National in Creative iMedia (J834)"
                          : option.description}
                      </p>
                    </label>
                  );
                })}
            </div>
          </fieldset>

          {curriculum ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
              <p className="text-sm font-black uppercase tracking-wider text-emerald-700">
                Selected curriculum
              </p>

              <p className="mt-2 text-lg font-black">
                {curriculum.title}
              </p>

              <p className="mt-1 text-sm font-semibold text-emerald-800">
                {
                  curriculum.specificationLabel
                }
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 font-semibold text-amber-900">
              This subject,
              qualification and exam-board
              combination is not currently
              published in CS Master.
              Choose an available curriculum.
            </div>
          )}

          <button
            type="submit"
            disabled={
              submitting ||
              !curriculum
            }
            className="w-full rounded-2xl bg-blue-600 px-6 py-4 text-lg font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {submitting
              ? "Updating curriculum..."
              : "Save curriculum"}
          </button>
        </form>
      </section>
    </div>
  );
}