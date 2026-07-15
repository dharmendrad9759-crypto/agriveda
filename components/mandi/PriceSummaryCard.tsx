"use client";

import { cn } from "@/lib/cn";

export function PriceSummaryCard({
  modal,
  change,
  changeAmt,
  unit = "/ Quintal",
}: {
  modal: number;
  change: number;
  changeAmt: number;
  unit?: string;
}) {
  const up = change >= 0;
  return (
    <div className="rounded-[24px] border border-emerald-500/15 bg-gradient-to-br from-emerald-600 to-emerald-700 p-5 text-white shadow-[0_16px_40px_rgba(5,150,105,0.28)]">
      <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-100/90">Current modal rate</p>
      <p className="mt-2 text-4xl font-black tracking-tight">
        ₹{modal.toLocaleString("en-IN")}
        <span className="ml-1 text-sm font-semibold text-emerald-100/80">{unit}</span>
      </p>
      <p
        className={cn(
          "mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-bold",
          up ? "bg-white/20 text-white" : "bg-rose-500/30 text-rose-50"
        )}
      >
        {up ? "▲" : "▼"} {up ? "+" : ""}
        {change}%
        {changeAmt ? ` (₹${changeAmt > 0 ? "+" : ""}${changeAmt})` : ""}
      </p>
    </div>
  );
}

export function DetailStatsCard({
  min,
  max,
}: {
  min: number;
  max: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Min price</p>
        <p className="mt-1 text-xl font-black text-slate-900">₹{min.toLocaleString("en-IN")}</p>
      </div>
      <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Max price</p>
        <p className="mt-1 text-xl font-black text-slate-900">₹{max.toLocaleString("en-IN")}</p>
      </div>
    </div>
  );
}
