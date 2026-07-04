import type { GrowthStageItem } from "@/data/crop-dashboard";
import { Check } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

interface CropTimelineProps {
  stages: GrowthStageItem[];
  labels?: {
    current: string;
    done: string;
    upcoming: string;
  };
}

export default function CropTimeline({ stages, labels }: CropTimelineProps) {
  const currentLabel = labels?.current ?? "अभी";
  const doneLabel = labels?.done ?? "हो गया";

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {stages.map((stage) => {
        const isCurrent = stage.status === "current";
        const isCompleted = stage.status === "completed";

        return (
          <GlassCard
            key={stage.id}
            neon={isCurrent}
            className={`relative min-w-[120px] flex-shrink-0 p-3.5 ${
              isCompleted ? "opacity-75" : ""
            }`}
          >
            {isCurrent && (
              <span className="absolute -top-2 left-2.5 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                {currentLabel}
              </span>
            )}
            {isCompleted && (
              <span className="absolute -top-2 left-2.5 flex items-center gap-0.5 rounded-full border border-gray-400/30 bg-black/40 px-2 py-0.5 text-[10px] font-bold text-slate-400">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
                {doneLabel}
              </span>
            )}

            <div className="mt-1">
              <p className="text-xs font-extrabold theme-text-primary leading-tight">{stage.name}</p>
              <p className="mt-1.5 inline-flex rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                {stage.das}
              </p>
            </div>

            <div className="mt-3 flex justify-center text-3xl">{stage.emoji}</div>
          </GlassCard>
        );
      })}
    </div>
  );
}
