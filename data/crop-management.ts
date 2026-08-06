import type { Crop as LegacyCrop } from "@/types/crop";
import type { CropManagementProfile } from "@/types/crop-management";
import { cropsData as legacyCrops } from "@/data/crops";
import { maizeProfile } from "@/data/maize-profile";
import { paddyProfile } from "@/data/paddy-profile";
import { chilliProfile } from "@/data/chilli-profile";
import { cottonProfile } from "@/data/cotton-profile";
import { soybeanProfile } from "@/data/soybean-profile";
import { bajraProfile } from "@/data/bajra-profile";
import { moongfaliProfile } from "@/data/moongfali-profile";

const tomatoProfile: CropManagementProfile = {
  slug: "tomato",
  name: "टमाटर",
  scientificName: "Solanum lycopersicum",
  category: "सब्जियाँ",
  image: "/images/tomato.png",
  summary:
    "मूल्यवान सब्जी फसल — संतुलित पोषण, समय पर सिंचाई और शुरुआती कीट-रोग प्रबंधन ज़रूरी है।",
  overview:
    "टमाटर गर्म मौसम की फसल है जो ताज़ा उपयोग, प्रसंस्करण और निर्यात के लिए व्यापक रूप से उगाई जाती है। ड्रिप सिंचाई, fertigation और stake से फल की गुणवत्ता बढ़ती है।",
  climate: "गर्म और धूप वाला मौसम, तापमान लगभग 20–30°C। पाला और जलभराव से बचें।",
  soil: "अच्छी जल निकासी वाली दोमट मिट्टी, जैविक पदार्थ से समृद्ध; pH 6.0–7.0।",
  landPreparation: [
    "गहरी जुताई के बाद 2–3 बार पाटा चलाएँ।",
    "FYM 10–12 tonnes/acre डालकर अच्छी तरह मिलाएँ।",
    "जड़ों में हवा के लिए उठी क्यारियाँ या मेड़ बनाएँ।",
  ],
  seedSelection: [
    "बाज़ार की माँग और रोग सहनशीलता के अनुसार हाइब्रिड या सुधारित किस्में चुनें।",
    "रोपाई के लिए प्रमाणित, रोग-मुक्त पौध लें।",
  ],
  seedTreatment: [
    "बोने से पहले Trichoderma और अनुशंसित fungicide से बीज उपचार करें।",
    "अच्छे अंकुरण के लिए बीज 8–10 घंटे भिगोएँ।",
  ],
  sowingTime: [
    "नर्सरी बुवाई: मुख्य सीज़न के लिए जुलाई–अगस्त।",
    "रोपाई: बुवाई के 25–30 दिन बाद मुख्य खेत में।",
  ],
  seedRate: "10,000–12,000 seedlings/acre",
  spacing: "75 × 45 cm",
  nursery: [
    "सुरक्षित नर्सरी में 25–30 दिन पौध तैयार करें।",
    "रोपाई से 5–7 दिन पहले पौध को कठोर (harden) करें।",
  ],
  transplanting: [
    "बेहतर स्थापना के लिए शाम को रोपें।",
    "सही दूरी रखें और बहुत गहरी रोपाई से बचें।",
  ],
  irrigationSchedule: [
    "रोपाई के तुरंत बाद हल्की सिंचाई करें।",
    "सूखे मौसम में हर 3–4 दिन सिंचाई करें; जलभराव न करें।",
    "फूल और फल बढ़ने के समय सिंचाई की आवृत्ति बढ़ाएँ।",
  ],
  fertilizerSchedule: [
    "रोपाई से पहले FYM और बेसल उर्वरक डालें।",
    "बेहतर वегिटेटिव वृद्धि के लिए nitrogen को कई हिस्सों में दें।",
    "फूल और फल बनने पर सूक्ष्म पोषक दें।",
  ],
  micronutrients: [
    "Zinc sulfate 2–3 kg/acre",
    "Boron 250 g/acre",
    "फल बनने पर Calcium और magnesium सहायक",
  ],
  growthStages: [
    {
      title: "पौध अवस्था",
      period: "0–25 days",
      keyPoints: ["नर्सरी में स्वस्थ वृद्धि", "रोपाई से पहले पौध कठोर करें"],
    },
    {
      title: "वегिटेटिव वृद्धि",
      period: "25–45 days",
      keyPoints: ["मज़बूत पत्ते बनाएँ", "संतुलित पोषण दें"],
    },
    {
      title: "फूल और फल",
      period: "45–75 days",
      keyPoints: ["परागण में सहायता", "Calcium और boron उपलब्ध रखें"],
    },
    {
      title: "कटाई",
      period: "75–95 days",
      keyPoints: ["पूरे रंग पर कटाई", "अधिक पकना और फटना रोकें"],
    },
  ],
  interculturalOperations: [
    "सहारे के लिए stake लगाएँ — फल साफ़ रहते हैं।",
    "बगल की शाखाएँ हटाएँ; ज़रूरत हो तो 2–3 तने रखें।",
    "वाष्पोत्सर्जन कम और खरपतवार रोकने के लिए mulch करें।",
  ],
  weedManagement: [
    {
      weedName: "मोथा (Cyperus rotundus)",
      scientificName: "Cyperus rotundus",
      type: "नरगल",
      criticalPeriod: "पहले 30 दिन",
      preEmergenceHerbicide: "Pendimethalin 1.0–1.5 L/acre",
      postEmergenceHerbicide: "Quizalofop 400 ml/acre",
      hracGroup: "HRAC O / A",
      dose: "As per label recommendation",
    },
  ],
  pestManagement: [
    {
      pestName: "सफ़ेद मक्खी (Whitefly)",
      scientificName: "Bemisia tabaci",
      identification: "पत्तों की निचली सतह पर छोटे सफ़ेद कीट",
      symptoms: ["पीलापन", "Honeydew और sooty mold"],
      etl: "More than 5 adults per leaf",
      biologicalControl: ["Encarsia parasitoids छोड़ें", "शिकारी मकड़ियों को बढ़ावा दें"],
      chemicalControl: ["ETL पार होने पर ही अनुशंसित insecticide छिड़कें"],
      iracGroup: "IRAC 4A",
      activeIngredient: "Imidacloprid",
      dose: "0.3–0.4 ml/L",
    },
  ],
  diseaseManagement: [
    {
      diseaseName: "Early Blight",
      pathogen: "Alternaria solani",
      type: "Fungal",
      symptoms: ["निशान जैसे पत्ते के धब्बे", "पीलापन और पत्ते झड़ना"],
      favourableConditions: ["अधिक आर्द्रता", "गर्म मौसम", "घना छज्जा"],
      integratedManagement: ["रोग-प्रतिरोधी किस्में लगाएँ", "हवा का प्रवाह रखें", "संक्रमित पत्ते हटाएँ"],
      biologicalControl: ["Trichoderma spray या seedling drench"],
      chemicalControl: ["स्थानीय अनुशंसा के अनुसार fungicide rotation करें"],
      fracGroup: "FRAC M5",
      activeIngredient: "Mancozeb",
      dose: "2.0 g/L",
      waitingPeriod: "5 days",
    },
  ],
  physiologicalDisorders: [
    "Blossom end rot: calcium और सिंचाई की नियमितता बनाए रखें।",
    "फल फटना: अचानक सिंचाई और अधिक आर्द्रता से बचें।",
  ],
  nutrientDeficiencies: [
    {
      name: "Nitrogen",
      role: "वегिटेटिव वृद्धि और पत्तों के विकास में सहायक",
      deficiencySymptoms: ["पुराने पत्ते पीले", "वृद्धि रुकी"],
      excessSymptoms: ["अधिक पत्ते, कम फूल", "फूल में देरी"],
      management: ["Nitrogen कई हिस्सों में दें", "Compost और जैविक पदार्थ उपयोग करें"],
      recommendedFertilizers: ["Urea", "Neem-coated urea"],
    },
    {
      name: "Boron",
      role: "फूल और फल बनने में सहायक",
      deficiencySymptoms: ["कम फूल", "फल फटना"],
      excessSymptoms: ["पत्तों की नोक जलना", "वृद्धि कम"],
      management: ["Boron पत्ती छिड़काव करें", "अधिक मात्रा से बचें"],
      recommendedFertilizers: ["Boron spray", "Borax in low dose"],
    },
  ],
  harvesting: [
    "फल पूरे रंग और ठोस बनने पर काटें।",
    "रोग फैलने से बचने के लिए भारी ओस के समय कटाई न करें।",
  ],
  yield: "180–220 quintals/acre (अच्छे प्रबंधन पर)",
  storage: [
    "ठंडी छायादार जगह में रखें।",
    "फल सूखे रखें और चोट लगने से बचाएँ।",
  ],
  marketInformation: {
    majorMarkets: ["स्थानीय मंडी", "प्रसंस्करण इकाइयाँ", "थोक विक्रेता"],
    demand: "ताज़ा और प्रसंस्करण बाज़ार में मज़बूत माँग",
    msp: "कोई निश्चित MSP नहीं",
    priceTrend: "मौसम और बाज़ार के अनुसार बदलता",
  },
  faqs: [
    {
      question: "टमाटर रोपाई का सबसे अच्छा समय क्या है?",
      answer: "क्षेत्र और किस्म के अनुसार टमाटर आमतौर पर मानसून के अंत या शुरुआती सर्दी में रोपा जाता है।",
    },
    {
      question: "टमाटर की सिंचाई कितनी बार करें?",
      answer: "बार-बार लेकिन मध्यम सिंचाई सबसे अच्छी है, खासकर फूल और फल बढ़ने के समय।",
    },
  ],
};

