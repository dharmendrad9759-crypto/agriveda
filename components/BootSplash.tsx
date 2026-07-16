"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SESSION_KEY = "agriveda-boot-shown";

/**
 * Cinematic farmer-first boot — sunrise field, growing crop, brand reveal.
 * Shown once per browser/app session (respects reduced motion).
 */
export default function BootSplash() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"show" | "exit" | "gone">("show");

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") {
        setPhase("gone");
        return;
      }
    } catch {
      /* ignore */
    }

    const totalMs = reduced ? 600 : 2600;
    const exitMs = reduced ? 200 : 700;
    const t1 = window.setTimeout(() => setPhase("exit"), totalMs - exitMs);
    const t2 = window.setTimeout(() => {
      setPhase("gone");
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
    }, totalMs);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [reduced]);

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
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Dawn sky */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,#0f3d2e_0%,#04140f_45%,#020807_100%)]" />
          <motion.div
            className="absolute inset-0"
            initial={reduced ? false : { opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% 78%, rgba(251,191,36,0.35) 0%, rgba(16,185,129,0.12) 35%, transparent 70%)",
            }}
          />

          {/* Soft sun */}
          {!reduced && (
            <motion.div
              className="absolute left-1/2 top-[38%] h-28 w-28 -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-200 via-amber-400/80 to-emerald-500/20 blur-[2px]"
              initial={{ scale: 0.4, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 0.9, y: 0 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            />
          )}

          {/* Floating seed particles */}
          {!reduced &&
            Array.from({ length: 14 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full bg-lime-300/50"
                style={{ left: `${8 + ((i * 7) % 84)}%`, top: `${20 + (i % 5) * 12}%` }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: [0, 0.8, 0.2], y: [20, -30 - i * 3] }}
                transition={{ duration: 2.2 + (i % 4) * 0.2, delay: 0.15 * i, ease: "easeOut" }}
              />
            ))}

          {/* Field silhouette */}
          <svg
            className="absolute bottom-0 left-0 right-0 h-[42vh] w-full"
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
            <motion.path
              d="M0 260 C180 200 320 300 520 240 C720 180 880 280 1080 220 C1240 180 1360 240 1440 210 L1440 420 L0 420 Z"
              fill="url(#bootField)"
              initial={reduced ? false : { y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* Crop rows */}
            {!reduced &&
              [0, 1, 2, 3, 4, 5].map((row) => (
                <motion.g
                  key={row}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.55 }}
                  transition={{ delay: 0.45 + row * 0.08 }}
                >
                  {Array.from({ length: 18 }).map((_, i) => (
                    <ellipse
                      key={i}
                      cx={40 + i * 80 + (row % 2) * 24}
                      cy={300 + row * 18}
                      rx="6"
                      ry="14"
                      fill="#34d399"
                      opacity={0.35 + (i % 3) * 0.1}
                    />
                  ))}
                </motion.g>
              ))}
          </svg>

          {/* Growing plant mark */}
          <motion.div
            className="relative z-10 mb-5 flex h-24 w-24 items-center justify-center"
            initial={reduced ? false : { scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl" />
            <svg viewBox="0 0 80 80" className="relative h-20 w-20 drop-shadow-[0_0_24px_rgba(52,211,153,0.45)]">
              <motion.path
                d="M40 68 V28"
                stroke="#6ee7b7"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                initial={reduced ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.35 }}
              />
              <motion.path
                d="M40 42 C28 36 22 26 24 16 C34 20 40 28 40 42 Z"
                fill="#34d399"
                initial={reduced ? false : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 220, damping: 16 }}
                style={{ transformOrigin: "40px 42px" }}
              />
              <motion.path
                d="M40 46 C52 40 58 30 56 18 C46 22 40 32 40 46 Z"
                fill="#10b981"
                initial={reduced ? false : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.85, type: "spring", stiffness: 220, damping: 16 }}
                style={{ transformOrigin: "40px 46px" }}
              />
            </svg>
          </motion.div>

          <motion.h1
            className="relative z-10 m-0 bg-gradient-to-b from-white via-emerald-50 to-emerald-200/90 bg-clip-text text-[clamp(2rem,8vw,2.75rem)] font-black tracking-tight text-transparent"
            style={{ fontFamily: "var(--font-display), Outfit, system-ui, sans-serif" }}
            initial={reduced ? false : { y: 18, opacity: 0, letterSpacing: "0.12em" }}
            animate={{ y: 0, opacity: 1, letterSpacing: "-0.02em" }}
            transition={{ delay: 0.55, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            Agriveda
          </motion.h1>

          <motion.p
            className="relative z-10 mt-2 text-sm font-semibold tracking-wide text-emerald-100/85"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.6 }}
          >
            खेत की बुद्धि · Smart Farm Advisory
          </motion.p>

          {/* Wheat / crop sway marks */}
          {!reduced && (
            <div className="pointer-events-none absolute bottom-[18%] left-0 right-0 z-[5] flex justify-center gap-8 opacity-40">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.svg
                  key={i}
                  width="18"
                  height="48"
                  viewBox="0 0 18 48"
                  animate={{ rotate: [-4, 4, -4] }}
                  transition={{ duration: 2.2 + i * 0.15, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }}
                  style={{ transformOrigin: "9px 48px" }}
                >
                  <path d="M9 48 V14" stroke="#86efac" strokeWidth="2" strokeLinecap="round" />
                  <ellipse cx="9" cy="12" rx="5" ry="8" fill="#4ade80" opacity="0.85" />
                </motion.svg>
              ))}
            </div>
          )}

          {!reduced && (
            <motion.div
              className="relative z-10 mt-8 h-1 w-28 overflow-hidden rounded-full bg-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <motion.span
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-lime-300 to-emerald-400"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.15, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
          )}
        </motion.div>
    </AnimatePresence>
  );
}
