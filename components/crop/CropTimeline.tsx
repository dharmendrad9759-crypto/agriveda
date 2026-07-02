import type { GrowthStageItem } from "@/data/crop-dashboard";
import { Check } from "lucide-react";

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
          <div
            key={stage.id}
            className={`relative flex min-w-[120px] flex-shrink-0 flex-col rounded-2xl border p-3 transition-all ${
              isCurrent
                ? "border-emerald-300 bg-emerald-50 shadow-sm"
                : "border-gray-100 bg-white"
            }`}
          >
            {isCurrent && (
              <span className="absolute -top-2.5 left-3 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">
                Current
              </span>
            )}

            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-gray-900 leading-tight">{stage.name}</p>
                <p className="mt-1 text-[10px] text-gray-500">{stage.dateRange}</p>
              </div>
              {isCompleted && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">
                  <Check className="h-3 w-3 text-gray-600" />
                </div>
              )}
            </div>

            <div className="mt-3 flex justify-center text-3xl">{stage.emoji}</div>
          </div>
        );
      })}
    </div>
  );
}
