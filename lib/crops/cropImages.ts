/**
 * Canonical crop image map for Agriveda cards / heroes.
 * Local assets live in /public/images/crops/{slug}.png
 */

export const CROP_IMAGE_FALLBACK = "/images/crops/_placeholder.svg";

/** Slugs that have curated local photos (matched from farmer-provided assets). */
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
  return Boolean(LOCAL_CROP_PHOTOS[key]);
}

/**
 * Resolve display image for a crop.
 * Prefer curated local photo → valid remote/data image → clean placeholder.
 */
export function resolveCropImage(input: {
  slug: string;
  name?: string;
  image?: string | null;
}): string {
  const slug = normalizeCropSlug(input.slug || input.name || "");
  const local = LOCAL_CROP_PHOTOS[slug];
  if (local) return local;

  const img = input.image?.trim();
  if (img) {
    // Ignore stale placeholder template paths like /images/paddy.png (root)
    const isLegacyRootPlaceholder =
      /^\/images\/[a-z0-9-]+\.png$/i.test(img) && !img.startsWith("/images/crops/");
    const isUnsplash = img.includes("unsplash.com");
    // Prefer local map only; skip wrong/legacy unsplash for crops without local photos
    // Allow explicit https URLs that are not unsplash crop guesses
    if (!isLegacyRootPlaceholder && !isUnsplash && (img.startsWith("/") || img.startsWith("http"))) {
      return img;
    }
  }

  return CROP_IMAGE_FALLBACK;
}

/** All slugs with local photos (for tooling / audits). */
export function listedLocalCropSlugs(): string[] {
  return Object.keys(LOCAL_CROP_PHOTOS);
}
