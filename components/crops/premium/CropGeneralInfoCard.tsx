"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropAgroMeta, getCropTempGuide } from "@/lib/crops/cropAgroMeta";
import { formatInrRange, getCropFieldBand } from "@/lib/crops/cropFieldBands";
import { plainTalk } from "@/lib/crops/farmerSpeak";
import type { Crop } from "@/types/crop";
import { CloudSun, Coins, Calendar, ChevronDown, Timer, Wheat } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

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
  /** Compact 2×2 facts inside (climate/soil) — denser on phone */
  factGrid?: { k: string; v: string }[];
};

function InfoCell({
  row,
  tempOpen,
  onTemp,
  stages,
  hi,
}: {
  row: InfoRow;
  tempOpen?: boolean;
  onTemp?: () => void;
  stages?: { stage: string; temp: string }[];
  hi?: boolean;
}) {
  const Icon = row.icon;
  return (
    <div
      className={`flex gap-2 rounded-xl border px-2.5 py-2 sm:gap-3 sm:px-3 sm:py-2.5 ${
        row.highlight
          ? "border-amber-500/25 bg-gradient-to-r from-amber-500/8 to-transparent"
          : "border-[var(--av-border)] bg-[var(--av-surface-inset)]"
      }`}
    >
      <span
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg sm:h-8 sm:w-8 ${
          row.highlight
            ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
            : "bg-[color-mix(in_srgb,var(--av-accent-soft)_70%,transparent)] text-[var(--av-accent)]"
        }`}
      >
        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.4} />
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={`text-[10px] font-bold leading-tight sm:text-[11px] ${
            row.highlight ? "text-amber-800 dark:text-amber-200" : "text-[var(--av-text-muted)]"
          }`}
        >
          {row.label}
        </p>
        {row.factGrid?.length ? (
          <div className="mt-1.5 grid grid-cols-2 gap-1 sm:gap-1.5">
            {row.factGrid.map((f) => {
              const isTemp = f.k === "तापमान" || f.k === "Temp";
              const body = (
                <>
                  <p className="text-[9px] font-bold text-[var(--av-text-muted)] sm:text-[10px]">
                    {f.k}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold leading-snug text-[var(--av-text-primary)] sm:text-[12px]">
                    {f.v}
                    {isTemp ? (
                      <ChevronDown className={`h-3.5 w-3.5 text-emerald-800 ${tempOpen ? "rotate-180" : ""}`} />
                    ) : null}
                  </p>
                </>
              );
              if (!isTemp) {
                return (
                  <div key={f.k} className="rounded-lg bg-[var(--av-surface)]/80 px-1.5 py-1 sm:px-2 sm:py-1.5">
                    {body}
                  </div>
                );
              }
              return (
                <button
                  key={f.k}
                  type="button"
                  onClick={onTemp}
                  className="rounded-lg bg-[var(--av-surface)]/80 px-1.5 py-1 text-left ring-emerald-700/30 active:scale-[0.98] active:ring-2 sm:px-2 sm:py-1.5"
                  aria-expanded={isTemp ? tempOpen : undefined}
                >
                  {body}
                </button>
              );
            })}
          </div>
        ) : row.lines?.length ? (
          <ul className="mt-0.5 space-y-0.5 sm:mt-1 sm:space-y-1">
            {row.lines.map((line) => (
              <li
                key={line}
                className="text-[12px] font-semibold leading-snug text-[var(--av-text-primary)] sm:text-[13px]"
              >
                {line}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-0.5 text-[12px] font-semibold leading-snug text-[var(--av-text-primary)] sm:text-[13px]">
            {row.value}
          </p>
        )}
        {tempOpen && stages?.length ? (
          <div className="mt-2 overflow-hidden rounded-xl border border-emerald-900/10 bg-white">
            <p className="bg-[#0B3D28] px-2.5 py-1.5 text-[12px] font-black text-white">
              {hi ? "स्टेज का तापमान" : "Temperature by stage"}
            </p>
            <ul>
              {stages.map((stage) => (
                <li key={stage.stage} className="flex items-center justify-between gap-3 border-t border-emerald-900/10 px-2.5 py-2">
                  <span className="text-[14px] font-bold text-[#0B3D28]">{stage.stage}</span>
                  <span className="text-right text-[14px] font-black text-emerald-800">{stage.temp}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {row.note ? (
          <p className="mt-1 text-[10px] font-medium leading-snug text-[var(--av-text-muted)] sm:mt-1.5 sm:text-[11px]">
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
  const [tempOpen, setTempOpen] = useState(false);
  const tempGuide = getCropTempGuide(crop.slug);

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
      id: "yield",
      icon: Wheat,
      label: hi ? "औसत उत्पादन / एकड़" : "Avg yield / acre",
      value: crop.estimatedYield,
      wide: true,
    },
    {
      id: "climate-soil",
      icon: CloudSun,
      label: hi ? "उपयुक्त मौसम और मिट्टी" : "Ideal climate & soil",
      value: "",
      factGrid: hi
        ? [
            { k: "मौसम", v: plainTalk(crop.climate) },
            { k: "मिट्टी", v: plainTalk(crop.suitableSoil) },
            { k: "मिट्टी का स्वभाव (pH)", v: phLine },
            { k: "तापमान", v: `${agro.tempMinC}–${agro.tempMaxC}°C` },
          ]
        : [
            { k: "Climate", v: plainTalk(crop.climate) },
            { k: "Soil", v: plainTalk(crop.suitableSoil) },
            { k: "pH", v: phLine },
            { k: "Temp", v: `${agro.tempMinC}–${agro.tempMaxC}°C` },
          ],
      wide: true,
    },
    {
      id: "profit",
      icon: Coins,
      label: hi ? "लागत और मुनाफ़ा / एकड़" : "Cost & profit / acre",
      value: "",
      lines: hi
        ? [
            `लागत: ${formatInrRange(band.costMin, band.costMax)}`,
            `मुनाफ़ा: ${formatInrRange(band.profitMin, band.profitMax)}`,
          ]
        : [
            `Cost: ${formatInrRange(band.costMin, band.costMax)}`,
            `Profit: ${formatInrRange(band.profitMin, band.profitMax)}`,
          ],
      note: hi
        ? "जिला, मौसम और मंडी भाव से आंकड़ा बदल सकता है"
        : "Varies by district, season and mandi",
      wide: true,
      highlight: true,
    },
  ];

  return (
    <section
      className="mb-3 overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)] sm:mb-4"
      aria-label={hi ? "फसल की सामान्य जानकारी" : "Crop overview"}
    >
      <div className="border-b border-[var(--av-border-subtle)] bg-[color-mix(in_srgb,var(--av-accent-soft)_40%,var(--av-surface))] px-3 py-2 sm:px-3.5 sm:py-3">
        <p className="text-[14px] font-black leading-tight tracking-tight text-[var(--av-text-primary)] sm:text-[16px]">
          {hi ? "फसल एक नज़र में" : "Crop at a glance"}
        </p>
      </div>

      {/* Mobile: 2-col for short cards → less vertical length; sm+ same */}
      <div className="grid grid-cols-2 gap-1.5 p-2.5 sm:gap-2 sm:p-3.5">
        {rows.map((row) => (
          <div
            key={row.id}
            className={row.wide ? "col-span-2" : undefined}
          >
            <InfoCell
              row={row}
              hi={hi}
              tempOpen={row.id === "climate-soil" && tempOpen}
              onTemp={row.id === "climate-soil" ? () => setTempOpen((open) => !open) : undefined}
              stages={row.id === "climate-soil" ? tempGuide.stages : undefined}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
