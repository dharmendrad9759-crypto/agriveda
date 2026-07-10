"use client";

import { useState } from "react";
import { Leaf, Clock, Droplets } from "lucide-react";
import type { CropManagementProfile } from "@/types/crop-management";
import DarkCard from "@/components/shell/DarkCard";
import { ShellTabBar } from "@/components/shell/AppShell";
import { getWeedProgramForCrop } from "@/lib/crops/weedAbioticBridge";

type WeedTab = "prevention" | "monitoring" | "cultural" | "chemical";

const TAB_LABELS: Record<WeedTab, string> = {
  prevention: "Prevention",
  monitoring: "Monitoring",
  cultural: "Cultural",
  chemical: "Chemical (HRAC)",
};

interface Props {
  profile: CropManagementProfile;
}

export default function CropManagementWeedManagement({ profile }: Props) {
  const program = profile.weedProgram ?? getWeedProgramForCrop(profile.slug);
  const [tab, setTab] = useState<WeedTab>("prevention");

  if (!program) {
    return (
      <DarkCard>
        <p className="text-sm text-[var(--av-text-muted)]">
          Weed management data not available for this crop yet.
        </p>
      </DarkCard>
    );
  }

  const tips =
    tab === "chemical"
      ? program.chemical.map(
          (c) =>
            `${c.technical} @ ${c.dose} (${c.timing})${c.targets ? ` — ${c.targets}` : ""}${c.note ? ` · ${c.note}` : ""}`
        )
      : program[tab];

  return (
    <div className="space-y-4">
      <DarkCard className="border-lime-500/30 bg-lime-500/5">
        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-lime-400" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-lime-400">Critical weed-free period</p>
            <p className="mt-1 text-sm font-semibold text-[var(--av-text-primary)]">{program.criticalPeriod}</p>
            <p className="mt-2 text-[10px] text-[var(--av-text-muted)]">
              PE = pre-emergence · EPoE = early post-emergence · PoE = post-emergence. Spray on moist soil with flat-fan nozzle.
            </p>
          </div>
        </div>
      </DarkCard>

      <DarkCard>
        <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--av-text-primary)]">
          <Leaf className="h-4 w-4 text-[var(--av-accent)]" />
          Key weeds in this crop
        </h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {program.keyWeeds.map((w) => (
            <li
              key={w}
              className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-2.5 py-1 text-[10px] text-[var(--av-text-secondary)]"
            >
              {w}
            </li>
          ))}
        </ul>
      </DarkCard>

      <DarkCard>
        <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Weed management ladder</h3>
        <ShellTabBar
          tabs={(Object.keys(TAB_LABELS) as WeedTab[]).map((id) => ({ id, label: TAB_LABELS[id] }))}
          active={tab}
          onChange={setTab}
        />
        <ul className="space-y-2">
          {tips.map((tip) => (
            <li key={tip} className="flex gap-2 text-xs leading-relaxed text-[var(--av-text-secondary)]">
              <span className="shrink-0 text-[var(--av-accent)]">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </DarkCard>

      {tab === "chemical" && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[320px] text-left text-[10px]">
            <thead>
              <tr className="border-b border-[var(--av-border)] text-[var(--av-text-muted)]">
                <th className="py-2 pr-2">Technical</th>
                <th className="py-2 pr-2">Dose</th>
                <th className="py-2 pr-2">Timing</th>
                <th className="py-2">Targets</th>
              </tr>
            </thead>
            <tbody>
              {program.chemical.map((c) => (
                <tr key={`${c.technical}-${c.timing}`} className="border-b border-[var(--av-border)]/50">
                  <td className="py-2 pr-2 font-medium text-[var(--av-text-primary)]">{c.technical}</td>
                  <td className="py-2 pr-2 text-sky-400">{c.dose}</td>
                  <td className="py-2 pr-2 text-amber-400">{c.timing}</td>
                  <td className="py-2 text-[var(--av-text-muted)]">{c.targets ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {profile.weedManagement.length > 0 && (
        <DarkCard>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Quick reference (legacy cards)</h3>
          <div className="mt-3 space-y-3">
            {profile.weedManagement.slice(0, 3).map((weed) => (
              <div key={weed.weedName} className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3">
                <p className="text-xs font-bold text-[var(--av-text-primary)]">{weed.weedName}</p>
                <p className="text-[10px] italic text-[var(--av-text-muted)]">{weed.scientificName}</p>
                <p className="mt-1 text-[10px] text-[var(--av-text-secondary)]">
                  <span className="font-semibold text-lime-500">Pre:</span> {weed.preEmergenceHerbicide}
                </p>
                <p className="text-[10px] text-[var(--av-text-secondary)]">
                  <span className="font-semibold text-amber-500">Post:</span> {weed.postEmergenceHerbicide}
                </p>
              </div>
            ))}
          </div>
        </DarkCard>
      )}
    </div>
  );
}
