import type { GrowthStageItem } from "@/data/crop-dashboard";
import { Check } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

interface CropTimelineProps {
  stages: GrowthStageItem[];
}

export default function CropTimeline({ stages }: CropTimelineProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {stages.map((stage) => {
        const isCurrent = stage.status === "current";
        const isCompleted = stage.status === "completed";

        return (
          <GlassCard
            key={stage.id}
            strong={isCurrent}
            className={`relative min-w-[130px] flex-shrink-0 p-3.5 ${
              isCurrent
                ? "ring-2 ring-emerald-400/50 bg-gradient-to-br from-emerald-50/90 to-white/90"
                : isCompleted
                  ? "opacity-80"
                  : ""
            }`}
          >
            {isCurrent && (
              <span className="absolute -top-2.5 left-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                Current
              </span>
            )}

            <div className="flex items-start justify-between gap-1">
              <div>
                <p className="text-xs font-extrabold text-slate-900 leading-tight">{stage.name}</p>
                <p className="mt-1.5 inline-flex rounded-lg bg-emerald-100/80 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  {stage.das}
                </p>
              </div>
              {isCompleted && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                  <Check className="h-3 w-3 text-emerald-700" strokeWidth={3} />
                </div>
              )}
            </div>

            <div className="mt-3 flex justify-center text-3xl drop-shadow-sm">{stage.emoji}</div>
          </GlassCard>
        );
      })}
    </div>
  );
}
