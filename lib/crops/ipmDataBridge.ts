import ipmBatch from "@/data/imports/agriveda-ipm-batch.json";
import type { CropPestDiseaseData, DiseaseItem, PestItem } from "@/data/pest-disease";
import type { DiseaseManagement, PestManagement } from "@/types/crop-management";
import type { StageSprayRecommendation } from "@/types/crop-protection";
import type { ThreatDetailOverride } from "@/data/pest-disease-details";
import type { ThreatCategory } from "@/types/pest-disease-ui";

export interface IpmChemical {
  technical: string;
  dose: string;
  iracGroup?: string;
  fracGroup?: string;
  stage: string;
  note?: string;
}

export interface IpmManagement {
  prevention: string[];
  monitoring: string[];
  cultural: string[];
  biological: string[];
  chemical: IpmChemical[];
}

export interface IpmPest {
  name: string;
  scientificName: string;
  iracRotationNote?: string;
  damageSymptoms?: string;
  etl?: string;
  management: IpmManagement;
}

export interface IpmDisease {
  name: string;
  pathogen: string;
  type: string;
  fracRotationNote?: string;
  symptoms?: string;
  favourableConditions?: string;
  management: IpmManagement;
}

export interface IpmCropRecord {
  crop: string;
  scientificName: string;
  pests: IpmPest[];
  diseases: IpmDisease[];
}

const batch = ipmBatch as { crops: IpmCropRecord[] };

const CROP_META: Record<string, { name: string; emoji: string }> = {
  paddy: { name: "Paddy", emoji: "🌾" },
  maize: { name: "Maize", emoji: "🌽" },
  bajra: { name: "Bajra", emoji: "🌿" },
  soybean: { name: "Soybean", emoji: "🫘" },
  moongfali: { name: "Groundnut", emoji: "🥜" },
  moong: { name: "Moong", emoji: "🫘" },
  pulses: { name: "Arhar", emoji: "🫛" },
  sugarcane: { name: "Sugarcane", emoji: "🎋" },
  brinjal: { name: "Brinjal", emoji: "🍆" },
  chilli: { name: "Chilli", emoji: "🌶️" },
  capsicum: { name: "Capsicum", emoji: "🫑" },
  cauliflower: { name: "Cauliflower", emoji: "🥦" },
  cabbage: { name: "Cabbage", emoji: "🥬" },
  cucumber: { name: "Cucumber", emoji: "🥒" },
  bhindi: { name: "Bhindi", emoji: "🫛" },
};

export function cropLabelToSlug(label: string): string {
  const n = label.toLowerCase();
  if (n.includes("paddy") || n.includes("dhaan")) return "paddy";
  if (n.includes("maize") || n.includes("makka")) return "maize";
  if (n.includes("bajra") || n.includes("millet")) return "bajra";
  if (n.includes("soybean")) return "soybean";
  if (n.includes("groundnut") || n.includes("mungfali")) return "moongfali";
  if (n.includes("moong") && !n.includes("mungfali")) return "moong";
  if (n.includes("arhar") || n.includes("pigeon") || n.includes("tur")) return "pulses";
  if (n.includes("sugarcane") || n.includes("ganna")) return "sugarcane";
  if (n.includes("brinjal") || n.includes("baingan")) return "brinjal";
  if (n.includes("chilli") || n.includes("mirch")) return "chilli";
  if (n.includes("capsicum") || n.includes("shimla")) return "capsicum";
  if (n.includes("cauliflower") || n.includes("phool")) return "cauliflower";
  if (n.includes("cabbage") || n.includes("gobhi")) return "cabbage";
  if (n.includes("cucumber") || n.includes("khira")) return "cucumber";
  if (n.includes("bhindi") || n.includes("okra")) return "bhindi";
  return n.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 24);
}

const slugIndex = new Map<string, IpmCropRecord>();
for (const record of batch.crops) {
  slugIndex.set(cropLabelToSlug(record.crop), record);
}

