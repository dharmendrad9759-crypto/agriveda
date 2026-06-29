"use client";

import { useState } from "react";
import { ChevronDown, Sprout } from "lucide-react";
import type { CropSpecificDeficiencyData } from "@/types/deficiency";

export default function CropAccordion({ crops }: { crops: CropSpecificDeficiencyData[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {crops.map((crop, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={crop.cropName} className="overflow-hidden rounded-[24px] border border-white/10 bg-slate-900/70 shadow-inner">
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-500/10 text-emerald-300">
                  <Sprout className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">{crop.cropName}</p>
                  <p className="text-sm text-slate-400">{crop.stage}</p>
                </div>
              </div>
              <ChevronDown className={`h-5 w-5 text-slate-400 transition ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen ? (
              <div className="border-t border-white/10 bg-black/20 px-5 py-4 text-sm text-slate-300">
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Nutrient role</p>
                      <p className="mt-1 text-sm text-slate-200">{crop.notes}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Symptoms</p>
                      <p className="mt-1 text-sm text-slate-200">{crop.symptoms[0]}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Field trigger</p>
                      <p className="mt-1 text-sm text-slate-200">{crop.cause}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Correction</p>
                      <p className="mt-1 text-sm text-slate-200">{crop.correction}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Prevention</p>
                  <p className="mt-1">{crop.prevention}</p>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
