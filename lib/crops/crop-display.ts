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
  chana: "चना",
  masoor: "मसूर",
  urad: "उड़द",
  ginger: "अदरक",
  garlic: "लहसुन",
  mango: "आम",
  banana: "केला",
  grapes: "अंगूर",
  capsicum: "शिमला मिर्च",
};

export type SeasonTag = "Kharif" | "Rabi" | "Summer" | "All Season";

export function getCropHindiName(slug: string, fallback?: string): string | undefined {
  return (
    HINDI_NAMES[slug] ??
    cropCatalog.find((c) => c.slug === slug)?.nameHi ??
    fallback
  );
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

/** English + Hindi season tokens (catalog uses खरीफ / रबी / जायद). */
function seasonFlags(season: string): {
  kharif: boolean;
  rabi: boolean;
  zaid: boolean;
  all: boolean;
} {
  const s = season.toLowerCase();
  return {
    kharif: /kharif|खरीफ|खर[ीि]फ/.test(s),
    rabi: /rabi|रबी|रवि/.test(s),
    zaid: /zaid|jayad|जायद|summer|spring|वसंत|गर्मी/.test(s),
    all: /all\s*season|year[\s-]*round|throughout|साल\s*भर|वर्ष\s*भर|सभी\s*मौसम/.test(s),
  };
}

export function parseSeasonTag(season: string): SeasonTag {
  const f = seasonFlags(season);
  if (f.all) return "All Season";
  // Multi-season catalog string → pick primary for badge; listing uses getPlannerSeasonsForCrop
  if (f.kharif && !f.rabi && !f.zaid) return "Kharif";
  if (f.rabi && !f.kharif && !f.zaid) return "Rabi";
  if (f.zaid && !f.kharif && !f.rabi) return "Summer";
  if (f.kharif) return "Kharif";
  if (f.rabi) return "Rabi";
  if (f.zaid) return "Summer";
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

  const f = seasonFlags(suitableSeason);
  if (f.all) return ["kharif", "rabi", "zaid"];

  const out: PlannerSeasonId[] = [];
  if (f.kharif) out.push("kharif");
  if (f.rabi) out.push("rabi");
  if (f.zaid) out.push("zaid");

  if (!out.length) {
    // Unknown string — do NOT unlock all three; prefer calendar default kharif
    return ["kharif"];
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
const SPICE_SLUGS = new Set(["chilli", "mustard", "ginger", "garlic"]);
const FODDER_SLUGS = new Set(["bajra", "maize"]);
const PULSE_SLUGS = new Set(["pulses", "moong", "chana", "masoor", "urad", "soybean"]);

export function matchesListingCategory(crop: Crop, category: CropListingCategory): boolean {
  if (category === "All") return true;
  if (category === "Oilseeds") return OILSEED_SLUGS.has(crop.slug);
  if (category === "Fruits") return FRUIT_SLUGS.has(crop.slug);
  if (category === "Spices") return SPICE_SLUGS.has(crop.slug);
  if (category === "Fodder") return FODDER_SLUGS.has(crop.slug);
  if (category === "Pulses") return PULSE_SLUGS.has(crop.slug) || crop.category === "Pulses";
  if (category === "Cash Crops") return crop.category === "Cash-Crops";
  if (category === "Millets") return crop.category === "Millets";
  return crop.category === category;
}

export function matchesSeasonFilter(crop: Crop, season: "All Seasons" | SeasonTag): boolean {
  if (season === "All Seasons") return true;
  const allowed = getPlannerSeasonsForCrop(crop.slug, crop.suitableSeason);
  if (season === "Kharif") return allowed.includes("kharif");
  if (season === "Rabi") return allowed.includes("rabi");
  if (season === "Summer") return allowed.includes("zaid");
  return true;
}
