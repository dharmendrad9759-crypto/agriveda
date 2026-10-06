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
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

export type MandiTableFilters = {
  state: string;
  district: string;
  market: string;
  commodity: string;
  grade: string;
};

const ALL = MANDI_FILTER_ALL;

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
  const [searchQ, setSearchQ] = useState("");
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
    if (!applied) return [];
    return filterTableRows(rows, { ...applied, state: loadedState }, searchQ);
  }, [rows, applied, loadedState, searchQ]);

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
      {/* Filters Section */}
      <div className="rounded-[1.5rem] border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)] sm:p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
          <Filter className="h-40 w-40" />
        </div>
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

        <div className="mt-5 flex flex-wrap gap-2 relative z-10">
          <button
            type="button"
            onClick={applyFilters}
            disabled={loading}
            className="flex-1 sm:flex-none rounded-[1.1rem] bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3 text-[13px] font-bold text-white shadow-md shadow-emerald-900/20 transition-all active:scale-[0.97] disabled:opacity-60"
          >
            {isHi ? "लागू करें (Apply)" : "Apply Filters"}
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="flex-1 sm:flex-none rounded-[1.1rem] border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-6 py-3 text-[13px] font-bold text-[var(--av-text-secondary)] shadow-sm transition-all hover:bg-[var(--av-surface)] active:scale-[0.97]"
          >
            {isHi ? "साफ करें (Clear)" : "Clear"}
          </button>
        </div>
      </div>

      {/* Header & Search */}
      <div className="flex flex-col gap-3 rounded-[1.5rem] border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)] sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[14px] font-bold text-[var(--av-text-primary)]">
          {isHi ? `${filtered.length} मंडी भाव रिकॉर्ड` : `${filtered.length} market record(s)`}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQ}
              onChange={(e) => {
                setSearchQ(e.target.value);
                setPage(1);
              }}
              placeholder={isHi ? "खोजें (Search)…" : "Search…"}
              className="w-full rounded-[1.1rem] border border-[var(--av-border)] bg-[var(--av-surface-inset)] py-2.5 pl-10 pr-4 text-[13px] font-medium outline-none transition-all focus:border-emerald-500 focus:bg-[var(--av-surface)] focus:ring-4 focus:ring-emerald-500/10"
            />
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
            {pageRows.map((row) => (
              <AppLink
                key={row.id}
                href={`/mandi/${encodeURIComponent(row.id)}`}
                className="group flex flex-col justify-between overflow-hidden rounded-[1.5rem] border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)] transition-all hover:border-emerald-500/30 hover:shadow-md active:scale-[0.98]"
              >
                <div className="flex items-start justify-between gap-4 p-4">
                  <div className="flex flex-1 items-start gap-3 min-w-0">
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
                  </div>
                  
                  <div className="shrink-0 text-right">
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
              </AppLink>
            ))}
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
