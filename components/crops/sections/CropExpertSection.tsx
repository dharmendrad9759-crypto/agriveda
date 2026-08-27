"use client";

import Link from "next/link";
import { Lightbulb, Sparkles, Zap } from "lucide-react";
import DarkCard from "@/components/shell/DarkCard";
import CropCollapsible from "@/components/crops/CropCollapsible";
import { getCropDashboard } from "@/data/crop-dashboard";
import { getCropExpertTip, getCropStageAlerts } from "@/lib/crops/cropAgroMeta";
import { getCropHindiName } from "@/lib/crops/crop-display";
import {
  simplifyExpertTipHi,
  toFarmerExpertTips,
} from "@/lib/crops/simplifyExpertTipHi";
import { AV } from "@/lib/design/tokens";
import type { Crop } from "@/types/crop";

export default function CropExpertSection({ crop }: { crop: Crop }) {
  const dash = getCropDashboard(crop.slug);
  const pinned = getCropExpertTip(crop);
  const stageAlerts = getCropStageAlerts(crop);
  const cropLabel = getCropHindiName(crop.slug) || crop.name;

  const fieldTips = toFarmerExpertTips([
    ...(dash?.sowingGuide?.tips ?? []),
    ...(dash?.fertilizerSchedule?.tips ?? []),
    ...(dash?.irrigationManagement?.tips ?? []),
    crop.sowingGuide.seedTreatment,
    crop.sowingGuide.sowingMethod,
    ...(crop.fertilizerSchedule.micronutrients ?? []).slice(0, 2),
    ...(crop.irrigationManagement.schedule ?? []).slice(0, 2),
    ...crop.cropProtection.prevention.slice(0, 2),
  ]);

  const advice = (dash?.expertAdvice ?? []).slice(0, 3).map((a) => ({
    id: a.id,
    query: simplifyExpertTipHi(a.query),
    answer: simplifyExpertTipHi(a.answerPreview),
  }));

  return (
    <div className="space-y-3">
      <CropCollapsible title="विशेषज्ञ सलाह" defaultOpen>
        <DarkCard className="border-amber-500/25 bg-gradient-to-br from-amber-500/8 to-transparent !border-0 !bg-transparent !p-0 !shadow-none">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            <p className="text-[10px] font-bold tracking-wider text-amber-600 dark:text-amber-400">
              {cropLabel} — मुख्य सलाह
            </p>
          </div>
          <p className="mt-2 text-sm font-bold text-[var(--av-text-primary)]">
            {simplifyExpertTipHi(pinned.title)}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--av-text-secondary)]">
            {simplifyExpertTipHi(pinned.tip)}
          </p>
          {pinned.action && (
            <Link href={pinned.action.href} className={`mt-3 inline-flex ${AV.btnPrimarySm}`}>
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              {pinned.action.label}
            </Link>
          )}
        </DarkCard>
      </CropCollapsible>

      {stageAlerts.length > 0 && (
        <CropCollapsible title="अवस्था निगरानी" defaultOpen={false}>
          <p className="mb-3 text-xs text-[var(--av-text-muted)]">
            कीट, रोग और पानी के हिसाब से इस हफ्ते क्या देखें
          </p>
          <div className="space-y-3">
            {stageAlerts.map((a) => (
              <div
                key={a.id}
                className="crop-premium-inset border-amber-500/15 bg-gradient-to-r from-amber-500/5 to-transparent"
              >
                <p className="text-xs font-bold text-[var(--av-text-primary)]">{a.stage}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--av-text-secondary)]">
                  {simplifyExpertTipHi(a.alert)}
                </p>
              </div>
            ))}
          </div>
        </CropCollapsible>
      )}

      {fieldTips.length > 0 && (
        <CropCollapsible title="खेत की सलाह" defaultOpen={false}>
          <div className="space-y-3">
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
        </CropCollapsible>
      )}

      {advice.length > 0 && (
        <CropCollapsible title="आम खेत सवाल" defaultOpen={false}>
          <div className="space-y-2">
            {advice.map((a) => (
              <div key={a.id} className="crop-premium-inset">
                <p className="text-xs font-bold text-[var(--av-text-primary)]">{a.query}</p>
                <p className="mt-1 text-[11px] text-[var(--av-text-secondary)]">{a.answer}</p>
              </div>
            ))}
          </div>
        </CropCollapsible>
      )}
    </div>
  );
}
