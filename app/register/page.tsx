"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";

import {
  registerAccount,
  type RegistrationAccountType,
} from "@/services/authService";

function getRegistrationMessage(
  error: unknown,
): string {
  if (!error || typeof error !== "object") {
    return "Registration failed. Please check your details.";
  }

  const code =
    "code" in error &&
    typeof error.code === "string"
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
      return error instanceof Error
        ? error.message
        : "Registration failed. Please check your details.";
  }
}

export default function RegisterPage() {
  const router = useRouter();

  const [accountType, setAccountType] =
    useState<RegistrationAccountType>(
      "student",
    );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  async function handleRegister(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const cleanedName = name.trim();
    const cleanedEmail =
      email.trim().toLowerCase();

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

    setSubmitting(true);

    try {
      await registerAccount(
        cleanedName,
        cleanedEmail,
        password,
        accountType,
      );

      if (accountType === "teacher") {
        router.replace(
          "/teacher-access",
        );
        return;
      }

      router.replace("/onboarding");
    } catch (caughtError) {
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
          Choose how you will use CS
          Master.
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
          onSubmit={handleRegister}
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
                  accountType === "student"
                }
                onSelect={() =>
                  setAccountType(
                    "student",
                  )
                }
              />

              <AccountTypeCard
                title="Teacher"
                description="I teach Computer Science."
                selected={
                  accountType === "teacher"
                }
                onSelect={() =>
                  setAccountType(
                    "teacher",
                  )
                }
              />
            </div>
          </fieldset>

          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            autoComplete="name"
            disabled={submitting}
            required
          />

          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            autoComplete="email"
            disabled={submitting}
            required
          />

          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value,
              )
            }
            autoComplete="new-password"
            minLength={6}
            disabled={submitting}
            required
          />

          <button
            type="submit"
            disabled={submitting}
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

        {accountType === "teacher" && (
          <div className="mt-5 rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
            <p className="font-bold text-indigo-950">
              Teacher approval required
            </p>

            <p className="mt-1 text-sm leading-6 text-indigo-800">
              After creating your
              account, you will provide
              your school and job title.
              An administrator must
              approve your request before
              teacher features become
              available.
            </p>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
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
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-black text-slate-950">
            {title}
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            {description}
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