"use client";

import { useId } from "react";
import { bottleCategory, bottleLabelParts } from "@/lib/crops/chemBottle";
import type { ChemBottleCategory } from "@/data/chem-bottle-catalog";

const BOTTLE_SRC = "/images/chem/bottle-hero.png";

const KIND_LABEL: Record<ChemBottleCategory, string> = {
  insecticide: "INSECTICIDE",
  fungicide: "FUNGICIDE",
  herbicide: "HERBICIDE",
  pgr: "PGR",
};

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
  const uid = useId().replace(/:/g, "");
  const { formulation, nameLines } = bottleLabelParts(technical);
  const kind = category ?? bottleCategory(technical);
  const w = size === "sm" ? 76 : 100;
  const h = size === "sm" ? 124 : 164;
  const nameSize = nameLines.some((l) => l.length > 11) ? 5.4 : nameLines.length > 2 ? 5.6 : 6.4;
  const nameStart = 44 - (nameLines.length - 1) * 3.4;

  return (
    <div
      className={`relative shrink-0 self-start overflow-hidden bg-[#cfe6b8] ${className}`}
      style={{ width: w, height: h }}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BOTTLE_SRC}
        alt=""
        className="h-full w-full object-cover object-[center_46%]"
      />
      <svg viewBox="0 0 80 130" className="absolute inset-0 h-full w-full" role="img">
        <title>{technical}</title>
        <defs>
          <clipPath id={`av-label-${uid}`}>
            <rect x="21" y="30" width="38" height="62" rx="3.5" />
          </clipPath>
        </defs>
        {/* Full cover so original printed text cannot leak */}
        <rect
          x="21"
          y="30"
          width="38"
          height="62"
          rx="3.5"
          fill="#ffffff"
          stroke="#dbe4ea"
          strokeWidth="0.6"
        />
        <g clipPath={`url(#av-label-${uid})`}>
          <rect x="21" y="30" width="38" height="5" rx="2" fill="#2f9e44" />
          {nameLines.map((line, i) => (
            <text
              key={`${line}-${i}`}
              x="40"
              y={nameStart + i * 7.2}
              textAnchor="middle"
              fill="#1d4f9c"
              fontFamily="Outfit, ui-sans-serif, system-ui, sans-serif"
              fontSize={nameSize}
              fontWeight="800"
            >
              {line}
            </text>
          ))}
          {formulation ? (
            <>
              <rect x="24" y="66" width="32" height="9" rx="4.5" fill="#2f9e44" />
              <text
                x="40"
                y="72.2"
                textAnchor="middle"
                fill="#ffffff"
                fontFamily="Outfit, ui-sans-serif, system-ui, sans-serif"
                fontSize={formulation.length > 12 ? 3.8 : 4.4}
                fontWeight="800"
              >
                {formulation}
              </text>
            </>
          ) : null}
          <text
            x="40"
            y={formulation ? 83.5 : 72}
            textAnchor="middle"
            fill="#1f2937"
            fontFamily="Outfit, ui-sans-serif, system-ui, sans-serif"
            fontSize="4.2"
            fontWeight="800"
            letterSpacing="0.4"
          >
            {KIND_LABEL[kind]}
          </text>
        </g>
      </svg>
    </div>
  );
}
