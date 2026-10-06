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
    "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-[13px] font-bold text-slate-700 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10";

  return (
    <div className="space-y-4" id="mandi-prices-table">
      <div className="rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm ring-1 ring-slate-900/5 sm:p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
          <Search className="h-40 w-40" />
        </div>
        <div className="relative">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <label className="block">
            <span className="mb-1 block text-[11px] font-bold text-[var(--av-text-muted)]">
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
            <span className="mb-1 block text-[11px] font-bold text-[var(--av-text-muted)]">
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
            <span className="mb-1 block text-[11px] font-bold text-[var(--av-text-muted)]">
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
            <span className="mb-1 block text-[11px] font-bold text-[var(--av-text-muted)]">
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
            <span className="mb-1 block text-[11px] font-bold text-[var(--av-text-muted)]">
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

        </div>

        <div className="mt-5 flex flex-wrap gap-2 relative">
          <button
            type="button"
            onClick={applyFilters}
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2.5 text-[13px] font-bold text-white shadow-md shadow-emerald-900/20 transition-all active:scale-[0.97] disabled:opacity-60"
          >
            {isHi ? "लागू करें (Apply)" : "Apply Filters"}
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-[13px] font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-[0.97]"
          >
            {isHi ? "साफ करें (Clear)" : "Clear"}
          </button>
        </div>
      </div>

      </div>

      <div className="rounded-[1.5rem] border border-slate-100 bg-white shadow-sm ring-1 ring-slate-900/5 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] font-bold text-slate-800">
            {isHi ? `${filtered.length} मंडी भाव रिकॉर्ड` : `${filtered.length} market record(s)`}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQ}
                onChange={(e) => {
                  setSearchQ(e.target.value);
                  setPage(1);
                }}
                placeholder={isHi ? "टेबल में खोजें…" : "Search table…"}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-3 text-[13px] font-medium outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => exportMandiCsv(filtered)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 active:scale-95"
            >
              CSV
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 active:scale-95"
            >
              {isHi ? "प्रिंट (Print)" : "Print"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-white px-4 py-3 text-[12px] font-medium text-slate-500">
          <label className="flex items-center gap-2">
            {isHi ? "दिखाएँ" : "Show"}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 font-bold text-slate-700 outline-none focus:border-emerald-500"
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            {isHi ? "रिकॉर्ड" : "entries"}
          </label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-40 active:scale-95"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 font-bold text-slate-700">
              {safePage} <span className="text-slate-400 font-medium">/ {totalPages}</span>
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-40 active:scale-95"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
                <th className="px-4 py-3.5 whitespace-nowrap">{isHi ? "फसल" : "Commodity"}</th>
                <th className="px-4 py-3.5 whitespace-nowrap">{isHi ? "मंडी / स्थान" : "Mandi / Location"}</th>
                <th className="px-4 py-3.5 whitespace-nowrap">{isHi ? "मॉडल भाव (Modal)" : "Modal Price"}</th>
                <th className="px-4 py-3.5 whitespace-nowrap">{isHi ? "भाव सीमा (Range)" : "Price Range"}</th>
                <th className="px-4 py-3.5 whitespace-nowrap">{isHi ? "ग्रेड" : "Grade"}</th>
                <th className="px-4 py-3.5 whitespace-nowrap">{isHi ? "तारीख" : "Date"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60 bg-white">
              {loading && pageRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600"></div>
                    <p className="mt-2 text-sm font-semibold text-slate-500">{isHi ? "मंडी के भाव ला रहे हैं…" : "Loading prices…"}</p>
                  </td>
                </tr>
              ) : pageRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm font-semibold text-slate-500">
                    {isHi
                      ? "कोई रिकॉर्ड नहीं मिला। फ़िल्टर बदल कर देखें।"
                      : "No records found. Try changing filters."}
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => (
                  <tr
                    key={row.id}
                    className="group transition-colors hover:bg-slate-50/80"
                  >
                    <td className="px-4 py-3.5">
                      <AppLink
                        href={`/mandi/${encodeURIComponent(row.id)}`}
                        className="text-[14px] font-extrabold text-slate-800 transition-colors group-hover:text-emerald-700 block"
                      >
                        {isHi && row.cropHi ? row.cropHi : row.crop}
                      </AppLink>
                      {isHi && row.cropHi ? (
                        <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{row.crop}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-[14px] font-bold text-slate-700">{row.mandi}</p>
                      <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                        {[row.district, row.state].filter(Boolean).join(", ")}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="inline-flex items-baseline gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-emerald-700 ring-1 ring-emerald-600/10">
                        <span className="text-[16px] font-black tracking-tight">
                          {formatInr(row.modal)}
                        </span>
                        <span className="text-[10px] font-bold opacity-75">/q</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[13px] font-bold text-slate-500 whitespace-nowrap">
                      {formatInr(row.min)} <span className="text-slate-300 px-0.5">–</span> {formatInr(row.max)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">
                        {gradeLabel(row)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <p className="text-[12px] font-bold text-slate-600">
                        {formatDate(row.arrivalDate, lastUpdated?.split(",")[0])}
                      </p>
                      <span
                        className={cn(
                          "inline-block mt-1 rounded px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider uppercase",
                          source === "live"
                            ? "bg-sky-50 text-sky-600 ring-1 ring-sky-600/10"
                            : "bg-amber-50 text-amber-600 ring-1 ring-amber-600/10"
                        )}
                      >
                        {source === "live" ? "Govt. Data" : isHi ? "नमूना" : "Sample"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
