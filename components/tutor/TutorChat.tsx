"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";

import {
  clearTutorConversation,
  getOrCreateTutorConversation,
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
  const [conversationLoading, setConversationLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadConversation() {
      try {
        setConversationLoading(true);

        const conversation =
          await getOrCreateTutorConversation(studentId);

        if (cancelled) return;

        setConversationId(conversation.id);
        setMessages(conversation.messages);
      } catch {
        if (!cancelled) {
          toast.error("Tutor conversation could not start.");
        }
      } finally {
        if (!cancelled) setConversationLoading(false);
      }
    }

    void loadConversation();

    return () => {
      cancelled = true;
    };
  }, [studentId]);

  const history = useMemo(
    () =>
      messages.slice(-10).map((message) => ({
        role: message.role,
        content: message.content,
      })),
    [messages],
  );

  async function send(value: string) {
    const message = value.trim();

    if (!message || !conversationId || sending) return;

    const optimisticStudentMessage: TutorMessage = {
      id: crypto.randomUUID(),
      role: "student",
      content: message,
      createdAt: new Date(),
    };

    setText("");
    setMessages((current) => [
      ...current,
      optimisticStudentMessage,
    ]);
    setSending(true);

    try {
      const response = await requestTutorResponse({
        studentId,
        conversationId,
        message,
        history,
        context,
      });

      const optimisticAssistantMessage: TutorMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.reply,
        createdAt: new Date(),
        mode: response.mode,
      };

      setMessages((current) => [
        ...current,
        optimisticAssistantMessage,
      ]);

      setLast(response);

      await saveTutorExchange({
        conversationId,
        studentId,
        studentMessage: message,
        tutorResponse: response,
      });

      if (response.warning) {
        toast(response.warning);
      }
    } catch (error) {
      setMessages((current) =>
        current.filter(
          (item) => item.id !== optimisticStudentMessage.id,
        ),
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Tutor failed.",
      );
    } finally {
      setSending(false);
    }
  }

  async function reset() {
    if (!conversationId) return;

    try {
      await clearTutorConversation(
        conversationId,
        studentId,
      );

      setMessages([]);
      setLast(null);
      toast.success("Conversation cleared.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Conversation could not be cleared.",
      );
    }
  }

  const priority = context.priorityTopics[0];
  const topic = priority?.topic || "Computer Science";

  if (conversationLoading) {
    return (
      <div className="h-[560px] animate-pulse rounded-3xl bg-slate-200" />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <span className="rounded-full bg-emerald-100 px-3 py-2 text-emerald-800">
            Independent evidence {context.independentEvidenceCount}
          </span>

          <span className="rounded-full bg-blue-100 px-3 py-2 text-blue-800">
            Supported evidence {context.supportedEvidenceCount}
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-2 text-slate-700">
            Confidence {context.confidence}%
          </span>
        </div>

        <button
          type="button"
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

          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            I can explain, scaffold, quiz and help you review mistakes.
            Tutor help is recorded as support, not independent attainment.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {[
              `Explain ${topic} simply`,
              `Quiz me on ${topic}`,
              `Give me a hint for ${topic}`,
              "Create a 25-minute revision plan",
            ].map((prompt) => (
              <button
                type="button"
                key={prompt}
                onClick={() => void send(prompt)}
                className="rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-bold text-blue-700"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="min-h-[420px] space-y-4 rounded-3xl bg-slate-100 p-5">
        {messages.length === 0 && (
          <div className="rounded-2xl bg-white p-4 text-sm leading-6 text-slate-600">
            Your previous tutor conversation will resume here
            automatically when one exists.
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "assistant"
                ? "justify-start"
                : "justify-end"
            }`}
          >
            <div
              className={`max-w-3xl rounded-3xl px-5 py-4 ${
                message.role === "assistant"
                  ? "bg-white text-slate-800"
                  : "bg-blue-600 text-white"
              }`}
            >
              {message.role === "assistant" && message.mode && (
                <p className="mb-2 text-[11px] font-black uppercase tracking-wide text-blue-600">
                  CS Master Tutor · {message.mode}
                </p>
              )}

              <p className="whitespace-pre-wrap text-sm leading-7">
                {message.content}
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

      {last && last.suggestedPrompts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {last.suggestedPrompts.map((prompt) => (
            <button
              type="button"
              key={prompt}
              onClick={() => void send(prompt)}
              disabled={sending}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {last && last.recommendations.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {last.recommendations.map((recommendation, index) => (
            <Link
              key={`${recommendation.href}-${index}`}
              href={recommendation.href}
              className="rounded-2xl border border-blue-200 bg-blue-50 p-4 transition hover:border-blue-400 hover:bg-blue-100"
            >
              <p className="text-xs font-bold uppercase text-blue-600">
                {recommendation.type}
              </p>

              <p className="mt-1 font-black">
                {recommendation.title}
              </p>

              <p className="mt-2 text-sm text-slate-600">
                {recommendation.description}
              </p>
            </Link>
          ))}
        </div>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void send(text);
        }}
        className="rounded-3xl border bg-white p-4 shadow-lg"
      >
        <textarea
          rows={3}
          maxLength={2000}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Ask about a topic, paste your own answer for feedback, or request a revision plan..."
          className="w-full resize-none rounded-2xl px-3 py-2 outline-none"
        />

        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Hints and explanations support learning; complete an
            independent activity to update mastery.
          </p>

          <button
            type="submit"
            disabled={sending || !text.trim() || !conversationId}
            className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white disabled:bg-slate-300"
          >
            {sending ? "Thinking..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
