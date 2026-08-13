import type { CropManagementProfile, CropSprayProduct, CropWeedProgram, HerbicideStep } from "@/types/crop-management";
import type { CropManagementWithDossier } from "@/types/crop-dossier";
import type { StageSprayRecommendation } from "@/types/crop-protection";
import { MODERN_TECHNICALS, type ModernKind, type ModernTechnical } from "@/data/modern-technicals";
import { normalizeCropSlug } from "@/lib/crops/cropImages";
import { pickFarmerStages } from "@/lib/pest/farmerSpray";
import { stripMoaCodes } from "@/lib/crops/farmerSprayDose";
import {
  classifyChemText,
  distinctiveNameOverlap,
  scientificNamesMatch,
  specificKeyHits,
} from "@/lib/crops/pestGuild";

const LABEL_POINT = "लेबल पर लिखी फसल, खुराक और PHI मानें — यह आधुनिक टेक्निकल विकल्प है";

function cropHas(entry: ModernTechnical, cropSlug: string): boolean {
  const slug = normalizeCropSlug(cropSlug);
  return entry.crops.includes(slug);
}

function identityHay(name: string, scientific?: string): string {
  return `${name} ${scientific ?? ""}`.trim();
}

function entryMatchesIdentity(entry: ModernTechnical, identity: string): boolean {
  const threatGuilds = classifyChemText(identity);
  const chemGuilds = classifyChemText(entry.keys.join(" "));

  if (threatGuilds.size > 0 && chemGuilds.size > 0) {
    for (const g of threatGuilds) {
      if (chemGuilds.has(g)) return true;
    }
    return false;
  }

  return entry.keys.some((k) => specificKeyHits(identity, k));
}

export function toSprayProduct(entry: ModernTechnical): CropSprayProduct {
  return {
    technical: `${entry.name} ${entry.formulation}`.replace(/\s+/g, " ").trim(),
    brands: entry.brands.filter(Boolean),
    doseAcre: entry.doseAcre,
    bestStage: entry.bestStage,
    bestUseCondition: entry.targetHi,
    points: [entry.moa, LABEL_POINT],
    sourceConfidence: "label-check",
  };
}

export function matchModernTechnicals(opts: {
  cropSlug: string;
  kind: ModernKind;
  haystack: string;
}): CropSprayProduct[] {
  const { cropSlug, kind, haystack } = opts;
  return MODERN_TECHNICALS.filter(
    (e) => e.kind === kind && cropHas(e, cropSlug) && entryMatchesIdentity(e, haystack)
  ).map(toSprayProduct);
}

