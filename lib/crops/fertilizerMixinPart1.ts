import type { CropFertilizerMixinGuide } from "./fertilizerMixinFieldGuide";

const SOURCE_VERIFY_WARNINGS = [
  "SOURCE DATA — OPERATIONAL USE से पहले सत्यापित करें",
  "कीटनाशक / फफूंदनाशक — पैकेट लेबल और स्थानीय कृषि अधिकारी की सलाह ज़रूर जाँचें",
];

export const PART1_GUIDES: Record<string, CropFertilizerMixinGuide> = {
  paddy: {
    cropNameHi: "धान",
    englishName: "Paddy",
    categoryHi: "खरीफ अनाज",
    totalFertilizerHi: [
      "डीएपी 50 किग्रा / एकड़ (रोपाई)",
      "एमओपी 20 किग्रा / एकड़ (रोपाई)",
      "यूरिया 35 किग्रा / एकड़ (20–25 DAS)",
    ],
    stages: [
      {
        stageNumber: 1,
        stageNameHi: "रोपाई / लेव",
        timingHi: "रोपाई के समय",
        activityHi: "पौध रोपण / स्थापना",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "DAP",
            doseHi: "50 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "MOP",
            doseHi: "20 किग्रा / एकड़",
          },
        ],
        pestProtection: [],
        diseaseProtection: [
          {
            kind: "biofertilizer",
            technical: "Trichoderma viride",
            doseHi: "1–2 किग्रा — 50 किग्रा सड़ी गोबर (FYM) में मिलाकर",
            purposeHi: "जड़ / मिट्टी स्वास्थ्य — सफेद जड़ें, रोपाई झटका कम",
            warningHi: "डीएपी के साथ सीधे मत मिलाओ",
          },
        ],
        rootBio: [
          {
            kind: "humic",
            technical: "Humic Acid",
            formulation: "98% Powder",
            doseHi: "500 ग्राम / एकड़",
            purposeHi: "सफेद जड़ें / रोपाई झटका कम",
            options: [
              {
                kind: "mycorrhiza",
                technical: "Mycorrhiza / VAM",
                doseHi: "4 किग्रा / एकड़",
                purposeHi: "सफेद जड़ें / रोपाई झटका कम",
              },
            ],
          },
        ],
        pgr: [],
        seedTreatment: [],
        foliar: [],
        dontHi: ["Trichoderma viride को DAP के साथ सीधे मत मिलाओ"],
        warningsHi: [
          "Trichoderma — 50 किग्रा FYM में 3 दिन छाया में, फिर खेत में — DAP से अलग",
        ],
      },
      {
        stageNumber: 2,
        stageNameHi: "पहली top dressing",
        timingHi: "20–25 DAS",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "35 किग्रा / एकड़",
          },
          {
            kind: "micronutrient",
            technical: "Zinc sulphate",
            formulation: "21%",
            doseHi: "10 किग्रा / एकड़",
          },
        ],
        pestProtection: [
          {
            kind: "insecticide",
            technical: "Cartap hydrochloride",
            formulation: "4% GR",
            doseHi: "7–8 किग्रा / एकड़",
            brands: ["Caldan", "Padan"],
            noteHi: "नीचे विकल्पों में से एक चुनें (या)",
            options: [
              {
                kind: "insecticide",
                technical: "Chlorantraniliprole",
                formulation: "0.4% GR",
                doseHi: "4 किग्रा / एकड़",
                brands: ["Ferterra"],
              },
              {
                kind: "insecticide",
                technical: "Fipronil",
                formulation: "0.3% GR",
                doseHi: "7–8 किग्रा / एकड़",
                brands: ["Regent"],
              },
            ],
          },
        ],
        diseaseProtection: [],
        rootBio: [
          {
            kind: "biostimulant",
            technical: "Seaweed / enzyme granular",
            doseHi: "8–10 किग्रा / एकड़",
            brands: ["Sagarika", "Biozyme"],
          },
        ],
        pgr: [],
        seedTreatment: [],
        foliar: [],
        moistureHi: "1–2 इंच पानी — हल्की standing / नम मिट्टी",
        mixingHi:
          "यूरिया + जिंक + GR कीटनाशक + biostimulant — मिलाकर तुरंत डालो",
        mixingStatus: "immediate",
      },
    ],
    globalWarningsHi: SOURCE_VERIFY_WARNINGS,
  },

  wheat: {
    cropNameHi: "गेहूं",
    englishName: "Wheat",
    categoryHi: "रबी अनाज",
    totalFertilizerHi: [
      "डीएपी 50 किग्रा / एकड़ (बुवाई)",
      "एमओपी 30 किग्रा / एकड़ (बुवाई)",
      "यूरिया 45 किग्रा / एकड़ (CRI 21–25 DAS)",
    ],
    stages: [
      {
        stageNumber: 1,
        stageNameHi: "बुवाई",
        timingHi: "बुवाई के समय",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "DAP",
            doseHi: "50 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "MOP",
            doseHi: "30 किग्रा / एकड़",
          },
        ],
        pestProtection: [
          {
            kind: "insecticide",
            technical: "Fipronil",
            formulation: "0.3% GR",
            doseHi: "8–10 किग्रा / एकड़",
            brands: ["Regent"],
            noteHi: "या बीज उपचार (seedTreatment) — दोनों एक साथ नहीं",
          },
        ],
        diseaseProtection: [],
        rootBio: [
          {
            kind: "humic",
            technical: "Humic acid",
            formulation: "granular",
            doseHi: "5 किग्रा / एकड़",
          },
        ],
        pgr: [],
        seedTreatment: [
          {
            kind: "seed_treatment",
            technical: "Thiamethoxam",
            formulation: "30% FS",
            doseHi: "100 मि.ली / क्विंटल बीज",
            noteHi: "बुवाई से पहले बीज पर अलग — GR furrow विकल्प के बजाय",
          },
        ],
        foliar: [],
        placementHi: "डीएपी की furrow / बुवाई लाइन में मिलाकर",
        mixingStatus: "separate",
      },
      {
        stageNumber: 2,
        stageNameHi: "CRI — पहली nitrogen",
        timingHi: "21–25 DAS (CRI)",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "45 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "Sulphur",
            formulation: "90% granular / bentonite",
            doseHi: "3–4 किग्रा / एकड़ — यूरिया के साथ",
            sourceClaimHi:
              "स्रोत दावा: सल्फर — ठंड / मिट्टी ताप से जुड़ी उपज सुरक्षा का उल्लेख",
          },
        ],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [
          {
            kind: "humic",
            technical: "Humic Acid",
            formulation: "98%",
            doseHi: "500 ग्राम / एकड़ — यूरिया के साथ",
            noteHi: "अगर बुवाई पर humic granular 5 किग्रा नहीं डाला हो तभी",
          },
        ],
        pgr: [],
        seedTreatment: [],
        foliar: [],
        mixingHi: "यूरिया + सल्फर (+ जरूरत पर humic) साथ मिलाकर",
      },
    ],
    globalWarningsHi: SOURCE_VERIFY_WARNINGS,
  },

  maize: {
    cropNameHi: "मक्का",
    englishName: "Maize",
    categoryHi: "खरीफ अनाज",
    totalFertilizerHi: [
      "डीएपी 50 किग्रा / एकड़",
      "एमओपी 20 किग्रा / एकड़",
      "यूरिया 40 किग्रा / एकड़ (25–30 DAS)",
    ],
    stages: [
      {
        stageNumber: 1,
        stageNameHi: "बुवाई / स्थापना",
        timingHi: "बुवाई के समय",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "DAP",
            doseHi: "50 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "MOP",
            doseHi: "20 किग्रा / एकड़",
          },
        ],
        pestProtection: [
          {
            kind: "insecticide",
            technical: "Chlorpyrifos",
            formulation: "20% EC",
            doseHi: "1 लीटर + 20–25 किग्रा सूखी रेत",
            noteHi: "या नीचे विकल्प",
            options: [
              {
                kind: "insecticide",
                technical: "Fipronil",
                formulation: "0.3% GR",
                doseHi: "8 किग्रा / एकड़",
                noteHi: "डीएपी furrow के साथ",
              },
            ],
          },
        ],
        diseaseProtection: [],
        rootBio: [],
        pgr: [],
        seedTreatment: [],
        foliar: [],
        placementHi: "डीएपी furrow / बुवाई लाइन",
      },
      {
        stageNumber: 2,
        stageNameHi: "घुटने-ऊँचाई (knee-high)",
        timingHi: "25–30 DAS",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "40 किग्रा / एकड़",
          },
        ],
        pestProtection: [
          {
            kind: "insecticide",
            technical: "Chlorantraniliprole",
            formulation: "0.4% GR",
            doseHi: "4 किग्रा / एकड़",
            brands: ["Ferterra"],
            targetHi: "फॉल आर्मीवर्म / तना छेदक",
          },
        ],
        diseaseProtection: [],
        rootBio: [],
        pgr: [],
        seedTreatment: [],
        foliar: [],
        placementHi: "जड़ के पास — डालते ही मिट्टी चढ़ao (earthing)",
        mixingHi: "यूरिया + GR कीटनाशक — जड़ के नज़दीक",
        doHi: ["डालते ही तुरंत मिट्टी चढ़ाना (earth up)"],
      },
    ],
    globalWarningsHi: SOURCE_VERIFY_WARNINGS,
  },

  bajra: {
    cropNameHi: "बाजरा",
    englishName: "Bajra",
    categoryHi: "खरीफ मिलेट",
    totalFertilizerHi: ["डीएपी 35 किग्रा / एकड़ (बुवाई)"],
    stages: [
      {
        stageNumber: 1,
        stageNameHi: "बुवाई",
        timingHi: "बुवाई के समय",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "DAP",
            doseHi: "35 किग्रा / एकड़",
          },
        ],
        pestProtection: [
          {
            kind: "insecticide",
            technical: "Fipronil",
            formulation: "0.3% GR",
            doseHi: "7 किग्रा / एकड़",
            noteHi: "डीएपी के साथ furrow में",
          },
        ],
        diseaseProtection: [],
        rootBio: [
          {
            kind: "mycorrhiza",
            technical: "VAM",
            doseHi: "4 किग्रा / एकड़",
            sourceClaimHi: "स्रोत दावा: VAM — जड़ गहराई ~3× का उल्लेख",
          },
        ],
        pgr: [],
        seedTreatment: [],
        foliar: [],
        placementHi: "डीएपी furrow के साथ",
      },
    ],
    globalWarningsHi: SOURCE_VERIFY_WARNINGS,
  },

  sugarcane: {
    cropNameHi: "गन्ना",
    englishName: "Sugarcane",
    categoryHi: "नकदी फसल",
    totalFertilizerHi: [
      "डीएपी 70 किग्रा / एकड़ (रोपण)",
      "एमओपी 25 किग्रा / एकड़ (रोपण)",
      "यूरिया 45 किग्रा / एकड़ (45–60 DAS)",
    ],
    stages: [
      {
        stageNumber: 1,
        stageNameHi: "रोपण",
        timingHi: "गन्ना रोपण / sett planting",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "DAP",
            doseHi: "70 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "MOP",
            doseHi: "25 किग्रा / एकड़",
          },
        ],
        pestProtection: [
          {
            kind: "insecticide",
            technical: "Fipronil",
            formulation: "0.3% GR",
            doseHi: "10–12 किग्रा / एकड़",
            noteHi: "furrow में — या नीचे विकल्प",
            options: [
              {
                kind: "insecticide",
                technical: "Fipronil + Imidacloprid",
                formulation: "40% + 40% WG",
                doseHi: "150–200 ग्राम — 300 लीटर पानी में",
                brands: ["Lesenta"],
              },
            ],
          },
        ],
        diseaseProtection: [],
        rootBio: [],
        pgr: [],
        seedTreatment: [
          {
            kind: "seed_treatment",
            technical: "Carbendazim",
            formulation: "50% WP",
            doseHi: "2 ग्राम / लीटर — sett 15 मिनट डुबोकर",
            waterHi: "2 g/L dip, 15 min",
            purposeHi: "बीज / sett सेट — फफूंद रोक",
          },
        ],
        foliar: [],
        placementHi: "furrow में basal",
        mixingStatus: "separate",
      },
      {
        stageNumber: 2,
        stageNameHi: "वृद्धि top dressing",
        timingHi: "45–60 DAS",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "45 किग्रा / एकड़",
          },
        ],
        pestProtection: [
          {
            kind: "insecticide",
            technical: "Cartap hydrochloride",
            formulation: "4% GR",
            doseHi: "8–10 किग्रा / एकड़",
            noteHi: "या नीचे विकल्प",
            options: [
              {
                kind: "insecticide",
                technical: "Chlorantraniliprole",
                formulation: "0.4% GR",
                doseHi: "7.5 किग्रा / एकड़",
                brands: ["Ferterra"],
              },
            ],
          },
        ],
        diseaseProtection: [],
        rootBio: [],
        pgr: [],
        seedTreatment: [],
        foliar: [],
        placementHi: "जड़ के पास",
        applicationHi: "डालने के बाद सिंचाई",
        doHi: ["जड़ के नज़दीक डालो", "सिंचाई करो"],
      },
    ],
    globalWarningsHi: SOURCE_VERIFY_WARNINGS,
  },

  cotton: {
    cropNameHi: "कपास",
    englishName: "Cotton",
    categoryHi: "रेशा फसल",
    totalFertilizerHi: [
      "डीएपी 50 किग्रा / एकड़ (बुवाई)",
      "यूरिया 35 किग्रा / एकड़ (square 35–40 DAS)",
    ],
    stages: [
      {
        stageNumber: 1,
        stageNameHi: "बुवाई",
        timingHi: "बुवाई के समय",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "DAP",
            doseHi: "50 किग्रा / एकड़",
          },
        ],
        pestProtection: [
          {
            kind: "insecticide",
            technical: "Thiamethoxam",
            formulation: "75% SG",
            doseHi: "100 ग्राम — रेत / डीएपी में मिलाकर",
            targetHi: "दीमक / सफेद grub",
          },
        ],
        diseaseProtection: [],
        rootBio: [
          {
            kind: "humic",
            technical: "Humic acid",
            formulation: "granules",
            doseHi: "5 किग्रा / एकड़",
          },
          {
            kind: "mycorrhiza",
            technical: "Mycorrhiza",
            doseHi: "4 किग्रा / एकड़",
          },
        ],
        pgr: [],
        seedTreatment: [],
        foliar: [],
        mixingHi: "Thiamethoxam — सूखी रेत या DAP में मिलाकर furrow",
      },
      {
        stageNumber: 2,
        stageNameHi: "Square अवस्था",
        timingHi: "35–40 DAS",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "35 किग्रा / एकड़",
          },
          {
            kind: "micronutrient",
            technical: "Magnesium sulphate (MgSO4)",
            doseHi: "10 किग्रा / एकड़",
          },
        ],
        pestProtection: [],
        diseaseProtection: [],
        rootBio: [
          {
            kind: "organic",
            technical: "Neem cake",
            doseHi: "25–30 किग्रा / एकड़",
            sourceClaimHi:
              "स्रोत दावा: neem-coated urea जैसी मिट्टी / nitrogen संरक्षण शैली का उल्लेख",
          },
        ],
        pgr: [],
        seedTreatment: [],
        foliar: [],
      },
    ],
    globalWarningsHi: SOURCE_VERIFY_WARNINGS,
  },

  potato: {
    cropNameHi: "आलू",
    englishName: "Potato",
    categoryHi: "सब्जी / कंद",
    totalFertilizerHi: [
      "डीएपी 80, एमओपी 45, सल्फर 5 किग्रा / एकड़ (रोपण)",
      "यूरिया 45, एमओपी 30 किग्रा / एकड़ (earthing 25–30 DAS)",
    ],
    stages: [
      {
        stageNumber: 1,
        stageNameHi: "रोपण",
        timingHi: "कंद रोपण",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "DAP",
            doseHi: "80 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "MOP",
            doseHi: "45 किग्रा / एकड़",
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
            technical: "Fipronil",
            formulation: "0.3% GR",
            doseHi: "10 किग्रा / एकड़",
            noteHi: "या नीचे विकल्प",
            options: [
              {
                kind: "insecticide",
                technical: "Thiamethoxam + Chlorantraniliprole",
                formulation: "1% + 0.5% GR",
                doseHi: "3 किग्रा / एकड़",
                brands: ["Virtako"],
              },
            ],
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
        ],
        pgr: [],
        seedTreatment: [
          {
            kind: "seed_treatment",
            technical: "Pencycuron",
            formulation: "22.9% SC",
            doseHi: "1.5–2 मि.ली / लीटर",
            brands: ["Monceren"],
            waterHi: "1.5–2 ml/L — tuber dip / spray before planting",
          },
        ],
        foliar: [],
        mixingStatus: "separate",
      },
      {
        stageNumber: 2,
        stageNameHi: "Earthing / गंदमी",
        timingHi: "25–30 DAS",
        fertilizers: [
          {
            kind: "fertilizer",
            technical: "Urea",
            doseHi: "45 किग्रा / एकड़",
          },
          {
            kind: "fertilizer",
            technical: "MOP",
            doseHi: "30 किग्रा / एकड़",
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
        foliar: [],
        mixingHi: "पोटाश (MOP) + यूरिया — earthing के समय मिलाकर",
        activityHi: "मिट्टी चढ़ao / earthing",
        fieldDoctorTipHi: "कंद वजन / एक समान size — earthing पर MOP + यूरिया",
      },
    ],
    globalWarningsHi: SOURCE_VERIFY_WARNINGS,
  },
};
