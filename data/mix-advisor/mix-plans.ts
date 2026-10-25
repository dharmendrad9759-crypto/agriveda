/**
 * Curated scientific mix plans for Mix Advisor (दवा मिलाएँ).
 * Farmer reality: Pest + Fungus + Tonic/Sticker tank-mix with ICAR/CIBRC recommendations.
 * Incorporates dynamic W-A-L-E mixing order, multi-medicine tank mix, FRAC/IRAC chemical groups,
 * and strict problem-specific alternative filtering.
 */

import { CROP_PROBLEM_CROPS, type CropProblemItem } from "@/data/crop-curative-problems";
import { CROP_PROBLEM_MEDICINES, type CurativeMedicine } from "@/lib/crops/cropProblemMedicines";

export type GrowthStageId = "vegetative" | "flowering" | "fruiting";

export type FormulationType =
  | "WP"
  | "WG"
  | "WDG"
  | "SG"
  | "SC"
  | "EC"
  | "SL"
  | "SP"
  | "EW"
  | "OD"
  | "FS"
  | "DF"
  | "DC"
  | "OTHER";

export type MedicineCategory = "fungicide" | "insecticide" | "bactericide" | "tonic" | "sticker";

export type MixMedicine = {
  /** Canonical identifier for tank-mix chemistry checks */
  activeId: string;
  /** Primary English Technical Formulation Name (e.g. Azoxystrobin 18.2% + Difenoconazole 11.4% SC) */
  technical: string;
  /** Hindi Commercial/Vernacular Name */
  nameHi: string;
  /** Formulation type code (WP, WG, SG, SC, EC, SL, SP, etc.) */
  formCode: FormulationType;
  /** Display formulation text in Hindi */
  formHi: string;
  /** Primary category */
  category: MedicineCategory;
  /** Category badge text in Hindi */
  kindHi: string;
  /** FRAC or IRAC resistance code (e.g. FRAC 11 + 3, IRAC 28, FRAC M03) */
  fracIracCode?: string;
  /** Chemical group name in Hindi */
  fracIracGroupHi?: string;
  /** Combined dose string */
  doseHi: string;
  /** Specific dose per 1 liter water */
  dosePerLiter?: string;
  /** Specific dose per acre */
  dosePerAcre?: string;
  /** Target problem identifier if auto-recommended */
  targetProblemId?: string;
  /** Target problem Hindi name */
  targetProblemHi?: string;
  /** Primary Hindi brand name if available */
  brandHi?: string;
  /** Commercial market brand examples */
  brands?: string[];
  /** Safety / PHI notes */
  safetyHi?: string;
  /** Whether this is a non-pesticidal adjuvant / sticker */
  isAdjuvant?: boolean;
  /** Level 1 (Initial), Level 2 (Moderate), Level 3 (Advanced/Top Trial) */
  level?: 1 | 2 | 3;
  /** Level badge in Hindi e.g. "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥" */
  levelLabelHi?: string;
  /** Whether marked as top trial performer */
  isTopPerformer?: boolean;
  /** Warning about older chemistry or pest resistance risk */
  resistanceWarning?: string;
  /** Whether the target problem is viral (requires vector insecticide + viricide) */
  isVirusTarget?: boolean;
};

export type DynamicMixStep = {
  stepNo: number;
  letter: "W" | "A" | "L" | "E" | "S";
  titleHi: string;
  descHi: string;
  badgeHi: string;
  items?: string[];
};

export type MixPlan = {
  cropSlug: string;
  problemIds: string[];
  medicines: MixMedicine[];
  alternatives: MixMedicine[];
  safeFallback?: MixMedicine[];
  sticker: MixMedicine;
  includeSticker: boolean;
  waterHi: string;
  nozzleHi: string;
  phiDays: number;
  dynamicSteps: DynamicMixStep[];
  mixStepsHi: string[];
};

export const GROWTH_STAGES: {
  id: GrowthStageId;
  labelHi: string;
  hintHi: string;
}[] = [
  { id: "vegetative", labelHi: "वनस्पति अवस्था", hintHi: "" },
  { id: "flowering", labelHi: "फूल वाली अवस्था", hintHi: "" },
  { id: "fruiting", labelHi: "फल और दाने वाली अवस्था", hintHi: "" },
];

export const SILICONE_STICKER: MixMedicine = {
  activeId: "silicone-sticker",
  technical: "Silicone Super Spreader & Sticker",
  nameHi: "सिलिकॉन सुपर स्प्रेडर स्टिकर",
  formCode: "OTHER",
  formHi: "सुपर स्प्रेडर / चिपको",
  category: "sticker",
  kindHi: "सिलिकॉन स्टिकर",
  fracIracCode: "ADJUVANT",
  fracIracGroupHi: "सिलिकॉन सुपर स्प्रेडर व एक्टिवेटर",
  doseHi: "5–10 मिली प्रति 15L पंप (50 मिली/एकड़)",
  dosePerLiter: "0.3–0.5 मिली / ली. पानी",
  dosePerAcre: "50 मिली / एकड़",
  brands: ["Apsa 80", "Agro Spreader", "Wetcite"],
  safetyHi: "दवा को पत्तों पर समान रूप से फैलाता है और बारिश में धुलने से बचाता है।",
  isAdjuvant: true,
};

// --------------------------------------------------------------------------
// Chemical Group Resolution (FRAC / IRAC Action Committees)
// --------------------------------------------------------------------------

