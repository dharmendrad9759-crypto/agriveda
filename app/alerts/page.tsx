"use client";

import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import AlertsHub from "@/components/agriveda2/AlertsHub";
import { usePriceAlerts } from "@/hooks/usePriceAlerts";
import { Bell, IndianRupee } from "lucide-react";
import { AV } from "@/lib/design/tokens";

export default function AlertsPage() {
  const { settings, activeCount } = usePriceAlerts();

  return (
    <AppShell
      title="Alerts"
      subtitle="Farm predictive alerts aur mandi price targets — alag alag sections"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Alerts" }]}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <DarkCard>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--av-accent)]/15">
              <Bell className="h-5 w-5 text-[var(--av-accent)]" />
            </div>
            <div>
              <h2 className={AV.sectionTitle}>Farm Predictive Alerts</h2>
              <p className={`mt-1 ${AV.micro}`}>
                Pest, irrigation, sowing — aapki fasal aur DAS ke hisaab se (neeche)
              </p>
            </div>
          </div>
        </DarkCard>

        <DarkCard>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/15">
              <IndianRupee className="h-5 w-5 text-amber-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className={AV.sectionTitle}>Market Price Alerts</h2>
              <p className={`mt-1 ${AV.micro}`}>
                {activeCount} active target{activeCount !== 1 ? "s" : ""}
                {settings.masterEnabled ? "" : " · master toggle OFF in Settings"}
              </p>
              <AppLink href="/mandi#price-alerts" className={`mt-3 inline-flex ${AV.btnPrimarySm}`}>
                Manage on Mandi page →
              </AppLink>
            </div>
          </div>
        </DarkCard>
      </div>

      <div className="mt-6">
        <AlertsHub />
      </div>
    </AppShell>
  );
}
