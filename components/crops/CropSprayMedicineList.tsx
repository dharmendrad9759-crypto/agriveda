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
            className="flex overflow-hidden rounded-xl border border-violet-500/20 bg-violet-500/5 text-left"
          >
            <ChemBottleThumb technical={technical} size="sm" />
            <div className="min-w-0 flex-1 px-2.5 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wide text-violet-700 dark:text-violet-300">
                {hi ? `विकल्प ${i + 1}` : `Option ${i + 1}`}
              </p>
              <p className="mt-0.5 text-[12px] font-extrabold leading-snug text-[var(--av-text-primary)]">
                {p.technical}
                {p.formulation && !p.technical.includes(p.formulation)
                  ? ` ${p.formulation}`
                  : ""}
              </p>
              {p.brands?.length ? (
                <p className="mt-1 text-[11px] text-[var(--av-text-secondary)]">
                  <span className="font-bold text-[var(--av-text-primary)]">
                    {hi ? "लोकप्रिय ब्रांड: " : "Popular brands: "}
                  </span>
                  {p.brands.join(", ")}
                </p>
              ) : null}
              <p className="mt-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-200">
                {hi ? "खुराक: " : "Dose: "}
                {p.doseAcre}
              </p>
              {p.bestStage ? (
                <p className="mt-0.5 text-[11px] text-[var(--av-text-secondary)]">
                  <span className="font-bold text-[var(--av-text-primary)]">
                    {hi ? "बेस्ट स्टेज: " : "Best stage: "}
                  </span>
                  {p.bestStage}
                </p>
              ) : null}
              {p.bestUseCondition ? (
                <p className="mt-0.5 text-[11px] text-[var(--av-text-secondary)]">
                  <span className="font-bold text-[var(--av-text-primary)]">
                    {hi ? "कब इस्तेमाल: " : "Use when: "}
                  </span>
                  {p.bestUseCondition}
                </p>
              ) : null}
              {p.points?.length ? (
                <ul className="mt-1.5 space-y-0.5 text-[10px] leading-snug text-[var(--av-text-secondary)]">
                  {p.points.map((pt) => (
                    <li key={pt}>• {pt}</li>
                  ))}
                </ul>
              ) : null}
              {p.sourceConfidence === "label-check" ? (
                <p className="mt-1 text-[9px] font-semibold text-amber-700 dark:text-amber-300">
                  {hi ? "लेबल / स्थानीय अनुमोदन जाँचें" : "Verify label / local approval"}
                </p>
              ) : null}
            </div>
          </article>
        );
      })}
      <p className="text-[9px] text-[var(--av-text-muted)]">
        {hi
          ? "खुराक गाइड है — बोतल लेबल + PHI अनिवार्य। एक ही क्रिया-विधि बार-बार न दोहराएँ।"
          : "Guide only — follow bottle label + PHI. Rotate modes of action."}
      </p>
    </div>
  );
}
