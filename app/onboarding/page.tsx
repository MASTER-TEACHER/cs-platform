"use client";

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
import {
  updateUserCourseSelection,
} from "@/services/userService";
import { useAuth } from "@/contexts/AuthContext";

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

type ExtendedUserProfile = {
  accountIntent?: string | null;
  teacherAccessStatus?:
    | string
    | null;
};

export default function OnboardingPage() {
  const router = useRouter();

  const {
    user,
    profile,
    loading,
    profileReady,
    profileError,
    refreshProfile,
  } = useAuth();

  const extendedProfile =
    profile as
      | (typeof profile &
          ExtendedUserProfile)
      | null;

  const supportedSubjects =
    getSupportedSubjects();

  const initialSubject: Subject =
    supportedSubjects.includes(
      "COMPUTER_SCIENCE",
    )
      ? "COMPUTER_SCIENCE"
      : supportedSubjects[0] ||
        "COMPUTER_SCIENCE";

  const [subject, setSubject] =
    useState<Subject>(
      initialSubject,
    );

  const initialQualifications =
    getSupportedQualifications(
      initialSubject,
    );

  const initialQualification:
    Qualification =
      initialQualifications.includes(
        "GCSE",
      )
        ? "GCSE"
        : initialQualifications[0] ||
          "GCSE";

  const [
    qualification,
    setQualification,
  ] =
    useState<Qualification>(
      initialQualification,
    );

  const initialBoards =
    getSupportedExamBoards(
      initialSubject,
      initialQualification,
    );

  const initialExamBoard:
    ExamBoard =
      initialBoards.includes("AQA")
        ? "AQA"
        : initialBoards[0] ||
          "OCR";

  const [examBoard, setExamBoard] =
    useState<ExamBoard>(
      initialExamBoard,
    );

  const [submitting, setSubmitting] =
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
      profile?.role !== "student"
    ) {
      router.replace("/teacher");
      return;
    }

    /*
     * Teacher applicants must never be sent through
     * student curriculum onboarding.
     */
    if (
      !loading &&
      profileReady &&
      extendedProfile?.accountIntent ===
        "teacher"
    ) {
      router.replace(
        "/teacher-access",
      );

      return;
    }

    if (
      !loading &&
      profileReady &&
      profile?.onboardingComplete &&
      profile.qualification &&
      profile.examBoard
    ) {
      router.replace(
        "/dashboard",
      );
    }
  }, [
    loading,
    user,
    profileReady,
    profile,
    extendedProfile?.accountIntent,
    router,
  ]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!user) {
      setError(
        "You must be signed in to complete your profile.",
      );

      return;
    }

    if (!curriculum) {
      setError(
        "This subject, qualification and exam-board combination is not currently published in CS Master.",
      );

      return;
    }

    setSubmitting(true);
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
        refreshedProfile
          .onboardingComplete !== true ||
        refreshedProfile.subject !==
          subject ||
        refreshedProfile
          .qualification !==
          qualification ||
        refreshedProfile.examBoard !==
          examBoard
      ) {
        throw new Error(
          "Your curriculum was saved, but the updated profile could not be confirmed.",
        );
      }

      router.replace(
        "/dashboard",
      );
    } catch (caughtError) {
      console.error(
        "Unable to save curriculum selection:",
        caughtError,
      );

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Your curriculum selection could not be saved.",
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
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <p className="mt-4 font-bold text-slate-700">
            Preparing your curriculum...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl md:p-12">
          <p className="text-sm font-black uppercase tracking-widest text-blue-600">
            Student setup
          </p>

          <h1 className="mt-3 text-4xl font-black text-slate-950">
            Choose your CS Master course
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Select your subject,
            qualification and exam board.
            CS Master will use these
            choices to show the correct
            curriculum throughout your
            learning experience.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-800"
            >
              {error}
            </div>
          )}

          {profileError && (
            <div
              role="alert"
              className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-800"
            >
              {profileError}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-10"
          >
            <fieldset>
              <legend className="text-xl font-black text-slate-950">
                1. Select your subject
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
                2. Select your
                qualification
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
                3. Select your exam board
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
                          onChange={() => {
                            setExamBoard(
                              option.value,
                            );

                            setError("");
                          }}
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
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
                This subject,
                qualification and
                exam-board combination
                is not currently
                published in CS Master.
                Choose one of the
                available curriculum
                combinations to
                continue.
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
                ? "Saving your curriculum..."
                : "Continue to CS Master"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}