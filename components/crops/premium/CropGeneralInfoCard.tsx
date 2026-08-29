"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropAgroMeta } from "@/lib/crops/cropAgroMeta";
import type { Crop } from "@/types/crop";
import { CloudSun, Coins, Calendar, Timer, Wheat } from "lucide-react";

interface Props {
  crop: Crop;
}

type Row = { icon: typeof Timer; label: string; value: string };

export default function CropGeneralInfoCard({ crop }: Props) {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const agro = getCropAgroMeta(crop.slug);
  const market = crop.marketInformation;

  const profitHint = market?.msp
    ? hi
      ? `एमएसपी ${market.msp} · ${market.demand} · ${market.priceTrend}`
      : `MSP ${market.msp} · ${market.demand} · ${market.priceTrend}`
    : hi
      ? "प्रति एकड़ लागत और मुनाफ़े का विस्तृत अनुमान जल्द जोड़ेंगे"
      : "Per-acre cost and profit estimate coming soon";

  const climateSoil = hi
    ? `${crop.climate} · ${crop.suitableSoil} · ${agro.tempMinC}–${agro.tempMaxC}°C`
    : `${crop.climate} · ${crop.suitableSoil} · ${agro.tempMinC}–${agro.tempMaxC}°C`;

  const rows: Row[] = [
    {
      icon: Timer,
      label: hi ? "समय (अवधि)" : "Duration",
      value: crop.durationDays,
    },
    {
      icon: Calendar,
      label: hi ? "सही समय (मौसम)" : "Best season",
      value: crop.suitableSeason,
    },
    {
      icon: CloudSun,
      label: hi ? "उपयुक्त मौसम और मिट्टी" : "Ideal climate & soil",
      value: climateSoil,
    },
    {
      icon: Wheat,
      label: hi ? "औसत उत्पादन (प्रति एकड़)" : "Average yield (per acre)",
      value: crop.estimatedYield,
    },
    {
      icon: Coins,
      label: hi ? "प्रति एकड़ लागत और मुनाफ़ा (अनुमान)" : "Cost & profit per acre (est.)",
      value: profitHint,
    },
  ];

  return (
    <section
      className="mb-4 overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)]"
      aria-label={hi ? "फसल की सामान्य जानकारी" : "Crop overview"}
    >
      <div className="border-b border-[var(--av-border-subtle)] bg-[color-mix(in_srgb,var(--av-accent-soft)_40%,var(--av-surface))] px-3.5 py-3">
        <p className="text-[16px] font-black leading-tight tracking-tight text-[var(--av-text-primary)]">
          {hi ? "१. फसल की सामान्य जानकारी" : "1. Crop overview"}
        </p>
      </div>

      <dl className="grid gap-px bg-[var(--av-border-subtle)] sm:grid-cols-2">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <div
              key={row.label}
              className={`flex gap-2.5 bg-[var(--av-surface)] px-3.5 py-2.5 ${
                row.label.includes("लागत") || row.label.includes("Cost")
                  ? "sm:col-span-2"
                  : ""
              }`}
            >
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--av-surface-inset)] text-[var(--av-accent)]">
                <Icon className="h-3.5 w-3.5" strokeWidth={2.4} />
              </span>
              <div className="min-w-0">
                <dt className="text-[10px] font-extrabold uppercase tracking-wide text-[var(--av-text-muted)]">
                  {row.label}
                </dt>
                <dd className="mt-0.5 text-[12px] font-semibold leading-snug text-[var(--av-text-primary)]">
                  {row.value}
                </dd>
              </div>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
