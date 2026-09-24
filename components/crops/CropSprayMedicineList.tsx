"use client";

import ChemBottleThumb from "@/components/crops/ChemBottleThumb";
import { bilingualAgriName } from "@/lib/crops/bilingualAgriName";
import { farmerSpeak } from "@/lib/crops/farmerSpeak";
import { shopBrandLine } from "@/lib/crops/shopBrandLine";
import type { CropSprayProduct } from "@/types/crop-management";
import { useState } from "react";

export default function CropSprayMedicineList({
  products,
  hi,
  heading,
  initialVisible = 3,
}: {
  products: CropSprayProduct[];
  hi: boolean;
  heading?: string;
  /** Keep first screen clean — expand for the rest */
  initialVisible?: number;
}) {
  const [showAll, setShowAll] = useState(false);
  if (!products.length) return null;

  const visible = showAll ? products : products.slice(0, initialVisible);
  const hidden = Math.max(0, products.length - initialVisible);

  return (
    <div className="space-y-2.5" onClick={(e) => e.stopPropagation()}>
      {heading ? (
        <p className="text-[11px] font-bold tracking-wide text-[var(--av-text-muted)]">
          {heading}
        </p>
      ) : null}

      <ol className="space-y-2.5">
        {visible.map((p, i) => {
          const technical = [p.technical, p.formulation].filter(Boolean).join(" ");
          const title = hi ? bilingualAgriName(p.technical) : p.technical;
          const isPrimary = i === 0 && !showAll;
          return (
            <li key={`${p.technical}-${p.doseAcre}-${i}`}>
              <article
                className={
                  isPrimary
                    ? "relative overflow-hidden rounded-[1.25rem] border border-emerald-800/20 bg-[var(--av-surface)] shadow-[0_14px_32px_-20px_rgba(6,78,59,0.55)]"
                    : "overflow-hidden rounded-[1.25rem] border border-[var(--av-border)] bg-[var(--av-surface)]"
                }
              >
                {isPrimary ? (
                  <div className="flex items-center justify-between gap-2 border-b border-emerald-800/10 bg-emerald-950 px-3 py-1.5">
                    <p className="text-[10px] font-bold tracking-[0.1em] text-emerald-100">
                      {hi ? "पहली पसंद · यहीं से शुरू" : "FIRST PICK · START HERE"}
                    </p>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </div>
                ) : null}
                <div className="flex min-h-[88px]">
                  <div className="relative z-10 flex min-w-0 flex-1 gap-3 px-3 py-3">
                    <span
                      className={
                        isPrimary
                          ? "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-800 text-[11px] font-black text-white"
                          : "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--av-surface-inset)] text-[11px] font-black text-[var(--av-text-primary)]"
                      }
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-extrabold leading-snug text-[var(--av-text-primary)]">
                        {title}
                        {p.formulation && !title.includes(p.formulation)
                          ? ` · ${p.formulation}`
                          : ""}
                      </p>
                      {p.brands?.length ? (
                        <p className="mt-0.5 text-[11px] font-medium leading-snug text-[var(--av-text-muted)]">
                          {shopBrandLine(p.brands, hi)}
                        </p>
                      ) : null}
                      <p className="mt-1.5 text-[12px] font-bold text-emerald-800 dark:text-emerald-300">
                        {hi ? "खुराक · " : "Dose · "}
                        {p.doseAcre}
                      </p>
                      {p.bestStage ? (
                        <p className="mt-0.5 text-[11px] font-semibold text-[var(--av-text-secondary)]">
                          {hi ? "कब · " : "When · "}
                          {hi ? farmerSpeak(p.bestStage) : p.bestStage}
                        </p>
                      ) : null}
                      {p.bestUseCondition ? (
                        <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-[var(--av-text-muted)]">
                          {hi ? farmerSpeak(p.bestUseCondition) : p.bestUseCondition}
                        </p>
                      ) : null}
                      {p.sourceConfidence === "label-check" ? (
                        <p className="mt-1 text-[9px] font-semibold text-amber-800 dark:text-amber-200">
                          {hi
                            ? "डिब्बे का लेबल (Label) ज़रूर देखें"
                            : "Check bottle label"}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="relative flex w-[32%] min-w-[88px] max-w-[120px] shrink-0 items-center justify-center self-stretch overflow-hidden bg-[#eef6f0]">
                    <ChemBottleThumb
                      technical={technical}
                      size="md"
                      className="!h-full !w-full !max-w-none self-stretch"
                    />
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ol>

      {hidden > 0 && !showAll ? (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="w-full rounded-xl border border-dashed border-emerald-800/25 bg-transparent px-3 py-2.5 text-[12px] font-bold text-emerald-900 dark:text-emerald-100"
        >
          {hi ? `और ${hidden} विकल्प` : `${hidden} more options`}
        </button>
      ) : null}

      {showAll && products.length > initialVisible ? (
        <button
          type="button"
          onClick={() => setShowAll(false)}
          className="w-full text-[11px] font-semibold text-[var(--av-text-muted)]"
        >
          {hi ? "कम दिखाएँ" : "Show less"}
        </button>
      ) : null}

      <p className="text-[9px] leading-snug text-[var(--av-text-muted)]">
        {hi
          ? "खुराक गाइड है — बोतल लेबल अनिवार्य। एक ही दवा बार-बार न लगाएँ।"
          : "Guide only — follow bottle label. Rotate products."}
      </p>
    </div>
  );
}
