"use client";

import AppLink from "@/components/ui/AppLink";
import { Sparkline } from "@/components/shell/charts";
import type { MandiRow } from "@/lib/mandi/types";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/cn";

export default function MarketPriceCard({ row }: { row: MandiRow }) {
  const up = row.change >= 0;
  const href = `/mandi/${encodeURIComponent(row.id)}`;

  return (
    <AppLink
      href={href}
      className={cn(
        "block rounded-[22px] border border-slate-200/80 bg-white p-3.5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]",
        "transition hover:-translate-y-0.5 hover:border-emerald-300/60 hover:shadow-[0_12px_28px_rgba(16,185,129,0.12)] active:scale-[0.99]"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <p className="text-[15px] font-black tracking-tight text-slate-900">{row.crop}</p>
            {row.cropHi ? (
              <span className="text-[11px] font-medium text-slate-400">{row.cropHi}</span>
            ) : null}
          </div>
          <p className="mt-0.5 truncate text-[11px] text-slate-500">
            {row.mandi}
            {row.variety ? ` · ${row.variety}` : ""}
          </p>
          <div
            className={cn(
              "mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
              up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            )}
          >
            {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {up ? "+" : ""}
            {row.change}%
            {row.changeAmt ? ` · ₹${Math.abs(row.changeAmt)}` : ""}
          </div>
        </div>

        <div className="hidden w-16 shrink-0 sm:block">
          <Sparkline data={row.trend} color={up ? "#059669" : "#e11d48"} width={64} height={28} />
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[18px] font-black leading-none text-slate-900">
            ₹{row.modal.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-[10px] font-medium text-slate-400">/ quintal</p>
          <div className="mt-1.5 sm:hidden">
            <Sparkline data={row.trend} color={up ? "#059669" : "#e11d48"} width={56} height={22} />
          </div>
        </div>
      </div>
    </AppLink>
  );
}