export function getChemicalGroup(
  technical: string,
  category: string
): { fracIracCode: string; fracIracGroupHi: string } {
  const t = technical.toLowerCase();

  // Multi-active combinations
  if (t.includes("azoxystrobin") && t.includes("difenoconazole")) {
    return { fracIracCode: "FRAC 11 + 3", fracIracGroupHi: "स्ट्रोबिलुरिन + ट्राइएज़ोल" };
  }
  if (t.includes("tebuconazole") && t.includes("trifloxystrobin")) {
    return { fracIracCode: "FRAC 3 + 11", fracIracGroupHi: "ट्राइएज़ोल + स्ट्रोबिलुरिन" };
  }
  if (t.includes("metalaxyl") && t.includes("mancozeb")) {
    return { fracIracCode: "FRAC 4 + M03", fracIracGroupHi: "फिनाइलएमाइड + डाइथियोकार्बामेट" };
  }
  if (t.includes("cymoxanil") && t.includes("mancozeb")) {
    return { fracIracCode: "FRAC 27 + M03", fracIracGroupHi: "साइनोएसिटामाइड + डाइथियोकार्बामेट" };
  }
  if (t.includes("famoxadone") && t.includes("cymoxanil")) {
    return { fracIracCode: "FRAC 11 + 27", fracIracGroupHi: "ऑक्साज़ोलिडीनडायोन + साइनोएसिटामाइड" };
  }
  if (t.includes("pyriproxyfen") && t.includes("bifenthrin")) {
    return { fracIracCode: "IRAC 7C + 3A", fracIracGroupHi: "IGR वृद्धि अवरोधक + पाइरेथ्रोइड" };
  }
  if (t.includes("novaluron") && t.includes("emamectin")) {
    return { fracIracCode: "IRAC 15 + 6", fracIracGroupHi: "काइटिन सिंथेसिस + एवरमेक्टिन" };
  }
  if (t.includes("copper") && t.includes("streptocycline")) {
    return { fracIracCode: "FRAC M01 + Bac", fracIracGroupHi: "कॉपर अकार्बनिक + एंटीबायोटिक" };
  }

  // Fungicides (FRAC)
  if (t.includes("mancozeb") || t.includes("propineb") || t.includes("zineb")) {
    return { fracIracCode: "FRAC M03", fracIracGroupHi: "डाइथियोकार्बामेट (संपर्क)" };
  }
  if (t.includes("chlorothalonil")) {
    return { fracIracCode: "FRAC M05", fracIracGroupHi: "क्लोरोनाइट्राइल (सुरक्षात्मक संपर्क)" };
  }
  if (t.includes("copper") || t.includes("कॉपर")) {
    return { fracIracCode: "FRAC M01", fracIracGroupHi: "कॉपर अकार्बनिक (जीवाणु व फफूंदनाशक)" };
  }
  if (t.includes("sulfur") || t.includes("sulphur") || t.includes("सल्फर")) {
    return { fracIracCode: "FRAC M02", fracIracGroupHi: "अकार्बनिक सल्फर (चूर्णिल व माइट)" };
  }
  if (t.includes("dimethomorph") || t.includes("mandipropamid")) {
    return { fracIracCode: "FRAC 40", fracIracGroupHi: "CAA कोशिका भित्ति अवरोधक" };
  }
  if (t.includes("metalaxyl")) {
    return { fracIracCode: "FRAC 4", fracIracGroupHi: "फिनाइलएमाइड (सिस्टेमिक)" };
  }
  if (t.includes("azoxystrobin") || t.includes("pyraclostrobin") || t.includes("trifloxystrobin")) {
    return { fracIracCode: "FRAC 11", fracIracGroupHi: "स्ट्रोबिलुरिन QoI (श्वसन अवरोधक)" };
  }
  if (t.includes("propiconazole") || t.includes("tebuconazole") || t.includes("hexaconazole") || t.includes("difenoconazole")) {
    return { fracIracCode: "FRAC 3", fracIracGroupHi: "ट्राइएज़ोल DMI (सिस्टेमिक)" };
  }
  if (t.includes("carbendazim") || t.includes("thiophanate")) {
    return { fracIracCode: "FRAC 1", fracIracGroupHi: "बेंज़िमिडाज़ोल MBC (सिस्टेमिक)" };
  }
  if (t.includes("validamycin")) {
    return { fracIracCode: "FRAC 26", fracIracGroupHi: "एंटीबायोटिक फफूंदनाशक" };
  }
  if (t.includes("tricyclazole")) {
    return { fracIracCode: "FRAC 16.1", fracIracGroupHi: "मेलेनिन बायोसिंथेसिस अवरोधक (ब्लास्ट)" };
  }
  if (t.includes("isoprothiolane")) {
    return { fracIracCode: "FRAC 6", fracIracGroupHi: "डाइथियोलेन (सिस्टेमिक ब्लास्ट)" };
  }
  if (t.includes("kasugamycin")) {
    return { fracIracCode: "FRAC 24", fracIracGroupHi: "हेक्सोपाइरानोसिल एंटीबायोटिक" };
  }
  if (t.includes("trichoderma") || t.includes("pseudomonas")) {
    return { fracIracCode: "FRAC BM02", fracIracGroupHi: "जैविक मित्र फफूंद (Biological)" };
  }

  // Insecticides (IRAC)
  if (t.includes("emamectin") || t.includes("abamectin")) {
    return { fracIracCode: "IRAC 6", fracIracGroupHi: "एवरमेक्टिन (इल्ली/सुंडी नियंत्रक)" };
  }
  if (t.includes("chlorantraniliprole") || t.includes("flubendiamide") || t.includes("cyantraniliprole")) {
    return { fracIracCode: "IRAC 28", fracIracGroupHi: "डायमाइड (रयानॉडिन रिसेप्टर)" };
  }
  if (t.includes("spinosad") || t.includes("spinetoram")) {
    return { fracIracCode: "IRAC 5", fracIracGroupHi: "स्पिनोसिन (जैविक किण्वन तकनीक)" };
  }
  if (t.includes("thiamethoxam") || t.includes("imidacloprid") || t.includes("acetamiprid") || t.includes("dinotefuran")) {
    return { fracIracCode: "IRAC 4A", fracIracGroupHi: "नियोनिकोटिनोइड (सिस्टेमिक रस चूसक)" };
  }
  if (t.includes("flonicamid")) {
    return { fracIracCode: "IRAC 29", fracIracGroupHi: "कॉर्डोटोनल (भोजन बंद तकनीक)" };
  }
  if (t.includes("fipronil")) {
    return { fracIracCode: "IRAC 2B", fracIracGroupHi: "फेनिलपाइराज़ोल (GABA ब्लॉकर)" };
  }
  if (t.includes("diafenthiuron")) {
    return { fracIracCode: "IRAC 12A", fracIracGroupHi: "माइटोकॉन्ड्रियल एटीपी अवरोधक" };
  }
  if (t.includes("spiromesifen")) {
    return { fracIracCode: "IRAC 23", fracIracGroupHi: "टेट्रोनिक एसिड (माइट/सफेद मक्खी)" };
  }
  if (t.includes("afidopyropen")) {
    return { fracIracCode: "IRAC 9D", fracIracGroupHi: "पायरोपिन (कॉर्डोटोनल मॉड्यूलेटर)" };
  }
  if (t.includes("pymetrozine")) {
    return { fracIracCode: "IRAC 9B", fracIracGroupHi: "पाइरिडीन एजोमेथीन (हॉपर नियंत्रक)" };
  }
  if (t.includes("cartap")) {
    return { fracIracCode: "IRAC 14", fracIracGroupHi: "नेरीस्टॉक्सिन एनालॉग (nAChR ब्लॉकर)" };
  }
  if (t.includes("chlorpyrifos") || t.includes("profenofos") || t.includes("dimethoate") || t.includes("acephate")) {
    return { fracIracCode: "IRAC 1B", fracIracGroupHi: "आर्गेनोफॉस्फेट (तंत्रिका अवरोधक)" };
  }
  if (t.includes("deltamethrin") || t.includes("cypermethrin") || t.includes("lambda")) {
    return { fracIracCode: "IRAC 3A", fracIracGroupHi: "सिंथेटिक पाइरेथ्रोइड" };
  }

  // Tonics / Nutrients
  if (t.includes("seaweed") || t.includes("बायोविटा") || t.includes("सागरिका")) {
    return { fracIracCode: "BIO-STIM", fracIracGroupHi: "प्राकृतिक समुद्री शैवाल बायोस्टिमुलेंट" };
  }
  if (t.includes("amino") || t.includes("इसाबियन")) {
    return { fracIracCode: "AMINO-PGR", fracIracGroupHi: "अमीनो एसिड व पेप्टाइड कॉम्प्लेक्स" };
  }
  if (t.includes("19-19-19") || t.includes("19:19:19") || t.includes("npk")) {
    return { fracIracCode: "FERT-NPK", fracIracGroupHi: "100% पानी में घुलनशील NPK खाद" };
  }
  if (t.includes("gibberellic") || t.includes("ga3")) {
    return { fracIracCode: "PGR-GA3", fracIracGroupHi: "पादप वृद्धि नियंत्रक (PGR)" };
  }
  if (t.includes("boron")) {
    return { fracIracCode: "MICRONUTRIENT", fracIracGroupHi: "सूक्ष्म पोषक तत्व (बोरॉन)" };
  }

  return { fracIracCode: "AGRIVEDA-REC", fracIracGroupHi: "अनुमोदित सक्रिय रसायन" };
}

// --------------------------------------------------------------------------
// Standard ICAR Technicals Library for Manual Addition
// --------------------------------------------------------------------------

