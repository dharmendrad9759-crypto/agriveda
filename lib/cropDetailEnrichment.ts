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
    defaultCause: "मिट्टी में नाइट्रोजन कम होना या भारी बारिश में खाद बह जाना (लीचिंग)",
    defaultSolution: "फसल की अवस्था अनुसार यूरिया 2-3 किस्तों में बांटकर दें",
  },
  {
    nutrient: "Potassium",
    role: "फल की गुणवत्ता, रोग प्रतिरोध",
    defaultSymptoms: "पत्ती के किनारे जलना, कमजोर तना",
    defaultCause: "पोटाश की कमी या Ca/Mg का असंतुलन",
    defaultSolution: "मुख्य अवस्था पर पोटाश (MOP या SOP) खाद दें",
  },
  {
    nutrient: "Calcium",
    role: "कोशिका दीवार, फल की मजबूती",
    defaultSymptoms: "फल का नीचे से सड़ना (Blossom End Rot), नई पत्तियों के सिरे जलना",
    defaultCause: "अनियमित सिंचाई और कैल्शियम का कम अवशोषण",
    defaultSolution: "कैल्शियम नाइट्रेट का छिड़काव करें और नियमित सिंचाई बनाए रखें",
  },
  {
    nutrient: "Magnesium",
    role: "क्लोरोफिल और प्रकाश संश्लेषण",
    defaultSymptoms: "पुरानी पत्तियों पर शिराओं के बीच पीलापन",
    defaultCause: "मैग्नीशियम की कमी या अधिक पोटाश का प्रतिकूल प्रभाव",
    defaultSolution: "मैग्नीशियम सल्फेट 0.5% (5 ग्राम प्रति लीटर) का छिड़काव या अम्लीय मिट्टी में डोलोमाइट दें",
  },
  {
    nutrient: "Sulfur",
    role: "प्रोटीन संश्लेषण और तेल की मात्रा",
    defaultSymptoms: "नई पत्तियों पर समान हल्का पीलापन",
    defaultCause: "जैविक पदार्थ कम होना या सल्फर खाद न देना",
    defaultSolution: "जिप्सम 100-200 किग्रा/एकड़ या अमोनियम सल्फेट दें",
  },
  {
    nutrient: "Iron",
    role: "क्लोरोफिल निर्माण",
    defaultSymptoms: "नई पत्तियाँ पीली, शिराएँ हरी रहती हैं",
    defaultCause: "उच्च pH या जलभराव वाली चूना मिट्टी",
    defaultSolution: "Fe-EDDHA चिलेट मिट्टी में डालें या फेरस सल्फेट 0.5% का छिड़काव करें",
  },
  {
    nutrient: "Zinc",
    role: "एंजाइम सक्रियण और फूल आना",
    defaultSymptoms: "छोटी पत्तियाँ, शिराओं के बीच पीलापन, गुच्छेदार पत्तियाँ (रोसेटिंग)",
    defaultCause: "क्षारीय मिट्टी, अधिक फॉस्फोरस, या जिंक की कमी",
    defaultSolution: "जिंक सल्फेट 21% (10 किग्रा/एकड़) बुवाई पर या 0.5% (5 ग्राम/ली.) छिड़काव करें",
  },
];

const DEFAULT_IPM: IpmPractice[] = [
  {
    name: "नीम तेल या निंबोली अर्क (NSKE 5%)",
    timing: "निवारक — हर 10-15 दिन",
    dose: "नीम तेल 1500–3000 ppm (5 मिली प्रति लीटर पानी + चिपको)",
    notes: "शाम को छिड़काव; मित्र कीटों के लिए सुरक्षित",
  },
  {
    name: "ट्राइकोडर्मा विरिडी (Trichoderma viride)",
    timing: "बुवाई / रोपाई के समय",
    dose: "5-10 ग्राम/किग्रा बीज उपचार या 2.5 किग्रा/एकड़ मिट्टी में",
    notes: "मित्र फफूंद — मिट्टी जनित रोगों को रोकता है",
  },
  {
    name: "फेरोमोन ट्रैप / पीले-नीले चिपचिपे कार्ड",
    timing: "फसल बढ़वार अवस्था से",
    dose: "4-6 ट्रैप प्रति एकड़",
    notes: "रासायनिक छिड़काव से पहले कीट संख्या की निगरानी",
  },
  {
    name: "मित्र कीटों का संरक्षण",
    timing: "पूरी फसल अवधि",
    dose: "फूल आने पर तेज असर वाली रासायनिक दवाओं से बचें",
    notes: "लेडीबर्ड बीटल, क्राइसोपा, मकड़ी — बिना जरूरत कीटनाशक न डालें",
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
      timing: `${d.activeIngredient} · ${d.dose} — PHI ${d.waitingPeriod}`,
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
