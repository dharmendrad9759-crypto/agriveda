"use client";

import { getThreatBannerUrl } from "@/lib/crops/threatBannerImages";
import type { Crop } from "@/types/crop";
import { Bug, ShieldAlert } from "lucide-react";

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
  const { src } = getThreatBannerUrl(crop.slug);
  const isDisease = kind === "diseases";
  const Icon = isDisease ? ShieldAlert : Bug;

  return (
    <div className="relative mb-5 overflow-hidden rounded-[26px] border border-emerald-500/30 bg-gradient-to-br from-[#052b1b] via-[#042014] to-[#02130c] p-4 text-white shadow-[0_20px_45px_-18px_rgba(4,45,28,0.7)] sm:p-5">
      {/* Glow ambient background effects */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-emerald-400/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-teal-400/15 blur-3xl"
      />

      <div className="relative z-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1 space-y-2">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={
                isDisease
                  ? "inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/20 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-amber-300 backdrop-blur-md"
                  : "inline-flex items-center gap-1.5 rounded-full border border-rose-400/30 bg-rose-500/20 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-rose-300 backdrop-blur-md"
              }
            >
              <Icon className="h-3.5 w-3.5" />
              {isDisease
                ? hi
                  ? "फसल रोग सुरक्षा"
                  : "Disease Protection"
                : hi
                  ? "कीट नियंत्रण कवच"
                  : "Pest Management"}
            </span>

            <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10.5px] font-bold text-white/90 backdrop-blur-md">
              🏛️ ICAR-IPM मानक
            </span>
          </div>

          <h1 className="font-display text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">
            {title}
          </h1>

          <p className="text-xs font-semibold text-emerald-100/80 max-w-md">
            {hi
              ? "पहचान, नुकसान के लक्षण और 4-स्तरीय सटीक दवा मात्रा का प्रमाणित समाधान"
              : "Field symptoms, damage identification, and authentic 4-tier medicine solutions"}
          </p>
        </div>

        {/* Hero Crop Photo */}
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-white/20 bg-white/10 shadow-md sm:h-24 sm:w-24 self-end sm:self-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={cropLabel}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
