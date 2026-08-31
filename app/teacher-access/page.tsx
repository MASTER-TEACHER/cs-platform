"use client";

import Image from "next/image";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  useRouter,
} from "next/navigation";

import toast from "react-hot-toast";

import {
  useAuth,
} from "@/contexts/AuthContext";

import {
  createTeacherRequest,
} from "@/services/teacherRequestService";

import {
  logoutUser,
} from "@/services/authService";

type TeacherAccessStatus =
  | "not_submitted"
  | "pending"
  | "approved"
  | "rejected"
  | null;

type TeacherReviewStatus =
  | "school_verification_pending"
  | "platform_review_required"
  | "approved"
  | "rejected"
  | null;

type TeacherProfileExtension = {
  accountIntent?:
    | string
    | null;

  teacherAccessStatus?:
    TeacherAccessStatus;

  teacherVerificationReviewStatus?:
    TeacherReviewStatus;

  schoolName?:
    string | null;

  schoolAdminEmail?:
    string | null;
};

function maskEmail(
  email: string,
): string {
  const cleaned =
    email.trim();

  const [
    localPart,
    domain,
  ] =
    cleaned.split("@");

  if (
    !localPart ||
    !domain
  ) {
    return cleaned;
  }

  if (
    localPart.length <=
    2
  ) {
    return `${localPart[0] ?? ""}***@${domain}`;
  }

  return (
    `${localPart.slice(0, 2)}` +
    `${"*".repeat(
      Math.min(
        Math.max(
          localPart.length - 2,
          3,
        ),
        8,
      ),
    )}` +
    `@${domain}`
  );
}

export default function TeacherAccessPage() {
  const router =
    useRouter();

  const {
    user,
    profile,
    loading,
    profileReady,
    refreshProfile,
  } =
    useAuth();

  const extendedProfile =
    profile as
      | (typeof profile &
          TeacherProfileExtension)
      | null;

  const [
    jobTitle,
    setJobTitle,
  ] =
    useState("");

  const [
    message,
    setMessage,
  ] =
    useState("");

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    signingOut,
    setSigningOut,
  ] =
    useState(false);

  const accessStatus =
    extendedProfile
      ?.teacherAccessStatus ??
    null;

  const reviewStatus =
    extendedProfile
      ?.teacherVerificationReviewStatus ??
    null;

  const schoolName =
    extendedProfile
      ?.schoolName
      ?.trim() ??
    "";

  const administratorEmail =
    extendedProfile
      ?.schoolAdminEmail
      ?.trim() ??
    "";

  useEffect(() => {
    if (
      loading ||
      (
        user &&
        !profileReady
      )
    ) {
      return;
    }

    if (
      profile?.role ===
        "teacher" ||
      profile?.role ===
        "admin" ||
      accessStatus ===
        "approved"
    ) {
      router.replace(
        "/teacher",
      );
    }
  }, [
    loading,
    user,
    profileReady,
    profile,
    accessStatus,
    router,
  ]);

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!user) {
      toast.error(
        "Create an account or sign in before requesting teacher access.",
      );

      router.push(
        "/register",
      );

      return;
    }

    if (
      !schoolName ||
      !administratorEmail
    ) {
      toast.error(
        "Your registration is missing school verification details.",
      );

      return;
    }

    if (!jobTitle.trim()) {
      toast.error(
        "Please enter your job title.",
      );

      return;
    }

    setSubmitting(true);

    try {
      await createTeacherRequest({
        userId:
          user.uid,

        jobTitle:
          jobTitle.trim(),

        message:
          message.trim(),
      });

      await refreshProfile();

      toast.success(
        "School verification request sent.",
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
      setSubmitting(
        false,
      );
    }
  }

  async function handleSignOut() {
    if (signingOut) {
      return;
    }

    try {
      setSigningOut(true);

      await logoutUser();

      router.replace(
        "/login",
      );
    } catch (error) {
      console.error(
        "Teacher sign-out error:",
        error,
      );

      toast.error(
        "Could not sign out. Please try again.",
      );
    } finally {
      setSigningOut(
        false,
      );
    }
  }

  if (
    loading ||
    (
      user &&
      !profileReady
    )
  ) {
    return (
      <LoadingState />
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
          <SignedOutState
            onLogin={() =>
              router.push(
                "/login",
              )
            }
            onRegister={() =>
              router.push(
                "/register",
              )
            }
          />
        ) : accessStatus ===
          "rejected" ? (
          <RejectedState
            signingOut={
              signingOut
            }
            onSignOut={() =>
              void handleSignOut()
            }
          />
        ) : reviewStatus ===
          "platform_review_required" ? (
          <PlatformReviewState
            signingOut={
              signingOut
            }
            onSignOut={() =>
              void handleSignOut()
            }
          />
        ) : accessStatus ===
          "pending" ? (
          <PendingState
            schoolName={
              schoolName
            }
            administratorEmail={
              administratorEmail
            }
            signingOut={
              signingOut
            }
            onSignOut={() =>
              void handleSignOut()
            }
          />
        ) : (
          <>
            <h1 className="mt-6 text-center text-3xl font-bold text-slate-900">
              Request Teacher Access
            </h1>

            <p className="mt-2 text-center leading-6 text-slate-600">
              Confirm your registered
              school details and send
              the verification request
              to your school
              administrator.
            </p>

            <section className="mt-7 rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
              <p className="text-xs font-black uppercase tracking-widest text-indigo-600">
                Registered school
              </p>

              <dl className="mt-4 space-y-3">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Teacher
                  </dt>

                  <dd className="mt-1 font-black text-slate-950">
                    {profile?.name ||
                      user.displayName ||
                      "Teacher"}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    School
                  </dt>

                  <dd className="mt-1 font-black text-slate-950">
                    {schoolName ||
                      "Not provided"}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    School administrator
                  </dt>

                  <dd className="mt-1 font-semibold text-slate-800">
                    {administratorEmail
                      ? maskEmail(
                          administratorEmail,
                        )
                      : "Not provided"}
                  </dd>
                </div>
              </dl>

              <p className="mt-4 text-xs leading-5 text-indigo-800">
                These school details
                were supplied during
                registration and cannot
                be changed from this
                verification form.
              </p>
            </section>

            <form
              onSubmit={
                handleSubmit
              }
              className="mt-7 space-y-5"
            >
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Job title
                </span>

                <input
                  type="text"
                  value={
                    jobTitle
                  }
                  onChange={(
                    event,
                  ) =>
                    setJobTitle(
                      event
                        .target
                        .value,
                    )
                  }
                  placeholder="Example: Head of Computer Science"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Additional information
                </span>

                <textarea
                  value={message}
                  onChange={(
                    event,
                  ) =>
                    setMessage(
                      event
                        .target
                        .value,
                    )
                  }
                  rows={4}
                  placeholder="Include any useful information for the school administrator."
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              <button
                type="submit"
                disabled={
                  submitting ||
                  !schoolName ||
                  !administratorEmail
                }
                className="w-full rounded-xl bg-indigo-600 px-6 py-4 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Sending Verification..."
                  : "Send Verification Request"}
              </button>
            </form>

            <button
              type="button"
              disabled={
                signingOut
              }
              onClick={() =>
                void handleSignOut()
              }
              className="mt-5 w-full text-sm font-bold text-slate-500 transition hover:text-slate-800 disabled:opacity-50"
            >
              {signingOut
                ? "Signing out..."
                : "Sign out"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}

function LoadingState() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

        <p className="mt-4 font-semibold text-slate-600">
          Preparing teacher access...
        </p>
      </div>
    </main>
  );
}

