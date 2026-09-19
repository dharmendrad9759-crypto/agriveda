/**
 * Crop-page job-card photos — unique per crop and per tab.
 * Prefer generated stills in /images/crops/tabs/{slug}-{tab}.jpg,
 * then crop-specific growth / pest / disease / deficiency art.
 * Never fall back to the shared job-* generic stills.
 */

import { getCropPestDisease } from "@/data/pest-disease";
import type { CropTabId } from "@/lib/crops/crop-tabs";
import { normalizeCropSlug, resolveCropImage } from "@/lib/crops/cropImages";
import {
  cropGrowthStagePath,
  type GrowthStageKind,
} from "@/lib/crops/growthStageImages";
import { getDiseaseSpeciesImage, getPestSpeciesImage } from "@/lib/pests/threatSpeciesImages";
import { getWeedCardImage } from "@/lib/weeds/weedStageImages";

const GROWTH_STAGE_CROPS = new Set([
  "bajra",
  "brinjal",
  "cauliflower",
  "chilli",
  "cotton",
  "cucumber",
  "maize",
  "moongfali",
  "onion",
  "paddy",
  "potato",
  "soybean",
  "sugarcane",
  "tomato",
  "wheat",
]);

const DEFICIENCY_CROPS = new Set([
  "bajra",
  "brinjal",
  "cauliflower",
  "chilli",
  "cotton",
  "cucumber",
  "maize",
  "moongfali",
  "onion",
  "paddy",
  "potato",
  "soybean",
  "sugarcane",
  "tomato",
  "wheat",
]);

/** Crop-in-frame problem stills — better than isolated insect macros. */
const CROP_PROBLEM_PHOTO: Record<string, { pest?: string; disease?: string }> = {
  tomato: {
    pest: "/images/crop-problems/tomato-borer.jpg",
    disease: "/images/crop-problems/tomato-blight.jpg",
  },
  paddy: {
    pest: "/images/crop-problems/paddy-stem-borer.jpg",
    disease: "/images/crop-problems/paddy-blast.jpg",
  },
  brinjal: {
    pest: "/images/crop-problems/brinjal-borer.jpg",
    disease: "/images/crop-problems/brinjal-wilt.jpg",
  },
  chilli: {
    pest: "/images/crop-problems/chilli-thrips.jpg",
    disease: "/images/crop-problems/chilli-anthracnose.jpg",
  },
  cauliflower: {
    pest: "/images/crop-problems/cauli-dbm.jpg",
    disease: "/images/crop-problems/cauli-black-rot.jpg",
  },
};

/** Keep in sync with files in public/images/crops/tabs/ */
const TAB_STILL_CROPS = [
  "tomato",
  "paddy",
  "wheat",
  "potato",
  "onion",
  "chilli",
  "brinjal",
  "cauliflower",
  "cucumber",
  "maize",
  "cotton",
  "sugarcane",
  "bajra",
  "soybean",
  "moongfali",
  "mustard",
  "bhindi",
  "banana",
  "mango",
  "grapes",
  "ginger",
  "garlic",
  "pulses",
  "moong",
  "chana",
  "masoor",
  "urad",
] as const;

const TAB_STILL_KINDS = ["varieties", "fertilizer", "irrigation", "market"] as const;

const GENERATED_TAB_STILLS = new Set(
  TAB_STILL_CROPS.flatMap((crop) => TAB_STILL_KINDS.map((kind) => `${crop}-${kind}`))
);

function generatedStill(slug: string, tab: CropTabId): string | undefined {
  const key = `${slug}-${tab}`;
  if (!GENERATED_TAB_STILLS.has(key)) return undefined;
  return `/images/crops/tabs/${key}.jpg`;
}

function growthPhoto(slug: string, kind: GrowthStageKind, cropImg: string): string {
  if (!GROWTH_STAGE_CROPS.has(slug)) return cropImg;
  return cropGrowthStagePath(slug, kind);
}

function firstPestPhoto(slug: string): string | undefined {
  const problem = CROP_PROBLEM_PHOTO[slug]?.pest;
  if (problem) return problem;
  const pest = getCropPestDisease(slug).pests[0];
  return pest ? getPestSpeciesImage(pest.scientificName) : undefined;
}

function firstDiseasePhoto(slug: string): string | undefined {
  const problem = CROP_PROBLEM_PHOTO[slug]?.disease;
  if (problem) return problem;
  const disease = getCropPestDisease(slug).diseases[0];
  return disease ? getDiseaseSpeciesImage(disease.pathogen) : undefined;
}

function firstWeedPhoto(slug: string): string | undefined {
  const weed = getCropPestDisease(slug).weeds[0];
  if (!weed) return undefined;
  return getWeedCardImage(weed.scientificName) ?? undefined;
}

export function getCropTabPhoto(slug: string, tab: CropTabId): string {
  const key = normalizeCropSlug(slug);
  const cropImg = resolveCropImage({ slug: key });
  const still = generatedStill(key, tab);
  if (still) return still;

  switch (tab) {
    case "varieties":
    case "overview":
    case "faq":
    case "expert":
    case "market":
      return cropImg;
    case "field-prep":
      return growthPhoto(key, "sow", cropImg);
    case "fertilizer":
    case "growth":
      return growthPhoto(key, "veg", cropImg);
    case "irrigation":
    case "calendar":
      return growthPhoto(key, "flower", cropImg);
    case "pests":
      return firstPestPhoto(key) ?? cropImg;
    case "diseases":
      return firstDiseasePhoto(key) ?? cropImg;
    case "nutrients":
      return DEFICIENCY_CROPS.has(key)
        ? `/images/deficiencies/${key}-nitrogen.jpg`
        : cropImg;
    case "weeds":
      return firstWeedPhoto(key) ?? cropImg;
    case "harvest":
      return growthPhoto(key, "harvest", cropImg);
    default:
      return cropImg;
  }
}
