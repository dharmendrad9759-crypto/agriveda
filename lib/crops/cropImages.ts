/**
 * Canonical crop image map for Agriveda cards / heroes.
 * Prefer curated local marketing photos, then remotes, then placeholders.
 */

export const CROP_IMAGE_FALLBACK = "/images/crops/_placeholder.svg";

/** Local marketing photos in /public/images/crops/{slug}.jpg (generated field shots). */
const LOCAL_CROP_PHOTOS: Record<string, string> = {
  paddy: "/images/crops/paddy.jpg",
  wheat: "/images/crops/wheat.jpg",
  maize: "/images/crops/maize.jpg",
  bajra: "/images/crops/bajra.jpg",
  potato: "/images/crops/potato.jpg",
  tomato: "/images/crops/tomato.jpg",
  onion: "/images/crops/onion.jpg",
  chilli: "/images/crops/chilli.jpg",
  cauliflower: "/images/crops/cauliflower.jpg",
  cucumber: "/images/crops/cucumber.jpg",
  brinjal: "/images/crops/brinjal.jpg",
  bhindi: "/images/crops/bhindi.jpg",
  cotton: "/images/crops/cotton.jpg",
  sugarcane: "/images/crops/sugarcane.jpg",
  soybean: "/images/crops/soybean.jpg",
  moongfali: "/images/crops/moongfali.jpg",
  groundnut: "/images/crops/groundnut.jpg",
  mustard: "/images/crops/mustard.jpg",
  pulses: "/images/crops/pulses.jpg",
  moong: "/images/crops/moong.jpg",
  mango: "/images/crops/mango.jpg",
  banana: "/images/crops/banana.jpg",
  grapes: "/images/crops/grapes.jpg",
  chana: "/images/crops/chana.jpg",
  masoor: "/images/crops/masoor.jpg",
  urad: "/images/crops/urad.jpg",
  ginger: "/images/crops/ginger.jpg",
  garlic: "/images/crops/garlic.jpg",
};

/**
 * High-res photorealistic hero/card photos (Unsplash) — fallback only.
 */
const CURATED_REMOTE_PHOTOS: Record<string, string> = {
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
  ginger:
    "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=1200&h=800&fit=crop&q=80",
  garlic:
    "https://images.unsplash.com/photo-1508747703725-719777637510?w=1200&h=800&fit=crop&q=80",
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
  okra: "bhindi",
  "lady-finger": "bhindi",
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
 * Prefer local marketing photo → curated remote → valid input image → placeholder.
 */
export function resolveCropImage(input: {
  slug: string;
  name?: string;
  image?: string | null;
}): string {
  const slug = normalizeCropSlug(input.slug || input.name || "");

  const local = LOCAL_CROP_PHOTOS[slug];
  if (local) return local;

  const curated = CURATED_REMOTE_PHOTOS[slug];
  if (curated) return curated;

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