export function getIpmCrop(slug: string): IpmCropRecord | null {
  return slugIndex.get(slug) ?? null;
}

export function getIpmSlugs(): string[] {
  return [...slugIndex.keys()];
}

function slugifyThreatId(name: string, index: number, prefix: "p" | "d"): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24);
  return `${prefix}${index + 1}-${base}`;
}

function formatChemicals(chemicals: IpmChemical[]): string[] {
  return chemicals.map((c) => {
    const group = c.iracGroup || c.fracGroup;
    const note = c.note ? ` — ${c.note}` : "";
    return `${c.technical} @ ${c.dose}${group ? ` (Group ${group})` : ""}${note}`;
  });
}

function chemicalsToStageSprays(chemicals: IpmChemical[], isDisease: boolean): StageSprayRecommendation[] {
  const early = chemicals.filter((c) =>
    ["early", "preventive"].includes(c.stage.toLowerCase())
  );
  const advanced = chemicals.filter((c) =>
    ["advanced", "curative"].includes(c.stage.toLowerCase())
  );

  const stages: StageSprayRecommendation[] = [];

  if (early.length) {
    const main = early[0];
    stages.push({
      stage: "early",
      label: isDisease ? "First spots" : "Early attack",
      chemistry: main.technical,
      dose: main.dose,
      notes: main.note,
    });
  }

  if (advanced.length) {
    const main = advanced[0];
    stages.push({
      stage: "advanced",
      label: isDisease ? "Spreading fast" : "Heavy attack",
      chemistry: main.technical,
      dose: main.dose,
      notes: main.note,
    });
  }

  if (!stages.length && chemicals.length) {
    stages.push({
      stage: "early",
      label: "Recommended spray",
      chemistry: chemicals[0].technical,
      dose: chemicals[0].dose,
      notes: chemicals[0].note,
    });
  }

  return stages;
}

function buildRemediation(mgmt: IpmManagement, _rotationNote?: string): string[] {
  const items: string[] = [];
  // Only ship buckets that have real field methods (UI hides empty ones)
  for (const p of mgmt.prevention.slice(0, 4)) items.push(`Prevention: ${p}`);
  for (const m of mgmt.monitoring.slice(0, 2)) items.push(`Monitoring: ${m}`);
  for (const c of mgmt.cultural.slice(0, 4)) {
    if (/trap|plough|remove|weed|shake|perch|destroy|hoe|hand/i.test(c)) {
      items.push(`Mechanical: ${c}`);
    } else {
      items.push(`Cultural: ${c}`);
    }
  }
  for (const b of mgmt.biological.slice(0, 4)) items.push(`Biological: ${b}`);
  // Chemicals live in stageSprays — keep 1 line for fallback only
  if (mgmt.chemical[0]) {
    const c = mgmt.chemical[0];
    items.push(`Chemical: ${c.technical} @ ${c.dose}`);
  }
  return items;
}

function inferCategory(type: string, name: string): ThreatCategory {
  const t = `${type} ${name}`.toLowerCase();
  if (t.includes("virus") || t.includes("mosaic") || t.includes("curl")) return "viral";
  if (t.includes("bacterial") || t.includes("xanthomonas") || t.includes("erwinia")) return "bacterial";
  if (t.includes("nematode")) return "other";
  if (t.includes("fungal") || t.includes("blight") || t.includes("rust") || t.includes("rot")) return "fungal";
  return "fungal";
}

