"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";

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
function normalise(value: unknown): Preferences {
  if (!value || typeof value !== "object") {
    return { ...defaults };
  }

  const item = value as Partial<Preferences>;

  return {
    font: fonts.some(([v]) => v === item.font)
      ? item.font!
      : defaults.font,
    background: backgrounds.some(([v]) => v === item.background)
      ? item.background!
      : defaults.background,
    size: [100, 110, 120, 130, 150, 175, 200].includes(item.size ?? 0)
      ? item.size!
      : defaults.size,
    spacing: ["normal", "comfortable", "wide"].includes(item.spacing ?? "")
      ? item.spacing!
      : defaults.spacing,
    letterSpacing: ["normal", "comfortable", "wide"].includes(
      item.letterSpacing ?? ""
    )
      ? item.letterSpacing!
      : defaults.letterSpacing,
    highContrast: item.highContrast === true,
    reducedMotion: item.reducedMotion === true,
    simplified: item.simplified === true,
    readingRuler: item.readingRuler === true,
    focusMode: item.focusMode === true,
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
  root.dataset.csContrast =
    p.highContrast || p.background === "black" ? "high" : "normal";
  root.dataset.csMotion = p.reducedMotion ? "reduced" : "normal";
  root.dataset.csReading = p.simplified && !exam
    ? "simplified"
    : "normal";
  root.dataset.csFocus = p.focusMode && !exam
    ? "on"
    : "off";

  root.style.setProperty("--cs-accessibility-scale", String(p.size / 100));
}

function localKey(uid: string) {
  return `csmaster-accessibility-v2:${uid}`;
}

function readLocal(uid: string): Preferences {
  try {
    const raw = window.localStorage.getItem(localKey(uid));
    return raw ? normalise(JSON.parse(raw)) : { ...defaults };
  } catch {
    return { ...defaults };
  }
}

function saveLocal(uid: string, p: Preferences) {
  try {
    window.localStorage.setItem(localKey(uid), JSON.stringify(p));
  } catch {
    // Private browsing may restrict local storage.
  }
}

export default function AccessibilityPanel({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname() ?? "";
  const exam = isFormalExam(pathname);

  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>(defaults);
  const [ready, setReady] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [rulerY, setRulerY] = useState<number | null>(null);

  const uid = user?.uid ?? null;

  useEffect(() => {
    if (loading) return;

    let active = true;

    const load = async () => {
      let next = uid ? readLocal(uid) : { ...defaults };
      let message = "";

      if (uid) {
        try {
          const snapshot = await getDoc(
            doc(db, "users", uid, "preferences", "accessibility")
          );

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
    if (!ready) return;

    applyPreferences(preferences, exam);
  }, [preferences, exam, ready]);

  useEffect(() => {
    if (!uid) return;

    const sync = (event: Event) => {
      const detail = (
        event as CustomEvent<{
          uid: string;
          preferences: Preferences;
        }>
      ).detail;

      if (detail?.uid !== uid) return;

      setPreferences(normalise(detail.preferences));
    };

    window.addEventListener("csmaster-accessibility-change", sync);

    return () => {
      window.removeEventListener("csmaster-accessibility-change", sync);
    };
  }, [uid]);

  useEffect(() => {
    if (!ready || !preferences.readingRuler || exam) return;

    const move = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        setRulerY(event.clientY);
      }
    };

    window.addEventListener("pointermove", move);

    return () => {
      window.removeEventListener("pointermove", move);
    };
  }, [ready, preferences.readingRuler, exam]);

  useEffect(() => {
    if (!exam) return;

    window.speechSynthesis?.cancel();
  }, [exam]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const update = useCallback(
    (nextValue: Preferences) => {
      const next = normalise(nextValue);

      setPreferences(next);

      if (!uid) {
        setSyncMessage("Sign in to save preferences.");
        return;
      }

      saveLocal(uid, next);
      window.dispatchEvent(
        new CustomEvent("csmaster-accessibility-change", {
          detail: { uid, preferences: next },
        })
      );



      setSyncMessage("Saving preferences...");

      void setDoc(
        doc(db, "users", uid, "preferences", "accessibility"),
        next,
        { merge: false }
      )
        .then(() => {
          setSyncMessage("Preferences saved to your account.");
        })
        .catch(() => {
          setSyncMessage(
            "Saved in this browser. Cloud synchronisation is unavailable."
          );
        });
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

    const utterance = new SpeechSynthesisUtterance(
      selection.slice(0, 10000)
    );

    utterance.lang = "en-GB";
    utterance.rate = 0.9;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  if (loading || !ready || (exam && !embedded)) return null;

  const controls = (
    <div className="cs-accessibility-controls">
      <p className="cs-accessibility-intro">
        Choose how CS Master displays reading and learning content.
      </p>

      <label htmlFor={embedded ? "profile-cs-font" : "floating-cs-font"}>
        Font style
      </label>
      <select
        id={embedded ? "profile-cs-font" : "floating-cs-font"}
        value={preferences.font}
        onChange={(e) => update({ ...preferences, font: e.target.value })}
      >
        {fonts.map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <label htmlFor={embedded ? "profile-cs-bg" : "floating-cs-bg"}>
        Reading background
      </label>
      <select
        id={embedded ? "profile-cs-bg" : "floating-cs-bg"}
        value={preferences.background}
        onChange={(e) =>
          update({ ...preferences, background: e.target.value })
        }
      >
        {backgrounds.map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      <div
        className="cs-accessibility-swatches"
        role="group"
        aria-label="Choose a reading background colour"
      >
        {backgrounds.map(([value, label]) => (
          <button
            key={value}
            type="button"
            className="cs-accessibility-swatch"
            aria-label={label}
            aria-pressed={preferences.background === value}
            title={label}
            onClick={() =>
              update({ ...preferences, background: value })
            }
          >
            <span
              className="cs-accessibility-swatch-colour"
              style={{ backgroundColor: backgroundSwatches[value] }}
              aria-hidden="true"
            />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <label htmlFor={embedded ? "profile-cs-size" : "floating-cs-size"}>
        Text size
      </label>
      <select
        id={embedded ? "profile-cs-size" : "floating-cs-size"}
        value={preferences.size}
        onChange={(e) =>
          update({ ...preferences, size: Number(e.target.value) })
        }
      >
        {[100, 110, 120, 130, 150, 175, 200].map((size) => (
          <option key={size} value={size}>{size}%</option>
        ))}
      </select>

      <label htmlFor={embedded ? "profile-cs-lines" : "floating-cs-lines"}>
        Line spacing
      </label>
      <select
        id={embedded ? "profile-cs-lines" : "floating-cs-lines"}
        value={preferences.spacing}
        onChange={(e) =>
          update({ ...preferences, spacing: e.target.value })
        }
      >
        <option value="normal">Normal</option>
        <option value="comfortable">Comfortable</option>
        <option value="wide">Wide</option>
      </select>

      <label htmlFor={embedded ? "profile-cs-letters" : "floating-cs-letters"}>
        Letter spacing
      </label>
      <select
        id={embedded ? "profile-cs-letters" : "floating-cs-letters"}
        value={preferences.letterSpacing}
        onChange={(e) =>
          update({ ...preferences, letterSpacing: e.target.value })
        }
      >
        <option value="normal">Normal</option>
        <option value="comfortable">Comfortable</option>
        <option value="wide">Wide</option>
      </select>

      {([
        ["highContrast", "High contrast"],
        ["reducedMotion", "Reduce animations"],
        ["simplified", "Simplified reading layout"],
        ["readingRuler", "Reading ruler"],
        ["focusMode", "Focus mode"],
      ] as const).map(([key, label]) => (
        <label className="cs-accessibility-check" key={key}>
          <input
            type="checkbox"
            checked={preferences[key]}
            onChange={(e) =>
              update({
                ...preferences,
                [key]: e.target.checked,
              })
            }
          />
          {label}
        </label>
      ))}

      {!exam && (
        <div className="cs-accessibility-actions">
          <button type="button" onClick={speakSelection}>
            Read selected text
          </button>
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
        <p className="cs-accessibility-note">
          Reading assistance is restricted during formal exams.
          Existing examination integrity rules remain in force.
        </p>
      )}

      <button
        type="button"
        className="cs-accessibility-reset"
        onClick={() => update({ ...defaults })}
      >
        Reset to defaults
      </button>

      <p className="cs-accessibility-note" role="status">
        {syncMessage}
      </p>
    </div>
  );

  return (
    <>
      {preferences.readingRuler && !exam && rulerY !== null && (
        <div
          className="cs-reading-ruler"
          aria-hidden="true"
          style={{ top: rulerY - 18 }}
        />
      )}

      {embedded ? (
        <section className="cs-accessibility-profile">
          <h2>Accessibility &amp; Learning Preferences</h2>
          {controls}
        </section>
      ) : (
        <div className="cs-accessibility-widget">
          <button
            type="button"
            className="cs-accessibility-trigger"
            aria-expanded={open}
            aria-controls="cs-accessibility-panel"
            onClick={() => setOpen(!open)}
          >
            Accessibility
          </button>

          {open && (
            <section
              id="cs-accessibility-panel"
              className="cs-accessibility-panel"
              aria-label="Accessibility and learning preferences"
            >
              <div className="cs-accessibility-heading">
                <h2>Accessibility preferences</h2>
                <button type="button" onClick={() => setOpen(false)}>
                  Close
                </button>
              </div>
              {controls}
            </section>
          )}
        </div>
      )}
    </>
  );
}