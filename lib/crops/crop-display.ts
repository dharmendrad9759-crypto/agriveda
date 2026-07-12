import { cropCatalog } from "@/data/crop-catalog";
import type { Crop } from "@/types/crop";

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
  mustard: "सरसों",
  moong: "मूंग",
  pulses: "अरहर",
  mango: "आम",
  banana: "केला",
  grapes: "अंगूर",
  capsicum: "शिमला मिर्च",
};

const CROP_IMAGES: Record<string, string> = {
  paddy: "https://images.unsplash.com/photo-1536304575081-ff8c827fd69f?w=480&h=360&fit=crop&q=80",
  wheat: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=480&h=360&fit=crop&q=80",
  maize: "https://images.unsplash.com/photo-1551754655-cd27f13c3a88?w=480&h=360&fit=crop&q=80",
  bajra: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=480&h=360&fit=crop&q=80",
  tomato: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=480&h=360&fit=crop&q=80",
  potato: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=480&h=360&fit=crop&q=80",
  onion: "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=480&h=360&fit=crop&q=80",
  chilli: "https://images.unsplash.com/photo-1592840067980-057d97d26f4a?w=480&h=360&fit=crop&q=80",
  cauliflower: "https://images.unsplash.com/photo-1568584711073-3d021d499b1e?w=480&h=360&fit=crop&q=80",
  cucumber: "https://images.unsplash.com/photo-1604977049386-4b1a0d0e0c0e?w=480&h=360&fit=crop&q=80",
  brinjal: "https://images.unsplash.com/photo-1622206152918-f835a4b700b4?w=480&h=360&fit=crop&q=80",
  bhindi: "https://images.unsplash.com/photo-1592921453113-2fdceb6e3c9f?w=480&h=360&fit=crop&q=80",
  cotton: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=480&h=360&fit=crop&q=80",
  sugarcane: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=480&h=360&fit=crop&q=80",
  soybean: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=480&h=360&fit=crop&q=80",
  moongfali: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=480&h=360&fit=crop&q=80",
  mustard: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=480&h=360&fit=crop&q=80",
  moong: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=480&h=360&fit=crop&q=80",
  pulses: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=480&h=360&fit=crop&q=80",
};

export type SeasonTag = "Kharif" | "Rabi" | "Summer" | "All Season";

export function getCropHindiName(slug: string, fallback?: string): string | undefined {
  return HINDI_NAMES[slug] ?? fallback;
}

export function getCropEmoji(slug: string): string {
  return EMOJI_BY_SLUG[slug] ?? "🌱";
}

export function getCropImageUrl(crop: Pick<Crop, "slug" | "image">): string {
  const img = crop.image?.trim();
  // Local /images/*.png paths are placeholders — use Unsplash fallbacks until assets are added.
  if (img && !img.startsWith("/images/")) return img;
  return CROP_IMAGES[crop.slug] ?? CROP_IMAGES.paddy;
}

export function parseSeasonTag(season: string): SeasonTag {
  const s = season.toLowerCase();
  if (s.includes("kharif") && s.includes("rabi")) return "Kharif";
  if (s.includes("kharif")) return "Kharif";
  if (s.includes("rabi")) return "Rabi";
  if (s.includes("summer") || s.includes("spring") || s.includes("zaid")) return "Summer";
  return "All Season";
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
