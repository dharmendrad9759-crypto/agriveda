"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import DarkCard from "@/components/shell/DarkCard";
import StatCard from "@/components/shell/StatCard";
import { DonutChart } from "@/components/shell/charts";
import { useToast } from "@/components/ui/Toast";
import { AV } from "@/lib/design/tokens";
import {
  FERTILIZER_SUMMARY,
  FERTILIZER_SCHEDULE,
  NPK_DISTRIBUTION,
  FERTILIZER_TIPS,
  FERTILIZER_PRODUCTS,
} from "@/data/mock/fertilizer-schedule";
import type { Crop } from "@/types/crop";
import { FlaskConical, IndianRupee, Layers, Clock, Calendar } from "lucide-react";

export default function CropFertilizerSection({ crop: _crop }: { crop: Crop }) {
  const { showToast } = useToast();
  const [method, setMethod] = useState<"transplanted" | "dsr">("transplanted");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard icon={FlaskConical} label="Recommended NPK" value={FERTILIZER_SUMMARY.npk} sub="kg/acre" />
        <StatCard icon={IndianRupee} label="Est. Cost" value={FERTILIZER_SUMMARY.cost} sub="/acre" />
        <StatCard icon={Layers} label="Application Stages" value={`${FERTILIZER_SUMMARY.stages} Total`} />
        <StatCard icon={Clock} label="Next Application" value={FERTILIZER_SUMMARY.nextApp} />
        <StatCard icon={Calendar} label="Last Updated" value="07 May, 2024" sub="09:30 AM" />
      </div>

      <DarkCard delay={1}>
        <div className="flex flex-wrap items-center justify-between gap-2">
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
          <table className="av-table min-w-[640px]">
            <thead>
              <tr>
                <th>Stage</th>
                <th>DAT</th>
                <th>Growth Stage</th>
                <th>Fertilizer & Dose</th>
                <th>Nutrients</th>
                <th>Method</th>
              </tr>
            </thead>
            <tbody>
              {FERTILIZER_SCHEDULE.map((row) => (
                <tr key={row.stage}>
                  <td className="font-bold text-[var(--av-accent)]">{row.stage}</td>
                  <td className="text-center">{row.dat}</td>
                  <td className="text-[var(--av-text-primary)]">{row.growth}</td>
                  <td>{row.fertilizer}</td>
                  <td className="text-[var(--av-text-muted)]">{row.nutrients}</td>
                  <td className="text-center">{row.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={() => showToast("PDF download — jald available")}
          className={`mt-4 inline-flex items-center gap-1.5 ${AV.link}`}
        >
          <Download className="h-4 w-4" /> Download Schedule (PDF)
        </button>
      </DarkCard>

      <div className="grid gap-4 lg:grid-cols-2">
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

      <DarkCard delay={4}>
        <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Recommended Fertilizers</h3>
        <div className="mt-3 flex gap-3 overflow-x-auto scrollbar-hide">
          {FERTILIZER_PRODUCTS.map((p) => (
            <div
              key={p.name}
              className="w-36 shrink-0 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3 text-center"
            >
              <p className="text-xs font-bold text-[var(--av-text-primary)]">{p.name}</p>
              <p className="text-[10px] text-[var(--av-text-muted)]">{p.npk}</p>
              <p className="text-[10px] text-[var(--av-accent)]">{p.dose}</p>
            </div>
          ))}
        </div>
      </DarkCard>
    </div>
  );
}
