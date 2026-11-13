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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo-stacked.png"
          alt="AgriVeda"
          className="h-auto w-[min(70vw,240px)] object-contain"
        />
        <p className="mt-2 text-[13px] font-bold tracking-[0.16em] text-[#0c3b2e] dark:text-emerald-200">
          स्मार्ट किसान सलाहकार
        </p>

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
          <span>भारतीय किसानों के लिए</span>
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
