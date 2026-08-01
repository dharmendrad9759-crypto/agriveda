"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BRAND } from "@/lib/brand";

const SESSION_KEY = "agriveda-boot-shown-v4";
const HERO = "/splash/agriveda-splash.png";
const EASE = [0.22, 1, 0.36, 1] as const;

function readBootDone(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markBootDone() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
}

/**
 * Premium boot splash — web / laptop once per session.
 * Phone uses NativeLaunchSplash instead (more reliable in Capacitor WebView).
 */
export default function BootSplash() {
  const a11yReduced = useReducedMotion();
  const [phase, setPhase] = useState<"idle" | "show" | "exit" | "gone">("idle");

  useEffect(() => {
    // Phone: NativeLaunchSplash handles the 4s brand screen
    if (
      typeof document !== "undefined" &&
      document.documentElement.getAttribute("data-capacitor-native") === "true"
    ) {
      setPhase("gone");
      return;
    }
    // Also detect Capacitor before attribute is set
    try {
      const w = window as Window & { Capacitor?: { isNativePlatform?: () => boolean } };
      if (w.Capacitor?.isNativePlatform?.()) {
        setPhase("gone");
        return;
      }
    } catch {
      /* web */
    }

    if (readBootDone()) {
      setPhase("gone");
      return;
    }

    setPhase("show");
    const totalMs = a11yReduced ? 1200 : 4200;
    const exitMs = a11yReduced ? 200 : 550;
    const t1 = window.setTimeout(() => setPhase("exit"), totalMs - exitMs);
    const t2 = window.setTimeout(() => {
      setPhase("gone");
      markBootDone();
    }, totalMs);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [a11yReduced]);

  if (phase === "idle" || phase === "gone") return null;

  return (
    <AnimatePresence>
      {phase === "show" || phase === "exit" ? (
        <motion.div
          key="agriveda-boot"
          id="agriveda-boot"
          aria-live="polite"
          aria-busy={phase === "show"}
          className="fixed inset-0 z-[99998] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "exit" ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <motion.div
            className="absolute inset-0 scale-105 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO})` }}
            initial={a11yReduced ? false : { scale: 1.08 }}
            animate={{ scale: 1.02 }}
            transition={{ duration: 4, ease: EASE }}
          />
          <div className="absolute inset-0 bg-[#03140f]/45" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#02150f]/35 via-transparent to-[#020a07]/80" />

          {!a11yReduced && (
            <motion.div
              aria-hidden
              className="absolute left-1/2 top-[22%] h-44 w-44 -translate-x-1/2 rounded-full bg-emerald-300/25 blur-3xl"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 0.85, scale: 1.1 }}
              transition={{ duration: 1.4, ease: EASE }}
            />
          )}

          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            <motion.div
              className="mb-6 flex h-[88px] w-[88px] items-center justify-center rounded-[26px] bg-gradient-to-br from-emerald-400 to-teal-800 shadow-[0_20px_60px_-12px_rgba(16,185,129,0.6)] ring-1 ring-white/20"
              initial={a11yReduced ? false : { scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <svg viewBox="0 0 80 80" className="h-14 w-14" aria-hidden>
                <path d="M40 70 V30" stroke="#ecfdf5" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M40 44 C26 36 20 24 24 12 C36 18 40 30 40 44 Z" fill="#a7f3d0" />
                <path d="M40 48 C54 40 60 28 56 14 C46 20 40 34 40 48 Z" fill="#6ee7b7" />
              </svg>
            </motion.div>

            <motion.h1
              className="m-0 font-display text-[clamp(2.4rem,9vw,3.35rem)] font-bold leading-none tracking-tight text-white"
              style={{ textShadow: "0 12px 40px rgba(0,0,0,0.45)" }}
              initial={a11yReduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.85, ease: EASE }}
            >
              {BRAND}
            </motion.h1>

            <motion.p
              className="mt-3 text-[15px] font-medium text-emerald-50/90"
              initial={a11yReduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.55 }}
            >
              खेत की बुद्धि
            </motion.p>

            <motion.div
              className="relative mt-9 h-[3px] w-36 overflow-hidden rounded-full bg-white/15"
              initial={a11yReduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.span
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-lime-300 via-emerald-400 to-teal-300"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.75, duration: 3.2, ease: EASE }}
              />
            </motion.div>
          </div>

          <p className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-10 text-[10px] font-semibold tracking-[0.2em] text-emerald-100/45">
            MADE FOR INDIAN FARMERS
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
