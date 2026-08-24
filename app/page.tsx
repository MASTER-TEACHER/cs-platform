"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const router = useRouter();

  const {
    user,
    profile,
    loading,
    profileReady,
    profileError,
  } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace("/landing");
      return;
    }

    if (!profileReady || !profile) {
      return;
    }

    if (profile.role === "admin") {
      router.replace("/admin");
      return;
    }

    if (profile.role === "teacher") {
      router.replace("/teacher");
      return;
    }

    if (
      profile.accountIntent === "teacher"
    ) {
      router.replace("/teacher-access");
      return;
    }

    if (
      !profile.onboardingComplete ||
      !profile.qualification ||
      !profile.examBoard
    ) {
      router.replace("/onboarding");
      return;
    }

    router.replace("/dashboard");
  }, [
    loading,
    user,
    profileReady,
    profile,
    router,
  ]);

  if (profileError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-12">
        <section className="w-full max-w-xl rounded-3xl border border-red-200 bg-white p-8 shadow-xl">
          <p className="text-sm font-black uppercase tracking-widest text-red-700">
            CS Master
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Your account could not be opened
          </h1>

          <p className="mt-4 leading-7 text-slate-600">
            {profileError}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="rounded-xl bg-blue-600 px-5 py-3 font-black text-white hover:bg-blue-700"
            >
              Retry
            </button>

            <Link
              href="/landing"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-black text-slate-700 hover:bg-slate-50"
            >
              Go to home page
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

        <p className="mt-4 font-black text-slate-700">
          Opening CS Master...
        </p>
      </div>
    </main>
  );
}
