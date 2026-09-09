"use client";

import { getThreatBannerUrl } from "@/lib/crops/threatBannerImages";
import type { Crop } from "@/types/crop";
import { Sprout } from "lucide-react";

type ThreatKind = "pests" | "diseases";

interface Props {
  crop: Crop;
  cropLabel: string;
  title: string;
  kind: ThreatKind;
  hi: boolean;
}

/**
 * Reference-style threat header: full crop banner as background,
 * title on the mint-safe left zone (same-to-same as provided banners).
 */
export default function CropThreatPageHero({ crop, cropLabel, title, kind, hi }: Props) {
  const { src, precomposited } = getThreatBannerUrl(crop.slug);
  const line1 =
    kind === "diseases"
      ? hi
        ? `${cropLabel} में पाए जाने वाले प्रमुख रोग`
        : `Major diseases found in ${cropLabel}`
      : hi
        ? `${cropLabel} में पाए जाने वाले प्रमुख कीट`
        : `Major pests found in ${cropLabel}`;
  const line2 =
    kind === "diseases"
      ? hi
        ? "रोग की पहचान करें और सही समय पर नियंत्रण पाएँ"
        : "Identify the disease and control it in time"
      : hi
        ? "कीट की पहचान करें और सही समय पर नियंत्रण पाएँ"
        : "Identify the pest and control it in time";

  return (
    <div className="relative mb-3 min-h-[148px] overflow-hidden rounded-2xl border border-[#D4E8DB] sm:min-h-[168px]">
      {/* Full-bleed banner background — reference style */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-right"
      />

      {/* Extra mint veil only when crop photo is not a precomposed banner */}
      {!precomposited ? (
        <>
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-[#EAF6EF] via-[#EAF6EF]/92 via-40% to-transparent to-70%"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-3 top-3 opacity-25"
          >
            <Sprout className="h-10 w-10 text-emerald-700" />
          </div>
        </>
      ) : (
        /* Light readability boost on far left for dark titles */
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-[42%] bg-gradient-to-r from-white/35 via-white/10 to-transparent"
        />
      )}

      <div className="relative z-10 flex max-w-[58%] flex-col justify-center gap-1 px-3.5 py-4 sm:max-w-[52%] sm:px-5 sm:py-5">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/70 text-emerald-800 shadow-sm backdrop-blur-[2px]">
            <Sprout className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <div className="min-w-0">
            <h1 className="text-[22px] font-black leading-tight tracking-tight text-[#0B3D28] drop-shadow-[0_1px_0_rgba(255,255,255,0.55)] sm:text-[24px]">
              {title}
            </h1>
            <p className="mt-1 text-[12px] font-semibold leading-snug text-[#1F4A35] sm:text-[13px]">
              {line1}
            </p>
            <p className="mt-0.5 text-[11px] font-medium leading-snug text-[#3D5A4A] sm:text-[12px]">
              {line2}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
