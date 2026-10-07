"use client";

import AppLink from "@/components/ui/AppLink";
import { cn } from "@/lib/cn";
import { gradeLabel, MANDI_FILTER_ALL } from "@/lib/mandi/cascadeFilters";
import { exportMandiCsv } from "@/lib/mandi/exportMandiCsv";
import {
  buildMandiIndex,
  cascadeFromIndex,
  filterTableRows,
  type CascadeContext,
} from "@/lib/mandi/mandiIndex";
import type { MandiRow } from "@/lib/mandi/types";
import { getDistrictsForState, INDIAN_STATES } from "@/lib/india-locations";
import { ChevronDown, ChevronLeft, ChevronRight, Search, Filter, Download, MapPin, CalendarDays, ArrowDownUp, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { useFavourites } from "@/hooks/useFavourites";

export type MandiTableFilters = {
  state: string;
  district: string;
  market: string;
  commodity: string;
  grade: string;
};

const ALL = MANDI_FILTER_ALL;

const QUICK_CROPS = [
  { labelHi: "सभी", labelEn: "All", query: "" },
  { labelHi: "गेहूँ", labelEn: "Wheat", query: "Wheat" },
  { labelHi: "सरसों", labelEn: "Mustard", query: "Mustard" },
  { labelHi: "चना", labelEn: "Gram", query: "Gram" },
  { labelHi: "सोयाबीन", labelEn: "Soyabean", query: "Soyabean" },
  { labelHi: "धान", labelEn: "Paddy", query: "Paddy" },
  { labelHi: "मक्का", labelEn: "Maize", query: "Maize" },
  { labelHi: "प्याज", labelEn: "Onion", query: "Onion" },
  { labelHi: "आलू", labelEn: "Potato", query: "Potato" },
];

const EMPTY_FILTERS = (state: string): MandiTableFilters => ({
  state,
  district: "",
  market: ALL,
  commodity: ALL,
  grade: ALL,
});

function formatInr(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function formatDate(raw?: string, fallback?: string) {
  if (raw) {
    const d = new Date(raw);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    }
    return raw;
  }
  return fallback ?? "—";
}

interface Props {
  rows: MandiRow[];
  loadedState: string;
  loading: boolean;
  source: "live" | "mock";
  lastUpdated?: string;
  isHi: boolean;
  initialState: string;
  initialDistrict?: string;
  onLoadState: (state: string) => void;
  onEnrichDistrict: (state: string, district: string) => void;
}

export default function MandiPricesTable({
  rows,
  loadedState,
  loading,
  source,
  lastUpdated,
  isHi,
  initialState,
  initialDistrict,
  onLoadState,
  onEnrichDistrict,
}: Props) {
  const [draft, setDraft] = useState<MandiTableFilters>(() => ({
    state: initialState,
    district: initialDistrict ?? "",
    market: ALL,
    commodity: ALL,
    grade: ALL,
  }));
  const [applied, setApplied] = useState<MandiTableFilters | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");
  const [showFavourites, setShowFavourites] = useState(false);
  const { favourites, toggleFavourite } = useFavourites("agriveda_mandi_favs");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const dataReady = !loading && draft.state === loadedState;
  const indexState = dataReady ? loadedState : loadedState;

  const index = useMemo(() => buildMandiIndex(rows, indexState), [rows, indexState]);

  const districtOptions = useMemo(
    () => getDistrictsForState(draft.state),
    [draft.state]
  );

  const draftCtx: CascadeContext = useMemo(
    () => ({ ...draft, state: dataReady ? draft.state : loadedState }),
    [draft, dataReady, loadedState]
  );

  const cascade = useMemo(() => {
    if (!dataReady || !draft.district) {
      return { markets: [] as string[], commodities: [] as string[], grades: [] as string[] };
    }
    return cascadeFromIndex(index, draftCtx);
  }, [index, draftCtx, dataReady, draft.district]);

  const commodities = useMemo(() => {
    if (!draft.district || draft.market === ALL) return [];
    return cascade.commodities;
  }, [cascade.commodities, draft.district, draft.market]);

  const grades = useMemo(() => {
    if (!draft.district || draft.market === ALL || draft.commodity === ALL) return [];
    return cascade.grades;
  }, [cascade.grades, draft.district, draft.market, draft.commodity]);

  const filtered = useMemo(() => {
    let baseRows = rows;
    if (showFavourites) {
      baseRows = baseRows.filter((r) => favourites.includes(r.id));
    }

    const effectiveFilters = applied ?? {
      state: loadedState,
      district: initialDistrict ?? "",
      market: ALL,
      commodity: ALL,
      grade: ALL,
    };

    let result = filterTableRows(baseRows, effectiveFilters, searchQ);

    // If initial district filter returned 0 records, fall back to showing all state records
    if (result.length === 0 && !applied && !searchQ && !showFavourites && effectiveFilters.district) {
      result = filterTableRows(baseRows, { ...effectiveFilters, district: "" }, searchQ);
    }

    if (sortBy === "price_desc") {
      result = [...result].sort((a, b) => b.modal - a.modal);
    } else if (sortBy === "price_asc") {
      result = [...result].sort((a, b) => a.modal - b.modal);
    } else if (sortBy === "date_desc") {
      result = [...result].sort((a, b) => {
        if (!a.arrivalDate && !b.arrivalDate) return 0;
        if (!a.arrivalDate) return 1;
        if (!b.arrivalDate) return -1;
        return new Date(b.arrivalDate).getTime() - new Date(a.arrivalDate).getTime();
      });
    }

    return result;
  }, [rows, applied, loadedState, initialDistrict, searchQ, sortBy, showFavourites, favourites]);

  const summary = useMemo(() => {
    if (!filtered.length) return null;
    const markets = new Set(filtered.map(r => r.mandi)).size;
    const commodities = new Set(filtered.map(r => r.crop)).size;
    const avgPrice = Math.round(filtered.reduce((acc, r) => acc + r.modal, 0) / filtered.length);
    return { markets, commodities, avgPrice, total: filtered.length };
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleStateChange = (state: string) => {
    setDraft(EMPTY_FILTERS(state));
    onLoadState(state);
  };

  const handleDistrictChange = (district: string) => {
    setDraft((d) => ({
      ...d,
      district,
      market: ALL,
      commodity: ALL,
      grade: ALL,
    }));
    if (district && draft.state === loadedState) {
      onEnrichDistrict(draft.state, district);
    }
  };

  const applyFilters = () => {
    if (draft.state !== loadedState) {
      onLoadState(draft.state);
    }
    if (draft.district) {
      onEnrichDistrict(draft.state, draft.district);
    }
    setApplied(draft);
    setPage(1);
  };

  const clearFilters = () => {
    const next: MandiTableFilters = {
      state: initialState,
      district: initialDistrict ?? "",
      market: ALL,
      commodity: ALL,
      grade: ALL,
    };
    setDraft(next);
    setApplied(null);
    setSearchQ("");
    setPage(1);
    if (loadedState !== initialState) onLoadState(initialState);
    if (next.district) onEnrichDistrict(initialState, next.district);
  };

  const fieldClass =
    "w-full rounded-[1.1rem] border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3.5 py-3 text-[13px] font-bold text-[var(--av-text-primary)] outline-none transition-all focus:border-emerald-500 focus:bg-[var(--av-surface)] focus:ring-4 focus:ring-emerald-500/10 shadow-[var(--av-shadow-sm)] appearance-none";

  return (
    <div className="space-y-4" id="mandi-prices-table">
      {/* Summary Dashboard */}
      {summary && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-[1.5rem] border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]">
            <p className="text-[10px] font-bold text-[var(--av-text-muted)] uppercase tracking-wider">{isHi ? "कुल मंडियाँ" : "Total Markets"}</p>
            <p className="mt-1 text-2xl font-black text-[var(--av-text-primary)]">{summary.markets}</p>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]">
            <p className="text-[10px] font-bold text-[var(--av-text-muted)] uppercase tracking-wider">{isHi ? "कुल फसलें" : "Commodities"}</p>
            <p className="mt-1 text-2xl font-black text-[var(--av-text-primary)]">{summary.commodities}</p>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]">
            <p className="text-[10px] font-bold text-[var(--av-text-muted)] uppercase tracking-wider">{isHi ? "कुल रिकॉर्ड" : "Total Data"}</p>
            <p className="mt-1 text-2xl font-black text-[var(--av-text-primary)]">{summary.total}</p>
          </div>
          <div className="rounded-[1.5rem] border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5 p-4 shadow-[var(--av-shadow-sm)]">
            <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">{isHi ? "औसत भाव (₹/q)" : "Avg Price (₹/q)"}</p>
            <p className="mt-1 text-2xl font-black text-emerald-700 dark:text-emerald-300">₹{summary.avgPrice.toLocaleString("en-IN")}</p>
          </div>
        </div>
      )}

      {/* Quick Commodity Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {QUICK_CROPS.map((qc) => {
          const isSelected = (!qc.query && !searchQ) || (qc.query && searchQ.toLowerCase() === qc.query.toLowerCase());
          return (
            <button
              key={qc.labelEn}
              type="button"
              onClick={() => {
                setSearchQ(qc.query);
                setPage(1);
              }}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition active:scale-95",
                isSelected
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)] hover:border-emerald-500/40"
              )}
            >
              {isHi ? qc.labelHi : qc.labelEn}
            </button>
          );
        })}
      </div>

      {/* Collapsible Filters Section */}
      <div className="rounded-[1.5rem] border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 sm:p-5 shadow-[var(--av-shadow-sm)] relative overflow-hidden">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex w-full items-center justify-between text-left"
          aria-expanded={showFilters}
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <Filter className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[14px] font-bold text-[var(--av-text-primary)]">
                {isHi ? "राज्य व मंडी फ़िल्टर" : "State & Market Filters"}
              </p>
              <p className="text-[11px] font-medium text-[var(--av-text-muted)]">
                {draft.state}{draft.district ? ` · ${draft.district}` : ""}{applied ? ` · ${isHi ? "फ़िल्टर लागू" : "Applied"}` : ""}
              </p>
            </div>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--av-surface-inset)] text-[var(--av-text-secondary)]">
            <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", showFilters && "rotate-180")} />
          </span>
        </button>

        {showFilters && (
          <div className="mt-4 pt-3.5 border-t border-[var(--av-border)]">
            <div className="relative z-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <label className="block">
                <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--av-text-muted)]">
                  {isHi ? "राज्य" : "State"}
                </span>
                <select
                  className={fieldClass}
                  value={draft.state}
                  onChange={(e) => handleStateChange(e.target.value)}
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--av-text-muted)]">
                  {isHi ? "जिला" : "District"}
                </span>
                <select
                  className={fieldClass}
                  value={draft.district}
                  disabled={!draft.state}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                >
                  <option value="">{isHi ? "जिला चुनें" : "Select district"}</option>
                  {districtOptions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--av-text-muted)]">
                  {isHi ? "मंडी" : "Market"}
                </span>
                <select
                  className={fieldClass}
                  value={draft.market}
                  disabled={!draft.district || loading}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      market: e.target.value,
                      commodity: ALL,
                      grade: ALL,
                    }))
                  }
                >
                  <option value={ALL}>{isHi ? "मंडी चुनें" : "Select market"}</option>
                  {cascade.markets.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--av-text-muted)]">
                  {isHi ? "फसल" : "Commodity"}
                </span>
                <select
                  className={fieldClass}
                  value={draft.commodity}
                  disabled={!draft.district || draft.market === ALL || loading}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      commodity: e.target.value,
                      grade: ALL,
                    }))
                  }
                >
                  <option value={ALL}>{isHi ? "फसल चुनें" : "Select commodity"}</option>
                  {commodities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--av-text-muted)]">
                  {isHi ? "ग्रेड" : "Grade"}
                </span>
                <select
                  className={fieldClass}
                  value={draft.grade}
                  disabled={!draft.district || draft.market === ALL || draft.commodity === ALL || loading}
                  onChange={(e) => setDraft((d) => ({ ...d, grade: e.target.value }))}
                >
                  <option value={ALL}>{isHi ? "ग्रेड चुनें" : "Select grade"}</option>
                  {grades.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 relative z-10">
              <button
                type="button"
                onClick={applyFilters}
                disabled={loading}
                className="flex-1 sm:flex-none rounded-[1.1rem] bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-2.5 text-[13px] font-bold text-white shadow-md shadow-emerald-900/20 transition-all active:scale-[0.97] disabled:opacity-60"
              >
                {isHi ? "लागू करें (Apply)" : "Apply Filters"}
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="flex-1 sm:flex-none rounded-[1.1rem] border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-5 py-2.5 text-[13px] font-bold text-[var(--av-text-secondary)] shadow-sm transition-all hover:bg-[var(--av-surface)] active:scale-[0.97]"
              >
                {isHi ? "साफ करें (Clear)" : "Clear"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Header & Search */}
      <div className="flex flex-col gap-3 rounded-[1.5rem] border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)] sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[14px] font-bold text-[var(--av-text-primary)]">
          {isHi ? `${filtered.length} मंडी भाव रिकॉर्ड` : `${filtered.length} market record(s)`}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[150px] flex-1 sm:max-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
            <input
              type="search"
              value={searchQ}
              onChange={(e) => {
                setSearchQ(e.target.value);
                setPage(1);
              }}
              placeholder={isHi ? "खोजें…" : "Search…"}
              className="w-full rounded-[1.1rem] border border-[var(--av-border)] bg-[var(--av-surface-inset)] py-2.5 pl-9 pr-3 text-[13px] font-medium outline-none transition-all focus:border-emerald-500 focus:bg-[var(--av-surface)] focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>
          <div className="relative flex-1 sm:max-w-[160px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none rounded-[1.1rem] border border-[var(--av-border)] bg-[var(--av-surface-inset)] py-2.5 pl-9 pr-8 text-[13px] font-bold text-[var(--av-text-secondary)] outline-none transition-all focus:border-emerald-500 focus:bg-[var(--av-surface)] focus:ring-4 focus:ring-emerald-500/10"
            >
              <option value="date_desc">{isHi ? "नवीनतम" : "Latest"}</option>
              <option value="price_desc">{isHi ? "उच्चतम भाव" : "Highest Price"}</option>
              <option value="price_asc">{isHi ? "न्यूनतम भाव" : "Lowest Price"}</option>
            </select>
            <ArrowDownUp className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--av-text-muted)]" />
          </div>
          <button
            type="button"
            onClick={() => exportMandiCsv(filtered)}
            className="flex h-[42px] items-center gap-1.5 rounded-[1.1rem] border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-4 text-[12px] font-bold text-[var(--av-text-secondary)] shadow-[var(--av-shadow-sm)] transition active:scale-95"
          >
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
        </div>
      </div>

      {/* Modern Card List instead of Table */}
      <div className="space-y-3">
        {loading && pageRows.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[1.5rem] border border-[var(--av-border)] bg-[var(--av-surface)] p-12 shadow-[var(--av-shadow-sm)]">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500/20 border-t-emerald-500"></div>
            <p className="mt-3 text-sm font-bold text-[var(--av-text-secondary)]">
              {isHi ? "मंडी के भाव ला रहे हैं…" : "Loading prices…"}
            </p>
          </div>
        ) : pageRows.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[1.5rem] border border-[var(--av-border)] bg-[var(--av-surface)] p-12 text-center shadow-[var(--av-shadow-sm)]">
            <Search className="mb-2 h-8 w-8 text-slate-300" />
            <p className="text-sm font-bold text-[var(--av-text-secondary)]">
              {isHi
                ? "कोई रिकॉर्ड नहीं मिला। फ़िल्टर बदल कर देखें।"
                : "No records found. Try changing filters."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {pageRows.map((row) => {
              const isFav = favourites.includes(row.id);
              return (
              <div
                key={row.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[1.5rem] border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)] transition-all hover:border-emerald-500/30 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4 p-4">
                  <AppLink href={`/mandi/${encodeURIComponent(row.id)}`} className="flex flex-1 items-start gap-3 min-w-0 outline-none">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-xl shadow-inner dark:from-emerald-950 dark:to-emerald-900">
                      🌾
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-extrabold tracking-tight text-[var(--av-text-primary)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        {isHi && row.cropHi ? row.cropHi : row.crop}
                      </h3>
                      {isHi && row.cropHi ? (
                        <p className="truncate text-[11px] font-bold text-[var(--av-text-muted)]">
                          {row.crop}
                        </p>
                      ) : null}
                      
                      <div className="mt-1.5 flex items-center gap-1 text-[12px] font-semibold text-[var(--av-text-secondary)]">
                        <MapPin className="h-3 w-3 text-emerald-500 shrink-0" />
                        <span className="truncate">{row.mandi}, {row.district}</span>
                      </div>
                    </div>
                  </AppLink>
                  
                  <div className="shrink-0 text-right flex flex-col items-end">
                    <button 
                      type="button"
                      onClick={() => toggleFavourite(row.id)}
                      className="mb-1 rounded-full p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Star className={cn("h-4 w-4", isFav ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600")} />
                    </button>
                    <p className="text-xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                      {formatInr(row.modal)}
                      <span className="text-[10px] font-bold text-[var(--av-text-muted)] ml-0.5">/q</span>
                    </p>
                    <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-[var(--av-surface-inset)] px-2 py-0.5 border border-[var(--av-border)]">
                      <CalendarDays className="h-3 w-3 text-[var(--av-text-muted)]" />
                      <span className="text-[10px] font-bold text-[var(--av-text-secondary)]">
                        {formatDate(row.arrivalDate, lastUpdated?.split(",")[0])}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[var(--av-border)] bg-[var(--av-surface-inset)] px-4 py-2.5">
                  <div className="flex items-center gap-2 text-[11px] font-bold">
                    <span className="text-[var(--av-text-muted)] uppercase tracking-wider">Min</span>
                    <span className="text-[var(--av-text-primary)]">{formatInr(row.min)}</span>
                    <span className="mx-1 text-[var(--av-border)]">|</span>
                    <span className="text-[var(--av-text-muted)] uppercase tracking-wider">Max</span>
                    <span className="text-[var(--av-text-primary)]">{formatInr(row.max)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest",
                        source === "live"
                          ? "bg-sky-500/10 text-sky-700 dark:text-sky-300 ring-1 ring-sky-500/20"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/20"
                      )}
                    >
                      {source === "live" ? "Live" : "Sample"}
                    </span>
                    <span className="rounded bg-[var(--av-surface)] px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-[var(--av-text-secondary)] ring-1 ring-[var(--av-border)]">
                      {gradeLabel(row)}
                    </span>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-[1.5rem] border border-[var(--av-border)] bg-[var(--av-surface)] p-2 shadow-[var(--av-shadow-sm)]">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--av-surface-inset)] text-[var(--av-text-primary)] transition hover:bg-emerald-500/10 hover:text-emerald-600 disabled:opacity-30 disabled:hover:bg-[var(--av-surface-inset)] disabled:hover:text-[var(--av-text-primary)]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-bold text-[var(--av-text-primary)]">
              {safePage}
            </span>
            <span className="text-[13px] font-semibold text-[var(--av-text-muted)]">
              / {totalPages}
            </span>
          </div>

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--av-surface-inset)] text-[var(--av-text-primary)] transition hover:bg-emerald-500/10 hover:text-emerald-600 disabled:opacity-30 disabled:hover:bg-[var(--av-surface-inset)] disabled:hover:text-[var(--av-text-primary)]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
