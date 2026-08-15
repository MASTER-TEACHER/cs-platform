"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import ProgrammingWorkspace from "@/components/programming/ProgrammingWorkspace";
import { useAuth } from "@/contexts/AuthContext";

export default function ProgrammingPage() {
  const router = useRouter();

  const {
    user,
    profile,
    loading,
    profileReady,
    profileError,
  } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
      return;
    }

    if (
      !loading &&
      profileReady &&
      profile?.role === "student" &&
      (!profile.onboardingComplete ||
        !profile.qualification ||
        !profile.examBoard)
    ) {
      router.replace("/onboarding");
    }
  }, [
    loading,
    user,
    profileReady,
    profile,
    router,
  ]);

  if (
    loading ||
    (user &&
      !profileReady &&
      !profileError)
  ) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />

          <p className="mt-4 font-bold text-slate-700">
            Preparing programming workspace...
          </p>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <section className="rounded-3xl border border-red-200 bg-red-50 p-8">
        <h1 className="text-2xl font-black text-red-950">
          Programming workspace unavailable
        </h1>

        <p className="mt-3 text-red-800">
          {profileError}
        </p>
      </section>
    );
  }

  if (
    !profile?.qualification ||
    !profile.examBoard
  ) {
    return (
      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
        <h1 className="text-2xl font-black text-amber-950">
          Choose your curriculum first
        </h1>

        <p className="mt-3 text-amber-800">
          Programming practice is matched to your qualification and exam board.
        </p>

        <Link
          href="/profile/curriculum"
          className="mt-5 inline-flex rounded-xl bg-amber-600 px-5 py-3 font-black text-white"
        >
          Choose curriculum
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-violet-950 via-indigo-950 to-blue-900 p-8 text-white shadow-lg">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-200">
          Live programming practice
        </p>

        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-black">
              Python Programming
            </h1>

            <p className="mt-3 max-w-3xl leading-7 text-white/75">
              Run code, complete visible and hidden tests, debug programs and build practical evidence for your CS Master profile.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-wide text-violet-200">
              Active curriculum
            </p>

            <p className="mt-1 font-black">
              {profile.examBoard} ·{" "}
              {profile.qualification ===
              "A_LEVEL"
                ? "A-level"
                : "GCSE"}
            </p>
          </div>
        </div>
      </section>

      <ProgrammingWorkspace />
    </div>
  );
}
