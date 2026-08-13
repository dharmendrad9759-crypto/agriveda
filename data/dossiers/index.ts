/**
 * Barrel export for all research dossier overlays.
 * Keep in sync with the DOSSIERS map in lib/crops/researchDossierBridge.ts.
 */
import type { ResearchDossierOverlay } from "@/types/crop-dossier";

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

export {
  chilliDossier,
  cucumberDossier,
  moongfaliDossier,
  paddyDossier,
  maizeDossier,
  potatoDossier,
  tomatoDossier,
  soybeanDossier,
  wheatDossier,
  bajraDossier,
  brinjalDossier,
  cauliflowerDossier,
  sugarcaneDossier,
  onionDossier,
  cottonDossier,
  moongDossier,
};

/** Canonical slug → dossier overlay (aliases handled by normalizeCropSlug at the bridge). */
export const DOSSIERS_BY_SLUG: Record<string, ResearchDossierOverlay> = {
  chilli: chilliDossier,
  cucumber: cucumberDossier,
  moongfali: moongfaliDossier,
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

/** All canonical dossier slugs available in the app. */
export const DOSSIER_SLUGS: string[] = Object.keys(DOSSIERS_BY_SLUG);
