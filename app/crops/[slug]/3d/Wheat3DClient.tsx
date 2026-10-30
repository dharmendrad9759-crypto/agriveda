"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Sprout } from "lucide-react";
import WheatStageVideoPlayer from "@/components/farm/WheatStageVideoPlayer";
import { WHEAT_ZADOKS_STAGES } from "@/lib/farm/wheatZadoksStages";

interface Props {
  cropName: string;
  cropSlug: string;
}

export default function Wheat3DClient({ cropName, cropSlug }: Props) {
  const router = useRouter();
  const [activeStageId, setActiveStageId] = useState("germination");

  const selectedStage = useMemo(() => {
    return (
      WHEAT_ZADOKS_STAGES.find((s) => s.stageId === activeStageId) ||
      WHEAT_ZADOKS_STAGES[0]
    );
  }, [activeStageId]);

  return (
    <div className="min-h-screen w-full bg-[#030e0b] px-3 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-4xl space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 p-2.5 backdrop-blur-md">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/20 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>पीछे जाएं</span>
          </button>

          <div className="text-center">
            <h1 className="text-sm font-bold text-white sm:text-base">
              {cropName} · 10 प्रमुख विकास चरण
            </h1>
            <p className="text-[10.5px] text-emerald-300">
              100% जीवंत व रियलिस्टिक वीडियो गाइड
            </p>
          </div>

          <div className="h-7 w-7 opacity-0" />
        </div>

        <WheatStageVideoPlayer
          currentStage={WHEAT_ZADOKS_STAGES[0]}
          selectedStage={selectedStage}
          das={18}
          totalDays={135}
          onSelectStage={(stageId) => setActiveStageId(stageId)}
          className="w-full shadow-2xl"
        />
      </div>
    </div>
  );
}
