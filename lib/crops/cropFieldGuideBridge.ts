import paddyGuide from "@/data/imports/agriveda-paddy-field-guide.json";
import cucumberGuide from "@/data/imports/agriveda-cucumber-field-guide.json";
import type { CropPestDiseaseData, DiseaseItem, PestItem, WeedItem } from "@/data/pest-disease";
import type { ThreatDetailOverride } from "@/data/pest-disease-details";
import type {
  CropManagementProfile,
  CropStage,
  DiseaseManagement,
  FAQItem,
  NutrientDeficiency,
  PestManagement,
  WeedManagement,
} from "@/types/crop-management";
import type { StageSprayRecommendation } from "@/types/crop-protection";
import type { ThreatCategory } from "@/types/pest-disease-ui";

export interface FieldGuideChemical {
  technical: string;
  dose_per_acre: string;
  irac_group?: string;
  frac_group?: string;
  spray_water_volume?: string;
  spray_timing: string;
}

export interface FieldGuidePest {
  pest_name: string;
  identification: string;
  life_cycle: string;
  damage_symptoms: string;
  crop_stage_attacked: string;
  favorable_conditions: string;
  why_this_happened: string;
  monitoring: string;
  etl: string;
  preventive: string;
  cultural_control: string;
  biological_control: string;
  chemical_early_curative: FieldGuideChemical;
  chemical_hard_curative: FieldGuideChemical;
  next_spray_logic: string;
  resistance_management: string;
  phi: string;
  rei: string;
  compatibility_notes: string;
  safety_notes: string;
  farmer_tip: string;
  common_mistakes: string;
  references: string[];
  confidence_level: string;
}

export interface FieldGuideDisease extends Omit<FieldGuidePest, "pest_name" | "irac_group"> {
  pest_name: string;
  chemical_early_curative: FieldGuideChemical;
  chemical_hard_curative: FieldGuideChemical;
}

export interface FieldGuideNutrient {
  nutrient: string;
  symptoms: string;
  why_happens: string;
  how_to_fix: string;
  fertilizer_recommendation: string;
  dose_per_acre: string;
}

export interface FieldGuideWeed {
  weed_name: string;
  weed_type: string;
  identification: string;
  critical_competition_period: string;
  why_problem_occurs: string;
  preventive: string;
  cultural_control: string;
  biological_control: string;
  chemical_management: {
    pre_emergence: string;
    early_post_emergence: string;
    late_post_emergence: string;
    dose_per_acre: string;
    application_timing: string;
    hrac_group: string;
  };
  resistance_management: string;
  safety_and_compatibility: string;
  farmer_tip: string;
  references: string[];
  confidence_level: string;
}

export interface CropFieldGuide {
  crop_name: string;
  crop_basics: {
    growth_stages: { stage: string; typical_period: string; field_practical_notes: string }[];
    fertilizer_schedule: Record<string, unknown>;
    irrigation_schedule: string;
    harvest: string;
    faq: { question: string; answer: string }[];
  };
  pest_database: FieldGuidePest[];
  disease_database: FieldGuideDisease[];
  nutrient_deficiency: FieldGuideNutrient[];
  weed_database: FieldGuideWeed[];
}

interface FieldGuideCropConfig {
  slug: string;
  name: string;
  emoji: string;
  overview: string;
  pestIds: Record<string, string>;
  diseaseIds: Record<string, string>;
}

const CROP_CONFIGS: FieldGuideCropConfig[] = [
  {
    slug: "paddy",
    name: "Paddy",
    emoji: "🌾",
    overview:
      "Field-practical paddy guide aligned with ICAR IPM, CIBRC label discipline and state-specific fertilizer packages. Doses marked unknown must be taken from the current approved product label.",
    pestIds: {
      "brown planthopper": "p1",
      "yellow stem borer": "p2",
      "rice leaf folder": "p4",
      "leaf folder": "p4",
      "rice earhead bug": "p6",
      "gundhi bug": "p6",
      earhead: "p6",
    },
    diseaseIds: {
      "rice blast": "d1",
      blast: "d1",
      "sheath blight": "d2",
      "bacterial leaf blight": "d3",
      blb: "d3",
      "brown spot": "d4",
      "false smut": "d5",
    },
  },
  {
    slug: "cucumber",
    name: "Cucumber",
    emoji: "🥒",
    overview:
      "Field-practical cucumber guide for trellised and open-field production — ICAR-IIHR IPM, CIBRC label discipline, fertigation timing and continuous-harvest PHI awareness.",
    pestIds: {
      "fruit fly": "p1",
      "red pumpkin beetle": "p2",
      "cucumber beetle": "p2",
      "pumpkin beetle": "p2",
      aphid: "p3",
      aphids: "p3",
    },
    diseaseIds: {
      "downy mildew": "d1",
      "powdery mildew": "d2",
      anthracnose: "d3",
    },
  },
];

