"use client";

import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import { cn } from "@/lib/cn";

/** Forced light mockup skin — matches ChatGPT AgriVeda problem-flow design */
export default function ProblemFlowShell({
  children,
  title,
  step,
  totalSteps = 5,
  backHref = "/crop-problems",
  rightSlot,
}: {
  children: ReactNode;
  title: string;
  step: number;
  totalSteps?: number;
  backHref?: string;
  rightSlot?: ReactNode;
}) {
  return (
    <div
      className="mx-auto min-h-[100dvh] w-full max-w-lg pb-28"
      style={{
        background: "linear-gradient(180deg, #F3F8F4 0%, #FFFFFF 42%, #F7FAF8 100%)",
        color: "#0F1F17",
      }}
    >
      <header
        className="sticky top-0 z-30 border-b border-[#D8E8DE] px-4 py-3"
        style={{ background: "rgba(255,255,255,0.94)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-3">
          <AppLink
            href={backHref}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#C5DDD0] bg-white text-[#0B5C3B] shadow-sm active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" />
          </AppLink>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#2F9E63]">
              Agriveda · चरण {step}/{totalSteps}
            </p>
            <h1 className="truncate text-[1.15rem] font-black leading-tight text-[#0B3D28]">
              {title}
            </h1>
          </div>
          {rightSlot}
        </div>
        <div className="mt-3 flex gap-1.5">
          {Array.from({ length: totalSteps }, (_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                i < step ? "bg-[#16A34A]" : "bg-[#D7E8DC]"
              )}
            />
          ))}
        </div>
      </header>
      <div className="px-4 pt-4">{children}</div>

      <div className="pointer-events-none fixed bottom-24 right-3 z-20 flex flex-col items-center sm:bottom-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/brand/kisan-saathi-mascot.png"
          alt=""
          className="h-16 w-16 object-contain drop-shadow-md"
        />
        <span className="mt-0.5 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-black text-[#0B5C3B] shadow">
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
        "rounded-[18px] border border-[#D8E8DE] bg-white p-3.5 shadow-[0_8px_24px_-16px_rgba(11,92,59,0.35)]",
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
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-[42px] shrink-0 rounded-full px-3.5 text-[12px] font-extrabold transition",
        active
          ? "bg-[#0B5C3B] text-white shadow-md shadow-emerald-900/20"
          : "bg-[#E8F5EE] text-[#0B5C3B]"
      )}
    >
      {children}
    </button>
  );
}