function technicalKey(p: CropSprayProduct): string {
  return (p.technical || "")
    .toLowerCase()
    .replace(/[^a-z0-9+]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function mergeSprayProducts(
  existing: CropSprayProduct[] | undefined,
  extra: CropSprayProduct[]
): CropSprayProduct[] {
  const out: CropSprayProduct[] = [];
  const seen = new Set<string>();
  for (const p of [...(existing ?? []), ...extra]) {
    const key = technicalKey(p);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

function mergeHerbicideSteps(program: CropWeedProgram | undefined, extra: CropSprayProduct[]): CropWeedProgram | undefined {
  if (!program && !extra.length) return program;
  const base: CropWeedProgram = program ?? {
    keyWeeds: [],
    criticalPeriod: "",
    prevention: [],
    monitoring: [],
    cultural: [],
    chemical: [],
  };
  const existingKeys = new Set(
    base.chemical.map((c) => technicalKey({ technical: c.technical, doseAcre: c.dose }))
  );
  const added: HerbicideStep[] = extra
    .filter((p) => !existingKeys.has(technicalKey(p)))
    .map((p) => ({
      technical: p.technical,
      dose: p.doseAcre,
      timing: p.bestStage || "लेबल अनुसार",
      targets: p.bestUseCondition,
      note: "आधुनिक टेक्निकल — लेबल जाँचें",
    }));
  return { ...base, chemical: [...base.chemical, ...added] };
}

export function attachModernTechnicals(
  profile: CropManagementProfile | CropManagementWithDossier
): CropManagementWithDossier {
  const slug = profile.slug;
  const pestManagement = (profile.pestManagement ?? []).map((pest) => {
    const extra = matchModernTechnicals({
      cropSlug: slug,
      kind: "pest",
      haystack: identityHay(pest.pestName, pest.scientificName),
    });
    return { ...pest, sprayProducts: mergeSprayProducts(pest.sprayProducts, extra) };
  });

  const diseaseManagement = (profile.diseaseManagement ?? []).map((disease) => {
    const extra = matchModernTechnicals({
      cropSlug: slug,
      kind: "disease",
      haystack: identityHay(disease.diseaseName, disease.pathogen),
    });
    return { ...disease, sprayProducts: mergeSprayProducts(disease.sprayProducts, extra) };
  });

  const weedExtra = MODERN_TECHNICALS.filter(
    (e) => e.kind === "weed" && cropHas(e, slug)
  ).map(toSprayProduct);
  const weedProgram = mergeHerbicideSteps(profile.weedProgram, weedExtra);

  const pgrProducts = MODERN_TECHNICALS.filter(
    (e) => e.kind === "pgr" && cropHas(e, slug)
  ).map(toSprayProduct);

  return {
    ...profile,
    pestManagement,
    diseaseManagement,
    weedProgram,
    pgrProducts,
  };
}

function findNamedRow<T extends { sprayProducts?: CropSprayProduct[] }>(
  rows: T[],
  name: string,
  scientific: string | undefined,
  nameOf: (row: T) => string,
  sciOf: (row: T) => string
): T | undefined {
  const sciHit = scientific
    ? rows.find((row) => scientificNamesMatch(sciOf(row), scientific))
    : undefined;
  if (sciHit) return sciHit;
  return rows.find((row) => distinctiveNameOverlap(nameOf(row), name));
}

export function spraysForThreatFromProfile(
  profile: CropManagementProfile | CropManagementWithDossier | null | undefined,
  type: "pest" | "disease" | "weed",
  name: string,
  scientific?: string
): CropSprayProduct[] {
  if (!profile) return [];

  if (type === "weed") {
    return (profile.weedProgram?.chemical ?? []).map((c) => ({
      technical: c.technical,
      doseAcre: c.dose,
      bestStage: c.timing,
      bestUseCondition: c.targets,
      points: c.note ? [c.note] : undefined,
      sourceConfidence: /लेबल|आधुनिक/i.test(c.note ?? "") ? "label-check" : "high",
    }));
  }

  if (type === "pest") {
    const hit = findNamedRow(
      profile.pestManagement,
      name,
      scientific,
      (p) => p.pestName,
      (p) => p.scientificName
    );
    if (hit?.sprayProducts?.length) return hit.sprayProducts;
  } else {
    const hit = findNamedRow(
      profile.diseaseManagement,
      name,
      scientific,
      (d) => d.diseaseName,
      (d) => d.pathogen
    );
    if (hit?.sprayProducts?.length) return hit.sprayProducts;
  }

  return matchModernTechnicals({
    cropSlug: profile.slug,
    kind: type,
    haystack: identityHay(name, scientific),
  });
}

export function productsFromStageSprays(
  stages: StageSprayRecommendation[] | undefined,
  hi: boolean
): CropSprayProduct[] {
  const farmer = pickFarmerStages(stages ?? []);
  const out: CropSprayProduct[] = [];
  for (const s of farmer) {
    const parts = stripMoaCodes(s.chemistry)
      .split(/\s*(?:या|\bor\b|,|\/)\s*/i)
      .map((t) => t.trim())
      .filter((t) => t.length > 3);
    const isAdvanced = s.stage === "advanced";
    const dose = stripMoaCodes(s.dose);
    const useWhen = hi
      ? isAdvanced
        ? "अगर तेज़ फैल रहा हो"
        : "शुरुआत में (हल्की लग)"
      : isAdvanced
        ? "If spreading fast"
        : "Start here (early)";
    for (const chem of parts.length ? parts : [stripMoaCodes(s.chemistry)]) {
      out.push({
        technical: chem,
        doseAcre: dose,
        bestStage: s.label,
        bestUseCondition: useWhen,
        sourceConfidence: "high",
      });
    }
  }
  return out;
}

export function buildThreatSprayList(opts: {
  profile: CropManagementProfile | CropManagementWithDossier | null | undefined;
  type: "pest" | "disease" | "weed";
  name: string;
  scientific?: string;
  stageSprays?: StageSprayRecommendation[];
  hi: boolean;
}): CropSprayProduct[] {
  const fromProfile = spraysForThreatFromProfile(
    opts.profile,
    opts.type,
    opts.name,
    opts.scientific
  );
  if (opts.type === "weed") return fromProfile;
  const fromStages = productsFromStageSprays(opts.stageSprays, opts.hi);
  return mergeSprayProducts(fromProfile, fromStages);
}