export const POPULAR_INSECTICIDES: MixMedicine[] = [
  {
    activeId: "emamectin benzoate",
    technical: "Emamectin Benzoate 5% SG",
    nameHi: "इमामेक्टिन बेंजोएट 5% SG (प्रोक्लेम)",
    formCode: "SG",
    formHi: "5% SG दानेदार",
    category: "insecticide",
    kindHi: "कीटनाशक (इल्ली/सुंडी)",
    fracIracCode: "IRAC 6",
    fracIracGroupHi: "एवरमेक्टिन (इल्ली/सुंडी नियंत्रक)",
    doseHi: "0.5 ग्राम / ली. पानी (80–100 ग्राम प्रति एकड़)",
    dosePerLiter: "0.5 ग्राम / लीटर पानी",
    dosePerAcre: "100 ग्राम / एकड़",
    brands: ["Proclaim (Syngenta)", "Missile", "EM-1"],
    safetyHi: "इल्ली व फल छेदक के लिए सबसे प्रभावी व सुरक्षित; PHI: 3 दिन।",
  },
  {
    activeId: "chlorantraniliprole",
    technical: "Chlorantraniliprole 18.5% SC",
    nameHi: "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन)",
    formCode: "SC",
    formHi: "18.5% SC लिक्विड सस्पेंशन",
    category: "insecticide",
    kindHi: "कीटनाशक (तना/फल छेदक)",
    fracIracCode: "IRAC 28",
    fracIracGroupHi: "डायमाइड (रयानॉडिन रिसेप्टर)",
    doseHi: "0.3 मिली / ली. पानी (60 मिली प्रति एकड़)",
    dosePerLiter: "0.3 मिली / लीटर पानी",
    dosePerAcre: "60 मिली / एकड़",
    brands: ["Coragen (FMC)", "Cover", "Voliam Flexi"],
    safetyHi: "लंबी अवधि (20-25 दिन) का सिस्टेमिक नियंत्रण देता है।",
  },
  {
    activeId: "thiamethoxam",
    technical: "Thiamethoxam 25% WG",
    nameHi: "थियामेथोक्साम 25% WG (अकतारा)",
    formCode: "WG",
    formHi: "25% WG दानेदार",
    category: "insecticide",
    kindHi: "कीटनाशक (रस चूसक कीट)",
    fracIracCode: "IRAC 4A",
    fracIracGroupHi: "नियोनिकोटिनोइड्स (सिस्टेमिक रस चूसक)",
    doseHi: "0.5 ग्राम / ली. पानी (80–100 ग्राम प्रति एकड़)",
    dosePerLiter: "0.5 ग्राम / लीटर पानी",
    dosePerAcre: "100 ग्राम / एकड़",
    brands: ["Actara (Syngenta)", "Areva"],
    safetyHi: "सफेद मक्खी, माहू और एफिड्स के विरुद्ध तेज सिस्टेमिक असर।",
  },
  {
    activeId: "imidacloprid",
    technical: "Imidacloprid 17.8% SL",
    nameHi: "इमिडाक्लोप्रिड 17.8% SL (कॉन्फिडोर)",
    formCode: "SL",
    formHi: "17.8% SL घुलनशील तरल",
    category: "insecticide",
    kindHi: "कीटनाशक (रस चूसक कीट)",
    fracIracCode: "IRAC 4A",
    fracIracGroupHi: "नियोनिकोटिनोइड्स (सिस्टेमिक रस चूसक)",
    doseHi: "0.5 मिली / ली. पानी (60–80 मिली प्रति एकड़)",
    dosePerLiter: "0.5 मिली / लीटर पानी",
    dosePerAcre: "80 मिली / एकड़",
    brands: ["Confidor (Bayer)", "Tatamida", "Victor"],
    safetyHi: "फूल अवस्था में मधुमक्खियों के बचाव हेतु शाम 4 बजे बाद स्प्रे करें।",
  },
  {
    activeId: "flonicamid",
    technical: "Flonicamid 50% WG",
    nameHi: "फ्लोनिकैमिड 50% WG (उलाला)",
    formCode: "WG",
    formHi: "50% WG दानेदार",
    category: "insecticide",
    kindHi: "कीटनाशक (माहू/सफेद मक्खी)",
    fracIracCode: "IRAC 29",
    fracIracGroupHi: "कॉर्डोटोनल (भोजन बंद तकनीक)",
    doseHi: "0.3 ग्राम / ली. पानी (60 ग्राम प्रति एकड़)",
    dosePerLiter: "0.3 ग्राम / लीटर पानी",
    dosePerAcre: "60 ग्राम / एकड़",
    brands: ["Ulala (UPL)"],
    safetyHi: "कीटों के भोजन नली को तुरंत बंद कर देता है, मित्र कीट सुरक्षित रहते हैं।",
  },
  {
    activeId: "fipronil",
    technical: "Fipronil 5% SC",
    nameHi: "फिप्रोनिल 5% SC (रीजेंट)",
    formCode: "SC",
    formHi: "5% SC लिक्विड सस्पेंशन",
    category: "insecticide",
    kindHi: "कीटनाशक (थ्रिप्स/दीमक)",
    fracIracCode: "IRAC 2B",
    fracIracGroupHi: "फेनिलपाइराज़ोल (GABA ब्लॉकर)",
    doseHi: "2 मिली / ली. पानी (400 मिली प्रति एकड़)",
    dosePerLiter: "2 मिली / लीटर पानी",
    dosePerAcre: "400 मिली / एकड़",
    brands: ["Regent (BASF)", "Fax"],
    safetyHi: "थ्रिप्स व चबाने वाले कीटों पर ब्रॉड-स्पेक्ट्रम असर।",
  },
  {
    activeId: "spinosad",
    technical: "Spinosad 45% SC",
    nameHi: "स्पिनोसैड 45% SC (ट्रेसर)",
    formCode: "SC",
    formHi: "45% SC लिक्विड",
    category: "insecticide",
    kindHi: "जैविक कीटनाशक (इल्ली/थ्रिप्स)",
    fracIracCode: "IRAC 5",
    fracIracGroupHi: "स्पिनोसिन (जैविक किण्वन तकनीक)",
    doseHi: "0.35 मिली / ली. पानी (70 मिली प्रति एकड़)",
    dosePerLiter: "0.35 मिली / लीटर पानी",
    dosePerAcre: "70 मिली / एकड़",
    brands: ["Tracer (Corteva)", "Conserve"],
    safetyHi: "पर्यावरण अनुकूल जैविक किण्वन तकनीक; PHI: 3 दिन।",
  },
  {
    activeId: "diafenthiuron",
    technical: "Diafenthiuron 50% WP",
    nameHi: "डायफेंथियूरॉन 50% WP (पेगासस)",
    formCode: "WP",
    formHi: "50% WP घुलनशील पाउडर",
    category: "insecticide",
    kindHi: "कीटनाशक व मकड़ीनाशक",
    fracIracCode: "IRAC 12A",
    fracIracGroupHi: "माइटोकॉन्ड्रियल एटीपी अवरोधक",
    doseHi: "1.25 ग्राम / ली. पानी (250 ग्राम प्रति एकड़)",
    dosePerLiter: "1.25 ग्राम / लीटर पानी",
    dosePerAcre: "250 ग्राम / एकड़",
    brands: ["Pegasus (Syngenta)", "Polar"],
    safetyHi: "सफेद मक्खी, थ्रिप्स व लाल मकड़ी तीनों पर 100% नियंत्रण।",
  },
];

export const POPULAR_FUNGICIDES: MixMedicine[] = [
  {
    activeId: "azoxystrobin+difenoconazole",
    technical: "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
    nameHi: "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
    formCode: "SC",
    formHi: "SC लिक्विड सस्पेंशन",
    category: "fungicide",
    kindHi: "फफूंदनाशक (झुलसा/धब्बा)",
    fracIracCode: "FRAC 11 + 3",
    fracIracGroupHi: "स्ट्रोबिलुरिन + ट्राइएज़ोल",
    doseHi: "1 मिली / ली. पानी (200 मिली प्रति एकड़)",
    dosePerLiter: "1 मिली / लीटर पानी",
    dosePerAcre: "200 मिली / एकड़",
    brands: ["Amistar Top (Syngenta)", "Custodia (Adama)"],
    safetyHi: "सिस्टेमिक + उपचारात्मक दोहरा असर; पत्तों में हरियाली व चमक बढ़ाता है।",
  },
  {
    activeId: "tebuconazole+trifloxystrobin",
    technical: "Tebuconazole 50% + Trifloxystrobin 25% WG",
    nameHi: "टेबुकोनाज़ोल 50% + ट्राइफ्लॉक्सीस्ट्रोबिन 25% WG (नेटिवो)",
    formCode: "WG",
    formHi: "75% WG दानेदार",
    category: "fungicide",
    kindHi: "सिस्टेमिक फफूंदनाशक",
    fracIracCode: "FRAC 3 + 11",
    fracIracGroupHi: "ट्राइएज़ोल + स्ट्रोबिलुरिन",
    doseHi: "0.7 ग्राम / ली. पानी (140 ग्राम प्रति एकड़)",
    dosePerLiter: "0.7 ग्राम / लीटर पानी",
    dosePerAcre: "140 ग्राम / एकड़",
    brands: ["Nativo (Bayer)"],
    safetyHi: "अगेती झुलसा, रतुआ व पाउडरी मिल्ड्यू पर अद्वितीय नियंत्रण।",
  },
  {
    activeId: "metalaxyl+mancozeb",
    technical: "Metalaxyl-M 4% + Mancozeb 64% WP",
    nameHi: "मेटालैक्सिल-एम 4% + मैंकोजेब 64% WP (रिडोमिल गोल्ड)",
    formCode: "WP",
    formHi: "WP घुलनशील पाउडर",
    category: "fungicide",
    kindHi: "फफूंदनाशक (पछेती झुलसा/डाउनी)",
    fracIracCode: "FRAC 4 + M03",
    fracIracGroupHi: "फिनाइलएमाइड + डाइथियोकार्बामेट",
    doseHi: "2 से 2.5 ग्राम / ली. पानी (500 ग्राम प्रति एकड़)",
    dosePerLiter: "2.5 ग्राम / लीटर पानी",
    dosePerAcre: "500 ग्राम / एकड़",
    brands: ["Ridomil Gold MZ (Syngenta)", "Master", "Krilaxyl"],
    safetyHi: "पछेती झुलसा (Late blight) और जड़ सड़न की नंबर-1 विशेषज्ञ दवा।",
  },
  {
    activeId: "mancozeb",
    technical: "Mancozeb 75% WP",
    nameHi: "मैंकोज़ेब 75% WP (डाइथेन एम-45)",
    formCode: "WP",
    formHi: "75% WP पाउडर",
    category: "fungicide",
    kindHi: "संपर्क फफूंदनाशक",
    fracIracCode: "FRAC M03",
    fracIracGroupHi: "डाइथियोकार्बामेट (संपर्क)",
    doseHi: "2.5 ग्राम / ली. पानी (500–600 ग्राम प्रति एकड़)",
    dosePerLiter: "2.5 ग्राम / लीटर पानी",
    dosePerAcre: "500 ग्राम / एकड़",
    brands: ["Dithane M-45 (Corteva)", "Indofil M-45", "Uthane"],
    safetyHi: "सुरक्षात्मक संपर्क दवा; पत्तों पर सुरक्षा कवच बनाती है।",
  },
  {
    activeId: "propiconazole",
    technical: "Propiconazole 25% EC",
    nameHi: "प्रोपिकोनाज़ोल 25% EC (टिल्ट)",
    formCode: "EC",
    formHi: "25% EC इमल्शन तरल",
    category: "fungicide",
    kindHi: "सिस्टेमिक फफूंदनाशक",
    fracIracCode: "FRAC 3",
    fracIracGroupHi: "ट्राइएज़ोल DMI (सिस्टेमिक)",
    doseHi: "1 मिली / ली. पानी (200 मिली प्रति एकड़)",
    dosePerLiter: "1 मिली / लीटर पानी",
    dosePerAcre: "200 मिली / एकड़",
    brands: ["Tilt (Syngenta)", "Bumper (Adama)", "Result"],
    safetyHi: "रतुआ (Rust), पर्ण धब्बा और शीथ ब्लाइट में तुरंत असरकारक।",
  },
  {
    activeId: "hexaconazole",
    technical: "Hexaconazole 5% SC",
    nameHi: "हेक्साकोनाज़ोल 5% SC (कोंटाफ प्लस)",
    formCode: "SC",
    formHi: "5% SC लिक्विड",
    category: "fungicide",
    kindHi: "सिस्टेमिक फफूंदनाशक",
    fracIracCode: "FRAC 3",
    fracIracGroupHi: "ट्राइएज़ोल DMI (सिस्टेमिक)",
    doseHi: "2 मिली / ली. पानी (400 मिली प्रति एकड़)",
    dosePerLiter: "2 मिली / लीटर पानी",
    dosePerAcre: "400 मिली / एकड़",
    brands: ["Contaf Plus (Tata Rallis)", "Sitara"],
    safetyHi: "चूर्णिल फफूंद (Powdery mildew) और शीथ ब्लाइट को रोकता है।",
  },
  {
    activeId: "carbendazim",
    technical: "Carbendazim 50% WP",
    nameHi: "कार्बेन्डाजिम 50% WP (बाविस्टिन)",
    formCode: "WP",
    formHi: "50% WP पाउडर",
    category: "fungicide",
    kindHi: "सिस्टेमिक फफूंदनाशक",
    fracIracCode: "FRAC 1",
    fracIracGroupHi: "बेंज़िमिडाज़ोल MBC (सिस्टेमिक)",
    doseHi: "1 से 1.5 ग्राम / ली. पानी (200–250 ग्राम प्रति एकड़)",
    dosePerLiter: "1.25 ग्राम / लीटर पानी",
    dosePerAcre: "250 ग्राम / एकड़",
    brands: ["Bavistin (Crystal)", "Derosal"],
    safetyHi: "जड़ गलन व मुरझान (Wilt) में ड्रेंचिंग या स्प्रे हेतु उपयोगी।",
  },
  {
    activeId: "copper oxychloride",
    technical: "Copper Oxychloride 50% WP",
    nameHi: "कॉपर ऑक्सीक्लोराइड 50% WP (ब्लाइटॉक्स)",
    formCode: "WP",
    formHi: "50% WP पाउडर",
    category: "fungicide",
    kindHi: "कॉपर फफूंदनाशक/जीवाणुनाशक",
    fracIracCode: "FRAC M01",
    fracIracGroupHi: "कॉपर अकार्बनिक (जीवाणु व फफूंदनाशक)",
    doseHi: "2.5 ग्राम / ली. पानी (500 ग्राम प्रति एकड़)",
    dosePerLiter: "2.5 ग्राम / लीटर पानी",
    dosePerAcre: "500 ग्राम / एकड़",
    brands: ["Blitox 50 (Rallis)", "Blue Copper"],
    safetyHi: "चेतावनी: EC दवाओं या तेल के साथ न मिलाएँ; जीवाणु रोगों पर भी असरदार।",
  },
];

