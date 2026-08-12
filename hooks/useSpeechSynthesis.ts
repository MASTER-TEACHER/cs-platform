"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
export function useSpeechSynthesis() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [status, setStatus] = useState<"idle" | "speaking" | "paused">("idle");
  const [rate, setRate] = useState(1);
  const [selectedVoiceName, setSelectedVoiceName] = useState("");
  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;
  useEffect(() => {
    if (!supported) return;
    const load = () => {
      const list = window.speechSynthesis.getVoices();
      setVoices(list);
      if (!selectedVoiceName && list.length) {
        const preferred =
          list.find((v) => v.lang.toLowerCase().startsWith("en-gb")) ||
          list.find((v) => v.lang.toLowerCase().startsWith("en")) ||
          list[0];
        setSelectedVoiceName(preferred.name);
      }
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, [supported, selectedVoiceName]);
  const selectedVoice = useMemo(
    () => voices.find((v) => v.name === selectedVoiceName) || null,
    [voices, selectedVoiceName],
  );
  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setStatus("idle");
  }, [supported]);
  const speak = useCallback(
    (text: string) => {
      if (!supported || !text.trim()) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = rate;
      if (selectedVoice) {
        u.voice = selectedVoice;
        u.lang = selectedVoice.lang;
      }
      u.onstart = () => setStatus("speaking");
      u.onpause = () => setStatus("paused");
      u.onresume = () => setStatus("speaking");
      u.onend = () => setStatus("idle");
      u.onerror = () => setStatus("idle");
      window.speechSynthesis.speak(u);
    },
    [rate, selectedVoice, supported],
  );
  const pause = () => {
    if (supported) {
      window.speechSynthesis.pause();
      setStatus("paused");
    }
  };
  const resume = () => {
    if (supported) {
      window.speechSynthesis.resume();
      setStatus("speaking");
    }
  };
  useEffect(
    () => () => {
      if (supported) window.speechSynthesis.cancel();
    },
    [supported],
  );
  return {
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
  };
}
