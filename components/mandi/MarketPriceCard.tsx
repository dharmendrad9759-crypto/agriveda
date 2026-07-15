"use client";

import AppLink from "@/components/ui/AppLink";
import type { MandiRow } from "@/lib/mandi/types";
import { resolveCropImage } from "@/lib/crops/cropImages";
import { CalendarDays, MapPin, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/cn";

export default function MarketPriceCard({
  row,
  dateLabel,
}: {
  row: MandiRow;
  dateLabel?: string;
}) {
  const up = row.change >= 0;
  const href = `/mandi/${encodeURIComponent(row.id)}`;
  const image = resolveCropImage({ slug: row.crop, name: row.crop });
  const span = Math.max(row.max - row.min, 1);
  const pct = Math.min(100, Math.max(0, ((row.modal - row.min) / span) * 100));
  const title = row.cropHi?.trim() || row.crop;
  const sub = row.cropHi ? row.crop : "";

  return (
    <AppLink
      href={href}
      className="block rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-[0_4px_16px_rgba(15,23,42,0.05)] transition active:scale-[0.99]"
    >
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="h-full w-full object-cover" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold text-slate-900">
                {title}
                <span className="ml-1 text-[11px] font-medium text-slate-400">(क्विं.)</span>
              </p>
              {sub ? <p className="truncate text-[11px] text-slate-400">{sub}</p> : null}
            </div>
            <div className="shrink-0 text-right">
              <p className="text-lg font-black leading-none text-[#2563eb]">
                ₹{row.modal.toLocaleString("en-IN")}
              </p>
              <span
                className={cn(
                  "mt-1.5 inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold",
                  up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                )}
              >
                {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {up ? "+" : ""}₹{Math.abs(row.changeAmt || Math.round((row.modal * row.change) / 100))}
              </span>
            </div>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3 text-rose-500" />
              {row.mandi}
              {row.state ? `, ${row.state}` : ""}
            </span>
            {dateLabel ? (
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3 w-3 text-slate-400" />
                {dateLabel}
              </span>
            ) : null}
          </div>

          <div className="mt-3">
            <div className="relative h-1.5 rounded-full bg-slate-100">
              <div
                className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white bg-[#2563eb] shadow"
                style={{ left: `calc(${pct}% - 7px)` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] text-slate-400">
              <span>न्यूनतम ₹{row.min.toLocaleString("en-IN")}</span>
              <span>अधिकतम ₹{row.max.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>
    </AppLink>
  );
}
