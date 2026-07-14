"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CROP_TABS, type CropTabId } from "@/lib/crops/crop-tabs";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/cn";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";

const RING_BY_TAB: Record<CropTabId, string> = {
  overview: "ring-emerald-500/40",
  growth: "ring-lime-500/40",
  fertilizer: "ring-amber-500/40",
  pests: "ring-orange-500/40",
  diseases: "ring-red-500/40",
  nutrients: "ring-violet-500/40",
  irrigation: "ring-cyan-500/40",
  weeds: "ring-green-500/40",
  calendar: "ring-indigo-500/40",
  varieties: "ring-yellow-500/40",
  harvest: "ring-orange-400/40",
  faq: "ring-slate-500/40",
  expert: "ring-teal-500/40",
};

const LABEL_HI: Partial<Record<CropTabId, string>> = {
  overview: "ओवरव्यू",
  growth: "वृद्धि",
  fertilizer: "उर्वरक",
  pests: "कीट",
  diseases: "रोग",
  nutrients: "पोषक",
  irrigation: "पानी",
  weeds: "खरपतवार",
  calendar: "कैलेंडर",
  varieties: "किस्में",
  harvest: "कटाई",
  faq: "FAQ",
  expert: "टिप्स",
};

interface CropPageTabsProps {
  active: CropTabId;
  onChange: (tab: CropTabId) => void;
}

/** Home-style tool grid — no horizontal slider */
export default function CropPageTabs({ active, onChange }: CropPageTabsProps) {
  const reduced = useReducedMotion();
  const { locale } = useLocale();
  const isHi = locale === "hi" || locale === "hinglish";

  return (
    <nav className="mb-5 min-w-0" aria-label="Crop sections">
      <p className="mb-1.5 px-0.5 text-xs font-bold text-[var(--av-text-primary)]">
        {isHi ? "फसल गाइड" : "Crop guide"}
      </p>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7">
        {CROP_TABS.map((tab, i) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <motion.div
              key={tab.id}
              className="min-w-0"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 10) * 0.02, duration: MOTION.normal, ease: EASE_OUT }}
            >
              <button
                type="button"
                onClick={() => onChange(tab.id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex h-full w-full flex-col items-center gap-1 rounded-2xl border p-2.5 text-center shadow-sm transition duration-200 active:scale-[0.97]",
                  isActive
                    ? "border-emerald-500/45 bg-emerald-500/10 shadow-[0_8px_24px_rgba(0,100,50,0.14)]"
                    : "border-[var(--av-border)] bg-[var(--av-surface)] hover:-translate-y-0.5 hover:border-[var(--av-accent)]/35 hover:shadow-[0_8px_24px_rgba(0,100,50,0.12)]"
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/15 to-transparent ring-1",
                    RING_BY_TAB[tab.id]
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 transition group-hover:scale-110",
                      isActive ? "text-emerald-600 dark:text-emerald-400" : "text-[var(--av-accent)]"
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "line-clamp-2 text-[10px] font-bold leading-tight",
                    isActive ? "text-emerald-700 dark:text-emerald-300" : "text-[var(--av-text-primary)]"
                  )}
                >
                  {isHi ? LABEL_HI[tab.id] ?? tab.shortLabel : tab.shortLabel}
                </span>
              </button>
            </motion.div>
          );
        })}
      </div>
    </nav>
  );
}
