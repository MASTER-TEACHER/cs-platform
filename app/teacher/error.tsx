"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function TeacherError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-red-50 p-8">
      <AlertTriangle className="h-8 w-8 text-red-700" />
      <h1 className="mt-4 text-2xl font-black text-red-950">Teacher workspace error</h1>
      <p className="mt-3 text-sm leading-6 text-red-800">
        {error.message || "This teacher page could not be loaded."}
      </p>
      <button type="button" onClick={reset} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-700 px-5 py-3 text-sm font-black text-white">
        <RotateCcw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}
