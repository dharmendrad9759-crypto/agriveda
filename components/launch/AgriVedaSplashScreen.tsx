"use client";

import { useEffect, useState } from "react";
import AgriVedaBrandMark from "@/components/brand/AgriVedaBrandMark";
import { BRAND } from "@/lib/brand";

const SPLASH_MS = 3000;
const EXIT_MS = 450;

type Props = {
  onComplete: () => void;
  reducedMotion?: boolean;
};

/**
 * Launch splash — cream field, same Leaf logo as mobile topbar, Hindi tagline pill.
 */
export default function AgriVedaSplashScreen({ onComplete, reducedMotion = false }: Props) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const total = reducedMotion ? 900 : SPLASH_MS;
    const exitAt = Math.max(0, total - (reducedMotion ? 150 : EXIT_MS));
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
      className={`agriveda-splash fixed inset-0 z-[100000] flex flex-col items-center justify-center overflow-hidden ${
        exiting ? "agriveda-splash--exit" : ""
      }`}
      style={{
        background:
          "radial-gradient(ellipse at 50% 28%, #F8F9FA 0%, #F4F6F0 55%, #EEF2E8 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(0,168,107,0.10) 0%, transparent 52%)",
        }}
      />

      <div className="agriveda-splash__brand relative z-10 flex flex-col items-center px-6 text-center">
        <div className="agriveda-splash__logo mb-5">
          <AgriVedaBrandMark
            sizeClassName="h-[112px] w-[112px] rounded-[28px] shadow-[0_18px_40px_rgba(5,150,105,0.4)]"
            iconClassName="h-14 w-14"
          />
        </div>

        <h1 className="m-0 font-display text-[clamp(1.85rem,7vw,2.35rem)] font-extrabold tracking-tight text-[#1E4D40]">
          {BRAND}
        </h1>
        <p className="mt-1.5 text-[13px] font-semibold tracking-[0.14em] text-[#1E4D40]/55 uppercase">
          Digital Farmers
        </p>

        <div className="mt-5 inline-flex max-w-[min(92vw,320px)] items-center justify-center rounded-full bg-[#1E4D40] px-5 py-2.5 shadow-[0_10px_28px_-12px_rgba(30,77,64,0.55)]">
          <span className="text-[13px] font-semibold leading-none text-white sm:text-[14px]">
            स्मार्ट खेती, बेहतर फसल
          </span>
        </div>
      </div>

      <div className="absolute bottom-[max(2.25rem,env(safe-area-inset-bottom))] z-10 flex flex-col items-center gap-3">
        <div className="agriveda-splash__spinner" aria-hidden />
        <span className="text-[10px] font-semibold tracking-[0.18em] text-[#1E4D40]/35">
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
          animation: agriveda-splash-pop 0.95s cubic-bezier(0.34, 1.45, 0.64, 1) both;
        }
        .agriveda-splash__brand h1,
        .agriveda-splash__brand p,
        .agriveda-splash__brand div {
          animation: agriveda-splash-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .agriveda-splash__brand h1 { animation-delay: 0.18s; }
        .agriveda-splash__brand p { animation-delay: 0.28s; }
        .agriveda-splash__brand div { animation-delay: 0.38s; }
        .agriveda-splash__spinner {
          width: 28px;
          height: 28px;
          border-radius: 9999px;
          border: 2.5px solid rgba(30, 77, 64, 0.15);
          border-top-color: #00A86B;
          border-right-color: #1E4D40;
          animation: agriveda-splash-spin 0.85s linear infinite;
        }
        @keyframes agriveda-splash-pop {
          from { opacity: 0; transform: scale(0.72); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes agriveda-splash-rise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes agriveda-splash-spin {
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .agriveda-splash__logo,
          .agriveda-splash__brand h1,
          .agriveda-splash__brand p,
          .agriveda-splash__brand div {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .agriveda-splash__spinner {
            animation: agriveda-splash-pulse 1.2s ease-in-out infinite;
            border: none;
            background: #00A86B;
          }
          @keyframes agriveda-splash-pulse {
            0%, 100% { opacity: 0.35; transform: scale(0.85); }
            50% { opacity: 1; transform: scale(1); }
          }
        }
      `}</style>
    </div>
  );
}
