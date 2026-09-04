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
  const { data, loading, refresh, enrichDistrict } = useMandiPrices({ state: fetchState });
  const { activeCount } = usePriceAlerts();
  const [tab, setTab] = useState<Tab>("prices");

  const rows = data?.rows ?? [];

  return (
    <AppShell
      className="!bg-transparent"
      title={isHi ? "मंडी भाव" : "Mandi Prices"}
      subtitle={
        isHi
          ? "राज्य, जिला, मंडी और फसल से भाव देखें"
          : "Filter by state, district, market and crop"
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
              ? "डेमो भाव दिख रहे हैं — लाइव API नहीं मिली। बेचने से पहले स्थानीय मंडी जाँचें।"
              : "Demo prices — live API unavailable. Verify at your local mandi before trading."}
          </p>
        )}
        {data?.error && data.source !== "mock" && (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
            {data.error}
          </p>
        )}

        <div className="flex gap-1 rounded-2xl bg-slate-100 p-1">
          {(
            [
              { id: "prices" as const, label: isHi ? "भाव तालिका" : "Price table" },
              { id: "alerts" as const, label: isHi ? `अलर्ट (${activeCount})` : `Alerts (${activeCount})` },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "flex-1 rounded-xl py-2.5 text-xs font-bold transition",
                tab === item.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              )}
            >
              {item.label}
            </button>
          ))}
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
              className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-3 text-xs font-bold text-[#2563eb]"
            >
              {isHi ? "बाजार रुझान देखें →" : "Market trends →"}
            </AppLink>
          </div>
        )}

        {tab === "alerts" && (
          <div id="price-alerts" className="space-y-2">
            <div className="flex items-center gap-1.5 px-0.5 text-xs font-bold text-slate-800">
              <Bell className="h-3.5 w-3.5 text-[#2563eb]" />
              {isHi ? "भाव अलर्ट" : "Price alerts"}
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