const guideBySlug = new Map<string, { guide: CropFieldGuide; config: FieldGuideCropConfig }>();
for (const config of CROP_CONFIGS) {
  const guide =
    config.slug === "paddy"
      ? (paddyGuide as CropFieldGuide)
      : config.slug === "cucumber"
        ? (cucumberGuide as CropFieldGuide)
        : null;
  if (guide) guideBySlug.set(config.slug, { guide, config });
}

function splitNotes(text: string, max = 3): string[] {
  return text
    .split(/(?<=[.।])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, max);
}

function pestScientificName(raw: string): string {
  const comma = raw.indexOf(",");
  return comma > 0 ? raw.slice(comma + 1).trim() : raw;
}

function pestDisplayName(raw: string): string {
  const comma = raw.indexOf(",");
  return comma > 0 ? raw.slice(0, comma).trim() : raw;
}

function normalizeKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function resolvePestId(pestName: string, pestIds: Record<string, string>): string {
  const key = normalizeKey(pestDisplayName(pestName));
  for (const [pattern, id] of Object.entries(pestIds)) {
    if (key.includes(pattern)) return id;
  }
  return `p${normalizeKey(pestName).slice(0, 8)}`;
}

function resolveDiseaseId(diseaseName: string, diseaseIds: Record<string, string>): string {
  const key = normalizeKey(pestDisplayName(diseaseName));
  for (const [pattern, id] of Object.entries(diseaseIds)) {
    if (key.includes(pattern)) return id;
  }
  return `d${normalizeKey(diseaseName).slice(0, 8)}`;
}

function weedTypeLabel(raw: string): string {
  const t = raw.toLowerCase();
  if (t.includes("grass")) return "Grassy";
  if (t.includes("sedge")) return "Sedge";
  if (t.includes("broadleaf") || t.includes("broad")) return "Broadleaf";
  if (t.includes("mixed")) return "Mixed";
  return raw;
}

function chemLine(chem: FieldGuideChemical, isDisease = false): string {
  const group = isDisease ? chem.frac_group : chem.irac_group;
  const dose = chem.dose_per_acre?.toLowerCase().includes("unknown")
    ? "label dose only"
    : chem.dose_per_acre;
  return `${chem.technical} (${group ? `${isDisease ? "FRAC" : "IRAC"} ${group}` : "see label"}) — ${dose}`;
}

function chemicalsToStageSprays(
  early: FieldGuideChemical,
  hard: FieldGuideChemical,
  isDisease: boolean
): StageSprayRecommendation[] {
  const stages: StageSprayRecommendation[] = [];
  if (early.technical && !early.technical.toLowerCase().startsWith("unknown")) {
    stages.push({
      stage: "early",
      label: "Early / preventive",
      chemistry: early.technical,
      dose: early.dose_per_acre?.toLowerCase().includes("unknown") ? "Per approved label" : early.dose_per_acre,
      notes: [early.spray_timing, early.spray_water_volume].filter(Boolean).join(" · "),
    });
  }
  if (hard.technical && !hard.technical.toLowerCase().startsWith("unknown")) {
    stages.push({
      stage: "advanced",
      label: "Curative / rescue",
      chemistry: hard.technical,
      dose: hard.dose_per_acre?.toLowerCase().includes("unknown") ? "Per approved label" : hard.dose_per_acre,
      notes: [hard.spray_timing, hard.spray_water_volume].filter(Boolean).join(" · "),
    });
  }
  if (!stages.length && isDisease) {
    stages.push({
      stage: "early",
      label: "Integrated management",
      chemistry: "No reliable curative chemical without label verification",
      dose: "—",
      notes: "Confirm diagnosis and follow state package",
    });
  }
  return stages;
}