export function mapIpmPestToManagement(pest: IpmPest): PestManagement {
  const chemicals = formatChemicals(pest.management.chemical);
  const firstChem = pest.management.chemical[0];
  const iracGroups = [
    ...new Set(pest.management.chemical.map((c) => c.iracGroup).filter(Boolean)),
    pest.iracRotationNote,
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    pestName: pest.name,
    scientificName: pest.scientificName,
    identification: pest.damageSymptoms ?? pest.name,
    symptoms: pest.damageSymptoms ? [pest.damageSymptoms] : [],
    etl: pest.etl ?? "Scout weekly; spray only at ETL",
    biologicalControl: pest.management.biological,
    chemicalControl: chemicals,
    iracGroup: iracGroups || "Rotate IRAC groups",
    activeIngredient: firstChem?.technical ?? chemicals[0]?.split(" @")[0] ?? "—",
    dose: firstChem?.dose ?? "As per label",
  };
}

export function mapIpmDiseaseToManagement(disease: IpmDisease): DiseaseManagement {
  const chemicals = formatChemicals(disease.management.chemical);
  const firstChem = disease.management.chemical[0];
  const fracGroups = [
    ...new Set(disease.management.chemical.map((c) => c.fracGroup).filter(Boolean)),
    disease.fracRotationNote,
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    diseaseName: disease.name,
    pathogen: disease.pathogen,
    type: disease.type,
    symptoms: disease.symptoms ? [disease.symptoms] : [],
    favourableConditions: disease.favourableConditions
      ? [disease.favourableConditions]
      : [],
    integratedManagement: [
      ...disease.management.prevention.map((p) => `Prevention: ${p}`),
      ...disease.management.monitoring.map((m) => `Monitoring: ${m}`),
      ...disease.management.cultural.map((c) => `Cultural: ${c}`),
    ],
    biologicalControl: disease.management.biological,
    chemicalControl: chemicals,
    fracGroup: fracGroups || "Rotate FRAC groups",
    activeIngredient: firstChem?.technical ?? chemicals[0]?.split(" @")[0] ?? "—",
    dose: firstChem?.dose ?? "As per label",
    waitingPeriod: "Check CIB&RC PHI on label",
  };
}

export function buildIpmCatalogEntry(slug: string, record: IpmCropRecord): CropPestDiseaseData {
  const meta = CROP_META[slug] ?? { name: record.crop.split("/")[0].trim(), emoji: "🌱" };

  const pests: PestItem[] = record.pests.map((p, i) => {
    const id = `p${i + 1}`;
    const firstChem = p.management.chemical[0];
    return {
      id,
      name: p.name,
      scientificName: p.scientificName,
      image: `/images/${slug}.png`,
      stage: "Field season",
      iracGroup: firstChem?.iracGroup ?? p.iracRotationNote?.slice(0, 12) ?? "—",
      control: formatChemicals(p.management.chemical)[0] ?? "IPM ladder — see detail",
    };
  });

  const diseases: DiseaseItem[] = record.diseases.map((d, i) => {
    const id = `d${i + 1}`;
    const firstChem = d.management.chemical[0];
    return {
      id,
      name: d.name,
      pathogen: d.pathogen,
      image: `/images/${slug}.png`,
      stage: "Field season",
      fracGroup: firstChem?.fracGroup ?? "—",
      control: formatChemicals(d.management.chemical)[0] ?? "IDM ladder — see detail",
    };
  });

  return {
    slug,
    name: meta.name,
    emoji: meta.emoji,
    pests,
    diseases,
    weeds: [],
  };
}

