"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";

/*
 * CS Master accessibility preferences (v3).
 *
 * Formal exams: display settings (font, background, size, spacing,
 * contrast, motion) stay available because they change how the page
 * looks, not what it says - the same as an enlarged paper or a
 * coloured overlay. Content help (read aloud, reading ruler, reading
 * mask, simplified layout) is switched off. Esc is never used to close
 * the panel in an exam, because in fullscreen Esc leaves fullscreen,
 * which is logged and starts the auto-submit countdown.
 */

type Preferences = {
  font: string;
  background: string;
  size: number;
  spacing: string;
  letterSpacing: string;
  highContrast: boolean;
  reducedMotion: boolean;
  simplified: boolean;
  readingRuler: boolean;
  focusMode: boolean;
  position: string;
};

const defaults: Preferences = {
  font: "arial",
  background: "default",
  size: 100,
  spacing: "normal",
  letterSpacing: "normal",
  highContrast: false,
  reducedMotion: false,
  simplified: false,
  readingRuler: false,
  focusMode: false,
  position: "right",
};

const fonts = [
  ["arial", "Arial"],
  ["verdana", "Verdana"],
  ["tahoma", "Tahoma"],
  ["georgia", "Georgia"],
  ["trebuchet", "Trebuchet MS"],
];

const backgrounds = [
  ["default", "Standard"],
  ["cream", "Cream"],
  ["blue", "Soft blue"],
  ["green", "Soft sage green"],
  ["peach", "Warm peach"],
  ["lavender", "Soft lavender"],
  ["dark", "Dark"],
  ["black", "Black / white high contrast"],
];

const backgroundSwatches: Record<string, string> = {
  default: "#ffffff",
  cream: "#fff4d6",
  blue: "#eaf4ff",
  green: "#e8f3e8",
  peach: "#fff0e5",
  lavender: "#f1edff",
  dark: "#202735",
  black: "#000000",
};

const sizes = [100, 110, 120, 130, 150, 175, 200];

const toggles = [
  ["highContrast", "High contrast", "Darker text and borders, underlined links.", true],
  ["reducedMotion", "Reduce animations", "Stops movement and transitions.", true],
  ["simplified", "Simplified reading layout", "Shorter lines, no shadows, left-aligned text.", false],
  ["readingRuler", "Reading ruler", "Highlights the line you are reading.", false],
  ["focusMode", "Focus mode", "Dims the page except a band around what you are reading.", false],
] as const;

const GUEST = "guest";

function normalise(value: unknown): Preferences {
  if (!value || typeof value !== "object") return { ...defaults };
  const item = value as Partial<Preferences>;
  const oneOf = (options: string[], v: unknown, fallback: string) =>
    typeof v === "string" && options.includes(v) ? v : fallback;

  return {
    font: oneOf(fonts.map(([v]) => v), item.font, defaults.font),
    background: oneOf(backgrounds.map(([v]) => v), item.background, defaults.background),
    size: sizes.includes(item.size ?? 0) ? item.size! : defaults.size,
    spacing: oneOf(["normal", "comfortable", "wide"], item.spacing, defaults.spacing),
    letterSpacing: oneOf(["normal", "comfortable", "wide"], item.letterSpacing, defaults.letterSpacing),
    highContrast: item.highContrast === true,
    reducedMotion: item.reducedMotion === true,
    simplified: item.simplified === true,
    readingRuler: item.readingRuler === true,
    focusMode: item.focusMode === true,
    position: oneOf(["right", "left"], item.position, defaults.position),
  };
}

function isFormalExam(path: string): boolean {
  return (
    path === "/exam" ||
    path.startsWith("/exam/") ||
    path.startsWith("/assignments/exam/") ||
    path.startsWith("/quiz/secure")
  );
}

function applyPreferences(p: Preferences, exam: boolean) {
  const root = document.documentElement;
  root.dataset.csFont = p.font;
  root.dataset.csBackground = p.background;
  root.dataset.csSpacing = p.spacing;
  root.dataset.csLetterSpacing = p.letterSpacing;
  root.dataset.csContrast = p.highContrast || p.background === "black" ? "high" : "normal";
  root.dataset.csMotion = p.reducedMotion ? "reduced" : "normal";
  root.dataset.csReading = p.simplified && !exam ? "simplified" : "normal";
  root.dataset.csExam = exam ? "on" : "off";
  root.style.setProperty("--cs-accessibility-scale", String(p.size / 100));
}

function localKey(uid: string) {
  return `csmaster-accessibility-v2:${uid}`;
}