const potatoProfile: CropManagementProfile = {
  slug: "potato",
  name: "आलू",
  scientificName: "Solanum tuberosum",
  category: "सब्जियाँ",
  image: "/images/potato.png",
  summary:
    "उच्च उपज देने वाली कंद फसल — सही बीज आकार, संतुलित पोषण और रोग प्रबंधन ज़रूरी है।",
  overview:
    "आलू कंद के लिए उगाई जाने वाली महत्वपूर्ण खाद्य और नकदी फसल है। ठंडे मौसम, मिट्टी में हवा और late blight के सावधान प्रबंधन में सबसे अच्छा पैदावार देता है।",
  climate: "ठंडा मौसम, मध्यम तापमान और पर्याप्त धूप।",
  soil: "अच्छी जल निकासी वाली दोमट मिट्टी, जैविक पदार्थ से समृद्ध; pH 5.5–6.5।",
  landPreparation: [
    "गहरी जुताई और समान समतल करें।",
    "रोपाई से पहले FYM 10–12 tonnes/acre डालें।",
    "बीज कंद रोपने से पहले मेड़ या क्यारियाँ तैयार करें।",
  ],
  seedSelection: [
    "प्रमाणित, सही आकार और स्वस्थ दिखने वाले बीज कंद चुनें।",
    "विश्वसनीय स्रोतों से रोग-मुक्त रोपण सामग्री लें।",
  ],
  seedTreatment: [
    "रोपाई से पहले अनुशंसित fungicide से बीज कंद उपचार करें।",
    "मिट्टी जनित रोग कम करने के लिए bioagents उपयोग करें।",
  ],
  sowingTime: [
    "भारतीय परिस्थितियों में रोपाई आमतौर पर शुरुआती सर्दी में शुरू होती है।",
    "अत्यधिक ठंड या गर्मी में रोपाई से बचें।",
  ],
  seedRate: "1.5–2.0 tonnes/acre",
  spacing: "60 × 20 cm",
  nursery: [
    "नर्सरी की ज़रूरत नहीं; सीधे बीज कंद उपयोग करें।",
    "बड़े कंदों को कम से कम एक आँख वाले टुकड़ों में काटें।",
  ],
  transplanting: [
    "एकसमान अंकुरण के लिए बीज टुकड़े सही गहराई पर रोपें।",
    "कंद विकास के लिए दूरी और मेड़ बनाना सुनिश्चित करें।",
  ],
  irrigationSchedule: [
    "रोपाई के तुरंत बाद हल्की सिंचाई करें।",
    "कंद बनने और बढ़ने के समय नमी बनाए रखें।",
    "पकने के पास अधिक पानी न दें।",
  ],
  fertilizerSchedule: [
    "रोपाई से पहले NPK की बेसल मात्रा डालें।",
    "कंद बनने पर टॉप-ड्रेस करें।",
    "अच्छे कंद बढ़ने के लिए potassium दें।",
  ],
  micronutrients: ["Zinc", "Boron", "कमी वाली मिट्टी में Sulfur"],
  growthStages: [
    {
      title: "अंकुरण",
      period: "0–15 days",
      keyPoints: ["बीज टुकड़े अंकुरित होकर स्थापित हों", "नमी बनाए रखें"],
    },
    {
      title: "वегिटेटिव वृद्धि",
      period: "15–35 days",
      keyPoints: ["छज्जा बनाएँ", "Early blight से बचाव"],
    },
    {
      title: "कंद बनना",
      period: "35–55 days",
      keyPoints: ["कंद बनने में सहायता", "संतुलित सिंचाई रखें"],
    },
    {
      title: "कंद बढ़ना",
      period: "55–90 days",
      keyPoints: ["पोषण और पानी का संतुलन", "Late blight की निगरानी"],
    },
  ],
  interculturalOperations: [
    "बढ़ते कंदों की रक्षा के लिए मिट्टी चढ़ाएँ (earthing up)।",
    "शुरू में निराई करें और खेत साफ़ रखें।",
  ],
  weedManagement: [
    {
      weedName: "गाजर घास (Parthenium)",
      scientificName: "Parthenium hysterophorus",
      type: "चौड़े पत्ते",
      criticalPeriod: "पहले 30 दिन",
      preEmergenceHerbicide: "Metribuzin as per label",
      postEmergenceHerbicide: "Quizalofop",
      hracGroup: "HRAC C3 / A",
      dose: "As per local recommendation",
    },
  ],
  pestManagement: [
    {
      pestName: "माहू (Aphids)",
      scientificName: "Myzus persicae",
      identification: "नरम कोपों पर छोटे रस चूसने वाले कीट",
      symptoms: ["पत्ते मुड़ना", "वृद्धि रुकना"],
      etl: "Above 10 aphids per 100 compound leaves",
      biologicalControl: ["Ladybird beetle छोड़ें", "प्राकृतिक शिकारियों को बचाएँ"],
      chemicalControl: ["ETL से ऊपर होने पर ही insecticide छिड़कें"],
      iracGroup: "IRAC 4A",
      activeIngredient: "Imidacloprid",
      dose: "0.3 ml/L",
    },
  ],
  diseaseManagement: [
    {
      diseaseName: "Late Blight",
      pathogen: "Phytophthora infestans",
      type: "Oomycete",
      symptoms: ["पानी से भरे घाव", "आर्द्रता में पत्तों के नीचे सफ़ेद fungus"],
      favourableConditions: ["ठंडा नम मौसम", "बादल", "घना छज्जा"],
      integratedManagement: ["रोग-प्रतिरोधी किस्में लगाएँ", "ऊपर से सिंचाई न करें", "संक्रमित पत्ते हटाएँ"],
      biologicalControl: ["Trichoderma-based application"],
      chemicalControl: ["Fungicide rotation as per recommendation"],
      fracGroup: "FRAC 40",
      activeIngredient: "Metalaxyl-M",
      dose: "2 g/L",
      waitingPeriod: "7 days",
    },
  ],
  physiologicalDisorders: [
    "Hollow heart: सिंचाई और पोषण का संतुलन रखें।",
    "Greening: कंदों को धूप से बचाएँ।",
  ],
  nutrientDeficiencies: [
    {
      name: "Potassium",
      role: "कंद का आकार और गुणवत्ता बढ़ाता है",
      deficiencySymptoms: ["पत्तों के किनारे जलना", "कंद कम बढ़ना"],
      excessSymptoms: ["Magnesium का कम अवशोषण", "नमक तनाव"],
      management: ["उचित अवस्था पर MOP दें", "नियमित सिंचाई रखें"],
      recommendedFertilizers: ["MOP", "Sulphate of potash"],
    },
  ],
  harvesting: [
    "कंद बाज़ार योग्य आकार और त्वचा सेट होने पर काटें।",
    "चोट और सड़न से बचने के लिए गीली मिट्टी में कटाई न करें।",
  ],
  yield: "140–180 quintals/acre (अच्छे प्रबंधन पर)",
  storage: [
    "ठंडी, अँधेरी और हवादार जगह में रखें।",
    "भंडारण से पहले कंद सुखाएँ और खराब सामग्री अलग करें।",
  ],
  marketInformation: {
    majorMarkets: ["बीज आलू व्यापारी", "ताज़ा बाज़ार", "Cold storage chains"],
    demand: "खाद्य और प्रसंस्करण के लिए स्थिर माँग",
    msp: "कोई निश्चित MSP नहीं",
    priceTrend: "भंडारण और बाज़ार आवक के प्रति संवेदनशील",
  },
  faqs: [
    {
      question: "Late blight कैसे नियंत्रित करें?",
      answer: "रोग-प्रतिरोधी किस्में लगाएँ, दूरी रखें, गीले पत्तों से बचें और fungicide अनुसूची का पालन करें।",
    },
  ],
};

