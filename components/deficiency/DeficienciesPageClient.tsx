"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { BookOpen, ChevronDown, FlaskConical, Leaf, Sparkles } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import DarkCard from "@/components/shell/DarkCard";
import { crops } from "@/data/crops";
import { getCropManagementProfile } from "@/data/crop-management";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { AV } from "@/lib/design/tokens";
import type { NutrientDeficiency } from "@/types/crop-management";

const NUTRIENT_FILTERS = [
  { id: "all", label: "All" },
  { id: "N", label: "N" },
  { id: "P", label: "P" },
  { id: "K", label: "K" },
  { id: "S", label: "S" },
  { id: "Zn", label: "Zn" },
  { id: "Fe", label: "Fe" },
  { id: "Mn", label: "Mn" },
  { id: "Cu", label: "Cu" },
  { id: "B", label: "B" },
  { id: "Mo", label: "Mo" },
] as const;

const NUTRIENT_IMAGES: Record<string, string> = {
  nitrogen: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=280&fit=crop",
  phosphorus: "https://images.unsplash.com/photo-1466692476867-aef1dfb1e735?w=400&h=280&fit=crop",
  potassium: "https://images.unsplash.com/photo-1592155931584-901ac15363c7?w=400&h=280&fit=crop",
  zinc: "https://images.unsplash.com/photo-1592840067980-057d97d26f4a?w=400&h=280&fit=crop",
  iron: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&h=280&fit=crop",
  default: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=280&fit=crop",
};

const BALANCED_TABLE = [
  { nutrient: "N (Nitrogen)", basal: "20 kg", topDress: "40 kg (2 splits)", foliar: "Urea 2%" },
  { nutrient: "P₂O₅ (Phosphorus)", basal: "25 kg", topDress: "—", foliar: "DAP foliar" },
  { nutrient: "K₂O (Potassium)", basal: "20 kg", topDress: "20 kg", foliar: "MOP foliar" },
  { nutrient: "S (Sulphur)", basal: "10 kg", topDress: "—", foliar: "Gypsum spray" },
  { nutrient: "Zn (Zinc)", basal: "5 kg", topDress: "—", foliar: "ZnSO₄ 0.5%" },
  { nutrient: "Fe (Iron)", basal: "—", topDress: "—", foliar: "FeSO₄ + citric acid" },
  { nutrient: "B (Boron)", basal: "—", topDress: "—", foliar: "Borax 0.2%" },
];

const TIPS = [
  "Soil test every 2–3 years before applying micronutrients",
  "Split nitrogen doses — never apply all at once",
  "Foliar spray during active growth for quick correction",
  "Follow 4R principle: Right source, dose, time, place",
  "Avoid fertilizer during heavy rainfall",
];

function nutrientSymbol(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("nitrogen") || n.startsWith("n ")) return "N";
  if (n.includes("phosph")) return "P";
  if (n.includes("potassium") || n.includes("potash")) return "K";
  if (n.includes("sulphur") || n.includes("sulfur")) return "S";
  if (n.includes("zinc")) return "Zn";
  if (n.includes("iron")) return "Fe";
  if (n.includes("manganese")) return "Mn";
  if (n.includes("copper")) return "Cu";
  if (n.includes("boron")) return "B";
  if (n.includes("molybdenum")) return "Mo";
  return name.slice(0, 2);
}

function nutrientImage(name: string): string {
  const key = name.toLowerCase().split(" ")[0];
  return NUTRIENT_IMAGES[key] ?? NUTRIENT_IMAGES.default;
}

function slugForNutrient(name: string): string {
  const map: Record<string, string> = {
    N: "nitrogen",
    P: "phosphorus",
    K: "potassium",
    S: "sulphur",
    Zn: "zinc",
    Fe: "iron",
    Mn: "manganese",
    Cu: "copper",
    B: "boron",
    Mo: "molybdenum",
  };
  const sym = nutrientSymbol(name);
  return map[sym] ?? name.toLowerCase().replace(/\s+/g, "-");
}

