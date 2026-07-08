"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      await loginUser(email, password);
      router.push("/dashboard");
    } catch (error) {
      alert("Login failed. Check your email and password.");
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
            className="rounded-2xl"
          />
        </div>

        <h1 className="mt-6 text-center text-3xl font-bold text-slate-900">
          Welcome back
        </h1>

        <p className="mt-2 text-center text-slate-600">
          Continue your Computer Science learning journey.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="w-full rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700">
            Login
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