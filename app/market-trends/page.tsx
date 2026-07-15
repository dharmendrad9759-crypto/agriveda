"use client";

import { useMemo, useState } from "react";
import { Filter, TrendingUp } from "lucide-react";
import AppShell, { ShellCtaBanner } from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import StatCard from "@/components/shell/StatCard";
import { LineChart, Sparkline, GaugeChart } from "@/components/shell/charts";
import { BarChart3, Activity, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMandiPrices } from "@/hooks/useMandiPrices";
import { historicalSeriesForCrop } from "@/lib/mandi/historyCache";
import {
  commodityTrendsList,
  cropSummary,
  filterMandiRows,
  marketStats,
  topMarketsTrend,
  trendLabels,
  uniqueCrops,
  uniqueMarkets,
  computedMarketInsights,
  chartSeriesForRange,
} from "@/lib/mandi/marketAnalytics";
import { AV } from "@/lib/design/tokens";

export default function MarketTrendsPage() {
  const { showToast } = useToast();
  const { profile } = useFarmerProfile();
  const { data, loading, refresh } = useMandiPrices({
    state: profile.state.trim() || "Madhya Pradesh",
    district: profile.district.trim() || undefined,
  });

  const rows = data?.rows ?? [];
  const crops = useMemo(() => uniqueCrops(rows), [rows]);
  const markets = useMemo(() => ["All Markets", ...uniqueMarkets(rows)], [rows]);

  const [commodity, setCommodity] = useState("Paddy");
  const [market, setMarket] = useState("All Markets");
  const [range, setRange] = useState("7d");

  const activeCrop = crops.includes(commodity) ? commodity : crops[0] ?? "Paddy";
  const filtered = useMemo(
    () => filterMandiRows(rows, activeCrop, market),
    [rows, activeCrop, market]
  );
  const summary = useMemo(
    () => cropSummary(filtered.length ? filtered : rows, activeCrop),
    [filtered, rows, activeCrop]
  );
  const stats = useMemo(() => marketStats(rows), [rows]);
  const topMarkets = useMemo(() => topMarketsTrend(rows, activeCrop), [rows, activeCrop]);
  const commodityTrends = useMemo(() => commodityTrendsList(rows), [rows]);
  const marketInsights = useMemo(() => computedMarketInsights(rows, activeCrop), [rows, activeCrop]);

  const history = useMemo(
    () =>
      historicalSeriesForCrop(
        profile.state.trim() || "Madhya Pradesh",
        profile.district.trim() || undefined,
        activeCrop,
        range
      ),
    [profile.state, profile.district, activeCrop, range]
  );

  const chartData = chartSeriesForRange(history, summary?.trend ?? [0], range);
  const chartSeries = [{ name: "Modal", data: chartData, color: "#10b981" }];

  return (
    <AppShell
      className="!bg-transparent"
      title="Market Trends"
      subtitle="Track price trends, insights & forecasts to sell at the right time"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Market Trends" }]}
    >
      {data?.error && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-200">
          {data.error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={BarChart3}
          label="Tracked Commodities"
          value={`${stats.tracked} Crops`}
          action={{ label: "View Mandi", href: "/mandi" }}
        />
        <StatCard
          icon={TrendingUp}
          label="Market Trend"
          value={stats.trend}
          sub={data?.source === "live" ? "Live mandi data" : "Sample data"}
          action={{ label: "View Details", href: "/mandi" }}
        />
        <StatCard
          icon={Activity}
          label="Avg. Price Change"
          value={stats.avgChange !== 0 ? `${stats.avgChange > 0 ? "+" : ""}${stats.avgChange}%` : "—"}
          sub="Across listed commodities"
        />
        <StatCard
          icon={RefreshCw}
          label="Last Updated"
          value={data?.lastUpdated?.split(",")[0] ?? "—"}
          sub={data?.lastUpdated?.split(",")[1]?.trim() ?? ""}
        />
      </div>

      <DarkCard className="mt-4">
        <div className="flex flex-wrap gap-2">
          <select
            value={activeCrop}
            onChange={(e) => setCommodity(e.target.value)}
            className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2 text-sm text-[var(--av-text-primary)]"
          >
            {(crops.length ? crops : ["Paddy", "Wheat", "Soybean"]).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            value={market}
            onChange={(e) => setMarket(e.target.value)}
            className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2 text-sm text-[var(--av-text-primary)]"
          >
            {markets.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2 text-sm text-[var(--av-text-primary)]"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="1y">1 Year</option>
          </select>
          <button
            type="button"
            onClick={() => {
              refresh();
              showToast(`${activeCrop} · ${market} · ${range}`);
            }}
            className={`inline-flex gap-1.5 ${AV.btnPrimarySm}`}
          >
            <Filter className="h-3.5 w-3.5" /> Apply
          </button>
        </div>
      </DarkCard>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <DarkCard hover className="lg:col-span-2" delay={1}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">
              Price Trend — {activeCrop}
              {loading && <span className="ml-2 text-[10px] font-normal text-[var(--av-text-muted)]">Loading…</span>}
            </h3>
            <div className="flex gap-1 text-[10px]">
              {["7d", "30d", "1y"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={`rounded px-2 py-1 font-semibold ${range === r ? "bg-[var(--av-accent)]/20 text-[var(--av-accent)]" : "text-[var(--av-text-muted)]"}`}
                >
                  {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "1 Year"}
                </button>
              ))}
            </div>
          </div>
          <LineChart labels={trendLabels(range)} series={chartSeries} />
        </DarkCard>

        <DarkCard hover delay={2}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">{activeCrop} — Today</h3>
          {summary ? (
            <>
              <p className="mt-2 text-2xl font-bold text-[var(--av-accent)]">
                ₹{summary.modal.toLocaleString("en-IN")}
                <span className="text-sm font-normal text-[var(--av-text-muted)]">/Quintal</span>
              </p>
              <p className={`text-sm ${summary.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {summary.change !== 0
                  ? `${summary.changeAmt > 0 ? "+" : ""}₹${summary.changeAmt} (${summary.change > 0 ? "+" : ""}${summary.change}%)`
                  : `Live modal price · ${summary.count} mandi(s)`}
              </p>
              <div className="mt-3 space-y-1 text-xs text-[var(--av-text-secondary)]">
                <p>Min: ₹{summary.min.toLocaleString("en-IN")}</p>
                <p>Max: ₹{summary.max.toLocaleString("en-IN")}</p>
              </div>
            </>
          ) : (
            <p className="mt-3 text-sm text-[var(--av-text-muted)]">No data for this crop in your region.</p>
          )}
        </DarkCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <DarkCard hover delay={1}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Top Markets — {activeCrop}</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[var(--av-text-muted)]">
                  <th className="pb-2 text-left">Market</th>
                  <th className="pb-2">Modal</th>
                  <th className="pb-2">Change</th>
                  <th className="pb-2">Trend</th>
                </tr>
              </thead>
              <tbody>
                {topMarkets.length > 0 ? (
                  topMarkets.map((m) => (
                    <tr key={m.id} className="border-t border-[var(--av-border)]">
                      <td className="py-2 text-[var(--av-text-primary)]">{m.market}</td>
                      <td className="py-2 text-center font-mono text-[var(--av-accent)]">₹{m.price}</td>
                      <td className="py-2 text-center text-emerald-400">
                        {m.change !== 0 ? `+${m.change}%` : "—"}
                      </td>
                      <td className="py-2">
                        <Sparkline data={m.trend} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-[var(--av-text-muted)]">
                      No market rows for {activeCrop}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </DarkCard>

        <DarkCard hover delay={2}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Trend by Commodity</h3>
          <ul className="mt-3 space-y-2.5">
            {commodityTrends.map((c) => (
              <li
                key={c.name}
                className="flex items-center gap-3 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)]/60 px-2.5 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-[var(--av-text-primary)]">{c.name}</p>
                  <p className={`text-[10px] font-semibold ${c.up ? "text-emerald-500" : "text-rose-500"}`}>
                    {c.change !== 0 ? `${c.up ? "▲" : "▼"} ${c.up ? "+" : ""}${c.change}%` : "Stable"}
                  </p>
                </div>
                <Sparkline data={c.trend} color={c.up ? "#10b981" : "#f43f5e"} width={96} height={36} />
              </li>
            ))}
          </ul>
        </DarkCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <DarkCard hover delay={1}>
          <GaugeChart value={stats.trend === "Bullish" ? 75 : stats.trend === "Bearish" ? 35 : 55} label={`${stats.trend} Outlook`} />
          <p className="mt-2 text-center text-xs text-[var(--av-text-secondary)]">
            Based on {data?.source === "live" ? "live" : "sample"} mandi rates in {data?.state ?? "your state"}
          </p>
        </DarkCard>
        <DarkCard hover delay={2}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Key Insights</h3>
          <ul className="mt-3 space-y-2 text-xs text-[var(--av-text-secondary)]">
            {marketInsights.map((ins) => (
              <li key={ins} className="flex gap-2">
                <span className="text-[var(--av-accent)]">•</span>
                {ins}
              </li>
            ))}
          </ul>
        </DarkCard>
        <DarkCard hover delay={3}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Price Forecast — {activeCrop}</h3>
          <p className={`mt-1 ${AV.micro}`}>
            {history.length >= 2
              ? "Based on saved mandi snapshots in your region"
              : "Visit mandi page daily — trend builds as snapshots save"}
          </p>
          <div className="mt-3 flex h-24 items-end justify-between gap-1">
            {chartData.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-[var(--av-accent)]/60"
                  style={{
                    height: `${Math.max(20, Math.min(80, ((v - (summary?.min ?? Math.min(...chartData))) / Math.max((summary?.max ?? Math.max(...chartData)) - (summary?.min ?? Math.min(...chartData)), 1)) * 60 + 20))}px`,
                  }}
                />
                <span className="text-[8px] text-[var(--av-text-muted)]">
                  {range === "1y" ? `M${i + 1}` : range === "30d" ? `W${i + 1}` : `D${i + 1}`}
                </span>
              </div>
            ))}
          </div>
        </DarkCard>
      </div>

      <ShellCtaBanner
        title="AI Market Advisor"
        description="Ask our AI to analyze market trends, predict prices & find the best selling time."
        buttonLabel="Ask AI Advisor"
        href="/kisan-saathi"
      />
    </AppShell>
  );
}
