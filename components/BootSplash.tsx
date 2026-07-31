"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BRAND } from "@/lib/brand";

const SESSION_KEY = "agriveda-boot-shown-v3";
const HERO = "/splash/agriveda-splash.png";
const EASE = [0.22, 1, 0.36, 1] as const;

function readBootDone(): boolean {
  if (typeof window === "undefined") return false;
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
 * Premium boot splash — once per browser/session.
 * Kept outside MotionConfig so native reduced-motion UI config doesn't mute it.
 */
export default function BootSplash() {
  const a11yReduced = useReducedMotion();
  const [phase, setPhase] = useState<"show" | "exit" | "gone">(() =>
    readBootDone() ? "gone" : "show"
  );

  useEffect(() => {
    if (phase === "gone") return;

    // Always ≥ 4s (user request); a11y slightly shorter but still readable
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
  }, [phase, a11yReduced]);

  if (phase === "gone") return null;

  return (
    <AnimatePresence>
      <motion.div
        id="agriveda-boot"
        aria-live="polite"
        aria-busy={phase === "show"}
        className="fixed inset-0 z-[99998] flex flex-col items-center justify-center overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "exit" ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        {/* Full-bleed farm plane */}
        <motion.div
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO})` }}
          initial={a11yReduced ? false : { scale: 1.12 }}
          animate={{ scale: phase === "exit" ? 1.04 : 1.02 }}
          transition={{ duration: 2.6, ease: EASE }}
        />

        {/* Brand atmosphere overlays */}
        <div className="absolute inset-0 bg-[#03140f]/72" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#02150f]/40 via-transparent to-[#020a07]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(16,185,129,0.28),transparent_58%)]" />

        {/* Soft dawn wash */}
        {!a11yReduced && (
          <motion.div
            aria-hidden
            className="absolute left-1/2 top-[18%] h-40 w-40 -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-200/50 via-emerald-300/25 to-transparent blur-3xl"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.9, scale: 1.15 }}
            transition={{ duration: 1.6, ease: EASE }}
          />
        )}

        {/* Floating light motes */}
        {!a11yReduced &&
          Array.from({ length: 10 }).map((_, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute h-1 w-1 rounded-full bg-emerald-200/70"
              style={{
                left: `${10 + ((i * 9) % 80)}%`,
                top: `${22 + (i % 4) * 14}%`,
              }}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: [0, 0.9, 0.15], y: [18, -40 - i * 3] }}
              transition={{
                duration: 2.2 + (i % 3) * 0.2,
                delay: 0.12 * i,
                ease: "easeOut",
              }}
            />
          ))}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          {/* Mark */}
          <motion.div
            className="relative mb-7"
            initial={a11yReduced ? false : { scale: 0.7, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE }}
          >
            {!a11yReduced && (
              <motion.span
                aria-hidden
                className="absolute -inset-3 rounded-[28px] border border-emerald-300/25"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: [0.15, 0.55, 0.2], scale: [0.95, 1.06, 1] }}
                transition={{ duration: 2.2, ease: EASE }}
              />
            )}
            <div className="relative flex h-[88px] w-[88px] items-center justify-center rounded-[26px] border border-white/15 bg-gradient-to-br from-emerald-500/30 via-emerald-700/40 to-teal-950/50 shadow-[0_20px_60px_-12px_rgba(16,185,129,0.55)] backdrop-blur-md sm:h-24 sm:w-24">
              <div className="absolute inset-0 rounded-[26px] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_50%)]" />
              <svg
                viewBox="0 0 80 80"
                className="relative h-14 w-14 drop-shadow-[0_0_18px_rgba(52,211,153,0.45)] sm:h-16 sm:w-16"
                aria-hidden
              >
                <motion.path
                  d="M40 70 V30"
                  stroke="#a7f3d0"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  initial={a11yReduced ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: 0.25 }}
                />
                <motion.path
                  d="M40 44 C26 36 20 24 24 12 C36 18 40 30 40 44 Z"
                  fill="#34d399"
                  initial={a11yReduced ? false : { scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.55, type: "spring", stiffness: 210, damping: 16 }}
                  style={{ transformOrigin: "40px 44px" }}
                />
                <motion.path
                  d="M40 48 C54 40 60 28 56 14 C46 20 40 34 40 48 Z"
                  fill="#10b981"
                  initial={a11yReduced ? false : { scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 210, damping: 16 }}
                  style={{ transformOrigin: "40px 48px" }}
                />
              </svg>
            </div>
          </motion.div>

          {/* Brand — hero signal */}
          <motion.p
            className="mb-2 text-[11px] font-bold uppercase tracking-[0.28em] text-emerald-200/75"
            initial={a11yReduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.55 }}
          >
            India · Farm Intelligence
          </motion.p>

          <motion.h1
            className="m-0 font-display text-[clamp(2.4rem,9vw,3.35rem)] font-bold leading-none tracking-tight text-white"
            style={{
              textShadow: "0 12px 40px rgba(0,0,0,0.45)",
            }}
            initial={a11yReduced ? false : { opacity: 0, y: 22, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.45, duration: 0.95, ease: EASE }}
          >
            {BRAND}
          </motion.h1>

          <motion.p
            className="mt-3 max-w-[16rem] text-[15px] font-medium leading-snug text-emerald-50/88"
            initial={a11yReduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6 }}
          >
            खेत की बुद्धि — स्मार्ट फसल सलाह
          </motion.p>

          {/* Progress */}
          <motion.div
            className="relative mt-9 h-[3px] w-36 overflow-hidden rounded-full bg-white/15"
            initial={a11yReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.span
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-lime-300 via-emerald-400 to-teal-300"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.9, duration: 1.7, ease: EASE }}
            />
            {!a11yReduced && (
              <motion.span
                aria-hidden
                className="absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-white/70 to-transparent"
                initial={{ left: "-20%" }}
                animate={{ left: "110%" }}
                transition={{ delay: 1.1, duration: 1.1, ease: "easeInOut" }}
              />
            )}
          </motion.div>
        </div>

        {/* Bottom brand bar */}
        <motion.p
          className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-10 text-[10px] font-semibold tracking-[0.2em] text-emerald-100/45"
          initial={a11yReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          MADE FOR INDIAN FARMERS
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
