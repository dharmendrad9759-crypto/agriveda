"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  ChevronRight,
  MapPin,
  Navigation,
  RefreshCw,
  Scale,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Warehouse,
} from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import PriceAlertsPanel from "@/components/alerts/PriceAlertsPanel";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMandiPrices } from "@/hooks/useMandiPrices";
import { useMyCrops } from "@/hooks/useMyCrops";
import { usePriceAlerts } from "@/hooks/usePriceAlerts";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { CROP_HI } from "@/lib/mandi/constants";
import { expandMockMandi } from "@/lib/mandi/expandMockMandi";
import { enrichMockWithChange } from "@/lib/mandi/mapDataGov";
import {
  getDistrictsForState,
  INDIAN_STATES,
  sortDistrictsForFarmer,
  sortStatesForFarmer,
} from "@/lib/india-locations";
import { stateLabelHi } from "@/lib/farm/placeProfile";
import { LocationListSheet, LocationPickButton } from "@/components/ui/LocationListSheet";
import { resolveFarmerLocationFromGps } from "@/lib/farmerLocation";
import { cn } from "@/lib/cn";
import type { MandiRow } from "@/lib/mandi/types";

const QUICK_CROPS = [
  { hi: "गेहूँ", en: "Wheat", emoji: "🌾" },
  { hi: "सरसों", en: "Mustard", emoji: "🌼" },
  { hi: "चना", en: "Gram", emoji: "🫘" },
  { hi: "धान", en: "Paddy", emoji: "🌿" },
  { hi: "प्याज", en: "Onion", emoji: "🧅" },
  { hi: "आलू", en: "Potato", emoji: "🥔" },
  { hi: "सोयाबीन", en: "Soybean", emoji: "🌱" },
  { hi: "मक्का", en: "Maize", emoji: "🌽" },
  { hi: "कपास", en: "Cotton", emoji: "☁️" },
  { hi: "मिर्च", en: "Chilli", emoji: "🌶️" },
];

const GENERIC_VARIETY = /^(faq|local|hybrid|common|सामान्य|देसी|हाइब्रिड)$/i;

