"use client";

import { useMemo, useState } from "react";
import { Search, RefreshCw, TrendingUp, TrendingDown, MapPin, Bell } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { Sparkline } from "@/components/shell/charts";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMandiPrices } from "@/hooks/useMandiPrices";
import { usePriceAlerts } from "@/hooks/usePriceAlerts";
import { uniqueCrops } from "@/lib/mandi/marketAnalytics";
import PriceAlertsPanel from "@/components/alerts/PriceAlertsPanel";

type Tab = "prices" | "alerts";

export default function MandiPage() {
  const { profile } = useFarmerProfile();
  const state = profile.state.trim() || "Madhya Pradesh";
  const district = profile.district.trim() || undefined;
  const { data, loading, refresh } = useMandiPrices({ state, district });
  const { activeCount } = usePriceAlerts();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"high" | "low" | "change">("high");
  const [tab, setTab] = useState<Tab>("prices");

  const rows = data?.rows ?? [];
  const locationLabel = district ? `${district}, ${state}` : state;

  const filtered = useMemo(() => {
    let list = rows.filter(
      (r) =>
        r.crop.toLowerCase().includes(search.toLowerCase()) ||
        r.cropHi.includes(search) ||
        r.mandi.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === "high") list = [...list].sort((a, b) => b.modal - a.modal);
    if (sort === "low") list = [...list].sort((a, b) => a.modal - b.modal);
    if (sort === "change") list = [...list].sort((a, b) => b.change - a.change);
    return list;
  }, [rows, search, sort]);

  const cropChips = useMemo(() => uniqueCrops(rows).slice(0, 8), [rows]);

  return (
    <AppShell
      title="Mandi Prices"
      subtitle={`${locationLabel} · ${data?.source === "live" ? "Live" : "Sample"} · ${rows.length} crops`}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Mandi" }]}
      actions={
        <button
          type="button"
          onClick={() => refresh()}
          disabled={loading}
          className="av-btn av-btn-sm av-btn-secondary inline-flex gap-1"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      }
    >
      {data?.error && (
        <p className="mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-700 dark:text-amber-200">
          {data.error}
        </p>
      )}

      <div className="flex items-center justify-between gap-2 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2">
        <div className="min-w-0">
          <p className="flex items-center gap-1 text-[10px] font-bold text-[var(--av-text-muted)]">
            <MapPin className="h-3 w-3" /> Location
          </p>
          <p className="truncate text-sm font-bold text-[var(--av-text-primary)]">{locationLabel}</p>
        </div>
        <AppLink href="/profile" className="shrink-0 text-[10px] font-bold text-[var(--av-accent)]">
          Change →
        </AppLink>
      </div>

      <div className="mt-3 flex gap-1 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-1">
        {(
          [
            { id: "prices" as const, label: "आज के भाव" },
            { id: "alerts" as const, label: `Alerts (${activeCount})` },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
              tab === t.id
                ? "bg-[var(--av-accent)] text-white shadow-sm"
                : "text-[var(--av-text-muted)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "prices" && (
        <div className="mt-3 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--av-text-muted)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Crop / mandi search…"
                className="w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] py-2 pl-9 pr-3 text-xs outline-none focus:border-[var(--av-accent)]"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-2 text-xs"
            >
              <option value="high">High ₹</option>
              <option value="low">Low ₹</option>
              <option value="change">% Change</option>
            </select>
          </div>

          {cropChips.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
              <button
                type="button"
                onClick={() => setSearch("")}
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                  !search ? "bg-[var(--av-accent)] text-white" : "bg-[var(--av-surface-inset)] text-[var(--av-text-muted)]"
                }`}
              >
                All
              </button>
              {cropChips.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSearch(c)}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    search.toLowerCase() === c.toLowerCase()
                      ? "bg-[var(--av-accent)] text-white"
                      : "bg-[var(--av-surface-inset)] text-[var(--av-text-muted)]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-2">
            {loading && filtered.length === 0 ? (
              <p className="py-8 text-center text-xs text-[var(--av-text-muted)]">Loading rates…</p>
            ) : filtered.length === 0 ? (
              <p className="py-8 text-center text-xs text-[var(--av-text-muted)]">No crops match — try another search</p>
            ) : (
              filtered.slice(0, 24).map((row) => {
                const up = row.change >= 0;
                return (
                  <DarkCard key={row.id} className="!p-3">
                    <div className="flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-1.5">
                          <p className="text-sm font-bold text-[var(--av-text-primary)]">{row.crop}</p>
                          <span className="text-[10px] text-[var(--av-text-muted)]">{row.cropHi}</span>
                        </div>
                        <p className="truncate text-[10px] text-[var(--av-text-muted)]">
                          {row.mandi} · {row.variety}
                        </p>
                      </div>
                      <div className="w-14 shrink-0">
                        <Sparkline data={row.trend} />
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-base font-black text-[var(--av-text-primary)]">
                          ₹{row.modal.toLocaleString("en-IN")}
                        </p>
                        <p
                          className={`flex items-center justify-end gap-0.5 text-[10px] font-bold ${
                            up ? "text-emerald-500" : "text-red-500"
                          }`}
                        >
                          {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {up ? "+" : ""}
                          {row.change}%
                        </p>
                        <p className="text-[9px] text-[var(--av-text-muted)]">
                          {row.min}–{row.max}
                        </p>
                      </div>
                    </div>
                  </DarkCard>
                );
              })
            )}
          </div>

          <AppLink
            href="/market-trends"
            className="flex items-center justify-center gap-1 rounded-xl border border-[var(--av-border)] py-2.5 text-xs font-bold text-[var(--av-accent)]"
          >
            Market trends & insights →
          </AppLink>
        </div>
      )}

      {tab === "alerts" && (
        <div className="mt-3" id="price-alerts">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-[var(--av-text-primary)]">
            <Bell className="h-3.5 w-3.5 text-[var(--av-accent)]" />
            Price Alerts
          </div>
          <PriceAlertsPanel rows={rows} />
        </div>
      )}
    </AppShell>
  );
}