function mapLegacyCrop(crop: LegacyCrop): CropManagementProfile {
  return {
    slug: crop.slug,
    name: crop.name,
    scientificName: crop.scientificName,
    category: crop.category,
    image: crop.image,
    summary: crop.overview,
    overview: crop.overview,
    climate: crop.climate,
    soil: crop.suitableSoil,
    landPreparation: [
      "बुवाई या रोपाई से पहले खेत अच्छी तरह तैयार करें।",
      "जैविक खाद मिलाएँ और खेत समतल रखें।",
    ],
    seedSelection: ["प्रमाणित बीज या स्वस्थ पौध लें।", "मज़बूत और जोरदार रोपण सामग्री चुनें।"],
    seedTreatment: [crop.sowingGuide.seedTreatment],
    sowingTime: [crop.sowingGuide.bestSowingTime],
    seedRate: crop.seedRate,
    spacing: crop.spacing,
    nursery: ["स्थानीय सलाह के अनुसार नर्सरी तैयार करें।"],
    transplanting: [crop.sowingGuide.sowingMethod],
    irrigationSchedule: crop.irrigationManagement.schedule,
    fertilizerSchedule: [
      ...crop.fertilizerSchedule.basalDose,
      ...crop.fertilizerSchedule.stageWise.flatMap((stage) => stage.details),
    ],
    micronutrients: crop.fertilizerSchedule.micronutrients,
    growthStages: [
      {
        title: "Establishment",
        period: "Early growth",
        keyPoints: ["Ensure good establishment"],
      },
      {
        title: "Development",
        period: "Mid growth",
        keyPoints: ["Support active growth"],
      },
      {
        title: "Reproductive",
        period: "Flowering or grain filling",
        keyPoints: ["Support yield formation"],
      },
    ],
    interculturalOperations: ["Use timely interculture and mulching."],
    weedManagement: [
      {
        weedName: "Common weed",
        scientificName: "Mixed flora",
        type: "General",
        criticalPeriod: "Early crop growth",
        preEmergenceHerbicide: "Follow local recommendation",
        postEmergenceHerbicide: "Follow local recommendation",
        hracGroup: "HRAC",
        dose: "As per label",
      },
    ],
    pestManagement: [
      {
        pestName: "Major pest",
        scientificName: "Local pest",
        identification: "Check local agronomic guidance",
        symptoms: ["Observe field regularly"],
        etl: "Follow local ETL",
        biologicalControl: ["Conserve natural enemies"],
        chemicalControl: ["Use pesticide only when required"],
        iracGroup: "IRAC",
        activeIngredient: "Follow label",
        dose: "As per label",
      },
    ],
    diseaseManagement: [
      {
        diseaseName: "Major disease",
        pathogen: "Follow diagnosis",
        type: "Field dependent",
        symptoms: ["Inspect field regularly"],
        favourableConditions: ["High humidity", "Dense canopy"],
        integratedManagement: ["Use disease-free seed and sanitation"],
        biologicalControl: ["Use biological options where available"],
        chemicalControl: ["Follow disease-specific recommendation"],
        fracGroup: "FRAC",
        activeIngredient: "Follow label",
        dose: "As per label",
        waitingPeriod: "As per label",
      },
    ],
    physiologicalDisorders: ["Observe crop stress and manage irrigation pace."],
    nutrientDeficiencies: crop.nutrientDeficiencies.map((item) => ({
      name: item.nutrient,
      role: "Supports crop growth",
      deficiencySymptoms: [item.symptoms],
      excessSymptoms: ["Excess application may cause imbalance"],
      management: [item.solution],
      recommendedFertilizers: [item.solution],
    })),
    harvesting: [crop.harvestAndYield.harvestingTime, ...crop.harvestAndYield.storageTips],
    yield: crop.harvestAndYield.yield,
    storage: crop.harvestAndYield.storageTips,
    marketInformation: crop.marketInformation,
    faqs: [
      {
        question: "How to manage this crop effectively?",
        answer: "Follow balanced nutrition, timely irrigation and recommended crop protection schedules.",
      },
    ],
  };
}

