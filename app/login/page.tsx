"use client";

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
      router.push("/");
    } catch (error) {
      alert("Login failed. Check your email and password.");
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Login</h1>
      <p className="mt-2 text-slate-600">Welcome back to CS Master.</p>

      <form onSubmit={handleLogin} className="mt-6 space-y-4">
        <input
          className="w-full rounded-lg border p-3"
          type="email"
          placeholder="Email address"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full rounded-lg border p-3"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white">
          Login
        </button>
      </form>
    </div>
  );
}