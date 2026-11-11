"use client";

import type { SprayWithProduct } from "@/types/spray-rotation";
import { getMoAGroup, moaGroupColor } from "@/lib/sprayRotation";
import { cn } from "@/lib/cn";
import ChemBottleThumb from "@/components/crops/ChemBottleThumb";
import { cropCatalog } from "@/data/crop-catalog";

interface SprayTimelineProps {
  sprays: SprayWithProduct[];
  fieldNameById?: Record<string, string>;
}

function formatSprayDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  try {
    return d.toLocaleDateString("hi-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  } catch {
    return dateStr;
  }
}

function cropLabel(slug?: string): string {
  if (!slug) return "";
  const hit = cropCatalog.find(
    (c) => c.slug === slug || (slug === "groundnut" && c.slug === "moongfali")
  );
  return hit ? hit.nameHi || hit.name : slug;
}

export default function SprayTimeline({ sprays, fieldNameById }: SprayTimelineProps) {
  if (!sprays || sprays.length === 0) {
    return null;
  }

  const validSprays = sprays.filter((s) => Boolean(s && s.product));
  if (validSprays.length === 0) {
    return null;
  }

  const sorted = [...validSprays].sort((a, b) => {
    const tA = a.sprayDate ? new Date(a.sprayDate).getTime() : 0;
    const tB = b.sprayDate ? new Date(b.sprayDate).getTime() : 0;
    return (isNaN(tB) ? 0 : tB) - (isNaN(tA) ? 0 : tA);
  });

  return (
    <div className="space-y-3">
      {sorted.map((spray, idx) => {
        const moa = spray.product ? getMoAGroup(spray.product) : "N/A";
        const chipColor = spray.product
          ? moaGroupColor(spray.product.moaType, spray.product.moaGroup)
          : "bg-gray-400";
        const productName = spray.product?.productName || spray.technical || "स्प्रे उत्पाद";
        const activeIng = spray.product?.activeIngredient || spray.technical || "";
        const formattedDate = formatSprayDate(spray.sprayDate);
        const crop = cropLabel(spray.cropId);
        const field =
          spray.fieldId === "hub"
            ? "फसल डॉक्टर"
            : fieldNameById?.[spray.fieldId] || "";
        const bottleKey = activeIng || productName;

        return (
          <article
            key={spray.id || `${spray.productId}-${spray.sprayDate}`}
            className={cn(
              "flex overflow-hidden rounded-2xl border bg-[var(--av-surface)] shadow-xs",
              idx === 0
                ? "border-emerald-500/40 ring-1 ring-emerald-500/20"
                : "border-[var(--av-border)]"
            )}
          >
            <ChemBottleThumb
              technical={bottleKey}
              size="sm"
              className="!rounded-none border-0"
            />
            <div className="min-w-0 flex-1 px-3 py-2.5">
              {idx === 0 ? (
                <p className="text-[10px] font-black uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                  आखिरी छिड़काव
                </p>
              ) : null}
              <div className="flex items-start justify-between gap-2">
                <p className="text-[13px] font-black leading-snug text-[var(--av-text-primary)]">
                  {productName}
                </p>
                {formattedDate ? (
                  <span className="shrink-0 text-[10px] font-bold text-[var(--av-text-muted)]">
                    {formattedDate}
                  </span>
                ) : null}
              </div>
              {activeIng && activeIng !== productName ? (
                <p className="mt-0.5 text-[11px] font-semibold text-[var(--av-text-secondary)]">
                  {activeIng}
                </p>
              ) : null}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {crop ? (
                  <span className="rounded-full bg-emerald-500/12 px-2 py-0.5 text-[10px] font-bold text-emerald-900 dark:text-emerald-200">
                    {crop}
                  </span>
                ) : null}
                {field ? (
                  <span className="rounded-full bg-[var(--av-surface-inset)] px-2 py-0.5 text-[10px] font-bold text-[var(--av-text-secondary)]">
                    {field}
                  </span>
                ) : null}
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-black text-white", chipColor)}>
                  {moa}
                </span>
                {!spray.synced ? (
                  <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                    सिंक बाकी
                  </span>
                ) : null}
              </div>
              <p className="mt-1.5 text-[11px] font-semibold text-[var(--av-text-muted)]">
                मात्रा: {spray.doseUsed || "लेबल अनुसार"}
                {spray.growthStageAtSpray ? ` · ${spray.growthStageAtSpray}` : ""}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
