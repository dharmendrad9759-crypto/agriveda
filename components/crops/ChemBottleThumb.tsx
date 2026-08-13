"use client";

import { bottleCategory, bottleLabelLines } from "@/lib/crops/chemBottle";
import type { ChemBottleCategory } from "@/data/chem-bottle-catalog";

const BOTTLE_SRC = "/images/chem/bottle-closeup.png";

export default function ChemBottleThumb({
  technical,
  category,
  className = "",
  size = "md",
}: {
  technical: string;
  category?: ChemBottleCategory;
  className?: string;
  size?: "sm" | "md";
}) {
  const lines = bottleLabelLines(technical);
  const kind = category ?? bottleCategory(technical);
  const w = size === "sm" ? 56 : 72;
  const h = size === "sm" ? 88 : 112;
  const textClass =
    size === "sm"
      ? "text-[6.5px] leading-[1.08]"
      : "text-[8px] leading-[1.1]";

  return (
    <div
      className={`relative shrink-0 self-start overflow-hidden bg-emerald-100 ${className}`}
      style={{ width: w, height: h }}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BOTTLE_SRC}
        alt=""
        className="h-full w-full object-cover object-[center_42%]"
      />
      <div className="pointer-events-none absolute inset-x-[20%] top-[36%] bottom-[28%] flex flex-col items-center justify-center rounded-[3px] bg-white/95 px-[2px] shadow-sm ring-1 ring-emerald-700/15">
        <span className="mb-0.5 text-[5px] font-bold uppercase tracking-wide text-emerald-700">
          {kind === "fungicide"
            ? "Fungicide"
            : kind === "herbicide"
              ? "Herbicide"
              : kind === "pgr"
                ? "PGR"
                : "Technical"}
        </span>
        {lines.map((line) => (
          <span
            key={line}
            className={`w-full text-center font-extrabold text-green-950 ${textClass}`}
          >
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}
