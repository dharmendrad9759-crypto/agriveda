"use client";

import Link from "next/link";
import { Lightbulb, Sparkles, Zap } from "lucide-react";
import DarkCard from "@/components/shell/DarkCard";
import CropCollapsible from "@/components/crops/CropCollapsible";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropDashboard } from "@/data/crop-dashboard";
import { getCropExpertTip, getCropStageAlerts } from "@/lib/crops/cropAgroMeta";
import { AV } from "@/lib/design/tokens";
import type { Crop } from "@/types/crop";

export default function CropExpertSection({ crop }: { crop: Crop }) {
  const { t, locale } = useLocale();
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
    .map((tip) => (typeof tip === "string" ? tip.trim() : ""))
    .filter(Boolean)
    .filter((tip, i, arr) => arr.indexOf(tip) === i)
    .slice(0, 6);

  return (
    <div className="space-y-3">
      <CropCollapsible title={t("cropExpertTitle")} defaultOpen>
        <DarkCard className="border-amber-500/25 bg-gradient-to-br from-amber-500/8 to-transparent !border-0 !bg-transparent !p-0 !shadow-none">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              {crop.name} — {locale === "hi" ? "मुख्य टिप" : "pinned tip"}
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
      </CropCollapsible>

      {stageAlerts.length > 0 && (
        <CropCollapsible
          title={locale === "hi" ? "अवस्था निगरानी" : "Stage watch"}
          defaultOpen={false}
        >
          <p className="mb-3 text-xs text-[var(--av-text-muted)]">
            {locale === "hi"
              ? "कीट, रोग और पानी कैलेंडर से"
              : "Built from this crop's pest, disease and water calendar"}
          </p>
          <div className="space-y-3">
            {stageAlerts.map((a) => (
              <div
                key={a.id}
                className="crop-premium-inset border-amber-500/15 bg-gradient-to-r from-amber-500/5 to-transparent"
              >
                <p className="text-xs font-bold text-[var(--av-text-primary)]">{a.stage}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--av-text-secondary)]">{a.alert}</p>
              </div>
            ))}
          </div>
        </CropCollapsible>
      )}

      {fieldTips.length > 0 && (
        <CropCollapsible
          title={locale === "hi" ? "खेत के टिप्स" : "Field tips"}
          defaultOpen={false}
        >
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
        <CropCollapsible
          title={locale === "hi" ? "आम खेत सवाल" : "Common field questions"}
          defaultOpen={false}
        >
          <div className="space-y-2">
            {advice.slice(0, 3).map((a) => (
              <div key={a.id} className="crop-premium-inset">
                <p className="text-xs font-bold text-[var(--av-text-primary)]">{a.query}</p>
                <p className="mt-1 text-[11px] text-[var(--av-text-secondary)]">{a.answerPreview}</p>
              </div>
            ))}
          </div>
        </CropCollapsible>
      )}
    </div>
  );
}
