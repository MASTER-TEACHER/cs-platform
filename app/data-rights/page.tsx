"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";

const requestOptions = [
  ["access", "Access my personal data"],
  ["correction", "Correct inaccurate personal data"],
  ["erasure", "Request erasure"],
  ["restriction", "Request restriction of processing"],
  ["objection", "Object to processing"],
  ["portability", "Request a portable copy"],
  ["other", "Other privacy request"],
] as const;

type PrivacyRequestType = (typeof requestOptions)[number][0];

export default function DataRightsPage() {
  const { user, profile, loading } = useAuth();

  const [requestType, setRequestType] =
    useState<PrivacyRequestType>("access");

  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (loading) {
      setError(
        "Your account is still being checked. Please wait a moment and try again.",
      );
      return;
    }

    if (!user) {
      setError(
        "You must be signed in before you can submit a privacy request.",
      );
      return;
    }

    if (submitting) {
      return;
    }

    const cleanedDetails = details.trim();

    if (cleanedDetails.length < 10) {
      setError(
        "Please provide at least 10 characters so we can understand your request.",
      );
      return;
    }

    setSubmitting(true);

    try {
      const token = await user.getIdToken(true);

      const response = await fetch("/api/privacy/requests", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestType,
          details: cleanedDetails,
        }),
      });

      let result: {
        success?: boolean;
        id?: string;
        message?: string;
        error?: string;
      } = {};

      try {
        result = (await response.json()) as typeof result;
      } catch {
        throw new Error(
          "CS Master received an invalid response while submitting the privacy request.",
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "Your privacy request could not be submitted.",
        );
      }

      setMessage(
        result.message ||
          "Your privacy request has been recorded successfully.",
      );

      setDetails("");
      setRequestType("access");
    } catch (caughtError) {
      console.error("Privacy request submission failed:", caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Your privacy request could not be submitted.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const accountDisplayName =
    profile?.name ||
    user?.displayName ||
    user?.email ||
    "CS Master user";

  const canSubmit =
    !loading &&
    Boolean(user) &&
    !submitting &&
    details.trim().length >= 10;

  return (
    <main className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 p-8 text-white">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-200">
          Privacy
        </p>

        <h1 className="mt-3 text-4xl font-black">
          Your data rights
        </h1>

        <p className="mt-4 max-w-3xl leading-7 text-blue-100">
          Use this form to ask CS Master about personal information
          associated with your signed-in account. Some school-managed
          requests may need to be coordinated with your school.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        {loading ? (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm font-semibold text-blue-800">
            Checking your account...
          </div>
        ) : user ? (
          <div className="rounded-2xl bg-slate-50 p-5 text-sm leading-6 text-slate-700">
            Signed in as{" "}
            <strong>{accountDisplayName}</strong>.
            {" "}
            Do not include passwords, safeguarding information,
            medical details, or other unnecessary sensitive
            information in this form.
          </div>
        ) : (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="font-bold text-amber-900">
              Sign in required
            </p>

            <p className="mt-2 text-sm leading-6 text-amber-800">
              You must be signed in to your CS Master account before
              submitting a data-rights request. This allows CS Master
              to associate the request with the correct account and
              verify your identity.
            </p>

            <Link
              href="/login"
              className="mt-4 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
            >
              Sign in to continue
            </Link>
          </div>
        )}

        <form
          onSubmit={submitRequest}
          className="mt-6 space-y-5"
        >
          <label className="grid gap-2 font-semibold text-slate-800">
            What would you like to request?

            <select
              value={requestType}
              onChange={(event) =>
                setRequestType(
                  event.target.value as PrivacyRequestType,
                )
              }
              disabled={loading || !user || submitting}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
            >
              {requestOptions.map(([value, label]) => (
                <option
                  key={value}
                  value={value}
                >
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 font-semibold text-slate-800">
            Details

            <textarea
              value={details}
              onChange={(event) =>
                setDetails(event.target.value)
              }
              minLength={10}
              maxLength={4000}
              rows={8}
              required
              disabled={loading || !user || submitting}
              placeholder="Explain what information or account issue your request concerns."
              className="resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
            />
          </label>

          {message ? (
            <div
              role="status"
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800"
            >
              {message}
            </div>
          ) : null}

          {error ? (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800"
            >
              {error}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-xl bg-blue-700 px-6 py-3 font-black text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Submitting..."
                : loading
                  ? "Checking account..."
                  : !user
                    ? "Sign in to submit"
                    : "Submit privacy request"}
            </button>

            <Link
              href="/privacy"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-black text-slate-800 transition hover:bg-slate-50"
            >
              Read privacy information
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}