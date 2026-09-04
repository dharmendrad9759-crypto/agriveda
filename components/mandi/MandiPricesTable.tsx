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
    "w-full rounded-lg border border-[var(--av-border)] bg-white px-3 py-2 text-[13px] font-medium text-[var(--av-text-primary)] outline-none focus:border-emerald-500 dark:bg-[var(--av-surface)]";

  return (
    <div className="space-y-4" id="mandi-prices-table">
      <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-[var(--av-shadow-sm)] sm:p-4">
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

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={applyFilters}
            disabled={loading}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-[13px] font-bold text-white active:scale-[0.98] disabled:opacity-60"
          >
            {isHi ? "लागू करें" : "Apply"}
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-emerald-700 px-4 py-2 text-[13px] font-bold text-emerald-800 active:scale-[0.98] dark:text-emerald-300"
          >
            {isHi ? "साफ करें" : "Clear"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)]">
        <div className="flex flex-col gap-3 border-b border-[var(--av-border)] p-3.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] font-semibold text-[var(--av-text-primary)]">
            {isHi ? `${filtered.length} भाव रिकॉर्ड` : `${filtered.length} record(s)`}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
              <input
                type="search"
                value={searchQ}
                onChange={(e) => {
                  setSearchQ(e.target.value);
                  setPage(1);
                }}
                placeholder={isHi ? "टेबल में खोजें…" : "Search table…"}
                className="w-full rounded-lg border border-[var(--av-border)] py-2 pl-9 pr-3 text-[13px] outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="button"
              onClick={() => exportMandiCsv(filtered)}
              className="rounded-lg border border-[var(--av-border)] px-3 py-2 text-[12px] font-bold text-[var(--av-text-secondary)]"
            >
              CSV
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg border border-[var(--av-border)] px-3 py-2 text-[12px] font-bold text-[var(--av-text-secondary)]"
            >
              {isHi ? "प्रिंट" : "Print"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--av-border)] px-3.5 py-2 text-[12px] text-[var(--av-text-muted)]">
          <label className="flex items-center gap-2">
            {isHi ? "दिखाएँ" : "Show"}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="rounded border border-[var(--av-border)] px-2 py-1"
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
              className="rounded border border-[var(--av-border)] px-2 py-1 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 font-semibold text-[var(--av-text-primary)]">
              {safePage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded border border-[var(--av-border)] px-2 py-1 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[11px] font-bold uppercase tracking-wide text-[var(--av-text-muted)]">
                <th className="px-3 py-2.5">{isHi ? "फसल" : "Commodity"}</th>
                <th className="px-3 py-2.5">{isHi ? "मंडी / स्थान" : "Mandi / Location"}</th>
                <th className="px-3 py-2.5">{isHi ? "मॉडल भाव" : "Modal Price"}</th>
                <th className="px-3 py-2.5">{isHi ? "भाव सीमा" : "Price Range"}</th>
                <th className="px-3 py-2.5">{isHi ? "ग्रेड" : "Grade"}</th>
                <th className="px-3 py-2.5">{isHi ? "स्रोत" : "Source"}</th>
                <th className="px-3 py-2.5">{isHi ? "तारीख" : "Date"}</th>
              </tr>
            </thead>
            <tbody>
              {loading && pageRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-[var(--av-text-muted)]">
                    {isHi ? "लोड हो रहा है…" : "Loading…"}
                  </td>
                </tr>
              ) : pageRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-[var(--av-text-muted)]">
                    {isHi
                      ? "फ़िल्टर चुनें और «लागू करें» दबाएँ"
                      : "Choose filters and click Apply"}
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[var(--av-border-subtle)] transition hover:bg-[var(--av-surface-inset)]/50"
                  >
                    <td className="px-3 py-3">
                      <AppLink
                        href={`/mandi/${encodeURIComponent(row.id)}`}
                        className="font-bold text-[var(--av-text-primary)] hover:text-emerald-700"
                      >
                        {isHi && row.cropHi ? row.cropHi : row.crop}
                      </AppLink>
                      {isHi && row.cropHi ? (
                        <p className="text-[11px] text-[var(--av-text-muted)]">{row.crop}</p>
                      ) : null}
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-bold text-[var(--av-text-primary)]">{row.mandi}</p>
                      <p className="text-[11px] text-[var(--av-text-muted)]">
                        {[row.district, row.state].filter(Boolean).join(", ")}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-[15px] font-black text-emerald-600">
                        {formatInr(row.modal)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[var(--av-text-secondary)]">
                      {formatInr(row.min)} – {formatInr(row.max)}
                    </td>
                    <td className="px-3 py-3 text-[var(--av-text-secondary)]">{gradeLabel(row)}</td>
                    <td className="px-3 py-3">
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[10px] font-bold",
                          source === "live"
                            ? "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-200"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200"
                        )}
                      >
                        {source === "live" ? "data.gov.in" : "demo"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[var(--av-text-muted)]">
                      {formatDate(row.arrivalDate, lastUpdated?.split(",")[0])}
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
