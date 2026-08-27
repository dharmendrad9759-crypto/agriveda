"use client";

import AppLink from "@/components/ui/AppLink";
import ThreatImage from "@/components/ui/ThreatImage";
import { cn } from "@/lib/cn";
import type { ThreatCategory } from "@/types/pest-disease-ui";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface FarmerSplitCardProps {
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  image: string;
  imageAlt?: string;
  /** Schemes/KCC dark green look */
  tone?: "dark" | "light";
  href?: string;
  onClick?: () => void;
  openHint?: string;
  threatCategory?: ThreatCategory | "crop";
  className?: string;
}

/**
 * Schemes-style split card: name left · photo right · soft blend in the middle.
 * Big tap target so farmers click without thinking.
 */
export default function FarmerSplitCard({
  title,
  subtitle,
  meta,
  image,
  imageAlt = "",
  tone = "light",
  href,
  onClick,
  openHint,
  threatCategory = "crop",
  className,
}: FarmerSplitCardProps) {
  const dark = tone === "dark";

  const inner = (
    <>
      <span
        className={cn(
          "relative z-10 flex min-w-0 flex-1 flex-col justify-center gap-0.5 px-3 py-3",
          dark ? "bg-emerald-950" : "bg-[var(--av-surface)]"
        )}
      >
        <span
          className={cn(
            "line-clamp-2 text-[14px] font-extrabold leading-snug",
            dark ? "text-white" : "text-[var(--av-text-primary)]"
          )}
        >
          {title}
        </span>
        {subtitle ? (
          <span
            className={cn(
              "line-clamp-2 text-[11px] font-medium leading-snug",
              dark ? "text-emerald-100/85" : "text-[var(--av-text-secondary)]"
            )}
          >
            {subtitle}
          </span>
        ) : null}
        {meta ? <span className="mt-0.5">{meta}</span> : null}
        {openHint ? (
          <span
            className={cn(
              "mt-1 inline-flex items-center gap-1 text-[11px] font-bold",
              dark ? "text-emerald-200" : "text-[#0B5C3B]"
            )}
          >
            {openHint}
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </span>
        ) : null}
      </span>

      <span className="relative w-[44%] min-w-[112px] max-w-[168px] shrink-0 self-stretch overflow-hidden bg-[#EAF7EF]">
        <ThreatImage
          src={image}
          alt={imageAlt || title}
          category={threatCategory}
          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 w-11 bg-gradient-to-r to-transparent",
            dark
              ? "from-emerald-950 via-emerald-950/55"
              : "from-[var(--av-surface)] via-[var(--av-surface)]/70"
          )}
        />
      </span>
    </>
  );

  const shell = cn(
    "group relative flex min-h-[92px] w-full overflow-hidden rounded-2xl text-left transition active:scale-[0.99]",
    dark
      ? "border border-emerald-800/20 bg-emerald-950 shadow-md shadow-emerald-900/20"
      : "border border-[#D8E8DE] bg-[var(--av-surface)] shadow-[0_8px_22px_-14px_rgba(11,92,59,0.4)]",
    className
  );

  if (href) {
    return (
      <AppLink href={href} className={shell}>
        {inner}
      </AppLink>
    );
  }

  return (
    <button type="button" onClick={onClick} className={shell}>
      {inner}
    </button>
  );
}
