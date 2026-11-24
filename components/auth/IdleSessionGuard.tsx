"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const IDLE_MS = 30 * 60 * 1000;
const CHECK_MS = 15 * 1000;
const SHARED_KEY = "csmaster:lastActivity";
const WRITE_EVERY_MS = 5 * 1000;

/**
 * Signs the user out after 30 minutes with no activity in ANY CS Master tab.
 *
 * Activity is: clicking, typing, touching, scrolling (including inside panels),
 * mouse wheel, moving the mouse, and long-running work that announces itself
 * with `window.dispatchEvent(new Event("csmaster:activity"))` (batch marking,
 * batch splitting, uploads). The last activity time is shared between tabs, so
 * an untouched second tab no longer signs out the tab you are working in.
 *
 * Firebase security rules remain the source of server-side authorisation.
 */
export function announceActivity() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("csmaster:activity"));
}

export default function IdleSessionGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let lastActivity = Date.now();
    let lastWrite = 0;
    let signingOut = false;

    const shared = () => {
      try {
        return Number(window.localStorage.getItem(SHARED_KEY)) || 0;
      } catch {
        return 0;
      }
    };

    const markActive = () => {
      lastActivity = Date.now();
      if (lastActivity - lastWrite > WRITE_EVERY_MS) {
        lastWrite = lastActivity;
        try {
          window.localStorage.setItem(SHARED_KEY, String(lastActivity));
        } catch {
          // Private browsing: this tab still tracks its own activity.
        }
      }
    };
    markActive();

    const windowEvents: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "touchstart", "wheel", "mousemove", "focus"];
    for (const event of windowEvents) window.addEventListener(event, markActive, { passive: true });
    // Scroll events inside panels do not bubble: listen in the capture phase.
    document.addEventListener("scroll", markActive, { passive: true, capture: true });
    window.addEventListener("csmaster:activity", markActive);

    const interval = window.setInterval(() => {
      const latest = Math.max(lastActivity, shared());
      if (!auth.currentUser || signingOut || Date.now() - latest < IDLE_MS) return;
      signingOut = true;
      void signOut(auth).then(() => {
        router.replace("/login?reason=inactive");
      }).catch(() => { signingOut = false; });
    }, CHECK_MS);

    return () => {
      window.clearInterval(interval);
      for (const event of windowEvents) window.removeEventListener(event, markActive);
      document.removeEventListener("scroll", markActive, { capture: true });
      window.removeEventListener("csmaster:activity", markActive);
    };
  }, [pathname, router]);

  return null;
}
