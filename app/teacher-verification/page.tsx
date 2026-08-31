"use client";

import {
  Suspense,
  useState,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

type Decision =
  | "approve"
  | "reject";

type VerificationResult =
  | "approved"
  | "rejected"
  | "review_required";

type Result = {
  decision:
    VerificationResult;

  teacherName: string;

  schoolName: string;
};

export default function TeacherVerificationPage() {
  return (
    <Suspense
      fallback={
        <VerificationLoading />
      }
    >
      <TeacherVerificationContent />
    </Suspense>
  );
}

function TeacherVerificationContent() {
  const searchParams =
    useSearchParams();

  const requestId =
    searchParams.get(
      "request",
    ) ?? "";

  const token =
    searchParams.get(
      "token",
    ) ?? "";

  const [
    submitting,
    setSubmitting,
  ] =
    useState<
      Decision | null
    >(null);

  const [
    result,
    setResult,
  ] =
    useState<Result | null>(
      null,
    );

  const [
    error,
    setError,
  ] =
    useState("");

  async function respond(
    decision: Decision,
  ) {
    if (
      !requestId ||
      !token ||
      submitting
    ) {
      return;
    }

    try {
      setSubmitting(
        decision,
      );

      setError("");

      const response =
        await fetch(
          "/api/teacher-verification/respond",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                requestId,
                token,
                decision,
              }),
          },
        );

      let body:
        Result & {
          error?: string;
        };

      try {
        body =
          (await response.json()) as
            Result & {
              error?: string;
            };
      } catch {
        throw new Error(
          "CS Master could not read the verification response.",
        );
      }

      if (!response.ok) {
        throw new Error(
          body.error ||
            "The verification decision could not be saved.",
        );
      }

      setResult(body);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The verification decision could not be saved.",
      );
    } finally {
      setSubmitting(null);
    }
  }

  if (
    !requestId ||
    !token
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
        <div className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl">
          <div className="text-5xl">
            🔒
          </div>

          <h1 className="mt-5 text-2xl font-black text-slate-950">
            Invalid verification link
          </h1>

          <p className="mt-3 leading-7 text-slate-600">
            This CS Master teacher verification link is incomplete.
          </p>

          <p className="mt-3 text-sm text-slate-500">
            Please use the complete secure link from the verification email.
          </p>
        </div>
      </main>
    );
  }

  if (result) {
    if (
      result.decision ===
      "review_required"
    ) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
          <div className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl">
            <div className="text-5xl">
              🛡️
            </div>

            <h1 className="mt-5 text-3xl font-black text-slate-950">
              School verification received
            </h1>

            <p className="mt-4 leading-7 text-slate-600">
              Thank you for confirming{" "}
              {result.teacherName}
              {" "}for{" "}
              {result.schoolName}.
            </p>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-left">
              <p className="font-black text-amber-950">
                Final CS Master review required
              </p>

              <p className="mt-2 text-sm leading-6 text-amber-800">
                For additional account security, this request requires a final CS Master review before teacher access is activated.
              </p>
            </div>

            <p className="mt-6 text-sm text-slate-500">
              You can safely close this window.
            </p>
          </div>
        </main>
      );
    }

    const approved =
      result.decision ===
      "approved";

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
        <div className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl">
          <div className="text-5xl">
            {approved
              ? "✅"
              : "❌"}
          </div>

          <h1 className="mt-5 text-3xl font-black text-slate-950">
            {approved
              ? "Teacher approved"
              : "Request rejected"}
          </h1>

          <p className="mt-4 leading-7 text-slate-600">
            {approved
              ? `${result.teacherName}'s CS Master teacher account has been verified for ${result.schoolName}.`
              : `${result.teacherName}'s teacher verification request has been rejected.`}
          </p>

          <p className="mt-6 text-sm text-slate-500">
            You can safely close this window.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-indigo-100 px-6 py-12">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="bg-slate-950 p-7 text-white">
          <p className="text-xs font-black uppercase tracking-widest text-blue-300">
            CS Master
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Verify a teacher request
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            School administrator verification
          </p>
        </div>

        <div className="p-7">
          <p className="leading-7 text-slate-700">
            A teacher has nominated your email address to verify that they are authorised to use CS Master for their school.
          </p>

          <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <p className="font-black text-blue-950">
              Only approve people you recognise as members of your school.
            </p>

            <p className="mt-2 text-sm leading-6 text-blue-900">
              If you do not recognise the request, select Reject. Simply opening this page does not approve the teacher.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-800"
            >
              {error}
            </div>
          )}

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={
                submitting !==
                null
              }
              onClick={() =>
                void respond(
                  "approve",
                )
              }
              className="rounded-xl bg-emerald-600 px-6 py-4 font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {submitting ===
              "approve"
                ? "Confirming..."
                : "Confirm teacher"}
            </button>

            <button
              type="button"
              disabled={
                submitting !==
                null
              }
              onClick={() =>
                void respond(
                  "reject",
                )
              }
              className="rounded-xl border border-red-300 bg-white px-6 py-4 font-black text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              {submitting ===
              "reject"
                ? "Rejecting..."
                : "Reject request"}
            </button>
          </div>

          <p className="mt-5 text-center text-xs leading-5 text-slate-500">
            School verification may be followed by additional CS Master checks before teacher privileges are activated.
          </p>
        </div>
      </div>
    </main>
  );
}

function VerificationLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

        <p className="mt-4 font-black text-slate-700">
          Loading secure teacher verification...
        </p>
      </div>
    </main>
  );
}
