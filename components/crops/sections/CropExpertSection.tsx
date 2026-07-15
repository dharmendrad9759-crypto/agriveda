"use client";

import Link from "next/link";
import { Lightbulb, Sparkles, Zap } from "lucide-react";
import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import { getCropDashboard } from "@/data/crop-dashboard";
import { getCropExpertTip, getCropStageAlerts } from "@/lib/crops/cropAgroMeta";
import { AV } from "@/lib/design/tokens";
import type { Crop } from "@/types/crop";

export default function CropExpertSection({ crop }: { crop: Crop }) {
  const dash = getCropDashboard(crop.slug);
  const pinned = getCropExpertTip(crop);
  const stageAlerts = getCropStageAlerts(crop);
  const advice = dash?.expertAdvice ?? [];

  const fieldTips = [
    ...(dash?.sowingGuide?.tips ?? []),
    ...(dash?.fertilizerSchedule?.tips ?? []),
    ...(dash?.irrigationManagement?.tips ?? []),
    crop.sowingGuide.seedTreatment,
    crop.sowingGuide.sowingMethod,
    ...(crop.fertilizerSchedule.micronutrients ?? []).slice(0, 2),
    ...(crop.irrigationManagement.schedule ?? []).slice(0, 2),
    ...crop.cropProtection.prevention.slice(0, 2),
  ]
    .map((t) => (typeof t === "string" ? t.trim() : ""))
    .filter(Boolean)
    .filter((t, i, arr) => arr.indexOf(t) === i)
    .slice(0, 6);

  return (
    <div className="space-y-4">
      <DarkCard className="border-amber-500/25 bg-gradient-to-br from-amber-500/8 to-transparent">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-500" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            {crop.name} — pinned tip
          </p>
        </div>
        <p className="mt-2 text-sm font-bold text-[var(--av-text-primary)]">{pinned.title}</p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--av-text-secondary)]">{pinned.tip}</p>
        {pinned.action && (
          <Link href={pinned.action.href} className={`mt-3 inline-flex ${AV.btnPrimarySm}`}>
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            {pinned.action.label}
          </Link>
        )}
      </DarkCard>

      {stageAlerts.length > 0 && (
        <DarkCard>
          <SectionHeader title="Stage watch" />
          <p className="mt-1 text-xs text-[var(--av-text-muted)]">Built from this crop&apos;s pest, disease and water calendar</p>
          <div className="mt-4 space-y-3">
            {stageAlerts.map((a) => (
              <div key={a.id} className="crop-premium-inset border-amber-500/15 bg-gradient-to-r from-amber-500/5 to-transparent">
                <p className="text-xs font-bold text-[var(--av-text-primary)]">{a.stage}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--av-text-secondary)]">{a.alert}</p>
              </div>
            ))}
          </div>
        </DarkCard>
      )}

      {fieldTips.length > 0 && (
        <DarkCard>
          <SectionHeader title="Field tips" />
          <p className="mt-1 text-xs text-[var(--av-text-muted)]">{crop.name} practical checklist</p>
          <div className="mt-4 space-y-3">
            {fieldTips.map((tip) => (
              <div
                key={tip}
                className="crop-premium-inset border-amber-500/15 bg-gradient-to-r from-amber-500/5 to-transparent"
              >
                <div className="flex items-start gap-2">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <p className="text-xs leading-relaxed text-[var(--av-text-secondary)]">{tip}</p>
                </div>
              </div>
            ))}
          </div>
        </DarkCard>
      )}

      {advice.length > 0 && (
        <DarkCard>
          <SectionHeader title="Common field questions" />
          <div className="mt-3 space-y-2">
            {advice.slice(0, 3).map((a) => (
              <div key={a.id} className="crop-premium-inset">
                <p className="text-xs font-bold text-[var(--av-text-primary)]">{a.query}</p>
                <p className="mt-1 text-[11px] text-[var(--av-text-secondary)]">{a.answerPreview}</p>
              </div>
            ))}
          </div>
        </DarkCard>
      )}
    </div>
  );
}
