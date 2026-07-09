import type { Crop } from "@/types/crop";
import type {
  EnrichedCropDetail,
  IpmPractice,
  NutrientDeficiencyItem,
} from "@/types/crop-detail";
import { getCropManagementProfile } from "@/data/crop-management";
import { cropDashboardData } from "@/data/crop-dashboard";
import {
  buildFallbackTiming,
  CROP_TIMING,
  getEstablishment,
} from "@/data/crop-detail-timing";

const REQUIRED_NUTRIENTS: {
  nutrient: string;
  role: string;
  defaultSymptoms: string;
  defaultCause: string;
  defaultSolution: string;
}[] = [
  {
    nutrient: "Nitrogen",
    role: "Leaf growth & vegetative vigour",
    defaultSymptoms: "Older leaves pale yellow; stunted growth",
    defaultCause: "Low soil N or heavy leaching",
    defaultSolution: "Urea in split doses as per stage",
  },
  {
    nutrient: "Potassium",
    role: "Fruit quality, disease resistance",
    defaultSymptoms: "Leaf edge scorch, weak stems",
    defaultCause: "Low K or high Ca/Mg imbalance",
    defaultSolution: "MOP / SOP top-dress at critical stage",
  },
  {
    nutrient: "Calcium",
    role: "Cell wall, fruit firmness",
    defaultSymptoms: "Blossom end rot, tip burn on young leaves",
    defaultCause: "Irregular irrigation + low Ca uptake",
    defaultSolution: "Calcium nitrate foliar; maintain even irrigation",
  },
  {
    nutrient: "Magnesium",
    role: "Chlorophyll & photosynthesis",
    defaultSymptoms: "Interveinal chlorosis on older leaves",
    defaultCause: "Low Mg or high K antagonism",
    defaultSolution: "MgSO₄ foliar 0.5% or dolomite in acidic soil",
  },
  {
    nutrient: "Sulfur",
    role: "Protein synthesis & oil content",
    defaultSymptoms: "Uniform pale yellow on young leaves",
    defaultCause: "Low organic matter / no S fertilizer",
    defaultSolution: "Gypsum 100-200 kg/acre or ammonium sulphate",
  },
  {
    nutrient: "Iron",
    role: "Chlorophyll formation",
    defaultSymptoms: "Young leaves yellow, veins stay green",
    defaultCause: "High pH / waterlogged calcareous soil",
    defaultSolution: "Fe-EDDHA chelate soil or ferrous sulphate foliar",
  },
  {
    nutrient: "Zinc",
    role: "Enzyme activation & flowering",
    defaultSymptoms: "Small leaves, interveinal chlorosis, rosetting",
    defaultCause: "Alkaline soil, high P, or low Zn",
    defaultSolution: "ZnSO₄ 25 kg/ha basal or 0.5% foliar",
  },
];

const DEFAULT_IPM: IpmPractice[] = [
  {
    name: "Neem oil / NSKE 5%",
    timing: "Preventive — every 10-15 days",
    dose: "3000 ppm spray (5 ml/L neem oil + sticker)",
    notes: "Spray evening hours; safe for beneficials at low dose",
  },
  {
    name: "Trichoderma viride",
    timing: "At sowing / transplanting",
    dose: "5-10 g/kg seed or 2.5 kg/acre soil drench",
    notes: "Antagonistic fungus — reduces soil-borne disease",
  },
  {
    name: "Pheromone / sticky traps",
    timing: "From vegetative stage",
    dose: "4-6 traps per acre",
    notes: "Monitor pest population before chemical spray",
  },
  {
    name: "Conserve natural enemies",
    timing: "Full crop season",
    dose: "Avoid broad-spectrum insecticide at flowering",
    notes: "Ladybird beetle, lacewing, spiders — do not spray unnecessarily",
  },
];

function mergeNutrients(crop: Crop): NutrientDeficiencyItem[] {
  const profile = getCropManagementProfile(crop.slug);
  const fromProfile = profile?.nutrientDeficiencies ?? [];

  return REQUIRED_NUTRIENTS.map((req) => {
    const fromCrop = crop.nutrientDeficiencies.find(
      (n) => n.nutrient.toLowerCase() === req.nutrient.toLowerCase()
    );
    const fromMgmt = fromProfile.find(
      (n) => n.name.toLowerCase() === req.nutrient.toLowerCase()
    );

    return {
      nutrient: req.nutrient,
      role: fromMgmt?.role ?? req.role,
      symptoms:
        fromCrop?.symptoms ??
        fromMgmt?.deficiencySymptoms.join("; ") ??
        req.defaultSymptoms,
      cause: fromCrop?.cause ?? req.defaultCause,
      solution:
        fromCrop?.solution ??
        fromMgmt?.management.join("; ") ??
        req.defaultSolution,
    };
  });
}

