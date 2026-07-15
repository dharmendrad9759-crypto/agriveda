"use client";

import type { StageSprayRecommendation } from "@/types/crop-protection";
import {
  pickFarmerStages,
  primaryChemistry,
  shortRotationTip,
  WATER_PER_ACRE_EN,
  WATER_PER_ACRE_HI,
} from "@/lib/pest/farmerSpray";
import { useLocale } from "@/components/i18n/LocaleProvider";

const STAGE_STYLE: Record<string, string> = {
  early: "border-emerald-400/40 bg-emerald-500/10",
  preventive: "border-emerald-400/40 bg-emerald-500/10",
  advanced: "border-amber-400/40 bg-amber-500/10",
};

export default function StageWiseSprayCard({
  stages,
  rotationNotes,
}: {
  stages: StageSprayRecommendation[];
  rotationNotes?: string;
  extraNotes?: string[];
  continuousHarvest?: boolean;
}) {
  const { locale } = useLocale();
  const hi = locale === "hi" || locale === "hinglish";
  const farmerStages = pickFarmerStages(stages);
  if (!farmerStages.length) return null;

  const water = hi ? WATER_PER_ACRE_HI : WATER_PER_ACRE_EN;
  const tip = shortRotationTip(rotationNotes, hi);

  return (
    <div className="space-y-3">
      {farmerStages.map((s, i) => {
        const isAdvanced = s.stage === "advanced";
        const title = hi
          ? isAdvanced
            ? "अगर तेज़ फैल रहा हो"
            : "शुरुआत में (हल्की लग)"
          : isAdvanced
            ? "If spreading fast"
            : "Start here (early)";
        const chem = primaryChemistry(s.chemistry);
        return (
          <div
            key={`${s.stage}-${i}`}
            className={`rounded-2xl border-2 p-3.5 ${STAGE_STYLE[s.stage] ?? STAGE_STYLE.early}`}
          >
            <p className="text-xs font-black text-[var(--av-text-primary)]">{title}</p>

            <div className="mt-2.5 space-y-1.5 text-sm">
              <p>
                <span className="font-bold text-[var(--av-text-muted)]">
                  {hi ? "दवा (टेक्निकल): " : "Medicine (technical): "}
                </span>
                <span className="font-bold text-[var(--av-text-primary)]">{chem}</span>
              </p>
              <p>
                <span className="font-bold text-[var(--av-text-muted)]">
                  {hi ? "डोज़ (एक एकड़): " : "Dose (1 acre): "}
                </span>
                <span className="font-semibold text-[var(--av-text-primary)]">{s.dose}</span>
              </p>
              <p>
                <span className="font-bold text-[var(--av-text-muted)]">
                  {hi ? "पानी: " : "Water: "}
                </span>
                <span className="font-semibold text-[var(--av-text-primary)]">{water}</span>
              </p>
            </div>
          </div>
        );
      })}

      {tip && (
        <p className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-[11px] font-medium text-amber-900 dark:text-amber-100">
          {tip}
        </p>
      )}

      <p className="text-[10px] text-[var(--av-text-muted)]">
        {hi
          ? "दूकान पर बोतल का लेबल ज़रूर पढ़ें। सही मात्रा से ज़्यादा न डालें।"
          : "Always follow the bottle label. Do not overdose."}
      </p>
    </div>
  );
}