export function buildIpmThreatOverrides(slug: string, record: IpmCropRecord): Record<string, ThreatDetailOverride> {
  const overrides: Record<string, ThreatDetailOverride> = {};

  record.pests.forEach((pest, i) => {
    const id = `p${i + 1}`;
    const key = `${slug}-pest-${id}`;
    const firstChem = pest.management.chemical[0];
    overrides[key] = {
      category: "insect",
      description: `${pest.scientificName} — ${pest.damageSymptoms ?? pest.name}`,
      symptoms: pest.damageSymptoms ? [pest.damageSymptoms] : [],
      remediation: buildRemediation(pest.management, pest.iracRotationNote),
      etl: pest.etl,
      activeIngredient: firstChem ? `${firstChem.technical} @ ${firstChem.dose}` : undefined,
      stageSprays: chemicalsToStageSprays(pest.management.chemical, false),
      rotationNotes: pest.iracRotationNote,
      // Keep chemical card clean — IPM non-chemical shown via remediation prefixes only
      stageExtraNotes: undefined,
    };
  });

  record.diseases.forEach((disease, i) => {
    const id = `d${i + 1}`;
    const key = `${slug}-disease-${id}`;
    const firstChem = disease.management.chemical[0];
    overrides[key] = {
      category: inferCategory(disease.type, disease.name),
      description: `${disease.pathogen} — ${disease.symptoms ?? disease.name}`,
      symptoms: disease.symptoms ? [disease.symptoms] : [],
      remediation: buildRemediation(disease.management, disease.fracRotationNote),
      activeIngredient: firstChem ? `${firstChem.technical} @ ${firstChem.dose}` : undefined,
      stageSprays: chemicalsToStageSprays(disease.management.chemical, true),
      rotationNotes: disease.fracRotationNote,
      stageExtraNotes: disease.favourableConditions
        ? [`Favourable conditions: ${disease.favourableConditions}`]
        : [],
    };
  });

  return overrides;
}

const catalogCache = new Map<string, CropPestDiseaseData>();
const overrideCache = new Map<string, ThreatDetailOverride>();

for (const [slug, record] of slugIndex) {
  catalogCache.set(slug, buildIpmCatalogEntry(slug, record));
  for (const [key, val] of Object.entries(buildIpmThreatOverrides(slug, record))) {
    overrideCache.set(key, val);
  }
}

export function getIpmCatalogEntry(slug: string): CropPestDiseaseData | null {
  return catalogCache.get(slug) ?? null;
}

export function getIpmThreatOverride(key: string): ThreatDetailOverride | undefined {
  return overrideCache.get(key);
}

export function mergeIpmCatalog(base: CropPestDiseaseData): CropPestDiseaseData {
  const ipm = getIpmCatalogEntry(base.slug);
  if (!ipm) return base;
  return {
    ...base,
    pests: ipm.pests.length ? ipm.pests : base.pests,
    diseases: ipm.diseases.length ? ipm.diseases : base.diseases,
  };
}

export function mergeIpmPestDiseaseManagement<T extends { slug: string; pestManagement: PestManagement[]; diseaseManagement: DiseaseManagement[] }>(
  profile: T
): T {
  const ipm = getIpmCrop(profile.slug);
  if (!ipm) return profile;
  return {
    ...profile,
    pestManagement: ipm.pests.map(mapIpmPestToManagement),
    diseaseManagement: ipm.diseases.map(mapIpmDiseaseToManagement),
  };
}

export function getIpmPestListForCrop(slug: string) {
  const ipm = getIpmCrop(slug);
  if (!ipm) return [];
  return ipm.pests.map((p, i) => ({
    id: `p${i + 1}`,
    name: p.name,
    scientific: p.scientificName,
    desc: p.damageSymptoms ?? "",
    damage: p.damageSymptoms?.slice(0, 60) ?? "—",
    spread: p.iracRotationNote?.slice(0, 40) ?? "—",
    loss: "Yield loss if untreated",
    etl: p.etl,
    attackStage: "Field season",
    monitoring: p.management.monitoring[0] ?? "Weekly scout",
    risk: "high" as const,
    ipm: p.management,
  }));
}

export function getIpmDiseaseListForCrop(slug: string) {
  const ipm = getIpmCrop(slug);
  if (!ipm) return [];
  return ipm.diseases.map((d, i) => ({
    id: `d${i + 1}`,
    name: d.name,
    scientific: d.pathogen,
    risk: d.type === "viral" ? ("high" as const) : ("medium" as const),
    type: d.type,
    desc: d.symptoms ?? "",
    conditions: d.favourableConditions,
    ipm: d.management,
    fracNote: d.fracRotationNote,
  }));
}
