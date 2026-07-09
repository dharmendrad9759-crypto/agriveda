"use client";

import { ChevronRight, AlertTriangle } from "lucide-react";
import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import RiskBadge from "@/components/shell/RiskBadge";
import AppLink from "@/components/ui/AppLink";
import MotionCard from "@/components/motion/MotionCard";
import { AV } from "@/lib/design/tokens";
import {
  CROP_TASKS_DUE,
  CROP_STAGE_ALERTS,
  CROP_RECOMMENDED_VARIETIES,
  CROP_EXPERT_TIP,
  CROP_IRRIGATION_SUMMARY,
  CROP_PEST_RISK,
  CROP_DISEASE_RISK,
} from "@/data/mock/crop-overview";
import type { Crop } from "@/types/crop";
import type { CropTabId } from "@/lib/crops/crop-tabs";
import type { EnrichedCropDetail } from "@/types/crop-detail";

function MiniStat({ label, value, index }: { label: string; value: string; index: number }) {
  return (
    <MotionCard delay={index} className="av-card min-h-[72px] px-3 py-2.5">
      <p className={AV.label}>{label}</p>
      <p className="mt-1 text-sm font-semibold text-[var(--av-text-primary)] break-words">{value}</p>
    </MotionCard>
  );
}

interface CropOverviewSectionProps {
  crop: Crop;
  detail: EnrichedCropDetail;
  onTabChange: (tab: CropTabId) => void;
}