export const POPULAR_TONICS: MixMedicine[] = [
  {
    activeId: "seaweed-extract",
    technical: "Ascophyllum Nodosum Seaweed Extract",
    nameHi: "बायोस्टिमुलेंट समुद्री शैवाल अर्क (सागरिका / बायोविटा)",
    formCode: "SL",
    formHi: "तरल बायोस्टिमुलेंट",
    category: "tonic",
    kindHi: "टॉनिक / बायोस्टिमुलेंट",
    fracIracCode: "BIO-STIM",
    fracIracGroupHi: "प्राकृतिक समुद्री शैवाल बायोस्टिमुलेंट",
    doseHi: "1.5–2 मिली / ली. पानी (250–300 मिली प्रति एकड़)",
    dosePerLiter: "1.5 मिली / लीटर पानी",
    dosePerAcre: "300 मिली / एकड़",
    brands: ["Sagarika (IFFCO)", "Biovita (PI)"],
    safetyHi: "पौधे में नई फुटाव, रोग प्रतिरोधक क्षमता और फल-फूल की चमक बढ़ाता है।",
  },
  {
    activeId: "amino-acid",
    technical: "Hydrolyzed Protein & Amino Acids Complex",
    nameHi: "अमीनो एसिड + सूक्ष्म पोषक तत्व टॉनिक (इसाबियन)",
    formCode: "SL",
    formHi: "तरल टॉनिक",
    category: "tonic",
    kindHi: "टॉनिक (फूल-फल वर्धक)",
    fracIracCode: "AMINO-PGR",
    fracIracGroupHi: "अमीनो एसिड व पेप्टाइड कॉम्प्लेक्स",
    doseHi: "2 मिली / ली. पानी (300–400 मिली प्रति एकड़)",
    dosePerLiter: "2 मिली / लीटर पानी",
    dosePerAcre: "350 मिली / एकड़",
    brands: ["Isabion (Syngenta)", "Fantac Plus"],
    safetyHi: "फूल-फल गिरने से रोकता है और फसल के तनाव को दूर करता है।",
  },
  {
    activeId: "npk-19-19-19",
    technical: "100% Water Soluble NPK 19:19:19",
    nameHi: "घुलनशील खाद NPK 19:19:19",
    formCode: "SP",
    formHi: "घुलनशील क्रिस्टल पाउडर",
    category: "tonic",
    kindHi: "घुलनशील पोषण",
    fracIracCode: "FERT-NPK",
    fracIracGroupHi: "100% पानी में घुलनशील NPK खाद",
    doseHi: "5 ग्राम / ली. पानी (1 किग्रा प्रति एकड़)",
    dosePerLiter: "5 ग्राम / लीटर पानी",
    dosePerAcre: "1 किग्रा / एकड़",
    brands: ["IFFCO 19:19:19", "Mahadhan 19:19:19"],
    safetyHi: "वानस्पतिक बढ़वार के समय पत्तियों पर तुरंत संपूर्ण पोषण देता है।",
  },
];

// --------------------------------------------------------------------------
// Formulation & Category Extraction Helpers
// --------------------------------------------------------------------------

export function extractFormulationCode(text: string): FormulationType {
  const m = String(text || "").match(/\b(SC|EC|WP|WG|WDG|SG|SL|SP|EW|OD|FS|DF|DC|GR)\b/i);
  if (!m) return "OTHER";
  const code = m[1].toUpperCase();
  if (code === "WDG") return "WG";
  return code as FormulationType;
}

function determineCategory(tagHi: string, technical: string): MedicineCategory {
  const t = (technical + " " + tagHi).toLowerCase();
  if (t.includes("स्टिकर") || t.includes("spreader") || t.includes("adjuvant")) return "sticker";
  if (t.includes("टॉनिक") || t.includes("tonic") || t.includes("pgr") || t.includes("npk") || t.includes("seaweed")) return "tonic";
  if (t.includes("जीवाणु") || t.includes("बैक्टीरिया") || t.includes("streptocycline")) return "bactericide";
  if (tagHi.includes("कीट") || tagHi.includes("कीड़ा") || tagHi.includes("माहू") || tagHi.includes("सुंडी") || tagHi.includes("इल्ली") || tagHi.includes("थ्रिप्स") || tagHi.includes("मक्खी") || tagHi.includes("borer") || tagHi.includes("hopper") || tagHi.includes("aphid") || tagHi.includes("whitefly")) {
    return "insecticide";
  }
  return "fungicide";
}

