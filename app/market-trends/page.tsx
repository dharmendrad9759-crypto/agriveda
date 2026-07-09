"use client";

import { useState } from "react";
import { Filter, TrendingUp } from "lucide-react";
import AppShell, { ShellCtaBanner } from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import StatCard from "@/components/shell/StatCard";
import { LineChart, Sparkline, GaugeChart } from "@/components/shell/charts";
import {
  MARKET_STATS,
  PRICE_TREND_LABELS,
  PRICE_TREND_SERIES,
  TOP_MARKETS_TREND,
  COMMODITY_TRENDS,
  MARKET_INSIGHTS,
  FORECAST_BARS,
} from "@/data/mock/market-trends";
import { BarChart3, Activity, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { AV } from "@/lib/design/tokens";

export default function MarketTrendsPage() {
  const { showToast } = useToast();
  const [commodity, setCommodity] = useState("Paddy");
  const [market, setMarket] = useState("All Markets");
  const [range, setRange] = useState("7d");

  return (
    <AppShell
      title="Market Trends"
      subtitle="Track price trends, insights & forecasts to sell at the right time"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Market Trends" }]}
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={BarChart3} label="Tracked Commodities" value={`${MARKET_STATS.tracked} Crops`} action={{ label: "View All", href: "/mandi" }} />
        <StatCard icon={TrendingUp} label="Market Trend" value={MARKET_STATS.trend} sub="Prices are rising" action={{ label: "View Details", href: "/mandi" }} />
        <StatCard icon={Activity} label="Avg. Price Change (7D)" value={`+${MARKET_STATS.avgChange}%`} sub="Across all commodities" />
        <StatCard icon={RefreshCw} label="Last Updated" value={MARKET_STATS.lastUpdated.split(",")[0]} sub={MARKET_STATS.lastUpdated.split(",")[1]?.trim()} />
      </div>

      <DarkCard className="mt-4">
        <div className="flex flex-wrap gap-2">
          <select value={commodity} onChange={(e) => setCommodity(e.target.value)} className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2 text-sm text-[var(--av-text-primary)]">
            <option>Paddy</option><option>Wheat</option><option>Soybean</option>
          </select>
          <select value={market} onChange={(e) => setMarket(e.target.value)} className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2 text-sm text-[var(--av-text-primary)]">
            <option>All Markets</option><option>Indore</option><option>Sehore</option>
          </select>
          <select value={range} onChange={(e) => setRange(e.target.value)} className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2 text-sm text-[var(--av-text-primary)]">
            <option value="7d">Last 7 Days</option><option value="30d">Last 30 Days</option><option value="1y">1 Year</option>
          </select>
          <button
            type="button"
            onClick={() => showToast(`${commodity} · ${market} · ${range} filter applied`)}
            className={`inline-flex gap-1.5 ${AV.btnPrimarySm}`}
          >
            <Filter className="h-3.5 w-3.5" /> Filter
          </button>
        </div>
      </DarkCard>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <DarkCard hover className="lg:col-span-2" delay={1}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Price Trend Overview — {commodity}</h3>
            <div className="flex gap-1 text-[10px]">
              {["7d", "30d", "1y"].map((r) => (
                <button key={r} type="button" onClick={() => setRange(r)} className={`rounded px-2 py-1 font-semibold ${range === r ? "bg-[var(--av-accent)]/20 text-[var(--av-accent)]" : "text-[var(--av-text-muted)]"}`}>
                  {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "1 Year"}
                </button>
              ))}
            </div>
          </div>
          <LineChart labels={PRICE_TREND_LABELS} series={PRICE_TREND_SERIES} />
        </DarkCard>

        <DarkCard hover delay={2}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">{commodity} — Today</h3>
          <p className="mt-2 text-2xl font-bold text-[var(--av-accent)]">₹2,150<span className="text-sm font-normal text-[var(--av-text-muted)]">/Quintal</span></p>
          <p className="text-sm text-emerald-400">+₹50 (+2.38%) vs yesterday</p>
          <div className="mt-3 space-y-1 text-xs text-[var(--av-text-secondary)]">
            <p>Min: ₹2,100</p>
            <p>Max: ₹2,250</p>
          </div>
        </DarkCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <DarkCard hover delay={1}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Top Markets — Price Trend</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="text-[var(--av-text-muted)]"><th className="pb-2 text-left">Market</th><th className="pb-2">Modal</th><th className="pb-2">Change</th><th className="pb-2">Trend</th></tr></thead>
              <tbody>
                {TOP_MARKETS_TREND.map((m) => (
                  <tr key={m.market} className="border-t border-[var(--av-border)]">
                    <td className="py-2 text-[var(--av-text-primary)]">{m.market}</td>
                    <td className="py-2 text-center font-mono text-[var(--av-accent)]">₹{m.price}</td>
                    <td className="py-2 text-center text-emerald-400">+{m.change}%</td>
                    <td className="py-2"><Sparkline data={m.trend} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DarkCard>

        <DarkCard hover delay={2}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Trend by Commodity (7 Days)</h3>
          <ul className="mt-3 space-y-2">
            {COMMODITY_TRENDS.map((c) => (
              <li key={c.name} className="flex items-center justify-between">
                <span className="text-xs text-[var(--av-text-primary)]">{c.name}</span>
                <Sparkline data={c.trend} color={c.up ? "#10b981" : "#f87171"} />
                <span className={`text-xs font-semibold ${c.up ? "text-emerald-400" : "text-red-400"}`}>
                  {c.up ? "+" : ""}{c.change}%
                </span>
              </li>
            ))}
          </ul>
        </DarkCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <DarkCard hover delay={1}>
          <GaugeChart value={75} label="Bullish Outlook" />
          <p className="mt-2 text-center text-xs text-[var(--av-text-secondary)]">Prices likely to increase in next 7 days</p>
        </DarkCard>
        <DarkCard hover delay={2}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Key Insights</h3>
          <ul className="mt-3 space-y-2 text-xs text-[var(--av-text-secondary)]">
            {MARKET_INSIGHTS.map((ins) => (
              <li key={ins} className="flex gap-2"><span className="text-[var(--av-accent)]">•</span>{ins}</li>
            ))}
          </ul>
        </DarkCard>
        <DarkCard hover delay={3}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Price Forecast — Paddy</h3>
          <div className="mt-3 flex h-24 items-end justify-between gap-1">
            {FORECAST_BARS.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className="w-full rounded-t bg-[var(--av-accent)]/60" style={{ height: `${((v - 2100) / 140) * 80 + 20}px` }} />
                <span className="text-[8px] text-[var(--av-text-muted)]">D{i + 1}</span>
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
