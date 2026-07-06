import { getCropManagementProfile } from "@/data/crop-management";
import { getSeedRateForSlug } from "@/data/agriveda2/seed-rate-data";
import { dataKeyForSlug, SLUG_TO_DATA_KEY } from "@/data/agriveda2/crop-slug-map";
import { SEED_RATE_DATA } from "@/data/agriveda2/seed-rate-data";

export type AreaUnit = "acre" | "bigha" | "hectare";

const UNIT_TO_ACRE: Record<AreaUnit, number> = {
  acre: 1,
  bigha: 0.625,
  hectare: 2.471,
};

export interface SeedCalculatorResult {
  cropName: string;
  cropDataKey: string;
  varietyHint: string;
  areaAcres: number;
  areaDisplay: string;
  methodId: string;
  methodLabel: string;
  perAcreMin: number;
  perAcreMax: number;
  perAcreMid: number;
  totalSeedMin: number;
  totalSeedMax: number;
  totalSeedMid: number;
  unit: string;
  unitExplanation: string;
  seedTreatment: string;
  proTip?: string;
  methodNote?: string;
  spacing?: string;
  availableMethods: { id: string; label: string }[];
}

export function convertToAcres(value: number, unit: AreaUnit): number {
  return Math.round(value * UNIT_TO_ACRE[unit] * 100) / 100;
}

export function buildSeedCalculatorResult(
  cropSlug: string,
  areaValue: number,
  unit: AreaUnit,
  methodId?: string
): SeedCalculatorResult | null {
  const seedData = getSeedRateForSlug(cropSlug);
  const profile = getCropManagementProfile(cropSlug);
  const cropKey = dataKeyForSlug(cropSlug);
  if (!seedData || !cropKey) return null;

  const method =
    seedData.methods.find((m) => m.id === methodId) ?? seedData.methods[0];
  if (!method) return null;

  const areaAcres = convertToAcres(areaValue, unit);
  const mid = (method.min + method.max) / 2;
  const round = (n: number) => Math.round(n * 10) / 10;

  return {
    cropName: profile?.name ?? cropKey,
    cropDataKey: cropKey,
    varietyHint: profile?.seedSelection?.[0] ?? "Certified hybrid / improved variety",
    areaAcres,
    areaDisplay: `${areaValue} ${unit} (≈ ${areaAcres} acre)`,
    methodId: method.id,
    methodLabel: method.label,
    perAcreMin: method.min,
    perAcreMax: method.max,
    perAcreMid: round(mid),
    totalSeedMin: round(method.min * areaAcres),
    totalSeedMax: round(method.max * areaAcres),
    totalSeedMid: round(mid * areaAcres),
    unit: method.unit,
    unitExplanation: seedData.unitExplanation,
    seedTreatment: seedData.seedTreatment,
    proTip: seedData.proTip ?? method.note,
    methodNote: method.note,
    spacing: profile?.spacing,
    availableMethods: seedData.methods.map((m) => ({ id: m.id, label: m.label })),
  };
}

export function parseVoiceArea(text: string): { value: number; unit: AreaUnit; cropHint?: string } | null {
  const lower = text.toLowerCase();
  const numMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:bigha|बीघा|acre|एकड़|hectare|हेक्टेयर)?/);
  if (!numMatch) return null;

  const value = parseFloat(numMatch[1]);
  let unit: AreaUnit = "acre";
  if (/bigha|बीघा/.test(lower)) unit = "bigha";
  if (/hectare|हेक्टेयर/.test(lower)) unit = "hectare";

  const cropHints: Record<string, string> = {
    सरसों: "mustard",
    mustard: "mustard",
    गेहूँ: "wheat",
    wheat: "wheat",
    धान: "paddy",
    paddy: "paddy",
    टमाटर: "tomato",
    tomato: "tomato",
    मक्का: "maize",
    maize: "maize",
    चना: "pulses",
    soybean: "soybean",
    सोयाबीन: "soybean",
    आलू: "potato",
    potato: "potato",
  };

  let cropHint: string | undefined;
  for (const [key, slug] of Object.entries(cropHints)) {
    if (lower.includes(key)) {
      cropHint = slug;
      break;
    }
  }

  return { value, unit, cropHint };
}

export function cropsWithSeedData(): string[] {
  return Object.keys(SLUG_TO_DATA_KEY).filter((slug) => {
    const key = SLUG_TO_DATA_KEY[slug];
    return key && SEED_RATE_DATA[key];
  });
}
