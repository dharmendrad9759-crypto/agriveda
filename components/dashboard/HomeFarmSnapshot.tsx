"use client";

import AppLink from "@/components/ui/AppLink";
import DarkCard from "@/components/shell/DarkCard";
import { useFarmData } from "@/hooks/useFarmData";
import { Plus, Tractor, ChevronRight } from "lucide-react";

export default function HomeFarmSnapshot() {
  const { data: farm, stats } = useFarmData();
  const hasFields = farm.fields.length > 0;

  return (
    <DarkCard hover className="min-w-0 border-emerald-500/15 bg-gradient-to-r from-emerald-500/[0.06] to-transparent">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500">
            <Tractor className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-[var(--av-text-primary)]">My Farm</p>
            {hasFields ? (
              <p className="text-[11px] text-[var(--av-text-muted)]">
                {stats.totalFields} खेत · {stats.totalAreaAcres.toFixed(1)} एकड़ · {stats.cropsGrowing} फसल
              </p>
            ) : (
              <p className="text-[11px] text-[var(--av-text-muted)]">
                अभी कोई खेत नहीं — आप खुद जोड़ेंगे
              </p>
            )}
          </div>
        </div>
        <AppLink
          href="/my-farm"
          className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-[var(--av-accent)] px-3 py-2 text-[11px] font-bold text-white"
        >
          {hasFields ? (
            <>
              Manage <ChevronRight className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" /> खेत जोड़ें
            </>
          )}
        </AppLink>
      </div>
    </DarkCard>
  );
}
