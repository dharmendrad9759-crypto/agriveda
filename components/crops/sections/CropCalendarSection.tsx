"use client";

import { Calendar, CheckCircle2, Clock } from "lucide-react";
import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import RiskBadge from "@/components/shell/RiskBadge";
import AppLink from "@/components/ui/AppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { isHindiLocale } from "@/lib/i18n/farmer-ui";
import { riskLabelHi, stageLabelHi } from "@/lib/i18n/farmer-display";
import { getCropStageAlerts, getCropTasksDue } from "@/lib/crops/cropAgroMeta";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { AV } from "@/lib/design/tokens";
import type { Crop } from "@/types/crop";
import type { EnrichedCropDetail } from "@/types/crop-detail";

interface Props {
  crop: Crop;
  detail: EnrichedCropDetail;
}

export default function CropCalendarSection({ crop, detail }: Props) {
  const { t, locale } = useLocale();
  const hi = isHindiLocale(locale);
  const cropLabel = (hi && getCropHindiName(crop.slug)) || crop.name;
  const harvestStage = detail.growthStages[detail.growthStages.length - 1];
  const tasksDue = getCropTasksDue(crop);
  const stageAlerts = getCropStageAlerts(crop);

  const stageName = (name: string) => (hi ? stageLabelHi(name) : name);

  return (
    <div className="space-y-3.5">
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-600/30 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 p-4 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-emerald-300">
            <Calendar className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg font-black leading-tight text-white">
              {hi ? `${cropLabel} — इस हफ्ते का मुख्य काम` : `${cropLabel} — This Week's Work`}
            </h1>
            <p className="mt-0.5 text-xs text-emerald-100/80">
              {hi
                ? `फसल अवधि: ${crop.durationDays} · सही समय पर काम करने से पैदावार बढ़ती है`
                : `Duration: ${crop.durationDays} · Timely action protects yield`}
            </p>
          </div>
        </div>

        <div className="mt-3 border-t border-white/10 pt-2.5">
          <AppLink
            href="/crop-calendar"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/30 active:scale-95"
          >
            <span>{hi ? "पूरा फसल कैलेंडर देखें →" : "View full crop calendar →"}</span>
          </AppLink>
        </div>
      </div>

      {/* Actionable Tasks List */}
      <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[14px] font-black text-[var(--av-text-primary)]">
            {hi ? "प्राथमिकता वाले काम" : "Priority Tasks"}
          </h2>
          <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
            {tasksDue.length} {hi ? "कार्य" : "Tasks"}
          </span>
        </div>

        <ul className="space-y-2">
          {tasksDue.map((task, i) => (
            <li
              key={task.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-[var(--av-border-subtle)] bg-[var(--av-surface-inset)] p-3 transition hover:border-emerald-500/30"
            >
              <div className="flex gap-2.5 min-w-0 flex-1">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white mt-0.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold leading-snug text-[var(--av-text-primary)]">
                    {task.task}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-[var(--av-text-muted)]">
                    ⏰ {task.due}
                  </p>
                </div>
              </div>
              <RiskBadge level={task.priority} label={hi ? riskLabelHi(task.priority) : undefined} />
            </li>
          ))}
        </ul>
      </div>

      {/* Stage Alerts */}
      {stageAlerts.length > 0 ? (
        <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-sm">
          <div className="mb-2.5">
            <h2 className="text-[14px] font-black text-[var(--av-text-primary)]">
              {hi ? "फसल अवस्था व अलर्ट" : "Growth Stage Alerts"}
            </h2>
            <p className="text-[11px] text-[var(--av-text-muted)]">
              {hi ? "अवस्था के अनुसार इन बातों का विशेष ध्यान रखें" : "Critical points for current stage"}
            </p>
          </div>

          <ul className="space-y-2">
            {stageAlerts.map((a) => (
              <li key={a.id} className="rounded-xl border border-[var(--av-border-subtle)] bg-[var(--av-surface-inset)] p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[13px] font-bold text-[var(--av-text-primary)]">{stageName(a.stage)}</p>
                  <RiskBadge level={a.level} label={hi ? riskLabelHi(a.level) : undefined} />
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-[var(--av-text-secondary)]">{a.alert}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Harvest Countdown */}
      {harvestStage && (
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-3.5 dark:bg-amber-950/20">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
            <Clock className="h-4 w-4" />
            <p className="text-xs font-black uppercase tracking-wider">
              {hi ? "पकने और कटाई की अवस्था" : "Harvest Stage"}
            </p>
          </div>
          <p className="mt-1.5 text-sm font-bold text-[var(--av-text-primary)]">
            {stageName(harvestStage.title)}
          </p>
          <p className="text-xs text-[var(--av-text-muted)]">{harvestStage.period}</p>
        </div>
      )}
    </div>
  );
}
