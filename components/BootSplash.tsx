"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { isCapacitorNative } from "@/lib/capacitorNav";

const SESSION_KEY = "agriveda-boot-shown";

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
 * Boot splash — cinematic on web, short & light on Capacitor so phone opens fast.
 */
export default function BootSplash() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"show" | "exit" | "gone">(() =>
    readBootDone() ? "gone" : "show"
  );
  const [native] = useState(() => (typeof window !== "undefined" ? isCapacitorNative() : false));

  useEffect(() => {
    if (phase === "gone") return;

    // Phone: keep it short — long Framer scenes feel like lag
    const totalMs = native || reduced ? 700 : 2200;
    const exitMs = native || reduced ? 180 : 550;
    const t1 = window.setTimeout(() => setPhase("exit"), totalMs - exitMs);
    const t2 = window.setTimeout(() => {
      setPhase("gone");
      markBootDone();
    }, totalMs);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [phase, reduced, native]);

  if (phase === "gone") return null;

  const light = native || reduced;

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
        transition={{ duration: light ? 0.2 : 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,#0f3d2e_0%,#04140f_45%,#020807_100%)]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 78%, rgba(251,191,36,0.28) 0%, rgba(16,185,129,0.1) 35%, transparent 70%)",
          }}
        />

        {!light && (
          <motion.div
            className="absolute left-1/2 top-[38%] h-28 w-28 -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-200 via-amber-400/80 to-emerald-500/20 blur-[2px]"
            initial={{ scale: 0.4, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 0.9, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        )}

        {!light &&
          Array.from({ length: 10 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-lime-300/50"
              style={{ left: `${8 + ((i * 7) % 84)}%`, top: `${20 + (i % 5) * 12}%` }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: [0, 0.8, 0.2], y: [20, -30 - i * 3] }}
              transition={{ duration: 2 + (i % 4) * 0.2, delay: 0.12 * i, ease: "easeOut" }}
            />
          ))}

        <svg
          className="absolute bottom-0 left-0 right-0 h-[36vh] w-full"
          viewBox="0 0 1440 420"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="bootField" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#022c22" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            d="M0 260 C180 200 320 300 520 240 C720 180 880 280 1080 220 C1240 180 1360 240 1440 210 L1440 420 L0 420 Z"
            fill="url(#bootField)"
          />
        </svg>

        <div className="relative z-10 mb-4 flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl" />
          <svg viewBox="0 0 80 80" className="relative h-16 w-16 drop-shadow-[0_0_20px_rgba(52,211,153,0.4)]">
            <path d="M40 68 V28" stroke="#6ee7b7" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M40 42 C28 36 22 26 24 16 C34 20 40 28 40 42 Z" fill="#34d399" />
            <path d="M40 46 C52 40 58 30 56 18 C46 22 40 32 40 46 Z" fill="#10b981" />
          </svg>
        </div>

        <h1
          className="relative z-10 m-0 bg-gradient-to-b from-white via-emerald-50 to-emerald-200/90 bg-clip-text text-[clamp(1.85rem,7vw,2.5rem)] font-black tracking-tight text-transparent"
          style={{ fontFamily: "var(--font-display), Outfit, system-ui, sans-serif" }}
        >
          Agriveda
        </h1>
        <p className="relative z-10 mt-2 text-sm font-semibold tracking-wide text-emerald-100/85">
          खेत की बुद्धि · Smart Farm Advisory
        </p>

        <div className="relative z-10 mt-6 h-1 w-24 overflow-hidden rounded-full bg-white/10">
          <motion.span
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-lime-300 to-emerald-400"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: light ? 0.55 : 1.05, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
