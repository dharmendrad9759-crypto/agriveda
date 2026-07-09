"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import type { CropStage } from "@/types/crop-management";

const STAGE_EMOJI = ["🌱", "🌿", "🌸", "🍃", "🌾", "✅", "🚜"];

interface Props {
  stages: CropStage[];
}

export default function AnimatedGrowthTimeline({ stages }: Props) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-4">
      {/* Horizontal animated strip — mobile friendly */}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 scrollbar-hide">
        {stages.map((stage, i) => {
          const isActive = active === i;
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
                "relative flex min-h-[64px] min-w-[84px] shrink-0 flex-col items-center justify-center rounded-lg border px-1.5 py-2 transition-colors duration-200",
                isActive
                  ? "border-[var(--av-accent)]/60 bg-[var(--av-accent-soft)]"
                  : "border-[var(--av-border)] bg-[var(--av-surface)]"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="growth-stage-glow"
                  className="absolute inset-0 rounded-xl ring-1 ring-[#10b981]/40"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative text-[10px] font-bold text-[var(--av-accent)]">{i + 1}</span>
              <span className="relative mt-0.5 line-clamp-2 text-center text-[9px] font-bold leading-tight text-[var(--av-text-primary)]">
                {stage.title}
              </span>
              <span className="relative mt-1 rounded bg-[var(--av-surface-inset)] px-1.5 py-0.5 text-[9px] font-semibold text-[var(--av-accent)]">
                {stage.period}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Expanded detail panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={reduced ? false : { opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? undefined : { opacity: 0, x: -12 }}
          transition={{ duration: 0.22 }}
          className="overflow-hidden rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)]"
        >
          <div className="flex items-start gap-3 border-b border-[var(--av-border)] p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--av-accent)]/15 text-lg">
              {STAGE_EMOJI[active % STAGE_EMOJI.length]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[var(--av-text-primary)]">{stages[active]?.title}</p>
              <p className="text-xs text-[var(--av-accent)]">{stages[active]?.period}</p>
            </div>
          </div>
          <ul className="space-y-2 p-4">
            {stages[active]?.keyPoints.map((point, pi) => (
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

      {/* Vertical progress line — desktop accent */}
      <div className="hidden md:block">
        <div className="relative pl-6">
          <div className="absolute bottom-2 left-[11px] top-2 w-0.5 bg-[#1f2937]" />
          <motion.div
            className="absolute left-[11px] top-2 w-0.5 origin-top bg-[var(--av-accent)]"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: (active + 1) / stages.length }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ height: `calc(100% - 16px)` }}
          />
          <div className="space-y-2">
            {stages.map((s, i) => (
              <button
                key={s.title}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs transition-colors",
                  i === active ? "text-[var(--av-accent)]" : "text-[var(--av-text-muted)] hover:text-[var(--av-text-secondary)]"
                )}
              >
                <span
                  className={cn(
                    "absolute -left-6 flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-bold",
                    i <= active
                      ? "border-[#10b981] bg-[var(--av-accent)]/20 text-[var(--av-accent)]"
                      : "border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-muted)]"
                  )}
                >
                  {i + 1}
                </span>
                {s.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