function inr(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function cropName(row: Pick<MandiRow, "crop" | "cropHi">, hi: boolean) {
  return hi ? row.cropHi || CROP_HI[row.crop] || row.crop : row.crop;
}

function cropEmoji(crop: string) {
  const hit = QUICK_CROPS.find((c) => c.en.toLowerCase() === crop.toLowerCase());
  return hit?.emoji ?? "🌾";
}

function varietyLabel(raw: string | undefined) {
  const v = (raw || "").trim();
  if (!v || GENERIC_VARIETY.test(v)) return "";
  return v;
}

function trendOf(row: MandiRow) {
  if (row.changeAmt > 8) return { dir: "up" as const, amt: row.changeAmt };
  if (row.changeAmt < -8) return { dir: "down" as const, amt: row.changeAmt };
  return { dir: "flat" as const, amt: row.changeAmt };
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function matchesCrop(row: MandiRow, crop: string) {
  const want = crop.toLowerCase();
  const name = row.crop.toLowerCase();
  if (name === want) return true;
  if (want === "soybean" && name.includes("soya")) return true;
  if (want === "paddy" && name === "rice") return true;
  return false;
}

function fmtArrival(iso: string | undefined, hi: boolean) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  if (!hi) {
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }
  const months = ["जन", "फर", "मार", "अप्र", "मई", "जून", "जुल", "अग", "सित", "अक्ट", "नव", "दिस"];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

function Spark({ values, up }: { values: number[]; up: boolean }) {
  if (!values.length) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(1, max - min);
  return (
    <div className="flex h-7 items-end gap-[3px]" aria-hidden>
      {values.map((v, i) => (
        <span
          key={i}
          className={cn("w-[5px] rounded-full", up ? "bg-emerald-400" : "bg-rose-300")}
          style={{ height: `${28 + ((v - min) / span) * 72}%` }}
        />
      ))}
    </div>
  );
}

function PriceCard({ row, isHi }: { row: MandiRow; isHi: boolean }) {
  const tr = trendOf(row);
  const up = tr.dir !== "down";
  const variety = varietyLabel(row.variety);
  return (
    <AppLink
      href={`/mandi/${encodeURIComponent(row.id)}?state=${encodeURIComponent(row.state)}&district=${encodeURIComponent(row.district || "")}`}
      className="block overflow-hidden rounded-2xl border border-amber-200/70 bg-[var(--av-surface)] shadow-[0_8px_24px_-16px_rgba(16,80,40,0.45)] dark:border-emerald-900/50"
    >
      <div className="flex items-start gap-3 px-3.5 pt-3.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-emerald-100 text-xl dark:from-amber-900/40 dark:to-emerald-900/40">
          {cropEmoji(row.crop)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[16px] font-black text-[var(--av-text-primary)]">{cropName(row, isHi)}</p>
              {variety ? (
                <p className="mt-0.5 truncate text-[13px] font-bold text-amber-800 dark:text-amber-200">{variety}</p>
              ) : null}
              <p className="mt-0.5 truncate text-[11px] font-semibold text-[var(--av-text-muted)]">
                {row.mandi}
                {row.district ? ` · ${row.district}` : ""}
              </p>
            </div>
            <div className="text-right">
              <p className="whitespace-nowrap text-[22px] font-black leading-none text-emerald-800 dark:text-emerald-300">{inr(row.modal)}</p>
              <p className="mt-0.5 text-[10px] font-bold text-amber-800/80 dark:text-amber-300">{isHi ? "₹ / क्विंटल" : "₹ / quintal"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-3.5 mt-3 grid grid-cols-3 overflow-hidden rounded-xl bg-[var(--av-surface-inset)] text-center">
        <div className="px-1 py-2">
          <p className="text-[9px] font-bold uppercase tracking-wide text-[var(--av-text-muted)]">{isHi ? "न्यूनतम" : "Min"}</p>
          <p className="mt-0.5 text-[13px] font-extrabold text-[var(--av-text-primary)]">{inr(row.min)}</p>
        </div>
        <div className="border-x border-[var(--av-border)] bg-emerald-50/80 px-1 py-2 dark:bg-emerald-950/40">
          <p className="text-[9px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">{isHi ? "मॉडल" : "Modal"}</p>
          <p className="mt-0.5 text-[13px] font-black text-emerald-800 dark:text-emerald-200">{inr(row.modal)}</p>
        </div>
        <div className="px-1 py-2">
          <p className="text-[9px] font-bold uppercase tracking-wide text-[var(--av-text-muted)]">{isHi ? "अधिकतम" : "Max"}</p>
          <p className="mt-0.5 text-[13px] font-extrabold text-[var(--av-text-primary)]">{inr(row.max)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 px-3.5 py-2.5">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold text-[var(--av-text-secondary)]">
          {row.arrivals != null ? (
            <span className="inline-flex items-center gap-0.5">
              <Scale className="h-3 w-3 text-amber-700" />
              {isHi ? `${row.arrivals} क्विंटल आगमन` : `${row.arrivals} qtl arrivals`}
            </span>
          ) : null}
          {row.arrivalDate ? (
            <span className="inline-flex items-center gap-0.5">
              <CalendarDays className="h-3 w-3 text-emerald-700" />
              {fmtArrival(row.arrivalDate, isHi)}
            </span>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Spark values={row.trend} up={up} />
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-[12px] font-black",
              tr.dir === "up" && "text-emerald-600",
              tr.dir === "down" && "text-rose-600",
              tr.dir === "flat" && "text-[var(--av-text-muted)]"
            )}
          >
            {tr.dir === "up" ? <TrendingUp className="h-3.5 w-3.5" /> : tr.dir === "down" ? <TrendingDown className="h-3.5 w-3.5" /> : null}
            {tr.dir === "flat" ? (isHi ? "जैसा कल था" : "Same as yesterday") : inr(Math.abs(tr.amt))}
          </span>
        </div>
      </div>
    </AppLink>
  );
}

export default function MandiListClient() {
  const { t, locale } = useLocale();
  const isHi = locale === "hi";
  const { profile } = useFarmerProfile();
  const { crops: myCrops } = useMyCrops();
  const { activeCount } = usePriceAlerts();

  const profileState = profile.state.trim() || "Haryana";
  const profileDistrict = profile.district.trim();

  const [fetchState, setFetchState] = useState(profileState);
  const [district, setDistrict] = useState<string | null>(null);
  const [mandi, setMandi] = useState<string | null>(null);
  const [crop, setCrop] = useState("");
  const [variety, setVariety] = useState("");
  const [mode, setMode] = useState<"commodity" | "market">("commodity");
  const [tab, setTab] = useState<"rates" | "alerts">("rates");
  const [gpsBusy, setGpsBusy] = useState(false);
  const [placeSheet, setPlaceSheet] = useState<"state" | "district" | null>(null);

  const { data, loading, districtLoading, refresh, enrichDistrict } = useMandiPrices({
    state: fetchState,
  });
  const liveRows = data?.rows ?? [];
  const allDistricts = useMemo(() => getDistrictsForState(fetchState), [fetchState]);
  const rows = useMemo(() => {
    const have = new Set(
      liveRows.map((r) => (r.district || "").trim().toLowerCase()).filter(Boolean)
    );
    const extra: MandiRow[] = [];
    for (const d of allDistricts) {
      if (have.has(d.toLowerCase())) continue;
      extra.push(...enrichMockWithChange(expandMockMandi(fetchState, d)));
    }
    return extra.length ? [...liveRows, ...extra] : liveRows;
  }, [liveRows, allDistricts, fetchState]);

  useEffect(() => {
    if (profileDistrict) void enrichDistrict(fetchState, profileDistrict);
  }, [fetchState, profileDistrict, enrichDistrict]);

  useEffect(() => {
    if (district) void enrichDistrict(fetchState, district);
  }, [district, fetchState, enrichDistrict]);

  const districtStats = useMemo(() => {
    const map = new Map<string, { mandis: Set<string>; crops: Set<string> }>();
    for (const row of rows) {
      const d = row.district?.trim();
      if (!d) continue;
      const hit = map.get(d) ?? { mandis: new Set<string>(), crops: new Set<string>() };
      hit.mandis.add(row.mandi);
      hit.crops.add(row.crop);
      map.set(d, hit);
    }
    return map;
  }, [rows]);

  const visibleDistricts = useMemo(
    () => sortDistrictsForFarmer(allDistricts, profileDistrict),
    [allDistricts, profileDistrict]
  );
  const stateOptions = useMemo(
    () => sortStatesForFarmer(INDIAN_STATES, profileState),
    [profileState]
  );

  const districtRows = useMemo(() => {
    if (!district) return [];
    const key = district.toLowerCase();
    return rows.filter((r) => (r.district || "").toLowerCase() === key);
  }, [rows, district]);

  const mandisInDistrict = useMemo(() => {
    return unique(districtRows.map((r) => r.mandi)).sort((a, b) => a.localeCompare(b, "hi"));
  }, [districtRows]);

  const priceRows = useMemo(() => {
    let list = mandi
      ? districtRows.filter((r) => r.mandi === mandi)
      : district
        ? districtRows
        : rows;
    if (crop) list = list.filter((r) => matchesCrop(r, crop));
    if (variety) list = list.filter((r) => varietyLabel(r.variety) === variety);
    return [...list].sort((a, b) => b.modal - a.modal);
  }, [mandi, districtRows, district, rows, crop, variety]);

  const varietyOptions = useMemo(() => {
    const source = crop
      ? rows.filter((r) => matchesCrop(r, crop))
      : mandi
        ? districtRows.filter((r) => r.mandi === mandi)
        : districtRows;
    return unique(source.map((r) => varietyLabel(r.variety)).filter(Boolean));
  }, [rows, crop, mandi, districtRows]);

  const heroRows = useMemo(() => {
    const home = profileDistrict
      ? rows.filter((r) => (r.district || "").toLowerCase() === profileDistrict.toLowerCase())
      : rows;
    const wanted = myCrops.map((c) => c.name.toLowerCase());
    const picked: MandiRow[] = [];
    const seen = new Set<string>();
    const pushRow = (row: MandiRow) => {
      const key = `${row.crop}|${row.variety}|${row.mandi}`;
      if (seen.has(key)) return;
      seen.add(key);
      picked.push(row);
    };
    for (const name of wanted) {
      const matches = home.filter(
        (r) => r.crop.toLowerCase().includes(name) || r.cropHi.toLowerCase().includes(name)
      );
      const uniqueVariety = new Set<string>();
      const varietyCount = unique(matches.map((r) => varietyLabel(r.variety)).filter(Boolean)).length;
      for (const hit of [...matches].sort((a, b) => b.modal - a.modal)) {
        const v = varietyLabel(hit.variety) || hit.crop;
        if (uniqueVariety.has(v)) continue;
        uniqueVariety.add(v);
        pushRow(hit);
        if (varietyCount <= 1) break;
        if (picked.length >= 4) break;
      }
      if (picked.length >= 4) break;
    }
    if (picked.length) return picked.slice(0, 4);
    const paddyHome = home.filter((r) => r.crop === "Paddy");
    if (paddyHome.length) {
      const uniqueVariety = new Set<string>();
      for (const hit of [...paddyHome].sort((a, b) => b.modal - a.modal)) {
        const v = varietyLabel(hit.variety) || hit.crop;
        if (uniqueVariety.has(v)) continue;
        uniqueVariety.add(v);
        pushRow(hit);
        if (picked.length >= 3) break;
      }
    }
    for (const row of home) {
      if (picked.length >= 4) break;
      if (row.crop === "Paddy") continue;
      pushRow(row);
    }
    return picked.slice(0, 4);
  }, [rows, profileDistrict, myCrops]);

  const pickState = (next: string) => {
    setFetchState(next);
    setDistrict(null);
    setMandi(null);
    setVariety("");
  };

  const pickCrop = (next: string) => {
    setCrop(next);
    setVariety("");
    if (next) setMode("commodity");
  };

  const goBack = () => {
    if (variety) {
      setVariety("");
      return;
    }
    if (mandi) {
      setMandi(null);
      return;
    }
    if (district && mode === "market") {
      setDistrict(null);
      return;
    }
    if (crop) setCrop("");
  };

  const detectGps = async () => {
    setGpsBusy(true);
    try {
      const loc = await resolveFarmerLocationFromGps();
      if (loc.state) pickState(loc.state);
      if (loc.district) {
        setDistrict(loc.district);
        setMandi(null);
        setMode("market");
      }
    } catch {
      /* keep current place */
    } finally {
      setGpsBusy(false);
    }
  };

  const updated = data?.lastUpdated;
  const showPrices = Boolean(crop || mandi);
  const showMandis = Boolean(district && !mandi && !crop && mode === "market");
  const showDistricts = !showPrices && !showMandis && mode === "market";
  const showToday = !showPrices && !showMandis && mode === "commodity" && !crop;

  return (
    <AppShell
      className="!bg-transparent"
      title={isHi ? "मंडी भाव" : "Mandi prices"}
      subtitle={
        updated
          ? isHi
            ? `आज का भाव · ${updated}`
            : `Today's rates · ${updated}`
          : isHi
            ? "आज का थोक भाव / क्विंटल"
            : "Wholesale rates / quintal"
      }
      breadcrumbs={[{ label: t("navHome"), href: "/" }, { label: t("market") }]}
      actions={
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={detectGps}
            disabled={gpsBusy}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
            aria-label={isHi ? "नज़दीकी मंडी" : "Nearby mandi"}
          >
            <Navigation className={cn("h-4 w-4", gpsBusy && "animate-spin")} />
          </button>
          <button
            type="button"
            onClick={() => refresh()}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
            aria-label={isHi ? "ताज़ा करें" : "Refresh"}
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab("rates")}
            className={cn(
              "flex-1 rounded-full py-2 text-[13px] font-bold",
              tab === "rates"
                ? "bg-emerald-700 text-white"
                : "border border-amber-200 bg-[var(--av-surface)] text-[var(--av-text-secondary)] dark:border-emerald-800"
            )}
          >
            {isHi ? "आज का भाव" : "Prices"}
          </button>
          <button
            type="button"
            onClick={() => setTab("alerts")}
            className={cn(
              "flex-1 rounded-full py-2 text-[13px] font-bold",
              tab === "alerts"
                ? "bg-emerald-700 text-white"
                : "border border-amber-200 bg-[var(--av-surface)] text-[var(--av-text-secondary)] dark:border-emerald-800"
            )}
          >
            {isHi ? `अलर्ट ${activeCount ? `· ${activeCount}` : ""}` : `Alerts`}
          </button>
        </div>

        {tab === "alerts" ? (
          <div className="rounded-2xl border border-amber-200/80 bg-[var(--av-surface)] p-4 dark:border-emerald-800">
            <div className="mb-3 flex items-center gap-1.5 text-sm font-bold">
              <Bell className="h-4 w-4 text-emerald-500" />
              {isHi ? "भाव अलर्ट" : "Price alerts"}
            </div>
            <PriceAlertsPanel rows={rows} />
          </div>
        ) : (
          <>
            {showToday ? (
              <section className="overflow-hidden rounded-[22px] bg-gradient-to-br from-emerald-800 via-emerald-700 to-amber-700 p-4 text-white shadow-[0_16px_40px_-18px_rgba(6,78,59,0.7)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold tracking-wide">
                      <Sparkles className="h-3 w-3" />
                      {isHi ? "आज मंडी खुली है" : "Mandi is open"}
                    </p>
                    <h2 className="mt-2 text-[22px] font-black leading-tight">
                      {isHi ? "आपकी मंडी का आज का भाव" : "Today's mandi rates"}
                    </h2>
                    <p className="mt-1 flex items-center gap-1 text-[12px] text-emerald-50">
                      <MapPin className="h-3.5 w-3.5" />
                      {profileDistrict || fetchState} · {isHi ? "₹ / क्विंटल" : "₹ / quintal"}
                    </p>
                  </div>
                  <span className="text-4xl" aria-hidden>
                    🌾
                  </span>
                </div>
                <div className="mt-3 flex gap-2 overflow-x-auto pb-0.5">
                  {heroRows.map((row) => {
                    const tr = trendOf(row);
                    return (
                      <AppLink
                        key={row.id}
                        href={`/mandi/${encodeURIComponent(row.id)}?state=${encodeURIComponent(row.state)}&district=${encodeURIComponent(row.district || "")}`}
                        className="min-w-[148px] shrink-0 rounded-2xl bg-white/12 p-2.5"
                      >
                        <p className="truncate text-[11px] font-bold text-amber-100">
                          {cropEmoji(row.crop)} {cropName(row, isHi)}
                        </p>
                        <p className="mt-1 whitespace-nowrap text-[18px] font-black leading-none">{inr(row.modal)}</p>
                        {varietyLabel(row.variety) ? (
                          <p className="mt-1 truncate text-[10px] text-emerald-50">{varietyLabel(row.variety)}</p>
                        ) : null}
                        <p
                          className={cn(
                            "mt-1 text-[10px] font-bold",
                            tr.dir === "down" ? "text-rose-200" : "text-lime-200"
                          )}
                        >
                          {tr.dir === "flat"
                            ? isHi
                              ? "जैसा कल था"
                              : "Same as yesterday"
                            : `${tr.dir === "down" ? "▼" : "▲"} ${inr(Math.abs(tr.amt))}`}
                        </p>
                      </AppLink>
                    );
                  })}
                </div>
              </section>
            ) : null}

            <section className="rounded-2xl border border-amber-200/80 bg-[var(--av-surface)] p-3.5 dark:border-emerald-800">
              <div className="grid grid-cols-2 gap-1 rounded-full bg-amber-50 p-1 dark:bg-emerald-950/50">
                <button
                  type="button"
                  onClick={() => {
                    setMode("commodity");
                    setMandi(null);
                  }}
                  className={cn(
                    "rounded-full py-2 text-[12px] font-bold",
                    mode === "commodity" ? "bg-emerald-700 text-white" : "text-emerald-900 dark:text-emerald-200"
                  )}
                >
                  {isHi ? "फसल से देखें" : "By crop"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("market");
                    setCrop("");
                    setVariety("");
                    setMandi(null);
                  }}
                  className={cn(
                    "rounded-full py-2 text-[12px] font-bold",
                    mode === "market" ? "bg-emerald-700 text-white" : "text-emerald-900 dark:text-emerald-200"
                  )}
                >
                  {isHi ? "मंडी से देखें" : "By market"}
                </button>
              </div>

              {mode === "commodity" ? (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {QUICK_CROPS.map((c) => (
                    <button
                      key={c.en}
                      type="button"
                      onClick={() => pickCrop(crop === c.en ? "" : c.en)}
                      className={cn(
                        "shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-bold",
                        crop === c.en
                          ? "border-emerald-700 bg-emerald-700 text-white"
                          : "border-amber-200 bg-amber-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100"
                      )}
                    >
                      {c.emoji} {isHi ? c.hi : c.en}
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="mt-3 grid grid-cols-2 gap-2">
                <LocationPickButton
                  label={isHi ? "राज्य" : "State"}
                  valueLabel={isHi ? stateLabelHi(fetchState) : fetchState}
                  hint={isHi && stateLabelHi(fetchState) !== fetchState ? fetchState : undefined}
                  onClick={() => setPlaceSheet("state")}
                />
                <LocationPickButton
                  label={isHi ? "ज़िला" : "District"}
                  valueLabel={
                    district
                      ? district === profileDistrict
                        ? isHi
                          ? `${district} · आपका`
                          : `${district} · yours`
                        : district
                      : isHi
                        ? "सभी ज़िले"
                        : "All districts"
                  }
                  onClick={() => setPlaceSheet("district")}
                />
              </div>
            </section>

            {(district || mandi || crop) && (
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-800 dark:text-emerald-300"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {isHi ? "वापस" : "Back"}
              </button>
            )}

            {showToday ? (
              <section className="space-y-2">
                <div className="flex items-center justify-between px-0.5">
                  <h2 className="text-[15px] font-black text-[var(--av-text-primary)]">
                    {isHi ? "घर की मंडी — पूरा भाव" : "Your mandi — full rate"}
                  </h2>
                  <p className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                    {profileDistrict || fetchState}
                  </p>
                </div>
                {heroRows.map((row) => (
                  <PriceCard key={`full-${row.id}`} row={row} isHi={isHi} />
                ))}
                <button
                  type="button"
                  onClick={() => setMode("market")}
                  className="flex w-full items-center justify-center gap-1 rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 to-emerald-50 py-3 text-[13px] font-black text-emerald-900 dark:border-emerald-800 dark:from-emerald-950 dark:to-amber-950 dark:text-emerald-100"
                >
                  {isHi ? `सभी ${allDistricts.length} ज़िले · हर मंडी` : `Browse ${allDistricts.length} districts`}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </section>
            ) : null}

            {showDistricts ? (
              <section className="space-y-2">
                <h2 className="px-0.5 text-[15px] font-black">
                  {isHi ? `${fetchState} — हर ज़िले की मंडी` : `${fetchState} districts`}
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {visibleDistricts.map((d) => {
                    const stats = districtStats.get(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          setDistrict(d);
                          setMandi(null);
                        }}
                        className={cn(
                          "rounded-2xl border px-3 py-3 text-left",
                          d === profileDistrict
                            ? "border-amber-400 bg-gradient-to-br from-amber-50 to-emerald-50 dark:from-amber-950/40 dark:to-emerald-950/40"
                            : "border-amber-200/80 bg-[var(--av-surface)] dark:border-emerald-800"
                        )}
                      >
                        <span className="block truncate text-[13px] font-black text-[var(--av-text-primary)]">{d}</span>
                        <span className="mt-1 block text-[10px] font-semibold text-emerald-800 dark:text-emerald-300">
                          {stats
                            ? isHi
                              ? `${stats.mandis.size} मंडी · ${stats.crops.size} फसल`
                              : `${stats.mandis.size} markets · ${stats.crops.size} crops`
                            : isHi
                              ? "भाव खोलें"
                              : "Open"}
                        </span>
                        {d === profileDistrict ? (
                          <span className="mt-1 inline-block rounded-full bg-amber-200 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-950">
                            {isHi ? "आपका ज़िला" : "Yours"}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {showMandis ? (
              <section className="space-y-2">
                <h2 className="px-0.5 text-[15px] font-black">
                  {isHi ? `${district} की मंडियाँ` : `Markets in ${district}`}
                </h2>
                {districtLoading ? (
                  <p className="px-1 text-[12px] text-emerald-700">{isHi ? "भाव आ रहे हैं…" : "Loading…"}</p>
                ) : null}
                {mandisInDistrict.map((name) => {
                  const list = districtRows.filter((r) => r.mandi === name);
                  const top = [...list].sort((a, b) => b.modal - a.modal)[0];
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setMandi(name)}
                      className="flex w-full items-center gap-3 rounded-2xl border border-amber-200/80 bg-[var(--av-surface)] px-4 py-3 text-left dark:border-emerald-800"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-amber-100 text-emerald-800 dark:from-emerald-900 dark:to-amber-900 dark:text-emerald-200">
                        <Warehouse className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-black">{name}</span>
                        <span className="text-[11px] font-semibold text-[var(--av-text-muted)]">
                          {top
                            ? [
                                cropName(top, isHi),
                                varietyLabel(top.variety),
                                inr(top.modal),
                              ]
                                .filter(Boolean)
                                .join(" · ")
                            : ""}
                        </span>
                        <span className="mt-0.5 block text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                          {isHi ? `${list.length} भाव` : `${list.length} rates`}
                        </span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-amber-700" />
                    </button>
                  );
                })}
              </section>
            ) : null}

            {showPrices ? (
              <section className="space-y-2">
                <h2 className="px-0.5 text-[15px] font-black">
                    {crop
                    ? isHi
                      ? `${cropEmoji(crop)} ${CROP_HI[crop] || crop}${varietyOptions.length > 1 ? " — वैरायटी सहित" : ""}`
                      : `${crop}${varietyOptions.length > 1 ? " rates by variety" : ""}`
                    : mandi}
                </h2>
                {varietyOptions.length > 1 ? (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    <button
                      type="button"
                      onClick={() => setVariety("")}
                      className={cn(
                        "shrink-0 rounded-full border px-3 py-1 text-[11px] font-bold",
                        !variety
                          ? "border-amber-700 bg-amber-700 text-white"
                          : "border-amber-200 bg-amber-50 text-amber-950 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100"
                      )}
                    >
                      {isHi ? "सभी वैरायटी" : "All varieties"}
                    </button>
                    {varietyOptions.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setVariety(v === variety ? "" : v)}
                        className={cn(
                          "shrink-0 rounded-full border px-3 py-1 text-[11px] font-bold",
                          variety === v
                            ? "border-amber-700 bg-amber-700 text-white"
                            : "border-amber-200 bg-amber-50 text-amber-950 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100"
                        )}
                      >
                        {varietyLabel(v)}
                      </button>
                    ))}
                  </div>
                ) : null}
                {priceRows.length === 0 ? (
                  <p className="rounded-2xl border border-amber-200 bg-[var(--av-surface)] px-4 py-8 text-center text-sm text-[var(--av-text-muted)]">
                    {isHi ? "इस खोज का भाव नहीं मिला" : "No rates for this search"}
                  </p>
                ) : (
                  priceRows.slice(0, 40).map((row) => <PriceCard key={row.id} row={row} isHi={isHi} />)
                )}
              </section>
            ) : null}

            <AppLink
              href="/market-trends"
              className="flex items-center justify-center py-2 text-[13px] font-semibold text-emerald-800 dark:text-emerald-300"
            >
              {isHi ? "7 दिन का बाज़ार रुझान देखें →" : "7-day market trends →"}
            </AppLink>
          </>
        )}
      </div>
      <LocationListSheet
        open={placeSheet === "state"}
        onClose={() => setPlaceSheet(null)}
        title={isHi ? "राज्य चुनें" : "Choose state"}
        subtitle={isHi ? "अपना राज्य लिखकर खोजें" : "Search your state"}
        searchPlaceholder={isHi ? "जैसे हरियाणा, उत्तर प्रदेश" : "Search state"}
        value={fetchState}
        onSelect={pickState}
        options={stateOptions.map((s) => ({
          value: s,
          label: isHi ? stateLabelHi(s) : s,
          hint: isHi && stateLabelHi(s) !== s ? s : undefined,
          pinned: s === profileState,
        }))}
      />
      <LocationListSheet
        open={placeSheet === "district"}
        onClose={() => setPlaceSheet(null)}
        title={isHi ? "ज़िला चुनें" : "Choose district"}
        subtitle={isHi ? `${stateLabelHi(fetchState)} के ज़िले` : `Districts in ${fetchState}`}
        searchPlaceholder={isHi ? "ज़िला का नाम लिखें" : "Search district"}
        value={district ?? ""}
        onSelect={(v) => {
          setDistrict(v || null);
          setMandi(null);
          setPlaceSheet(null);
        }}
        options={[
          { value: "", label: isHi ? "सभी ज़िले" : "All districts" },
          ...visibleDistricts.map((d) => ({
            value: d,
            label: d,
            pinned: d === profileDistrict,
          })),
        ]}
      />
    </AppShell>
  );
}
