"use client";

import ExpandablePanel, { TimingBadge } from "@/components/crops/ExpandablePanel";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { Droplets, Sprout } from "lucide-react";
import type { Crop } from "@/types/crop";
import type { EnrichedCropDetail } from "@/types/crop-detail";

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

  return (
    <div className="space-y-2">
      <p className="av-card-inset text-xs text-[var(--av-text-secondary)]">
        {timingHint} — {hi ? "अवस्था के साथ दिन (DAS/DAT)" : "stage with days (DAS/DAT)"}
      </p>

      <ExpandablePanel
        title={hi ? "पानी की ज़रूरत" : "Water requirement"}
        subtitle={crop.irrigationManagement.waterRequirement}
        icon={Droplets}
        accent="sky"
        defaultOpen
      >
        <p className="text-sm text-[var(--av-text-primary)]">
          {crop.irrigationManagement.waterRequirement}
        </p>
        <p className="mt-2 text-xs text-[var(--av-text-secondary)]">
          {hi ? "कड़ी अवस्थाएँ" : "Critical stages"}:{" "}
          {crop.irrigationManagement.criticalStages.join(" · ")}
        </p>
      </ExpandablePanel>

      {detail.irrigations.map((ir, i) => (
        <ExpandablePanel
          key={`${ir.label}-${i}`}
          title={`${ir.label} · ${ir.timing}`}
          subtitle={ir.amount}
          badge={ir.timingRef}
          icon={Droplets}
          accent="green"
          defaultOpen={i === 0}
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
