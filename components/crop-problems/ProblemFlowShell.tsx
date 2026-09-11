"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

/** Premium problem-flow chrome — crop pick → problem → cure */
export default function ProblemFlowShell({
  children,
  title,
  step,
  totalSteps = 5,
  backHref = "/crop-problems",
  rightSlot,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  step: number;
  totalSteps?: number;
  backHref?: string;
  rightSlot?: ReactNode;
  subtitle?: string;
}) {
  const router = useRouter();
  const progress = Math.min(100, Math.round((step / totalSteps) * 100));

  return (
    <div className="relative mx-auto min-h-[100dvh] w-full max-w-lg overflow-hidden pb-28 text-[#0B1F16]">
      {/* Ambient field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(900px 420px at 10% -10%, rgba(16,185,129,0.18), transparent 55%), radial-gradient(700px 380px at 100% 0%, rgba(5,150,105,0.12), transparent 50%), linear-gradient(180deg, #ECFDF5 0%, #F8FAFC 38%, #F0FDF4 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(11,92,59,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(11,92,59,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "linear-gradient(180deg, black, transparent)",
        }}
      />

      <header className="sticky top-0 z-30 border-b border-emerald-900/8 bg-white/80 px-4 py-3.5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                router.back();
              } else {
                router.push(backHref);
              }
            }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-900/10 bg-white text-emerald-800 shadow-[0_8px_20px_-14px_rgba(4,120,87,0.55)] active:scale-95"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-emerald-600" />
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-700/85">
                AgriVeda · चरण {step}/{totalSteps}
              </p>
            </div>
            <h1 className="truncate font-display text-[1.2rem] font-bold leading-tight tracking-tight text-[#052e1c]">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-0.5 truncate text-[11px] font-semibold text-emerald-900/45">
                {subtitle}
              </p>
            ) : null}
          </div>
          {rightSlot}
        </div>

        <div className="mt-3.5">
          <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold text-emerald-900/40">
            <span>प्रगति</span>
            <span>{progress}%</span>
          </div>
          <div className="relative h-2 overflow-hidden rounded-full bg-emerald-900/8">
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 shadow-[0_0_16px_rgba(16,185,129,0.45)] transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <div className="relative px-4 pt-5">{children}</div>

      <div className="pointer-events-none fixed bottom-24 right-3 z-20 flex flex-col items-center sm:bottom-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/brand/kisan-saathi-mascot.png"
          alt=""
          className="h-14 w-14 object-contain drop-shadow-lg"
        />
        <span className="mt-0.5 rounded-full border border-emerald-900/10 bg-white/95 px-2 py-0.5 text-[9px] font-black text-emerald-800 shadow-sm">
          किसान का साथी
        </span>
      </div>
    </div>
  );
}

export function MockCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[22px] border border-emerald-900/10 bg-white/90 p-4 shadow-[0_16px_40px_-28px_rgba(4,120,87,0.45)] backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function MockTab({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-[44px] shrink-0 rounded-xl border px-3 text-[12px] font-black transition active:scale-[0.98]",
        active
          ? "border-emerald-700 bg-emerald-700 text-white shadow-md shadow-emerald-900/20"
          : "border-emerald-900/12 bg-white text-emerald-900 shadow-sm",
        className
      )}
    >
      {children}
    </button>
  );
}
