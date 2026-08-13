/**
 * Merge research-grade crop dossier overlays into management profiles.
 * Applied LAST so dossier wins over IPM/field-guide for covered sections.
 */
import type { CropManagementProfile } from "@/types/crop-management";
import type { CropManagementWithDossier, ResearchDossierOverlay } from "@/types/crop-dossier";
import { chilliDossier } from "@/data/dossiers/chilli";
import { cucumberDossier } from "@/data/dossiers/cucumber";
import { moongfaliDossier } from "@/data/dossiers/moongfali";
import { paddyDossier } from "@/data/dossiers/paddy";
import { maizeDossier } from "@/data/dossiers/maize";
import { potatoDossier } from "@/data/dossiers/potato";
import { tomatoDossier } from "@/data/dossiers/tomato";
import { soybeanDossier } from "@/data/dossiers/soybean";
import { wheatDossier } from "@/data/dossiers/wheat";
import { bajraDossier } from "@/data/dossiers/bajra";
import { brinjalDossier } from "@/data/dossiers/brinjal";
import { cauliflowerDossier } from "@/data/dossiers/cauliflower";
import { sugarcaneDossier } from "@/data/dossiers/sugarcane";
import { onionDossier } from "@/data/dossiers/onion";
import { cottonDossier } from "@/data/dossiers/cotton";
import { moongDossier } from "@/data/dossiers/moong";
import { attachModernTechnicals } from "@/lib/crops/modernTechnicalBridge";
import { normalizeCropSlug } from "@/lib/crops/cropImages";

const DOSSIERS: Record<string, ResearchDossierOverlay> = {
  chilli: chilliDossier,
  cucumber: cucumberDossier,
  moongfali: moongfaliDossier,
  groundnut: moongfaliDossier,
  paddy: paddyDossier,
  maize: maizeDossier,
  potato: potatoDossier,
  tomato: tomatoDossier,
  soybean: soybeanDossier,
  wheat: wheatDossier,
  bajra: bajraDossier,
  brinjal: brinjalDossier,
  cauliflower: cauliflowerDossier,
  sugarcane: sugarcaneDossier,
  onion: onionDossier,
  cotton: cottonDossier,
  moong: moongDossier,
};

export function getResearchDossier(slug: string): ResearchDossierOverlay | null {
  return DOSSIERS[normalizeCropSlug(slug)] ?? null;
}

export function listResearchDossierSlugs(): string[] {
  return Object.keys(DOSSIERS).filter((k) => k !== "groundnut");
}

export function mergeResearchDossierIntoProfile(
  profile: CropManagementProfile | null
): CropManagementWithDossier | null {
  if (!profile) return null;
  const dossier = getResearchDossier(profile.slug);
  if (!dossier) return attachModernTechnicals(profile);

  const merged: CropManagementWithDossier = {
    ...profile,
    growthStages: dossier.growthStages?.length ? dossier.growthStages : profile.growthStages,
    irrigationSchedule: dossier.irrigationSchedule?.length
      ? dossier.irrigationSchedule
      : profile.irrigationSchedule,
    fertilizerSchedule: dossier.fertilizerSchedule?.length
      ? dossier.fertilizerSchedule
      : profile.fertilizerSchedule,
    micronutrients: dossier.micronutrients?.length
      ? dossier.micronutrients
      : profile.micronutrients,
    pestManagement: dossier.pestManagement?.length
      ? dossier.pestManagement
      : profile.pestManagement,
    diseaseManagement: dossier.diseaseManagement?.length
      ? dossier.diseaseManagement
      : profile.diseaseManagement,
    weedManagement: dossier.weedManagement?.length
      ? dossier.weedManagement
      : profile.weedManagement,
    weedProgram: dossier.weedProgram ?? profile.weedProgram,
    physiologicalDisorders: dossier.physiologicalDisorders?.length
      ? dossier.physiologicalDisorders
      : profile.physiologicalDisorders,
    faqs: dossier.faqs?.length
      ? [...dossier.faqs, ...profile.faqs].slice(0, 24)
      : profile.faqs,
    dossierSource: dossier.sourceLabel,
    dossierLegalNote: dossier.legalNote,
    dossierTankMixCompatible: dossier.tankMixCompatible,
    dossierTankMixIncompatible: dossier.tankMixIncompatible,
    dossierResistanceRotation: dossier.resistanceRotation,
    dossierPgrNotes: dossier.pgrNotes,
  };

  return attachModernTechnicals(merged);
}
