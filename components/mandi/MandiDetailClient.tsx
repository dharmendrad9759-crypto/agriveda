"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Heart,
  MapPin,
  Share2,
} from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import { Sparkline } from "@/components/shell/charts";
import { DetailStatsCard, PriceSummaryCard } from "@/components/mandi/PriceSummaryCard";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMandiPrices } from "@/hooks/useMandiPrices";
import { resolveCropImage } from "@/lib/crops/cropImages";
import { cn } from "@/lib/cn";

function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

export default function MandiDetailClient({ id }: { id: string }) {
  const { profile } = useFarmerProfile();
  const state = profile.state.trim() || "Madhya Pradesh";
  const district = profile.district.trim() || undefined;
  const { data, loading } = useMandiPrices({ state, district });
  const [fav, setFav] = useState(false);

  const row = useMemo(
    () => data?.rows.find((r) => r.id === id || encodeURIComponent(r.id) === id),
    [data?.rows, id]
  );

  const image = resolveCropImage({ slug: row?.crop ?? "paddy", name: row?.crop });

  const periods = useMemo(() => {
    if (!row) return [];
    const t = row.trend.length ? row.trend : [row.modal];
    const week = t.slice(-7);
    const monthish = t;
    return [
      { label: "Today’s price", value: row.modal, hint: "Modal rate now" },
      { label: "This week", value: avg(week), hint: "Avg of recent days" },
      { label: "This month", value: avg(monthish), hint: "Recent window avg" },
      { label: "Last 30 days", value: avg(monthish), hint: "Trend sample" },
    ];
  }, [row]);

  const locationLabel = district ? `${district}, ${state}` : row?.mandi || state;
  const up = (row?.change ?? 0) >= 0;
  const dateLabel =
    row?.arrivalDate ||
    data?.lastUpdated?.split(",")[0] ||
    new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <AppShell
      className="!bg-[#f3faf5]"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Mandi", href: "/mandi" },
        { label: row?.crop ?? "Detail" },
      ]}
    >
      <div className="mb-3 flex items-center justify-between">
        <AppLink
          href="/mandi"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm active:scale-95"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </AppLink>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (typeof navigator !== "undefined" && navigator.share && row) {
                void navigator.share({
                  title: `${row.crop} mandi rate`,
                  text: `${row.crop} @ ₹${row.modal}/qtl · ${row.mandi}`,
                });
              }
            }}
            className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-sm active:scale-95"
            aria-label="Share"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setFav((v) => !v)}
            className={cn(
              "rounded-full border bg-white p-2 shadow-sm active:scale-95",
              fav ? "border-rose-200 text-rose-500" : "border-slate-200 text-slate-600"
            )}
            aria-label="Favorite"
          >
            <Heart className={cn("h-4 w-4", fav && "fill-current")} />
          </button>
        </div>
      </div>

      {loading && !row ? (
        <div className="space-y-3">
          <div className="h-40 animate-pulse rounded-[24px] bg-white" />
          <div className="h-28 animate-pulse rounded-[24px] bg-white" />
        </div>
      ) : !row ? (
        <div className="rounded-[22px] border border-dashed border-slate-200 bg-white px-4 py-12 text-center">
          <p className="text-sm font-bold text-slate-800">Price not found</p>
          <AppLink href="/mandi" className="mt-3 inline-block text-xs font-bold text-emerald-700">
            ← Back to Mandi list
          </AppLink>
        </div>
      ) : (
        <div className="space-y-3.5">
          <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
            <div className="relative h-36 w-full bg-gradient-to-br from-emerald-50 to-lime-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={row.crop}
                className="h-full w-full object-cover object-center opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>
            <div className="relative -mt-6 space-y-2 px-4 pb-4">
              <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                Grade · {row.variety || "FAQ"}
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                {row.cropHi ? `${row.cropHi} · ` : ""}
                {row.crop}
              </h1>
              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                {row.mandi}
                {row.state ? `, ${row.state}` : ""} · {locationLabel}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                <CalendarDays className="h-3.5 w-3.5 text-emerald-600" />
                Price date · {dateLabel}
              </p>
            </div>
          </div>

          <PriceSummaryCard modal={row.modal} change={row.change} changeAmt={row.changeAmt} />
          <DetailStatsCard min={row.min} max={row.max} />

          <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-900">Price trend</p>
              <BarChart3 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex justify-center py-2">
              <Sparkline
                data={row.trend}
                color={up ? "#059669" : "#e11d48"}
                width={280}
                height={56}
              />
            </div>
          </div>

          <div className="space-y-2">
            {periods.map((p) => (
              <div
                key={p.label}
                className="flex items-center justify-between rounded-[20px] border border-slate-200 bg-white px-4 py-3.5 shadow-sm"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">{p.label}</p>
                  <p className="text-[10px] text-slate-400">{p.hint}</p>
                </div>
                <p className="text-lg font-black text-slate-900">₹{p.value.toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>

          <AppLink
            href="/market-trends"
            className="flex items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 py-3 text-xs font-bold text-emerald-700"
          >
            Open full market analytics →
          </AppLink>
        </div>
      )}
    </AppShell>
  );
}
