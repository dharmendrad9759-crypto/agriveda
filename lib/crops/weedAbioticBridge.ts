import weedsBatch from "@/data/imports/agriveda-weeds-abiotic-batch.json";
import type { CropPestDiseaseData, WeedItem } from "@/data/pest-disease";
import type {
  AbioticStressItem,
  CropManagementProfile,
  CropWeedProgram,
  WeedManagement,
} from "@/types/crop-management";
import { cropLabelToSlug } from "@/lib/crops/ipmDataBridge";
import { expandAndPhotoWeeds, isValidWeedScientific } from "@/lib/weeds/expandCropWeeds";
import { getWeedCardImage } from "@/lib/weeds/weedStageImages";

export interface WeedHerbicide {
  technical: string;
  dose: string;
  timing: string;
  targets?: string;
  note?: string;
}

export interface WeedAbioticRecord {
  crop: string;
  scientificName: string;
  weeds: {
    keyWeeds: string[];
    criticalPeriod: string;
    management: {
      prevention: string[];
      monitoring: string[];
      cultural: string[];
      chemical: WeedHerbicide[];
    };
  };
  abioticStress: {
    stress: string;
    symptoms: string;
    cause: string;
    management: {
      prevention: string[];
      monitoring: string[];
      cultural: string[];
      chemical: { input: string; dose: string; stage: string; note?: string }[];
    };
  }[];
}

const batch = weedsBatch as { crops: WeedAbioticRecord[] };

const slugIndex = new Map<string, WeedAbioticRecord>();
for (const record of batch.crops) {
  slugIndex.set(cropLabelToSlug(record.crop), record);
}

export function getWeedAbioticRecord(slug: string): WeedAbioticRecord | null {
  return slugIndex.get(slug) ?? null;
}

export function getWeedAbioticSlugs(): string[] {
  return [...slugIndex.keys()];
}

function formatHerbicide(h: WeedHerbicide): string {
  const parts = [`${h.technical} @ ${h.dose}`, h.timing && `(${h.timing})`, h.targets && `→ ${h.targets}`];
  return parts.filter(Boolean).join(" ");
}

export function mapWeedProgram(record: WeedAbioticRecord): CropWeedProgram {
  const w = record.weeds;
  return {
    keyWeeds: w.keyWeeds,
    criticalPeriod: w.criticalPeriod,
    prevention: w.management.prevention,
    monitoring: w.management.monitoring,
    cultural: w.management.cultural,
    chemical: w.management.chemical,
  };
}

export function mapWeedManagementEntries(program: CropWeedProgram): WeedManagement[] {
  const pe = program.chemical.filter((c) => /PE|pre/i.test(c.timing));
  const poe = program.chemical.filter((c) => /EPoE|PoE|post/i.test(c.timing));

  return [
    {
      weedName: program.keyWeeds[0]?.split("(")[0]?.trim() ?? "Major weeds",
      scientificName: program.keyWeeds.join("; "),
      type: "Mixed (grass, sedge, broadleaf)",
      criticalPeriod: program.criticalPeriod,
      preEmergenceHerbicide: pe.map(formatHerbicide).join(" · ") || "See chemical ladder",
      postEmergenceHerbicide: poe.map(formatHerbicide).join(" · ") || "See chemical ladder",
      hracGroup: "Rotate HRAC groups",
      dose: pe[0]?.dose ?? poe[0]?.dose ?? "As per label",
    },
    ...program.keyWeeds.slice(1, 4).map((kw) => ({
      weedName: kw.split("(")[0]?.trim() ?? kw,
      scientificName: kw.match(/\(([^)]+)\)/)?.[1] ?? kw,
      type: kw.toLowerCase().includes("grass")
        ? "Grassy"
        : kw.toLowerCase().includes("sedge")
          ? "Sedge"
          : "Broadleaf",
      criticalPeriod: program.criticalPeriod,
      preEmergenceHerbicide: pe[0] ? formatHerbicide(pe[0]) : "—",
      postEmergenceHerbicide: poe[0] ? formatHerbicide(poe[0]) : "—",
      hracGroup: "—",
      dose: "—",
    })),
  ];
}

export function mapAbioticStress(record: WeedAbioticRecord): AbioticStressItem[] {
  return record.abioticStress.map((a) => ({
    stressName: a.stress,
    symptoms: a.symptoms,
    cause: a.cause,
    prevention: a.management.prevention,
    monitoring: a.management.monitoring,
    cultural: a.management.cultural,
    corrections: a.management.chemical,
  }));
}

export function buildWeedCatalogWeeds(_slug: string, program: CropWeedProgram): WeedItem[] {
  const out: WeedItem[] = [];
  for (let i = 0; i < program.keyWeeds.length; i++) {
    const kw = program.keyWeeds[i]!;
    const name = kw.split("(")[0]?.trim() ?? kw;
    const sci = kw.match(/\(([^)]+)\)/)?.[1] ?? kw;
    if (!isValidWeedScientific(sci)) continue;
    const type = kw.toLowerCase().includes("grass")
      ? "Grassy"
      : kw.toLowerCase().includes("sedge")
        ? "Sedge"
        : "Broadleaf";
    out.push({
      id: `w${out.length + 1}`,
      name,
      scientificName: sci,
      type,
      image: getWeedCardImage(sci) ?? undefined,
      criticalPeriod: program.criticalPeriod,
      preEmergence: program.chemical.find((c) => /PE/i.test(c.timing))
        ? formatHerbicide(program.chemical.find((c) => /PE/i.test(c.timing))!)
        : "Pre-emergence herbicide at label dose",
      postEmergence: program.chemical.find((c) => /PoE|EPoE/i.test(c.timing))
        ? formatHerbicide(program.chemical.find((c) => /PoE|EPoE/i.test(c.timing))!)
        : "Early post-emergence selective herbicide",
      culturalControl: program.cultural[0] ?? "Hand weeding in critical period",
    });
    if (out.length >= 6) break;
  }
  return out;
}

export function mergeWeedAbioticIntoProfile(profile: CropManagementProfile): CropManagementProfile {
  const record = getWeedAbioticRecord(profile.slug);
  if (!record) return profile;

  const weedProgram = mapWeedProgram(record);
  const abioticStress = mapAbioticStress(record);

  return {
    ...profile,
    weedProgram,
    weedManagement: mapWeedManagementEntries(weedProgram),
    abioticStress,
    physiologicalDisorders: abioticStress.map(
      (a) => `${a.stressName}: ${a.symptoms.slice(0, 120)}${a.symptoms.length > 120 ? "…" : ""}`
    ),
  };
}

export function mergeWeedAbioticCatalog(base: CropPestDiseaseData): CropPestDiseaseData {
  const record = getWeedAbioticRecord(base.slug);
  const fromBatch = record
    ? buildWeedCatalogWeeds(base.slug, mapWeedProgram(record))
    : [];
  const weeds = expandAndPhotoWeeds(base.slug, [...base.weeds, ...fromBatch]);
  return {
    ...base,
    weeds,
  };
}

export function getWeedProgramForCrop(slug: string): CropWeedProgram | null {
  const record = getWeedAbioticRecord(slug);
  return record ? mapWeedProgram(record) : null;
}

export function getAbioticStressForCrop(slug: string): AbioticStressItem[] {
  const record = getWeedAbioticRecord(slug);
  return record ? mapAbioticStress(record) : [];
}