const CUSTOM_PROFILE_SLUGS = new Set([
  "tomato",
  "potato",
  "paddy",
  "maize",
  "chilli",
  "cotton",
  "soybean",
  "bajra",
  "moongfali",
]);

export const cropManagementCatalog: CropManagementProfile[] = [
  tomatoProfile,
  potatoProfile,
  paddyProfile,
  maizeProfile,
  chilliProfile,
  cottonProfile,
  soybeanProfile,
  bajraProfile,
  moongfaliProfile,
  ...legacyCrops.filter((c) => !CUSTOM_PROFILE_SLUGS.has(c.slug)).map(mapLegacyCrop),
];

import { getEnrichedCropProfile } from "@/lib/knowledge/merge";
import { importedManagementProfiles } from "@/data/imported-crop-exports";
import { mergeIpmPestDiseaseManagement } from "@/lib/crops/ipmDataBridge";
import { mergeCropFieldGuideIntoProfile } from "@/lib/crops/cropFieldGuideBridge";
import { mergeWeedAbioticIntoProfile } from "@/lib/crops/weedAbioticBridge";
import { mergeNutrientDeficiencyIntoProfile } from "@/lib/nutrients/nutrientDeficiencyBridge";
import { mergeResearchDossierIntoProfile } from "@/lib/crops/researchDossierBridge";

export function getCropManagementProfile(slug: string) {
  const imported = importedManagementProfiles[slug];
  const base =
    imported ?? cropManagementCatalog.find((crop) => crop.slug === slug) ?? null;
  const enriched = getEnrichedCropProfile(base);
  if (!enriched) return null;
  return mergeResearchDossierIntoProfile(
    mergeNutrientDeficiencyIntoProfile(
      mergeWeedAbioticIntoProfile(
        mergeCropFieldGuideIntoProfile(mergeIpmPestDiseaseManagement(enriched))
      )
    )
  );
}