const FALLBACK_DEFICIENCIES: NutrientDeficiency[] = [
  {
    name: "Nitrogen",
    role: "Essential for vegetative growth",
    deficiencySymptoms: ["Older leaves turn light green to yellow", "Stunted plant growth", "Reduced tillering"],
    excessSymptoms: [],
    management: ["Apply Urea @ 40–60 kg/acre in split doses"],
    recommendedFertilizers: ["Urea 2% foliar spray", "Split top-dress at tillering"],
  },
  {
    name: "Phosphorus",
    role: "Root and flower development",
    deficiencySymptoms: ["Purple tint on older leaves", "Poor root development", "Delayed maturity"],
    excessSymptoms: [],
    management: ["Apply DAP @ 50 kg/acre at basal"],
    recommendedFertilizers: ["DAP basal application", "SSP where available"],
  },
  {
    name: "Potassium",
    role: "Grain filling and stem strength",
    deficiencySymptoms: ["Brown leaf margins", "Lodging", "Poor grain filling"],
    excessSymptoms: [],
    management: ["Apply MOP @ 20 kg/acre at panicle initiation"],
    recommendedFertilizers: ["MOP split application", "Potassium nitrate foliar"],
  },
  {
    name: "Zinc",
    role: "Enzyme activation and tillering",
    deficiencySymptoms: ["Khaira disease — dusty brown spots", "Stunted tillers", "Bronze patches"],
    excessSymptoms: [],
    management: ["ZnSO₄ @ 5 kg/acre or 0.5% foliar"],
    recommendedFertilizers: ["Zinc sulphate soil/foliar", "Apply at tillering"],
  },
];

