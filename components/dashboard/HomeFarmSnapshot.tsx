"use client";

import AppLink from "@/components/ui/AppLink";
import { useFarmData } from "@/hooks/useFarmData";
import { Plus, Tractor, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";

export default function HomeFarmSnapshot() {
  const { data: farm, stats } = useFarmData();
  const hasFields = farm.fields.length > 0;
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MOTION.slow, ease: EASE_OUT, delay: 0.05 }}
      className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/[0.08] via-[var(--av-surface)] to-transparent px-3 py-2.5"
    >
      <div className="pointer-events-none absolute inset-0 agriveda-shimmer opacity-40" />
      <div className="relative flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500 ring-1 ring-emerald-500/25">
            <Tractor className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[var(--av-text-primary)]">My Farm</p>
            {hasFields ? (
              <p className="truncate text-[10px] text-[var(--av-text-muted)]">
                {stats.totalFields} खेत · {stats.totalAreaAcres.toFixed(1)} एकड़ · {stats.cropsGrowing} फसल
              </p>
            ) : (
              <p className="truncate text-[10px] text-[var(--av-text-muted)]">खेत जोड़ें — अपना data</p>
            )}
          </div>
        </div>
        <AppLink
          href="/my-farm"
          className="inline-flex shrink-0 items-center gap-0.5 rounded-xl bg-[var(--av-accent)] px-2.5 py-1.5 text-[10px] font-bold text-white shadow-sm transition hover:brightness-110 active:scale-95"
        >
          {hasFields ? (
            <>
              Open <ChevronRight className="h-3 w-3" />
            </>
          ) : (
            <>
              <Plus className="h-3 w-3" /> Add
            </>
          )}
        </AppLink>
      </div>
    </motion.div>
  );
}
