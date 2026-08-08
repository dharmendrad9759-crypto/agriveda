"use client";

import { useEffect, useMemo, useState } from "react";
import {
  KCC_SOF_CROPS,
  KCC_TIMELY_REPAY_OFFICIAL_HI,
} from "@/data/schemes/kccScaleOfFinance";
import {
  estimateKccLimit,
  formatInrHi,
  type KccLimitBreakdown,
} from "@/lib/schemes/kccLimitEstimate";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";

export default function KccLimitCalculator({
  onEstimate,
}: {
  onEstimate?: (b: KccLimitBreakdown | null) => void;
}) {
  const { profile, hydrated } = useFarmerProfile();
  const [acres, setAcres] = useState("1");
  const [cropId, setCropId] = useState("paddy");
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    if (!hydrated || seeded) return;
    if (profile.totalFarmAreaAcres && profile.totalFarmAreaAcres > 0) {
      setAcres(String(profile.totalFarmAreaAcres));
    }
    setSeeded(true);
  }, [hydrated, profile.totalFarmAreaAcres, seeded]);

  const result = useMemo(() => {
    const n = parseFloat(acres.replace(",", "."));
    return estimateKccLimit({ areaAcres: n, cropId });
  }, [acres, cropId]);

  useEffect(() => {
    onEstimate?.(result);
  }, [result, onEstimate]);

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-3">
        <p className="text-[12px] font-bold text-amber-950 dark:text-amber-50">
          1) समय पर चुकाएँ → प्रभावी ब्याज कम (~4% तक संभव)
        </p>
        <p className="mt-1 text-[11px] leading-snug text-amber-900/90 dark:text-amber-100/90">
          {KCC_TIMELY_REPAY_OFFICIAL_HI}
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] p-4">
        <p className="text-[13px] font-bold text-[var(--av-text-primary)]">
          2) लिमिट अनुमान (RBI सूत्र)
        </p>
        <p className="text-[11px] leading-snug text-[var(--av-text-muted)]">
          SoF × हेक्टेयर + <strong>10%</strong> कटाई/घरेलू + <strong>20%</strong> मरम्मत/कृषि
          सेवाएँ। SoF यहाँ सिर्फ उदाहरण — जिला DLTC अलग तय करेगी।
        </p>

        <label className="block text-[11px] font-semibold text-[var(--av-text-muted)]">
          क्षेत्र (एकड़)
          <input
            type="number"
            min={0.1}
            step={0.1}
            value={acres}
            onChange={(e) => setAcres(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2.5 text-sm font-bold text-[var(--av-text-primary)] outline-none focus:border-emerald-500/40"
          />
        </label>

        <label className="block text-[11px] font-semibold text-[var(--av-text-muted)]">
          मुख्य फसल
          <select
            value={cropId}
            onChange={(e) => setCropId(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2.5 text-sm font-bold text-[var(--av-text-primary)] outline-none focus:border-emerald-500/40"
          >
            {KCC_SOF_CROPS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameHi}
              </option>
            ))}
          </select>
        </label>

        {result ? (
          <div className="space-y-1.5 border-t border-emerald-500/20 pt-3">
            <p className="text-[11px] text-[var(--av-text-muted)]">
              {result.crop.nameHi} · {acres} एकड़ ≈ {result.areaHa} हेक्टेयर
            </p>
            <div className="space-y-1 rounded-xl bg-[var(--av-surface)]/80 px-3 py-2 text-[12px] text-[var(--av-text-secondary)]">
              <p>
                (i) फसल लागत SoF अनुमान:{" "}
                <span className="font-bold text-[var(--av-text-primary)]">
                  {formatInrHi(result.sofBaseInr)}
                </span>
              </p>
              <p>
                (ii) +10% कटाई/घरेलू:{" "}
                <span className="font-bold text-[var(--av-text-primary)]">
                  {formatInrHi(result.postHarvestInr)}
                </span>
              </p>
              <p>
                (iii) +20% मरम्मत/सेवाएँ:{" "}
                <span className="font-bold text-[var(--av-text-primary)]">
                  {formatInrHi(result.maintenanceInr)}
                </span>
              </p>
              <p className="text-[10px] text-[var(--av-text-muted)]">
                (iv) फसल/दुर्घटना बीमा — बैंक अलग जोड़ सकता है
              </p>
            </div>
            <p className="mt-2 font-display text-xl font-bold text-emerald-900 dark:text-emerald-100">
              कुल अनुमान ≈ {formatInrHi(result.estimateInr)}
            </p>
            <p className="text-[11px] leading-snug text-amber-900/90 dark:text-amber-100/90">
              {result.disclaimerHi}
            </p>
            <p className="text-[10px] leading-snug text-[var(--av-text-muted)]">
              {result.formulaSourceHi}
            </p>
          </div>
        ) : (
          <p className="text-[12px] text-[var(--av-text-muted)]">सही एकड़ डालें।</p>
        )}
      </div>
    </div>
  );
}