export default function DeficienciesPageClient() {
  const [cropSlug, setCropSlug] = useState("paddy");
  const [filter, setFilter] = useState<(typeof NUTRIENT_FILTERS)[number]["id"]>("all");
  const [showAll, setShowAll] = useState(false);

  const crop = crops.find((c) => c.slug === cropSlug) ?? crops[0];
  const hindi = getCropHindiName(crop.slug);
  const profile = getCropManagementProfile(crop.slug);

  const deficiencies = useMemo(() => {
    const fromProfile = profile?.nutrientDeficiencies ?? [];
    return fromProfile.length > 0 ? fromProfile : FALLBACK_DEFICIENCIES;
  }, [profile]);

  const filtered = useMemo(() => {
    if (filter === "all") return deficiencies;
    return deficiencies.filter((d) => nutrientSymbol(d.name) === filter);
  }, [deficiencies, filter]);

  const visible = showAll ? filtered : filtered.slice(0, 8);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs font-bold text-[var(--av-text-secondary)]">Select Crop</label>
          <select
            value={cropSlug}
            onChange={(e) => setCropSlug(e.target.value)}
            className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2.5 text-sm font-semibold text-[var(--av-text-primary)] outline-none focus:border-[var(--av-accent)]"
          >
            {crops.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
                {getCropHindiName(c.slug) ? ` (${getCropHindiName(c.slug)})` : ""}
              </option>
            ))}
          </select>
        </div>
        <AppLink
          href="/library"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--av-border)] px-4 py-2 text-xs font-bold text-[var(--av-accent)]"
        >
          <BookOpen className="h-4 w-4" />
          Nutrient Guide
        </AppLink>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/10">
        <Leaf className="mt-0.5 h-5 w-5 shrink-0 text-[var(--av-accent)]" />
        <p className="text-sm text-[var(--av-text-secondary)]">
          Balanced nutrition is the key to healthy plants and higher yield.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {NUTRIENT_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
              filter === f.id
                ? "bg-[var(--av-accent)] text-white shadow-sm"
                : "border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-muted)] hover:border-[var(--av-accent)]/40"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-bold text-[var(--av-text-primary)]">
          Nutrient Deficiencies in {crop.name}
          {hindi ? ` (${hindi})` : ""}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {visible.map((d, i) => {
            const sym = nutrientSymbol(d.name);
            const fix = d.management[0] ?? d.recommendedFertilizers[0] ?? "—";
            const foliar = d.recommendedFertilizers.find((r) => /foliar|spray|%/i.test(r)) ?? "As per soil test";
            return (
              <DarkCard key={d.name} hover delay={i % 4} className="flex flex-col overflow-hidden !p-0">
                <div className="relative h-32 w-full">
                  <Image src={nutrientImage(d.name)} alt={d.name} fill className="object-cover" sizes="280px" />
                  <span className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--av-accent)] text-xs font-bold text-white shadow">
                    {sym}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <h3 className="text-sm font-bold text-[var(--av-text-primary)]">{d.name} Deficiency</h3>
                  <p className="mt-1 line-clamp-2 text-[11px] text-[var(--av-text-muted)]">
                    {d.deficiencySymptoms[0] ?? d.role}
                  </p>
                  <div className="mt-2 space-y-1 text-[10px]">
                    <p>
                      <span className="font-bold text-[var(--av-accent)]">How to fix:</span>{" "}
                      <span className="text-[var(--av-text-secondary)]">{fix}</span>
                    </p>
                    <p>
                      <span className="font-bold text-sky-600">Foliar Spray:</span>{" "}
                      <span className="text-[var(--av-text-secondary)]">{foliar}</span>
                    </p>
                  </div>
                  <AppLink
                    href={`/deficiencies/${slugForNutrient(d.name)}`}
                    className={`mt-3 inline-flex w-full justify-center rounded-lg border border-[var(--av-accent)] py-2 text-xs font-bold text-[var(--av-accent)] transition hover:bg-[var(--av-accent-soft)]`}
                  >
                    View Details
                  </AppLink>
                </div>
              </DarkCard>
            );
          })}
        </div>
        {filtered.length > 8 && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl border border-[var(--av-border)] py-2.5 text-xs font-bold text-[var(--av-accent)]"
          >
            {showAll ? "Show Less" : "View All Nutrients"}
            <ChevronDown className={`h-4 w-4 transition ${showAll ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <DarkCard className="xl:col-span-7" hover>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">
            Balanced Nutrition for {crop.name} (Per Acre)
          </h3>
          <div className="mt-3 overflow-x-auto">
            <table className="av-table min-w-[520px]">
              <thead>
                <tr>
                  <th>Nutrient</th>
                  <th>Basal Dose</th>
                  <th>Top Dressing</th>
                  <th>Foliar Spray</th>
                </tr>
              </thead>
              <tbody>
                {BALANCED_TABLE.map((row) => (
                  <tr key={row.nutrient}>
                    <td className="font-semibold text-[var(--av-text-primary)]">{row.nutrient}</td>
                    <td>{row.basal}</td>
                    <td>{row.topDress}</td>
                    <td>{row.foliar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={`mt-2 ${AV.micro}`}>
            Note: Doses may vary based on soil test report and crop stage.
          </p>
        </DarkCard>

        <div className="space-y-4 xl:col-span-5">
          <DarkCard hover>
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Important Tips</h3>
            <ul className="mt-3 space-y-2">
              {TIPS.map((tip) => (
                <li key={tip} className="flex gap-2 text-xs text-[var(--av-text-secondary)]">
                  <FlaskConical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--av-accent)]" />
                  {tip}
                </li>
              ))}
            </ul>
          </DarkCard>

          <DarkCard className="border-[var(--av-accent)]/30 bg-[var(--av-accent-soft)]/40" hover>
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Need Personalized Nutrient Plan?</h3>
            <p className={`mt-1 ${AV.micro}`}>AI Doctor se crop-wise nutrient schedule aur foliar spray plan lein.</p>
            <AppLink href="/ai-doctor" className={`mt-3 inline-flex gap-2 ${AV.btnPrimary}`}>
              <Sparkles className="h-4 w-4" />
              Get AI Recommendation
            </AppLink>
          </DarkCard>
        </div>
      </div>
    </div>
  );
}
