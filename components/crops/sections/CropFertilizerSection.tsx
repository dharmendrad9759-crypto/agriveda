"use client";

import { useState } from "react";
import { Download, Share2, Clock } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import DarkCard from "@/components/shell/DarkCard";
import { DonutChart } from "@/components/shell/charts";
import { useToast } from "@/components/ui/Toast";
import { AV } from "@/lib/design/tokens";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { getCropManagementProfile } from "@/data/crop-management";
import {
  FERTILIZER_SCHEDULE,
  NPK_DISTRIBUTION,
  FERTILIZER_TIPS,
  FERTILIZER_PRODUCTS,
} from "@/data/mock/fertilizer-schedule";
import type { Crop } from "@/types/crop";

const SUB_TABS = ["Fertilizer Schedule", "Foliar Nutrition", "Organic Options", "Nutrient Calculator", "Notes"] as const;

const MICRONUTRIENTS = [
  { name: "Zinc Sulphate", time: "Tillering", dose: "0.5% foliar", benefit: "Prevents khaira" },
  { name: "Ferrous Sulphate", time: "Panicle init.", dose: "0.5% + citric acid", benefit: "Corrects iron chlorosis" },
  { name: "Boron", time: "Flowering", dose: "0.2% borax", benefit: "Better grain set" },
  { name: "Magnesium Sulphate", time: "Grain filling", dose: "0.5% foliar", benefit: "Green leaf maintenance" },
];

const BIO_PRODUCTS = [
  { name: "Azospirillum", color: "bg-sky-100 text-sky-700", dose: "2 kg/acre seed treatment" },
  { name: "PSB", color: "bg-emerald-100 text-emerald-700", dose: "2 kg/acre basal" },
  { name: "KMB", color: "bg-amber-100 text-amber-700", dose: "2 kg/acre basal" },
  { name: "Trichoderma", color: "bg-green-100 text-green-800", dose: "2.5 kg/acre soil" },
];

