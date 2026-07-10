import nutrientBatch from "@/data/imports/agriveda-nutrient-deficiency-batch.json";
import { cropLabelToSlug } from "@/lib/crops/ipmDataBridge";
import { simplifySymptomLine } from "@/lib/nutrients/farmerNutrientView";
import type { NutrientDeficiency } from "@/types/crop-management";
import type {
  NutrientDeficiencyData,
  NutrientMobility,
  SeverityLevel,
} from "@/types/deficiency";

export interface NutrientPageRecord {
  slug: string;
  name: string;
  symbol: string;
  category: string;
  mobility: string;
  formsTakenUp?: string;
  overview: { whyImportant: string; name?: string; symbol?: string; category?: string; mobility?: string; formsTakenUp?: string };
  plantFunctions?: Record<string, string>;
  whyDeficiencyHappens?: { condition: string; why: string }[];
  symptoms?: Record<string, string>;
  cropWiseSymptoms?: { crop: string; symptoms: string }[];
  howToFix?: {
    fertilizer: string;
    nutrientContent?: string;
    soilApplicationDose?: string;
    foliarSprayDose?: string;
    fertigationDose?: string;
    bestCropStage?: string;
    methodOfApplication?: string;
    expectedRecoveryTime?: string;
    precautions?: string;
  }[];
  methodOfApplication?: Record<string, string>;
  toxicity?: {
    whatHappens?: string;
    plantToxicitySymptoms?: string;
    correctionMethods?: string;
  };
  prevention?: string[];
  commonFarmerMistakes?: string[];
  expertTips?: string[];
  faq?: { q: string; a: string }[];
  references?: string[];
}

const batch = nutrientBatch as { nutrients: NutrientPageRecord[] };

const slugIndex = new Map<string, NutrientPageRecord>();
for (const record of batch.nutrients) {
  slugIndex.set(record.slug, record);
}

const NUTRIENT_ICONS: Record<string, string> = {
  nitrogen: "🌿",
  phosphorus: "🪴",
  potassium: "⚡",
  calcium: "🧱",
  magnesium: "🍃",
  sulphur: "🧪",
  iron: "🪙",
  zinc: "🌱",
  boron: "🧬",
  copper: "🛡️",
  manganese: "🟢",
  molybdenum: "🧬",
  chlorine: "💧",
  nickel: "⚙️",
  silicon: "🪨",
  cobalt: "🔬",
};

const HIGH_SEVERITY = new Set(["nitrogen", "phosphorus", "potassium", "iron", "zinc", "boron"]);

function parseMobility(raw: string): NutrientMobility {
  const m = raw.toLowerCase();
  if (m.includes("immobile") && !m.includes("mobile in plant")) return "Immobile";
  if (m.includes("mobile in plant") || m.startsWith("mobile")) return "Mobile";
  return "Partially mobile";
}

function severityFor(slug: string, category: string): SeverityLevel {
  if (HIGH_SEVERITY.has(slug)) return "High";
  if (category.toLowerCase().includes("primary")) return "High";
  if (category.toLowerCase().includes("secondary")) return "Moderate";
  if (category.toLowerCase().includes("beneficial")) return "Low";
  if (slug === "molybdenum" || slug === "chlorine" || slug === "nickel" || slug === "cobalt") return "Low";
  return "Moderate";
}

function symptomLines(symptoms?: Record<string, string>): string[] {
  if (!symptoms) return [];
  const keys = ["note", "early", "middle", "severe", "oldLeaves", "youngLeaves", "wholePlant"];
  return keys.map((k) => symptoms[k]).filter(Boolean) as string[];
}

function buildCorrections(record: NutrientPageRecord) {
  if (!record.howToFix?.length) return [];
  return record.howToFix.map((fix) => ({
    title: fix.fertilizer,
    details: [
      fix.nutrientContent && `Content: ${fix.nutrientContent}`,
      fix.soilApplicationDose && fix.soilApplicationDose !== "NA" && `Soil: ${fix.soilApplicationDose}`,
      fix.foliarSprayDose && fix.foliarSprayDose !== "NA" && `Foliar: ${fix.foliarSprayDose}`,
      fix.fertigationDose && fix.fertigationDose !== "NA" && `Fertigation: ${fix.fertigationDose}`,
      fix.bestCropStage && `Stage: ${fix.bestCropStage}`,
      fix.methodOfApplication && `Method: ${fix.methodOfApplication}`,
      fix.expectedRecoveryTime && `Recovery: ${fix.expectedRecoveryTime}`,
      fix.precautions,
    ].filter(Boolean) as string[],
  }));
}

