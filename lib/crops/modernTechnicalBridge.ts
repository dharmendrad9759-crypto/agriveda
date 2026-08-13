import type { CropManagementProfile, CropSprayProduct, CropWeedProgram, HerbicideStep } from "@/types/crop-management";
import type { CropManagementWithDossier } from "@/types/crop-dossier";
import { MODERN_TECHNICALS, type ModernKind, type ModernTechnical } from "@/data/modern-technicals";
import { normalizeCropSlug } from "@/lib/crops/cropImages";

const LABEL_POINT = "लेबल पर लिखी फसल, खुराक और PHI मानें — यह आधुनिक टेक्निकल विकल्प है";

function normalizeHay(s: string): string {
  return s.toLowerCase().replace(/[\u2013\u2014]/g, "-");
}

function cropHas(entry: ModernTechnical, cropSlug: string): boolean {
  const slug = normalizeCropSlug(cropSlug);
  return entry.crops.includes(slug);
}

function keysHit(entry: ModernTechnical, haystack: string): boolean {
  const hay = normalizeHay(haystack);
  return entry.keys.some((k) => hay.includes(k.toLowerCase()));
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
    (e) => e.kind === kind && cropHas(e, cropSlug) && keysHit(e, haystack)
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
      haystack: `${pest.pestName} ${pest.scientificName} ${pest.symptoms.join(" ")} ${pest.identification}`,
    });
    return { ...pest, sprayProducts: mergeSprayProducts(pest.sprayProducts, extra) };
  });

  const diseaseManagement = (profile.diseaseManagement ?? []).map((disease) => {
    const extra = matchModernTechnicals({
      cropSlug: slug,
      kind: "disease",
      haystack: `${disease.diseaseName} ${disease.pathogen} ${disease.symptoms.join(" ")} ${disease.type}`,
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

function overlapName(a: string, b: string): boolean {
  const na = a.toLowerCase().trim();
  const nb = b.toLowerCase().trim();
  if (!na || !nb) return false;
  if (na.includes(nb) || nb.includes(na)) return true;
  const tokens = na.split(/[^a-z\u0900-\u097f]+/).filter((t) => t.length >= 4);
  return tokens.some((t) => nb.includes(t));
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
    const hit = profile.pestManagement.find(
      (p) => overlapName(p.pestName, name) || overlapName(p.scientificName, scientific ?? "")
    );
    if (hit?.sprayProducts?.length) return hit.sprayProducts;
  } else {
    const hit = profile.diseaseManagement.find(
      (d) => overlapName(d.diseaseName, name) || overlapName(d.pathogen, scientific ?? "")
    );
    if (hit?.sprayProducts?.length) return hit.sprayProducts;
  }

  return matchModernTechnicals({
    cropSlug: profile.slug,
    kind: type,
    haystack: `${name} ${scientific ?? ""}`,
  });
}
