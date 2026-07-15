"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Agriveda2Shell from "@/components/agriveda2/Agriveda2Shell";
import DarkCard from "@/components/shell/DarkCard";
import { cropCatalog } from "@/data/crop-catalog";
import { buildFertilizerPlan, listFertilizerCrops } from "@/lib/agriveda2/fertilizerEngine";
import { FERTILIZER_SOURCES } from "@/data/agriveda2/fertilizer-data";
import { convertToAcres, type AreaUnit } from "@/lib/agriveda2/seedCalculatorEngine";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { getBighaInfo } from "@/lib/bighaConversion";
import { EASE_OUT, staggerContainer, staggerItem } from "@/lib/motion/variants";

const UNIT_LABELS: Record<AreaUnit, string> = {
  acre: "एकड़ (Acre)",
  bigha: "बीघा (Bigha)",
  hectare: "हेक्टेयर (Hectare)",
};

const NUTRIENT_COLORS: Record<string, string> = {
  N: "from-lime-400 to-green-500",
  P: "from-amber-400 to-orange-500",
  K: "from-violet-400 to-purple-500",
  Ca: "from-sky-400 to-blue-500",
  Mg: "from-teal-400 to-cyan-500",
  S: "from-yellow-400 to-amber-500",
  Zn: "from-rose-400 to-pink-500",
  Fe: "from-red-400 to-rose-500",
  B: "from-indigo-400 to-violet-500",
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
      <DarkCard className="space-y-4 p-4">
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
          <motion.p
            key={selected.slug}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-800"
          >
            {selected.emoji} {selected.name} — niche poora poshan schedule
          </motion.p>
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

        {plan ? (
          <motion.div
            key={`${slug}-${acres}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="space-y-4"
          >
              <p className="rounded-lg bg-emerald-500/10 p-2 text-[10px] theme-text-muted">
                {plan.unitNote}
                {plan.source === "guide" && " · Crop guide estimate — adjust with soil test"}
              </p>

              <div>
                <p className="text-xs font-extrabold theme-text-primary">
                  🌱 Poshan — {plan.cropKey} ({area} {unit} ≈ {plan.acres} acre)
                </p>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  className="mt-3 space-y-2"
                >
                  {plan.nutrients.map((row) => {
                    const key = row.nutrient.replace(/[^A-Za-z]/g, "").slice(0, 2);
                    const grad = NUTRIENT_COLORS[key] ?? "from-emerald-400 to-teal-500";
                    const kgMatch = row.detail.match(/([\d.]+)\s*kg/i);
                    const pct = kgMatch
                      ? Math.min(100, Math.max(12, Math.round((Number(kgMatch[1]) / 80) * 100)))
                      : 35;
                    return (
                      <motion.div
                        key={row.nutrient}
                        variants={staggerItem}
                        className="rounded-xl border border-gray-200/80 bg-white/60 p-3 dark:border-white/10 dark:bg-black/20"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-black theme-text-primary">{row.nutrient}</span>
                          <span className="text-[11px] font-semibold theme-text-muted">{row.detail}</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200/80 dark:bg-white/10">
                          <motion.div
                            className={`h-full rounded-full bg-gradient-to-r ${grad}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.05 }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {plan.bags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 to-teal-500/10 p-3 text-sm shadow-sm"
                >
                  <p className="font-extrabold text-emerald-800">Total bags ({plan.acres} acre)</p>
                  <ul className="mt-2 space-y-1 text-xs">
                    {plan.bags.map((b, i) => (
                      <motion.li
                        key={b.name}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                      >
                        → {b.name}: <strong>{b.amount}</strong>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {plan.schedule.length > 0 && (
                <div>
                  <p className="text-xs font-bold theme-text-primary">Schedule</p>
                  <motion.ul
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="mt-2 space-y-2 text-xs theme-text-muted"
                  >
                    {plan.schedule.map((s) => (
                      <motion.li
                        key={s.time}
                        variants={staggerItem}
                        whileHover={{ scale: 1.01 }}
                        className="rounded-lg border border-gray-200 bg-gradient-to-r from-white to-emerald-50/50 p-2.5 dark:border-white/10 dark:from-black/20 dark:to-emerald-950/20"
                      >
                        <p className="font-bold theme-text-primary">{s.time}</p>
                        <p>{s.apply}</p>
                      </motion.li>
                    ))}
                  </motion.ul>
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
          </motion.div>
        ) : (
          <p className="text-center text-sm theme-text-muted">
            Area daalein — khad plan yahan aayega
          </p>
        )}
      </DarkCard>
    </Agriveda2Shell>
  );
}
