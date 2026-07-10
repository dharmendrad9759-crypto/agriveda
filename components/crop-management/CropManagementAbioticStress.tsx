"use client";

import { useState } from "react";
import { CloudRain, Sun, Thermometer, AlertTriangle } from "lucide-react";
import type { CropManagementProfile } from "@/types/crop-management";
import DarkCard from "@/components/shell/DarkCard";
import { ShellTabBar } from "@/components/shell/AppShell";
import { getAbioticStressForCrop } from "@/lib/crops/weedAbioticBridge";

type StressTab = "prevention" | "monitoring" | "cultural" | "chemical";

const TAB_LABELS: Record<StressTab, string> = {
  prevention: "Prevention",
  monitoring: "Monitoring",
  cultural: "Cultural",
  chemical: "Correction",
};

interface Props {
  profile: CropManagementProfile;
}

function stressIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("flood") || n.includes("water") || n.includes("submerg")) return CloudRain;
  if (n.includes("heat") || n.includes("drought") || n.includes("moisture")) return Sun;
  if (n.includes("cold") || n.includes("frost")) return Thermometer;
  return AlertTriangle;
}

export default function CropManagementAbioticStress({ profile }: Props) {
  const items = profile.abioticStress?.length
    ? profile.abioticStress
    : getAbioticStressForCrop(profile.slug);

  const [selected, setSelected] = useState(0);
  const [tab, setTab] = useState<StressTab>("prevention");

  if (!items.length) {
    return (
      <DarkCard>
        <p className="text-sm text-[var(--av-text-muted)]">
          Abiotic stress data not available for this crop yet.
        </p>
      </DarkCard>
    );
  }

  const active = items[selected] ?? items[0];
  const Icon = stressIcon(active.stressName);

  const tips =
    tab === "chemical"
      ? active.corrections.map(
          (c) =>
            `${c.input} — ${c.dose}${c.stage ? ` (${c.stage})` : ""}${c.note ? ` · ${c.note}` : ""}`
        )
      : active[tab];

  return (
    <div className="space-y-4">
      <DarkCard className="border-amber-500/20 bg-amber-500/5">
        <p className="text-xs leading-relaxed text-[var(--av-text-secondary)]">
          Ye disorders disease nahi hain — nutrient deficiency, waterlogging, heat, salinity, lodging. Pehle cause samjho, phir correction.
        </p>
      </DarkCard>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-hide">
        {items.map((item, i) => (
          <button
            key={item.stressName}
            type="button"
            onClick={() => {
              setSelected(i);
              setTab("prevention");
            }}
            className={`shrink-0 rounded-xl border px-3 py-2 text-left text-[10px] font-semibold transition ${
              selected === i
                ? "border-[var(--av-accent)] bg-[var(--av-accent-soft)] text-[var(--av-accent)]"
                : "border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-muted)]"
            }`}
          >
            {item.stressName.split("(")[0].trim()}
          </button>
        ))}
      </div>

      <DarkCard>
        <div className="flex items-start gap-3">
          <Icon className="mt-0.5 h-6 w-6 shrink-0 text-amber-400" />
          <div className="min-w-0">
            <h3 className="text-base font-bold text-[var(--av-text-primary)]">{active.stressName}</h3>
            <p className="mt-2 text-xs text-[var(--av-text-secondary)]">
              <span className="font-semibold text-amber-500">Symptoms:</span> {active.symptoms}
            </p>
            <p className="mt-1 text-xs text-[var(--av-text-muted)]">
              <span className="font-semibold">Cause:</span> {active.cause}
            </p>
          </div>
        </div>
      </DarkCard>

      <DarkCard>
        <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Management ladder</h3>
        <ShellTabBar
          tabs={(Object.keys(TAB_LABELS) as StressTab[]).map((id) => ({ id, label: TAB_LABELS[id] }))}
          active={tab}
          onChange={setTab}
        />
        <ul className="space-y-2">
          {tips.length ? (
            tips.map((tip) => (
              <li key={tip} className="flex gap-2 text-xs leading-relaxed text-[var(--av-text-secondary)]">
                <span className="shrink-0 text-[var(--av-accent)]">•</span>
                {tip}
              </li>
            ))
          ) : (
            <li className="text-xs text-[var(--av-text-muted)]">No steps in this category.</li>
          )}
        </ul>
      </DarkCard>
    </div>
  );
}
