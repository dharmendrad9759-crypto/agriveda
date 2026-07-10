"use client";

import Link from "next/link";
import { Lightbulb, Sparkles, Zap } from "lucide-react";
import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import { getCropDashboard } from "@/data/crop-dashboard";
import { CROP_EXPERT_TIP } from "@/data/mock/crop-overview";
import { AV } from "@/lib/design/tokens";
import type { Crop } from "@/types/crop";

export default function CropExpertSection({ crop }: { crop: Crop }) {
  const dash = getCropDashboard(crop.slug);
  const advice = dash?.expertAdvice ?? [];
  const fieldTips = dash
    ? [
        ...(dash.sowingGuide?.tips ?? []),
        ...(dash.fertilizerSchedule?.tips ?? []),
        ...(dash.irrigationManagement?.tips ?? []),
      ].slice(0, 4)
    : [];

  return (
    <div className="space-y-4">
      <DarkCard className="border-amber-500/25 bg-gradient-to-br from-amber-500/8 to-transparent">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-500" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Pinned recommendation
          </p>
        </div>
        <p className="mt-2 text-sm font-bold text-[var(--av-text-primary)]">{CROP_EXPERT_TIP.title}</p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--av-text-secondary)]">{CROP_EXPERT_TIP.tip}</p>
        {CROP_EXPERT_TIP.action && (
          <Link href={CROP_EXPERT_TIP.action.href} className={`mt-3 inline-flex ${AV.btnPrimarySm}`}>
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            {CROP_EXPERT_TIP.action.label}
          </Link>
        )}
      </DarkCard>

      {fieldTips.length > 0 && (
        <DarkCard>
          <SectionHeader title="Expert Tips" />
          <p className="mt-1 text-xs text-[var(--av-text-muted)]">{crop.name} field intelligence</p>
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
          <SectionHeader title="Community Q&A" />
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
