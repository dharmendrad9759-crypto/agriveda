"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Droplets, ShieldCheck, Sparkles, FlaskConical, Sprout } from "lucide-react";
import { deficiencies } from "@/data/deficiencies";
import NutrientCard from "@/components/deficiency/NutrientCard";
import StatsCard from "@/components/deficiency/StatsCard";
import SearchBar from "@/components/deficiency/SearchBar";

export default function DeficienciesPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return deficiencies;
    return deficiencies.filter((item) =>
      [item.name, item.symbol, item.role, item.summary, item.mobility].some((value) =>
        value.toLowerCase().includes(q)
      )
    );
  }, [query]);

  const mobileCount = deficiencies.filter((item) => item.mobility.toLowerCase() === "mobile").length;
  const cropGuideCount = new Set(deficiencies.flatMap((item) => item.cropSpecificData.map((guide) => guide.cropName))).size;

  const stats = [
    { label: "Total nutrients", value: deficiencies.length.toString(), icon: <Leaf className="h-5 w-5" />, accent: "text-emerald-300" },
    { label: "Essential elements", value: deficiencies.length.toString(), icon: <FlaskConical className="h-5 w-5" />, accent: "text-cyan-300" },
    { label: "Mobile nutrients", value: mobileCount.toString(), icon: <Droplets className="h-5 w-5" />, accent: "text-sky-300" },
    { label: "Crop guides", value: `${cropGuideCount}+`, icon: <ShieldCheck className="h-5 w-5" />, accent: "text-violet-300" },
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.15),_transparent_30%),linear-gradient(135deg,_#020617,_#0f172a_55%,_#020617)] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-[36px] border border-emerald-400/20 bg-slate-900/70 p-6 shadow-[0_20px_90px_rgba(16,185,129,0.18)] backdrop-blur-2xl sm:p-8 lg:p-10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(34,197,94,0.2),_transparent_22%),radial-gradient(circle_at_80%_0%,_rgba(56,189,248,0.18),_transparent_20%)]" />
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-200">
                <Sparkles className="h-3.5 w-3.5" />
                AGRIVEDA NUTRITION ENGINE
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Plant Nutrient Deficiencies
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Diagnose crop stress with premium agronomic intelligence, precise symptom mapping, and field-ready corrective guidance.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">Scientific insights</span>
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">Crop-specific guidance</span>
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">Actionable recovery plans</span>
              </div>
            </div>

            <div className="w-full rounded-[24px] border border-white/10 bg-black/25 p-4 shadow-inner lg:max-w-md">
              <SearchBar query={query} onChange={setQuery} />
            </div>
          </div>
        </motion.section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatsCard key={stat.label} {...stat} />
          ))}
        </section>

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[28px] border border-dashed border-emerald-400/30 bg-slate-900/70 p-10 text-center shadow-[0_10px_45px_rgba(0,0,0,0.25)] backdrop-blur-xl"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/10 text-emerald-300">
              <Sprout className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-white">No matching nutrient found</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Try another term like nitrogen, potassium, magnesium, or a crop name to refine the search.
            </p>
          </motion.div>
        ) : (
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((nutrient, index) => (
              <motion.div
                key={nutrient.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
              >
                <NutrientCard nutrient={nutrient} />
              </motion.div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
