"use client";

import { useState } from "react";
import { bottleCategory, getChemPackageType, lookupChemBottle } from "@/lib/crops/chemBottle";
import { chemBottleImageSrc, hasRealBottlePhoto } from "@/lib/crops/chemBottleSvg";
import type { ChemBottleCategory } from "@/data/chem-bottle-catalog";
import { Camera, Package, X, ZoomIn } from "lucide-react";

export default function ChemBottleThumb({
  technical,
  category,
  className = "",
  size = "md",
  allowExpand = true,
}: {
  technical: string;
  category?: ChemBottleCategory;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
  allowExpand?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const hit = lookupChemBottle(technical);
  const isReal = hasRealBottlePhoto(technical);
  const pkgType = getChemPackageType(technical, hit?.formulation);
  const isPouch = pkgType === "pouch";
  const kind = category ?? hit?.category ?? bottleCategory(technical);

  const dims = {
    xs: { w: 58, h: 96 },
    sm: { w: 78, h: 128 },
    md: { w: 104, h: 168 },
    lg: { w: 140, h: 226 },
  }[size] || { w: 104, h: 168 };

  const src = chemBottleImageSrc(technical);
  const displayName = hit ? `${hit.name} ${hit.formulation}` : technical;
  const packageLabel = isPouch ? "पैकेट" : "बोतल";

  return (
    <>
      <div
        onClick={() => allowExpand && setExpanded(true)}
        className={`group relative shrink-0 overflow-hidden rounded-xl border border-stone-200/90 bg-stone-50/90 dark:border-stone-700 dark:bg-stone-800/80 shadow-xs transition hover:shadow-md ${
          allowExpand ? "cursor-pointer" : ""
        } ${className}`}
        style={{ width: dims.w, height: dims.h }}
        title={`${displayName} - ${packageLabel} देखने के लिए क्लिक करें`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={displayName}
          className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
          data-chem-kind={kind}
          loading="eager"
          decoding="async"
        />

        <span
          className={`absolute left-1 top-1 flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[8.5px] font-black text-white shadow-sm ${
            isReal
              ? "bg-emerald-700/95"
              : isPouch
              ? "bg-purple-700/90"
              : "bg-blue-700/90"
          }`}
          title={isReal ? `असली फोटो (${packageLabel})` : `${packageLabel} रूप`}
        >
          {isReal ? (
            <Camera className="h-2.5 w-2.5" />
          ) : isPouch ? (
            <Package className="h-2.5 w-2.5" />
          ) : null}
          <span>{isReal ? `फोटो · ${packageLabel}` : packageLabel}</span>
        </span>

        {allowExpand && (
          <span className="absolute bottom-1 right-1 rounded-md bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100">
            <ZoomIn className="h-3 w-3" />
          </span>
        )}
      </div>

      {/* Enlarged Bottle Modal */}
      {expanded && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in"
          onClick={() => setExpanded(false)}
        >
          <div
            className="relative flex w-full max-w-[340px] sm:max-w-[380px] flex-col items-center rounded-3xl bg-white p-5 shadow-2xl border border-stone-200 dark:bg-stone-900 dark:border-stone-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="absolute right-3.5 top-3.5 rounded-full bg-stone-100 p-2 text-stone-700 transition hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-200"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-stone-50 to-stone-100/80 p-3 border border-stone-200/80 dark:border-stone-700/80 dark:from-stone-800/80 dark:to-stone-900 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={displayName}
                className="h-[340px] sm:h-[380px] w-auto max-w-full object-contain drop-shadow-xl transition duration-300 hover:scale-105"
              />
            </div>

            <div className="mt-3.5 text-center w-full">
              <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-black text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                {isReal
                  ? isPouch
                    ? "असली टेक्निकल पैकेट (Product Photo)"
                    : "असली टेक्निकल बोतल (Product Photo)"
                  : isPouch
                  ? "तकनीकी पैकेट (Agro Foil Sachet)"
                  : "तकनीकी बोतल (Technical Bottle)"}
              </span>
              <p className="mt-1.5 text-base font-black text-stone-900 dark:text-stone-100">
                {displayName}
              </p>
              <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-0.5">
                खाद-बीज की दुकान पर यह टेक्निकल नाम बताकर {isPouch ? "पैकेट" : "दवाई"} लें
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
