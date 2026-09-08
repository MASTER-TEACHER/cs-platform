"use client";

import { type FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function FeedbackPage() {
  const { user } = useAuth();
  const [category, setCategory] = useState("bug");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!user) return toast.error("Sign in to send feedback.");
    try {
      setSending(true);
      const token = await user.getIdToken();
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ category, message, pageUrl: window.location.href }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Feedback could not be sent.");
      setMessage("");
      toast.success("Thank you — your feedback has been recorded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Feedback could not be sent.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 p-8 text-white shadow-xl">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-300">CS Master feedback</p>
        <h1 className="mt-2 text-3xl font-black">Report a problem or share an idea</h1>
        <p className="mt-3 max-w-2xl text-slate-200">Tell us about bugs, content issues, accessibility concerns, privacy questions or improvements. Do not include passwords, payment details or unnecessary personal information.</p>
      </div>

      <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <label className="block text-sm font-bold text-slate-700">Category
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3">
            <option value="bug">Bug / something is not working</option>
            <option value="idea">Feature idea</option>
            <option value="content">Learning content issue</option>
            <option value="accessibility">Accessibility</option>
            <option value="privacy">Privacy / data protection</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label className="mt-5 block text-sm font-bold text-slate-700">What happened or what would you like improved?
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={8} maxLength={4000} required className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="Include the page or feature, what you expected, and what happened." />
        </label>
        <p className="mt-2 text-xs text-slate-500">{message.length}/4000 characters</p>

        <button type="submit" disabled={sending || message.trim().length < 10} className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-black text-white hover:bg-blue-700 disabled:opacity-50">
          {sending ? "Sending..." : "Send feedback"}
        </button>
      </form>
    </div>
  );
}
