import { cropCatalog } from "@/data/crop-catalog";
import { SLUG_TO_DATA_KEY } from "@/data/agriveda2/crop-slug-map";
import { getCropManagementProfile } from "@/data/crop-management";
import { getSeedRateForSlug, SEED_RATE_DATA, type SeedRateEntry } from "@/data/agriveda2/seed-rate-data";

/** Parse "35-40 kg" style strings from crop-management fallback */
function parseSeedRateString(raw: string): { min: number; max: number; unit: string } | null {
  const normalized = raw.toLowerCase();
  const range = normalized.match(/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)/);
  if (!range) return null;

  let unit = "kg/acre";
  if (/gram|g\/acre|g per/.test(normalized)) unit = "gram/acre";
  if (/quintal|q\/acre|tonne|ton/.test(normalized)) unit = "quintal/acre";
  if (/hectare|ha\b|\/ha/.test(normalized) && !/acre/.test(normalized)) unit = "kg/hectare";

  return {
    min: parseFloat(range[1]),
    max: parseFloat(range[2]),
    unit,
  };
}

export function resolveSeedRateEntry(slug: string): SeedRateEntry | null {
  const verified = getSeedRateForSlug(slug);
  if (verified) return verified;

  const profile = getCropManagementProfile(slug);
  if (!profile?.seedRate) return null;

  const parsed = parseSeedRateString(profile.seedRate);
  if (!parsed) return null;

  return {
    methods: [
      {
        id: "standard",
        label: "Recommended (crop guide)",
        min: parsed.min,
        max: parsed.max,
        unit: parsed.unit,
        note: profile.seedRate,
      },
    ],
    seedTreatment: profile.seedTreatment?.[0] ?? "Follow label for seed treatment",
    unitExplanation: `${parsed.unit} — crop management guide se`,
    proTip: profile.sowingTime?.[0],
  };
}

export function listSeedCalculatorCrops(): { slug: string; verified: boolean }[] {
  return cropCatalog.map((c) => ({
    slug: c.slug,
    verified: Boolean(
      SLUG_TO_DATA_KEY[c.slug] && SEED_RATE_DATA[SLUG_TO_DATA_KEY[c.slug]!]
    ),
  }));
}
