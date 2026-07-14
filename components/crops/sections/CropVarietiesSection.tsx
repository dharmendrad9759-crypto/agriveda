"use client";

import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import { getVarietiesForCrop } from "@/lib/crops/cropVarieties";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import type { Crop } from "@/types/crop";
import { MapPin, TrendingUp } from "lucide-react";

export default function CropVarietiesSection({ crop }: { crop: Crop }) {
  const { profile } = useFarmerProfile();
  const state = profile.state.trim() || undefined;
  const district = profile.district.trim();
  const varieties = getVarietiesForCrop(crop.slug, state);
  const topForState = state
    ? varieties.filter((v) => v.states.some((s) => s.toLowerCase() === state.toLowerCase()))
    : [];

  return (
    <div className="space-y-3">
      {(state || district) && (
        <DarkCard className="border-emerald-500/20 bg-emerald-500/5">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
            <MapPin className="h-3.5 w-3.5" />
            Market pick for {[district, state].filter(Boolean).join(", ") || "your area"}
          </p>
          <p className="mt-1 text-xs text-[var(--av-text-muted)]">
            {topForState.length
              ? `Top selling / preferred: ${topForState
                  .slice(0, 2)
                  .map((v) => v.name)
                  .join(", ")}`
              : "Profile में राज्य सेट करें — बेहतर variety सुझाव मिलेगा।"}
          </p>
        </DarkCard>
      )}

      <DarkCard>
        <SectionHeader title="Recommended Varieties" />
        <p className="mt-1 text-xs text-[var(--av-text-muted)]">
          {crop.name} — varieties that perform and sell well in Indian mandis
        </p>
        <div className="mt-3 space-y-2.5">
          {varieties.map((v, i) => {
            const isMarketPick =
              !!state && v.states.some((s) => s.toLowerCase() === state.toLowerCase());
            return (
              <div
                key={v.name}
                className={`rounded-xl border px-3 py-2.5 ${
                  isMarketPick
                    ? "border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-transparent"
                    : "border-[var(--av-border)] bg-[var(--av-surface-inset)]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-[var(--av-text-primary)]">
                      {i + 1}. {v.name}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--av-text-secondary)]">{v.trait}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[var(--av-accent-soft)] px-2 py-0.5 text-[9px] font-bold text-[var(--av-accent)]">
                    {v.season}
                  </span>
                </div>
                <p className="mt-1.5 flex items-start gap-1 text-[10px] text-[var(--av-text-muted)]">
                  <TrendingUp className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                  {v.marketNote}
                  {v.states.length > 0 && (
                    <span className="text-[var(--av-text-muted)]"> · {v.states.slice(0, 3).join(", ")}</span>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </DarkCard>
    </div>
  );
}
