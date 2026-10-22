"use client";

import type { Crop } from "@/types/crop";

type ThreatKind = "pests" | "diseases";

interface Props {
  crop: Crop;
  cropLabel: string;
  title: string;
  kind: ThreatKind;
  hi: boolean;
}

/**
 * Threat list hero — ultra-premium glassmorphic header with certified protection metadata
 */
export default function CropThreatPageHero({ crop, cropLabel, title, kind, hi }: Props) {
  const isDisease = kind === "diseases";

  return (
    <div className="relative mb-4 overflow-hidden rounded-2xl border border-emerald-950/20 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 p-4 text-white shadow-md">
      <div className="relative z-10 space-y-1">
        <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-lime-300/90">
          {isDisease
            ? hi
              ? "फसल रोग सुरक्षा"
              : "Disease Protection"
            : hi
              ? "कीट नियंत्रण"
              : "Pest Management"}
        </span>

        <h1 className="font-display text-xl font-black leading-tight tracking-tight text-white sm:text-2xl">
          {title}
        </h1>

        <p className="text-xs font-medium text-emerald-100/80">
          {hi
            ? "खेत में लक्षण पहचानें और सही समय पर दवा की सटीक मात्रा देखें"
            : "Identify symptoms in the field and see accurate spray doses"}
        </p>
      </div>
    </div>
  );
}