function inferDiseaseCategory(name: string): ThreatCategory {
  const n = name.toLowerCase();
  if (n.includes("bacterial")) return "bacterial";
  if (n.includes("virus")) return "viral";
  return "fungal";
}

function buildFertilizerSchedule(guide: CropFieldGuide): string[] {
  const fs = guide.crop_basics.fertilizer_schedule;
  const lines: string[] = [];
  const limitation = fs.important_limitation as string | undefined;
  if (limitation) lines.push(`⚠ ${limitation}`);

  const general = fs.general_recommendation as string | undefined;
  if (general) lines.push(general);

  const examples = fs.official_example_recommendations as Record<string, string> | undefined;
  if (examples) {
    for (const [key, val] of Object.entries(examples)) {
      lines.push(`${key.replace(/_/g, " ")}: ${val}`);
    }
  }

  const fertigation = fs.fertigation_schedule as
    | {
        day: string;
        stage: string;
        N_kg_per_acre: string;
        P2O5_kg_per_acre?: string;
        K2O_kg_per_acre: string;
        notes?: string;
      }[]
    | undefined;
  if (fertigation?.length) {
    for (const row of fertigation) {
      lines.push(
        `Day ${row.day} (${row.stage}): N ${row.N_kg_per_acre} kg/ac, K₂O ${row.K2O_kg_per_acre} kg/ac${row.notes ? ` — ${row.notes}` : ""}`
      );
    }
  }

  for (const key of [
    "basal_application",
    "nitrogen_splitting",
    "potassium_management",
    "zinc_management",
    "sulphur_and_micronutrients",
    "organic_and_biological_inputs",
    "foliar_nutrition",
    "organic_inputs",
  ]) {
    const val = fs[key] as string | undefined;
    if (val) lines.push(val);
  }
  const checks = fs.field_checks as string[] | undefined;
  if (checks?.length) lines.push(...checks.map((c) => `Field check: ${c}`));
  return lines;
}

function mapGrowthStages(guide: CropFieldGuide): CropStage[] {
  return guide.crop_basics.growth_stages.map((s) => ({
    title: s.stage,
    period: s.typical_period,
    keyPoints: splitNotes(s.field_practical_notes, 4),
  }));
}

function mapPestManagement(pest: FieldGuidePest): PestManagement {
  const chemicals = [pest.chemical_early_curative, pest.chemical_hard_curative]
    .filter((c) => c.technical && !c.technical.toLowerCase().startsWith("unknown"))
    .map((c) => chemLine(c));

  return {
    pestName: pestDisplayName(pest.pest_name),
    scientificName: pestScientificName(pest.pest_name),
    identification: pest.identification,
    symptoms: splitNotes(pest.damage_symptoms, 4),
    etl: pest.etl,
    biologicalControl: [pest.biological_control, pest.preventive].filter(Boolean),
    chemicalControl: chemicals.length
      ? chemicals
      : ["Use only CIBRC-approved products at label dose after ETL confirmation"],
    iracGroup:
      [pest.chemical_early_curative.irac_group, pest.chemical_hard_curative.irac_group]
        .filter(Boolean)
        .map((g) => `IRAC ${g}`)
        .join(" / ") || "Rotate IRAC groups",
    activeIngredient: pest.chemical_early_curative.technical?.startsWith("unknown")
      ? "Label-specific"
      : pest.chemical_early_curative.technical,
    dose: pest.chemical_early_curative.dose_per_acre?.toLowerCase().includes("unknown")
      ? "Follow exact product label"
      : pest.chemical_early_curative.dose_per_acre,
  };
}

