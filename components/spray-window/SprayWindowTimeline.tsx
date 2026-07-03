"use client";

import type { SprayWindowTimelineSlot } from "@/types/spray-window";
import { statusColor } from "@/lib/sprayWindow";
import { cn } from "@/lib/cn";

interface SprayWindowTimelineProps {
  slots: SprayWindowTimelineSlot[];
}

export default function SprayWindowTimeline({ slots }: SprayWindowTimelineProps) {
  return (
    <div className="space-y-2">
      <div className="flex gap-0.5 overflow-x-auto rounded-xl p-1 scrollbar-hide">
        {slots.map((slot) => (
          <div
            key={slot.time.toISOString()}
            title={`${slot.label}: ${slot.result.reasonEn}`}
            className={cn(
              "flex min-w-[2.25rem] flex-1 flex-col items-center gap-1",
              "first:rounded-l-lg last:rounded-r-lg"
            )}
          >
            <div
              className={cn(
                "h-8 w-full rounded-md transition-opacity",
                statusColor(slot.status),
                slot.status === "GOOD" && "opacity-90",
                slot.status === "CAUTION" && "opacity-85",
                slot.status === "AVOID" && "opacity-95"
              )}
            />
            <span className="text-[8px] font-bold theme-text-muted whitespace-nowrap">
              {slot.label.replace(" ", "")}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[9px] font-bold theme-text-muted">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-sm bg-emerald-500" /> Good
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-sm bg-amber-400" /> Caution
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-sm bg-red-500" /> Avoid
        </span>
      </div>
    </div>
  );
}
