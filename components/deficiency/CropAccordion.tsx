"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { CropSpecificDeficiencyData } from "@/types/deficiency";
import { cropLabelToImageSlug } from "@/lib/nutrients/deficiencyImages";
import DeficiencySymptomImage from "@/components/nutrients/DeficiencySymptomImage";

export default function CropAccordion({
  crops,
  nutrientSlug,
}: {
  crops: CropSpecificDeficiencyData[];
  nutrientSlug?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {crops.map((crop, index) => {
        const isOpen = openIndex === index;
        const imgSlug = cropLabelToImageSlug(crop.cropName);
        return (
          <div
            key={crop.cropName}
            className="overflow-hidden rounded-2xl border border-emerald-500/15 bg-emerald-500/5"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-2 px-3 py-3 text-left"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-emerald-500/10">
                  <DeficiencySymptomImage
                    cropSlug={imgSlug}
                    nutrient={nutrientSlug || "nitrogen"}
                    alt={crop.cropName}
                  />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold theme-text-primary">{crop.cropName}</p>
                  <p className="text-[11px] theme-text-muted">{crop.stage}</p>
                </div>
              </div>
              <ChevronDown
                className={`h-4 w-4 shrink-0 theme-text-muted transition ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isOpen && (
              <div className="space-y-2 border-t border-emerald-500/10 px-3 py-3 text-xs theme-text-muted">
                {nutrientSlug ? (
                  <div className="relative mb-2 aspect-[16/9] overflow-hidden rounded-xl bg-emerald-500/5">
                    <DeficiencySymptomImage
                      cropSlug={imgSlug}
                      nutrient={nutrientSlug}
                      alt={`${crop.cropName} deficiency`}
                    />
                  </div>
                ) : null}
                {crop.notes && (
                  <p>
                    <span className="font-bold theme-text-primary">Note: </span>
                    {crop.notes}
                  </p>
                )}
                {crop.symptoms?.length > 0 && (
                  <p>
                    <span className="font-bold theme-text-primary">Symptoms: </span>
                    {crop.symptoms.join("; ")}
                  </p>
                )}
                {crop.correction && (
                  <p>
                    <span className="font-bold theme-text-primary">Fix: </span>
                    {crop.correction}
                  </p>
                )}
                {crop.prevention && (
                  <p>
                    <span className="font-bold theme-text-primary">Prevent: </span>
                    {crop.prevention}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
