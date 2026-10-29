"use client";

import { useState } from "react";
import AppLink from "@/components/ui/AppLink";
import { useFarmData } from "@/hooks/useFarmData";
import { Plus, Tractor, ChevronRight, Ruler } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import HomeFieldMeasureModal from "@/components/farm/HomeFieldMeasureModal";

export default function HomeFarmSnapshot() {
  const { data: farm, stats } = useFarmData();
  const hasFields = farm.fields.length > 0;
  const reduced = useReducedMotion();
  const [showMeasureModal, setShowMeasureModal] = useState(false);

  return (
    <>
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: MOTION.slow, ease: EASE_OUT, delay: 0.05 }}
        className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-emerald-500/[0.09] via-[var(--av-surface)] to-transparent px-3.5 py-3 shadow-sm"
      >
        <div className="pointer-events-none absolute inset-0 agriveda-shimmer opacity-40" />
        <div className="relative flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/25 shadow-sm">
              <Tractor className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[var(--av-text-primary)]">अपना खेत (My Farm)</p>
              {hasFields ? (
                <p className="truncate text-[10.5px] text-[var(--av-text-muted)]">
                  {stats.totalFields} खेत · {stats.totalAreaAcres.toFixed(1)} एकड़ · {stats.cropsGrowing} फसल
                </p>
              ) : (
                <p className="truncate text-[10.5px] text-emerald-700 dark:text-emerald-300 font-medium">
                  उपग्रह से सीमा बनाएं या लोकेशन सहेजें
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowMeasureModal(true)}
              className="inline-flex items-center gap-1 rounded-xl border border-emerald-500/40 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 text-[11px] font-bold shadow-sm active:scale-95 transition"
              title="उपग्रह या GPS से अपना खेत नापें"
            >
              <Ruler className="h-3.5 w-3.5" />
              <span>खेत नापें</span>
            </button>
            <AppLink
              href="/my-farm"
              className="inline-flex shrink-0 items-center gap-0.5 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] hover:bg-[var(--av-surface-inset)] px-2 py-1.5 text-[10px] font-bold text-[var(--av-text-secondary)] transition active:scale-95"
            >
              <span>खोलें</span>
              <ChevronRight className="h-3 w-3" />
            </AppLink>
          </div>
        </div>

        {/* 360° Quick Launch Pills when fields exist */}
        {hasFields && farm.fields[0] && (
          <div className="relative mt-2.5 pt-2 border-t border-emerald-500/15 grid grid-cols-3 gap-1.5 text-[11px]">
            <AppLink
              href={`/my-farm/${farm.fields[0].id}?tab=live`}
              className="py-1 px-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 font-bold text-center transition truncate"
            >
              🌾 लाइव खेत
            </AppLink>
            <AppLink
              href={`/my-farm/${farm.fields[0].id}?tab=radar`}
              className="py-1 px-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-900 dark:text-teal-200 font-bold text-center transition truncate"
            >
              🛰️ स्वास्थ्य रडार
            </AppLink>
            <AppLink
              href={`/my-farm/${farm.fields[0].id}?tab=journey`}
              className="py-1 px-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-200 font-bold text-center transition truncate"
            >
              📅 फसल सफर
            </AppLink>
          </div>
        )}
      </motion.div>

      {/* Instant Home Field Measurement Popup Modal */}
      <HomeFieldMeasureModal
        isOpen={showMeasureModal}
        onClose={() => setShowMeasureModal(false)}
      />
    </>
  );
}
