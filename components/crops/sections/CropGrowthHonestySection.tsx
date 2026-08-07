"use client";

import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import { getPaddyGrowthHonesty } from "@/data/crops/paddyGrowthHonesty";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { AlertTriangle, Droplets, Sprout } from "lucide-react";

const ICONS = [Sprout, AlertTriangle, Droplets] as const;

/** Compact tillering / tonic honesty for paddy — growth tab + optional overview */
export default function CropGrowthHonestySection({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const data = getPaddyGrowthHonesty();
  const blocks = compact ? data.blocks.slice(0, 2) : data.blocks;

  return (
    <div className="space-y-3">
      <DarkCard className="border-amber-500/25 bg-amber-500/5">
        <SectionHeader title={hi ? data.headlineHi : data.headlineEn} />
        <p className="mt-1 text-xs text-[var(--av-text-muted)]">
          {hi ? data.subHi : data.subEn}
        </p>
        <ul className={`mt-3 space-y-3 ${compact ? "" : "space-y-4"}`}>
          {blocks.map((b, i) => {
            const Icon = ICONS[i % ICONS.length]!;
            const title = hi ? b.titleHi : b.titleEn;
            const body = hi ? b.bodyHi : b.bodyEn;
            const bullets = hi ? b.bulletsHi : b.bulletsEn;
            return (
              <li
                key={b.id}
                className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2.5"
              >
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-extrabold text-[var(--av-text-primary)]">{title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--av-text-secondary)]">
                      {body}
                    </p>
                    {!compact && bullets && bullets.length > 0 ? (
                      <ul className="mt-2 space-y-1">
                        {bullets.map((line) => (
                          <li
                            key={line}
                            className="flex gap-1.5 text-[11px] text-[var(--av-text-muted)]"
                          >
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500/70" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        {compact ? (
          <p className="mt-2 text-[10px] font-semibold text-amber-800 dark:text-amber-200">
            {hi
              ? "पूरी बात वृद्धि टैब में — टॉनिक से पहले N, Zn, उथला पानी।"
              : "Full note on Growth tab — N, Zn, shallow water before tonics."}
          </p>
        ) : null}
      </DarkCard>
    </div>
  );
}
