import { cropsData } from "@/data/crops";
import { deficiencies } from "@/data/deficiencies";
import { getCropPestDisease, pestDiseaseCropList } from "@/data/pest-disease";
import { toFarmerNutrientView } from "@/lib/nutrients/farmerNutrientView";
import { cropTabHref } from "@/lib/crops/crop-tabs";

export type SearchResultType =
  | "crop"
  | "nutrient"
  | "pest"
  | "disease"
  | "weed"
  | "tool"
  | "page";

export interface GlobalSearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  href: string;
  badge?: string;
}

const TOOLS: GlobalSearchResult[] = [
  { id: "ai-doctor", type: "tool", title: "AI Crop Doctor", subtitle: "Photo diagnosis", href: "/ai-doctor", badge: "AI" },
  { id: "kisan-saathi", type: "tool", title: "Kisan Saathi", subtitle: "24/7 AI chat", href: "/kisan-saathi", badge: "AI" },
  { id: "fertilizer-calc", type: "tool", title: "Fertilizer Calculator", subtitle: "NPK dose by crop", href: "/services/fertilizer-calculator" },
  { id: "seed-calc", type: "tool", title: "Seed Calculator", subtitle: "Seed rate by area", href: "/services/seed-calculator" },
  { id: "spray-advisory", type: "tool", title: "Spray Advisory", subtitle: "Weather spray window", href: "/weather/spray-advisory" },
  { id: "mandi", type: "page", title: "Mandi Prices", subtitle: "Live market rates", href: "/mandi" },
  { id: "weather", type: "page", title: "Weather", subtitle: "Forecast & radar", href: "/weather" },
  { id: "alerts", type: "page", title: "Farm Alerts", subtitle: "Predictive warnings", href: "/alerts" },
  { id: "spray-rotation", type: "tool", title: "Spray Rotation", subtitle: "IRAC/FRAC tracker", href: "/spray-rotation" },
  { id: "deficiencies", type: "page", title: "Nutrient Deficiency", subtitle: "All nutrients guide", href: "/deficiencies" },
  { id: "pest-solver", type: "tool", title: "Pest Solver", subtitle: "Symptom-based ID", href: "/pest-solver" },
];

const TYPE_LABEL: Record<SearchResultType, string> = {
  crop: "Crop",
  nutrient: "Nutrient",
  pest: "Pest",
  disease: "Disease",
  weed: "Weed",
  tool: "Tool",
  page: "Page",
};

export function searchTypeLabel(type: SearchResultType) {
  return TYPE_LABEL[type];
}

function matches(query: string, ...parts: (string | undefined)[]) {
  const q = query.toLowerCase();
  return parts.some((p) => p?.toLowerCase().includes(q));
}

export function globalSearch(query: string): GlobalSearchResult[] {
  const q = query.trim();
  if (!q) {
    return [
      ...cropsData.slice(0, 6).map((c) => ({
        id: `crop-${c.slug}`,
        type: "crop" as const,
        title: c.name,
        subtitle: c.scientificName,
        href: `/crops/${c.slug}`,
        badge: c.category,
      })),
      ...TOOLS.slice(0, 4),
    ];
  }

  const results: GlobalSearchResult[] = [];

  for (const crop of cropsData) {
    if (matches(q, crop.name, crop.scientificName, crop.overview, crop.category, crop.slug)) {
      results.push({
        id: `crop-${crop.slug}`,
        type: "crop",
        title: crop.name,
        subtitle: crop.scientificName,
        href: `/crops/${crop.slug}`,
        badge: crop.category,
      });
    }
  }

  for (const n of deficiencies) {
    const view = toFarmerNutrientView(n);
    if (matches(q, view.nameHi, view.nameEn, view.symbol, n.slug)) {
      results.push({
        id: `nutrient-${n.slug}`,
        type: "nutrient",
        title: view.nameHi,
        subtitle: view.oneLiner,
        href: `/deficiencies/${n.slug}`,
        badge: view.symbol,
      });
    }
  }

  for (const cropEntry of pestDiseaseCropList) {
    const cropSlug = cropEntry.slug;
    const pd = getCropPestDisease(cropSlug);
    for (const pest of pd.pests ?? []) {
      if (matches(q, pest.name, pest.scientificName, cropEntry.name)) {
        results.push({
          id: `pest-${cropSlug}-${pest.id}`,
          type: "pest",
          title: pest.name,
          subtitle: `${cropEntry.name} · Pest`,
          href: `/pest-diseases/${cropSlug}/pest/${pest.id}`,
        });
      }
    }
    for (const disease of pd.diseases ?? []) {
      if (matches(q, disease.name, disease.pathogen, cropEntry.name)) {
        results.push({
          id: `disease-${cropSlug}-${disease.id}`,
          type: "disease",
          title: disease.name,
          subtitle: `${cropEntry.name} · Disease`,
          href: `/pest-diseases/${cropSlug}/disease/${disease.id}`,
        });
      }
    }
    for (const weed of pd.weeds ?? []) {
      if (matches(q, weed.name, weed.scientificName, cropEntry.name)) {
        results.push({
          id: `weed-${cropSlug}-${weed.id}`,
          type: "weed",
          title: weed.name,
          subtitle: `${cropEntry.name} · Weed`,
          href: `/pest-diseases/${cropSlug}/weed/${weed.id}`,
        });
      }
    }
    if (matches(q, cropEntry.name, cropSlug)) {
      results.push({
        id: `crop-pests-${cropSlug}`,
        type: "crop",
        title: `${cropEntry.name} — Pests`,
        subtitle: "Crop protection guide",
        href: cropTabHref(cropSlug, "pests"),
      });
    }
  }

  for (const tool of TOOLS) {
    if (matches(q, tool.title, tool.subtitle)) {
      results.push(tool);
    }
  }

  const seen = new Set<string>();
  return results.filter((r) => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  }).slice(0, 40);
}
