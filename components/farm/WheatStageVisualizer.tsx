"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Droplets,
  Info,
  Play,
} from "lucide-react";
import { cn } from "@/lib/cn";
import WheatStageVideoPlayer, {
  STAGE_VIDEO_MAP,
  type WheatStageVideoPlayerProps,
} from "./WheatStageVideoPlayer";

export type { WheatStageVideoPlayerProps as WheatStageVisualizerProps };

const STAGE_ORDER = Object.keys(STAGE_VIDEO_MAP);

/**
 * Photo-first crop-stage card. Video stays optional — looping clips
 * were making the farm page feel like a player, not a field guide.
 */
export default function WheatStageVisualizer(props: WheatStageVideoPlayerProps) {
  const { currentStage, selectedStage, das, totalDays = 135, onSelectStage, className } = props;
  const [showVideo, setShowVideo] = useState(false);

  if (showVideo) {
    return (
      <div className={className}>
        <button
          type="button"
          onClick={() => setShowVideo(false)}
          className="mb-2 text-[11px] font-bold text-emerald-800 dark:text-emerald-300"
        >
          ← फोटो गाइड पर वापस
        </button>
        <WheatStageVideoPlayer {...props} />
      </div>
    );
  }

  const meta = STAGE_VIDEO_MAP[selectedStage.stageId] || STAGE_VIDEO_MAP.germination;
  const isCurrent = selectedStage.stageId === currentStage.stageId;
  const progress = Math.min(100, Math.max(0, Math.round((das / Math.max(1, totalDays)) * 100)));
  const work = selectedStage.importantActivitiesHi?.[0];

  return (
    <section
      className={cn(
        "overflow-hidden rounded-3xl border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 px-4 pt-4">
        <div className="min-w-0">
          <h2 className="text-[17px] font-semibold text-[var(--av-text-primary)]">
            {selectedStage.stageNameHi}
          </h2>
          <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)]">
            बुवाई के {selectedStage.typicalDaysRange[0]}–{selectedStage.typicalDaysRange[1]} दिन
            {isCurrent ? " · अभी आपकी फसल यहीं है" : ""}
          </p>
        </div>
        <div className="rounded-2xl bg-[var(--av-surface-inset)] px-3 py-2 text-right">
          <p className="text-[18px] font-black leading-none text-emerald-800 dark:text-emerald-300">
            {das}
          </p>
          <p className="mt-0.5 text-[10px] font-semibold text-[var(--av-text-muted)]">दिन बाद</p>
        </div>
      </div>

      <div className="relative mx-4 mt-3 h-[210px] overflow-hidden rounded-2xl bg-[var(--av-surface-inset)]">
        <Image
          src={meta.photo}
          alt={selectedStage.stageNameHi}
          fill
          sizes="(max-width: 640px) 100vw, 640px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-8">
          <p className="text-[12px] font-bold text-white">
            चरण {meta.order} · {meta.phase}
          </p>
        </div>
      </div>

      <div className="mx-4 mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--av-surface-inset)]">
        <div className="h-full rounded-full bg-emerald-600" style={{ width: `${progress}%` }} />
      </div>
      <p className="mx-4 mt-1 text-[10px] font-semibold text-[var(--av-text-muted)]">
        फसल का सफर {progress}%
      </p>

      <div className="mt-3 flex gap-1 overflow-x-auto px-4 pb-1">
        {STAGE_ORDER.map((id) => {
          const item = STAGE_VIDEO_MAP[id];
          const selected = id === selectedStage.stageId;
          const current = id === currentStage.stageId;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectStage?.(id)}
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold",
                selected
                  ? "bg-emerald-700 text-white"
                  : current
                    ? "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100"
                    : "bg-[var(--av-surface-inset)] text-[var(--av-text-secondary)]"
              )}
            >
              {item.order}. {item.label}
            </button>
          );
        })}
      </div>

      <div className="m-4 space-y-2 rounded-2xl bg-[var(--av-surface-inset)] p-3">
        <p className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--av-text-primary)]">
          <Info className="h-3.5 w-3.5 text-emerald-700" />
          खेत में कैसे पहचानें
        </p>
        <p className="text-[12px] leading-relaxed text-[var(--av-text-secondary)]">
          {selectedStage.descriptionHi}
        </p>
        {work ? (
          <p className="flex items-start gap-1.5 rounded-xl bg-emerald-50 px-2.5 py-2 text-[12px] font-semibold text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-100">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            आज का काम: {work}
          </p>
        ) : null}
        {selectedStage.irrigationConsiderationsHi ? (
          <p className="flex items-start gap-1.5 text-[11px] text-sky-800 dark:text-sky-200">
            <Droplets className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {selectedStage.irrigationConsiderationsHi}
          </p>
        ) : null}
        {selectedStage.commonMistakesHi?.[0] ? (
          <p className="flex items-start gap-1.5 text-[11px] text-amber-800 dark:text-amber-200">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {selectedStage.commonMistakesHi[0]}
          </p>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-2 px-4 pb-4">
        <p className="flex items-center gap-1 text-[11px] text-[var(--av-text-muted)]">
          <CalendarDays className="h-3.5 w-3.5" />
          बुवाई से आज तक {das} दिन
        </p>
        <button
          type="button"
          onClick={() => setShowVideo(true)}
          className="inline-flex items-center gap-1 rounded-xl border border-[var(--av-border)] px-2.5 py-1.5 text-[11px] font-bold text-[var(--av-text-secondary)]"
        >
          <Play className="h-3 w-3" />
          वीडियो
        </button>
      </div>
    </section>
  );
}
