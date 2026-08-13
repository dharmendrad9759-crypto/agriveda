"use client";

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
  const { name, formulation, nameLines } = bottleLabelParts(technical);
  const kind = category ?? bottleCategory(technical);
  const w = size === "sm" ? 72 : 96;
  const h = size === "sm" ? 118 : 156;
  const longest = Math.max(...nameLines.map((l) => l.length), 1);
  const titleSize =
    longest > 16
      ? size === "sm"
        ? "text-[6.5px]"
        : "text-[9px]"
      : longest > 12
        ? size === "sm"
          ? "text-[7.5px]"
          : "text-[10px]"
        : size === "sm"
          ? "text-[8.5px]"
          : "text-[12px]";

  return (
    <div
      className={`relative shrink-0 self-start overflow-hidden bg-[#d7e8c8] ${className}`}
      style={{ width: w, height: h }}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BOTTLE_SRC}
        alt=""
        className="h-full w-full object-cover object-[center_48%]"
      />
      {/* Cover the printed label and reprint in the same layout */}
      <div className="pointer-events-none absolute inset-x-[18%] top-[24%] bottom-[18%] flex flex-col items-center rounded-[4px] bg-white px-[3px] py-[4px] shadow-[0_1px_3px_rgba(15,40,20,0.18)]">
        <span className="mb-[2px] flex h-[8px] w-[8px] items-center justify-center rounded-full bg-emerald-500/90">
          <span className="h-[4px] w-[4px] rounded-full bg-white" />
        </span>
        <p
          className={`w-full text-center font-black leading-[1.05] tracking-tight text-[#1e4fa3] ${titleSize}`}
        >
          {nameLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
        {formulation ? (
          <span className="mt-[3px] max-w-full truncate rounded-full bg-[#3bb54a] px-[4px] py-[1px] text-center text-[5.5px] font-extrabold leading-none text-white">
            {formulation}
          </span>
        ) : null}
        <p className="mt-[3px] text-[5px] font-extrabold tracking-[0.12em] text-neutral-800">
          {KIND_LABEL[kind]}
        </p>
        <span className="mt-[3px] rounded-full bg-[#1e4fa3] px-[5px] py-[1px] text-[4.5px] font-bold tracking-wide text-white">
          TECHNICAL NAME
        </span>
        <p className="mt-[2px] w-full px-[1px] text-center text-[5px] font-semibold leading-[1.1] text-neutral-700">
          {name}
          {formulation ? ` ${formulation}` : ""}
        </p>
        <span className="mt-auto mb-[1px] h-[10px] w-[10px] rounded-full border border-emerald-400 bg-gradient-to-b from-emerald-200 to-emerald-500" />
      </div>
    </div>
  );
}
