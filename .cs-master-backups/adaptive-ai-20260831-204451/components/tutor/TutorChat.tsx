"use client";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  clearTutorConversation,
  createTutorConversation,
  requestTutorResponse,
  saveTutorExchange,
} from "@/services/studentTutorService";
import type {
  TutorMessage,
  TutorResponse,
  TutorStudentContext,
} from "@/types/studentTutor";

export default function TutorChat({
  studentId,
  context,
}: {
  studentId: string;
  context: TutorStudentContext;
}) {
  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [last, setLast] = useState<TutorResponse | null>(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  useEffect(() => {
    void createTutorConversation(studentId)
      .then(setConversationId)
      .catch(() => toast.error("Tutor conversation could not start."));
  }, [studentId]);
  const history = useMemo(
    () => messages.map((m) => ({ role: m.role, content: m.content })),
    [messages],
  );
  async function send(value: string) {
    const message = value.trim();
    if (!message || !conversationId || sending) return;
    setText("");
    setMessages((x) => [
      ...x,
      {
        id: `s-${Date.now()}`,
        role: "student",
        content: message,
        createdAt: new Date(),
      },
    ]);
    setSending(true);
    try {
      const r = await requestTutorResponse({
        studentId,
        conversationId,
        message,
        history,
        context,
      });
      setMessages((x) => [
        ...x,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: r.reply,
          createdAt: new Date(),
          mode: r.mode,
        },
      ]);
      setLast(r);
      await saveTutorExchange({
        conversationId,
        studentId,
        studentMessage: message,
        tutorResponse: r,
      });
      if (r.warning) toast(r.warning);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Tutor failed.");
    } finally {
      setSending(false);
    }
  }
  async function reset() {
    if (!conversationId) return;
    await clearTutorConversation(conversationId, studentId);
    setMessages([]);
    setLast(null);
    toast.success("Conversation cleared.");
  }
  const topic = context.priorityTopics[0]?.topic || "Computer Science";
  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button
          onClick={() => void reset()}
          className="rounded-xl border bg-white px-4 py-2 text-sm font-bold"
        >
          Clear conversation
        </button>
      </div>
      {messages.length === 0 && (
        <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6">
          <p className="text-sm font-bold uppercase text-blue-600">
            Personal AI tutor
          </p>
          <h2 className="mt-2 text-2xl font-black">
            Hi {context.name.split(" ")[0]}, what are we learning today?
          </h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              `Explain ${topic} simply`,
              `Quiz me on ${topic}`,
              "Create a 25-minute revision plan",
              "How can I reach the next grade?",
            ].map((p) => (
              <button
                key={p}
                onClick={() => void send(p)}
                className="rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-bold text-blue-700"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="min-h-[420px] space-y-4 rounded-3xl bg-slate-100 p-5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "assistant" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-3xl rounded-3xl px-5 py-4 ${m.role === "assistant" ? "bg-white text-slate-800" : "bg-blue-600 text-white"}`}
            >
              <p className="whitespace-pre-wrap text-sm leading-7">
                {m.content}
              </p>
            </div>
          </div>
        ))}
        {sending && (
          <div className="rounded-3xl bg-white px-5 py-4 text-sm font-bold text-slate-500">
            CS Master Tutor is thinking...
          </div>
        )}
      </div>
      {last && last.recommendations.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {last.recommendations.map((r, i) => (
            <a
              key={`${r.href}-${i}`}
              href={r.href}
              className="rounded-2xl border border-blue-200 bg-blue-50 p-4"
            >
              <p className="text-xs font-bold uppercase text-blue-600">
                {r.type}
              </p>
              <p className="mt-1 font-black">{r.title}</p>
              <p className="mt-2 text-sm text-slate-600">{r.description}</p>
            </a>
          ))}
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(text);
        }}
        className="rounded-3xl border bg-white p-4 shadow-lg"
      >
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask about a topic, paste an answer, or request a revision plan..."
          className="w-full resize-none rounded-2xl px-3 py-2 outline-none"
        />
        <div className="mt-3 flex justify-end">
          <button
            disabled={sending || !text.trim()}
            className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white disabled:bg-slate-300"
          >
            {sending ? "Thinking..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
