"use client";

import { useEffect, useRef } from "react";

import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

export type AudioPreferences = {
  rate: number;
  voiceName: string;
  enabled: boolean;
};

type Props = {
  text: string;
  title?: string;
  initialRate?: number;
  initialVoiceName?: string;
  onPreferencesChange?: (preferences: AudioPreferences) => void;
};

export default function LessonAudioPlayer({
  text,
  title = "Listen to this section",
  initialRate = 1,
  initialVoiceName = "",
  onPreferencesChange,
}: Props) {
  const {
    supported,
    voices,
    status,
    rate,
    selectedVoiceName,
    setRate,
    setSelectedVoiceName,
    speak,
    pause,
    resume,
    stop,
  } = useSpeechSynthesis();

  /*
   * Store the latest callback in a ref.
   *
   * This prevents the preferences effect from running again merely because
   * the parent produced a new function reference during a render.
   */
  const preferencesCallbackRef = useRef(onPreferencesChange);

  useEffect(() => {
    preferencesCallbackRef.current = onPreferencesChange;
  }, [onPreferencesChange]);

  /*
   * Apply saved preferences only when their actual values change.
   */
  useEffect(() => {
    if (initialRate > 0 && initialRate !== rate) {
      setRate(initialRate);
    }
  }, [initialRate, rate, setRate]);

  useEffect(() => {
    if (initialVoiceName && initialVoiceName !== selectedVoiceName) {
      setSelectedVoiceName(initialVoiceName);
    }
  }, [initialVoiceName, selectedVoiceName, setSelectedVoiceName]);

  /*
   * Notify the parent only when an audio value actually changes.
   *
   * The parent callback itself is intentionally not a dependency because it
   * is accessed through preferencesCallbackRef.
   */
  useEffect(() => {
    preferencesCallbackRef.current?.({
      rate,
      voiceName: selectedVoiceName,
      enabled: status === "speaking" || status === "paused",
    });
  }, [rate, selectedVoiceName, status]);

  if (!supported) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="font-bold text-amber-900">
          Audio playback is unavailable
        </p>

        <p className="mt-1 text-sm text-amber-800">
          This browser does not support built-in speech playback.
        </p>
      </div>
    );
  }

  const currentlyActive = status === "speaking" || status === "paused";

  function handlePlay() {
    if (!text.trim()) {
      return;
    }

    speak(text);
  }

  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-black text-blue-950">🔊 {title}</p>

          <p className="mt-1 text-sm text-blue-700">
            Listen using your browser&apos;s built-in voice.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {status === "idle" && (
            <button
              type="button"
              onClick={handlePlay}
              disabled={!text.trim()}
              className="rounded-xl bg-blue-600 px-4 py-2 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              ▶ Play
            </button>
          )}

          {status === "speaking" && (
            <button
              type="button"
              onClick={pause}
              className="rounded-xl bg-blue-600 px-4 py-2 font-bold text-white transition hover:bg-blue-700"
            >
              ⏸ Pause
            </button>
          )}

          {status === "paused" && (
            <button
              type="button"
              onClick={resume}
              className="rounded-xl bg-blue-600 px-4 py-2 font-bold text-white transition hover:bg-blue-700"
            >
              ▶ Resume
            </button>
          )}

          <button
            type="button"
            onClick={stop}
            disabled={!currentlyActive}
            className="rounded-xl border border-blue-300 bg-white px-4 py-2 font-bold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ⏹ Stop
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-bold text-slate-700">
          Reading speed
          <select
            value={rate}
            onChange={(event) => {
              setRate(Number(event.target.value));
            }}
            className="mt-2 block w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
          >
            <option value={0.75}>0.75×</option>
            <option value={1}>1×</option>
            <option value={1.25}>1.25×</option>
            <option value={1.5}>1.5×</option>
          </select>
        </label>

        <label className="text-sm font-bold text-slate-700">
          Voice
          <select
            value={selectedVoiceName}
            onChange={(event) => {
              setSelectedVoiceName(event.target.value);
            }}
            className="mt-2 block w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
          >
            {voices.length === 0 && (
              <option value="">Default browser voice</option>
            )}

            {voices.map((voice) => (
              <option key={`${voice.name}-${voice.lang}`} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
