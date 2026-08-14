"use client";

import { useMemo, useState } from "react";
import { Bell, ChevronDown, RefreshCw, Search } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import CategoryChips from "@/components/mandi/CategoryChips";
import MarketPriceCard from "@/components/mandi/MarketPriceCard";
import PriceAlertsPanel from "@/components/alerts/PriceAlertsPanel";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMandiPrices } from "@/hooks/useMandiPrices";
import { usePriceAlerts } from "@/hooks/usePriceAlerts";
import { uniqueCrops, uniqueMarkets } from "@/lib/mandi/marketAnalytics";
import { cn } from "@/lib/cn";
import { useLocale } from "@/components/i18n/LocaleProvider";
import VoiceInput from "@/components/query/VoiceInput";

type Tab = "prices" | "alerts";

export default function MandiListClient() {
  const { t, locale } = useLocale();
  const isHi = locale === "hi";
  const { profile } = useFarmerProfile();
  const state = profile.state.trim() || "Madhya Pradesh";
  const district = profile.district.trim() || undefined;
  const { data, loading, refresh } = useMandiPrices({ state, district });
  const { activeCount } = usePriceAlerts();

  const [chip, setChip] = useState("");
  const [marketFilter, setMarketFilter] = useState("All");
  const [tab, setTab] = useState<Tab>("prices");
  const [searchQ, setSearchQ] = useState("");

  const rows = data?.rows ?? [];
  const locationLabel = district ? `${district}, ${state}` : state;
  const cropChips = useMemo(() => uniqueCrops(rows).slice(0, 10), [rows]);
  const markets = useMemo(() => ["All", ...uniqueMarkets(rows).slice(0, 16)], [rows]);

  const dateLabel =
    data?.lastUpdated?.split(",")[0] ||
    new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });

  const filtered = useMemo(() => {
    const chipQ = chip.trim().toLowerCase();
    const textQ = searchQ.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesChip = !chipQ || r.crop.toLowerCase() === chipQ;
      const matchesMarket = marketFilter === "All" || r.mandi === marketFilter;
      const matchesSearch =
        !textQ ||
        r.crop.toLowerCase().includes(textQ) ||
        r.mandi.toLowerCase().includes(textQ) ||
        (r.variety ?? "").toLowerCase().includes(textQ);
      return matchesChip && matchesMarket && matchesSearch;
    });
  }, [rows, chip, marketFilter, searchQ]);

  return (
    <AppShell
      className="!bg-transparent"
      title={isHi ? "आज का भाव" : "Today's prices"}
      subtitle={
        isHi
          ? `${locationLabel} · टैप करके देखो`
          : `${locationLabel} · tap to open`
      }
      breadcrumbs={[{ label: t("navHome"), href: "/" }, { label: t("market") }]}
      actions={
        <button
          type="button"
          onClick={() => refresh()}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-sm active:scale-95 disabled:opacity-60"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          {isHi ? "रिफ्रेश" : "Refresh"}
        </button>
      }
    >
      <div className="space-y-3">
        {data?.source === "mock" && (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-medium text-amber-900">
            {isHi
              ? "डेमो भाव दिख रहे हैं — लाइव मंडी API कुंजी सेट नहीं / उपलब्ध नहीं। असली खरीद-फरोख्त से पहले स्थानीय मंडी जाँचें।"
              : "Demo prices — live mandi API unavailable. Verify at your local mandi before trading."}
          </p>
        )}
        {data?.error && data.source !== "mock" && (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
            {data.error}
          </p>
        )}
        {data?.error && data.source === "mock" && data.error !== "Failed to load mandi data" && (
          <p className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
            {data.error}
          </p>
        )}

        <div className="flex gap-1 rounded-2xl bg-slate-100 p-1">
          {(
            [
              { id: "prices" as const, label: isHi ? "आज के भाव" : "Prices" },
              { id: "alerts" as const, label: isHi ? `अलर्ट (${activeCount})` : `Alerts (${activeCount})` },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "flex-1 rounded-xl py-2.5 text-xs font-bold transition",
                tab === t.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "prices" && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder={isHi ? "फसल / मंडी खोजें…" : "Search crop or mandi…"}
                  className="av-input w-full py-2.5 pl-10 text-sm"
                />
              </div>
              <VoiceInput variant="searchIcon" onTranscript={(text) => setSearchQ(text)} />
            </div>
            <CategoryChips chips={cropChips} active={chip} onSelect={setChip} />

            <div className="space-y-2">
              <div className="relative">
                <select
                  value={state}
                  disabled
                  className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm font-semibold text-slate-800 shadow-sm"
                >
                  <option>{state}</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
              <div className="relative">
                <select
                  value={marketFilter}
                  onChange={(e) => setMarketFilter(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm font-semibold text-slate-800 shadow-sm outline-none focus:border-blue-400"
                >
                  {markets.map((m) => (
                    <option key={m} value={m}>
                      {m === "All" ? `सभी मंडी · ${district || state}` : m}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
              <AppLink href="/profile" className="block text-right text-[11px] font-bold text-[#2563eb]">
                स्थान बदलें →
              </AppLink>
            </div>

            <div className="space-y-2.5">
              {loading && filtered.length === 0 ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-[110px] animate-pulse rounded-2xl bg-white" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center">
                  <p className="text-sm font-bold text-slate-800">कोई भाव नहीं मिला</p>
                  <p className="mt-1 text-xs text-slate-500">दूसरी फसल या मंडी चुनें</p>
                </div>
              ) : (
                filtered
                  .slice(0, 30)
                  .map((row) => <MarketPriceCard key={row.id} row={row} dateLabel={dateLabel} />)
              )}
            </div>

            <AppLink
              href="/market-trends"
              className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-3 text-xs font-bold text-[#2563eb]"
            >
              बाजार रुझान देखें →
            </AppLink>
          </div>
        )}

        {tab === "alerts" && (
          <div id="price-alerts" className="space-y-2">
            <div className="flex items-center gap-1.5 px-0.5 text-xs font-bold text-slate-800">
              <Bell className="h-3.5 w-3.5 text-[#2563eb]" />
              Price Alerts
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <PriceAlertsPanel rows={rows} />
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
