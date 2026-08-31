"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useState,
  type FormEvent,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  registerAccount,
  type RegistrationAccountType,
} from "@/services/authService";

function getRegistrationMessage(
  error: unknown,
): string {
  if (
    !error ||
    typeof error !==
      "object"
  ) {
    return "Registration failed. Please check your details.";
  }

  const code =
    "code" in error &&
    typeof error.code ===
      "string"
      ? error.code
      : "";

  switch (code) {
    case "auth/email-already-in-use":
      return "An account already exists for this email address.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/weak-password":
      return "Choose a stronger password containing at least 6 characters.";

    case "auth/network-request-failed":
      return "The registration request could not reach Firebase. Check your connection and try again.";

    default:
      return error instanceof
        Error
        ? error.message
        : "Registration failed. Please check your details.";
  }
}

function normaliseEmail(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase();
}

export default function RegisterPage() {
  const router =
    useRouter();

  const [
    accountType,
    setAccountType,
  ] =
    useState<RegistrationAccountType>(
      "student",
    );

  const [
    name,
    setName,
  ] =
    useState("");

  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    password,
    setPassword,
  ] =
    useState("");

  const [
    schoolName,
    setSchoolName,
  ] =
    useState("");

  const [
    schoolAdminEmail,
    setSchoolAdminEmail,
  ] =
    useState("");

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  function selectAccountType(
    value: RegistrationAccountType,
  ) {
    setAccountType(
      value,
    );

    setError("");
  }

  async function handleRegister(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const cleanedName =
      name.trim();

    const cleanedEmail =
      normaliseEmail(
        email,
      );

    const cleanedSchoolName =
      schoolName.trim();

    const cleanedAdminEmail =
      normaliseEmail(
        schoolAdminEmail,
      );

    if (!cleanedName) {
      setError(
        "Please enter your full name.",
      );

      return;
    }

    if (password.length < 6) {
      setError(
        "Your password must contain at least 6 characters.",
      );

      return;
    }

    if (
      accountType ===
      "teacher"
    ) {
      if (
        !cleanedSchoolName
      ) {
        setError(
          "Please enter your school name.",
        );

        return;
      }

      if (
        !cleanedAdminEmail
      ) {
        setError(
          "Please enter a school administrator email address.",
        );

        return;
      }

      if (
        cleanedAdminEmail ===
        cleanedEmail
      ) {
        setError(
          "The school administrator email must be different from your own email address.",
        );

        return;
      }
    }

    setSubmitting(true);

    try {
      await registerAccount(
        cleanedName,
        cleanedEmail,
        password,
        accountType,
        accountType ===
          "teacher"
          ? {
              schoolName:
                cleanedSchoolName,

              schoolAdminEmail:
                cleanedAdminEmail,
            }
          : undefined,
      );

      if (
        accountType ===
        "teacher"
      ) {
        router.replace(
          "/teacher-access",
        );

        return;
      }

      router.replace(
        "/onboarding",
      );
    } catch (
      caughtError
    ) {
      console.error(
        "Registration error:",
        caughtError,
      );

      setError(
        getRegistrationMessage(
          caughtError,
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-6 py-12">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="CS Master Logo"
            width={150}
            height={150}
            priority
            className="h-auto w-auto rounded-2xl"
          />
        </div>

        <h1 className="mt-6 text-center text-3xl font-bold text-slate-900">
          Create your account
        </h1>

        <p className="mt-2 text-center text-slate-600">
          Choose how you will use
          CS Master.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800"
          >
            {error}
          </div>
        )}

        <form
          onSubmit={
            handleRegister
          }
          className="mt-8 space-y-5"
        >
          <fieldset>
            <legend className="text-base font-black text-slate-900">
              I am a:
            </legend>

            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <AccountTypeCard
                title="Student"
                description="I am learning Computer Science."
                selected={
                  accountType ===
                  "student"
                }
                onSelect={() =>
                  selectAccountType(
                    "student",
                  )
                }
              />

              <AccountTypeCard
                title="Teacher"
                description="I teach Computer Science."
                selected={
                  accountType ===
                  "teacher"
                }
                onSelect={() =>
                  selectAccountType(
                    "teacher",
                  )
                }
              />
            </div>
          </fieldset>

          <div>
            <label
              htmlFor="registration-name"
              className="mb-2 block text-sm font-bold text-slate-800"
            >
              Full name
            </label>

            <input
              id="registration-name"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(
                event,
              ) =>
                setName(
                  event.target
                    .value,
                )
              }
              autoComplete="name"
              disabled={
                submitting
              }
              required
            />
          </div>

          <div>
            <label
              htmlFor="registration-email"
              className="mb-2 block text-sm font-bold text-slate-800"
            >
              {accountType ===
              "teacher"
                ? "Your school email"
                : "Email address"}
            </label>

            <input
              id="registration-email"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              type="email"
              placeholder={
                accountType ===
                "teacher"
                  ? "you@school.org"
                  : "Email address"
              }
              value={email}
              onChange={(
                event,
              ) =>
                setEmail(
                  event.target
                    .value,
                )
              }
              autoComplete="email"
              disabled={
                submitting
              }
              required
            />
          </div>

          {accountType ===
            "teacher" && (
            <div className="space-y-5 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-5">
              <div>
                <p className="font-black text-indigo-950">
                  School verification
                </p>

                <p className="mt-1 text-sm leading-6 text-indigo-800">
                  Your school will
                  confirm that you are
                  authorised to use
                  CS Master as a teacher.
                </p>
              </div>

              <div>
                <label
                  htmlFor="school-name"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  School name
                </label>

                <input
                  id="school-name"
                  type="text"
                  value={
                    schoolName
                  }
                  onChange={(
                    event,
                  ) =>
                    setSchoolName(
                      event.target
                        .value,
                    )
                  }
                  placeholder="Example Secondary School"
                  autoComplete="organization"
                  disabled={
                    submitting
                  }
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label
                  htmlFor="school-admin-email"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  School administrator
                  email
                </label>

                <input
                  id="school-admin-email"
                  type="email"
                  value={
                    schoolAdminEmail
                  }
                  onChange={(
                    event,
                  ) =>
                    setSchoolAdminEmail(
                      event.target
                        .value,
                    )
                  }
                  placeholder="admin@school.org"
                  autoComplete="email"
                  disabled={
                    submitting
                  }
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                />

                <p className="mt-2 text-xs leading-5 text-slate-600">
                  We will send a
                  verification request
                  to this address. You
                  cannot use your own
                  email as the verifier.
                </p>
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="registration-password"
              className="mb-2 block text-sm font-bold text-slate-800"
            >
              Password
            </label>

            <input
              id="registration-password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              type="password"
              placeholder="Password"
              value={
                password
              }
              onChange={(
                event,
              ) =>
                setPassword(
                  event.target
                    .value,
                )
              }
              autoComplete="new-password"
              minLength={6}
              disabled={
                submitting
              }
              required
            />
          </div>

          <button
            type="submit"
            disabled={
              submitting
            }
            className="w-full rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {submitting
              ? "Creating Account..."
              : accountType ===
                  "teacher"
                ? "Create Teacher Account"
                : "Create Student Account"}
          </button>
        </form>

        {accountType ===
          "teacher" && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="font-bold text-amber-950">
              Teacher verification
              required
            </p>

            <p className="mt-1 text-sm leading-6 text-amber-900">
              Creating the account does
              not unlock teacher tools.
              Your school administrator
              must verify your request
              before teacher access or
              the 14-day School Trial
              becomes available.
            </p>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an
          account?{" "}
          <Link
            href="/login"
            className="font-bold text-blue-600"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}

function AccountTypeCard({
  title,
  description,
  selected,
  onSelect,
}: {
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      className={`cursor-pointer rounded-2xl border-2 p-5 transition ${
        selected
          ? "border-blue-600 bg-blue-50"
          : "border-slate-200 bg-white hover:border-blue-300"
      }`}
    >
      <input
        type="radio"
        name="accountType"
        checked={
          selected
        }
        onChange={
          onSelect
        }
        className="sr-only"
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-black text-slate-950">
            {title}
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            {
              description
            }
          </p>
        </div>

        <span
          className={`mt-1 h-5 w-5 shrink-0 rounded-full border-2 ${
            selected
              ? "border-blue-600 bg-blue-600 ring-4 ring-blue-100"
              : "border-slate-300"
          }`}
        />
      </div>
    </label>
  );
}