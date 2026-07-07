import { getCropManagementProfile } from "@/data/crop-management";
import { getBighaInfo } from "@/lib/bighaConversion";
import { resolveSeedRateEntry } from "@/lib/agriveda2/seedRateFallback";
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

export function convertToAcres(
  value: number,
  unit: AreaUnit,
  bighaAcresPerUnit?: number
): number {
  const factor =
    unit === "bigha" ? (bighaAcresPerUnit ?? UNIT_TO_ACRE.bigha) : UNIT_TO_ACRE[unit];
  return Math.round(value * factor * 100) / 100;
}

export function buildSeedCalculatorResult(
  cropSlug: string,
  areaValue: number,
  unit: AreaUnit,
  methodId?: string,
  location?: { state?: string; district?: string }
): SeedCalculatorResult | null {
  const seedData = resolveSeedRateEntry(cropSlug);
  const profile = getCropManagementProfile(cropSlug);
  const cropKey = dataKeyForSlug(cropSlug) ?? profile?.name ?? cropSlug;
  if (!seedData) return null;

  const method =
    seedData.methods.find((m) => m.id === methodId) ?? seedData.methods[0];
  if (!method) return null;

  const bighaInfo =
    unit === "bigha" ? getBighaInfo(location?.state, location?.district) : null;
  const areaAcres = convertToAcres(
    areaValue,
    unit,
    bighaInfo?.acresPerBigha
  );
  const mid = (method.min + method.max) / 2;
  const round = (n: number) => Math.round(n * 10) / 10;

  const areaDisplay =
    unit === "bigha" && bighaInfo
      ? `${areaValue} bigha (≈ ${areaAcres} acre) — ${bighaInfo.label}`
      : `${areaValue} ${unit} (≈ ${areaAcres} acre)`;

  return {
    cropName: profile?.name ?? cropKey,
    cropDataKey: cropKey,
    varietyHint: profile?.seedSelection?.[0] ?? "Certified hybrid / improved variety",
    areaAcres,
    areaDisplay,
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

export function getDefaultMethodId(cropSlug: string): string | undefined {
  return resolveSeedRateEntry(cropSlug)?.methods[0]?.id;
}

export function cropsWithSeedData(): string[] {
  return Object.keys(SLUG_TO_DATA_KEY).filter((slug) => {
    const key = SLUG_TO_DATA_KEY[slug];
    return key && SEED_RATE_DATA[key];
  });
}
