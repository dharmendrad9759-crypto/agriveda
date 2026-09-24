"use client";

import AppLink from "@/components/ui/AppLink";
import ThreatImage from "@/components/ui/ThreatImage";
import { cn } from "@/lib/cn";
import { farmerThreatDisplayName } from "@/lib/crops/farmerThreatTitle";
import type { ThreatCategory } from "@/types/pest-disease-ui";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Marketing-forward pest/disease browse card — big tap, photo punch, clear Hindi.
 * Used across every crop's कीट / रोग list.
 */
export default function ThreatBrowseCard({
  index,
  title,
  scientific,
  image,
  href,
  riskChip,
  typeChip,
  tipLine,
  openHint,
  threatCategory = "insect",
  accent = "pest",
}: {
  index: number;
  title: string;
  scientific?: string;
  image: string;
  href: string;
  riskChip?: ReactNode;
  typeChip?: ReactNode;
  tipLine?: string;
  openHint: string;
  threatCategory?: ThreatCategory;
  accent?: "pest" | "disease";
}) {
  const names = farmerThreatDisplayName(title, scientific);
  const rail = accent === "disease" ? "bg-amber-500" : "bg-rose-500";

  return (
    <AppLink
      href={href}
      className={cn(
        "group relative flex min-h-[112px] w-full overflow-hidden rounded-[1.35rem] text-left",
        "border border-black/[0.06] bg-[var(--av-surface)]",
        "shadow-[0_14px_36px_-22px_rgba(8,40,24,0.55)]",
        "transition duration-300 active:scale-[0.985]",
        "hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-24px_rgba(8,40,24,0.65)]"
      )}
    >
      <span aria-hidden className={cn("absolute inset-y-0 left-0 w-[3px]", rail)} />

      <span className="relative z-10 flex min-w-0 flex-1 flex-col justify-center gap-1 px-3.5 py-3.5 pl-4">
        <span className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-lg bg-emerald-950 px-1.5 text-[10px] font-black text-emerald-100">
            {String(index).padStart(2, "0")}
          </span>
          {riskChip}
          {typeChip}
        </span>

        <span className="font-display line-clamp-2 text-[1.05rem] font-bold leading-[1.15] tracking-tight text-[var(--av-text-primary)]">
          {names.primary}
        </span>
        {names.english ? (
          <span className="line-clamp-1 text-[12px] font-semibold text-[var(--av-text-secondary)]">
            {names.english}
          </span>
        ) : null}
        {scientific ? (
          <span className="line-clamp-1 text-[10px] italic text-[var(--av-text-muted)]">
            {scientific}
          </span>
        ) : null}
        {tipLine ? (
          <span className="mt-0.5 line-clamp-2 text-[11px] font-semibold leading-snug text-emerald-800 dark:text-emerald-300">
            {tipLine}
          </span>
        ) : null}
        <span className="mt-1 inline-flex items-center gap-1 text-[12px] font-bold text-emerald-900 dark:text-emerald-200">
          {openHint}
          <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </span>

      <span className="relative w-[36%] min-w-[104px] max-w-[148px] shrink-0 self-stretch overflow-hidden bg-[#eef6f0]">
        <ThreatImage
          src={image}
          alt={names.primary}
          category={threatCategory}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[var(--av-surface)] via-[var(--av-surface)]/70 to-transparent"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_70%_at_70%_40%,transparent_40%,rgba(0,0,0,0.18)_100%)]"
        />
      </span>
    </AppLink>
  );
}
