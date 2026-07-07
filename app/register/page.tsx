"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/authService";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    try {
      await registerUser(name, email, password, role);

      // Redirect to the student dashboard
      router.push("/dashboard");
    } catch (error) {
      alert("Registration failed. Please check your details.");
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">
        Create Account
      </h1>

      <p className="mt-2 text-slate-600">
        Join CS Master as a student or teacher.
      </p>

      <form onSubmit={handleRegister} className="mt-6 space-y-4">
        <input
          className="w-full rounded-lg border p-3"
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select
          className="w-full rounded-lg border p-3"
          value={role}
          onChange={(e) =>
            setRole(e.target.value as "student" | "teacher")
          }
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        <input
          className="w-full rounded-lg border p-3"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full rounded-lg border p-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white">
          Create Account
        </button>
      </form>
    </div>
  );
}