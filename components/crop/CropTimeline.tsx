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
            neon={isCurrent}
            className={`relative min-w-[130px] flex-shrink-0 p-3.5 ${
              isCompleted ? "opacity-70" : ""
            }`}
          >
            {isCurrent && (
              <span className="absolute -top-2.5 left-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-2.5 py-0.5 text-[10px] font-black text-black shadow-[0_0_12px_rgba(0,255,136,0.5)]">
                LIVE
              </span>
            )}

            <div className="flex items-start justify-between gap-1">
              <div>
                <p className="text-xs font-extrabold text-white leading-tight">{stage.name}</p>
                <p className="mt-1.5 inline-flex rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  {stage.das}
                </p>
              </div>
              {isCompleted && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20">
                  <Check className="h-3 w-3 text-emerald-400" strokeWidth={3} />
                </div>
              )}
            </div>

            <div className="mt-3 flex justify-center text-3xl">{stage.emoji}</div>
          </GlassCard>
        );
      })}
    </div>
  );
}
