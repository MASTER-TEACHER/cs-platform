"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const IDLE_MS = 30 * 60 * 1000;
const CHECK_MS = 15 * 1000;

/** Client inactivity guard. Firebase security rules remain the source of server-side authorisation. */
export default function IdleSessionGuard() {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    let lastActivity = Date.now();
    let signingOut = false;
    const markActive = () => { lastActivity = Date.now(); };
    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "touchstart", "scroll"];
    for (const event of events) window.addEventListener(event, markActive, { passive: true });
    const interval = window.setInterval(() => {
      if (!auth.currentUser || signingOut || Date.now() - lastActivity < IDLE_MS) return;
      signingOut = true;
      void signOut(auth).then(() => {
        router.replace("/login?reason=inactive");
      }).catch(() => { signingOut = false; });
    }, CHECK_MS);
    return () => {
      window.clearInterval(interval);
      for (const event of events) window.removeEventListener(event, markActive);
    };
  }, [pathname, router]);
  return null;
}
