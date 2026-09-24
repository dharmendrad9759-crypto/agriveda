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
 * Threat list hero — photo + title (all crops).
 */
export default function CropThreatPageHero({ crop, title, kind, hi }: Props) {
  const { src, precomposited } = getThreatBannerUrl(crop.slug);
  const isDisease = kind === "diseases";
  const Icon = isDisease ? ShieldAlert : Bug;

  return (
    <div className="relative mb-4 min-h-[148px] overflow-hidden rounded-[1.5rem] border border-black/[0.06] shadow-[0_18px_40px_-24px_rgba(8,40,24,0.55)] sm:min-h-[168px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-right"
      />

      {!precomposited ? (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-[#0a2818]/92 via-[#0a2818]/72 via-45% to-transparent to-78%"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-[#062015]/88 via-[#062015]/55 via-42% to-transparent to-75%"
        />
      )}

      <div className="relative z-10 flex h-full min-h-[148px] max-w-[62%] flex-col justify-center gap-2 px-4 py-4 sm:min-h-[168px] sm:max-w-[55%] sm:px-5 sm:py-5">
        <span
          className={
            isDisease
              ? "inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-amber-950"
              : "inline-flex w-fit items-center gap-1.5 rounded-full bg-rose-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white"
          }
        >
          <Icon className="h-3 w-3" />
          {isDisease ? (hi ? "रोग" : "Disease") : hi ? "कीट" : "Pest"}
        </span>
        <h1 className="font-display text-[1.55rem] font-bold leading-[1.1] tracking-tight text-white sm:text-[1.75rem]">
          {title}
        </h1>
      </div>
    </div>
  );
}