function SignedOutState({
  onLogin,
  onRegister,
}: {
  onLogin: () => void;
  onRegister: () => void;
}) {
  return (
    <div className="mt-8 text-center">
      <h1 className="text-3xl font-bold text-slate-900">
        Request Teacher Access
      </h1>

      <p className="mt-3 leading-7 text-slate-600">
        Create a CS Master
        account or sign in before
        requesting teacher access.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onRegister}
          className="rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white"
        >
          Create Account
        </button>

        <button
          type="button"
          onClick={onLogin}
          className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

function PendingState({
  schoolName,
  administratorEmail,
  signingOut,
  onSignOut,
}: {
  schoolName: string;
  administratorEmail: string;
  signingOut: boolean;
  onSignOut: () => void;
}) {
  return (
    <div className="mt-8 text-center">
      <div className="text-6xl">
        ⏳
      </div>

      <h1 className="mt-5 text-3xl font-bold text-slate-900">
        Awaiting school verification
      </h1>

      <p className="mt-3 leading-7 text-slate-600">
        Your request has been sent
        to the administrator you
        nominated for{" "}
        <strong>
          {schoolName}
        </strong>.
      </p>

      {administratorEmail && (
        <p className="mt-3 text-sm font-semibold text-slate-500">
          Verification sent to{" "}
          {maskEmail(
            administratorEmail,
          )}
        </p>
      )}

      <p className="mt-4 text-sm leading-6 text-slate-500">
        Teacher features remain
        locked until the verification
        process has been completed.
      </p>

      <button
        type="button"
        disabled={
          signingOut
        }
        onClick={
          onSignOut
        }
        className="mt-8 inline-flex rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
      >
        {signingOut
          ? "Signing out..."
          : "Sign out"}
      </button>
    </div>
  );
}

function PlatformReviewState({
  signingOut,
  onSignOut,
}: {
  signingOut: boolean;
  onSignOut: () => void;
}) {
  return (
    <div className="mt-8 text-center">
      <div className="text-6xl">
        🛡️
      </div>

      <h1 className="mt-5 text-3xl font-bold text-slate-900">
        School verification received
      </h1>

      <p className="mt-3 leading-7 text-slate-600">
        Your nominated school
        administrator has confirmed
        your request.
      </p>

      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-left">
        <p className="font-black text-amber-950">
          Final CS Master review
        </p>

        <p className="mt-2 text-sm leading-6 text-amber-800">
          An additional security
          check is required before
          teacher privileges are
          activated.
        </p>
      </div>

      <button
        type="button"
        disabled={
          signingOut
        }
        onClick={
          onSignOut
        }
        className="mt-8 inline-flex rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
      >
        {signingOut
          ? "Signing out..."
          : "Sign out"}
      </button>
    </div>
  );
}

function RejectedState({
  signingOut,
  onSignOut,
}: {
  signingOut: boolean;
  onSignOut: () => void;
}) {
  return (
    <div className="mt-8 text-center">
      <div className="text-6xl">
        ❌
      </div>

      <h1 className="mt-5 text-3xl font-bold text-slate-900">
        Teacher verification declined
      </h1>

      <p className="mt-3 leading-7 text-slate-600">
        The nominated school
        administrator did not confirm
        this teacher-access request.
      </p>

      <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-left">
        <p className="font-black text-red-950">
          Teacher access remains locked
        </p>

        <p className="mt-2 text-sm leading-6 text-red-800">
          If you believe the request
          was rejected in error,
          contact CS Master support
          before submitting another
          verification request.
        </p>
      </div>

      <button
        type="button"
        disabled={
          signingOut
        }
        onClick={
          onSignOut
        }
        className="mt-8 inline-flex rounded-xl bg-slate-950 px-6 py-3 font-black text-white transition hover:bg-slate-800 disabled:opacity-50"
      >
        {signingOut
          ? "Signing out..."
          : "Sign out"}
      </button>
    </div>
  );
}