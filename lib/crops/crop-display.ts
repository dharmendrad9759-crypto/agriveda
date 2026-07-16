import { cropCatalog } from "@/data/crop-catalog";
import type { Crop } from "@/types/crop";
import { resolveCropImage } from "@/lib/crops/cropImages";

const EMOJI_BY_SLUG = Object.fromEntries(cropCatalog.map((c) => [c.slug, c.emoji]));

const HINDI_NAMES: Record<string, string> = {
  paddy: "धान",
  wheat: "गेहूँ",
  maize: "मक्का",
  bajra: "बाजरा",
  tomato: "टमाटर",
  potato: "आलू",
  onion: "प्याज",
  chilli: "मिर्च",
  cauliflower: "फूलगोभी",
  cucumber: "खीरा",
  brinjal: "बैंगन",
  bhindi: "भिंडी",
  cotton: "कपास",
  sugarcane: "गन्ना",
  soybean: "सोयाबीन",
  moongfali: "मूंगफली",
  groundnut: "मूंगफली",
  mustard: "सरसों",
  moong: "मूंग",
  pulses: "अरहर",
  mango: "आम",
  banana: "केला",
  grapes: "अंगूर",
  capsicum: "शिमला मिर्च",
};

export type SeasonTag = "Kharif" | "Rabi" | "Summer" | "All Season";

export function getCropHindiName(slug: string, fallback?: string): string | undefined {
  return HINDI_NAMES[slug] ?? fallback;
}

export function getCropEmoji(slug: string): string {
  return EMOJI_BY_SLUG[slug] ?? "🌱";
}

/** Card / list / hero image — local curated photo when available. */
export function getCropImageUrl(crop: Pick<Crop, "slug" | "image" | "name">): string {
  return resolveCropImage({
    slug: crop.slug,
    name: crop.name,
    image: crop.image,
  });
}

export function parseSeasonTag(season: string): SeasonTag {
  const s = season.toLowerCase();
  if (s.includes("kharif") && s.includes("rabi")) return "Kharif";
  if (s.includes("kharif")) return "Kharif";
  if (s.includes("rabi")) return "Rabi";
  if (s.includes("summer") || s.includes("spring") || s.includes("zaid")) return "Summer";
  return "All Season";
}

export type PlannerSeasonId = "kharif" | "rabi" | "zaid";

/** Crops known to grow in multiple planner seasons (override thin catalog strings). */
const PLANNER_SEASON_OVERRIDES: Partial<Record<string, PlannerSeasonId[]>> = {
  maize: ["kharif", "rabi", "zaid"],
  tomato: ["rabi", "zaid", "kharif"],
  chilli: ["rabi", "zaid", "kharif"],
  brinjal: ["kharif", "zaid", "rabi"],
  cucumber: ["zaid", "kharif"],
  bhindi: ["kharif", "zaid"],
  moong: ["zaid", "kharif"],
  sugarcane: ["zaid", "kharif"],
};

/**
 * Which planner seasons a crop can use.
 * Single-season crops → one id (auto-select).
 * Multi-season → several ids (farmer picks among these only).
 */
export function getPlannerSeasonsForCrop(
  slug: string,
  suitableSeason: string
): PlannerSeasonId[] {
  const override = PLANNER_SEASON_OVERRIDES[slug];
  if (override?.length) return override;

  const s = suitableSeason.toLowerCase();
  const out: PlannerSeasonId[] = [];
  if (/kharif/.test(s)) out.push("kharif");
  if (/rabi/.test(s)) out.push("rabi");
  if (/zaid|summer|spring/.test(s)) out.push("zaid");
  if (/all\s*season|year[\s-]*round|throughout/.test(s)) {
    return ["kharif", "rabi", "zaid"];
  }
  if (!out.length) {
    // Fallback from primary tag
    const tag = parseSeasonTag(suitableSeason);
    if (tag === "Kharif") return ["kharif"];
    if (tag === "Rabi") return ["rabi"];
    if (tag === "Summer") return ["zaid"];
    return ["kharif", "rabi", "zaid"];
  }
  return out;
}

/** Prefer current calendar season if crop supports it, else first allowed. */
export function pickDefaultPlannerSeason(
  allowed: PlannerSeasonId[],
  month = new Date().getMonth() + 1
): PlannerSeasonId {
  if (!allowed.length) return "kharif";
  const current: PlannerSeasonId =
    month >= 6 && month <= 10 ? "kharif" : month >= 11 || month <= 3 ? "rabi" : "zaid";
  if (allowed.includes(current)) return current;
  return allowed[0];
}

export function seasonBadgeClass(tag: SeasonTag): string {
  switch (tag) {
    case "Kharif":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "Rabi":
      return "bg-sky-100 text-sky-800 border-sky-200";
    case "Summer":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

export function formatCategoryLabel(category: Crop["category"]): string {
  return category === "Cash-Crops" ? "Cash Crop" : category.replace(/-/g, " ");
}

export const CROP_LISTING_CATEGORIES = [
  "All",
  "Cereals",
  "Pulses",
  "Oilseeds",
  "Vegetables",
  "Fruits",
  "Cash Crops",
  "Spices",
  "Fodder",
  "Millets",
] as const;

export type CropListingCategory = (typeof CROP_LISTING_CATEGORIES)[number];

const OILSEED_SLUGS = new Set(["soybean", "moongfali", "mustard"]);
const FRUIT_SLUGS = new Set(["mango", "banana", "grapes"]);
const SPICE_SLUGS = new Set(["chilli", "mustard"]);
const FODDER_SLUGS = new Set(["bajra", "maize"]);

export function matchesListingCategory(crop: Crop, category: CropListingCategory): boolean {
  if (category === "All") return true;
  if (category === "Oilseeds") return OILSEED_SLUGS.has(crop.slug);
  if (category === "Fruits") return FRUIT_SLUGS.has(crop.slug);
  if (category === "Spices") return SPICE_SLUGS.has(crop.slug);
  if (category === "Fodder") return FODDER_SLUGS.has(crop.slug);
  if (category === "Cash Crops") return crop.category === "Cash-Crops";
  if (category === "Millets") return crop.category === "Millets";
  return crop.category === category;
}

export function matchesSeasonFilter(crop: Crop, season: "All Seasons" | SeasonTag): boolean {
  if (season === "All Seasons") return true;
  const tag = parseSeasonTag(crop.suitableSeason);
  if (season === "Summer") return tag === "Summer" || crop.suitableSeason.toLowerCase().includes("spring");
  return tag === season;
}