function mapDiseaseManagement(disease: FieldGuideDisease): DiseaseManagement {
  const chemicals = [disease.chemical_early_curative, disease.chemical_hard_curative]
    .filter((c) => c.technical && !c.technical.toLowerCase().startsWith("unknown"))
    .map((c) => chemLine(c, true));

  const type = inferDiseaseCategory(disease.pest_name) === "bacterial" ? "Bacterial" : "Fungal";

  return {
    diseaseName: pestDisplayName(disease.pest_name),
    pathogen: pestScientificName(disease.pest_name),
    type,
    symptoms: splitNotes(disease.damage_symptoms, 4),
    favourableConditions: splitNotes(disease.favorable_conditions, 3),
    integratedManagement: [disease.why_this_happened, disease.resistance_management].filter(Boolean),
    biologicalControl: [disease.biological_control].filter(Boolean),
    chemicalControl: chemicals.length
      ? chemicals
      : ["No universal curative spray — confirm label claim and diagnosis"],
    fracGroup:
      [disease.chemical_early_curative.frac_group, disease.chemical_hard_curative.frac_group]
        .filter(Boolean)
        .map((g) => `FRAC ${g}`)
        .join(" / ") || "Rotate FRAC groups",
    activeIngredient: disease.chemical_early_curative.technical?.startsWith("unknown")
      ? "Label-specific"
      : disease.chemical_early_curative.technical,
    dose: disease.chemical_early_curative.dose_per_acre?.toLowerCase().includes("unknown")
      ? "Follow exact product label"
      : disease.chemical_early_curative.dose_per_acre,
    waitingPeriod: disease.phi?.toLowerCase().includes("unknown") ? "Per label" : disease.phi,
  };
}

function mapWeedManagement(weed: FieldGuideWeed, index: number): WeedManagement {
  const cm = weed.chemical_management;
  return {
    weedName: weed.weed_name.split(",")[0].trim(),
    scientificName: weed.weed_name.includes(",") ? weed.weed_name.split(",").slice(1).join(",").trim() : "—",
    type: weedTypeLabel(weed.weed_type),
    criticalPeriod: weed.critical_competition_period,
    preEmergenceHerbicide: cm.pre_emergence,
    postEmergenceHerbicide: [cm.early_post_emergence, cm.late_post_emergence].filter(Boolean).join(" · "),
    hracGroup: cm.hrac_group,
    dose: cm.dose_per_acre?.toLowerCase().includes("unknown")
      ? `Weed ${index + 1}: follow label`
      : cm.dose_per_acre,
  };
}

function mapNutrientDeficiencies(guide: CropFieldGuide): NutrientDeficiency[] {
  return guide.nutrient_deficiency.map((n) => ({
    name: n.nutrient,
    role: n.fertilizer_recommendation.slice(0, 100),
    deficiencySymptoms: splitNotes(n.symptoms, 2),
    excessSymptoms: ["Excess may disturb nutrient balance — soil test before repeat application"],
    management: [n.how_to_fix, n.why_happens].filter(Boolean),
    recommendedFertilizers: [
      n.fertilizer_recommendation,
      n.dose_per_acre?.toLowerCase().includes("unknown")
        ? "Dose: per soil test and state recommendation"
        : n.dose_per_acre,
    ].filter(Boolean),
  }));
}

function buildThreatOverride(
  entry: FieldGuidePest | FieldGuideDisease,
  isDisease: boolean
): ThreatDetailOverride {
  const remediation = [
    entry.preventive && `Prevention: ${entry.preventive}`,
    entry.monitoring && `Monitoring: ${entry.monitoring}`,
    entry.cultural_control && `Cultural: ${entry.cultural_control}`,
    entry.biological_control && `Biological: ${entry.biological_control}`,
    chemLine(entry.chemical_early_curative, isDisease) &&
      `Early chemical: ${chemLine(entry.chemical_early_curative, isDisease)}`,
    chemLine(entry.chemical_hard_curative, isDisease) &&
      !entry.chemical_hard_curative.technical?.toLowerCase().startsWith("unknown") &&
      `Hard chemical: ${chemLine(entry.chemical_hard_curative, isDisease)}`,
    entry.next_spray_logic && `Next spray: ${entry.next_spray_logic}`,
    entry.resistance_management && `Resistance: ${entry.resistance_management}`,
  ].filter(Boolean) as string[];

  const extraNotes = [
    entry.why_this_happened && `Why this happened: ${entry.why_this_happened}`,
    entry.farmer_tip && `Farmer tip: ${entry.farmer_tip}`,
    entry.common_mistakes && `Avoid: ${entry.common_mistakes}`,
    entry.safety_notes && `Safety: ${entry.safety_notes}`,
    entry.compatibility_notes && `Compatibility: ${entry.compatibility_notes}`,
    entry.confidence_level && `Confidence: ${entry.confidence_level}`,
  ].filter(Boolean) as string[];

  return {
    category: isDisease ? inferDiseaseCategory(entry.pest_name) : "insect",
    description: `${pestScientificName(entry.pest_name)} — ${entry.identification}`,
    symptoms: splitNotes(entry.damage_symptoms, 5),
    remediation,
    etl: entry.etl,
    activeIngredient: entry.chemical_early_curative.technical?.startsWith("unknown")
      ? undefined
      : entry.chemical_early_curative.technical,
    stageSprays: chemicalsToStageSprays(
      entry.chemical_early_curative,
      entry.chemical_hard_curative,
      isDisease
    ),
    rotationNotes: entry.resistance_management,
    stageExtraNotes: [
      ...extraNotes,
      entry.favorable_conditions && `Favourable conditions: ${entry.favorable_conditions}`,
      `Crop stage: ${entry.crop_stage_attacked}`,
      `PHI: ${entry.phi} · REI: ${entry.rei}`,
    ].filter(Boolean) as string[],
    continuousHarvest: !isDisease,
  };
}

