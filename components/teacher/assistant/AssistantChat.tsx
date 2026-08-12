"use client";

import {
  Bot,
  Check,
  Clipboard,
  Eraser,
  Loader2,
  Rocket,
  Send,
  Sparkles,
  TestTube2,
  UserRound,
} from "lucide-react";
import { FormEvent, useMemo, useRef, useState } from "react";

import { sendAssistantMessage } from "@/services/assistantService";
import type {
  AssistantAction,
  AssistantMessage,
  AssistantMode,
  AssistantQuickAction,
  AssistantRequestMessage,
} from "@/types/assistant";

type AssistantChatProps = {
  onAction?: (action: AssistantAction) => void;
};

const QUICK_ACTIONS: AssistantQuickAction[] = [
  {
    id: "lesson",
    title: "Plan a lesson",
    description: "Create a structured Computer Science lesson.",
    prompt: "Create a 50-minute GCSE lesson on binary addition.",
    mode: "lesson-planner",
    icon: "📘",
  },
  {
    id: "worksheet",
    title: "Create a worksheet",
    description: "Produce scaffolded student practice.",
    prompt: "Create a GCSE worksheet on hexadecimal conversion with answers.",
    mode: "resource-creator",
    icon: "📝",
  },
  {
    id: "homework",
    title: "Write homework",
    description: "Generate independent practice and challenge.",
    prompt: "Create homework on Boolean logic for Year 10 students.",
    mode: "resource-creator",
    icon: "🏠",
  },
  {
    id: "intervention",
    title: "Plan intervention",
    description: "Support learners who are struggling.",
    prompt:
      "Create a 20-minute intervention for students struggling with binary addition.",
    mode: "intervention-coach",
    icon: "🎯",
  },
  {
    id: "explain",
    title: "Explain a topic",
    description: "Get a clear teacher-ready explanation.",
    prompt: "Explain overflow errors using a simple GCSE example.",
    mode: "subject-expert",
    icon: "🧠",
  },
  {
    id: "parent",
    title: "Parent comment",
    description: "Draft constructive parent-facing feedback.",
    prompt:
      "Write a parent progress comment for a student who is engaged but needs to improve homework completion.",
    mode: "parent-report",
    icon: "👨‍👩‍👧",
  },
];

const MODE_OPTIONS: {
  value: AssistantMode;
  label: string;
}[] = [
  {
    value: "general",
    label: "General Assistant",
  },
  {
    value: "lesson-planner",
    label: "Lesson Planner",
  },
  {
    value: "resource-creator",
    label: "Resource Creator",
  },
  {
    value: "subject-expert",
    label: "Subject Expert",
  },
  {
    value: "intervention-coach",
    label: "Intervention Coach",
  },
  {
    value: "examiner",
    label: "Examiner",
  },
  {
    value: "parent-report",
    label: "Parent Report Writer",
  },
];

const INITIAL_MESSAGE: AssistantMessage = {
  id: "welcome",
  role: "assistant",
  content: [
    "Hello — I’m **CS Master Copilot**.",
    "",
    "I can help you plan lessons, explain Computer Science, create resources, design interventions, draft reports and support assessment.",
    "",
    "Choose a quick action or ask me something below.",
  ].join("\n"),
  createdAt: new Date().toISOString(),
  source: "demo",
};

function createMessageId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatMessageContent(content: string) {
  return content.split("\n").map((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      return <div key={`space-${index}`} className="h-3" />;
    }

    if (trimmed.startsWith("## ")) {
      return (
        <h3
          key={`heading-${index}`}
          className="mt-3 text-lg font-black text-slate-950 first:mt-0"
        >
          {trimmed.slice(3)}
        </h3>
      );
    }

    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      return (
        <p key={`bold-${index}`} className="font-bold text-slate-900">
          {trimmed.slice(2, -2)}
        </p>
      );
    }

    if (/^[-•]\s/.test(trimmed)) {
      return (
        <p
          key={`bullet-${index}`}
          className="pl-4 text-sm leading-7 text-slate-700"
        >
          • {trimmed.replace(/^[-•]\s/, "")}
        </p>
      );
    }

    return (
      <p key={`line-${index}`} className="text-sm leading-7 text-slate-700">
        {trimmed}
      </p>
    );
  });
}

