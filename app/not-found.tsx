"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useUserProfile } from "@/hooks/useUserProfile";

export default function NotFoundPage() {
  const router = useRouter();
  const { profile, loading } = useUserProfile();

  const dashboardHref =
    profile?.role === "admin"
      ? "/admin"
      : profile?.role === "teacher"
        ? "/teacher"
        : "/dashboard";

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl">
        <div className="text-7xl" aria-hidden="true">
          🧭
        </div>

        <p className="mt-5 text-sm font-black uppercase tracking-widest text-blue-600">
          Error 404
        </p>

        <h1 className="mt-2 text-4xl font-black text-slate-950">
          Page not found
        </h1>

        <p className="mt-4 leading-7 text-slate-600">
          This page does not exist, may have moved, or the learning topic has
          not been published yet.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
          >
            ← Go back
          </button>

          <Link
            href={loading ? "/dashboard" : dashboardHref}
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
          >
            Return to dashboard
          </Link>
        </div>

        <Link
          href="/learn"
          className="mt-5 inline-block font-bold text-blue-600 hover:text-blue-700"
        >
          Browse available lessons
        </Link>
      </div>
    </main>
  );
}
