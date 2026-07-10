"use client";

import { useState } from "react";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import AlertsHub from "@/components/agriveda2/AlertsHub";
import PriceAlertsPanel from "@/components/alerts/PriceAlertsPanel";
import { usePriceAlerts } from "@/hooks/usePriceAlerts";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMandiPrices } from "@/hooks/useMandiPrices";
import { Bell, IndianRupee } from "lucide-react";
import { AV } from "@/lib/design/tokens";

const TABS = ["Farm Alerts", "Price Alerts"] as const;

export default function AlertsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Farm Alerts");
  const { settings, activeCount } = usePriceAlerts();
  const { profile } = useFarmerProfile();
  const { data } = useMandiPrices({
    state: profile.state.trim() || "Madhya Pradesh",
    district: profile.district.trim() || undefined,
  });

  return (
    <AppShell
      className="!bg-transparent"
      title="Alerts"
      subtitle="Farm predictive alerts aur mandi price targets"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Alerts" }]}
    >
      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
              tab === t
                ? "bg-[var(--av-accent)]/20 text-[var(--av-accent)]"
                : "text-[var(--av-text-muted)] hover:text-[var(--av-text-secondary)]"
            }`}
          >
            {t}
            {t === "Price Alerts" && activeCount > 0 && (
              <span className="ml-1.5 rounded-full bg-amber-500/20 px-1.5 text-[10px] text-amber-400">
                {activeCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "Farm Alerts" ? (
        <>
          <DarkCard className="mt-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--av-accent)]/15">
                <Bell className="h-5 w-5 text-[var(--av-accent)]" />
              </div>
              <div>
                <h2 className={AV.sectionTitle}>Farm Predictive Alerts</h2>
                <p className={`mt-1 ${AV.micro}`}>
                  Pest, irrigation, sowing — aapki fasal aur DAS ke hisaab se
                </p>
              </div>
            </div>
          </DarkCard>
          <div className="mt-4">
            <AlertsHub />
          </div>
        </>
      ) : (
        <>
          <DarkCard className="mt-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/15">
                <IndianRupee className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h2 className={AV.sectionTitle}>Market Price Alerts</h2>
                <p className={`mt-1 ${AV.micro}`}>
                  {activeCount} active target{activeCount !== 1 ? "s" : ""}
                  {settings.masterEnabled ? "" : " · master toggle OFF in Settings"}
                </p>
              </div>
            </div>
          </DarkCard>
          <div className="mt-4">
            <PriceAlertsPanel rows={data?.rows ?? []} />
          </div>
        </>
      )}
    </AppShell>
  );
}