export default function AssistantChat({ onAction }: AssistantChatProps) {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    INITIAL_MESSAGE,
  ]);

  const [input, setInput] = useState("");

  const [mode, setMode] = useState<AssistantMode>("general");

  const [useDemo, setUseDemo] = useState(false);

  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");

  const [warning, setWarning] = useState("");

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const conversationEndRef = useRef<HTMLDivElement | null>(null);

  const conversation = useMemo<AssistantRequestMessage[]>(
    () =>
      messages
        .filter((message) => message.id !== "welcome")
        .slice(-12)
        .map((message) => ({
          role: message.role,
          content: message.content,
        })),
    [messages],
  );

  async function submitMessage(messageText: string, selectedMode = mode) {
    const cleanedMessage = messageText.trim();

    if (!cleanedMessage || sending) {
      return;
    }

    const userMessage: AssistantMessage = {
      id: createMessageId("user"),
      role: "user",
      content: cleanedMessage,
      createdAt: new Date().toISOString(),
    };

    setMessages((current) => [...current, userMessage]);

    setInput("");
    setMode(selectedMode);
    setSending(true);
    setError("");
    setWarning("");

    try {
      const response = await sendAssistantMessage({
        message: cleanedMessage,
        mode: selectedMode,
        conversation,
        useDemo,
      });

      const assistantMessage: AssistantMessage = {
        id: createMessageId("assistant"),
        role: "assistant",
        content: response.message || "",
        source: response.source,
        action: response.action,
        createdAt: new Date().toISOString(),
      };

      setMessages((current) => [...current, assistantMessage]);

      setWarning(response.warning || "");
    } catch (caughtError) {
      console.error("Assistant message error:", caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The assistant could not respond.",
      );
    } finally {
      setSending(false);

      window.setTimeout(() => {
        conversationEndRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await submitMessage(input);
  }

  async function copyMessage(message: AssistantMessage) {
    try {
      await navigator.clipboard.writeText(message.content);

      setCopiedId(message.id);

      window.setTimeout(() => {
        setCopiedId(null);
      }, 1600);
    } catch {
      setError("The response could not be copied.");
    }
  }

  function clearConversation() {
    setMessages([
      {
        ...INITIAL_MESSAGE,
        createdAt: new Date().toISOString(),
      },
    ]);

    setInput("");
    setError("");
    setWarning("");
    setCopiedId(null);
  }

  function handleAction(action: AssistantAction) {
    if (!onAction) {
      setError("This assistant action is not connected to the page yet.");
      return;
    }

    setError("");
    onAction(action);
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 p-6 text-white sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
                <Bot className="h-6 w-6" />
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-300">
                  AI teaching workspace
                </p>

                <h2 className="mt-1 text-2xl font-black">CS Master Copilot</h2>
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Ask for teaching ideas, resources, explanations, interventions or
              assessment support.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="block">
              <span className="sr-only">Assistant mode</span>

              <select
                value={mode}
                onChange={(event) =>
                  setMode(event.target.value as AssistantMode)
                }
                disabled={sending}
                className="min-h-11 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold text-white outline-none"
              >
                {MODE_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="text-slate-900"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={() => setUseDemo((current) => !current)}
              disabled={sending}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                useDemo
                  ? "bg-amber-400 text-slate-950"
                  : "border border-white/20 bg-white/10 text-white hover:bg-white/15"
              } disabled:opacity-50`}
            >
              <TestTube2 className="h-4 w-4" />
              {useDemo ? "Demo mode on" : "Use demo mode"}
            </button>

            <button
              type="button"
              onClick={clearConversation}
              disabled={messages.length <= 1 || sending}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/15 disabled:opacity-40"
            >
              <Eraser className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-slate-50 p-5 sm:p-6">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">
          Quick actions
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              disabled={sending}
              onClick={() => {
                setInput(action.prompt);

                setMode(action.mode);
              }}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-sm disabled:opacity-50"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{action.icon}</span>

                <div>
                  <p className="font-black text-slate-950">{action.title}</p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {action.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[650px] min-h-[420px] space-y-5 overflow-y-auto bg-slate-100/60 p-5 sm:p-7">
        {messages.map((message) => {
          const assistant = message.role === "assistant";

          return (
            <article
              key={message.id}
              className={`flex gap-3 ${
                assistant ? "justify-start" : "justify-end"
              }`}
            >
              {assistant && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                  <Bot className="h-5 w-5" />
                </div>
              )}

              <div
                className={`max-w-3xl rounded-3xl px-5 py-4 shadow-sm ${
                  assistant
                    ? "rounded-tl-md border border-slate-200 bg-white"
                    : "rounded-tr-md bg-indigo-600 text-white"
                }`}
              >
                <div className={assistant ? "" : "[&_p]:text-white"}>
                  {assistant ? (
                    formatMessageContent(message.content)
                  ) : (
                    <p className="whitespace-pre-wrap text-sm leading-7">
                      {message.content}
                    </p>
                  )}
                </div>

                {assistant && message.action && (
                  <div className="mt-5 rounded-2xl border border-teal-200 bg-teal-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
                      Copilot action
                    </p>

                    <button
                      type="button"
                      onClick={() => handleAction(message.action!)}
                      className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
                    >
                      <Rocket className="h-4 w-4" />
                      {message.action.buttonLabel}
                    </button>
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between gap-4 border-t border-current/10 pt-3">
                  <span
                    className={`text-xs font-semibold ${
                      assistant ? "text-slate-400" : "text-indigo-100"
                    }`}
                  >
                    {assistant
                      ? message.source === "ai"
                        ? "Live AI"
                        : "Demo response"
                      : "You"}
                  </span>

                  {assistant && (
                    <button
                      type="button"
                      onClick={() => {
                        void copyMessage(message);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-700"
                    >
                      {copiedId === message.id ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Clipboard className="h-3.5 w-3.5" />
                          Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {!assistant && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-800 text-white">
                  <UserRound className="h-5 w-5" />
                </div>
              )}
            </article>
          );
        })}

        {sending && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white">
              <Bot className="h-5 w-5" />
            </div>

            <div className="flex items-center gap-3 rounded-3xl rounded-tl-md border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />

              <p className="text-sm font-semibold text-slate-600">
                Copilot is thinking...
              </p>
            </div>
          </div>
        )}

        <div ref={conversationEndRef} />
      </div>

      <div className="border-t border-slate-200 bg-white p-5 sm:p-6">
        {warning && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            {warning}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <label className="flex-1">
            <span className="sr-only">Message CS Master Copilot</span>

            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();

                  if (input.trim() && !sending) {
                    void submitMessage(input);
                  }
                }
              }}
              disabled={sending}
              rows={3}
              maxLength={8000}
              placeholder="Ask Copilot to plan, explain, create or analyse..."
              className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-100"
            />
          </label>

          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
            Send
            <Send className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-3 text-xs text-slate-400">
          Press Enter to send or Shift + Enter for a new line. Review generated
          content before using it with students.
        </p>
      </div>
    </section>
  );
}
