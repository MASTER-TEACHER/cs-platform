"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { loginUser } from "@/services/authService";
import { db } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const userCredential = await loginUser(email, password);
      const uid = userCredential.user.uid;

      const profileRef = doc(db, "users", uid);
      const profileSnapshot = await getDoc(profileRef);

      if (!profileSnapshot.exists()) {
        alert("Your user profile could not be found.");
        return;
      }

      const profile = profileSnapshot.data();
      const role = profile.role;

      if (role === "teacher" || role === "admin") {
        router.replace("/teacher");
        return;
      }

      router.replace("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Check your email and password.");
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

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>

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