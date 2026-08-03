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
    role: "पत्ती वृद्धि और हरियाली",
    defaultSymptoms: "पुरानी पत्तियाँ हल्की पीली; बौनी वृद्धि",
    defaultCause: "मिट्टी में N कम या भारी leaching",
    defaultSolution: "अवस्था के अनुसार Urea विभाजित मात्रा में",
  },
  {
    nutrient: "Potassium",
    role: "फल की गुणवत्ता, रोग प्रतिरोध",
    defaultSymptoms: "पत्ती के किनारे जलना, कमजोर तना",
    defaultCause: "K कम या Ca/Mg असंतुलन",
    defaultSolution: "महत्वपूर्ण अवस्था में MOP / SOP top-dress",
  },
  {
    nutrient: "Calcium",
    role: "कोशिका दीवार, फल की मजबूती",
    defaultSymptoms: "Blossom end rot, नई पत्तियों पर सिरे का जलना",
    defaultCause: "अनियमित सिंचाई + Ca अवशोषण कम",
    defaultSolution: "Calcium nitrate foliar; समान सिंचाई बनाए रखें",
  },
  {
    nutrient: "Magnesium",
    role: "क्लोरोफिल और प्रकाश संश्लेषण",
    defaultSymptoms: "पुरानी पत्तियों पर शिराओं के बीच पीलापन",
    defaultCause: "Mg कम या अधिक K का प्रतिकूल प्रभाव",
    defaultSolution: "MgSO₄ foliar 0.5% या अम्लीय मिट्टी में dolomite",
  },
  {
    nutrient: "Sulfur",
    role: "प्रोटीन संश्लेषण और तेल की मात्रा",
    defaultSymptoms: "नई पत्तियों पर समान हल्का पीलापन",
    defaultCause: "जैविक पदार्थ कम / S उर्वरक नहीं दिया",
    defaultSolution: "Gypsum 100-200 kg/acre या ammonium sulphate",
  },
  {
    nutrient: "Iron",
    role: "क्लोरोफिल निर्माण",
    defaultSymptoms: "नई पत्तियाँ पीली, शिराएँ हरी रहती हैं",
    defaultCause: "उच्च pH / जलभराव वाली चूना मिट्टी",
    defaultSolution: "Fe-EDDHA chelate मिट्टी में या ferrous sulphate foliar",
  },
  {
    nutrient: "Zinc",
    role: "एंजाइम सक्रियण और फूल आना",
    defaultSymptoms: "छोटी पत्तियाँ, शिराओं के बीच पीलापन, rosetting",
    defaultCause: "क्षारीय मिट्टी, अधिक P, या Zn कम",
    defaultSolution: "ZnSO₄ 25 kg/ha basal या 0.5% foliar",
  },
];

const DEFAULT_IPM: IpmPractice[] = [
  {
    name: "Neem oil / NSKE 5%",
    timing: "निवारक — हर 10-15 दिन",
    dose: "3000 ppm spray (5 ml/L neem oil + sticker)",
    notes: "शाम को छिड़काव; कम मात्रा में लाभकारी कीड़ों के लिए सुरक्षित",
  },
  {
    name: "Trichoderma viride",
    timing: "बुवाई / रोपाई के समय",
    dose: "5-10 g/kg seed या 2.5 kg/acre soil drench",
    notes: "प्रतिरोधी fungus — मिट्टी जनित रोग कम करता है",
  },
  {
    name: "Pheromone / sticky traps",
    timing: "वегिटेटिव अवस्था से",
    dose: "4-6 traps per acre",
    notes: "रासायनिक छिड़काव से पहले कीट जनसंख्या की निगरानी",
  },
  {
    name: "Conserve natural enemies",
    timing: "पूरी फसल अवधि",
    dose: "फूल आने पर broad-spectrum कीटनाशक से बचें",
    notes: "Ladybird beetle, lacewing, spiders — बिना जरूरत छिड़काव न करें",
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