export default function CropFertilizerSection({ crop }: { crop: Crop }) {
  const { showToast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<(typeof SUB_TABS)[number]>("Fertilizer Schedule");
  const hindi = getCropHindiName(crop.slug);
  const profile = getCropManagementProfile(crop.slug);
  const schedule = profile?.fertilizerSchedule?.length
    ? profile.fertilizerSchedule.map((item, i) => ({
        stage: i + 1,
        dat: `Stage ${i + 1}`,
        growth: item.split("—")[0]?.trim() ?? item.slice(0, 40),
        fertilizer: item,
        nutrients: "Per soil test",
        method: "Soil Application",
      }))
    : FERTILIZER_SCHEDULE;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button type="button" onClick={() => showToast("PDF download — jald available")} className={AV.btnSecondarySm}>
          <Download className="mr-1.5 inline h-3.5 w-3.5" />
          Download PDF
        </button>
        <AppLink href="/my-farm" className={AV.btnPrimarySm}>
          Add to My Plans
        </AppLink>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-muted)]/50 p-3 sm:grid-cols-5">
        {[
          { label: "Crop", value: `${crop.name}${hindi ? ` (${hindi})` : ""}` },
          { label: "Season", value: crop.suitableSeason },
          { label: "Variety", value: "PB 1121" },
          { label: "Area", value: "1 Acre" },
          { label: "Est. Yield", value: crop.estimatedYield, highlight: true },
        ].map((item) => (
          <div key={item.label} className="text-center sm:text-left">
            <p className={AV.label}>{item.label}</p>
            <p
              className={`mt-0.5 text-xs font-bold ${
                item.highlight
                  ? "inline-block rounded-lg bg-[var(--av-accent-soft)] px-2 py-0.5 text-[var(--av-accent)]"
                  : "text-[var(--av-text-primary)]"
              }`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-[var(--av-border)] pb-px scrollbar-hide">
        {SUB_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveSubTab(tab)}
            className={`shrink-0 px-3 py-2.5 text-xs font-semibold ${
              activeSubTab === tab
                ? "border-b-2 border-[var(--av-accent)] text-[var(--av-accent)]"
                : "text-[var(--av-text-muted)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <DarkCard delay={1}>
        <h3 className="text-sm font-bold text-[var(--av-text-primary)]">
          Fertilizer Schedule (Per Acre)
        </h3>
        <div className="mt-3 overflow-x-auto">
          <table className="av-table min-w-[680px]">
            <thead>
              <tr>
                <th>Stage</th>
                <th>Days</th>
                <th>Key Activities</th>
                <th>Fertilizer & Dose</th>
                <th>Nutrient (N:P:K)</th>
                <th>Method</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row, i) => (
                <tr key={i} className={i === 3 ? "bg-amber-50/50 dark:bg-amber-500/5" : ""}>
                  <td>
                    <span className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--av-accent)] text-[10px] font-bold text-white">
                        {typeof row.stage === "number" ? row.stage : i + 1}
                      </span>
                      <span className="font-bold text-[var(--av-accent)]">
                        {"growth" in row ? row.growth.split(" ")[0] : `Stage ${i + 1}`}
                      </span>
                    </span>
                  </td>
                  <td className="whitespace-nowrap">{row.dat}</td>
                  <td className="text-xs text-[var(--av-text-muted)]">{row.growth}</td>
                  <td>
                    <span className="inline-block rounded-full bg-[var(--av-accent-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--av-accent)]">
                      {row.fertilizer}
                    </span>
                  </td>
                  <td className="text-[var(--av-text-muted)]">{row.nutrients}</td>
                  <td className="text-center text-xs">{row.method}</td>
                  <td className="text-xs text-[var(--av-text-secondary)]">Strong root & growth</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={() => showToast("Share plan — jald available")} className={`mt-3 inline-flex items-center gap-1.5 ${AV.link}`}>
          <Share2 className="h-3.5 w-3.5" />
          Share Plan
        </button>
      </DarkCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <DarkCard hover delay={2}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">
            Nutrient Requirement for High Yield (Per Acre)
          </h3>
          <div className="mt-4 flex justify-center">
            <DonutChart
              segments={NPK_DISTRIBUTION.map((n) => ({ label: n.label, value: n.value, color: n.color }))}
              centerValue="120:60:60"
              centerLabel="Total NPK kg/acre"
              size={140}
            />
          </div>
        </DarkCard>
        <DarkCard hover delay={3}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Fertilizer Application Tips</h3>
          <ul className="mt-3 space-y-2">
            {FERTILIZER_TIPS.map((tip) => (
              <li key={tip} className="flex gap-2 text-xs text-[var(--av-text-secondary)]">
                <span className="text-[var(--av-accent)]">✓</span>
                {tip}
              </li>
            ))}
          </ul>
        </DarkCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DarkCard delay={4}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Micronutrient Schedule (Foliar)</h3>
          <table className="av-table mt-3 min-w-full">
            <thead>
              <tr>
                <th>Nutrient</th>
                <th>Time</th>
                <th>Dose</th>
                <th>Benefit</th>
              </tr>
            </thead>
            <tbody>
              {MICRONUTRIENTS.map((m) => (
                <tr key={m.name}>
                  <td className="font-semibold text-[var(--av-text-primary)]">{m.name}</td>
                  <td>{m.time}</td>
                  <td>{m.dose}</td>
                  <td className="text-xs">{m.benefit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DarkCard>

        <DarkCard delay={5}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Organic & Bio Fertilizer (Recommended)</h3>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {BIO_PRODUCTS.map((p) => (
              <div key={p.name} className="av-card-inset p-3">
                <span className={`inline-block rounded-lg px-2 py-1 text-[10px] font-bold ${p.color}`}>
                  {p.name}
                </span>
                <p className="mt-2 text-[10px] text-[var(--av-text-secondary)]">{p.dose}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {FERTILIZER_PRODUCTS.slice(0, 3).map((p) => (
              <span key={p.name} className="rounded-full border border-[var(--av-border)] px-2 py-1 text-[10px] font-semibold">
                {p.name} {p.npk}
              </span>
            ))}
          </div>
        </DarkCard>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-500/20 dark:bg-amber-500/10">
        <p className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-200">
          <Clock className="h-4 w-4" />
          Important Reminders
        </p>
        <ul className="mt-2 grid gap-1 sm:grid-cols-2">
          {[
            "Never apply all nitrogen at once — split doses",
            "Incorporate basal dose during land preparation",
            "Avoid application during heavy rainfall",
            "Conduct soil test every 2–3 years",
          ].map((r) => (
            <li key={r} className="text-[11px] text-amber-900 dark:text-amber-100">• {r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
