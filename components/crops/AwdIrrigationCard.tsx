"use client";

import { useEffect, useState } from "react";
import { Droplets } from "lucide-react";
import { cn } from "@/lib/cn";
import { readStorage, writeStorage } from "@/lib/storage";
import {
  AWD_CHECK_STORAGE_KEY,
  awdTodayKey,
  getAwdGuidance,
} from "@/lib/crops/awdGuidance";

/**
 * Prominent paddy AWD card + tiny same-day tube checklist (localStorage).
 */
export default function AwdIrrigationCard({ hi }: { hi: boolean }) {
  const g = getAwdGuidance();
  const [checkedToday, setCheckedToday] = useState(false);

  useEffect(() => {
    const stored = readStorage<{ date?: string }>(AWD_CHECK_STORAGE_KEY, {});
    setCheckedToday(stored.date === awdTodayKey());
  }, []);

  const toggleCheck = () => {
    const next = !checkedToday;
    setCheckedToday(next);
    writeStorage(AWD_CHECK_STORAGE_KEY, next ? { date: awdTodayKey() } : {});
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-sky-500/35 bg-gradient-to-br from-sky-500/12 via-[var(--av-surface)] to-emerald-500/8">
      <div className="border-b border-sky-500/20 bg-sky-500/10 px-3.5 py-3">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 ring-1 ring-sky-500/30">
            <Droplets className="h-4 w-4 text-sky-700 dark:text-sky-300" />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-extrabold leading-snug text-[var(--av-text-primary)]">
              {hi ? g.titleHi : g.titleEn}
            </p>
            <p className="mt-0.5 text-[11px] font-medium leading-snug text-sky-900/80 dark:text-sky-200/90">
              {hi ? g.subtitleHi : g.subtitleEn}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2.5 p-3.5">
        <ul className="space-y-2">
          {g.steps.map((step) => (
            <li
              key={step.id}
              className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)]/80 px-3 py-2.5"
            >
              <p className="text-xs font-bold text-sky-800 dark:text-sky-300">
                {hi ? step.titleHi : step.titleEn}
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-[var(--av-text-secondary)]">
                {hi ? step.detailHi : step.detailEn}
              </p>
            </li>
          ))}
        </ul>

        <p className="rounded-xl border border-rose-500/25 bg-rose-500/8 px-3 py-2 text-[11px] font-bold leading-snug text-rose-900 dark:text-rose-200">
          {hi ? g.neverStressHi : g.neverStressEn}
        </p>

        <ul className="space-y-1">
          {(hi ? g.safeNotesHi : g.safeNotesEn).map((note) => (
            <li key={note} className="text-[10px] leading-snug text-[var(--av-text-muted)]">
              • {note}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={toggleCheck}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition active:scale-[0.99]",
            checkedToday
              ? "border-emerald-500/40 bg-emerald-500/12"
              : "border-[var(--av-border)] bg-[var(--av-surface-inset)]"
          )}
        >
          <span
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[11px] font-black",
              checkedToday
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-[var(--av-border)] bg-[var(--av-surface)] text-transparent"
            )}
            aria-hidden
          >
            ✓
          </span>
          <span className="text-xs font-bold text-[var(--av-text-primary)]">
            {hi ? g.checklistLabelHi : g.checklistLabelEn}
          </span>
        </button>
      </div>
    </div>
  );
}
