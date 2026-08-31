"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("CS Master route error", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <main className="flex min-h-[65vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-red-200 bg-white p-9 text-center shadow-sm">
        <p className="text-sm font-black uppercase tracking-widest text-red-700">
          Something went wrong
        </p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">
          This page could not be loaded
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          Your saved account data has not been intentionally changed by this error.
          Try the page again. If the problem continues, use the Help or Contact page.
        </p>
        {error.digest && (
          <p className="mt-4 font-mono text-xs text-slate-500">
            Reference: {error.digest}
          </p>
        )}
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-blue-700 px-5 py-3 font-black text-white hover:bg-blue-800"
          >
            Try again
          </button>
          <a
            href="/help"
            className="rounded-xl border border-slate-300 px-5 py-3 font-black text-slate-700 hover:bg-slate-50"
          >
            Get help
          </a>
        </div>
      </div>
    </main>
  );
}