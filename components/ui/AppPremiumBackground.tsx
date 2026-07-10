"use client";

import { motion, useReducedMotion } from "framer-motion";

/** App-wide premium agritech background — clean, subtle, no mockups */
export default function AppPremiumBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[var(--crop-bg-base,var(--background))]" />
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.06] via-transparent to-cyan-500/[0.04] dark:from-emerald-500/[0.08] dark:to-cyan-500/[0.05]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--crop-bg-base,var(--background))] via-transparent to-transparent opacity-90" />

      <div className="absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-emerald-400/[0.07] blur-[90px] dark:bg-emerald-500/[0.09]" />
      <div className="absolute -right-24 top-0 h-64 w-64 rounded-full bg-cyan-400/[0.05] blur-[80px] dark:bg-cyan-500/[0.07]" />
      <div className="absolute bottom-1/3 left-1/3 h-48 w-48 rounded-full bg-lime-400/[0.04] blur-[70px]" />

      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.5) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <svg
        className="absolute bottom-0 left-0 right-0 h-[22vh] w-full opacity-[0.06] dark:opacity-[0.08]"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 240 C200 180 320 260 480 200 C640 140 760 220 960 170 C1160 120 1280 200 1440 160 L1440 320 L0 320 Z"
          fill="url(#appFieldGrad)"
        />
        <defs>
          <linearGradient id="appFieldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#059669" />
            <stop offset="1" stopColor="#059669" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {!reduceMotion &&
        Array.from({ length: 6 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-emerald-400/25"
            style={{ left: `${12 + i * 14}%`, top: `${18 + (i % 3) * 20}%` }}
            animate={{ y: [0, -12, 0], opacity: [0.12, 0.35, 0.12] }}
            transition={{
              duration: 5 + i * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.35,
            }}
          />
        ))}
    </div>
  );
}
