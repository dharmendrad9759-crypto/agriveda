"use client";

import { useMemo, useState } from "react";
import { Bell, RefreshCw, Search } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import LocationCard from "@/components/mandi/LocationCard";
import CategoryChips from "@/components/mandi/CategoryChips";
import MarketPriceCard from "@/components/mandi/MarketPriceCard";
import PriceAlertsPanel from "@/components/alerts/PriceAlertsPanel";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMandiPrices } from "@/hooks/useMandiPrices";
import { usePriceAlerts } from "@/hooks/usePriceAlerts";
import { uniqueCrops } from "@/lib/mandi/marketAnalytics";
import { cn } from "@/lib/cn";

type Tab = "prices" | "alerts";

export default function MandiListClient() {
  const { profile } = useFarmerProfile();
  const state = profile.state.trim() || "Madhya Pradesh";
  const district = profile.district.trim() || undefined;
  const { data, loading, refresh } = useMandiPrices({ state, district });
  const { activeCount } = usePriceAlerts();

  const [search, setSearch] = useState("");
  const [chip, setChip] = useState("");
  const [sort, setSort] = useState<"high" | "low" | "change">("high");
  const [tab, setTab] = useState<Tab>("prices");

  const rows = data?.rows ?? [];
  const locationLabel = district ? `${district}, ${state}` : state;
  const cropChips = useMemo(() => uniqueCrops(rows).slice(0, 10), [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const chipQ = chip.trim().toLowerCase();
    let list = rows.filter((r) => {
      const matchesSearch =
        !q ||
        r.crop.toLowerCase().includes(q) ||
        r.cropHi.includes(search) ||
        r.mandi.toLowerCase().includes(q);
      const matchesChip = !chipQ || r.crop.toLowerCase() === chipQ;
      return matchesSearch && matchesChip;
    });
    if (sort === "high") list = [...list].sort((a, b) => b.modal - a.modal);
    if (sort === "low") list = [...list].sort((a, b) => a.modal - b.modal);
    if (sort === "change") list = [...list].sort((a, b) => b.change - a.change);
    return list;
  }, [rows, search, chip, sort]);

  return (
    <AppShell
      className="!bg-[#f3faf5]"
      title="Mandi Prices"
      subtitle={`${locationLabel} · ${data?.source === "live" ? "Live" : "Sample"} · ${rows.length} crops`}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Mandi" }]}
      actions={
        <button
          type="button"
          onClick={() => refresh()}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-[11px] font-bold text-emerald-700 shadow-sm transition active:scale-95 disabled:opacity-60"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          Refresh
        </button>
      }
    >
      <div className="space-y-3">
        {data?.error && (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
            {data.error}
          </p>
        )}

        <LocationCard locationLabel={locationLabel} />

        <div className="flex gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
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
              className={cn(
                "flex-1 rounded-xl py-2.5 text-xs font-bold transition active:scale-[0.98]",
                tab === t.id
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                  : "text-slate-500"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "prices" && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search crop or mandi…"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="rounded-2xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm outline-none focus:border-emerald-400"
              >
                <option value="high">High ₹</option>
                <option value="low">Low ₹</option>
                <option value="change">% Change</option>
              </select>
            </div>

            <CategoryChips chips={cropChips} active={chip} onSelect={setChip} />

            <div className="space-y-2.5">
              {loading && filtered.length === 0 ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-[84px] animate-pulse rounded-[22px] bg-white/80" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="rounded-[22px] border border-dashed border-slate-200 bg-white px-4 py-10 text-center">
                  <p className="text-sm font-bold text-slate-800">No matching prices</p>
                  <p className="mt-1 text-xs text-slate-500">Try another crop or clear filters</p>
                </div>
              ) : (
                filtered.slice(0, 30).map((row) => <MarketPriceCard key={row.id} row={row} />)
              )}
            </div>

            <AppLink
              href="/market-trends"
              className="flex items-center justify-center gap-1 rounded-2xl border border-emerald-200 bg-emerald-50 py-3 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 active:scale-[0.99]"
            >
              Market trends & insights →
            </AppLink>
          </div>
        )}

        {tab === "alerts" && (
          <div id="price-alerts" className="space-y-2">
            <div className="flex items-center gap-1.5 px-0.5 text-xs font-bold text-slate-800">
              <Bell className="h-3.5 w-3.5 text-emerald-600" />
              Price Alerts
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-white p-3 shadow-sm">
              <PriceAlertsPanel rows={rows} />
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