function firstFoliar(record: NutrientPageRecord): string {
  const fix = record.howToFix?.find((f) => f.foliarSprayDose && f.foliarSprayDose !== "NA");
  if (!fix) return record.methodOfApplication?.foliarSpray ?? "";
  return `${fix.fertilizer}: ${fix.foliarSprayDose}${fix.precautions ? ` — ${fix.precautions}` : ""}`;
}

function firstSoil(record: NutrientPageRecord): string {
  const fix = record.howToFix?.find((f) => f.soilApplicationDose && f.soilApplicationDose !== "NA");
  if (!fix) return record.methodOfApplication?.broadcast ?? record.methodOfApplication?.bandPlacement ?? "";
  return `${fix.fertilizer}: ${fix.soilApplicationDose}`;
}

function firstFertigation(record: NutrientPageRecord): string {
  const fix = record.howToFix?.find((f) => f.fertigationDose && f.fertigationDose !== "NA");
  if (!fix) return record.methodOfApplication?.dripFertigation ?? "";
  return `${fix.fertilizer}: ${fix.fertigationDose}`;
}

function recoveryTime(record: NutrientPageRecord): string {
  const times = (record.howToFix ?? [])
    .map((f) => f.expectedRecoveryTime)
    .filter((t) => t && t !== "NA");
  return times[0] ?? "Varies by method and severity";
}

function mapCropSpecific(record: NutrientPageRecord) {
  return (record.cropWiseSymptoms ?? []).map((row) => {
    const topFix = record.howToFix?.[0];
    return {
      cropName: row.crop,
      symptoms: [row.symptoms],
      stage: "Field observation",
      cause: record.whyDeficiencyHappens?.[0]
        ? `${record.whyDeficiencyHappens[0].condition}: ${record.whyDeficiencyHappens[0].why}`
        : "Soil or uptake limitation",
      correction: topFix
        ? `${topFix.fertilizer} — ${topFix.soilApplicationDose ?? topFix.foliarSprayDose ?? "see label"}`
        : "Soil test + balanced correction",
      prevention: record.prevention?.[0] ?? "Soil test and balanced nutrition",
      notes: record.symptoms?.note ?? record.mobility,
    };
  });
}

function normalizeRecord(record: NutrientPageRecord): NutrientPageRecord {
  const ov = record.overview;
  if (ov?.name && !record.name) {
    return {
      ...record,
      name: ov.name,
      symbol: ov.symbol ?? record.symbol,
      category: ov.category ?? record.category,
      mobility: ov.mobility ?? record.mobility,
      formsTakenUp: ov.formsTakenUp ?? record.formsTakenUp,
      overview: { whyImportant: ov.whyImportant },
    };
  }
  return record;
}

function mapNutrientPageToDeficiency(raw: NutrientPageRecord): NutrientDeficiencyData {
  const record = normalizeRecord(raw);
  const why = (record.whyDeficiencyHappens ?? []).map((w) => `${w.condition}: ${w.why}`);
  const symptoms = symptomLines(record.symptoms);
  const visual = [
    record.symptoms?.oldLeaves,
    record.symptoms?.youngLeaves,
    record.symptoms?.severe,
  ].filter(Boolean) as string[];

  return {
    slug: record.slug,
    name: record.name,
    symbol: record.symbol,
    role: record.plantFunctions?.roleInsidePlant ?? record.overview.whyImportant.slice(0, 120),
    mobility: parseMobility(record.mobility),
    summary: record.overview.whyImportant,
    quickFacts: [
      record.category,
      record.mobility.split(";")[0]?.trim() ?? record.mobility,
      `${record.cropWiseSymptoms?.length ?? 0} crop guides`,
    ],
    icon: NUTRIENT_ICONS[record.slug] ?? "🌿",
    severity: severityFor(record.slug, record.category),
    generalSymptoms: symptoms,
    visualSymptoms: visual,
    whyItHappens: why,
    fieldConditions: (record.whyDeficiencyHappens ?? []).map((w) => w.condition),
    confirmation: [
      record.symptoms?.note ?? "",
      `Mobility: ${record.mobility.split(";")[0]?.trim() ?? record.mobility}`,
      "Confirm with Soil Health Card / leaf tissue test",
    ].filter(Boolean),
    corrections: buildCorrections(record),
    foliar: firstFoliar(record),
    soilApplication: firstSoil(record),
    fertigation: firstFertigation(record),
    recoveryTimeline: recoveryTime(record),
    prevention: record.prevention ?? [],
    cropExamples: (record.cropWiseSymptoms ?? []).map((c) => c.crop),
    cropSpecificData: mapCropSpecific(record),
    category: record.category,
    formsTakenUp: record.formsTakenUp,
    plantFunctions: record.plantFunctions,
    symptomDetail: record.symptoms,
    howToFix: record.howToFix,
    methodOfApplication: record.methodOfApplication,
    toxicity: record.toxicity,
    commonFarmerMistakes: record.commonFarmerMistakes,
    expertTips: record.expertTips,
    faq: record.faq,
    references: record.references,
  };
}

