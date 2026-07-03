"use client";

import Link from "next/link";
import type { OutbreakListSummary } from "@/types/outbreak";
import { AlertTriangle, ChevronRight } from "lucide-react";

function daysAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / (24 * 60 * 60 * 1000));
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

interface OutbreakListViewProps {
  summaries: OutbreakListSummary[];
}

export default function OutbreakListView({ summaries }: OutbreakListViewProps) {
  if (summaries.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm theme-text-muted dark:border-white/10">
        No nearby outbreak reports in the last 14 days.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {summaries.map((s) => (
        <li key={`${s.cropId}-${s.threatType}-${s.pestOrDiseaseId}`}>
          <Link
            href={s.advisoryUrl}
            className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white/50 px-4 py-3 transition hover:border-emerald-500/30 dark:border-white/10 dark:bg-black/20"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold theme-text-primary">
                {s.reportCount} report{s.reportCount > 1 ? "s" : ""} of {s.threatName}
              </p>
              <p className="text-xs theme-text-muted">
                within {s.nearestDistanceKm} km on {s.cropName} • last reported {daysAgo(s.lastReportDate)}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 flex-shrink-0 text-emerald-500" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
