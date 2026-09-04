import type { MandiRow } from "@/lib/mandi/types";
import { rowMatchesDistrict, rowMatchesState, gradeLabel, MANDI_FILTER_ALL } from "./cascadeFilters";

export type MandiIndex = {
  districtsFromData: string[];
  rowsByDistrict: Map<string, MandiRow[]>;
};

function districtKey(district: string): string {
  return district.trim().toLowerCase() || "__all__";
}

/** One pass over rows — fast cascade lookups */
export function buildMandiIndex(rows: MandiRow[], state: string): MandiIndex {
  const inState = rows.filter((r) => rowMatchesState(r, state));
  const rowsByDistrict = new Map<string, MandiRow[]>();
  const districtSet = new Set<string>();

  for (const row of inState) {
    const d = row.district?.trim() || "";
    if (d) districtSet.add(d);
    const key = districtKey(d);
    const list = rowsByDistrict.get(key) ?? [];
    list.push(row);
    rowsByDistrict.set(key, list);
  }

  return {
    districtsFromData: [...districtSet].sort((a, b) =>
      a.localeCompare(b, "en", { sensitivity: "base" })
    ),
    rowsByDistrict,
  };
}

function rowsForDistrict(index: MandiIndex, district: string): MandiRow[] {
  if (!district.trim()) {
    const all: MandiRow[] = [];
    index.rowsByDistrict.forEach((list) => all.push(...list));
    return all;
  }
  const q = district.trim().toLowerCase();
  const matched: MandiRow[] = [];
  const seen = new Set<string>();

  const add = (row: MandiRow) => {
    if (seen.has(row.id)) return;
    seen.add(row.id);
    matched.push(row);
  };

  index.rowsByDistrict.forEach((list, key) => {
    if (key === "__all__") return;
    if (key === q || key.includes(q) || q.includes(key)) {
      list.forEach(add);
    }
  });
  index.rowsByDistrict.forEach((list) => {
    list.forEach((row) => {
      if (row.mandi.toLowerCase().includes(q)) add(row);
    });
  });

  return matched;
}

export type CascadeContext = {
  state: string;
  district: string;
  market: string;
  commodity: string;
  grade?: string;
};

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "en", { sensitivity: "base" })
  );
}

export function cascadeFromIndex(index: MandiIndex, ctx: CascadeContext) {
  const inDistrict = rowsForDistrict(index, ctx.district);
  const markets = uniqueSorted(inDistrict.map((r) => r.mandi).filter((m) => m && m !== "—"));

  const inMarket =
    !ctx.market || ctx.market === MANDI_FILTER_ALL
      ? inDistrict
      : inDistrict.filter((r) => {
          const a = r.mandi.toLowerCase();
          const b = ctx.market.toLowerCase();
          return a === b || a.includes(b) || b.includes(a);
        });

  const commodities = uniqueSorted(inMarket.map((r) => r.crop));
  const inCommodity =
    !ctx.commodity || ctx.commodity === MANDI_FILTER_ALL
      ? inMarket
      : inMarket.filter((r) => r.crop.toLowerCase() === ctx.commodity.toLowerCase());
  const grades = uniqueSorted(inCommodity.map(gradeLabel));

  return { markets, commodities, grades };
}

export function filterTableRows(rows: MandiRow[], ctx: CascadeContext, searchQ = ""): MandiRow[] {
  const q = searchQ.trim().toLowerCase();
  return rows.filter((r) => {
    if (!rowMatchesState(r, ctx.state)) return false;
    if (!rowMatchesDistrict(r, ctx.district)) return false;
    if (ctx.market && ctx.market !== MANDI_FILTER_ALL) {
      const a = r.mandi.toLowerCase();
      const b = ctx.market.toLowerCase();
      if (a !== b && !a.includes(b) && !b.includes(a)) return false;
    }
    if (ctx.commodity && ctx.commodity !== MANDI_FILTER_ALL) {
      if (r.crop.toLowerCase() !== ctx.commodity.toLowerCase()) return false;
    }
    if (ctx.grade && ctx.grade !== MANDI_FILTER_ALL && gradeLabel(r) !== ctx.grade) return false;
    if (!q) return true;
    return (
      r.crop.toLowerCase().includes(q) ||
      r.cropHi.toLowerCase().includes(q) ||
      r.mandi.toLowerCase().includes(q) ||
      (r.district ?? "").toLowerCase().includes(q)
    );
  });
}
