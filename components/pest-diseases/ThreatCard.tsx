"use client";

import AppLink from "@/components/ui/AppLink";
import type { EnrichedThreat } from "@/types/pest-disease-ui";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/types/pest-disease-ui";
import { threatDetailPath } from "@/lib/pest-disease-catalog";
import ThreatImage from "@/components/ui/ThreatImage";
import { useLocale } from "@/components/i18n/LocaleProvider";

interface ThreatCardProps {
  threat: EnrichedThreat;
}

export default function ThreatCard({ threat }: ThreatCardProps) {
  const { t, locale } = useLocale();
  const href = threatDetailPath(threat.cropSlug, threat.type, threat.id);
  const isWeed = threat.type === "weed";
  const weedPrimary =
    isWeed && locale === "hi" && threat.nameHi ? threat.nameHi : threat.name;
  const weedSecondary =
    isWeed && locale === "hi" && threat.nameHi
      ? `${threat.name}${threat.scientificName ? ` · ${threat.scientificName}` : ""}`
      : threat.scientificName;

  if (isWeed) {
    return (
      <AppLink
        href={href}
        className="av-card av-card-hover flex flex-col justify-center px-3 py-3"
      >
        <p className="text-base font-extrabold leading-snug text-[var(--av-text-primary)]">
          {weedPrimary}
        </p>
        {weedSecondary ? (
          <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)] line-clamp-1">
            {weedSecondary}
          </p>
        ) : null}
        <p className="mt-1 text-[10px] font-semibold text-[var(--av-accent)]">
          {threat.cropName}
        </p>
      </AppLink>
    );
  }

  return (
    <AppLink href={href} className="av-card av-card-hover flex flex-col overflow-hidden p-0">
      <ThreatImage
        src={threat.image}
        alt={threat.name}
        category={threat.category}
        className="h-32 w-full"
      />
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold leading-tight text-[var(--av-text-primary)]">{threat.name}</p>
          <span
            className={`flex-shrink-0 rounded-md border px-1.5 py-0.5 text-[8px] font-bold ${CATEGORY_COLORS[threat.category]}`}
          >
            {CATEGORY_LABELS[threat.category]}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-1 text-[10px] italic text-[var(--av-text-muted)]">
          {threat.scientificName}
        </p>
        <p className="mt-1.5 line-clamp-2 text-[10px] text-[var(--av-text-secondary)]">{threat.description}</p>
        <span className="mt-2 inline-block text-[10px] font-semibold text-[var(--av-accent)]">
          {t("viewDetails")} →
        </span>
      </div>
    </AppLink>
  );
}