function growthStagesFromProfile(slug: string, crop: Crop) {
  const profile = getCropManagementProfile(slug);
  if (profile?.growthStages?.length) return profile.growthStages;

  const dashboard = cropDashboardData[slug];
  if (dashboard?.growthStages?.length) {
    return dashboard.growthStages.map((s) => ({
      title: s.name,
      period: s.das,
      keyPoints:
        s.status === "current"
          ? ["Current stage — monitor closely"]
          : ["Monitor crop health at this stage"],
    }));
  }

  const midStage = crop.fertilizerSchedule.stageWise[0];
  return [
    {
      title: "Sowing / Establishment",
      period: getEstablishment(slug) === "transplant" ? "0 DAT" : "0 DAS",
      keyPoints: [crop.sowingGuide.sowingMethod, crop.sowingGuide.bestSowingTime],
    },
    ...(midStage
      ? [
          {
            title: midStage.stage,
            period: "Mid season",
            keyPoints: midStage.details.slice(0, 3),
          },
        ]
      : []),
    {
      title: "Harvest",
      period: crop.harvestAndYield.harvestingTime,
      keyPoints: crop.harvestAndYield.maturitySigns.slice(0, 3),
    },
  ];
}

function buildIpm(slug: string, crop: Crop): IpmPractice[] {
  const profile = getCropManagementProfile(slug);
  const bioFromPests =
    profile?.pestManagement.flatMap((p) =>
      p.biologicalControl.map((b) => ({
        name: b,
        timing: `When ${p.pestName} is below ETL`,
        dose: "As per IPM calendar",
        notes: p.pestName,
      }))
    ) ?? [];

  const bioFromDiseases =
    profile?.diseaseManagement.flatMap((d) =>
      d.biologicalControl.map((b) => ({
        name: b,
        timing: "Preventive / early infection",
        dose: "As per label",
        notes: d.diseaseName,
      }))
    ) ?? [];

  const unique = [...DEFAULT_IPM, ...bioFromPests, ...bioFromDiseases];
  const seen = new Set<string>();
  return unique.filter((item) => {
    const key = item.name.slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildWeeds(slug: string, crop: Crop) {
  const profile = getCropManagementProfile(slug);
  if (profile?.weedManagement?.length) {
    return profile.weedManagement.map((w) => ({
      name: w.weedName,
      detail: `${w.type} · Critical: ${w.criticalPeriod}`,
      timing: `Pre: ${w.preEmergenceHerbicide} | Post: ${w.postEmergenceHerbicide}`,
    }));
  }
  return crop.cropProtection.weedManagement.map((w, i) => ({
    name: `Weed control ${i + 1}`,
    detail: w,
    timing: "First 30-45 days critical",
  }));
}

export function enrichCropDetail(crop: Crop): EnrichedCropDetail {
  const profile = getCropManagementProfile(crop.slug);
  const timing =
    CROP_TIMING[crop.slug] ??
    buildFallbackTiming(
      crop.slug,
      crop.fertilizerSchedule.basalDose,
      crop.fertilizerSchedule.stageWise,
      crop.irrigationManagement.schedule
    );

  const pests =
    profile?.pestManagement.map((p) => ({
      name: p.pestName,
      detail: `${p.identification} · ETL: ${p.etl}`,
      timing: `Spray only at ETL — ${p.activeIngredient} ${p.dose}`,
    })) ??
    crop.cropProtection.majorPests.map((p) => ({
      name: p,
      detail: crop.cropProtection.symptoms.join(", "),
      timing: "Scout weekly; spray at ETL only",
    }));

  const diseases =
    profile?.diseaseManagement.map((d) => ({
      name: d.diseaseName,
      detail: `${d.pathogen} (${d.type})`,
      timing: `FRAC ${d.fracGroup} · ${d.activeIngredient} — PHI ${d.waitingPeriod}`,
    })) ??
    crop.cropProtection.majorDiseases.map((d) => ({
      name: d,
      detail: crop.cropProtection.prevention.join("; "),
      timing: "Preventive spray before favourable weather",
    }));

  return {
    crop,
    establishment: timing.establishment,
    growthStages: growthStagesFromProfile(crop.slug, crop),
    fertilizers: timing.fertilizers,
    irrigations: timing.irrigations,
    pests,
    diseases,
    weeds: buildWeeds(crop.slug, crop),
    ipm: buildIpm(crop.slug, crop),
    nutrients: mergeNutrients(crop),
  };
}
