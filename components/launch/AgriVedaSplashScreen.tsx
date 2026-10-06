"use client";

import { useEffect, useState } from "react";
import AgriVedaBrandMark from "@/components/brand/AgriVedaBrandMark";
import { BRAND } from "@/lib/brand";

const SPLASH_MS = 6400;
const EXIT_MS = 800;

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
      className={`fixed inset-0 z-[100000] flex flex-col items-center justify-center overflow-hidden bg-[#020617] ${
        exiting ? "agriveda-splash--exit" : "agriveda-splash"
      }`}
    >
      {/* Futuristic Atmosphere Glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(16,185,129,0.15) 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full opacity-30 blur-[100px]"
        style={{
          background: "rgba(56, 189, 248, 0.2)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/4 h-96 w-96 rounded-full opacity-20 blur-[120px]"
        style={{
          background: "rgba(16, 185, 129, 0.2)",
        }}
      />
      
      {/* Tech Grid Pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="agriveda-splash__brand relative z-10 flex flex-col items-center px-6 text-center">
        {/* Futuristic Logo Container */}
        <div className="agriveda-splash__logo relative mb-8">
          {/* Animated Cyber Rings */}
          <div
            aria-hidden
            className="agriveda-splash__ring-outer absolute left-1/2 top-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-[40px] border border-emerald-500/20"
          />
          <div
            aria-hidden
            className="agriveda-splash__ring-inner absolute left-1/2 top-1/2 h-[152px] w-[152px] -translate-x-1/2 -translate-y-1/2 rounded-[36px]"
            style={{
              background: "conic-gradient(from 180deg, rgba(16,185,129,0) 0%, rgba(16,185,129,0.5) 50%, rgba(56,189,248,0.8) 100%)",
            }}
          />
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[146px] w-[146px] -translate-x-1/2 -translate-y-1/2 rounded-[34px] bg-[#020617]"
          />
          
          <AgriVedaBrandMark
            sizeClassName="relative h-[120px] w-[120px] rounded-[30px] shadow-[0_0_40px_rgba(16,185,129,0.3)] bg-gradient-to-br from-slate-900 to-black border border-white/10"
            iconClassName="h-16 w-16"
          />
        </div>

        <h1 className="m-0 font-display text-[clamp(2.2rem,9vw,3rem)] font-extrabold leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-sky-400 drop-shadow-sm">
          {BRAND}
        </h1>
        <p className="mt-3 text-[12px] font-bold tracking-[0.3em] text-slate-400/80 uppercase">
          Digital Farmers
        </p>

        {/* Tech Line Decorator */}
        <div aria-hidden className="mt-6 flex items-center gap-3">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-500/50" />
          <div className="h-1.5 w-1.5 rotate-45 border border-emerald-400 bg-transparent shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-emerald-500/50" />
        </div>

        <div className="mt-6 inline-flex max-w-[min(92vw,340px)] items-center justify-center rounded-2xl border border-white/5 bg-white/5 px-6 py-3 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <span className="text-[13px] font-bold leading-none text-emerald-50 sm:text-[14px]">
            स्मार्ट खेती, बेहतर फसल
          </span>
        </div>
      </div>

      <div className="absolute bottom-[max(2.8rem,env(safe-area-inset-bottom))] z-10 flex flex-col items-center gap-4">
        {/* Futuristic Spinner */}
        <div className="relative flex h-10 w-10 items-center justify-center">
          <div className="agriveda-splash__spinner-track absolute inset-0 rounded-full border-2 border-slate-800" />
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
