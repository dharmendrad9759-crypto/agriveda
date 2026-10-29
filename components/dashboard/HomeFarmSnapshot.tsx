"use client";

import { useState } from "react";
import AppLink from "@/components/ui/AppLink";
import { useFarmData } from "@/hooks/useFarmData";
import {
  Tractor,
  ChevronRight,
  Ruler,
  Compass,
  Radio,
  Sprout,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import HomeFieldMeasureModal from "@/components/farm/HomeFieldMeasureModal";

export default function HomeFarmSnapshot() {
  const { data: farm, stats } = useFarmData();
  const hasFields = farm.fields.length > 0;
  const firstField = farm.fields[0];
  const reduced = useReducedMotion();
  const [showMeasureModal, setShowMeasureModal] = useState(false);

  return (
    <>
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: MOTION.slow, ease: EASE_OUT, delay: 0.05 }}
        className="relative overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3.5 py-3 shadow-[var(--av-shadow-sm)]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl"
        />

        <div className="relative flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/15 dark:text-emerald-300">
              {hasFields && firstField?.emoji ? (
                <span className="text-base leading-none" aria-hidden>
                  {firstField.emoji}
                </span>
              ) : (
                <Tractor className="h-4 w-4" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-[var(--av-text-primary)]">
                मेरा खेत
              </p>
              {hasFields ? (
                <p className="truncate text-[10.5px] text-[var(--av-text-muted)]">
                  {stats.totalFields} खेत · {stats.totalAreaAcres.toFixed(1)} एकड़ ·{" "}
                  {stats.cropsGrowing} फसल
                </p>
              ) : (
                <p className="truncate text-[10.5px] font-medium text-emerald-700 dark:text-emerald-300">
                  उपग्रह से सीमा बनाएं या लोकेशन सहेजें
                </p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setShowMeasureModal(true)}
              className="inline-flex items-center gap-1 rounded-xl bg-emerald-700 px-2.5 py-1.5 text-[10.5px] font-semibold text-white shadow-sm transition hover:bg-emerald-800 active:scale-95"
              title="उपग्रह या GPS से खेत नापें"
            >
              <Ruler className="h-3.5 w-3.5" />
              नापें
            </button>
            <AppLink
              href="/my-farm"
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-muted)] transition hover:text-[var(--av-text-primary)] active:scale-95"
              aria-label="मेरा खेत खोलें"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </AppLink>
          </div>
        </div>

        {hasFields && firstField ? (
          <div className="relative mt-2.5 grid grid-cols-3 gap-1 rounded-xl bg-[var(--av-surface-inset)] p-1">
            <AppLink
              href={`/my-farm/${firstField.id}?tab=live`}
              className="flex items-center justify-center gap-1 rounded-lg py-1.5 text-[10.5px] font-medium text-[var(--av-text-secondary)] transition hover:bg-[var(--av-surface)] hover:text-[var(--av-text-primary)] hover:shadow-sm active:scale-95"
            >
              <Compass className="h-3 w-3 text-emerald-600 dark:text-emerald-300" />
              लाइव
            </AppLink>
            <AppLink
              href={`/my-farm/${firstField.id}?tab=radar`}
              className="flex items-center justify-center gap-1 rounded-lg py-1.5 text-[10.5px] font-medium text-[var(--av-text-secondary)] transition hover:bg-[var(--av-surface)] hover:text-[var(--av-text-primary)] hover:shadow-sm active:scale-95"
            >
              <Radio className="h-3 w-3 text-teal-600 dark:text-teal-300" />
              स्वास्थ्य
            </AppLink>
            <AppLink
              href={`/my-farm/${firstField.id}?tab=journey`}
              className="flex items-center justify-center gap-1 rounded-lg py-1.5 text-[10.5px] font-medium text-[var(--av-text-secondary)] transition hover:bg-[var(--av-surface)] hover:text-[var(--av-text-primary)] hover:shadow-sm active:scale-95"
            >
              <Sprout className="h-3 w-3 text-amber-600 dark:text-amber-300" />
              सफर
            </AppLink>
          </div>
        ) : null}
      </motion.div>

      <HomeFieldMeasureModal
        isOpen={showMeasureModal}
        onClose={() => setShowMeasureModal(false)}
      />
    </>
  );
}
