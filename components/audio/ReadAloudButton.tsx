"use client";

import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

type Props = {
  text: string;
  label?: string;
};

export default function ReadAloudButton({ text, label = "Read aloud" }: Props) {
  const { supported, status, speak, stop } = useSpeechSynthesis();

  if (!supported) {
    return null;
  }

  const currentlyReading = status === "speaking" || status === "paused";

  function handleClick() {
    if (currentlyReading) {
      stop();
      return;
    }

    speak(text);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!text.trim()}
      className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {currentlyReading ? "⏹ Stop reading" : `🔊 ${label}`}
    </button>
  );
}
