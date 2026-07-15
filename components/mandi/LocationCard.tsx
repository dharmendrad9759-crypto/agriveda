"use client";

import AppLink from "@/components/ui/AppLink";
import { MapPin } from "lucide-react";

export default function LocationCard({
  locationLabel,
  changeHref = "/profile",
}: {
  locationLabel: string;
  changeHref?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[20px] border border-emerald-500/15 bg-white px-4 py-3 shadow-[0_6px_20px_rgba(15,80,40,0.06)]">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
          <MapPin className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Your mandi area</p>
          <p className="truncate text-sm font-bold text-slate-900">{locationLabel}</p>
        </div>
      </div>
      <AppLink
        href={changeHref}
        className="shrink-0 rounded-full bg-emerald-500/10 px-3 py-1.5 text-[11px] font-bold text-emerald-700 transition active:scale-95"
      >
        Change →
      </AppLink>
    </div>
  );
}