export default function CropOverviewSection({ crop, detail, onTabChange }: CropOverviewSectionProps) {
  const topDiseases = detail.diseases.slice(0, 3);
  const topPests = detail.pests.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MiniStat label="Duration" value={crop.durationDays} index={0} />
        <MiniStat label="Yield" value={crop.estimatedYield} index={1} />
        <MiniStat label="Soil" value={crop.suitableSoil} index={2} />
        <MiniStat label="Season" value={crop.suitableSeason} index={3} />
        <MiniStat label="Seed Rate" value={crop.seedRate} index={4} />
        <MiniStat label="Spacing" value={crop.spacing} index={5} />
        <MiniStat label="Climate" value={crop.climate} index={6} />
        <MiniStat label="Sowing" value={crop.sowingGuide.bestSowingTime} index={7} />
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <DarkCard className="lg:col-span-4" delay={0}>
          <SectionHeader title="Tasks Due" action={{ label: "Calendar", href: "/crop-calendar" }} />
          <ul className="mt-3 space-y-2">
            {CROP_TASKS_DUE.map((t) => (
              <li key={t.id} className="av-card-inset">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-[var(--av-text-primary)]">{t.task}</p>
                  <RiskBadge level={t.priority} label={t.priority} />
                </div>
                <p className={`mt-1 ${AV.micro}`}>{t.due}</p>
              </li>
            ))}
          </ul>
        </DarkCard>

        <DarkCard className="lg:col-span-4" delay={1}>
          <SectionHeader title="Pest & Disease Risk" />
          <div className="mt-3 space-y-3">
            <button type="button" onClick={() => onTabChange("pests")} className="av-card-inset flex w-full items-center justify-between text-left">
              <div>
                <p className={AV.label}>Pest risk</p>
                <p className="text-sm font-semibold text-[var(--av-text-primary)]">{CROP_PEST_RISK.top}</p>
              </div>
              <RiskBadge level={CROP_PEST_RISK.level} />
            </button>
            <button type="button" onClick={() => onTabChange("diseases")} className="av-card-inset flex w-full items-center justify-between text-left">
              <div>
                <p className={AV.label}>Disease risk</p>
                <p className="text-sm font-semibold text-[var(--av-text-primary)]">{CROP_DISEASE_RISK.top}</p>
              </div>
              <RiskBadge level={CROP_DISEASE_RISK.level} />
            </button>
          </div>
        </DarkCard>

        <DarkCard className="lg:col-span-4" delay={2}>
          <SectionHeader title="Irrigation" />
          <div className="mt-3 space-y-2 text-sm">
            <p className="flex justify-between">
              <span className={AV.micro}>Frequency</span>
              <span className="font-semibold text-[var(--av-text-primary)]">{CROP_IRRIGATION_SUMMARY.frequency}</span>
            </p>
            <p className="flex justify-between">
              <span className={AV.micro}>Next due</span>
              <span className="font-semibold text-[var(--av-accent)]">{CROP_IRRIGATION_SUMMARY.nextDue}</span>
            </p>
            <button type="button" onClick={() => onTabChange("irrigation")} className={`mt-2 w-full text-left text-xs text-[var(--av-accent)]`}>
              Full irrigation guide →
            </button>
          </div>
        </DarkCard>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <DarkCard delay={1}>
          <SectionHeader title="Top Diseases" />
          <ul className="mt-2 space-y-2 text-xs">
            {topDiseases.map((d, i) => (
              <li key={d.name} className="flex justify-between">
                <span className="text-[var(--av-text-secondary)]">{d.name}</span>
                <RiskBadge level={i === 0 ? "high" : "medium"} />
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => onTabChange("diseases")} className="mt-3 text-[10px] font-bold text-[var(--av-accent)]">
            View all diseases →
          </button>
        </DarkCard>

        <DarkCard delay={2}>
          <SectionHeader title="Top Pests" />
          <ul className="mt-2 space-y-2 text-xs">
            {topPests.map((p, i) => (
              <li key={p.name} className="flex justify-between">
                <span className="text-[var(--av-text-secondary)]">{p.name}</span>
                <RiskBadge level={i < 2 ? "high" : "low"} />
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => onTabChange("pests")} className="mt-3 text-[10px] font-bold text-[var(--av-accent)]">
            View all pests →
          </button>
        </DarkCard>

        <DarkCard delay={3}>
          <SectionHeader title="Recommended Varieties" />
          <ul className="mt-2 space-y-2">
            {CROP_RECOMMENDED_VARIETIES.map((v) => (
              <li key={v.name} className="av-card-inset">
                <p className="text-xs font-semibold text-[var(--av-text-primary)]">{v.name}</p>
                <p className={AV.micro}>{v.trait}</p>
              </li>
            ))}
          </ul>
        </DarkCard>
      </div>

      <DarkCard delay={2}>
        <SectionHeader title="Stage-wise Alerts" />
        <ul className="mt-3 space-y-2">
          {CROP_STAGE_ALERTS.map((a) => (
            <li key={a.id} className="av-card-inset flex gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-[var(--av-text-primary)]">{a.stage}</p>
                  <RiskBadge level={a.level} />
                </div>
                <p className={`mt-0.5 ${AV.micro}`}>{a.alert}</p>
              </div>
            </li>
          ))}
        </ul>
      </DarkCard>

      <DarkCard delay={3}>
        <SectionHeader title="Expert Tip" action={CROP_EXPERT_TIP.action} />
        <p className={`mt-2 ${AV.body}`}>{CROP_EXPERT_TIP.tip}</p>
      </DarkCard>

      <DarkCard delay={4}>
        <div className="flex items-center justify-between">
          <SectionHeader title="Growth Stages" />
          <button type="button" onClick={() => onTabChange("growth")} className={AV.link}>
            Full timeline →
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-3 overflow-x-auto scrollbar-hide">
          {detail.growthStages.map((stage, i) => (
            <div key={stage.title} className="av-card-inset min-w-[100px] shrink-0 text-center">
              <p className="text-[10px] font-bold text-[var(--av-accent)]">{stage.period}</p>
              <p className="mt-1 text-[10px] font-semibold text-[var(--av-text-primary)]">{stage.title}</p>
              {i === 2 && (
                <span className="mt-1 inline-block rounded bg-[var(--av-accent-soft)] px-1.5 py-0.5 text-[8px] font-bold text-[var(--av-accent)]">
                  Current
                </span>
              )}
            </div>
          ))}
        </div>
      </DarkCard>

      <div className="flex flex-wrap gap-2">
        <AppLink href={`/pest-diseases?crop=${crop.slug}`} className={`${AV.btnSecondarySm}`}>
          Spray guide <ChevronRight className="h-3 w-3" />
        </AppLink>
        <AppLink href="/ai-doctor" className={AV.btnPrimarySm}>
          AI Doctor
        </AppLink>
      </div>
    </div>
  );
}
