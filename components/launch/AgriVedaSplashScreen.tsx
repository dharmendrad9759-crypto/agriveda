"use client";

import { useEffect, useState } from "react";
import { BRAND } from "@/lib/brand";

const SPLASH_MS = 1800;
const EXIT_MS = 300;

type Props = {
  onComplete: () => void;
  reducedMotion?: boolean;
};

export default function AgriVedaSplashScreen({ onComplete, reducedMotion = false }: Props) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (
      typeof document !== "undefined" &&
      document.documentElement.getAttribute("data-capacitor-native") === "true"
    ) {
      void import("@capacitor/splash-screen")
        .then(({ SplashScreen }) => SplashScreen.hide({ fadeOutDuration: 0 }))
        .catch(() => {});
    }

    const total = reducedMotion ? 900 : SPLASH_MS;
    const exitAt = Math.max(0, total - (reducedMotion ? 120 : EXIT_MS));
    const tExit = window.setTimeout(() => setExiting(true), exitAt);
    const tDone = window.setTimeout(onComplete, total);
    return () => {
      window.clearTimeout(tExit);
      window.clearTimeout(tDone);
    };
  }, [onComplete, reducedMotion]);

  return (
    <div
      id="agriveda-splash-screen"
      role="status"
      aria-live="polite"
      aria-busy={!exiting}
      className={`fixed inset-0 z-[100000] flex flex-col items-center justify-center overflow-hidden bg-[#fffdf8] ${
        exiting ? "agriveda-splash--exit" : "agriveda-splash"
      }`}
    >
      <button
        type="button"
        onClick={onComplete}
        className="absolute top-4 right-4 z-50 rounded-full border border-[#0c3b2e]/15 bg-white/80 px-3.5 py-1.5 text-xs font-bold text-[#0c3b2e] backdrop-blur-md transition hover:bg-white active:scale-95"
      >
        स्किप करें (Skip) ›
      </button>

      <div className="agriveda-splash__brand relative z-10 flex flex-col items-center px-6 text-center">
        <div className="agriveda-splash__logo relative mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-stacked.png"
            alt={BRAND}
            className="h-auto w-[min(78vw,280px)] object-contain"
          />
        </div>
        <p className="text-[13px] font-bold tracking-[0.18em] text-[#0c3b2e]">
          स्मार्ट किसान सलाहकार
        </p>
      </div>

      <div className="absolute bottom-[max(2.8rem,env(safe-area-inset-bottom))] z-10 flex flex-col items-center gap-4">
        {/* Futuristic Spinner */}
        <div className="relative flex h-10 w-10 items-center justify-center">
          <div className="agriveda-splash__spinner-track absolute inset-0 rounded-full border-2 border-[#0c3b2e]/15" />
          <div className="agriveda-splash__spinner-head absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-400 border-l-emerald-400" />
          <div className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,1)] animate-pulse" />
        </div>
        <span className="text-[10px] font-bold tracking-[0.25em] text-slate-500">
          MADE FOR INDIAN FARMERS
        </span>
      </div>

      <style>{`
        .agriveda-splash {
          opacity: 1;
          transition: opacity ${EXIT_MS}ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .agriveda-splash--exit {
          opacity: 0;
          pointer-events: none;
        }
        
        .agriveda-splash__logo {
          animation: agv-pop 1s cubic-bezier(0.34, 1.45, 0.64, 1) both;
        }
        
        .agriveda-splash__ring-outer {
          animation: agv-pulse-ring 3s ease-in-out infinite;
        }
        
        .agriveda-splash__ring-inner {
          animation: agv-spin-ring 4s linear infinite;
        }

        .agriveda-splash__brand h1,
        .agriveda-splash__brand p,
        .agriveda-splash__brand div.flex,
        .agriveda-splash__brand div.inline-flex {
          animation: agv-rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .agriveda-splash__brand h1 { animation-delay: 0.15s; }
        .agriveda-splash__brand p { animation-delay: 0.25s; }
        .agriveda-splash__brand div.flex { animation-delay: 0.35s; }
        .agriveda-splash__brand div.inline-flex { animation-delay: 0.45s; }

        .agriveda-splash__spinner-head {
          animation: agv-spin 1s cubic-bezier(0.5, 0.1, 0.4, 0.9) infinite;
        }

        @keyframes agv-pop {
          from { opacity: 0; transform: scale(0.85) translateY(20px); filter: blur(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        
        @keyframes agv-spin-ring {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes agv-pulse-ring {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.08); opacity: 1; border-color: rgba(16, 185, 129, 0.5); }
        }

        @keyframes agv-rise {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes agv-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .agriveda-splash__logo,
          .agriveda-splash__brand h1,
          .agriveda-splash__brand p,
          .agriveda-splash__brand div.flex,
          .agriveda-splash__brand div.inline-flex {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
          .agriveda-splash__ring-outer,
          .agriveda-splash__ring-inner,
          .agriveda-splash__spinner-head {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
