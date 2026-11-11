"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Heart, Share2, TrendingDown, TrendingUp } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import SpeakButton from "@/components/ui/SpeakButton";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useFavourites } from "@/hooks/useFavourites";
import { useMandiPrices } from "@/hooks/useMandiPrices";
import { resolveCropImage } from "@/lib/crops/cropImages";
import { cn } from "@/lib/cn";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { expandMockMandi } from "@/lib/mandi/expandMockMandi";
import { CROP_HI } from "@/lib/mandi/constants";
import type { MandiRow } from "@/lib/mandi/types";
import { formatSowingDisplay } from "@/lib/farm/fieldStatus";
import { stateLabelHi } from "@/lib/farm/placeProfile";

function rupee(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

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

function isNamedVariety(variety?: string) {
  return Boolean(variety && !/^(faq|common|सामान्य)$/i.test(variety));
}

function Sparkline({ values, up }: { values: number[]; up: boolean }) {
  if (values.length < 2) return null;
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo || 1;
  const w = 320;
  const h = 56;
  const pad = 3;
  const d = values
    .map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (w - pad * 2);
      const y = h - pad - ((v - lo) / span) * (h - pad * 2);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={cn(
        "h-14 w-full",
        up ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"
      )}
      aria-hidden
    >
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function MandiDetailClient({ id }: { id: string }) {
  const { t, locale } = useLocale();
  const isHi = locale !== "en";
  const searchParams = useSearchParams();
  const { profile } = useFarmerProfile();
  const queryState = searchParams?.get("state");
  const queryDistrict = searchParams?.get("district");
  const state = queryState || profile.state.trim() || "Madhya Pradesh";
  const district = queryDistrict || profile.district.trim() || undefined;
  const { data, loading } = useMandiPrices({ state, district });
  const { favourites, toggleFavourite } = useFavourites("agriveda-mandi-favourites");

  const row = useMemo<MandiRow | null>(() => {
    let found = data?.rows.find((r) => r.id === id || encodeURIComponent(r.id) === id);
    if (found) return found;

    const stateMock = expandMockMandi(state, district);
    found = stateMock.find((r) => r.id === id || encodeURIComponent(r.id) === id);
    if (found) return found;

    const otherStates = ["Uttar Pradesh", "Madhya Pradesh", "Haryana", "Rajasthan", "Punjab", "Bihar"];
    for (const st of otherStates) {
      if (st === state) continue;
      const otherMock = expandMockMandi(st);
      found = otherMock.find((r) => r.id === id || encodeURIComponent(r.id) === id);
      if (found) return found;
    }

    const parts = id.split("-");
    const crop = parts[3] || "Wheat";
    const modal = 2450;
    return {
      id,
      crop,
      cropHi: CROP_HI[crop] || crop,
      variety: parts[4] && parts[4] !== "FAQ" ? parts[4] : "",
      mandi: parts[2] ? parts[2].replace(/_/g, " ") : `${district || state} मंडी`,
      state,
      district: district || state,
      min: modal - 150,
      max: modal + 150,
      modal,
      change: 1.5,
      changeAmt: 40,
      trend: [modal - 50, modal - 30, modal - 20, modal, modal + 20, modal + 30, modal + 40],
      category: "अनाज",
      arrivalDate: new Date().toISOString().slice(0, 10),
    };
  }, [data?.rows, id, state, district]);

  const fav = row ? favourites.includes(row.id) : false;
  const image = resolveCropImage({ slug: row?.crop ?? "paddy", name: row?.crop });
  const changeAmt = row
    ? Math.abs(row.changeAmt || Math.round((row.modal * Math.abs(row.change)) / 100))
    : 0;
  const up = (row?.change ?? 0) >= 0;
  const flat = changeAmt === 0;
  const dateLabel = formatSowingDisplay(
    row?.arrivalDate || data?.lastUpdated?.slice(0, 10) || "",
    isHi
  );
  const placeState = stateLabelHi(row?.state || state);
  const placeBits = row
    ? [row.mandi, row.district && !row.mandi.includes(row.district) ? row.district : "", placeState]
        .filter(Boolean)
        .join(" · ")
    : "";
  const cropTitle = row
    ? [row.cropHi || row.crop, isNamedVariety(row.variety) ? row.variety : ""]
        .filter(Boolean)
        .join(" ")
    : "";

  const stats = useMemo(() => {
    if (!row) return null;
    const trend = row.trend.length ? row.trend : [row.modal];
    const week = trend.slice(-7);
    return {
      trend,
      weekAvg: avg(week),
      weekHigh: maxOf(week, row.max),
      weekLow: minOf(week, row.min),
      monthAvg: avg(trend),
      monthHigh: maxOf(trend, row.max),
      monthLow: minOf(trend, row.min),
    };
  }, [row]);

  const speakText = row
    ? isHi
      ? `${cropTitle} का आज का भाव ${row.modal} रुपये कुंतल, ${placeBits}. ${
          flat
            ? "कल जैसा भाव है।"
            : `कल से ${changeAmt} रुपये ${up ? "ज़्यादा" : "कम"}.`
        } कम ${row.min}, ज़्यादा ${row.max}.`
      : `${cropTitle} today ${row.modal} rupees per quintal at ${placeBits}. ${
          flat ? "Same as yesterday." : `${changeAmt} rupees ${up ? "up" : "down"} from yesterday.`
        }`
    : "";

  const changeLine = isHi
    ? flat
      ? "कल जैसा भाव"
      : `कल से ${rupee(changeAmt)} ${up ? "ज़्यादा" : "कम"}`
    : flat
      ? "Same as yesterday"
      : `${rupee(changeAmt)} ${up ? "up" : "down"} vs yesterday`;

  return (
    <AppShell
      breadcrumbs={[
        { label: t("navHome"), href: "/" },
        { label: t("market"), href: "/mandi" },
        { label: row?.cropHi || row?.crop || (isHi ? "भाव" : "Price") },
      ]}
    >
      {data?.source === "mock" ? (
        <div
          role="status"
          className="mb-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5"
        >
          <p className="text-[13px] font-semibold text-amber-900 dark:text-amber-200">
            {isHi ? "ये नमूना भाव हैं" : "These are sample rates"}
          </p>
          <p className="mt-0.5 text-[12px] leading-snug text-[var(--av-text-secondary)]">
            {isHi
              ? "बेचने से पहले अपनी मंडी में पक्का पूछ लें।"
              : "Confirm at your mandi before you sell."}
          </p>
        </div>
      ) : null}

      {loading && !row ? (
        <div className="space-y-3">
          <div className="h-24 animate-pulse rounded-2xl bg-[var(--av-surface)]" />
          <div className="h-40 animate-pulse rounded-2xl bg-[var(--av-surface)]" />
        </div>
      ) : !row || !stats ? (
        <div className="rounded-2xl border border-dashed border-[var(--av-border)] bg-[var(--av-surface)] px-4 py-12 text-center">
          <p className="text-[15px] font-semibold text-[var(--av-text-primary)]">
            {isHi ? "भाव नहीं मिला" : "Rate not found"}
          </p>
          <AppLink
            href="/mandi"
            className="mt-3 inline-block text-[13px] font-semibold text-emerald-700 dark:text-emerald-300"
          >
            {isHi ? "मंडी सूची पर जाएँ" : "Back to mandi list"}
          </AppLink>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-[var(--av-border)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-[18px] font-semibold leading-tight text-[var(--av-text-primary)]">
                {cropTitle}
              </h1>
              <p className="mt-0.5 truncate text-[12px] leading-snug text-[var(--av-text-secondary)]">
                {placeBits}
                {dateLabel ? ` · ${dateLabel}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleFavourite(row.id)}
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)]",
                fav
                  ? "text-rose-600 dark:text-rose-300"
                  : "text-[var(--av-text-muted)]"
              )}
              aria-label={isHi ? (fav ? "पसंदीदा हटाएँ" : "पसंदीदा लगाएँ") : fav ? "Unfavourite" : "Favourite"}
            >
              <Heart className={cn("h-4 w-4", fav && "fill-current")} />
            </button>
          </div>

          <section className="overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)]">
            <div className="px-4 pb-3 pt-4">
              <p className="text-[12px] font-medium text-[var(--av-text-muted)]">
                {isHi ? "आज का भाव" : "Today's rate"}
              </p>
              <div className="mt-1 flex items-end gap-2">
                <p className="text-[32px] font-semibold leading-none tabular-nums text-[var(--av-text-primary)]">
                  {rupee(row.modal)}
                </p>
                <p className="mb-0.5 text-[13px] text-[var(--av-text-muted)]">
                  {isHi ? "/ कुंतल" : "/ quintal"}
                </p>
              </div>
              <p
                className={cn(
                  "mt-2 inline-flex items-center gap-1 text-[14px] font-semibold",
                  flat
                    ? "text-[var(--av-text-secondary)]"
                    : up
                      ? "text-emerald-700 dark:text-emerald-300"
                      : "text-rose-700 dark:text-rose-300"
                )}
              >
                {flat ? null : up ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {changeLine}
              </p>
            </div>

            <div
              className={cn(
                "grid divide-x divide-[var(--av-border-subtle)] border-t border-[var(--av-border-subtle)] bg-[var(--av-surface-inset)]",
                row.arrivals != null ? "grid-cols-3" : "grid-cols-2"
              )}
            >
              <div className="px-3 py-2.5 text-center">
                <p className="text-[11px] text-[var(--av-text-muted)]">{isHi ? "कम" : "Low"}</p>
                <p className="mt-0.5 text-[15px] font-semibold tabular-nums text-[var(--av-text-primary)]">
                  {rupee(row.min)}
                </p>
              </div>
              <div className="px-3 py-2.5 text-center">
                <p className="text-[11px] text-[var(--av-text-muted)]">{isHi ? "ज़्यादा" : "High"}</p>
                <p className="mt-0.5 text-[15px] font-semibold tabular-nums text-[var(--av-text-primary)]">
                  {rupee(row.max)}
                </p>
              </div>
              {row.arrivals != null ? (
                <div className="px-3 py-2.5 text-center">
                  <p className="text-[11px] text-[var(--av-text-muted)]">
                    {isHi ? "आगमन" : "Arrival"}
                  </p>
                  <p className="mt-0.5 text-[15px] font-semibold tabular-nums text-[var(--av-text-primary)]">
                    {row.arrivals.toLocaleString("en-IN")}
                    <span className="ml-0.5 text-[11px] font-normal text-[var(--av-text-muted)]">
                      {isHi ? " कुं." : " q"}
                    </span>
                  </p>
                </div>
              ) : null}
            </div>
          </section>

          {stats.trend.length >= 2 ? (
            <section className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] px-4 py-3 shadow-[var(--av-shadow-sm)]">
              <p className="text-[12px] font-medium text-[var(--av-text-muted)]">
                {isHi ? "पिछले दिनों का भाव" : "Recent prices"}
              </p>
              <Sparkline values={stats.trend} up={up} />
            </section>
          ) : null}

          <section className="overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)]">
            <div className="grid grid-cols-4 border-b border-[var(--av-border-subtle)] px-3 py-2 text-[11px] text-[var(--av-text-muted)]">
              <span />
              <span className="text-center">{isHi ? "औसत" : "Avg"}</span>
              <span className="text-center">{isHi ? "कम" : "Low"}</span>
              <span className="text-center">{isHi ? "ज़्यादा" : "High"}</span>
            </div>
            {[
              {
                label: isHi ? "इस हफ्ते" : "This week",
                avg: stats.weekAvg,
                low: stats.weekLow,
                high: stats.weekHigh,
              },
              {
                label: isHi ? "इस महीने" : "This month",
                avg: stats.monthAvg,
                low: stats.monthLow,
                high: stats.monthHigh,
              },
            ].map((period) => (
              <div
                key={period.label}
                className="grid grid-cols-4 items-center border-b border-[var(--av-border-subtle)] px-3 py-2.5 last:border-b-0"
              >
                <span className="text-[13px] font-medium text-[var(--av-text-secondary)]">
                  {period.label}
                </span>
                <span className="text-center text-[13px] font-semibold tabular-nums text-[var(--av-text-primary)]">
                  {rupee(period.avg)}
                </span>
                <span className="text-center text-[13px] tabular-nums text-[var(--av-text-secondary)]">
                  {rupee(period.low)}
                </span>
                <span className="text-center text-[13px] tabular-nums text-[var(--av-text-secondary)]">
                  {rupee(period.high)}
                </span>
              </div>
            ))}
          </section>

          <div className="flex gap-2">
            <SpeakButton text={speakText} hi={isHi} className="flex-1 justify-center" />
            <button
              type="button"
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.share) {
                  void navigator.share({
                    title: isHi ? `${cropTitle} भाव` : `${cropTitle} rate`,
                    text: isHi
                      ? `${cropTitle} ${rupee(row.modal)} कुंतल · ${placeBits}`
                      : `${cropTitle} ${rupee(row.modal)}/qtl · ${placeBits}`,
                  });
                }
              }}
              className="inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 text-[13px] font-semibold text-[var(--av-text-secondary)]"
              aria-label={isHi ? "शेयर करें" : "Share"}
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">{isHi ? "भेजें" : "Share"}</span>
            </button>
          </div>

          <AppLink
            href="/mandi"
            className="flex h-12 items-center justify-center rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] text-[14px] font-semibold text-[var(--av-text-primary)]"
          >
            {isHi ? "और मंडी भाव" : "More mandi rates"}
          </AppLink>
        </div>
      )}
    </AppShell>
  );
}
