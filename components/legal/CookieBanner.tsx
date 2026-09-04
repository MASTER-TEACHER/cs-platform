"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

const STORAGE_KEY = "cs-master-cookie-notice-v1";
const COOKIE_EVENT = "cs-master-cookie-notice-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(COOKIE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(COOKIE_EVENT, callback);
  };
}

function getSnapshot(): boolean {
  try {
    return (
      window.localStorage.getItem(STORAGE_KEY) ===
      "acknowledged"
    );
  } catch {
    return false;
  }
}

/**
 * During SSR and hydration we deliberately report the notice as
 * acknowledged. This means both the server HTML and the client's
 * hydration pass initially render no banner.
 *
 * Immediately after hydration React reads getSnapshot(), and the
 * banner appears if the user has not acknowledged it.
 */
function getServerSnapshot(): boolean {
  return true;
}

export default function CookieBanner() {
  const acknowledged = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  function acknowledge() {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        "acknowledged",
      );
    } catch {
      // The banner can still be dismissed for the current render.
    }

    window.dispatchEvent(
      new Event(COOKIE_EVENT),
    );
  }

  if (acknowledged) {
    return null;
  }

  return (
    <aside
      aria-label="Cookie notice"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:inset-x-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-slate-700">
          CS Master uses essential browser storage to keep the
          platform working. Non-essential analytics or advertising
          cookies are not enabled by this notice. Read the{" "}
          <Link
            href="/cookies"
            className="font-bold text-blue-700 underline"
          >
            cookie information
          </Link>
          .
        </p>

        <button
          type="button"
          onClick={acknowledge}
          className="shrink-0 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
        >
          Got it
        </button>
      </div>
    </aside>
  );
}