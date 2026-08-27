"use client";

import ChemBottleThumb from "@/components/crops/ChemBottleThumb";
import type { CropSprayProduct } from "@/types/crop-management";

export default function CropSprayMedicineList({
  products,
  hi,
  heading,
}: {
  products: CropSprayProduct[];
  hi: boolean;
  /** Omit to keep a single numbered list under the parent section title. */
  heading?: string;
}) {
  if (!products.length) return null;

  return (
    <div className="mt-2 space-y-2.5" onClick={(e) => e.stopPropagation()}>
      {heading ? (
        <p className="text-[11px] font-bold text-[var(--av-text-primary)]">{heading}</p>
      ) : null}
      {products.map((p, i) => {
        const technical = [p.technical, p.formulation].filter(Boolean).join(" ");
        return (
          <article
            key={`${p.technical}-${p.doseAcre}-${i}`}
            className="group relative flex min-h-[88px] overflow-hidden rounded-2xl border border-[#D8E8DE] bg-white text-left shadow-[0_8px_22px_-14px_rgba(11,92,59,0.35)]"
          >
            <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-center gap-0.5 px-3 py-2.5">
              <p className="text-[10px] font-bold text-[#0B5C3B]">
                {hi ? `विकल्प ${i + 1}` : `Option ${i + 1}`}
              </p>
              <p className="text-[13px] font-extrabold leading-snug text-[#0B3D28]">
                {p.technical}
                {p.formulation && !p.technical.includes(p.formulation)
                  ? ` ${p.formulation}`
                  : ""}
              </p>
              {p.brands?.length ? (
                <p className="text-[11px] font-semibold text-[#5A7A68]">
                  {hi ? "ब्रांड: " : "Brand: "}
                  {p.brands.join(", ")}
                </p>
              ) : null}
              <p className="mt-0.5 text-[12px] font-black text-emerald-800">
                {hi ? "खुराक: " : "Dose: "}
                {p.doseAcre}
              </p>
              {p.bestStage ? (
                <p className="text-[11px] font-semibold text-[#3D6B54]">
                  {hi ? "कब: " : "When: "}
                  {p.bestStage}
                </p>
              ) : null}
              {p.bestUseCondition ? (
                <p className="line-clamp-2 text-[10px] font-medium text-[#5A7A68]">
                  {p.bestUseCondition}
                </p>
              ) : null}
              {p.sourceConfidence === "label-check" ? (
                <p className="mt-0.5 text-[9px] font-semibold text-amber-700">
                  {hi ? "लेबल ज़रूर देखें" : "Check bottle label"}
                </p>
              ) : null}
            </div>
            <div className="relative flex w-[38%] min-w-[100px] max-w-[140px] shrink-0 items-center justify-center self-stretch overflow-hidden bg-[#F3FBF6]">
              <ChemBottleThumb technical={technical} size="md" className="!h-full !w-full !max-w-none self-stretch" />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white via-white/70 to-transparent"
              />
            </div>
          </article>
        );
      })}
      <p className="text-[9px] text-[var(--av-text-muted)]">
        {hi
          ? "खुराक गाइड है — बोतल लेबल अनिवार्य। एक ही दवा बार-बार न लगाएँ।"
          : "Guide only — follow bottle label. Rotate products."}
      </p>
    </div>
  );
}
