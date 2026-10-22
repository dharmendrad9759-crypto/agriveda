"use client";

import type { SprayWithProduct } from "@/types/spray-rotation";
import { getMoAGroup, moaGroupColor } from "@/lib/sprayRotation";
import { cn } from "@/lib/cn";

interface SprayTimelineProps {
  sprays: SprayWithProduct[];
}

function formatSprayDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  try {
    return d.toLocaleDateString("hi-IN", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return dateStr;
  }
}

export default function SprayTimeline({ sprays }: SprayTimelineProps) {
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
    <div className="relative space-y-0 pl-4">
      <div className="absolute bottom-2 left-[7px] top-2 w-0.5 bg-gray-200 dark:bg-white/10" />
      {sorted.map((spray) => {
        const moa = spray.product ? getMoAGroup(spray.product) : "N/A";
        const dotColor = spray.product
          ? moaGroupColor(spray.product.moaType, spray.product.moaGroup)
          : "bg-gray-400";
        const productName = spray.product?.productName || "स्प्रे उत्पाद";
        const activeIng = spray.product?.activeIngredient || "";
        const formattedDate = formatSprayDate(spray.sprayDate);

        return (
          <div key={spray.id || `${spray.productId}-${spray.sprayDate}`} className="relative flex gap-3 pb-4">
            <div
              className={cn(
                "relative z-10 mt-1 h-3.5 w-3.5 flex-shrink-0 rounded-full ring-2 ring-white dark:ring-gray-900",
                dotColor
              )}
            />
            <div className="min-w-0 flex-1 rounded-xl border border-gray-100 bg-white p-3 dark:border-white/10 dark:bg-black/20">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-bold theme-text-primary">{productName}</p>
                {formattedDate && (
                  <span className="flex-shrink-0 text-[10px] theme-text-muted">
                    {formattedDate}
                  </span>
                )}
              </div>
              {activeIng && (
                <p className="mt-0.5 text-[10px] theme-text-muted">{activeIng}</p>
              )}
              <span
                className={cn(
                  "mt-2 inline-block rounded-md px-2 py-0.5 text-[9px] font-bold text-white",
                  dotColor
                )}
              >
                {moa}
              </span>
              <p className="mt-1 text-[10px] theme-text-muted">
                {spray.doseUsed || "अनुशंसित मात्रा"} {spray.growthStageAtSpray ? `• ${spray.growthStageAtSpray}` : ""}
                {!spray.synced && (
                  <span className="ml-1 text-amber-600" title="सिंक लंबित">⏳</span>
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
