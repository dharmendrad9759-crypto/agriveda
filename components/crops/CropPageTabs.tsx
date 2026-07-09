"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CROP_TABS, type CropTabId } from "@/lib/crops/crop-tabs";

interface CropPageTabsProps {
  active: CropTabId;
  onChange: (tab: CropTabId) => void;
}

/** Single tab bar for crop detail — photo mockup style */
export default function CropPageTabs({ active, onChange }: CropPageTabsProps) {
  const reduced = useReducedMotion();

  return (
    <nav
      className="sticky top-[52px] z-30 -mx-1 mb-4 border-b border-[var(--av-border)] bg-[var(--background)]/95 px-1 pb-px backdrop-blur-md lg:top-14"
      aria-label="Crop sections"
    >
      <div className="flex gap-0.5 overflow-x-auto scrollbar-hide">
        {CROP_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`relative flex min-h-[36px] shrink-0 items-center gap-1.5 px-2.5 py-2 text-xs font-semibold sm:px-3 ${
                isActive
                  ? "text-[var(--av-accent)]"
                  : "text-[var(--av-text-muted)] hover:text-[var(--av-text-primary)]"
              }`}
            >
              {isActive && !reduced && (
                <motion.span
                  layoutId="crop-page-tab"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--av-accent)]"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              {isActive && reduced && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--av-accent)]" />
              )}
              <Icon className="relative z-10 h-3.5 w-3.5 shrink-0" />
              <span className="relative z-10 whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
