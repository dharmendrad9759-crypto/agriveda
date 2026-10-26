/**
 * Fertilizer + Crop Protection Mix-In Field Guide
 * Source-of-truth stage protocols — preserve doses, technicals, stages, warnings.
 * Brands only as market examples (technical preferred in UI).
 */

import { PART1_GUIDES } from "./fertilizerMixinPart1";
import { PART2_GUIDES } from "./fertilizerMixinPart2";
import { PART3_GUIDES } from "./fertilizerMixinPart3";
import { PART4_GUIDES } from "./fertilizerMixinPart4";

export type MixinKind =
  | "fertilizer"
  | "insecticide"
  | "fungicide"
  | "humic"
  | "mycorrhiza"
  | "biostimulant"
  | "pgr"
  | "biofertilizer"
  | "organic"
  | "seed_treatment"
  | "micronutrient"
  | "foliar"
  | "other";

export type MixingStatus =
  | "allowed"
  | "immediate"
  | "separate"
  | "seed_only"
  | "do_not_mix"
  | "validation";

export type MixinInput = {
  kind: MixinKind;
  /** Prefer technical name in UI */
  technical: string;
  formulation?: string;
  doseHi: string;
  /** Market examples only — not promoted as primary */
  brands?: string[];
  purposeHi?: string;
  targetHi?: string;
  warningHi?: string;
  noteHi?: string;
  sourceClaimHi?: string;
  waterHi?: string;
  options?: MixinInput[];
};

export type FertilizerMixinStage = {
  stageNumber: number;
  stageNameHi: string;
  timingHi: string;
  activityHi?: string;
  fertilizers: MixinInput[];
  pestProtection: MixinInput[];
  diseaseProtection: MixinInput[];
  rootBio: MixinInput[];
  pgr: MixinInput[];
  seedTreatment: MixinInput[];
  foliar: MixinInput[];
  applicationHi?: string;
  placementHi?: string;
  moistureHi?: string;
  mixingHi?: string;
  mixingStatus?: MixingStatus;
  warningsHi?: string[];
  doHi?: string[];
  dontHi?: string[];
  fieldDoctorTipHi?: string;
};

export type CropFertilizerMixinGuide = {
  cropNameHi: string;
  englishName: string;
  categoryHi: string;
  totalNutrientsHi?: string[];
  totalFertilizerHi?: string[];
  principlesHi?: string[];
  globalWarningsHi?: string[];
  stages: FertilizerMixinStage[];
};

export const FERT_MIXIN_ALIASES: Record<string, string> = {
  rice: "paddy",
  dhaan: "paddy",
  gram: "chana",
  chickpea: "chana",
  arhar: "pulses",
  tur: "pulses",
  pigeonpea: "pulses",
  groundnut: "moongfali",
  mungfali: "moongfali",
  okra: "bhindi",
  eggplant: "brinjal",
  baingan: "brinjal",
  rai: "mustard",
  cabbage: "cauliflower",
  capsicum: "chilli",
};

/** All source crops — Parts 1–4 merged */
export const FERT_MIXIN_GUIDES: Record<string, CropFertilizerMixinGuide> = {
  ...PART1_GUIDES,
  ...PART2_GUIDES,
  ...PART3_GUIDES,
  ...PART4_GUIDES,
};

export function getCropFertilizerMixinGuide(
  slug: string
): CropFertilizerMixinGuide | null {
  const key =
    FERT_MIXIN_ALIASES[slug.trim().toLowerCase()] ?? slug.trim().toLowerCase();
  return FERT_MIXIN_GUIDES[key] ?? null;
}

export function mixingStatusLabelHi(status?: MixingStatus): string {
  switch (status) {
    case "allowed":
      return "साथ मिला सकते हैं";
    case "immediate":
      return "मिलाकर तुरंत डालो — स्टोर मत करो";
    case "separate":
      return "अलग-अलग डालो";
    case "seed_only":
      return "केवल बीज उपचार";
    case "do_not_mix":
      return "साथ मत मिलाओ";
    case "validation":
      return "लेबल / स्थानीय सलाह जाँचो";
    default:
      return "मिश्रण जाँच जरूरी";
  }
}

