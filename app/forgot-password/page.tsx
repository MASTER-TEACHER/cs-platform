"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { sendPasswordResetEmail } from "firebase/auth";

import { auth } from "@/lib/firebase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (sending) {
      return;
    }

    const cleanedEmail = email.trim();

    if (!cleanedEmail) {
      setError("Enter the email address linked to your CS Master account.");
      return;
    }

    try {
      setSending(true);
      setError("");

      await sendPasswordResetEmail(auth, cleanedEmail);

      setSent(true);
    } catch (resetError) {
      console.error("Password reset error:", resetError);

      const code =
        resetError &&
        typeof resetError === "object" &&
        "code" in resetError &&
        typeof resetError.code === "string"
          ? resetError.code
          : "";

      if (code === "auth/invalid-email") {
        setError("Enter a valid email address.");
      } else if (code === "auth/too-many-requests") {
        setError(
          "Too many password reset attempts were made. Please wait a little while and try again.",
        );
      } else {
        /*
         * Keep the response deliberately neutral so the page does not
         * disclose whether a particular email address has an account.
         */
        setSent(true);
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
            CS Master
          </p>

          <h1 className="mt-3 text-3xl font-black text-slate-950">
            Reset your password
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Enter the email address linked to your account and we&apos;ll send
            you a password-reset link.
          </p>
        </div>

        {sent ? (
          <div className="mt-8">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="font-black text-emerald-900">
                Check your email
              </p>

              <p className="mt-2 text-sm leading-6 text-emerald-800">
                If an account exists for{" "}
                <span className="font-bold">{email.trim()}</span>, a password
                reset email has been sent.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSent(false);
                setEmail("");
                setError("");
              }}
              className="mt-5 w-full rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Use another email
            </button>

            <Link
              href="/login"
              className="mt-3 flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-black text-white transition hover:bg-blue-700"
            >
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8">
            <label className="block">
              <span className="text-sm font-bold text-slate-700">
                Email address
              </span>

              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                autoComplete="email"
                placeholder="you@example.com"
                className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={sending}
              className="mt-6 min-h-12 w-full rounded-xl bg-blue-600 px-5 py-3 font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? "Sending reset link..." : "Send reset link"}
            </button>

            <Link
              href="/login"
              className="mt-5 block text-center text-sm font-bold text-blue-600 hover:text-blue-700"
            >
              ← Back to login
            </Link>
          </form>
        )}
      </section>
    </main>
  );
}