import type { CropFertilizerMixinGuide } from "./fertilizerMixinFieldGuide";

const SOURCE_VERIFY_WARNINGS = [
  "SOURCE DATA — OPERATIONAL USE से पहले सत्यापित करें",
  "कीटनाशक / फफूंदनाशक — पैकेट लेबल और स्थानीय कृषि अधिकारी की सलाह ज़रूर जाँचें",
];

export const PART4_GUIDES: Record<string, CropFertilizerMixinGuide> = {
  mango: {
    cropNameHi: "आम",
    englishName: "Mango",
    categoryHi: "फल बाग",
    principlesHi: [
      "वयस्क पेड़ 8–10+ वर्ष — वार्षिक मात्रा प्रति पेड़",
    ],
    totalFertilizerHi: [
      "FYM 50–80 किग्रा / पेड़ / वर्ष",
      "DAP 1.5 किग्रा / पेड़ / वर्ष OR SSP 3.5 किग्रा / पेड़ / वर्ष",
      "Urea 2–2.5 किग्रा / पेड़ / वर्ष",
      "MOP 1.5–2 किग्रा / पेड़ / वर्ष",
      "Zinc sulphate (ZnSO4) 250 ग्राम / पेड़ / वर्ष",
      "Borax 150 ग्राम / पेड़ / वर्ष",
      "Copper sulphate (CuSO4) 100 ग्राम / पेड़ / वर्ष",
    ],
    stages: [
      {
        stageNumber: 1,
        stageNameHi: "कटाई के बाद",
        timingHi: "जुलाई – अगस्त (Post-harvest)",
        activityHi: "मिट्टी खाद + termite / Trichoderma",
        fertilizers: [
          {
            kind: "organic",
            technical: "FYM",
            doseHi: "50–80 किग्रा / पेड़",
          },
          {
            kind: "organic",
            technical: "Neem cake",
            doseHi: "3 किग्रा / पेड़",
          },
          {
            kind: "fertilizer",
            technical: "DAP",
            doseHi: "1.5 किग्रा / पेड़",
          },
          {
            kind: "fertilizer",
            technical: "MOP",
            doseHi: "1 किग्रा / पेड़",
          },
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "1 किग्रा / पेड़",
          },
          {
            kind: "humic",
            technical: "Humic acid",
            formulation: "granular",
            doseHi: "100 ग्राम / पेड़",
          },
        ],
        pestProtection: [
          {
            kind: "insecticide",
            technical: "Fipronil",
            formulation: "0.3% GR",
            doseHi: "100 ग्राम / पेड़",
            targetHi: "Termite",
          },
        ],
        diseaseProtection: [
          {
            kind: "fungicide",
            technical: "Copper oxychloride",
            doseHi: "3 g/L — cut paste (छँटाई के बाद)",
            purposeHi: "कटे हुए stem / wound पर",
            noteHi: "छँटाई के तुरंत बाद",
          },
        ],
        rootBio: [
          {
            kind: "biofertilizer",
            technical: "Trichoderma",
            doseHi: "50 ग्राम / पेड़ — FYM के साथ मिलाकर",
            noteHi: "FYM के साथ — chemical के साथ direct mix नहीं",
          },
        ],
        pgr: [],
        seedTreatment: [],
        foliar: [],
        placementHi:
          "Canopy drip-line — तने से 1.5–2 m दूर, 9\" गहरा गड्ढा",
        mixingHi: "Trichoderma FYM में; बाकी खाद गड्ढे में",
        dontHi: ["Trichoderma को chemical के साथ सीधे मत मिलाओ"],
        fieldDoctorTipHi:
          "छँटाई के बाद कटे हुए हिस्से पर Copper Oxychloride 3 g/L paste लगाएँ",
      },
      {
        stageNumber: 2,
        stageNameHi: "फूल प्रेरण",
        timingHi: "सितंबर – अक्टूबर (Flower induction)",
        fertilizers: [],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [
          {
            kind: "pgr",
            technical: "Paclobutrazol",
            formulation: "23% SC",
            doseHi:
              "3 ml प्रति m canopy diameter — उदा. 5 m → 15 ml, 15–20 L पानी में root-zone basin",
            brands: ["Kaltar", "Austar"],
            waterHi: "15–20 L पानी — root-zone basin",
            purposeHi: "Alternate bearing varieties",
            sourceClaimHi: "SOURCE_CLAIM — heavy flowering",
          },
        ],
        seedTreatment: [],
        foliar: [],
        applicationHi: "Root-zone basin में",
      },
      {
        stageNumber: 3,
        stageNameHi: "Pre-flower spray",
        timingHi: "दिसंबर अंत – जनवरी (flowers खुलने से पहले)",
        activityHi: "Powdery mildew / hopper — FULL BLOOM से पहले",
        fertilizers: [
          {
            kind: "foliar",
            technical: "19:19:19",
            doseHi: "75 ग्राम / 15 L tank",
            waterHi: "15 L tank",
          },
        ],
        pestProtection: [
          {
            kind: "insecticide",
            technical: "Thiamethoxam",
            formulation: "25% WG",
            doseHi: "8 ग्राम / 15 L tank",
            waterHi: "15 L tank",
            targetHi: "Hopper",
          },
        ],
        diseaseProtection: [
          {
            kind: "fungicide",
            technical: "Thiophanate methyl",
            formulation: "70% WP",
            doseHi: "20 ग्राम / 15 L tank",
            brands: ["Roko"],
            waterHi: "15 L tank",
            targetHi: "Powdery mildew",
          },
        ],
        rootBio: [],
        pgr: [],
        seedTreatment: [],
        foliar: [
          {
            kind: "micronutrient",
            technical: "Boron",
            formulation: "20%",
            doseHi: "15 ग्राम / 15 L tank",
            waterHi: "15 L tank",
          },
        ],
        doHi: ["फूल खुलने से पहले ही spray पूरा करें"],
        dontHi: [
          "FULL BLOOM — NO SPRAY",
          "FULL BLOOM — NO WATER (pollinator / परागण)",
        ],
        warningsHi: [
          "FULL BLOOM: NO SPRAY — pollinator alert",
          "FULL BLOOM: NO WATER — pollinator alert",
        ],
        mixingStatus: "validation",
      },
      {
        stageNumber: 4,
        stageNameHi: "मटर दाना size",
        timingHi: "मार्च मध्य (Pea size)",
        fertilizers: [
          {
            kind: "foliar",
            technical: "0:52:34",
            doseHi: "75 ग्राम / 15 L tank",
            waterHi: "15 L tank",
          },
          {
            kind: "micronutrient",
            technical: "Boron",
            doseHi: "15 ग्राम / 15 L tank",
            waterHi: "15 L tank",
          },
        ],
        pestProtection: [
          {
            kind: "insecticide",
            technical: "Imidacloprid",
            formulation: "17.8% SL",
            doseHi: "5 ml / 15 L tank",
            waterHi: "15 L tank",
          },
        ],
        diseaseProtection: [],
        rootBio: [],
        pgr: [
          {
            kind: "pgr",
            technical: "Alpha naphthalene acetic acid (NAA)",
            doseHi: "3–4 ml / 15 L tank",
            brands: ["Planofix"],
            waterHi: "15 L tank",
            sourceClaimHi: "SOURCE_CLAIM — fruit drop ~90%",
          },
        ],
        seedTreatment: [],
        foliar: [],
        mixingStatus: "validation",
      },
      {
        stageNumber: 5,
        stageNameHi: "Oval / विकास",
        timingHi: "अप्रैल – मई",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "500 ग्राम / पेड़ — मिट्टी",
          },
          {
            kind: "fertilizer",
            technical: "MOP",
            doseHi: "500 ग्राम / पेड़ — मिट्टी",
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
            technical: "13:0:45",
            doseHi: "100 ग्राम / tank",
            sourceClaimHi: "SOURCE_CLAIM — sweetness / weight",
          },
          {
            kind: "micronutrient",
            technical: "Borax",
            formulation: "1%",
            doseHi: "150 ग्राम / tank",
            purposeHi: "Black tip",
          },
        ],
        applicationHi: "मिट्टी + foliar अलग-अलग",
      },
    ],
    globalWarningsHi: [
      ...SOURCE_VERIFY_WARNINGS,
      "FULL BLOOM — spray और पानी दोनों बंद — pollinator / परागण",
    ],
  },

  banana: {
    cropNameHi: "केला",
    englishName: "Banana (G9)",
    categoryHi: "फल बाग",
    principlesHi: ["G9 — लगभग 1200 plants / acre"],
    totalFertilizerHi: [
      "Urea 400–450 ग्राम / plant / season",
      "DAP 150 ग्राम / plant OR SSP 400 ग्राम / plant",
      "MOP 450–500 ग्राम / plant",
      "Magnesium sulphate (MgSO4) 30 ग्राम / plant",
    ],
    stages: [
      {
        stageNumber: 0,
        stageNameHi: "गड्ढा / pit",
        timingHi: "रोपण से पहले pit filling",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "DAP",
            doseHi: "75 ग्राम / plant",
            options: [
              {
                kind: "fertilizer",
                technical: "SSP",
                doseHi: "200 ग्राम / plant",
              },
            ],
          },
          {
            kind: "organic",
            technical: "FYM",
            doseHi: "5 किग्रा / plant",
          },
          {
            kind: "organic",
            technical: "Neem cake",
            doseHi: "250 ग्राम / plant",
          },
        ],
        pestProtection: [
          {
            kind: "insecticide",
            technical: "Fipronil",
            formulation: "GR",
            doseHi: "20 ग्राम / plant",
            targetHi: "Corm borer / nematode",
          },
        ],
        diseaseProtection: [],
        rootBio: [
          {
            kind: "biofertilizer",
            technical: "Trichoderma",
            doseHi: "25 ग्राम / plant",
            noteHi: "Pit mix — chemical fungicide के साथ direct mix नहीं",
          },
        ],
        pgr: [],
        seedTreatment: [],
        foliar: [],
      },
      {
        stageNumber: 1,
        stageNameHi: "Root establishment",
        timingHi: "15–30 DAP",
        activityHi: "Root drench 200 ml / plant",
        fertilizers: [
          {
            kind: "foliar",
            technical: "19:19:19",
            doseHi: "5 g/L — drench mix",
          },
        ],
        pestProtection: [],
        diseaseProtection: [
          {
            kind: "fungicide",
            technical: "Carbendazim",
            doseHi: "2 g/L — drench mix",
          },
        ],
        rootBio: [
          {
            kind: "humic",
            technical: "Humic acid",
            formulation: "98%",
            doseHi: "2 g/L — drench mix",
          },
        ],
        pgr: [],
        seedTreatment: [],
        foliar: [],
        applicationHi: "200 ml / plant root drench",
        mixingHi: "Humic 2 g/L + 19:19:19 5 g/L + Carbendazim 2 g/L",
      },
      {
        stageNumber: 2,
        stageNameHi: "Grand growth",
        timingHi: "60 / 90 / 120 / 150 DAP — मासिक",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "75 ग्राम / plant / month",
          },
          {
            kind: "fertilizer",
            technical: "MOP",
            doseHi: "75 ग्राम / plant / month",
          },
          {
            kind: "fertilizer",
            technical: "Magnesium sulphate (MgSO4)",
            doseHi: "10 ग्राम / plant / month",
          },
          {
            kind: "micronutrient",
            technical: "Zinc sulphate",
            formulation: "33%",
            doseHi: "5 ग्राम / plant / month",
          },
        ],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [],
        seedTreatment: [],
        foliar: [],
        placementHi:
          "Ring 10\" from stem OR drip — stem से 10\" दूर ring / drip",
      },
      {
        stageNumber: 3,
        stageNameHi: "Bunch emergence",
        timingHi: "210–240 days",
        activityHi: "Fingers open के बाद foliar",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "50 ग्राम / plant — मिट्टी",
          },
          {
            kind: "fertilizer",
            technical: "MOP",
            doseHi: "100 ग्राम / plant — मिट्टी",
          },
        ],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [
          {
            kind: "pgr",
            technical: "Gibberellic acid (GA3)",
            formulation: "90%",
            doseHi: "1 g / 100 L — foliar tank",
            waterHi: "150 L tank",
          },
        ],
        seedTreatment: [],
        foliar: [
          {
            kind: "foliar",
            technical: "0:52:34",
            doseHi: "1 किग्रा / 150 L tank",
            waterHi: "150 L tank",
          },
          {
            kind: "micronutrient",
            technical: "Boron",
            doseHi: "150 ग्राम / 150 L tank",
            waterHi: "150 L tank",
          },
        ],
        doHi: ["Fingers open होने के बाद foliar"],
      },
      {
        stageNumber: 4,
        stageNameHi: "Late bunch / weight",
        timingHi: "250–300 days",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "MOP",
            doseHi: "100 ग्राम / plant — मिट्टी",
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
            technical: "13:0:45",
            doseHi: "1.5 किग्रा / 150 L tank",
            waterHi: "150 L tank",
          },
          {
            kind: "fertilizer",
            technical: "Calcium nitrate (CaNO3)",
            doseHi: "500 ग्राम / 150 L tank",
            waterHi: "150 L tank",
          },
        ],
        dontHi: ["UREA बंद — late nitrogen न दें"],
        warningsHi: [
          "LATE NITROGEN ALERT — इस stage पर Urea / nitrogen बंद",
          "Blue plastic sleeve — bunch पर (weight claim के साथ field practice)",
        ],
        fieldDoctorTipHi:
          "Blue plastic sleeve — SOURCE_CLAIM weight +25–30%",
      },
    ],
    globalWarningsHi: [
      ...SOURCE_VERIFY_WARNINGS,
      "LATE NITROGEN ALERT — bunch mature stage पर nitrogen बंद",
    ],
  },

  grapes: {
    cropNameHi: "अंगूर",
    englishName: "Grapes",
    categoryHi: "फल बाग",
    totalNutrientsHi: [
      "N 50 kg / acre",
      "P 40 kg / acre",
      "K 120 kg / acre",
      "Calcium nitrate (CaNO3) 25 kg / acre",
      "Magnesium sulphate (MgSO4) 20 kg / acre",
    ],
    principlesHi: ["DAP = days after pruning"],
    stages: [
      {
        stageNumber: 1,
        stageNameHi: "Pruning / bud break",
        timingHi: "0–15 DAP",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "MAP",
            formulation: "12:61:00",
            doseHi: "5 किग्रा / acre — drip",
          },
          {
            kind: "humic",
            technical: "Humic acid",
            formulation: "98%",
            doseHi: "1 किग्रा / acre — drip",
          },
        ],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [
          {
            kind: "other",
            technical: "Hydrogen cyanamide",
            formulation: "50% SL",
            doseHi: "30–35 ml/L — cane paste",
            brands: ["Dormex"],
            sourceClaimHi: "SOURCE_CLAIM — bud break 10–12 days",
          },
        ],
        seedTreatment: [],
        foliar: [],
        applicationHi: "Cane paste + drip",
      },
      {
        stageNumber: 2,
        stageNameHi: "Pre-flower",
        timingHi: "25–35 DAP",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "19:19:19",
            doseHi: "4 किग्रा / acre — drip, alternate days",
          },
        ],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [
          {
            kind: "pgr",
            technical: "Gibberellic acid (GA3)",
            doseHi: "10–15 PPM (1–1.5 g / 100 L)",
            waterHi: "100 L",
          },
        ],
        seedTreatment: [],
        foliar: [],
      },
      {
        stageNumber: 3,
        stageNameHi: "Flower–berry set",
        timingHi: "45–55 DAP",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "0:52:34",
            doseHi: "5 किग्रा / acre — drip",
          },
        ],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [
          {
            kind: "pgr",
            technical: "Gibberellic acid (GA3)",
            doseHi: "30–40 PPM — first thinning dip",
          },
        ],
        seedTreatment: [],
        foliar: [],
        dontHi: ["NITROGEN बंद — इस stage से nitrogen drip बंद"],
        warningsHi: ["NITROGEN बंद"],
      },
      {
        stageNumber: 4,
        stageNameHi: "Berry 4–6 mm",
        timingHi: "60–70 DAP",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "Calcium nitrate (CaNO3)",
            doseHi: "5 किग्रा / acre — drip",
          },
          {
            kind: "fertilizer",
            technical: "Magnesium sulphate (MgSO4)",
            doseHi: "4 किग्रा / acre — drip",
          },
        ],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [
          {
            kind: "pgr",
            technical: "Gibberellic acid (GA3)",
            doseHi: "40 PPM — dip",
          },
          {
            kind: "pgr",
            technical: "CPPU (Forchlorfenuron)",
            doseHi: "1 ml/L — dip",
            warningHi: "CPPU DOSE ALERT — max 1.5–2 ml/L",
          },
        ],
        seedTreatment: [],
        foliar: [
          {
            kind: "foliar",
            technical: "0:52:34",
            doseHi: "2 g/L",
            sourceClaimHi: "SOURCE_CLAIM — export quality",
          },
        ],
        warningsHi: ["CPPU DOSE ALERT — अधिकतम 1.5–2 ml/L"],
      },
      {
        stageNumber: 5,
        stageNameHi: "Veraison",
        timingHi: "95–120 DAP",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "0:0:50",
            doseHi: "5 किग्रा / acre — drip, 2× / week",
            sourceClaimHi: "SOURCE_CLAIM — Brix 18+ / crack control",
          },
          {
            kind: "micronutrient",
            technical: "Boron",
            doseHi: "500 ग्राम / acre — drip",
          },
        ],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [],
        pgr: [],
        seedTreatment: [],
        foliar: [],
        dontHi: ["Nitrogen 100% बंद"],
        warningsHi: ["Nitrogen 100% बंद — veraison पर"],
      },
    ],
    globalWarningsHi: [
      ...SOURCE_VERIFY_WARNINGS,
      "CPPU overdose — label max 1.5–2 ml/L",
      "Veraison के बाद nitrogen पूर्ण बंद",
    ],
  },
};
