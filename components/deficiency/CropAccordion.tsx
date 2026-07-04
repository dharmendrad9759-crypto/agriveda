"use client";

import { useState } from "react";
import { ChevronDown, Sprout } from "lucide-react";
import type { CropSpecificDeficiencyData } from "@/types/deficiency";

export default function CropAccordion({ crops }: { crops: CropSpecificDeficiencyData[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {crops.map((crop, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={crop.cropName}
            className="overflow-hidden rounded-2xl border border-emerald-500/15 bg-emerald-500/5"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between px-3 py-3 text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
                  <Sprout className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold theme-text-primary">{crop.cropName}</p>
                  <p className="text-[11px] theme-text-muted">{crop.stage}</p>
                </div>
              </div>
              <ChevronDown
                className={`h-4 w-4 theme-text-muted transition ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isOpen && (
              <div className="space-y-2 border-t border-emerald-500/10 px-3 py-3 text-xs theme-text-muted">
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
