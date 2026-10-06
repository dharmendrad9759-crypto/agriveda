"use client";

import { useState } from "react";
import { Bell, RefreshCw } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import MandiPricesTable from "@/components/mandi/MandiPricesTable";
import PriceAlertsPanel from "@/components/alerts/PriceAlertsPanel";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMandiPrices } from "@/hooks/useMandiPrices";
import { usePriceAlerts } from "@/hooks/usePriceAlerts";
import { cn } from "@/lib/cn";
import { useLocale } from "@/components/i18n/LocaleProvider";

type Tab = "prices" | "alerts";

export default function MandiListClient() {
  const { t, locale } = useLocale();
  const isHi = locale === "hi";
  const { profile } = useFarmerProfile();
  const profileState = profile.state.trim() || "Madhya Pradesh";
  const profileDistrict = profile.district.trim() || "";

  const [fetchState, setFetchState] = useState(profileState);
  const { data, loading, refresh, enrichDistrict } = useMandiPrices({
    state: fetchState,
  });
  const { activeCount } = usePriceAlerts();
  const [tab, setTab] = useState<Tab>("prices");

  const rows = data?.rows ?? [];

  return (
    <AppShell
      className="!bg-transparent"
      title={isHi ? "मंडी भाव" : "Mandi Prices"}
      breadcrumbs={[{ label: t("navHome"), href: "/" }, { label: t("market") }]}
      actions={
        <button
          type="button"
          onClick={() => refresh()}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-slate-800 to-slate-900 px-3.5 py-1.5 text-[11px] font-bold text-white shadow-md shadow-slate-900/20 transition-all active:scale-95 disabled:opacity-60"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          {isHi ? "ताज़ा करें" : "Refresh"}
        </button>
      }
    >
      <div className="space-y-3">
        {data?.source === "mock" && (
          <div
            role="alert"
            className="rounded-2xl border-2 border-amber-400 bg-amber-50 px-3.5 py-3 text-amber-950"
          >
            <p className="text-sm font-black">
              {isHi
                ? "⚠️ ये असली भाव नहीं हैं"
                : "⚠️ These are not real prices"}
            </p>
            <p className="mt-1 text-xs font-semibold leading-snug">
              {isHi
                ? "सरकारी मंडी भाव अभी नहीं मिल पाए, इसलिए नमूना भाव दिख रहे हैं। इन्हें देखकर फसल न बेचें — पहले अपनी मंडी या eNAM पर भाव पक्का करें।"
                : "Live government prices are unavailable, so sample prices are shown. Do not sell based on these — confirm at your mandi or eNAM first."}
            </p>
          </div>
        )}
        {data?.error && data.source !== "mock" && (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
            {data.error}
          </p>
        )}

        <div className="relative flex gap-2 rounded-[1.5rem] bg-[var(--av-surface)] p-2 shadow-[var(--av-shadow-sm)] border border-[var(--av-border)]">
          {(
            [
              {
                id: "prices" as const,
                label: isHi ? "भाव तालिका (Prices)" : "Price table",
              },
              {
                id: "alerts" as const,
                label: isHi
                  ? `अलर्ट (Alerts) · ${activeCount}`
                  : `Alerts · ${activeCount}`,
              },
            ] as const
          ).map((item) => {
            const isActive = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  "relative flex-1 rounded-xl py-3 text-[13px] font-bold transition-all duration-300",
                  isActive
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/20"
                    : "bg-transparent text-[var(--av-text-secondary)] hover:bg-[var(--av-surface-inset)] hover:text-[var(--av-text-primary)]",
                )}
              >
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>

        {tab === "prices" && (
          <div className="space-y-3">
            <MandiPricesTable
              rows={rows}
              loadedState={data?.state ?? fetchState}
              loading={loading}
              source={data?.source ?? "mock"}
              lastUpdated={data?.lastUpdated}
              isHi={isHi}
              initialState={profileState}
              initialDistrict={profileDistrict}
              onLoadState={setFetchState}
              onEnrichDistrict={enrichDistrict}
            />
            <AppLink
              href="/market-trends"
              className="flex items-center justify-center rounded-[1.5rem] border border-[var(--av-border)] bg-[var(--av-surface)] py-4 text-[13px] font-bold text-emerald-600 shadow-[var(--av-shadow-sm)] transition-all hover:bg-[var(--av-surface-inset)] active:scale-[0.98]"
            >
              {isHi ? "बाजार रुझान देखें →" : "Market trends →"}
            </AppLink>
          </div>
        )}

        {tab === "alerts" && (
          <div id="price-alerts" className="space-y-3">
            <div className="flex items-center gap-1.5 px-1 text-sm font-bold text-[var(--av-text-primary)]">
              <Bell className="h-4 w-4 text-emerald-500" />
              {isHi ? "भाव अलर्ट" : "Price alerts"}
            </div>
            <div className="rounded-[1.5rem] border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]">
              <PriceAlertsPanel rows={rows} />
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
