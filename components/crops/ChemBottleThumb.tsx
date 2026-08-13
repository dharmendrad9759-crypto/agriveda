"use client";

import { bottleCategory } from "@/lib/crops/chemBottle";
import { chemBottleImageSrc } from "@/lib/crops/chemBottleSvg";
import type { ChemBottleCategory } from "@/data/chem-bottle-catalog";

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
  const kind = category ?? bottleCategory(technical);
  const w = size === "sm" ? 76 : 100;
  const h = size === "sm" ? 124 : 164;
  const src = chemBottleImageSrc(technical);

  return (
    <div
      className={`relative shrink-0 self-start overflow-hidden bg-[#cfe6b8] ${className}`}
      style={{ width: w, height: h }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="h-full w-full object-cover object-center"
        data-chem-kind={kind}
      />
    </div>
  );
}
