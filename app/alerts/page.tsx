"use client";

import { useState } from "react";
import AppShell from "@/components/shell/AppShell";
import AlertsHub from "@/components/agriveda2/AlertsHub";
import PriceAlertsPanel from "@/components/alerts/PriceAlertsPanel";
import { usePriceAlerts } from "@/hooks/usePriceAlerts";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMandiPrices } from "@/hooks/useMandiPrices";
import { useLocale } from "@/components/i18n/LocaleProvider";

type AlertTab = "farm" | "price";

export default function AlertsPage() {
  const { t } = useLocale();
  const [tab, setTab] = useState<AlertTab>("farm");
  const { settings, activeCount } = usePriceAlerts();
  const { profile } = useFarmerProfile();
  const { data } = useMandiPrices({
    state: profile.state.trim() || "Madhya Pradesh",
    district: profile.district.trim() || undefined,
  });

  return (
    <AppShell
      className="!bg-transparent"
      title={t("toolAlerts")}
      subtitle={tab === "farm" ? t("alertsFarmSubtitle") : t("alertsPriceSubtitle")}
      breadcrumbs={[{ label: t("navHome"), href: "/" }, { label: t("toolAlerts") }]}
    >
      <div className="grid grid-cols-2 gap-2">
        {(
          [
            { id: "farm" as const, label: t("alertsFarmTab"), image: "/images/jobs/job-alerts.jpg" },
            { id: "price" as const, label: t("alertsPriceTab"), image: "/images/home/home-job-mandi.jpg" },
          ] as const
        ).map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`relative h-20 overflow-hidden rounded-2xl border text-left transition active:scale-[0.98] ${
                active
                  ? "border-emerald-500 ring-2 ring-emerald-500/30"
                  : "border-[var(--av-border)] opacity-90"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/15" />
              <span className="relative z-10 flex h-full items-end p-2.5">
                <span className="text-[13px] font-extrabold text-white">
                  {item.label}
                  {item.id === "price" && activeCount > 0 ? (
                    <span className="ml-1.5 rounded-full bg-amber-400 px-1.5 py-0.5 text-[9px] font-black text-amber-950">
                      {activeCount}
                    </span>
                  ) : null}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        {tab === "farm" ? (
          <AlertsHub />
        ) : (
          <>
            {!settings.masterEnabled ? (
              <p className="mb-3 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-[12px] font-semibold text-amber-800 dark:text-amber-200">
                भाव अलर्ट बंद हैं — सेटिंग में चालू करो
              </p>
            ) : null}
            <PriceAlertsPanel rows={data?.rows ?? []} />
          </>
        )}
      </div>
    </AppShell>
  );
}