const importedDeficiencies = batch.nutrients.map(mapNutrientPageToDeficiency);

const NUTRIENT_ORDER = [
  "nitrogen", "phosphorus", "potassium", "calcium", "magnesium", "sulphur",
  "iron", "manganese", "zinc", "copper", "molybdenum", "boron",
  "silicon", "chlorine", "cobalt", "nickel",
];

/** All 16 nutrients from Agriveda JSON batch (incl. full Nitrogen page) */
export const allNutrientDeficiencies: NutrientDeficiencyData[] = [...importedDeficiencies].sort(
  (a, b) => NUTRIENT_ORDER.indexOf(a.slug) - NUTRIENT_ORDER.indexOf(b.slug)
);

export function getNutrientDeficiency(slug: string): NutrientDeficiencyData | undefined {
  return allNutrientDeficiencies.find((d) => d.slug === slug);
}

function uniqueStrings(items: string[]): string[] {
  return [...new Set(items.map((s) => s.trim()).filter(Boolean))];
}

function shortenDose(text: string, max = 55): string {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : t.slice(0, max).trim() + "…";
}

/** Crop-specific nutrient cards for crop management profile */
export function buildNutrientDeficienciesForCrop(cropSlug: string): NutrientDeficiency[] {
  const items: NutrientDeficiency[] = [];

  for (const record of batch.nutrients) {
    const cropRow = (record.cropWiseSymptoms ?? []).find(
      (c) => cropLabelToSlug(c.crop) === cropSlug
    );
    if (!cropRow) continue;

    const fixes = record.howToFix ?? [];

    const excess = record.toxicity?.plantToxicitySymptoms
      ? [record.toxicity.plantToxicitySymptoms]
      : ["Excess may cause nutrient imbalance — soil test before repeat doses"];

    items.push({
      name: record.name,
      role: record.plantFunctions?.roleInsidePlant?.slice(0, 80) ?? record.overview.whyImportant.slice(0, 80),
      deficiencySymptoms: uniqueStrings([
        simplifySymptomLine(cropRow.symptoms),
      ]).slice(0, 2),
      excessSymptoms: excess.slice(0, 1),
      management: uniqueStrings(
        fixes.slice(0, 2).map((f) => {
          const dose =
            f.foliarSprayDose && f.foliarSprayDose !== "NA"
              ? f.foliarSprayDose
              : f.soilApplicationDose;
          return `${f.fertilizer}${dose && dose !== "NA" ? ` — ${shortenDose(dose)}` : ""}`;
        })
      ).slice(0, 2),
      recommendedFertilizers: fixes.map((f) => f.fertilizer).slice(0, 3),
    });
  }

  return items;
}

export function mergeNutrientDeficiencyIntoProfile<T extends { slug: string; nutrientDeficiencies: NutrientDeficiency[] }>(
  profile: T
): T {
  const fromBatch = buildNutrientDeficienciesForCrop(profile.slug);
  if (!fromBatch.length) return profile;

  const byName = new Map(
    profile.nutrientDeficiencies.map((n) => [n.name.toLowerCase(), { ...n }])
  );

  for (const item of fromBatch) {
    const key = item.name.toLowerCase();
    const existing = byName.get(key);
    if (existing) {
      existing.deficiencySymptoms = uniqueStrings([
        ...existing.deficiencySymptoms,
        ...item.deficiencySymptoms,
      ]).slice(0, 2);
      existing.management = uniqueStrings([...existing.management, ...item.management]).slice(0, 2);
      existing.recommendedFertilizers = uniqueStrings([
        ...existing.recommendedFertilizers,
        ...item.recommendedFertilizers,
      ]).slice(0, 3);
      if (!existing.role || existing.role === "Supports crop growth") {
        existing.role = item.role;
      }
    } else {
      byName.set(key, item);
    }
  }

  return { ...profile, nutrientDeficiencies: [...byName.values()] };
}
