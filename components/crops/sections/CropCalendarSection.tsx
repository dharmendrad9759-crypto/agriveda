"use client";

import { Calendar, CheckCircle2, Clock } from "lucide-react";
import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import RiskBadge from "@/components/shell/RiskBadge";
import AppLink from "@/components/ui/AppLink";
import { getCropStageAlerts, getCropTasksDue } from "@/lib/crops/cropAgroMeta";
import { AV } from "@/lib/design/tokens";
import type { Crop } from "@/types/crop";
import type { EnrichedCropDetail } from "@/types/crop-detail";

interface Props {
  crop: Crop;
  detail: EnrichedCropDetail;
}

export default function CropCalendarSection({ crop, detail }: Props) {
  const harvestStage = detail.growthStages[detail.growthStages.length - 1];
  const tasksDue = getCropTasksDue(crop);
  const stageAlerts = getCropStageAlerts(crop);

  return (
    <div className="space-y-4">
      <DarkCard className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--av-text-primary)]">Crop Calendar</p>
            <p className="text-xs text-[var(--av-text-muted)]">
              {crop.name} · {crop.durationDays}
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-[var(--av-text-secondary)]">
          Month-wise activities and reminders for your field schedule.
        </p>
        <AppLink href="/crop-calendar" className={`mt-3 inline-flex ${AV.btnPrimarySm}`}>
          Open full calendar
        </AppLink>
      </DarkCard>

      <DarkCard>
        <SectionHeader title="Upcoming Tasks" />
        <ul className="mt-3 space-y-2">
          {tasksDue.map((t) => (
            <li key={t.id} className="crop-premium-inset flex items-start justify-between gap-2">
              <div className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <div>
                  <p className="text-xs font-semibold text-[var(--av-text-primary)]">{t.task}</p>
                  <p className={`mt-0.5 ${AV.micro}`}>{t.due}</p>
                </div>
              </div>
              <RiskBadge level={t.priority} label={t.priority} />
            </li>
          ))}
        </ul>
      </DarkCard>

      <DarkCard>
        <SectionHeader title="Stage Alerts" />
        <ul className="mt-3 space-y-2">
          {stageAlerts.map((a) => (
            <li key={a.id} className="crop-premium-inset">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-[var(--av-text-primary)]">{a.stage}</p>
                <RiskBadge level={a.level} />
              </div>
              <p className="mt-1 text-xs text-[var(--av-text-secondary)]">{a.alert}</p>
            </li>
          ))}
        </ul>
      </DarkCard>

      {harvestStage && (
        <DarkCard className="border-amber-500/20">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Clock className="h-4 w-4" />
            <p className="text-xs font-bold uppercase tracking-wider">Harvest countdown</p>
          </div>
          <p className="mt-2 text-sm font-semibold text-[var(--av-text-primary)]">{harvestStage.title}</p>
          <p className="text-xs text-[var(--av-text-muted)]">{harvestStage.period}</p>
        </DarkCard>
      )}
    </div>
  );
}