function cleanActiveId(technical: string): string {
  const norm = technical
    .toLowerCase()
    .replace(/\b(sc|ec|wp|wg|wdg|sg|sl|sp|ew|od|fs|df|dc|gr|ds)\b/gi, "")
    .replace(/[0-9.]+%?/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return norm || "approved-technical";
}

/** Clean problem target text to prevent duplicated parentheses */
export function formatCleanProblemTarget(nameHi: string, nameEn?: string): string {
  if (!nameHi) return "";
  const cleanHi = nameHi.trim();
  // If nameHi already contains parentheses (e.g. "तना छेदक (Stem Borer)"), do not add duplicate nameEn
  if (cleanHi.includes("(") && cleanHi.includes(")")) {
    return cleanHi;
  }
  if (nameEn && nameEn.trim()) {
    return `${cleanHi} (${nameEn.trim()})`;
  }
  return cleanHi;
}

/** Convert CurativeMedicine from cropProblemMedicines into MixMedicine */
export function curativeToMixMedicine(
  curative: CurativeMedicine,
  problem: CropProblemItem
): MixMedicine {
  const formCode = extractFormulationCode(curative.technical);
  const isVirus = Boolean(
    problem.isVirus ||
    problem.tagHi.includes("वायरस") ||
    problem.id.includes("ymv") ||
    problem.id.includes("leaf-curl") ||
    problem.id.includes("mosaic")
  );

  let category = determineCategory(problem.tagHi, curative.technical);
  if (isVirus && category === "fungicide") {
    category = "insecticide";
  }

  const activeId = cleanActiveId(curative.technical);
  const { fracIracCode, fracIracGroupHi } = getChemicalGroup(curative.technical, category);

  let kindHi = "फफूंदनाशक (Fungicide)";
  if (isVirus) kindHi = "वेक्टर कीटनाशक + वायरस रोधक";
  else if (category === "insecticide") kindHi = "कीटनाशक (Insecticide)";
  else if (category === "bactericide") kindHi = "जीवाणुनाशक (Bactericide)";
  else if (category === "tonic") kindHi = "पोषक टॉनिक (Tonic)";

  // Strict Formulation Units: Solid -> Gram (g), Liquid -> ML (ml)
  const isSolid = /WP|WG|WDG|DF|SP|SG|GR/i.test(curative.technical || formCode);
  const solidOrLiquidUnit = isSolid ? "ग्राम" : "मिली";

  // Parse doses with accurate fallback and multi-molecule support
  let dosePerLiter = isSolid ? "1.5–2 ग्राम प्रति लीटर पानी" : "1.5–2 मिली प्रति लीटर पानी";
  let dosePerAcre = curative.dosePerAcre || (isSolid ? "250–350 ग्राम प्रति एकड़" : "250–350 मिली प्रति एकड़");

  if (/copper.*strepto/i.test(curative.technical) || /strepto.*copper/i.test(curative.technical)) {
    dosePerLiter = "कॉपर: 2 g/L + स्ट्रेप्टो: 1 g प्रति 10 L पानी";
    dosePerAcre = "350 g + 18 g / एकड़";
  } else if (/kasugamycin.*copper/i.test(curative.technical) || /कासु-बी.*ब्लाइटॉक्स/i.test(curative.nameHi)) {
    dosePerLiter = "कासुगामाइसिन: 2 ml/L + कॉपर: 2 g/L पानी";
    dosePerAcre = "400 ml + 400 g / एकड़";
  } else {
    const literMatch = curative.dose.match(/([0-9.]+(?:\s*(?:से|-)\s*[0-9.]+)?\s*(?:मिली|ग्राम|मि\.ली\.|g|ml)[^,(]*\/[^,(]*लीटर)/i);
    if (literMatch) {
      dosePerLiter = literMatch[1].trim();
    }
    const acreMatch = curative.dose.match(/([0-9.]+(?:\s*(?:से|-)\s*[0-9.]+)?\s*(?:मिली|ग्राम|किग्रा|g|ml|kg)[^,()]*प्रति\s*एकड़)/i);
    if (acreMatch && !curative.dosePerAcre) {
      dosePerAcre = acreMatch[1].trim();
    }
  }

  // Remove any conflicting "मिली/ग्राम" or "ग्राम/मिली"
  dosePerLiter = dosePerLiter.replace(/मिली\/ग्राम|ग्राम\/मिली/g, solidOrLiquidUnit);
  dosePerAcre = dosePerAcre.replace(/मिली\/ग्राम|ग्राम\/मिली/g, solidOrLiquidUnit);

  const cleanHi = curative.nameHi
    ? curative.nameHi
        .replace(/\s*\([^)]*[\u0900-\u097F\w\s/-]+\)\s*$/, "")
        .replace(/\s*\(.*?\)\s*$/, "")
        .replace(/\s*या\s+.*$/, "")
        .trim()
    : "";

  const cleanTech = curative.technical
    ? curative.technical
        .replace(/\s*\([^)]*(?:ml|gm|g)\)\s*/gi, "")
        .replace(/\s*या\s+.*$/, "")
        .trim()
    : curative.technical;

  return {
    activeId,
    technical: cleanTech,
    nameHi: cleanHi || curative.nameHi,
    formCode,
    formHi: `${formCode} फॉर्मूलेशन`,
    category,
    kindHi,
    fracIracCode,
    fracIracGroupHi,
    doseHi: curative.dose,
    dosePerLiter,
    dosePerAcre,
    targetProblemId: problem.id,
    targetProblemHi: formatCleanProblemTarget(problem.nameHi, problem.nameEn),
    brands: curative.brands,
    safetyHi: curative.safety,
    level: curative.level,
    levelLabelHi: curative.levelLabelHi,
    isTopPerformer: curative.isTopPerformer,
    resistanceWarning: curative.resistanceWarning,
    isVirusTarget: isVirus,
  };
}

// --------------------------------------------------------------------------
// Multi-Medicine Chemistry & Compatibility Engine (Traffic Light System)
// --------------------------------------------------------------------------

export type CompatibilityStatus = "safe" | "caution" | "incompatible";

export type TankMixVerdict = {
  status: CompatibilityStatus;
  title: string;
  badgeHi: string;
  messageHi: string;
  badPair?: [MixMedicine, MixMedicine];
  conflictReason?: string;
  remedyHi?: string;
};

/**
 * Scientific pairwise evaluation for up to 4 tank-mix products.
 * Follows ICAR and CIBRC chemical incompatibility matrices:
 * - Copper + EC / Organophosphates = RED (Curdling / Phytotoxicity)
 * - Copper + Sulphur = RED (Severe Scorch)
 * - Sulphur + EC/Oils = RED (Phytotoxicity)
 * - DAP/Phosphates + Zinc Sulphate = RED (Insoluble sludge)
 * - Biologicals + Chemical Fungicides = RED (Bio kill)
 * - Calcium + Sulphate/Phosphate = RED (Gypsum precipitation)
 */
export function evaluateTankMix(medicines: MixMedicine[]): TankMixVerdict {
  const chems = medicines.filter((m) => !m.isAdjuvant);

  if (chems.length <= 1) {
    return {
      status: "safe",
      title: "बिल्कुल सुरक्षित",
      badgeHi: "🟢 100% सुरक्षित (Single Chemical)",
      messageHi: "एकल दवा का छिड़काव पूरी तरह सुरक्षित है। आवश्यकतानुसार सिलिकॉन स्टिकर मिलाएँ।",
    };
  }

  // Check all pairs (i, j)
  for (let i = 0; i < chems.length; i++) {
    for (let j = i + 1; j < chems.length; j++) {
      const a = chems[i];
      const b = chems[j];
      const pairText = `${a.technical} + ${b.technical}`.toLowerCase();

      // 1. Biological Fungus/Bacteria + Chemical Fungicide
      const isBio = (m: MixMedicine) =>
        /trichoderma|pseudomonas|beauveria|bacillus/i.test(m.technical + " " + m.activeId);
      const isChemFungicide = (m: MixMedicine) =>
        m.category === "fungicide" && !isBio(m);

      if ((isBio(a) && isChemFungicide(b)) || (isBio(b) && isChemFungicide(a))) {
        return {
          status: "incompatible",
          title: "खतरा: जैविक मित्र फफूंद नष्ट हो जाएगी!",
          badgeHi: "🔴 असंगत मिश्रण (Biological Kill Risk)",
          messageHi: `खतरा: रासायनिक फफूंदनाशक (${isChemFungicide(a) ? a.nameHi : b.nameHi}) जीवित जैविक जीवाणु/फफूंद (${isBio(a) ? a.nameHi : b.nameHi}) को तुरंत नष्ट कर देता है।`,
          conflictReason: "रासायनिक व जैविक फफूंदनाशक एक साथ निष्प्रभावी हो जाते हैं।",
          remedyHi: "दोनों को 7 से 10 दिन के अंतर पर अलग-अलग इस्तेमाल करें।",
          badPair: [a, b],
        };
      }

      // 2. Copper Oxychloride / Copper Hydroxide / Bordeaux + EC Formulation
      const isCopper = (m: MixMedicine) =>
        /copper|कॉपर|blitox|blue copper|bordeaux|बोर्डो/i.test(m.technical + " " + m.nameHi + " " + m.activeId);
      const isEC = (m: MixMedicine) => m.formCode === "EC" || /ec/i.test(m.technical);

      if ((isCopper(a) && isEC(b)) || (isCopper(b) && isEC(a))) {
        const copperMed = isCopper(a) ? a : b;
        const ecMed = isCopper(a) ? b : a;
        return {
          status: "incompatible",
          title: "❌ यह घोल फट जाएगा / पत्तियां झुलस जाएंगी!",
          badgeHi: "🔴 गंभीर खतरा: घोल फटने व पत्ती झुलसने का डर",
          messageHi: `गंभीर खतरा: यह घोल फट जाएगा और फसल की पत्तियां झुलस जाएंगी! ${copperMed.nameHi} (कॉपर) को ${ecMed.nameHi} (तेल आधारित तरल दवा) के साथ टैंक में कभी न मिलाएँ। घोल तुरंत फटकर दही जैसा हो जाएगा और फसल जल सकती है।`,
          conflictReason: "कॉपर और तेल आधारित तरल दवा आपस में मिलकर घोल फाड़ देते हैं।",
          remedyHi: "कॉपर को केवल पाउडर या सुरक्षित तरल के साथ मिलाएँ, या इस दवा को 3 दिन बाद अलग छिड़कें।",
          badPair: [a, b],
        };
      }

      // 3. Copper + Organophosphates (OP)
      const isOP = (m: MixMedicine) =>
        /chlorpyrifos|profenofos|dimethoate|acephate|malathion|quinalphos/i.test(m.technical + " " + m.activeId);
      if ((isCopper(a) && isOP(b)) || (isCopper(b) && isOP(a))) {
        return {
          status: "incompatible",
          title: "❌ यह घोल फट जाएगा / पत्तियां झुलस जाएंगी!",
          badgeHi: "🔴 गंभीर खतरा: दवा बेअसर व फसल झुलसने का डर",
          messageHi: `खतरा: कॉपर के क्षारीय स्वभाव से कीटनाशक (${isOP(a) ? a.nameHi : b.nameHi}) का असर खत्म हो जाता है, घोल फट सकता है और फसल की पत्तियां झुलस सकती हैं।`,
          conflictReason: "कॉपर और कीटनाशक का मेल दवा को बेअसर कर देता है।",
          remedyHi: "इन दोनों दवाओं का अलग-अलग छिड़काव करें।",
          badPair: [a, b],
        };
      }

      // 4. Copper + Sulphur
      const isSulphur = (m: MixMedicine) =>
        /sulphur|sulfur|सल्फर/i.test(m.technical + " " + m.nameHi + " " + m.activeId);
      if ((isCopper(a) && isSulphur(b)) || (isCopper(b) && isSulphur(a))) {
        return {
          status: "incompatible",
          title: "❌ पत्तियां बुरी तरह जल जाएंगी!",
          badgeHi: "🔴 बहुत खतरनाक: फसल झुलसने का भारी जोखिम",
          messageHi: "खतरा: कॉपर और सल्फर को एक साथ मिलाकर छिड़कने से तेज धूप में फसल की पत्तियां बुरी तरह झुलस जाती हैं। इन्हें कभी साथ न मिलाएं।",
          conflictReason: "कॉपर और सल्फर का मेल पत्तियां जला देता है।",
          remedyHi: "कभी एक साथ न मिलाएँ; दोनों में कम से कम 12 से 15 दिन का अंतर रखें।",
          badPair: [a, b],
        };
      }

      // 5. Sulphur + EC / Oils
      if ((isSulphur(a) && isEC(b)) || (isSulphur(b) && isEC(a))) {
        return {
          status: "incompatible",
          title: "❌ पत्तियां झुलसने का खतरा!",
          badgeHi: "🔴 असंगत: पत्तियां झुलसने का खतरा",
          messageHi: `खतरा: सल्फर को तेल आधारित तरल कीटनाशक (${isEC(a) ? a.nameHi : b.nameHi}) के साथ मिलाने से पत्तों की सुरक्षा परत नष्ट हो जाती है और फसल जल सकती है।`,
          conflictReason: "सल्फर और तेल आधारित दवा का मेल पत्ते जला देता है।",
          remedyHi: "सल्फर के साथ केवल पाउडर (WP/WDG) या सुरक्षित तरल (SC) ही इस्तेमाल करें।",
          badPair: [a, b],
        };
      }

      // 5b. Calcium Nitrate + Sulphates / Phosphates
      const isCalcium = (m: MixMedicine) => /calcium|कैल्शियम|calcium nitrate/i.test(m.technical + " " + m.nameHi);
      const isSulphateOrPhos = (m: MixMedicine) => /sulphate|sulfate|phosphate|सल्फेट|फॉस्फेट|0-52-34|12-61-0|dap/i.test(m.technical + " " + m.nameHi);
      if ((isCalcium(a) && isSulphateOrPhos(b)) || (isCalcium(b) && isSulphateOrPhos(a))) {
        return {
          status: "incompatible",
          title: "❌ घोल फट जाएगा व नोजल जाम हो जाएगा!",
          badgeHi: "🔴 गंभीर खतरा: घोल फटेगा व नोजल जाम होगा",
          messageHi: "खतरा: कैल्शियम और सल्फेट/फॉस्फेट मिलकर सफेद चूने जैसा गाढ़ा थक्का बना देते हैं। घोल तुरंत फट जाता है और स्प्रे पंप का नोजल चोक हो जाता है।",
          conflictReason: "कैल्शियम और सल्फेट/फॉस्फेट अघुलनशील थक्का बना देते हैं।",
          remedyHi: "कैल्शियम नाइट्रेट का हमेशा अलग छिड़काव करें।",
          badPair: [a, b],
        };
      }

      // 6. Zinc + Phosphate / DAP
      const isZinc = (m: MixMedicine) => /zinc|znso4|जिंक/i.test(pairText);
      const isPhos = (m: MixMedicine) => /dap|phosphate|12-61-0|0-52-34/i.test(pairText);
      if (isZinc(a) && isPhos(b)) {
        return {
          status: "incompatible",
          title: "खतरा: अघुलनशील अवक्षेप (सफेद थक्के)!",
          badgeHi: "🔴 खाद बेकार (Insoluble Sludge)",
          messageHi: "खतरा: ज़िंक और फॉस्फेट आपस में मिलकर अघुलनशील ज़िंक फॉस्फेट बना देते हैं। दोनों का पोषण बेकार हो जाता है और नोजल चोक हो जाता है।",
          conflictReason: "Zinc Phosphate precipitation",
          remedyHi: "चिलेटेड Zinc-EDTA का प्रयोग करें या अलग स्प्रे करें।",
          badPair: [a, b],
        };
      }

      // 7. Same Active Ingredient duplication
      if (a.activeId === b.activeId) {
        return {
          status: "incompatible",
          title: "गलती: एक ही अणु दो बार चुना गया है!",
          badgeHi: "🔴 दोहराव (Duplicate Molecule)",
          messageHi: `एक ही रसायन (${a.nameHi}) को दो बार टैंक में मिलाने से ओवरडोज का खतरा होता है। दो अलग समूह के रसायन चुनें।`,
          conflictReason: "Same active ingredient",
          remedyHi: "एक स्लॉट में कोई दूसरा फफूंदनाशक या कीटनाशक चुनें।",
          badPair: [a, b],
        };
      }

      // 8. Multiple EC Caution (EC + EC)
      if (a.formCode === "EC" && b.formCode === "EC") {
        return {
          status: "caution",
          title: "सावधानी: दो EC तेल आधारित दवाएं",
          badgeHi: "🟡 सावधानी (Pre-Mix Jar Test Advised)",
          messageHi: "दो EC (तेल आधारित) दवाओं को मिलाने पर पौधों पर तेल का तनाव बढ़ सकता है। पहले 1 गिलास पानी में चम्मच भर मिलाकर 15 मिनट देखें; अगर घोल साफ रहे तभी टैंकी में डालें।",
          conflictReason: "High solvent load on crop cuticle",
          remedyHi: "स्प्रे सुबह 10 बजे से पहले या शाम 4 बजे के बाद ठंडे मौसम में करें।",
          badPair: [a, b],
        };
      }
    }
  }

  // If no negative interaction found -> 100% Safe Mix!
  return {
    status: "safe",
    title: "बिल्कुल सुरक्षित टैंक-मिक्स (Safe to Tank Mix)",
    badgeHi: "🟢 वैज्ञानिक रूप से सुरक्षित",
    messageHi: "यह संयोजन भौतिक व रासायनिक रूप से पूरी तरह संगत है। आप बेझिझक एक ही टैंकी में मिलाकर छिड़काव कर सकते हैं।",
  };
}

// --------------------------------------------------------------------------
// Dynamic W-A-L-E Mixing Order Generator
// --------------------------------------------------------------------------

export function generateDynamicMixSteps(
  medicines: MixMedicine[],
  includeSticker: boolean
): DynamicMixStep[] {
  const steps: DynamicMixStep[] = [];
  let currentStep = 1;

  // Filter groups
  const powders = medicines.filter(
    (m) => !m.isAdjuvant && ["WP", "WG", "WDG", "SG", "SP", "DF"].includes(m.formCode)
  );
  const suspensions = medicines.filter(
    (m) => !m.isAdjuvant && ["SC", "FS", "CS"].includes(m.formCode)
  );
  const liquids = medicines.filter(
    (m) => !m.isAdjuvant && ["SL", "DC"].includes(m.formCode)
  );
  const emulsions = medicines.filter(
    (m) => !m.isAdjuvant && ["EC", "EW", "OD"].includes(m.formCode)
  );
  const tonics = medicines.filter(
    (m) => !m.isAdjuvant && m.category === "tonic" && !powders.includes(m)
  );

  function getShortLabel(m: MixMedicine): string {
    const tech = m.technical.trim();
    if (tech.toUpperCase().includes(m.formCode.toUpperCase())) {
      return tech;
    }
    return `${tech} (${m.formCode})`;
  }

  // STEP 1: W - Wettable Powders & Granules (Powder in separate bucket)
  if (powders.length > 0) {
    steps.push({
      stepNo: currentStep++,
      letter: "W",
      badgeHi: `चरण ${currentStep - 1} · W (पाउडर व दाने)`,
      titleHi: "अलग बाल्टी में पाउडर/दानेदार दवा घोलें",
      descHi: "5–10L साफ़ पानी में घोलकर गांठें पूरी तरह खत्म कर लें।",
      items: powders.map(getShortLabel),
    });
  }

  // STEP 2: A - Agitation & Half Water Tank
  steps.push({
    stepNo: currentStep++,
    letter: "A",
    badgeHi: `चरण ${currentStep - 1} · A (टैंक आधा भरें)`,
    titleHi: "स्प्रे टैंक में 50% साफ़ पानी भरें",
    descHi: powders.length > 0
      ? "घुला हुआ पाउडर घोल इसमें डालकर डंडे से अच्छी तरह हिलाएँ।"
      : "आधा पानी भरकर घोल की तैयारी करें।",
  });

  // STEP 3: L - Liquid Suspensions (SC, Flowables)
  if (suspensions.length > 0) {
    steps.push({
      stepNo: currentStep++,
      letter: "L",
      badgeHi: `चरण ${currentStep - 1} · L (गाढ़ा सस्पेंशन SC)`,
      titleHi: "गाढ़ी तरल (SC) दवा मिलाएँ",
      descHi: "टंकी में धीरे-धीरे डालते हुए लगातार हिलाते रहें ताकि दवा एकसार मिले।",
      items: suspensions.map(getShortLabel),
    });
  }

  // STEP 4: E - Emulsifiable Concentrates (EC)
  if (emulsions.length > 0) {
    steps.push({
      stepNo: currentStep++,
      letter: "E",
      badgeHi: `चरण ${currentStep - 1} · E (इमल्शन तरल EC)`,
      titleHi: "तेल आधारित (EC) दवा मिलाएँ",
      descHi: "टंकी में डालकर डंडे से 1 मिनट तक अच्छी तरह घोलें।",
      items: emulsions.map(getShortLabel),
    });
  }

  // STEP 5: S - Solutions (SL)
  if (liquids.length > 0) {
    steps.push({
      stepNo: currentStep++,
      letter: "S",
      badgeHi: `चरण ${currentStep - 1} · SL (घुलनशील तरल)`,
      titleHi: "घुलनशील तरल (SL) दवा मिलाएँ",
      descHi: "टंकी में डालकर डंडे से अच्छी तरह एकसार करें।",
      items: liquids.map(getShortLabel),
    });
  }

  // STEP 6: Tonics / Foliar nutrition (if not already handled)
  if (tonics.length > 0) {
    steps.push({
      stepNo: currentStep++,
      letter: "S",
      badgeHi: `चरण ${currentStep - 1} · पोषण/टॉनिक`,
      titleHi: "घुलनशील खाद या टॉनिक मिलाएँ",
      descHi: "पोषक तत्वों को टंकी में डालकर अच्छी तरह मिलाएँ।",
      items: tonics.map((p) => p.technical),
    });
  }

  // STEP 7: Sticker / Super Spreader
  if (includeSticker) {
    steps.push({
      stepNo: currentStep++,
      letter: "S",
      badgeHi: `अंतिम चरण · S (सिलिकॉन स्टिकर/चिपको)`,
      titleHi: "सिलिकॉन स्टिकर मिलाएँ और पानी पूरा करें",
      descHi: "टंकी को ऊपर तक भरकर तुरंत छिड़काव शुरू करें (घोल को 2–3 घंटे से अधिक न रखें)।",
      items: [`सिलिकॉन सुपर स्प्रेडर स्टिकर (${SILICONE_STICKER.doseHi})`],
    });
  }

  return steps;
}

// --------------------------------------------------------------------------
// Problem-Specific Alternatives Resolution
// --------------------------------------------------------------------------

/**
 * Returns strictly the ICAR/CIBRC approved alternatives for the specific disease/pest.
 * Ensures Early Blight only shows Early Blight technicals, Late Blight only Late Blight, etc.
 */
export function getProblemSpecificAlternatives(
  cropSlug: string,
  medicine: MixMedicine
): MixMedicine[] {
  // If targetProblemId is specified, fetch ONLY the curatives for that exact problem!
  if (medicine.targetProblemId) {
    const cropMedsRecord = CROP_PROBLEM_MEDICINES[cropSlug] ?? {};
    const curatives = cropMedsRecord[medicine.targetProblemId];

    if (curatives && curatives.length > 0) {
      const crop = CROP_PROBLEM_CROPS.find((c) => c.slug === cropSlug);
      const problemItem = crop?.problems.find((p) => p.id === medicine.targetProblemId) ?? {
        id: medicine.targetProblemId,
        nameHi: medicine.targetProblemHi || "",
        nameEn: "",
        tagHi: medicine.kindHi,
        image: "",
        stageHi: "",
        whatHi: "",
        whyHi: [],
        cureOrganicHi: [],
        cureChemicalHi: [],
        whenToActHi: "",
        tipHi: "",
      };

      const mappedList = curatives.map((c) => curativeToMixMedicine(c, problemItem));
      // Return the exact technicals in strict 1 -> 2 -> 3 sequence
      return mappedList;
    }
  }

  // Fallback for manually added slots without a target problem
  if (medicine.isVirusTarget) {
    return POPULAR_INSECTICIDES;
  }
  if (medicine.category === "insecticide") {
    return POPULAR_INSECTICIDES;
  }
  if (medicine.category === "fungicide") {
    return POPULAR_FUNGICIDES;
  }
  if (medicine.category === "tonic") {
    return POPULAR_TONICS;
  }

  return [...POPULAR_FUNGICIDES, ...POPULAR_INSECTICIDES];
}

// --------------------------------------------------------------------------
// Broad-Spectrum Agronomic Consolidation Rules
// --------------------------------------------------------------------------

interface BroadSpectrumRule {
  cropSlug: string;
  problemIds: string[];
  medicine: CurativeMedicine;
  combinedTargetHi: string;
  category: MedicineCategory;
}

const BROAD_SPECTRUM_RULES: BroadSpectrumRule[] = [
  // Paddy: Stem Borer + Leaf Folder
  {
    cropSlug: "paddy",
    problemIds: ["stem-borer", "leaf-folder"],
    medicine: {
      nameHi: "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन / बायेगो)",
      technical: "Chlorantraniliprole 18.5% SC",
      dose: "0.3 मिली / लीटर पानी (60 मिली प्रति एकड़)",
      brands: ["Coragen (FMC)", "Vayego (Bayer)"],
      safety: "एक ही ब्रॉड-स्पेक्ट्रम दवा से तना छेदक और पत्ती लपेटक दोनों पर संपूर्ण नियंत्रण।",
      level: 3,
      levelLabelHi: "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
      dosePerAcre: "60 मिली / एकड़",
      isTopPerformer: true,
    },
    combinedTargetHi: "तना छेदक + पत्ती लपेटक",
    category: "insecticide",
  },
  // Paddy: Sheath Blight + Blast
  {
    cropSlug: "paddy",
    problemIds: ["sheath-blight", "blast"],
    medicine: {
      nameHi: "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
      technical: "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
      dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
      brands: ["Amistar Top (Syngenta)"],
      safety: "शीथ ब्लाइट और ब्लास्ट (झोंका) दोनों फफूंद रोगों का एक ही स्प्रे में संपूर्ण खात्मा।",
      level: 3,
      levelLabelHi: "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
      dosePerAcre: "200 मिली / एकड़",
      isTopPerformer: true,
    },
    combinedTargetHi: "शीथ ब्लाइट + ब्लास्ट (झोंका)",
    category: "fungicide",
  },
  // Tomato: Early Blight + Late Blight
  {
    cropSlug: "tomato",
    problemIds: ["early-blight", "late-blight"],
    medicine: {
      nameHi: "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप / कस्टोडिया)",
      technical: "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
      dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
      brands: ["Amistar Top (Syngenta)", "Custodia (Adama)"],
      safety: "अगेती और पछेती दोनों झुलसा रोगों पर ब्रॉड-स्पेक्ट्रम दोहरी मार।",
      level: 3,
      levelLabelHi: "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
      dosePerAcre: "200 मिली / एकड़",
      isTopPerformer: true,
    },
    combinedTargetHi: "अगेती झुलसा + पछेती झुलसा",
    category: "fungicide",
  },
  // Tomato: Leafminer / Whitefly
  {
    cropSlug: "tomato",
    problemIds: ["leaf-miner", "whitefly"],
    medicine: {
      nameHi: "साइएंट्रानिलिप्रोल 10.26% OD (बेनेविया)",
      technical: "Cyantraniliprole 10.26% OD",
      dose: "1.8 मिली / लीटर पानी (360 मिली प्रति एकड़)",
      brands: ["Benevia (FMC)"],
      safety: "पत्ती सुरंगक और सफेद मक्खी दोनों रस चूसक व छेदक कीटों पर अचूक असर।",
      level: 3,
      levelLabelHi: "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
      dosePerAcre: "360 मिली / एकड़",
      isTopPerformer: true,
    },
    combinedTargetHi: "पत्ती सुरंगक + सफेद मक्खी",
    category: "insecticide",
  },
  // Chilli: Thrips + Mites
  {
    cropSlug: "chilli",
    problemIds: ["thrips", "broad-mite"],
    medicine: {
      nameHi: "डायाफेंथियूरॉन 50% WP (पेगासस / पोलो)",
      technical: "Diafenthiuron 50% WP",
      dose: "1.25 ग्राम / लीटर पानी (250 ग्राम प्रति एकड़)",
      brands: ["Pegasus (Syngenta)", "Polo"],
      safety: "थ्रिप्स (माथा बंधना) और माइट्स (पीली मकड़ी) दोनों पर एक साथ ब्रॉड-स्पेक्ट्रम नियंत्रण।",
      level: 3,
      levelLabelHi: "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
      dosePerAcre: "250 ग्राम / एकड़",
      isTopPerformer: true,
    },
    combinedTargetHi: "थ्रिप्स + माइट्स (मकड़ी)",
    category: "insecticide",
  },
  // Wheat: Yellow Rust + Spot Blotch
  {
    cropSlug: "wheat",
    problemIds: ["yellow-rust", "spot-blotch"],
    medicine: {
      nameHi: "प्रोपिकोनाज़ोल 25% EC (टिल्ट / बंपर)",
      technical: "Propiconazole 25% EC",
      dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
      brands: ["Tilt (Syngenta)", "Bumper (Adama)"],
      safety: "पीला रतुआ और पत्ती धब्बा दोनों फफूंद रोगों पर एक साथ संपूर्ण नियंत्रण।",
      level: 2,
      levelLabelHi: "स्तर 2 · मध्यम स्तर",
      dosePerAcre: "200 मिली / एकड़",
    },
    combinedTargetHi: "पीला रतुआ + पत्ती धब्बा",
    category: "fungicide",
  },
];

// --------------------------------------------------------------------------
// Build Complete Mix Plan from Selected Problems
// --------------------------------------------------------------------------

export function buildMixPlanFromProblems(
  cropSlug: string,
  selected: CropProblemItem[]
): MixPlan | null {
  if (!selected.length) return null;

  const cropMedsRecord = CROP_PROBLEM_MEDICINES[cropSlug] ?? {};
  const recommendedMedicines: MixMedicine[] = [];
  const alternativesPool: MixMedicine[] = [];

  const isSameMed = (a: MixMedicine, b: MixMedicine) => {
    if (a.activeId === b.activeId) return true;
    const techA = a.technical.toLowerCase().replace(/[^a-z0-9]/g, "");
    const techB = b.technical.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (techA === techB || (techA.length > 5 && techB.length > 5 && (techA.includes(techB) || techB.includes(techA)))) {
      return true;
    }
    if (a.brands && b.brands && a.brands.some((brA) => b.brands?.some((brB) => brA.toLowerCase() === brB.toLowerCase()))) {
      return true;
    }
    return false;
  };

  const handledProblemIds = new Set<string>();

  // 1. Check Broad-Spectrum Consolidation Rules (Consolidate multiple targets into 1 common molecule)
  for (const rule of BROAD_SPECTRUM_RULES) {
    if (rule.cropSlug === cropSlug) {
      const matchCount = rule.problemIds.filter((id) => selected.some((p) => p.id === id)).length;
      if (matchCount >= 2 && !rule.problemIds.some((id) => handledProblemIds.has(id))) {
        const dummyProb: CropProblemItem = {
          id: rule.problemIds.join("+"),
          nameHi: rule.combinedTargetHi,
          nameEn: "",
          tagHi: rule.category === "insecticide" ? "कीट नियंत्रण" : "फफूंद नियंत्रण",
          image: "",
          stageHi: "",
          whatHi: "",
          whyHi: [],
          cureOrganicHi: [],
          cureChemicalHi: [],
          whenToActHi: "",
          tipHi: "",
        };
        const consolidatedMed = curativeToMixMedicine(rule.medicine, dummyProb);
        consolidatedMed.targetProblemHi = rule.combinedTargetHi;
        recommendedMedicines.push(consolidatedMed);
        rule.problemIds.forEach((id) => handledProblemIds.add(id));
      }
    }
  }

  // 2. For each selected problem, find the authoritative ICAR curative recommendation
  for (const prob of selected) {
    if (handledProblemIds.has(prob.id)) {
      // Add its curatives to alternatives pool so farmer can view/swap
      const curatives = cropMedsRecord[prob.id] ?? [];
      for (const c of curatives) {
        const altMed = curativeToMixMedicine(c, prob);
        if (!alternativesPool.some((a) => isSameMed(a, altMed))) {
          alternativesPool.push(altMed);
        }
      }
      continue;
    }

    const curatives = cropMedsRecord[prob.id];
    if (curatives && curatives.length > 0) {
      // Find the first curative option not yet present in recommendedMedicines
      const nonDuplicateCurative = curatives.find((c) => {
        const med = curativeToMixMedicine(c, prob);
        return !recommendedMedicines.some((m) => isSameMed(m, med));
      });

      if (nonDuplicateCurative) {
        const chosenMed = curativeToMixMedicine(nonDuplicateCurative, prob);
        recommendedMedicines.push(chosenMed);
      } else {
        // The curative already in the tank also controls this problem
        const primaryMed = curativeToMixMedicine(curatives[0], prob);
        const existing = recommendedMedicines.find((m) => isSameMed(m, primaryMed));
        if (existing && existing.targetProblemHi && !existing.targetProblemHi.includes(prob.nameHi)) {
          existing.targetProblemHi = `${existing.targetProblemHi} + ${formatCleanProblemTarget(prob.nameHi)}`;
        }
      }

      // Add all curatives to alternatives pool
      for (const c of curatives) {
        const altMed = curativeToMixMedicine(c, prob);
        if (!alternativesPool.some((a) => isSameMed(a, altMed))) {
          alternativesPool.push(altMed);
        }
      }
    } else {
      // Fallback from curated catalog if no specific match
      const isVirus = Boolean(
        prob.isVirus ||
        prob.tagHi.includes("वायरस") ||
        prob.id.includes("ymv") ||
        prob.id.includes("leaf-curl") ||
        prob.id.includes("mosaic")
      );
      const isPest = isVirus || prob.tagHi.includes("कीट") || prob.tagHi.includes("कीड़ा");
      const pool = isPest ? POPULAR_INSECTICIDES : POPULAR_FUNGICIDES;
      const fallback = pool.find((item) => !recommendedMedicines.some((m) => isSameMed(m, item))) ?? pool[0];
      const withTarget: MixMedicine = {
        ...fallback,
        targetProblemId: prob.id,
        targetProblemHi: formatCleanProblemTarget(prob.nameHi, prob.nameEn),
        isVirusTarget: isVirus,
      };
      if (!recommendedMedicines.some((m) => isSameMed(m, withTarget))) {
        recommendedMedicines.push(withTarget);
      } else {
        const existing = recommendedMedicines.find((m) => isSameMed(m, withTarget));
        if (existing && existing.targetProblemHi && !existing.targetProblemHi.includes(prob.nameHi)) {
          existing.targetProblemHi = `${existing.targetProblemHi} + ${formatCleanProblemTarget(prob.nameHi)}`;
        }
      }
    }
  }

  // Calculate dynamic steps
  const includeSticker = true;
  const dynamicSteps = generateDynamicMixSteps(recommendedMedicines, includeSticker);
  const mixStepsHi = dynamicSteps.map((s) => `${s.titleHi}: ${s.descHi}`);

  // PHI calculation
  const hasLateBlight = selected.some((p) => p.id === "late-blight");
  const phiDays = hasLateBlight ? 10 : 7;

  // Safe fallback if unsafe combo occurs
  const safeFallback = [POPULAR_FUNGICIDES[0], POPULAR_INSECTICIDES[0]];

  return {
    cropSlug,
    problemIds: selected.map((p) => p.id),
    medicines: recommendedMedicines,
    alternatives: alternativesPool,
    safeFallback,
    sticker: SILICONE_STICKER,
    includeSticker,
    waterHi: "150–200 लीटर/एकड़ (10–12 नैपसैक पंप)",
    nozzleHi: "फ्लैट फैन (Flat Fan) या होलो कोन नोजल",
    phiDays,
    dynamicSteps,
    mixStepsHi,
  };
}

export function planWithStickerToggle(plan: MixPlan, include: boolean): MixPlan {
  const dynamicSteps = generateDynamicMixSteps(plan.medicines, include);
  return {
    ...plan,
    includeSticker: include,
    dynamicSteps,
    mixStepsHi: dynamicSteps.map((s) => `${s.titleHi}: ${s.descHi}`),
  };
}

export function tankItems(plan: MixPlan, meds: MixMedicine[]): MixMedicine[] {
  const items = [...meds.filter((m) => !m.isAdjuvant)];
  if (plan.includeSticker) items.push(plan.sticker);
  return items;
}
