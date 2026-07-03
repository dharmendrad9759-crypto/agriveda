"use client";

import type { SprayWithProduct } from "@/types/spray-rotation";
import { getMoAGroup, moaGroupColor } from "@/lib/sprayRotation";
import { cn } from "@/lib/cn";

interface SprayTimelineProps {
  sprays: SprayWithProduct[];
}

export default function SprayTimeline({ sprays }: SprayTimelineProps) {
  if (sprays.length === 0) {
    return null;
  }

  const sorted = [...sprays].sort(
    (a, b) => new Date(b.sprayDate).getTime() - new Date(a.sprayDate).getTime()
  );

  return (
    <div className="relative space-y-0 pl-4">
      <div className="absolute bottom-2 left-[7px] top-2 w-0.5 bg-gray-200 dark:bg-white/10" />
      {sorted.map((spray, i) => {
        const moa = getMoAGroup(spray.product);
        const dotColor = moaGroupColor(spray.product.moaType, spray.product.moaGroup);
        return (
          <div key={spray.id} className="relative flex gap-3 pb-4">
            <div
              className={cn(
                "relative z-10 mt-1 h-3.5 w-3.5 flex-shrink-0 rounded-full ring-2 ring-white dark:ring-gray-900",
                dotColor
              )}
            />
            <div className="min-w-0 flex-1 rounded-xl border border-gray-100 bg-white p-3 dark:border-white/10 dark:bg-black/20">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-bold theme-text-primary">{spray.product.productName}</p>
                <span className="flex-shrink-0 text-[10px] theme-text-muted">
                  {new Date(spray.sprayDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
              <p className="mt-0.5 text-[10px] theme-text-muted">{spray.product.activeIngredient}</p>
              <span
                className={cn(
                  "mt-2 inline-block rounded-md px-2 py-0.5 text-[9px] font-bold text-white",
                  dotColor
                )}
              >
                {moa}
              </span>
              <p className="mt-1 text-[10px] theme-text-muted">
                {spray.doseUsed} • {spray.growthStageAtSpray}
                {!spray.synced && (
                  <span className="ml-1 text-amber-600">⏳</span>
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
