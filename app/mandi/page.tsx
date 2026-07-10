"use client";

import { useMemo, useState } from "react";
import { Search, Filter, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import AppShell, { ShellCtaBanner } from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import StatCard from "@/components/shell/StatCard";
import { LineChart, Sparkline, DonutChart } from "@/components/shell/charts";
import { useToast } from "@/components/ui/Toast";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMandiPrices } from "@/hooks/useMandiPrices";
import { usePriceAlerts } from "@/hooks/usePriceAlerts";
import {
  TOP_MANDIS,
  MANDI_NEWS,
} from "@/data/mock/mandi";
import { topMandisFromRows, commodityCategoryDonut, computedMarketInsights, uniqueCrops } from "@/lib/mandi/marketAnalytics";
import PriceAlertsPanel from "@/components/alerts/PriceAlertsPanel";
import { MapPin, Package, Activity, Bell } from "lucide-react";
import { AV } from "@/lib/design/tokens";

export default function MandiPage() {
  const { showToast } = useToast();
  const { profile } = useFarmerProfile();
  const state = profile.state.trim() || "Madhya Pradesh";
  const district = profile.district.trim() || undefined;
  const { data, loading, refresh } = useMandiPrices({ state, district });

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"high" | "low" | "change">("high");
  const [category, setCategory] = useState<string | null>(null);
  const [chartCrop, setChartCrop] = useState("Paddy");

  const rows = data?.rows ?? [];
  const locationLabel = district ? `${district}, ${state}` : state;

  const filtered = useMemo(() => {
    let list = rows.filter(
      (r) =>
        (category ? r.category === category : true) &&
        (r.crop.toLowerCase().includes(search.toLowerCase()) ||
          r.cropHi.includes(search) ||
          r.mandi.toLowerCase().includes(search.toLowerCase()))
    );
    if (sort === "high") list = [...list].sort((a, b) => b.modal - a.modal);
    if (sort === "low") list = [...list].sort((a, b) => a.modal - b.modal);
    if (sort === "change") list = [...list].sort((a, b) => b.change - a.change);
    return list;
  }, [rows, search, sort, category]);

  const topMandis = useMemo(() => {
    const live = topMandisFromRows(rows);
    if (live.length) return live;
    return TOP_MANDIS.map((m) => ({ ...m, id: m.name }));
  }, [rows]);

  const crops = useMemo(() => uniqueCrops(rows), [rows]);
  const activeChartCrop = crops.includes(chartCrop) ? chartCrop : crops[0] ?? "Paddy";
  const chartRow = rows.find((r) => r.crop === activeChartCrop);
  const chartTrend = chartRow?.trend ?? [2100, 2120, 2140, 2150, 2160, 2170, 2180];
  const categorySegments = useMemo(() => commodityCategoryDonut(rows), [rows]);
  const mandiInsights = useMemo(() => computedMarketInsights(rows, activeChartCrop), [rows, activeChartCrop]);
  const { activeCount } = usePriceAlerts();

  return (
    <AppShell
      title="Mandi Prices"
      subtitle="Live mandi rates, market trends & price insights"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Mandi Prices" }]}
    >
      {data?.error && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-200">
          {data.error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={MapPin} label="Selected Location" value={locationLabel} action={{ label: "Change Location", href: "/profile" }} />
        <StatCard icon={Package} label="Total Commodities" value={`${rows.length} Crops`} action={{ label: "View All", href: "/market-trends" }} />
        <StatCard
          icon={Activity}
          label="Market Status"
          value={data?.source === "live" ? "Live" : "Sample"}
          sub={data?.lastUpdated ?? "—"}
        />
        <StatCard icon={Bell} label="Price Alerts" value={`${activeCount} Active`} action={{ label: "Manage Below", href: "#price-alerts" }} />
      </div>

      <DarkCard className="mt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search crop (Wheat, Paddy, Soybean...)"
              className="w-full rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] py-2.5 pl-10 pr-3 text-sm text-[var(--av-text-primary)] outline-none focus:border-[#10b981]"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2.5 text-sm text-[var(--av-text-primary)]"
          >
            <option value="high">Price (High to Low)</option>
            <option value="low">Price (Low to High)</option>
            <option value="change">Change %</option>
          </select>
          <button
            type="button"
            onClick={() => {
              const next = category ? null : categorySegments[0]?.label ?? rows[0]?.category ?? null;
              setCategory(next);
              showToast(next ? `Filter: ${next}` : "Filter cleared");
            }}
            className="av-btn av-btn-sm av-btn-primary inline-flex gap-1"
          >
            <Filter className="h-4 w-4" /> Filter
          </button>
          <button
            type="button"
            onClick={() => refresh()}
            disabled={loading}
            className="av-btn av-btn-sm av-btn-secondary inline-flex gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </DarkCard>

      <DarkCard className="mt-4 overflow-hidden p-0" delay={1}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-muted)]">
                <th className="px-4 py-3 font-semibold">Commodity</th>
                <th className="px-4 py-3 font-semibold">Variety</th>
                <th className="px-4 py-3 font-semibold">Mandi</th>
                <th className="px-4 py-3 font-semibold">Min</th>
                <th className="px-4 py-3 font-semibold">Max</th>
                <th className="px-4 py-3 font-semibold">Modal</th>
                <th className="px-4 py-3 font-semibold">Change</th>
                <th className="px-4 py-3 font-semibold">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]">
              {loading && filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[var(--av-text-muted)]">
                    Loading mandi rates…
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.id} className="transition hover:bg-[var(--av-surface-inset)]/50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[var(--av-text-primary)]">{row.crop} ({row.cropHi})</p>
                      <p className="text-[10px] text-[var(--av-text-muted)]">{row.category}</p>
                    </td>
                    <td className="px-4 py-3 text-[var(--av-text-secondary)]">{row.variety}</td>
                    <td className="px-4 py-3 text-[var(--av-text-secondary)]">{row.mandi}, {row.state}</td>
                    <td className="px-4 py-3 font-mono text-[var(--av-text-primary)]">₹{row.min}</td>
                    <td className="px-4 py-3 font-mono text-[var(--av-text-primary)]">₹{row.max}</td>
                    <td className="px-4 py-3 font-mono font-bold text-[var(--av-accent)]">₹{row.modal}</td>
                    <td className={`px-4 py-3 font-semibold ${row.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {row.change !== 0 && (row.change >= 0 ? <TrendingUp className="inline h-3 w-3" /> : <TrendingDown className="inline h-3 w-3" />)}
                      {row.change !== 0 ? `${row.change > 0 ? "+" : ""}${row.change}%` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Sparkline data={row.trend} color={row.change >= 0 ? "#10b981" : "#f87171"} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DarkCard>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <DarkCard hover delay={2}>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Price Trend — {activeChartCrop}</h3>
            <select
              value={activeChartCrop}
              onChange={(e) => setChartCrop(e.target.value)}
              className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-2 py-1 text-[10px] text-[var(--av-text-primary)]"
            >
              {(crops.length ? crops : ["Paddy", "Wheat", "Soybean"]).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <LineChart
            labels={chartTrend.map((_, i) => `D-${chartTrend.length - i}`)}
            series={[{ name: "Modal", data: chartTrend, color: "#10b981" }]}
          />
        </DarkCard>
        <DarkCard hover delay={3}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Top Mandi Prices (Today)</h3>
          <ul className="mt-3 space-y-2">
            {topMandis.map((m, i) => (
              <li key={m.id} className="flex items-center justify-between rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2">
                <span className="text-xs text-[var(--av-text-secondary)]">#{i + 1} {m.name}</span>
                <span className="font-mono text-sm font-bold text-[var(--av-accent)]">₹{m.price}</span>
              </li>
            ))}
          </ul>
        </DarkCard>
      </div>

      <div id="price-alerts" className="mt-4 grid gap-4 lg:grid-cols-3">
        <PriceAlertsPanel rows={rows} className="lg:col-span-1" />
        <DarkCard hover delay={2}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Market Insights</h3>
          <ul className="mt-3 space-y-2 text-xs text-[var(--av-text-secondary)]">
            {mandiInsights.map((ins) => (
              <li key={ins} className="flex gap-2"><span className="text-[var(--av-accent)]">•</span>{ins}</li>
            ))}
          </ul>
        </DarkCard>
        <DarkCard hover delay={3}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Commodity Category</h3>
          <div className="mt-3">
            <DonutChart segments={categorySegments.length ? categorySegments : [{ label: "Others", value: 100, color: "#6b7280" }]} />
          </div>
        </DarkCard>
      </div>

      <DarkCard className="mt-4" delay={4}>
        <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Latest Market News</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {MANDI_NEWS.map((n) => (
            <div key={n.title} className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3">
              <p className="text-xs font-semibold text-[var(--av-text-primary)]">{n.title}</p>
              <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">{n.snippet}</p>
              <p className="mt-2 text-[9px] text-[var(--av-text-muted)]">{n.date}</p>
            </div>
          ))}
        </div>
      </DarkCard>

      <ShellCtaBanner
        title="AI Market Advisor"
        description="Ask our AI about market trends, predict prices & find the best selling time."
        buttonLabel="Ask AI Advisor"
        href="/kisan-saathi"
      />
    </AppShell>
  );
}
