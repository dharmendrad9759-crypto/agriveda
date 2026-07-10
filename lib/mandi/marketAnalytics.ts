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

export function topMandisFromRows(rows: MandiRow[], limit = 4) {
  const byMandi = new Map<string, { mandi: string; price: number; change: number; crop: string }>();
  for (const r of rows) {
    const existing = byMandi.get(r.mandi);
    if (!existing || r.modal > existing.price) {
      byMandi.set(r.mandi, {
        mandi: r.mandi,
        price: r.modal,
        change: r.change,
        crop: r.crop,
      });
    }
  }
  return [...byMandi.values()]
    .sort((a, b) => b.price - a.price)
    .slice(0, limit)
    .map((m) => ({
      id: m.mandi,
      name: `${m.mandi} Mandi`,
      price: m.price,
      change: m.change,
      crop: m.crop,
    }));
}

export function topMarketsTrend(rows: MandiRow[], crop: string, limit = 5) {
  const cropRows = rows.filter((r) => r.crop.toLowerCase() === crop.toLowerCase());
  const byMandi = new Map<string, MandiRow>();
  for (const r of cropRows) {
    const existing = byMandi.get(r.mandi);
    if (!existing || r.modal > existing.modal) byMandi.set(r.mandi, r);
  }
  return [...byMandi.values()]
    .sort((a, b) => b.modal - a.modal)
    .slice(0, limit)
    .map((r) => ({
      id: `${r.mandi}-${r.crop}-${r.variety}`,
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

const DONUT_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444", "#6b7280"];

export function commodityCategoryDonut(rows: MandiRow[]) {
  const counts = new Map<string, number>();
  rows.forEach((r) => counts.set(r.category, (counts.get(r.category) ?? 0) + 1));
  const total = rows.length || 1;
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, count], i) => ({
      label,
      value: Math.round((count / total) * 100),
      color: DONUT_COLORS[i % DONUT_COLORS.length],
    }));
}

export function computedMarketInsights(rows: MandiRow[], crop?: string): string[] {
  if (!rows.length) {
    return ["Mandi data load hone ke baad insights yahan dikhenge."];
  }

  const stats = marketStats(rows);
  const insights: string[] = [
    `${stats.tracked} commodities tracked — market outlook ${stats.trend.toLowerCase()}.`,
  ];

  if (stats.avgChange !== 0) {
    insights.push(
      `Average price change across mandis: ${stats.avgChange > 0 ? "+" : ""}${stats.avgChange}% vs previous snapshot.`
    );
  }

  const topGainer = [...rows].sort((a, b) => b.change - a.change)[0];
  if (topGainer?.change > 0) {
    insights.push(`${topGainer.crop} at ${topGainer.mandi} up ${topGainer.change}% — strongest gainer today.`);
  }

  const topLoser = [...rows].sort((a, b) => a.change - b.change)[0];
  if (topLoser?.change < 0) {
    insights.push(`${topLoser.crop} at ${topLoser.mandi} down ${Math.abs(topLoser.change)}% — watch before selling.`);
  }

  if (crop) {
    const summary = cropSummary(rows, crop);
    if (summary) {
      insights.push(
        `${crop} modal avg ₹${summary.modal.toLocaleString("en-IN")}/q — range ₹${summary.min.toLocaleString("en-IN")}–₹${summary.max.toLocaleString("en-IN")} across ${summary.count} mandi(s).`
      );
    }
  }

  return insights.slice(0, 5);
}

export function chartSeriesForRange(
  history: number[],
  fallbackTrend: number[],
  range: string
): number[] {
  if (history.length >= 2) {
    if (range === "1y" && history.length >= 7) {
      const step = Math.max(1, Math.floor(history.length / 7));
      return Array.from({ length: 7 }, (_, i) => history[Math.min(i * step, history.length - 1)]);
    }
    if (range === "30d" && history.length >= 7) return history.slice(-7);
    return history.length >= 7 ? history.slice(-7) : history;
  }
  return fallbackTrend.length ? fallbackTrend : [0];
}