const threatOverrideCache = new Map<string, ThreatDetailOverride>();

for (const { guide, config } of guideBySlug.values()) {
  for (const pest of guide.pest_database) {
    const id = resolvePestId(pest.pest_name, config.pestIds);
    threatOverrideCache.set(`${config.slug}-pest-${id}`, buildThreatOverride(pest, false));
  }
  for (const disease of guide.disease_database) {
    const id = resolveDiseaseId(disease.pest_name, config.diseaseIds);
    threatOverrideCache.set(`${config.slug}-disease-${id}`, buildThreatOverride(disease, true));
  }
}

export function getCropFieldGuideThreatOverride(key: string): ThreatDetailOverride | undefined {
  return threatOverrideCache.get(key);
}

export function mergeCropFieldGuideIntoProfile<T extends CropManagementProfile>(profile: T): T {
  const entry = guideBySlug.get(profile.slug);
  if (!entry) return profile;

  const { guide, config } = entry;
  const faqs: FAQItem[] = guide.crop_basics.faq;
  const irrigation = splitNotes(guide.crop_basics.irrigation_schedule, 8);

  return {
    ...profile,
    growthStages: mapGrowthStages(guide),
    fertilizerSchedule: buildFertilizerSchedule(guide),
    irrigationSchedule: irrigation.length ? irrigation : [guide.crop_basics.irrigation_schedule],
    harvesting: splitNotes(guide.crop_basics.harvest, 4),
    faqs,
    pestManagement: guide.pest_database.map(mapPestManagement),
    diseaseManagement: guide.disease_database.map(mapDiseaseManagement),
    weedManagement: guide.weed_database.map(mapWeedManagement),
    nutrientDeficiencies: mapNutrientDeficiencies(guide),
    overview: config.overview,
  };
}

function buildCatalogPest(pest: FieldGuidePest, slug: string, pestIds: Record<string, string>): PestItem {
  const id = resolvePestId(pest.pest_name, pestIds);
  const early = pest.chemical_early_curative;
  return {
    id,
    name: pestDisplayName(pest.pest_name),
    scientificName: pestScientificName(pest.pest_name),
    image: `/images/${slug}.png`,
    stage: pest.crop_stage_attacked,
    iracGroup: early.irac_group ? `IRAC ${early.irac_group}` : undefined,
    control: chemLine(early),
  };
}

function buildCatalogDisease(
  disease: FieldGuideDisease,
  slug: string,
  diseaseIds: Record<string, string>
): DiseaseItem {
  const id = resolveDiseaseId(disease.pest_name, diseaseIds);
  const early = disease.chemical_early_curative;
  return {
    id,
    name: pestDisplayName(disease.pest_name),
    pathogen: pestScientificName(disease.pest_name),
    image: `/images/${slug}.png`,
    stage: disease.crop_stage_attacked,
    fracGroup: early.frac_group ? `FRAC ${early.frac_group}` : undefined,
    control: early.technical?.startsWith("unknown") ? "IPM + label-verified fungicide" : chemLine(early, true),
  };
}

