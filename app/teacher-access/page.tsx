"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useAuth } from "@/contexts/AuthContext";
import { createTeacherRequest } from "@/services/teacherRequestService";

type TeacherProfileExtension = {
  accountIntent?: string | null;
  teacherAccessStatus?:
    | "not_submitted"
    | "pending"
    | "approved"
    | "rejected"
    | null;
};

export default function TeacherAccessPage() {
  const router = useRouter();

  const {
    user,
    profile,
    loading,
    profileReady,
    refreshProfile,
  } = useAuth();

  const extendedProfile =
    profile as
      | (typeof profile &
          TeacherProfileExtension)
      | null;

  const [name, setName] =
    useState("");

  const [schoolName, setSchoolName] =
    useState("");

  const [jobTitle, setJobTitle] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  useEffect(() => {
    if (
      loading ||
      (user && !profileReady)
    ) {
      return;
    }

    if (
      profile?.role === "teacher" ||
      profile?.role === "admin"
    ) {
      router.replace("/teacher");
      return;
    }

    if (
      extendedProfile
        ?.teacherAccessStatus ===
      "pending"
    ) {
      setSubmitted(true);
    }

    if (
      user &&
      !name
    ) {
      setName(
        profile?.name ||
          user.displayName ||
          "",
      );
    }
  }, [
    loading,
    user,
    profileReady,
    profile,
    extendedProfile
      ?.teacherAccessStatus,
    router,
    name,
  ]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!user) {
      toast.error(
        "Create an account or log in before requesting teacher access.",
      );

      router.push("/register");
      return;
    }

    if (
      !name.trim() ||
      !schoolName.trim() ||
      !jobTitle.trim()
    ) {
      toast.error(
        "Please complete all required fields.",
      );
      return;
    }

    setSubmitting(true);

    try {
      await createTeacherRequest({
        userId: user.uid,
        name: name.trim(),
        email: user.email || "",
        schoolName:
          schoolName.trim(),
        jobTitle:
          jobTitle.trim(),
        message:
          message.trim(),
      });

      await refreshProfile();

      setSubmitted(true);

      toast.success(
        "Teacher access request submitted.",
      );
    } catch (error) {
      console.error(
        "Teacher request error:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not submit your request.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (
    loading ||
    (user && !profileReady)
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

          <p className="mt-4 font-semibold text-slate-600">
            Preparing teacher
            access...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-6 py-12">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="CS Master Logo"
            width={130}
            height={130}
            priority
            className="h-auto w-auto rounded-2xl"
          />
        </div>

        {!user ? (
          <SignedOutState />
        ) : submitted ? (
          <PendingState />
        ) : (
          <>
            <h1 className="mt-6 text-center text-3xl font-bold text-slate-900">
              Request Teacher Access
            </h1>

            <p className="mt-2 text-center text-slate-600">
              Complete your teacher
              details. Teacher access
              requires administrator
              approval.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Full name
                </span>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  School name
                </span>

                <input
                  type="text"
                  value={schoolName}
                  onChange={(event) =>
                    setSchoolName(
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Job title
                </span>

                <input
                  type="text"
                  value={jobTitle}
                  onChange={(event) =>
                    setJobTitle(
                      event.target.value,
                    )
                  }
                  placeholder="Example: Head of Computer Science"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Additional
                  information
                </span>

                <textarea
                  value={message}
                  onChange={(event) =>
                    setMessage(
                      event.target.value,
                    )
                  }
                  rows={4}
                  placeholder="Include any useful information for the administrator."
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-indigo-600 px-6 py-4 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Submitting Request..."
                  : "Submit Teacher Request"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              <Link
                href="/login"
                className="font-bold text-indigo-600"
              >
                Return to login
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}

function SignedOutState() {
  return (
    <div className="mt-8 text-center">
      <h1 className="text-3xl font-bold text-slate-900">
        Request Teacher Access
      </h1>

      <p className="mt-3 leading-7 text-slate-600">
        Create a CS Master account
        or sign in before requesting
        teacher access.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/register"
          className="rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white"
        >
          Create Account
        </Link>

        <Link
          href="/login"
          className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}

function PendingState() {
  return (
    <div className="mt-8 text-center">
      <div className="text-6xl">
        ⏳
      </div>

      <h1 className="mt-5 text-3xl font-bold text-slate-900">
        Awaiting approval
      </h1>

      <p className="mt-3 leading-7 text-slate-600">
        Your teacher access request
        has been submitted and is
        awaiting administrator review.
      </p>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        Teacher features will become
        available after your request
        has been approved.
      </p>

      <Link
        href="/login"
        className="mt-8 inline-flex rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700"
      >
        Return to login
      </Link>
    </div>
  );
}