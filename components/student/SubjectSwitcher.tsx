"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { switchStudentSubject } from "@/services/subjectSwitchService";
import type { Subject } from "@/types/user";
const labels: Record<Subject, string> = { COMPUTER_SCIENCE: "Computer Science", CREATIVE_IMEDIA: "Creative iMedia" };
export default function SubjectSwitcher() {
  const { user, profile, refreshProfile } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (!user || !profile || profile.role !== "student") return null;
  const enrolled = profile.enrolledSubjects || [profile.subject || "COMPUTER_SCIENCE"];
  const current = profile.subject || "COMPUTER_SCIENCE";
  async function change(subject: Subject) {
    if (!user || subject === current) return;
    setBusy(true); setError("");
    try {
      await switchStudentSubject(user.uid, subject);
      await refreshProfile();
      window.location.assign("/dashboard");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to change subject."); setBusy(false); }
  }
  return <div className="border-b border-slate-800 px-5 py-4 text-white">
    <label htmlFor="csm-subject" className="mb-2 block text-xs font-semibold text-slate-300">Current subject</label>
    <select id="csm-subject" disabled={busy || enrolled.length < 2} value={current}
      onChange={(event) => void change(event.target.value as Subject)}
      className="w-full rounded-lg border border-slate-600 bg-slate-800 p-2 text-sm text-white">
      {enrolled.map((subject) => <option key={subject} value={subject}>{labels[subject]}</option>)}
    </select>
    <Link className="mt-2 block text-xs text-sky-300 hover:underline" href="/profile/curriculum">Manage subjects</Link>
    {error && <p role="alert" className="mt-2 text-xs text-red-300">{error}</p>}
  </div>;
}
