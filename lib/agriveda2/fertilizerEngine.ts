import { getCropManagementProfile } from "@/data/crop-management";
import {
  getFertilizerForSlug,
  formatNutrientValue,
  scaleBagKg,
  fertilizerBagLabel,
  FERTILIZER_UNIT_NOTE,
  GOLDEN_FIELD_RULES_HI,
  type FertilizerCropEntry,
  type NutrientValue,
} from "@/data/agriveda2/fertilizer-data";
import { dataKeyForSlug, FERTILIZER_SLUGS } from "@/data/agriveda2/crop-slug-map";
import { cropCatalog } from "@/data/crop-catalog";

export type SoilNutrientStatus = "low" | "medium" | "high";

/** Optional soil-test statuses for N / P₂O₅ / K₂O. */
export interface SoilTestLevels {
  n?: SoilNutrientStatus;
  p?: SoilNutrientStatus;
  k?: SoilNutrientStatus;
}

/**
 * Conservative illustrative multipliers.
 * High → cut that nutrient ~25%; Low → raise ~20%; Medium → unchanged.
 * Not a lab STCR prescription — always defer to soil lab report + product label.
 */
export const SOIL_STATUS_FACTORS: Record<SoilNutrientStatus, number> = {
  low: 1.2,
  medium: 1.0,
  high: 0.75,
};

export const SOIL_ADJUST_NOTE_HI =
  "मिट्टी जाँच के अनुसार मात्रा बदल सकती है — रिपोर्ट और दवा का लेबल मानें";

export const SOIL_ADJUST_NOTE_EN =
  "Illustrative soil-test adjust — follow lab report + product label";

export interface FertilizerPlanRow {
  nutrient: string;
  detail: string;
}

export interface FertilizerPlan {
  cropKey: string;
  cropSlug: string;
  acres: number;
  source: "verified" | "guide";
  unitNote: string;
  nutrients: FertilizerPlanRow[];
  bags: { name: string; amount: string }[];
  schedule: { time: string; method?: string; apply: string; benefit?: string }[];
  guideNotes: string[];
  farmerTipHi?: string;
  categoryRuleHi?: string;
  goldenRulesHi: typeof GOLDEN_FIELD_RULES_HI;
  /** Present when any N/P/K status is set (including medium). */
  soilTest?: SoilTestLevels;
  soilAdjusted: boolean;
  soilAdjustNote: string;
  soilFactors: { n: number; p: number; k: number };
}

const NUTRIENT_LABEL_HI: Record<string, string> = {
  N: "नाइट्रोजन (N)",
  P: "फॉस्फोरस (P)",
  K: "पोटाश (K)",
  Ca: "कैल्शियम (Ca)",
  Mg: "मैग्नीशियम (Mg)",
  S: "सल्फर (S)",
  Zn: "जिंक (Zn)",
  Fe: "आयरन (Fe)",
  B: "बोरॉन (B)",
  Mo: "मॉलिब्डेनम (Mo)",
  Si: "सिलिका (Si)",
  Rhizobium: "राइजोबियम",
  Rhizobium_PSB: "राइजोबियम + पीएसबी",
};

const NUTRIENT_ORDER = [
  "N",
  "P",
  "K",
  "Ca",
  "Mg",
  "S",
  "Zn",
  "Fe",
  "B",
  "Mo",
  "Si",
  "Rhizobium",
  "Rhizobium_PSB",
] as const;

function statusFactor(status: SoilNutrientStatus | undefined): number {
  if (!status) return 1;
  return SOIL_STATUS_FACTORS[status];
}

function resolveSoilFactors(soil?: SoilTestLevels): { n: number; p: number; k: number } {
  return {
    n: statusFactor(soil?.n),
    p: statusFactor(soil?.p),
    k: statusFactor(soil?.k),
  };
}

function hasAnySoilStatus(soil?: SoilTestLevels): boolean {
  return Boolean(soil?.n || soil?.p || soil?.k);
}

