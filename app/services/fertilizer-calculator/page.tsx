"use client";

import { useMemo, useState } from "react";
import Agriveda2Shell from "@/components/agriveda2/Agriveda2Shell";
import GlassCard from "@/components/ui/GlassCard";
import { cropCatalog } from "@/data/crop-catalog";
import { buildFertilizerPlan, listFertilizerCrops } from "@/lib/agriveda2/fertilizerEngine";
import { FERTILIZER_SOURCES } from "@/data/agriveda2/fertilizer-data";
import { convertToAcres, type AreaUnit } from "@/lib/agriveda2/seedCalculatorEngine";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { getBighaInfo } from "@/lib/bighaConversion";

const UNIT_LABELS: Record<AreaUnit, string> = {
  acre: "एकड़ (Acre)",
  bigha: "बीघा (Bigha)",
  hectare: "हेक्टेयर (Hectare)",
};

export default function FertilizerCalculatorPage() {
  const { profile } = useFarmerProfile();
  const slugs = useMemo(() => listFertilizerCrops(), []);
  const crops = cropCatalog.filter((c) => slugs.includes(c.slug));

  const [slug, setSlug] = useState(crops[0]?.slug ?? "wheat");
  const [area, setArea] = useState("1");
  const [unit, setUnit] = useState<AreaUnit>("acre");

  const bighaInfo = useMemo(
    () => (unit === "bigha" ? getBighaInfo(profile.state, profile.district) : null),
    [unit, profile.state, profile.district]
  );

  const acres = useMemo(() => {
    const n = parseFloat(area);
    if (!n || n <= 0) return 0;
    return convertToAcres(n, unit, bighaInfo?.acresPerBigha);
  }, [area, unit, bighaInfo?.acresPerBigha]);

  const plan = useMemo(() => {
    if (!acres) return null;
    return buildFertilizerPlan(slug, acres);
  }, [slug, acres]);

  const selected = cropCatalog.find((c) => c.slug === slug);

  return (
    <Agriveda2Shell
      title="खाद कैलकुलेटर"
      subtitle="N, P, K, Ca, Mg, S, Zn, Fe, B — fasal ke hisaab se"
      backHref="/dashboard"
    >
      <GlassCard className="space-y-4 p-4">
        <label className="block text-xs font-bold theme-text-muted">फसल</label>
        <select
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="theme-input w-full rounded-xl border px-3 py-2.5 text-sm font-semibold"
        >
          {crops.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.emoji} {c.name}
            </option>
          ))}
        </select>

        {selected && (
          <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-800">
            {selected.emoji} {selected.name} — niche poora poshan schedule
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold theme-text-muted">खेत area</label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="theme-input mt-1 w-full rounded-xl border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold theme-text-muted">Unit</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as AreaUnit)}
              className="theme-input mt-1 w-full rounded-xl border px-3 py-2 text-sm"
            >
              {(Object.keys(UNIT_LABELS) as AreaUnit[]).map((u) => (
                <option key={u} value={u}>
                  {UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {bighaInfo && (
          <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-[11px] font-semibold text-amber-900 dark:text-amber-200">
            {profile.district ? `${profile.district}: ` : ""}
            {bighaInfo.label} = {bighaInfo.acresPerBigha} एकड़
          </p>
        )}

        {plan && (
          <>
            <p className="rounded-lg bg-emerald-500/10 p-2 text-[10px] theme-text-muted">
              {plan.unitNote}
              {plan.source === "guide" && " · ICAR crop guide (verified data jald add hoga)"}
            </p>

            <div>
              <p className="text-xs font-extrabold theme-text-primary">
                🌱 Poshan — {plan.cropKey} ({area} {unit} ≈ {plan.acres} acre)
              </p>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b theme-text-muted">
                      <th className="py-1 pr-2">Nutrient</th>
                      <th className="py-1">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.nutrients.map((row) => (
                      <tr key={row.nutrient} className="border-b border-gray-100 dark:border-white/5">
                        <td className="py-1.5 pr-2 font-bold">{row.nutrient}</td>
                        <td className="py-1.5 theme-text-muted">{row.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {plan.bags.length > 0 && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm">
                <p className="font-extrabold text-emerald-800">Total bags ({plan.acres} acre)</p>
                <ul className="mt-2 space-y-0.5 text-xs">
                  {plan.bags.map((b) => (
                    <li key={b.name}>
                      → {b.name}: {b.amount}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {plan.schedule.length > 0 && (
              <div>
                <p className="text-xs font-bold theme-text-primary">Schedule</p>
                <ul className="mt-2 space-y-2 text-xs theme-text-muted">
                  {plan.schedule.map((s) => (
                    <li key={s.time} className="rounded-lg border border-gray-200 p-2 dark:border-white/10">
                      <p className="font-bold theme-text-primary">{s.time}</p>
                      <p>{s.apply}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {plan.source === "verified" && (
              <details className="text-[10px] theme-text-muted">
                <summary className="cursor-pointer font-bold theme-text-primary">
                  Conversion formulas
                </summary>
                <ul className="mt-2 space-y-2">
                  {Object.entries(FERTILIZER_SOURCES).map(([group, formulas]) => (
                    <li key={group}>
                      <span className="font-semibold">{group}:</span>
                      {Object.entries(formulas).map(([name, formula]) => (
                        <p key={name} className="ml-2">
                          {name}: {formula}
                        </p>
                      ))}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </>
        )}

        {!plan && (
          <p className="text-center text-sm theme-text-muted">Area daalein — khad plan yahan aayega</p>
        )}
      </GlassCard>
    </Agriveda2Shell>
  );
}
