"use client";

import ExpandablePanel, { TimingBadge } from "@/components/crops/ExpandablePanel";
import { Droplets, Sprout } from "lucide-react";
import type { Crop } from "@/types/crop";
import type { EnrichedCropDetail } from "@/types/crop-detail";

interface CropIrrigationSectionProps {
  crop: Crop;
  detail: EnrichedCropDetail;
  timingHint: string;
}

export default function CropIrrigationSection({ crop, detail, timingHint }: CropIrrigationSectionProps) {
  return (
    <div className="space-y-2">
      <p className="av-card-inset text-xs text-[var(--av-text-secondary)]">
        {timingHint} — कितने दिन पर, कितनी सिंचाई
      </p>

      <ExpandablePanel
        title="Water Requirement"
        subtitle={crop.irrigationManagement.waterRequirement}
        icon={Droplets}
        accent="sky"
        defaultOpen
      >
        <p className="text-sm text-[var(--av-text-primary)]">{crop.irrigationManagement.waterRequirement}</p>
        <p className="mt-2 text-xs text-[var(--av-text-secondary)]">
          Critical stages: {crop.irrigationManagement.criticalStages.join(" · ")}
        </p>
      </ExpandablePanel>

      {detail.irrigations.map((ir, i) => (
        <ExpandablePanel
          key={`${ir.label}-${i}`}
          title={ir.label}
          subtitle={ir.amount}
          badge={ir.timingRef}
          icon={Droplets}
          accent="green"
        >
          <div className="space-y-2">
            <TimingBadge timing={ir.timing} ref={ir.timingRef} />
            <p className="text-sm font-semibold text-[var(--av-text-primary)]">{ir.amount}</p>
            {ir.notes && <p className="text-xs text-[var(--av-text-secondary)]">{ir.notes}</p>}
          </div>
        </ExpandablePanel>
      ))}

      <ExpandablePanel title="Harvest & Storage" icon={Sprout} accent="amber">
        <ul className="space-y-1.5 text-sm text-[var(--av-text-primary)]">
          <li>• {crop.harvestAndYield.harvestingTime}</li>
          <li>• Yield: {crop.harvestAndYield.yield}</li>
          {crop.harvestAndYield.storageTips.map((t) => (
            <li key={t}>• {t}</li>
          ))}
        </ul>
      </ExpandablePanel>
    </div>
  );
}
