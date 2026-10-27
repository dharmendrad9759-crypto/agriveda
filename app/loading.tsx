"use client";

import { useEffect, useState } from "react";

const LOADING_HINTS = [
  "🌿 खेत और फसल की सटीक जानकारी तैयार की जा रही है...",
  "☀️ आपके क्षेत्र का सटीक मौसम और छिड़काव समय लोड हो रहा है...",
  "📊 ताज़ा मंडी भाव और आवक विश्लेषण अपडेट हो रहा है...",
  "🌾 AI फसल डॉक्टर और कृषि सलाह सक्रिय की जा रही है...",
];

export default function RootLoading() {
  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHintIndex((prev) => (prev + 1) % LOADING_HINTS.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="AgriVeda लोड हो रहा है"
      className="relative flex min-h-[82vh] w-full flex-col items-center justify-center overflow-hidden px-4 py-12 select-none"
    >
      {/* Ambient background glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-80 w-80 rounded-full bg-gradient-to-tr from-emerald-500/15 via-teal-400/10 to-amber-400/10 blur-3xl dark:from-emerald-500/25 dark:via-teal-500/15 dark:to-emerald-900/20" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Emblem & Animated Halo */}
        <div className="relative flex h-28 w-28 items-center justify-center">
          {/* Pulsing Emerald Aura */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl dark:bg-emerald-400/30"
            style={{ animation: "agv-aura-pulse 2.8s ease-in-out infinite" }}
          />

          {/* Outer Rotating Dash Orbit */}
          <div
            aria-hidden
            className="absolute -inset-2 rounded-full border border-dashed border-emerald-500/40 dark:border-emerald-400/50"
            style={{ animation: "agv-orbit-spin 14s linear infinite" }}
          />

          {/* Glowing Conic Gradient Ring */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-full p-[2px]"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(16,185,129,0.1), rgba(16,185,129,0.9), rgba(245,158,11,0.8), rgba(20,184,166,0.9), rgba(16,185,129,0.1))",
              animation: "agv-orbit-spin 3s linear infinite",
            }}
          >
            <div className="h-full w-full rounded-full bg-white dark:bg-slate-950" />
          </div>

          {/* Core Brand Emblem Jewel */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 shadow-[0_12px_32px_rgba(5,150,105,0.4)] border border-emerald-300/40">
            {/* Bespoke Vedic Sprout & Sunburst SVG */}
            <svg
              className="h-11 w-11 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Golden Sunburst Glow */}
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke="url(#sun-gradient)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.6"
              />

              {/* Radiant Vedic Spark (Wisdom & AI) */}
              <path
                d="M24 6L26.5 12.5L33 15L26.5 17.5L24 24L21.5 17.5L15 15L21.5 12.5L24 6Z"
                fill="url(#gold-spark-grad)"
              />

              {/* Main Sprout Stem */}
              <path
                d="M24 24V40"
                stroke="#6EE7B7"
                strokeWidth="2.8"
                strokeLinecap="round"
              />

              {/* Left Lush Leaf */}
              <path
                d="M24 32C18 32 14.5 29 13.5 25C17.5 25 21.5 28 24 32Z"
                fill="#34D399"
              />

              {/* Right Lush Leaf */}
              <path
                d="M24 35C30 35 33.5 32 34.5 28C30.5 28 26.5 31 24 35Z"
                fill="#A7F3D0"
              />

              {/* Radiant Diamond Nodes */}
              <circle cx="36" cy="11" r="1.5" fill="#FBBF24" />
              <circle cx="12" cy="37" r="1.5" fill="#34D399" />

              <defs>
                <linearGradient
                  id="gold-spark-grad"
                  x1="15"
                  y1="6"
                  x2="33"
                  y2="24"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FDE68A" />
                  <stop offset="0.5" stopColor="#F59E0B" />
                  <stop offset="1" stopColor="#D97706" />
                </linearGradient>
                <linearGradient
                  id="sun-gradient"
                  x1="6"
                  y1="6"
                  x2="42"
                  y2="42"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#F59E0B" />
                  <stop offset="1" stopColor="#10B981" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="mt-6 flex flex-col items-center">
          <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 dark:from-emerald-300 dark:via-teal-200 dark:to-emerald-400 sm:text-4xl">
            AgriVeda
          </h1>

          {/* Premium Tagline Pill Badge */}
          <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-emerald-600/20 bg-emerald-50/90 px-4 py-1 text-xs font-bold tracking-wide text-emerald-900 shadow-sm backdrop-blur-md dark:border-emerald-400/25 dark:bg-emerald-950/70 dark:text-emerald-200">
            <span className="text-amber-500 dark:text-amber-400">✨</span>
            <span>स्मार्ट किसान सलाहकार</span>
            <span className="text-amber-500 dark:text-amber-400">✨</span>
          </div>
        </div>

        {/* Animated Liquid Loading Track */}
        <div className="mt-8 flex flex-col items-center">
          <div className="relative h-2 w-64 overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/20">
            <div
              className="absolute inset-y-0 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
              style={{ animation: "agv-liquid-progress 1.8s ease-in-out infinite" }}
            />
          </div>

          {/* Dynamic Changing Agro Hint */}
          <p
            key={hintIndex}
            className="mt-4 min-h-[1.5rem] max-w-xs text-xs font-bold text-emerald-900/80 dark:text-emerald-200/90 transition-all duration-500 animate-fade-in"
          >
            {LOADING_HINTS[hintIndex]}
          </p>

          {/* Subtle 3-dot pulse */}
          <div aria-hidden className="mt-2 flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"
              style={{ animation: "agv-dot-bounce 1.4s infinite ease-in-out both 0s" }}
            />
            <span
              className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-300"
              style={{ animation: "agv-dot-bounce 1.4s infinite ease-in-out both 0.2s" }}
            />
            <span
              className="h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-amber-400"
              style={{ animation: "agv-dot-bounce 1.4s infinite ease-in-out both 0.4s" }}
            />
          </div>
        </div>

        {/* Bottom Trust Seal */}
        <div className="mt-10 inline-flex items-center gap-2 text-[11px] font-semibold text-emerald-800/60 dark:text-emerald-300/60">
          <span>🛡️</span>
          <span>सुरक्षित • 100% भारतीय किसानों के लिए समर्पित</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes agv-orbit-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes agv-aura-pulse {
          0%,
          100% {
            transform: scale(0.95);
            opacity: 0.35;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.85;
          }
        }
        @keyframes agv-liquid-progress {
          0% {
            left: -35%;
          }
          50% {
            left: 50%;
            width: 40%;
          }
          100% {
            left: 105%;
          }
        }
        @keyframes agv-dot-bounce {
          0%,
          80%,
          100% {
            transform: scale(0.6);
            opacity: 0.4;
          }
          40% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
