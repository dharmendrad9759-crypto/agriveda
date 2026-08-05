"use client";

import AppLink from "@/components/ui/AppLink";
import type { EnrichedThreat } from "@/types/pest-disease-ui";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/types/pest-disease-ui";
import { threatDetailPath } from "@/lib/pest-disease-catalog";
import ThreatImage from "@/components/ui/ThreatImage";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { ChevronRight } from "lucide-react";

interface ThreatCardProps {
  threat: EnrichedThreat;
}

export default function ThreatCard({ threat }: ThreatCardProps) {
  const { locale } = useLocale();
  const href = threatDetailPath(threat.cropSlug, threat.type, threat.id);
  const isWeed = threat.type === "weed";
  const isHi = locale === "hi";

  const primary =
    isHi && threat.nameHi ? threat.nameHi : threat.name;
  const secondary =
    isHi && threat.nameHi
      ? threat.name
      : threat.scientificName || "";

  if (isWeed) {
    return (
      <AppLink
        href={href}
        className="relative flex min-h-[88px] overflow-hidden rounded-2xl border border-lime-500/20 shadow-[var(--av-shadow-sm)] active:scale-[0.99]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={threat.image || "/images/threats/threat-weed.jpg"}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
        <div className="relative z-10 flex flex-1 flex-col justify-end p-3.5">
          <p className="text-[15px] font-extrabold leading-snug text-white">{primary}</p>
          {secondary ? (
            <p className="mt-0.5 line-clamp-1 text-[11px] text-white/75">{secondary}</p>
          ) : null}
          <p className="mt-1 text-[10px] font-semibold text-lime-200">{threat.cropName}</p>
        </div>
        <ChevronRight className="relative z-10 m-3 h-5 w-5 shrink-0 self-center text-white/80" />
      </AppLink>
    );
  }

  return (
    <AppLink
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)] active:scale-[0.99]"
    >
      <ThreatImage
        src={threat.image}
        alt={primary}
        category={threat.category}
        className="h-40 w-full transition duration-300 group-hover:scale-[1.02] sm:h-44"
      />
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[14px] font-bold leading-snug text-[var(--av-text-primary)]">
            {primary}
          </p>
          <span
            className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[9px] font-bold ${CATEGORY_COLORS[threat.category]}`}
          >
            {CATEGORY_LABELS[threat.category]}
          </span>
        </div>
        {secondary ? (
          <p className="mt-0.5 line-clamp-1 text-[11px] text-[var(--av-text-muted)]">
            {secondary}
          </p>
        ) : null}
        <p className="mt-2 line-clamp-2 text-[12px] leading-snug text-[var(--av-text-secondary)]">
          {threat.description}
        </p>
        <span className="mt-2.5 inline-flex items-center gap-0.5 text-[12px] font-bold text-emerald-700 dark:text-emerald-300">
          देखो
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </AppLink>
  );
}
