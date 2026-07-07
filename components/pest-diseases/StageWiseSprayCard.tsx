"use client";

import type { StageSprayRecommendation } from "@/types/crop-protection";

const STAGE_STYLE: Record<string, string> = {
  preventive: "border-sky-400/50 bg-sky-500/10 text-sky-900 dark:text-sky-200",
  early: "border-emerald-400/50 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200",
  advanced: "border-amber-400/50 bg-amber-500/10 text-amber-950 dark:text-amber-200",
};

const STAGE_LABEL: Record<string, string> = {
  preventive: "🛡️ Preventive",
  early: "🟢 Early / Halki lag",
  advanced: "🔴 Advanced / Tez fail raha",
};

export default function StageWiseSprayCard({
  stages,
  rotationNotes,
  extraNotes,
  continuousHarvest,
}: {
  stages: StageSprayRecommendation[];
  rotationNotes?: string;
  extraNotes?: string[];
  continuousHarvest?: boolean;
}) {
  if (!stages.length) return null;

  return (
    <div className="space-y-3">
      {continuousHarvest && (
        <p className="rounded-lg bg-violet-500/10 px-3 py-2 text-[11px] font-bold text-violet-800 dark:text-violet-200">
          ⚡ Continuous harvest crop — harvest ke paas low-PHI molecules prefer karein
        </p>
      )}

      {stages.map((s, i) => (
        <div
          key={`${s.stage}-${i}`}
          className={`rounded-xl border-2 p-3.5 ${STAGE_STYLE[s.stage] ?? STAGE_STYLE.early}`}
        >
          <p className="text-xs font-black">{STAGE_LABEL[s.stage] ?? s.label}</p>
          <p className="mt-1 text-sm font-bold">{s.label}</p>
          <p className="mt-2 text-sm">
            <span className="font-bold">Dawai:</span> {s.chemistry}
          </p>
          <p className="mt-1 text-sm">
            <span className="font-bold">Dose:</span> {s.dose}
          </p>
          {s.notes && <p className="mt-2 text-xs opacity-90">{s.notes}</p>}
        </div>
      ))}

      {rotationNotes && (
        <p className="rounded-lg bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-900 dark:text-indigo-200">
          🔄 Rotation: {rotationNotes}
        </p>
      )}

      {extraNotes?.map((n) => (
        <p key={n} className="text-xs theme-text-muted">
          • {n}
        </p>
      ))}
    </div>
  );
}
