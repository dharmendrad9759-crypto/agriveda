"use client";

import { useReducedMotion } from "framer-motion";
import { isCapacitorNative } from "@/lib/capacitorNav";

/** Living agritech atmosphere — static on native phones for smooth open */
export default function AppPremiumBackground() {
  const reduceMotion = useReducedMotion();
  const native = typeof window !== "undefined" ? isCapacitorNative() : false;
  const animateParticles = !reduceMotion && !native;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[var(--crop-bg-base,var(--background))]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.07] via-transparent to-amber-400/[0.05] dark:from-emerald-500/[0.1] dark:to-cyan-500/[0.05]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--crop-bg-base,var(--background))] via-transparent to-transparent opacity-95" />

      <div className="absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-emerald-400/[0.1] blur-[100px] dark:bg-emerald-500/[0.12]" />
      <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-lime-300/[0.08] blur-[90px] dark:bg-cyan-500/[0.08]" />
      <div className="absolute bottom-1/4 left-1/3 h-56 w-56 rounded-full bg-amber-300/[0.06] blur-[80px]" />

      {!native && (
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(16,185,129,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.55) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
          }}
        />
      )}

      <svg
        className="absolute bottom-0 left-0 right-0 h-[26vh] w-full opacity-[0.09] dark:opacity-[0.12]"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 240 C200 180 320 260 480 200 C640 140 760 220 960 170 C1160 120 1280 200 1440 160 L1440 320 L0 320 Z"
          fill="url(#appFieldGrad2)"
        />
        <path
          d="M0 280 C240 230 400 300 640 250 C880 200 1100 280 1440 230 L1440 320 L0 320 Z"
          fill="url(#appFieldGrad2)"
          opacity="0.5"
        />
        <defs>
          <linearGradient id="appFieldGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#059669" />
            <stop offset="1" stopColor="#059669" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {animateParticles &&
        Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-emerald-400/30 animate-pulse"
            style={{
              left: `${6 + i * 14}%`,
              top: `${12 + (i % 4) * 16}%`,
              width: 3 + (i % 3),
              height: 3 + (i % 3),
              animationDuration: `${4 + i * 0.4}s`,
            }}
          />
        ))}
    </div>
  );
}
