import type { MandiRow } from "@/lib/mandi/types";

const PRIORITY_CROPS = ["Paddy", "Wheat", "Soybean", "Maize", "Gram", "Mustard", "Cotton", "Tomato"];

export function uniqueCrops(rows: MandiRow[]): string[] {
  const counts = new Map<string, number>();
  rows.forEach((r) => counts.set(r.crop, (counts.get(r.crop) ?? 0) + 1));
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c);
  const priority = PRIORITY_CROPS.filter((c) => counts.has(c));
  const rest = sorted.filter((c) => !priority.includes(c));
  return [...priority, ...rest].slice(0, 12);
}

export function uniqueMarkets(rows: MandiRow[]): string[] {
  return [...new Set(rows.map((r) => r.mandi))].filter((m) => m !== "—").slice(0, 20);
}

export function filterMandiRows(
  rows: MandiRow[],
  crop: string,
  market: string
): MandiRow[] {
  return rows.filter((r) => {
    const cropMatch = crop === "All" || r.crop.toLowerCase() === crop.toLowerCase();
    const marketMatch = market === "All Markets" || r.mandi === market;
    return cropMatch && marketMatch;
  });
}

export function cropSummary(rows: MandiRow[], crop: string) {
  const cropRows = rows.filter((r) => r.crop.toLowerCase() === crop.toLowerCase());
  if (!cropRows.length) return null;

  const modal = Math.round(cropRows.reduce((s, r) => s + r.modal, 0) / cropRows.length);
  const min = Math.min(...cropRows.map((r) => r.min));
  const max = Math.max(...cropRows.map((r) => r.max));
  const change = cropRows[0]?.change ?? 0;
  const changeAmt = cropRows[0]?.changeAmt ?? 0;
  const trend = cropRows[0]?.trend?.length ? cropRows[0].trend : sparkline(modal);

  return { modal, min, max, change, changeAmt, trend, count: cropRows.length };
}

export function topMarketsTrend(rows: MandiRow[], crop: string, limit = 5) {
  const cropRows = rows.filter((r) => r.crop.toLowerCase() === crop.toLowerCase());
  return [...cropRows]
    .sort((a, b) => b.modal - a.modal)
    .slice(0, limit)
    .map((r) => ({
      market: r.mandi,
      price: r.modal,
      change: r.change,
      trend: r.trend,
    }));
}

export function commodityTrendsList(rows: MandiRow[], limit = 6) {
  const byCrop = new Map<string, MandiRow[]>();
  rows.forEach((r) => {
    const list = byCrop.get(r.crop) ?? [];
    list.push(r);
    byCrop.set(r.crop, list);
  });

  return [...byCrop.entries()]
    .map(([name, list]) => {
      const modal = Math.round(list.reduce((s, r) => s + r.modal, 0) / list.length);
      const change = list[0]?.change ?? 0;
      return {
        name,
        trend: list[0]?.trend ?? sparkline(modal),
        change,
        up: change >= 0,
      };
    })
    .sort((a, b) => b.change - a.change)
    .slice(0, limit);
}

export function marketStats(rows: MandiRow[]) {
  const crops = uniqueCrops(rows);
  const avgChange =
    rows.length > 0
      ? Math.round((rows.reduce((s, r) => s + r.change, 0) / rows.length) * 10) / 10
      : 0;
  const rising = rows.filter((r) => r.change > 0).length;
  const trend =
    rising > rows.length / 2 ? "Bullish" : rising < rows.length / 3 ? "Bearish" : "Mixed";

  return {
    tracked: crops.length,
    trend,
    avgChange,
    commodities: crops.length,
  };
}

function sparkline(modal: number): number[] {
  const base = modal * 0.97;
  return Array.from({ length: 7 }, (_, i) => Math.round(base + ((modal - base) * i) / 6));
}

export function trendLabels(range: string): string[] {
  if (range === "30d") return Array.from({ length: 7 }, (_, i) => `W${i + 1}`);
  if (range === "1y") return ["Jan", "Mar", "May", "Jul", "Sep", "Nov", "Dec"];
  return Array.from({ length: 7 }, (_, i) => `D-${6 - i}`);
}
