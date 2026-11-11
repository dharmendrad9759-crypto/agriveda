"use client";

import { useMemo } from "react";
import AppLink from "@/components/ui/AppLink";
import { useFarmData } from "@/hooks/useFarmData";
import { Tractor, ChevronRight, Compass, Radio, Sprout } from "lucide-react";
import { lastFieldId } from "@/lib/farm/fieldName";

export default function HomeFarmSnapshot() {
  const { data: farm, stats } = useFarmData();
  const hasFields = farm.fields.length > 0;
  const firstField = useMemo(() => {
    const last = lastFieldId();
    return farm.fields.find((field) => field.id === last) || farm.fields[0];
  }, [farm.fields]);

  return (
    <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2 shadow-[var(--av-shadow-sm)]">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
          {hasFields && firstField?.emoji ? (
            <span className="text-sm leading-none" aria-hidden>
              {firstField.emoji}
            </span>
          ) : (
            <Tractor className="h-3.5 w-3.5" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold text-[var(--av-text-primary)]">
            {hasFields
              ? `${stats.totalFields} खेत · ${stats.totalAreaAcres.toFixed(1)} एकड़ · ${stats.cropsGrowing} फसल`
              : "खेत जोड़ें"}
          </p>
        </div>
        <AppLink
          href="/my-farm"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--av-text-muted)]"
          aria-label="मेरा खेत खोलें"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </AppLink>
      </div>

      {hasFields && firstField ? (
        <div className="mt-1.5 flex items-center gap-0.5">
          <AppLink
            href={`/my-farm/${firstField.id}?tab=live`}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg py-1 text-[10px] font-medium text-[var(--av-text-secondary)]"
          >
            <Compass className="h-3 w-3 text-emerald-600" />
            स्थिति
          </AppLink>
          <AppLink
            href={`/my-farm/${firstField.id}?tab=radar`}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg py-1 text-[10px] font-medium text-[var(--av-text-secondary)]"
          >
            <Radio className="h-3 w-3 text-teal-600" />
            सेहत
          </AppLink>
          <AppLink
            href={`/my-farm/${firstField.id}?tab=journey`}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg py-1 text-[10px] font-medium text-[var(--av-text-secondary)]"
          >
            <Sprout className="h-3 w-3 text-amber-600" />
            अवस्था
          </AppLink>
        </div>
      ) : null}
    </div>
  );
}
