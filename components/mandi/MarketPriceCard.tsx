"use client";

import AppLink from "@/components/ui/AppLink";
import type { MandiRow } from "@/lib/mandi/types";
import { resolveCropImage } from "@/lib/crops/cropImages";
import { MapPin, TrendingDown, TrendingUp } from "lucide-react";
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
  const title = row.cropHi?.trim() || row.crop;
  const sub = row.cropHi ? row.crop : "";

  return (
    <AppLink
      href={href}
      className="block overflow-hidden rounded-2xl border border-emerald-500/15 bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)] transition active:scale-[0.99]"
    >
      <div className="flex min-h-[96px]">
        <div className="relative w-[88px] shrink-0 overflow-hidden sm:w-28">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--av-surface)]/30" />
        </div>

        <div className="min-w-0 flex-1 px-3 py-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold text-[var(--av-text-primary)]">{title}</p>
              {sub ? (
                <p className="truncate text-[11px] text-[var(--av-text-muted)]">{sub}</p>
              ) : null}
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[1.35rem] font-black leading-none text-emerald-700 dark:text-emerald-300">
                ₹{row.modal.toLocaleString("en-IN")}
              </p>
              <span
                className={cn(
                  "mt-1.5 inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold",
                  up
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200"
                    : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-200"
                )}
              >
                {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {up ? "+" : ""}₹
                {Math.abs(row.changeAmt || Math.round((row.modal * row.change) / 100))}
              </span>
            </div>
          </div>

          <p className="mt-2 flex items-center gap-1 text-[11px] font-medium text-[var(--av-text-muted)]">
            <MapPin className="h-3 w-3 shrink-0 text-rose-500" />
            <span className="truncate">
              {row.mandi}
              {row.state ? `, ${row.state}` : ""}
            </span>
          </p>

          <div className="mt-2 flex justify-between text-[10px] font-semibold text-[var(--av-text-muted)]">
            <span>कम ₹{row.min.toLocaleString("en-IN")}</span>
            <span>ज़्यादा ₹{row.max.toLocaleString("en-IN")}</span>
            {dateLabel ? <span className="hidden sm:inline">{dateLabel}</span> : null}
          </div>
        </div>
      </div>
    </AppLink>
  );
}
