"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import GrowthStageImage, {
  growthKindFromStage,
} from "@/components/crops/GrowthStageImage";
import {
  getGrowthStageCropBadge,
  getGrowthStageImage,
} from "@/lib/crops/growthStageImages";
import type { CropStage } from "@/types/crop-management";

interface Props {
  stages: CropStage[];
  cropSlug: string;
  cropName?: string;
}

export default function AnimatedGrowthTimeline({ stages, cropSlug, cropName }: Props) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const activeStage = stages[active];
  const activeKind = activeStage
    ? growthKindFromStage(activeStage.title, activeStage.period)
    : "veg";
  const activeImage = activeStage
    ? getGrowthStageImage({
        cropSlug,
        cropName,
        title: activeStage.title,
        period: activeStage.period,
        index: active,
      })
    : "/images/growth/growth-stage-veg.jpg";

  return (
    <div className="space-y-4">
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 scrollbar-hide">
        {stages.map((stage, i) => {
          const isActive = active === i;
          const kind = growthKindFromStage(stage.title, stage.period);
          const img = getGrowthStageImage({
            cropSlug,
            cropName,
            title: stage.title,
            period: stage.period,
            index: i,
          });
          return (
            <motion.button
              key={`${stage.title}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              whileHover={reduced ? undefined : { scale: 1.04 }}
              whileTap={reduced ? undefined : { scale: 0.97 }}
              className={cn(
                "relative flex min-h-[96px] min-w-[104px] shrink-0 flex-col overflow-hidden rounded-xl border text-left transition-colors duration-200",
                isActive
                  ? "border-[var(--av-accent)] ring-2 ring-[var(--av-accent)]/35"
                  : "border-[var(--av-border)]"
              )}
            >
              <GrowthStageImage src={img} kind={kind} className="absolute inset-0" />
              <span
                className={cn(
                  "absolute inset-0 bg-gradient-to-t",
                  isActive
                    ? "from-emerald-950/92 via-emerald-950/45 to-black/10"
                    : "from-black/85 via-black/40 to-black/10"
                )}
              />
              <span className="relative z-10 mt-auto flex flex-col gap-0.5 p-2">
                <span className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-bold text-emerald-200">{i + 1}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getGrowthStageCropBadge(cropSlug, cropName)}
                    alt=""
                    className="h-5 w-5 rounded-full border border-white/50 object-cover"
                  />
                </span>
                <span className="line-clamp-2 text-[10px] font-extrabold leading-tight text-white">
                  {stage.title}
                </span>
                <span className="rounded bg-black/35 px-1 py-0.5 text-[9px] font-semibold text-emerald-100">
                  {stage.period}
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={reduced ? false : { opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? undefined : { opacity: 0, x: -12 }}
          transition={{ duration: 0.22 }}
          className="overflow-hidden rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)]"
        >
          <div className="relative h-40 w-full sm:h-48">
            <GrowthStageImage src={activeImage} kind={activeKind} className="absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-200">
                {activeStage?.period}
              </p>
              <p className="mt-0.5 text-base font-extrabold text-white">{activeStage?.title}</p>
            </div>
          </div>
          <ul className="space-y-2 p-4">
            {activeStage?.keyPoints.map((point, pi) => (
              <motion.li
                key={point}
                initial={reduced ? false : { opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: pi * 0.05 }}
                className="flex gap-2 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2.5 text-sm leading-relaxed text-[var(--av-text-secondary)]"
              >
                <span className="shrink-0 font-bold text-[var(--av-accent)]">{pi + 1}.</span>
                <span className="break-words text-[var(--av-text-primary)]">{point}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
