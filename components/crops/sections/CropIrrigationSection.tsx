"use client";

import ExpandablePanel, { TimingBadge } from "@/components/crops/ExpandablePanel";
import { DossierSourceBanner } from "@/components/crops/DossierSourceBanner";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropManagementProfile } from "@/data/crop-management";
import type { CropManagementWithDossier } from "@/types/crop-dossier";
import { Droplets, Sprout } from "lucide-react";
import type { Crop } from "@/types/crop";
import type { EnrichedCropDetail } from "@/types/crop-detail";
import { useMemo } from "react";

interface CropIrrigationSectionProps {
  crop: Crop;
  detail: EnrichedCropDetail;
  timingHint: string;
}

export default function CropIrrigationSection({
  crop,
  detail,
  timingHint,
}: CropIrrigationSectionProps) {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const profile = useMemo(
    () => getCropManagementProfile(crop.slug) as CropManagementWithDossier | null,
    [crop.slug]
  );
  const dossierLines = profile?.irrigationSchedule ?? [];
  const growthStages = profile?.growthStages?.length
    ? profile.growthStages
    : detail.growthStages ?? [];

  return (
    <div className="space-y-2">
      <DossierSourceBanner profile={profile} hi={hi} />
      <p className="av-card-inset text-xs text-[var(--av-text-secondary)]">
        {timingHint} — {hi ? "अवस्था के साथ दिन (DAS/DAT)" : "stage with days (DAS/DAT)"}
      </p>

      {dossierLines.length > 0 ? (
        <ExpandablePanel
          title={hi ? "रिसर्च सिंचाई गाइड" : "Research irrigation guide"}
          subtitle={hi ? `${dossierLines.length} बिंदु` : `${dossierLines.length} points`}
          icon={Droplets}
          accent="sky"
          defaultOpen
        >
          <ul className="space-y-2 text-sm text-[var(--av-text-primary)]">
            {dossierLines.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="text-[var(--av-accent)]">•</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </ExpandablePanel>
      ) : null}

      <ExpandablePanel
        title={hi ? "पानी की ज़रूरत" : "Water requirement"}
        subtitle={crop.irrigationManagement.waterRequirement}
        icon={Droplets}
        accent="sky"
        defaultOpen={!dossierLines.length}
      >
        <p className="text-sm text-[var(--av-text-primary)]">
          {crop.irrigationManagement.waterRequirement}
        </p>
        <p className="mt-2 text-xs text-[var(--av-text-secondary)]">
          {hi ? "कड़ी अवस्थाएँ" : "Critical stages"}:{" "}
          {crop.irrigationManagement.criticalStages.join(" · ")}
        </p>
        {crop.irrigationManagement.schedule?.length ? (
          <ul className="mt-2 space-y-1 text-xs text-[var(--av-text-secondary)]">
            {crop.irrigationManagement.schedule.map((s) => (
              <li key={s}>• {s}</li>
            ))}
          </ul>
        ) : null}
      </ExpandablePanel>

      {detail.irrigations.map((ir, i) => (
        <ExpandablePanel
          key={`${ir.label}-${i}`}
          title={`${ir.label} · ${ir.timing}`}
          subtitle={ir.amount}
          badge={ir.timingRef}
          icon={Droplets}
          accent="green"
          defaultOpen={i === 0 && !dossierLines.length}
        >
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <TimingBadge timing={ir.timing} ref={ir.timingRef} />
              <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[11px] font-bold text-sky-700 dark:text-sky-300">
                {hi ? "दिन" : "Days"}: {ir.timing}
              </span>
            </div>
            <p className="text-sm font-semibold text-[var(--av-text-primary)]">{ir.amount}</p>
            {ir.notes ? (
              <p className="text-xs text-[var(--av-text-secondary)]">{ir.notes}</p>
            ) : null}
          </div>
        </ExpandablePanel>
      ))}

      {growthStages.length ? (
        <ExpandablePanel
          title={hi ? "वृद्धि अवस्थाएँ" : "Growth stages"}
          icon={Sprout}
          accent="green"
        >
          <ul className="space-y-2 text-sm">
            {growthStages.map((s) => (
              <li key={`${s.title}-${s.period}`}>
                <p className="font-bold text-[var(--av-text-primary)]">
                  {s.title}{" "}
                  <span className="text-xs font-medium text-[var(--av-text-muted)]">({s.period})</span>
                </p>
                <p className="text-xs text-[var(--av-text-secondary)]">{s.keyPoints.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </ExpandablePanel>
      ) : null}

      <ExpandablePanel
        title={hi ? "कटाई और भंडारण" : "Harvest & storage"}
        icon={Sprout}
        accent="amber"
      >
        <ul className="space-y-1.5 text-sm text-[var(--av-text-primary)]">
          <li>• {crop.harvestAndYield.harvestingTime}</li>
          <li>
            • {hi ? "उपज" : "Yield"}: {crop.harvestAndYield.yield}
          </li>
          {crop.harvestAndYield.storageTips.map((tip) => (
            <li key={tip}>• {tip}</li>
          ))}
        </ul>
      </ExpandablePanel>
    </div>
  );
}