function buildCatalogWeed(weed: FieldGuideWeed, index: number, slug: string): WeedItem {
  return {
    id: `w${index + 1}`,
    name: weed.weed_name.split(",")[0].trim(),
    scientificName: weed.weed_name,
    type: weedTypeLabel(weed.weed_type),
    criticalPeriod: weed.critical_competition_period,
    preEmergence: weed.chemical_management.pre_emergence,
    postEmergence: weed.chemical_management.early_post_emergence,
    culturalControl: weed.cultural_control,
    image: `/images/${slug}.png`,
  };
}

export function mergeCropFieldGuideCatalog(base: CropPestDiseaseData): CropPestDiseaseData {
  const entry = guideBySlug.get(base.slug);
  if (!entry) return base;

  const { guide, config } = entry;
  const fieldCatalog: CropPestDiseaseData = {
    slug: config.slug,
    name: config.name,
    emoji: config.emoji,
    pests: guide.pest_database.map((p) => buildCatalogPest(p, config.slug, config.pestIds)),
    diseases: guide.disease_database.map((d) => buildCatalogDisease(d, config.slug, config.diseaseIds)),
    weeds: guide.weed_database.map((w, i) => buildCatalogWeed(w, i, config.slug)),
  };

  const pests = [...base.pests];
  for (const p of fieldCatalog.pests) {
    const idx = pests.findIndex((x) => x.id === p.id);
    if (idx >= 0) pests[idx] = { ...pests[idx], ...p };
    else pests.push(p);
  }

  const diseases = [...base.diseases];
  for (const d of fieldCatalog.diseases) {
    const idx = diseases.findIndex((x) => x.id === d.id);
    if (idx >= 0) diseases[idx] = { ...diseases[idx], ...d };
    else diseases.push(d);
  }

  return {
    ...base,
    pests,
    diseases,
    weeds: fieldCatalog.weeds.length ? fieldCatalog.weeds : base.weeds,
  };
}

export function getCropFieldGuidePestListForCrop(slug: string) {
  const entry = guideBySlug.get(slug);
  if (!entry) return [];

  const { guide, config } = entry;
  return guide.pest_database.map((p, i) => ({
    id: resolvePestId(p.pest_name, config.pestIds) || `p${i + 1}`,
    name: pestDisplayName(p.pest_name),
    scientific: pestScientificName(p.pest_name),
    desc: p.damage_symptoms,
    damage: p.damage_symptoms.slice(0, 72),
    spread: p.favorable_conditions.slice(0, 48),
    loss: "Yield loss if untreated above ETL",
    etl: p.etl,
    attackStage: p.crop_stage_attacked,
    monitoring: p.monitoring,
    risk: "high" as const,
    ipm: {
      prevention: [p.preventive],
      monitoring: [p.monitoring],
      cultural: [p.cultural_control],
      biological: [p.biological_control],
      chemical: [
        chemLine(p.chemical_early_curative),
        !p.chemical_hard_curative.technical?.toLowerCase().startsWith("unknown")
          ? chemLine(p.chemical_hard_curative)
          : "",
      ].filter(Boolean),
    },
  }));
}

export function getCropFieldGuideDiseaseListForCrop(slug: string) {
  const entry = guideBySlug.get(slug);
  if (!entry) return [];

  const { guide, config } = entry;
  return guide.disease_database.map((d, i) => ({
    id: resolveDiseaseId(d.pest_name, config.diseaseIds) || `d${i + 1}`,
    name: pestDisplayName(d.pest_name),
    scientific: pestScientificName(d.pest_name),
    risk: inferDiseaseCategory(d.pest_name) === "bacterial" ? ("high" as const) : ("medium" as const),
    type: inferDiseaseCategory(d.pest_name),
    desc: d.damage_symptoms,
    conditions: d.favorable_conditions,
    ipm: {
      prevention: [d.preventive],
      monitoring: [d.monitoring],
      cultural: [d.cultural_control],
      biological: [d.biological_control],
      chemical: [
        chemLine(d.chemical_early_curative, true),
        !d.chemical_hard_curative.technical?.toLowerCase().startsWith("unknown")
          ? chemLine(d.chemical_hard_curative, true)
          : "",
      ].filter(Boolean),
    },
    fracNote: d.resistance_management,
  }));
}

export function getCropFieldGuideSlugs(): string[] {
  return [...guideBySlug.keys()];
}
