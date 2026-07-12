"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface ExpandablePanelProps {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: LucideIcon;
  accent?: "green" | "amber" | "sky" | "rose" | "violet";
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const ACCENT: Record<string, string> = {
  green: "border-[#10b981]/30 bg-[var(--av-accent)]/5 text-[var(--av-accent)]",
  amber: "border-amber-500/30 bg-amber-500/5 text-amber-400",
  sky: "border-sky-500/30 bg-sky-500/5 text-sky-400",
  rose: "border-rose-500/30 bg-rose-500/5 text-rose-400",
  violet: "border-violet-500/30 bg-violet-500/5 text-violet-400",
};

export default function ExpandablePanel({
  title,
  subtitle,
  badge,
  icon: Icon,
  accent = "green",
  defaultOpen = false,
  children,
}: ExpandablePanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  const reduced = useReducedMotion();

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-[52px] w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--av-surface-inset)]/50"
      >
        {Icon && (
          <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border", ACCENT[accent])}>
            <Icon className="h-4 w-4" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-[var(--av-text-primary)]">{title}</p>
            {badge && (
              <span className="rounded bg-[var(--av-surface-inset)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--av-accent)]">
                {badge}
              </span>
            )}
          </div>
          {subtitle && !open && (
            <p className="mt-0.5 line-clamp-1 text-xs text-[var(--av-text-muted)]">{subtitle}</p>
          )}
        </div>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 shrink-0 text-[var(--av-text-muted)]" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-[var(--av-border)] px-4 py-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Timing badge for DAS / DAT */
export function TimingBadge({ timing, ref: timingRef }: { timing: string; ref?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-[#10b981]/30 bg-[var(--av-accent)]/10 px-2 py-1 text-[11px] font-bold text-[var(--av-accent)]">
      {timingRef && <span className="opacity-70">{timingRef}</span>}
      {timing}
    </span>
  );
}
