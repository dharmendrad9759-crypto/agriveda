"use client";

import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import { CROP_RECOMMENDED_VARIETIES } from "@/data/mock/crop-overview";
import type { Crop } from "@/types/crop";

export default function CropVarietiesSection({ crop }: { crop: Crop }) {
  return (
    <div className="space-y-4">
      <DarkCard>
        <SectionHeader
          title="Recommended Varieties"
        />
        <p className="mt-1 text-xs text-[var(--av-text-muted)]">
          {crop.name} — high-performing cultivars for Indian conditions
        </p>
        <div className="mt-4 space-y-3">
          {CROP_RECOMMENDED_VARIETIES.map((v) => (
            <div
              key={v.name}
              className="crop-premium-inset border-emerald-500/15 bg-gradient-to-r from-emerald-500/5 to-transparent"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-[var(--av-text-primary)]">{v.name}</p>
                <span className="crop-premium-badge crop-premium-badge-muted shrink-0">{v.season}</span>
              </div>
              <p className="mt-1 text-xs text-[var(--av-text-secondary)]">{v.trait}</p>
            </div>
          ))}
        </div>
      </DarkCard>
    </div>
  );
}