function readLocal(uid: string): Preferences | null {
  try {
    const raw = window.localStorage.getItem(localKey(uid));
    return raw ? normalise(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function saveLocal(uid: string, p: Preferences) {
  try {
    window.localStorage.setItem(localKey(uid), JSON.stringify(p));
  } catch {
    // Private browsing may restrict local storage.
  }
}

export default function AccessibilityPanel({ embedded = false }: { embedded?: boolean }) {
  const { user, loading } = useAuth();
  const pathname = usePathname() ?? "";
  const exam = isFormalExam(pathname);

  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>(defaults);
  const [ready, setReady] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [readingY, setReadingY] = useState<number | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const uid = user?.uid ?? null;
  const prefix = embedded ? "profile" : "floating";

  // Load: account (cloud) > this browser > guest settings on this browser.
  useEffect(() => {
    if (loading) return;
    let active = true;

    const load = async () => {
      let next = (uid && readLocal(uid)) || readLocal(GUEST) || { ...defaults };
      let message = "";

      if (uid) {
        try {
          const snapshot = await getDoc(doc(db, "users", uid, "preferences", "accessibility"));
          if (snapshot.exists()) {
            next = normalise(snapshot.data());
            saveLocal(uid, next);
          }
        } catch {
          message = "Using browser preferences. Cloud synchronisation is unavailable.";
        }
      }

      if (!active) return;
      setPreferences(next);
      setSyncMessage(message);
      setReady(true);
    };

    void load();
    return () => {
      active = false;
    };
  }, [uid, loading]);

  useEffect(() => {
    if (ready) applyPreferences(preferences, exam);
  }, [preferences, exam, ready]);

  // Keep the floating panel and the profile page in step.
  useEffect(() => {
    const key = uid ?? GUEST;
    const sync = (event: Event) => {
      const detail = (event as CustomEvent<{ uid: string; preferences: Preferences }>).detail;
      if (detail?.uid === key) setPreferences(normalise(detail.preferences));
    };
    window.addEventListener("csmaster-accessibility-change", sync);
    return () => window.removeEventListener("csmaster-accessibility-change", sync);
  }, [uid]);

  // Reading ruler / focus mode follow the mouse, or keyboard focus.
  const tracking = ready && !exam && (preferences.readingRuler || preferences.focusMode);
  useEffect(() => {
    if (!tracking) {
      setReadingY(null);
      return;
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType === "mouse") setReadingY(event.clientY);
    };
    const focus = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target || target.closest(".cs-accessibility-widget")) return;
      const box = target.getBoundingClientRect();
      setReadingY(box.top + box.height / 2);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("focusin", focus);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("focusin", focus);
    };
  }, [tracking]);

  useEffect(() => {
    if (exam) {
      window.speechSynthesis?.cancel();
      setSpeaking(false);
    }
  }, [exam]);

  useEffect(() => () => {
    window.speechSynthesis?.cancel();
    if (saveTimer.current) clearTimeout(saveTimer.current);
  }, []);

  const closePanel = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Move focus into the panel when it opens; Esc closes it outside exams.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    if (exam) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, exam, closePanel]);

  const update = useCallback(
    (nextValue: Preferences) => {
      const next = normalise(nextValue);
      const key = uid ?? GUEST;

      setPreferences(next);
      saveLocal(key, next);
      window.dispatchEvent(
        new CustomEvent("csmaster-accessibility-change", { detail: { uid: key, preferences: next } })
      );

      if (!uid) {
        setSyncMessage("Saved in this browser. Sign in to keep them on every device.");
        return;
      }

      // One save after the student stops changing settings.
      setSyncMessage("Saving preferences...");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        void setDoc(doc(db, "users", uid, "preferences", "accessibility"), next, { merge: false })
          .then(() => setSyncMessage("Preferences saved to your account."))
          .catch(() => setSyncMessage("Saved in this browser. Cloud synchronisation is unavailable."));
      }, 600);
    },
    [uid]
  );

  function speakSelection() {
    if (exam || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const selection = window.getSelection()?.toString().trim() ?? "";
    if (!selection) {
      setSyncMessage("Select some learning text first, then choose Read selected text.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(selection.slice(0, 10000));
    utterance.lang = "en-GB";
    utterance.rate = 0.9;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  if (loading || !ready) return null;

  const select = (
    id: string,
    label: string,
    value: string | number,
    options: (readonly [string | number, string])[],
    onChange: (v: string) => void
  ) => (
    <>
      <label htmlFor={`${prefix}-${id}`}>{label}</label>
      <select id={`${prefix}-${id}`} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, text]) => (
          <option key={v} value={v}>{text}</option>
        ))}
      </select>
    </>
  );

  const spacingOptions = [["normal", "Normal"], ["comfortable", "Comfortable"], ["wide", "Wide"]] as const;

  const controls = (
    <div className="cs-accessibility-controls">
      <p className="cs-accessibility-intro">
        {exam
          ? "Display settings are available during exams. Reading help is switched off."
          : "Choose how CS Master displays reading and learning content."}
      </p>

      {select("font", "Font style", preferences.font, fonts.map(([v, l]) => [v, l] as const),
        (v) => update({ ...preferences, font: v }))}

      <fieldset className="cs-accessibility-swatches">
        <legend>Reading background</legend>
        {backgrounds.map(([value, label]) => (
          <button
            key={value}
            type="button"
            className="cs-accessibility-swatch"
            aria-pressed={preferences.background === value}
            onClick={() => update({ ...preferences, background: value })}
          >
            <span
              className="cs-accessibility-swatch-colour"
              style={{ backgroundColor: backgroundSwatches[value] }}
              aria-hidden="true"
            />
            <span>{label}</span>
          </button>
        ))}
      </fieldset>

      {select("size", "Text size", preferences.size, sizes.map((s) => [s, `${s}%`] as const),
        (v) => update({ ...preferences, size: Number(v) }))}
      {select("lines", "Line spacing", preferences.spacing, [...spacingOptions],
        (v) => update({ ...preferences, spacing: v }))}
      {select("letters", "Letter spacing", preferences.letterSpacing, [...spacingOptions],
        (v) => update({ ...preferences, letterSpacing: v }))}

      {toggles
        .filter(([, , , allowedInExam]) => allowedInExam || !exam)
        .map(([key, label, hint]) => (
          <label className="cs-accessibility-check" key={key}>
            <input
              type="checkbox"
              checked={preferences[key]}
              onChange={(e) => update({ ...preferences, [key]: e.target.checked })}
            />
            <span>
              {label}
              <span className="cs-accessibility-hint">{hint}</span>
            </span>
          </label>
        ))}

      {!embedded &&
        select("position", "Button position", preferences.position,
          [["right", "Bottom right"], ["left", "Bottom left"]],
          (v) => update({ ...preferences, position: v }))}

      {!exam && (
        <div className="cs-accessibility-actions">
          <button type="button" onClick={speakSelection}>Read selected text</button>
          <button
            type="button"
            onClick={() => {
              window.speechSynthesis?.cancel();
              setSpeaking(false);
            }}
            disabled={!speaking}
          >
            Stop reading
          </button>
        </div>
      )}

      {exam && (
        <p className="cs-accessibility-note cs-accessibility-warning">
          Use the Close button to close this panel. Pressing Esc leaves fullscreen, which is
          recorded and can submit your exam.
        </p>
      )}

      <button type="button" className="cs-accessibility-reset" onClick={() => update({ ...defaults, position: preferences.position })}>
        Reset to defaults
      </button>

      <p className="cs-accessibility-note" role="status" aria-live="polite">{syncMessage}</p>
    </div>
  );

  const showRuler = !exam && preferences.readingRuler && readingY !== null;
  const showMask = !exam && preferences.focusMode && readingY !== null;

  return (
    <>
      {showRuler && <div className="cs-reading-ruler" aria-hidden="true" style={{ top: readingY! - 18 }} />}
      {showMask && (
        <>
          <div className="cs-reading-mask" aria-hidden="true" style={{ top: 0, height: Math.max(0, readingY! - 60) }} />
          <div className="cs-reading-mask" aria-hidden="true" style={{ top: readingY! + 60, bottom: 0 }} />
        </>
      )}

      {embedded ? (
        <section className="cs-accessibility-profile">
          <h2>Accessibility &amp; Learning Preferences</h2>
          {controls}
        </section>
      ) : (
        <div className="cs-accessibility-widget" data-position={preferences.position}>
          <button
            ref={triggerRef}
            type="button"
            className="cs-accessibility-trigger"
            aria-expanded={open}
            aria-controls="cs-accessibility-panel"
            onClick={() => (open ? closePanel() : setOpen(true))}
          >
            <span aria-hidden="true">Aa</span> Accessibility
          </button>

          {open && (
            <section
              id="cs-accessibility-panel"
              className="cs-accessibility-panel"
              role="dialog"
              aria-modal="false"
              aria-labelledby="cs-accessibility-title"
            >
              <div className="cs-accessibility-heading">
                <h2 id="cs-accessibility-title">Accessibility preferences</h2>
                <button ref={closeRef} type="button" onClick={closePanel}>Close</button>
              </div>
              {controls}
            </section>
          )}
        </div>
      )}
    </>
  );
}