export const GLOBAL_MIXING_RULES_HI: {
  titleHi: string;
  pointsHi: string[];
}[] = [
  {
    titleHi: "नियम 1 — यूरिया + दानेदार कीटनाशक",
    pointsHi: [
      "Cartap / Ferterra / Regent जैसी दानेदार दवा यूरिया के साथ सिर्फ डालने से ठीक पहले मिलाओ",
      "1 घंटे के अंदर खेत में डाल दो — घंटों छोड़कर मत रखो",
      "मिश्रण बनाकर स्टोर न करें — तुरंत खेत में डालें",
    ],
  },
  {
    titleHi: "नियम 2 — Trichoderma",
    pointsHi: [
      "Trichoderma को chemical दवा या DAP के साथ सीधे मत मिलाओ",
      "50 किग्रा सड़ी गोबर में मिलाकर छाया में 3 दिन रखो, फिर खेत में डालो",
    ],
  },
  {
    titleHi: "नियम 3 — Humic + DAP",
    pointsHi: [
      "Humic को DAP / फॉस्फोरस खाद के साथ मिलाया जा सकता है",
      "जड़ विकास में मदद के लिए बेसल के समय डालना अच्छा रहता है",
    ],
  },
  {
    titleHi: "नियम 4 — घोलने का सही क्रम (WALES नियम)",
    pointsHi: [
      "1. W (Water & Wettable powder): टंकी को पहले 50–70% साफ़ पानी से भरें और हिलाना (agitation) चालू करें; फिर पाउडर (WP / WDG) को अलग बाल्टी में घोलकर टंकी में डालें।",
      "2. A (Agitate): टंकी को अच्छी तरह हिलाएँ ताकि पाउडर पूरी तरह घुल जाए और नीचे न बैठे।",
      "3. L (Liquid flowables): फिर गाढ़ा लिक्विड (SC / CS / सस्पेंशन) डालें।",
      "4. E (Emulsifiable): फिर तैलीय दवा (EC) डालें।",
      "5. S (Surfactant / Soluble): सबसे अंत में घुलनशील NPK, बोरॉन या सिलिकॉन चिपको (स्प्रेडर) मिलाएँ और बचा हुआ पानी भरकर पूरा करें।",
    ],
  },
  {
    titleHi: "नियम 5 — कॉपर (COC) व सल्फर की मनाही",
    pointsHi: [
      "कॉपर ऑक्सीक्लोराइड (नीला थोथा / COC) को कभी किसी कीटनाशक, यूरिया या टॉनिक के साथ न मिलाएँ — घोल तुरंत फट जाता है।",
      "कैल्शियम नाइट्रेट को किसी भी सल्फेट या फॉस्फेट खाद के साथ मिलाकर स्प्रे न करें।",
    ],
  },
  {
    titleHi: "नियम 6 — खरपतवारनाशी व खाद का 7-दिन का नियम",
    pointsHi: [
      "खरपतवारनाशी दवा के छिड़काव और यूरिया/जिंक के स्प्रे में कम से कम 5 से 7 दिन का अंतर रखें।",
      "दोनों को साथ देने या तुरंत आगे-पीछे डालने से फसल पीली पड़कर बैठ जाती है।",
    ],
  },
  {
    titleHi: "नियम 7 — स्प्रे का सही समय व हवा का रुख",
    pointsHi: [
      "छिड़काव हमेशा सुबह 10 बजे से पहले (ओस सूखने के बाद) या शाम 3:30 बजे के बाद करें।",
      "दोपहर 12 से 3 बजे की तेज़ धूप में कभी स्प्रे न करें — दवा वाष्प बनकर उड़ जाती है और पत्ती जल सकती है।",
    ],
  },
];
