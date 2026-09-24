import type { CropFertilizerMixinGuide } from "./fertilizerMixinFieldGuide";

const SOURCE_VERIFY_WARNINGS = [
  "SOURCE DATA — OPERATIONAL USE से पहले सत्यापित करें",
  "कीटनाशक / फफूंदनाशक — पैकेट लेबल और स्थानीय कृषि अधिकारी की सलाह ज़रूर जाँचें",
];

const CALCIUM_NITRATE_MIX_WARNINGS = [
  "Calcium Nitrate (CaNO3) अलर्ट — सल्फर / 0:52:34 / सल्फेट वाले मिश्रण के साथ टैंक-मिक्स मत करो",
];

export const PART3_GUIDES: Record<string, CropFertilizerMixinGuide> = {
  tomato: {
    cropNameHi: "टमाटर",
    englishName: "Tomato",
    categoryHi: "सब्जी",
    totalNutrientsHi: [
      "N 50, P2O5 30, K2O 45, Ca 15, B 1 (kg/acre equivalent — स्रोत)",
    ],
    totalFertilizerHi: [
      "डीएपी 60, यूरिया 75, एमओपी 60 किग्रा / एकड़",
      "Calcium Nitrate (CaNO3) 15–20 किग्रा / एकड़ — अनिवार्य (MANDATORY)",
    ],
    stages: [
      {
        stageNumber: 0,
        stageNameHi: "रूट डिप — रोपाई से पहले",
        timingHi: "रोपाई से पहले",
        activityHi: "पौध रोपण से 15 मिनट पहले जड़ डुबोना",
        fertilizers: [],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [],
        seedTreatment: [
          {
            kind: "seed_treatment",
            technical: "Carbendazim + Mancozeb",
            doseHi: "2 ग्राम / लीटर पानी",
            brands: ["Saaf"],
            waterHi: "2 g/L",
            purposeHi: "Damping-off सुरक्षा",
            targetHi: "Damping-off / नर्सरी फफूंद",
          },
          {
            kind: "seed_treatment",
            technical: "Imidacloprid",
            formulation: "17.8% SL",
            doseHi: "1 मि.ली / लीटर पानी",
            waterHi: "1 ml/L",
            purposeHi: "चूसक कीट सुरक्षा",
            targetHi: "Sucking pests",
          },
        ],
        foliar: [],
        applicationHi:
          "नर्सरी से पौध निकालें → घोल में जड़ 15 मिनट डुबोएँ → छाया में सुखाकर तुरंत रोपाई",
        mixingStatus: "seed_only",
        warningsHi: [
          "यह जड़/बीज उपचार है — बेसल खाद में ऑटो-मर्ज न करें",
          "SOURCE DATA — लेबल / स्थानीय पंजीकरण जाँचें",
        ],
        fieldDoctorTipHi: "जड़ उपचार घोल अलग बनाएँ; रोपाई के बेसल मिश्रण में न मिलाएँ।",
      },
      {
        stageNumber: 1,
        stageNameHi: "बेसल / बेड मिक्स",
        timingHi: "रोपाई / बेड तैयारी",
        activityHi: "बेड में मिलाकर — cutworm / termite",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "DAP",
            doseHi: "60 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "MOP",
            doseHi: "30 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "20 किग्रा / एकड़",
          },
        ],
        pestProtection: [
          {
            kind: "insecticide",
            technical: "Fipronil",
            formulation: "0.3% GR",
            doseHi: "8 किग्रा / एकड़",
            targetHi: "कटवर्म / दीमक",
          },
        ],
        diseaseProtection: [],
        rootBio: [
          {
            kind: "humic",
            technical: "Humic Acid",
            formulation: "98%",
            doseHi: "500 ग्राम / एकड़",
          },
          {
            kind: "organic",
            technical: "Neem cake",
            doseHi: "50 किग्रा / एकड़",
          },
        ],
        pgr: [],
        seedTreatment: [],
        foliar: [],
        placementHi: "बेड / रोपाई लाइन में मिलाकर",
        mixingHi: "बेसल उर्वरक + humic + neem cake + Fipronil GR — बेड मिक्स",
      },
      {
        stageNumber: 2,
        stageNameHi: "वृद्धि top dressing",
        timingHi: "15–20 DAS",
        activityHi: "गुड़ाई के बाद",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "25 किग्रा / एकड़ — मिट्टी, जड़ के पास",
          },
        ],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [],
        seedTreatment: [],
        foliar: [
          {
            kind: "foliar",
            technical: "NPK",
            formulation: "19:19:19",
            doseHi: "1 किग्रा / 150 लीटर पानी",
            waterHi: "150 L",
          },
          {
            kind: "humic",
            technical: "Liquid Humic",
            doseHi: "250 मि.ली / 150 लीटर पानी",
            waterHi: "150 L",
          },
        ],
        placementHi: "यूरिया — जड़ के पास मिट्टी में",
        applicationHi: "गुड़ाई के बाद foliar छिड़काव",
      },
      {
        stageNumber: 3,
        stageNameHi: "फूल अवस्था",
        timingHi: "35–40 DAS",
        fertilizers: [],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [
          {
            kind: "pgr",
            technical: "Alpha Naphthalene Acetic Acid (NAA)",
            doseHi: "40 मि.ली / 150 लीटर पानी",
            brands: ["Planofix"],
            waterHi: "150 L",
            sourceClaimHi:
              "स्रोत दावा: ~90% फूल झड़ने (flower drop) पर नियंत्रण का उल्लेख — SOURCE_CLAIM",
          },
        ],
        seedTreatment: [],
        foliar: [
          {
            kind: "foliar",
            technical: "NPK",
            formulation: "0:52:34",
            doseHi: "1 किग्रा / 150 लीटर पानी",
            waterHi: "150 L",
          },
          {
            kind: "micronutrient",
            technical: "Boron",
            formulation: "20%",
            doseHi: "100 ग्राम / 150 लीटर पानी",
            waterHi: "150 L",
          },
        ],
        mixingHi: "0:52:34 + बोरॉन + Planofix / NAA — एक टैंक foliar",
      },
      {
        stageNumber: 4,
        stageNameHi: "फल भराव",
        timingHi: "55–65 DAS",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "Calcium Nitrate",
            doseHi: "15 किग्रा / एकड़ — ड्रिप / जड़ zone (अलग)",
            warningHi:
              "0:52:34 / सल्फर / सल्फेट foliar या टैंक के साथ मत मिलाओ",
            noteHi: "S4 में CaNO3 — 0:52:34 से अलग समय / अलग तरीके से",
          },
        ],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [],
        seedTreatment: [],
        foliar: [
          {
            kind: "foliar",
            technical: "NPK",
            formulation: "0:0:50",
            doseHi: "1.5 किग्रा / 150 लीटर पानी",
            waterHi: "150 L",
            sourceClaimHi:
              "स्रोत दावा: BER / फल फटना (cracking) पर कैल्शियम-पोटाश सहारा का उल्लेख",
          },
          {
            kind: "micronutrient",
            technical: "Boron",
            doseHi: "100 ग्राम / 150 लीटर पानी",
            waterHi: "150 L",
          },
        ],
        mixingStatus: "separate",
        dontHi: [
          "Calcium Nitrate को 0:52:34 / सल्फर / सल्फेट वाले foliar टैंक में मत मिलाओ",
        ],
      },
    ],
    globalWarningsHi: [
      ...SOURCE_VERIFY_WARNINGS,
      ...CALCIUM_NITRATE_MIX_WARNINGS,
    ],
  },

  chilli: {
    cropNameHi: "मिर्च",
    englishName: "Chilli",
    categoryHi: "सब्जी",
    totalFertilizerHi: [
      "डीएपी 50, यूरिया 70, एमओपी 50 किग्रा / एकड़",
      "सल्फर (S) 5 किग्रा / एकड़",
    ],
    stages: [
      {
        stageNumber: 0,
        stageNameHi: "जड़ उपचार",
        timingHi: "रोपाई से पहले",
        activityHi: "जड़ zone / root dip",
        fertilizers: [],
        pestProtection: [
          {
            kind: "insecticide",
            technical: "Thiamethoxam",
            formulation: "25% WG",
            doseHi: "1 ग्राम / लीटर पानी",
            waterHi: "1 g/L — root",
          },
        ],
        diseaseProtection: [],
        rootBio: [
          {
            kind: "biofertilizer",
            technical: "Trichoderma",
            doseHi: "5 ग्राम / लीटर पानी (root treatment)",
            waterHi: "5 g/L",
          },
        ],
        pgr: [],
        seedTreatment: [],
        foliar: [],
      },
      {
        stageNumber: 1,
        stageNameHi: "बेसल",
        timingHi: "रोपाई / furrow-beds",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "DAP",
            doseHi: "50 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "MOP",
            doseHi: "25 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "20 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "Sulphur",
            doseHi: "5 किग्रा / एकड़",
          },
        ],
        pestProtection: [
          {
            kind: "insecticide",
            technical: "Cartap hydrochloride",
            formulation: "4% GR",
            doseHi: "8 किग्रा / एकड़",
          },
        ],
        diseaseProtection: [],
        rootBio: [
          {
            kind: "humic",
            technical: "Humic Acid",
            doseHi: "500 ग्राम / एकड़",
          },
        ],
        pgr: [],
        seedTreatment: [],
        foliar: [],
        placementHi: "furrow / beds में",
      },
      {
        stageNumber: 2,
        stageNameHi: "वृद्धि",
        timingHi: "20–25 DAS",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "25 किग्रा / एकड़",
          },
        ],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [
          {
            kind: "biostimulant",
            technical: "Seaweed",
            formulation: "granular",
            doseHi: "10 किग्रा / एकड़",
          },
        ],
        pgr: [],
        seedTreatment: [],
        foliar: [
          {
            kind: "foliar",
            technical: "NPK",
            formulation: "19:19:19",
            doseHi: "1 किग्रा / 150 लीटर पानी",
            waterHi: "150 L",
          },
          {
            kind: "micronutrient",
            technical: "Chelated micronutrients",
            doseHi: "200 ग्राम / 150 लीटर पानी",
            waterHi: "150 L",
          },
        ],
      },
      {
        stageNumber: 3,
        stageNameHi: "फूल",
        timingHi: "40–45 DAS",
        fertilizers: [],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [],
        seedTreatment: [],
        foliar: [
          {
            kind: "foliar",
            technical: "NPK",
            formulation: "0:52:34",
            doseHi: "1 किग्रा / 150 लीटर पानी",
            waterHi: "150 L",
            sourceClaimHi: "स्रोत दावा: फूल अवस्था / retention पर सहारा का उल्लेख",
          },
          {
            kind: "micronutrient",
            technical: "Boron",
            doseHi: "150 ग्राम / 150 लीटर पानी",
            waterHi: "150 L",
          },
          {
            kind: "biostimulant",
            technical: "Nitrobenzene",
            formulation: "20%",
            doseHi: "300 मि.ली / 150 लीटर पानी",
            waterHi: "150 L",
          },
        ],
      },
      {
        stageNumber: 4,
        stageNameHi: "कटाई चक्र",
        timingHi: "60+ DAS — हर ~20 दिन",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "15 किग्रा / एकड़ — मिट्टी",
          },
          {
            kind: "fertilizer",
            technical: "MOP",
            doseHi: "10 किग्रा / एकड़ — मिट्टी",
          },
        ],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [],
        seedTreatment: [],
        foliar: [
          {
            kind: "foliar",
            technical: "NPK",
            formulation: "13:0:45",
            doseHi: "1 किग्रा / 150 लीटर पानी",
            waterHi: "150 L",
          },
        ],
        applicationHi: "हर ~20 दिन दोहराएँ (कटाई चक्र)",
      },
    ],
    globalWarningsHi: SOURCE_VERIFY_WARNINGS,
  },

  brinjal: {
    cropNameHi: "बैंगन",
    englishName: "Brinjal",
    categoryHi: "सब्जी",
    totalFertilizerHi: [
      "डीएपी 50, यूरिया 80, एमओपी 45 किग्रा / एकड़",
      "Magnesium sulphate (MgSO4) 10 किग्रा / एकड़",
    ],
    stages: [
      {
        stageNumber: 0,
        stageNameHi: "रूट / पौध उपचार",
        timingHi: "रोपाई से पहले",
        fertilizers: [],
        pestProtection: [
          {
            kind: "insecticide",
            technical: "Imidacloprid",
            formulation: "17.8% SL",
            doseHi: "1 मि.ली / लीटर पानी",
            waterHi: "1 ml/L",
          },
        ],
        diseaseProtection: [
          {
            kind: "fungicide",
            technical: "Carbendazim + Mancozeb",
            doseHi: "2 ग्राम / लीटर पानी",
            brands: ["Saaf"],
            waterHi: "2 g/L",
          },
        ],
        rootBio: [],
        pgr: [],
        seedTreatment: [],
        foliar: [],
      },
      {
        stageNumber: 1,
        stageNameHi: "बेसल",
        timingHi: "रोपाई / beds",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "DAP",
            doseHi: "50 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "MOP",
            doseHi: "25 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "20 किग्रा / एकड़",
          },
        ],
        pestProtection: [
          {
            kind: "insecticide",
            technical: "Fipronil",
            formulation: "0.3% GR",
            doseHi: "8 किग्रा / एकड़",
          },
        ],
        diseaseProtection: [],
        rootBio: [
          {
            kind: "humic",
            technical: "Humic Acid",
            doseHi: "500 ग्राम / एकड़",
          },
        ],
        pgr: [],
        seedTreatment: [],
        foliar: [],
        placementHi: "beds में मिलाकर",
      },
      {
        stageNumber: 2,
        stageNameHi: "वृद्धि",
        timingHi: "25–30 DAS",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "30 किग्रा / एकड़",
          },
          {
            kind: "micronutrient",
            technical: "Magnesium sulphate",
            formulation: "MgSO4",
            doseHi: "10 किग्रा / एकड़",
          },
        ],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [],
        seedTreatment: [],
        foliar: [],
      },
      {
        stageNumber: 3,
        stageNameHi: "फूल / फल सेट",
        timingHi: "45–50 DAS",
        fertilizers: [],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [],
        seedTreatment: [],
        foliar: [
          {
            kind: "foliar",
            technical: "NPK",
            formulation: "0:52:34",
            doseHi: "1 किग्रा / 150 लीटर पानी",
            waterHi: "150 L",
          },
          {
            kind: "micronutrient",
            technical: "Boron",
            doseHi: "100 ग्राम / 150 लीटर पानी",
            waterHi: "150 L",
          },
          {
            kind: "biostimulant",
            technical: "Amino acid tonic",
            doseHi: "250 मि.ली / 150 लीटर पानी",
            waterHi: "150 L",
          },
        ],
      },
      {
        stageNumber: 4,
        stageNameHi: "हर 2 कटाई के बाद",
        timingHi: "हर 2 harvests के बाद",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "15 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "MOP",
            doseHi: "10 किग्रा / एकड़",
          },
        ],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [],
        seedTreatment: [],
        foliar: [
          {
            kind: "foliar",
            technical: "NPK",
            formulation: "13:0:45",
            doseHi: "1 किग्रा / 150 लीटर पानी",
            waterHi: "150 L",
          },
        ],
      },
    ],
    globalWarningsHi: SOURCE_VERIFY_WARNINGS,
  },

  cauliflower: {
    cropNameHi: "फूलगोभी",
    englishName: "Cauliflower",
    categoryHi: "सब्जी",
    totalFertilizerHi: [
      "डीएपी 50, यूरिया 70, एमओपी 40 किग्रा / एकड़",
      "Borax 3–4 किग्रा / एकड़ — मिट्टी में अनिवार्य (MANDATORY)",
    ],
    stages: [
      {
        stageNumber: 0,
        stageNameHi: "पौध / जड़ उपचार",
        timingHi: "रोपाई से पहले",
        fertilizers: [],
        pestProtection: [
          {
            kind: "insecticide",
            technical: "Thiamethoxam",
            formulation: "25% WG",
            doseHi: "1 ग्राम / लीटर पानी",
            waterHi: "1 g/L",
          },
        ],
        diseaseProtection: [
          {
            kind: "fungicide",
            technical: "Carbendazim",
            formulation: "50%",
            doseHi: "1.5 ग्राम / लीटर पानी",
            waterHi: "1.5 g/L",
          },
        ],
        rootBio: [],
        pgr: [],
        seedTreatment: [],
        foliar: [],
      },
      {
        stageNumber: 1,
        stageNameHi: "बेसल",
        timingHi: "रोपाई",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "DAP",
            doseHi: "50 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "MOP",
            doseHi: "25 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "20 किग्रा / एकड़",
          },
          {
            kind: "micronutrient",
            technical: "Borax",
            doseHi: "3–4 किग्रा / एकड़ — मिट्टी",
            warningHi: "खोखला तना / browning — बोरॉन कमी से बचाव",
          },
        ],
        pestProtection: [
          {
            kind: "insecticide",
            technical: "Fipronil",
            formulation: "0.3% GR",
            doseHi: "8 किग्रा / एकड़",
          },
        ],
        diseaseProtection: [],
        rootBio: [
          {
            kind: "humic",
            technical: "Humic Acid",
            doseHi: "500 ग्राम / एकड़",
          },
        ],
        pgr: [],
        seedTreatment: [],
        foliar: [],
        warningsHi: [
          "Borax basal अनिवार्य — hollow stem / curd browning बोरॉन चेतावनी",
        ],
      },
      {
        stageNumber: 2,
        stageNameHi: "वृद्धि",
        timingHi: "20–25 DAS",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "30 किग्रा / एकड़ — जड़ों के पास",
          },
        ],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [],
        seedTreatment: [],
        foliar: [
          {
            kind: "foliar",
            technical: "NPK",
            formulation: "19:19:19",
            doseHi: "1 किग्रा / 150 लीटर पानी",
            waterHi: "150 L",
          },
          {
            kind: "micronutrient",
            technical: "Chelated Zinc",
            doseHi: "100 ग्राम / 150 लीटर पानी",
            waterHi: "150 L",
          },
        ],
      },
      {
        stageNumber: 3,
        stageNameHi: "Buttoning",
        timingHi: "38–42 DAS",
        fertilizers: [],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [],
        seedTreatment: [],
        foliar: [
          {
            kind: "foliar",
            technical: "NPK",
            formulation: "0:52:34",
            doseHi: "1 किग्रा / 150 लीटर पानी",
            waterHi: "150 L",
          },
          {
            kind: "micronutrient",
            technical: "Boron",
            doseHi: "150 ग्राम / 150 लीटर पानी",
            waterHi: "150 L",
          },
          {
            kind: "micronutrient",
            technical: "Ammonium Molybdate",
            doseHi: "50 ग्राम / 150 लीटर पानी",
            waterHi: "150 L",
            purposeHi: "Whiptail / molybdenum",
          },
        ],
      },
      {
        stageNumber: 4,
        stageNameHi: "Curd / गोभी",
        timingHi: "50–55 DAS",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "Calcium Nitrate",
            doseHi: "10 किग्रा / एकड़",
            warningHi: "सल्फर / 0:52:34 टैंक-मिक्स से अलग रखें",
          },
        ],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [],
        seedTreatment: [],
        foliar: [
          {
            kind: "foliar",
            technical: "NPK",
            formulation: "0:0:50",
            doseHi: "1 किग्रा / 150 लीटर पानी",
            waterHi: "150 L",
          },
        ],
        mixingStatus: "separate",
      },
    ],
    globalWarningsHi: [
      ...SOURCE_VERIFY_WARNINGS,
      ...CALCIUM_NITRATE_MIX_WARNINGS,
    ],
  },

  bhindi: {
    cropNameHi: "भिंडी",
    englishName: "Bhindi (Okra)",
    categoryHi: "सब्जी",
    totalFertilizerHi: [
      "डीएपी 40, यूरिया 60, एमओपी 30 किग्रा / एकड़",
      "सल्फर (S) 5 किग्रा / एकड़",
    ],
    stages: [
      {
        stageNumber: 0,
        stageNameHi: "बीज उपचार",
        timingHi: "बुवाई से पहले",
        fertilizers: [],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [],
        seedTreatment: [
          {
            kind: "seed_treatment",
            technical: "Imidacloprid",
            formulation: "600 FS",
            doseHi: "3 मि.ली / किग्रा बीज",
            sourceClaimHi:
              "स्रोत: whitefly / YMV जोखिम — बीज उपचार का उल्लेख",
          },
          {
            kind: "seed_treatment",
            technical: "Carboxin + Thiram",
            doseHi: "2 ग्राम / किग्रा बीज",
            brands: ["Vitavax"],
          },
        ],
        foliar: [],
        mixingStatus: "seed_only",
      },
      {
        stageNumber: 1,
        stageNameHi: "बेसल",
        timingHi: "बुवाई / furrow",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "DAP",
            doseHi: "40 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "MOP",
            doseHi: "15 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "15 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "Sulphur",
            doseHi: "5 किग्रा / एकड़",
          },
        ],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [
          {
            kind: "humic",
            technical: "Humic Acid",
            doseHi: "500 ग्राम / एकड़",
          },
        ],
        pgr: [],
        seedTreatment: [],
        foliar: [],
        placementHi: "furrow में",
      },
      {
        stageNumber: 2,
        stageNameHi: "वृद्धि",
        timingHi: "20–25 DAS",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "25 किग्रा / एकड़",
          },
        ],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [
          {
            kind: "biostimulant",
            technical: "Seaweed",
            formulation: "granular",
            doseHi: "8 किग्रा / एकड़ — पंक्तियों में",
          },
        ],
        pgr: [],
        seedTreatment: [],
        foliar: [],
      },
      {
        stageNumber: 3,
        stageNameHi: "फूल / फल",
        timingHi: "38–42 DAS",
        fertilizers: [],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [
          {
            kind: "pgr",
            technical: "Alpha Naphthalene Acetic Acid (NAA)",
            doseHi: "30 मि.ली / 150 लीटर पानी",
            brands: ["Planofix"],
            waterHi: "150 L",
          },
        ],
        seedTreatment: [],
        foliar: [
          {
            kind: "foliar",
            technical: "NPK",
            formulation: "19:19:19",
            doseHi: "1 किग्रा / 150 लीटर पानी",
            waterHi: "150 L",
          },
          {
            kind: "micronutrient",
            technical: "Boron",
            doseHi: "100 ग्राम / 150 लीटर पानी",
            waterHi: "150 L",
          },
        ],
      },
      {
        stageNumber: 4,
        stageNameHi: "कटाई अंतराल",
        timingHi: "हर 8–10 दिन",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "12–15 किग्रा / एकड़ — सिंचाई के साथ",
          },
        ],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [],
        seedTreatment: [],
        foliar: [
          {
            kind: "foliar",
            technical: "NPK",
            formulation: "0:0:50",
            doseHi: "1 किग्रा / 150 लीटर पानी",
            waterHi: "150 L",
            sourceClaimHi: "स्रोत दावा: नरम / tender pods पर सहारा का उल्लेख",
          },
        ],
      },
    ],
    globalWarningsHi: SOURCE_VERIFY_WARNINGS,
  },

  cucumber: {
    cropNameHi: "खीरा",
    englishName: "Cucumber",
    categoryHi: "सब्जी",
    totalFertilizerHi: [
      "डीएपी 40, यूरिया 50, एमओपी 35 किग्रा / एकड़",
      "Neem cake 100 किग्रा / एकड़",
    ],
    stages: [
      {
        stageNumber: 0,
        stageNameHi: "बीज उपचार",
        timingHi: "बुवाई से पहले",
        fertilizers: [],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [],
        seedTreatment: [
          {
            kind: "biofertilizer",
            technical: "Trichoderma",
            doseHi: "10 ग्राम / किग्रा बीज",
            purposeHi: "जड़ सड़न (root rot)",
          },
        ],
        foliar: [],
        mixingStatus: "seed_only",
      },
      {
        stageNumber: 1,
        stageNameHi: "बेसल",
        timingHi: "रोपाई / bed incorporate",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "DAP",
            doseHi: "40 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "MOP",
            doseHi: "20 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "15 किग्रा / एकड़",
          },
        ],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [
          {
            kind: "humic",
            technical: "Humic Acid",
            doseHi: "500 ग्राम / एकड़",
          },
          {
            kind: "organic",
            technical: "Neem cake",
            doseHi: "100 किग्रा / एकड़ — bed में मिलाकर",
          },
        ],
        pgr: [],
        seedTreatment: [],
        foliar: [],
        activityHi: "bed incorporate",
      },
      {
        stageNumber: 2,
        stageNameHi: "2–4 पत्ती / लिंग संतुलन",
        timingHi: "25–28 DAS (2–4 leaf)",
        fertilizers: [],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [
          {
            kind: "pgr",
            technical: "Ethephon",
            formulation: "39% SL",
            doseHi: "1 मि.ली / 4–5 लीटर (≈35–40 मि.ली / 150 लीटर)",
            waterHi: "≈35–40 ml / 150 L",
            noteHi: "जब नर फूल (male) ज्यादा हों — तभी",
            warningHi: "ETHREL DOSE ALERT — खुराक सटीक रखो, लेबल जाँचो",
            sourceClaimHi:
              "स्रोत दावा: मादा (female) फूल ~3× का उल्लेख — SOURCE_CLAIM",
          },
        ],
        seedTreatment: [],
        foliar: [],
        mixingStatus: "validation",
      },
      {
        stageNumber: 3,
        stageNameHi: "फूल / फल सेट",
        timingHi: "35–40 DAS",
        fertilizers: [],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [],
        seedTreatment: [],
        foliar: [
          {
            kind: "foliar",
            technical: "NPK",
            formulation: "0:52:34",
            doseHi: "1 किग्रा / 150 लीटर पानी",
            waterHi: "150 L",
          },
          {
            kind: "micronutrient",
            technical: "Boron",
            doseHi: "100 ग्राम / 150 लीटर पानी",
            waterHi: "150 L",
          },
        ],
      },
      {
        stageNumber: 4,
        stageNameHi: "फल गुणवत्ता",
        timingHi: "45–70 DAS",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "Calcium Nitrate",
            doseHi: "10 किग्रा / एकड़",
            purposeHi: "Quality purposes",
            warningHi: "0:52:34 / सल्फर foliar से अलग",
          },
        ],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [],
        seedTreatment: [],
        foliar: [
          {
            kind: "foliar",
            technical: "NPK",
            formulation: "0:0:50",
            doseHi: "1 किग्रा / 150 लीटर पानी",
            waterHi: "150 L",
          },
        ],
        mixingStatus: "separate",
      },
    ],
    globalWarningsHi: [
      ...SOURCE_VERIFY_WARNINGS,
      ...CALCIUM_NITRATE_MIX_WARNINGS,
    ],
  },

  onion: {
    cropNameHi: "प्याज",
    englishName: "Onion",
    categoryHi: "सब्जी",
    totalNutrientsHi: [
      "N 45, P2O5 25, K2O 40, S 15 (kg/acre equivalent — स्रोत)",
    ],
    totalFertilizerHi: [
      "डीएपी 50, यूरिया 65, एमओपी 50 किग्रा / एकड़",
      "सल्फर (S) 12–15 किग्रा / एकड़ — अनिवार्य (MANDATORY)",
    ],
    stages: [
      {
        stageNumber: 0,
        stageNameHi: "पौध / सेट उपचार",
        timingHi: "रोपाई से पहले",
        activityHi: "10 मिनट डुबोना",
        fertilizers: [],
        pestProtection: [
          {
            kind: "insecticide",
            technical: "Carbosulfan",
            formulation: "25% EC",
            doseHi: "2 मि.ली / लीटर पानी",
            waterHi: "2 ml/L — 10 min",
            targetHi: "Thrips / root rot",
          },
        ],
        diseaseProtection: [
          {
            kind: "fungicide",
            technical: "Carbendazim + Mancozeb",
            doseHi: "2 ग्राम / लीटर पानी",
            brands: ["Saaf"],
            waterHi: "2 g/L",
          },
        ],
        rootBio: [],
        pgr: [],
        seedTreatment: [],
        foliar: [],
      },
      {
        stageNumber: 1,
        stageNameHi: "बेसल",
        timingHi: "रोपाई — broadcast / plank",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "DAP",
            doseHi: "50 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "MOP",
            doseHi: "25 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "20 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "Sulphur",
            doseHi: "12–15 किग्रा / एकड़ — अनिवार्य",
          },
        ],
        pestProtection: [
          {
            kind: "insecticide",
            technical: "Fipronil",
            formulation: "0.3% GR",
            doseHi: "8 किग्रा / एकड़",
          },
        ],
        diseaseProtection: [],
        rootBio: [
          {
            kind: "humic",
            technical: "Humic Acid",
            doseHi: "500 ग्राम / एकड़",
          },
        ],
        pgr: [],
        seedTreatment: [],
        foliar: [],
        applicationHi: "broadcast + plank",
      },
      {
        stageNumber: 2,
        stageNameHi: "वृद्धि",
        timingHi: "25–30 DAS",
        activityHi: "गुड़ाई + सिंचाई के बाद",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "25 किग्रा / एकड़",
          },
        ],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [
          {
            kind: "biostimulant",
            technical: "Granular biostimulant",
            doseHi: "8 किग्रा / एकड़",
            brands: ["Jaim"],
          },
        ],
        pgr: [],
        seedTreatment: [],
        foliar: [],
      },
      {
        stageNumber: 3,
        stageNameHi: "Bulb initiation",
        timingHi: "50–55 DAS",
        fertilizers: [],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [
          {
            kind: "pgr",
            technical: "Mepiquat chloride",
            formulation: "5% AS",
            doseHi: "250 मि.ली / 150 लीटर पानी",
            waterHi: "150 L",
          },
        ],
        seedTreatment: [],
        foliar: [
          {
            kind: "foliar",
            technical: "NPK",
            formulation: "0:52:34",
            doseHi: "1 किग्रा / 150 लीटर पानी",
            waterHi: "150 L",
          },
          {
            kind: "micronutrient",
            technical: "Boron",
            doseHi: "150 ग्राम / 150 लीटर पानी",
            waterHi: "150 L",
          },
        ],
      },
      {
        stageNumber: 4,
        stageNameHi: "Bulbing",
        timingHi: "70–75 DAS",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "20 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "MOP",
            doseHi: "25 किग्रा / एकड़",
          },
        ],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [],
        seedTreatment: [],
        foliar: [
          {
            kind: "foliar",
            technical: "NPK",
            formulation: "0:0:50",
            doseHi: "1.5 किग्रा / 150 लीटर पानी",
            waterHi: "150 L",
            sourceClaimHi:
              "स्रोत दावा: ~6 महीने storage / सफेद skin का उल्लेख",
          },
        ],
      },
    ],
    globalWarningsHi: [
      ...SOURCE_VERIFY_WARNINGS,
      "BULB N CUTOFF — 60 DAS के बाद मिट्टी में यूरिया न दें (स्रोत नियम)",
    ],
  },

  garlic: {
    cropNameHi: "लहसुन",
    englishName: "Garlic",
    categoryHi: "सब्जी",
    totalFertilizerHi: [
      "डीएपी 50, यूरिया 60, एमओपी 50 किग्रा / एकड़",
      "सल्फर (S) 12–15 किग्रा / एकड़",
    ],
    stages: [
      {
        stageNumber: 0,
        stageNameHi: "लहसुन कली उपचार",
        timingHi: "रोपाई से पहले",
        fertilizers: [],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [],
        seedTreatment: [
          {
            kind: "seed_treatment",
            technical: "Mancozeb",
            doseHi: "3 ग्राम / किग्रा कली",
          },
          {
            kind: "seed_treatment",
            technical: "Thiamethoxam",
            doseHi: "2 मि.ली / किग्रा कली",
          },
        ],
        foliar: [],
        mixingStatus: "seed_only",
      },
      {
        stageNumber: 1,
        stageNameHi: "बेसल",
        timingHi: "रोपाई",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "DAP",
            doseHi: "50 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "MOP",
            doseHi: "25 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "15 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "Sulphur",
            doseHi: "12 किग्रा / एकड़",
          },
        ],
        pestProtection: [
          {
            kind: "insecticide",
            technical: "Fipronil",
            formulation: "0.3% GR",
            doseHi: "8 किग्रा / एकड़",
          },
        ],
        diseaseProtection: [],
        rootBio: [
          {
            kind: "humic",
            technical: "Humic Acid",
            doseHi: "500 ग्राम / एकड़",
          },
        ],
        pgr: [],
        seedTreatment: [],
        foliar: [],
      },
      {
        stageNumber: 2,
        stageNameHi: "वृद्धि",
        timingHi: "30–35 DAS",
        activityHi: "पंक्तियों में + सिंचाई",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "25 किग्रा / एकड़",
          },
        ],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [
          {
            kind: "biostimulant",
            technical: "Seaweed",
            formulation: "granular",
            doseHi: "10 किग्रा / एकड़ — पंक्तियों में",
          },
        ],
        pgr: [],
        seedTreatment: [],
        foliar: [],
      },
      {
        stageNumber: 3,
        stageNameHi: "कली अलगाव",
        timingHi: "65–70 DAS",
        fertilizers: [],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [
          {
            kind: "pgr",
            technical: "Mepiquat chloride",
            formulation: "5% AS",
            doseHi: "250 मि.ली / 150 लीटर पानी",
            waterHi: "150 L",
            purposeHi: "Clove separation",
          },
        ],
        seedTreatment: [],
        foliar: [
          {
            kind: "foliar",
            technical: "NPK",
            formulation: "0:52:34",
            doseHi: "1 किग्रा / 150 लीटर पानी",
            waterHi: "150 L",
          },
          {
            kind: "micronutrient",
            technical: "Boron",
            doseHi: "150 ग्राम / 150 लीटर पानी",
            waterHi: "150 L",
          },
        ],
      },
      {
        stageNumber: 4,
        stageNameHi: "परिपक्वता / bulb",
        timingHi: "95–105 DAS",
        fertilizers: [],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [],
        seedTreatment: [],
        foliar: [
          {
            kind: "foliar",
            technical: "NPK",
            formulation: "0:0:50",
            doseHi: "1.5 किग्रा / 150 लीटर पानी",
            waterHi: "150 L",
            sourceClaimHi:
              "स्रोत दावा: सफेद skin / solid bulb पर सहारा का उल्लेख",
          },
        ],
      },
    ],
    globalWarningsHi: [
      ...SOURCE_VERIFY_WARNINGS,
      "N cutoff — 60 DAS के बाद nitrogen बंद (स्रोत चेतावनी)",
    ],
  },

  ginger: {
    cropNameHi: "अदरक",
    englishName: "Ginger",
    categoryHi: "सब्जी",
    totalFertilizerHi: [
      "डीएपी 60, यूरिया 80, एमओपी 50 किग्रा / एकड़",
      "Neem cake 150 किग्रा / एकड़",
    ],
    stages: [
      {
        stageNumber: 0,
        stageNameHi: "Rhizome dip",
        timingHi: "रोपाई से पहले",
        activityHi: "30 मिनट — छाया में सुखाकर रोपो",
        fertilizers: [],
        pestProtection: [
          {
            kind: "insecticide",
            technical: "Chlorpyrifos",
            formulation: "20% EC",
            doseHi: "2 मि.ली / लीटर पानी",
            waterHi: "2 ml/L",
          },
        ],
        diseaseProtection: [
          {
            kind: "fungicide",
            technical: "Mancozeb",
            formulation: "75%",
            doseHi: "3 ग्राम + Streptocycline 1 ग्राम / 10 लीटर पानी",
            waterHi: "3 g Mancozeb + 1 g Streptocycline / 10 L",
            sourceClaimHi:
              "स्रोत दावा: soft rot पर 100% सुरक्षा का उल्लेख — SOURCE_CLAIM",
          },
        ],
        rootBio: [],
        pgr: [],
        seedTreatment: [],
        foliar: [],
        applicationHi: "30 min dip, shade dry",
      },
      {
        stageNumber: 1,
        stageNameHi: "बेसल — raised beds",
        timingHi: "रोपाई",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "DAP",
            doseHi: "60 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "MOP",
            doseHi: "25 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "20 किग्रा / एकड़",
          },
        ],
        pestProtection: [
          {
            kind: "insecticide",
            technical: "Fipronil",
            formulation: "0.3% GR",
            doseHi: "10 किग्रा / एकड़",
          },
        ],
        diseaseProtection: [],
        rootBio: [
          {
            kind: "humic",
            technical: "Humic Acid",
            formulation: "98%",
            doseHi: "1 किग्रा / एकड़",
          },
          {
            kind: "organic",
            technical: "Neem cake",
            doseHi: "150 किग्रा / एकड़",
          },
        ],
        pgr: [],
        seedTreatment: [],
        foliar: [],
        placementHi: "raised beds",
      },
      {
        stageNumber: 2,
        stageNameHi: "Trichoderma — beds",
        timingHi: "45–50 DAS",
        fertilizers: [],
        pestProtection: [],
        diseaseProtection: [
          {
            kind: "biofertilizer",
            technical: "Trichoderma",
            doseHi: "2 किग्रा — 100 किग्रा FYM में beds पर",
            warningHi: "Chemical fungicide के साथ मत मिलाओ",
          },
        ],
        rootBio: [],
        pgr: [],
        seedTreatment: [],
        foliar: [],
        dontHi: ["Trichoderma को chemical fungicide के साथ direct mix न करें"],
      },
      {
        stageNumber: 3,
        stageNameHi: "Earthing",
        timingHi: "80–90 DAS",
        activityHi: "Earthing up — पंक्तियों में",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "30 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "MOP",
            doseHi: "15 किग्रा / एकड़",
          },
        ],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [
          {
            kind: "biostimulant",
            technical: "Granular biostimulant",
            doseHi: "10 किग्रा / एकड़",
            brands: ["Jaim"],
          },
        ],
        pgr: [],
        seedTreatment: [],
        foliar: [],
      },
      {
        stageNumber: 4,
        stageNameHi: "देर अवस्था",
        timingHi: "130–150 DAS",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "30 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "MOP",
            doseHi: "10 किग्रा / एकड़",
          },
        ],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [],
        seedTreatment: [],
        foliar: [
          {
            kind: "foliar",
            technical: "NPK",
            formulation: "0:0:50",
            doseHi: "2 किग्रा / 150 लीटर पानी",
            waterHi: "150 L",
          },
          {
            kind: "micronutrient",
            technical: "Boron",
            doseHi: "200 ग्राम / 150 लीटर पानी",
            waterHi: "150 L",
          },
        ],
      },
    ],
    globalWarningsHi: SOURCE_VERIFY_WARNINGS,
  },
};
