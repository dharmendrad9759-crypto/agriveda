import { resolveCropImage } from "@/lib/crops/cropImages";

/**
 * Pre-composited threat-page hero banners (mint left + crop photo right).
 * Files live in /public/images/crops/threat-banners/{slug}.jpg
 */
const PRECOMPOSED_BANNERS = new Set([
  "bajra",
  "banana",
  "bhindi",
  "brinjal",
  "cauliflower",
  "chana",
  "chilli",
  "cotton",
  "cucumber",
  "garlic",
  "ginger",
  "groundnut",
  "maize",
  "mango",
  "masoor",
  "moong",
  "moongfali",
  "mustard",
  "onion",
  "paddy",
  "potato",
  "pulses",
  "soybean",
  "sugarcane",
  "urad",
  "wheat",
]);

/** Plain crop photos used as banner fallbacks (need CSS mint veil). */
const PLAIN_BANNER_FALLBACKS = new Set(["tomato", "grapes"]);

const ALIASES: Record<string, string> = {
  groundnut: "moongfali",
  rice: "paddy",
};

export function getThreatBannerUrl(slug: string): {
  src: string;
  /** True when asset already includes mint text-safe zone */
  precomposited: boolean;
} {
  const key = ALIASES[slug] ?? slug;
  if (PRECOMPOSED_BANNERS.has(key)) {
    return {
      src: `/images/crops/threat-banners/${key}.jpg`,
      precomposited: true,
    };
  }
  if (PLAIN_BANNER_FALLBACKS.has(key)) {
    return {
      src: `/images/crops/threat-banners/${key}.jpg`,
      precomposited: false,
    };
  }
  return {
    src: resolveCropImage({ slug: key }),
    precomposited: false,
  };
}
