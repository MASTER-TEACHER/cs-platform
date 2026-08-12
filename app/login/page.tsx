"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

import { loginUser } from "@/services/authService";
import { db } from "@/lib/firebase";
import type { UserProfile } from "@/types/database";

function getLoginMessage(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "Login failed. Check your email and password.";
  }

  const code =
    "code" in error && typeof error.code === "string" ? error.code : "";

  switch (code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "The email address or password is incorrect.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/too-many-requests":
      return "Too many login attempts. Please try again later.";

    case "auth/network-request-failed":
      return "Firebase could not be reached. Check your internet connection.";

    default:
      return error instanceof Error
        ? error.message
        : "Login failed. Check your email and password.";
  }
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const cleanedEmail = email.trim().toLowerCase();

      const userCredential = await loginUser(cleanedEmail, password);
      const uid = userCredential.user.uid;

      const profileReference = doc(db, "users", uid);
      const profileSnapshot = await getDoc(profileReference);

      if (!profileSnapshot.exists()) {
        throw new Error("Your user profile could not be found.");
      }

      const profile = {
        uid,
        ...profileSnapshot.data(),
      } as UserProfile;

      if (profile.role === "admin") {
        router.replace("/admin");
        return;
      }

      if (profile.role === "teacher") {
        router.replace("/teacher");
        return;
      }

      if (
        !profile.onboardingComplete ||
        !profile.qualification ||
        !profile.examBoard
      ) {
        router.replace("/onboarding");
        return;
      }

      router.replace("/dashboard");
    } catch (caughtError) {
      const message = getLoginMessage(caughtError);

      setError(message);

      const code =
        caughtError &&
        typeof caughtError === "object" &&
        "code" in caughtError &&
        typeof caughtError.code === "string"
          ? caughtError.code
          : "";

      const expectedAuthenticationErrors = new Set([
        "auth/invalid-credential",
        "auth/user-not-found",
        "auth/wrong-password",
        "auth/invalid-email",
        "auth/too-many-requests",
      ]);

      if (code && !expectedAuthenticationErrors.has(code)) {
        console.error("Unexpected login error:", caughtError);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-6 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
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
          Welcome back
        </h1>

        <p className="mt-2 text-center text-slate-600">
          Sign in to access your CS Master portal.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            disabled={submitting}
          />

          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
            disabled={submitting}
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <Link
            href="/forgot-password"
            className="text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            Forgot your password?
          </Link>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-blue-600">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
