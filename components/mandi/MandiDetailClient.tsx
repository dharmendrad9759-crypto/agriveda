"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Folder,
  Heart,
  Info,
  LineChart,
  MapPin,
  Share2,
  Star,
} from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMandiPrices } from "@/hooks/useMandiPrices";
import { resolveCropImage } from "@/lib/crops/cropImages";
import { cn } from "@/lib/cn";

function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

function maxOf(nums: number[], fallback: number) {
  return nums.length ? Math.max(...nums) : fallback;
}

function minOf(nums: number[], fallback: number) {
  return nums.length ? Math.min(...nums) : fallback;
}

function ChangePill({ amount, tone }: { amount: number; tone: "up" | "down" | "flat" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold",
        tone === "up" && "bg-emerald-50 text-emerald-600",
        tone === "down" && "bg-rose-50 text-rose-600",
        tone === "flat" && "bg-slate-100 text-slate-500"
      )}
    >
      {tone === "up" ? "▲" : tone === "down" ? "▼" : "∼"} ₹{Math.abs(amount).toLocaleString("en-IN")}
    </span>
  );
}

function PeriodCard({
  title,
  icon,
  iconClass,
  modal,
  high,
  low,
  change,
  tone,
  footer,
}: {
  title: string;
  icon: ReactNode;
  iconClass: string;
  modal: number;
  high: number;
  low: number;
  change: number;
  tone: "up" | "down" | "flat";
  footer?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
      <div className={cn("flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold text-slate-700", iconClass)}>
        {icon}
        {title}
      </div>
      <div className="space-y-2 px-3.5 py-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">मुख्य भाव</span>
          <span className="font-bold text-slate-900">₹{modal.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">अधिकतम</span>
          <span className="font-semibold text-slate-800">₹{high.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">न्यूनतम</span>
          <span className="font-semibold text-slate-800">₹{low.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <ChangePill amount={change} tone={tone} />
          {footer ? <span className="text-[10px] text-slate-400">{footer}</span> : null}
        </div>
      </div>
    </div>
  );
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
  const up = (row?.change ?? 0) >= 0;
  const dateLabel =
    row?.arrivalDate ||
    data?.lastUpdated?.split(",")[0] ||
    new Date().toLocaleDateString("en-IN");

  const stats = useMemo(() => {
    if (!row) return null;
    const t = row.trend.length ? row.trend : [row.modal];
    const week = t.slice(-7);
    const month = t;
    return {
      weekAvg: avg(week),
      weekHigh: maxOf(week, row.max),
      weekLow: minOf(week, row.min),
      monthAvg: avg(month),
      monthHigh: maxOf(month, row.max),
      monthLow: minOf(month, row.min),
      daySample: t[Math.max(0, t.length - 4)] ?? row.modal,
    };
  }, [row]);

  return (
    <AppShell
      className="!bg-[#f7f8fb]"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Mandi", href: "/mandi" },
        { label: row?.cropHi || row?.crop || "Detail" },
      ]}
    >
      <div className="mb-2 flex items-center justify-between">
        <AppLink
          href="/mandi"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm active:scale-95"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4 text-slate-700" />
        </AppLink>
        <button
          type="button"
          onClick={() => setFav((v) => !v)}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-sm active:scale-95",
            fav ? "border-rose-200 text-rose-500" : "border-slate-200 text-slate-500"
          )}
          aria-label="Favorite"
        >
          <Heart className={cn("h-4 w-4", fav && "fill-current")} />
        </button>
      </div>

      {loading && !row ? (
        <div className="space-y-3">
          <div className="mx-auto h-28 w-28 animate-pulse rounded-full bg-white" />
          <div className="h-24 animate-pulse rounded-2xl bg-white" />
        </div>
      ) : !row || !stats ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-12 text-center">
          <p className="text-sm font-bold text-slate-800">भाव नहीं मिला</p>
          <AppLink href="/mandi" className="mt-3 inline-block text-xs font-bold text-[#2563eb]">
            ← बाज़ार पर वापस
          </AppLink>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-col items-center pt-1 text-center">
            <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt={row.crop} className="h-full w-full object-cover" />
            </div>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
              {row.cropHi || row.crop}
            </h1>
            <p className="mt-0.5 text-sm text-slate-400">{row.category || "अन्य"}</p>
          </div>

          <div className="space-y-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
            <p className="flex items-center gap-2 text-sm text-slate-700">
              <MapPin className="h-4 w-4 text-[#2563eb]" />
              {row.mandi} • {district || row.state}, {state}
            </p>
            <p className="flex items-center gap-2 text-sm text-slate-700">
              <CalendarDays className="h-4 w-4 text-emerald-500" />
              भाव की तारीख: {dateLabel}
            </p>
            <p className="flex items-center gap-2 text-sm text-slate-700">
              <Star className="h-4 w-4 text-amber-400" />
              ग्रेड: {row.variety || "FAQ / Grade A"}
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-start justify-between px-4 pt-4">
              <div>
                <p className="text-xs font-medium text-slate-400">वर्तमान मूल्य</p>
                <p className="mt-1 text-4xl font-black tracking-tight text-slate-900">
                  ₹{row.modal.toLocaleString("en-IN")}
                </p>
                <div className="mt-2">
                  <ChangePill
                    amount={Math.abs(row.changeAmt || Math.round((row.modal * Math.abs(row.change)) / 100))}
                    tone={up ? "up" : "down"}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof navigator !== "undefined" && navigator.share) {
                      void navigator.share({
                        title: `${row.cropHi || row.crop} भाव`,
                        text: `${row.cropHi || row.crop} @ ₹${row.modal}/qtl · ${row.mandi}`,
                      });
                    }
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600"
                  aria-label="Share"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <AppLink
                  href="/market-trends"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-[#2563eb]"
                  aria-label="Analytics"
                >
                  <LineChart className="h-4 w-4" />
                </AppLink>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 border-t border-slate-100 bg-slate-50">
              <div className="border-r border-slate-100 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">न्यूनतम</p>
                <p className="mt-0.5 text-base font-bold text-slate-800">₹{row.min.toLocaleString("en-IN")}</p>
              </div>
              <div className="px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">अधिकतम</p>
                <p className="mt-0.5 text-base font-bold text-slate-800">₹{row.max.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>

          <PeriodCard
            title={`${dateLabel} का भाव`}
            icon={<Info className="h-3.5 w-3.5" />}
            iconClass="bg-slate-50"
            modal={row.modal}
            high={row.max}
            low={row.min}
            change={Math.abs(row.changeAmt) || Math.round(row.modal * 0.05)}
            tone={up ? "up" : "down"}
            footer={dateLabel}
          />
          <PeriodCard
            title="इस सप्ताह"
            icon={<CalendarDays className="h-3.5 w-3.5" />}
            iconClass="bg-blue-50 text-blue-700"
            modal={stats.weekAvg}
            high={stats.weekHigh}
            low={stats.weekLow}
            change={Math.abs(row.modal - stats.weekAvg)}
            tone={row.modal >= stats.weekAvg ? "up" : "down"}
          />
          <PeriodCard
            title="इस महीने"
            icon={<Folder className="h-3.5 w-3.5" />}
            iconClass="bg-emerald-50 text-emerald-700"
            modal={stats.monthAvg}
            high={stats.monthHigh}
            low={stats.monthLow}
            change={Math.abs(row.modal - stats.monthAvg)}
            tone={row.modal >= stats.monthAvg ? "up" : "down"}
          />
          <PeriodCard
            title="पिछले 30 दिन"
            icon={<LineChart className="h-3.5 w-3.5" />}
            iconClass="bg-violet-50 text-violet-700"
            modal={stats.daySample}
            high={stats.monthHigh}
            low={stats.monthLow}
            change={Math.abs(row.modal - stats.daySample)}
            tone="flat"
          />

          <p className="pb-2 pt-1 text-center text-[11px] italic text-slate-400">
            Made with ❤️ in India
          </p>
        </div>
      )}
    </AppShell>
  );
}
