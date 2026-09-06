"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropAgroMeta } from "@/lib/crops/cropAgroMeta";
import { formatInrRange, getCropFieldBand } from "@/lib/crops/cropFieldBands";
import type { Crop } from "@/types/crop";
import { CloudSun, Coins, Calendar, Timer, Wheat } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Props {
  crop: Crop;
}

type InfoRow = {
  id: string;
  icon: LucideIcon;
  label: string;
  value: string;
  lines?: string[];
  note?: string;
  wide?: boolean;
  highlight?: boolean;
};

function InfoCell({ row }: { row: InfoRow }) {
  const Icon = row.icon;
  return (
    <div
      className={`flex gap-3 rounded-xl border px-3 py-2.5 ${
        row.highlight
          ? "border-amber-500/25 bg-gradient-to-r from-amber-500/8 to-transparent sm:col-span-2"
          : "border-[var(--av-border)] bg-[var(--av-surface-inset)]"
      }`}
    >
      <span
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          row.highlight
            ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
            : "bg-[color-mix(in_srgb,var(--av-accent-soft)_70%,transparent)] text-[var(--av-accent)]"
        }`}
      >
        <Icon className="h-4 w-4" strokeWidth={2.4} />
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={`text-[11px] font-bold ${
            row.highlight ? "text-amber-800 dark:text-amber-200" : "text-[var(--av-text-muted)]"
          }`}
        >
          {row.label}
        </p>
        {row.lines?.length ? (
          <ul className="mt-1 space-y-1">
            {row.lines.map((line) => (
              <li
                key={line}
                className="text-[13px] font-semibold leading-snug text-[var(--av-text-primary)]"
              >
                {line}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-0.5 text-[13px] font-semibold leading-snug text-[var(--av-text-primary)]">
            {row.value}
          </p>
        )}
        {row.note ? (
          <p className="mt-1.5 text-[11px] font-medium leading-snug text-[var(--av-text-muted)]">
            {row.note}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function CropGeneralInfoCard({ crop }: Props) {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const agro = getCropAgroMeta(crop.slug);
  const band = getCropFieldBand(crop.slug);
  const phLine = `${band.phMin.toFixed(1)}–${band.phMax.toFixed(1)}`;

  const rows: InfoRow[] = [
    {
      id: "duration",
      icon: Timer,
      label: hi ? "फसल अवधि" : "Crop duration",
      value: crop.durationDays,
    },
    {
      id: "sowing",
      icon: Calendar,
      label: hi ? "बुवाई का समय" : "Sowing time",
      value: crop.sowingGuide.bestSowingTime,
    },
    {
      id: "climate-soil",
      icon: CloudSun,
      label: hi ? "उपयुक्त मौसम और मिट्टी" : "Ideal climate & soil",
      value: "",
      lines: hi
        ? [
            `मौसम: ${crop.climate}`,
            `मिट्टी: ${crop.suitableSoil}`,
            `pH: ${phLine}`,
            `तापमान: ${agro.tempMinC}–${agro.tempMaxC}°C`,
          ]
        : [
            `Climate: ${crop.climate}`,
            `Soil: ${crop.suitableSoil}`,
            `pH: ${phLine}`,
            `Temperature: ${agro.tempMinC}–${agro.tempMaxC}°C`,
          ],
      wide: true,
    },
    {
      id: "yield",
      icon: Wheat,
      label: hi ? "औसत उत्पादन (प्रति एकड़)" : "Average yield (per acre)",
      value: crop.estimatedYield,
    },
    {
      id: "profit",
      icon: Coins,
      label: hi ? "प्रति एकड़ लागत और मुनाफ़ा (अनुमान)" : "Cost & profit per acre (est.)",
      value: "",
      lines: hi
        ? [
            `लागत: ${formatInrRange(band.costMin, band.costMax)} / एकड़`,
            `मुनाफ़ा: ${formatInrRange(band.profitMin, band.profitMax)} / एकड़`,
          ]
        : [
            `Cost: ${formatInrRange(band.costMin, band.costMax)} / acre`,
            `Profit: ${formatInrRange(band.profitMin, band.profitMax)} / acre`,
          ],
      note: hi
        ? "जिला, मौसम और मंडी भाव से वास्तविक आंकड़ा बदल सकता है"
        : "Actuals vary by district, season and mandi price",
      wide: true,
      highlight: true,
    },
  ];

  return (
    <section
      className="mb-4 overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)]"
      aria-label={hi ? "फसल की सामान्य जानकारी" : "Crop overview"}
    >
      <div className="border-b border-[var(--av-border-subtle)] bg-[color-mix(in_srgb,var(--av-accent-soft)_40%,var(--av-surface))] px-3.5 py-3">
        <p className="text-[16px] font-black leading-tight tracking-tight text-[var(--av-text-primary)]">
          {hi ? "1. फसल की सामान्य जानकारी" : "1. Crop overview"}
        </p>
      </div>

      <div className="grid gap-2 p-3.5 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.id} className={row.wide ? "sm:col-span-2" : undefined}>
            <InfoCell row={row} />
          </div>
        ))}
      </div>
    </section>
  );
}
