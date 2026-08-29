"use client";

import CropMandiPriceStrip from "@/components/crops/premium/CropMandiPriceStrip";
import AppLink from "@/components/ui/AppLink";
import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Crop } from "@/types/crop";
import { ChevronRight, Package, Store, TrendingUp } from "lucide-react";

export default function CropMarketSection({ crop }: { crop: Crop }) {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const market = crop.marketInformation;
  const storage = crop.harvestAndYield.storageTips ?? [];

  return (
    <div className="space-y-4">
      {storage.length > 0 ? (
        <DarkCard>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-cyan-600" />
            <SectionHeader title={hi ? "भंडारण और पैकिंग" : "Storage & packing"} />
          </div>
          <ul className="mt-3 space-y-2">
            {storage.map((tip) => (
              <li
                key={tip}
                className="crop-premium-inset text-xs leading-relaxed text-[var(--av-text-secondary)]"
              >
                {tip}
              </li>
            ))}
          </ul>
        </DarkCard>
      ) : null}

      <DarkCard className="border-emerald-500/20 bg-emerald-500/5">
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-emerald-600" />
          <SectionHeader title={hi ? "लाइव मंडी भाव" : "Live mandi rates"} />
        </div>
        <CropMandiPriceStrip cropSlug={crop.slug} className="!mt-3" />
      </DarkCard>

      <DarkCard>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
          <SectionHeader title={hi ? "बिक्री और मांग" : "Sales & demand"} />
        </div>
        <dl className="mt-3 space-y-2 text-xs">
          {[
            { label: hi ? "मांग" : "Demand", value: market.demand },
            { label: hi ? "एमएसपी / सहायता मूल्य" : "MSP / support price", value: market.msp },
            { label: hi ? "भाव का रुझान" : "Price trend", value: market.priceTrend },
          ].map((row) => (
            <div key={row.label} className="crop-premium-inset">
              <dt className="font-bold text-[var(--av-text-muted)]">{row.label}</dt>
              <dd className="mt-0.5 text-[var(--av-text-primary)]">{row.value}</dd>
            </div>
          ))}
        </dl>
        {market.majorMarkets.length > 0 ? (
          <div className="mt-3">
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-[var(--av-text-muted)]">
              {hi ? "बड़ी मंडियाँ" : "Major mandis"}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {market.majorMarkets.map((m) => (
                <span
                  key={m}
                  className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-2 py-1 text-[11px] font-semibold text-[var(--av-text-secondary)]"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </DarkCard>

      <AppLink
        href="/mandi"
        className="flex items-center justify-between gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/8 px-3.5 py-3 transition active:scale-[0.99]"
      >
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-bold text-[var(--av-text-primary)]">
            {hi ? "सभी मंडी भाव देखें" : "See all mandi rates"}
          </span>
        </div>
        <ChevronRight className="h-4 w-4 text-emerald-600" />
      </AppLink>
    </div>
  );
}
