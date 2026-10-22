"use client";

import CropMandiPriceStrip from "@/components/crops/premium/CropMandiPriceStrip";
import AppLink from "@/components/ui/AppLink";
import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Crop } from "@/types/crop";
import { farmerSpeak } from "@/lib/crops/farmerSpeak";
import { ChevronRight, Package, Store, TrendingUp, CheckCircle2, Building2 } from "lucide-react";

const MARKET_TYPE_HI: Record<string, string> = {
  "grain mandis": "अनाज मंडी",
  "flour mills": "आटा मिल",
  "cooperative centers": "सरकारी खरीद केंद्र",
  "wholesale markets": "थोक मंडी",
  "retailers": "स्थानीय व्यापारी / आढ़तिया",
  "processing units": "प्रसंस्करण इकाई",
  "oil mills": "तेल मिल",
  "ginning factories": "कपास जिनिंग मिल",
  "sugar mills": "चीनी मिल",
  "dal mills": "दाल मिल",
};

function formatMarketName(m: string, hi: boolean): string {
  if (!hi) return m;
  const lower = m.toLowerCase().trim();
  return MARKET_TYPE_HI[lower] || farmerSpeak(m);
}

export default function CropMarketSection({ crop }: { crop: Crop }) {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const market = crop.marketInformation;
  const storage = crop.harvestAndYield.storageTips ?? [];

  return (
    <div className="space-y-4">
      {/* Live Mandi Rates Strip */}
      <DarkCard className="border-emerald-500/20 bg-emerald-500/5">
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-emerald-600" />
          <SectionHeader title={hi ? "लाइव मंडी भाव" : "Live mandi rates"} />
        </div>
        <CropMandiPriceStrip cropSlug={crop.slug} className="!mt-3" />
      </DarkCard>

      {/* Step Cards for Marketing & Sale */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-emerald-600" />
          <SectionHeader title={hi ? "बिक्री व विपणन के मुख्य चरण" : "Marketing & Sales Steps"} />
        </div>

        {/* Step 1: Storage & Packing */}
        {storage.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-[var(--av-border-default)] bg-[var(--av-surface-soft)] p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-600 text-[11px] font-black text-white">
                1
              </span>
              <div className="min-w-0 flex-1">
                <h4 className="text-[14px] font-bold text-[var(--av-text-primary)]">
                  {hi ? "चरण 1: सफाई, सुरक्षित नमी व भंडारण" : "Step 1: Cleaning, Safe Moisture & Storage"}
                </h4>
                <p className="text-[11px] font-semibold text-[var(--av-text-muted)]">
                  {hi ? "अच्छी चमक व सुरक्षित दाने से मंडी में ऊंचा भाव" : "Higher price with clean & properly dried grain"}
                </p>
              </div>
            </div>
            <ul className="mt-3 space-y-1.5">
              {storage.map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-2 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-2.5 text-xs font-semibold leading-relaxed text-[var(--av-text-secondary)]"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-600 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Step 2: Major Markets */}
        <div className="overflow-hidden rounded-2xl border border-[var(--av-border-default)] bg-[var(--av-surface-soft)] p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-[11px] font-black text-white">
              {storage.length > 0 ? 2 : 1}
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="text-[14px] font-bold text-[var(--av-text-primary)]">
                {hi ? "चरण 2: सही खरीद केंद्र व बाजार का चुनाव" : "Step 2: Choose Right Mandi & Buyer"}
              </h4>
              <p className="text-[11px] font-semibold text-[var(--av-text-muted)]">
                {hi ? "सीधे सरकारी केंद्र या बड़ी मंडी में बेचने पर बेहतर मुनाफा" : "Better returns via direct mandi or MSP center"}
              </p>
            </div>
          </div>
          {market.majorMarkets.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {market.majorMarkets.map((m) => (
                <span
                  key={m}
                  className="rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 px-3 py-1.5 text-[12.5px] font-bold text-emerald-800 dark:text-emerald-300"
                >
                  🏢 {formatMarketName(m, hi)}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {/* Step 3: Demand, MSP & Price Trend */}
        <div className="overflow-hidden rounded-2xl border border-[var(--av-border-default)] bg-[var(--av-surface-soft)] p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-600 text-[11px] font-black text-white">
              {storage.length > 0 ? 3 : 2}
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="text-[14px] font-bold text-[var(--av-text-primary)]">
                {hi ? "चरण 3: बाजार मांग, एमएसपी व मूल्य रुझान" : "Step 3: Market Demand, MSP & Price Trend"}
              </h4>
              <p className="text-[11px] font-semibold text-[var(--av-text-muted)]">
                {hi ? "भाव के उतार-चढ़ाव पर नजर रखकर सही समय पर बिक्री करें" : "Track price trends to sell at optimal time"}
              </p>
            </div>
          </div>

          <dl className="mt-3 space-y-2 text-xs">
            {[
              { label: hi ? "बाजार में मांग" : "Market Demand", value: market.demand },
              { label: hi ? "एमएसपी / न्यूनतम समर्थन मूल्य" : "MSP / Support Price", value: market.msp },
              { label: hi ? "भाव का रुझान" : "Price Trend", value: market.priceTrend },
            ].map((row) => (
              <div key={row.label} className="crop-premium-inset rounded-xl p-2.5">
                <dt className="font-bold text-[var(--av-text-muted)]">{row.label}</dt>
                <dd className="mt-0.5 text-[13px] font-extrabold text-[var(--av-text-primary)]">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <AppLink
        href="/mandi"
        className="flex items-center justify-between gap-2 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3.5 transition active:scale-[0.99] shadow-xs hover:bg-emerald-500/15"
      >
        <div className="flex items-center gap-2.5">
          <Store className="h-5 w-5 text-emerald-600" />
          <span className="text-sm font-black text-[var(--av-text-primary)]">
            {hi ? "सभी फसलों के ताज़ा मंडी भाव देखें →" : "View Live Mandi Rates for All Crops →"}
          </span>
        </div>
        <ChevronRight className="h-4 w-4 text-emerald-600" />
      </AppLink>
    </div>
  );
}

