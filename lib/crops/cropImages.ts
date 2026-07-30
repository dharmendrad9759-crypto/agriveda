/**
 * Canonical crop image map for Agriveda cards / heroes.
 * Prefer curated photorealistic photos (local + Unsplash), then placeholders.
 */

export const CROP_IMAGE_FALLBACK = "/images/crops/_placeholder.svg";

/** Local assets in /public/images/crops/{slug}.png */
const LOCAL_CROP_PHOTOS: Record<string, string> = {
  paddy: "/images/crops/paddy.png",
  wheat: "/images/crops/wheat.png",
  maize: "/images/crops/maize.png",
  bajra: "/images/crops/bajra.png",
  potato: "/images/crops/potato.png",
  tomato: "/images/crops/tomato.png",
  soybean: "/images/crops/soybean.png",
  moongfali: "/images/crops/moongfali.png",
  groundnut: "/images/crops/groundnut.png",
  cauliflower: "/images/crops/cauliflower.png",
  cucumber: "/images/crops/cucumber.png",
  sugarcane: "/images/crops/sugarcane.png",
};

/**
 * High-res photorealistic hero/card photos (Unsplash).
 * Used when local is missing, or for crops that need a stronger field look.
 */
const CURATED_REMOTE_PHOTOS: Record<string, string> = {
  // Keep locals as primary for existing assets; remotes fill gaps + weaker locals
  chilli:
    "https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=1200&h=800&fit=crop&q=80",
  onion:
    "https://images.unsplash.com/photo-1518977956812-cd3d41ea2511?w=1200&h=800&fit=crop&q=80",
  cotton:
    "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1200&h=800&fit=crop&q=80",
  brinjal:
    "https://images.unsplash.com/photo-1659262487336-8b1a1e0f0f5a?w=1200&h=800&fit=crop&q=80",
  mustard:
    "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=1200&h=800&fit=crop&q=80",
  moong:
    "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=1200&h=800&fit=crop&q=80",
  pulses:
    "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=1200&h=800&fit=crop&q=80",
  banana:
    "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=1200&h=800&fit=crop&q=80",
  mango:
    "https://images.unsplash.com/photo-1553279768-865429fa0078?w=1200&h=800&fit=crop&q=80",
  grapes:
    "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=1200&h=800&fit=crop&q=80",
  capsicum:
    "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=1200&h=800&fit=crop&q=80",
  bhindi:
    "https://images.unsplash.com/photo-1423483641154-5411ec9c0ddf?w=1200&h=800&fit=crop&q=80",
  // Stronger field heroes for key crops (override thin/local when present)
  tomato:
    "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=1200&h=800&fit=crop&q=80",
  wheat:
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&h=800&fit=crop&q=80",
  paddy:
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=800&fit=crop&q=80",
  maize:
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=800&fit=crop&q=80",
  potato:
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=1200&h=800&fit=crop&q=80",
  soybean:
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=800&fit=crop&q=80",
};

/** Name / alias → canonical slug */
const SLUG_ALIASES: Record<string, string> = {
  rice: "paddy",
  dhaan: "paddy",
  dhan: "paddy",
  gehu: "wheat",
  gehun: "wheat",
  makka: "maize",
  corn: "maize",
  "pearl-millet": "bajra",
  millet: "bajra",
  aloo: "potato",
  tamatar: "tomato",
  soya: "soybean",
  "soya-bean": "soybean",
  peanut: "moongfali",
  "ground-nut": "moongfali",
  mungfali: "moongfali",
  phoolgobhi: "cauliflower",
  gobhi: "cauliflower",
  khira: "cucumber",
  ganna: "sugarcane",
  mirch: "chilli",
  chili: "chilli",
  baingan: "brinjal",
  eggplant: "brinjal",
};

export function normalizeCropSlug(slugOrName: string): string {
  const raw = slugOrName.trim().toLowerCase().replace(/\s+/g, "-");
  return SLUG_ALIASES[raw] ?? raw;
}

export function hasLocalCropPhoto(slug: string): boolean {
  const key = normalizeCropSlug(slug);
  return Boolean(LOCAL_CROP_PHOTOS[key] || CURATED_REMOTE_PHOTOS[key]);
}

/**
 * Resolve display image for a crop.
 * Prefer curated photorealistic remote → local photo → valid remote/data image → placeholder.
 */
export function resolveCropImage(input: {
  slug: string;
  name?: string;
  image?: string | null;
}): string {
  const slug = normalizeCropSlug(input.slug || input.name || "");
  const curated = CURATED_REMOTE_PHOTOS[slug];
  if (curated) return curated;

  const local = LOCAL_CROP_PHOTOS[slug];
  if (local) return local;

  const img = input.image?.trim();
  if (img) {
    const isLegacyRootPlaceholder =
      /^\/images\/[a-z0-9-]+\.png$/i.test(img) && !img.startsWith("/images/crops/");
    const isUnsplash = img.includes("unsplash.com");
    if (!isLegacyRootPlaceholder && !isUnsplash && (img.startsWith("/") || img.startsWith("http"))) {
      return img;
    }
    if (isUnsplash) return img;
  }

  return CROP_IMAGE_FALLBACK;
}

/** All slugs with local photos (for tooling / audits). */
export function listedLocalCropSlugs(): string[] {
  return Object.keys(LOCAL_CROP_PHOTOS);
}
