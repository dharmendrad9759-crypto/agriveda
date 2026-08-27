"use client";

import AppLink from "@/components/ui/AppLink";
import { useCropMandiPrice } from "@/hooks/useCropMandiPrice";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/cn";
import { ChevronRight, MapPin, TrendingDown, TrendingUp } from "lucide-react";

interface CropMandiPriceStripProps {
  cropSlug: string;
  className?: string;
}

export default function CropMandiPriceStrip({ cropSlug, className }: CropMandiPriceStripProps) {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const { row, loading, locationLabel, hasMapping } = useCropMandiPrice(cropSlug);

  if (!hasMapping) return null;

  if (loading) {
    return (
      <div
        className={cn(
          "mt-3 animate-pulse rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-3 py-2.5",
          className
        )}
      >
        <div className="h-4 w-2/3 rounded bg-emerald-500/15" />
        <div className="mt-2 h-3 w-1/2 rounded bg-emerald-500/10" />
      </div>
    );
  }

  if (!row) {
    return (
      <AppLink
        href="/mandi"
        className={cn(
          "mt-3 flex items-center justify-between gap-2 rounded-xl border border-dashed border-emerald-500/25 bg-emerald-500/5 px-3 py-2.5",
          className
        )}
      >
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-[var(--av-text-primary)]">
            {hi ? "मंडी भाव" : "Mandi price"}
          </p>
          <p className="text-[10px] text-[var(--av-text-muted)]">
            {hi
              ? `${locationLabel} — अभी भाव नहीं मिला, मंडी पेज देखें`
              : `${locationLabel} — open mandi for rates`}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-emerald-600" />
      </AppLink>
    );
  }

  const up = row.change >= 0;
  const changeAmt =
    row.changeAmt || Math.round(Math.abs((row.modal * row.change) / 100));

  return (
    <AppLink
      href={`/mandi/${encodeURIComponent(row.id)}`}
      className={cn(
        "mt-3 block rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/8 to-transparent px-3 py-2.5 transition active:scale-[0.99]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
            {hi ? "आज का मंडी भाव" : "Today's mandi rate"}
          </p>
          <p className="mt-0.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
            <span className="text-xl font-black leading-none text-[var(--av-text-primary)]">
              ₹{row.modal.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] font-semibold text-[var(--av-text-muted)]">
              {hi ? "प्रति क्विंटल" : "per quintal"}
            </span>
          </p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold",
            up
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200"
              : "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200"
          )}
        >
          {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {up ? "+" : "−"}₹{changeAmt}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[10px] font-medium text-[var(--av-text-muted)]">
        <span className="flex min-w-0 items-center gap-1">
          <MapPin className="h-3 w-3 shrink-0 text-rose-500" />
          <span className="truncate">
            {row.mandi}
            {row.state ? `, ${row.state}` : ""}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-0.5 font-bold text-emerald-700 dark:text-emerald-300">
          {hi ? "सभी मंडी भाव" : "All mandi rates"}
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>

      <p className="mt-1.5 text-[9px] text-[var(--av-text-muted)]">
        {hi ? "कम" : "Low"} ₹{row.min.toLocaleString("en-IN")} · {hi ? "ज़्यादा" : "High"}{" "}
        ₹{row.max.toLocaleString("en-IN")}
        {row.variety ? ` · ${row.variety}` : ""}
      </p>
    </AppLink>
  );
}
