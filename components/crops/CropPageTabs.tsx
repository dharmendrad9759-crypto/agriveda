"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CROP_TABS, type CropTabId } from "@/lib/crops/crop-tabs";

interface CropPageTabsProps {
  active: CropTabId;
  onChange: (tab: CropTabId) => void;
}

/** Premium segmented control — sticky, spring pill, horizontal scroll */
export default function CropPageTabs({ active, onChange }: CropPageTabsProps) {
  const reduced = useReducedMotion();

  return (
    <nav
      className="sticky top-[52px] z-30 -mx-1 mb-5 py-2 lg:top-14"
      aria-label="Crop sections"
    >
      <div className="crop-segment-track flex gap-1 overflow-x-auto p-1 scrollbar-hide">
        {CROP_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`relative z-10 flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-bold transition-colors sm:px-3.5 sm:text-xs ${
                isActive
                  ? "text-[var(--av-text-primary)]"
                  : "text-[var(--av-text-muted)] hover:text-[var(--av-text-secondary)]"
              }`}
            >
              {isActive && !reduced && (
                <motion.span
                  layoutId="crop-page-tab-pill"
                  className="absolute inset-0 rounded-xl border border-emerald-500/25 bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_16px_rgba(16,185,129,0.12)]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              {isActive && reduced && (
                <span className="absolute inset-0 rounded-xl border border-emerald-500/25 bg-emerald-500/15" />
              )}
              <motion.span
                className="relative text-sm"
                animate={{ scale: isActive ? 1.08 : 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
              >
                {tab.emoji}
              </motion.span>
              <Icon className="relative hidden h-3.5 w-3.5 shrink-0 sm:block" />
              <span className="relative whitespace-nowrap">{tab.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
