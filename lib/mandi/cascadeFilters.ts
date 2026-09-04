import type { MandiRow } from "@/lib/mandi/types";

export const MANDI_FILTER_ALL = "__all__";

function norm(s: string): string {
  return s.trim().toLowerCase();
}

export function gradeLabel(row: MandiRow): string {
  const v = row.variety?.trim();
  if (!v || v === "—") return "FAQ";
  return v;
}

export function rowMatchesState(row: MandiRow, state: string): boolean {
  return norm(row.state) === norm(state);
}

export function rowMatchesDistrict(row: MandiRow, district: string): boolean {
  const q = norm(district);
  if (!q) return true;
  const d = norm(row.district ?? "");
  const m = norm(row.mandi);
  return d === q || d.includes(q) || m.includes(q);
}

export function rowMatchesMarket(row: MandiRow, market: string): boolean {
  if (!market || market === MANDI_FILTER_ALL) return true;
  const a = norm(row.mandi);
  const b = norm(market);
  return a === b || a.includes(b) || b.includes(a);
}

export function rowMatchesCommodity(row: MandiRow, commodity: string): boolean {
  if (!commodity || commodity === MANDI_FILTER_ALL) return true;
  return norm(row.crop) === norm(commodity);
}

export function rowMatchesGrade(row: MandiRow, grade: string): boolean {
  if (!grade || grade === MANDI_FILTER_ALL) return true;
  return gradeLabel(row) === grade;
}

export type CascadeContext = {
  state: string;
  district: string;
  market: string;
  commodity: string;
  grade?: string;
};

/** Rows strictly for selected state (drops stray states from API noise). */
export function rowsForState(rows: MandiRow[], state: string): MandiRow[] {
  return rows.filter((r) => rowMatchesState(r, state));
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "en", { sensitivity: "base" })
  );
}

/** District → Market → Commodity → Grade dropdowns from real rows only. */
export function buildCascadeOptions(rows: MandiRow[], ctx: CascadeContext) {
  const inState = rowsForState(rows, ctx.state);
  const districts = uniqueSorted(inState.map((r) => r.district ?? "").filter(Boolean));

  const inDistrict = inState.filter((r) => rowMatchesDistrict(r, ctx.district));
  const markets = uniqueSorted(inDistrict.map((r) => r.mandi).filter((m) => m && m !== "—"));

  const inMarket = inDistrict.filter((r) => rowMatchesMarket(r, ctx.market));
  const commodities = uniqueSorted(inMarket.map((r) => r.crop));

  const inCommodity = inMarket.filter((r) => rowMatchesCommodity(r, ctx.commodity));
  const grades = uniqueSorted(inCommodity.map(gradeLabel));

  return { districts, markets, commodities, grades };
}

export function filterTableRows(rows: MandiRow[], ctx: CascadeContext, searchQ = ""): MandiRow[] {
  const q = searchQ.trim().toLowerCase();
  return rowsForState(rows, ctx.state).filter((r) => {
    if (!rowMatchesDistrict(r, ctx.district)) return false;
    if (!rowMatchesMarket(r, ctx.market)) return false;
    if (!rowMatchesCommodity(r, ctx.commodity)) return false;
    if (!rowMatchesGrade(r, ctx.grade ?? MANDI_FILTER_ALL)) return false;
    if (!q) return true;
    return (
      r.crop.toLowerCase().includes(q) ||
      r.cropHi.toLowerCase().includes(q) ||
      r.mandi.toLowerCase().includes(q) ||
      (r.district ?? "").toLowerCase().includes(q)
    );
  });
}