function roundDose(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Scale numeric doses inside a nutrient value; leave notes/bools intact. */
function scaleNutrientValue(v: NutrientValue, factor: number): NutrientValue {
  if (factor === 1) return v;
  if (typeof v === "number") return roundDose(v * factor);
  if (typeof v === "string") {
    return v.replace(/([\d.]+)(\s*(?:kg|किग्रा))(?!\s*\/)/gi, (_, num: string, unit: string) => {
      return `${roundDose(parseFloat(num) * factor)}${unit}`;
    });
  }
  const out: Record<string, string | number | boolean> = {};
  for (const [key, val] of Object.entries(v)) {
    if (typeof val === "number" && (key === "total" || key === "basal" || /^(top|split)/i.test(key))) {
      out[key] = roundDose(val * factor);
    } else if (typeof val === "string" && /[\d.]+\s*(?:kg|किग्रा)/i.test(val)) {
      out[key] = val.replace(/([\d.]+)(\s*(?:kg|किग्रा))(?!\s*\/)/gi, (_, num: string, unit: string) => {
        return `${roundDose(parseFloat(num) * factor)}${unit}`;
      });
    } else {
      out[key] = val;
    }
  }
  return out;
}

function bagFactor(name: string, factors: { n: number; p: number; k: number }): number {
  const key = name.toLowerCase();
  if (/urea|can|ammonium|an\b|calcium_nitrate/.test(key)) return factors.n;
  if (/mop|muriate|sop|potash|k2o|kcl|00:00:50|13:00:45/.test(key)) return factors.k;
  if (/dap|ssp|map|tsp|rock\s*phos|super\s*phos|12:61:00|00:52:34/.test(key)) {
    // P-primary bags; DAP also carries N — blend lightly toward P
    return roundDose((factors.p * 0.7 + factors.n * 0.3) * 100) / 100;
  }
  if (/npk|complex|19:19:19|20:20:20|12:32:16/.test(key)) {
    return roundDose(((factors.n + factors.p + factors.k) / 3) * 100) / 100;
  }
  // Micronutrients / gypsum / organic / bio-stimulants — leave unchanged
  return 1;
}

function scaleApplyLine(
  apply: string,
  factors: { n: number; p: number; k: number }
): string {
  // Heuristic: prefer N for urea lines, K for MOP, else P-blend for DAP/SSP, else average
  let factor = (factors.n + factors.p + factors.k) / 3;
  if (/urea|यूरिया/i.test(apply)) factor = factors.n;
  else if (/mop|potash|sop|पोटाश/i.test(apply)) factor = factors.k;
  else if (/dap|ssp|map/i.test(apply)) factor = factors.p * 0.7 + factors.n * 0.3;

  if (Math.abs(factor - 1) < 0.01) return apply;
  return apply.replace(/([\d.]+)(\s*(?:kg|किग्रा))(?!\s*\/)/gi, (_, num: string, unit: string) => {
    return `${Math.round(parseFloat(num) * factor)}${unit}`;
  });
}

/**
 * Scales per-acre fertilizer doses (किग्रा, ग्राम, मि.ली, टन) by `acres`.
 * Leaves per-tree / per-plant / per-litre rates (followed by `/`, e.g. `50 kg/पेड़`, `200 g/पौधा`, `2 g/L`) untouched.
 */
export function scaleScheduleLineForAcres(line: string, acres: number): string {
  if (acres === 1) return line;
  return line.replace(
    /(\d+(?:\.\d+)?)(?:-(\d+(?:\.\d+)?))?\s*(किग्रा|kg|ग्राम|g|मि\.?ली|ml|टन)(?!\s*\/|[a-zA-Z])/gi,
    (match, n1Str: string, n2Str: string | undefined, unitRaw: string) => {
      const u = unitRaw.toLowerCase();
      const scaleVal = (v: number) => Math.round(v * acres * 10) / 10;
      const v1 = scaleVal(parseFloat(n1Str));
      const v2 = n2Str ? scaleVal(parseFloat(n2Str)) : undefined;

      if (u === "ग्राम" || u === "g") {
        if (v1 >= 1000 && (!v2 || v2 >= 1000)) {
          const k1 = Math.round((v1 / 1000) * 100) / 100;
          const k2 = v2 ? Math.round((v2 / 1000) * 100) / 100 : undefined;
          return k2 ? `${k1}-${k2} किग्रा` : `${k1} किग्रा`;
        }
        return v2 ? `${Math.round(v1)}-${Math.round(v2)} ग्राम` : `${Math.round(v1)} ग्राम`;
      }
      if (u === "मि.ली" || u === "मिली" || u === "ml") {
        if (v1 >= 1000 && (!v2 || v2 >= 1000)) {
          const l1 = Math.round((v1 / 1000) * 100) / 100;
          const l2 = v2 ? Math.round((v2 / 1000) * 100) / 100 : undefined;
          return l2 ? `${l1}-${l2} लीटर` : `${l1} लीटर`;
        }
        return v2 ? `${Math.round(v1)}-${Math.round(v2)} मि.ली` : `${Math.round(v1)} मि.ली`;
      }
      if (u === "टन") {
        return v2 ? `${v1}-${v2} टन` : `${v1} टन`;
      }
      return v2 ? `${v1}-${v2} किग्रा` : `${v1} किग्रा`;
    }
  );
}

/**
 * Scales spray water volume in `method` (e.g. `फोलियर स्प्रे (150L पानी)` → `फोलियर स्प्रे (300L पानी)` for 2 acres)
 * per Golden Rule 3 ("स्प्रे की मात्रा को प्रति एकड़ पानी के हिसाब से गुणा करें").
 */
export function scaleMethodForAcres(method: string | undefined, acres: number): string | undefined {
  if (!method || acres === 1) return method;
  return method.replace(
    /(\d+)(?:-(\d+))?\s*L\s*पानी/gi,
    (_, w1: string, w2: string | undefined) => {
      const s1 = Math.round(parseFloat(w1) * acres);
      const s2 = w2 ? Math.round(parseFloat(w2) * acres) : undefined;
      return s2 ? `${s1}-${s2}L पानी` : `${s1}L पानी`;
    }
  );
}

function applySoilToEntry(
  entry: FertilizerCropEntry,
  factors: { n: number; p: number; k: number }
): FertilizerCropEntry {
  const next: FertilizerCropEntry = { ...entry };
  if (next.N != null) next.N = scaleNutrientValue(next.N, factors.n);
  if (next.P != null) next.P = scaleNutrientValue(next.P, factors.p);
  if (next.K != null) next.K = scaleNutrientValue(next.K, factors.k);

  const bagsRaw = { ...(entry.fertilizer_bags_per_acre ?? entry.fertilizer_bags ?? {}) };
  const scaledBags: Record<string, string> = {};
  for (const [name, amount] of Object.entries(bagsRaw)) {
    const f = bagFactor(name, factors);
    if (f === 1) {
      scaledBags[name] = amount;
    } else {
      scaledBags[name] = amount.replace(/^([\d.]+)(\s*(?:kg|किग्रा))/i, (_, num: string, unit: string) => {
        return `${Math.round(parseFloat(num) * f)}${unit}`;
      });
    }
  }
  if (entry.fertilizer_bags_per_acre) next.fertilizer_bags_per_acre = scaledBags;
  else if (entry.fertilizer_bags) next.fertilizer_bags = scaledBags;

  if (entry.schedule?.length) {
    next.schedule = entry.schedule.map((s) => ({
      time: s.time,
      method: s.method,
      apply: scaleApplyLine(s.apply, factors),
      benefit: s.benefit,
    }));
  }

  return next;
}

function buildFromGuide(
  slug: string,
  acres: number,
  soil?: SoilTestLevels
): FertilizerPlan | null {
  const profile = getCropManagementProfile(slug);
  if (!profile) return null;

  const factors = resolveSoilFactors(soil);
  const adjusted = hasAnySoilStatus(soil);
  const wouldScale = factors.n !== 1 || factors.p !== 1 || factors.k !== 1;
  const nutrients: FertilizerPlanRow[] = [];
  if (profile.fertilizerSchedule?.length) {
    nutrients.push({
      nutrient: "समयसारिणी",
      detail: profile.fertilizerSchedule.join(" · "),
    });
  }
  if (profile.micronutrients?.length) {
    nutrients.push({
      nutrient: "सूक्ष्म पोषक",
      detail: profile.micronutrients.join(" · "),
    });
  }

  const guideNotes = [...(profile.irrigationSchedule?.slice(0, 2) ?? [])];
  if (adjusted && wouldScale) {
    guideNotes.push(
      `${SOIL_ADJUST_NOTE_HI} · गाइड पाठ पर अपने आप मात्रा नहीं बदलती — पुष्ट खुराक वाली फसल चुनें`
    );
  }

  return {
    cropKey: profile.name,
    cropSlug: slug,
    acres,
    source: "guide",
    unitNote: FERTILIZER_UNIT_NOTE,
    nutrients,
    bags: [],
    schedule: (profile.fertilizerSchedule ?? []).map((line, i) => ({
      time: `चरण ${i + 1}`,
      apply: line,
    })),
    guideNotes,
    goldenRulesHi: GOLDEN_FIELD_RULES_HI,
    soilTest: adjusted ? soil : undefined,
    // Text schedules are not auto-scaled — only verified numeric plans adjust doses
    soilAdjusted: false,
    soilAdjustNote: SOIL_ADJUST_NOTE_HI,
    soilFactors: factors,
  };
}

function buildFromVerified(
  entry: FertilizerCropEntry,
  cropKey: string,
  slug: string,
  acres: number,
  soil?: SoilTestLevels
): FertilizerPlan {
  const factors = resolveSoilFactors(soil);
  const adjusted = hasAnySoilStatus(soil);
  const wouldScale = factors.n !== 1 || factors.p !== 1 || factors.k !== 1;
  const working = wouldScale ? applySoilToEntry(entry, factors) : entry;

  const nutrients: FertilizerPlanRow[] = [];
  for (const key of NUTRIENT_ORDER) {
    const val = working[key as keyof FertilizerCropEntry];
    if (val != null) {
      nutrients.push({
        nutrient: NUTRIENT_LABEL_HI[key] ?? key,
        detail: formatNutrientValue(val as NutrientValue),
      });
    }
  }

  const bagsRaw = working.fertilizer_bags_per_acre ?? working.fertilizer_bags ?? {};
  const bags = Object.entries(bagsRaw).map(([name, amount]) => ({
    name: fertilizerBagLabel(name),
    amount: acres === 1 ? amount : scaleBagKg(amount, acres),
  }));

  const schedule = (working.schedule ?? []).map((s) => ({
    time: s.time,
    method: scaleMethodForAcres(s.method, acres),
    apply: scaleScheduleLineForAcres(s.apply, acres),
    benefit: s.benefit,
  }));

  return {
    cropKey,
    cropSlug: slug,
    acres,
    source: "verified",
    unitNote: FERTILIZER_UNIT_NOTE,
    nutrients,
    bags,
    schedule,
    guideNotes: [],
    farmerTipHi: entry.farmerTipHi,
    categoryRuleHi: entry.categoryRuleHi,
    goldenRulesHi: GOLDEN_FIELD_RULES_HI,
    soilTest: adjusted ? soil : undefined,
    soilAdjusted: wouldScale,
    soilAdjustNote: SOIL_ADJUST_NOTE_HI,
    soilFactors: factors,
  };
}

export function buildFertilizerPlan(
  cropSlug: string,
  acres: number,
  soil?: SoilTestLevels
): FertilizerPlan | null {
  const entry = getFertilizerForSlug(cropSlug);
  const cropKey = dataKeyForSlug(cropSlug);
  if (entry && cropKey) return buildFromVerified(entry, cropKey, cropSlug, acres, soil);
  return buildFromGuide(cropSlug, acres, soil);
}

export function listFertilizerCrops(): string[] {
  const catalogSlugs = new Set(cropCatalog.map((c) => c.slug));
  return FERTILIZER_SLUGS.filter((slug) => catalogSlugs.has(slug));
}

export function soilStatusLabel(status: SoilNutrientStatus, hi = true): string {
  if (hi) {
    if (status === "low") return "कम";
    if (status === "high") return "ज्यादा";
    return "मध्यम";
  }
  if (status === "low") return "Low";
  if (status === "high") return "High";
  return "Medium";
}
