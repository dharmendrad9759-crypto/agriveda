"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import AppShell, { ShellCtaBanner } from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import StatCard from "@/components/shell/StatCard";
import CropSubNav from "@/components/crops/CropSubNav";
import { DonutChart } from "@/components/shell/charts";
import {
  FERTILIZER_SUMMARY,
  FERTILIZER_SCHEDULE,
  NPK_DISTRIBUTION,
  FERTILIZER_TIPS,
  FERTILIZER_PRODUCTS,
} from "@/data/mock/fertilizer-schedule";
import type { Crop } from "@/types/crop";
import { FlaskConical, IndianRupee, Layers, Clock, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function CropFertilizerClient({ crop }: { crop: Crop }) {
  const { showToast } = useToast();
  const [method, setMethod] = useState<"transplanted" | "dsr">("transplanted");

  return (
    <AppShell
      title={`${crop.name} Fertilizer Schedule`}
      subtitle="Apply the right fertilizer, at the right time for maximum yield"
      breadcrumbs={[
        { label: "Crops", href: "/crops" },
        { label: crop.name, href: `/crops/${crop.slug}` },
        { label: "Fertilizer Schedule" },
      ]}
    >
      <CropSubNav slug={crop.slug} cropName={crop.name} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard icon={FlaskConical} label="Recommended NPK" value={FERTILIZER_SUMMARY.npk} sub="kg/acre" />
        <StatCard icon={IndianRupee} label="Est. Cost" value={FERTILIZER_SUMMARY.cost} sub="/acre" />
        <StatCard icon={Layers} label="Application Stages" value={`${FERTILIZER_SUMMARY.stages} Total`} />
        <StatCard icon={Clock} label="Next Application" value={FERTILIZER_SUMMARY.nextApp} />
        <StatCard icon={Calendar} label="Last Updated" value="07 May, 2024" sub="09:30 AM" />
      </div>

      <DarkCard className="mt-4" delay={1}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Fertilizer Schedule</h3>
          <div className="flex rounded-lg border border-[var(--av-border)] p-0.5">
            {(["dsr", "transplanted"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={`rounded-md px-3 py-1 text-[10px] font-bold uppercase ${
                  method === m ? "bg-[var(--av-accent)] text-white" : "text-[var(--av-text-muted)]"
                }`}
              >
                {m === "dsr" ? "DSR" : "Transplanted"}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-xs">
            <thead>
              <tr className="text-[var(--av-text-muted)]">
                <th className="pb-2 text-left">Stage</th>
                <th className="pb-2">DAT</th>
                <th className="pb-2 text-left">Growth Stage</th>
                <th className="pb-2 text-left">Fertilizer & Dose</th>
                <th className="pb-2 text-left">Nutrients</th>
                <th className="pb-2">Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]">
              {FERTILIZER_SCHEDULE.map((row) => (
                <tr key={row.stage}>
                  <td className="py-2 font-bold text-[var(--av-accent)]">{row.stage}</td>
                  <td className="py-2 text-center text-[var(--av-text-secondary)]">{row.dat}</td>
                  <td className="py-2 text-[var(--av-text-primary)]">{row.growth}</td>
                  <td className="py-2 text-[var(--av-text-secondary)]">{row.fertilizer}</td>
                  <td className="py-2 text-[var(--av-text-muted)]">{row.nutrients}</td>
                  <td className="py-2 text-center text-[var(--av-text-secondary)]">{row.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={() => showToast("PDF download — jald available")}
          className="mt-4 flex items-center gap-2 text-xs font-semibold text-[var(--av-accent)]"
        >
          <Download className="h-4 w-4" /> Download Schedule (PDF)
        </button>
      </DarkCard>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <DarkCard hover delay={2}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Nutrient Distribution</h3>
          <div className="mt-4">
            <DonutChart
              segments={NPK_DISTRIBUTION.map((n) => ({ label: n.label, value: n.value, color: n.color }))}
              centerValue="120:60:60"
              centerLabel="NPK kg/acre"
            />
          </div>
        </DarkCard>
        <DarkCard hover delay={3}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Application Tips (4R Principle)</h3>
          <ul className="mt-3 space-y-2">
            {FERTILIZER_TIPS.map((tip) => (
              <li key={tip} className="flex gap-2 text-xs text-[var(--av-text-secondary)]">
                <span className="text-[var(--av-accent)]">•</span> {tip}
              </li>
            ))}
          </ul>
        </DarkCard>
      </div>

      <DarkCard className="mt-4" delay={4}>
        <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Recommended Fertilizers</h3>
        <div className="mt-3 flex gap-3 overflow-x-auto scrollbar-hide">
          {FERTILIZER_PRODUCTS.map((p) => (
            <div key={p.name} className="w-36 shrink-0 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3 text-center">
              <div className="text-3xl">🧴</div>
              <p className="mt-2 text-xs font-bold text-[var(--av-text-primary)]">{p.name}</p>
              <p className="text-[10px] text-[var(--av-text-muted)]">{p.npk}</p>
              <p className="text-[10px] text-[var(--av-accent)]">{p.dose}</p>
            </div>
          ))}
        </div>
      </DarkCard>

      <DarkCard className="mt-4" delay={5}>
        <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Quick Calculator</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-[10px] text-[var(--av-text-muted)]">Target Yield (q/acre)</label>
            <input type="number" defaultValue={45} className="mt-1 w-full rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2 text-sm text-[var(--av-text-primary)]" />
          </div>
          <div>
            <label className="text-[10px] text-[var(--av-text-muted)]">Field Size (acre)</label>
            <input type="number" defaultValue={1} className="mt-1 w-full rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2 text-sm text-[var(--av-text-primary)]" />
          </div>
        </div>
        <div className="mt-3 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3 text-xs text-[var(--av-text-secondary)]">
          <p className="font-semibold text-[var(--av-text-primary)]">Fertilizer Requirement (45 q/acre, 1 acre):</p>
          <p className="mt-1">Urea: 140 kg · DAP: 50 kg · MOP: 40 kg · ZnSO₄: 5 kg</p>
        </div>
      </DarkCard>

      <ShellCtaBanner
        title="Need a personalized fertilizer plan?"
        description="Our AI Doctor will create the best plan for your field based on soil, crop & weather."
        buttonLabel="Get Plan from AI Doctor"
        href="/ai-doctor"
      />
    </AppShell>
  );
}
