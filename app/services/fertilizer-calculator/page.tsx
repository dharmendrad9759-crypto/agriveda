"use client";

import { useMemo, useState } from "react";
import Agriveda2Shell from "@/components/agriveda2/Agriveda2Shell";
import GlassCard from "@/components/ui/GlassCard";
import { FERTILIZER_SLUGS } from "@/data/agriveda2/crop-slug-map";
import { cropCatalog } from "@/data/crop-catalog";
import { buildFertilizerPlan } from "@/lib/agriveda2/fertilizerEngine";
import { FERTILIZER_SOURCES } from "@/data/agriveda2/fertilizer-data";

export default function FertilizerCalculatorPage() {
  const verified = cropCatalog.filter((c) =>
    (FERTILIZER_SLUGS as readonly string[]).includes(c.slug)
  );
  const [slug, setSlug] = useState(verified[0]?.slug ?? "wheat");
  const [acres, setAcres] = useState("1");

  const plan = useMemo(() => {
    const a = parseFloat(acres);
    if (!a || a <= 0) return null;
    return buildFertilizerPlan(slug, a);
  }, [slug, acres]);

  return (
    <Agriveda2Shell
      title="खाद कैलकुलेटर"
      subtitle="N, P, K, Ca, Mg, S, Zn, Fe, B — ICAR verified"
      backHref="/dashboard"
    >
      <GlassCard className="space-y-4 p-4">
        <select
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="theme-input w-full rounded-xl border px-3 py-2.5 text-sm"
        >
          {verified.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.emoji} {c.name}
            </option>
          ))}
        </select>
        <div>
          <label className="text-xs font-bold theme-text-muted">Acres</label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={acres}
            onChange={(e) => setAcres(e.target.value)}
            className="theme-input mt-1 w-full rounded-xl border px-3 py-2 text-sm"
          />
        </div>

        {plan && (
          <>
            <p className="rounded-lg bg-emerald-500/10 p-2 text-[10px] theme-text-muted">
              {plan.unitNote}
            </p>

            <div>
              <p className="text-xs font-extrabold theme-text-primary">
                🌱 Poshan — {plan.cropKey} ({plan.acres} acre)
              </p>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b theme-text-muted">
                      <th className="py-1 pr-2">Nutrient</th>
                      <th className="py-1">Detail (per acre basis)</th>
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
          </>
        )}
      </GlassCard>
    </Agriveda2Shell>
  );
}
