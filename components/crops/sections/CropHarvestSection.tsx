"use client";

import { Apple, Package, Sparkles } from "lucide-react";
import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import { cropHarvestLabel, harvestActionForCrop } from "@/lib/crops/harvestLabel";
import type { Crop } from "@/types/crop";

/** Farmer Hindi yield — q/acre → क्विंटल/एकड़ */
function yieldHi(raw: string): string {
  return raw
    .replace(/\bq\/acre\b/gi, "क्विंटल/एकड़")
    .replace(/\bqtl\/acre\b/gi, "क्विंटल/एकड़")
    .replace(/\bquintal(s)?\s*\/\s*acre\b/gi, "क्विंटल/एकड़")
    .replace(/\bt\/ha\b/gi, "टन/हेक्टर")
    .replace(/\bton(nes)?\/ha\b/gi, "टन/हेक्टर")
    .replace(/\bkg\/acre\b/gi, "किलो/एकड़")
    .replace(/\bacre\b/gi, "एकड़")
    .replace(/\bha\b/gi, "हेक्टर")
    .replace(/\s+/g, " ")
    .trim();
}

export default function CropHarvestSection({ crop }: { crop: Crop }) {
  const h = crop.harvestAndYield;
  const label = cropHarvestLabel(crop, true);
  const action = harvestActionForCrop(crop);
  const maturityHint =
    action === "pick"
      ? "जब ये दिखें — तुड़ाई का समय नज़दीक"
      : action === "dig"
        ? "जब ये दिखें — खुदाई का समय नज़दीक"
        : "जब ये दिखें — कटाई का समय नज़दीक";

  return (
    <div className="space-y-4">
      <DarkCard className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-500">
            <Apple className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--av-text-primary)]">
              {label} और उपज
            </p>
            <p className="text-xs text-[var(--av-text-muted)]">{h.harvestingTime}</p>
          </div>
        </div>
        <p className="mt-3 text-lg font-black text-emerald-600 dark:text-emerald-400">
          {yieldHi(h.yield)}
        </p>
      </DarkCard>

      <DarkCard>
        <SectionHeader title="पकने के लक्षण" />
        <p className="mt-1 text-xs text-[var(--av-text-muted)]">{maturityHint}</p>
        <ul className="mt-3 space-y-2">
          {h.maturitySigns.map((sign) => (
            <li key={sign} className="crop-premium-inset flex gap-2 text-xs text-[var(--av-text-primary)]">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
              {sign}
            </li>
          ))}
        </ul>
      </DarkCard>

      {h.storageTips?.length > 0 && (
        <DarkCard>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-cyan-500" />
            <SectionHeader title="भंडारण" />
          </div>
          <ul className="mt-3 space-y-2">
            {h.storageTips.map((s) => (
              <li key={s} className="crop-premium-inset text-xs text-[var(--av-text-secondary)]">
                {s}
              </li>
            ))}
          </ul>
        </DarkCard>
      )}
    </div>
  );
}
